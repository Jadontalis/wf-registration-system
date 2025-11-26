"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultValues, useForm, UseFormReturn, FieldValues, SubmitHandler, Path } from "react-hook-form";
import { z, ZodType } from "zod";

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
    onSubmit: (data: T) => Promise<{sucess: boolean, error?: string}>
    type: "SIGN_IN" | "SIGN_UP";
}

const AuthForm = <T extends FieldValues>({ type, schema, defaultValues, onSubmit }: Props<T>) => 
{   
    const form: UseFormReturn<T> = useForm({
        resolver: zodResolver(schema),
        defaultValues: defaultValues as DefaultValues<T>,
    });

    const handSubmit: SubmitHandler<T> = async (data) => {};

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name={"username" as Path<T>}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="shadcn" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is your public display name.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </div>
    );
};

export default AuthForm