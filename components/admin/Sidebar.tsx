"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { adminSideBarLinks } from '@/constants';
import { cn } from '@/lib/utils';
import { Home, Users, BookOpen, Bookmark, Layers, ClipboardList, CheckCircle, Clock, XCircle, Trophy, Medal, Smile, Snowflake, User, ChevronUp, Settings, LogOut } from 'lucide-react';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AdminProfileSheet from './AdminProfileSheet';
import { useState } from 'react';

interface SidebarProps {
    user?: any;
}

const Sidebar = ({ user }: SidebarProps) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const pathname = usePathname();

  const iconMap: { [key: string]: any } = {
    CheckCircle,
    Clock,
    XCircle,
    Trophy,
    Medal,
    Smile,
    Snowflake,
  };

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
              <div key={link.text}>
                <Link
                  href={link.route}
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
                {link.subItems && isActive && (
                  <div className="ml-12 mt-2 flex flex-col gap-2">
                    {link.subItems.map((subItem: any) => {
                      const isSubActive = pathname === subItem.route;
                      const SubIcon = subItem.icon ? iconMap[subItem.icon] : null;

                      return (
                        <Link
                          key={subItem.text}
                          href={subItem.route}
                          className={cn(
                            'flex items-center gap-2 text-base font-medium hover:text-white py-3',
                            {
                              'text-white': isSubActive,
                              'text-gray-500': !isSubActive,
                            }
                          )}
                        >
                          {SubIcon && <SubIcon size={20} />}
                          {subItem.text}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
            })}
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-white/10 pt-4">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors w-full">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white">
                        <User size={20} />
                    </div>
                    <div className="flex flex-col flex-1 overflow-hidden">
                        <p className="text-sm font-medium text-white truncate">{user?.name || 'Admin'}</p>
                        <p className="text-xs text-gray-400 truncate">{user?.email || ''}</p>
                    </div>
                    <ChevronUp size={16} className="text-gray-400" />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-[#0a0f1a] border-white/10 text-white mb-2">
                <DropdownMenuItem onSelect={() => setIsSheetOpen(true)} className="focus:bg-white/10 focus:text-white cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Account Settings</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        <AdminProfileSheet user={user} open={isSheetOpen} onOpenChange={setIsSheetOpen} />
      </div>
    </div>
  );
};

export default Sidebar;
