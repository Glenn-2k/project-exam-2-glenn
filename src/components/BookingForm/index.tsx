import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { postFn } from "../../utilities/http";
import { loadLocal } from "../../utilities/localStorage";
import { createBookingUrl } from "../../utilities/constants";
import { fetchBookedDates } from "../../utilities/fetchBookedDates";
import { useQuery } from "@tanstack/react-query";

interface BookingFormProps {
  venueId: string;
  maxGuests: number;
}

interface DateInterval {
  start: Date;
  end: Date;
}

const BookingForm: React.FC<BookingFormProps> = ({ venueId, maxGuests }) => {
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);
  const [guests, setGuests] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const {
    data: bookedDates = [],
    isLoading: bookingsLoading,
    refetch,
  } = useQuery<DateInterval[]>({
    queryKey: ["bookedDates", venueId],
    queryFn: () => fetchBookedDates(venueId),
    refetchOnWindowFocus: true,
  });

  const excludedIntervals = bookedDates.map((interval) => ({
    start: new Date(interval.start.setHours(0, 0, 0, 0)),
    end: new Date(interval.end.setHours(23, 59, 59, 999)),
  }));

  const handleBooking = async () => {
    if (!dateFrom || !dateTo) {
      setError("Please select both start and end date.");
      return;
    }

    if (dateFrom > dateTo) {
      setError("End date must be after start date.");
      return;
    }

    if (guests > maxGuests) {
      setError("Maximum guests allowed is " + maxGuests);
      return;
    }

    const token = loadLocal("token");
    if (!token) {
      setError("You must be logged in to make a booking.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    const bookingData = {
      dateFrom: dateFrom.toISOString(),
      dateTo: dateTo.toISOString(),
      guests,
      venueId,
    };

    try {
      await postFn({
        url: `${createBookingUrl}`,
        body: bookingData,
        token,
      });

      setSuccess(true);
      refetch();
    } catch {
      setError("Failed to make booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md flex flex-col items-center w-full">
      <h2 className="text-xl text-center font-bold mb-4">Book this Venue</h2>

      {bookingsLoading && (
        <p className="text-gray-500">Loading availability...</p>
      )}

      <div className="mb-4 ">
        <label htmlFor="fromDate" className="block text-gray-700">
          Start Date
        </label>
        <DatePicker
          id="fromDate"
          selected={dateFrom}
          onChange={(date) => setDateFrom(date)}
          selectsStart
          minDate={new Date()}
          startDate={dateFrom}
          endDate={dateTo}
          dateFormat="dd/MM/yyyy"
          className="w-full border p-2 rounded"
          excludeDateIntervals={excludedIntervals}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="endDate" className="block text-gray-700">
          End Date
        </label>
        <DatePicker
          id="endDate"
          selected={dateTo}
          onChange={(date) => setDateTo(date)}
          selectsEnd
          startDate={dateFrom}
          endDate={dateTo}
          minDate={dateFrom || new Date()}
          dateFormat="dd/MM/yyyy"
          className="w-full border p-2 rounded"
          excludeDateIntervals={excludedIntervals}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="guestNumber" className="block text-gray-700">
          Guests
        </label>
        <input
          id="guestNumber"
          type="number"
          value={guests}
          onChange={(e) => {
            const value = Number(e.target.value);
            if (value <= maxGuests) {
              setGuests(value);
            } else {
              setError("Maximum guests allowed is " + maxGuests);
            }
          }}
          min={1}
          max-value={maxGuests}
          className="w-full border p-2 rounded"
        />
        <p className="text-sm text-gray-500">Max guests: {maxGuests}</p>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {success && <p className="text-green-500">Booking successful!</p>}

      <button
        onClick={handleBooking}
        className="bg-sky-950 hover:bg-sky-800 text-white font-bold  py-2 px-4 rounded w-1/2 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Processing..." : "Book Now"}
      </button>
    </div>
  );
};

export default BookingForm;
