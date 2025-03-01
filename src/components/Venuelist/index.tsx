import { useState } from "react";
import VenueCard from "../VenueCard";
import { fetchFn } from "../../utilities/http";
import { searchUrl } from "../../utilities/constants";
import useVenues from "../../assets/hooks/useVenues";
import { ThreeDot } from "react-loading-indicators";
import { FaTimes } from "react-icons/fa";

/**
 * VenueList Component
 * Displays a list of venues, allows searching, and supports infinite scrolling.
 *
 * @returns {JSX.Element} The VenueList component.
 */
const VenueList = () => {
  const { venues, loading, error, loadMore, hasMoreVenues } = useVenues(); // Henter ALLE venues
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<typeof venues | null>(
    null
  );
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  /**
   * Handles venue search based on user input.
   * Fetches venues that match the search term from the API.
   *
   * @async
   * @function
   * @returns {Promise<void>}
   */
  const handleSearch = async () => {
    setSearchResults(null);
    if (!searchTerm.trim()) {
      return;
    }

    try {
      setSearchLoading(true);
      setSearchError(null);
      const searchString = `${searchUrl}${encodeURIComponent(
        searchTerm
      )}&limit=50&sort=created&sortOrder=desc&page=1&_owner=true`;

      const response = await fetchFn({ queryKey: [searchString, "search"] });

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

  /**
   * Clears the search input and resets search results.
   *
   * @function
   */
  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults(null);
  };

  /**
   * Determines which venues to display.
   * If search results exist, they are shown; otherwise, all venues are displayed.
   *
   * @constant
   * @type {Array}
   */
  const displayedVenues = searchResults !== null ? searchResults : venues;

  return (
    <div className="p-8 flex flex-col items-center">
      <h1 className="text-4xl text-center font-bold mb-12 uppercase">Venues</h1>
      {error && <div className="text-red-500">Error: {error.message}</div>}

      {/* Search Input */}
      <div className="flex items-center gap-2 mb-10 ">
        <div className="relative">
          <label htmlFor="search" className="sr-only">
            Search venues by name
          </label>
          <input
            id="search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search venues..."
            className="border p-2 rounded lg:w-64 w-48 "
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

      {/* Error and Loading States */}
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

      {/* Load More Button */}
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
