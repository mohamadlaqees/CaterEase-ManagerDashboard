import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const EditBranchDetailsSkeleton = () => {
  return (
    <main className="p-4 sm:p-6 md:p-10 bg-gray-50 min-h-screen">
      {/* Skeleton for Breadcrumb Header */}
      <header className="flex items-center justify-between font-bold mb-8">
        <Skeleton className="h-8 w-32" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-5 w-40" />
        </div>
      </header>

      <div className="space-y-8">
        {/* Skeleton for Basic Information & Image Upload */}
        <div className="grid lg:grid-cols-3 gap-8 lg:items-stretch">
          <Card className="lg:col-span-2">
            <CardHeader>
              <Skeleton className="h-7 w-1/3" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-20 w-full" />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skeleton for Image Upload Card */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <Skeleton className="h-7 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="w-full aspect-video rounded-md" />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Skeleton for Categories and Occasions */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <Skeleton className="h-7 w-1/3" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-10" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-10" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-7 w-1/3" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-10" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Skeleton for Working Hours */}
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-1/4" />
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Create 7 rows to represent each day of the week */}
            {Array.from({ length: 7 }).map((_, index) => (
              <div key={index} className="grid grid-cols-3 gap-4 items-center">
                <Skeleton className="h-5 w-full col-span-1" />
                <Skeleton className="h-10 w-full col-span-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Skeleton for Services */}
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-1/3" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-28 w-full rounded-lg" />
            <Skeleton className="h-28 w-full rounded-lg" />
          </CardContent>
        </Card>

        {/* Skeleton for Delivery Regions */}
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-1/3" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-28 w-full rounded-lg" />
          </CardContent>
        </Card>
      </div>

      {/* Skeleton for Action Buttons Footer */}
      <div className="flex items-center justify-end gap-4 p-6 mt-8 bg-gray-100 border-t rounded-lg sticky bottom-0">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-32" />
      </div>
    </main>
  );
};

export default EditBranchDetailsSkeleton;
