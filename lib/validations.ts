import { z } from 'zod';

export const signupSchema = z.object({
    full_name: z.string().min(3),
    email: z.string(),
    password: z.string().min(8),
});

export const signinSchema = z.object({
    email: z.string(),
    password: z.string().min(8),
});