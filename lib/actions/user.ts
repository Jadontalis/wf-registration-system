'use server';

import { db } from '@/database/drizzle';
import { usersTable } from '@/database/schema';
import { ilike, and, eq, ne, inArray } from 'drizzle-orm';

export async function searchCompetitors(query: string, type: 'RIDER' | 'SKIER' | 'SNOWBOARDER' | 'SKIER_AND_SNOWBOARDER' | 'RIDER_AND_SKIER_SNOWBOARDER', currentUserId: string) {
  if (!query || query.length < 2) return [];

  try {
    // Logic:
    // If searching for RIDER, we want people who are RIDER or RIDER_AND_SKIER_SNOWBOARDER
    // If searching for SKIER/SNOWBOARDER/BOTH, we want people who are NOT RIDER (so SKIER, SNOWBOARDER, BOTH, or RIDER_AND_SKIER_SNOWBOARDER)
    
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
            ? inArray(usersTable.competitor_type, ['RIDER', 'RIDER_AND_SKIER_SNOWBOARDER'])
            : ne(usersTable.competitor_type, 'RIDER'), // Look for anyone who is NOT a pure rider
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
  address: string;
  city: string;
  state: string;
  zip: string;
  bios?: string | null;
  competitor_type: 'RIDER' | 'SKIER' | 'SNOWBOARDER' | 'SKIER_AND_SNOWBOARDER' | 'RIDER_AND_SKIER_SNOWBOARDER';
}) {
  try {
    await db
      .update(usersTable)
      .set({
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        zip: data.zip,
        bios: data.bios || '',
        competitor_type: data.competitor_type,
      })
      .where(eq(usersTable.id, userId));

    return { success: true };
  } catch (error) {
    console.error('Error updating account details:', error);
    return { success: false, error: 'Failed to update account details' };
  }
}
