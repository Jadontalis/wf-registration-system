import { db } from "@/database/drizzle";
import { usersTable, teamsTable, waitlistTable } from "@/database/schema";
import { count } from "drizzle-orm";

const AdminDashboard = async () => {
    const [userCount] = await db.select({ count: count() }).from(usersTable);
    const [teamCount] = await db.select({ count: count() }).from(teamsTable);
    const [waitlistCount] = await db.select({ count: count() }).from(waitlistTable);

    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-black/20 backdrop-blur-md p-6 rounded-xl border border-white/10 hover:border-white/50">
                    <h3 className="text-gray-400 text-sm font-medium uppercase">Total Users</h3>
                    <p className="text-4xl font-bold text-white mt-2">{userCount.count}</p>
                </div>
                
                <div className="bg-black/20 backdrop-blur-md p-6 rounded-xl border border-white/10 hover:border-white/50">
                    <h3 className="text-gray-400 text-sm font-medium uppercase">Registered Teams</h3>
                    <p className="text-4xl font-bold text-white mt-2">{teamCount.count}</p>
                </div>

                <div className="bg-black/20 backdrop-blur-md p-6 rounded-xl border border-white/10 hover:border-white/50">
                    <h3 className="text-gray-400 text-sm font-medium uppercase">Waitlist Entries</h3>
                    <p className="text-4xl font-bold text-white mt-2">{waitlistCount.count}</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
