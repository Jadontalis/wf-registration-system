import { db } from "@/database/drizzle";
import { usersTable } from "@/database/schema";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";

const UsersPage = async () => {
    const users = await db.select().from(usersTable);

    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-3xl font-bold text-white">All Users</h1>
            <DataTable columns={columns} data={users} searchKey="email" />
        </div>
    );
};

export default UsersPage;
