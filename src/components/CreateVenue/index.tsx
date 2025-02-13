import FormInput from "../../components/FormInput";
import FormCheckbox from "../../components/FormCheckbox/FormCheckbox";
import { useCreateVenue } from "../../assets/hooks/useCreateVenue";

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
          <FormInput
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
          />
          <FormInput
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            error={errors.description}
          />
          <FormInput
            label="Address"
            name="address"
            value={formData.location.address}
            onChange={handleChange}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="City"
              name="city"
              value={formData.location.city}
              onChange={handleChange}
            />
            <FormInput
              label="Country"
              name="country"
              value={formData.location.country}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              error={errors.price}
            />
            <FormInput
              label="Max Guests"
              name="maxGuests"
              type="number"
              value={formData.maxGuests}
              onChange={handleChange}
              error={errors.maxGuests}
            />
          </div>

          <FormInput
            label="Image URL"
            name="image"
            value={formData.image}
            onChange={handleChange}
            error={errors.image}
          />

          <div className="grid grid-cols-2 gap-4">
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

          <button
            className="bg-sky-950 hover:bg-sky-800 text-white font-bold py-2 px-4 rounded-md w-full mt-4"
            type="button"
            onClick={handleSubmit}
          >
            Create Venue
          </button>
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
