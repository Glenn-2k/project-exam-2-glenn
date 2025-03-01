import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { postFn } from "../../utilities/http";
import { registerUrl } from "../../utilities/constants";
import { validationSchema } from "../../validation/registerSchema";

/**
 * Register component for user sign-up.
 * Allows users to register with name, email, password, and an optional venue manager role.
 * Uses Yup for validation and React Query for API calls.
 *
 * @component
 */
const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    venueManager: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);

  /**
   * Handles changes in input fields.
   * Updates the form data state with new input values.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
   */
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  /**
   * Handles form submission.
   * Validates form data and sends a registration request to the API.
   */
  const handleSubmit = useCallback(async () => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({});

      await postFn({
        url: registerUrl,
        body: { ...formData },
        token: "",
      });

      navigate("/login");
    } catch (err: unknown) {
      if (err instanceof Yup.ValidationError) {
        const newErrors: Record<string, string> = {};
        err.inner.forEach((validationError: Yup.ValidationError) => {
          newErrors[validationError.path!] = validationError.message;
        });
        setErrors(newErrors);
      } else {
        setGlobalError("An error occurred. Please try again.");
      }
    }
  }, [formData, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Register</h1>
      {globalError && <div className="text-red-500 mb-4">{globalError}</div>}

      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        className="border p-2 rounded mb-4"
      />
      {errors.email && <div className="text-red-500">{errors.email}</div>}

      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
        className="border p-2 rounded mb-4"
      />
      {errors.password && <div className="text-red-500">{errors.password}</div>}

      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Name"
        className="border p-2 rounded mb-4"
      />
      {errors.name && <div className="text-red-500">{errors.name}</div>}

      <label className="mb-4">
        <input
          type="checkbox"
          name="venueManager"
          checked={formData.venueManager}
          onChange={handleChange}
          className="mr-2"
        />
        Venue Manager?
      </label>

      <button
        onClick={handleSubmit}
        className="bg-sky-950 hover:bg-sky-800 text-white font-bold py-2 px-4 rounded"
      >
        Register
      </button>
    </div>
  );
};

export default Register;
