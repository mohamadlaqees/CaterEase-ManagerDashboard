import { z } from "zod";

export const resonSchema = z.object({
  rejection_reason: z
    .string()
    .min(1, { message: "Reason filed can't be empty" }),
});

export const paySchema = z
  .object({
    // Define both fields at the same level
    paymentType: z.enum(["partial", "full"]),
    amount: z.coerce.number().optional(), // Amount is optional at the base level
  })
  .refine(
    (data) => {
      // If paymentType is 'partial', then 'amount' must be a valid number
      if (data.paymentType === "partial") {
        // Ensure amount is not undefined/null and meets your minimum criteria
        return data.amount != null && data.amount >= 0.01;
      }
      // If paymentType is 'full', this validation check passes automatically
      return true;
    },
    {
      // This error message will be displayed by the <FormMessage /> for the 'amount' field
      message: "A valid amount is required for a partial payment.",
      path: ["amount"], // Attach the error specifically to the 'amount' field
    }
  );
