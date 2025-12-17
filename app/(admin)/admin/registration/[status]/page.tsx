import { db } from "@/database/drizzle";
import { registrationCartTable, usersTable, teamsTable } from "@/database/schema";
import { eq } from "drizzle-orm";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "../columns";

interface PageProps {
  params: Promise<{ status: string }>;
}

const RegistrationStatusPage = async ({ params }: PageProps) => {
    const { status } = await params;
    
    // Map URL status to DB status enum
    const statusMap: Record<string, "APPROVED" | "PENDING" | "REJECTED"> = {
        "approved": "APPROVED",
        "waitlisted": "PENDING", // Assuming waitlisted maps to pending for now, or needs specific logic
        "rejected": "REJECTED"
    };

    const dbStatus = statusMap[status];

    if (!dbStatus) {
        return <div>Invalid status</div>;
    }

    const registrations = await db.select({
        id: registrationCartTable.id,
        status: registrationCartTable.status,
        userName: usersTable.full_name,
        userEmail: usersTable.email,
        createdAt: registrationCartTable.createdAt,
        updatedAt: registrationCartTable.updatedAt
    })
    .from(registrationCartTable)
    .leftJoin(usersTable, eq(registrationCartTable.userId, usersTable.id))
    .where(eq(registrationCartTable.status, dbStatus));

    return (
        <div className="flex flex-col gap-8 flex-1 h-full">
            <h1 className="text-3xl font-bold text-white capitalize">{status} Carts</h1>
            <DataTable columns={columns} data={registrations} searchKey="userName" />
        </div>
    );
};

export default RegistrationStatusPage;
