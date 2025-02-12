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
        ...formData,
        price: Number(formData.price),
        maxGuests: Number(formData.maxGuests),
        media: mediaArray,
      };

      console.log("Request body being sent:", body);

      await postFn({ url: createVenueUrl, body, token });

      setTimeout(() => navigate("/profile"), 1000);
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
