import {
  BanknoteArrowDown,
  CheckCheck,
  ChevronRight,
  CircleAlert,
  EllipsisVertical,
} from "lucide-react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router";
import renderStars from "../util/renderStars";
import TableComponent from "../components/TableComponent";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { openConfirmPopUp } from "../store/deliverySlice";
import ConfirmPopUp from "../components/ConfirmPopUp";
import {
  useDeleteDeliveryEmployeeMutation,
  useDeliveryDetailsQuery,
  useDeliveryOrdersQuery,
  useFilterDeliveryOrdersQuery,
} from "../store/apiSlice/apiSlice";
import { format } from "date-fns";
import { toast, Toaster } from "sonner";
import { DeliveryEmployeeDetailsSkeleton } from "../components/skeleton/DeliveryEmployeeDetailsSeleton";
import EditDeliveryEmployeeSkeleton from "../components/skeleton/EditDeliveryEmployeeSkeleton";

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

const DeliveryEmployeeDetails = () => {
  const [status, setStatus] = useState(undefined);
  const navigate = useNavigate();
  const { deliveryEmployee } = useParams();
  const { restaurantName } = useSelector((state) => state.restaurant);
  const { data: deliveryResponse, isLoading: deliveryDetailsIsLoading } =
    useDeliveryDetailsQuery(deliveryEmployee);
  const { data: orders, isLoading: ordersIsLoading } =
    useDeliveryOrdersQuery(deliveryEmployee);
  const {
    data: ordersFilteredResponse,
    isFetching,
    isError,
  } = useFilterDeliveryOrdersQuery(status, {
    skip: status === undefined || status === "all",
  });
  const [deleteDelivery, { isLoading }] = useDeleteDeliveryEmployeeMutation();
  const dispatch = useDispatch();
  const { confirmPopUpOpened } = useSelector((state) => state.delivery);
  const [personalMenuOpened, setPersonalMenuOpened] = useState(false);
  const menuRef = useRef();
  const location = useLocation();
  const condition = location.pathname.endsWith("edit-delivery-employee");
  const deliveryEmployeeName = location.pathname.split("/")[2];

  const menuHandler = () => {
    setPersonalMenuOpened(!personalMenuOpened);
  };
  const cancelPopUpHandler = () => {
    dispatch(openConfirmPopUp(false));
  };
  const deleteDeiveryEmployee = async () => {
    try {
      await deleteDelivery(deliveryEmployee);
      dispatch(openConfirmPopUp(false));
      navigate("/delivery");
    } catch (error) {
      toast.error(error.data.message, {
        style: {
          background: "white",
          color: "#ef4444",
          border: "1px solid hsl(var(--border))",
        },
      });
    }
  };

  const userInfo = {
    name: deliveryResponse?.delivery_person.name,
    phone: deliveryResponse?.delivery_person.phone,
    photo: deliveryResponse?.delivery_person.photo,
    gender: deliveryResponse?.delivery_person.gender,
    email: deliveryResponse?.delivery_person.email,
    created_at: deliveryResponse?.delivery_person.created_at
      ? format(deliveryResponse?.delivery_person.created_at, "yyyy-MM-dd")
      : "",
    vehicle_type: deliveryResponse?.delivery_person.vehicle_type,
    is_available: deliveryResponse?.delivery_person.is_available,
    reviews_count: deliveryResponse?.delivery_person.reviews_count,
    delivered_orders_count:
      deliveryResponse?.delivery_person.delivered_orders_count,
    cancelled_orders_count:
      deliveryResponse?.delivery_person.cancelled_orders_count,
    today_earnings: deliveryResponse?.delivery_person.today_earnings,
  };

  let ordersData;
  if (status === "all" || status === undefined) {
    ordersData = orders?.orders;
  } else if (!isFetching && !isError) {
    ordersData = ordersFilteredResponse?.orders;
  } else {
    ordersData = [];
  }

  const tableBody = ordersData?.map((order) => {
    return {
      date: format(order?.delivered_at, "yyyy-MM-dd"),
      id: order.order_id,
      price: order.total_price,
      status: order.order_status,
    };
  });
  console.log(tableBody);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setPersonalMenuOpened(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <Toaster position="top-center" richColors />

      <div className="relative">
        {confirmPopUpOpened && (
          <ConfirmPopUp
            loading={isLoading}
            onConfirm={deleteDeiveryEmployee}
            onCancel={cancelPopUpHandler}
            content={"Are You Sure You Want To Delete Delivery Employee ?"}
          />
        )}
        <main className=" text-(--primaryFont) py-10 px-3 sm:p-10 ">
          <header className="flex items-center justify-between   font-bold mb-5">
            <span className="text-sm text-center sm:text-2xl ">
              {condition
                ? "Edit Delivery Employees"
                : "Delivery Employee Details"}
            </span>
            <div className="flex items-center text-sm text-center sm:text-base  sm:gap-2 font-medium">
              <NavLink
                to={
                  condition ? `/delivery/${deliveryEmployeeName}` : "/delivery"
                }
              >
                {condition ? "Details" : "Delivery"}
              </NavLink>
              <ChevronRight size={20} />
              <NavLink
                to={condition ? "edit-delivery-employee" : "/delivery"}
                className={({ isActive }) =>
                  `transition-all ${
                    isActive ? "text-(--primary)" : "text-(--primaryFont)"
                  }`
                }
              >
                {condition
                  ? "Edit Delivery Employees"
                  : "Delivery Employee Details"}
              </NavLink>
            </div>
          </header>

          {deliveryDetailsIsLoading ? (
            condition ? (
              <EditDeliveryEmployeeSkeleton />
            ) : (
              <DeliveryEmployeeDetailsSkeleton />
            )
          ) : !condition ? (
            <div className="relative flex flex-col 2xl:flex-row gap-10">
              <section className="flex flex-col text-sm sm:text-base border-2 border-(--border-color) rounded-lg shadow-sm bg-white">
                {/* --- User Profile Header --- */}
                <div className="relative flex flex-col sm:flex-row items-center gap-6 p-6 sm:p-8 border-b-2 border-(--border-color)">
                  {/* Profile Image */}
                  <div className="flex-shrink-0 text-center">
                    <img
                      src="/person.png"
                      alt={`${userInfo.name}'s profile picture`}
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white shadow-md"
                    />
                  </div>

                  {/* User Info & Reviews */}
                  <div className="flex flex-col items-center sm:items-start gap-2">
                    <div className=" items-center gap-2">
                      <div className="flex text-yellow-400">
                        {renderStars(5)}
                      </div>
                      <div className="flex gap-1.5">
                        <span className="font-semibold text-(--primaryFont)">
                          5.0
                        </span>
                        <span className="text-(--secondaryFont)">
                          {userInfo.reviews_count} reviews
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-(--secondaryFont)">
                      <span className="font-semibold text-(--primaryFont)">
                        Joined:
                      </span>{" "}
                      {userInfo.created_at}
                    </p>
                    <p className="text-sm text-(--secondaryFont)">
                      Delivery Employee at {restaurantName}
                    </p>
                  </div>

                  {/* --- Options Menu (Ellipsis) --- */}
                  <div className="absolute top-4 right-4" ref={menuRef}>
                    <button
                      onClick={menuHandler}
                      aria-label="Options menu"
                      className="p-2 cursor-pointer rounded-full text-(--secondaryFont) hover:bg-gray-100 hover:text-(--primaryFont) focus:outline-none"
                    >
                      <EllipsisVertical className="h-6 w-6" />
                    </button>
                    <div
                      className={`absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border-2 border-(--border-color) transition-all duration-200 ease-in-out ${
                        personalMenuOpened
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 -translate-y-2 pointer-events-none"
                      }`}
                    >
                      <div className=" text-(--primaryFont)">
                        <Link
                          to="edit-delivery-employee"
                          className="block px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => dispatch(openConfirmPopUp(true))}
                          className="block cursor-pointer w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* --- User Details --- */}
                <div className="p-6 sm:p-8 border-b-2 border-(--border-color)">
                  <h2 className="text-lg font-semibold text-(--primaryFont) mb-4">
                    About Me
                  </h2>
                  <div className="space-y-5 text-(--secondaryFont)">
                    <p>
                      Full Name:{" "}
                      <span className="font-semibold text-(--primaryFont)">
                        {userInfo.name}
                      </span>
                    </p>
                    <p>
                      Vehicle Type:{" "}
                      <span className="font-semibold text-(--primaryFont)">
                        {userInfo.vehicle_type}
                      </span>
                    </p>
                    <p>
                      Mobile:{" "}
                      <span className="font-semibold text-(--primaryFont)">
                        {userInfo.phone}
                      </span>
                    </p>
                    <p>
                      Email:{" "}
                      <span className="font-semibold text-(--primaryFont)">
                        {userInfo.email}
                      </span>
                    </p>
                  </div>
                </div>

                {/* --- Delivery Statistics --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 sm:p-8">
                  <div className="flex items-center gap-4 p-4 border border-(--border-color) rounded-lg">
                    <CheckCheck className="h-10 w-10 text-green-500" />
                    <div>
                      <p className="text-xl font-bold text-(--primaryFont)">
                        {userInfo.delivered_orders_count}{" "}
                      </p>
                      <p className="text-sm text-(--secondaryFont)">
                        Completed Deliveries
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 border border-(--border-color) rounded-lg">
                    <CircleAlert className="h-10 w-10 text-red-500" />
                    <div>
                      <p className="text-xl font-bold text-(--primaryFont)">
                        {userInfo.cancelled_orders_count}{" "}
                      </p>
                      <p className="text-sm text-(--secondaryFont)">
                        Canceled Deliveries
                      </p>
                    </div>
                  </div>
                </div>

                {/* --- Earnings --- */}
                <div className="p-6 sm:p-8">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                    <div className="flex items-center gap-4 border-b border-green-200 pb-3">
                      <BanknoteArrowDown className="h-10 w-10 text-green-600" />
                      <div>
                        <p className="text-sm text-green-800">
                          Today's Earnings
                        </p>
                        <p className="text-2xl font-bold text-green-900">
                          {userInfo.today_earnings}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-sm text-(--secondaryFont)">
                        Total Trips Today
                      </p>
                      <p className="text-lg font-bold text-(--primaryFont)">
                        15
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="p-4 shadow-sm sm:p-8 basis-1/2 border-2 border-(--border-color) rounded-md ">
                <div className="flex justify-between">
                  <h1 className="mb-4 text-lg sm:text-xl font-bold ">Orders</h1>
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
                        <SelectItem value="canceled">Canceled</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className=" 2xl:max-w-2xl  self-center sm:w-full 2xl:w-3xl mt-10 text-(--primaryFont)  border-2 border-(--border-color) py-5 px-8 rounded-md">
                  <div className="overflow-hidden max-h-[700px] hover:overflow-y-scroll custom-scrollbar    transition-all  ">
                    <TableComponent
                      tableBody={tableBody}
                      tableHeader={tableHeader}
                      tableClass={"min-w-[600px]"}
                      isLoading={
                        status !== "all" || status !== ""
                          ? isFetching
                          : ordersIsLoading
                      }
                    />
                  </div>
                </div>
              </section>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </>
  );
};

export default DeliveryEmployeeDetails;
