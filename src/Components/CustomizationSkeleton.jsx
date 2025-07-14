import { Skeleton } from "@mantine/core";

const CustomizationSkeleton = ({ type }) => {
  return (
    <div className={`bg-white max-w-4xl flex flex-col gap-5`}>
      {type === "view-customization" && (
        <div className="flex justify-end">
          <Skeleton className="!w-[120px] !h-[38px] !rounded-md" />
        </div>
      )}
      <div className="rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col gap-5">
        {/* Logo Section */}
        <div className="flex flex-col gap-2">
          <Skeleton width={50} height={25} radius={2} />
          <Skeleton className="!w-[120px] !h-[120px] !rounded-lg" />
        </div>

        {/* Description Section */}
        <div className="flex flex-col gap-2">
          <Skeleton width={150} height={25} radius={2} />
          <Skeleton className="!w-full !h-[100px] !rounded-lg" />
        </div>

        {/* Sub domain */}
        <div className="flex flex-col gap-2">
          <Skeleton width={120} height={25} radius={2} />
          <Skeleton className="!w-full !max-w-[450px] !h-[42px] !rounded-lg" />
        </div>
      </div>
      <div className="rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col gap-5">
        {/* Board Section */}
        <div className="flex flex-col gap-2">
          <Skeleton width={100} height={25} radius={2} />
          <Skeleton className="!w-full !max-w-[450px] !h-[42px] !rounded-lg" />
        </div>

        {/* Fields Section */}
        <div className="flex flex-col gap-2">
          <Skeleton width={100} height={25} radius={2} />
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton
                key={index}
                className="!w-full !max-w-[450px] !h-[42px] !rounded-lg"
              />
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col gap-5">
        <Skeleton width={120} height={25} radius={2} />
        <div className="flex flex-col gap-2">
          <Skeleton width={350} height={25} radius={4} />
          <Skeleton width={270} height={25} radius={4} />
          <Skeleton width={230} height={25} radius={4} />
          <Skeleton width={300} height={25} radius={4} />
        </div>
      </div>

      {type === "edit-customization" && (
        <Skeleton className="!w-[150px] !h-[42px] !rounded-lg" />
      )}
    </div>
  );
};

export default CustomizationSkeleton;
