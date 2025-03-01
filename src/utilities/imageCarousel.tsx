import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/swiper-bundle.css";

const VenueCarousel: React.FC<{ images: { url: string; alt: string }[] }> = ({
  images,
}) => {
  const placeholderImage = "https://placehold.co/400x400?text=Missing+Image";

  return (
    <div className="w-full h-64">
      {images && images.length > 0 ? (
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          className="w-full h-full"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-64 object-cover rounded-lg"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <img
          src={placeholderImage}
          alt="No images available"
          className="w-full h-64 object-cover rounded-lg"
        />
      )}
    </div>
  );
};

export default VenueCarousel;
