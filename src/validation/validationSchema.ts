import * as Yup from "yup";

export const validationSchema = Yup.object({
  name: Yup.string().required("Required"),
  description: Yup.string().required("Required"),
  price: Yup.number().required("Required"),
  address: Yup.string().required("Please provide a valid address"),
  city: Yup.string().required("Please provide a valid city"),
  country: Yup.string().required("Please provide a valid country"),
  maxGuests: Yup.number().required("Required"),
  image: Yup.string().url("Must be a valid URL"),
});
