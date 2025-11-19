"use client";
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const Header = () => {
    const pathname = usePathname();

  return <header className="my-10 flex justify-between gap-5">
    <Link href="/">
        <Image src="/icons/logo.png" alt="logo" width={90} height={90} />
    </Link>
    <ul className="flex flex-row items-center gap-8">
        <li>
            <Link href="/home" className={cn(
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
  </header>
}

export default Header