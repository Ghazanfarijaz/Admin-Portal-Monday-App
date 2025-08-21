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
  getAllBoards: async ({ monday }) => {
    try {
      const query = `
      query {
        boards {
          name
          id
          type
          board_kind
        }
      }
    `;
      const response = await monday.api(query);

      // Filter out the boards with "custom_object" type and "private" board_kind
      // "private" boards are not visible to the user, so we exclude them
      const filteredBoards = response.data.boards.filter(
        (board) =>
          board.type !== "custom_object" && board.board_kind !== "private"
      );

      return filteredBoards;
    } catch (error) {
      console.error("Error fetching boards:", error);
      throw new Error(error.message || `Failed to fetch boards`);
    }
  },

  // Get Columns of a specific board
  getBoardColumns: async ({ monday, boardId }) => {
    try {
      const query = `
      query {
        boards (ids: [${boardId}]) {
          name
          id
          type
          columns {
            id
            title
            type
          }
        }
      }
    `;
      const response = await monday.api(query);

      // Filter out the boards with "custom_object" type
      const filteredBoards = response.data.boards.filter(
        (board) => board.type !== "custom_object"
      );

      // Go Through all the boards and filter out the columns of types
      // ["board_relation", "mirror","button", "dependency", "formula", "auto_number", "progress"]
      const finalBoardsData = filteredBoards.map((board) => {
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

      return finalBoardsData;
    } catch (error) {
      console.error("Error fetching boards:", error);
      throw new Error(error.message || `Failed to fetch boards`);
    }
  },
};

export default customizationAPIs;
