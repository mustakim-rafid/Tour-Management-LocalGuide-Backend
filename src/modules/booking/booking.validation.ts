import z from "zod";

export const bookingInputZodSchema = z.object({
    tourId: z.uuid("Invalid tour id.")
})