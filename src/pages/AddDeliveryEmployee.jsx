import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { toast, Toaster } from "sonner";

// Icons
import { User, Mail, Phone, Car, KeyRound } from "lucide-react";

import { deliveryEmpSchema } from "../validation/deliveryValidation";
import { useAddDeliveryEmployeeMutation } from "../store/apiSlice/apiSlice";
import LoadingButton from "../components/LoadingButton";

const AddDeliveryEmployee = () => {
  const [addDeliveryEmployee, { isLoading }] = useAddDeliveryEmployeeMutation();

  const form = useForm({
    resolver: zodResolver(deliveryEmpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      vehicleType: "",
      gender: undefined,
      password: "",
      isAvailable: true,
    },
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    // Removed 'photo' from the transformed data
    const transformedData = {
      name: data.fullName,
      email: data.email,
      phone: data.phone,
      gender: data.gender === "male" ? "m" : "f",
      password: data.password,
      vehicle_type: data.vehicleType,
      is_available: data.isAvailable,
    };
    try {
      await addDeliveryEmployee(transformedData).unwrap();
      toast.success("Delivery Employee created successfully!", {
        style: {
          background: "white",
          color: "#314E76",
          border: "1px solid hsl(var(--border))",
        },
      });
      form.reset();
    } catch (error) {
      const errorEntries = Object.entries(error.data.errors) || "";
      const message = errorEntries.map(([, value]) => value[0]);
      toast.error(message.join(", ") || "An error occurred.");
    }
  };

  return (
    <>
      <Toaster position="top-center" richColors />
      <main className="p-4 sm:p-6 lg:p-8 bg-gray-50/50 min-h-screen flex items-center justify-center">
        <div className="max-w-3xl w-full mx-auto">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="bg-white border border-gray-200 rounded-xl shadow-sm"
            >
              {/* Form Header */}
              <div className="p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-primaryFont">
                  Add New Delivery Employee
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Fill in the details below to create a new employee profile.
                </p>
              </div>

              {/* Main Content Area */}
              <div className="p-6 md:p-8 space-y-8">
                {/* Personal & Contact Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FormField
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <FormControl>
                            <Input
                              placeholder="e.g., John Doe"
                              {...field}
                              className="pl-10"
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="e.g., john.doe@example.com"
                              {...field}
                              className="pl-10"
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <FormControl>
                            <Input type="tel" {...field} className="pl-10" />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex space-x-4 pt-2"
                          >
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <RadioGroupItem value="male" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Male
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <RadioGroupItem value="female" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Female
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Vehicle & Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FormField
                    name="vehicleType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vehicle Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a vehicle" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="van">Van</SelectItem>
                            <SelectItem value="sedan">Sedan</SelectItem>
                            <SelectItem value="pickup">Pick Up</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <div className="relative">
                          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Must be 8+ characters"
                              {...field}
                              className="pl-10"
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Availability Switch */}
                <FormField
                  control={form.control}
                  name="isAvailable"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Is Available</FormLabel>
                        <FormDescription>
                          Can this employee be assigned new orders?
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Form Footer */}
              <div className="flex items-center justify-end gap-4 p-6 ">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                  className="text-(--secondaryFont) hover:text-(--primary) cursor-pointer "
                >
                  Clear Form
                </Button>
                <LoadingButton
                  disabled={isLoading}
                  isButton={true}
                  loadingText="Creating..."
                  text="Create Employee"
                  type="submit"
                  btnClass={"cursor-pointer"}
                />
              </div>
            </form>
          </Form>
        </div>
      </main>
    </>
  );
};

export default AddDeliveryEmployee;
