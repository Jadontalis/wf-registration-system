'use server';

import { db } from '@/database/drizzle';
import { registrationSlotsTable, waitlistTable, teamsTable, registrationCartTable, usersTable } from '@/database/schema';
import { eq, and, gt, count, desc } from 'drizzle-orm';

const MAX_SLOTS = 50; // Configurable
const SLOT_DURATION_MINUTES = 10;

export async function reserveSlot(userId: string) {
  try {
    // 1. Check if user already has an active slot
    const existingSlot = await db
      .select()
      .from(registrationSlotsTable)
      .where(
        and(
          eq(registrationSlotsTable.userId, userId),
          eq(registrationSlotsTable.status, 'RESERVED'),
          gt(registrationSlotsTable.expiresAt, new Date())
        )
      )
      .limit(1);

    if (existingSlot.length > 0) {
      return { success: true, slot: existingSlot[0], message: 'Existing slot found' };
    }

    // 2. Check total active slots
    const activeSlotsCount = await db
      .select({ count: count() })
      .from(registrationSlotsTable)
      .where(
        and(
          eq(registrationSlotsTable.status, 'RESERVED'),
          gt(registrationSlotsTable.expiresAt, new Date())
        )
      );

    if (activeSlotsCount[0].count >= MAX_SLOTS) {
      return { success: false, reason: 'FULL', message: 'Registration slots are full' };
    }

    // 3. Create new slot
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + SLOT_DURATION_MINUTES);

    const newSlot = await db
      .insert(registrationSlotsTable)
      .values({
        userId,
        expiresAt,
        status: 'RESERVED',
      })
      .returning();

    return { success: true, slot: newSlot[0] };
  } catch (error) {
    console.error('Error reserving slot:', error);
    return { success: false, error: 'Failed to reserve slot' };
  }
}

export async function joinWaitlist(userId: string) {
  try {
    // Check if already on waitlist
    const existingEntry = await db
      .select()
      .from(waitlistTable)
      .where(
        and(
          eq(waitlistTable.userId, userId),
          eq(waitlistTable.status, 'PENDING')
        )
      )
      .limit(1);

    if (existingEntry.length > 0) {
      return { success: true, message: 'Already on waitlist' };
    }

    await db.insert(waitlistTable).values({
      userId,
      status: 'PENDING',
    });

    return { success: true, message: 'Joined waitlist' };
  } catch (error) {
    console.error('Error joining waitlist:', error);
    return { success: false, error: 'Failed to join waitlist' };
  }
}

export async function checkSlotStatus(userId: string) {
  try {
    const slot = await db
      .select()
      .from(registrationSlotsTable)
      .where(
        and(
          eq(registrationSlotsTable.userId, userId),
          eq(registrationSlotsTable.status, 'RESERVED')
        )
      )
      .orderBy(desc(registrationSlotsTable.createdAt))
      .limit(1);

    if (slot.length === 0) return { status: 'NONE' };

    const currentSlot = slot[0];
    if (new Date() > currentSlot.expiresAt) {
      // Expire it
      await db
        .update(registrationSlotsTable)
        .set({ status: 'EXPIRED' })
        .where(eq(registrationSlotsTable.id, currentSlot.id));
      return { status: 'EXPIRED' };
    }

    return { status: 'ACTIVE', expiresAt: currentSlot.expiresAt };
  } catch (error) {
    console.error('Error checking slot:', error);
    return { status: 'ERROR' };
  }
}

//may be depreciated soon 
export async function releaseSlot(userId: string) {
    // Mark current active slot as RELEASED
    try {
        await db.update(registrationSlotsTable)
        .set({ status: 'RELEASED' })
        .where(and(
            eq(registrationSlotsTable.userId, userId),
            eq(registrationSlotsTable.status, 'RESERVED')
        ));
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}

export async function submitRegistrationCart(
  userId: string, 
  teams: { riderId: string; skierId: string; horseName?: string; teamName?: string }[],
  additionalInfo?: {
    guardianName?: string;
    guardianPhone?: string;
    division?: 'NOVICE' | 'SPORT' | 'OPEN';
    waiverAgreed: boolean;
    horseOwner?: string;
    horses?: { name: string; bio: string }[];
  }
) {
  try {
    // 1. Verify slot is still valid
    const slotStatus = await checkSlotStatus(userId);
    if (slotStatus.status !== 'ACTIVE') {
      return { success: false, error: 'Slot expired or invalid' };
    }

    // Update user info if provided
    if (additionalInfo) {
        await db.update(usersTable).set({
            waiver_signed: additionalInfo.waiverAgreed,
            waiver_signed_at: additionalInfo.waiverAgreed ? new Date() : undefined,
            guardian_name: additionalInfo.guardianName,
            guardian_phone: additionalInfo.guardianPhone,
            division: additionalInfo.division,
            horse_owner: additionalInfo.horseOwner,
            horses: additionalInfo.horses,
        }).where(eq(usersTable.id, userId));
    }

    // 2. Create cart
    const cart = await db.insert(registrationCartTable).values({
      userId,
      status: 'PENDING',
    }).returning();

    const cartId = cart[0].id;

    // 3. Insert teams
    for (const team of teams) {
      await db.insert(teamsTable).values({
        cartId,
        riderId: team.riderId,
        skierId: team.skierId,
        horseName: team.horseName || '', // Handle optional horseName
        teamName: team.teamName,
        status: 'PENDING',
      });
    }

    // 4. Mark slot as COMPLETED - MOVED TO finalizeRegistration
    // await db.update(registrationSlotsTable)
    //   .set({ status: 'COMPLETED' })
    //   .where(and(
    //     eq(registrationSlotsTable.userId, userId),
    //     eq(registrationSlotsTable.status, 'RESERVED')
    //   ));

    return { success: true };
  } catch (error) {
    console.error('Error submitting cart:', error);
    return { success: false, error: 'Failed to submit registration' };
  }
}

export async function finalizeRegistration(userId: string) {
  try {
    // 1. Verify slot is still valid
    const slotStatus = await checkSlotStatus(userId);
    if (slotStatus.status !== 'ACTIVE') {
      return { success: false, error: 'Slot expired or invalid' };
    }

    // 2. Mark slot as COMPLETED
    await db.update(registrationSlotsTable)
      .set({ status: 'COMPLETED' })
      .where(and(
        eq(registrationSlotsTable.userId, userId),
        eq(registrationSlotsTable.status, 'RESERVED')
      ));

    return { success: true };
  } catch (error) {
    console.error('Error finalizing registration:', error);
    return { success: false, error: 'Failed to finalize registration' };
  }
}
