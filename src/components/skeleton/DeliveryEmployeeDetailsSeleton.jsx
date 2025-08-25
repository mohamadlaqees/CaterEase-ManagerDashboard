import { Skeleton } from "@/components/ui/skeleton";
import { BanknoteArrowDown, CheckCheck, CircleAlert } from "lucide-react";

export const DeliveryEmployeeDetailsSkeleton = () => {
  return (
    <main className="text-(--primaryFont) py-10 px-3 sm:p-10 animate-pulse">
      <div className="flex flex-col 2xl:flex-row gap-10">
        {/* Left Column: Profile Card Skeleton */}
        <section className="flex flex-col border-2 border-gray-200 rounded-lg bg-white">
          {/* Profile Header */}
          <div className="relative flex flex-col sm:flex-row items-center gap-6 p-6 sm:p-8 border-b-2 border-gray-200">
            <Skeleton className="w-24 h-24 sm:w-28 sm:h-28 rounded-full" />
            <div className="flex flex-col items-center sm:items-start gap-3">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-56" />
            </div>
          </div>

          {/* About Me Section */}
          <div className="p-6 sm:p-8 border-b-2 border-gray-200">
            <Skeleton className="h-6 w-24 mb-4" />
            <div className="space-y-5">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-5/6" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-4/5" />
            </div>
          </div>

          {/* Statistics Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 sm:p-8">
            <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
              <CheckCheck className="h-10 w-10 text-gray-300" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-10" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
              <CircleAlert className="h-10 w-10 text-gray-300" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-8" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
          </div>

          {/* Earnings Section */}
          <div className="p-6 sm:p-8">
            <div className="bg-gray-100 border border-gray-200 rounded-lg p-5">
              <div className="flex items-center gap-4 border-b border-gray-200 pb-3">
                <BanknoteArrowDown className="h-10 w-10 text-gray-400" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-32" />
                </div>
              </div>
              <div className="mt-4 text-center space-y-2">
                <Skeleton className="h-4 w-20 mx-auto" />
                <Skeleton className="h-5 w-10 mx-auto" />
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Order History Skeleton */}
        <section className="p-4 shadow-sm sm:p-8 basis-1/2 border-2 border-gray-200 rounded-md">
          <div className="flex justify-between mb-10">
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-10 w-40" />
          </div>
          <div className="border-2 border-gray-200 py-5 px-8 rounded-md">
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <Skeleton className="h-5 w-20" />
                  <div className="flex items-center gap-3 flex-1 ml-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-8 w-24 rounded-md" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};
