import axiosInstance from "../utils/axiosInstance";

export const userAPIs = {
  // Get all users
  getAllUsers: async ({ userSlug }) => {
    try {
      const response = await axiosInstance.get(
        `/users/getAllUsers?slug=${userSlug}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw new Error(
        error.response?.data?.message ||
          "Failed to fetch users. Please try again."
      );
    }
  },

  // Create a new user
  createUser: async (userData) => {
    try {
      const response = await axiosInstance.post("/users/create-user", userData);
      return response.data;
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error(
        error.response?.data?.message ||
          "Failed to create user. Please try again."
      );
    }
  },

  // Update user details
  updateSpecificUser: async ({ email, updateData, slug }) => {
    try {
      const response = await axiosInstance.put(
        `/users/updateSpecificUser/${encodeURIComponent(email)}?slug=${slug}`,
        updateData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating credential:", error);
      throw new Error(
        error.response?.data?.message ||
          "Failed to update user. Please try again."
      );
    }
  },

  // Delete a Specific User
  deleteSpecificUser: async ({ email, slug }) => {
    try {
      await axiosInstance.delete(
        `/users/deleteUser/${encodeURIComponent(email)}?slug=${slug}`
      );
      return true;
    } catch (error) {
      console.error("Error deleting credential:", error);
      throw new Error(
        error.response?.data?.message ||
          "Failed to delete user. Please try again."
      );
    }
  },
};
