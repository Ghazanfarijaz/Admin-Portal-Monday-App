import { useState, useEffect } from "react";
import { Check, X, Plus } from "lucide-react";
import CredentialApi from "../Api/api";
 
export default function AddUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState(null);
  const [error, setError] = useState(null);
 
  // Fetch all credentials when component mounts
  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        const response = await CredentialApi.getAllCredentials();
 
        if (!response.success) {
          throw new Error("Failed to fetch users");
        }
 
        // Transform API data to match your expected format
        const formattedUsers = response.data.map((user) => ({
          id: user._id || user.email, // Use email as ID if _id doesn't exist
          name: user.name,
          email: user.email,
          password: "••••••••••••",
          editing: false,
          realPassword: "", // Note: API doesn't return passwords (as it shouldn't)
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        }));
 
        setUsers(formattedUsers);
      } catch (err) {
        console.error("Failed to fetch credentials:", err);
        setError(err.message || "Failed to load users. Please try again.");
      } finally {
        setLoading(false);
      }
    };
 
    fetchCredentials();
  }, []);
 
  const handleApiError = (error, context) => {
    let errorMessage = `❌ Failed to ${context}. Please try again.`;
 
    if (error.response) {
      errorMessage = `❌ Server error: ${
        error.response.data.message || error.response.statusText
      }`;
    } else if (error.request) {
      errorMessage = "❌ Network error - Could not connect to server";
    } else {
      errorMessage = `❌ Error: ${error.message}`;
    }
 
    alert(errorMessage);
  };
 
  const addNewUser = () => {
    const user = {
      id: Math.random().toString(36).substring(2, 9), // Generate random ID
      name: "",
      email: "",
      password: "",
      editing: true,
      realPassword: "",
    };
    setNewUser(user);
    // Cancel editing for all other users
    setUsers(
      users.map((u) => ({ ...u, editing: false, password: "••••••••••••" }))
    );
  };
 
  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
 
    if (newUser) {
      setNewUser({ ...newUser, password, realPassword: password });
    } else {
      const editingUser = users.find((u) => u.editing);
      if (editingUser) {
        updateUserField(editingUser.id, "password", password);
        updateUserField(editingUser.id, "realPassword", password);
      }
    }
  };
 
  const startEditing = (userId) => {
    setUsers(
      users.map((user) => ({
        ...user,
        editing: user.id === userId,
        password: user.id === userId ? user.realPassword || "" : "••••••••••••",
      }))
    );
    setNewUser(null);
  };
 
  // const saveUser = (userId) => {
  //   if (newUser && newUser.id === userId) {
  //     const updatedUser = {
  //       ...newUser,
  //       editing: false,
  //       realPassword: newUser.password,
  //       password: "••••••••••••",
  //     };
  //     setUsers([...users, updatedUser]);
  //     setNewUser(null);
  //   } else {
  //     setUsers(
  //       users.map((user) => {
  //         if (user.id === userId) {
  //           return {
  //             ...user,
  //             editing: false,
  //             realPassword: user.password,
  //             password: "••••••••••••",
  //           };
  //         }
  //         return user;
  //       })
  //     );
  //   }
  // };
 
  // const saveUser = async (userId) => {
  //   try {
  //     if (newUser && newUser.id === userId) {
  //       // Prepare the data for API call
  //       const credentialData = {
  //         name: newUser.name,
  //         email: newUser.email,
  //         password: newUser.password
  //       };
 
  //       // Call the API to add the credential
  //       const response = await CredentialApi.addCredential(credentialData);
 
  //       // Only add to local state if API call was successful
  //       const updatedUser = {
  //         ...newUser,
  //         editing: false,
  //         realPassword: newUser.password,
  //         password: "••••••••••••",
  //       };
  //       setUsers([...users, updatedUser]);
  //       setNewUser(null);
 
  //       // Optional: Show success message
  //       alert('User added successfully!');
  //     } else {
  //       // Existing logic for editing users remains unchanged
  //       setUsers(
  //         users.map((user) => {
  //           if (user.id === userId) {
  //             return {
  //               ...user,
  //               editing: false,
  //               realPassword: user.password,
  //               password: "••••••••••••",
  //             };
  //           }
  //           return user;
  //         })
  //       );
  //     }
  //   } catch (error) {
  //     console.error('Failed to add user:', error);
  //     alert('Failed to add user. Please try again.');
  //   }
  // };
 
  const saveUser = async (userId) => {
    try {
      if (newUser && newUser.id === userId) {
        // Prepare the data for API call
        const credentialData = {
          name: newUser.name,
          email: newUser.email,
          password: newUser.password,
          slug: "site-slug",
        };
 
        // Call the API to add the credential
        const response = await CredentialApi.addCredential(credentialData);
 
        // Check if API call was successful
        if (!response) {
          throw new Error("No response from server");
        }
 
        // Only add to local state if API call was successful
        const updatedUser = {
          ...newUser,
          editing: false,
          realPassword: newUser.password,
          password: "••••••••••••",
        };
        setUsers([...users, updatedUser]);
        setNewUser(null);
 
        // Show success message
        alert("✅ User added successfully!");
      } else {
        // Existing logic for editing users remains unchanged
        setUsers(
          users.map((user) => {
            if (user.id === userId) {
              return {
                ...user,
                editing: false,
                realPassword: user.password,
                password: "••••••••••••",
              };
            }
            return user;
          })
        );
      }
    } catch (error) {
      console.error("Failed to add user:", error);
 
      // Show detailed error message to user
      let errorMessage = "❌ Failed to add user. Please try again.";
 
      if (error.response) {
        // Server responded with error status (4xx, 5xx)
        errorMessage = `❌ Server error: ${
          error.response.data.message || error.response.statusText
        }`;
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = "❌ Network error - Could not connect to server";
      } else {
        // Something else happened
        errorMessage = `❌ Error: ${error.message}`;
      }
 
      alert(errorMessage);
 
      // Keep the new user form open so they can try again
      setNewUser({
        ...newUser,
        editing: true, // Ensure it stays in edit mode
      });
    }
  };
 
  const cancelEditing = (userId) => {
    if (newUser && newUser.id === userId) {
      setNewUser(null);
    } else {
      setUsers(
        users.map((user) => {
          if (user.id === userId) {
            return {
              ...user,
              editing: false,
              password: "••••••••••••",
            };
          }
          return user;
        })
      );
    }
  };
 
  const deleteUser = (userId) => {
    if (newUser && newUser.id === userId) {
      setNewUser(null);
    } else {
      setUsers(users.filter((user) => user.id !== userId));
    }
  };
 
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
 
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 max-w-4xl overflow-hidden p-4">
        <p>Loading users...</p>
      </div>
    );
  }
 
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 max-w-4xl overflow-hidden p-4">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-blue-500 hover:text-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }
 
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 max-w-4xl overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <h2 className="font-medium text-gray-700">Users ({users.length})</h2>
        <button
          onClick={addNewUser}
          className="flex items-center text-blue-500 hover:text-blue-700 font-medium"
        >
          <Plus size={18} className="mr-1" />
          Add New User
        </button>
      </div>
 
      {users.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          No users found. Click "Add New User" to create one.
        </div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
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
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
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
                      className="w-full outline-none border-b border-gray-300 focus:border-blue-500"
                      placeholder="Enter name"
                    />
                  ) : (
                    <div
                      onClick={() => startEditing(user.id)}
                      className="cursor-pointer py-1"
                    >
                      {user.name || (
                        <span className="text-gray-400">Click to edit</span>
                      )}
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
                      className="w-full outline-none border-b border-gray-300 focus:border-blue-500"
                      placeholder="Enter email"
                    />
                  ) : (
                    <div
                      onClick={() => startEditing(user.id)}
                      className="cursor-pointer py-1"
                    >
                      {user.email || (
                        <span className="text-gray-400">Click to edit</span>
                      )}
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
                          updateUserField(user.id, "password", e.target.value)
                        }
                        className="w-full outline-none border-b border-gray-300 focus:border-blue-500"
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
                    <div
                      onClick={() => startEditing(user.id)}
                      className="cursor-pointer py-1"
                    >
                      {user.password}
                    </div>
                  )}
                </td>
                <td className="py-3 px-4">
                  {user.editing ? (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => saveUser(user.id)}
                        className="p-1 text-green-500 hover:text-green-700"
                        title="Save"
                      >
                        <Check size={18} />
                      </button>
                      <button
                        onClick={() => cancelEditing(user.id)}
                        className="p-1 text-red-500 hover:text-red-700"
                        title="Cancel"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="p-1 text-red-500 hover:text-red-700"
                      title="Delete"
                    >
                      <X size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {newUser && (
              <tr className="border-b border-gray-200 bg-blue-50">
                <td className="py-3 px-4">
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, name: e.target.value })
                    }
                    className="w-full outline-none border-b border-gray-300 focus:border-blue-500"
                    placeholder="Enter name"
                  />
                </td>
                <td className="py-3 px-4">
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    className="w-full outline-none border-b border-gray-300 focus:border-blue-500"
                    placeholder="Enter email"
                  />
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={newUser.password}
                      onChange={(e) =>
                        setNewUser({ ...newUser, password: e.target.value })
                      }
                      className="w-full outline-none border-b border-gray-300 focus:border-blue-500"
                      placeholder="Enter password"
                    />
                    <button
                      onClick={generatePassword}
                      className="ml-2 text-sm text-blue-500 hover:text-blue-700 whitespace-nowrap"
                    >
                      Generate
                    </button>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => saveUser(newUser.id)}
                      className="p-1 text-green-500 hover:text-green-700"
                      title="Save"
                    >
                      <Check size={18} />
                    </button>
                    <button
                      onClick={() => cancelEditing(newUser.id)}
                      className="p-1 text-red-500 hover:text-red-700"
                      title="Cancel"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
 
      <div className="py-3 px-4 border-t border-gray-200 bg-gray-50">
        <button
          onClick={addNewUser}
          className="flex items-center text-blue-500 hover:text-blue-700 font-medium"
        >
          <Plus size={18} className="mr-1" />
          Add New User
        </button>
      </div>
    </div>
  );
}
 