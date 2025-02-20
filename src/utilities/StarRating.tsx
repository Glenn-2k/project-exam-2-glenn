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
    <div
      className="flex items-center"
      role="img"
      aria-label={`Rating: ${rating} out of ${maxRating}`}
    >
      {Array(filledStars)
        .fill(0)
        .map((_, index) => (
          <FaStar
            key={`filled-${index}`}
            className="text-yellow-500"
            aria-label="Full star"
          />
        ))}

      {hasHalfStar && (
        <FaStarHalfAlt className="text-yellow-500" aria-label="Half star" />
      )}

      {Array(emptyStars)
        .fill(0)
        .map((_, index) => (
          <FaRegStar
            key={`empty-${index}`}
            className="text-gray-500"
            aria-label="Empty star"
          />
        ))}
    </div>
  );
};

export default StarRating;
