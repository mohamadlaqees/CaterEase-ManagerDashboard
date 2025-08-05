import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  CircleAlert,
  CircleArrowUp,
  CircleCheck,
  CircleHelp,
  CheckCheck,
} from "lucide-react";

export const DashboardSkeleton = () => {
  return (
    <main className="w-full p-10 xl:flex gap-15 animate-pulse">
      {/* --- Left Column Skeleton --- */}
      <section className="flex flex-col sm:block flex-1">
        {/* Total Income Card Skeleton */}
        <div className="w-[335px] self-center sm:w-full 2xl:w-3xl px-8 py-5 bg-gray-100 rounded-md">
          <div className="flex items-center justify-between">
            <div className="space-y-3 text-center">
              <Skeleton className="h-4 w-24 mx-auto" />
              <Skeleton className="h-7 w-32 mx-auto" />
            </div>
            <Skeleton className="hidden sm:block w-0.5 h-20 " />
            <div className="hidden sm:flex justify-center gap-30 2xl:gap-50">
              <div className="space-y-3 text-center">
                <Skeleton className="h-4 w-20 mx-auto" />
                <Skeleton className="h-7 w-28 mx-auto" />
                <Skeleton className="h-5 w-20 mx-auto mt-2" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders Table Skeleton */}
        <div className="w-[335px] self-center sm:w-full 2xl:w-3xl mt-10 border-2 border-gray-200 py-5 px-8 rounded-md">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-5 w-16" />
              </div>
            ))}
          </div>
        </div>

        {/* Orders Rate Chart Skeleton */}
        <div className="w-[335px] self-center sm:w-full 2xl:w-3xl mt-10 border-2 border-gray-200 py-5 px-5 rounded-md">
          <Card>
            <CardHeader>
              <div className="flex justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-4 w-40" />
                </div>
                <div className="space-y-2 text-right">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[200px] w-full" />
            </CardContent>
          </Card>
        </div>

        {/* Activity Chart Skeleton */}
        <div className="w-[335px] self-center sm:w-full 2xl:w-3xl mt-10 border-2 border-gray-200 py-5 px-5 rounded-md">
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[250px] w-full" />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* --- Right Column Skeleton --- */}
      <section className="flex flex-col sm:block">
        <div className="flex items-stretch flex-col sm:flex-row sm:gap-3 xl:gap-0 xl:block">
          {/* Order Status Cards Skeleton */}
          <div className="w-[335px] self-center sm:self-auto sm:w-full mt-10 xl:mt-0 border-2 border-gray-200 py-5 pr-13 pl-6 rounded-md space-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-10">
                <Skeleton className="h-10 w-10 rounded-md" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-6 w-12" />
                </div>
              </div>
            ))}
          </div>

          {/* Popular Food Chart Skeleton */}
          <div className="w-[335px] self-center sm:self-auto sm:w-full mt-10 border-2 border-gray-200 py-5 px-5 rounded-md">
            <Card>
              <CardHeader className="items-center pb-0">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-48 mt-2" />
              </CardHeader>
              <CardContent className="flex justify-center items-center">
                <Skeleton className="h-[180px] w-[180px] rounded-full" />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Orders Delivered Card Skeleton */}
        <div className="w-[335px] self-center sm:w-full mt-10 py-5 px-8 rounded-md bg-gray-200">
          <Skeleton className="h-6 w-32 mb-4" />
          <Skeleton className="h-7 w-16 mb-4" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex justify-between border-b-2  pb-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-8" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};
