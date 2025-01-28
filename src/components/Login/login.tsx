import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { postFn } from "../../utilities/http";
import { loginUrl } from "../../utilities/constants";
import { saveLocal } from "../../utilities/localStorage";

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
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

      <button
        onClick={handleSubmit}
        className="bg-sky-950 hover:bg-sky-800 text-white font-bold py-2 px-4 rounded"
      >
        Login
      </button>
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
