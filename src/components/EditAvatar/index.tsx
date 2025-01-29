import { putFn } from "../../utilities/http";
import { baseUrl } from "../../utilities/constants";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import * as Yup from "yup";

const EditAvatar: React.FC = () => {
  const storedUserData = localStorage.getItem("user");
  const token = localStorage.getItem("token");
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
    profilePicture: "",
    bannerPicture: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validationSchema = Yup.object({
    profilePicture: Yup.string().url("Must be a valid URL"),
    bannerPicture: Yup.string().url("Must be a valid URL"),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({});

      const avatar = {
        url: formData.profilePicture,
        alt: `${userName}'s profile picture`,
      };
      const banner = {
        url: formData.bannerPicture,
        alt: `${userName}'s banner`,
      };

      const body = {
        avatar,
        banner,
      };

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
    <div className="edit-avatar">
      <h1>Edit Avatar</h1>
      <form>
        <div className="form-group">
          <label htmlFor="profilePicture">Profile Picture</label>
          <input
            type="text"
            name="profilePicture"
            id="profilePicture"
            value={formData.profilePicture}
            onChange={handleChange}
          />
          {errors.profilePicture && (
            <div className="error">{errors.profilePicture}</div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="bannerPicture">Banner Picture</label>
          <input
            type="text"
            name="bannerPicture"
            id="bannerPicture"
            value={formData.bannerPicture}
            onChange={handleChange}
          />
          {errors.bannerPicture && (
            <div className="error">{errors.bannerPicture}</div>
          )}
        </div>
        <button type="button" onClick={handleSubmit}>
          Save
        </button>
      </form>
    </div>
  );
};

export default EditAvatar;
