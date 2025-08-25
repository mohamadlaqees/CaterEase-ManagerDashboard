// src/components/skeletons/CategoryCarouselSkeleton.jsx
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const CategoryCardSkeleton = () => (
  <div className="text-center space-y-2 py-2 sm:px-10 sm:py-4">
    <Skeleton className="w-15 h-15 sm:w-20 sm:h-20 rounded-full mx-auto" />
    <Skeleton className="h-6 w-24 mx-auto" />
  </div>
);

export const CategoryCarouselSkeleton = () => {
  return (
    <div className="w-full px-2 pb-10 border-b-2 border-(--border-color)">
      <Carousel className="w-full max-w-[1200px] mx-auto">
        <CarouselContent>
          {Array.from({ length: 4 }).map((_, index) => (
            <CarouselItem
              key={index}
              className="max-[600px]:basis-[50%] basis-[32.5%] sm:basis-[33%] md:basis-[25%] xl:basis-[28%]"
            >
              <CategoryCardSkeleton />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};
