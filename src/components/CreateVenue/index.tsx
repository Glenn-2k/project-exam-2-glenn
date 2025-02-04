import { postFn } from "../../utilities/http";
import { createVenueUrl } from "../../utilities/constants";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import * as Yup from "yup";
import { loadLocal } from "../../utilities/localStorage";

const CreateVenue: React.FC = () => {
  const storedUserData = localStorage.getItem("user");
  const token = loadLocal("token") || "";
  const navigate = useNavigate();

  let userName = "";
  try {
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);
      userName = parsedData.data?.name;
      console.log("Found user name:", userName);
    }
  } catch (error) {
    console.error("Error parsing user data:", error);
  }

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    maxGuests: "",
    image: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    description: Yup.string().required("Required"),
    price: Yup.number().required("Required"),
    maxGuests: Yup.number().required("Required"),
    image: Yup.string().url("Must be a valid URL"),
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({});

      const body = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        maxGuests: formData.maxGuests,
        image: {
          url: formData.image,
          alt: `${userName}'s venue image`,
        },
      };

      await postFn({
        url: createVenueUrl,
        body,
        token: token || "",
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
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1>Create Venue</h1>
        <form>
          <label>
            Name
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <span>{errors.name}</span>}
          </label>
          <label>
            Description
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
            {errors.description && <span>{errors.description}</span>}
          </label>
          <label>
            Price
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
            />
            {errors.price && <span>{errors.price}</span>}
          </label>
          <label>
            Max Guests
            <input
              type="number"
              name="maxGuests"
              value={formData.maxGuests}
              onChange={handleChange}
            />
            {errors.maxGuests && <span>{errors.maxGuests}</span>}
          </label>
          <label>
            Image
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
            />
            {errors.image && <span>{errors.image}</span>}
          </label>
          <button type="button" onClick={handleSubmit}>
            Create Venue
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateVenue;
