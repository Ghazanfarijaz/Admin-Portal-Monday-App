import mondaySdk from "monday-sdk-js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Group, Select, Switch, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Plus, X } from "lucide-react";
import customizationAPIs from "../../api/customization";
import CustomizationSkeleton from "../../Components/CustomizationSkeleton";
import LogoInput from "../../Components/LogoInput";
import { authAPIs } from "../../api/auth";

// Monday SDK initialization
const monday = mondaySdk();

const AddCustomization = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Form Initialization
  const customizationForm = useForm({
    initialValues: {
      selectedBoardId: "",
      fields: [],
      description: "",
      logo: null,
    },

    validate: {
      selectedBoardId: (value) => (value ? null : "Board is required!"),
      fields: (value) =>
        value.length < 1
          ? "At least one field is required!"
          : value.every((field) => field.id !== "")
          ? null
          : "All fields must be selected!",
      description: (value) =>
        value.length < 10
          ? "Description must be at least 10 characters long!"
          : null,

      logo: (value) => (value ? null : "Logo is required!"),
    },
  });

  // Fetch Board Details - Query
  const {
    data: boardDetails,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["boardDetails"],
    queryFn: () =>
      customizationAPIs.getAllBoards({
        monday,
      }),
  });

  // Add Customization - Mutation
  const addCustomization = useMutation({
    mutationFn: async () => {
      const userSlug = await authAPIs.findUserSlug({ mondayAPI: monday });

      // Get the "Board" based on the selected board ID
      const selectedBoard = boardDetails?.find(
        (board) => board.id === customizationForm.values.selectedBoardId
      );

      const API_DATA = {
        boardId: selectedBoard?.id,
        boardName: selectedBoard?.name,
        fields: customizationForm.values.fields.map((field) => ({
          columnId: field.id,
          columnName: field.title,
          isEditable: field.isEditable || false,
        })),
        logo: customizationForm.values.logo,
        description: customizationForm.values.description,
        subDomain: userSlug,
      };

      return customizationAPIs.addCustomization({
        customizationData: API_DATA,
        slug: userSlug,
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customizationData"] });
      navigate("/", { replace: true });
    },
    onError: (error) => {
      console.error(error.message || "Failed to add customization");
    },
  });

  if (isError) {
    console.error(error.message || "Failed to fetch board details");

    return (
      <div className="flex items-center justify-center w-full h-full">
        <p className="text-red-500">
          Failed to load board details. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-12 bg-gray-50 w-full h-full">
      <div className="flex flex-col gap-3">
        <Link
          to={"/"}
          className="text-gray-600 font-medium flex items-center gap-1"
        >
          <ChevronLeft size={20} />
          <p>Go Back</p>
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Add Customization</h1>
      </div>

      <div className="border border-gray-200 p-8 bg-white rounded-lg shadow-sm flex flex-col gap-6">
        <h2 className="text-xl font-bold text-gray-800">
          Customization Details
        </h2>

        {isPending ? (
          <CustomizationSkeleton type="add-customization" />
        ) : (
          <form
            onSubmit={customizationForm.onSubmit(addCustomization.mutate)}
            className="flex flex-col gap-8"
          >
            {/* Board Section */}
            <Select
              label="Board"
              classNames={{
                root: "!w-full !max-w-[450px]",
                input:
                  "!bg-gray-100 !border !border-gray-300 !rounded-lg !h-[42px]",
                label: "!text-gray-800 !mb-2 !font-semibold !text-lg",
              }}
              data={boardDetails?.map((board) => ({
                value: board.id,
                label: board.name,
              }))}
              searchable
              allowDeselect={false}
              withCheckIcon={false}
              maxDropdownHeight={200}
              placeholder="Select a board"
              {...customizationForm.getInputProps("selectedBoardId")}
            />

            {/* Fields Section */}
            <Group gap={8} className="!flex-col !items-start">
              <p className="text-gray-800 font-semibold text-lg">Fields</p>
              {customizationForm.values.fields.length === 0 && (
                <p className="text-gray-400">No fields added yet.</p>
              )}

              {customizationForm.errors.fields && (
                <p className="text-red-500 text-sm">
                  {customizationForm.errors.fields}
                </p>
              )}

              {/* Existing Fields */}
              {customizationForm.values.fields.map((field, index) => (
                <div key={index} className="flex items-center gap-2 w-full">
                  <Select
                    classNames={{
                      root: "!w-full !max-w-[450px]",
                      input:
                        "!bg-gray-100 !border !border-gray-300 !rounded-lg !h-[42px]",
                      label: "!text-gray-800 !mb-2 !font-semibold text-lg",
                    }}
                    data={boardDetails
                      ?.find(
                        (board) =>
                          board.id === customizationForm.values.selectedBoardId
                      )
                      ?.columns?.map((column) => ({
                        value: column.id,
                        label: column.title,
                      }))}
                    searchable
                    allowDeselect={false}
                    withCheckIcon={false}
                    maxDropdownHeight={200}
                    placeholder="Select a board"
                    value={field.value}
                    onChange={(_, option) => {
                      customizationForm.setFieldValue(
                        "fields",
                        customizationForm.values.fields.map((f) =>
                          f.tempId === field.tempId
                            ? { ...f, id: option.value, title: option.label }
                            : f
                        )
                      );
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      customizationForm.setFieldValue(
                        "fields",
                        customizationForm.values.fields.filter(
                          (f) => f.tempId !== field.tempId
                        )
                      );
                    }}
                  >
                    <X size={20} className="text-red-500" />
                  </button>

                  <Switch
                    checked={field.isEditable}
                    label="Editable"
                    onChange={(event) => {
                      customizationForm.setFieldValue(
                        "fields",
                        customizationForm.values.fields.map((f) =>
                          f.tempId === field.tempId
                            ? { ...f, isEditable: event.currentTarget.checked }
                            : f
                        )
                      );
                    }}
                  />
                </div>
              ))}

              <button
                type="button"
                className="flex items-center gap-1 text-[#007F9B] font-semibold transition-colors mt-2 disabled:text-gray-300"
                onClick={() => {
                  customizationForm.setFieldValue("fields", [
                    ...customizationForm.values.fields,
                    {
                      tempId: Math.random().toString(36).substring(2, 10),
                      id: "",
                      title: "",
                      isEditable: false,
                    },
                  ]);
                }}
                disabled={
                  customizationForm.values.fields.length === 10 ||
                  customizationForm.values.selectedBoardId === ""
                }
              >
                <Plus size={20} />
                <p>Add Field</p>
              </button>
            </Group>

            {/* Logo Section */}
            <LogoInput
              value={customizationForm.values.logo}
              onLogoChange={(newLogo) => {
                customizationForm.setFieldValue("logo", newLogo);
              }}
            />

            {/* Description Section */}
            <Textarea
              label="Description"
              classNames={{
                input: "!bg-gray-100 !border !border-gray-300 !rounded-lg",
                label: "!text-gray-800 !mb-2 !font-semibold !text-lg",
              }}
              placeholder="Enter a brief description"
              {...customizationForm.getInputProps("description")}
              autosize
              minRows={4}
            />

            <button
              type="submit"
              className="flex items-center gap-1 bg-[#007F9B] text-white px-4 py-2 rounded-lg hover:bg-[#20768a] transition-colors mt-2 disabled:bg-gray-300 w-fit"
            >
              Save Customization
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddCustomization;
