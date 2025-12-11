import React from 'react'
import Image from 'next/image'
import RegistrationButton from './RegistrationButton'

interface RegistrationOverviewProps extends EventData {
    userId?: string;
}

const RegistrationOverview = ({
    id,
    title,
    date,
    location,
    description,
    cover,
    summary,
    available_events,
    userId
}: RegistrationOverviewProps) => 
{
    return <section className='w-full px-6 py-8 flex flex-col items-center justify-center'>
        <div className="flex flex-1 flex-col gap-6 max-w-4xl items-center text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                Welcome to the Whitefish Skijoring Registration Portal!
            </h1>

            <h2 className="text-xl md:text-xl text-white leading-relaxed">
                When registration opens, use the button below to reserve your slot.
                You will have 10 minutes to complete your registration.
            </h2>

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
                    />
                )}
                
                <h3 className="text-2xl font-bold text-white">{title}</h3>
                <p className="text-lg text-white">{description}</p>
                <div className="flex gap-4 text-white justify-center">
                    <p>{date}</p>
                    <p>{location}</p>
                    {available_events && <p> {available_events} spots available</p>}
                </div>
                {summary && <p className="text-white italic">{summary}</p>}
                
                <RegistrationButton userId={userId} />
            </div>
        </div>
    </section>
}

export default RegistrationOverview