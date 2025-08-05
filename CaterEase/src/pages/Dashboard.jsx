import {
  CircleAlert,
  CircleArrowUp,
  CircleCheck,
  CircleHelp,
} from "lucide-react";
import { CheckCheck } from "lucide-react";
import TableComponent from "../components/TableComponent";
import renderStars from "../util/renderStars";

import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  Pie,
  PieChart,
  Sector,
  Bar,
  BarChart,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useDeliveredOrdersStatusQuery,
  useEarningsQuery,
  useLatestOrdersQuery,
  useMonthlyOrdersQuery,
  useOrdersActivityQuery,
  useOrdersStatusQuery,
  usePopularFoodQuery,
} from "../store/apiSlice/apiSlice";
import { setEarnings } from "../store/dashboardSlice";
import { DashboardSkeleton } from "../components/skeleton/DashboardSkeleton";

let chartData = [
  { month: "January", value: 0, monthNumber: 1 },
  { month: "February", value: 0, monthNumber: 2 },
  { month: "March", value: 0, monthNumber: 3 },
  { month: "April", value: 0, monthNumber: 4 },
  { month: "May", value: 0, monthNumber: 5 },
  { month: "June", value: 0, monthNumber: 6 },
  { month: "July", value: 0, monthNumber: 7 },
  { month: "August", value: 0, monthNumber: 8 },
  { month: "September", value: 0, monthNumber: 9 },
  { month: "October", value: 0, monthNumber: 10 },
  { month: "November", value: 0, monthNumber: 11 },
  { month: "December", value: 0, monthNumber: 12 },
];

const chartConfig = {
  value: {
    label: "value",
    color: "var(--primary)",
  },
};

const tableHeader = [
  {
    name: "Order ID",
    key: "id",
  },
  {
    name: "Dish",
    key: "name",
    render: (row) => (
      <div className="flex items-center gap-3">
        <img src={row.img} alt={row.name} className="w-12 h-12 rounded-full" />
        <div>
          <div>{row.name}</div>
          <div>{renderStars(row.rate)}</div>
        </div>
      </div>
    ),
  },
  {
    name: "Total",
    key: "price",
  },
];

const tableBody = [
  {
    id: "#C0E4F7",
    name: "Italian Pizza",
    price: "$359.69",
    img: "./pizza.png",
    rate: 5,
  },
  {
    id: "#12939F",
    name: "Veg Burger",
    price: "$350.3",
    img: "./burger.png",
    rate: 5,
  },
  {
    id: "#C0E4f7",
    name: "Italian Pizza",
    price: "$359.69",
    img: "./pizza.png",
    rate: 5,
  },
  {
    id: "#C0E4f7",
    name: "Italian Pizza",
    price: "$359.69",
    img: "./pizza.png",
    rate: 5,
  },
  {
    id: "#C0E4f7",
    name: "Italian Pizza",
    price: "$359.69",
    img: "./pizza.png",
    rate: 5,
  },
  {
    id: "#C0E4f7",
    name: "Italian Pizza",
    price: "$359.69",
    img: "./pizza.png",
    rate: 5,
  },
];

const chartConfig2 = {
  deliveredOrders: {
    label: "deliveredOrders",
    color: "var(--primary)",
  },
  cancelledOrders: {
    label: "cancelledOrders",
    color: "#5cc48a",
  },
};

