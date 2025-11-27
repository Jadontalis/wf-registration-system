"use server";

import { db } from "@/database/drizzle";
import { usersTable } from "@/database/schema";
import { eq } from "drizzle-orm";
import { signIn, signOut } from "@/auth";
import { hash } from "bcryptjs";
import { AuthError } from "next-auth";

export const signInWithCredentials = async (params: Pick<authCredentials, 'email' | 'password'>) => {
    const { email, password } = params;

    try {
        await signIn("credentials", { email, password, redirect: false });

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
    const {full_name, email, password, bios} = params;

    const existingUser = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);

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
            password: hashedPassword,
            bios,
        });

       await signInWithCredentials({ email, password });
        return { success: true };
    } catch (error) {
        console.log("Error during user sign up:", error);
        return { success: false, error: "Error during sign up" };
    }

}

export const signOutUser = async () => {
    await signOut();
}