import { Check, ChevronRight, Dot } from "lucide-react";
import { NavLink } from "react-router";
import TableComponent from "../components/TableComponent";
import renderStars from "../util/renderStars";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { openAssignOrder, openDelivery } from "../store/orderSlice";
import { useEffect, useState } from "react";
import AssignOrder from "./AssignOrder";

const steps = [
  { id: 1, label: "Order received" },
  { id: 2, label: "Processing" },
  { id: 3, label: "On the way" },
  { id: 4, label: "Delivered" },
];
const tableHeader = [
  {
    name: "Dish",
    key: "name",
    render: (row) => (
      <div className="flex items-center gap-3 pr-10">
        <img src={row.img} alt={row.name} className="w-12 h-12 rounded-full" />
        <div>
          <div>{row.name}</div>
          <div>{renderStars(row.rate)}</div>
        </div>
      </div>
    ),
  },
  {
    name: "Price",
    key: "price",
  },
  {
    name: "Quantity",
    key: "quantity",
    render: (row) => `x${row.quantity}`,
  },
  {
    name: "Subtotal",
    key: "subtotal",
    render: (row) => {
      const price = parseFloat(row.price.replace("$", ""));
      const subtotal = price * row.quantity;
      return `$${subtotal.toFixed(2)}`;
    },
  },
];

const tableBody = [
  {
    name: "Italian Pizza",
    price: "$359.69",
    img: "/pizza.png",
    rate: 5,
    quantity: 1,
  },
  {
    name: "Veg Burger",
    price: "$350.30",
    img: "/burger.png",
    rate: 5,
    quantity: 2,
  },
  {
    name: "Italian Pizza",
    price: "$359.69",
    img: "/pizza.png",
    rate: 5,
    quantity: 3,
  },
  {
    name: "Italian Pizza",
    price: "$359.69",
    img: "/pizza.png",
    rate: 5,
    quantity: 1,
  },
  {
    name: "Italian Pizza",
    price: "$359.69",
    img: "/pizza.png",
    rate: 5,
    quantity: 2,
  },
  {
    name: "Italian Pizza",
    price: "$359.69",
    img: "/pizza.png",
    rate: 5,
    quantity: 4,
  },
];

