'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { accountUpdateSchema } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { updateAccountDetails } from '@/lib/actions/user';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface AccountSettingsFormProps {
  userId: string;
  initialData: {
    full_name: string;
    email: string;
    phone: string;
    bios: string;
    competitor_type: 'RIDER' | 'SKIER' | 'SNOWBOARDER' | 'BOTH';
  };
}

const AccountSettingsForm = ({ userId, initialData }: AccountSettingsFormProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof accountUpdateSchema>>({
    resolver: zodResolver(accountUpdateSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (values: z.infer<typeof accountUpdateSchema>) => {
    setIsSubmitting(true);
    try {
      const result = await updateAccountDetails(userId, values);
      if (result.success) {
        toast.success('Account details updated successfully');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to update account details');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full max-w-2xl">
        <FormField
          control={form.control}
          name="full_name"
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

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Email</FormLabel>
              <FormControl>
                <Input 
                  placeholder="john@example.com" 
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
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Phone Number</FormLabel>
              <FormControl>
                <Input 
                  placeholder="(555) 555-5555" 
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
          name="competitor_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Competitor Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-transparent border-white/20 text-white focus:border-white focus:ring-white/20">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-zinc-900 border-white/20 text-white">
                  <SelectItem value="RIDER" className="focus:bg-white/10 focus:text-white cursor-pointer">Rider</SelectItem>
                  <SelectItem value="SKIER" className="focus:bg-white/10 focus:text-white cursor-pointer">Skier</SelectItem>
                  <SelectItem value="SNOWBOARDER" className="focus:bg-white/10 focus:text-white cursor-pointer">Snowboarder</SelectItem>
                  <SelectItem value="BOTH" className="focus:bg-white/10 focus:text-white cursor-pointer">Both (Skier & Snowboarder)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bios"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Bio</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Tell us about yourself..." 
                  {...field} 
                  className="bg-transparent border-white/20 text-white placeholder:text-white/50 focus:border-white focus:ring-white/20 min-h-[100px]"
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-white text-black hover:bg-gray-200 font-semibold cursor-pointer"
        >
          {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
        </Button>
      </form>
    </Form>
  );
};

export default AccountSettingsForm;
