'use server';

import { db } from '@/database/drizzle';
import { teamsTable, systemSettingsTable } from '@/database/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from "@/auth";

export async function updateTeamStatus(teamId: string, status: 'APPROVED' | 'PENDING' | 'REJECTED') {
  try {
    const session = await auth();
    // TODO: Add proper admin check here. For now assuming if they can access the page they are admin, 
    // but ideally we check session.user.role === 'ADMIN'
    if (!session?.user) {
        return { success: false, error: "Unauthorized" };
    }

    await db.update(teamsTable)
      .set({ status })
      .where(eq(teamsTable.id, teamId));

    revalidatePath('/admin/registration');
    revalidatePath('/admin/registration/[status]');
    return { success: true };
  } catch (error) {
    console.error('Error updating team status:', error);
    return { success: false, error: 'Failed to update team status' };
  }
}

export async function deleteTeam(teamId: string) {
  try {
    const session = await auth();
    if (!session?.user) {
        return { success: false, error: "Unauthorized" };
    }

    await db.update(teamsTable)
      .set({ status: 'REJECTED' })
      .where(eq(teamsTable.id, teamId));

    revalidatePath('/admin/registration');
    revalidatePath('/admin/registration/[status]');
    return { success: true };
  } catch (error) {
    console.error('Error deleting team:', error);
    return { success: false, error: 'Failed to delete team' };
  }
}

export async function toggleRegistrationStatus() {
  try {
    const session = await auth();
    if (!session?.user) {
        return { success: false, error: "Unauthorized" };
    }

    const settings = await db.select().from(systemSettingsTable).limit(1);
    
    if (settings.length === 0) {
        await db.insert(systemSettingsTable).values({
            isRegistrationOpen: true
        });
    } else {
        await db.update(systemSettingsTable)
            .set({ isRegistrationOpen: !settings[0].isRegistrationOpen })
            .where(eq(systemSettingsTable.id, settings[0].id));
    }

    revalidatePath('/admin/registration');
    return { success: true };
  } catch (error) {
    console.error('Error toggling registration status:', error);
    return { success: false, error: 'Failed to toggle registration status' };
  }
}
