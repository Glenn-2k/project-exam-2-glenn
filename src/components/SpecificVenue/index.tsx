import { useParams } from "react-router-dom";
import { useVenues } from "../../assets/hooks/useVenues";
import { Venue } from "../../Types/venues.t";

const SpecificVenue = () => {
  const { id } = useParams(); // Henter ID fra URL
  const { data: venues, isLoading, error } = useVenues(); // Fetcher venues fra API

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // Finn det spesifikke venue ved hjelp av id
  const venue: Venue | undefined = venues?.data.find(
    (venue: Venue) => venue.id === id
  );

  if (!venue) return <div>Venue not found</div>;

  return (
    <div className="bg-gray-200 p-4 max-w-md sm:max-w-xl md:max-w-3xl mx-auto  rounded-lg">
      {/* Bilde */}
      <img
        src={venue.media?.[0]?.url || "https://via.placeholder.com/300"}
        alt={venue.name}
        className="w-full h-64 object-cover rounded-md mb-4"
      />

      <h1 className="text-2xl font-bold mb-2 text-center">{venue.name}</h1>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          {[...Array(5)].map((_, index) => (
            <span
              key={index}
              className={`${
                index < venue.rating ? "text-yellow-500" : "text-gray-300"
              }`}
            >
              ★
            </span>
          ))}
        </div>
        <p className="text-lg font-bold">${venue.price}/night</p>
      </div>

      {/* Informasjon */}
      <section className="pb-6 border-b-2 border-b-gray-300">
        <h2 className="text-lg font-semibold mb-2">Information</h2>
        <p>{venue.description || "No description available."}</p>
        <p className="mt-2">Max Guests: {venue.maxGuests || "N/A"}</p>
      </section>

      {/* Fasiliteter */}
      <section className="mb-4 pt-6 pb-6 border-b-2 border-b-gray-300">
        <h2 className="text-lg font-semibold mb-2">Facilities</h2>
        <ul className="list-disc list-inside text-gray-700">
          <li>Breakfast: {venue.meta?.breakfast ? "Yes" : "No"}</li>
          <li>Parking: {venue.meta?.parking ? "Yes" : "No"}</li>
          <li>Pets: {venue.meta?.pets ? "Yes" : "No"}</li>
          <li>WiFi: {venue.meta?.wifi ? "Yes" : "No"}</li>
        </ul>
      </section>

      {/* Lokasjon */}
      <section className="mb-4 pb-6 border-b-2 border-b-gray-300">
        <h2 className="text-lg font-semibold mb-2">Location</h2>
        <p>{venue.location?.address || "Address not available"}</p>
        <p>{venue.location?.city || "City not available"}</p>
        <p>{venue.location?.country || "Country not available"}</p>
      </section>

      {/* Bookingseksjon */}
      <section className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Book Venue</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Select Dates</label>
          <input
            type="date"
            className="w-full border rounded p-2 text-gray-700"
          />
        </div>
        <div className="flex items-center mb-4">
          <label className="block text-gray-700 mr-2">Guests:</label>
          <input
            type="number"
            min="1"
            max={venue.maxGuests || 1}
            defaultValue="1"
            className="w-16 border rounded p-2 text-gray-700"
          />
        </div>
        <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          Book Now
        </button>
      </section>
    </div>
  );
};

export default SpecificVenue;
