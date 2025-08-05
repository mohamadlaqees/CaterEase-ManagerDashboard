import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import renderStars from "../util/renderStars";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Link, useNavigate } from "react-router";
import {
  useBestSellerQuery,
  useCategoriesQuery,
  usePopularThisWeekQuery,
  usePromoQuery,
} from "../store/apiSlice/apiSlice";
import { CategoryCarouselSkeleton } from "../components/skeleton/CategoryCarouselSkeleton";
import { PopularWeekSkeleton } from "../components/skeleton/PopularWeekSkeleton";
import { BestSellerSkeleton } from "../components/skeleton/BestSellerSkeleton";
import { PromoSkeleton } from "../components/skeleton/PromoSkeleton";
import EmptySection from "../components/EmptySection";
import { useEffect } from "react";

const Menu = () => {
  const { data: categoriesResponse, isLoading: categoriesIsLoading } =
    useCategoriesQuery();
  const { data: popularThisWeekResponse, isLoading: popularThisWeekIsLoading } =
    usePopularThisWeekQuery(localStorage.getItem("branchID"));
  const { data: bestSellerResponse, isLoading: bestSellerIsLoading } =
    useBestSellerQuery(localStorage.getItem("branchID"));
  const { data: promoResponse, isLoading: promoIsLoading } = usePromoQuery();
  console.log(promoResponse);
  const navigate = useNavigate();
  const buttonHandler = () => {
    navigate("add-food");
  };

  const transformedCategories = categoriesResponse?.map((category) => {
    return {
      id: category?.id,
      label: category?.name,
      src: `${
        category.name === "Eastern"
          ? "eastern.png"
          : category.name === "Western"
          ? "western.png"
          : category.name === "Desserts"
          ? "desserts.png"
          : category.name === "Soft Drinks"
          ? "softDrinks.png"
          : ""
      }`,
    };
  });

  const transformedPopularThisWeek = popularThisWeekResponse?.packages?.map(
    (packages) => {
      return {
        id: packages.id,
        src: packages.photo,
        alt: packages.name,
        name: packages.name,
        price: packages.price,
        rating: packages.average_rating,
        reviews: packages.feedback_count + " user reviews",
        description:
          "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Qui et ipsa porro id ullam! Asperiores",
        category: packages.category_ids?.[0],
      };
    }
  );
  const transformedBestSeller = bestSellerResponse?.best_selling_packages?.map(
    (packages) => {
      return {
        id: packages.id,
        src: packages.photo,
        alt: packages.name,
        name: packages.name,
        price: packages.price,
        sold: `Sold ${packages.order_count}`,
        change: "+15%",
        category: packages.category_ids?.[0],
      };
    }
  );
  const transformedPromo = promoResponse?.map((packages) => {
    return {
      id: packages.id,
      discount: packages.discount_value,
      name: packages.name,
      price: packages.old_price,
      rating: packages.average_rating,
      reviews: `${packages.reviews_count} 1k user reviews`,
      image: packages.photo,
      category: packages.category_ids?.[0],
    };
  });

  const choosenPopularCateogry = transformedCategories?.find(
    (category, inx) =>
      category.id === transformedPopularThisWeek?.[inx]?.category
  )?.label;
  const choosenBestSellerCateogry = transformedCategories?.find(
    (category, inx) => category.id === transformedBestSeller?.[inx]?.category
  )?.label;
  const choosenPromoCateogry = transformedCategories?.find(
    (category, inx) => category.id === transformedPromo?.[inx]?.category
  )?.label;

  useEffect(() => {
    const categories = categoriesResponse?.map((category) => {
      return {
        id: category.pivot.category_id,
        name: category.name,
      };
    });
    console.log(categories);
    localStorage.setItem("categories", categories);
  }, [categoriesResponse]);
  console.log(localStorage.getItem("categories"));
  return (
    <>
      <main className="text-(--primaryFont) p-10">
        <div className="flex justify-end  mb-10">
          <Button
            type="submit"
            className="w-full text-sm p-4 sm:text-lg max-w-32 flex gap-5 sm:w-44 sm:max-w-max h-10 cursor-pointer"
            onClick={buttonHandler}
            size="icon"
          >
            <Plus className="hidden sm:block" size={30} />
            Add Package
          </Button>
        </div>

        {/* Category */}
        <header className="flex justify-between text-xl sm:text-2xl font-bold mb-5">
          <h1>Category</h1>
        </header>
        {categoriesIsLoading ? (
          <CategoryCarouselSkeleton />
        ) : (
          <div className="w-full px-2 pb-10 border-b-2 border-(--border-color)">
            <Carousel className="w-full max-w-[1200px] mx-auto">
              <CarouselContent>
                {transformedCategories?.map((category) => (
                  <CarouselItem
                    key={category.id}
                    className="max-[600px]:basis-[50%] basis-[32.5%]  sm:basis-[33%] md:basis-[25%]  xl:basis-[28%]"
                  >
                    <Link
                      to={`${category.label}-${category.id}`}
                      className="block sm:w-[169px] cursor-pointer hover:brightness-100 hover:bg-(--secondary) hover:border-0 transition-all  text-center space-y-2 border-2 border-(--border-color) rounded-md  py-2 sm:px-10 sm:py-4 "
                    >
                      <img
                        className={`${
                          category.label === "Chicken" ? "ml-1" : ""
                        } w-15 h-15 sm:w-20 sm:h-20 object-contain mx-auto`}
                        src={category.src}
                        alt={category.alt}
                      />
                      <p className="text-sm sm:text-base font-semibold">
                        {category.label}
                      </p>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="flex justify-center xl:hidden" />
              <CarouselNext className="flex justify-center xl:hidden" />
            </Carousel>
          </div>
        )}

        {/* Popular This Week */}
        <div className="w-full mt-10">
          <header className="text-xl sm:text-2xl font-bold mb-5">
            Popular This Week
          </header>
          {popularThisWeekIsLoading ? (
            <PopularWeekSkeleton />
          ) : transformedPopularThisWeek?.lengtg > 0 ? (
            <div className=" px-2">
              <Carousel
                className="w-full max-w-[1200px] mx-auto"
                opts={{
                  slidesToScroll: 1,
                }}
              >
                <CarouselContent>
                  {transformedPopularThisWeek?.map((item, index) => (
                    <CarouselItem
                      key={index}
                      className="basis-[100%] md:basis-[50%]  xl:basis-[33.3%]"
                    >
                      <div
                        onClick={() =>
                          navigate(
                            `${choosenPopularCateogry}-${item.category}/${item.id}`
                          )
                        }
                        className="hover:shadow-md cursor-pointer transition hover:-translate-y-1 hover:border-0 py-5 px-3 sm:px-5 rounded-md border-2 border-(--border-color)"
                      >
                        <div className="flex gap-5">
                          <img
                            className="w-26 h-20 object-contain "
                            src={item.src}
                            alt="burger-menu"
                          />
                          <div>
                            <div className="w-[140px] sm:w-fit xl:w-[140px] 2xl:w-fit">
                              <p
                                title={item.name}
                                className="font-semibold text-sm  overflow-hidden whitespace-nowrap  overflow-ellipsis sm:text-base"
                              >
                                {item.name}
                              </p>
                            </div>
                            <span className="text-(--primary) font-bold text-lg sm:text-xl">
                              {item.price}
                            </span>
                            <div className="flex items-center gap-3 mt-1">
                              <div>{renderStars(1)}</div>
                              <span className="text-(--secondaryFont) font-bold text-xs sm:text-sm">
                                {item.rating} <span className="text-xl">.</span>{" "}
                                {item.reviews}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm mt-4 text-(--secondaryFont)">
                          {item.description}
                        </p>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="flex justify-center xl:hidden" />
                <CarouselNext className="flex justify-center xl:hidden" />
              </Carousel>
            </div>
          ) : (
            <EmptySection
              message={"There is no Popular This Week packages"}
              title={"Popular This Week"}
            />
          )}
        </div>

        {/* Best Seller */}
        <div className="w-full mt-20">
          <header className="text-xl sm:text-2xl font-bold mb-5">
            Best Seller
          </header>
          {bestSellerIsLoading ? (
            <BestSellerSkeleton />
          ) : transformedBestSeller?.length > 0 ? (
            <div className=" px-2">
              <Carousel className="w-full max-w-[1200px] mx-auto">
                <CarouselContent>
                  {transformedBestSeller?.map((item, index) => (
                    <CarouselItem
                      key={index}
                      className="min-[500px]:basis-[50%] md:basis-[33.3%]  xl:basis-[25%]"
                    >
                      <div
                        onClick={() =>
                          navigate(
                            `${choosenBestSellerCateogry}-${item.category}/${item.id}`
                          )
                        }
                        className="text-center rounded-md border-2 border-(--border-color) hover:shadow-md cursor-pointer transition hover:-translate-y-1 hover:border-0  py-5 px-3 sm:px-5"
                      >
                        <img
                          src={item.src}
                          className={`mx-auto w-50 h-50 object-contain`}
                          alt=""
                        />
                        <div className="my-4 space-y-3">
                          <div className="sm:w-[140px] mx-auto  xl:w-[140px] 2xl:w-fit">
                            <p
                              title={item.name}
                              className="font-semibold text-sm  overflow-hidden whitespace-nowrap  overflow-ellipsis sm:text-base"
                            >
                              {item.name}
                            </p>
                          </div>
                          <span className="block font-bold text-(--primary) text-lg sm:text-xl">
                            {item.price}
                          </span>
                          <div className="flex justify-center gap-3 text-sm">
                            <span className="text-(--secondaryFont) pr-4 border-r-2 border-(--border-color)">
                              {item.sold}
                            </span>
                            <span className="text-[#1fbf75] font-bold">
                              {item.change}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="flex justify-center xl:hidden" />
                <CarouselNext className="flex justify-center xl:hidden" />
              </Carousel>
            </div>
          ) : (
            <EmptySection
              message={"There is no Best Seller packages"}
              title={"Best Seller"}
            />
          )}
        </div>

        {/* {transformedPromo?.length > 0 && ( */}
        <div className="w-full mt-20">
          <header className="text-xl sm:text-2xl font-bold mb-5">Promo</header>
          {promoIsLoading ? (
            <PromoSkeleton />
          ) : transformedPromo?.length > 0 ? (
            <div className=" px-2">
              <Carousel className="w-full max-w-[1200px]  mx-auto">
                <CarouselContent>
                  {transformedPromo?.map((Ditem, index) => (
                    <CarouselItem
                      key={index}
                      className="basis-[100%] md:basis-[50%]  xl:basis-[33.3%]"
                    >
                      <div
                        onClick={() =>
                          navigate(
                            `${choosenPromoCateogry}-${Ditem.category}/${Ditem.id}`
                          )
                        }
                        className="rounded-md border-2 border-(--border-color) hover:shadow-md cursor-pointer transition hover:-translate-y-1 hover:border-0 py-5 px-3 sm:px-5"
                      >
                        <span className="bg-[#e75858] text-sm p-2 text-white rounded-r-md relative right-5">
                          {Ditem.discount}
                        </span>
                        <div className="flex items-center justify-between mt-2">
                          <div className="space-y-2">
                            <p className="font-semibold text-sm sm:text-base">
                              {Ditem.name}
                            </p>
                            <span className="text-(--primary) font-bold text-lg sm:text-xl">
                              {Ditem.price}
                            </span>
                            <div className="flex items-center gap-3">
                              <div>{renderStars(1)}</div>
                              <span className="text-(--secondaryFont) font-bold text-xs sm:text-sm">
                                {Ditem.rating}
                                <span className="text-xl">.</span>
                                {Ditem.reviews}
                              </span>
                            </div>
                          </div>
                          <img
                            src={Ditem.image}
                            className="w-26 h-20  object-contain"
                            alt=""
                          />
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="flex justify-center xl:hidden" />
                <CarouselNext className="flex justify-center xl:hidden" />
              </Carousel>
            </div>
          ) : (
            <EmptySection
              message={"There is no Promo packages"}
              title={"Promo"}
            />
          )}
        </div>
        {/* )} */}
      </main>
    </>
  );
};

export default Menu;
