import { z } from "zod";

export const resonSchema = z.object({
  rejection_reason: z
    .string()
    .min(1, { message: "Reason filed can't be empty" }),
});
