import axiosInstance from "../utils/axiosInstance";

const customizationAPIs = {
  // Get the Customization settings
  getCustomization: async ({ slug }) => {
    try {
      const response = await axiosInstance.get(
        `/customization/getCustomization?slug=${slug}`
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching customization:", error);
      throw new Error(
        error.response?.data?.message ||
          `Failed to fetch customization settings`
      );
    }
  },

  // Add new Customization settings
  addCustomization: async ({ customizationData, slug }) => {
    try {
      const response = await axiosInstance.post(
        `/customization/addCustomization?slug=${slug}`,
        customizationData
      );
      return response.data;
    } catch (error) {
      console.error("Error adding customization:", error);
      throw error;
    }
  },

  // Update existing Customization settings
  updateCustomization: async ({ customizationData, slug }) => {
    try {
      const response = await axiosInstance.put(
        `/customization/updateCustomization?slug=${slug}`,
        customizationData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating customization:", error);
      throw error;
    }
  },

  // Delete current Customization settings
  deleteCustomization: async ({ slug }) => {
    try {
      await axiosInstance.delete(
        `/customization/deleteCustomization?slug=${slug}`
      );
      console.log("Customization deleted successfully");
      return true;
    } catch (error) {
      console.error("Error deleting customization:", error);
      throw error;
    }
  },

  getAllBoards: async ({ monday }) => {
    const query = `
      query {
        boards {
          name
          id
          columns {
            id
            title
          }
        }
      }
    `;
    const response = await monday.api(query);
    return response.data.boards;
  },
};

export default customizationAPIs;
