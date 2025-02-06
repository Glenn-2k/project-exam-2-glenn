import { useQuery } from "@tanstack/react-query";
import { fetchFn } from "../../utilities/http";
import { baseUrl, userUrl } from "../../utilities/constants";
import { useNavigate } from "react-router-dom";
import VenueManagerToggle from "../../utilities/venueManagerToggle";
import { FaRegTrashAlt } from "react-icons/fa";
import useDeleteVenue from "../../utilities/deleteVenue";
import { VenueResponse } from "../../Types/venues.t";
import { BookingResponse } from "../../Types/bookings.t";
import { UserProfileResponse } from "../../Types/profiles.t";

// interface UserProfileResponse {
//   data: {
//     name: string;
//     email: string;
//     bio: string;
//     avatar: {
//       url: string;
//       alt: string;
//     } | null;
//     banner: {
//       url: string;
//       alt: string;
//     } | null;
//     venueManager: boolean;
//     _count: {
//       venues: number;
//       bookings: number;
//     };
//   };
//   meta: Record<string, unknown>;
// }

// interface BookingResponse {
//   data: Array<{
//     id: string;
//     dateFrom: string;
//     dateTo: string;
//     guests: number;
//     created: string;
//     updated: string;
//     venue: { name: string };
//   }>;
//   meta: {
//     isFirstPage: boolean;
//     isLastPage: boolean;
//     currentPage: number;
//     previousPage: number | null;
//     nextPage: number | null;
//     pageCount: number;
//     totalCount: number;
//   };
// }

// interface VenueResponse {
//   data: Array<{
//     id: string;
//     name: string;
//     location: string;
//     description: string;
//     price: number;
//     media: Array<{ url: string; alt: string }>;
//     _count: { bookings: number };
//   }>;
//   meta: {
//     isFirstPage: boolean;
//     isLastPage: boolean;
//     currentPage: number;
//     previousPage: number | null;
//     nextPage: number | null;
//     pageCount: number;
//     totalCount: number;
//   };
// }

