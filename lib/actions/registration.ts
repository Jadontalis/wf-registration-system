'use server';

import { db } from '@/database/drizzle';
import { registrationSlotsTable, waitlistTable, teamsTable, registrationCartTable, usersTable } from '@/database/schema';
import { eq, and, gt, count, desc, ne, or, ilike, inArray } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { revalidatePath } from 'next/cache';

const MAX_SLOTS = 50; // Configurable
const SLOT_DURATION_MINUTES = 10;

import { auth } from "@/auth";

export async function reserveSlot(userId: string) {
  // Deprecated: Slot system removed. Always returns success.
  return { success: true, slot: { id: 'dummy', expiresAt: new Date(Date.now() + 3600000) } };
}

export async function joinWaitlist(userId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, error: "Unauthorized" };
    }

    if (session.user.id !== userId) {
        return { success: false, error: "Unauthorized" };
    }

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
  // Deprecated: Slot system removed. Always returns ACTIVE.
  return { status: 'ACTIVE', expiresAt: new Date(Date.now() + 3600000) };
}

//may be depreciated soon 
export async function releaseSlot(userId: string) {
    // Deprecated: Slot system removed.
    return { success: true };
}

export async function submitRegistrationCart(
  userId: string, 
  teams: { riderId: string; skierId: string; horseName?: string; horseOwner?: string; division?: 'NOVICE' | 'SPORT' | 'OPEN' | 'SNOWBOARD' }[],
  additionalInfo?: {
    guardianName?: string;
    guardianPhone?: string;
    waiverAgreed: boolean;
    // horseOwner?: string; // Deprecated in favor of per-team horse owner
    // horses?: { name: string; bio: string }[]; // Deprecated
  }
) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.id !== userId) {
        return { success: false, error: "Unauthorized" };
    }

    // Slot check removed

    // --- VALIDATION START ---

    // Helper to get user name for error messages
    const getUserName = async (id: string) => {
        const user = await db.select({ name: usersTable.full_name }).from(usersTable).where(eq(usersTable.id, id)).limit(1);
        return user[0]?.name || 'Unknown User';
    };

    // 0. Cleanup: Remove any existing PENDING carts for this user to prevent "ghost" limits
    // This ensures that if a user goes back and resubmits, their previous attempt doesn't block them.
    const existingPendingCarts = await db
        .select({ id: registrationCartTable.id })
        .from(registrationCartTable)
        .where(and(
            eq(registrationCartTable.userId, userId),
            eq(registrationCartTable.status, 'PENDING')
        ));

    if (existingPendingCarts.length > 0) {
        const cartIds = existingPendingCarts.map(c => c.id);
        
        // Delete teams associated with these carts
        await db.delete(teamsTable).where(inArray(teamsTable.cartId, cartIds));
        
        // Delete the carts themselves
        await db.delete(registrationCartTable).where(inArray(registrationCartTable.id, cartIds));
    }

    // 1. Validate Horse Limits (Max 2 runs per Horse Name + Owner)
    // Moved before User Limits to prioritize horse errors
    const horseCounts = new Map<string, { count: number, name: string, owner: string }>();

    // Count in current cart
    for (const team of teams) {
        if (team.horseName && team.horseOwner) {
            const key = `${team.horseName.trim().toLowerCase()}|${team.horseOwner.trim().toLowerCase()}`;
            const current = horseCounts.get(key) || { count: 0, name: team.horseName.trim(), owner: team.horseOwner.trim() };
            horseCounts.set(key, { 
                count: current.count + 1, 
                name: current.name, 
                owner: current.owner 
            });
        }
    }

    // Check against DB
    for (const [key, data] of horseCounts.entries()) {
        const [hName, hOwner] = key.split('|');
        
        const existingRuns = await db
            .select({ count: count() })
            .from(teamsTable)
            .where(and(
                ilike(teamsTable.horseName, hName), 
                ilike(teamsTable.horseOwner, hOwner),
                ne(teamsTable.status, 'REJECTED')
            ));

        const totalRuns = Number(existingRuns[0]?.count || 0) + data.count;

        if (totalRuns > 2) {
            return { success: false, error: `ERROR: Horse "${data.name}" owned by "${data.owner}" has reached the limit of 2 runs. Please select a different horse.` };
        }
    }

    // 2. Validate User Limits (Max 7 runs)
    const userCounts = new Map<string, number>();

    // Count in current cart
    for (const team of teams) {
        userCounts.set(team.riderId, (userCounts.get(team.riderId) || 0) + 1);
        userCounts.set(team.skierId, (userCounts.get(team.skierId) || 0) + 1);
    }

    // Check against DB for each unique user in the cart
    for (const [uid, currentCount] of userCounts.entries()) {
        const existingRuns = await db
            .select({ count: count() })
            .from(teamsTable)
            .where(and(
                or(eq(teamsTable.riderId, uid), eq(teamsTable.skierId, uid)),
                ne(teamsTable.status, 'REJECTED')
            ));
        
        const totalRuns = Number(existingRuns[0]?.count || 0) + currentCount;
        
        if (totalRuns > 7) {
            const name = await getUserName(uid);
            return { success: false, error: `ERROR: ${name} has been selected to run too many times (Max 7). Please review your cart.` };
        }
    }

    // --- VALIDATION END ---

    // Update user info if provided
    if (additionalInfo) {
        await db.update(usersTable).set({
            waiver_signed: additionalInfo.waiverAgreed,
            waiver_signed_at: additionalInfo.waiverAgreed ? new Date() : undefined,
            guardian_name: additionalInfo.guardianName,
            guardian_phone: additionalInfo.guardianPhone,
            // division: additionalInfo.division, // Removed global division
            // horse_owner: additionalInfo.horseOwner, // Removed
            // horses: additionalInfo.horses, // Removed
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
        horseName: team.horseName || '', 
        horseOwner: team.horseOwner || '',
        division: team.division,
        status: 'SUBMITTED',
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Error submitting cart:', error);
    return { success: false, error: 'Failed to submit registration' };
  }
}

export async function finalizeRegistration(userId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.id !== userId) {
        return { success: false, error: "Unauthorized" };
    }

    // Update the pending cart to SUBMITTED
    await db.update(registrationCartTable)
      .set({ status: 'SUBMITTED', updatedAt: new Date() })
      .where(and(
        eq(registrationCartTable.userId, userId),
        eq(registrationCartTable.status, 'PENDING')
      ));

    return { success: true };
  } catch (error) {
    console.error('Error finalizing registration:', error);
    return { success: false, error: 'Failed to finalize registration' };
  }
}

