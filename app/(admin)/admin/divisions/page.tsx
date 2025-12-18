import { db } from "@/database/drizzle";
import { usersTable } from "@/database/schema";
import { count } from "drizzle-orm";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";

const DivisionsPage = async () => {
    const divisionCounts = await db.select({
        division: usersTable.division,
        count: count()
    })
    .from(usersTable)
    .groupBy(usersTable.division);

    // Ensure all divisions are listed even if count is 0
    const allDivisions = ['NOVICE', 'SPORT', 'OPEN', 'SNOWBOARD'];
    const stats = allDivisions.map(div => {
        const found = divisionCounts.find(d => d.division === div);
        return {
            name: div,
            count: found ? found.count : 0
        };
    });

    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-3xl font-bold text-white">Divisions</h1>
            <DataTable columns={columns} data={stats} searchKey="name" />
        </div>
    );
};

export default DivisionsPage;
