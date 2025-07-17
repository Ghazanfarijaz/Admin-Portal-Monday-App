import { useModal } from "../context/ModalContext";
import {
  Modal,
  ModalHeader,
  ModalContent,
  ModalBasicLayout,
} from "@vibe/core/next";
import { Text } from "@vibe/core";
import UploadDataIcon from "../assets/icons/UploaddataIcon";
import { useRef, useState } from "react";
import { parseExcelFile } from "../utils/parsExcel";


export const UserPopup = () => {
  const { uploadUserModal, setUploadUserModal } = useModal();
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");

const handleFile = async (file) => {
  const validTypes = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
  ];

  if (!file || !validTypes.includes(file.type)) {
    setError("Please upload a valid Excel file (.xlsx or .xls)");
    return;
  }

  try {
    const parsedData = await parseExcelFile(file);
    setSelectedFile(file);
    setError("");
    console.log("Parsed Excel Data:", parsedData);
  } catch (err) {
    console.error("Error parsing file:", err);
    setError("Failed to parse Excel file.");
  }
};


  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  return (
    <>
      <button onClick={() => setUploadUserModal(true)}>Large</button>

      <Modal
        id="modal-basic-large"
        show={uploadUserModal}
        size="large"
        onClose={() => setUploadUserModal(false)}
      >
        <ModalBasicLayout>
          <ModalHeader
            title="Import Users"
            description={
              <p className="mt-4 text-[16px]/[100%]">
                Make sure your Excel file has 3 columns: "Name", "Email",
                "Password"
              </p>
            }
          />

          <ModalContent>
            <div
              className="relative w-full h-[200px] flex items-center justify-center bg-[#E1EFF2] rounded-[4px] flex-col gap-3 cursor-pointer"
              onClick={handleBrowseClick}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <UploadDataIcon className="text-[#007F9B] size-[40px]" />
              <p className="text-[#007F9B] font-semibold text-[15px]/[160%] text-center">
                Click to browse or <br />
                drag and drop your Excel file
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xls,.xlsx"
                onChange={handleFileChange}
                className="hidden"
              />
              {selectedFile && (
                <Text className="text-sm text-gray-700 font-medium mt-2">
                  Selected: {selectedFile.name}
                </Text>
              )}
              {error && (
                <Text className="text-sm text-red-600 font-medium mt-2">
                  {error}
                </Text>
              )}
            </div>
            <div className="w-full md:px-[80px] lg:px-[120px] flex justify-center py-6 gap-6">
              <button
                className={`flex-1 p-[8px_12px] rounded-[4px] font-medium text-base bg-[#007F9B] text-white border-2 border-[#007F9B] transition-all hover:shadow-lg duration-300`}
                onClick={() => setUploadUserModal(false)}
              >
                Confirm
              </button>
              <button
                className={`flex-1 p-[8px_12px] rounded-[4px] font-medium text-base text-[#007F9B] bg-white hover:bg-gray-50 border-2 border-[#007F9B] transition-all hover:shadow-lg duration-300`}
                onClick={() => setUploadUserModal(false)}
              >
                Cancel
              </button>
            </div>
          </ModalContent>
        </ModalBasicLayout>
      </Modal>
    </>
  );
};
