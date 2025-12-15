import React from 'react'

const Footer = ({ compact = false }: { compact?: boolean }) => {
  return (
    <footer className={`w-full ${compact ? 'py-4' : 'py-8'} px-6 mt-auto`}>
      <div className="flex flex-col items-center justify-center gap-1 text-center">
        <p className={`text-white ${compact ? 'text-[10px] md:text-xs' : 'text-xs md:text-sm'}`}>
          © {new Date().getFullYear()} Whitefish Skijoring | All rights reserved.
        </p>
        <p className={`text-white/70 ${compact ? 'text-[8px] md:text-[10px]' : 'text-[10px] md:text-xs'}`}>
          Built by Jaybird Web Design & Development, LLC
        </p>
      </div>
    </footer>
  )
}

export default Footer
