import { db } from "@/database/drizzle";
import { usersTable } from "@/database/schema";
import { UsersTable } from "./users-table";

const UsersPage = async () => {
    const users = await db.select().from(usersTable);

    return (
        <div className="flex flex-col gap-8 flex-1 h-full">
            <h1 className="text-3xl font-bold text-white">All Users</h1>
            <UsersTable data={users as any} />
        </div>
    );
};

export default UsersPage;
