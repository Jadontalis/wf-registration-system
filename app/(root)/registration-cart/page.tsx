import React from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { checkSlotStatus } from '@/lib/actions/registration';
import { db } from '@/database/drizzle';
import { registrationCartTable, teamsTable, registrationSlotsTable, usersTable } from '@/database/schema';
import { eq, and, desc } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import SubmitForApprovalButton from '@/components/SubmitForApprovalButton';

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
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Slot Expired</h1>
        <p className="mb-4 text-white text-lg">Your slot has been given up.</p>
        <Link href="/" className="text-blue-400 hover:underline">Return to Home</Link>
      </div>
    );
  }

  // Fetch latest pending cart
  const cart = await db.select()
    .from(registrationCartTable)
    .where(and(
      eq(registrationCartTable.userId, userId),
      eq(registrationCartTable.status, 'PENDING')
    ))
    .orderBy(desc(registrationCartTable.createdAt))
    .limit(1);

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Your Cart is Empty</h1>
        <Link href="/registration">
          <Button className="bg-white text-black hover:bg-white/90 cursor-pointer">Go to Registration</Button>
        </Link>
      </div>
    );
  }

  const currentCart = cart[0];
  
  const rider = alias(usersTable, "rider");
  const skier = alias(usersTable, "skier");

  const teams = await db.select({
    id: teamsTable.id,
    teamNumber: teamsTable.teamNumber,
    horseName: teamsTable.horseName,
    horseOwner: teamsTable.horseOwner,
    riderName: rider.full_name,
    skierName: skier.full_name,
  })
  .from(teamsTable)
  .leftJoin(rider, eq(teamsTable.riderId, rider.id))
  .leftJoin(skier, eq(teamsTable.skierId, skier.id))
  .where(eq(teamsTable.cartId, currentCart.id));

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <Link href="/registration">
          <Button variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-black cursor-pointer">
            Back to Registration
          </Button>
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6 text-white text-center">Registration Cart Summary</h1>
      
      <div className="bg-white/5 border border-white/20 rounded-lg p-6 backdrop-blur-sm mb-6">
        <h2 className="text-xl font-bold text-white mb-4">Teams</h2>
        {teams.length === 0 ? (
          <p className="text-white/70">No teams added.</p>
        ) : (
          <div className="space-y-4">
            {teams.map((team, index) => (
              <div key={team.id} className="p-4 border border-white/10 rounded bg-white/5">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-white">Team {index + 1}</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-white/80">
                  <div><span className="text-white/50">Rider:</span> {team.riderName}</div>
                  <div><span className="text-white/50">Skier/Boarder:</span> {team.skierName}</div>
                  <div><span className="text-white/50">Horse:</span> {team.horseName || 'N/A'}</div>
                  <div><span className="text-white/50">Owner:</span> {team.horseOwner || 'N/A'}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <SubmitForApprovalButton userId={userId} />
      </div>
    </div>
  );
};

export default RegistrationCartPage;
