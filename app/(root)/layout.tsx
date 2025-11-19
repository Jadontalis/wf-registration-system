import { Main } from 'next/document'
import type { ReactNode } from 'react'
import Header from "@/components/Header";
import Image from 'next/image';

const Layout = ({ children }: { children: ReactNode }) => {
  return (  
    <main className='root-container relative'>
        <div className="fixed inset-0 -z-10">
            <Image 
                src="/images/EXPORT-BG.svg" 
                alt="Background" 
                fill
                className="object-cover"
                priority
            />
        </div>
        <div className="mx-auto max-w-7xl relative z-10">
            <Header />
            <div className="mt-20 pb-20">{children}</div>
        </div>
    </main>
  );
};

export default Layout