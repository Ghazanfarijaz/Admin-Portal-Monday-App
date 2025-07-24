import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { userAPIs } from "../../api/users";
import { authAPIs } from "../../api/auth";
import mondaySdk from "monday-sdk-js";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import LoadingBackdrop from "../../components/LoadingBackdrop";
import { useForm } from "@mantine/form";
import { PasswordInput, TextInput } from "@mantine/core";
// Monday SDK initialization
const monday = mondaySdk();

const AddNewUser = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const newUserForm = useForm({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },

    validate: {
      name: (value) =>
        value.length < 3 ? "Name must be at least 3 characters" : null,
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      // Password Must be 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character
      password: (value) => {
        const passwordRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]{8,}$/;
        return passwordRegex.test(value)
          ? null
          : "Password must be at least 8 characters, contain uppercase, lowercase, number and special character";
      },
    },
  });

  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    newUserForm.setFieldValue("password", password);
  };

  const createNewUser = useMutation({
    mutationFn: async () => {
      const userSlug = await authAPIs.findUserSlug({ mondayAPI: monday });

      return userAPIs.createUser({
        name: newUserForm.values.name,
        email: newUserForm.values.email,
        password: newUserForm.values.password,
        slug: userSlug,
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });

      newUserForm.reset();

      toast.success("Success!", {
        description: "User created successfully",
      });

      // Navigate to the users list or home page
      navigate("/");
    },

    onError: (error) => {
      console.error("Error creating user:", error);
      toast.error(`Error creating user!`, {
        description: error?.message || "Something went wrong",
      });
    },
  });

  return (
    <>
      {createNewUser.isPending && <LoadingBackdrop />}
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
            onSubmit={newUserForm.onSubmit(createNewUser.mutate)}
            className="md:grid grid-cols-2 flex flex-col gap-6"
          >
            <TextInput
              label="Name"
              {...newUserForm.getInputProps("name")}
              classNames={{
                label: "!text-gray-500 !text-sm !mb-2",
                input: "!h-[42px] !rounded-lg",
              }}
            />
            <TextInput
              label="Email"
              {...newUserForm.getInputProps("email")}
              classNames={{
                label: "!text-gray-500 !text-sm !mb-2",
                input: "!h-[42px] !rounded-lg",
              }}
            />
            <div className="flex flex-col items-end gap-2">
              <PasswordInput
                label="Password"
                {...newUserForm.getInputProps("password")}
                className="w-full"
                classNames={{
                  label: "!text-gray-500 !text-sm !mb-2",
                  input: "!h-[42px] !rounded-lg",
                }}
              />

              <button
                type="button"
                onClick={() => generatePassword()}
                className="h-fit text-blue-500 font-medium text-[14px]"
              >
                Generate Password
              </button>
            </div>

            <div className="col-span-2 flex items-center gap-6 mt-4">
              <button
                type="submit"
                className="bg-[#007F9B] text-white rounded-md hover:bg-[#247688] transition-colors p-[8px_12px] w-fit min-w-[120px] flex items-center justify-center"
              >
                <p className="whitespace-nowrap">Add User</p>
              </button>

              <Link
                to="/"
                className="bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors p-[8px_12px] w-fit min-w-[120px] flex items-center justify-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddNewUser;
