import React from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { db } from '@/database/drizzle';
import { usersTable } from '@/database/schema';
import { eq } from 'drizzle-orm';
import AccountSettingsForm from '@/components/AccountSettingsForm';

const AccountSettingsPage = async () => {
  const session = await auth();
  if (!session?.user?.id) redirect('/sign-in');

  const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, session.user.id))
    .limit(1);

  if (user.length === 0) redirect('/sign-in');

  const userData = user[0];

  return (
    <div className="text-white px-4 md:px-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Account Settings</h1>
      <div className="bg-white/5 p-8 rounded-lg backdrop-blur-sm border border-white/20">
        <AccountSettingsForm 
          userId={userData.id}
          initialData={{
            full_name: userData.full_name,
            email: userData.email,
            phone: userData.phone,
            address: userData.address,
            hometown: userData.hometown,
            bios: userData.bios,
            competitor_type: userData.competitor_type,
          }}
        />
      </div>
    </div>
  );
};

export default AccountSettingsPage;
