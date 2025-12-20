'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { finalizeRegistration } from '@/lib/actions/registration';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const SubmitForApprovalButton = ({ userId }: { userId: string }) => {
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const result = await finalizeRegistration(userId);
      if (result.success) {
        toast.success('Registration submitted for approval!');
        router.push('/');
      } else {
        toast.error(result.error || 'Failed to submit');
      }
    } catch {
      toast.error('An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Button 
      onClick={handleSubmit} 
      disabled={submitting}
      className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 text-lg cursor-pointer"
    >
      {submitting ? 'Submitting...' : 'Submit for Approval'}
    </Button>
  );
};

export default SubmitForApprovalButton;
