import { Group, Loader } from "@mantine/core";
import React from "react";
import imageCompression from "browser-image-compression";

const LogoInput = ({ value, onLogoChange }) => {
  const [logo, setLogo] = React.useState(null);
  const [dragActive, setDragActive] = React.useState(false);
  const [isCompressing, setIsCompressing] = React.useState(false);

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

    // Check if the file is an image
    if (!imageFile.type.startsWith("image/")) {
      console.error("File is not an image");
      return;
    }

    // Check if the file size exceeds 5MB
    if (imageFile.size > 5 * 1024 * 1024) {
      console.error("File size exceeds 5MB limit");
      return;
    }

    try {
      setIsCompressing(true);
      const compressedFile = await imageCompression(imageFile, options);
      const imageURL = URL.createObjectURL(compressedFile);
      setLogo(imageURL);

      onLogoChange(compressedFile);
    } catch (error) {
      console.log(error);
    } finally {
      setIsCompressing(false);

      // Clean up the object URL to avoid memory leaks
      if (logo) {
        URL.revokeObjectURL(logo);
      }
    }
  };

  return (
    <Group gap={8} className="!flex-col !items-start">
      <p className="text-gray-800 font-semibold text-lg">
        {logo ? "Logo" : "Upload Logo"}
      </p>

      <div className="flex items-center gap-4 w-full relative">
        {logo && (
          <div>
            <img
              src={logo}
              alt="Board logo"
              className="w-[120px] h-[120px] object-cover rounded-lg"
            />
          </div>
        )}
        {isCompressing && (
          <div className="w-[120px] h-[120px] object-cover rounded-lg absolute top-0 left-0 flex justify-center items-center bg-black/30 backdrop-blur-sm">
            <Loader size="sm" />
          </div>
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
        {isCompressing ? (
          <div className="bg-[#007f9b6b] text-white px-4 py-2 rounded-md cursor-not-allowed">
            Loading...
          </div>
        ) : (
          <label
            htmlFor="logo-input"
            className={`${
              logo
                ? "bg-[#007F9B] text-white px-4 py-2 rounded-md hover:bg-[#20768a] transition-colors"
                : `w-[330px] h-[120px] rounded-3xl border-2 border-dashed ${
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
        )}
      </div>
      <span className="text-xs text-gray-500">
        (Max size: 5MB, Recommended size: 540x540 px)
      </span>
    </Group>
  );
};

export default LogoInput;
