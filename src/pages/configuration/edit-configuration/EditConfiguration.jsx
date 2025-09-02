import mondaySdk from "monday-sdk-js";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, Plus, X, Info } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import customizationAPIs from "../../../api/customization";
import CustomizationSkeleton from "../../../components/CustomizationSkeleton";
import { useEffect, useRef, useState } from "react";
import { Group, Radio, Select, Switch, Textarea, Tooltip } from "@mantine/core";
import LogoInput from "../../../components/LogoInput";
import { toast } from "sonner";
import sanitizeData from "../../../utils/sanitizeData";
import { useCustomization } from "../../../context/CustomizationContext";
import {
  DraggableFields,
  SortableField,
} from "../../../components/DraggableFeilds";

// Monday SDK initialization
const monday = mondaySdk();

const EditConfiguration = () => {
  // Hooks
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    customizationForm,
    shouldPopuplateInitialData,
    setShouldPopuplateInitialData,
  } = useCustomization();

  // Local States
  const [isLoading, setIsLoading] = useState(false);
  const [sessionToken, setSessionToken] = useState(null);

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
            return customizationAPIs.getCustomization({
              sessionToken,
            });
          },
          enabled: !!sessionToken,
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
      // Validate if all the boards are configured
      const allBoardsConfigured = customizationForm.values.selectedBoards.every(
        (board) => board.isConfigured
      );

      if (!allBoardsConfigured) {
        toast.error("Please configure all the boards first!");
        return;
      }

      const formData = new FormData();

      // -------------------------
      // Common Fields
      // -------------------------
      // Append the Logo if it exists and is a File
      if (
        customizationForm.values.logo &&
        customizationForm.values.logo instanceof Blob
      ) {
        formData.append("image", customizationForm.values.logo);
      }
      // Sanitize Description
      const sanitizedDescription = sanitizeData.description(
        customizationForm.values.description || ""
      );
      formData.append("description", sanitizedDescription);

      formData.append(
        "allowNewValueCreation",
        customizationForm.values.allowNewValueCreation
      );

      formData.append(
        "filterItemsByEmail",
        customizationForm.values.filterItemsByEmail
      );
      formData.append(
        "allowUsersToCreateNewItems",
        customizationForm.values.allowUsersToCreateNewItems
      );

      formData.append("signUpMethod", customizationForm.values.signUpMethod);

      // Selected Boards Data
      const selectedBoardsData = customizationForm.values.selectedBoards.map(
        (board) => {
          const udpatedFields = board.boardConfiguration.fields.map(
            (field) => ({
              columnId: field.id,
              columnName: field.title,
              columnType: field.type,
              isEditable: field.isEditable || false,
              isRequired: field.isRequired || false,
            })
          );

          return {
            boardId: board.id,
            boardName: board.name,
            boardConfiguration: {
              fields: udpatedFields,
              selectedEmailColumn: board.boardConfiguration.selectedEmailColumn,
            },
          };
        }
      );

      formData.append("selectedBoardsData", JSON.stringify(selectedBoardsData));

      return customizationAPIs.updateCustomization({
        customizationData: formData,
        sessionToken,
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customizationData"] });
      setShouldPopuplateInitialData(true);
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
    if (customization && shouldPopuplateInitialData) {
      setIsLoading(true);

      const formattedBoardsData = customization.selectedBoardsData.map(
        (board) => {
          const fetchedFields = board.boardConfiguration.fields.map(
            (field) => ({
              id: field.columnId,
              title: field.columnName,
              type: field.columnType,
              tempId: Math.random().toString(36).substring(2, 10),
              isEditable: field.isEditable,
              isRequired: field.isRequired,
            })
          );

          return {
            boardConfiguration: {
              ...board.boardConfiguration,
              fields: [...fetchedFields],
            },
            id: board.boardId,
            name: board.boardName,
            tempId: Math.random().toString(36).substring(2, 10),
            isConfigured: true,
          };
        }
      );

      formRef.current.setValues({
        logo: customization.logo || null,
        description: customization.description || "",
        selectedBoards: formattedBoardsData || [],
        allowNewValueCreation: customization.allowNewValueCreation === "true",
        filterItemsByEmail: customization.filterItemsByEmail === "true",
        allowUsersToCreateNewItems:
          customization.allowUsersToCreateNewItems === "true",
        signUpMethod: customization.signUpMethod || "no-signup-allowed",
      });
      setIsLoading(false);
    }
  }, [customization, shouldPopuplateInitialData]);

  // Use Effect to fetch the Session Token From Monday
  useEffect(() => {
    monday.listen("sessionToken", ({ data: token }) => {
      setSessionToken(token);
    });
  }, []);

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
          <div className="rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col gap-2">
            {/* Board Section */}
            <h2 className="text-gray-800 font-semibold text-lg mb-1 leading-none">
              Boards
            </h2>
            {customizationForm?.values?.selectedBoards?.length < 1 ? (
              <p className="text-gray-400">No Boards added yet.</p>
            ) : (
              <DraggableFields
                fields={customizationForm.values.selectedBoards}
                onReorder={(newFields) =>
                  customizationForm.setFieldValue("selectedBoards", newFields)
                }
              >
                {customizationForm.values.selectedBoards.map((board) => (
                  <SortableField key={board.tempId} field={board}>
                    <div className="flex items-center gap-2">
                      <Select
                        classNames={{
                          root: "!w-full !max-w-[450px]",
                          input: `${
                            board?.isConfigured
                              ? "!bg-green-100 !border-green-300"
                              : "!bg-gray-100 !border-gray-300"
                          }  !border !rounded-lg !h-[42px]`,
                        }}
                        // Don't show the selected board in the dropdown
                        data={boardDetails
                          ?.filter(
                            (b) =>
                              // Keep this board if it's not selected by others OR it is the current one
                              !customizationForm.values.selectedBoards.some(
                                (sel) =>
                                  sel.id === b.id && sel.tempId !== board.tempId
                              )
                          )
                          .map((b) => ({
                            value: b.id,
                            label: b.name,
                            type: b.type,
                            workspace: b.workspace,
                          }))}
                        searchable
                        allowDeselect={false}
                        withCheckIcon={false}
                        maxDropdownHeight={200}
                        placeholder="Select a board"
                        value={board.id}
                        onChange={(_, option) => {
                          customizationForm.setFieldValue(
                            "selectedBoards",
                            customizationForm.values.selectedBoards.map((f) =>
                              f.tempId === board.tempId
                                ? {
                                    ...f,
                                    id: option.value,
                                    name: option.label,
                                    type: option.type,
                                    boardConfiguration: {}, // Reset board configuration when board is changed
                                    isConfigured: false,
                                  }
                                : f
                            )
                          );
                        }}
                        renderOption={({ option }) => {
                          return (
                            <div className="flex items-center gap-2">
                              <p>
                                {option.label} ({option.workspace.name})
                              </p>
                            </div>
                          );
                        }}
                      />
                      {board.id && board.tempId && (
                        <Link
                          to={`/add-board-configuration/${board.id}/${board.tempId}`}
                          className="flex items-center gap-1 bg-[#007F9B] text-white px-4 py-2 rounded-lg hover:bg-[#20768a] transition-colors disabled:bg-gray-300 w-fit"
                          onClick={() => {
                            if (shouldPopuplateInitialData) {
                              setShouldPopuplateInitialData(false);
                            }
                          }}
                        >
                          {board.isConfigured ? "Edit Config" : "Configure"}
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          customizationForm.setFieldValue(
                            "selectedBoards",
                            customizationForm.values.selectedBoards.filter(
                              (f) => f.tempId !== board.tempId
                            )
                          );
                        }}
                      >
                        <X size={20} className="text-red-500" />
                      </button>
                    </div>
                  </SortableField>
                ))}
              </DraggableFields>
            )}

            {customizationForm.errors.selectedBoards && (
              <p className="text-red-500 text-sm">
                {customizationForm.errors.selectedBoards}
              </p>
            )}

            <button
              type="button"
              className="flex items-center gap-1 mt-1 text-[#007F9B] font-medium transition-colors disabled:text-gray-300 w-fit"
              onClick={() => {
                customizationForm.setFieldValue("selectedBoards", [
                  ...customizationForm.values.selectedBoards,
                  {
                    tempId: Math.random().toString(36).substring(2, 10),
                    id: "",
                    name: "",
                    type: "",
                    boardConfiguration: {},
                    isConfigured: false,
                  },
                ]);
              }}
              disabled={customizationForm.values.selectedBoards.length === 10}
            >
              <Plus size={20} />
              <p className="text-md">
                Add Board ({customizationForm.values.selectedBoards.length}/10)
              </p>
            </button>
          </div>
          <div className="rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col gap-5">
            <h2 className="text-gray-800 font-semibold text-lg leading-none">
              Systems Flags
            </h2>
            <div className="flex flex-col gap-3">
              {/* Email-based item visibility restriction */}
              <div className="flex items-center gap-2">
                <Switch
                  label="Show items Assigned To Me only"
                  checked={customizationForm.values.filterItemsByEmail}
                  onChange={(event) => {
                    customizationForm.setFieldValue(
                      "filterItemsByEmail",
                      event.currentTarget.checked
                    );
                  }}
                  className="!w-fit"
                />
                <Tooltip
                  label="This attribute restrict the user permissions to view the items that are assigned to him only."
                  withArrow
                  maw={220}
                  multiline
                  transitionProps={{ duration: 200 }}
                >
                  <Info size={16} className="text-gray-500 cursor-pointer" />
                </Tooltip>
              </div>

              {/* Allow external users to create new item. - Switch */}
              <div className="flex items-center gap-2">
                <Switch
                  label="Allow external users to create new item."
                  checked={customizationForm.values.allowUsersToCreateNewItems}
                  onChange={(event) => {
                    customizationForm.setFieldValue(
                      "allowUsersToCreateNewItems",
                      event.currentTarget.checked
                    );
                  }}
                  className="!w-fit"
                />
                <Tooltip
                  label="This attribute provide the user with the permissions to create new items from the portal to your board."
                  withArrow
                  maw={220}
                  multiline
                  transitionProps={{ duration: 200 }}
                >
                  <Info size={16} className="text-gray-500 cursor-pointer" />
                </Tooltip>
              </div>

              {/* Allow user to create new values in Dropdown - Switch  */}
              <div className="flex items-center gap-2">
                <Switch
                  label="Allow external users to create new values."
                  checked={customizationForm.values.allowNewValueCreation}
                  onChange={(event) => {
                    customizationForm.setFieldValue(
                      "allowNewValueCreation",
                      event.currentTarget.checked
                    );
                  }}
                  className="!w-fit"
                />
                <Tooltip
                  label="This attribute provide the user with the permissions to create new values in the Dropdown fields."
                  withArrow
                  maw={220}
                  multiline
                  transitionProps={{ duration: 200 }}
                >
                  <Info size={16} className="text-gray-500 cursor-pointer" />
                </Tooltip>
              </div>

              {/* Sign Up Method */}
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

          <div className="flex items-center gap-2 mt-2">
            <button
              type="submit"
              className="flex items-center gap-1 bg-[#007F9B] border-2 border-[#007F9B] text-white px-4 py-2 rounded-lg hover:bg-[#20768a] transition-colors w-fit font-medium"
            >
              Save
            </button>
            <Link
              to="/configuration"
              className="flex items-center gap-1 border-2 border-[#007F9B] text-[#007F9B] px-4 py-2 rounded-lg w-fit font-medium"
            >
              Cancel
            </Link>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditConfiguration;
