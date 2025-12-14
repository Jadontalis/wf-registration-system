import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const Header = async () => {
    const session = await auth();

    return (
        <header className="flex items-center justify-between px-8 py-4 bg-black/20 backdrop-blur-lg border-b border-white/10 text-white">
            <div>
                <h2 className="text-xl font-semibold">Welcome, {session?.user?.name}</h2>
                <p className="text-sm text-gray-400">Manage the Whitefish Skijoring portal here.</p>
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
    )
}

export default Header;
