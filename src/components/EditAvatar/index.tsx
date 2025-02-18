import { putFn } from "../../utilities/http";
import { baseUrl } from "../../utilities/constants";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import * as Yup from "yup";
import { loadLocal } from "../../utilities/localStorage";

/**
 * EditAvatar Component
 *
 * This component allows users to update their profile avatar by providing a valid image URL.
 * The avatar is updated via an API call using `putFn`.
 *
 * @component
 * @returns {JSX.Element} The EditAvatar component.
 */
const EditAvatar: React.FC = () => {
  const storedUserData = localStorage.getItem("user");
  const token = loadLocal("token") || "";
  const navigate = useNavigate();

  let userName = "";
  try {
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);
      userName = parsedData.data?.name;
    }
  } catch (error) {
    console.error("Error parsing user data:", error);
  }

  const [formData, setFormData] = useState({
    profilePicture: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  /**
   * Validation schema for the avatar input field.
   */
  const validationSchema = Yup.object({
    profilePicture: Yup.string().url("Must be a valid URL"),
  });

  /**
   * Handles input field changes.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Handles form submission, validating the input and sending the update request.
   */
  const handleSubmit = async () => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({});

      const avatar = {
        url: formData.profilePicture,
        alt: `${userName}'s profile picture`,
      };

      const body = { avatar };

      await putFn({
        url: `${baseUrl}holidaze/profiles/${userName}`,
        body,
        token: token || "",
      });

      setTimeout(() => {
        navigate("/profile");
      }, 500);
    } catch (err: unknown) {
      if (err instanceof Yup.ValidationError) {
        const newErrors: Record<string, string> = {};
        err.inner.forEach((validationError: Yup.ValidationError) => {
          newErrors[validationError.path!] = validationError.message;
        });
        setErrors(newErrors);
      } else {
        console.error("Edit avatar error:", err);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6 uppercase">
          Edit Avatar
        </h1>

        <form className="space-y-4">
          {/* Profile Picture */}
          <div className="flex flex-col">
            <label
              htmlFor="profilePicture"
              className="text-sm font-semibold text-gray-600 mb-1"
            >
              Avatar URL
            </label>
            <input
              type="text"
              name="profilePicture"
              id="profilePicture"
              value={formData.profilePicture}
              onChange={handleChange}
              placeholder="Enter a valid image URL"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.profilePicture && (
              <div className="text-red-500 text-xs mt-1">
                {errors.profilePicture}
              </div>
            )}
          </div>

          {/* Save Button */}
          <button
            className="bg-sky-950 hover:bg-sky-800 text-white font-bold py-2 px-4 rounded-md transition-all duration-200 w-full mt-4"
            type="button"
            onClick={handleSubmit}
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditAvatar;
