import { db } from "@/database/drizzle";
import { usersTable, teamsTable } from "@/database/schema";
import { eq, aliasedTable } from "drizzle-orm";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";

interface PageProps {
  params: Promise<{ division: string }>;
}

const DivisionPage = async ({ params }: PageProps) => {
    const { division } = await params;
    
    const divisionMap: Record<string, "NOVICE" | "SPORT" | "OPEN" | "SNOWBOARD"> = {
        "novice": "NOVICE",
        "sport": "SPORT",
        "open": "OPEN",
        "snowboard": "SNOWBOARD"
    };

    const dbDivision = divisionMap[division];

    if (!dbDivision) {
        return <div>Invalid division</div>;
    }

    const rider = aliasedTable(usersTable, "rider");
    const skier = aliasedTable(usersTable, "skier");

    const teams = await db.select({
        id: teamsTable.id,
        teamNumber: teamsTable.teamNumber,
        riderName: rider.full_name,
        riderBio: rider.bios,
        skierName: skier.full_name,
        skierBio: skier.bios,
        horseName: teamsTable.horseName,
        horseOwner: teamsTable.horseOwner,
    })
    .from(teamsTable)
    .innerJoin(rider, eq(teamsTable.riderId, rider.id))
    .innerJoin(skier, eq(teamsTable.skierId, skier.id))
    .where(eq(teamsTable.division, dbDivision));

    return (
        <div className="flex flex-col gap-8 flex-1 h-full">
            <h1 className="text-3xl font-bold text-white capitalize">{division} Division</h1>
            <DataTable columns={columns} data={teams} searchKey="teamNumber" />
        </div>
    );
};

export default DivisionPage;
