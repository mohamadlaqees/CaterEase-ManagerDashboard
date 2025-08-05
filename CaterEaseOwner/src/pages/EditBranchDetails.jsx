import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import EditBranchDetailsSkeleton from "@/components/skeleton/EditBranchDetailsSkeleton";
import {
  Trash2,
  PlusCircle,
  ChevronRight,
  UploadCloud,
  CircleX,
} from "lucide-react";
import LoadingButton from "../components/LoadingButton";
import { branchSchema } from "../validation/BranchValidations";

const initialBranchData = {
  id: 2,
  description: "Shami Taste Mezzeh",
  location_note: "Near Mezzeh Autostrad",
  phone: "123-456-7890",
  manager_name: "Alex Green",
  restaurant_photo: "https://via.placeholder.com/150x150.png?text=Logo",
  categories: ["Eastern", "Grill", "Traditional"],
  occasions: ["Family Dinners", "Business Lunch", "Special Events"],
  working_hours: [
    { day: "Monday", hours: "10:00 AM - 11:00 PM" },
    { day: "Tuesday", hours: "10:00 AM - 11:00 PM" },
    { day: "Wednesday", hours: "10:00 AM - 11:00 PM" },
    { day: "Thursday", hours: "10:00 AM - 11:00 PM" },
    { day: "Friday", hours: "10:00 AM - 12:00 AM" },
    { day: "Saturday", hours: "09:00 AM - 12:00 AM" },
    { day: "Sunday", hours: "Closed" },
  ],
  services: [
    {
      name: "Open Buffet",
      description: "All-you-can-eat buffet service.",
      price: "110.00",
    },
    {
      name: "Catering",
      description: "Full-service catering for parties and events.",
      price: "500.00+",
    },
  ],
  delivery_regions: [
    {
      name: "Downtown Metropolis",
      description: "Estimated delivery time: 30-45 mins",
      price: "5.00",
    },
    {
      name: "Uptown Star City",
      description: "Estimated delivery time: 45-60 mins",
      price: "7.50",
    },
  ],
};

const EditBranchDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);

  const form = useForm({
    resolver: zodResolver(branchSchema),
    defaultValues: {},
  });

  const {
    fields: categoryFields,
    append: appendCategory,
    remove: removeCategory,
  } = useFieldArray({ control: form.control, name: "categories" });
  const {
    fields: occasionFields,
    append: appendOccasion,
    remove: removeOccasion,
  } = useFieldArray({ control: form.control, name: "occasions" });
  const { fields: workingHoursFields } = useFieldArray({
    control: form.control,
    name: "working_hours",
  });
  const {
    fields: serviceFields,
    append: appendService,
    remove: removeService,
  } = useFieldArray({ control: form.control, name: "services" });
  const {
    fields: deliveryRegionFields,
    append: appendDeliveryRegion,
    remove: removeDeliveryRegion,
  } = useFieldArray({ control: form.control, name: "delivery_regions" });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setImagePreview(base64String);
      form.setValue("restaurant_photo", base64String, { shouldValidate: true });
    };
    reader.readAsDataURL(file);
    e.target.value = ""; // Allow re-uploading the same file
  };

  const removeImage = () => {
    setImagePreview(null);
    form.setValue("restaurant_photo", "", { shouldValidate: true });
  };

  const onSubmit = (data) => {
    console.log("Submitting updated data:", data);
    alert(
      "Branch details updated successfully! Check the console for the data object."
    );
  };

  useEffect(() => {
    setTimeout(() => {
      form.reset(initialBranchData);
      setImagePreview(initialBranchData.restaurant_photo);
      setIsLoading(false);
    }, 1500);
  }, [form]);

  if (isLoading) {
    return <EditBranchDetailsSkeleton />;
  }

  return (
    <main className="p-4 sm:p-6 md:p-10 bg-gray-50 min-h-screen">
      <header className="flex items-center justify-between font-bold mb-8">
        <span className="text-xl sm:text-2xl text-(--primaryFont)">
          Edit Branch
        </span>
        <div className="flex items-center text-sm sm:text-base gap-1 sm:gap-2 font-medium text-(--secondaryFont)">
          <div
            className="hover:text-(--primary) transition-colors cursor-pointer"
            onClick={() => navigate(-1)}
          >
            {initialBranchData.description}
          </div>
          <ChevronRight size={20} className="h-4 w-4" />
          <span className="text-(--primary)">
            Edit {form.getValues("description")}
          </span>
        </div>
      </header>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information & Image Upload */}
          <div className="grid lg:grid-cols-3 gap-8 lg:items-stretch">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-(--primaryFont)">
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-(--primaryFont)">
                        Branch Name
                      </FormLabel>
                      <FormControl>
                        <Input {...field} className="text-(--secondaryFont)" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location_note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-(--primaryFont)">
                        Location Note
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="text-(--secondaryFont)"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-(--primaryFont)">
                          Phone
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="text-(--secondaryFont)"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="manager_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-(--primaryFont)">
                          Manager Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="text-(--secondaryFont)"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Image Upload Card */}
            <div className="lg:col-span-1">
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="text-(--primaryFont)">
                    Branch Image
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col">
                  <FormField
                    control={form.control}
                    name="restaurant_photo"
                    render={() => (
                      <FormItem className="flex-grow flex flex-col">
                        <FormControl className="flex-grow">
                          {imagePreview ? (
                            <div className="relative group h-full">
                              <img
                                src={imagePreview}
                                alt="Branch Preview"
                                className="w-full h-full rounded-md object-cover border-2 border-(--border-color)"
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
                              htmlFor="branch-photo"
                              className="group cursor-pointer w-full h-full rounded-md border-2 border-dashed border-(--border-color) flex flex-col justify-center items-center text-center hover:border-primary"
                            >
                              <UploadCloud className="h-10 w-10 text-(--secondaryFont) group-hover:text-primary" />
                              <p className="mt-2 font-semibold text-(--primaryFont)">
                                Click to upload
                              </p>
                              <p className="text-xs text-(--secondaryFont)">
                                PNG or JPG
                              </p>
                              <input
                                id="branch-photo"
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
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Categories and Occasions */}
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-(--primaryFont)">
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categoryFields.map((field, index) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`categories.${index}`}
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <FormControl>
                            <Input
                              {...field}
                              className="text-(--secondaryFont)"
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeCategory(index)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => appendCategory("")}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-(--primaryFont)">
                  Occasions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {occasionFields.map((field, index) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`occasions.${index}`}
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <FormControl>
                            <Input
                              {...field}
                              className="text-(--secondaryFont)"
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeOccasion(index)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => appendOccasion("")}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Occasion
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Working Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="text-(--primaryFont)">
                Working Hours
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {workingHoursFields.map((field, index) => (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`working_hours.${index}.hours`}
                  render={({ field: inputField }) => (
                    <FormItem>
                      <div className="grid grid-cols-3 gap-4 items-center">
                        <FormLabel className="text-(--secondaryFont) col-span-1">
                          {initialBranchData.working_hours[index].day}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...inputField}
                            className="col-span-2 text-(--secondaryFont)"
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </CardContent>
          </Card>

          {/* Other Services */}
          <Card>
            <CardHeader>
              <CardTitle className="text-(--primaryFont)">
                Other Services
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {serviceFields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-4 border rounded-lg space-y-2 relative"
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-1 right-1"
                    onClick={() => removeService(index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`services.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-(--primaryFont)">
                            Service Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="text-(--secondaryFont)"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`services.${index}.price`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-(--primaryFont)">
                            Price
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="text-(--secondaryFont)"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name={`services.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-(--primaryFont)">
                          Description
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="text-(--secondaryFont)"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() =>
                  appendService({ name: "", description: "", price: "" })
                }
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Service
              </Button>
            </CardContent>
          </Card>

          {/* Delivery Regions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-(--primaryFont)">
                Delivery Regions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {deliveryRegionFields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-4 border rounded-lg space-y-2 relative"
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-1 right-1"
                    onClick={() => removeDeliveryRegion(index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`delivery_regions.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-(--primaryFont)">
                            Region Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="text-(--secondaryFont)"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`delivery_regions.${index}.price`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-(--primaryFont)">
                            Price
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="text-(--secondaryFont)"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name={`delivery_regions.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-(--primaryFont)">
                          Description
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="text-(--secondaryFont)"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() =>
                  appendDeliveryRegion({
                    name: "",
                    description: "",
                    price: "",
                  })
                }
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Delivery Region
              </Button>
            </CardContent>
          </Card>

          {/* Action Buttons Footer */}
          <div className="flex items-center justify-end gap-4 p-6 mt-8 ">
            <Button
              type="button"
              variant="ghost"
              onClick={() => form.reset()}
              className="cursor-pointer text-(--primaryFont)"
            >
              Cancel
            </Button>
            <LoadingButton
              disabled={form.formState.isSubmitting}
              isButton={true}
              loadingText="Saving..."
              text="Save Changes"
              type="submit"
              btnClass={"cursor-pointer"}
            />
          </div>
        </form>
      </Form>
    </main>
  );
};

export default EditBranchDetails;
