import { useVenues } from "../../assets/hooks/useVenues";
import VenueCard from "../VenueCard";
import { useState } from "react";

const VenueList = () => {
  const { venues, loading, error, loadMore, hasMoreVenues } = useVenues();
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredVenues = venues.filter((venue) => {
    const name = venue.name || "";
    const description = venue.description || "";
    const city = venue.location?.city || "";
    return (
      searchTerm === "" ||
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="p-8 flex flex-col items-center">
      <h1 className="text-4xl text-center font-bold mb-4 uppercase">Venues</h1>
      <div className="flex items-center justify-between mb-8">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search venues..."
          className="border p-2 rounded mt-2"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredVenues.map((venue, index) => (
          <VenueCard key={`${venue.id}-${index}`} {...venue} />
        ))}
      </div>
      {loading && <div>Loading...</div>}
      <div className="mt-8">
        {hasMoreVenues && !loading && (
          <button
            onClick={loadMore}
            className="bg-sky-950 hover:bg-sky-800 text-white font-bold py-2 px-4 rounded"
          >
            Load More
          </button>
        )}
      </div>
    </div>
  );
};

export default VenueList;
