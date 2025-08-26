import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCustomization } from "../../../context/CustomizationContext";
import mondaySdk from "monday-sdk-js";
import { useForm } from "@mantine/form";
import { ChevronLeft, Info, Plus, X } from "lucide-react";
import { Group, Select, Skeleton, Switch, Tooltip } from "@mantine/core";
import {
  DraggableFields,
  SortableField,
} from "../../../components/DraggableFeilds";
import { AttentionBox } from "@vibe/core";
import customizationAPIs from "../../../api/customization";
import CustomizationSkeleton from "../../../components/CustomizationSkeleton";
import { useEffect } from "react";

// Monday SDK initialization
const monday = mondaySdk();

const BoardConfiguration = () => {
  // Hooks
  const { boardId, tempId } = useParams();
  const navigate = useNavigate();
  // Global State
  const { customizationForm } = useCustomization();

  // Local State
  const boardConfigurationForm = useForm({
    initialValues: {
      fields: [],
      selectedEmailColumn: {
        id: "",
        title: "",
      },
    },
    validate: {
      fields: (value) =>
        value.length < 1
          ? "At least one field is required!"
          : value.every((field) => field.id !== "")
          ? null
          : "All fields must have value!",
      selectedEmailColumn: (value) => {
        if (!value.id || !value.title) {
          return "Email column is required!";
        }
        return null;
      },
    },
  });

  // Query to fetch columns Data of borady from monday.com
  const {
    data: boardDetails,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["boardColumnsData"],
    queryFn: () =>
      customizationAPIs.getBoardColumns({
        monday,
        boardId,
      }),
    enabled: !!boardId,
  });

  // Handle save board configuration
  // Updates the selectedBoards array in customizationForm
  const handleSaveBoardConfiguration = () => {
    customizationForm.setFieldValue(
      "selectedBoards",
      customizationForm.values.selectedBoards.map((f) =>
        f.id === boardId
          ? {
              ...f,
              boardConfiguration: {
                fields: boardConfigurationForm.values.fields,
                selectedEmailColumn:
                  boardConfigurationForm.values.selectedEmailColumn,
              },
              isConfigured: true,
            }
          : f
      )
    );

    navigate(-1, {
      replace: true,
    });
  };

  // Use Effect to populate the initial State
  useEffect(() => {
    if (customizationForm) {
      const selectedBoard = customizationForm?.values?.selectedBoards?.find(
        (f) => f.tempId === tempId
      );

      boardConfigurationForm.setValues({
        fields: selectedBoard?.boardConfiguration?.fields || [],
        selectedEmailColumn: selectedBoard?.boardConfiguration
          ?.selectedEmailColumn || {
          id: "",
          title: "",
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle Error
  if (isError) {
    console.error("Failed to fetch board Columns", error);
    return (
      <div className="flex justify-center mt-4">
        <AttentionBox
          title="Failed to fetch board Columns"
          text={error?.message || "Something went wrong"}
          type="danger"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-12 bg-white w-full h-full">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <Link
          to={-1}
          className="text-gray-600 font-medium flex items-center gap-1"
        >
          <ChevronLeft size={20} />
          <p>Go Back</p>
        </Link>
        <h1 className="text-2xl font-bold text-gray-800 leading-none">
          Board Configuration
        </h1>
        {/* Filter and Show Board name from customizationForm */}
        {isPending ? (
          <Skeleton height={25} width={120} radius={2} />
        ) : (
          <span className="text-gray-500">
            ({boardDetails?.name || "Board Name"})
          </span>
        )}
      </div>
      {/* Form */}
      {isPending ? (
        <CustomizationSkeleton type="board-configuration" />
      ) : (
        <form
          onSubmit={boardConfigurationForm.onSubmit(
            handleSaveBoardConfiguration
          )}
          className="bg-white max-w-4xl flex flex-col gap-5"
        >
          {/* Fields - Section */}
          <div className="rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col items-start gap-2">
            <h2 className="text-gray-800 font-semibold text-lg mb-1 leading-none">
              Fields
            </h2>

            {boardConfigurationForm.values.fields.length === 0 && (
              <p className="text-gray-400">No fields added yet.</p>
            )}

            {/* Existing Fields */}
            <DraggableFields
              fields={boardConfigurationForm.values.fields}
              onReorder={(newFields) =>
                boardConfigurationForm.setFieldValue("fields", newFields)
              }
            >
              {boardConfigurationForm.values.fields.map((field, index) => (
                <SortableField key={field.tempId} field={field}>
                  <div className="flex items-center gap-2 w-full flex-wrap">
                    <div className="w-fit flex items-center gap-2">
                      <Select
                        classNames={{
                          root: "!w-[390px]",
                          input:
                            "!bg-gray-100 !border !border-gray-300 !rounded-lg !h-[42px]",
                        }}
                        data={boardDetails?.columns
                          ?.filter(
                            (b) =>
                              // Keep this board if it's not selected by others OR it is the current one
                              !boardConfigurationForm.values.fields.some(
                                (sel) =>
                                  sel.id === b.id && sel.tempId !== field.tempId
                              )
                          )
                          ?.map((column) => ({
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
                          boardConfigurationForm.setFieldValue(
                            "fields",
                            boardConfigurationForm.values.fields.map((f) =>
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
                          boardConfigurationForm.setFieldValue(
                            "fields",
                            boardConfigurationForm.values.fields.filter(
                              (f) => f.tempId !== field.tempId
                            )
                          );
                        }}
                      >
                        <X size={20} className="text-red-500" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 min-w-[212.81px]">
                      <Switch
                        checked={field.isEditable}
                        label="Editable"
                        onChange={(event) => {
                          boardConfigurationForm.setFieldValue(
                            "fields",
                            boardConfigurationForm.values.fields.map((f) =>
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
                      {field.isEditable && (
                        <Switch
                          checked={field.isRequired}
                          label="Required"
                          onChange={(event) => {
                            boardConfigurationForm.setFieldValue(
                              "fields",
                              boardConfigurationForm.values.fields.map((f) =>
                                f.tempId === field.tempId
                                  ? {
                                      ...f,
                                      isRequired: event.currentTarget.checked,
                                    }
                                  : f
                              )
                            );
                          }}
                        />
                      )}
                    </div>
                  </div>
                </SortableField>
              ))}
            </DraggableFields>

            {boardConfigurationForm.errors.fields && (
              <p className="text-red-500 text-sm">
                {boardConfigurationForm.errors.fields}
              </p>
            )}

            <button
              type="button"
              className="flex items-center gap-1 mt-1 text-[#007F9B] font-medium transition-colors disabled:text-gray-300"
              onClick={() => {
                boardConfigurationForm.setFieldValue("fields", [
                  ...boardConfigurationForm.values.fields,
                  {
                    tempId: Math.random().toString(36).substring(2, 10),
                    id: "",
                    title: "",
                    type: "",
                    isEditable: false,
                  },
                ]);
              }}
              disabled={boardConfigurationForm.values.fields.length === 10}
            >
              <Plus size={20} />
              <p className="text-md">
                Add Field ({boardConfigurationForm.values.fields.length}
                /10)
              </p>
            </button>
          </div>
          {/* Flags - Section */}
          <div className="rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col gap-5">
            <h2 className="text-gray-800 font-semibold text-lg leading-none">
              Systems Flags
            </h2>
            {/* Email-based item visibility restriction - email column */}
            <Select
              label={
                <div className="flex items-center gap-2">
                  <p className="text-gray-800 font-semibold text-sm leading-none">
                    Assigned To (Email Column){" "}
                    <span className="text-[#fa5252]">*</span>
                  </p>
                  <Tooltip
                    maw={220}
                    multiline
                    label="This column will be used for filtering the items based on the emails of the users added against the items. This would act as a Assigned To Column."
                  >
                    <Info size={16} className="text-gray-500 cursor-pointer" />
                  </Tooltip>
                </div>
              }
              classNames={{
                root: "!w-full !max-w-[450px]",
                input:
                  "!bg-gray-100 !border !border-gray-300 !rounded-lg !h-[42px]",
                label: "!mb-2",
              }}
              data={boardDetails?.columns
                ?.filter((column) => column.type === "email")
                ?.map((column) => ({
                  value: column.id,
                  label: column.title,
                }))}
              searchable
              allowDeselect={false}
              withCheckIcon={false}
              maxDropdownHeight={200}
              placeholder="Select an email column"
              value={boardConfigurationForm.values.selectedEmailColumn.id}
              onChange={(_, option) => {
                boardConfigurationForm.setFieldValue("selectedEmailColumn", {
                  id: option.value,
                  title: option.label,
                });
              }}
              error={boardConfigurationForm.errors.selectedEmailColumn}
            />
          </div>
          <Group className="!mt-2">
            <button
              type="submit"
              className="flex items-center gap-1 bg-[#007F9B] text-white px-4 py-2 rounded-lg hover:bg-[#20768a] transition-colors disabled:bg-gray-300 w-fit"
            >
              Save Changes
            </button>
            <Link
              to={-1}
              className="flex items-center gap-1 border-2 border-[#007F9B] text-[#007F9B] px-4 py-2 rounded-lg w-fit font-medium"
            >
              Cancel
            </Link>
          </Group>
        </form>
      )}
    </div>
  );
};

export default BoardConfiguration;
