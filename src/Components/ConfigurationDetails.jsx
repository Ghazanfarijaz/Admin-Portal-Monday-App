// import { useState, useCallback } from "react";

// export default function ConfigurationDetails({ onSave, onCancel }) {
//   const [formData, setFormData] = useState({
//     board: "",
//     field: "",
//     isEditable: true,
//     description: "Lorem ipsum dolor",
//     subDomain: "abc.subdomain.com",
//     logo: null,
//     logoPreview: null,
//   });
//   const [dragActive, setDragActive] = useState(false);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleToggleChange = () => {
//     setFormData({
//       ...formData,
//       isEditable: !formData.isEditable,
//     });
//   };

//   const handleDrag = useCallback((e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (e.type === "dragenter" || e.type === "dragover") {
//       setDragActive(true);
//     } else if (e.type === "dragleave") {
//       setDragActive(false);
//     }
//   }, []);

//   const handleDrop = useCallback((e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);
//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       handleFile(e.dataTransfer.files[0]);
//     }
//   }, []);

//   const handleFileChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       handleFile(e.target.files[0]);
//     }
//   };

//   const handleFile = (file) => {
//     // Check if file is an image
//     if (!file.type.match("image.*")) {
//       alert("Please select an image file");
//       return;
//     }

//     // Check file size (e.g., 2MB max)
//     if (file.size > 2 * 1024 * 1024) {
//       alert("File size should be less than 2MB");
//       return;
//     }

//     // Create preview URL
//     const previewUrl = URL.createObjectURL(file);

//     setFormData({
//       ...formData,
//       logo: file,
//       logoPreview: previewUrl,
//     });
//   };

//   const removeLogo = () => {
//     if (formData.logoPreview) {
//       URL.revokeObjectURL(formData.logoPreview);
//     }
//     setFormData({
//       ...formData,
//       logo: null,
//       logoPreview: null,
//     });
//   };

//   return (
//     <div className="bg-white rounded shadow-sm border border-gray-200 p-6 max-w-4xl">
//       <div className="space-y-8">
//         {/* Board Section */}
//         <div>
//           <h2 className="text-gray-800 font-medium mb-3">Board</h2>
//           <div className="w-1/2">
//             <div className="relative">
//               <select
//                 name="board"
//                 value={formData.board}
//                 onChange={handleInputChange}
//                 className="w-full border border-gray-300 rounded p-2 pr-8 appearance-none bg-white"
//               >
//                 <option value="">Select Board</option>
//                 <option value="board1">Board 1</option>
//                 <option value="board2">Board 2</option>
//               </select>
//               <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
//                 <svg
//                   className="w-4 h-4 fill-current text-gray-500"
//                   viewBox="0 0 20 20"
//                 >
//                   <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
//                 </svg>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Fields Section */}
//         <div>
//           <h2 className="text-gray-800 font-medium mb-3">Fields</h2>
//           <div className="flex items-center mb-2">
//             <div className="w-1/2 relative mr-4">
//               <select
//                 name="field"
//                 value={formData.field}
//                 onChange={handleInputChange}
//                 className="w-full border border-gray-300 rounded p-2 pr-8 appearance-none bg-white"
//               >
//                 <option value="">Select Field From Board</option>
//                 <option value="field1">Field 1</option>
//                 <option value="field2">Field 2</option>
//               </select>
//               <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
//                 <svg
//                   className="w-4 h-4 fill-current text-gray-500"
//                   viewBox="0 0 20 20"
//                 >
//                   <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
//                 </svg>
//               </div>
//             </div>
//             <div className="flex items-center">
//               <span className="mr-2 text-gray-700">Editable</span>
//               <button
//                 type="button"
//                 onClick={handleToggleChange}
//                 className={`relative inline-flex items-center h-6 rounded-full w-11 ${
//                   formData.isEditable ? "bg-blue-500" : "bg-gray-300"
//                 }`}
//               >
//                 <span
//                   className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${
//                     formData.isEditable ? "translate-x-6" : "translate-x-1"
//                   }`}
//                 />
//               </button>
//             </div>
//           </div>
//           <div className="flex items-center text-blue-500">
//             <span className="mr-1 text-xl font-medium">+</span>
//             <span className="cursor-pointer">Add Field (1/10)</span>
//           </div>
//         </div>

