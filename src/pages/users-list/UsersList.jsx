import { useState, useEffect } from "react";
import { Check, X, Plus, Trash2, PencilOff } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userAPIs } from "../../api/users";
import { Skeleton } from "@mantine/core";
import { Link } from "react-router-dom";
import { authAPIs } from "../../api/auth";
import mondaySdk from "monday-sdk-js";
import { ImportUsersPopup } from "../../components/import-users-list-modal/ImportUsersPopup";
import { AttentionBox } from "@vibe/core";
import { toast } from "sonner";
import UploadIcon from "../../assets/icons/UploadIcon";
import { ConfirmationModal } from "../../components/ConfirmationModal";
// Monday SDK initialization
const monday = mondaySdk();

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState(null);
  const [openImportUsersModal, setOpenImportUsersModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const queryClient = useQueryClient();

  // Fetch All Users
  const { data, isFetching, isError, error } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const userSlug = await authAPIs.findUserSlug({ mondayAPI: monday });
      return userAPIs.getAllUsers({
        userSlug,
      });
    },
  });

  useEffect(() => {
    if (data) {
      const formattedUsers = data.data.map((user) => ({
        id: user._id || user.email,
        name: user.name,
        email: user.email,
        password: user.password,
        editing: false,
        isApprovedByAdmin: user.isApprovedByAdmin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }));

      setUsers(formattedUsers);
    }
  }, [data]);

  const updateUser = useMutation({
    mutationFn: async (userId) => {
      const userSlug = await authAPIs.findUserSlug({ mondayAPI: monday });

      const userToUpdate = users.find((user) => user.id === userId);
      if (!userToUpdate) {
        throw new Error("User not found");
      }

      return userAPIs.updateSpecificUser({
        email: userToUpdate.email,
        updateData: {
          name: userToUpdate.name,
          password: userToUpdate.password,
        },
        slug: userSlug,
      });
    },

    onSuccess: (data) => {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.email === data.email
            ? {
                ...user,
                name: data.name,
                password: data.password,
                editing: false,
                updatedAt: new Date().toISOString(),
              }
            : user
        )
      );
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },

    onError: (error) => {
      console.error("Error updating user:", error);
      toast.error(`Error updating user!`, {
        description: error?.message || "Something went wrong",
      });
    },
  });

  const approveUser = useMutation({
    mutationFn: async (userId) => {
      const userSlug = await authAPIs.findUserSlug({ mondayAPI: monday });
      const userToUpdate = users.find((user) => user.id === userId);
      if (!userToUpdate) {
        throw new Error("User not found");
      }
      return userAPIs.approveSpecificUser({
        email: userToUpdate.email,
        slug: userSlug,
      });
    },

    onSuccess: (data) => {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.email === data.email
            ? {
                ...user,
                isApprovedByAdmin: true,
              }
            : user
        )
      );
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },

    onError: (error) => {
      console.error("Error updating user:", error);
      toast.error(`Error updating user!`, {
        description: error?.message || "Something went wrong",
      });
    },
  });

  const deleteUser = useMutation({
    mutationFn: async (userEmail) => {
      const userSlug = await authAPIs.findUserSlug({ mondayAPI: monday });
      const userToDelete = users.find((user) => user.email === userEmail);
      if (!userToDelete) {
        throw new Error("User not found");
      }
      return userAPIs.deleteSpecificUser({
        email: userEmail,
        slug: userSlug,
      });
    },

    onSuccess: (data, userEmail) => {
      setUsers(users.filter((user) => user.email !== userEmail));
      // setShowConfirmationModal(false);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },

    onError: (error) => {
      console.error("Error deleting user:", error);
      toast.error(`Error deleting user!`, {
        description: error?.message || "Something went wrong",
      });
    },
  });

  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    if (newUser) {
      setNewUser({ ...newUser, password });
    } else {
      const editingUser = users.find((u) => u.editing);
      if (editingUser) {
        updateUserField(editingUser.id, "password", password);
      }
    }
  };

  const startEditing = (userId) => {
    setUsers(
      users.map((user) => ({
        ...user,
        editing: user.id === userId,
      }))
    );
    setNewUser(null);
  };

  const cancelEditing = (userId) => {
    setUsers(
      users.map((user) => {
        if (user.id === userId) {
          return {
            ...user,
            editing: false,
          };
        }
        return user;
      })
    );
  };

  // Used to update user fields during editing
  const updateUserField = (id, field, value) => {
    if (newUser && newUser.id === id) {
      setNewUser({ ...newUser, [field]: value });
    } else {
      setUsers(
        users.map((user) =>
          user.id === id ? { ...user, [field]: value } : user
        )
      );
    }
  };

  if (
    isFetching ||
    deleteUser.isPending ||
    updateUser.isPending ||
    approveUser.isPending
  ) {
    return (
      <div className="bg-white max-w-4xl overflow-hidden flex flex-col gap-6">
        <div className="w-full flex justify-end">
          <Skeleton className="!w-[120px] !h-[40px] !rounded-md" />
        </div>
        <div className="rounded-lg shadow-sm border border-gray-200 p-2">
          <div className="flex flex-col gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} width="100%" height={40} radius={8} />
            ))}
          </div>
        </div>
        <Skeleton width="150px" height={40} radius={8} />
      </div>
    );
  }

  if (isError) {
    console.error("Error loading users:", error);
    return (
      <div className="flex justify-center mt-4">
        <AttentionBox
          title="Error Loading Users"
          text={error?.message || "Something went wrong"}
          type="danger"
        />
      </div>
    );
  }
  return (
    <>
      <ConfirmationModal
        show={showConfirmationModal}
        setShow={setShowConfirmationModal}
        title="Delete User"
        desc={`Are you sure you want to delete User?`}
        onConfirm={() => deleteUser.mutate(userToDelete)}
        ispending={deleteUser.isPending}
      />
      <div className="bg-white max-w-4xl overflow-hidden flex flex-col gap-6">
        <ImportUsersPopup
          isModalOpen={openImportUsersModal}
          onCloseModal={() => setOpenImportUsersModal(false)}
        />

        {/* Import Users Modal Trigger */}
        <div className="w-full flex justify-end">
          <button
            className={`p-[10px_16px] rounded-lg font-semibold text-base border-2 text-[#007F9B] bg-white hover:bg-gray-50 border-[#007F9B] transition-all hover:shadow-lg duration-300 flex gap-2 items-center`}
            onClick={() => setOpenImportUsersModal(true)}
          >
            <UploadIcon className="text-[#007F9B] size-[20px]" />
            Import Users
          </button>
        </div>

        {users.lenth < 1 ? (
          <div className="p-8 text-center text-gray-500">
            No users found. Click "Add New User" to create one.
          </div>
        ) : (
          <div className="rounded-lg shadow-sm border border-gray-200 h-full max-h-[400px] overflow-y-auto">
            <table className="w-full table-fixed">
              <thead className="static top-0">
                <tr className="border-b border-gray-200 bg-gray-50 rounded-t-lg">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    User Name
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    User Email
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Password
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 w-24">
                    Actions
                  </th>
                  <th className="py-3 px-4 font-medium text-gray-600">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  return (
                    <tr
                      key={user.id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        {user.editing ? (
                          <input
                            type="text"
                            value={user.name}
                            onChange={(e) =>
                              updateUserField(user.id, "name", e.target.value)
                            }
                            className="w-full outline-none p-2 border rounded-md border-gray-300 focus:border-blue-500"
                            placeholder="Enter name"
                          />
                        ) : (
                          <div className="cursor-pointer py-1 break-all">
                            {user.name}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {user.editing ? (
                          <input
                            type="email"
                            value={user.email}
                            onChange={(e) =>
                              updateUserField(user.id, "email", e.target.value)
                            }
                            className="w-full outline-none p-2 border rounded-md border-gray-300 disabled:border-gray-200 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400"
                            placeholder="Enter email"
                            disabled={user.editing}
                          />
                        ) : (
                          <div className="cursor-pointer py-1 break-all">
                            {user.email}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {user.editing ? (
                          <div className="flex items-center">
                            <input
                              type="text"
                              value={user.password}
                              onChange={(e) =>
                                updateUserField(
                                  user.id,
                                  "password",
                                  e.target.value
                                )
                              }
                              className="w-full outline-none p-2 border rounded-md border-gray-300 focus:border-blue-500"
                              placeholder="Enter password"
                            />
                            <button
                              onClick={generatePassword}
                              className="ml-2 text-sm text-blue-500 hover:text-blue-700 whitespace-nowrap"
                            >
                              Generate
                            </button>
                          </div>
                        ) : (
                          <div className="cursor-pointer py-1">
                            ••••••••••••
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {user.editing ? (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                // Validate User's Name and Password
                                const isValid = () => {
                                  if (!user.name) {
                                    toast.error("User name is required.");
                                    return false;
                                  }
                                  const passwordRegex =
                                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]{8,}$/;
                                  if (!passwordRegex.test(user.password)) {
                                    toast.error(
                                      "Password is not strong enough.",
                                      {
                                        description:
                                          "Password must be 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number, and one special character",
                                        duration: 5000,
                                      }
                                    );
                                    return false;
                                  }
                                  return true;
                                };
                                if (isValid()) {
                                  updateUser.mutate(user.id);
                                }
                              }}
                              className="p-1 text-green-500 hover:text-green-700 bg-green-100 hover:bg-green-200/70 rounded-md"
                              title="Save"
                            >
                              <Check size={20} />
                            </button>
                            <button
                              onClick={() => cancelEditing(user.id)}
                              className="p-1 text-red-500 hover:text-red-700 bg-red-100 hover:bg-red-200/70 rounded-md"
                              title="Cancel"
                            >
                              <X size={20} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => {
                                setUserToDelete(user.id);
                                setShowConfirmationModal(true);
                              }}
                              className="text-red-500 hover:text-red-700"
                              title="Delete"
                            >
                              <Trash2 size={24} />
                            </button>
                            <button
                              className="text-gray-400 hover:text-gray-500"
                              onClick={() => startEditing(user.id)}
                            >
                              <PencilOff size={20} />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {user.isApprovedByAdmin ? (
                          <span className="bg-green-100 text-green-800 text-sm font-semibold px-4 py-2 rounded-full">
                            Approved
                          </span>
                        ) : (
                          <button
                            className="p-[8px_12px] rounded-lg font-medium text-base text-[#007F9B] bg-white hover:bg-[#007F9B] hover:text-white border-2 border-[#007F9B] transition-all hover:shadow-lg duration-300"
                            onClick={() => approveUser.mutate(user.id)}
                          >
                            Approve
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-3 px-4 text-center">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <Link
          to="/add-new-user"
          className="flex items-center text-[#007F9B] font-medium"
        >
          <Plus size={18} className="mr-1" />
          Add New User
        </Link>
      </div>
    </>
  );
};

export default UsersList;
