import { Check, ChevronRight, Dot } from "lucide-react";
import { NavLink, useParams } from "react-router";
import TableComponent from "../components/TableComponent";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { openAssignOrder, openDelivery } from "../store/orderSlice";
import { useEffect, useState } from "react";
import AssignOrder from "./AssignOrder";
import {
  useAcceptOrderMutation,
  useAssignOrderMutation,
  useOrderQuery,
  usePayCashFullMutation,
  usePayCashPartialMutation,
  useRejectOrderMutation,
} from "../store/apiSlice/apiSlice";
import { OrderDetailsSkeleton } from "../components/skeleton/OrderDetailsSkeleton";
import { format } from "date-fns";
import { toast, Toaster } from "sonner";
import LoadingButton from "../components/LoadingButton";
import { openConfirmPopUp } from "../store/menuSlice";
import ConfirmPopUp from "../components/ConfirmPopUp";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paySchema } from "../validation/orderValidation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

import { Input } from "@/components/ui/input";

const steps = [
  { id: 1, label: "Order received" },
  { id: 2, label: "Order confirmed" },
  { id: 3, label: "Order paid" },
  { id: 4, label: "Preparing" },
  { id: 5, label: "Waiting delivery acceptence" },
  { id: 6, label: "Assigned to dlivery" },
  { id: 7, label: "On the way" },
  { id: 8, label: "Delivered" },
];
const tableHeader = [
  {
    name: "Package",
    key: "name",
    render: (row) => (
      <div className="flex items-center gap-3 pr-10">
        <img src={row.img} alt={row.name} className="w-12 h-12 rounded-full" />
        <div>
          <div>{row.name}</div>
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

const OrderDetails = () => {
  const { assignOrderOpened } = useSelector((state) => state.order);
  const { orderID } = useParams();
  const { confirmPopUpOpened } = useSelector((state) => state.menu);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [loadingDeliveryPersonId, setLoadingDeliveryPersonId] = useState(null);

  const dispatch = useDispatch();
  const { data: orderResponse, isLoading } = useOrderQuery(orderID);
  const [acceptOrder, { isLoading: acceptOrderIsLoading }] =
    useAcceptOrderMutation();
  const [rejectOrder, { isLoading: rejectOrderIsLoading }] =
    useRejectOrderMutation();
  const [assignOrder, { isLoading: assignOrderIsLoading }] =
    useAssignOrderMutation(undefined, {
      skip: !assignOrderOpened,
    });
  const [payFull, { isLoading: payCashFullIsLoading }] =
    usePayCashFullMutation();
  const [payPartial, { isLoading: payCashPartialIsLoading }] =
    usePayCashPartialMutation();

  const form = useForm({
    resolver: zodResolver(paySchema),
    defaultValues: {
      amount: "",
      paymentType: "partial",
    },
  });
  const paymentType = form.watch("paymentType");

  const orderid = orderResponse?.order.id;
  const deliveryInfo = {
    deliveryEmpName: orderResponse?.order.delivery_info?.delivery_person?.name,
    deliveryEmpPhone:
      orderResponse?.order.delivery_info?.delivery_person?.phone,
    deliveryPersonStatus: orderResponse?.order.delivery_info?.status,
    deliveryPersonAcceptence:
      orderResponse?.order.delivery_info?.acceptance_status,
  };
  const customerInfo = {
    name: orderResponse?.order.customer.name,
    phone: orderResponse?.order.customer.phone,
    email: orderResponse?.order.customer.email,
    gender: orderResponse?.order.customer.gender,
    address: orderResponse?.order.customer.address,
    delivery_time: orderResponse?.order.customer.delivery_time,
    notes: orderResponse?.order.customer.notes_order,
    date: orderResponse?.order.customer.created_at,
    is_approved: orderResponse?.order.customer.is_approved,
    approved_at: orderResponse?.order.customer.approved_at,
  };

  const payment = {
    totalPrice: orderResponse?.order?.payment.totalPriceWithDelivery,
    deliveryPrice: orderResponse?.order?.payment.deliveryPrice,
    orderPrice: orderResponse?.order?.payment.orderPrice,
    prepaymentRequired: orderResponse?.order.details.reduce(
      (acc, curr) => acc + parseFloat(curr.prepayment_amount),
      0
    ),
    billStatus: orderResponse?.order?.payment?.bill_info?.status,
    paymentStatus:
      orderResponse?.order?.payment?.bill_info?.payments?.[0]?.payment_method,
    paymentAmount:
      orderResponse?.order?.payment?.bill_info?.payments?.[0]?.amount,
    remainingAmount:
      orderResponse?.order?.payment?.bill_info?.payment_progress
        ?.remaining_amount,
  };

  const addressInfo = {
    city: customerInfo.address?.city,
    street: customerInfo.address?.street,
    building: customerInfo.address?.building,
    floor: customerInfo.address?.floor,
    apartment: customerInfo.address?.apartment,
  };

  const packages = orderResponse?.order?.details;
  const { name, phone, email, gender, delivery_time, is_approved } =
    customerInfo;

  const { city, street, building, floor, apartment } = addressInfo;
  const {
    deliveryPersonAcceptence,
    deliveryPersonStatus,
    deliveryEmpName,
    deliveryEmpPhone,
  } = deliveryInfo;

  const tableBody = packages?.map((pkg) => {
    return {
      id: pkg.package_id,
      category: pkg.categories[0].name,
      name: pkg.package_name,
      price: pkg.unit_price,
      img: pkg.package_photo,
      quantity: pkg.quantity,
    };
  });
  const { totalPrice, deliveryPrice, orderPrice } = payment;

  const formattedDate = customerInfo.date
    ? format(new Date(customerInfo.date), "MMMM d, yyyy")
    : "Date not available";

  useEffect(() => {
    const changeScreen = () => {
      setIsSmallScreen(window.innerWidth < 640);
    };
    changeScreen();
    window.addEventListener("resize", changeScreen);
    return () => window.removeEventListener("resize", changeScreen);
  }, []);

  const accepthandler = async () => {
    try {
      const response = await acceptOrder(orderID).unwrap();
      toast.success(response.message, {
        style: {
          background: "white",
          color: "#314E76",
          border: "1px solid hsl(var(--border))",
        },
      });
    } catch (error) {
      toast.error(error?.data?.message, {
        style: {
          background: "white",
          color: "#ef4444",
          border: "1px solid hsl(var(--border))",
        },
      });
    }
  };

  const openPopUpHandler = () => {
    dispatch(openConfirmPopUp(true));
  };

  const cancelPopUpHandler = () => {
    dispatch(openConfirmPopUp(false));
  };

  const rejectOrderHandler = async (data) => {
    try {
      const response = await rejectOrder({ orderID, data }).unwrap();
      toast.success(response.message, {
        style: {
          background: "white",
          color: "#314E76",
          border: "1px solid hsl(var(--border))",
        },
      });
      dispatch(openConfirmPopUp(false));
    } catch (error) {
      toast.error(error?.data?.message, {
        style: {
          background: "white",
          color: "#ef4444",
          border: "1px solid hsl(var(--border))",
        },
      });
    }
  };

  const assignOrderHandler = async (DID) => {
    setLoadingDeliveryPersonId(DID); // Set loading for this specific ID
    try {
      await assignOrder({
        order_id: orderID,
        delivery_person_id: DID,
        action: "assign",
      }).unwrap();
      toast.success(`${"Order has been assigned to delivery employee"}`, {
        style: {
          background: "white",
          color: "#314E76",
          border: "1px solid hsl(var(--border))",
        },
      });
      dispatch(openAssignOrder(false));
    } catch (error) {
      toast.error(error?.data?.message, {
        style: {
          background: "white",
          color: "#ef4444",
          border: "1px solid hsl(var(--border))",
        },
      });
    } finally {
      setLoadingDeliveryPersonId(null); // Clear loading state regardless of outcome
    }
  };

  const payPartialHandler = async (data) => {
    try {
      const response = await payPartial({
        orderID,
        data: {
          amount: data.amount,
          payment_type: "partial",
        },
      }).unwrap();
      toast.success(response.message, {
        style: {
          background: "white",
          color: "#314E76",
          border: "1px solid hsl(var(--border))",
        },
      });
      currentStep = 3;
    } catch (error) {
      toast.error(error?.data?.message, {
        style: {
          background: "white",
          color: "#ef4444",
          border: "1px solid hsl(var(--border))",
        },
      });
    }
  };

  const payFullHandler = async () => {
    try {
      const response = await payFull({
        orderID,
        data: {
          payment_type: "full",
          amount: totalPrice,
        },
      }).unwrap();
      toast.success(response.message, {
        style: {
          background: "white",
          color: "#314E76",
          border: "1px solid hsl(var(--border))",
        },
      });
      currentStep = 3;
    } catch (error) {
      toast.error(error?.data?.message, {
        style: {
          background: "white",
          color: "#ef4444",
          border: "1px solid hsl(var(--border))",
        },
      });
    }
  };

  const onSubmit = (data) => {
    if (data.paymentType === "partial") {
      payPartialHandler(data);
    } else if (data.paymentType === "full") {
      payFullHandler();
    }
  };

  let currentStep = 1; // Start with the default step

  if (is_approved === 1) {
    currentStep = 2; // If the order is confirmed, it's at least step 2
  }

  if (
    payment.billStatus === "paid" ||
    payment.billStatus === "partially_paid"
  ) {
    currentStep = 4;
  }

  if (deliveryPersonStatus === "assigned") {
    currentStep = 5;
  }
  if (deliveryPersonAcceptence) {
    currentStep = 7;
  }
  if (deliveryPersonStatus === "delivered") {
    currentStep = 8;
  }

  return (
    <div className="relative">
      {confirmPopUpOpened && (
        <ConfirmPopUp
          reason={true}
          loading={rejectOrderIsLoading}
          onConfirm={rejectOrderHandler}
          onCancel={cancelPopUpHandler}
          content={"Are You Sure You Want To reject This Order ?"}
        />
      )}
      <Toaster position="top-center" richColors />
      {deliveryPersonStatus !== "assigned" && (
        <AssignOrder
          orderID={+orderID}
          assignOrder={assignOrderHandler}
          assignOrderIsLoading={assignOrderIsLoading}
          loadingDeliveryPersonId={loadingDeliveryPersonId}
        />
      )}
      <main className=" text-(--primaryFont) py-10 px-3 sm:p-10 ">
        <header className="flex justify-between items-center  font-bold mb-5">
          <span className="text-sm sm:text-2xl ">Order Details</span>
          <div className="flex items-center text-sm sm:text-base  sm:gap-2 font-medium">
            <NavLink
              to={"/orders"}
              className={"hover:text-(--primary) transition-all"}
            >
              Orders
            </NavLink>
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
        {isLoading ? (
          <OrderDetailsSkeleton />
        ) : (
          <section className=" border-2 border-(border-color)  rounded-md">
            <header className="text-sm text-center sm:text-base flex items-center sm:justify-start gap-5 p-5 border-b-2 border-(--border-color)">
              <h2>Order {orderid}</h2>
              <Dot />
              <p>{formattedDate}</p>
              <Dot />
              <p> {packages?.length} packages</p>
            </header>

            <div className="text-sm sm:text-base flex justify-center flex-col  2xl:flex-row  px-5 xl:pl-5">
              <div className="w-full ">
                <div className="flex  flex-wrap justify-center xl:flex-nowrap  gap-5 mt-10">
                  <div className=" w-full  border-2 border-(border-color)  rounded-md">
                    <h1 className="p-4 border-b-2 border-(--border-color)">
                      User Info
                    </h1>
                    <div className="p-4 space-y-2">
                      <h3>{name}</h3>
                      <p className="text-(--secondaryFont)">
                        {city} , {street} , {building} , {floor} , {apartment}
                      </p>
                      <h3>Email</h3>
                      <p className="text-(--secondaryFont)">{email}</p>
                      <h3>Phone</h3>
                      <p className="text-(--secondaryFont)">{phone}</p>
                      <h3>Gender</h3>
                      <p className="text-(--secondaryFont)">
                        {gender === "f" ? "Female" : "Male"}
                      </p>
                    </div>
                  </div>
                  <div className=" w-full  border-2 border-(border-color)  rounded-md">
                    <h1 className="p-4 border-b-2 border-(--border-color)">
                      Shipping Address
                    </h1>
                    <div className="p-4 space-y-2">
                      <h3>{city}</h3>
                      <p className="text-(--secondaryFont)">
                        {street} , {building} , {floor} , {apartment}
                      </p>
                      <h3>Date</h3>
                      <p className="text-(--secondaryFont)">2025 / 9 / 15</p>
                      <h3>Time</h3>
                      <p className="text-(--secondaryFont)">
                        {delivery_time || " -"}
                      </p>
                    </div>
                  </div>
                  <div className=" w-full  border-2 border-(border-color)  rounded-md">
                    <h1 className="p-4 border-b-2 border-(--border-color)">
                      Total Payment :
                    </h1>
                    <div className="space-y-2">
                      <div className="p-3 flex justify-between border-b-2 border-(--border-color)">
                        <h3>Subtotal :</h3>
                        <p className="text-(--secondaryFont)">{orderPrice}</p>
                      </div>
                      <div className="p-3 flex justify-between border-b-2 border-(--border-color)">
                        <h3>Shipping :</h3>
                        <p className="text-(--secondaryFont)">
                          {deliveryPrice || "-"}
                        </p>
                      </div>
                      <div className="p-3 flex justify-between  border-b-2 border-(--border-color)">
                        <h3>Total :</h3>
                        <p className="text-(--secondaryFont)">{totalPrice}</p>
                      </div>
                      <div className="max-h-[144px] overflow-hidden space-y-4 hover:overflow-y-scroll custom-scrollbar">
                        <div className="px-3 flex justify-between ">
                          <h3 className="text-(--priamty) font-bold">
                            Payments :
                          </h3>
                        </div>
                        <div className="px-3 flex justify-between ">
                          <h3 className="text-(--priamty)">
                            Payment status :{" "}
                            <span className="text-(--secondaryFont)">
                              {payment.billStatus || "-"}
                            </span>
                          </h3>
                        </div>
                        <div className="px-3 flex justify-between ">
                          <h3 className="text-(--priamty)">
                            Payment method :{" "}
                            <span className="text-(--secondaryFont)">
                              {payment.paymentStatus || "-"}
                            </span>
                          </h3>
                        </div>
                        <div className="px-3 flex justify-between ">
                          <h3 className="text-(--priamty)">
                            Amount :{" "}
                            <span className="text-(--secondaryFont)">
                              {payment.paymentAmount || "-"}
                            </span>
                          </h3>
                        </div>
                        <div className="px-3 flex justify-between ">
                          <h3 className="text-(--priamty)">
                            Remianing amount :{" "}
                            <span className="text-(--secondaryFont)">
                              {+payment.remainingAmount || "-"}
                            </span>
                          </h3>
                        </div>
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
                        {step.id === 3 && payment.paymentStatus && (
                          <span className="text-(--primary) font-bold">
                            {payment.paymentStatus}
                          </span>
                        )}
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

              <div
                className={`2xl:min-h-screen  flex flex-col gap-10   mx-5 mb-10  `}
              >
                <div
                  className={`transition-all ${
                    !!is_approved &&
                    !deliveryPersonStatus &&
                    (payment.billStatus === "paid" ||
                      payment.billStatus === "partially_paid")
                      ? "opacity-100 translate-y-0 pointer-events-auto"
                      : "hidden translate-y-full pointer-events-none"
                  } 
                   2xl:w-[280px] w-full mt-10  border-2 border-(border-color)  rounded-md`}
                >
                  <>
                    <img src="/van.png" alt="" className="w-30 h-20 mx-auto" />
                    <div className="mx-4 my-5">
                      <Button
                        type="submit"
                        className={` w-full cursor-pointer  h-10 text-base `}
                        onClick={() => {
                          dispatch(openAssignOrder(true));
                          currentStep = 3;
                        }}
                      >
                        Manage Delivery{" "}
                      </Button>
                    </div>
                  </>
                </div>
                {!!is_approved &&
                  deliveryPersonAcceptence &&
                  deliveryPersonStatus === "delivered" && (
                    <div
                      className={`transition-all opacity-100 translate-y-0 pointer-events-auto 2xl:w-[280px] w-full mt-10  border-2 border-(border-color)  rounded-md`}
                    >
                      <>
                        <h1 className="p-4 border-b-2 border-(--border-color)">
                          Delivery Details
                        </h1>
                        <img
                          src="/van.png"
                          alt=""
                          className="w-30 h-20 mx-auto"
                        />
                        <div className="space-y-2">
                          <div className="font-normal text-sm p-3 flex justify-between border-b-2 border-(--border-color)">
                            <h3 className="">Delivery employee :</h3>
                            <p className="text-(--secondaryFont)">
                              {deliveryEmpName}
                            </p>
                          </div>
                          <div className="font-normal text-sm p-3 flex justify-between border-b-2 border-(--border-color)">
                            <h3 className="">Phone :</h3>
                            <p className="text-(--secondaryFont)">
                              {deliveryEmpPhone}
                            </p>
                          </div>
                          <div className="font-normal text-sm p-3 flex justify-between border-b-2 border-(--border-color)">
                            <h3 className="">Payment Mode :</h3>
                            <p className="text-(--secondaryFont)">
                              {payment.billStatus + " " + payment.paymentStatus}
                            </p>
                          </div>
                          <div className="font-normal text-sm p-3 flex justify-between border-b-2 border-(--border-color) ">
                            <h3 className="">Date :</h3>
                            <p className="text-(--secondaryFont)">
                              2025 / 9 / 15
                            </p>
                          </div>
                        </div>
                      </>
                    </div>
                  )}
                <div className="flex-grow" />
                {!!is_approved &&
                  payment.prepaymentRequired !== 0 &&
                  payment.billStatus === "unpaid" && (
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="w-full space-y-6"
                      >
                        {/* --- NEW: RadioGroup using FormField --- */}
                        <FormField
                          control={form.control}
                          name="paymentType"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="text-(--primaryFont) font-medium">
                                Payment Option
                              </FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex items-center space-x-4"
                                >
                                  <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="partial" id="r1" />
                                    </FormControl>
                                    <Label
                                      htmlFor="r1"
                                      className="font-normal text-(--secondaryFont)"
                                    >
                                      Partial Pay
                                    </Label>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="full" id="r2" />
                                    </FormControl>
                                    <Label
                                      htmlFor="r2"
                                      className="font-normal text-(--secondaryFont)"
                                    >
                                      Full Pay
                                    </Label>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {paymentType === "partial" ? (
                          <>
                            {/* Amount Field (conditionally editable) */}
                            <FormField
                              control={form.control}
                              name="amount"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-(--primaryFont)">
                                    Paying Amount
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      placeholder={`Enter ${payment.prepaymentRequired} amount`}
                                      {...field}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        field.onChange(
                                          value === "" ? "" : Number(value)
                                        );
                                      }}
                                      // --- DYNAMIC BEHAVIOR ---
                                      disabled={payCashPartialIsLoading}
                                      className={`focus-visible:ring-(--primary) focus:border-0 border-(--border-color) border-2 h-10 placeholder-(--secondaryFont) text-(--secondaryFont) `}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            {/* Submit Button */}
                            <LoadingButton
                              isButton={true}
                              btnClass="w-full mt-4 cursor-pointer h-10 text-base"
                              type="submit"
                              loadingText="Processing..."
                              text={"Pay Partial Amount"}
                              disabled={payCashPartialIsLoading}
                              loading={payCashPartialIsLoading}
                            />
                          </>
                        ) : (
                          <>
                            {/* Submit Button */}
                            <LoadingButton
                              isButton={true}
                              btnClass="w-full mt-4 cursor-pointer h-10 text-base"
                              type="submit"
                              loadingText="Processing..."
                              text={"Pay Full Amount"}
                              disabled={payCashFullIsLoading}
                              loading={payCashFullIsLoading}
                            />
                          </>
                        )}
                      </form>
                    </Form>
                  )}
                <div className="flex  flex-col text-sm  sm:text-base  items-center sm:flex-row   gap-10 ">
                  {!!is_approved &&
                    deliveryPersonStatus !== "assigned" &&
                    payment.billStatus === "unpaid" && (
                      <Button
                        onClick={openPopUpHandler}
                        type="button"
                        variant="outline"
                        className={`w-full 2xl:w-60 m-0 2xl:m-auto  bg-[#fdecec] hover:bg-[#ef4444] hover:text-white text-[#ef4444] h-10 text-base cursor-pointer`}
                      >
                        Reject
                      </Button>
                    )}
                  {!is_approved && (
                    <LoadingButton
                      isButton={true}
                      btnClass={`w-full 2xl:w-60 m-0 2xl:m-auto cursor-pointer  h-10 text-base `}
                      spinColor=""
                      type="submit"
                      loadingText="Accepting..."
                      text="Accept Order"
                      disabled={acceptOrderIsLoading}
                      click={() => {
                        dispatch(openDelivery(true)), (currentStep = 2);
                        accepthandler();
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default OrderDetails;
