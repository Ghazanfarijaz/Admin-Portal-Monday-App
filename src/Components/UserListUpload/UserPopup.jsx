import { useModal } from "../../context/ModalContext";
import {
  Modal,
  ModalHeader,
  ModalContent,
  ModalBasicLayout,
} from "@vibe/core/next";
import { useState } from "react";
import FileUpload from "./FileUpload";
import UserTablePreview from "./UserTablePreview";

export const UserPopup = () => {
  const { uploadUserModal, setUploadUserModal } = useModal();
  const [users, setUsers] = useState([]);

  const handleUpload = (parsedData) => {
    setUsers(parsedData);
  };

  const handleRemoveUser = (index) => {
    setUsers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleConfirm = () => {
    console.log("Selected Users:", users);
    setUploadUserModal(false);
  };

  const handleCancel = () => {
    setUsers([]);
    setUploadUserModal(false);
  };

  return (
    <>
      <button onClick={() => setUploadUserModal(true)}>Upload Users</button>

      <Modal
        id="modal-basic-large"
        show={uploadUserModal}
        size="large"
        onClose={handleCancel}
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
            {users.length > 0 ? (
              <div className="mt-6">
                <UserTablePreview users={users} onRemove={handleRemoveUser} />
              </div>
            ) : (
              <FileUpload onUpload={handleUpload} />
            )}
            <div className="w-full md:px-[80px] lg:px-[120px] flex justify-center py-6 gap-6">
              <button
                className="flex-1 p-[8px_12px] rounded-[4px] font-medium text-base bg-[#007F9B] text-white border-2 border-[#007F9B]"
                onClick={handleConfirm}
              >
                Confirm
              </button>
              <button
                className="flex-1 p-[8px_12px] rounded-[4px] font-medium text-base text-[#007F9B] bg-white border-2 border-[#007F9B]"
                onClick={handleCancel}
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
