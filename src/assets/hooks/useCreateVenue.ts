import { useState } from "react";
import { postFn } from "../../utilities/http";
import { createVenueUrl } from "../../utilities/constants";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { loadLocal } from "../../utilities/localStorage";

export const useCreateVenue = () => {
  const token = loadLocal("token") || "";
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    maxGuests: "",
    image: "",
    location: {
      address: "",
      city: "",
      country: "",
      zip: "",
    },
    meta: {
      wifi: false,
      parking: false,
      breakfast: false,
      pets: false,
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    description: Yup.string().required("Required"),
    price: Yup.number().required("Required"),
    address: Yup.string(),
    city: Yup.string(),
    country: Yup.string(),
    maxGuests: Yup.number().required("Required"),
    image: Yup.string().url("Must be a valid URL"),
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        meta: {
          ...prev.meta,
          [name]: checked,
        },
      }));
    } else if (
      ["address", "city", "country", "zip", "continent", "lat", "lng"].includes(
        name
      )
    ) {
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({});

      const mediaArray = formData.image
        ? [{ url: formData.image, alt: `${formData.name} venue image` }]
        : [];

      const body = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        maxGuests: Number(formData.maxGuests),
        media: mediaArray,
        meta: formData.meta,
        location: {
          address: formData.location.address || null,
          city: formData.location.city || null,
          country: formData.location.country || null,
        },
      };

      const response = await postFn({ url: createVenueUrl, body, token });

      if (response?.data?.id) {
        setTimeout(() => navigate(`/venues/${response.data.id}`), 1000);
      } else {
        console.error("Noe venue ID returned from server:", response);
      }
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

  return { formData, errors, handleChange, handleSubmit, navigate };
};
