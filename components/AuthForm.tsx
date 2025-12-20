"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultValues, useForm, UseFormReturn, FieldValues, SubmitHandler, Path } from "react-hook-form";
import { ZodType } from "zod";
import Link from "next/link";
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner";
import { useRouter } from "next/navigation";

//Form design

import { Button } from "@/components/ui/button"
import { WAIVER_TEXT } from "@/constants";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

interface Props<T extends FieldValues> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: ZodType<T, any, any>;
    defaultValues: T;
    onSubmit: (data: T) => Promise<{success: boolean, error?: string}>
    type: "SIGN_IN" | "SIGN_UP";
}

const AuthForm = <T extends FieldValues>({ type, schema, defaultValues, onSubmit }: Props<T>) => 
{   
    //Router for sign in and sign up redirection

    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const form: UseFormReturn<T> = useForm({
        resolver: zodResolver(schema),
        defaultValues: defaultValues as DefaultValues<T>,
    });

    const isSignIn = type === "SIGN_IN";

    const handleSubmit: SubmitHandler<T> = async (data) => {
        const result = await onSubmit(data);

        if (result.success) {
            toast.success("Success! You are now logged in.", {
                description: isSignIn ? "Welcome back!" : "Your account has been created.",
            });

            router.push("/");

        } else {
            toast.error(`Error ${isSignIn ? "signing in" : "creating account"}`, {
                description: result.error || "Please check your credentials and try again.",
            })
        }
    }


    return (
        <div className="flex flex-col gap-4 w-full">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 w-full text-left">
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
                                        placeholder="john-doe@example.com" 
                                        {...field} 
                                        className="bg-transparent border-white/20 text-white placeholder:text-white/50 focus:border-white focus:ring-white/20"
                                    />
                                </FormControl>
                                <FormMessage className="text-red-400" />
                            </FormItem>
                        )}
                    />

                    {!isSignIn && (
                        <FormField
                            control={form.control}
                            name={"phone" as Path<T>}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">Phone Number</FormLabel>
                                    <FormControl>
                                        <Input 
                                            type="tel"
                                            autoComplete="tel"
                                            placeholder="(555) 555-5555" 
                                            {...field} 
                                            className="bg-transparent border-white/20 text-white placeholder:text-white/50 focus:border-white focus:ring-white/20"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-400" />
                                </FormItem>
                            )}
                        />
                    )}

                    {!isSignIn && (
                        <>
                            <FormField
                                control={form.control}
                                name={"address" as Path<T>}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-white">Address</FormLabel>
                                        <FormControl>
                                            <Input 
                                                placeholder="123 Main St" 
                                                {...field} 
                                                className="bg-transparent border-white/20 text-white placeholder:text-white/50 focus:border-white focus:ring-white/20"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-400" />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name={"city" as Path<T>}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-white">City</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    placeholder="City" 
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
                                    name={"state" as Path<T>}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-white">State</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    placeholder="State" 
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
                                    name={"zip" as Path<T>}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-white">Zip</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    placeholder="Zip" 
                                                    {...field} 
                                                    className="bg-transparent border-white/20 text-white placeholder:text-white/50 focus:border-white focus:ring-white/20"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-red-400" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </>
                    )}

                    <FormField
                        control={form.control}
                        name={"password" as Path<T>}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">{isSignIn ? "Password" : "Create Password"}</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input 
                                            type={showPassword ? "text" : "password"} 
                                            placeholder="********" 
                                            {...field} 
                                            onBlur={() => {
                                                field.onBlur();
                                                setShowPassword(false);
                                            }}
                                            className="bg-transparent border-white/20 text-white placeholder:text-white/50 focus:border-white focus:ring-white/20 pr-10"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-white/50 hover:text-white cursor-pointer"
                                            onClick={() => setShowPassword(!showPassword)}
                                            onMouseDown={(e) => e.preventDefault()}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                            <span className="sr-only">
                                                {showPassword ? "Hide password" : "Show password"}
                                            </span>
                                        </Button>
                                    </div>
                                </FormControl>
                                <FormMessage className="text-red-400" />
                            </FormItem>
                        )}
                    />

                    {!isSignIn && (
                        <FormField
                            control={form.control}
                            name={"confirm_password" as Path<T>}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">Retype Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input 
                                                type={showConfirmPassword ? "text" : "password"} 
                                                placeholder="********" 
                                                {...field} 
                                                onBlur={() => {
                                                    field.onBlur();
                                                    setShowConfirmPassword(false);
                                                }}
                                                className="bg-transparent border-white/20 text-white placeholder:text-white/50 focus:border-white focus:ring-white/20 pr-10"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-white/50 hover:text-white cursor-pointer"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                onMouseDown={(e) => e.preventDefault()}
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                                <span className="sr-only">
                                                    {showConfirmPassword ? "Hide password" : "Show password"}
                                                </span>
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-red-400" />
                                </FormItem>
                            )}
                        />
                    )}

                    {!isSignIn && (
                        <FormField
                            control={form.control}
                            name={"bios" as Path<T>}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">Create a Bio (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea 
                                            placeholder="Tell us more about how you got into skijoring and we'll give this to the announcer!" 
                                            {...field} 
                                            className="bg-transparent border-white/20 text-white placeholder:text-white/50 focus:border-white focus:ring-white/20 min-h-[100px]"
                                            maxLength={1000}
                                        />
                                    </FormControl>
                                    <FormDescription className="text-white/50 text-xs">
                                        Max 1000 characters
                                    </FormDescription>
                                    <FormMessage className="text-red-400" />
                                </FormItem>
                            )}
                        />
                    )}

                    {!isSignIn && (
                        <FormField
                            control={form.control}
                            name={"competitor_type" as Path<T>}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">I am a...</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="bg-transparent border-white/20 text-white focus:ring-white/20">
                                                <SelectValue placeholder="Select your role" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-black border-white/20 text-white">
                                            <SelectItem value="RIDER" className="focus:bg-white/10 focus:text-white">Rider</SelectItem>
                                            <SelectItem value="SKIER" className="focus:bg-white/10 focus:text-white">Skier</SelectItem>
                                            <SelectItem value="SNOWBOARDER" className="focus:bg-white/10 focus:text-white">Snowboarder</SelectItem>
                                            <SelectItem value="SKIER_AND_SNOWBOARDER" className="focus:bg-white/10 focus:text-white">Both (Skier & Snowboarder)</SelectItem>
                                            <SelectItem value="RIDER_SKIER_SNOWBOARDER" className="focus:bg-white/10 focus:text-white">Both (Rider & Skier/Snowboarder)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="text-red-400" />
                                </FormItem>
                            )}
                        />
                    )}

                    {!isSignIn && (
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name={"rules_signed" as Path<T>}
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-white/20 p-4">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                className="border-white/50 data-[state=checked]:bg-white data-[state=checked]:text-black cursor-pointer"
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel className="text-white cursor-pointer">
                                                I agree to the Whitefish Skijoring Rules & Regulations
                                            </FormLabel>
                                            <FormDescription className="text-white/50">
                                                You must agree with the above to create an account. To read rules and regulations <Link href="/wfs-rules" className="underline hover:text-white">click here</Link>.
                                            </FormDescription>
                                        </div>
                                        <FormMessage className="text-red-400" />
                                    </FormItem>
                                )}
                            />
                            <p className="text-sm text-white/70 text-center">
                                <strong className="text-white">COMPETITOR Whitefish Skijoring, Whitefish MT WAIVER AND RELEASE FORM</strong>
                                <br />
                                Please read entire form carefully before signing.
                            </p>
                            <div className="h-64 overflow-y-auto border border-white/20 p-4 rounded bg-white text-base whitespace-pre-wrap text-black">
                                {WAIVER_TEXT}
                            </div>
                            <FormField
                                control={form.control}
                                name={"waiver_signed" as Path<T>}
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                className="border-white/50 data-[state=checked]:bg-white data-[state=checked]:text-black cursor-pointer"
                                            />
                                        </FormControl>
                                        <FormLabel className="font-bold text-white cursor-pointer">
                                            I agree to all of the above *
                                        </FormLabel>
                                        <FormMessage className="text-red-400" />
                                    </FormItem>
                                )}
                            />
                        </div>
                    )}

                    <Button type="submit" className="w-full bg-white text-black hover:bg-white/90 font-semibold cursor-pointer">
                        {isSignIn ? "Sign In" : "Create Account"}
                    </Button>
                </form>
            </Form>

            <p className="text-center text-sm text-white/60 mt-4">
                {isSignIn ? "New to Whitefish Skijoring? " : "Already have an account? "}
                <Link href={isSignIn ? "/create-account" : "/sign-in"} className="font-semibold text-white hover:underline">
                    {isSignIn ? "Create an account" : "Sign in"}
                </Link>
            </p>
        </div>
    );
};

export default AuthForm