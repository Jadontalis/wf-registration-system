import React from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { checkSlotStatus, joinWaitlist } from '@/lib/actions/registration';
import TeamRegistrationForm from '@/components/TeamRegistrationForm';
import { db } from '@/database/drizzle';
import { usersTable, registrationSlotsTable, registrationCartTable, teamsTable } from '@/database/schema';
import { eq, and } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';

const PreRegistrationPage = async () => {
  const session = await auth();
  if (!session?.user?.id) redirect('/sign-in');

  // Access Control: Only INVITEE or ADMIN
  if (session.user.role !== 'INVITEE' && session.user.role !== 'ADMIN') {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
            <h1 className="text-2xl font-bold mb-4 text-red-500">Unauthorized</h1>
            <p className="mb-4 text-white text-lg">You do not have permission to access this page.</p>
            <Link href="/">
            <Button className="bg-white text-black hover:bg-white/90 cursor-pointer">Return to Home</Button>
            </Link>
        </div>
    );
  }

  const userId = session.user.id;

  // Check for submitted cart
  const submittedCart = await db.select().from(registrationCartTable).where(and(
    eq(registrationCartTable.userId, userId),
    eq(registrationCartTable.status, 'SUBMITTED')
  )).limit(1);

  if (submittedCart.length > 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
        <h1 className="text-2xl font-bold mb-4 text-white">Registration Submitted</h1>
        <p className="mb-4 text-white text-lg">You have already submitted your registration for approval.</p>
        <p className="mb-8 text-white/70">You can edit your submission from the homepage.</p>
        <Link href="/">
          <Button className="bg-white text-black hover:bg-white/90 cursor-pointer">Return to Home</Button>
        </Link>
      </div>
    );
  }

  // Check for pending cart to populate form
  const pendingCart = await db.select().from(registrationCartTable).where(and(
    eq(registrationCartTable.userId, userId),
    eq(registrationCartTable.status, 'PENDING')
  )).limit(1);

  let initialTeams = undefined;

  if (pendingCart.length > 0) {
    const cartId = pendingCart[0].id;
    const rider = alias(usersTable, "rider");
    const skier = alias(usersTable, "skier");

    const dbTeams = await db.select({
        id: teamsTable.id,
        riderId: teamsTable.riderId,
        skierId: teamsTable.skierId,
        horseName: teamsTable.horseName,
        horseOwner: teamsTable.horseOwner,
        division: teamsTable.division,
        riderName: rider.full_name,
        skierName: skier.full_name,
    })
    .from(teamsTable)
    .leftJoin(rider, eq(teamsTable.riderId, rider.id))
    .leftJoin(skier, eq(teamsTable.skierId, skier.id))
    .where(eq(teamsTable.cartId, cartId));

    if (dbTeams.length > 0) {
        initialTeams = dbTeams.map((t, index) => {
            let selectedRole: 'RIDER' | 'SKIER' | 'SNOWBOARDER' | undefined = undefined;
            let partnerId = '';
            let partnerName = '';

            if (t.riderId === userId) {
                selectedRole = 'RIDER';
                partnerId = t.skierId;
                partnerName = t.skierName || '';
            } else {
                if (t.division === 'SNOWBOARD') {
                    selectedRole = 'SNOWBOARDER';
                } else {
                    selectedRole = 'SKIER';
                }
                partnerId = t.riderId;
                partnerName = t.riderName || '';
            }

            return {
                id: Date.now() + index,
                partnerId,
                partnerName,
                horseName: t.horseName || '',
                horseOwner: t.horseOwner || '',
                selectedRole,
                division: t.division as any,
            };
        });
    }
  }

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
        <Link href="/" className="text-blue-400 hover:underline">Return to Home</Link>
      </div>
    );
  }

  const user = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
  const userRole = user[0]?.competitor_type || 'RIDER';

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-2 p-9 max-w-3xl mx-auto text-white relative">

      <div className="w-full flex justify-between items-center mb-6">
        <Link href="/">
          <Button variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-black cursor-pointer">
            Back to Homepage
          </Button>
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-2 mt-0 py-3 text-white text-center">2026 Whitefish Skijoring Pre-Registration Request</h1>
      
      <div className="w-full">
        <TeamRegistrationForm 
          userId={userId} 
          userRole={userRole as any} 
          initialTeams={initialTeams}
        />
      </div>
    </div>
  );
};

export default PreRegistrationPage;
