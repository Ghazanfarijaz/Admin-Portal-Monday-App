import { useState } from "react";

export default function Configuration({ onEdit, customization }) {
  console.log("Configuration customization:", customization);

  if (!customization) {
    return (
      <div className="bg-white rounded shadow-sm border border-gray-200 p-6 max-w-4xl">
        <div className="space-y-8">
          <p>Loading customization data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded shadow-sm border border-gray-200 p-6 max-w-4xl ">
      <div className="space-y-8">
        {/* Board Section */}
        <div>
          <h2 className="text-gray-800 font-medium mb-3">Board</h2>
          <div className="flex">
            <div className="w-1/2 pr-2">
              <div className="flex border border-gray-300 rounded">
                <div className="p-2 flex-grow">{customization.boardName}</div>
                <div className="p-2 text-gray-400 border-l border-gray-300">
                  Board
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fields Section */}
        <div>
          <h2 className="text-gray-800 font-medium mb-3">Fields</h2>
          <div className="space-y-2">
            {customization.fields?.map((field) => (
              <div key={field.columnId} className="w-1/2 pr-2">
                <div className="flex border border-gray-300 rounded">
                  <div className="p-2 flex-grow">{field.columnName}</div>
                  <div className="p-2 text-gray-400 border-l border-gray-300">
                    Field From Board
                  </div>
                </div>
                {field.isEditable && (
                  <div className="text-sm text-gray-500 mt-1">(Editable)</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Logo Section */}
        <div>
          <h2 className="text-gray-800 font-medium mb-3">Logo</h2>
          {customization.logo ? (
            <div className="w-24 h-24 rounded overflow-hidden">
              <img
                // src={`data:image/png;base64,${customization.logo}`}
                src={customization.logo}
                alt="Board logo"
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="w-24 h-24 bg-red-500 rounded flex items-center justify-center">
              <svg
                width="60"
                height="60"
                viewBox="0 0 60 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M30 10C25 10 20 15 18 30C16 15 10 15 10 25C10 35 20 45 30 50C40 45 50 35 50 25C50 15 44 15 42 30C40 15 35 10 30 10Z"
                  fill="white"
                />
                <circle cx="20" cy="38" r="8" fill="white" />
              </svg>
            </div>
          )}
        </div>

        {/* Description Section */}
        <div>
          <h2 className="text-gray-800 font-medium mb-3">Description</h2>
          <div className="border border-gray-300 rounded p-2 w-full h-24">
            {customization.description || "Lorem ipsum dolor"}
          </div>
        </div>

        {/* Sub-Domain Section */}
        <div>
          <h2 className="text-gray-800 font-medium mb-3">Sub-Domain</h2>
          <div className="border border-gray-300 rounded p-2 w-full">
            {customization.subDomain || "abc.subdomain.com"}
          </div>
        </div>

        {/* Edit Button */}
        <div>
          <button
            onClick={onEdit}
            className="bg-[#007F9B] text-white font-medium px-4 py-2 rounded hover:bg-[#007F9B]/80"
          >
            Edit Details
          </button>
        </div>
      </div>
    </div>
  );
}
