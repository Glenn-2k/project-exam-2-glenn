import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { postFn } from "../../utilities/http";
import { loginUrl } from "../../utilities/constants";
import { saveLocal } from "../../utilities/localStorage";

/**
 * Login Component
 *
 * Provides a form for users to log in by entering their email and password.
 * Validates input fields and handles authentication requests.
 *
 * @component
 * @returns {JSX.Element} The rendered Login component.
 */
const Login: React.FC = () => {
  const navigate = useNavigate();

  /** State to hold form data */
  const [formData, setFormData] = useState({ email: "", password: "" });

  /** State to hold form field-specific errors */
  const [errors, setErrors] = useState<Record<string, string>>({});

  /** State to hold global error messages */
  const [globalError, setGlobalError] = useState<string | null>(null);

  /** Validation schema using Yup */
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  /**
   * Handles input changes and updates state accordingly.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Handles form submission by validating input and making an API call.
   * If login is successful, the token is stored locally and user is redirected.
   *
   * @async
   * @function handleSubmit
   * @returns {Promise<void>}
   */
  const handleSubmit = async (): Promise<void> => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({});

      const data = await postFn({
        url: loginUrl,
        body: formData,
        token: "",
      });

      if (data.data?.accessToken) {
        saveLocal("token", data.data.accessToken);
        saveLocal("user", data);
        window.dispatchEvent(new Event("authChange"));

        setTimeout(() => {
          navigate("/");
        }, 500);
      } else {
        setGlobalError("Invalid email or password.");
      }
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
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Login</h1>
      {globalError && <div className="text-red-500 mb-4">{globalError}</div>}

      {/* Email*/}
      <label htmlFor="email" className="sr-only">
        email
      </label>
      <input
        id="email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        className="border p-2 rounded mb-4"
      />
      {errors.email && <div className="text-red-500">{errors.email}</div>}

      {/* Password */}
      <label htmlFor="password" className="sr-only">
        password{" "}
      </label>
      <input
        id="password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        placeholder="Password"
        className="border p-2 rounded mb-4"
      />
      {errors.password && <div className="text-red-500">{errors.password}</div>}

      {/* Login button */}
      <button
        data-testid="login-button"
        onClick={handleSubmit}
        className="bg-sky-950 hover:bg-sky-800 text-white font-bold py-2 px-4 rounded"
      >
        Login
      </button>

      {/* Register redirect */}
      <p className="mt-4">
        Don't have an account?{" "}
        <span
          onClick={() => navigate("/register")}
          className="text-sky-950 cursor-pointer"
        >
          Register
        </span>
      </p>
    </div>
  );
};

export default Login;
