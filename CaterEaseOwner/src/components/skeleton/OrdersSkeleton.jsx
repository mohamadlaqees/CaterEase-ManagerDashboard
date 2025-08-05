// src/components/skeleton/OrdersSkeleton.jsx
import { Skeleton } from "@/components/ui/skeleton";

export const OrdersSkeleton = () => {
  return (
    <main className="p-10 animate-pulse">
      {/* --- Stats Cards Skeleton --- */}
      <section className="flex justify-center md:justify-start flex-wrap 2xl:flex-nowrap gap-10">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-5 p-5 border-2 border-gray-200 rounded-md w-full md:w-fit min-w-xs"
          >
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        ))}
      </section>

      {/* --- Main Content Skeleton --- */}
      <section className="mt-10 flex flex-wrap xl:flex-nowrap gap-10">
        {/* --- Orders History Skeleton (Left Side) --- */}
        <div className="p-8 w-full 2xl:basis-3/4 border-2 border-gray-200 rounded-md">
          <div className="flex justify-between items-center">
            <Skeleton className="h-7 w-40 mb-4" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="w-full mt-10 border-2 border-gray-200 py-5 px-8 rounded-md">
            <div className="max-h-[400px]">
              <table className="w-full min-w-[500px]">
                {/* Table Header Skeleton */}
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-2 px-2 text-left">
                      <Skeleton className="h-5 w-20" />
                    </th>
                    <th className="py-2 px-2 text-left">
                      <Skeleton className="h-5 w-16" />
                    </th>
                    <th className="py-2 px-2 text-left">
                      <Skeleton className="h-5 w-24" />
                    </th>
                    <th className="py-2 px-2 text-left">
                      <Skeleton className="h-5 w-20" />
                    </th>
                  </tr>
                </thead>
                {/* Table Body Skeleton */}
                <tbody>
                  {[...Array(5)].map((_, i) => (
                    <tr
                      key={i}
                      className="border-b border-gray-200 last:border-b-0"
                    >
                      <td className="py-4 px-2">
                        <Skeleton className="h-5 w-24" />
                      </td>
                      <td className="py-4 px-2">
                        <Skeleton className="h-5 w-16" />
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-12 w-12 rounded-full" />
                          <Skeleton className="h-5 w-32" />
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <Skeleton className="h-8 w-28 rounded-md" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* --- Ongoing Orders Skeleton (Right Side) --- */}
        <div className="p-8 w-full 2xl:basis-1/2 border-2 border-gray-200 rounded-md">
          <div className="flex items-start justify-between flex-wrap 2xl:flex-nowrap mb-4">
            <Skeleton className="h-7 w-48 mb-4" />
            <Skeleton className="h-10 w-40" />
          </div>

          {/* Ongoing Section Skeleton */}
          {[...Array(3)].map((_, i) => (
            <div key={i} className="mt-6">
              <Skeleton className="h-6 w-24 my-4" />
              <div className="p-3 border-2 border-gray-200 rounded-md space-y-4">
                {[...Array(2)].map((_, j) => (
                  <div
                    key={j}
                    className="bg-gray-50 p-3 rounded-md flex items-center gap-5"
                  >
                    <Skeleton className="w-20 h-16 rounded-md" />
                    <div className="w-full flex justify-between items-center">
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <Skeleton className="h-4 w-12" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};
