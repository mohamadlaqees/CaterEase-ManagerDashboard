import { z } from "zod";

export const couponSchema = z.object({
  code: z
    .string({ required_error: "Code is required !" })
    .min(5, { message: "Code must be 5 letters at least" }),
  amount: z.string({ required_error: "Amount is required !" }),
  endDate: z.date({
    required_error: "End Date is required!",
    invalid_type_error: "Please enter a valid date",
  }),
});
