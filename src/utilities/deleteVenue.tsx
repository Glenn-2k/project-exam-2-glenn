import { useCallback } from "react";
import { deleteFn } from "./http";
import { venuesUrl } from "./constants";
import { useNavigate } from "react-router-dom";
import { loadLocal } from "./localStorage";

const useDeleteVenue = () => {
  const navigate = useNavigate();

  return useCallback(
    async (id: string) => {
      try {
        const token = loadLocal("token");
        await deleteFn({ url: `${venuesUrl}/${id}`, token });
        navigate("/profile");
      } catch (error) {
        console.error(error);
      }
    },
    [navigate]
  );
};

export default useDeleteVenue;
