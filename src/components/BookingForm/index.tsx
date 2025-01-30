import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { postFn } from "../../utilities/http"; // Importer funksjonen for API-kall
import { loadLocal } from "../../utilities/localStorage"; // For token
import { createBookingUrl } from "../../utilities/constants"; // URL til bookings-endepunkt

interface BookingFormProps {
  venueId: string; // ID til stedet som skal bookes
}

const BookingForm: React.FC<BookingFormProps> = ({ venueId }) => {
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);
  const [guests, setGuests] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

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
    } catch {
      setError("Failed to make booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Book this Venue</h2>

      {/* Startdato */}
      <div className="mb-4">
        <label className="block text-gray-700">Start Date</label>
        <DatePicker
          selected={dateFrom}
          onChange={(date) => setDateFrom(date)}
          selectsStart
          startDate={dateFrom}
          endDate={dateTo}
          className="w-full border p-2 rounded"
        />
      </div>

      {/* Sluttdato */}
      <div className="mb-4">
        <label className="block text-gray-700">End Date</label>
        <DatePicker
          selected={dateTo}
          onChange={(date) => setDateTo(date)}
          selectsEnd
          startDate={dateFrom}
          endDate={dateTo}
          minDate={dateFrom || new Date()}
          className="w-full border p-2 rounded"
        />
      </div>

      {/* Antall gjester */}
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

      {/* Feilmelding */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Suksessmelding */}
      {success && <p className="text-green-500">Booking successful!</p>}

      {/* Book Now-knapp */}
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
