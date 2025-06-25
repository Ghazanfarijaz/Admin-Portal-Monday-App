import axios from "axios";

// const API_BASE_URL = import.meta.env.VITE_DEPLOYED_API_BASE_URL;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const CredentialApi = {
  /**
   * Get all credentials (requires authentication)
   * @returns {Promise<Array>} Array of credential objects
   */
  getAllCredentials: async () => {
    try {
      const response = await api.get("/credentials/");
      return response.data;
    } catch (error) {
      console.error("Error fetching credentials:", error);
      throw error;
    }
  },

  /**
   * Get a specific credential by email
   * @param {string} email
   * @returns {Promise<Object>} Credential object
   */
  getCredential: async (email) => {
    try {
      const response = await api.get(
        `/credentials/${encodeURIComponent(email)}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching credential:", error);
      throw error;
    }
  },

  /**
   * Add a new credential (public endpoint)
   * @param {Object} credentialData
   * @param {string} credentialData.name
   * @param {string} credentialData.email
   * @param {string} credentialData.password
   * @returns {Promise<Object>} Created credential (without password)
   */
  addCredential: async (credentialData) => {
    try {
      const response = await api.post("/credentials/", credentialData);
      return response.data;
    } catch (error) {
      console.error("Error adding credential:", error);
      throw error;
    }
  },

  /**
   * Update an existing credential (requires authentication)
   * @param {string} email
   * @param {Object} updateData
   * @param {string} [updateData.name]
   * @param {string} [updateData.password]
   * @returns {Promise<Object>} Updated credential (without password)
   */
  updateCredential: async (email, updateData) => {
    try {
      const response = await api.put(
        `/credentials/${encodeURIComponent(email)}`,
        updateData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating credential:", error);
      throw error;
    }
  },

  /**
   * Delete a credential (requires authentication)
   * @param {string} email
   * @returns {Promise<boolean>} True if deletion was successful
   */
  deleteCredential: async (email) => {
    try {
      await api.delete(`/credentials/${encodeURIComponent(email)}`);
      return true;
    } catch (error) {
      console.error("Error deleting credential:", error);
      throw error;
    }
  },
};

export default CredentialApi;
