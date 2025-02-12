import { useState, useEffect, useCallback } from "react";
import { venuesUrl } from "../../utilities/constants";
import { fetchFn } from "../../utilities/http";
import * as VenueTypes from "../../Types/venues.t";

const useVenues = () => {
  const [venues, setVenues] = useState<VenueTypes.Venue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(1);
  const [hasMoreVenues, setHasMoreVenues] = useState(true);

  const sortOrder = "desc";
  const sort = "created";
  const limit = 100;

  const fetchVenues = useCallback(async () => {
    try {
      setLoading(true);

      const url = `${venuesUrl}?limit=${limit}&sort=${sort}&sortOrder=${sortOrder}&page=${page}&_owner=true`;
      console.log("Fetching URL:", url);

      const response = await fetchFn({ queryKey: [url, "venues"] });
      console.log("API Response:", response);

      if (!response?.data) {
        throw new Error("Invalid API response: Data is missing");
      }

      // Unngå duplikater
      setVenues((prevVenues) => {
        const newVenues = response.data.filter(
          (venue: VenueTypes.Venue) =>
            !prevVenues.some((v) => v.id === venue.id)
        );
        return [...prevVenues, ...newVenues];
      });

      if (response.data.length < limit) {
        setHasMoreVenues(false);
      }
    } catch (err) {
      console.error("Error fetching venues:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchVenues();
  }, [fetchVenues]);

  const loadMore = () => {
    if (hasMoreVenues) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return { venues, loading, error, loadMore, hasMoreVenues };
};

export default useVenues;
