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

// Response type for API endpoints returning multiple venues
interface VenueResponse {
  data: Venue[];
}

export type { Venue, Media, VenueMeta, Location, VenueResponse };
