import React, { useState } from "react";
import { NavLink } from "react-router"; // Corrected import
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, Toaster } from "sonner";
import { useSelector } from "react-redux";

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
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelect } from "../components/ui/MultiSelect";

import {
  ChevronRight,
  UploadCloud,
  CircleX,
  Info,
  Users,
  FileText,
  PlusCircle, // New Icon
  Trash2, // New Icon
} from "lucide-react";
import { addPackageSchema } from "../validation/addFoodValidations";
import LoadingButton from "../components/LoadingButton";
import {
  useAddpackageMutation,
  useBranchServicesQuery,
  useCategoriesQuery,
  useGetOccasionQuery,
} from "../store/apiSlice/apiSlice";

const AddPackage = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const { branchInfo } = useSelector((state) => state.restaurant);
  const mockBranches = [
    {
      id: localStorage.getItem("branchID"),
      name: branchInfo?.branch?.description,
    },
  ];
  const [addPackage, { isLoading }] = useAddpackageMutation();
  const { data: categoriesResponse } = useCategoriesQuery();
  const { data: occasionResponse } = useGetOccasionQuery();
  const { data: branchServicesResponse } = useBranchServicesQuery();

  const mockCategories =
    categoriesResponse?.map((category) => ({
      id: category.id,
      name: category.name,
    })) || [];

  const mockOccasions =
    occasionResponse?.map((occasion) => ({
      id: occasion.id,
      name: occasion.name,
    })) || [];

  const mockServiceTypes = branchServicesResponse?.service_types?.map(
    (service) => {
      return {
        id: service.service_type.id,
        name: service.service_type.name,
      };
    }
  );

  const form = useForm({
    resolver: zodResolver(addPackageSchema),
    defaultValues: {
      name: "",
      description: "",
      photo: "",
      branch_id: undefined,
      branch_service_type_ids: [],
      category_ids: [],
      occasion_type_ids: [],
      serves_count: 1,
      base_price: 0,
      max_extra_persons: 0,
      price_per_extra_person: 0,
      cancellation_policy: "",
      prepayment_required: false,
      prepayment_amount: 0,
      is_active: true,
      notes: "",
      items: [{ food_item_name: "", quantity: 1 }],
      extras: [],
    },
    mode: "onChange",
  });

  const {
    fields: itemFields,
    append: appendItem,
    remove: removeItem,
  } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const {
    fields: extraFields,
    append: appendExtra,
    remove: removeExtra,
  } = useFieldArray({
    control: form.control,
    name: "extras",
  });

  const prepaymentRequired = form.watch("prepayment_required");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setImagePreview(base64String);
      form.setValue("photo", base64String, { shouldValidate: true });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const removeImage = () => {
    setImagePreview(null);
    form.setValue("photo", "", { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    console.log(data);
    try {
      // The `data` object now includes `items` and `extras` automatically
      const response = await addPackage(data).unwrap();
      toast.success(response.message || "Package created successfully!");
      form.reset(); // Resets to defaultValues, including empty arrays
      setImagePreview(null);
    } catch (error) {
      toast.error(error?.data?.message || "An error occurred.");
    }
  };

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="relative">
        <main className="p-4 sm:p-6 lg:p-8 bg-gray-50/50">
          <header className="flex justify-between items-center font-bold mb-6">
            <span className="text-xl sm:text-2xl text-(--primaryFont)">
              Add New Food Package
            </span>
            <div className="flex items-center gap-2 text-sm sm:text-base font-medium ">
              <NavLink
                to="/menu"
                className="text-(--secondaryFont) text-base hover:text-(--primaryFont)"
              >
                menu
              </NavLink>
              <ChevronRight className="text-(--secondaryFont)" size={20} />
              <NavLink
                to=""
                className={({ isActive }) =>
                  `transition-all ${
                    isActive ? "text-(--primary)" : "text-(--primaryFont)"
                  }`
                }
              >
                Add Package
              </NavLink>
            </div>
          </header>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* --- LEFT COLUMN: Image & Status --- */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-white p-6 rounded-lg border-2 border-(--border-color) shadow-sm">
                    <h3 className="text-lg font-semibold mb-4 text-(--primaryFont)">
                      Package Image
                    </h3>
                    <FormField
                      control={form.control}
                      name="photo"
                      render={() => (
                        <FormItem>
                          <FormControl>
                            {imagePreview ? (
                              <div className="relative group">
                                <img
                                  src={imagePreview}
                                  alt="Package Preview"
                                  className="w-full rounded-md object-cover border-2 border-(--border-color)"
                                />
                                <div
                                  onClick={removeImage}
                                  className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md cursor-pointer"
                                >
                                  <CircleX className="text-white h-10 w-10" />
                                </div>
                              </div>
                            ) : (
                              <label
                                htmlFor="package-photo"
                                className="group cursor-pointer w-full aspect-video rounded-md border-2 border-dashed border-(--border-color) flex flex-col justify-center items-center text-center hover:border-primary"
                              >
                                <UploadCloud className="h-10 w-10 text-(--secondaryFont) group-hover:text-primary" />
                                <p className="mt-2 font-semibold text-(--primaryFont)">
                                  Click to upload
                                </p>
                                <p className="text-xs text-(--secondaryFont)">
                                  PNG or JPG
                                </p>
                                <input
                                  id="package-photo"
                                  type="file"
                                  className="hidden"
                                  accept="image/*"
                                  onChange={handleFileChange}
                                />
                              </label>
                            )}
                          </FormControl>
                          <FormMessage className="mt-2" />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="bg-white p-6 rounded-lg border-2 border-(--border-color) shadow-sm">
                    <FormField
                      control={form.control}
                      name="is_active"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base text-(--primaryFont)">
                              Package Status
                            </FormLabel>
                            <FormDescription className="text-(--secondaryFont)">
                              Inactive packages will not be visible.
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
                </div>

                {/* --- RIGHT COLUMN: Details --- */}
                <div className="lg:col-span-2 bg-white p-6 rounded-lg border-2 border-(--border-color) shadow-sm space-y-8">
                  {/* Section: Basic Info */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-(--primaryFont)">
                      <Info size={20} /> Basic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-(--primaryFont)">
                              Package Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., Premium Ramadan Package"
                                {...field}
                                className="text-(--secondaryFont) focus-visible:ring-(--primary) focus:border-0"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        name="base_price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-(--primaryFont)">
                              Base Price ($)
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="e.g., 500"
                                {...field}
                                className="text-(--secondaryFont) focus-visible:ring-(--primary) focus:border-0"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="mt-6">
                      <FormField
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-(--primaryFont)">
                              Description
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe the package..."
                                {...field}
                                className="text-(--secondaryFont) focus-visible:ring-(--primary) focus:border-0"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-(--primaryFont)">
                      Package Items
                    </h3>
                    <div className="space-y-4">
                      {itemFields.map((field, index) => (
                        <div key={field.id} className="flex items-center gap-4">
                          <FormField
                            control={form.control}
                            name={`items.${index}.food_item_name`}
                            render={({ field }) => (
                              <FormItem className="flex-grow">
                                <FormControl>
                                  <Input
                                    placeholder={`Item #${index + 1}`}
                                    {...field}
                                    className="text-(--secondaryFont) focus-visible:ring-(--primary)"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          {itemFields.length > 1 && (
                            <Button
                              className="cursor-pointer"
                              type="button"
                              variant="destructive"
                              size="icon"
                              onClick={() => removeItem(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-4 text-(--primaryFont) hover:text-(--primaryFont) cursor-pointer"
                      onClick={() =>
                        appendItem({
                          food_item_name: "",
                          quantity: 1,
                        })
                      }
                    >
                      <PlusCircle className="mr-2 h-4 w-4" /> Add Item
                    </Button>
                  </div>

                  {/* --- NEW: Section for Optional Extras --- */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-(--primaryFont)">
                      Optional Extras
                    </h3>
                    <div className="space-y-4">
                      {extraFields.map((field, index) => (
                        <div
                          key={field.id}
                          className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center"
                        >
                          <FormField
                            control={form.control}
                            name={`extras.${index}.name`}
                            render={({ field }) => (
                              <FormItem className="md:col-span-3">
                                <FormLabel className="text-(--primaryFont)">
                                  Name
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="e.g., Extra Cheese"
                                    {...field}
                                    className="text-(--secondaryFont) focus-visible:ring-(--primary)"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`extras.${index}.price`}
                            render={({ field }) => (
                              <FormItem className="md:col-span-1">
                                <FormLabel className="text-(--primaryFont)">
                                  Price ($)
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="10"
                                    {...field}
                                    className="text-(--secondaryFont) focus-visible:ring-(--primary)"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="md:col-span-1 self-end ">
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              onClick={() => removeExtra(index)}
                              className="w-full cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-4 text-(--primaryFont) hover:text-(--primaryFont) cursor-pointer"
                      onClick={() => appendExtra({ name: "", price: 0 })}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" /> Add Extra
                    </Button>
                  </div>

                  {/* Section: Details & Associations */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-(--primaryFont)">
                      <Users size={20} /> Details & Associations
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        name="category_ids"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-(--primaryFont)">
                              Categories
                            </FormLabel>
                            <MultiSelect
                              options={mockCategories}
                              selected={field.value}
                              onChange={field.onChange}
                              placeholder="Select categories"
                              className="text-(--secondaryFont)  overflow-hidden focus-visible:ring-(--primary) focus:border-0"
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        name="occasion_type_ids"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-(--primaryFont)">
                              Occasions
                            </FormLabel>
                            <MultiSelect
                              options={mockOccasions}
                              selected={field.value}
                              onChange={field.onChange}
                              placeholder="Select occasions"
                              className="text-(--secondaryFont)  overflow-hidden focus-visible:ring-(--primary) focus:border-0"
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        name="branch_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-(--primaryFont)">
                              Branch
                            </FormLabel>
                            <Select
                              value={field.value ? field.value.toString() : ""}
                              onValueChange={(val) =>
                                field.onChange(parseInt(val))
                              }
                            >
                              <FormControl>
                                <SelectTrigger className="text-(--secondaryFont) focus-visible:ring-(--primary) focus:border-0">
                                  <SelectValue placeholder="Select a branch" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {mockBranches.map((b) => (
                                  <SelectItem
                                    key={b.id}
                                    value={b.id.toString()}
                                  >
                                    {b.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        name="branch_service_type_ids"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-(--primaryFont)">
                              Service Type
                            </FormLabel>
                            <MultiSelect
                              key={field.value}
                              options={mockServiceTypes}
                              selected={field.value}
                              onChange={field.onChange}
                              placeholder="Select services"
                              className="text-(--secondaryFont)  overflow-hidden focus-visible:ring-(--primary) focus:border-0"
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        name="serves_count"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-(--primaryFont)">
                              Serves (Persons)
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="e.g., 10"
                                {...field}
                                className="text-(--secondaryFont) focus-visible:ring-(--primary) focus:border-0"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        name="max_extra_persons"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-(--primaryFont)">
                              Max Extra Persons
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="e.g., 5"
                                {...field}
                                className="text-(--secondaryFont) focus-visible:ring-(--primary) focus:border-0"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        name="price_per_extra_person"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-(--primaryFont)">
                              Price Per Extra Person ($)
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="e.g., 50"
                                {...field}
                                className="text-(--secondaryFont) focus-visible:ring-(--primary) focus:border-0"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Section: Policy & Payment */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-(--primaryFont)">
                      <FileText size={20} /> Policy & Payment
                    </h3>
                    <div className="space-y-6">
                      <FormField
                        name="cancellation_policy"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-(--primaryFont)">
                              Cancellation Policy
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="e.g., 24 hours before event..."
                                {...field}
                                className="text-(--secondaryFont) focus-visible:ring-(--primary) focus:border-0"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        name="prepayment_required"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border-2 border-(--border-color) p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel className="text-(--primaryFont)">
                                Require Prepayment?
                              </FormLabel>
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
                      {prepaymentRequired && (
                        <FormField
                          name="prepayment_amount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-(--primaryFont)">
                                Prepayment Amount ($)
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="e.g., 100"
                                  {...field}
                                  className="text-(--secondaryFont) focus-visible:ring-(--primary) focus:border-0"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                      <FormField
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-(--primaryFont)">
                              Internal Notes (Optional)
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Add any internal notes here..."
                                {...field}
                                className="text-(--secondaryFont) focus-visible:ring-(--primary) focus:border-0"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* --- FORM ACTIONS --- */}
              <div className="flex justify-end gap-4 pt-6 border-t-2 border-(--border-color)">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    form.reset();
                    removeImage();
                  }}
                  className="text-(--secondaryFont) cursor-pointer hover:bg-gray-100"
                >
                  Clear Form
                </Button>
                <LoadingButton
                  isButton={true}
                  btnClass={"cursor-pointer"}
                  spinColor=""
                  type="submit"
                  loadingText="Creating..."
                  text="Create Package"
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

export default AddPackage;
