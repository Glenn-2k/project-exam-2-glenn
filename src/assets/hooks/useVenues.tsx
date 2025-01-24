import { venuesUrl } from "../../utilities/constants";
import { useQuery } from "@tanstack/react-query";
import { fetchFn } from "../../utilities/http";
import * as VenueTypes from "../../Types/venues.t";

export const useVenues = (sort = "created", sortOrder = "desc") => {
  return useQuery<VenueTypes.VenueResponse>({
    queryKey: [venuesUrl, "venues", { sort, sortOrder }],
    queryFn: () =>
      fetchFn({
        queryKey: [
          `${venuesUrl}?sort=${sort}&sortOrder=${sortOrder}`,
          "venues",
        ],
      }),
  });
};
