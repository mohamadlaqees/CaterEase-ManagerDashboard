import { useState, useEffect, useMemo } from "react";
import { NavLink, useParams } from "react-router";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, Toaster } from "sonner";
import { useDispatch, useSelector } from "react-redux";

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
import LoadingButton from "../components/LoadingButton";
import DiscountFormModal from "./AddDiscount";
import TableComponent from "../components/TableComponent";
import ConfirmPopUp from "../components/ConfirmPopUp";
import EditFoodSkeleton from "../components/skeleton/EditFoodSkeleton";
import { format } from "date-fns";

import {
  ChevronRight,
  UploadCloud,
  CircleX,
  Info,
  Users,
  FileText,
  Save,
  Undo2,
  PlusCircle,
  Trash2,
  Eye,
} from "lucide-react";

import { editPackageSchema } from "../validation/addFoodValidations";
import {
  useGetPackageQuery,
  useCategoriesQuery,
  useGetOccasionQuery,
  useUpdatepackageMutation,
  useDeleteDiscountMutation,
  usePackagesWithDiscountQuery,
  useBranchServicesQuery,
} from "../store/apiSlice/apiSlice";
import { openConfirmPopUp } from "../store/packageSlice";

const EditFood = () => {
  const { category, food: packageId } = useParams();
  const [imagePreview, setImagePreview] = useState(null);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [showDiscount, setShowDiscount] = useState(null);
  const [viewOnly, setViewOnly] = useState(false);
  const [discountID, setDiscountID] = useState(null);
  const { confirmPopUpOpened } = useSelector((state) => state.package);
  const dispatch = useDispatch();

  // --- RTK Query Hooks for Data Fetching ---
  const { data: packageResponse, isLoading: isPackageLoading } =
    useGetPackageQuery(packageId);
  const [updatePackage, { isLoading: isUpdating }] = useUpdatepackageMutation();
  const { data: packagesWithDiscount } = usePackagesWithDiscountQuery();
  const [deleteDiscount, { isLoading: deleteDiscountIsLoading }] =
    useDeleteDiscountMutation();
  const { data: categoriesResponse } = useCategoriesQuery();
  const { data: occasionResponse } = useGetOccasionQuery();
  const { data: branchServicesResponse } = useBranchServicesQuery();

  // --- Centralized Data Transformation using useMemo ---
  const packageDetails = useMemo(() => {
    const pkg = packageResponse;
    if (!pkg) return null;

    return {
      name: pkg.name || "",
      description: pkg.description || "",
      photo: pkg.photo || null,
      base_price: parseFloat(pkg.base_price) || 0,
      branch_id: pkg.branch_id,
      branchName: pkg.name_branch,
      category_ids: pkg.categories?.map((c) => c.id) || [],
      occasion_type_ids: pkg.occasion_types?.map((o) => o.id) || [],
      serves_count: pkg.serves_count || 1,
      max_extra_persons: pkg.max_extra_persons || 0,
      price_per_extra_person: parseFloat(pkg.price_per_extra_person) || 0,
      cancellation_policy: pkg.cancellation_policy || "",
      prepayment_required: !!pkg.prepayment_required,
      prepayment_amount: parseFloat(pkg.prepayment_amount) || 0,
      is_active: !!pkg.is_active,
      notes: pkg.notes || "",
      branch_service_type_ids: pkg.branch_service_types?.map(
        (s) => s.service_type_id
      ),
      items:
        pkg.items?.map((item) => ({
          food_item_name: item.food_item_name,
          quantity: item.quantity || 1, // Assuming a default quantity
        })) || [],
      extras:
        pkg.extras?.map((extra) => ({
          name: extra.name,
          price: parseFloat(extra.price) || 0,
        })) || [],
    };
  }, [packageResponse]);

  // --- Data for Select Inputs ---
  const mockCategories =
    categoriesResponse?.map((c) => ({ id: c.id, name: c.name })) || [];
  const mockOccasions =
    occasionResponse?.map((o) => ({ id: o.id, name: o.name })) || [];
  const mockServiceTypes =
    branchServicesResponse?.service_types?.map(({ service_type }) => ({
      id: service_type.id,
      name: service_type.name,
    })) || [];
  const mockBranches = [
    {
      id: packageDetails?.branch_id,
      name: packageDetails?.branchName,
    },
  ];

  const packagesDiscounts = packagesWithDiscount?.packages.find(
    (pkg) => pkg.id === +packageId
  )?.discounts;

  // --- React Hook Form Initialization ---
  const form = useForm({
    resolver: zodResolver(editPackageSchema),
    defaultValues: {
      name: "",
      description: "",
      photo: null,
      base_price: 0,
      branch_id: undefined,
      category_ids: [],
      occasion_type_ids: [],
      branch_service_type_ids: [],
      serves_count: 1,
      max_extra_persons: 0,
      price_per_extra_person: 0,
      cancellation_policy: "",
      prepayment_required: false,
      prepayment_amount: 0,
      is_active: true,
      notes: "",
      items: [],
      extras: [],
    },
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

  // --- Effect to Sync Form State with Fetched Data ---
  useEffect(() => {
    if (packageDetails) {
      form.reset(packageDetails);
      if (packageDetails.photo) {
        setImagePreview(packageDetails.photo);
      }
    }
  }, [packageDetails, form.reset]);

  const prepaymentRequired = form.watch("prepayment_required");

  // --- Event Handlers ---
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
    form.setValue("photo", null, { shouldValidate: true });
  };

  const closeDiscountModal = () => {
    setIsDiscountModalOpen(false);
    setShowDiscount(null);
    setViewOnly(false);
  };

  const handleOpenAddDiscount = () => {
    setShowDiscount(null);
    setViewOnly(false);
    setIsDiscountModalOpen(true);
  };

  const handleShowDiscount = (discountID) => {
    setViewOnly(true);
    const filteredDiscount = packagesDiscounts.find((d) => d.id === discountID);
    setShowDiscount(filteredDiscount);
    setIsDiscountModalOpen(true);
  };

  const handleDeleteDiscount = (discountId) => {
    dispatch(openConfirmPopUp(true));
    setDiscountID(discountId);
  };

  const deleteDiscountHandler = async () => {
    try {
      const response = await deleteDiscount(discountID).unwrap();
      toast.success(response.message);
      dispatch(openConfirmPopUp(false));
    } catch (error) {
      toast.error(error.data.message);
    }
  };

  const cancelPopUpHandler = () => {
    dispatch(openConfirmPopUp(false));
  };

  const onSubmit = async (data) => {
    try {
      const response = await updatePackage({ id: packageId, ...data }).unwrap();
      toast.success(response.message);
    } catch (error) {
      toast.error(error.data.message || "An unexpected error occurred.");
    }
  };

  // --- Table Configuration for Discounts ---
  const tableHeader = [
    { name: "Value", key: "value" },
    { name: "Description", key: "description" },
    { name: "Status", key: "is_active" },
    { name: "Starts", key: "start_at" },
    { name: "Ends", key: "end_at" },
    {
      name: "Action",
      key: "action",
      render: (row) => (
        <div className="flex gap-2 items-center justify-center py-2 px-3 rounded-md">
          <Eye
            onClick={() => handleShowDiscount(row.id)}
            className="hover:bg-accent cursor-pointer rounded-md text-(--primaryFont) transition-all p-1"
            size={30}
          />
          <Trash2
            onClick={() => handleDeleteDiscount(row.id)}
            className="hover:bg-accent cursor-pointer rounded-md text-(--primaryFont) transition-all p-1"
            size={30}
          />
        </div>
      ),
    },
  ];

  const tableBody = packagesDiscounts?.map((discount) => ({
    id: discount.id,
    value: `${discount.value}`,
    description: discount.description,
    start_at: format(discount.start_at, "yyyy-MM-dd"),
    end_at: format(discount.end_at, "yyyy-MM-dd"),
    is_active: discount.is_active ? "Active" : "Inactive",
  }));

  if (isPackageLoading) {
    return <EditFoodSkeleton />;
  }

  return (
    <div className="relative">
      {confirmPopUpOpened && (
        <ConfirmPopUp
          loading={deleteDiscountIsLoading}
          onConfirm={deleteDiscountHandler}
          onCancel={cancelPopUpHandler}
          content={"Are you sure you want to delete this discount?"}
        />
      )}

      <DiscountFormModal
        viewOnly={viewOnly}
        isOpened={isDiscountModalOpen}
        closeHandler={closeDiscountModal}
        packageID={packageId}
        initialData={showDiscount}
      />
      <Toaster position="top-center" richColors />
      <main className="p-4 sm:p-6 lg:p-8 bg-gray-50/50">
        <header className="flex justify-between items-center font-bold mb-6">
          <span className="text-sm sm:text-2xl text-(--primaryFont)">
            Edit: {packageDetails?.name || "Package"}
          </span>
          <div className="flex items-center gap-2 font-medium text-sm">
            <NavLink
              className={"text-(--primaryFont)"}
              to={`/menu/${category}`}
              end
            >
              {category?.split("-")[0]}
            </NavLink>
            <ChevronRight size={20} className="text-(--secondaryFont)" />
            <NavLink to={``} className="text-(--primary)">
              Edit {packageDetails?.name}
            </NavLink>
          </div>
        </header>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* --- LEFT COLUMN: Image, Status, Discounts --- */}
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
                <div className="bg-white p-6 rounded-lg border-2 border-(--border-color) shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base text-(--primaryFont)">
                        Package Discounts
                      </FormLabel>
                      <FormDescription className="text-(--secondaryFont)">
                        Manage discounts for this package.
                      </FormDescription>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleOpenAddDiscount}
                      className="cursor-pointer"
                      disabled={packagesDiscounts?.length > 0}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" /> Add New
                    </Button>
                  </div>
                  <TableComponent
                    tableClass={"text-(--primaryFont)"}
                    tableBody={tableBody}
                    tableHeader={tableHeader}
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
                              className="text-(--secondaryFont) focus-visible:ring-(--primary)"
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
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value))
                              }
                              className="text-(--secondaryFont) focus-visible:ring-(--primary)"
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
                              className="text-(--secondaryFont) focus-visible:ring-(--primary)"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Section: Package Items */}
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
                    className="mt-4 text-(--primaryFont) hover:text-(--primaryFont)"
                    onClick={() =>
                      appendItem({ food_item_name: "", quantity: 1 })
                    }
                  >
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Item
                  </Button>
                </div>

                {/* Section: Optional Extras */}
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
                              <FormLabel className="sr-only">Name</FormLabel>
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
                              <FormLabel className="sr-only">
                                Price ($)
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="10"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(parseFloat(e.target.value))
                                  }
                                  className="text-(--secondaryFont) focus-visible:ring-(--primary)"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="md:col-span-1 self-end">
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => removeExtra(index)}
                            className="w-full"
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
                    className="mt-4 text-(--primaryFont) hover:text-(--primaryFont)"
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
                            className="text-(--secondaryFont) focus-visible:ring-(--primary)"
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
                            className="text-(--secondaryFont) overflow-hidden focus-visible:ring-(--primary)"
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
                            key={field.value}
                            value={field.value ? field.value.toString() : ""}
                            onValueChange={(val) =>
                              field.onChange(parseInt(val))
                            }
                          >
                            <FormControl>
                              <SelectTrigger className="text-(--secondaryFont) focus-visible:ring-(--primary)">
                                <SelectValue placeholder="Select a branch" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {mockBranches.map((b) => (
                                <SelectItem key={b.id} value={b.id.toString()}>
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
                            className="text-(--secondaryFont) focus-visible:ring-(--primary)"
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
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value))
                              }
                              className="text-(--secondaryFont) focus-visible:ring-(--primary)"
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
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value))
                              }
                              className="text-(--secondaryFont) focus-visible:ring-(--primary)"
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
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value))
                              }
                              className="text-(--secondaryFont) focus-visible:ring-(--primary)"
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
                              className="text-(--secondaryFont) focus-visible:ring-(--primary)"
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
                                onChange={(e) =>
                                  field.onChange(parseFloat(e.target.value))
                                }
                                className="text-(--secondaryFont) focus-visible:ring-(--primary)"
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
                              className="text-(--secondaryFont) focus-visible:ring-(--primary)"
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
                onClick={() => form.reset(packageDetails)}
                className="text-(--secondaryFont) hover:bg-gray-100 cursor-pointer"
              >
                <Undo2 className="mr-2 h-4 w-4" /> Reset Changes
              </Button>
              <LoadingButton
                isButton={true}
                type="submit"
                loadingText="Saving..."
                text="Save Changes"
                disabled={isUpdating}
                icon={<Save className="mr-2 h-4 w-4" />}
                btnClass={"cursor-pointer"}
              />
            </div>
          </form>
        </Form>
      </main>
    </div>
  );
};

export default EditFood;
