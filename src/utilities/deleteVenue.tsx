import { useMutation, useQueryClient } from "@tanstack/react-query"; // ✅ Import React Query
import { deleteFn } from "./http";
import { venuesUrl } from "./constants";
import { useNavigate } from "react-router-dom";
import { loadLocal } from "./localStorage";

const useDeleteVenue = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient(); // ✅ Get queryClient instance

  return useMutation({
    mutationFn: async (id: string) => {
      const token = loadLocal("token");
      await deleteFn({ url: `${venuesUrl}/${id}`, token });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["venues"] }); // ✅ Refresh venue list
      navigate("/profile"); // ✅ Navigate to profile after deletion
    },
    onError: (error) => {
      console.error("Failed to delete venue:", error);
    },
  });
};

export default useDeleteVenue;
