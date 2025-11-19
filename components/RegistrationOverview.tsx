import React from 'react'
import Image from 'next/image'

const RegistrationOverview = ({ 
    title, date, summary, location, 
    available_events, description, color, 
    cover }: Event) => {

    return <section className='w-full px-6 py-8'>
        <div className="flex flex-1 flex-col gap-6 max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Welcome to the Whitefish Skijoring Registration Portal!
            </h1>
        <h2 className="text-xl md:text-2xl text-white leading-relaxed">
          Registration is easy. When registration opens, use the clickthrough below and register your teams, divisions, etc.
          When you're done, submit your registration cart for us to approve. Once approved, you'll receive a confirmation email with payment instructions.
        </h2>

        <h2>{title}</h2>

        <div className="event-info">
            <div className='flex flex-row gap-1'>
                <Image src="/icons/logo.png" alt="event cover image" width={22} height={22} />
                <p></p>
            </div>
            <p>
                <span className="font-semibold text-light-200">{title}</span>
            </p>
            <p>
                <span className="font-semibold text-light-200">{description}</span>
            </p>
            <p>
                <span className="font-semibold text-light-200">{date}</span>
            </p>
        </div>
    </div>
  </section>
}

export default RegistrationOverview