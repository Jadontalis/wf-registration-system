import { db } from "@/database/drizzle";
import { registrationCartTable, usersTable, teamsTable, systemSettingsTable } from "@/database/schema";
import { eq, aliasedTable, asc } from "drizzle-orm";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { RegistrationToggle } from "@/components/admin/RegistrationToggle";

const RegistrationPage = async () => {
    // Fetch system settings
    const settings = await db.select().from(systemSettingsTable).limit(1);
    const isRegistrationOpen = settings[0]?.isRegistrationOpen ?? false;

    // Fetch all teams
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
    .orderBy(asc(registrationCartTable.updatedAt), asc(teamsTable.teamNumber));

    const data = teamsData.map(team => ({
        id: team.cartId,
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

    return (
        <div className="flex flex-col gap-8 flex-1 h-full">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">All Registrations</h1>
                <RegistrationToggle isOpen={isRegistrationOpen} />
            </div>
            <DataTable columns={columns} data={data} searchKey="userName" />
        </div>
    );
};

export default RegistrationPage;
