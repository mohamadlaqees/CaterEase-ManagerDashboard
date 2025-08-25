import { Skeleton } from "@/components/ui/skeleton";

const OnGoingOrderSkeleton = () => {
  return (
    <div>
      {/* Ongoing Orders List Skeleton */}
      {[{ title: "Waiting" }, { title: "Cooking" }, { title: "Delivered" }].map(
        (section, i) => (
          <div key={i} className="mt-4">
            <Skeleton className="h-6 w-24 my-4" />
            <div className="p-3 border-2 border-gray-200 rounded-md space-y-4">
              {[...Array(1)].map((_, j) => (
                <div key={j} className="p-3 rounded-md flex items-center gap-5">
                  <Skeleton className="w-20 h-16 rounded-full" />
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
        )
      )}
    </div>
  );
};

export default OnGoingOrderSkeleton;
