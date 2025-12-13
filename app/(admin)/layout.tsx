import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import { db } from "@/database/drizzle";
import { usersTable } from "@/database/schema";
import { eq } from "drizzle-orm";
import React from "react";

const Layout = async ({ children }: { children: React.ReactNode }) => {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/sign-in");
    }

    // Double check role from DB to be safe
    const user = await db.select({ role: usersTable.role }).from(usersTable).where(eq(usersTable.id, session.user.id)).limit(1);

    if (!user.length || user[0].role !== "ADMIN") {
        redirect("/");
    }

    return (
        <main className="flex min-h-screen w-full flex-row bg-[#020817]">
            <Sidebar />
            <div className="flex w-full flex-1 flex-col">
                <Header />
                <div className="p-8">
                    {children}
                </div>
            </div>
        </main>
    );
};

export default Layout;
