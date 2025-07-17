import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import UploadIcon  from "../assets/icons/UploadIcon"
import { useModal } from "../context/ModalContext";

const Dashboard = () => {
  const { uploadUserModal, setUploadUserModal } = useModal();
  const navigate = useNavigate();
  const activeTab = window.location.pathname.split("/")[1];
  return (
    <div className="flex flex-col gap-8 p-12 bg-white h-full w-full">
      {/* Top Header */}
      <div className="w-full max-w-4xl flex items-center justify-between gap-4 bg-white">
        <div className="flex gap-4">
          <button
            className={`p-[8px_12px] rounded-full font-medium text-base ${
              activeTab === ""
                ? "bg-[#007F9B] text-white"
                : "text-[#007F9B] bg-white hover:bg-gray-50"
            } border-2 border-[#007F9B] transition-all hover:shadow-lg duration-300`}
            onClick={() => navigate("/")}
          >
            User Data
          </button>
          <button
            className={`p-[8px_12px] rounded-full font-medium text-base ${
              activeTab === "configuration"
                ? "bg-[#007F9B] text-white"
                : "text-[#007F9B] bg-white hover:bg-gray-50"
            } border-2 border-[#007F9B] transition-all hover:shadow-lg duration-300`}
            onClick={() => navigate("/configuration")}
          >
            Configuration
          </button>
        </div>
        {activeTab === "" && (
          <button
            className={`p-[10px_16px] rounded-[4px] font-semibold text-base border-2  text-[#007F9B] bg-white hover:bg-gray-50 border-[#007F9B] transition-all hover:shadow-lg duration-300 flex gap-2 items-center`}
            onClick={() => setUploadUserModal(true)}
          >
            <UploadIcon className="text-[#007F9B] size-[20px]" />
            Upload Users
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
