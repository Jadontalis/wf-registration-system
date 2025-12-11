'use server';

import { db } from '@/database/drizzle';
import { usersTable } from '@/database/schema';
import { ilike, and, eq, ne } from 'drizzle-orm';

export async function searchCompetitors(query: string, type: 'RIDER' | 'SKIER' | 'SNOWBOARDER' | 'BOTH', currentUserId: string) {
  if (!query || query.length < 2) return [];

  try {
    // Logic:
    // If searching for RIDER, we want people who are RIDER
    // If searching for SKIER/SNOWBOARDER/BOTH, we want people who are NOT RIDER (so SKIER, SNOWBOARDER, or BOTH)
    
    // However, the 'type' parameter passed here is what we are LOOKING FOR.
    // So if I am a RIDER, I pass 'SKIER' (or generic non-rider).
    // But wait, the UI passes the type.
    
    // Let's adjust the query based on what we are looking for.
    // If type is 'RIDER', we look for 'RIDER'.
    // If type is NOT 'RIDER', we might want any of the non-rider types.
    
    // Actually, let's simplify. The UI should probably handle the logic of what to ask for.
    // But if I am a RIDER, I can partner with SKIER, SNOWBOARDER, or BOTH.
    // So if the passed type is 'SKIER' (which is what the UI currently defaults to for non-riders),
    // we should probably search for all non-riders.
    
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
            ? eq(usersTable.competitor_type, 'RIDER')
            : ne(usersTable.competitor_type, 'RIDER'), // Look for anyone who is NOT a rider (Skier, Snowboarder, Both)
          ne(usersTable.id, currentUserId), // Exclude self
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
  bios: string;
  competitor_type: 'RIDER' | 'SKIER' | 'SNOWBOARDER' | 'BOTH';
}) {
  try {
    await db
      .update(usersTable)
      .set({
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        bios: data.bios,
        competitor_type: data.competitor_type,
      })
      .where(eq(usersTable.id, userId));

    return { success: true };
  } catch (error) {
    console.error('Error updating account details:', error);
    return { success: false, error: 'Failed to update account details' };
  }
}
