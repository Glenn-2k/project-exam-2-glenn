import { useState, useEffect } from "react";
import { fetchFn } from "../../utilities/http";
import { userUrl } from "../../utilities/constants";

const UserProfile = () => {
  interface User {
    avatar?: {
      url: string;
      alt: string;
    };
    name?: string;
    bio?: string;
  }

  const [user, setUser] = useState<User>({}); // Changed from null to empty object
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const data = await fetchFn({ queryKey: [userUrl, ""] });
        console.log(data);
        setUser(data.data);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-8 flex flex-col items-center">
      <h1 className="text-4xl text-center font-bold mb-4 uppercase">Profile</h1>
      <div className="flex flex-col items-center">
        <img
          src={user.avatar?.url}
          alt={user.avatar?.alt}
          className="w-32 h-32 rounded-full mb-4"
        />
        <h2 className="text-2xl font-bold mb-4">{user.name}</h2>
        <p className="text-lg mb-4">{user.bio}</p>
      </div>
    </div>
  );
};

export default UserProfile;
