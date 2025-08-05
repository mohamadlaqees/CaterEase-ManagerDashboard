import { BookOpen, ChevronRight } from "lucide-react";
import { NavLink, useNavigate, useParams } from "react-router";
import CategoryCard from "../components/CategoryCard";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  useDeletepackageMutation,
  usePackagesQuery,
} from "../store/apiSlice/apiSlice";
import { toast, Toaster } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import ConfirmPopUp from "../components/ConfirmPopUp";
import { useState } from "react";
import EmptyState from "../components/EmptyState";
import { PackageGridSkeleton } from "../components/skeleton/PackageCardSkeleton";
import { openConfirmPopUp } from "../store/menuSlice";

const Category = () => {
  const { category } = useParams();
  const dispatch = useDispatch();
  const [thePackageID, setThePackageID] = useState();
  const categoryID = category.split("-")[1];
  const categoryName = category.split("-")[0];
  const { confirmPopUpOpened } = useSelector((state) => state.menu);
  const { data: categoriesResponse, isLoading: packagesIsLoading } =
    usePackagesQuery(categoryID);
  const [deletePacakge, { isLoading: deletepackageIsLoading }] =
    useDeletepackageMutation();

  const navigate = useNavigate();

  const items = categoriesResponse?.packages?.map((pacakge) => ({
    id: pacakge?.id,
    name: pacakge?.name,
    photo: pacakge?.photo,
    rating: pacakge?.average_rating,
    reviews: pacakge?.reviews_count,
    categoryName,
    price: pacakge?.price,
  }));

  const showHandler = (item) => {
    navigate(`${item}`);
  };

  const editHandler = (packageID) => {
    navigate(`edit-food/${packageID}`);
  };

  const cancelPopUpHandler = () => {
    dispatch(openConfirmPopUp(false));
  };
  const openPopUpHandler = (packageID) => {
    dispatch(openConfirmPopUp(true));
    setThePackageID(packageID);
  };

  const deleteHandler = async () => {
    try {
      const response = await deletePacakge(thePackageID);
      dispatch(openConfirmPopUp(false));
      console.log(response);
      toast.success(response.data.message, {
        style: {
          background: "white",
          color: "#A1CA46",
          border: "1px solid hsl(var(--border))",
        },
      });
    } catch (error) {
      console.log(error);
      toast.error(error.data.error, {
        style: {
          background: "white",
          color: "#ef4444",
          border: "1px solid hsl(var(--border))",
        },
      });
    }
  };

  const renderContent = () => {
    if (packagesIsLoading) {
      return <PackageGridSkeleton />;
    }

    if (items?.length === 0) {
      return (
        <EmptyState
          icon={BookOpen}
          title={`The ${categoryName} Category is Empty`}
          description={`There are no packages here yet. Why not add the first one?`}
        />
      );
    }

    return (
      <>
        <div className="grid justify-center sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items?.map((item) => (
            <CategoryCard
              key={item.id} // It's better to use a unique ID for the key
              item={item}
              showHandler={showHandler}
              editHandler={editHandler}
              deleteHandler={() => openPopUpHandler(item.id)} // Pass the ID directly
            />
          ))}
        </div>
        <Pagination className="mt-10 text-(--secondaryFont) ">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                className="hover:bg-primary hover:text-white "
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                href="#"
                className="hover:bg-primary hover:text-white "
              >
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                href="#"
                isActive
                className="hover:bg-primary hover:text-white "
              >
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                href="#"
                className="hover:bg-primary hover:text-white "
              >
                3
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#"
                className="hover:bg-primary hover:text-white "
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </>
    );
  };

  return (
    <>
      <Toaster position="top-center" richColors />
      {confirmPopUpOpened && (
        <ConfirmPopUp
          loading={deletepackageIsLoading}
          onConfirm={deleteHandler}
          onCancel={cancelPopUpHandler}
          content={"Are You Sure You Want To Delete This Package ?"}
        />
      )}
      <main className=" text-(--primaryFont) p-10 ">
        <header className="flex justify-between items-center   font-bold mb-5">
          <span className="text-xl sm:text-2xl ">{categoryName}</span>
          <div className="flex gap-2 font-medium">
            <NavLink to={"/menu"} end>
              Menu
            </NavLink>
            <ChevronRight size={20} />
            <NavLink
              to={""}
              className={({ isActive }) =>
                `transition-all ${
                  isActive ? "text-(--primary)" : "text-(--primaryFont)"
                }`
              }
            >
              {categoryName}
            </NavLink>
          </div>
        </header>
        {renderContent()}
      </main>
    </>
  );
};

export default Category;
