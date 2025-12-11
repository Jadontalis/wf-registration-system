'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const RegistrationTimer = ({ expiresAt }: { expiresAt: Date }) => {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = new Date(expiresAt).getTime() - now.getTime();

      if (diff <= 0) {
        clearInterval(interval);
        setTimeLeft('EXPIRED');
        router.push('/'); // Redirect to home if expired
        return;
      }

      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, router]);

  return (
    <div className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg font-bold text-sm inline-block">
      Time Remaining: {timeLeft}
    </div>
  );
};

export default RegistrationTimer;
