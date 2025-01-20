import { venuesUrl } from "../../utilities/constants";
import { useQuery } from "@tanstack/react-query";
import { fetchFn } from "../../utilities/http";
import * as VenueTypes from "../../Types/venues.t";

export const useVenues = () => {
  return useQuery<VenueTypes.VenueResponse>({
    queryKey: [venuesUrl, "venues"],
    queryFn: () => fetchFn({ queryKey: [venuesUrl, "venues"] }),
  });
};
