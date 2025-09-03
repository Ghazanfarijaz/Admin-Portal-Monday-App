import axiosInstance from "../utils/axiosInstance";

const customizationAPIs = {
  // Get the Customization settings
  getCustomization: async ({ sessionToken }) => {
    try {
      const response = await axiosInstance.get(
        `/customization/getCustomization`,
        {
          headers: {
            Authorization: sessionToken,
          },
        }
      );

      return response?.data?.data;
    } catch (error) {
      console.error("Error fetching customization:", error);
      throw new Error(
        error.response?.data?.message ||
          `Failed to fetch customization settings`
      );
    }
  },

  // Add new Customization settings
  addCustomization: async ({ customizationData, sessionToken }) => {
    try {
      const response = await axiosInstance.post(
        `/customization/addCustomization`,
        customizationData,
        {
          headers: {
            Authorization: sessionToken,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error adding customization:", error);
      throw new Error(
        error.response?.data?.message || `Failed to add customization settings`
      );
    }
  },

  // Update existing Customization settings
  updateCustomization: async ({ customizationData, sessionToken }) => {
    try {
      const response = await axiosInstance.put(
        `/customization/updateCustomization`,
        customizationData,
        {
          headers: {
            Authorization: sessionToken,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating customization:", error);
      throw new Error(
        error.response?.data?.message ||
          `Failed to update customization settings`
      );
    }
  },

  // Get all boards
  getAllBoards: async ({ sessionToken }) => {
    try {
      const response = await axiosInstance.get(`/users/getUserBoardsData`, {
        headers: {
          Authorization: sessionToken,
        },
      });

      return response.data.data;
    } catch (error) {
      console.error("Error fetching boards:", error);
      throw new Error(error.message || `Failed to fetch boards`);
    }
  },

  // Get Columns of a specific board
  getBoardColumns: async ({ sessionToken, boardId }) => {
    try {
      const response = await axiosInstance.get(
        `/users/getSpecificBoardColumns?boardId=${boardId}`,
        {
          headers: {
            Authorization: sessionToken,
          },
        }
      );

      return response.data.data;
    } catch (error) {
      console.error("Error fetching board columns:", error);
      throw new Error(error.message || `Failed to fetch boards`);
    }
  },
};

export default customizationAPIs;
