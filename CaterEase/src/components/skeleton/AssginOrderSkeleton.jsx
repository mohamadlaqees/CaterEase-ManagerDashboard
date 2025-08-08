// src/components/skeletons/AssignOrderSkeleton.jsx

import { Skeleton } from "@/components/ui/skeleton";

/**
 * Represents the loading state for a single employee item in the list.
 */
const EmployeeItemSkeleton = () => (
  <div className="flex px-5 py-5 mx-4 my-5 border-2 border-transparent rounded-md justify-between items-center">
    {/* Left side: Avatar and Name */}
    <div className="flex gap-3 items-center">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[150px]" />
      </div>
    </div>

    {/* Right side: Button */}
    <div className="self-center">
      <Skeleton className="h-10 w-[120px] rounded-md" />
    </div>
  </div>
);

/**
 * The main skeleton component for the "Assign Order" popup.
 * It renders a list of skeleton items to simulate the loading of employees.
 */
export const AssignOrderSkeleton = () => {
  return (
    <div className="overflow-hidden max-h-[400px] py-2">
      {/* Create an array of a fixed length to render multiple skeleton items */}
      {Array.from({ length: 4 }).map((_, index) => (
        <EmployeeItemSkeleton key={index} />
      ))}
    </div>
  );
};
