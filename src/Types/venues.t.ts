// Media type for venue images
interface Media {
  url: string;
  alt: string;
}

// Meta information about venue amenities
interface VenueMeta {
  wifi: boolean;
  parking: boolean;
  breakfast: boolean;
  pets: boolean;
}

// Location information
interface Location {
  address: string;
  city: string;
  zip: string;
  country: string;
  continent: string;
  lat: number;
  lng: number;
}

// Main Venue interface
interface Venue {
  id: string;
  name: string;
  description: string;
  media: Media[];
  price: number;
  maxGuests: number;
  rating: number;
  created: string;
  updated: string;
  meta: VenueMeta;
  location: Location;
}

interface VenueLocation {
  address?: string;
  city?: string;
  zip?: string;
  country?: string;
  continent?: string;
  lat?: number;
  lng?: number;
}

interface VenueFormData {
  [key: string]: unknown;
  name: string;
  description: string;
  media?: Media[];
  price: number;
  maxGuests: number;
  rating?: number;
  meta?: VenueMeta;
  location?: VenueLocation;
}

// Meta information for pagination
interface PaginationMeta {
  isFirstPage: boolean;
  isLastPage: boolean;
  currentPage: number;
  previousPage: number | null;
  nextPage: number | null;
  pageCount: number;
  totalCount: number;
}

// Response type for API endpoints returning multiple venues
interface VenueResponse {
  data: Venue[];
  meta: PaginationMeta;
}

enum SortOrder {
  Ascending = "asc",
  Descending = "desc",
}

export type { Venue, Media, VenueMeta, Location, VenueResponse, VenueFormData };

export { SortOrder };
