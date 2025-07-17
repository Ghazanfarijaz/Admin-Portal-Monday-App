import { Link } from "react-router-dom";
import mondaySdk from "monday-sdk-js";
import { useQuery } from "@tanstack/react-query";
import customizationAPIs from "../api/customization";
import { authAPIs } from "../api/auth";
import CustomizationSkeleton from "./CustomizationSkeleton";
import { LinkIcon } from "lucide-react";
import { CopyButton, Group, Radio, Switch, Tooltip } from "@mantine/core";

const monday = mondaySdk();

export default function Configuration() {
  // Fetch board details and customization data using react-query
  const {
    data: customization,
    isError,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["customizationData"],
    queryFn: async () => {
      const userSlug = await authAPIs.findUserSlug({ mondayAPI: monday });

      return customizationAPIs.getCustomization({
        slug: userSlug,
      });
    },
  });

  if (isError) {
    console.error(error.message || "Failed to fetch customization data");

    return (
      <div className="bg-white rounded shadow-sm border border-gray-200 p-6 max-w-4xl flex flex-col gap-8">
        <p className="text-red-500">
          Failed to load customization settings. Please try again later.
        </p>
      </div>
    );
  }

  if (isFetching) {
    return <CustomizationSkeleton type="view-customization" />;
  }

  return (
    <div className="bg-white max-w-4xl flex flex-col gap-5">
      {customization ? (
        <>
          <div className="flex justify-end">
            <Link
              to={`/edit-customization`}
              className="bg-[#007F9B] text-white font-medium px-4 py-2 w-fit rounded hover:bg-[#007F9B]/80"
            >
              Edit Details
            </Link>
          </div>

          <div className="rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col gap-5">
            {/* Logo Section */}
            <div className="flex flex-col gap-3">
              <h2 className="text-gray-800 font-semibold text-lg leading-none">
                Logo
              </h2>
              {customization.logo ? (
                <div className="w-24 h-24 rounded overflow-hidden">
                  <img
                    // src={`data:image/png;base64,${customization.logo}`}
                    src={customization.logo}
                    alt="Board logo"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <p className="text-gray-400">No logo uploaded yet.</p>
              )}
            </div>

            {/* Description Section */}
            <div className="flex flex-col gap-3">
              <h2 className="text-gray-800 font-semibold text-lg leading-none">
                Description
              </h2>
              <div className="bg-gray-100 border border-gray-200 p-2 rounded-lg w-full h-fit min-h-[100px]">
                {customization.description ? (
                  <p>{customization.description}</p>
                ) : (
                  <p className="text-gray-400">No Description added yet.</p>
                )}
              </div>
            </div>

            {/* Link Section */}
            <div className="flex flex-col gap-3">
              <h2 className="text-gray-800 font-semibold text-lg leading-none">
                User Portal
              </h2>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <LinkIcon size={18} className="text-[#007F9B] rotate-45" />
                  <Link
                    to={`https://${customization.subDomain}.lucieup.com`}
                    target="_blank"
                    className="text-[#323338AD] hover:underline text-sm"
                  >
                    {`https://${customization.subDomain}.lucieup.com`}
                  </Link>
                </div>

                <CopyButton
                  value={`https://${customization.subDomain}.lucieup.com`}
                  timeout={3000}
                >
                  {({ copied, copy }) => (
                    <button
                      type="button"
                      className="bg-[#007F9B] p-[12px_16px] rounded-md text-white text-sm"
                      onClick={copy}
                    >
                      {copied ? "Copied" : "Copy URL"}
                    </button>
                  )}
                </CopyButton>
              </div>
            </div>
          </div>
          <div className="rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col gap-5">
            {/* Board Section */}
            <div className="flex flex-col gap-3">
              <h2 className="text-gray-800 font-semibold text-lg leading-none">
                Board
              </h2>
              <div className="bg-gray-100 border border-gray-200 p-2 rounded-lg w-full h-[42px] max-w-[450px] flex items-center">
                {customization.boardName}
              </div>
            </div>

            {/* Fields Section */}
            <div className="flex flex-col gap-3">
              <h2 className="text-gray-800 font-semibold text-lg leading-none">
                Fields
              </h2>
              <div className="flex flex-col gap-3">
                {customization.fields?.map((field) => (
                  <div key={field.columnId}>
                    <div className="bg-gray-100 border border-gray-200 p-2 rounded-lg w-full h-[42px] max-w-[450px] flex items-center">
                      {field.columnName}
                    </div>
                    {field.isEditable ? (
                      <p className="text-[12px] text-gray-500 mt-1">
                        (Editable)
                      </p>
                    ) : (
                      <p className="text-[12px] text-gray-500 mt-1">
                        (Not Editable)
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col gap-5">
            <h2 className="text-gray-800 font-semibold text-lg leading-none">
              Systems Flags
            </h2>
            <div className="flex flex-col gap-3">
              <Tooltip
                label="It allows the external users on to create new values for some columns such as 'Status', 'Dropdown' etc. - if the value is not present in the column options."
                refProp="rootRef"
                withArrow
                multiline
                w={220}
                transitionProps={{ duration: 200 }}
              >
                <Switch
                  label="Allow user to create new values in Dropdown and columns"
                  checked={customization.allowNewValueCreation === "true"}
                  disabled
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
                    checked={customization.filterItemsByEmail === "true"}
                    disabled
                    className="!w-fit"
                  />
                </Tooltip>
                {customization.filterItemsByEmail === "true" && (
                  <div className="bg-gray-100 border border-gray-200 p-2 rounded-lg w-full h-[42px] max-w-[450px] flex items-center text-gray-500">
                    {JSON.parse(customization.selectedEmailColumn)?.title ||
                      "No email column selected"}
                  </div>
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
                  checked={customization.allowUsersToCreateNewItems === "true"}
                  disabled
                  className="!w-fit"
                />
              </Tooltip>
              <Radio.Group
                name="signUpMethod"
                label="Sign Up Method"
                withAsterisk
                value={customization.signUpMethod}
              >
                <Group mt="xs">
                  <Radio
                    value="no-signup-allowed"
                    label="No Sign Up Allowed"
                    classNames={{
                      label: "!ps-1",
                    }}
                    disabled
                  />
                  <Radio
                    value="signup-with-admin-approval"
                    label="Allow Sign Up with Admin Approval"
                    classNames={{
                      label: "!ps-1",
                    }}
                    disabled
                  />
                  <Radio
                    value="signup-without-admin-approval"
                    label="Allow Sign Up without Admin Approval"
                    classNames={{
                      label: "!ps-1",
                    }}
                    disabled
                  />
                </Group>
              </Radio.Group>
            </div>
          </div>
        </>
      ) : (
        <>
          <p className="text-gray-500">
            No customization settings found. <br /> Please add your
            customization settings to personalize your board.
          </p>
          <Link
            to="/add-customization"
            className="bg-[#007F9B] text-white font-medium px-4 py-2 w-fit rounded hover:bg-[#007F9B]/80"
          >
            Add Customization
          </Link>
        </>
      )}
    </div>
  );
}
