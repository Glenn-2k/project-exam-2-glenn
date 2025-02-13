import { useState } from "react";
import VenueCard from "../VenueCard";
import { fetchFn } from "../../utilities/http";
import { baseUrl } from "../../utilities/constants";
import useVenues from "../../assets/hooks/useVenues";
import { ThreeDot } from "react-loading-indicators";
import { FaTimes } from "react-icons/fa";

const VenueList = () => {
  const { venues, loading, error, loadMore, hasMoreVenues } = useVenues(); // Henter ALLE venues
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<typeof venues | null>(
    null
  );
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSearch = async () => {
    setSearchResults(null);
    if (!searchTerm.trim()) {
      return;
    }

    try {
      setSearchLoading(true);
      setSearchError(null);
      const searchUrl = `${baseUrl}holidaze/venues/search?q=${encodeURIComponent(
        searchTerm
      )}&limit=50&sort=created&sortOrder=desc&page=1&_owner=true`;

      const response = await fetchFn({ queryKey: [searchUrl, "search"] });

      if (response?.data) {
        setSearchResults(response.data);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchError("Failed to fetch search results.");
    } finally {
      setSearchLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults(null);
  };

  const displayedVenues = searchResults !== null ? searchResults : venues;

  return (
    <div className="p-8 flex flex-col items-center">
      <h1 className="text-4xl text-center font-bold mb-12 uppercase">Venues</h1>
      {error && <div className="text-red-500">Error: {error.message}</div>}

      <div className="flex items-center gap-2 mb-10 ">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search venues..."
            className="border p-2 rounded w-64 "
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          {searchTerm && (
            <FaTimes
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer hover:text-gray-700"
              onClick={clearSearch}
              aria-label="Clear search"
            />
          )}
        </div>
        <button
          onClick={handleSearch}
          className="bg-sky-950 hover:bg-sky-800 text-white font-bold py-2 px-4 rounded"
        >
          Search
        </button>
      </div>

      {searchError && <div className="text-red-500">{searchError}</div>}
      {searchLoading && (
        <div className="flex justify-center items-center h-96">
          <ThreeDot
            variant="bounce"
            color="#32cd32"
            size="medium"
            text=""
            textColor=""
          />
        </div>
      )}

      {loading && !searchResults ? (
        <div className="flex justify-center items-center h-96">
          <ThreeDot variant="bounce" color="#32cd32" size="medium" />
        </div>
      ) : displayedVenues.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedVenues.map((venue, index) => (
            <VenueCard key={`${venue.id}-${index}`} {...venue} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">No venues found.</p>
      )}

      {!searchResults && hasMoreVenues && !loading && (
        <button
          onClick={loadMore}
          className="bg-sky-950 hover:bg-sky-800 text-white font-bold py-2 px-4 rounded mt-8"
        >
          Load More
        </button>
      )}
    </div>
  );
};

export default VenueList;
