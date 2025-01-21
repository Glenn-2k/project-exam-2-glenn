import { useVenues } from "../../assets/hooks/useVenues";
import VenueCard from "../VenueCard";
import { useState } from "react";

const VenueList = () => {
  const { data, isLoading, error } = useVenues();
  console.log("Data:", data); // Debugging

  const [searchTerm, setSearchTerm] = useState<string>("");

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const venuesArray = data && Array.isArray(data.data) ? data.data : []; // Adjust based on structure
  const filteredData = venuesArray.filter((venue) => {
    const name = venue.name || "";
    const description = venue.description || "";
    return (
      searchTerm === "" ||
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  console.log("Filtered data:", filteredData); // Debugging

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
