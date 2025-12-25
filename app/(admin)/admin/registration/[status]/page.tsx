import { db } from "@/database/drizzle";
import { registrationCartTable, usersTable, teamsTable } from "@/database/schema";
import { eq, inArray, aliasedTable, asc } from "drizzle-orm";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "../columns";

interface PageProps {
  params: Promise<{ status: string }>;
}

const RegistrationStatusPage = async ({ params }: PageProps) => {
    const { status } = await params;
    
    // Map URL status to DB status enum
    const statusMap: Record<string, "APPROVED" | "PENDING" | "REJECTED" | "SUBMITTED"> = {
        "approved": "APPROVED",
        "waitlisted": "PENDING", 
        "rejected": "REJECTED",
        "submitted": "SUBMITTED"
    };

    const dbStatus = statusMap[status];

    if (!dbStatus) {
        return <div>Invalid status</div>;
    }

    // Fetch teams directly based on status
    const rider = aliasedTable(usersTable, "rider");
    const skier = aliasedTable(usersTable, "skier");

    const teamsData = await db.select({
        id: teamsTable.id,
        cartId: teamsTable.cartId,
        teamNumber: teamsTable.teamNumber,
        division: teamsTable.division,
        horseName: teamsTable.horseName,
        riderName: rider.full_name,
        skierName: skier.full_name,
        status: teamsTable.status,
        // Cart info
        cartStatus: registrationCartTable.status,
        cartNumber: registrationCartTable.cartNumber,
        userName: usersTable.full_name,
        userEmail: usersTable.email,
        createdAt: registrationCartTable.createdAt,
        updatedAt: registrationCartTable.updatedAt
    })
    .from(teamsTable)
    .leftJoin(registrationCartTable, eq(teamsTable.cartId, registrationCartTable.id))
    .leftJoin(usersTable, eq(registrationCartTable.userId, usersTable.id))
    .leftJoin(rider, eq(teamsTable.riderId, rider.id))
    .leftJoin(skier, eq(teamsTable.skierId, skier.id))
    .where(eq(teamsTable.status, dbStatus as any)) // Cast to any because dbStatus might not match teamsTable status enum exactly if types are not updated yet
    .orderBy(asc(registrationCartTable.updatedAt), asc(teamsTable.teamNumber));

    const data = teamsData.map(team => ({
        id: team.cartId,
        cartNumber: team.cartNumber || 0,
        status: team.status as "APPROVED" | "PENDING" | "REJECTED" | "SUBMITTED",
        userName: team.userName,
        userEmail: team.userEmail,
        createdAt: team.createdAt || new Date(),
        updatedAt: team.updatedAt || new Date(),
        teamId: team.id,
        teamNumber: team.teamNumber,
        division: team.division,
        horseName: team.horseName,
        riderName: team.riderName,
        skierName: team.skierName
    }));

    const title = status === 'approved' ? 'Resolved Teams' : `${status} Teams`;

    return (
        <div className="flex flex-col gap-8 flex-1 h-full">
            <h1 className="text-3xl font-bold text-white capitalize">{title}</h1>
            <DataTable columns={columns} data={data} searchKey="userName" />
        </div>
    );
};

export default RegistrationStatusPage;
