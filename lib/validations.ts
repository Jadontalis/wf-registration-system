import { z } from 'zod';

export const signupSchema = z.object({
    full_name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Please enter a valid email address"),
    bios: z.string().min(3, "Bio must be at least 3 characters"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signinSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});