//         {/* Upload Logo Section */}
//         <div>
//           <h2 className="text-gray-800 font-medium mb-3">Upload Logo</h2>
//           <div
//             className={`border-2 border-dashed rounded-md p-6 text-center relative ${
//               dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
//             }`}
//             onDragEnter={handleDrag}
//             onDragLeave={handleDrag}
//             onDragOver={handleDrag}
//             onDrop={handleDrop}
//           >
//             <input
//               type="file"
//               id="logo-upload"
//               accept="image/*"
//               className="hidden"
//               onChange={handleFileChange}
//             />

//             {formData.logoPreview ? (
//               <div className="flex flex-col items-center">
//                 <img
//                   src={formData.logoPreview}
//                   alt="Logo preview"
//                   className="max-h-32 max-w-full mb-4"
//                 />
//                 <button
//                   type="button"
//                   onClick={removeLogo}
//                   className="text-red-500 hover:text-red-700 text-sm"
//                 >
//                   Remove Logo
//                 </button>
//               </div>
//             ) : (
//               <label htmlFor="logo-upload" className="cursor-pointer">
//                 <div className="text-gray-500 mb-2">
//                   <svg
//                     className="w-12 h-12 mx-auto"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
//                     />
//                   </svg>
//                 </div>
//                 <div className="text-gray-500">
//                   Click to browse or
//                   <br />
//                   drag and drop your files
//                 </div>
//                 <div className="text-gray-400 text-sm mt-2">
//                   PNG, JPG up to 2MB
//                 </div>
//               </label>
//             )}
//           </div>
//         </div>

//         {/* Description Section */}
//         <div>
//           <h2 className="text-gray-800 font-medium mb-3">Description</h2>
//           <textarea
//             name="description"
//             value={formData.description}
//             onChange={handleInputChange}
//             className="border border-gray-300 rounded p-2 w-full h-24"
//           />
//         </div>

//         {/* Sub-Domain Section */}
//         <div>
//           <h2 className="text-gray-800 font-medium mb-3">Sub-Domain</h2>
//           <input
//             type="text"
//             name="subDomain"
//             value={formData.subDomain}
//             onChange={handleInputChange}
//             className="border border-gray-300 rounded p-2 w-full"
//           />
//         </div>

//         {/* Action Buttons */}
//         <div className="flex space-x-4">
//           <button
//             onClick={() => onSave(formData)}
//             className="bg-[#007F9B] text-white font-medium px-4 py-2 rounded hover:bg-[#007F9B]/80"
//           >
//             Save Changes
//           </button>
//           <button
//             onClick={onCancel}
//             className="border border-gray-300 text-gray-700 font-medium px-4 py-2 rounded hover:bg-gray-50"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// import { useState, useCallback, useEffect } from "react";

// export default function ConfigurationDetails({
//   onSave,
//   onCancel,
//   boardDetails,
// }) {
//   // Initial form data with fields array
//   const [formData, setFormData] = useState({
//     board: "",
//     fields: [{ column: "", isEditable: true }],
//     description: "Lorem ipsum dolor",
//     subDomain: "abc.subdomain.com",
//     logo: null,
//     logoPreview: null,
//   });

//   const [columns, setColumns] = useState([]);
//   const [dragActive, setDragActive] = useState(false);

//   console.log("formData", formData);

//   // Update columns when board selection changes
//   useEffect(() => {
//     if (formData.board && boardDetails) {
//       const selectedBoard = boardDetails.find(
//         (board) => board.id === formData.board
//       );
//       setColumns(selectedBoard?.columns || []);
//       // Reset fields when board changes
//       setFormData((prev) => ({
//         ...prev,
//         fields: [{ column: "", isEditable: true }],
//       }));
//     } else {
//       setColumns([]);
//     }
//   }, [formData.board, boardDetails]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleFieldChange = (index, name, value) => {
//     setFormData((prev) => {
//       const updatedFields = [...prev.fields];
//       updatedFields[index] = {
//         ...updatedFields[index],
//         [name]: value,
//       };
//       return {
//         ...prev,
//         fields: updatedFields,
//       };
//     });
//   };

