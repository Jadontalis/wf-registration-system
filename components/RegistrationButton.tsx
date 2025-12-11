'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { reserveSlot, joinWaitlist } from '@/lib/actions/registration';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Image from 'next/image';

interface RegistrationButtonProps {
  userId?: string;
}

const RegistrationButton = ({ userId }: RegistrationButtonProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isFull, setIsFull] = useState(false);

  const handleRegister = async () => {
    if (!userId) {
      router.push('/sign-in');
      return;
    }

    setLoading(true);
    try {
      const result = await reserveSlot(userId);
      if (result.success) {
        toast.success('Slot reserved! You have 10 minutes to register');
        router.push('/registration');
      } else if (result.reason === 'FULL') {
        setIsFull(true);
        toast.error(result.message);
      } else {
        toast.error(result.error || 'Something went wrong');
      }
    } catch (error) {
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
    } catch (error) {
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
          {loading ? 'Checking...' : (userId ? 'Register Now' : 'Sign In to Register')}
        </span>
      </div>
    </Button>
  );
};

export default RegistrationButton;
