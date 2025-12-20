'use server';

import { db } from '@/database/drizzle';
import { usersTable } from '@/database/schema';
import { ilike, and, eq, ne, inArray } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { auth } from "@/auth";
import { accountUpdateSchema } from "@/lib/validations";

export async function searchCompetitors(query: string, type: 'RIDER' | 'SKIER' | 'SNOWBOARDER' | 'SKIER_AND_SNOWBOARDER' | 'RIDER_SKIER_SNOWBOARDER', currentUserId: string) {
  if (!query || query.length < 2) return [];

  try {
    const session = await auth();
    if (!session?.user?.id) return [];
    
    // Logic:
    // If searching for RIDER, we want people who are RIDER or RIDER_SKIER_SNOWBOARDER
    // If searching for SKIER/SNOWBOARDER/BOTH, we want people who are NOT RIDER (so SKIER, SNOWBOARDER, BOTH, or RIDER_SKIER_SNOWBOARDER)
    
    const isLookingForRider = type === 'RIDER';
    
    const users = await db
      .select({
        id: usersTable.id,
        fullName: usersTable.full_name,
        email: usersTable.email,
        competitorType: usersTable.competitor_type,
      })
      .from(usersTable)
      .where(
        and(
          isLookingForRider 
            ? inArray(usersTable.competitor_type, ['RIDER', 'RIDER_SKIER_SNOWBOARDER'])
            : ne(usersTable.competitor_type, 'RIDER'), // Look for anyone who is NOT a pure rider
          ne(usersTable.id, session.user.id), // Exclude self
          ilike(usersTable.full_name, `%${query}%`)
        )
      )
      .limit(10);

    return users;
  } catch (error) {
    console.error('Error searching competitors:', error);
    return [];
  }
}

export async function updateAccountDetails(userId: string, data: {
  full_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  bios?: string | null;
  competitor_type: 'RIDER' | 'SKIER' | 'SNOWBOARDER' | 'SKIER_AND_SNOWBOARDER' | 'RIDER_SKIER_SNOWBOARDER';
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, error: "Unauthorized" };
    }

    // Allow user to update their own profile, or Admin to update anyone
    if (session.user.id !== userId && session.user.role !== "ADMIN") {
        return { success: false, error: "Unauthorized" };
    }

    const validatedData = accountUpdateSchema.parse(data);

    await db
      .update(usersTable)
      .set({
        full_name: validatedData.full_name,
        email: validatedData.email,
        phone: validatedData.phone,
        address: validatedData.address,
        city: validatedData.city,
        state: validatedData.state,
        zip: validatedData.zip,
        bios: validatedData.bios || '',
        competitor_type: validatedData.competitor_type,
      })
      .where(eq(usersTable.id, userId));

    return { success: true };
  } catch (error) {
    console.error('Error updating account details:', error);
    return { success: false, error: 'Failed to update account details' };
  }
}

export async function updateUserRole(userId: string, role: "ADMIN" | "USER") {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Unauthorized" };

        // Verify the requester is an admin
        const requester = await db.select({ role: usersTable.role }).from(usersTable).where(eq(usersTable.id, session.user.id)).limit(1);
        if (!requester.length || requester[0].role !== "ADMIN") {
            return { success: false, error: "Unauthorized" };
        }

        await db.update(usersTable).set({ role }).where(eq(usersTable.id, userId));
        
        return { success: true };
    } catch (error) {
        console.error("Error updating user role:", error);
        return { success: false, error: "Failed to update role" };
    }
}

export async function updateUserRoleBulk(updates: { id: string; role: "ADMIN" | "USER" }[]) {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Unauthorized" };

        // Verify the requester is an admin
        const requester = await db.select({ role: usersTable.role }).from(usersTable).where(eq(usersTable.id, session.user.id)).limit(1);
        if (!requester.length || requester[0].role !== "ADMIN") {
            return { success: false, error: "Unauthorized" };
        }

        await Promise.all(
            updates.map(update => 
                db.update(usersTable)
                  .set({ role: update.role })
                  .where(eq(usersTable.id, update.id))
            )
        );
        
        return { success: true };
    } catch (error) {
        console.error("Error updating user roles bulk:", error);
        if (error instanceof Error) {
            console.error("Error message:", error.message);
            console.error("Error stack:", error.stack);
        }
        return { success: false, error: "Failed to update roles" };
    }
}

export async function deleteUser(userId: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Unauthorized" };

        // Verify the requester is an admin
        const requester = await db.select({ role: usersTable.role }).from(usersTable).where(eq(usersTable.id, session.user.id)).limit(1);
        if (!requester.length || requester[0].role !== "ADMIN") {
            return { success: false, error: "Unauthorized" };
        }

        await db.delete(usersTable).where(eq(usersTable.id, userId));
        
        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        console.error("Error deleting user:", error);
        return { success: false, error: "Failed to delete user" };
    }
}
