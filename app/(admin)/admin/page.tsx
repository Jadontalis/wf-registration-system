import { db } from "@/database/drizzle";
import { usersTable, teamsTable, waitlistTable, registrationCartTable } from "@/database/schema";
import { count, desc, sql } from "drizzle-orm";
import dynamic from 'next/dynamic';
import { ExpandableChart } from "@/components/admin/charts/ExpandableChart";
import { RecentUsersTable } from "@/components/admin/RecentUsersTable";

const DivisionChart = dynamic(() => import('@/components/admin/charts/DivisionChart').then(mod => mod.DivisionChart), {
    loading: () => <div className="h-[350px] w-full animate-pulse bg-white/5 rounded-xl" />
});
const CompetitorTypeChart = dynamic(() => import('@/components/admin/charts/CompetitorTypeChart').then(mod => mod.CompetitorTypeChart), {
    loading: () => <div className="h-[350px] w-full animate-pulse bg-white/5 rounded-xl" />
});
const UserGrowthChart = dynamic(() => import('@/components/admin/charts/UserGrowthChart').then(mod => mod.UserGrowthChart), {
    loading: () => <div className="h-[350px] w-full animate-pulse bg-white/5 rounded-xl" />
});

const AdminDashboard = async () => {
    const [userCount] = await db.select({ count: count() }).from(usersTable);
    const [teamCount] = await db.select({ count: count() }).from(teamsTable);
    const [waitlistCount] = await db.select({ count: count() }).from(waitlistTable);
    const [registrationCount] = await db.select({ count: count() }).from(registrationCartTable);

    // Get recent users for details
    const recentUsers = await db.select({
        id: usersTable.id,
        full_name: usersTable.full_name,
        email: usersTable.email,
        created_at: usersTable.created_at,
        competitor_type: usersTable.competitor_type,
        division: usersTable.division,
    })
    .from(usersTable)
    .orderBy(desc(usersTable.created_at))
    .limit(50);

    // Get division stats
    const divisionCounts = await db.select({
        division: teamsTable.division,
        count: count()
    })
    .from(teamsTable)
    .groupBy(teamsTable.division);

    // Process division stats
    const allDivisions = ['NOVICE', 'SPORT', 'OPEN', 'SNOWBOARD'];
    const divisionStats = allDivisions.map(div => {
        const found = divisionCounts.find(d => d.division === div);
        return {
            name: div,
            count: found ? found.count : 0
        };
    });

    // Get competitor type stats
    const competitorCounts = await db.select({
        type: usersTable.competitor_type,
        count: count()
    })
    .from(usersTable)
    .groupBy(usersTable.competitor_type);

    const competitorStats = competitorCounts.map(stat => ({
        name: stat.type.replace(/_/g, ' '),
        value: stat.count
    }));

    // Get user growth stats (last 30 days)
    const growthStats = await db
        .select({
            date: sql<string>`to_char(${usersTable.created_at}, 'YYYY-MM-DD')`,
            count: count(),
        })
        .from(usersTable)
        .where(sql`${usersTable.created_at} > NOW() - INTERVAL '30 days'`)
        .groupBy(sql`to_char(${usersTable.created_at}, 'YYYY-MM-DD')`)
        .orderBy(sql`to_char(${usersTable.created_at}, 'YYYY-MM-DD')`);

    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

                <div className="bg-black/20 backdrop-blur-md p-6 rounded-xl border border-white/10 hover:border-white/50">
                    <h3 className="text-gray-400 text-sm font-medium uppercase">Total Registrations</h3>
                    <p className="text-4xl font-bold text-white mt-2">{registrationCount.count}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ExpandableChart 
                    title="Activity (Last 30 Days)"
                    details={<RecentUsersTable users={recentUsers} />}
                >
                    <UserGrowthChart data={growthStats} />
                </ExpandableChart>

                <ExpandableChart 
                    title="Competitor Types"
                >
                    <CompetitorTypeChart data={competitorStats} />
                </ExpandableChart>
            </div>

            <ExpandableChart 
                title="Division Distribution"
            >
                <DivisionChart data={divisionStats} />
            </ExpandableChart>
        </div>
    );
};

export default AdminDashboard;
