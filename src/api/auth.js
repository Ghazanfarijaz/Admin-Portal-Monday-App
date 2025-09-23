import axiosInstance from "../utils/axiosInstance";

export const authAPIs = {
  // Check User Auth
  checkUserAuth: async ({ sessionToken }) => {
    try {
      const response = await axiosInstance.get("/monday/check-auth", {
        headers: {
          Authorization: sessionToken,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error checking user authentication:", error);
      throw new Error(
        error.response?.data?.message || "User Authentication Failed"
      );
    }
  },
};
