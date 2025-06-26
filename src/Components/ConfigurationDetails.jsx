import { useState, useCallback, useEffect } from "react";
import CustomizationApi from "../api/CustomizationManagement";
import { useNotification } from "../Ui/Notification";

export default function ConfigurationDetails({
  onSave,
  onCancel,
  boardDetails,
  customization,
}) {
  const [formData, setFormData] = useState({
    boardId: customization?.boardId || "",
    boardName: customization?.boardName || "",
    fields: customization?.fields || [
      { columnId: "", columnName: "", isEditable: true },
    ],
    description: customization?.description || "Lorem ipsum dolor",
    subDomain: customization?.subDomain || "abc.subdomain.com",
    logo: customization?.logo || null,
    logoPreview: customization?.logo || null,
  });

  const [columns, setColumns] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [notifications, showNotification] = useNotification();

  useEffect(() => {
    if (formData.boardId && boardDetails) {
      const selectedBoard = boardDetails.find(
        (board) => board.id === formData.boardId
      );
      setColumns(selectedBoard?.columns || []);
      setFormData((prev) => ({
        ...prev,
        boardName: selectedBoard?.name || "",
      }));
    } else {
      setColumns([]);
    }
  }, [formData.boardId, boardDetails]);

  const handleApiError = (error, context) => {
    let errorMessage = `Failed to ${context}. Please try again.`;

    if (error.response) {
      errorMessage = `Server error: ${
        error.response.data.message || error.response.statusText
      }`;
    } else if (error.request) {
      errorMessage = "Network error - Could not connect to server";
    } else {
      errorMessage = `Error: ${error.message}`;
    }

    showNotification({
      type: "error",
      title: "Error",
      message: errorMessage,
      isPersistent: true,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFieldChange = (index, name, value) => {
    setFormData((prev) => {
      const updatedFields = [...prev.fields];
      updatedFields[index] = {
        ...updatedFields[index],
        [name]: value,
        ...(name === "columnId" && {
          columnName: columns.find((col) => col.id === value)?.title || "",
        }),
      };
      return {
        ...prev,
        fields: updatedFields,
      };
    });
  };

  const handleToggleChange = (index) => {
    setFormData((prev) => {
      const updatedFields = [...prev.fields];
      updatedFields[index] = {
        ...updatedFields[index],
        isEditable: !updatedFields[index].isEditable,
      };
      return {
        ...prev,
        fields: updatedFields,
      };
    });
  };

  const addNewField = () => {
    if (formData.fields.length >= 10) {
      showNotification({
        type: "warning",
        title: "Limit Reached",
        message: "Maximum of 10 fields allowed",
        duration: 3000,
      });
      return;
    }
    setFormData((prev) => ({
      ...prev,
      fields: [
        ...prev.fields,
        {
          columnId: "",
          columnName: "",
          isEditable: true,
        },
      ],
    }));
  };

  const removeField = (index) => {
    if (formData.fields.length <= 1) {
      showNotification({
        type: "warning",
        title: "Minimum Fields",
        message: "At least one field is required",
        duration: 3000,
      });
      return;
    }
    setFormData((prev) => {
      const updatedFields = [...prev.fields];
      updatedFields.splice(index, 1);
      return {
        ...prev,
        fields: updatedFields,
      };
    });
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    if (!file.type.startsWith("image/")) {
      showNotification({
        type: "error",
        title: "Invalid File",
        message: "Please select an image file",
        duration: 3000,
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      showNotification({
        type: "error",
        title: "File Too Large",
        message: "File size should be less than 2MB",
        duration: 3000,
      });
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      if (
        typeof event.target.result === "string" &&
        event.target.result.startsWith("data:image")
      ) {
        setFormData((prev) => ({
          ...prev,
          logo: event.target.result,
          logoPreview: event.target.result,
        }));
      } else {
        showNotification({
          type: "error",
          title: "Invalid Image",
          message: "The selected file is not a valid image",
          duration: 3000,
        });
      }
    };

    reader.onerror = () => {
      showNotification({
        type: "error",
        title: "Error",
        message: "Failed to read the image file",
        duration: 3000,
      });
    };

    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setFormData((prev) => ({
      ...prev,
      logo: null,
      logoPreview: null,
    }));
    showNotification({
      type: "info",
      title: "Logo Removed",
      message: "The logo has been removed",
      duration: 2000,
    });
  };

  const handleSubmit = async () => {
    try {
      // Validate fields
      const validFields = formData.fields.filter(
        (field) => field.columnId && field.columnName
      );
      if (validFields.length === 0) {
        showNotification({
          type: "error",
          title: "Validation Error",
          message: "Please select at least one field",
          isPersistent: true,
        });
        return;
      }

      // Validate subdomain format
      if (!/^[a-z0-9-]+(\.[a-z0-9-]+)*$/.test(formData.subDomain)) {
        showNotification({
          type: "error",
          title: "Invalid Subdomain",
          message:
            "Please enter a valid subdomain (e.g., 'tickets.example.com')",
          isPersistent: true,
        });
        return;
      }

      // Prepare payload
      const payload = {
        boardId: formData.boardId,
        boardName: formData.boardName,
        description: formData.description,
        subDomain: formData.subDomain,
        fields: validFields,
        logo: formData.logo || null,
      };

      // Call API
      await CustomizationApi.updateCustomization(payload);

      showNotification({
        type: "success",
        title: "Success",
        message: "Configuration saved successfully!",
      });

      onSave();
    } catch (error) {
      console.error("Update failed:", error);
      handleApiError(error, "save configuration");
    }
  };

  return (
    <div className="relative">
      {/* Render notifications */}
      {notifications}

      <div className="bg-white rounded shadow-sm border border-gray-200 p-6 max-w-4xl">
        <div className="space-y-8">
          {/* Board Section */}
          <div>
            <h2 className="text-gray-800 font-medium mb-3">Board</h2>
            <div className="w-1/2">
              <div className="relative">
                <select
                  name="boardId"
                  value={formData.boardId}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded p-2 pr-8 appearance-none bg-white"
                >
                  <option value="">Select Board</option>
                  {boardDetails?.map((board) => (
                    <option key={board.id} value={board.id}>
                      {board.name} (ID: {board.id})
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg
                    className="w-4 h-4 fill-current text-gray-500"
                    viewBox="0 0 20 20"
                  >
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>
            {formData.boardName && (
              <div className="mt-2 text-sm text-gray-600">
                Selected Board:{" "}
                <span className="font-medium">{formData.boardName}</span>
              </div>
            )}
          </div>

          {/* Fields Section */}
          <div>
            <h2 className="text-gray-800 font-medium mb-3">Fields</h2>

            {formData.fields.map((field, index) => (
              <div
                key={index}
                className="mb-4 p-3 border border-gray-100 rounded"
              >
                <div className="flex items-center mb-2">
                  <div className="w-1/2 relative mr-4">
                    <select
                      name="columnId"
                      value={field.columnId}
                      onChange={(e) =>
                        handleFieldChange(index, "columnId", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded p-2 pr-8 appearance-none bg-white"
                      disabled={!formData.boardId}
                    >
                      <option value="">Select Field</option>
                      {columns.map((column) => (
                        <option key={column.id} value={column.id}>
                          {column.title} (ID: {column.id})
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg
                        className="w-4 h-4 fill-current text-gray-500"
                        viewBox="0 0 20 20"
                      >
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-700">Editable</span>
                    <button
                      type="button"
                      onClick={() => handleToggleChange(index)}
                      className={`relative inline-flex items-center h-6 rounded-full w-11 ${
                        field.isEditable ? "bg-blue-500" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${
                          field.isEditable ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                  {formData.fields.length > 1 && (
                    <button
                      onClick={() => removeField(index)}
                      className="ml-2 text-red-500 hover:text-red-700"
                      title="Remove field"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  )}
                </div>
                {field.columnId && (
                  <div className="text-sm text-gray-600">
                    Selected Field:{" "}
                    <span className="font-medium">{field.columnName}</span>
                  </div>
                )}
              </div>
            ))}

            <div className="flex items-center text-blue-500">
              <button
                onClick={addNewField}
                disabled={formData.fields.length >= 10 || !formData.boardId}
                className="flex items-center disabled:opacity-50"
              >
                <span className="mr-1 text-xl font-medium">+</span>
                <span className="cursor-pointer">
                  Add Field ({formData.fields.length}/10)
                </span>
              </button>
            </div>
          </div>

          {/* Upload Logo Section */}
          <div>
            <h2 className="text-gray-800 font-medium mb-3">Upload Logo</h2>
            <div
              className={`border-2 border-dashed rounded-md p-6 text-center relative ${
                dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="logo-upload"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              {formData.logoPreview ? (
                <div className="flex flex-col items-center">
                  <img
                    src={formData.logoPreview}
                    alt="Logo preview"
                    className="max-h-32 max-w-full mb-4"
                  />
                  <button
                    type="button"
                    onClick={removeLogo}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove Logo
                  </button>
                </div>
              ) : (
                <label htmlFor="logo-upload" className="cursor-pointer">
                  <div className="text-gray-500 mb-2">
                    <svg
                      className="w-12 h-12 mx-auto"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="text-gray-500">
                    Click to browse or
                    <br />
                    drag and drop your files
                  </div>
                  <div className="text-gray-400 text-sm mt-2">
                    PNG, JPG up to 2MB
                  </div>
                </label>
              )}
            </div>
          </div>

          {/* Description Section */}
          <div>
            <h2 className="text-gray-800 font-medium mb-3">Description</h2>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="border border-gray-300 rounded p-2 w-full h-24"
            />
          </div>

          {/* Sub-Domain Section */}
          <div>
            <h2 className="text-gray-800 font-medium mb-3">Sub-Domain</h2>
            <input
              type="text"
              name="subDomain"
              value={formData.subDomain}
              onChange={handleInputChange}
              className="border border-gray-300 rounded p-2 w-full"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={handleSubmit}
              className="bg-[#007F9B] text-white font-medium px-4 py-2 rounded hover:bg-[#007F9B]/80"
            >
              Save Changes
            </button>
            <button
              onClick={onCancel}
              className="border border-gray-300 text-gray-700 font-medium px-4 py-2 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
