import axiosInstance from "../utils/axiosInstance";

export const authAPIs = {
  // Find User Slug
  findUserSlug: async ({ mondayAPI }) => {
    try {
      const query = `query {
                      account{
                        slug
                      }
                    }`;

      const response = await mondayAPI.api(query);

      return response.data.account.slug;
    } catch (error) {
      console.error("Error finding user slug:", error);
      throw new Error(error.response?.data?.message || "User Slug Not Found");
    }
  },

  // Check User Auth
  checkUserAuth: async ({ slug }) => {
    try {
      const response = await axiosInstance.post("/monday/check-auth", {
        slug,
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
