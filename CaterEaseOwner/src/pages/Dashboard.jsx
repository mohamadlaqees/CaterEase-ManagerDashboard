import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { DollarSign, ShoppingCart, MapPin, Star } from "lucide-react";

// --- Mock Data ---
const branchesData = [
  { id: "all", name: "All Branches" },
  { id: "branch-1", name: "Riyadh Branch - Olaya" },
  { id: "branch-2", name: "Jeddah Branch - Tahlia" },
  { id: "branch-3", name: "Dammam Branch - Corniche" },
];

const branchPerformanceData = [
  { branch: "Riyadh Branch", revenue: 115000, orders: 1250, avgRating: 4.7 },
  { branch: "Jeddah Branch", revenue: 98000, orders: 1100, avgRating: 4.5 },
  { branch: "Dammam Branch", revenue: 76000, orders: 950, avgRating: 4.6 },
];

const monthlyRevenueData = [
  {
    month: "April",
    "Riyadh Branch": 4500,
    "Jeddah Branch": 3800,
    "Dammam Branch": 3200,
  },
  {
    month: "May",
    "Riyadh Branch": 4800,
    "Jeddah Branch": 4100,
    "Dammam Branch": 3500,
  },
  {
    month: "June",
    "Riyadh Branch": 5200,
    "Jeddah Branch": 4400,
    "Dammam Branch": 3800,
  },
  {
    month: "July",
    "Riyadh Branch": 5500,
    "Jeddah Branch": 4700,
    "Dammam Branch": 4100,
  },
];

const topSellingItems = [
  { id: 1, name: "Double Beef Burger", orders: 120, revenue: 2400 },
  { id: 2, name: "Pepperoni Pizza", orders: 95, revenue: 1900 },
  { id: 3, name: "Strawberry Mojito", orders: 150, revenue: 1500 },
];

// --- Chart Configuration with Theme Colors ---
const chartConfig = {
  "Riyadh Branch": { label: "Riyadh Branch", color: "hsl(var(--primary))" },
  "Jeddah Branch": { label: "Jeddah Branch", color: "hsl(var(--secondary))" }, // Using secondary for variety
  "Dammam Branch": { label: "Dammam Branch", color: "hsl(var(--accent))" }, // Using accent for variety
  revenue: { label: "Revenue", color: "hsl(var(--primary))" },
  orders: { label: "Orders", color: "hsl(var(--secondary))" },
};

function Dashboard() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold text-(--primaryFont)">
            Chain Owner Dashboard
          </h1>
          <div className="flex gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-full md:w-[220px] text-(--secondaryFont)">
                <SelectValue placeholder="Select Branch" />
              </SelectTrigger>
              <SelectContent>
                {branchesData.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Main KPI cards */}
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-(--primaryFont)">
                Total Chain Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-(--secondaryFont)" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-(--primaryFont)">
                SAR 289,000
              </div>
              <p className="text-xs text-(--secondaryFont)">
                +20.1% from last period
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-(--primaryFont)">
                Total Chain Orders
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-(--secondaryFont)" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-(--primaryFont)">
                +3,300
              </div>
              <p className="text-xs text-(--secondaryFont)">
                +18.3% from last period
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-(--primaryFont)">
                Active Branches
              </CardTitle>
              <MapPin className="h-4 w-4 text-(--secondaryFont)" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-(--primaryFont)">3</div>
              <p className="text-xs text-(--secondaryFont)">
                Currently operating branches
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-(--primaryFont)">
                Average Customer Satisfaction
              </CardTitle>
              <Star className="h-4 w-4 text-(--secondaryFont)" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-(--primaryFont)">4.6</div>
              <p className="text-xs text-(--secondaryFont)">
                Across all branches
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          {/* Branch performance comparison chart */}
          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle className="text-(--primaryFont)">
                Branch Performance Comparison
              </CardTitle>
              <CardDescription className="text-(--secondaryFont)">
                Comparing revenue and number of orders between different
                branches.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={chartConfig}
                className="aspect-auto h-[300px] w-full"
              >
                <BarChart
                  data={branchPerformanceData}
                  margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="branch"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tick={{ fill: "var(--color-primaryFont)" }}
                  />
                  <YAxis
                    yAxisId="left"
                    stroke="var(--color-primary)"
                    tick={{ fill: "var(--color-primaryFont)" }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `SAR ${value / 1000}k`}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="var(--color-secondary)"
                    tick={{ fill: "var(--color-secondaryFont)" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar
                    yAxisId="left"
                    dataKey="revenue"
                    fill="var(--color-primary)"
                    radius={4}
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="orders"
                    fill="var(--color-secondary)"
                    radius={4}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Monthly revenue growth chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-(--primaryFont)">
                Monthly Revenue Growth
              </CardTitle>
              <CardDescription className="text-(--secondaryFont)">
                Track the revenue growth of each branch individually.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={chartConfig}
                className="aspect-auto h-[300px] w-full"
              >
                <LineChart
                  data={monthlyRevenueData}
                  margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tick={{ fill: "var(--color-primaryFont)" }}
                  />
                  <YAxis
                    stroke="var(--color-primary)"
                    tick={{ fill: "var(--color-primaryFont)" }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value / 1000}k`}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Line
                    type="monotone"
                    dataKey="Riyadh Branch"
                    stroke="var(--color-primary)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="Jeddah Branch"
                    stroke="var(--color-secondary)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="Dammam Branch"
                    stroke="var(--color-accent)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top-selling items table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-(--primaryFont)">
              Top Selling Items Analysis (Riyadh Branch - Olaya)
            </CardTitle>
            <CardDescription className="text-(--secondaryFont)">
              You can change the branch from the filter above to see different
              data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-(--primaryFont)">Item</TableHead>
                  <TableHead className="text-center text-(--primaryFont)">
                    Number of Orders
                  </TableHead>
                  <TableHead className="text-right text-(--primaryFont)">
                    Revenue
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topSellingItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium text-(--primaryFont)">
                      {item.name}
                    </TableCell>
                    <TableCell className="text-center text-(--secondaryFont)">
                      {item.orders}
                    </TableCell>
                    <TableCell className="text-right text-(--secondaryFont)">
                      SAR {item.revenue.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default Dashboard;
