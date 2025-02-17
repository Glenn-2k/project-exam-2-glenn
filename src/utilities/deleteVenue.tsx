import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFn } from "./http";
import { venuesUrl } from "./constants";
import { useNavigate } from "react-router-dom";
import { loadLocal } from "./localStorage";

/**
 * Custom hook for deleting a venue.
 * Uses React Query's `useMutation` to handle venue deletion.
 *
 * @returns {UseMutationResult} Mutation object for deleting a venue.
 */
const useDeleteVenue = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    /**
     * Deletes a venue by ID.
     *
     * @async
     * @function
     * @param {string} id - The ID of the venue to delete.
     * @returns {Promise<void>} A promise that resolves when the venue is deleted.
     */
    mutationFn: async (id: string) => {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this venue?"
      );
      if (!confirmDelete) return;

      const token = loadLocal("token");
      await deleteFn({ url: `${venuesUrl}/${id}`, token });
    },

    /**
     * Handles successful deletion by invalidating the venues cache
     * and redirecting the user to the profile page.
     */
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["venues"] });
      navigate("/profile");
    },

    /**
     * Handles errors that occur during venue deletion.
     *
     * @param {Error} error - The error object from the failed mutation.
     */
    onError: (error) => {
      console.error("Failed to delete venue:", error);
    },
  });
};

export default useDeleteVenue;
