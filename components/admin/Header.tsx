import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import MobileNav from "./MobileNav";
import Greeting from "./Greeting";

const Header = async () => {
    const session = await auth();

    return (
        <>
            <header className="flex items-center justify-between px-8 py-2 bg-black/20 backdrop-blur-lg border-b border-white/10 text-white">
                <div className="flex items-center gap-4">
                    <MobileNav />
                    <div className="hidden md:block">
                        <Greeting name={session?.user?.name} className="text-xl font-semibold" />
                        <p className="text-sm text-gray-400">Manage the Whitefish Skijoring portal here.</p>
                    </div>
                </div>
                
                <form action={async () => {
                    "use server";
                    await signOut();
                }}>
                    <Button variant="destructive" className="flex items-center gap-2 cursor-pointer">
                        <LogOut size={18} />
                        Logout
                    </Button>
                </form>
            </header>

            <div className="md:hidden bg-black/20 backdrop-blur-lg border-b border-white/10 text-white px-8 py-3 text-center">
                 <Greeting name={session?.user?.name} className="text-sm font-semibold" />
                 <p className="text-xs text-gray-400">Manage the Whitefish Skijoring portal here.</p>
            </div>
        </>
    )
}

export default Header;
