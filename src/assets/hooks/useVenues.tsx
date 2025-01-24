import { venuesUrl } from "../../utilities/constants";
import { useQuery } from "@tanstack/react-query";
import { fetchFn } from "../../utilities/http";
import * as VenueTypes from "../../Types/venues.t";

export const useVenues = (
  page = 1,
  limit = 100,
  sort = "created",
  sortOrder = "desc"
) => {
  return useQuery<VenueTypes.VenueResponse>({
    queryKey: [venuesUrl, "venues", { sort, sortOrder, page, limit }],
    queryFn: () =>
      fetchFn({
        queryKey: [
          `${venuesUrl}?limit=${limit}&page=${page}&sort=${sort}&sortOrder=${sortOrder}`,
          "venues",
        ],
      }),
    staleTime: 5000,
  });
};