const Dashboard = () => {
  const { earnings } = useSelector((state) => state.dash);
  const dispatch = useDispatch();

  const { data: earningsResponse, isLoading: earningsIsLoading } =
    useEarningsQuery(localStorage.getItem("branchID"));
  const { data: ordersStatusResponse, isLoading: ordersStatusIsLoading } =
    useOrdersStatusQuery(localStorage.getItem("branchID"));
  const { data: popularFoodResponse, isLoading: popularIsLoading } =
    usePopularFoodQuery(localStorage.getItem("branchID"));
  const { data: monthlyOrdersResponse } = useMonthlyOrdersQuery(
    localStorage.getItem("branchID")
  );
  const { data: deliveredOrdersResponse } = useDeliveredOrdersStatusQuery(
    localStorage.getItem("branchID")
  );
  const { data: ordersActivityResponse } = useOrdersActivityQuery(
    localStorage.getItem("branchID")
  );
  const { data: latestOrdersResponse } = useLatestOrdersQuery();

  console.log(latestOrdersResponse);

  const popularFoodData = popularFoodResponse?.map((data) => ({
    browser: data?.name,
    visitors: data?.user_count,
    fill: `var(--color-${
      data?.name === "Soft Drinks" ? data.name.split(" ").join("-") : data.name
    })`,
  }));
  const colorPalette = ["#A1CA46", "#46A1CA", "#F5D547", "#5CC48A"];

  const popularFoodConfig = popularFoodData?.reduce(
    (acc, item, index) => {
      const categoryName = item.browser;

      acc[
        categoryName === "Soft Drinks"
          ? categoryName.split(" ").join("-")
          : categoryName
      ] = {
        label: categoryName,
        color: colorPalette[index % colorPalette.length],
      };

      return acc;
    },
    {
      visitors: {
        label: "Visitors",
      },
    }
  );

  const monthChartData = () => {
    const apiDataMap = new Map();

    if (monthlyOrdersResponse?.delivered_orders_per_month) {
      monthlyOrdersResponse?.delivered_orders_per_month.forEach((item) => {
        apiDataMap.set(item.month, item.count);
      });
    }

    return chartData.map((item) => {
      if (apiDataMap.has(item.monthNumber)) {
        return { ...item, value: apiDataMap.get(item.monthNumber) };
      }
      return item;
    });
  };

  const ordersActivityChartData = ordersActivityResponse?.map((item) => {
    return {
      date: `${item.year}-${item.month}-01`,
      deliveredOrders: item.delivered_count,
      cancelledOrders: item.cancelled_count,
    };
  });

  useEffect(() => {
    dispatch(setEarnings(earningsResponse));
  }, [earningsResponse]);

  if (earningsIsLoading || ordersStatusIsLoading || popularIsLoading) {
    return <DashboardSkeleton />;
  }
  return (
    <main className="text-sm sm:text-base w-full p-10 xl:flex gap-15 ">
      <section className="flex flex-col sm:block ">
        <div className="w-[335px] self-center text-center  sm:w-full  sm:flex sm:justify-between sm:items-center  2xl:w-3xl px-8 py-5 bg-(--secondary) rounded-md">
          <span className=" space-y-3 mr-10 2xl:m-0">
            <p className="text-(--secondaryFont) text-center ">Total Income</p>
            <span className="block text-(--primary) font-bold text-xl">
              {earnings?.total_income} $
            </span>
          </span>
          <span className="hidden sm:block w-0.5 h-20 bg-(--secondaryFont) mr-10 2xl:m-0" />
          <div className=" flex justify-center gap-20 sm:gap-30 2xl:gap-50">
            <span className="space-y-3 ">
              <p className="text-[#1fbf75] text-center ">Income</p>
              <span className="text-(--primaryFont) font-bold text-xl">
                {earnings?.income} $
              </span>
              <div className="text-[#1fbf75] flex gap-2.5 justify-center mt-2">
                <CircleArrowUp className="" />
                +15%
              </div>
            </span>
          </div>
        </div>
        <div className="w-[335px] self-center sm:w-full 2xl:w-3xl mt-10 text-(--primaryFont) font-bold border-2 border-(--border-color) py-5 px-8 rounded-md">
          <h1 className="mb-4">Recent orders</h1>
          <div className="overflow-hidden  hover:overflow-y-scroll custom-scrollbar  max-h-56 transition-all  ">
            <TableComponent
              tableBody={tableBody}
              tableHeader={tableHeader}
              tableClass={"min-w-[500px]"}
            />
          </div>
        </div>
        <div className="w-[335px] self-center sm:w-full  2xl:w-3xl mt-10 text-(--primaryFont) font-bold border-2 border-(--border-color) py-5 px-5 rounded-md">
          <h1 className="mb-4">Orders Rate</h1>
          <div className=" transition-all  ">
            <Card>
              <CardHeader className="flex justify-between">
                <div className="space-y-1">
                  <CardTitle>Area Chart</CardTitle>
                  <CardDescription>
                    Showing total monthly orders
                  </CardDescription>
                </div>
                <div className="space-y-1">
                  <CardTitle>Total Orders</CardTitle>
                  <CardDescription>
                    {monthlyOrdersResponse?.total_orders}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig}>
                  <AreaChart
                    accessibilityLayer
                    data={monthChartData()}
                    margin={{
                      left: 12,
                      right: 12,
                    }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="line" />}
                    />
                    <Area
                      dataKey="value"
                      type="natural"
                      fill="var(--color-value)"
                      fillOpacity={0.4}
                      stroke="var(--color-value)"
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="w-[335px] self-center sm:w-full 2xl:w-3xl mt-10 border-2 text-(--primaryFont) font-bold border-(--border-color) py-5 px-5 rounded-md">
          <h1 className="mb-4">Activity</h1>
          <Card>
            <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
              <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                <CardTitle>Bar Chart - Interactive</CardTitle>
                <CardDescription>Showing Orders Activity</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="px-2 sm:p-6">
              <ChartContainer
                config={chartConfig2}
                className="aspect-auto h-[250px] w-full"
              >
                <BarChart
                  accessibilityLayer
                  data={ordersActivityChartData}
                  margin={{
                    left: 12,
                    right: 12,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={32}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        className="w-[150px]"
                        nameKey="views"
                        labelFormatter={(value) => {
                          return new Date(value).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          });
                        }}
                      />
                    }
                  />
                  {/* Add a legend to identify the bars */}
                  <ChartLegend content={<ChartLegendContent />} />

                  {/* --- This is the key change --- */}
                  {/* Add a separate Bar component for each data key */}
                  <Bar
                    dataKey="deliveredOrders"
                    fill="var(--color-deliveredOrders)"
                    radius={4} // Optional: adds rounded corners to the bars
                  />
                  <Bar
                    dataKey="cancelledOrders"
                    fill="var(--color-cancelledOrders)"
                    radius={4} // Optional: adds rounded corners to the bars
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>{" "}
      </section>
      <section className="flex flex-col sm:block ">
        <div className="flex items-stretch  flex-col sm:flex-row sm:gap-3 xl:gap-0  xl:block ">
          <div className=" w-[335px]  self-center sm:self-auto sm:w-full mt-10 xl:mt-0 text-(--primaryFont) font-bold border-2 border-(--border-color) py-5 pr-13 pl-6 rounded-md space-y-10">
            <div className="text-center space-y-3 xl:space-y-0 xl:flex xl:gap-10 ">
              <span className="w-fit mx-auto xl:m-0 p-2 border-2 border-(--border-color)  rounded-md text-(--primary)  flex items-center ">
                <CheckCheck />
              </span>
              <div>
                <h1 className="text-(--secondaryFont)">Total Order Complete</h1>
                {ordersStatusResponse?.order_confirmed}
              </div>
            </div>
            <div className="text-center space-y-3 xl:space-y-0 xl:flex xl:gap-10 ">
              <span className="w-fit mx-auto xl:m-0 p-2 border-2 border-(--border-color)  rounded-md text-(--primary)  flex items-center">
                <CircleCheck />
              </span>
              <div>
                <h1 className="text-(--secondaryFont)">
                  Total Order Delivered
                </h1>
                {ordersStatusResponse?.order_delivered}
              </div>
            </div>
            <div className="text-center space-y-3 xl:space-y-0 xl:flex xl:gap-10 ">
              <span className="w-fit mx-auto xl:m-0 p-2 border-2 border-(--border-color)  rounded-md text-(--primary)  flex items-center">
                <CircleAlert />
              </span>
              <div>
                <h1 className="text-(--secondaryFont)">Total Order Canceled</h1>
                {ordersStatusResponse?.order_cancelled}
              </div>
            </div>
            <div className="text-center  space-y-3 xl:space-y-0 xl:flex xl:gap-10 ">
              <span className="w-fit mx-auto xl:m-0 p-2 border-2 border-(--border-color)  rounded-md text-(--primary)  flex items-center">
                <CircleHelp />
              </span>
              <div className="xl:ml-7">
                <h1 className="text-(--secondaryFont)">Order Pending</h1>
                {ordersStatusResponse?.order_pending}
              </div>
            </div>
          </div>
          <div className=" w-[335px] self-center sm:self-auto sm:w-full mt-10 border-2 text-(--primaryFont) font-bold border-(--border-color) py-5 px-5 rounded-md">
            <h1 className="mb-4">Popular Food</h1>

            <Card className="flex flex-col">
              <CardHeader className="items-center pb-0">
                <CardTitle>Pie Chart - Donut Active</CardTitle>
                <CardDescription>
                  Showing Popular Food in the restaurant
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 pb-0">
                <ChartContainer
                  config={popularFoodConfig || {}}
                  className="mx-auto aspect-square max-h-[250px]"
                >
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={popularFoodData || []}
                      dataKey="visitors"
                      nameKey="browser"
                      innerRadius={60}
                      strokeWidth={5}
                      activeIndex={0}
                      activeShape={({ outerRadius = 0, ...props }) => (
                        <Sector {...props} outerRadius={outerRadius + 10} />
                      )}
                    />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="w-[335px] self-center sm:w-full mt-10 font-bold text-[#e3efc8]  py-5 px-8 rounded-md bg-(--primary)">
          <h1 className="mb-4">Orders Delivered</h1>
          <p className="mb-2 text-xl text-white">
            {deliveredOrdersResponse?.total_delivered_items}
          </p>
          <div className="space-y-8">
            {deliveredOrdersResponse?.category_distribution.map((order) => (
              <div className="flex  justify-between border-b-2 border-[#e3efc8]">
                {order.category} ({order.percentage}) <span>{order.count}</span>
              </div>
            ))}
          </div>
          <img src="./zigzag.png" className="mt-6 w-full" alt="" />
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
