import axios from "axios";

const MONDAY_API_URL = "https://api.monday.com/v2";
// In a real app, store this in environment variables or secure storage
const MONDAY_API_KEY =
  "eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjUwOTg1NzUzMiwiYWFpIjoxMSwidWlkIjo2NTc0ODE5MywiaWFkIjoiMjAyNS0wNS0wN1QyMDo1MzoyNS4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6OTYxNjMxNywicmduIjoidXNlMSJ9.YtKBiRas6k3N6nPZA4Aks5oy0mmVBv-CR3SULWPj22U";

// Create axios instance with default config
const mondayApi = axios.create({
  baseURL: MONDAY_API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: MONDAY_API_KEY,
  },
});

const CustomizationData = {
  /**
   * Execute a raw GraphQL query against Monday.com API
   * @param {string} query - The GraphQL query string
   * @param {Object} [variables] - Optional variables for the query
   * @returns {Promise<Object>} The API response data
   */
  executeQuery: async (query, variables = {}) => {
    try {
      const response = await mondayApi.post("", {
        query,
        variables,
      });
      return response.data;
    } catch (error) {
      console.error("Monday.com API error:", error);
      throw error;
    }
  },

  /**
   * Get all boards with basic info
   * @returns {Promise<Array>} Array of boards with id, name and columns
   */
  getAllBoards: async () => {
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
    const response = await CustomizationData.executeQuery(query);
    return response.data.boards;
  },

  /**
   * Get specific board by ID
   * @param {number} boardId - The ID of the board to fetch
   * @returns {Promise<Object>} Board details with columns
   */
  getBoardById: async (boardId) => {
    const query = `
      query ($boardId: ID!) {
        boards(ids: [$boardId]) {
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
    const response = await CustomizationData.executeQuery(query, { boardId });
    return response.data.boards[0];
  },

  /**
   * Get items from a specific board
   * @param {number} boardId - The ID of the board
   * @param {number} [limit=25] - Number of items to fetch
   * @param {string} [cursor] - Pagination cursor
   * @returns {Promise<Object>} Items with pagination info
   */
  getBoardItems: async (boardId, limit = 25, cursor = null) => {
    const query = `
      query ($boardId: ID!, $limit: Int!) {
        boards(ids: [$boardId]) {
          items_page(limit: $limit) {
            cursor
            items {
              id
              name
              column_values {
                id
                text
                type
              }
            }
          }
        }
      }
    `;
    const response = await CustomizationData.executeQuery(query, {
      boardId,
      limit,
    });
    return response.data.boards[0].items_page;
  },
};

export default CustomizationData;
