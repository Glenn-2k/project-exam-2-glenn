import { venuesUrl } from "../../utilities/constants";
import { useState, useEffect } from "react";
import { fetchFn } from "../../utilities/http";
import * as VenueTypes from "../../Types/venues.t";

export const useVenues = (limit: number = 20) => {
  const [venues, setVenues] = useState<VenueTypes.Venue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(1);
  const [hasMoreVenues, setHasMoreVenues] = useState(true);

  const sortOrder = "desc"; // Update according to your API docs
  const sort = "created";

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setLoading(true);

        const url = `${venuesUrl}?limit=${limit}&sort=${sort}&sortOrder=${sortOrder}&page=${page}`;
        console.log("Fetching URL:", url); // Debug the constructed URL

        const response = await fetchFn({ queryKey: [url, "venues"] });
        console.log("API Response:", response); // Debug API response

        if (!response.data) {
          throw new Error("Invalid API response");
        }

        setVenues((prevVenues) => [...prevVenues, ...response.data]);
        if (response.data.length < limit) {
          setHasMoreVenues(false);
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, [page, limit]);

  const loadMore = () => {
    if (hasMoreVenues) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return { venues, loading, error, loadMore, hasMoreVenues };
};
