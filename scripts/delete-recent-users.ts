
import { config } from "dotenv";
config({ path: ".env.local" });

async function main() {
  // Dynamically import to ensure env vars are loaded first
  const { db } = await import("@/database/drizzle");
  const { usersTable, registrationSlotsTable, waitlistTable, registrationCartTable, teamsTable } = await import("@/database/schema");
  const { desc, inArray, or } = await import("drizzle-orm");

  console.log("Fetching 2 most recent users...");
  
  const usersToDelete = await db
    .select({
      id: usersTable.id,
      full_name: usersTable.full_name,
      email: usersTable.email,
      created_at: usersTable.created_at
    })
    .from(usersTable)
    .orderBy(desc(usersTable.created_at))
    .limit(2);

  if (usersToDelete.length === 0) {
    console.log("No users found to delete.");
    return;
  }

  console.log(`Found ${usersToDelete.length} users to delete:`);
  usersToDelete.forEach(u => console.log(`- ${u.full_name} (${u.email})`));

  const ids = usersToDelete.map(u => u.id);
  
  console.log("Deleting related records...");

  // Delete from teams_table (rider or skier)
  // teamsTable references cartId, so we should delete teams before carts if we were deleting carts by ID, 
  // but here we delete by user ID. 
  // However, teams also reference users directly.
  await db.delete(teamsTable).where(or(
      inArray(teamsTable.riderId, ids),
      inArray(teamsTable.skierId, ids)
  ));

  // Delete from registration_slots_table
  await db.delete(registrationSlotsTable).where(inArray(registrationSlotsTable.userId, ids));
  
  // Delete from waitlist_table
  await db.delete(waitlistTable).where(inArray(waitlistTable.userId, ids));
  
  // Delete from registration_cart_table
  await db.delete(registrationCartTable).where(inArray(registrationCartTable.userId, ids));
  
  // Finally delete users
  await db.delete(usersTable).where(inArray(usersTable.id, ids));
  
  console.log("Successfully deleted users.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Error deleting users:", err);
  process.exit(1);
});
