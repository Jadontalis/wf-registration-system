import React from 'react'
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserTeamRegistrations } from "@/lib/actions/registration";
import AccountActivityList from "@/components/AccountActivityList";

const AccountActivityPage = async () => {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const result = await getUserTeamRegistrations(session.user.id);
  
  const registrations = result.success && result.data ? result.data : [];

  return (
    <div className="text-white px-4 md:px-8">
      <h1 className="text-3xl font-bold mb-6">Account Activity</h1>
      <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm border border-white/20">
        <AccountActivityList registrations={registrations} currentUserId={session.user.id} />
      </div>
    </div>
  )
}

export default AccountActivityPage
