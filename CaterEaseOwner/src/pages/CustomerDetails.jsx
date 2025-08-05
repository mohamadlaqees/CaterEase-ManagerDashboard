import { ChevronRight, FolderOpen, Plus } from "lucide-react";
import { NavLink, useParams } from "react-router";
import TableComponent from "../components/TableComponent";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import AddCoupon from "./AddCoupon";
import { useDispatch, useSelector } from "react-redux";
import { openCoupon, openCouponsList } from "../store/customersSlice";
import {
  useCustomerDetailsQuery,
  useCustomerOrdersQuery,
} from "../store/apiSlice/apiSlice";
import { format } from "date-fns";
import { Toaster } from "sonner";
import Coupons from "../components/Coupons";
import CustomerDetailsSkeleton from "../components/skeleton/CustomerDetailsSkeleton";

const tableHeader = [
  {
    name: "Date",
    key: "date",
  },
  {
    name: "Order ID",
    key: "id",
  },
  {
    name: "Amount",
    key: "price",
  },
  {
    name: "Status",
    key: "status",
    render: (row) => (
      <div
        className={`flex items-center justify-center py-2 px-3 rounded-md ${
          row.status === "delivered"
            ? "text-[#22c55e] bg-[#e8f9ef]"
            : row.status === "Canceled"
            ? "text-[#ef4444] bg-[#fdecec]"
            : row.status === "confirmed" || row.status === "pending"
            ? "text-[#eab308] bg-[#fdf7e6]"
            : row.status === "preparing"
            ? "text-[#3b82f6] bg-[#eef4ff]"
            : ""
        }`}
      >
        {row.status}
      </div>
    ),
  },
];

