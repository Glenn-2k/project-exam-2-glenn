import React from "react";
import { Venue } from "../../Types/venues.t";
import { useNavigate } from "react-router-dom";
import StarRating from "../../utilities/StarRating";

const VenueCard: React.FC<Venue> = ({
  name = "Unknown Venue",
  description = "No description available.",
  price = 0,
  media,
  rating = 0,
  id,
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/venues/${id}`);
  };

  const imageUrl =
    media && media.length > 0 ? media[0].url : "https://placehold.co/400";
  const truncateText = (text: string, maxWords: number) => {
    const words = text.split(" ");
    return words.length > maxWords
      ? `${words.slice(0, maxWords).join(" ")}...`
      : text;
  };

  return (
    <div
      className="max-w-sm bg-white shadow-md rounded-lg overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300"
      onClick={handleCardClick}
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
            className="bg-sky-950 text-white px-4 py-2 rounded-md hover:bg-sky-800"
            onClick={handleCardClick}
          >
            Book Now
          </button>
          <span className="text-lg font-semibold">${price}/night</span>
        </div>
      </div>
    </div>
  );
};

export default VenueCard;
