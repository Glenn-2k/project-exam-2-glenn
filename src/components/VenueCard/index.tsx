import React, { useCallback } from "react";
import { Venue } from "../../Types/venues.t";
import { useNavigate } from "react-router-dom";
import StarRating from "../../utilities/StarRating";

/**
 * Component representing a card displaying venue details.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {string} props.name - The name of the venue.
 * @param {string} props.description - The description of the venue.
 * @param {number} props.price - The price per night for the venue.
 * @param {Array<{ url: string }>} [props.media] - Array of media objects for the venue.
 * @param {number} props.rating - The rating of the venue.
 * @param {string} props.id - The unique identifier of the venue.
 * @returns {JSX.Element} The VenueCard component.
 */
const VenueCard: React.FC<Venue> = ({
  name = "Unknown Venue",
  description = "No description available.",
  price = 0,
  media,
  rating = 0,
  id,
}) => {
  const navigate = useNavigate();

  /**
   * Handles click event for navigating to the specific venue details page.
   */
  const handleCardClick = useCallback(() => {
    navigate(`/venues/${id}`);
  }, [navigate, id]);

  /**
   * Gets the image URL for the venue, falling back to a placeholder if none is available.
   *
   * @type {string}
   */
  const imageUrl =
    media && media.length > 0
      ? media[0].url
      : "https://placehold.co/400x400?text=Missing+Image";

  /**
   * Truncates the text to a maximum number of words.
   *
   * @param {string} text - The text to truncate.
   * @param {number} maxWords - The maximum number of words to allow before truncation.
   * @returns {string} The truncated text with "..." if needed.
   */
  const truncateText = (text: string, maxWords: number): string => {
    const words = text.split(" ");
    return words.length > maxWords
      ? `${words.slice(0, maxWords).join(" ")}...`
      : text;
  };

  return (
    <div
      className="max-w-sm bg-white shadow-md rounded-lg overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
    >
      {/* Image */}
      <img
        src={imageUrl}
        alt={`Image of ${name}`}
        className="h-48 w-full object-cover"
      />

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Name and Rating */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-base sm:text-lg font-semibold">{name}</h2>
          <div className="flex items-center">
            <StarRating key={id} rating={rating} />
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4">
          {truncateText(description, 15)}
        </p>

        {/* Footer */}
        <div className="flex mt-auto justify-between items-center">
          <button
            className="bg-sky-950 text-white uppercase text-sm px-4 py-2 rounded-md hover:bg-sky-800"
            onClick={handleCardClick}
          >
            Book Now
          </button>
          <span className=" font-semibold">${price}/night</span>
        </div>
      </div>
    </div>
  );
};

export default VenueCard;
