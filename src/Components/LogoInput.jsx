import { Group } from "@mantine/core";
import React from "react";

const LogoInput = ({ value, onLogoChange }) => {
  const [logo, setLogo] = React.useState(null);
  const [dragActive, setDragActive] = React.useState(false);

  React.useEffect(() => {
    if (value) {
      setLogo(value);
    }
  }, [value]);

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
            className="w-[120px] h-[120px] object-contain rounded-lg"
          />
        )}
        <input
          id="logo-input"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                setLogo(reader.result);
                onLogoChange(reader.result);
              };
              reader.readAsDataURL(file);
            }
          }}
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
            const file = e.dataTransfer.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                setLogo(reader.result);
                onLogoChange(reader.result);
              };
              reader.readAsDataURL(file);
            }
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
