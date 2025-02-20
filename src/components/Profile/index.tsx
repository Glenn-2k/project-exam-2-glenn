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
import { ThreeDot } from "react-loading-indicators";

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
      const response = await fetchFn({
        queryKey: [profileUrl, token],
      });
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
      const response = await fetchFn({ queryKey: [bookingsUrl, token] });
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
      if (!token) throw new Error("No authentication token found");
      const response = await fetchFn({ queryKey: [venuesUrl, token] });
      return response as VenueResponse;
    },
    enabled: Boolean(userName && token),
  });

  const venues = VenuesResponse?.data;

  if (profileLoading || bookingsLoading || VenueLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <ThreeDot
          variant="bounce"
          color="#32cd32"
          size="medium"
          text=""
          textColor=""
        />
      </div>
    );
  }

  if (profileError || bookingsError || VenueError) {
    return <div>Error loading data.</div>;
  }

  if (!profile || !bookings) {
    return <div>No data available</div>;
  }

  if (VenueLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <ThreeDot
          variant="bounce"
          color="#32cd32"
          size="medium"
          text=""
          textColor=""
        />
      </div>
    );
  }

  if (VenueError) {
    return <div>Error loading data.</div>;
  }

  return (
    <>
      <div className="w-full max-w-2xl mx-auto mt-8 bg-white rounded-lg shadow-md overflow-hidden">
        <h1 className="text-2xl font-bold text-gray-900 p-6 tracking-wider text-center uppercase">
          Profile
        </h1>
        <div className="p-4 text-center">
          <h1 className="text-xl font-bold text-gray-900">{profile.name}</h1>

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
            {profile.venueManager && (
              <button
                className="bg-sky-950 hover:bg-sky-800 text-white text-xs font-bold py-1.5 px-3 rounded m-4"
                onClick={() => navigate("/createvenue")}
              >
                Create Venue
              </button>
            )}
          </div>

          <div className="mt-4 flex justify-center gap-4 text-sm text-gray-900">
            <p className="text-xl font-semibold">
              Venues: {profile._count.venues}
            </p>
            <p className="text-xl font-semibold">
              Bookings: {profile._count.bookings}
            </p>
          </div>
          <div className="mt-2">
            <p className="font-semibold text-sm text-gray-600">
              Toggle venue manager status
            </p>
            <div className=" flex items-center justify-center  mt-2">
              <VenueManagerToggle
                userName={profile?.name}
                venueManager={profile.venueManager || false}
                aria-label="Toggle venue manager status"
              />
            </div>
          </div>
        </div>
      </div>

      {/* My Bookings  */}
      <section className="w-full max-w-2xl mx-auto mt-8 bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 text-center border-b-2 border-gray-200 pb-2">
          My bookings
        </h2>
        <div className="p-4">
          {bookings.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {bookings.map((booking) => (
                <li
                  key={booking.id}
                  className="py-4 flex items-center cursor-pointer hover:bg-gray-50 hover:shadow-sm transition duration-200"
                  onClick={() => {
                    if (booking.venue?.id) {
                      navigate(`/venues/${booking.venue.id}`);
                    } else {
                      console.error("No venue ID found for booking:", booking);
                    }
                  }}
                >
                  <div className="flex flex-col">
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
                  </div>

                  <div className="hidden sm:flex justify-end flex-grow">
                    {booking.venue.media.length > 0 ? (
                      <img
                        className="h-16 w-24 object-cover rounded-md "
                        src={booking.venue.media[0].url}
                        alt={booking.venue.media[0].alt}
                      />
                    ) : (
                      <img
                        className="h-16 w-24 object-cover rounded-md "
                        src="https://commons.wikimedia.org/wiki/File:No-Image-Placeholder.svg"
                        alt="No image available"
                      />
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center">No bookings found.</p>
          )}
        </div>
      </section>

      {/* My Venues */}
      <section className="w-full max-w-2xl mx-auto mt-8 bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 text-center border-b-2 border-gray-200 pb-2">
          My Venues
        </h2>
        <div className="p-4">
          {venues && venues.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {venues.map((venue) => (
                <li
                  key={venue.id}
                  className="pb-4 flex items-center cursor-pointer hover:bg-gray-50 hover:shadow-sm transition duration-200"
                  onClick={() => navigate(`/venues/${venue.id}`)}
                >
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
                  <div className="hidden sm:flex justify-end flex-grow">
                    {venue.media.map((mediaItem, index) => (
                      <img
                        className="h-16 w-24 object-cover rounded-md"
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
