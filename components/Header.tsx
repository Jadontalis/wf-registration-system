"use client";
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Header = () => {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

  return <header className="my-10 w-full flex justify-between items-center gap-5 px-4">
    <Link href="/">
        <Image src="/icons/logo.png" alt="logo" width={90} height={90} />
    </Link>
    
    {/* Desktop Navigation */}
    <ul className="hidden md:flex flex-row items-center gap-8">
        <li>
            <Link href="/" className={cn(
                'text-lg md:text-xl cursor-pointer capitalize text-white font-semibold hover:text-gray-200 transition-colors',
                pathname === '/home' && 'underline underline-offset-4'
            )}>Home</Link>
        </li>
        <li>
            <Link href="/registration-cart" className={cn(
                'text-lg md:text-xl cursor-pointer capitalize text-white font-semibold hover:text-gray-200 transition-colors',
                pathname === '/registration-cart' && 'underline underline-offset-4'
            )}>Registration Cart</Link>
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
                            'text-xl cursor-pointer capitalize text-white font-semibold hover:text-gray-200 transition-colors',
                            pathname === '/home' && 'underline underline-offset-4'
                        )}>
                        Home
                    </Link>
                </li>
                <li>
                    <Link 
                        href="/registration-cart"
                        onClick={() => setIsMenuOpen(false)}
                        className={cn(
                            'text-xl cursor-pointer capitalize text-white font-semibold hover:text-gray-200 transition-colors',
                            pathname === '/registration-cart' && 'underline underline-offset-4'
                        )}
                    >
                        Registration Cart
                    </Link>
                </li>
            </ul>
        </div>
    )}
  </header>
}

export default Header