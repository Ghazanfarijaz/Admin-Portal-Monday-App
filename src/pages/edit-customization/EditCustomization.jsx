import mondaySdk from "monday-sdk-js";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, Plus, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import customizationAPIs from "../../api/customization";
import { authAPIs } from "../../api/auth";
import CustomizationSkeleton from "../../components/CustomizationSkeleton";
import { useForm } from "@mantine/form";
import { useEffect, useRef, useState } from "react";
import { Group, Radio, Select, Switch, Textarea, Tooltip } from "@mantine/core";
import LogoInput from "../../components/LogoInput";
import { toast } from "sonner";

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
      filterItemsByEmail: false,
      selectedEmailColumn: {
        id: "",
        title: "",
      },
      allowUserSignup: false,
      allowUsersToCreateNewItems: false,
      signUpMethod: "no-signup-allowed",
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
      selectedEmailColumn: (value) => {
        if (
          customizationForm.values.filterItemsByEmail &&
          (!value.id || !value.title)
        ) {
          return "Email column is required when filtering by email!";
        }
        return null;
      },
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

      formData.append(
        "filterItemsByEmail",
        customizationForm.values.filterItemsByEmail
      );

      formData.append(
        "selectedEmailColumn",
        JSON.stringify(customizationForm.values.selectedEmailColumn)
      );

      formData.append("signUpMethod", customizationForm.values.signUpMethod);

      formData.append(
        "allowUsersToCreateNewItems",
        customizationForm.values.allowUsersToCreateNewItems
      );

      // Append the Logo if it exists and is a File
      if (
        customizationForm.values.logo &&
        customizationForm.values.logo instanceof Blob
      ) {
        formData.append("image", customizationForm.values.logo);
      }

      return customizationAPIs.updateCustomization({
        customizationData: formData,
        slug: userSlug,
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customizationData"] });
      navigate("/configuration", { replace: true });
    },

    onError: (error) => {
      console.error(error.message || "Failed to add customization");
      toast.error(`Failed to add customization!`, {
        description: error?.message || "Something went wrong",
      });
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
        allowNewValueCreation: customization.allowNewValueCreation === "true",
        filterItemsByEmail: customization.filterItemsByEmail === "true",
        selectedEmailColumn: JSON.parse(
          customization.selectedEmailColumn || "{}"
        ),
        allowUsersToCreateNewItems:
          customization.allowUsersToCreateNewItems === "true",
        signUpMethod: customization.signUpMethod || "no-signup-allowed",
      });
      setIsLoading(false);
    }
  }, [customization]);

  if (isError) {
    console.error(error.message || "Failed to fetch customization data");
    toast.error(error.message || "Failed to fetch customization data");
    return navigate("/configuration", { replace: true });
  }
  return (
    <div className="flex flex-col gap-8 p-12 bg-white w-full h-full">
      <div className="flex flex-col gap-2">
        <Link
          to={"/configuration"}
          className="text-gray-600 font-medium flex items-center gap-1"
        >
          <ChevronLeft size={20} />
          <p>Go Back</p>
        </Link>
        <h1 className="text-2xl font-bold text-gray-800 leading-none">
          Edit Customization
        </h1>
      </div>

      {isPending || isLoading || updateCustomization.isPending ? (
        <CustomizationSkeleton type="edit-customization" />
      ) : (
        <form
          onSubmit={customizationForm.onSubmit(updateCustomization.mutate)}
          className="bg-white max-w-4xl flex flex-col gap-5"
        >
          <div className="rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col gap-5">
            {/* Logo Section */}
            <LogoInput
              value={customizationForm.values.logo}
              onLogoChange={(newLogo) => {
                customizationForm.setFieldValue("logo", newLogo);
              }}
              error={customizationForm.errors.logo}
            />

            {/* Description Section */}
            <Textarea
              label="Description"
              classNames={{
                input: "!bg-gray-100 !border !border-gray-300 !rounded-lg",
                label: "!text-gray-800 !mb-3 !font-semibold !text-lg",
              }}
              placeholder="Enter a brief description"
              {...customizationForm.getInputProps("description")}
              autosize
              minRows={4}
            />
          </div>
          <div className="rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col gap-5">
            {/* Board Section */}
            <Select
              label="Board"
              classNames={{
                root: "!w-full !max-w-[450px]",
                input:
                  "!bg-gray-100 !border !border-gray-300 !rounded-lg !h-[42px]",
                label: "!text-gray-800 !mb-3 !font-semibold !text-lg",
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
              <h2 className="text-gray-800 font-semibold text-lg mb-1 leading-none">
                Fields
              </h2>

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
                    placeholder="Select a field"
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
                className="flex items-center gap-1 mt-1 text-[#007F9B] font-semibold transition-colors disabled:text-gray-300"
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
                <p className="text-md">Add New Field</p>
              </button>
            </Group>
          </div>
          <div className="rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col gap-5">
            <h2 className="text-gray-800 font-semibold text-lg leading-none">
              Systems Flags
            </h2>
            <div className="flex flex-col gap-3">
              <Tooltip
                label="If Allowed, it will allow the external users on to create new values for some columns such as 'Status', 'Dropdown' etc. - if the value is not present in the column options."
                refProp="rootRef"
                withArrow
                multiline
                w={220}
                transitionProps={{ duration: 200 }}
              >
                <Switch
                  label="Allow user to create new values in Dropdown and columns"
                  checked={customizationForm.values.allowNewValueCreation}
                  onChange={(event) => {
                    customizationForm.setFieldValue(
                      "allowNewValueCreation",
                      event.currentTarget.checked
                    );
                  }}
                  className="!w-fit"
                />
              </Tooltip>
              <div className="flex flex-col gap-1">
                <Tooltip
                  label="When enabled, users will only see items where their email matches in the selected email column. You’ll be prompted to choose the column after turning this on."
                  refProp="rootRef"
                  withArrow
                  multiline
                  w={220}
                  transitionProps={{ duration: 200 }}
                >
                  <Switch
                    label="Enable email-based item visibility restriction"
                    checked={customizationForm.values.filterItemsByEmail}
                    onChange={(event) => {
                      customizationForm.setFieldValue(
                        "filterItemsByEmail",
                        event.currentTarget.checked
                      );

                      if (!event.currentTarget.checked) {
                        customizationForm.setFieldValue("selectedEmailColumn", {
                          id: "",
                          title: "",
                        });
                      }
                    }}
                    className="!w-fit"
                  />
                </Tooltip>
                {customizationForm.values.filterItemsByEmail && (
                  <Select
                    classNames={{
                      root: "!w-full !max-w-[450px]",
                      input:
                        "!bg-gray-100 !border !border-gray-300 !rounded-lg !h-[42px]",
                    }}
                    data={boardDetails
                      ?.find(
                        (board) =>
                          board.id === customizationForm.values.selectedBoardId
                      )
                      ?.columns.filter((column) => column.type === "email")
                      .map((column) => ({
                        value: column.id,
                        label: column.title,
                      }))}
                    searchable
                    allowDeselect={false}
                    withCheckIcon={false}
                    maxDropdownHeight={200}
                    placeholder="Select an email column"
                    value={customizationForm.values.selectedEmailColumn.id}
                    onChange={(_, option) => {
                      customizationForm.setFieldValue("selectedEmailColumn", {
                        id: option.value,
                        title: option.label,
                      });
                    }}
                    error={customizationForm.errors.selectedEmailColumn}
                  />
                )}
              </div>
              <Tooltip
                label="When enabled, external users will be able to create new items in the board."
                refProp="rootRef"
                withArrow
                multiline
                w={220}
                transitionProps={{ duration: 200 }}
              >
                <Switch
                  label="Allow External Users to Create New Items"
                  checked={customizationForm.values.allowUsersToCreateNewItems}
                  onChange={(event) => {
                    customizationForm.setFieldValue(
                      "allowUsersToCreateNewItems",
                      event.currentTarget.checked
                    );
                  }}
                  className="!w-fit"
                />
              </Tooltip>
              <Radio.Group
                name="signUpMethod"
                label="Sign Up Method"
                withAsterisk
                value={customizationForm.values.signUpMethod}
                onChange={(event) => {
                  customizationForm.setFieldValue("signUpMethod", event);
                }}
              >
                <Group mt="xs" gap={16}>
                  <Radio
                    value="no-signup-allowed"
                    label="No Sign Up Allowed"
                    classNames={{
                      label: "!ps-1",
                    }}
                  />
                  <Radio
                    value="signup-with-admin-approval"
                    label="Allow Sign Up with Admin Approval"
                    classNames={{
                      label: "!ps-1",
                    }}
                  />
                  <Radio
                    value="signup-without-admin-approval"
                    label="Allow Sign Up without Admin Approval"
                    classNames={{
                      label: "!ps-1",
                    }}
                  />
                </Group>
              </Radio.Group>
            </div>
          </div>

          <button
            type="submit"
            className="flex items-center gap-1 bg-[#007F9B] text-white px-4 py-2 rounded-lg hover:bg-[#20768a] transition-colors mt-2 disabled:bg-gray-300 w-fit"
          >
            Update Customization
          </button>
        </form>
      )}
    </div>
  );
};

export default EditCustomization;
