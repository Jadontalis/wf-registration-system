import { db } from "@/database/drizzle";
import { usersTable } from "@/database/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const UsersPage = async () => {
    const users = await db.select().from(usersTable);

    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-3xl font-bold text-white">All Users</h1>
            
            <div className="rounded-md border border-white/10 bg-[#0f172a]">
                <Table>
                    <TableHeader>
                        <TableRow className="border-white/10 hover:bg-white/5">
                            <TableHead className="text-gray-400">Name</TableHead>
                            <TableHead className="text-gray-400">Email</TableHead>
                            <TableHead className="text-gray-400">Role</TableHead>
                            <TableHead className="text-gray-400">Competitor Type</TableHead>
                            <TableHead className="text-gray-400">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id} className="border-white/10 hover:bg-white/5">
                                <TableCell className="font-medium text-white">{user.full_name}</TableCell>
                                <TableCell className="text-gray-300">{user.email}</TableCell>
                                <TableCell className="text-gray-300">{user.role}</TableCell>
                                <TableCell className="text-gray-300">{user.competitor_type}</TableCell>
                                <TableCell className="text-gray-300">{user.status}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default UsersPage;
