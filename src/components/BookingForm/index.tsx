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
}

interface DateInterval {
  start: Date;
  end: Date;
}

const BookingForm: React.FC<BookingFormProps> = ({ venueId }) => {
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
    refetchOnWindowFocus: true, // Ensures fresh data when the page is revisited
  });

  // Format the dates properly for the DatePicker
  const excludedIntervals = bookedDates.map((interval) => ({
    start: new Date(interval.start.setHours(0, 0, 0, 0)),
    end: new Date(interval.end.setHours(23, 59, 59, 999)),
  }));

  console.log("📢 Received booked dates from API:", bookedDates);
  console.log("🚫 Excluded intervals for DatePicker:", excludedIntervals);

  const handleBooking = async () => {
    if (!dateFrom || !dateTo) {
      setError("Please select both start and end date.");
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
      refetch(); // Fetch new bookings after successful booking
    } catch {
      setError("Failed to make booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Book this Venue</h2>

      {bookingsLoading && (
        <p className="text-gray-500">Loading availability...</p>
      )}

      {/* Start Date */}
      <div className="mb-4">
        <label className="block text-gray-700">Start Date</label>
        <DatePicker
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

      {/* End Date */}
      <div className="mb-4">
        <label className="block text-gray-700">End Date</label>
        <DatePicker
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

      {/* Guests */}
      <div className="mb-4">
        <label className="block text-gray-700">Guests</label>
        <input
          type="number"
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          min={1}
          className="w-full border p-2 rounded"
        />
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Success Message */}
      {success && <p className="text-green-500">Booking successful!</p>}

      {/* Book Now Button */}
      <button
        onClick={handleBooking}
        className="bg-blue-600 text-white font-bold py-2 px-4 rounded w-full disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Processing..." : "Book Now"}
      </button>
    </div>
  );
};

export default BookingForm;
