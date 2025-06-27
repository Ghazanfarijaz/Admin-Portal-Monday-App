import { Link } from "react-router-dom";
import mondaySdk from "monday-sdk-js";
import { useQuery } from "@tanstack/react-query";
import customizationAPIs from "../api/customization";
import { authAPIs } from "../api/auth";
import CustomizationSkeleton from "./CustomizationSkeleton";

const monday = mondaySdk();

export default function Configuration({ activeTab }) {
  // Fetch board details and customization data using react-query
  const {
    data: customization,
    isError,
    error,
    isPending,
  } = useQuery({
    queryKey: ["customizationData"],
    queryFn: async () => {
      const userSlug = await authAPIs.findUserSlug({ mondayAPI: monday });

      return customizationAPIs.getCustomization({
        slug: userSlug,
      });
    },
    enabled: activeTab === "configuration",
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

  if (isPending) {
    return <CustomizationSkeleton />;
  }

  return (
    <div className="bg-white rounded shadow-sm border border-gray-200 p-6 max-w-4xl flex flex-col gap-8">
      {customization ? (
        <>
          {/* Board Section */}
          <div className="flex flex-col gap-2">
            <h2 className="text-gray-800 font-semibold text-lg">Board</h2>
            <div className="bg-gray-100 border border-gray-200 p-2 rounded-lg w-full h-[48px] max-w-[450px] flex items-center">
              {customization.boardName}
            </div>
          </div>

          {/* Fields Section */}
          <div className="flex flex-col gap-2">
            <h2 className="text-gray-800 font-semibold text-lg">Fields</h2>
            <div className="flex flex-col gap-4">
              {customization.fields?.map((field) => (
                <div key={field.columnId} className="w-1/2 pr-2">
                  <div className="bg-gray-100 border border-gray-200 p-2 rounded-lg w-full h-[48px] max-w-[450px] flex items-center">
                    {field.columnName}
                  </div>
                  {field.isEditable && (
                    <div className="text-sm text-gray-500 mt-1">(Editable)</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Logo Section */}
          <div className="flex flex-col gap-2">
            <h2 className="text-gray-800 font-semibold text-lg">Logo</h2>
            {customization.logo ? (
              <div className="w-24 h-24 rounded overflow-hidden">
                <img
                  // src={`data:image/png;base64,${customization.logo}`}
                  src={customization.logo}
                  alt="Board logo"
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <p className="text-gray-400">No logo uploaded yet.</p>
            )}
          </div>

          {/* Description Section */}
          <div className="flex flex-col gap-2">
            <h2 className="text-gray-800 font-semibold text-lg">Description</h2>
            <div className="bg-gray-100 border border-gray-200 p-2 rounded-lg w-full h-fit min-h-[100px]">
              {customization.description ? (
                <p>{customization.description}</p>
              ) : (
                <p className="text-gray-400">No Description added yet.</p>
              )}
            </div>
          </div>

          {/* Sub-Domain Section */}
          <div className="flex flex-col gap-2">
            <h2 className="text-gray-800 font-medium">Sub-Domain</h2>
            <div className="bg-gray-100 border border-gray-200 p-2 rounded-lg w-full h-[48px] max-w-[450px] flex items-center">
              {customization.subDomain ? (
                <p>{customization.subDomain}</p>
              ) : (
                <p className="text-gray-400">N/A</p>
              )}
            </div>
          </div>

          <Link
            to={`/edit-customization/${customization.slug}`}
            className="bg-[#007F9B] text-white font-medium px-4 py-2 w-fit rounded hover:bg-[#007F9B]/80"
          >
            Edit Details
          </Link>
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
