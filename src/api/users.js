import axiosInstance from "../utils/axiosInstance";

export const userAPIs = {
  // Get all users
  getAllUsers: async ({ sessionToken }) => {
    try {
      const response = await axiosInstance.get(`/users/getAllUsers`, {
        headers: {
          Authorization: sessionToken,
        },
      });
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
  createUser: async (userData, sessionToken) => {
    try {
      const response = await axiosInstance.post(
        "/users/create-user",
        userData,
        {
          headers: {
            Authorization: sessionToken,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error(
        error.response?.data?.message ||
          "Failed to create user. Please try again."
      );
    }
  },

  // Add Multiple Users Imported through csv
  addImportedUsersCredentials: async ({ usersData, sessionToken }) => {
    try {
      const response = await axiosInstance.post(
        `/users/addImportedUsers`,
        {
          newUsers: usersData,
        },
        {
          headers: {
            Authorization: sessionToken,
          },
        }
      );
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
  updateSpecificUser: async ({ email, updateData, sessionToken }) => {
    try {
      const response = await axiosInstance.put(
        `/users/updateSpecificUser/${encodeURIComponent(email)}`,
        updateData,
        {
          headers: {
            Authorization: sessionToken,
          },
        }
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
  // Approve a Specific User
  approveSpecificUser: async ({ email, sessionToken }) => {
    try {
      const response = await axiosInstance.patch(
        `/users/approveSpecificUser`,
        { email },
        {
          headers: {
            Authorization: sessionToken,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error approving user:", error);
      throw new Error(
        error.response?.data?.message ||
          "Failed to approve user. Please try again."
      );
    }
  },

  // Delete a Specific User
  deleteSpecificUser: async ({ email, sessionToken }) => {
    try {
      await axiosInstance.delete(
        `/users/deleteUser/${encodeURIComponent(email)}`,
        {
          headers: {
            Authorization: sessionToken,
          },
        }
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
