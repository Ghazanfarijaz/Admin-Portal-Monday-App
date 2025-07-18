import {
  Modal,
  ModalHeader,
  ModalContent,
  ModalBasicLayout,
} from "@vibe/core/next";
import { useState } from "react";
import FileUpload from "./FileUpload";
import UserTablePreview from "./UserTablePreview";
import { useMutation } from "@tanstack/react-query";

export const ImportUsersPopup = ({ isModalOpen, onCloseModal }) => {
  const [users, setUsers] = useState([]);

  const handleUpload = (parsedData) => {
    setUsers(parsedData);
  };

  const handleRemoveUser = (index) => {
    setUsers((prev) => prev.filter((_, i) => i !== index));
  };

  // add Imported Users - Mutation
  const addImportedUsers = useMutation({});

  return (
    <Modal
      id="import-users-modal"
      show={isModalOpen}
      size="large"
      onClose={() => {
        setUsers([]);
        onCloseModal();
      }}
    >
      <ModalBasicLayout>
        <ModalHeader
          title="Import Users"
          description={
            <p className="text-gray-500">
              Make sure your Excel file has 3 columns: "Name", "Email",
              "Password"
            </p>
          }
        />
        <ModalContent className="flex flex-col gap-6">
          {users.length > 0 ? (
            <UserTablePreview users={users} onRemove={handleRemoveUser} />
          ) : (
            <FileUpload onUpload={handleUpload} />
          )}
          <div className="w-full md:px-[80px] lg:px-[120px] flex justify-center gap-6">
            <button
              className="flex-1 p-[8px_12px] rounded-[4px] font-medium text-base bg-[#007F9B] text-white border-2 border-[#007F9B]"
              onClick={() => addImportedUsers.mutate()}
            >
              Confirm
            </button>
            <button
              className="flex-1 p-[8px_12px] rounded-[4px] font-medium text-base text-[#007F9B] bg-white border-2 border-[#007F9B]"
              onClick={() => {
                setUsers([]);
                onCloseModal();
              }}
            >
              Cancel
            </button>
          </div>
        </ModalContent>
      </ModalBasicLayout>
    </Modal>
  );
};
