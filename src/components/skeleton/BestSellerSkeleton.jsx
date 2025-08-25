// src/components/skeletons/BestSellerSkeleton.jsx
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const BestSellerCardSkeleton = () => (
  <div className="text-center py-5 px-3 sm:px-5 space-y-4">
    <Skeleton className="h-32 w-32 rounded-full mx-auto" />
    <div className="space-y-3">
      <Skeleton className="h-5 w-3/4 mx-auto" />
      <Skeleton className="h-6 w-1/2 mx-auto" />
      <Skeleton className="h-4 w-3/4 mx-auto" />
    </div>
  </div>
);

export const BestSellerSkeleton = () => {
  return (
    <div className="w-full mt-20">
      <div className="px-2">
        <Carousel className="w-full max-w-[1200px] mx-auto">
          <CarouselContent>
            {Array.from({ length: 4 }).map((_, index) => (
              <CarouselItem
                key={index}
                className="min-[500px]:basis-[50%] md:basis-[33.3%] xl:basis-[25%]"
              >
                <BestSellerCardSkeleton />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};
