import { useState } from "react";
import { putFn } from "./http";
import { userUrl } from "./constants";
import { loadLocal } from "./localStorage";

interface VenueManagerToggleProps {
  userName: string;
  venueManager: boolean;
}

const VenueManagerToggle: React.FC<VenueManagerToggleProps> = ({
  userName,
  venueManager,
}) => {
  const [isVenueManager, setIsVenueManager] = useState(venueManager);

  const toggleVenueManager = async () => {
    const token = loadLocal("token"); // Henter token fra localStorage

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
    } catch (error) {
      console.error("Error toggling venue manager status:", error);
    }
  };

  return (
    <div>
      <button onClick={toggleVenueManager}>
        {isVenueManager ? "Disable" : "Enable"} venue manager
      </button>
    </div>
  );
};

export default VenueManagerToggle;
