import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const CustomizationApi = {
  /**
   * Get current customization settings
   * @returns {Promise<Object>} Customization object
   */
  getCustomization: async () => {
    try {
      const response = await api.get("/customization/");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching customization:", error);
      throw error;
    }
  },

  /**
   * Add new customization settings
   * @param {Object} customizationData
   * @returns {Promise<Object>} Created customization object
   */
  addCustomization: async (customizationData) => {
    try {
      const response = await api.post("/customization/", customizationData);
      return response.data;
    } catch (error) {
      console.error("Error adding customization:", error);
      throw error;
    }
  },

  /**
   * Update existing customization settings
   * @param {Object} customizationData
   * @returns {Promise<Object>} Updated customization object
   */
  updateCustomization: async (customizationData) => {
    try {
      const response = await api.put("/customization/", customizationData);
      return response.data;
    } catch (error) {
      console.error("Error updating customization:", error);
      throw error;
    }
  },

  /**
   * Delete current customization settings
   * @returns {Promise<boolean>} True if deletion was successful
   */
  deleteCustomization: async () => {
    try {
      await api.delete("/customization/");
      console.log("Customization deleted successfully");
      return true;
    } catch (error) {
      console.error("Error deleting customization:", error);
      throw error;
    }
  },
};

export default CustomizationApi;
