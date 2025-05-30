import { useState, useEffect } from "react";
import AddUser from "./AddUser";
import Configuration from "./Configuration";
import ConfigurationDetails from "./ConfigurationDetails";
import CustomizationData from "../Api/CustomizationData.jsx";
import CustomizationApi from "../Api/CustomizationManagement.jsx";

export default function AppLayout() {
  const [activeTab, setActiveTab] = useState("userData");
  const [isEditing, setIsEditing] = useState(false);
  const [boardDetails, setBoardDetails] = useState(null);
  const [customization, setCustomization] = useState(null); // New state for customization data

  console.log("boardDetails:", boardDetails);
  console.log("customization:", customization); // Log customization data

  // Fetch both board details and customization when Configuration tab is active
  useEffect(() => {
    if (activeTab === "configuration" && !isEditing) {
      GetBoardDetails();
      getCustomizationData(); // Fetch customization data
    }
  }, [activeTab, isEditing]);

  const GetBoardDetails = async () => {
    try {
      const response = await CustomizationData.getAllBoards();
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
      const response = await CustomizationApi.getCustomization();
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
    <div className="flex flex-col w-full min-h-screen bg-black-100">
      {/* Top Header */}
      <div className="w-full bg-white pb-2 pl-8">
        <div className="flex items-center pt-8 pb-4">
          <button
            className={`py-1 px-8 rounded-full mr-4 font-medium text-base ${
              activeTab === "userData"
                ? "bg-[#007F9B] text-white"
                : "text-[#007F9B] border border-[#007F9B] bg-white"
            }`}
            onClick={() => setActiveTab("userData")}
          >
            User Data
          </button>
          <button
            className={`py-1 px-8 rounded-full font-medium text-base ${
              activeTab === "configuration"
                ? "bg-[#007F9B] text-white"
                : "text-[#007F9B] border border-[#007F9B] bg-white"
            }`}
            onClick={() => setActiveTab("configuration")}
          >
            Configuration
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-0 pl-8">
        {activeTab === "userData" ? (
          <AddUser />
        ) : isEditing ? (
          <ConfigurationDetails
            onSave={handleSaveChanges}
            onCancel={handleCancel}
            boardDetails={boardDetails}
            customization={customization} // Pass customization to edit form
          />
        ) : (
          <Configuration
            onEdit={handleEditDetails}
            boardDetails={boardDetails}
            customization={customization} // Pass customization to view
          />
        )}
      </div>
    </div>
  );
}
