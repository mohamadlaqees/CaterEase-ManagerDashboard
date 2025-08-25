import { Skeleton } from "@/components/ui/skeleton";
import { Dot } from "lucide-react";

export const OrderDetailsSkeleton = () => {
  return (
    <main className="text-(--primaryFont)   animate-pulse">
      {/* Main content container */}
      <section className="border-2 border-gray-200 rounded-md">
        {/* Order Info Header */}
        <header className="flex items-center gap-5 p-5 border-b-2 border-gray-200">
          <Skeleton className="h-6 w-32" />
          <Dot className="text-gray-300" />
          <Skeleton className="h-6 w-28" />
          <Dot className="text-gray-300" />
          <Skeleton className="h-6 w-24" />
        </header>

        <div className="flex flex-col 2xl:flex-row px-5 xl:pl-5">
          {/* Left Column: Main Details */}
          <div className="w-full">
            {/* Top cards: User, Shipping, Payment */}
            <div className="flex flex-wrap justify-center xl:flex-nowrap gap-5 mt-10">
              {/* User Info Card Skeleton */}
              <div className="w-full border-2 border-gray-200 rounded-md">
                <div className="p-4 border-b-2 border-gray-200">
                  <Skeleton className="h-6 w-24" />
                </div>
                <div className="p-4 space-y-4">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-5 w-1/4 mt-2" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-5 w-1/4 mt-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>

              {/* Shipping Address Card Skeleton */}
              <div className="w-full border-2 border-gray-200 rounded-md">
                <div className="p-4 border-b-2 border-gray-200">
                  <Skeleton className="h-6 w-32" />
                </div>
                <div className="p-4 space-y-4">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-5 w-1/4 mt-2" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-5 w-1/4 mt-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>

              {/* Total Payment Card Skeleton */}
              <div className="w-full border-2 border-gray-200 rounded-md">
                <div className="p-4 border-b-2 border-gray-200">
                  <Skeleton className="h-6 w-36" />
                </div>
                <div className="space-y-2">
                  <div className="p-3 flex justify-between border-b-2 border-gray-200">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <div className="p-3 flex justify-between border-b-2 border-gray-200">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-5 w-12" />
                  </div>
                  <div className="p-3 flex justify-between border-b-2 border-gray-200">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                  <div className="p-3 flex justify-between">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Tracker Skeleton */}
            <div className="xl:w-full max-w-4xl mt-10 px-4">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 items-center justify-between">
                {[...Array(4)].map((_, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center z-10 w-1/4"
                  >
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <Skeleton className="h-4 w-20 mt-2" />
                  </div>
                ))}
              </div>
            </div>

            {/* Table Skeleton */}
            <div className="border-2 border-gray-200 rounded-md p-4 sm:ml-5 my-10 max-w-[880px]">
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 flex-grow">
                      <Skeleton className="w-12 h-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-12" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Actions */}
          <div className="flex flex-col gap-10 2xl:justify-between mx-5 mb-10">
            {/* Delivery Details / Manage Delivery Skeleton */}
            <div className="2xl:w-[280px] w-full mt-10 border-2 border-gray-200 rounded-md">
              <div className="p-4 border-b-2 border-gray-200">
                <Skeleton className="h-6 w-32" />
              </div>
              <div className="p-4 flex justify-center">
                <Skeleton className="w-24 h-16" />
              </div>
              <div className="mx-4 my-5">
                <Skeleton className="w-full h-10" />
              </div>
            </div>

            {/* Action Buttons Skeleton */}
            <div className="flex flex-col text-sm sm:text-base items-center sm:flex-row sm:justify-end gap-10">
              <Skeleton className="w-full sm:w-32 h-10" />
              <Skeleton className="w-full sm:w-32 h-10" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
