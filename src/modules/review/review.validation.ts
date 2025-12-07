import z from "zod";

export const reviewInputZodSchema = z.object({
    bookingId: z.string().nonempty("Booking id is required"),
    rating: z.number().max(5, "Rate out of 5").min(0),
    comment: z.string().nonempty("Comment is required")
})