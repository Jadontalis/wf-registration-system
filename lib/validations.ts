import { z } from 'zod';

export const signupSchema = z.object({
    full_name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number"),
    address: z.string().min(5, "Address is required"),
    hometown: z.string().optional(),
    bios: z.string().max(1000, "Bio must be less than 1000 characters").optional().or(z.literal('')),
    password: z.string().min(8, "Password must be at least 8 characters"),
    waiver_signed: z.boolean().refine(val => val === true, "You must sign the waiver to continue"),
    competitor_type: z.enum(["RIDER", "SKIER", "SNOWBOARDER", "BOTH"]),
});

export const signinSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

export const accountUpdateSchema = z.object({
    full_name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number"),
    address: z.string().min(5, "Address is required"),
    hometown: z.string().optional(),
    bios: z.string().max(1000, "Bio must be less than 1000 characters").optional().or(z.literal('')),
    competitor_type: z.enum(["RIDER", "SKIER", "SNOWBOARDER", "BOTH"]),
});