import { useVenues } from "../../assets/hooks/useVenues";
import VenueCard from "../VenueCard";
import { useState } from "react";

const VenueList = () => {
  const { data, isLoading, error } = useVenues();

  const [searchTerm, setSearchTerm] = useState<string>("");

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const filteredData = Array.isArray(data)
    ? data.filter(
        (venue) =>
          venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          venue.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="p-8 flex flex-col items-center">
      <h1 className="text-2xl text-center font-bold mb-4">Our Products</h1>
      <label htmlFor="search" className="sr-only">
        Search Products
      </label>
      <input
        type="text"
        value={searchTerm}
        id="search"
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search products.."
        className="border  p-2 rounded mb-4 md:w-1/3"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredData.map((venue) => (
          <VenueCard key={venue.id} {...venue} />
        ))}
      </div>
    </div>
  );
};

export default VenueList;