const OrderDetails = () => {
  const { deliveryOpened, deliveryDetails } = useSelector(
    (state) => state.order
  );
  const [currentStep, setCurrentStep] = useState(1);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const changeScreen = () => {
      setIsSmallScreen(window.innerWidth < 640);
    };
    changeScreen();
    window.addEventListener("resize", changeScreen);
    return () => window.removeEventListener("resize", changeScreen);
  }, []);

  return (
    <div className="relative">
      <AssignOrder />
      <main className=" text-(--primaryFont) py-10 px-3 sm:p-10 ">
        <header className="flex justify-between items-center  font-bold mb-5">
          <span className="text-sm sm:text-2xl ">Order Details</span>
          <div className="flex items-center text-sm sm:text-base  sm:gap-2 font-medium">
            <NavLink to={"/orders"}>Orders</NavLink>
            <ChevronRight size={20} />
            <NavLink
              to={""}
              className={({ isActive }) =>
                `transition-all ${
                  isActive ? "text-(--primary)" : "text-(--primaryFont)"
                }`
              }
            >
              Order Details
            </NavLink>
          </div>
        </header>
        <section className=" border-2 border-(border-color)  rounded-md">
          <header className="text-sm text-center sm:text-base flex items-center sm:justify-start gap-5 p-5 border-b-2 border-(--border-color)">
            <h2>Order #9F36CA</h2>
            <Dot />
            <p>September 23, 2023</p>
            <Dot />
            <p> 3 Products</p>
          </header>

          <div className="text-sm sm:text-base flex justify-center flex-col  2xl:flex-row  px-5 xl:pl-5">
            <div className="w-full ">
              <div className="flex  flex-wrap justify-center xl:flex-nowrap  gap-5 mt-10">
                <div className=" w-full  border-2 border-(border-color)  rounded-md">
                  <h1 className="p-4 border-b-2 border-(--border-color)">
                    User Info
                  </h1>
                  <div className="p-4 space-y-2">
                    <h3>Jaylon Calzoni</h3>
                    <p className="text-(--secondaryFont)">
                      2123 Parker st. Allentown, New Mexico 123456
                    </p>
                    <h3>Email</h3>
                    <p className="text-(--secondaryFont)">
                      jaylon.calzoni@mail.com
                    </p>
                    <h3>Phone</h3>
                    <p className="text-(--secondaryFont)">(123) 456-7890</p>
                  </div>
                </div>
                <div className=" w-full  border-2 border-(border-color)  rounded-md">
                  <h1 className="p-4 border-b-2 border-(--border-color)">
                    Shipping Address
                  </h1>
                  <div className="p-4 space-y-2">
                    <h3>Ryan Westervelt i</h3>
                    <p className="text-(--secondaryFont)">
                      2123 Parker st. Allentown, New Mexico 123456
                    </p>
                    <h3>Date</h3>
                    <p className="text-(--secondaryFont)">2025 / 9 / 15</p>
                    <h3>Time</h3>
                    <p className="text-(--secondaryFont)">10:30 AM</p>
                  </div>
                </div>
                <div className=" w-full  border-2 border-(border-color)  rounded-md">
                  <h1 className="p-4 border-b-2 border-(--border-color)">
                    Total Payment :
                  </h1>
                  <div className="space-y-2">
                    <div className="p-3 flex justify-between border-b-2 border-(--border-color)">
                      <h3>Subtotal :</h3>
                      <p className="text-(--secondaryFont)">$365.00</p>
                    </div>
                    <div className="p-3 flex justify-between border-b-2 border-(--border-color)">
                      <h3>Discount :</h3>
                      <p className="text-(--secondaryFont)">20%</p>
                    </div>
                    <div className="p-3 flex justify-between border-b-2 border-(--border-color)">
                      <h3>Shipping :</h3>
                      <p className="text-(--secondaryFont)">Not Count</p>
                    </div>
                    <div className="p-3 flex justify-between ">
                      <h3>Total :</h3>
                      <p className="text-(--secondaryFont)">$84.00</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="xl:w-full  max-w-4xl   mt-10 px-4">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 items-center justify-between relative">
                  {/* Progress Line */}
                  <div className="absolute  w-2 h-80 sm:h-2 sm:w-full top-1/2    sm:left-6 sm:right-6 transform -translate-y-1/2   bg-gray-200 z-0 rounded-full">
                    <div
                      className={` sm:h-2 transition-all duration-500  bg-(--primary) rounded-full`}
                      style={
                        isSmallScreen
                          ? {
                              height: `${
                                ((currentStep - 1) / (steps.length - 1)) * 100
                              }%`,
                            }
                          : {
                              width: `${
                                ((currentStep - 1) / (steps.length - 1)) * 100
                              }%`,
                            }
                      }
                    />
                  </div>

                  {/* Step Circles */}
                  {steps.map((step, index) => (
                    <div
                      key={step.id}
                      className="flex flex-col items-center z-10 w-1/4"
                    >
                      <div
                        className={`w-10 h-10 sm:w-15 sm:h-15 flex items-center justify-center rounded-full border-2 ${
                          index + 1 < currentStep
                            ? "bg-(--primary) text-white border-(--primary)"
                            : index + 1 === currentStep
                            ? "bg-(--primary) text-white border-(--primary)"
                            : "border-dashed border-(--primary) text-(--primary) bg-white"
                        }`}
                      >
                        {index + 1 < currentStep ||
                        index + 1 === currentStep ? (
                          <Check size={20} />
                        ) : (
                          <span className="font-bold">{index + 1}</span>
                        )}
                      </div>
                      <span className="text-sm mt-2 text-center text-gray-700">
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="   border-2 border-(border-color)  rounded-md p-4 sm:ml-5 my-10 overflow-hidden  hover:overflow-y-scroll custom-scrollbar h-fit  2xl:max-h-56 max-w-[880px] transition-all  ">
                <TableComponent
                  tableBody={tableBody}
                  tableHeader={tableHeader}
                  tableClass={"min-w-[200px]"}
                />
              </div>
            </div>

            <div className="2xl:h-lvh  flex flex-col gap-10  2xl:justify-between mx-5 mb-10">
              <div
                className={`transition-all ${
                  deliveryOpened
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 h-0 -translate-y-2 pointer-events-none"
                } 2xl:w-[280px] w-full mt-10  border-2 border-(border-color)  rounded-md`}
              >
                <h1 className="p-4 border-b-2 border-(--border-color)">
                  Delivery Details
                </h1>
                <img src="/van.png" alt="" className="w-30 h-20 mx-auto" />
                {deliveryDetails ? (
                  <div className="space-y-2">
                    <div className="font-normal text-sm p-3 flex justify-between border-b-2 border-(--border-color)">
                      <h3 className="">Delivery employee :</h3>
                      <p className="text-(--secondaryFont)">Jaylon Calzoni</p>
                    </div>
                    <div className="font-normal text-sm p-3 flex justify-between border-b-2 border-(--border-color)">
                      <h3 className="">Phone :</h3>
                      <p className="text-(--secondaryFont)">(123) 456-7890</p>
                    </div>
                    <div className="font-normal text-sm p-3 flex justify-between border-b-2 border-(--border-color)">
                      <h3 className="">Payment Mode :</h3>
                      <p className="text-(--secondaryFont)">Upon delivery</p>
                    </div>
                    <div className="font-normal text-sm p-3 flex justify-between border-b-2 border-(--border-color)">
                      <h3 className="">Distance :</h3>
                      <p className="text-(--secondaryFont)">15 KM</p>
                    </div>
                    <div className="font-normal text-sm p-3 flex justify-between border-b-2 border-(--border-color) ">
                      <h3 className="">Estimation time :</h3>
                      <p className="text-(--secondaryFont)">30 min</p>
                    </div>
                    <div className="font-normal text-sm p-3 flex justify-between border-b-2 border-(--border-color) ">
                      <h3 className="">Date :</h3>
                      <p className="text-(--secondaryFont)">2025 / 9 / 15</p>
                    </div>
                    <div className="font-normal text-sm p-3 flex justify-between ">
                      <h3 className="">Starting Time :</h3>
                      <p className="text-(--secondaryFont)">10:00 AM</p>
                    </div>
                  </div>
                ) : (
                  <div className="mx-4 my-5">
                    <Button
                      type="submit"
                      className={` w-full cursor-pointer  h-10 text-base `}
                      onClick={() => {
                        dispatch(openAssignOrder(true));
                        setCurrentStep(3);
                      }}
                    >
                      Manage Delivery{" "}
                    </Button>
                  </div>
                )}
              </div>
              {!deliveryDetails && (
                <div className="flex  flex-col text-sm  smtext-base  items-center sm:flex-row  sm:justify-end gap-10 ">
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full sm:w-30 bg-[#fdecec] hover:bg-[#ef4444] hover:text-white text-[#ef4444] h-10 text-base cursor-pointer"
                  >
                    Reject
                  </Button>
                  <Button
                    type="submit"
                    disabled={deliveryOpened}
                    className={`w-full cursor-pointer sm:w-30 h-10 text-base `}
                    onClick={() => {
                      dispatch(openDelivery(true));
                      setCurrentStep(2);
                    }}
                  >
                    Accept Order
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default OrderDetails;
