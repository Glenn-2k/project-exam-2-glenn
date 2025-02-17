import { useCallback, useState } from "react";
import { postFn } from "../../utilities/http";
import { createVenueUrl } from "../../utilities/constants";
import { useNavigate } from "react-router-dom";
import { loadLocal } from "../../utilities/localStorage";
import { validationSchema } from "../../validation/validationSchema";
import * as Yup from "yup";

const initialFormState = {
  name: "",
  description: "",
  address: "",
  city: "",
  country: "",
  price: "",
  maxGuests: "",
  image: "",
  meta: {
    wifi: false,
    parking: false,
    breakfast: false,
    pets: false,
  },
};

const UpdateVenue: React.FC = () => {
  const token = loadLocal("token") || "";
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value, type, checked } = e.target as HTMLInputElement;

      setFormData((prev) => ({
        ...prev,
        [type === "checkbox" ? "meta" : ""]: {
          ...prev.meta,
          [name]: type === "checkbox" ? checked : value,
        },
      }));
    },
    []
  );

  const handleSubmit = useCallback(async () => {
    try {
      setLoading(true);
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({});

      const body = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        address: formData.address,
        city: formData.city,
        country: formData.country,
        maxGuests: Number(formData.maxGuests),
        media: [
          {
            url: formData.image,
            alt: `${formData.name} venue image`,
          },
        ],
        meta: formData.meta,
      };

      await postFn({
        url: createVenueUrl,
        body,
        token,
      });

      setTimeout(() => {
        navigate("/profile");
      }, 1000);
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        error.inner.forEach((e) => {
          setErrors((prev) => ({ ...prev, [e.path!]: e.message }));
        });
      } else {
        console.error("Error creating venue:", error);
      }
    } finally {
      setLoading(false);
    }
  }, [formData, navigate, token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6 uppercase">
          Update Venue
        </h1>
        <form className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-600">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
            {errors.name && <span className="text-red-500">{errors.name}</span>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-600">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded-md h-24"
            />
            {errors.description && (
              <span className="text-red-500">{errors.description}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
            {errors.address && (
              <span className="text-red-500">{errors.address}</span>
            )}
          </div>

          {/* City & Country */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
              {errors.city && (
                <span className="text-red-500">{errors.city}</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600">
                Country
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
              {errors.country && (
                <span className="text-red-500">{errors.country}</span>
              )}
            </div>
          </div>

          {/* Price & Max Guests */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600">
                Price
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
              {errors.price && (
                <span className="text-red-500">Please enter a valid price</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600">
                Max Guests
              </label>
              <input
                type="number"
                name="maxGuests"
                value={formData.maxGuests}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
              {errors.maxGuests && (
                <span className="text-red-500">
                  Please enter a valid amount of guests
                </span>
              )}
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-semibold text-gray-600">
              Image URL
            </label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
            {errors.image && (
              <span className="text-red-500">{errors.image}</span>
            )}
          </div>

          {/* Meta Checkboxes */}
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="wifi"
                checked={formData.meta.wifi}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-600">Wifi</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="parking"
                checked={formData.meta.parking}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-600">Parking</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="breakfast"
                checked={formData.meta.breakfast}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-600">Breakfast</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="pets"
                checked={formData.meta.pets}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-600">Pets</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            className="bg-sky-950 hover:bg-sky-800 text-white font-bold py-2 px-4 rounded-md transition-all duration-200 w-full mt-4"
            type="button"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Venue"}
          </button>
          <button
            className="bg-red-800 hover:bg-red-950 text-white font-bold py-2 px-4 rounded-md transition-all duration-200 w-full mt-4"
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

export default UpdateVenue;
