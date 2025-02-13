import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { Venue } from "../Types/venues.t";

const VenueFeatures = ({ venue }: { venue: Venue }) => {
  return (
    <ul className="space-y-2">
      <li>
        Breakfast:{" "}
        {venue.meta?.breakfast ? (
          <FaCheckCircle
            className="text-green-500 inline"
            aria-label="Breakfast available"
          />
        ) : (
          <FaTimesCircle
            className="text-red-500 inline"
            aria-label="No breakfast available"
          />
        )}
      </li>
      <li>
        Parking:{" "}
        {venue.meta?.parking ? (
          <FaCheckCircle
            className="text-green-500 inline"
            aria-label="Parking available"
          />
        ) : (
          <FaTimesCircle
            className="text-red-500 inline"
            aria-label="No parking available"
          />
        )}
      </li>
      <li>
        Pets:{" "}
        {venue.meta?.pets ? (
          <FaCheckCircle
            className="text-green-500 inline"
            aria-label="Pets allowed"
          />
        ) : (
          <FaTimesCircle
            className="text-red-500 inline"
            aria-label="No pets allowed"
          />
        )}
      </li>
      <li>
        WiFi:{" "}
        {venue.meta?.wifi ? (
          <FaCheckCircle
            className="text-green-500 inline"
            aria-label="WiFi available"
          />
        ) : (
          <FaTimesCircle
            className="text-red-500 inline"
            aria-label="No WiFi available"
          />
        )}
      </li>
    </ul>
  );
};

export default VenueFeatures;
