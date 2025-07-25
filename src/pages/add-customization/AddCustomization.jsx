import mondaySdk from "monday-sdk-js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Group, Radio, Select, Switch, Textarea, Tooltip } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Info, Plus, X } from "lucide-react";
import customizationAPIs from "../../api/customization";
import CustomizationSkeleton from "../../components/CustomizationSkeleton";
import LogoInput from "../../components/LogoInput";
import { authAPIs } from "../../api/auth";
import { toast } from "sonner";
import { AttentionBox } from "@vibe/core";
import {
  DraggableFields,
  SortableField,
} from "../../components/DraggableFeilds";

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
      allowNewValueCreation: false,
      filterItemsByEmail: false,
      selectedEmailColumn: {
        id: "",
        title: "",
      },
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
        if (!value.id || !value.title) {
          return "Email column is required when filtering by email!";
        }
        return null;
      },
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
            columnType: field.type,
            isEditable: field.isEditable || false,
          }))
        )
      );
      formData.append(
        "description",
        customizationForm.values.description || ""
      );
      formData.append("subDomain", userSlug);
      formData.append("image", customizationForm.values.logo);
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

      return customizationAPIs.addCustomization({
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

  if (isError) {
    console.error("Failed to fetch board details", error);
    return (
      <div className="flex justify-center mt-4">
        <AttentionBox
          title="Failed to fetch board details"
          text={error?.message || "Something went wrong"}
          type="danger"
        />
      </div>
    );
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
          Add Customization
        </h1>
      </div>

      {isPending || addCustomization.isPending ? (
        <CustomizationSkeleton type="edit-customization" />
      ) : (
        <form
          onSubmit={customizationForm.onSubmit(addCustomization.mutate)}
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
                // Reset fields when board is changed
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
              <DraggableFields
                fields={customizationForm.values.fields}
                onReorder={(newFields) =>
                  customizationForm.setFieldValue("fields", newFields)
                }
              >
                {customizationForm.values.fields.map((field, index) => (
                  <SortableField key={field.tempId} field={field}>
                    <div className="flex items-center gap-2 w-full">
                      <Select
                        classNames={{
                          root: "!w-full !max-w-[450px]",
                          input:
                            "!bg-gray-100 !border !border-gray-300 !rounded-lg !h-[42px]",
                        }}
                        data={boardDetails
                          ?.find(
                            (board) =>
                              board.id ===
                              customizationForm.values.selectedBoardId
                          )
                          ?.columns?.map((column) => ({
                            value: column.id,
                            label: column.title,
                            type: column.type,
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
                                ? {
                                    ...f,
                                    id: option.value,
                                    title: option.label,
                                    type: option.type,
                                  }
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
                                ? {
                                    ...f,
                                    isEditable: event.currentTarget.checked,
                                  }
                                : f
                            )
                          );
                        }}
                      />
                    </div>
                  </SortableField>
                ))}
              </DraggableFields>

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
                      type: "",
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
                label="If Allowed, it will allow the external users on to create new values for 'Dropdown' columns. - if the value is not present in the column options."
                refProp="rootRef"
                withArrow
                multiline
                w={220}
                transitionProps={{ duration: 200 }}
              >
                <Switch
                  label="Allow user to create new values in Dropdown columns"
                  checked={customizationForm.values.allowNewValueCreation}
                  onChange={(event) => {
                    customizationForm.setFieldValue(
                      "allowNewValueCreation",
                      event.currentTarget.checked
                    );
                  }}
                />
              </Tooltip>
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
              <Select
                label={
                  <div className="flex items-center gap-2">
                    <span className="text-gray-800 font-semibold text-sm leading-none">
                      Assigned To (Email Column)
                    </span>
                    <Tooltip
                      maw={220}
                      multiline
                      label="This column will be used for filtering the items based on the emails of the users added against the items. This would act as a Assigned To Column."
                    >
                      <Info
                        size={16}
                        className="text-gray-500 cursor-pointer"
                      />
                    </Tooltip>
                  </div>
                }
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
                <Group mt="xs">
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
            Save Customization
          </button>
        </form>
      )}
    </div>
  );
};

export default AddCustomization;
