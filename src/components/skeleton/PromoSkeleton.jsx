// src/components/skeletons/PromoSkeleton.jsx
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

// Skeleton for a single promo card
const PromoCardSkeleton = () => (
  <div className="py-5 px-3 sm:px-5">
    {/* The discount badge placeholder */}
    <Skeleton className="h-8 w-20 mb-4" />
    <div className="flex items-center justify-between mt-2">
      {/* Text content placeholders */}
      <div className="space-y-3 flex-1">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-full" />
      </div>
      {/* Image placeholder */}
      <Skeleton className="w-24 h-20 rounded-md ml-4" />
    </div>
  </div>
);

// The full carousel skeleton for the Promo section
export const PromoSkeleton = () => {
  return (
    <div className="w-full mt-20">
      <div className="px-2">
        <Carousel className="w-full max-w-[1200px] mx-auto">
          <CarouselContent>
            {Array.from({ length: 3 }).map((_, index) => (
              <CarouselItem
                key={index}
                className="basis-[100%] md:basis-[50%] xl:basis-[33.3%]"
              >
                <PromoCardSkeleton />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};
