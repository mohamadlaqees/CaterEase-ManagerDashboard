import { Skeleton } from "@/components/ui/skeleton";

const EditFoodSkeleton = () => {
  return (
    <main className="p-4 sm:p-6 lg:p-8 bg-gray-50/50">
      <header className="flex justify-between items-center font-bold mb-6">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-6 w-1/4" />
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Skeleton className="h-64 w-full rounded-lg" />
          <Skeleton className="h-20 w-full rounded-lg" />
          <Skeleton className="h-48 w-full rounded-lg" />
        </div>
        <div className="lg:col-span-2">
          <Skeleton className="h-full w-full rounded-lg" />
        </div>
      </div>
    </main>
  );
};

export default EditFoodSkeleton;
