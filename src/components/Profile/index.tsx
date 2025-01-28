import { useQuery } from "@tanstack/react-query";
import { fetchFn } from "../../utilities/http";
import { baseUrl } from "../../utilities/constants";

interface ProfileResponse {
  data: {
    name: string;
    email: string;
    bio: string;
    avatar: {
      url: string;
      alt: string;
    };
    banner: {
      url: string;
      alt: string;
    };
    venueManager: boolean;
    _count: {
      venues: number;
      bookings: number;
    };
  };
}

const UserProfile = () => {
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

  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["profile", userName],
    queryFn: async () => {
      if (!userName) {
        throw new Error("No username found in stored data");
      }

      if (!token) {
        throw new Error("No authentication token found");
      }

      const profileUrl = `${baseUrl}holidaze/profiles/${userName}`;
      console.log("Fetching profile from:", profileUrl);

      try {
        const response = await fetchFn({
          queryKey: [profileUrl, token],
        });

        console.log("Profile response:", response);
        return response as ProfileResponse;
      } catch (err) {
        console.error("Profile fetch error:", err);
        throw err;
      }
    },
    enabled: Boolean(userName && token),
  });

  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">
          {error instanceof Error ? (
            <>
              Error loading profile: {error.message}
              <br />
              <span className="text-sm">
                Try logging out and logging back in to refresh your session.
              </span>
            </>
          ) : (
            "An error occurred while loading your profile"
          )}
        </p>
      </div>
    );
  }

  // If we don't have a profile yet and we're not loading/errored, we might have invalid data
  if (!profile) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-700">
          Unable to load profile. Please ensure you're logged in.
        </p>
      </div>
    );
  }

  const userData = profile.data;

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 bg-white rounded-lg shadow-md overflow-hidden">
      {userData.banner?.url && (
        <div className="w-full h-48 bg-gray-100">
          <img
            src={userData.banner.url}
            alt="Profile banner"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-6">
        <div className="flex flex-col items-center space-y-4">
          {/* Avatar */}
          <div className="relative w-24 h-24">
            {userData.avatar?.url ? (
              <img
                src={userData.avatar.url}
                alt={userData.avatar.alt || `${userData.name}'s avatar`}
                className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center border-4 border-white shadow-lg">
                <span className="text-2xl text-gray-600">
                  {userData.name?.charAt(0) || "?"}
                </span>
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              {userData.name}
            </h1>
            <p className="text-gray-500">{userData.email}</p>
          </div>

          {/* Stats */}
          <div className="flex space-x-6 text-center">
            <div>
              <p className="text-2xl font-semibold">{userData._count.venues}</p>
              <p className="text-gray-500">Venues</p>
            </div>
            <div>
              <p className="text-2xl font-semibold">
                {userData._count.bookings}
              </p>
              <p className="text-gray-500">Bookings</p>
            </div>
          </div>

          {/* Bio */}
          {userData.bio && (
            <div className="w-full">
              <p className="text-gray-600 whitespace-pre-wrap text-center">
                {userData.bio}
              </p>
            </div>
          )}

          {/* Venue Manager Badge */}
          {userData.venueManager && (
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              Venue Manager
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
