"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultValues, useForm, UseFormReturn, FieldValues, SubmitHandler, Path } from "react-hook-form";
import { z, ZodType } from "zod";
import Link from "next/link";

//Form design

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"


interface Props<T extends FieldValues> {
    schema: ZodType<T, any, any>;
    defaultValues: T;
    onSubmit: (data: T) => Promise<{success: boolean, error?: string}>
    type: "SIGN_IN" | "SIGN_UP";
}

const AuthForm = <T extends FieldValues>({ type, schema, defaultValues, onSubmit }: Props<T>) => 
{   
    const form: UseFormReturn<T> = useForm({
        resolver: zodResolver(schema),
        defaultValues: defaultValues as DefaultValues<T>,
    });

    const isSignIn = type === "SIGN_IN";

    return (
        <div className="flex flex-col gap-4 w-full">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full text-left">
                    {!isSignIn && (
                        <FormField
                            control={form.control}
                            name={"full_name" as Path<T>}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">Full Name</FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder="John Doe" 
                                            {...field} 
                                            className="bg-transparent border-white/20 text-white placeholder:text-white/50 focus:border-white focus:ring-white/20"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-400" />
                                </FormItem>
                            )}
                        />
                    )}

                    <FormField
                        control={form.control}
                        name={"email" as Path<T>}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">Email</FormLabel>
                                <FormControl>
                                    <Input 
                                        placeholder="m@example.com" 
                                        {...field} 
                                        className="bg-transparent border-white/20 text-white placeholder:text-white/50 focus:border-white focus:ring-white/20"
                                    />
                                </FormControl>
                                <FormMessage className="text-red-400" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name={"password" as Path<T>}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">Password</FormLabel>
                                <FormControl>
                                    <Input 
                                        type="password" 
                                        placeholder="********" 
                                        {...field} 
                                        className="bg-transparent border-white/20 text-white placeholder:text-white/50 focus:border-white focus:ring-white/20"
                                    />
                                </FormControl>
                                <FormMessage className="text-red-400" />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full bg-white text-black hover:bg-white/90 font-semibold">
                        {isSignIn ? "Sign In" : "Sign Up"}
                    </Button>
                </form>
            </Form>

            <p className="text-center text-sm text-white/60 mt-4">
                {isSignIn ? "New to Whitefish Skijoring? " : "Already have an account? "}
                <Link href={isSignIn ? "/sign-up" : "/sign-in"} className="font-semibold text-white hover:underline">
                    {isSignIn ? "Create an account" : "Sign in"}
                </Link>
            </p>
        </div>
    );
};

export default AuthForm