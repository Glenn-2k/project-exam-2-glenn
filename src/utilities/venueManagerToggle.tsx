import { useState } from "react";
import { putFn } from "./http";
import { userUrl } from "./constants";
import { loadLocal } from "./localStorage";
import { useQueryClient } from "@tanstack/react-query";

interface VenueManagerToggleProps {
  userName: string;
  venueManager: boolean;
}

const VenueManagerToggle: React.FC<VenueManagerToggleProps> = ({
  userName,
  venueManager,
}) => {
  const [isVenueManager, setIsVenueManager] = useState(venueManager);
  const queryClient = useQueryClient();

  const toggleVenueManager = async () => {
    const token = loadLocal("token");

    if (!token) {
      console.error("No authentication token found.");
      return;
    }

    try {
      await putFn({
        url: `${userUrl}${userName}`,
        body: { venueManager: !isVenueManager },
        token,
      });

      setIsVenueManager((prev) => !prev);

      queryClient.setQueryData(
        ["profile", userName],
        (oldData: { data: { venueManager: boolean } } | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: {
              ...oldData.data,
              venueManager: !isVenueManager,
            },
          };
        }
      );
    } catch (error) {
      console.error("Error toggling venue manager status:", error);
    }
  };

  return (
    <button
      onClick={toggleVenueManager}
      className={`w-14 h-6 flex items-center px-1 rounded-full transition-all ${
        isVenueManager ? "bg-green-800" : "bg-red-800"
      }`}
    >
      <div
        className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-all ${
          isVenueManager ? "translate-x-8" : "translate-x-0"
        }`}
      />
    </button>
  );
};

export default VenueManagerToggle;
