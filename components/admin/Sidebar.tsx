"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { adminSideBarLinks } from '@/constants';
import { cn } from '@/lib/utils';
import { Home, Users, BookOpen, Bookmark, Layers, ClipboardList } from 'lucide-react';
import Image from 'next/image';

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="sticky left-0 top-0 flex h-screen w-fit flex-col justify-between bg-black/20 backdrop-blur-lg p-6 pt-10 text-white max-sm:hidden lg:w-[264px] border-r border-white/10">
      <div className="flex flex-1 flex-col gap-6">
        <div className="flex items-center gap-2 px-4">
             <Image src="/icons/logo.png" alt="Logo" width={75} height={75} className="h-auto" />
        </div>

        <div className="flex flex-col gap-2">
            {adminSideBarLinks.map((link) => {
            const isActive = link.route === "/admin" 
                ? pathname === "/admin" 
                : pathname === link.route || pathname.startsWith(`${link.route}/`);
            
            // Map icons based on text or route since we don't have the images yet
            let Icon = Home;
            if (link.text === "All Users") Icon = Users;
            if (link.text === "Registration") Icon = ClipboardList;
            if (link.text === "Teams") Icon = BookOpen;
            if (link.text === "Waitlist") Icon = Bookmark;
            if (link.text === "Divisions") Icon = Layers;

            return (
                <Link
                href={link.route}
                key={link.text}
                className={cn(
                    'flex gap-4 items-center p-4 rounded-lg justify-start border border-transparent',
                    {
                    'border-white/50 text-white': isActive,
                    'text-gray-400 hover:border-white/50 hover:text-white': !isActive,
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
