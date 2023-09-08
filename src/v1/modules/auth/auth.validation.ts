import { z } from "zod";

export const userLoginSchema = {
  body: z.object({
    email: z.string().email("Invalid email format").nonempty("email is required"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
  }),
};

export const userSignupSchema = {
  body: z.object({
    fullname: z.string().min(22, "fullname must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    phoneNumber: z.string(),
    dob: z.date(),
    sex: z.string(),
  }),
};
