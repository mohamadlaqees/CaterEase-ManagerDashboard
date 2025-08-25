import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, X } from "lucide-react";
import { couponSchema } from "../validation/couponValidation";
import { openCoupon } from "../store/customersSlice";
import { useCouponMutation } from "../store/apiSlice/apiSlice";
import LoadingButton from "../components/LoadingButton";
import { toast } from "sonner";

const AddCoupon = ({ customerID }) => {
  const [addCoupon, { isLoading }] = useCouponMutation();
  const { couponOpened } = useSelector((state) => state.customers);
  const dispatch = useDispatch();
  const form = useForm({
    resolver: zodResolver(couponSchema),
    defaultValues: {},
  });
  const onSubmit = async (data) => {
    console.log(data);
    try {
      const couponResponse = await addCoupon({
        branch_id: +localStorage.getItem("branchID"),
        code: data.code,
        discount_amount: data.amount,
        expiration_date: format(data.endDate, "yyyy-MM-dd"),
        user_id: customerID,
      }).unwrap();
      if (couponResponse?.message === "تم إنشاء الكوبون بنجاح") {
        dispatch(openCoupon(false));
        form.reset();
        toast.success("Coupon have been created successfully", {
          style: {
            background: "white",
            color: "#A1CA46",
            border: "1px solid hsl(var(--border))",
          },
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.data.message, {
        style: {
          background: "white",
          color: "#ef4444",
          border: "1px solid hsl(var(--border))",
        },
      });
    }
  };

  return (
    <>
      {couponOpened && (
        <>
          <div className="absolute  w-full h-full bg-black opacity-30 z-20" />
          <div
            className={`bg-white text-sm sm:text-base text-(--primaryFont) p-8 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  absolute w-[90%]   sm:w-[40%] h-fit rounded-md  z-30`}
          >
            <header
              className="text-sm sm:text-lg flex justify-between
              font-bold mb-5"
            >
              Add Coupon
              <X
                className="transition-all hover:brightness-20 cursor-pointer"
                size={30}
                onClick={() => {
                  dispatch(openCoupon(false));
                  form.reset();
                }}
              />
            </header>{" "}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="  mt-10 space-y-10">
                  <div className="space-y-10  w-full ">
                    <FormField
                      control={form.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-(--primaryFont) ">
                            Code{" "}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Code"
                              {...field}
                              className="focus-visible:ring-(--primary) focus:border-0 border-(--border-color) border-2 h-10 placeholder-(--secondaryFont) text-(--secondaryFont)"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="space-y-10  w-full ">
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-(--primaryFont) ">
                            Amount{" "}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Amount"
                              {...field}
                              className=" focus-visible:ring-(--primary) focus:border-0 border-(--border-color) border-2 h-10 placeholder-(--secondaryFont) text-(--secondaryFont)"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-10 ">
                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="text-(--primaryFont) ">
                            End Date{" "}
                          </FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className="min-w-[225px] focus-visible:ring-(--primary) focus:border-0 border-(--border-color) border-2 h-10 placeholder-(--secondaryFont) text-(--secondaryFont)"
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>End Date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="flex flex-col  text-sm  sm:text-base  items-center lg:flex-row  sm:justify-end gap-10  mt-10">
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full lg:w-30 text-(--primary) h-10 text-base cursor-pointer"
                    onClick={() => form.reset()}
                  >
                    Clear{" "}
                  </Button>
                  <LoadingButton
                    btnClass={"w-full lg:w-30 h-10 text-base cursor-pointer"}
                    isButton={true}
                    loadingText={"Saveing..."}
                    text={"Save"}
                    type={"submit"}
                    spinColor="primary"
                    disabled={isLoading}
                  />
                </div>{" "}
              </form>
            </Form>
          </div>
        </>
      )}
    </>
  );
};

export default AddCoupon;
