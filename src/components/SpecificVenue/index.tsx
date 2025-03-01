import { useNavigate, useParams } from "react-router-dom";
import { Venue } from "../../Types/venues.t";
import VenueFeatures from "../../utilities/amenities";
import StarRating from "../../utilities/StarRating";
import BookingForm from "../BookingForm";
import { UserProfileResponse } from "../../Types/profiles.t";
import { userUrl } from "../../utilities/constants";
import { fetchFn } from "../../utilities/http";
import { useQuery } from "@tanstack/react-query";
import useDeleteVenue from "../../utilities/deleteVenue";
import VenueCarousel from "../../utilities/imageCarousel";
import useVenues from "../../assets/hooks/useVenues";
import { ThreeDot } from "react-loading-indicators";

/**
 * Component for displaying details about a specific venue.
 * It fetches venue data and user profile, and allows booking or management.
 *
 * @component
 * @returns {JSX.Element} The rendered SpecificVenue component.
 */
const SpecificVenue = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { venues, loading, error } = useVenues();
  const deleteVenueMutation = useDeleteVenue();

  /**
   * Finds the specific venue from the list of venues.
   * @type {Venue | undefined}
   */
  const venue: Venue | undefined = venues?.find(
    (venue: Venue) => venue.id === id
  );

  const storedUserData = localStorage.getItem("user") || "";
  const token = localStorage.getItem("token") || "";

  let userName = "";
  try {
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);
      userName = parsedData.data?.name;
    }
  } catch (error) {
    console.error("Error parsing user data:", error);
  }

  /**
   * Fetches the user profile data.
   */
  const {
    data: profileResponse,
    isLoading: profileLoading,
    error: profileError,
  } = useQuery<UserProfileResponse>({
    queryKey: ["profile", userName],
    queryFn: async () => {
      if (!userName || !token) {
        throw new Error("User name or token is missing");
      }

      const profileUrl = `${userUrl}${userName}`;
      const response = await fetchFn({
        queryKey: [profileUrl, token],
      });
      return response as UserProfileResponse;
    },
    enabled: Boolean(userName && token),
  });

  const profile = profileResponse?.data;
  const isOwner = venue?.owner?.name === profile?.name;

  if (profileLoading || loading) {
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

  if (profileError)
    return <div>Error fetching profile: {profileError.message}</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!venue) return <div>Venue not found</div>;

  return (
    <div className="bg-gray-200 p-4 max-w-md sm:max-w-xl md:max-w-3xl mx-auto rounded-lg">
      <h1 className="text-2xl tracking-widest font-bold mb-4 mt-4 text-center">
        {venue.name}
      </h1>
      <div className="mb-8">
        <VenueCarousel images={venue.media || []} />
      </div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <p className="uppercase font-semibold mr-1">Hosted by: </p>
          {venue.owner.name}
        </div>
        <div className="block">
          <p className="font-semibold mb-2">${venue.price}/night</p>
          <StarRating key={venue.id} rating={venue.rating} />
        </div>
      </div>

      <section className="pb-6 border-b-2 border-b-gray-300">
        <h2 className="text-lg font-semibold mb-2 underline">Information</h2>
        <p>{venue.description || "No description available."}</p>
        <p className="mt-3 mb-1 text-sm underline font-semibold">
          Max Guests: {venue.maxGuests || "N/A"}
        </p>
      </section>

      <section className="mb-4 pt-6 pb-6 border-b-2 border-b-gray-300">
        <h2 className="text-lg font-semibold mb-2 underline">Amenities</h2>
        <VenueFeatures venue={venue} />
      </section>

      <section className="mb-4 pb-6 border-b-2 border-b-gray-300">
        <h2 className="text-lg font-semibold mb-2 underline">Location</h2>
        <p>{venue.location?.address || "Address not available"}</p>
        <p>{venue.location?.city || "City not available"}</p>
        <p>{venue.location?.country || "Country not available"}</p>
      </section>

      <section className="mt-6">
        {profile?.venueManager && isOwner ? (
          <>
            <h2 className="text-lg text-center font-semibold mb-2 underline">
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
            <h2 className="text-lg font-semibold mb-2 underline">Book Venue</h2>
            {token ? (
              <div className="flex justify-center mt-6">
                <BookingForm venueId={venue.id} maxGuests={venue.maxGuests} />
              </div>
            ) : (
              <p className="text-center my-6">
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
