import mondaySdk from "monday-sdk-js";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, Plus, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import customizationAPIs from "../../api/customization";
import { authAPIs } from "../../api/auth";
import CustomizationSkeleton from "../../Components/CustomizationSkeleton";
import { useForm } from "@mantine/form";
import { useEffect, useRef, useState } from "react";
import { Group, Select, Switch, Textarea, Tooltip } from "@mantine/core";
import LogoInput from "../../Components/LogoInput";

// Monday SDK initialization
const monday = mondaySdk();

const EditCustomization = () => {
  // Hooks
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Local States
  const [isLoading, setIsLoading] = useState(false);

  // Customization Form Initialization
  // Form Initialization
  const customizationForm = useForm({
    initialValues: {
      selectedBoardId: "",
      fields: [],
      description: "",
      logo: null,
      allowNewValueCreation: false,
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

  // Fetch Board Details and Customization Data
  const { customization, boardDetails, isPending, isError, error } = useQueries(
    {
      queries: [
        {
          queryKey: ["boardDetails"],
          queryFn: () =>
            customizationAPIs.getAllBoards({
              monday,
            }),
        },
        {
          queryKey: ["customizationData"],
          queryFn: async () => {
            const userSlug = await authAPIs.findUserSlug({ mondayAPI: monday });

            return customizationAPIs.getCustomization({
              slug: userSlug,
            });
          },
        },
      ],
      combine: (results) => {
        const [boardDetails, customization] = results;
        return {
          boardDetails: boardDetails.data,
          customization: customization.data,
          isPending: boardDetails.isPending || customization.isPending,
          isError: boardDetails.isError || customization.isError,
          error: boardDetails.error || customization.error,
        };
      },
    }
  );

  // Update Customization - Mutation
  const updateCustomization = useMutation({
    mutationFn: async () => {
      const userSlug = await authAPIs.findUserSlug({ mondayAPI: monday });

      // Get the "Board" based on the selected board ID
      const selectedBoard = boardDetails?.find(
        (board) => board.id === customizationForm.values.selectedBoardId
      );

      const formData = new FormData();

      // Append the Fields in formData
      formData.append("boardId", selectedBoard?.id);
      formData.append("boardName", selectedBoard?.name);
      formData.append(
        "fields",
        JSON.stringify(
          customizationForm.values.fields.map((field) => ({
            columnId: field.id,
            columnName: field.title,
            isEditable: field.isEditable || false,
          }))
        )
      );
      formData.append(
        "description",
        customizationForm.values.description || ""
      );
      formData.append("subDomain", userSlug);

      formData.append(
        "allowNewValueCreation",
        customizationForm.values.allowNewValueCreation
      );

      // Append the Logo if it exists and is a File
      if (
        customizationForm.values.logo &&
        customizationForm.values.logo instanceof Blob
      ) {
        formData.append("image", customizationForm.values.logo);
      }

      // const API_DATA = {
      //   boardId: selectedBoard?.id,
      //   boardName: selectedBoard?.name,
      //   fields: customizationForm.values.fields.map((field) => ({
      //     columnId: field.id,
      //     columnName: field.title,
      //     isEditable: field.isEditable || false,
      //   })),
      //   logo: customizationForm.values.logo,
      //   description: customizationForm.values.description,
      //   subDomain: userSlug,
      // };

      return customizationAPIs.updateCustomization({
        customizationData: formData,
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

  // Use Effect to set initial form values
  const formRef = useRef(customizationForm);
  useEffect(() => {
    if (customization) {
      setIsLoading(true);
      formRef.current.setValues({
        selectedBoardId: customization.boardId,
        fields: customization.fields.map((field) => ({
          tempId: Math.random().toString(36).substring(2, 10),
          id: field.columnId,
          title: field.columnName,
          isEditable: field.isEditable || false,
        })),
        description: customization.description || "",
        logo: customization.logo || null,
        allowNewValueCreation:
          customization.allowNewValueCreation === "true" ? true : false,
      });
      setIsLoading(false);
    }
  }, [customization]);

  if (isError) {
    console.error(error.message || "Failed to fetch customization data");
    return navigate("/", { replace: true });
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
        <h1 className="text-2xl font-bold text-gray-800">Edit Customization</h1>
      </div>
      <div className="border border-gray-200 p-8 bg-white rounded-lg shadow-sm flex flex-col gap-6">
        <h2 className="text-xl font-bold text-gray-800">
          Customization Details
        </h2>

        {isPending || isLoading || updateCustomization.isPending ? (
          <CustomizationSkeleton type="add-customization" />
        ) : (
          <form
            onSubmit={customizationForm.onSubmit(updateCustomization.mutate)}
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
              value={customizationForm.values.selectedBoardId}
              onChange={(value) => {
                customizationForm.setFieldValue("selectedBoardId", value);
                // Reset fields when board changes
                customizationForm.setFieldValue("fields", []);
              }}
            />

            {/* Fields Section */}
            <Group gap={8} className="!flex-col !items-start">
              <div className="flex items-center justify-between flex-wrap gap-6 w-full pb-2 mb-2 border-b border-gray-200">
                <p className="text-gray-800 font-semibold text-lg">Fields</p>
                <Tooltip
                  label="If Allowed, it will allow the external users on to create new values for some columns such as 'Status', 'Dropdown' etc. - if the value is not present in the column options."
                  refProp="rootRef"
                  withArrow
                  multiline
                  w={220}
                  transitionProps={{ duration: 200 }}
                >
                  <Switch
                    label="Allow New Value Creation"
                    checked={customizationForm.values.allowNewValueCreation}
                    onChange={(event) => {
                      customizationForm.setFieldValue(
                        "allowNewValueCreation",
                        event.currentTarget.checked
                      );
                    }}
                  />
                </Tooltip>
              </div>

              {customizationForm.values.fields.length === 0 && (
                <p className="text-gray-400">No fields added yet.</p>
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
                    value={field.id}
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

              {customizationForm.errors.fields && (
                <p className="text-red-500 text-sm">
                  {customizationForm.errors.fields}
                </p>
              )}

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
              Update Customization
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditCustomization;
