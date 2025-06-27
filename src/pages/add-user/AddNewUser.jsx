import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userAPIs } from "../../api/users";
import { authAPIs } from "../../api/auth";
import mondaySdk from "monday-sdk-js";
import { ChevronLeft } from "lucide-react";

// Monday SDK initialization
const monday = mondaySdk();

const AddNewUser = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [newUserData, setNewUserData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewUserData({ ...newUserData, password, realPassword: password });
  };

  const createNewUser = useMutation({
    mutationFn: async () => {
      const userSlug = await authAPIs.findUserSlug({ mondayAPI: monday });

      return userAPIs.createUser({
        name: newUserData.name,
        email: newUserData.email,
        password: newUserData.password,
        slug: userSlug,
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      // Reset form
      setNewUserData({
        name: "",
        email: "",
        password: "",
      });

      // Navigate to the users list or home page
      navigate("/");
    },

    onError: (error) => {
      console.error("Error creating user:", error);
    },
  });

  return (
    <div className="flex flex-col gap-8 p-12 bg-gray-50 min-h-screen w-screen">
      <div className="flex flex-col gap-3">
        <Link
          to={"/"}
          className="text-gray-600 font-medium flex items-center gap-1"
        >
          <ChevronLeft size={20} />
          <p>Go Back</p>
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Add New User</h1>
      </div>
      <div className="border border-gray-200 p-8 bg-white rounded-lg shadow-sm flex flex-col gap-6">
        <h2 className="text-xl font-bold text-gray-800">User Details</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createNewUser.mutate();
          }}
          className="md:grid grid-cols-2 flex flex-col gap-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={newUserData.name}
              onChange={(e) =>
                setNewUserData({ ...newUserData, name: e.target.value })
              }
              className="w-full outline-none border p-2 rounded-md border-gray-300 focus:border-blue-500"
              placeholder="Enter name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={newUserData.email}
              onChange={(e) =>
                setNewUserData({ ...newUserData, email: e.target.value })
              }
              className="w-full outline-none border p-2 rounded-md border-gray-300 focus:border-blue-500"
              placeholder="Enter email"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="flex items-center">
              <input
                type="text"
                value={newUserData.password}
                onChange={(e) =>
                  setNewUserData({ ...newUserData, password: e.target.value })
                }
                className="w-full outline-none border p-2 rounded-md border-gray-300 focus:border-blue-500"
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                onClick={generatePassword}
                className="ml-2 text-sm text-blue-500 hover:text-blue-700 whitespace-nowrap"
              >
                Generate
              </button>
            </div>
          </div>
          <div className="col-span-2 flex items-center gap-6 mt-4">
            <button
              type="submit"
              className="bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors p-[8px_12px] w-fit min-w-[120px] flex items-center justify-center"
            >
              <p className="whitespace-nowrap">Add User</p>
            </button>

            <Link
              to="/"
              className="bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors p-[8px_12px] w-fit min-w-[120px] flex items-center justify-center"
              onClick={() => {
                // Handle cancel logic here
                console.log("Cancelled");
                // Reset form
                setNewUserData({
                  name: "",
                  email: "",
                  password: "",
                });
              }}
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewUser;
