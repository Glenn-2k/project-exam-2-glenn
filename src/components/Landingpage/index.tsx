import { useVenues } from "../../assets/hooks/useVenues";
import type * as VenueTypes from "./../../Types/venues.t";

const VenueList = () => {
  const { data, isLoading, error } = useVenues();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      {data?.data.map((venue: VenueTypes.Venue) => (
        <div key={venue.id}>
          <h2>{venue.name}</h2>
          <p>{venue.location.address}</p>
        </div>
      ))}
    </div>
  );
};

export default VenueList;
