import type { ReactNode } from 'react'
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from 'next/image';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();
  
  if (!session) {
    redirect("/sign-in");
  }

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
        <div className="w-full mx-auto max-w-7xl px-4 relative z-10 flex flex-col min-h-screen">
            <Header session = { session } />
              <div className="mt-20 pb-20 flex-1">{children}</div>
            <Footer />
        </div>
    </main>
  );
};

export default Layout