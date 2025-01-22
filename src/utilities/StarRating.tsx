import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
}: StarRatingProps) => {
  const filledStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = maxRating - filledStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center">
      {/* Hele stjerner */}
      {Array(filledStars)
        .fill(0)
        .map((_, index) => (
          <FaStar key={`filled-${index}`} className="text-yellow-500" />
        ))}

      {/* Halv stjerne */}
      {hasHalfStar && <FaStarHalfAlt className="text-yellow-500" />}

      {/* Tomme stjerner */}
      {Array(emptyStars)
        .fill(0)
        .map((_, index) => (
          <FaRegStar key={`empty-${index}`} className="text-gray-300" />
        ))}
    </div>
  );
};

export default StarRating;
