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
      throw new Error(
        error.response?.data?.message || `Failed to add customization settings`
      );
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
      throw new Error(
        error.response?.data?.message ||
          `Failed to update customization settings`
      );
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
      throw new Error(
        error.response?.data?.message ||
          `Failed to delete customization settings`
      );
    }
  },

  getAllBoards: async ({ monday }) => {
    try {
      const query = `
      query {
        boards {
          name
          id
          columns {
            id
            title
            type
          }
        }
      }
    `;
      const response = await monday.api(query);

      // Go Through all the boards and filter out the columns of types
      // ["board_relation", "mirror","button", "dependency", "formula", "auto_number", "progress"]

      response.data.boards = response.data.boards.map((board) => {
        board.columns = board.columns.filter(
          (column) =>
            ![
              "board_relation",
              "mirror",
              "button",
              "dependency",
              "formula",
              "auto_number",
              "progress",
            ].includes(column.type)
        );
        return board;
      });

      return response.data.boards;
    } catch (error) {
      console.error("Error fetching boards:", error);
      throw new Error(error.message || `Failed to fetch boards`);
    }
  },
};

export default customizationAPIs;
