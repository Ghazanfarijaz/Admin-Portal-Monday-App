import { Group } from "@mantine/core";
import React from "react";
import imageCompression from "browser-image-compression";

const LogoInput = ({ value, onLogoChange }) => {
  const [logo, setLogo] = React.useState(null);
  const [dragActive, setDragActive] = React.useState(false);

  React.useEffect(() => {
    if (value) {
      // Check if the value is a valid URL
      if (value instanceof Blob) {
        const imageURL = URL.createObjectURL(value);
        setLogo(imageURL);
      } else {
        setLogo(value);
      }
    }
  }, [value]);

  const handleUploadImage = async (imageFile) => {
    const options = {
      maxSizeMB: 0.1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    if (!imageFile) {
      console.error("No image file provided");
      return;
    }

    try {
      const compressedFile = await imageCompression(imageFile, options);
      const imageURL = URL.createObjectURL(compressedFile);
      setLogo(imageURL);

      onLogoChange(compressedFile);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Group gap={8} className="!flex-col !items-start">
      <p className="text-gray-800 font-semibold text-lg">
        {logo ? "Logo" : "Upload Logo"}
      </p>

      <div className="flex items-center gap-4 w-full">
        {logo && (
          <img
            src={logo}
            alt="Board logo"
            className="w-[120px] h-[120px] object-cover rounded-lg"
          />
        )}
        <input
          id="logo-input"
          type="file"
          accept="image/*"
          onChange={async (e) => handleUploadImage(e.target.files[0])}
          onDragEnter={() => setDragActive(true)}
          onDragLeave={() => setDragActive(false)}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (e.type === "dragenter" || e.type === "dragover") {
              setDragActive(true);
            } else if (e.type === "dragleave") {
              setDragActive(false);
            }
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(false);
            if (e.dataTransfer.files.length === 0) return;

            // Handle file drop
            handleUploadImage(e.dataTransfer.files[0]);
          }}
          hidden
        />
        <label
          htmlFor="logo-input"
          className={`${
            logo
              ? "bg-[#007F9B] text-white px-4 py-2 rounded-md hover:bg-[#20768a] transition-colors"
              : `w-full max-w-[330px] h-[120px] rounded-3xl border-2 border-dashed ${
                  dragActive ? "border-[#007F9B]" : "border-gray-300"
                } flex items-center justify-center`
          } cursor-pointer`}
        >
          {logo ? (
            <span className="text-center">Change Logo</span>
          ) : (
            <span className="text-gray-400 text-center">
              Click to browse or
              <br /> drag and drop your files
            </span>
          )}
        </label>
      </div>
    </Group>
  );
};

export default LogoInput;
