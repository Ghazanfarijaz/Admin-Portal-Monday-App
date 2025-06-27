import { useState } from "react";
import UsersList from "../../Components/UsersList.jsx";
import Configuration from "../../Components/Configuration.jsx";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("userData");

  return (
    <div className="flex flex-col gap-4 p-12 bg-white h-full w-full">
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
        ) : (
          <Configuration activeTab={activeTab} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
