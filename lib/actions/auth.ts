"use server";

import { db } from "@/database/drizzle";
import { usersTable } from "@/database/schema";
import { eq } from "drizzle-orm";
import { signIn, signOut } from "@/auth";
import { hash } from "bcryptjs";
import { AuthError } from "next-auth";
import { headers } from "next/headers";
import { Ratelimit } from "@upstash/ratelimit";
import redis from "@/database/redis";
import config from "@/lib/config";
import { signupSchema, signinSchema } from "@/lib/validations";

export const signInWithCredentials = async (params: Pick<authCredentials, 'email' | 'password'>) => {
    const { email, password } = params;

    const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
    
    const ratelimit = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, "1 m"),
        analytics: true,
    });

    const { success } = await ratelimit.limit(ip);

    if (!success) {
        return { success: false, error: "Too many requests" };
    }

    try {
        const validatedData = signinSchema.parse({ email, password });
        await signIn("credentials", { email: validatedData.email, password: validatedData.password, redirect: false });

        return { success: true };
        
    } catch (error) {
        console.log("Error during sign in:", error);
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { success: false, error: "Invalid credentials" };
                default:
                    return { success: false, error: "Something went wrong" };
            }
        }
        throw error;
    }
}

export const signUp = async (params: authCredentials) => {
    const validatedData = signupSchema.parse(params);
    const {full_name, email: rawEmail, phone, address, city, state, zip, password, bios, waiver_signed, competitor_type} = validatedData;
    const email = rawEmail.toLowerCase();
    const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
    
    const ratelimit = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, "1 m"),
        analytics: true,
    });

    const { success } = await ratelimit.limit(ip);

    if (!success) {
        return { success: false, error: "Too many requests" };
    }

    let existingUser;
    try {
        existingUser = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    } catch (error) {
        console.error("Database error checking existing user:", error);
        return { success: false, error: "Database error" };
    }

    if (existingUser.length > 0) {
        return { success: false, error: "User with this email already exists" };
    }

    // Hash password
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await db.insert(usersTable).values({
            full_name,
            email,
            phone,
            address,
            city,
            state,
            zip,
            password: hashedPassword,
            bios: bios || '',
            waiver_signed,
            waiver_signed_at: waiver_signed ? new Date() : null,
            competitor_type,
        });

       await signInWithCredentials({ email, password });
        return { success: true };
    } catch (error: any) {
        console.log("Error during user sign up:", error);
        if (error.code === '23505') { // Unique constraint violation
            return { success: false, error: "User with this email already exists" };
        }
        return { success: false, error: "Error during sign up" };
    }

}

export const signOutUser = async () => {
    await signOut();
}