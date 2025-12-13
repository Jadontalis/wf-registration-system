import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { usersTable } from "../database/schema";
import { eq } from "drizzle-orm";

config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function main() {
  const email = process.argv[2];

  if (!email) {
    console.error("Please provide an email address as an argument.");
    console.error("Usage: npx tsx scripts/seed-admin.ts <email>");
    process.exit(1);
  }

  try {
    console.log(`Updating role for user: ${email}...`);
    
    const result = await db
      .update(usersTable)
      .set({ role: "ADMIN" })
      .where(eq(usersTable.email, email))
      .returning();

    if (result.length === 0) {
      console.log("User not found.");
    } else {
      console.log(`Successfully updated role to ADMIN for user: ${result[0].email}`);
    }
  } catch (error) {
    console.error("Error updating user role:", error);
  }
}

main();
