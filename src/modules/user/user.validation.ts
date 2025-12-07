import z from "zod";

export const adminInputZodSchema = z.object({
  password: z
    .string()
    .nonempty("Password is required")
    .min(6, "Password must be at least 6 characters long"),
  admin: z.object({
    email: z.email("Invalid email").nonempty("Email is required"),
    name: z.string().nonempty("Name is required"),
    address: z.string().optional(),
    contactNumber: z.string().optional(),
  }),
});

export const guideInputZodSchema = z.object({
  password: z
    .string()
    .nonempty("Password is required")
    .min(6, "Password must be at least 6 characters long"),
  guide: z.object({
    email: z.email("Invalid email").nonempty("Email is required"),
    name: z.string().nonempty("Name is required"),
    bio: z.string().optional(),
    address: z.string().optional(),
    contactNumber: z.string().optional(),
    experienceYears: z.number().optional(),
  }),
});

export const touristInputZodSchema = z.object({
  password: z
    .string()
    .nonempty("Password is required")
    .min(6, "Password must be at least 6 characters long"),
  tourist: z.object({
    email: z.email("Invalid email").nonempty("Email is required"),
    name: z.string().nonempty("Name is required"),
    address: z.string().optional(),
    contactNumber: z.string().optional(),
  }),
});
