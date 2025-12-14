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
    console.error("Usage: npx tsx scripts/delete-user.ts <email>");
    process.exit(1);
  }

  try {
    console.log(`Deleting user: ${email}...`);
    
    const result = await db
      .delete(usersTable)
      .where(eq(usersTable.email, email))
      .returning();

    if (result.length === 0) {
      console.log("User not found.");
    } else {
      console.log(`Successfully deleted user: ${result[0].email}`);
    }
  } catch (error) {
    console.error("Error deleting user:", error);
  }
  process.exit(0);
}

main();
