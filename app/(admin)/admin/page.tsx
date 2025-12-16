import { db } from "@/database/drizzle";
import { usersTable, teamsTable, waitlistTable, registrationCartTable } from "@/database/schema";
import { count } from "drizzle-orm";
import dynamic from 'next/dynamic';

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

    // Get division stats
    const divisionCounts = await db.select({
        division: usersTable.division,
        count: count()
    })
    .from(usersTable)
    .groupBy(usersTable.division);

    // Process division stats
    const allDivisions = ['NOVICE', 'SPORT', 'OPEN'];
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
    const allUsers = await db.select({ createdAt: usersTable.created_at }).from(usersTable);
    
    // Group by date
    const growthMap = new Map<string, number>();
    allUsers.forEach(user => {
        if (user.createdAt) {
            const date = user.createdAt.toISOString().split('T')[0];
            growthMap.set(date, (growthMap.get(date) || 0) + 1);
        }
    });

    // Convert to array and sort
    const growthStats = Array.from(growthMap.entries())
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(-30); // Last 30 days

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
                <div className="bg-black/20 backdrop-blur-md p-6 rounded-xl border border-white/10 hover:border-white/50">
                    <h3 className="text-white text-lg font-bold mb-4">Activity (Last 30 Days)</h3>
                    <UserGrowthChart data={growthStats} />
                </div>

                <div className="bg-black/20 backdrop-blur-md p-6 rounded-xl border border-white/10 hover:border-white/50">
                    <h3 className="text-white text-lg font-bold mb-4">Competitor Types</h3>
                    <CompetitorTypeChart data={competitorStats} />
                </div>
            </div>

            <div className="bg-black/20 backdrop-blur-md p-6 rounded-xl border border-white/10 hover:border-white/50">
                <h3 className="text-white text-lg font-bold mb-4">Division Distribution</h3>
                <DivisionChart data={divisionStats} />
            </div>
        </div>
    );
};

export default AdminDashboard;
