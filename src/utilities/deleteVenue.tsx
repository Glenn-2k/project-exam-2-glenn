import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFn } from "./http";
import { venuesUrl } from "./constants";
import { useNavigate } from "react-router-dom";
import { loadLocal } from "./localStorage";

const useDeleteVenue = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this venue?"
      );
      if (!confirmDelete) return;

      const token = loadLocal("token");
      await deleteFn({ url: `${venuesUrl}/${id}`, token });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["venues"] });
      navigate("/profile");
    },
    onError: (error) => {
      console.error("Failed to delete venue:", error);
    },
  });
};

export default useDeleteVenue;