const CustomerDetails = () => {
  const { name } = useParams();
  const [status, setStatus] = useState(undefined);
  const {
    data: customerDetailsResponse,
    isLoading,
    refetch,
  } = useCustomerDetailsQuery(name, {
    skip: status !== undefined,
  });
  const {
    data: customerOrdersResponse,
    isError,
    isFetching,
  } = useCustomerOrdersQuery(
    { customerID: name, orderStatus: status },
    {
      skip: status === undefined || status === "all",
    }
  );
  const dispatch = useDispatch();
  const { couponOpened, couponsListOpened } = useSelector(
    (state) => state.customers
  );
  const { restaurantName } = useSelector((state) => state.restaurant);

  const customerInfo = {
    name: customerDetailsResponse?.user.name,
    email: customerDetailsResponse?.user.email,
    phone: customerDetailsResponse?.user.phone,
    joined: customerDetailsResponse?.user?.created_at
      ? format(new Date(customerDetailsResponse.user.created_at), "yyyy-MM-dd")
      : "N/A",
    status: customerDetailsResponse?.user.status,
  };

  let ordersData;
  if (status === "all" || status === undefined) {
    ordersData = customerDetailsResponse?.orders;
  } else if (!isFetching && !isError) {
    ordersData = customerOrdersResponse;
  } else {
    ordersData = [];
  }

  const orders = !isError
    ? ordersData?.map((order) => {
        return {
          id: order.order_id,
          date: format(order.created_at, "yyyy-MM-dd"),
          price: order.total_price,
          status: order?.status || status,
        };
      })
    : [];
  if (isLoading) {
    return <CustomerDetailsSkeleton />;
  }
  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="relative">
        {couponsListOpened && (
          <Coupons couponsList={customerDetailsResponse?.coupons} />
        )}
        <AddCoupon customerID={name} />
        <main className=" text-(--primaryFont) py-10 px-3 sm:p-10 ">
          <header className="flex justify-between items-center  font-bold mb-5">
            <span className="text-sm sm:text-2xl ">Customer Details</span>
            <div className="flex items-center text-sm sm:text-base  sm:gap-2 font-medium">
              <NavLink to={"/customers"}>Customers</NavLink>
              <ChevronRight size={20} />
              <NavLink
                to={""}
                className={({ isActive }) =>
                  `transition-all ${
                    isActive ? "text-(--primary)" : "text-(--primaryFont)"
                  }`
                }
              >
                Customer Details
              </NavLink>
            </div>
          </header>
          <div className="flex flex-col  2xl:flex-row gap-10">
            <section className="flex flex-col  h-[700px]  sm:h-[610px] text-sm sm:text-base border-2 border-(--border-color) rounded-lg shadow-sm bg-white">
              {/* --- Customer Profile Header --- */}
              <div className="relative flex flex-col sm:flex-row items-center gap-6 p-6 sm:p-8 border-b-2 border-(--border-color) ">
                {/* Profile Image (Original Dimensions) */}
                <div className="flex-shrink-0 text-center">
                  <img
                    src="/person.png"
                    alt={`${customerInfo.name}'s profile picture`}
                    className="w-30 h-30 rounded-full border-2 border-(--border-color) "
                  />
                </div>

                {/* Customer Info */}
                <div className="flex  flex-col items-center sm:items-start gap-2">
                  <h1 className="text-xl font-bold text-(--primaryFont) ">
                    {customerInfo.name}
                  </h1>
                  <p className="text-sm text-(--secondaryFont)">
                    <span className="text-(--primaryFont) ">Joined:</span>{" "}
                    {customerInfo.joined}
                  </p>
                  <p className="text-sm text-(--secondaryFont)">
                    Customer at {restaurantName}
                  </p>
                </div>
              </div>

              {/* --- Customer Details --- */}
              <div className="p-6 sm:p-8  border-b-2 border-(--border-color)">
                <h2 className="text-lg font-semibold text-(--primaryFont) mb-10">
                  About Customer
                </h2>
                <div className="space-y-8 text-(--secondaryFont) ">
                  <p>
                    Full Name:{" "}
                    <span className="font-semibold text-(--primaryFont)  ">
                      {customerInfo.name}
                    </span>
                  </p>
                  <p>
                    Mobile:{" "}
                    <span className="font-semibold text-(--primaryFont)  ">
                      {customerInfo.phone}
                    </span>
                  </p>
                  <p>
                    Email:{" "}
                    <span className="font-semibold text-(--primaryFont)  ">
                      {customerInfo.email}
                    </span>
                  </p>
                  <div className="flex items-center gap-2">
                    <p>Status:</p>
                    <span
                      className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                        customerInfo.status === "active"
                          ? "bg-green-100 text-green-800 "
                          : "bg-red-100 text-red-800 "
                      }`}
                    >
                      {customerInfo.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mx-10 my-5 px-5 flex items-center justify-between gap-2 border border-(--border-color)  rounded-lg p-2">
                <label className=" font-semibold text-sm text-(--secondaryFont)  pr-2">
                  Coupon
                </label>
                <div>
                  <button
                    onClick={() => dispatch(openCoupon(!couponOpened))}
                    aria-label="Add new coupon"
                    className="p-2 cursor-pointer rounded-md text-(--secondaryFont) hover:bg-gray-100  focus:outline-none  transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                  <button
                    onClick={() => {
                      refetch();
                      dispatch(openCouponsList(!couponsListOpened));
                    }}
                    aria-label="View existing coupons"
                    className="p-2 cursor-pointer rounded-md text-(--secondaryFont) hover:bg-gray-100  focus:outline-none  transition-colors"
                  >
                    <FolderOpen size={20} />
                  </button>
                </div>
              </div>
            </section>

            <section className="p-4 sm:p-8 shadow-sm basis-1/2 border-2 border-(--border-color) rounded-md ">
              <div className="flex justify-between">
                <h1 className="mb-4 text-lg sm:text-xl font-bold ">
                  Customer Order history
                </h1>
                <Select autoFocus value={status} onValueChange={setStatus}>
                  <SelectTrigger className=" focus-visible:ring-(--primary) focus:border-0 border-(--border-color) border-2 h-10 placeholder-(--secondaryFont) text-(--secondaryFont)">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="preparing">Preparing</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="  2xl:max-w-2xl  self-center sm:w-full 2xl:w-3xl mt-10 text-(--primaryFont)  border-2 border-(--border-color) py-5 px-8 rounded-md">
                <div className="overflow-hidden max-h-[400px]  hover:overflow-y-scroll custom-scrollbar    transition-all  ">
                  <TableComponent
                    tableBody={orders}
                    tableHeader={tableHeader}
                    tableClass={"min-w-[600px]"}
                  />
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  );
};

export default CustomerDetails;
