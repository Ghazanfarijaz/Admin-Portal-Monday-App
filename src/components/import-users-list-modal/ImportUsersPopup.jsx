import {
  Modal,
  ModalHeader,
  ModalContent,
  ModalBasicLayout,
} from "@vibe/core/next";
import { useState } from "react";
import FileUpload from "./FileUpload";
import UserTablePreview from "./UserTablePreview";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAPIs } from "../../api/auth";
import mondaySdk from "monday-sdk-js";
import { userAPIs } from "../../api/users";
import { toast } from "sonner";
import { Loader } from "@mantine/core";

// Monday SDK initialization
const monday = mondaySdk();

export const ImportUsersPopup = ({ isModalOpen, onCloseModal }) => {
  // Hooks
  const queryClient = useQueryClient();

  // Local State
  const [users, setUsers] = useState([]);

  const handleUpload = (parsedData) => {
    setUsers(parsedData);
  };

  const handleRemoveUser = (index) => {
    setUsers((prev) => prev.filter((_, i) => i !== index));
  };

  // add Imported Users - Mutation
  const addImportedUsers = useMutation({
    mutationFn: async () => {
      const userSlug = await authAPIs.findUserSlug({ mondayAPI: monday });
      return userAPIs.addImportedUsersCredentials({
        slug: userSlug,
        usersData: users,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      toast.success("Success!", {
        description: "Users added successfully",
      });
      setUsers([]);
      onCloseModal();
    },
    onError: (error) => {
      toast.error("Error!", {
        description: error?.message || "Could not add users!",
      });
    },
  });

  return (
    <Modal
      id="import-users-modal"
      show={isModalOpen}
      size="large"
      onClose={() => {
        if (addImportedUsers.isPending) return;
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
              className="flex-1 flex items-center justify-center gap-2 p-[8px_12px] rounded-lg font-medium text-base bg-[#007F9B] text-white border-2 border-[#007F9B] disabled:hover:cursor-not-allowed disabled:opacity-50"
              onClick={() => addImportedUsers.mutate()}
              disabled={addImportedUsers.isPending || users.length === 0}
            >
              {addImportedUsers.isPending ? (
                <Loader size="sm" color={"white"} />
              ) : (
                "Add Users"
              )}
            </button>
            <button
              className="flex-1 p-[8px_12px] rounded-lg font-medium text-base text-[#007F9B] bg-white border-2 border-[#007F9B] disabled:hover:cursor-not-allowed disabled:text-gray-400 disabled:border-gray-400 disabled:bg-gray-300"
              disabled={addImportedUsers.isPending}
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
