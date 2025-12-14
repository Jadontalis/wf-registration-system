import { db } from "@/database/drizzle";
import { waitlistTable, usersTable } from "@/database/schema";
import { eq } from "drizzle-orm";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";

const WaitlistPage = async () => {
    const waitlist = await db.select({
        id: waitlistTable.id,
        status: waitlistTable.status,
        userName: usersTable.full_name,
        userEmail: usersTable.email,
        createdAt: waitlistTable.createdAt
    })
    .from(waitlistTable)
    .leftJoin(usersTable, eq(waitlistTable.userId, usersTable.id));

    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-3xl font-bold text-white">Waitlist</h1>
            <DataTable columns={columns} data={waitlist} searchKey="userName" />
        </div>
    );
};

export default WaitlistPage;
