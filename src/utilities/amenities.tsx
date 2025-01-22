import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { Venue } from "../Types/venues.t";

const VenueFeatures = ({ venue }: { venue: Venue }) => {
  return (
    <ul>
      <li>
        Breakfast:{" "}
        {venue.meta?.breakfast ? (
          <FaCheckCircle className="text-green-500 inline" />
        ) : (
          <FaTimesCircle className="text-red-500 inline" />
        )}
      </li>
      <li>
        Parking:{" "}
        {venue.meta?.parking ? (
          <FaCheckCircle className="text-green-500 inline" />
        ) : (
          <FaTimesCircle className="text-red-500 inline" />
        )}
      </li>
      <li>
        Pets:{" "}
        {venue.meta?.pets ? (
          <FaCheckCircle className="text-green-500 inline" />
        ) : (
          <FaTimesCircle className="text-red-500 inline" />
        )}
      </li>
      <li>
        WiFi:{" "}
        {venue.meta?.wifi ? (
          <FaCheckCircle className="text-green-500 inline" />
        ) : (
          <FaTimesCircle className="text-red-500 inline" />
        )}
      </li>
    </ul>
  );
};

export default VenueFeatures;
