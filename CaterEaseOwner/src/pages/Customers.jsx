import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TableComponent from "../components/TableComponent";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useCustomersQuery } from "../store/apiSlice/apiSlice";

const tableHeader = [
  {
    name: "ID",
    key: "id",
  },
  {
    name: "Name",
    key: "name",
  },
  {
    name: "Phone",
    key: "phone",
  },
  {
    name: "Email",
    key: "email",
  },
  {
    name: "Orders",
    key: "orders",
  },
  {
    name: "Customer Since",
    key: "customerSince",
  },
  {
    name: "Status",
    key: "status",
    render: (row) => (
      <div
        className={`flex items-center justify-center py-2 px-3 rounded-md ${
          row.status === "active"
            ? "text-[#22c55e] bg-[#e8f9ef]"
            : "text-[#ef4444] bg-[#fdecec]"
        }`}
      >
        {row.status}
      </div>
    ),
  },
];

const Customers = () => {
  const [searchInput, setSearchInput] = useState(null);
  const [date, setDate] = useState(null);
  const [selectValue, setSelectValue] = useState(undefined);

  const { data: customersResponse, isFetching } = useCustomersQuery({
    branchID: localStorage.getItem("branchID"),
    search: searchInput || undefined,
    date: date ? format(date, "yyyy-MM-dd") : undefined,
    status: selectValue || undefined,
  });

  const tableBody = customersResponse?.map((customer) => {
    console.log(customer);
    return {
      id: customer.id,
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      orders: customer.orders
        ? customer.orders.length
        : customer.total_orders
        ? customer.total_orders
        : "",
      customerSince: customer.customer_since,
      status: customer["status "] || customer.status,
    };
  });

  const searchHandler = (value) => {
    setTimeout(() => {
      setSearchInput(value);
    }, 500);
  };
  return (
    <>
      <main className=" text-(--primaryFont) p-10 ">
        <header className="flex justify-between   font-bold mb-5">
          <span className="text-xl sm:text-2xl ">Customers List</span>
        </header>
        <div className=" text-(--primaryFont) border-2 border-(--border-color)  rounded-md">
          <header className="text-sm sm:text-lg border-b-2 border-(--border-color) p-5 ">
            Customers
          </header>
          <div className="p-5 ">
            <div className="flex flex-col gap-4 xl:flex-row justify-between mb-10">
              <div className="relative ">
                <Input
                  onChange={(input) => searchHandler(input.target.value)}
                  type="text"
                  placeholder="Search"
                  className="pl-8 text-sm sm:text-base focus-visible:ring-(--primary) focus:border-0 border-(--border-color) border-2 w-3xs placeholder-(--secondaryFont) text-(--secondaryFont)"
                />
                <Search
                  className="absolute left-1 top-1/2 -translate-y-[60%] text-(--primary)"
                  size={20}
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-5 ">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="basis-1/2  min-w-[225px] focus-visible:ring-(--primary) focus:border-0 border-(--border-color) border-2 h-10 placeholder-(--secondaryFont) text-(--secondaryFont)"
                    >
                      {date ? format(date, "PPP") : <span>Register Date</span>}
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
                <Select
                  autoFocus
                  value={selectValue}
                  onValueChange={setSelectValue}
                >
                  <SelectTrigger className="basis-1/2 min-w-[225px] w-full h-10! focus-visible:ring-(--primary) focus:border-0 border-(--border-color) border-2  placeholder-(--secondaryFont) text-(--secondaryFont)">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup className="text-(--primaryFont)">
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="deleted">Not Active</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div
              className="
          overflow-hidden w-full max-h-[400px]   hover:overflow-y-scroll custom-scrollbar    transition-all"
            >
              <TableComponent
                direction={"customers"}
                tableHeader={tableHeader}
                tableBody={tableBody}
                isLoading={isFetching}
              />
            </div>
          </div>
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
      </main>
    </>
  );
};

export default Customers;
