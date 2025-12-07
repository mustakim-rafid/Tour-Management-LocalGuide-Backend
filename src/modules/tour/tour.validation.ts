import z from "zod";

export const tourInputZodSchema = z.object({
  title: z.string().nonempty("Title is required"),
  description: z.string().nonempty("Description is required"),
  tourFee: z.number().int().nonnegative("Tour fee must be a positive integer"),
  duration: z.string().nonempty("Duration is required"),
  meetingPoint: z.string().nonempty("Meeting point is required"),
  maxGroupSize: z
    .number()
    .int()
    .positive("Max group size must be greater than 0"),
  tourDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .refine(
      (val) => {
        const [year, month, day] = val.split("-").map(Number);
        return month >= 1 && month <= 12 && day >= 1 && day <= 31;
      },
      {
        message: "Invalid day or month value",
      }
    ),
});

export const tourUpdateZodSchema = z.object({
  title: z.string().nonempty("Title is required").optional(),
  description: z.string().nonempty("Description is required").optional(),
  tourFee: z
    .number()
    .int()
    .nonnegative("Tour fee must be a positive integer")
    .optional(),
  duration: z.string().nonempty("Duration is required").optional(),
  meetingPoint: z.string().nonempty("Meeting point is required").optional(),
  maxGroupSize: z
    .number()
    .int()
    .positive("Max group size must be greater than 0")
    .optional(),
  tourDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (yyyy-mm-dd)")
    .refine(
      (val) => {
        const date = new Date(val);
        return (
          !isNaN(date.getTime()) && val === date.toISOString().split("T")[0]
        );
      },
      { message: "Invalid date" }
    )
    .optional(),
});
