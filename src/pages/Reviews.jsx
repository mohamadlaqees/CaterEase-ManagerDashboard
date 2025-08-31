// src/pages/Reviews.js

import { useState } from "react";
import { format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { toast, Toaster } from "sonner";
import { CalendarIcon, Star } from "lucide-react";

// Import UI Components
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import ConfirmPopUp from "../components/ConfirmPopUp";
import EmptySection from "../components/EmptySection";

// Import Hooks, Components & Utilities
import {
  useReviewsQuery,
  useReviewsDateFilterQuery,
  useDeleteReviewMutation,
  useChangeReviewStatusMutation,
  useReviewsStatisticsQuery,
} from "../store/apiSlice/apiSlice";
import renderStars from "../util/renderStars";
import ReviewsSkeleton from "../components/skeleton/ReviewsSkeleton";
import Review from "../components/Review"; // The details modal
import { openConfirmPopUp } from "../store/reviewSlice";

// --- A simplified, reusable list item component ---
const ReviewListItem = ({ review, onClick }) => (
  <div
    className="p-6 mb-4 border rounded-lg shadow-sm hover:bg-gray-50 transition-all cursor-pointer"
    onClick={onClick}
  >
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3">
        <img
          src="/person.png"
          className="rounded-full w-10 h-10"
          alt="User avatar"
        />
        <h2 className="text-lg font-bold text-(--primaryFont) truncate">
          {review.name}
        </h2>
      </div>
      <span className="text-xs flex-shrink-0 font-medium text-(--secondaryFont) bg-gray-200 py-1 px-2 rounded-full capitalize">
        {review.status.replace("_", " ")}
      </span>
    </div>
    <div className="flex items-center justify-between mt-3 text-sm text-(--secondaryFont)">
      <span>Reviewed on: {review.date}</span>
      <span className="flex items-center gap-1">
        {renderStars(review.rating)}
      </span>
    </div>
  </div>
);

const Reviews = () => {
  const dispatch = useDispatch();
  const { confirmPopUpOpened } = useSelector((state) => state.review);

  const [date, setDate] = useState(undefined);
  const [selectedReview, setSelectedReview] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  // --- Data Fetching ---
  const { data: reviewsResponse, isLoading, refetch } = useReviewsQuery();
  const { data: reviewsStatistics } = useReviewsStatisticsQuery();
  const { data: filteredResponse, isLoading: filterIsLoading } =
    useReviewsDateFilterQuery(date ? format(date, "yyyy-MM-dd") : undefined, {
      skip: !date,
    });
  const [changeStatus, { isLoading: changeStatusIsLoading }] =
    useChangeReviewStatusMutation();
  const [deleteReview, { isLoading: deleteIsLoading }] =
    useDeleteReviewMutation();

  // --- Data Transformation ---
  const dataToUse = date ? filteredResponse : reviewsResponse;
  const pageIsLoading = date ? filterIsLoading : isLoading;

  const reviewList = dataToUse?.map((fb) => ({
    id: fb.id,
    name: fb.user?.name,
    rating: fb.score,
    message: fb.message,
    date: fb.created_at ? format(new Date(fb.created_at), "PPP") : "N/A",
    status: fb.status || "under_review",
  }));

  const reviewInfo = {
    total: reviewsStatistics?.total_reviews,
    average: reviewsStatistics?.average_rating,
    ratingsDistribution: reviewsStatistics?.ratings_distribution || {},
  };

  // --- Event Handlers ---
  const handleStatusChange = async (id, newStatus) => {
    try {
      await changeStatus({ reviewID: id, status: newStatus }).unwrap();
      toast.success("Status updated successfully!", {
        style: {
          background: "white",
          color: "#314E76",
          border: "1px solid hsl(var(--border))",
        },
      });
      setSelectedReview(null);
      refetch();
    } catch (error) {
      toast.error(error?.data?.error || "Failed to update status.", {
        style: {
          background: "white",
          color: "#ef4444",
          border: "1px solid hsl(var(--border))",
        },
      });
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    dispatch(openConfirmPopUp(true));
  };

  const handleDelete = async () => {
    try {
      await deleteReview(deleteId).unwrap();
      toast.success("Review has been deleted successfully.", {
        style: {
          background: "white",
          color: "#314E76",
          border: "1px solid hsl(var(--border))",
        },
      });
      dispatch(openConfirmPopUp(false));
      if (selectedReview?.id === deleteId) {
        setSelectedReview(null);
      }
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete review.", {
        style: {
          background: "white",
          color: "#ef4444",
          border: "1px solid hsl(var(--border))",
        },
      });
    }
  };

  return (
    <>
      <Toaster position="top-center" richColors />

      {selectedReview && (
        <Review
          review={selectedReview}
          closeHandler={() => setSelectedReview(null)}
          onStatusChange={handleStatusChange}
          onDelete={handleDeleteClick}
          statusChangeLoading={changeStatusIsLoading}
        />
      )}

      <main className="text-(--primaryFont) p-5 sm:p-10">
        {/* --- MODALS RENDERED AT THE TOP LEVEL --- */}
        {confirmPopUpOpened && (
          <ConfirmPopUp
            title="Confirm Deletion"
            content="Are you sure you want to delete this review? This action cannot be undone."
            loading={deleteIsLoading}
            onConfirm={handleDelete}
            onCancel={() => dispatch(openConfirmPopUp(false))}
          />
        )}

        <header className="flex items-center justify-between font-bold mb-5">
          <span className="text-sm text-center sm:text-2xl">Reviews</span>
        </header>

        <div className="sm:text-end my-10">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className="w-full sm:w-fit min-w-[225px] focus-visible:ring-(--primary) focus:border-0 border-(--border-color) border-2 h-10 placeholder-(--secondaryFont) text-(--secondaryFont)"
              >
                {date ? format(date, "PPP") : <span>Filter by Date</span>}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                className="text-(--primaryFont)"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* --- Statistics Section --- */}
        <section className="flex text-sm sm:text-lg my-10 flex-col md:flex-row items-center gap-10 md:justify-evenly md:gap-5">
          <div className="space-y-5 text-center w-full md:w-fit md:border-r-2 border-gray-200 border-b-2 md:border-b-0 pb-5 md:pr-20">
            <p>Total Reviews</p>
            <span className="font-bold">{reviewInfo.total || 0}</span>
          </div>
          <div className="space-y-5 text-center w-full md:w-fit md:border-r-2 border-gray-200 border-b-2 md:border-b-0 pb-5 md:pr-20">
            <p>Average Rating</p>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="font-bold">
                {reviewInfo.average?.toFixed(1) || 0}
              </span>
              {renderStars(reviewInfo.average || 0, 24)}
            </div>
          </div>
          <div className="w-full md:w-fit">
            <ul className="space-y-1">
              {[5, 4, 3, 2, 1].map((star) => (
                <li key={star}>
                  <div className="flex gap-2 justify-center md:justify-start items-center text-sm font-bold">
                    <Star
                      size={15}
                      className="text-yellow-400 fill-yellow-400"
                    />
                    {star}
                    <div className="w-40 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400"
                        style={{
                          width: `${
                            (reviewInfo.ratingsDistribution[star] /
                              reviewInfo.total) *
                              100 || 0
                          }%`,
                        }}
                      />
                    </div>
                    <span>{reviewInfo.ratingsDistribution[star] || 0}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* --- Reviews List Section --- */}
        <section className="text-sm sm:text-base border-t-2 border-gray-200 pt-6">
          {pageIsLoading ? (
            <ReviewsSkeleton />
          ) : !reviewList || reviewList.length === 0 ? (
            <EmptySection
              title="No  Reviews"
              message="There are no reviews to display for this period."
            />
          ) : (
            reviewList.map((review) => (
              <ReviewListItem
                key={review.id}
                review={review}
                onClick={() => setSelectedReview(review)}
              />
            ))
          )}
        </section>

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
      </main>
    </>
  );
};

export default Reviews;
