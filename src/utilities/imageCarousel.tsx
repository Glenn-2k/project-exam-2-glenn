import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/swiper-bundle.css";

const VenueCarousel: React.FC<{ images: { url: string; alt: string }[] }> = ({
  images,
}) => {
  if (!images || images.length === 0) {
    return <p>No images available</p>;
  }

  return (
    <Swiper
      modules={[Navigation, Pagination]}
      spaceBetween={10}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      className="w-full max-w-md rounded-lg"
    >
      {images.map((image, index) => (
        <SwiperSlide key={index}>
          <img
            src={image.url}
            alt={image.alt || `Venue Image ${index + 1}`}
            className="w-full h-64 object-cover rounded-lg"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default VenueCarousel;
