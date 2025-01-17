export const baseUrl = "https://v2.api.noroff.dev/";
export const registerEndpoint = "auth/register";
export const loginEndpoint = "auth/login";
export const venuesEndpoint = "holidaze/venues";
export const bookingsEndpoint = "holidaze/bookings";
export const userEndpoint = "holidaze/profiles/";

export const queryCustomer = "_customer"; //booking query
export const queryVenue = "_venue"; //booking and profile query
export const queryOwner = "_owner"; //venues query
export const queryBooking = "_bookings"; //venues and profiles query
export const searchQuery = "holidaze/venues/search?q="; //search query

export const registerUrl = baseUrl + registerEndpoint;
export const loginUrl = baseUrl + loginEndpoint;
export const venuesUrl = baseUrl + venuesEndpoint;
export const bookingsUrl = baseUrl + bookingsEndpoint;
export const userUrl = baseUrl + userEndpoint;
export const searchUrl = baseUrl + searchQuery;
export const createVenueUrl = baseUrl + venuesEndpoint;
export const createBookingUrl = baseUrl + bookingsEndpoint;
