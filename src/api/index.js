import axiosInstance from "../utils/axiosInstance";

const CredentialApi = {
  getAllCredentials: async () => {
    try {
      const response = await axiosInstance.get("/credentials/");
      return response.data;
    } catch (error) {
      console.error("Error fetching credentials:", error);
      throw error;
    }
  },

  getCredential: async (email) => {
    try {
      const response = await axiosInstance.get(
        `/credentials/${encodeURIComponent(email)}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching credential:", error);
      throw error;
    }
  },

  addCredential: async (credentialData) => {
    try {
      const response = await axiosInstance.post(
        "/credentials/",
        credentialData
      );
      return response.data;
    } catch (error) {
      console.error("Error adding credential:", error);
      throw error;
    }
  },

  updateCredential: async (email, updateData) => {
    try {
      const response = await axiosInstance.put(
        `/credentials/${encodeURIComponent(email)}`,
        updateData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating credential:", error);
      throw error;
    }
  },

  deleteCredential: async (email) => {
    try {
      await axiosInstance.delete(`/credentials/${encodeURIComponent(email)}`);
      return true;
    } catch (error) {
      console.error("Error deleting credential:", error);
      throw error;
    }
  },
};

export default CredentialApi;
