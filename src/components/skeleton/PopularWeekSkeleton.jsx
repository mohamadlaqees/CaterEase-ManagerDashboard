// src/components/skeletons/PopularWeekSkeleton.jsx
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const PopularCardSkeleton = () => (
  <div className="py-5 px-3 sm:px-5">
    <div className="flex gap-5">
      <Skeleton className="w-26 h-20 rounded-md" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
    <Skeleton className="h-4 w-11/12 mt-4" />
  </div>
);

export const PopularWeekSkeleton = () => {
  return (
    <div className="w-full mt-10">
      <div className="px-2">
        <Carousel className="w-full max-w-[1200px] mx-auto">
          <CarouselContent>
            {Array.from({ length: 3 }).map((_, index) => (
              <CarouselItem
                key={index}
                className="basis-[100%] md:basis-[50%] xl:basis-[33.3%]"
              >
                <PopularCardSkeleton />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};
