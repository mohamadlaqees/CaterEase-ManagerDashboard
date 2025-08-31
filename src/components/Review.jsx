// src/components/Review.js

import { X, Trash2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import renderStars from "../util/renderStars"; // Make sure this path is correct

// A small helper component for displaying info items
const InfoItem = ({ label, value }) => (
  <div>
    <p className="text-sm font-medium text-(--secondaryFont)">{label}</p>
    <p className="text-base font-semibold text-(--primaryFont)">
      {value || "N/A"}
    </p>
  </div>
);

const Review = ({
  review, // Changed prop name to lowercase 'review' for consistency
  closeHandler,
  onStatusChange,
  onDelete,
  statusChangeLoading,
}) => {
  if (!review) return null;

  return (
    <>
      <div
        className="fixed inset-0 w-full h-full bg-black opacity-40 z-30"
        onClick={closeHandler}
      />
      <div className="fixed bg-white text-sm sm:text-base text-(--primaryFont) p-6 sm:p-8 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] sm:w-[50%] max-w-2xl h-fit max-h-[90vh] overflow-y-auto rounded-lg shadow-xl z-40">
        <header className="text-lg sm:text-xl flex justify-between items-center font-bold mb-6 pb-4 border-b">
          <span>Review Details</span>
          <X
            className="transition-all hover:brightness-20 cursor-pointer"
            size={26}
            onClick={closeHandler}
          />
        </header>

        <div className="space-y-6">
          {/* --- Main Review Details --- */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <User className="h-8 w-8 text-(--primary)" />
              <div>
                <h2 className="text-2xl font-bold text-(--primary)">
                  {review.name}
                </h2>
                <div className="flex items-center gap-1 mt-1">
                  {renderStars(review.rating)}
                </div>
              </div>
            </div>
            <p className="text-(--primaryFont) leading-relaxed pt-2">
              {review.message}
            </p>
            <div className="flex items-center justify-between text-xs pt-2 text-(--secondaryFont)">
              <span>Reviewed on: {review.date}</span>
              <span className="font-medium bg-gray-200 py-1 px-3 rounded-full capitalize text-(--primaryFont)">
                Status: {review?.status?.replace("_", " ")}
              </span>
            </div>
          </div>

          {/* --- Actions --- */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-6 border-t">
            <div className="w-full sm:w-auto">
              <label className="text-sm font-medium text-(--primaryFont)">
                Change Status
              </label>
              <Select
                value={review.status}
                onValueChange={(newStatus) =>
                  onStatusChange(review.id, newStatus)
                }
                disabled={statusChangeLoading}
              >
                <SelectTrigger className="w-full sm:w-[180px] mt-1 text-(--secondaryFont)">
                  <SelectValue placeholder="Change status" />
                </SelectTrigger>
                <SelectContent className="text-(--secondaryFont)">
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="destructive"
              onClick={() => onDelete(review.id)}
              className="w-full sm:w-auto self-end hover:brightness-105  cursor-pointer"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Review
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Review;