//   const handleToggleChange = (index) => {
//     setFormData((prev) => {
//       const updatedFields = [...prev.fields];
//       updatedFields[index] = {
//         ...updatedFields[index],
//         isEditable: !updatedFields[index].isEditable,
//       };
//       return {
//         ...prev,
//         fields: updatedFields,
//       };
//     });
//   };

//   const addNewField = () => {
//     if (formData.fields.length >= 10) return;
//     setFormData((prev) => ({
//       ...prev,
//       fields: [...prev.fields, { column: "", isEditable: true }],
//     }));
//   };

//   const removeField = (index) => {
//     if (formData.fields.length <= 1) return;
//     setFormData((prev) => {
//       const updatedFields = [...prev.fields];
//       updatedFields.splice(index, 1);
//       return {
//         ...prev,
//         fields: updatedFields,
//       };
//     });
//   };

//   const handleDrag = useCallback((e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (e.type === "dragenter" || e.type === "dragover") {
//       setDragActive(true);
//     } else if (e.type === "dragleave") {
//       setDragActive(false);
//     }
//   }, []);

//   const handleDrop = useCallback((e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);
//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       handleFile(e.dataTransfer.files[0]);
//     }
//   }, []);

//   const handleFileChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       handleFile(e.target.files[0]);
//     }
//   };

//   const handleFile = (file) => {
//     if (!file.type.match("image.*")) {
//       alert("Please select an image file");
//       return;
//     }

//     if (file.size > 2 * 1024 * 1024) {
//       alert("File size should be less than 2MB");
//       return;
//     }

//     const previewUrl = URL.createObjectURL(file);
//     setFormData((prev) => ({
//       ...prev,
//       logo: file,
//       logoPreview: previewUrl,
//     }));
//   };

//   const removeLogo = () => {
//     if (formData.logoPreview) {
//       URL.revokeObjectURL(formData.logoPreview);
//     }
//     setFormData((prev) => ({
//       ...prev,
//       logo: null,
//       logoPreview: null,
//     }));
//   };

//   const handleSubmit = () => {
//     const validFields = formData.fields.filter((field) => field.column);
//     if (validFields.length === 0) {
//       alert("Please select at least one field");
//       return;
//     }
//     onSave({ ...formData, fields: validFields });
//   };

//   return (
//     <div className="bg-white rounded shadow-sm border border-gray-200 p-6 max-w-4xl">
//       <div className="space-y-8">
//         {/* Board Section */}
//         <div>
//           <h2 className="text-gray-800 font-medium mb-3">Board</h2>
//           <div className="w-1/2">
//             <div className="relative">
//               <select
//                 name="board"
//                 value={formData.board}
//                 onChange={handleInputChange}
//                 className="w-full border border-gray-300 rounded p-2 pr-8 appearance-none bg-white"
//               >
//                 <option value="">Select Board</option>
//                 {boardDetails?.map((board) => (
//                   <option key={board.id} value={board.id}>
//                     {board.name}
//                     {console.log("board", board.name)}
//                   </option>
//                 ))}
//               </select>
//               <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
//                 <svg
//                   className="w-4 h-4 fill-current text-gray-500"
//                   viewBox="0 0 20 20"
//                 >
//                   <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
//                 </svg>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Fields Section */}
//         <div>
//           <h2 className="text-gray-800 font-medium mb-3">Fields</h2>

