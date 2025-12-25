import React from 'react'
import Image from 'next/image'
import RegistrationButton from './RegistrationButton';
import { db } from '@/database/drizzle';
import { registrationCartTable, systemSettingsTable, usersTable } from '@/database/schema';
import { eq, and } from 'drizzle-orm';

interface RegistrationOverviewProps extends EventData {
    userId?: string;
}

const RegistrationOverview = async ({
    title,
    date,
    location,
    description,
    cover,
    summary,
    available_events,
    userId,
}: RegistrationOverviewProps) => 
{
    let hasSubmittedCart = false;
    let isInvitee = false;
    let showWelcome = true;

    if (userId) {
        const submittedCart = await db.select().from(registrationCartTable).where(and(
            eq(registrationCartTable.userId, userId),
            eq(registrationCartTable.status, 'SUBMITTED')
        )).limit(1);
        hasSubmittedCart = submittedCart.length > 0;

        const user = await db.select({ role: usersTable.role, has_seen_welcome_msg: usersTable.has_seen_welcome_msg }).from(usersTable).where(eq(usersTable.id, userId)).limit(1);
        if (user.length > 0) {
            isInvitee = user[0].role === 'INVITEE';
            if (user[0].has_seen_welcome_msg) {
                showWelcome = false;
            } else {
                await db.update(usersTable).set({ has_seen_welcome_msg: true }).where(eq(usersTable.id, userId));
            }
        }
    }

    const settings = await db.select().from(systemSettingsTable).limit(1);
    const isRegistrationOpen = settings[0]?.isRegistrationOpen ?? false;

    return <section className='w-full px-6 py-8 flex flex-col items-center justify-center'>
        <div className="flex flex-1 flex-col gap-6 max-w-4xl items-center text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                Welcome to the Whitefish Skijoring Competitor Portal!
            </h1>

            {showWelcome && (
                <>
                    <h2 className="text-xl md:text-xl text-white leading-relaxed">
                        You now have access to our competitor portal and are eligible to be registered on teams to compete in our <b>2026</b> event. Here you can <b>view and update your account details</b> and your <b>registration requests status.</b> 
                    </h2>

                    <h2 className="text-xl md:text-xl text-white leading-relaxed">
                        You have also been added to our email list and will receive updates on all important race information.
                    </h2>
                </>
            )}



            {/* Event Details */}
            <div className="mt-8 flex flex-col gap-4 items-center">
                <h2 className="font-bebas-neue text-4xl md:text-5xl text-white mb-4 pt-16">Upcoming Events</h2>
                
                {cover && (
                    <Image 
                        src={cover} 
                        alt={title} 
                        width={400} 
                        height={300} 
                        className="rounded-lg"
                        priority={true}
                        sizes="(max-width: 768px) 100vw, 400px"
                    />
                )}
                
                <h3 className="text-2xl font-bold text-white">{title}</h3>
                <p className="text-lg text-white">{description}</p>
                <div className="flex gap-4 text-white justify-center">
                    <p>{date}</p>
                    <p>{location}</p>
                    {available_events > 0 && <p> {available_events} spots available</p>}
                </div>
                
                {/* {(isRegistrationOpen || isInvitee) && <RegistrationButton userId={userId} hasSubmittedCart={hasSubmittedCart} isInvitee={isInvitee} />} */}
            </div>
        </div>
    </section>
}

export default RegistrationOverview