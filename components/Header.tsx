"use client";
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation';
import { cn, getInitials } from '@/lib/utils';
import { useState } from 'react';
import { Menu, X, LogOut, ChevronDown, ChevronUp } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Session } from 'next-auth';
import { Button } from "@/components/ui/button";
import { signOutUser } from "@/lib/actions/auth";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Header = ({ session }: {session: Session}) => {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false);

  return <header className="mt-10 mb-0 w-full flex justify-between items-center gap-5 px-4 pb-0">
    <Link href="/" className="hover:opacity-80 active:opacity-80 transition-opacity">
        <Image src="/icons/logo.png" alt="logo" width={90} height={90} />
    </Link>
    
    {/* Desktop Navigation */}
    <ul className="hidden md:flex flex-row items-center gap-8">
        <li>
            <Link href="/" className={cn(
                'text-lg md:text-xl cursor-pointer capitalize font-semibold',
                pathname === '/' ? 'text-white' : 'text-white/70 hover:text-white'
            )}>Home</Link>
        </li>
        {/* <li>
            <Link href="/registration-cart" className={cn(
                'text-lg md:text-xl cursor-pointer capitalize font-semibold',
                pathname === '/registration-cart' ? 'text-white' : 'text-white/70 hover:text-white'
            )}>Registration Cart</Link>
        </li> */}
        <li>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className="cursor-pointer hover:opacity-80 active:opacity-80 transition-opacity">
                        <Avatar>
                            <AvatarFallback className='bg-white text-black'>{ getInitials(session?.user?.name || 'PF')}</AvatarFallback>
                        </Avatar>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-[#0a0f1a] border-white/10 text-white">
                    <DropdownMenuItem className="cursor-pointer hover:bg-white/10 focus:bg-white/10 focus:text-white">
                        <Link href="/account-settings" className="w-full">Account Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer hover:bg-white/10 focus:bg-white/10 focus:text-white">
                        <Link href="/account-activity" className="w-full">Account Activity</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                        className="cursor-pointer hover:bg-white/10 focus:bg-white/10 text-white focus:text-white"
                        onClick={async () => await signOutUser()}
                    >
                        <div className="flex items-center gap-2 w-full">
                            <LogOut size={16} />
                            Logout
                        </div>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </li>
    </ul>

    {/* Mobile Hamburger Button */}
    <button 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden p-2 text-white hover:text-gray-200 transition-colors"
        aria-label="Toggle menu"
    >
        {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
    </button>

    {/* Mobile Menu */}
    {isMenuOpen && (
        <div className="absolute top-32 left-0 right-0 bg-[#0a0f1a]/95 backdrop-blur-sm md:hidden z-50 border-t border-white/10 shadow-2xl">
            <ul className="flex flex-col items-center gap-6 py-8">
                <li>
                    <Link 
                        href="/" 
                        onClick={() => setIsMenuOpen(false)}
                        className={cn(
                            'text-xl cursor-pointer capitalize font-semibold',
                            pathname === '/' ? 'text-white' : 'text-white/70 hover:text-white'
                        )}>
                        Home
                    </Link>
                </li>
                {/* <li>
                    <Link 
                        href="/registration-cart"
                        onClick={() => setIsMenuOpen(false)}
                        className={cn(
                            'text-xl cursor-pointer capitalize font-semibold',
                            pathname === '/registration-cart' ? 'text-white' : 'text-white/70 hover:text-white'
                        )}
                    >
                        Registration Cart
                    </Link> */}

                    <li>
                        <div className="flex flex-col items-center w-full">
                            <button 
                                onClick={() => setIsMobileProfileOpen(!isMobileProfileOpen)}
                                className={cn(
                                    'text-xl cursor-pointer capitalize text-white font-semibold hover:text-gray-200 transition-colors flex items-center gap-2',
                                    isMobileProfileOpen && 'text-gray-200'
                                )}
                            >
                                Profile
                                {isMobileProfileOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>
                            
                            {isMobileProfileOpen && (
                                <ul className="flex flex-col items-center gap-4 mt-4 w-full bg-white/5 py-4 rounded-lg animate-in slide-in-from-top-2 fade-in duration-200">
                                    <li>
                                        <Link 
                                            href="/account-settings"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="text-lg text-gray-300 hover:text-white transition-colors"
                                        >
                                            Account Settings
                                        </Link>
                                    </li>
                                    <li>
                                        <Link 
                                            href="/account-activity"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="text-lg text-gray-300 hover:text-white transition-colors"
                                        >
                                            Account Activity
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </div>
                    </li>
                
                <li className="mt-4 w-full px-4">
                    <Button 
                        onClick={async () => await signOutUser()}
                        variant="destructive" 
                        className="w-full flex items-center justify-center gap-2"
                    >
                        <LogOut size={20} />
                        Logout
                    </Button>
                </li>
            </ul>
        </div>
    )}
  </header>
}

export default Header