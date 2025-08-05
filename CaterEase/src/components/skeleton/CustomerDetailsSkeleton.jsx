import { Skeleton } from "@/components/ui/skeleton";

const CustomerDetailsSkeleton = () => {
  return (
    <main className="text-(--primaryFont) py-10 px-3 sm:p-10 animate-pulse">
      {/* Header Skeleton */}
      <header className="flex justify-between items-center font-bold mb-5">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-6 w-64 hidden sm:block" />
      </header>

      <div className="flex flex-col 2xl:flex-row gap-10">
        {/* Left Column: Customer Profile Skeleton */}
        <section className="flex flex-col border-2 border-gray-200 rounded-lg shadow-sm bg-white">
          {/* Profile Header */}
          <div className="relative flex flex-col sm:flex-row items-center gap-6 p-6 sm:p-8 border-b-2 border-gray-200">
            <div className="flex-shrink-0">
              <Skeleton className="w-30 h-30 rounded-full" />
            </div>
            <div className="flex flex-col items-center sm:items-start gap-3">
              <Skeleton className="h-7 w-40" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-56" />
            </div>
          </div>

          {/* About Customer Section */}
          <div className="p-6 sm:p-8 border-b-2 border-gray-200">
            <Skeleton className="h-6 w-32 mb-10" />
            <div className="space-y-8">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-5/6" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-1/2" />
            </div>
          </div>

          {/* Coupon Section */}
          <div className="mx-10 my-5 p-4 flex items-center justify-between gap-2 border border-gray-200 rounded-lg">
            <Skeleton className="h-5 w-16" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        </section>

        {/* Right Column: Order History Skeleton */}
        <section className="p-4 sm:p-8 shadow-sm basis-1/2 border-2 border-gray-200 rounded-md">
          <div className="flex justify-between mb-10">
            <Skeleton className="h-7 w-56" />
            <Skeleton className="h-10 w-40" />
          </div>
          <div className="border-2 border-gray-200 py-5 px-8 rounded-md">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-8 w-28 rounded-md" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default CustomerDetailsSkeleton;
