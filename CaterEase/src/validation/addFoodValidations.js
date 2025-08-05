import { z } from "zod";

export const addPackageSchema = z
  .object({
    // --- Fields from your new schema ---
    name: z.string().min(3, "Package name must be at least 3 characters long."),
    description: z.string().min(10, "Description is required."),
    photo: z.string().min(1, "A valid image is required."), // Changed from .url() to .min(1) as Base64 is not a standard URL.

    branch_id: z.number({ required_error: "Branch is required." }),
    branch_service_type_ids: z
      .array(z.number())
      .min(1, "At least one service is required."),
    category_ids: z
      .array(z.number())
      .min(1, "At least one category is required."),
    occasion_type_ids: z
      .array(z.number())
      .min(1, "At least one occasion is required."),

    base_price: z.coerce
      .number()
      .positive("Base price must be a positive number."),
    serves_count: z.coerce
      .number()
      .int()
      .positive("Serves count must be a positive integer."),

    max_extra_persons: z.coerce
      .number()
      .int()
      .nonnegative("Cannot be negative."),
    price_per_extra_person: z.coerce
      .number()
      .nonnegative("Cannot be negative."),

    cancellation_policy: z.string().min(1, "Cancellation policy is required."),
    prepayment_required: z.boolean().default(false),
    prepayment_amount: z.coerce.number().nonnegative().optional(),

    is_active: z.boolean().default(true),
    notes: z.string().optional(),

    items: z
      .array(
        z.object({
          food_item_name: z
            .string()
            .min(1, { message: "Item name cannot be empty." }),
          quantity: z
            .number()
            .min(1, { message: "Item name cannot be empty." })
            .optional(),
          is_optional: z.boolean().default(false).optional(),
        })
      )
      .min(1, { message: "At least one package item is required." }),

    extras: z
      .array(
        z.object({
          name: z.string().min(1, { message: "Extra name cannot be empty." }),
          price: z.coerce
            .number()
            .nonnegative({ message: "Price cannot be negative." }),
        })
      )
      .optional(),
  })
  .refine(
    (data) => {
      // If prepayment is required, the amount must be provided and positive
      if (
        data.prepayment_required &&
        (data.prepayment_amount === undefined || data.prepayment_amount <= 0)
      ) {
        return false;
      }
      return true;
    },
    {
      message:
        "Prepayment amount is required and must be positive when enabled.",
      path: ["prepayment_amount"], // Path to show the error message on
    }
  );

export const discountSchema = z.object({
  value: z
    .string()
    .min(1, "Value is required.")
    .transform((val) => parseFloat(val))
    .refine(
      (val) => !isNaN(val) && val >= 0,
      "Value must be a non-negative number."
    ),
  description: z.string().min(1, "Description is required!"),
  startDate: z.date({
    required_error: "Start Date is required!",
    invalid_type_error: "Please enter a valid date",
  }),
  endDate: z.date({
    required_error: "End Date is required!",
    invalid_type_error: "Please enter a valid date",
  }),
});

export const editPackageSchema = z
  .object({
    name: z.string().min(3, "Package name must be at least 3 characters long."),
    description: z.string().min(10, "Description is required."),
    photo: z.string().optional(),
    branch_id: z.number({ required_error: "Branch is required." }),
    branch_service_type_ids: z
      .array(z.number())
      .min(1, "At least one service is required."),
    category_ids: z
      .array(z.number())
      .min(1, "At least one category is required."),
    occasion_type_ids: z
      .array(z.number())
      .min(1, "At least one occasion is required."),
    base_price: z.coerce
      .number()
      .positive("Base price must be a positive number."),
    serves_count: z.coerce
      .number()
      .int()
      .positive("Serves count must be a positive integer."),
    max_extra_persons: z.coerce
      .number()
      .int()
      .nonnegative("Cannot be negative."),
    price_per_extra_person: z.coerce
      .number()
      .nonnegative("Cannot be negative."),
    cancellation_policy: z.string().min(1, "Cancellation policy is required."),
    prepayment_required: z.boolean().default(false),
    prepayment_amount: z.coerce.number().nonnegative().optional(),
    is_active: z.boolean().default(true),
    notes: z.string().optional(),
    items: z
      .array(
        z.object({
          food_item_name: z
            .string()
            .min(1, { message: "Item name cannot be empty." }),
          quantity: z
            .number()
            .min(1, { message: "Item name cannot be empty." })
            .optional(),
          is_optional: z.boolean().default(false).optional(),
        })
      )
      .optional(),

    extras: z
      .array(
        z.object({
          name: z.string().min(1, { message: "Extra name cannot be empty." }),
          price: z.coerce
            .number()
            .nonnegative({ message: "Price cannot be negative." }),
        })
      )
      .optional(),
  })
  .refine(
    (data) => {
      if (
        data.prepayment_required &&
        (data.prepayment_amount === undefined || data.prepayment_amount <= 0)
      ) {
        return false;
      }
      return true;
    },
    {
      message:
        "Prepayment amount is required and must be positive when enabled.",
      path: ["prepayment_amount"], // Path to show the error message on
    }
  );