//           {formData.fields.map((field, index) => (
//             <div key={index} className="flex items-center mb-2">
//               <div className="w-1/2 relative mr-4">
//                 <select
//                   name="field"
//                   value={field.column}
//                   onChange={(e) =>
//                     handleFieldChange(index, "column", e.target.value)
//                   }
//                   className="w-full border border-gray-300 rounded p-2 pr-8 appearance-none bg-white"
//                   disabled={!formData.board}
//                 >
//                   <option value="">Select Field From Board</option>
//                   {columns.map((column) => (
//                     <option key={column.id} value={column.id}>
//                       {column.title}
//                     </option>
//                   ))}
//                 </select>
//                 <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
//                   <svg
//                     className="w-4 h-4 fill-current text-gray-500"
//                     viewBox="0 0 20 20"
//                   >
//                     <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
//                   </svg>
//                 </div>
//               </div>
//               <div className="flex items-center">
//                 <span className="mr-2 text-gray-700">Editable</span>
//                 <button
//                   type="button"
//                   onClick={() => handleToggleChange(index)}
//                   className={`relative inline-flex items-center h-6 rounded-full w-11 ${
//                     field.isEditable ? "bg-blue-500" : "bg-gray-300"
//                   }`}
//                 >
//                   <span
//                     className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${
//                       field.isEditable ? "translate-x-6" : "translate-x-1"
//                     }`}
//                   />
//                 </button>
//               </div>
//               {formData.fields.length > 1 && (
//                 <button
//                   onClick={() => removeField(index)}
//                   className="ml-2 text-red-500 hover:text-red-700"
//                   title="Remove field"
//                 >
//                   <svg
//                     className="w-5 h-5"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//                     />
//                   </svg>
//                 </button>
//               )}
//             </div>
//           ))}

//           <div className="flex items-center text-blue-500">
//             <button
//               onClick={addNewField}
//               disabled={formData.fields.length >= 10 || !formData.board}
//               className="flex items-center disabled:opacity-50"
//             >
//               <span className="mr-1 text-xl font-medium">+</span>
//               <span className="cursor-pointer">
//                 Add Field ({formData.fields.length}/10)
//               </span>
//             </button>
//           </div>
//         </div>

//         {/* Upload Logo Section */}
//         <div>
//           <h2 className="text-gray-800 font-medium mb-3">Upload Logo</h2>
//           <div
//             className={`border-2 border-dashed rounded-md p-6 text-center relative ${
//               dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
//             }`}
//             onDragEnter={handleDrag}
//             onDragLeave={handleDrag}
//             onDragOver={handleDrag}
//             onDrop={handleDrop}
//           >
//             <input
//               type="file"
//               id="logo-upload"
//               accept="image/*"
//               className="hidden"
//               onChange={handleFileChange}
//             />

//             {formData.logoPreview ? (
//               <div className="flex flex-col items-center">
//                 <img
//                   src={formData.logoPreview}
//                   alt="Logo preview"
//                   className="max-h-32 max-w-full mb-4"
//                 />
//                 <button
//                   type="button"
//                   onClick={removeLogo}
//                   className="text-red-500 hover:text-red-700 text-sm"
//                 >
//                   Remove Logo
//                 </button>
//               </div>
//             ) : (
//               <label htmlFor="logo-upload" className="cursor-pointer">
//                 <div className="text-gray-500 mb-2">
//                   <svg
//                     className="w-12 h-12 mx-auto"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
//                     />
//                   </svg>
//                 </div>
//                 <div className="text-gray-500">
//                   Click to browse or
//                   <br />
//                   drag and drop your files
//                 </div>
//                 <div className="text-gray-400 text-sm mt-2">
//                   PNG, JPG up to 2MB
//                 </div>
//               </label>
//             )}
//           </div>
//         </div>

//         {/* Description Section */}
//         <div>
//           <h2 className="text-gray-800 font-medium mb-3">Description</h2>
//           <textarea
//             name="description"
//             value={formData.description}
//             onChange={handleInputChange}
//             className="border border-gray-300 rounded p-2 w-full h-24"
//           />
//         </div>

//         {/* Sub-Domain Section */}
//         <div>
//           <h2 className="text-gray-800 font-medium mb-3">Sub-Domain</h2>
//           <input
//             type="text"
//             name="subDomain"
//             value={formData.subDomain}
//             onChange={handleInputChange}
//             className="border border-gray-300 rounded p-2 w-full"
//           />
//         </div>

