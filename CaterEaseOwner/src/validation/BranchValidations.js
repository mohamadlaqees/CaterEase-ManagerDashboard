import { z } from "zod";

export const branchSchema = z.object({
  description: z.string().min(3, "Branch name is required."),
  location_note: z.string().optional(),
  phone: z.string().min(10, "A valid phone number is required."),
  manager_name: z.string().optional(),
  restaurant_photo: z.string().optional(), // Can be a URL or base64 string
  categories: z.array(z.string().min(1, "Category cannot be empty.")),
  occasions: z.array(z.string().min(1, "Occasion cannot be empty.")),
  working_hours: z.array(
    z.object({
      day: z.string(),
      hours: z.string().min(1, "Hours are required."),
    })
  ),
  services: z.array(
    z.object({
      name: z.string().min(1, "Service name is required."),
      description: z.string().optional(),
      price: z.string().min(1, "Price is required."),
    })
  ),
  delivery_regions: z.array(
    z.object({
      name: z.string().min(1, "Region name is required."),
      description: z.string().optional(),
      price: z.string().min(1, "Price is required."),
    })
  ),
});
