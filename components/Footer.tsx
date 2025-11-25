import React from 'react'

const Footer = () => {
  return (
    <footer className="w-full py-8 px-6 mt-auto">
      <div className="flex flex-col items-center justify-center gap-1 text-center">
        <p className="text-white text-xs md:text-sm">
          © {new Date().getFullYear()} Whitefish Skijoring Nonprofit Association
        </p>
        <p className="text-white/70 text-[10px] md:text-xs">
          Built by Jaybird Web Design & Development, LLC
        </p>
      </div>
    </footer>
  )
}

export default Footer
