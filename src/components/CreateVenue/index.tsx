import FormInput from "../../components/FormInput";
import FormCheckbox from "../../components/FormCheckbox/FormCheckbox";
import { useCreateVenue } from "../../assets/hooks/useCreateVenue";

/**
 * CreateVenue Component
 *
 * This component provides a form for users to create a new venue.
 * Users can input venue details such as name, description, location, price, and amenities.
 *
 * @component
 * @returns {JSX.Element} The CreateVenue form component
 */
const CreateVenue: React.FC = () => {
  const { formData, errors, handleChange, handleSubmit, navigate } =
    useCreateVenue();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6 uppercase">
          Create Venue
        </h1>
        <form className="space-y-4">
          {/* Name  */}
          <FormInput
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
          />

          {/* Description */}
          <FormInput
            label="Description"
            name="description"
            type="textarea"
            value={formData.description}
            onChange={handleChange}
            error={errors.description}
          />

          {/* Address */}
          <FormInput
            label="Address"
            name="address"
            value={formData.location.address}
            onChange={handleChange}
          />

          <div className="grid grid-cols-2 gap-4">
            {/* City  */}
            <FormInput
              label="City"
              name="city"
              value={formData.location.city}
              onChange={handleChange}
            />

            {/* Country */}
            <FormInput
              label="Country"
              name="country"
              value={formData.location.country}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Price */}
            <FormInput
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              error={errors.price}
            />

            {/* Max Guests */}
            <FormInput
              label="Max Guests"
              name="maxGuests"
              type="number"
              value={formData.maxGuests}
              onChange={handleChange}
              error={errors.maxGuests}
            />
          </div>

          {/* Image URL Input */}
          <FormInput
            label="Image URL"
            name="image"
            value={formData.image}
            onChange={handleChange}
            error={errors.image}
          />

          <div className="grid grid-cols-2 gap-4">
            {/* Amenities Checkboxes */}
            <FormCheckbox
              label="Wifi"
              name="wifi"
              checked={formData.meta.wifi}
              onChange={handleChange}
            />
            <FormCheckbox
              label="Parking"
              name="parking"
              checked={formData.meta.parking}
              onChange={handleChange}
            />
            <FormCheckbox
              label="Breakfast"
              name="breakfast"
              checked={formData.meta.breakfast}
              onChange={handleChange}
            />
            <FormCheckbox
              label="Pets"
              name="pets"
              checked={formData.meta.pets}
              onChange={handleChange}
            />
          </div>

          {/* Submit Button */}
          <button
            className="bg-sky-950 hover:bg-sky-800 text-white font-bold py-2 px-4 rounded-md w-full mt-4"
            type="button"
            onClick={handleSubmit}
          >
            Create Venue
          </button>

          {/* Cancel Button */}
          <button
            className="bg-red-800 hover:bg-red-950 text-white font-bold py-2 px-4 rounded-md w-full mt-4"
            type="button"
            onClick={() => navigate("/profile")}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateVenue;
