import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"; // Assuming these are correctly aliased
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { reportSchema } from "../validation/reportValidation"; // Adjust path as needed
import { useReportMutation } from "../store/apiSlice/apiSlice";
import LoadingButton from "../components/LoadingButton";
import { toast, Toaster } from "sonner";

const SendReports = () => {
  const [report, { isError, isLoading, isSuccess, error }] =
    useReportMutation();

  const form = useForm({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      subject: "",
      details: "",
    },
  });

  const onSubmit = async (data) => {
    const dataWithBranchID = {
      ...data,
      branch_id: localStorage.getItem("branchID"),
    };
    try {
      const response = await report(dataWithBranchID);
      toast.success(response?.data.message, {
        style: {
          background: "white",
          color: "#A1CA46",
          border: "1px solid hsl(var(--border))",
        },
      });
    } catch (error) {
      toast.error(error.data.message, {
        style: {
          background: "white",
          color: "#ef4444",
          border: "1px solid hsl(var(--border))",
        },
      });
    }
    form.reset();
  };

  return (
    <>
      <Toaster position="top-center" richColors />

      <div className="relative p-4 sm:p-10">
        {" "}
        {/* Added padding for overall page */}
        <main className="text-(--primaryFont)">
          <h1 className="text-2xl font-bold mb-8">Send Reports</h1>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Subject Field */}
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-(--primaryFont) text-base sm:text-lg">
                      Subject
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter subject"
                        {...field}
                        className="focus-visible:ring-(--primary) focus:border-0 border-(--border-color) border-2 h-12 placeholder-(--secondaryFont) text-(--secondaryFont)"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Details Field */}
              <FormField
                control={form.control}
                name="details"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-(--primaryFont) text-base sm:text-lg">
                      Details
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter details here..."
                        {...field}
                        rows={10} // Adjust height as needed
                        className="resize-y focus-visible:ring-(--primary) focus:border-0 border-(--border-color) border-2 placeholder-(--secondaryFont) text-(--secondaryFont)"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end mt-8">
                <LoadingButton
                  btnClass={
                    "w-full sm:w-auto px-8 py-2 h-10 text-sm cursor-pointer bg-(--primary) text-white"
                  }
                  isButton={true}
                  loadingText={"Sending..."}
                  text={"Send"}
                  type={"submit"}
                  spinColor="primary"
                  disabled={isLoading}
                />
              </div>
            </form>
          </Form>
        </main>
      </div>
    </>
  );
};

export default SendReports;
