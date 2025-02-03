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
  const queryClient = useQueryClient(); // ✅ Access React Query cache

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

      setIsVenueManager((prev) => !prev); // ✅ Update local state

      // ✅ Update React Query cache immediately
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
    <div>
      <input
        type="checkbox"
        checked={isVenueManager}
        onChange={toggleVenueManager}
      />
      <label className="ml-2 font-semibold">Become a venue manager</label>
    </div>
  );
};

export default VenueManagerToggle;
