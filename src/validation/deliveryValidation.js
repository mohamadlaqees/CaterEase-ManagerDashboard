import { z } from "zod";

// Schema for adding a new employee (profileImage removed)
export const deliveryEmpSchema = z.object({
  fullName: z.string().min(1, { message: "Full name is required." }),
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Invalid email address." }),
  phone: z
    .string()
    .min(1, { message: "Phone number is required." })
    .max(10, { message: "Phone number must be 10 digits." }),
  gender: z.enum(["male", "female"], {
    required_error: "Please select a gender.",
  }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." }),
  vehicleType: z.string().min(1, { message: "Please select a vehicle type." }),
  isAvailable: z.boolean().default(true),
});

// Schema for editing an employee (profileImage removed)
export const editDeliveryEmpSchema = z
  .object({
    fullName: z.string().min(1, { message: "Full name is required." }),
    email: z
      .string()
      .min(1, { message: "Email is required." })
      .email({ message: "Invalid email address." }),
    phone: z
      .string()
      .min(1, { message: "Phone number is required." })
      .max(10, { message: "Phone number must be 10 digits." }),
    gender: z.enum(["male", "female"], {
      required_error: "Please select a gender.",
    }),
    password: z.string().optional(),
    vehicleType: z
      .string()
      .min(1, { message: "Please select a vehicle type." }),
  })
  .refine(
    (data) =>
      !data.password || data.password.length === 0 || data.password.length >= 8,
    {
      message: "Password must be at least 8 characters long.",
      path: ["password"],
    }
  );
