import { z } from "zod";

const phoneSchema = z.string().regex(/^\d{10}$/, {
  message: "Phone number must be exactly 10 digits.",
});

// Schema for adding a new employee (profileImage removed)
export const deliveryEmpSchema = z.object({
  fullName: z.string().min(1, { message: "Full name is required." }),
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Invalid email address." }),
  phone: phoneSchema,
  gender: z.enum(["male", "female"], {
    required_error: "Please select a gender.",
  }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." }),
  status: z.enum(["active", "deleted"], {
    errorMap: () => ({ message: "Please select a status." }),
  }),
  vehicleType: z.string().min(1, { message: "Please select a vehicle type." }),
  isAvailable: z.boolean().default(true),
});

// Schema for editing an employee (profileImage removed)
export const editDeliveryEmpSchema = deliveryEmpSchema.extend({
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." })
    .optional()
    .or(z.literal("")),
});
