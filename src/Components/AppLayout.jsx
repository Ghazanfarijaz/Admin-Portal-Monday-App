import { useState, useEffect } from "react";
import Configuration from "./Configuration";
import ConfigurationDetails from "./ConfigurationDetails";
import customizationAPIs from "../api/customization.js";
import mondaySdk from "monday-sdk-js";
import UsersList from "./UsersList.jsx";
const monday = mondaySdk();

export default function AppLayout() {
  const [activeTab, setActiveTab] = useState("userData");
  const [isEditing, setIsEditing] = useState(false);
  const [boardDetails, setBoardDetails] = useState(null);
  const [customization, setCustomization] = useState(null); // New state for customization data

  // Fetch both board details and customization when Configuration tab is active
  useEffect(() => {
    if (activeTab === "configuration" && !isEditing) {
      GetBoardDetails();
      getCustomizationData(); // Fetch customization data
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, isEditing]);

  const GetBoardDetails = async () => {
    try {
      const response = await customizationAPIs.getAllBoards({
        monday,
      });
      console.log("get the board response:", response);

      if (!response) {
        throw new Error("No response from server");
      }

      setBoardDetails(response);
    } catch (error) {
      console.error("Failed to fetch board details:", error);
      handleApiError(error, "board details");
    }
  };

  // New function to fetch customization data
  const getCustomizationData = async () => {
    try {
      const response = await customizationAPIs.getCustomization();
      console.log("get customization response:", response);

      if (!response) {
        throw new Error("No customization data received");
      }

      setCustomization(response);
    } catch (error) {
      console.error("Failed to fetch customization:", error);
      handleApiError(error, "customization settings");
    }
  };

  // Generic error handler
  const handleApiError = (error, context) => {
    let errorMessage = `❌ Failed to fetch ${context}. Please try again.`;

    if (error.response) {
      errorMessage = `❌ Server error: ${
        error.response.data.message || error.response.statusText
      }`;
    } else if (error.request) {
      errorMessage = "❌ Network error - Could not connect to server";
    } else {
      errorMessage = `❌ Error: ${error.message}`;
    }

    alert(errorMessage);
  };

  const handleEditDetails = () => {
    setIsEditing(true);
  };

  const handleSaveChanges = () => {
    setIsEditing(false);
    // Refresh both board details and customization after saving
    GetBoardDetails();
    getCustomizationData();
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col gap-4 p-12 bg-white min-h-screen w-screen">
      {/* Top Header */}
      <div className="w-full flex items-center gap-4 bg-white pb-4 border-b">
        <button
          className={`p-[8px_12px] min-w-[130px] rounded-lg font-medium text-base ${
            activeTab === "userData"
              ? "bg-[#007F9B] text-white"
              : "text-[#007F9B] border border-[#007F9B] bg-white"
          }`}
          onClick={() => setActiveTab("userData")}
        >
          User Data
        </button>
        <button
          className={`p-[8px_12px] min-w-[130px] rounded-lg font-medium text-base ${
            activeTab === "configuration"
              ? "bg-[#007F9B] text-white"
              : "text-[#007F9B] border border-[#007F9B] bg-white"
          }`}
          onClick={() => setActiveTab("configuration")}
        >
          Configuration
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {activeTab === "userData" ? (
          <UsersList />
        ) : isEditing ? (
          <ConfigurationDetails
            onSave={handleSaveChanges}
            onCancel={handleCancel}
            boardDetails={boardDetails}
            customization={customization}
          />
        ) : (
          <Configuration
            onEdit={handleEditDetails}
            boardDetails={boardDetails}
            customization={customization}
          />
        )}
      </div>
    </div>
  );
}
