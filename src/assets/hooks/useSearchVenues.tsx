import { useQuery } from "@tanstack/react-query";
import { fetchFn } from "../../utilities/http";
import { searchUrl } from "../../utilities/constants";
import * as VenueTypes from "../../Types/venues.t";

export const useSearchVenues = (query: string) => {
  return useQuery<VenueTypes.Venue[]>({
    queryKey: ["searchVenues", query], // Korrekt format for queryKey
    queryFn: () =>
      fetchFn({
        queryKey: [searchUrl, query], // queryKey med to elementer
      }),
    enabled: !!query, // Kjører kun når query ikke er tom
    staleTime: 5000, // Cache i 5 sekunder
  });
};
