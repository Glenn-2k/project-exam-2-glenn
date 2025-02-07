import { useState } from "react";
import { useVenues } from "../../assets/hooks/useVenues";
import VenueCard from "../VenueCard";
import { fetchFn } from "../../utilities/http";
import { baseUrl } from "../../utilities/constants";

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

      console.log("Fetching search results from:", searchUrl);

      const response = await fetchFn({ queryKey: [searchUrl, "search"] });
      console.log("Search response:", response);

      if (response?.data) {
        setSearchResults(response.data); // Oppdaterer venues med søk
      } else {
        setSearchResults([]); // Ingen treff
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchError("Failed to fetch search results.");
    } finally {
      setSearchLoading(false);
    }
  };

  // Velger hvilke venues som skal vises: søkeresultatene eller alle venues
  const displayedVenues = searchResults !== null ? searchResults : venues;

  return (
    <div className="p-8 flex flex-col items-center">
      <h1 className="text-4xl text-center font-bold mb-4 uppercase">Venues</h1>
      {error && <div className="text-red-500">Error: {error.message}</div>}

      {/* 🔍 Søkefelt + Knapp */}
      <div className="flex items-center gap-2 mb-8">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search venues..."
          className="border p-2 rounded w-64"
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          onClick={handleSearch}
          className="bg-sky-950 hover:bg-sky-800 text-white font-bold py-2 px-4 rounded"
        >
          Search
        </button>
      </div>

      {/* 🎯 Viser venues basert på søk eller alle */}
      {searchError && <div className="text-red-500">{searchError}</div>}
      {searchLoading && <div>Loading search results...</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {displayedVenues.length > 0 ? (
          displayedVenues.map((venue, index) => (
            <VenueCard key={`${venue.id}-${index}`} {...venue} />
          ))
        ) : (
          <p className="text-gray-500 text-center">No venues found.</p>
        )}
      </div>

      {/* 🔄 Load More-knapp vises kun hvis vi IKKE er i søkemodus */}
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
