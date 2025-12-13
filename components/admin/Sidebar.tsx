"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { adminSideBarLinks } from '@/constants';
import { cn } from '@/lib/utils';
import { Home, Users, BookOpen, Bookmark } from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="sticky left-0 top-0 flex h-screen w-fit flex-col justify-between bg-[#0f172a] p-6 pt-10 text-white max-sm:hidden lg:w-[264px] border-r border-white/10">
      <div className="flex flex-1 flex-col gap-6">
        <div className="flex items-center gap-2 px-4">
             <h1 className="text-2xl font-bold font-bebas-neue tracking-wide">Admin Panel</h1>
        </div>

        <div className="flex flex-col gap-2">
            {adminSideBarLinks.map((link) => {
            const isActive = pathname === link.route || pathname.startsWith(`${link.route}/`);
            
            // Map icons based on text or route since we don't have the images yet
            let Icon = Home;
            if (link.text === "All Users") Icon = Users;
            if (link.text === "Teams") Icon = BookOpen;
            if (link.text === "Waitlist") Icon = Bookmark;

            return (
                <Link
                href={link.route}
                key={link.text}
                className={cn(
                    'flex gap-4 items-center p-4 rounded-lg justify-start transition-colors hover:bg-white/10',
                    {
                    'bg-white/20 text-white': isActive,
                    'text-gray-400': !isActive,
                    }
                )}
                >
                <Icon size={24} />
                <p className="text-base font-medium max-lg:hidden">
                    {link.text}
                </p>
                </Link>
            );
            })}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
