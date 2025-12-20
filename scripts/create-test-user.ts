import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { usersTable } from "../database/schema";
import { hash } from "bcryptjs";

config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function main() {
  try {
    const hashedPassword = await hash("password123", 10);
    
    const testUser = {
      full_name: "Test User For Deletion",
      email: `test-delete-${Date.now()}@example.com`,
      password: hashedPassword,
      phone: "555-0123",
      address: "123 Test St",
      city: "Test City",
      state: "TS",
      zip: "12345",
      competitor_type: "RIDER" as const,
    };

    console.log("Creating test user...");
    
    const result = await db
      .insert(usersTable)
      .values(testUser)
      .returning();

    console.log("Test user created successfully!");
    console.log("Name:", result[0].full_name);
    console.log("Email:", result[0].email);
    console.log("You can now go to the admin dashboard and delete this user.");
    
  } catch (error) {
    console.error("Error creating test user:", error);
  }
}

main();
