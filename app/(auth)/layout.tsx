import React, { ReactNode } from 'react'
import Image from 'next/image'

const Layout = ({ children }: {children: ReactNode}) => {
  return (
    <main className="flex min-h-screen w-full flex-col md:flex-row-reverse">
      {/* Auth Image: Top on mobile, Right half on desktop */}
      <section className="relative h-[20vh] w-full md:h-screen md:w-1/2">
        <Image 
          src="/images/skier.jpg" 
          alt="Auth Image" 
          fill className="object-cover"
          priority
        />
      </section>

      {/* Auth Content: Bottom on mobile, Left half on desktop */}
      
      <section className="relative flex flex-1 flex-col items-center justify-center px-4 pt-8 pb-20 md:py-10 md:w-1/2 md:px-20">
        {/* Background Image filling the left side */}
        <div className="absolute inset-0 -z-10">
            <Image 
                src="/images/background.svg" 
                alt="Auth Background" 
                fill className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Auth Box centered */}
        <div className="flex w-full max-w-[420px] flex-col items-center justify-center gap-6 text-center
         bg-white/5 backdrop-blur-sm p-10 rounded-2xl shadow-2xl text-white border border-transparent hover:border-white/20 transition-colors duration-50">
            <div className="flex flex-col items-center gap-4">
                <Image 
                    src="/icons/logo.png" 
                    alt="logo" 
                    width={100} 
                    height={100}
                    className="rounded-full"
                />
                <h1 className="text-2xl font-bold text-white">
                    Whitefish Skijoring Nonprofit Association
                </h1>
            </div>
            
            {/* Render children (the form) */}
            <div className="w-full">
                {children}
            </div>
        </div>
      </section>
    </main>
  )
}

export default Layout;