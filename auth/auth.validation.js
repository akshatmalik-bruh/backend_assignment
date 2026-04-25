import { z } from "zod";

export const signUpSchema = z.object({
    name: z.string().min(2),
    email: z.email(),
    password: z.string().min(6),
    role: z.enum(["principal", "teacher"])
});

export const signInSchema = z.object({
    email: z.email(),
    password: z.string().min(6)
});