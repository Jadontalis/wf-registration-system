import { db } from "@/database/drizzle";
import { teamsTable, usersTable } from "@/database/schema";
import { eq, aliasedTable } from "drizzle-orm";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";

const TeamsPage = async () => {
    const rider = aliasedTable(usersTable, "rider");
    const skier = aliasedTable(usersTable, "skier");

    const teams = await db.select({
        id: teamsTable.id,
        teamName: teamsTable.teamName,
        horseName: teamsTable.horseName,
        status: teamsTable.status,
        riderName: rider.full_name,
        riderBio: rider.bios,
        skierName: skier.full_name,
        skierBio: skier.bios,
        horseOwner: rider.horse_owner,
    })
    .from(teamsTable)
    .leftJoin(rider, eq(teamsTable.riderId, rider.id))
    .leftJoin(skier, eq(teamsTable.skierId, skier.id));

    return (
        <div className="flex flex-col gap-8 flex-1 h-full">
            <h1 className="text-3xl font-bold text-white">Teams</h1>
            <DataTable columns={columns} data={teams} searchKey="teamName" />
        </div>
    );
};

export default TeamsPage;