export async function reopenRegistration(userId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.id !== userId) {
        return { success: false, error: "Unauthorized" };
    }

    // Update the SUBMITTED cart back to PENDING
    await db.update(registrationCartTable)
      .set({ status: 'PENDING', updatedAt: new Date() })
      .where(and(
        eq(registrationCartTable.userId, userId),
        eq(registrationCartTable.status, 'SUBMITTED')
      ));

    return { success: true };
  } catch (error) {
    console.error('Error reopening registration:', error);
    return { success: false, error: 'Failed to reopen registration' };
  }
}

export async function getUserTeamRegistrations(userId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.id !== userId) {
        return { success: false, error: "Unauthorized" };
    }

    const rider = alias(usersTable, "rider");
    const skier = alias(usersTable, "skier");
    const creator = alias(usersTable, "creator");

    const registrations = await db
      .select({
        teamId: teamsTable.id,
        teamNumber: teamsTable.teamNumber,
        division: teamsTable.division,
        horseName: teamsTable.horseName,
        horseOwner: teamsTable.horseOwner,
        status: teamsTable.status,
        createdAt: teamsTable.createdAt,
        riderName: rider.full_name,
        riderId: rider.id,
        skierName: skier.full_name,
        skierId: skier.id,
        creatorName: creator.full_name,
        creatorId: creator.id,
        cartStatus: registrationCartTable.status,
      })
      .from(teamsTable)
      .innerJoin(registrationCartTable, eq(teamsTable.cartId, registrationCartTable.id))
      .innerJoin(rider, eq(teamsTable.riderId, rider.id))
      .innerJoin(skier, eq(teamsTable.skierId, skier.id))
      .innerJoin(creator, eq(registrationCartTable.userId, creator.id))
      .where(
        or(
          eq(teamsTable.riderId, userId),
          eq(teamsTable.skierId, userId)
        )
      )
      .orderBy(desc(teamsTable.createdAt));

    return { success: true, data: registrations };
  } catch (error) {
    console.error('Error fetching user registrations:', error);
    return { success: false, error: 'Failed to fetch registrations' };
  }
}

export async function scratchTeam(teamId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const userId = session.user.id;

    // Verify user is part of the team or the creator (via cart)
    const team = await db
      .select({
        id: teamsTable.id,
        riderId: teamsTable.riderId,
        skierId: teamsTable.skierId,
        cartUserId: registrationCartTable.userId,
      })
      .from(teamsTable)
      .innerJoin(registrationCartTable, eq(teamsTable.cartId, registrationCartTable.id))
      .where(eq(teamsTable.id, teamId))
      .limit(1);

    if (team.length === 0) {
      return { success: false, error: "Team not found" };
    }

    const t = team[0];
    if (t.riderId !== userId && t.skierId !== userId && t.cartUserId !== userId) {
      return { success: false, error: "Unauthorized to scratch this team" };
    }

    await db.delete(teamsTable).where(eq(teamsTable.id, teamId));

    revalidatePath('/account-activity');
    return { success: true, message: "Team scratched successfully" };
  } catch (error) {
    console.error("Error scratching team:", error);
    return { success: false, error: "Failed to scratch team" };
  }
}