const UserProfile = () => {
  const deleteVenueMutation = useDeleteVenue();
  const storedUserData = localStorage.getItem("user");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  let userName = "";
  try {
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);
      userName = parsedData.data?.name;
      console.log("Found user name:", userName);
    }
  } catch (error) {
    console.error("Error parsing user data:", error);
  }

  // Fetch user profile
  const {
    data: profileResponse,
    isLoading: profileLoading,
    error: profileError,
  } = useQuery<UserProfileResponse>({
    queryKey: ["profile", userName],
    queryFn: async () => {
      if (!userName) throw new Error("No username found in stored data");
      if (!token) throw new Error("No authentication token found");

      const profileUrl = `${baseUrl}holidaze/profiles/${userName}`;
      console.log("Fetching profile from:", profileUrl);
      const response = await fetchFn({
        queryKey: [profileUrl, token],
      });
      console.log("Profile response:", response);
      return response as UserProfileResponse;
    },
    enabled: Boolean(userName && token),
  });

  // Fetch user bookings
  const {
    data: bookingsResponse,
    isLoading: bookingsLoading,
    error: bookingsError,
  } = useQuery<BookingResponse>({
    queryKey: ["userBookings", userName],
    queryFn: async () => {
      if (!userName) throw new Error("No username found in stored data");
      if (!token) throw new Error("No authentication token found");

      const bookingsUrl = `${baseUrl}holidaze/profiles/${userName}/bookings?_venue=true`;
      console.log("Fetching bookings from:", bookingsUrl);
      const response = await fetchFn({ queryKey: [bookingsUrl, token] });
      console.log("Bookings response:", response);
      return response as BookingResponse;
    },
    enabled: Boolean(userName && token),
  });

  const profile = profileResponse?.data;
  const bookings = bookingsResponse?.data;

  const {
    data: VenuesResponse,
    isLoading: VenueLoading,
    error: VenueError,
  } = useQuery<VenueResponse>({
    queryKey: ["venues"],
    queryFn: async () => {
      const venuesUrl = `${userUrl}${userName}/venues`;
      console.log("Fetching venues from:", venuesUrl);
      if (!token) throw new Error("No authentication token found");
      const response = await fetchFn({ queryKey: [venuesUrl, token] });
      console.log("Venues response:", response);
      return response as VenueResponse;
    },
    enabled: Boolean(userName && token),
  });

  const venues = VenuesResponse?.data;

  if (profileLoading || bookingsLoading || VenueLoading) {
    return <div>Loading...</div>;
  }

  if (profileError || bookingsError || VenueError) {
    return <div>Error loading data.</div>;
  }

  if (!profile || !bookings) {
    return <div>No data available</div>;
  }

  if (VenueLoading) {
    return <div>Loading...</div>;
  }

  if (VenueError) {
    return <div>Error loading data.</div>;
  }

  return (
    <>
      {/* Profile Section */}
      <div className="w-full max-w-2xl mx-auto mt-8 bg-white rounded-lg shadow-md overflow-hidden">
        <h1 className="text-2xl font-bold text-gray-900 p-6 tracking-wider text-center uppercase">
          Profile
        </h1>
        <div className="p-4 text-center">
          <h1 className="text-xl font-bold text-gray-900">{profile.name}</h1>
          {profile.venueManager && (
            <p className=" text-sm text-sky-600">Venue Manager</p>
          )}

          {/* Avatar + Edit Button */}
          <div className="flex flex-col items-center">
            {profile.avatar?.url ? (
              <img
                src={profile.avatar.url}
                alt={profile.avatar.alt || "Profile avatar"}
                className="w-24 h-24 rounded-full object-cover mx-auto mt-4 "
              />
            ) : (
              <div className="w-24 h-24 rounded-full mx-auto mt-4 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No Avatar</span>
              </div>
            )}
            <button
              className="bg-sky-950 hover:bg-sky-800 text-white text-xs font-bold py-1.5 px-3 rounded m-4"
              onClick={() => navigate("/editavatar")}
            >
              Edit Avatar
            </button>
            <div className="mt-2 text-sm text-gray-600">
              <VenueManagerToggle
                userName={profile?.name}
                venueManager={profile.venueManager || false}
              />
            </div>

            {profile.venueManager && (
              <button
                className="bg-sky-950 hover:bg-sky-800 text-white text-xs font-bold py-1.5 px-3 rounded m-4"
                onClick={() => navigate("/createvenue")}
              >
                Create Venue
              </button>
            )}
          </div>

          {/* Added Counts */}
          <div className="mt-4 flex justify-center gap-4 text-sm text-gray-900">
            <p className="text-xl font-semibold">
              Venues: {profile._count.venues}
            </p>
            <p className="text-xl font-semibold">
              Bookings: {profile._count.bookings}
            </p>
          </div>
        </div>
      </div>

      {/* My Bookings Section */}
      <section className="w-full max-w-2xl mx-auto mt-8 bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 text-center border-b-2 border-gray-200 pb-2">
          My bookings
        </h2>
        <div className="p-4">
          {bookings.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {bookings.map((booking) => (
                <li key={booking.id} className="py-4">
                  <p className="font-semibold text-gray-900">
                    {booking.venue?.name || "Unnamed Venue"}
                  </p>
                  <p className="text-gray-600">
                    {new Date(booking.dateFrom).toLocaleDateString()} -{" "}
                    {new Date(booking.dateTo).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Guests: {booking.guests}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center">No bookings found.</p>
          )}
        </div>
      </section>

      <section className="w-full max-w-2xl mx-auto mt-8 bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 text-center border-b-2 border-gray-200 pb-2">
          My Venues
        </h2>
        <div className="p-4">
          {venues && venues.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {venues.map((venue) => (
                <li key={venue.id} className="pb-4 flex items-center">
                  <FaRegTrashAlt
                    className="mr-4 cursor-pointer"
                    onClick={() => deleteVenueMutation.mutate(venue.id)}
                  />

                  <div className="flex flex-col">
                    <p className="font-semibold text-gray-900">{venue.name}</p>
                    <p className="text-gray-600">${venue.price}</p>
                    <p className="text-sm text-gray-500">
                      Bookings: {venue._count.bookings}
                    </p>
                  </div>
                  <div className="flex justify-end flex-grow">
                    {venue.media.map((mediaItem, index) => (
                      <img
                        className="h-16 object-cover rounded-md "
                        key={index}
                        src={
                          mediaItem.url
                            ? mediaItem.url
                            : "https://commons.wikimedia.org/wiki/File:No-Image-Placeholder.svg"
                        }
                        alt={mediaItem.alt}
                      />
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center">No venues found.</p>
          )}
        </div>
      </section>
    </>
  );
};

export default UserProfile;
