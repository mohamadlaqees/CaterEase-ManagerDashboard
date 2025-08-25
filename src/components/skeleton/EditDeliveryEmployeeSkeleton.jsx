import { Skeleton } from "@/components/ui/skeleton"; // Assuming you have a Skeleton component from shadcn/ui

const EditDeliveryEmployeeSkeleton = () => {
  return (
    <main className="p-4 sm:p-6 lg:p-8 bg-gray-50/50 min-h-screen flex items-center justify-center">
      <div className="max-w-3xl w-full mx-auto">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
          {/* Header Skeleton */}
          <div className="p-6 border-b border-gray-200">
            <Skeleton className="h-8 w-1/2 rounded-lg" />
            <Skeleton className="h-4 w-3/4 mt-2 rounded-lg" />
          </div>

          {/* Form Body Skeleton */}
          <div className="p-6 md:p-8 space-y-8">
            {/* Two-column grid for inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Input Skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/4 rounded-lg" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              {/* Input Skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/4 rounded-lg" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              {/* Input Skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/3 rounded-lg" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              {/* Input Skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/3 rounded-lg" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              {/* Radio Group Skeleton */}
              <div className="space-y-3">
                <Skeleton className="h-4 w-1/4 rounded-lg" />
                <div className="flex space-x-4 pt-2">
                  <Skeleton className="h-10 w-1/2 rounded-md" />
                  <Skeleton className="h-10 w-1/2 rounded-md" />
                </div>
              </div>
            </div>

            {/* Password Field Skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/4 rounded-lg" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>

            {/* Availability Switch Skeleton */}
            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-2">
                <Skeleton className="h-5 w-24 rounded-lg" />
                <Skeleton className="h-4 w-48 rounded-lg" />
              </div>
              <Skeleton className="h-6 w-12 rounded-full" />
            </div>
          </div>

          {/* Footer Skeleton */}
          <div className="flex items-center justify-end gap-4 p-6 bg-gray-50 border-t border-gray-200">
            <Skeleton className="h-10 w-24 rounded-md" />
            <Skeleton className="h-10 w-32 rounded-md" />
          </div>
        </div>
      </div>
    </main>
  );
};

export default EditDeliveryEmployeeSkeleton;
