import { Banknote, Car, Eye, Star } from "lucide-react";
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
  useOrderHistoryQuery,
  useOrderStatusSearchQuery,
} from "../store/apiSlice/apiSlice";
import { OrdersSkeleton } from "../components/skeleton/OrdersSkeleton";

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
        <img src={row.img} alt={row.name} className="w-12 h-12 rounded-full" />
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

const Orders = () => {
  const [status, setStatus] = useState("");
  const [date, setDate] = useState();
  const { data: orderHistory, isLoading } = useOrderHistoryQuery();
  const {
    data: orderStatusSearchResponse,
    isFetching: OrderStatusSearchIsFetching,
  } = useOrderStatusSearchQuery(status, {
    skip: status === "all",
  });

  const tableBody = orderHistory?.orders.map((order) => {
    return {
      date: format(order.created_at, "yyyy-MM-dd"),
      id: order.order_details[0].id,
      name: order.order_details[0].package.name,
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
  console.log(transformedTableBody);
  return (
    <main className=" text-(--primaryFont) p-10 ">
      <header className="flex justify-between   font-bold mb-5">
        <span className="text-xl sm:text-2xl ">Orders List</span>
      </header>
      {isLoading ? (
        <OrdersSkeleton />
      ) : (
        <>
          <section className="text-sm sm:text-base flex justify-center  md:justify-start flex-wrap 2xl:flex-nowrap gap-10 ">
            <div className="flex items-center gap-5 p-5 border-2 border-(--border-color) rounded-md  w-full md:w-fit  min-w-xs">
              <div className="p-3 bg-(--secondary) rounded-full">
                <Car className="text-(--primary)" size={40} />
              </div>
              <div className="space-y-2">
                <p className="text-(--secondaryFont)">Food delivered</p>
                <span className="text-(--primaryFont) font-bold">23,568</span>
              </div>
            </div>
            <div className="flex items-center gap-5 p-5 border-2 border-(--border-color) rounded-md  w-full md:w-fit min-w-xs">
              <div className="p-3 bg-[#d3f3df] rounded-full">
                <Banknote className="text-[#22c55e]" size={40} />
              </div>{" "}
              <div className="space-y-2">
                <p className="text-(--secondaryFont)">Your balance</p>
                <span className="text-(--primaryFont) font-bold">
                  $8,904.80
                </span>
              </div>
            </div>
            <div className="flex items-center gap-5 p-5 border-2 border-(--border-color) rounded-md w-full md:w-fit  min-w-xs">
              <div className="p-3 bg-[#fbf0ce] rounded-full">
                <Star className="text-[#facc15]" size={40} />
              </div>{" "}
              <div className="space-y-2">
                <p className="text-(--secondaryFont)">Satisfaction Rating</p>
                <span className="text-(--primaryFont) font-bold">98%</span>
              </div>
            </div>
          </section>
          <section className="mt-10 flex-wrap xl:flex-nowrap text-sm sm:text-base flex justify-center 2xl:justify-between gap-10 ">
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
                      <SelectItem value="canceled">Canceled</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="preparing">Preparing</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className=" w-full  self-center sm:w-full 2xl:w-2xl mt-10 text-(--primaryFont)  border-2 border-(--border-color) py-5 px-8 rounded-md">
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
            <div className="p-8 w-full 2xl:basis-1/2 border-2 border-(--border-color) rounded-md max-h-[600px] overflow-hidden  hover:overflow-y-scroll custom-scrollbar">
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

              <div>
                <header className="my-4 font-bold">Waiting</header>
                <div className="p-3 border-2 border-(--border-color) rounded-md space-y-4 overflow-hidden overflow-x-auto  hover:overflow-y-scroll custom-scrollbar max-h-53">
                  <div className="min-w-sm 2xl:min-w-fit hover:opacity-90 transition-all cursor-pointer bg-(--secondary) p-3 rounded-md flex items-center gap-5">
                    <img
                      src="/pizza.png"
                      className="rounded-full w-20 h-15"
                      alt=""
                    />
                    <div className="w-full flex justify-between">
                      <div className="flex  gap-3">
                        <div>
                          <h3>spaghetti</h3>
                          <span className="text-sm">#C0E4F7</span>
                        </div>
                        <Eye className="text-(--secondaryFont)" size={20} />
                      </div>
                      <div className="text-(--secondaryFont) text-sm">
                        6:25 AM
                      </div>
                    </div>
                  </div>
                  <div className="min-w-sm 2xl:min-w-fit hover:opacity-90 transition-all cursor-pointer bg-(--secondary) p-3 rounded-md flex items-center gap-5">
                    <img
                      src="/spaghitti.png"
                      className="rounded-full w-20 h-15"
                      alt=""
                    />
                    <div className="w-full flex justify-between">
                      <div className="flex  gap-3">
                        <div>
                          <h3>spaghetti</h3>
                          <span className="text-sm">#C0E4F7</span>
                        </div>
                        <Eye className="text-(--secondaryFont)" size={20} />
                      </div>
                      <div className="text-(--secondaryFont) text-sm">
                        6:25 AM
                      </div>
                    </div>
                  </div>
                  <div className="min-w-sm 2xl:min-w-fit hover:opacity-90 transition-all cursor-pointer bg-(--secondary) p-3 rounded-md flex items-center gap-5">
                    <img
                      src="/spaghitti.png"
                      className="rounded-full w-20 h-15"
                      alt=""
                    />
                    <div className="w-full flex justify-between">
                      <div className="flex  gap-3">
                        <div>
                          <h3>spaghetti</h3>
                          <span className="text-sm">#C0E4F7</span>
                        </div>
                        <Eye className="text-(--secondaryFont)" size={20} />
                      </div>
                      <div className="text-(--secondaryFont) text-sm">
                        6:25 AM
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <header className="my-4 font-bold">Cooking</header>
                <div className="p-3 border-2 border-(--border-color) rounded-md space-y-4 overflow-hidden overflow-x-auto  hover:overflow-y-scroll custom-scrollbar max-h-53">
                  <div className="min-w-sm 2xl:min-w-fit hover:opacity-90 transition-all cursor-pointer bg-(--secondary) p-3 rounded-md flex items-center gap-5">
                    <img
                      src="/cookies.png"
                      className="rounded-full w-20 h-15"
                      alt=""
                    />
                    <div className="w-full flex justify-between">
                      <div className="flex  gap-3">
                        <div>
                          <h3>Butter Cookies</h3>
                          <span className="text-sm">#C0E4F7</span>
                        </div>
                        <Eye className="text-(--secondaryFont)" size={20} />
                      </div>
                      <div className="text-(--secondaryFont) text-sm">
                        6:25 AM
                      </div>
                    </div>
                  </div>
                  <div className="min-w-sm 2xl:min-w-fit hover:opacity-90 transition-all cursor-pointer bg-(--secondary) p-3 rounded-md flex items-center gap-5">
                    <img
                      src="/spaghitti.png"
                      className="rounded-full w-20 h-15"
                      alt=""
                    />
                    <div className="w-full flex justify-between">
                      <div className="flex  gap-3">
                        <div>
                          <h3>spaghetti</h3>
                          <span className="text-sm">#C0E4F7</span>
                        </div>
                        <Eye className="text-(--secondaryFont)" size={20} />
                      </div>
                      <div className="text-(--secondaryFont) text-sm">
                        6:25 AM
                      </div>
                    </div>
                  </div>
                  <div className="min-w-sm 2xl:min-w-fit hover:opacity-90 transition-all cursor-pointer bg-(--secondary) p-3 rounded-md flex items-center gap-5">
                    <img
                      src="/spaghitti.png"
                      className="rounded-full w-20 h-15"
                      alt=""
                    />
                    <div className="w-full flex justify-between">
                      <div className="flex  gap-3">
                        <div>
                          <h3>spaghetti</h3>
                          <span className="text-sm">#C0E4F7</span>
                        </div>
                        <Eye className="text-(--secondaryFont)" size={20} />
                      </div>
                      <div className="text-(--secondaryFont) text-sm">
                        6:25 AM
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <header className="my-4 font-bold">Delieverd</header>
                <div className="p-3 border-2 border-(--border-color) rounded-md space-y-4 overflow-hidden overflow-x-auto  hover:overflow-y-scroll custom-scrollbar max-h-53">
                  <div className="min-w-sm 2xl:min-w-fit hover:opacity-90 transition-all cursor-pointer bg-(--secondary) p-3 rounded-md flex items-center gap-5">
                    <img
                      src="/burger.png"
                      className="rounded-full w-20 h-15"
                      alt=""
                    />
                    <div className="w-full flex justify-between">
                      <div className="flex  gap-3">
                        <div>
                          <h3>Vega Burger</h3>
                          <span className="text-sm">#C0E4F7</span>
                        </div>
                        <Eye className="text-(--secondaryFont)" size={20} />
                      </div>
                      <div className="text-(--secondaryFont) text-sm">
                        6:25 AM
                      </div>
                    </div>
                  </div>
                  <div className="min-w-sm 2xl:min-w-fit hover:opacity-90 transition-all cursor-pointer bg-(--secondary) p-3 rounded-md flex items-center gap-5">
                    <img
                      src="/spaghitti.png"
                      className="rounded-full w-20 h-15"
                      alt=""
                    />
                    <div className="w-full flex justify-between">
                      <div className="flex  gap-3">
                        <div>
                          <h3>spaghetti</h3>
                          <span className="text-sm">#C0E4F7</span>
                        </div>
                        <Eye className="text-(--secondaryFont)" size={20} />
                      </div>
                      <div className="text-(--secondaryFont) text-sm">
                        6:25 AM
                      </div>
                    </div>
                  </div>
                  <div className="min-w-sm 2xl:min-w-fit hover:opacity-90 transition-all cursor-pointer bg-(--secondary) p-3 rounded-md flex items-center gap-5">
                    <img
                      src="/spaghitti.png"
                      className="rounded-full w-20 h-15"
                      alt=""
                    />
                    <div className="w-full flex justify-between">
                      <div className="flex  gap-3">
                        <div>
                          <h3>spaghetti</h3>
                          <span className="text-sm">#C0E4F7</span>
                        </div>
                        <Eye className="text-(--secondaryFont)" size={20} />
                      </div>
                      <div className="text-(--secondaryFont) text-sm">
                        6:25 AM
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  );
};

export default Orders;
