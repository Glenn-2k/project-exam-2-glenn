import { useParams } from "react-router-dom";
import { useVenues } from "../../assets/hooks/useVenues";
import { Venue } from "../../Types/venues.t";
import VenueFeatures from "../../utilities/amenities";
import StarRating from "../../utilities/StarRating";
import BookingForm from "../BookingForm";

const SpecificVenue = () => {
  const { id } = useParams(); // Henter ID fra URL
  const { venues, loading, error } = useVenues(); // Fetcher venues fra API

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // Finn det spesifikke venue ved hjelp av id
  const venue: Venue | undefined = venues?.find(
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
          <StarRating key={venue.id} rating={venue.rating} />
        </div>
        <p className="text-lg font-bold">${venue.price}/night</p>
      </div>

      {/* Informasjon */}
      <section className="pb-6 border-b-2 border-b-gray-300">
        <h2 className="text-lg font-semibold mb-2">Information</h2>
        <p>{venue.description || "No description available."}</p>
        <p className="mt-2 text-md font-semibold">
          Max Guests: {venue.maxGuests || "N/A"}
        </p>
      </section>

      {/* Fasiliteter */}
      <section className="mb-4 pt-6 pb-6 border-b-2 border-b-gray-300">
        <h2 className="text-lg font-semibold mb-2">Amenities</h2>
        <VenueFeatures venue={venue} />
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
        <BookingForm venueId={venue.id} />
      </section>
    </div>
  );
};

export default SpecificVenue;
