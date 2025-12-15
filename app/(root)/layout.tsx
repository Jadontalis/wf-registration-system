import type { ReactNode } from 'react'
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from 'next/image';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

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
            
            <div className="flex justify-center pb-8">
                <Link href="https://whitefishskijoring.org" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="text-white border-white hover:bg-white hover:text-black bg-transparent/20 backdrop-blur-sm cursor-pointer">
                        Back to Whitefish Skijoring Website
                    </Button>
                </Link>
            </div>

            <Footer />
        </div>
    </main>
  );
};

export default Layout