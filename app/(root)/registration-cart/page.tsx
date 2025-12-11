import React from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { checkSlotStatus, joinWaitlist } from '@/lib/actions/registration';
import RegistrationTimer from '@/components/RegistrationTimer';
import TeamRegistrationForm from '@/components/TeamRegistrationForm';
import { db } from '@/database/drizzle';
import { usersTable, registrationSlotsTable } from '@/database/schema';
import { eq, and } from 'drizzle-orm';

const RegistrationCartPage = async () => {
  const session = await auth();
  if (!session?.user?.id) redirect('/sign-in');

  const userId = session.user.id;

  // Check for completed registration
  const completedSlot = await db.select().from(registrationSlotsTable).where(and(
    eq(registrationSlotsTable.userId, userId),
    eq(registrationSlotsTable.status, 'COMPLETED')
  )).limit(1);

  if (completedSlot.length > 0) {
    redirect('/account-settings');
  }
  
  const slotStatus = await checkSlotStatus(userId);

  if (slotStatus.status !== 'ACTIVE') {
    await joinWaitlist(userId);
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Slot Expired</h1>
        <p className="mb-4 text-white text-lg">Your slot has been given up and you are on the waitlist until a new slot opens.</p>
        <a href="/" className="text-blue-400 hover:underline">Return to Home</a>
      </div>
    );
  }

  const user = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
  const userRole = user[0]?.competitor_type || 'RIDER';

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <Link href="/">
          <Button variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-black cursor-pointer">
            Back to Home Page
          </Button>
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-6 text-white text-center">Complete Your Registration</h1>
      <RegistrationTimer expiresAt={slotStatus.expiresAt!} />
      
      <div className="mt-8">
        <TeamRegistrationForm userId={userId} userRole={userRole} />
      </div>
    </div>
  );
};

export default RegistrationCartPage;
