import { Banknote, Car, Eye, Star, XCircle } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import TableComponent from "../components/TableComponent";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  useOnGoingOrdersQuery,
  useOrderDateSearchQuery,
  useOrderHistoryQuery,
  useOrderStatisticsQuery,
  useOrderStatusSearchQuery,
} from "../store/apiSlice/apiSlice";
import { OrdersSkeleton } from "../components/skeleton/OrdersSkeleton";
import { useNavigate } from "react-router";
import OnGoingOrderSkeleton from "../components/skeleton/OnGoingOrderSkeleton";

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
    name: "Pacakges",
    key: "name",
    render: (row) => (
      <div className="flex items-center gap-3">
        <img
          src={"/order.png"}
          alt={row.name}
          className="w-12 h-12 rounded-full"
        />
        <div>
          <div>{row.name}</div>
        </div>
      </div>
    ),
  },

  {
    name: "Status",
    key: "status",
    render: (row) => (
      <div
        className={`flex items-center justify-center py-2 px-3 rounded-md ${
          row.status === "delivered"
            ? "text-[#22c55e] bg-[#e8f9ef]"
            : row.status === "cancelled"
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

const Orders = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("");
  const [date, setDate] = useState();
  const { data: orderHistory, isLoading } = useOrderHistoryQuery();
  const {
    data: orderStatusSearchResponse,
    isFetching: OrderStatusSearchIsFetching,
  } = useOrderStatusSearchQuery(status, {
    skip: status === "all" || status === "",
  });
  const { data: orderStatisticsResponse, isLoading: OrderStatisticsIsLoading } =
    useOrderStatisticsQuery();
  const { data: onGoingOrdersResponse } = useOnGoingOrdersQuery();
  const {
    data: orderDateSearchResponse,
    isFetching: orderDateSearchIsLoading,
  } = useOrderDateSearchQuery(date ? format(date, "yyyy-MM-dd") : "");

  const tableBody = orderHistory?.orders.map((order) => {
    return {
      date: format(order.created_at, "yyyy-MM-dd"),
      id: order.id,
      name: `order ${order.id}`,
      price: order.total_price,
      img: order.order_details[0].photo,
      status: order.status,
    };
  });

  let transformedTableBody =
    status === orderStatusSearchResponse?.status
      ? [
          {
            date: orderStatusSearchResponse
              ? format(orderStatusSearchResponse?.created_at, "yyyy-MM-dd")
              : "",
            id: orderStatusSearchResponse?.order_details[0].id,
            name: orderStatusSearchResponse?.order_details[0].package.name,
            price: orderStatusSearchResponse?.total_price,
            img: orderStatusSearchResponse?.order_details[0].photo,
            status: orderStatusSearchResponse?.status,
          },
        ]
      : [];

  const pending = onGoingOrdersResponse?.pending || [];
  const preparing = onGoingOrdersResponse?.preparing || [];
  const delivered = onGoingOrdersResponse?.delivered || [];

  const transformedPending = orderDateSearchResponse?.data.pending || [];
  const transformedPreparing = orderDateSearchResponse?.data.preparing || [];
  const transformedDelivered = orderDateSearchResponse?.data.delivered || [];

  const pendingOrderMap = date ? transformedPending : pending;
  const preparingOrderMap = date ? transformedPreparing : preparing;
  const deliveredOrderMap = date ? transformedDelivered : delivered;

  const preparingOrdersInfo = preparingOrderMap?.map((order) => {
    return {
      id: order.id,
      date: format(order?.created_at, "yyyy-MM-dd hh:mm a"),
    };
  });
  const pendingOrdersInfo = pendingOrderMap?.map((order) => {
    return {
      id: order.id,
      date: format(order?.created_at, "yyyy-MM-dd hh:mm a"),
    };
  });
  const deliveredOrdersInfo = deliveredOrderMap?.map((order) => {
    return {
      id: order.id,
      date: format(order?.created_at, "yyyy-MM-dd hh:mm a"),
    };
  });

  return (
    <main className=" text-(--primaryFont) p-5 sm:p-10">
      <header className="flex justify-between   font-bold mb-5">
        <span className="text-xl sm:text-2xl ">Orders List</span>
      </header>
      {isLoading ? (
        <OrdersSkeleton />
      ) : (
        <div className="flex gap-5 flex-col 2xl:flex-row">
          {/* className="text-sm sm:text-base flex justify-center  md:justify-start flex-wrap 2xl:flex-nowrap gap-10 " */}
          <section className="basis-1/2 space-y-5">
            <div className="flex flex-col md:flex-row gap-10 justify-between">
              <div className="basis-1/2 flex items-center gap-5 p-5 border-2 border-(--border-color) rounded-md  w-full md:w-fit  min-w-xs">
                <div className="p-3 bg-(--secondary) rounded-full">
                  <Car className="text-(--primary)" size={40} />
                </div>
                <div className=" space-y-2">
                  <p className="text-(--secondaryFont)">Food delivered</p>
                  <span className="text-(--primaryFont) font-bold">
                    {orderStatisticsResponse?.total_orders_delivered}
                  </span>
                </div>
              </div>
              <div className="basis-1/2 flex items-center gap-5 p-5 border-2 border-(--border-color) rounded-md  w-full md:w-fit min-w-xs">
                <div className="p-3 bg-[#d3f3df] rounded-full">
                  <Banknote className="text-[#22c55e]" size={40} />
                </div>{" "}
                <div className="space-y-2">
                  <p className="text-(--secondaryFont)">Your balance</p>
                  <span className="text-(--primaryFont) font-bold">
                    ${orderStatisticsResponse?.total_balance}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-8 w-full 2xl:basis-3/4 border-2 border-(--border-color) rounded-md">
              <div className="flex justify-between">
                <h1 className="mb-4 text-lg sm:text-xl font-bold ">
                  Orders history
                </h1>
                <Select autoFocus value={status} onValueChange={setStatus}>
                  <SelectTrigger className=" focus-visible:ring-(--primary) focus:border-0 border-(--border-color) border-2 h-10 placeholder-(--secondaryFont) text-(--secondaryFont)">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="preparing">Preparing</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className=" w-full  mt-10 text-(--primaryFont)  border-2 border-(--border-color) py-5 px-8 rounded-md">
                <div className="overflow-hidden max-h-[400px]  hover:overflow-y-scroll custom-scrollbar    transition-all  ">
                  <TableComponent
                    tableBody={
                      status === "all" || status === ""
                        ? tableBody
                        : transformedTableBody
                    }
                    tableHeader={tableHeader}
                    tableClass={"min-w-[500px] "}
                    isLoading={
                      status === "all" || status === ""
                        ? isLoading
                        : OrderStatusSearchIsFetching
                    }
                  />
                </div>
              </div>
            </div>
          </section>
          {/* mt-10 flex-wrap xl:flex-nowrap text-sm sm:text-base flex justify-center 2xl:justify-between gap-10  */}
          <section className="basis-1/2 ">
            <div
              className={`p-8 w-full 2xl:basis-1/2 border-2 border-(--border-color) rounded-md max-h-[720px] overflow-hidden ${
                pending.length > 0 &&
                preparing.length > 0 &&
                delivered.length > 0
                  ? "hover:overflow-y-scroll"
                  : ""
              }  custom-scrollbar`}
            >
              <div className="flex items-start justify-between flex-wrap 2xl:flex-nowrap">
                <h1 className="mb-4 text-lg sm:text-xl font-bold ">
                  Ongoing Orders
                </h1>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="basis-1/2  focus-visible:ring-(--primary) focus:border-0 border-(--border-color) border-2 h-10 placeholder-(--secondaryFont) text-(--secondaryFont)"
                    >
                      {date ? format(date, "PPP") : <span>Orders Date</span>}
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

              {orderDateSearchIsLoading ? (
                <OnGoingOrderSkeleton />
              ) : (
                <>
                  <div>
                    <header className="my-4 font-bold">Pending</header>
                    <div
                      className={`p-3 border-2 border-(--border-color) rounded-md space-y-4 overflow-hidden overflow-x-auto  ${
                        pending.length > 0 ? "hover:overflow-y-scroll" : ""
                      } custom-scrollbar max-h-53`}
                    >
                      {pendingOrdersInfo.length == 0 ? (
                        <div className="flex flex-col items-center justify-center text-center text-gray-400 py-4">
                          <XCircle className="w-8 h-8 mb-2" />
                          <p className="font-medium">No packages</p>
                        </div>
                      ) : (
                        pendingOrdersInfo?.map((order) => (
                          <div className="min-w-sm 2xl:min-w-fit hover:opacity-90 transition-all  bg-(--secondary) p-3 rounded-md flex items-center gap-5">
                            <img
                              src="/order.png"
                              className="rounded-full w-20 h-15"
                              alt=""
                            />
                            <div className="w-full flex justify-between">
                              <div>
                                <div className="flex items-center gap-3">
                                  <h3>Preparing order</h3>
                                  <Eye
                                    className="text-(--secondaryFont) mx-2 sm:mx-0 hover:brightness-50 cursor-pointer"
                                    size={20}
                                    onClick={() => navigate(`${order.id}`)}
                                  />
                                </div>
                                <span className="text-sm">{order.id}</span>
                              </div>
                              <div className="text-(--secondaryFont) text-sm">
                                {order.date}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div>
                    <header className="my-4 font-bold">Preparing</header>
                    <div
                      className={`p-3 border-2 border-(--border-color) rounded-md space-y-4 overflow-hidden overflow-x-auto  ${
                        preparing.length > 0 ? "hover:overflow-y-scroll" : ""
                      } custom-scrollbar max-h-53`}
                    >
                      {preparingOrdersInfo.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center text-gray-400 py-4">
                          <XCircle className="w-8 h-8 mb-2" />
                          <p className="font-medium">No packages</p>
                        </div>
                      ) : (
                        preparingOrdersInfo?.map((order) => (
                          <div className="min-w-sm 2xl:min-w-fit hover:opacity-90 transition-all  bg-(--secondary) p-3 rounded-md flex items-center gap-5">
                            <img
                              src="/order.png"
                              className="rounded-full w-20 h-15"
                              alt=""
                            />
                            <div className="w-full flex justify-between">
                              <div>
                                <div className="flex items-center gap-3">
                                  <h3>Preparing order</h3>
                                  <Eye
                                    className="text-(--secondaryFont) mx-2 sm:mx-0 hover:brightness-50 cursor-pointer"
                                    size={20}
                                    onClick={() => navigate(`${order.id}`)}
                                  />
                                </div>
                                <span className="text-sm">{order.id}</span>
                              </div>
                              <div className="text-(--secondaryFont) text-sm">
                                {order.date}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div>
                    <header className="my-4 font-bold">Delieverd</header>
                    <div
                      className={`p-3 border-2 border-(--border-color) rounded-md space-y-4 overflow-hidden overflow-x-auto  ${
                        delivered.length > 0 ? "hover:overflow-y-scroll" : ""
                      } custom-scrollbar max-h-53`}
                    >
                      {deliveredOrdersInfo.length == 0 ? (
                        <div className="flex flex-col items-center justify-center text-center text-gray-400 py-4">
                          <XCircle className="w-8 h-8 mb-2" />
                          <p className="font-medium">No packages</p>
                        </div>
                      ) : (
                        deliveredOrdersInfo?.map((order) => (
                          <div className="min-w-sm 2xl:min-w-fit hover:opacity-90 transition-all  bg-(--secondary) p-3 rounded-md flex items-center gap-5">
                            <img
                              src="/order.png"
                              className="rounded-full w-20 h-15"
                              alt=""
                            />
                            <div className="w-full flex justify-between">
                              <div>
                                <div className="flex items-center gap-3">
                                  <h3>Preparing order</h3>
                                  <Eye
                                    className="text-(--secondaryFont) mx-2 sm:mx-0 hover:brightness-50 cursor-pointer"
                                    size={20}
                                    onClick={() => navigate(`${order.id}`)}
                                  />
                                </div>
                                <span className="text-sm">{order.id}</span>
                              </div>
                              <div className="text-(--secondaryFont) text-sm">
                                {order.date}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </section>
        </div>
      )}
    </main>
  );
};

export default Orders;