//         {/* Action Buttons */}
//         <div className="flex space-x-4">
//           <button
//             onClick={handleSubmit}
//             className="bg-[#007F9B] text-white font-medium px-4 py-2 rounded hover:bg-[#007F9B]/80"
//           >
//             Save Changes
//           </button>
//           <button
//             onClick={onCancel}
//             className="border border-gray-300 text-gray-700 font-medium px-4 py-2 rounded hover:bg-gray-50"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useCallback, useEffect } from "react";
import CustomizationApi from "../Api/CustomizationManagement";

export default function ConfigurationDetails({
  onSave,
  onCancel,
  boardDetails,
  customization,
}) {
  // Initial form data with fields array
  // const [formData, setFormData] = useState({
  //   boardId: "",
  //   boardName: "",
  //   fields: [
  //     {
  //       columnId: "",
  //       columnName: "",
  //       isEditable: true,
  //     },
  //   ],
  //   description: "Lorem ipsum dolor",
  //   subDomain: "abc.subdomain.com",
  //   logo: null,
  //   logoPreview: null,
  // });

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
    // ? `data:image/png;base64,${customization.logo}`
    // : null,
  });

  const [columns, setColumns] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  console.log("formData", formData);

  // Update columns when board selection changes
  useEffect(() => {
    if (formData.boardId && boardDetails) {
      const selectedBoard = boardDetails.find(
        (board) => board.id === formData.boardId
      );
      setColumns(selectedBoard?.columns || []);
      // Reset fields and update board name when board changes
      setFormData((prev) => ({
        ...prev,
        boardName: selectedBoard?.name || "",
        fields: [
          {
            columnId: "",
            columnName: "",
            isEditable: true,
          },
        ],
      }));
    } else {
      setColumns([]);
    }
  }, [formData.boardId, boardDetails]);

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
        // When columnId changes, update columnName if the column exists
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
    if (formData.fields.length >= 10) return;
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
    if (formData.fields.length <= 1) return;
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
    if (!file.type.match("image.*")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("File size should be less than 2MB");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setFormData((prev) => ({
      ...prev,
      logo: file,
      logoPreview: previewUrl,
    }));
  };

  const removeLogo = () => {
    if (formData.logoPreview) {
      URL.revokeObjectURL(formData.logoPreview);
    }
    setFormData((prev) => ({
      ...prev,
      logo: null,
      logoPreview: null,
    }));
  };

  // const handleSubmit = () => {
  //   // Filter out any empty fields
  //   const validFields = formData.fields.filter(
  //     (field) => field.columnId && field.columnName
  //   );

  //   if (validFields.length === 0) {
  //     alert("Please select at least one field");
  //     return;
  //   }

  //   // Prepare the data for backend
  //   const submissionData = {
  //     boardId: formData.boardId,
  //     boardName: formData.boardName,
  //     fields: validFields.map((field) => ({
  //       columnId: field.columnId,
  //       columnName: field.columnName,
  //       isEditable: field.isEditable,
  //     })),
  //     logo: formData.logo,
  //     description: formData.description,
  //     subDomain: formData.subDomain,
  //   };

  //   onSave(submissionData);
  // };

  const handleSubmit = async () => {
    try {
      // Filter out empty fields
      const validFields = formData.fields.filter(
        (field) => field.columnId && field.columnName
      );

      if (validFields.length === 0) {
        alert("Please select at least one field");
        return;
      }

      // Prepare FormData for file upload
      const submissionData = new FormData();
      submissionData.append("boardId", formData.boardId);
      submissionData.append("boardName", formData.boardName);
      submissionData.append("description", formData.description);
      submissionData.append("subDomain", formData.subDomain);
      submissionData.append("fields", JSON.stringify(validFields));
      submissionData.append("logo", "nulll");
      // if (formData.logo) {
      //   submissionData.append("logo", formData.logo);
      // }

      // Call update API
      await CustomizationApi.updateCustomization(submissionData);

      // Notify parent to refresh data and exit edit mode
      onSave();
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to save changes. Please try again.");
    }
  };
  return (
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
  );
}
