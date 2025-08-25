import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "react-router";
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
import { User, Mail, Phone, Car, KeyRound } from "lucide-react";

import {
  useDeliveryDetailsQuery,
  useEditDeliveryEmployeeMutation,
} from "../store/apiSlice/apiSlice";
import LoadingButton from "../components/LoadingButton";
import { editDeliveryEmpSchema } from "../validation/deliveryValidation";

const EditDeliveryEmployee = () => {
  const { deliveryEmployee } = useParams();
  const [isAvailable, setIsAvailable] = useState(false);

  const { data: deliveryResponse } = useDeliveryDetailsQuery(deliveryEmployee);
  const [editDeliveryEmployee, { isLoading: isUpdating }] =
    useEditDeliveryEmployeeMutation();

  const form = useForm({
    resolver: zodResolver(editDeliveryEmpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      vehicleType: "",
      gender: undefined,
      password: "",
      isAvailable: false, // This will be controlled by the isAvailable state
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (deliveryResponse?.delivery_person) {
      const person = deliveryResponse.delivery_person;
      form.reset({
        fullName: person.name,
        phone: String(person.phone),
        gender: person.gender === "m" ? "male" : "female",
        email: person.email,
        vehicleType: person.vehicle_type,
        isAvailable: person.is_available,
        password: "",
      });
      setIsAvailable(person.is_available);
    }
  }, [deliveryResponse, form]);

  const onSubmit = async (data) => {
    // Removed 'photo' from the payload
    const payload = {
      name: data.fullName,
      email: data.email,
      phone: data.phone,
      gender: data.gender === "male" ? "m" : "f",
      vehicle_type: data.vehicleType,
      is_available: data.isAvailable,
      password: data.password,
    };

    if (data.password && data.password.length > 0) {
      payload.password = data.password;
    }

    try {
      const response = await editDeliveryEmployee({
        deliveryEmployee,
        payload,
      }).unwrap();
      toast.success(response.message || "Employee updated successfully!");
    } catch (error) {
      toast.error(error?.data?.message || "An update error occurred.");
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
              <div className="p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-primaryFont">
                  Edit Delivery Employee
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Update the details for{" "}
                  {deliveryResponse?.delivery_person.name || "the employee"}.
                </p>
              </div>

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
                            <Input {...field} className="pl-10" />
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
                            <Input type="email" {...field} className="pl-10" />
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
                            value={field.value}
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
                        <FormControl>
                          <Select
                            key={field.value}
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
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password (Optional)</FormLabel>
                        <div className="relative">
                          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Leave blank to keep current"
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
                  render={() => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Is Available</FormLabel>
                        <FormDescription>
                          Can this employee be assigned new orders?
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={isAvailable}
                          onCheckedChange={(checked) => {
                            setIsAvailable(checked);
                            form.setValue("isAvailable", checked, {
                              shouldValidate: true,
                            });
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-4 p-6 bg-gray-50 border-t">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => form.reset()}
                  className="cursor-pointer"
                >
                  Cancel
                </Button>
                <LoadingButton
                  disabled={isUpdating}
                  isButton={true}
                  loadingText="Saving..."
                  text="Save Changes"
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

export default EditDeliveryEmployee;
