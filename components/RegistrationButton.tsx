'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { reserveSlot, joinWaitlist, reopenRegistration } from '@/lib/actions/registration';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Image from 'next/image';

interface RegistrationButtonProps {
  userId?: string;
  hasSubmittedCart?: boolean;
}

const RegistrationButton = ({ userId, hasSubmittedCart }: RegistrationButtonProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isFull, setIsFull] = useState(false);

  const handleEditRegistration = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const result = await reopenRegistration(userId);
      if (result.success) {
        toast.success('Registration reopened for editing.');
        router.push('/registration-cart');
      } else {
        toast.error(result.error || 'Failed to reopen registration');
      }
    } catch {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!userId) {
      router.push('/sign-in');
      return;
    }

    if (hasSubmittedCart) {
      handleEditRegistration();
      return;
    }

    setLoading(true);
    try {
      const result = await reserveSlot(userId);
      if (result.success) {
        toast.success('Your registration has opened.');
        router.push('/registration');
      } else {
        // @ts-ignore
        if (result.reason === 'FULL') {
             setIsFull(true);
             // @ts-ignore
             toast.error(result.message);
        } else {
             // @ts-ignore
             toast.error(result.error || 'Something went wrong');
        }
      }
    } catch {
      toast.error('Failed to begin registration');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinWaitlist = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const result = await joinWaitlist(userId);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error('Error:Failed to join waitlist');
    } finally {
      setLoading(false);
    }
  };

  if (isFull) {
    return (
      <div className="flex flex-col items-center gap-2 mt-4">
        <p className="text-red-500 font-bold">Registration slots are currently full. Please check back to see if an available slot opens up.</p>
        <Button 
          onClick={handleJoinWaitlist} 
          disabled={loading} 
          variant="secondary" 
          className="w-full md:w-64 cursor-pointer"
        >
          {loading ? 'Joining...' : 'Join Waitlist'}
        </Button>
      </div>
    );
  }

  return (
    <Button 
      onClick={handleRegister} 
      disabled={loading} 
      className="mt-4 w-1/2 md:w-64 bg-transparent border border-white/20 hover:border-white/50 text-white font-semibold text-lg py-6 px-8 shadow-lg hover:shadow-xl cursor-pointer"
    >
      <div className="flex items-center justify-center gap-2">
        <Image src="/icons/logo.png" alt="Logo" width={24} height={24} />
        <span>
          {loading ? 'Processing...' : (userId ? (hasSubmittedCart ? 'Edit Registration' : 'Register Now') : 'Sign In to Register')}
        </span>
      </div>
    </Button>
  );
};

export default RegistrationButton;
