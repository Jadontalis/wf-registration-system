import { db } from "@/database/drizzle";
import { registrationCartTable, usersTable } from "@/database/schema";
import { eq } from "drizzle-orm";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";

const RegistrationPage = async () => {
    const registrations = await db.select({
        id: registrationCartTable.id,
        status: registrationCartTable.status,
        userName: usersTable.full_name,
        userEmail: usersTable.email,
        createdAt: registrationCartTable.createdAt,
        updatedAt: registrationCartTable.updatedAt
    })
    .from(registrationCartTable)
    .leftJoin(usersTable, eq(registrationCartTable.userId, usersTable.id));

    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-3xl font-bold text-white">Registration</h1>
            <DataTable columns={columns} data={registrations} searchKey="userName" />
        </div>
    );
};

export default RegistrationPage;
