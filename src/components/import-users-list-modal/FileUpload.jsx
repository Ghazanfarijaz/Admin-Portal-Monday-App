import { useRef, useState } from "react";
import { Text } from "@vibe/core";
import UploadDataIcon from "../../assets/icons/UploaddataIcon";
import { parseExcelFile } from "../../utils/parsExcel";
import { toast } from "sonner";

const FileUpload = ({ onUpload }) => {
  const fileInputRef = useRef(null);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

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
      if(parsedData.length === 0) {
        setError(
          "A valid Excel file containing 'name', 'email', and 'password' columns is required."
        );
        toast.error("A valid Excel file containing 'name', 'email', and 'password' columns is required.")
        return;
      }
      setSelectedFile(file);
      setError("");
      onUpload(parsedData);
    } catch (err) {
      console.error("Parse error:", err);
      setError("Failed to parse Excel file.");
    }
  };

  return (
    <div
      className="relative w-full h-[200px] flex items-center justify-center bg-[#E1EFF2] rounded-[4px] flex-col gap-3 cursor-pointer"
      onClick={() => fileInputRef.current.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        handleFile(e.dataTransfer.files[0]);
      }}
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
        onChange={(e) => handleFile(e.target.files[0])}
        className="hidden"
      />
      {selectedFile && (
        <Text className="text-sm text-gray-700 font-medium mt-2">
          Selected: {selectedFile.name}
        </Text>
      )}
      {error && (
        <Text className="text-sm text-red-600 font-medium mt-2">{error}</Text>
      )}
    </div>
  );
};

export default FileUpload;
