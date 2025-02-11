import { useNavigate, useParams } from "react-router-dom";
import { useVenues } from "../../assets/hooks/useVenues";
import { Venue } from "../../Types/venues.t";
import VenueFeatures from "../../utilities/amenities";
import StarRating from "../../utilities/StarRating";
import BookingForm from "../BookingForm";
import { UserProfileResponse } from "../../Types/profiles.t";
import { baseUrl } from "../../utilities/constants";
import { fetchFn } from "../../utilities/http";
import { useQuery } from "@tanstack/react-query";
import useDeleteVenue from "../../utilities/deleteVenue";
import VenueCarousel from "../../utilities/imageCarousel";

const SpecificVenue = () => {
  const { id } = useParams(); // Henter ID fra URL
  const navigate = useNavigate(); // Hook for navigation
  const { venues, loading, error } = useVenues(); // Fetcher venues fra API
  const deleteVenueMutation = useDeleteVenue();

  // Finn det spesifikke venue ved hjelp av id
  const venue: Venue | undefined = venues?.find(
    (venue: Venue) => venue.id === id
  );

  const storedUserData = localStorage.getItem("user");
  const token = localStorage.getItem("token");

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

  const profile = profileResponse?.data;
  const isOwner = venue?.owner?.name === profile?.name;

  if (profileLoading) return <div>Loading profile...</div>;
  if (profileError)
    return <div>Error fetching profile: {profileError.message}</div>;
  if (!venue) return <div>Venue not found</div>;
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="bg-gray-200 p-4 max-w-md sm:max-w-xl md:max-w-3xl mx-auto  rounded-lg">
      <VenueCarousel images={venue.media} />

      <h1 className="text-2xl font-bold mb-2 text-center">{venue.name}</h1>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <StarRating key={venue.id} rating={venue.rating} />
        </div>
        <p className="text-lg font-bold">${venue.price}/night</p>
      </div>

      <section className="pb-6 border-b-2 border-b-gray-300">
        <h2 className="text-lg font-semibold mb-2">Information</h2>
        <p>{venue.description || "No description available."}</p>
        <p className="mt-2 text-md font-semibold">
          Max Guests: {venue.maxGuests || "N/A"}
        </p>
      </section>

      <section className="mb-4 pt-6 pb-6 border-b-2 border-b-gray-300">
        <h2 className="text-lg font-semibold mb-2">Amenities</h2>
        <VenueFeatures venue={venue} />
      </section>

      <section className="mb-4 pb-6 border-b-2 border-b-gray-300">
        <h2 className="text-lg font-semibold mb-2">Location</h2>
        <p>{venue.location?.address || "Address not available"}</p>
        <p>{venue.location?.city || "City not available"}</p>
        <p>{venue.location?.country || "Country not available"}</p>
      </section>

      <section className="mt-6">
        {profile?.venueManager && isOwner ? (
          <>
            <h2 className="text-lg text-center font-semibold mb-2">
              Manage Venue
            </h2>
            <div className="flex justify-around items-center my-6">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md"
                onClick={() => deleteVenueMutation.mutate(venue.id)}
              >
                Delete Venue
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                onClick={() => navigate("/updatevenue")}
              >
                Update Venue
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className=" text-lg font-semibold mb-2">Book Venue</h2>
            {token ? (
              <div className="flex justify-center mt-6">
                <BookingForm venueId={venue.id} />
              </div>
            ) : (
              <p className="text-center my-6 ">
                Please{" "}
                <span
                  onClick={() => navigate("/login")}
                  className="cursor-pointer text-sky-950 underline"
                >
                  log in
                </span>{" "}
                to book this venue.
              </p>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default SpecificVenue;
