"use client";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { adminSideBarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import {
  Home,
  Users,
  BookOpen,
  Bookmark,
  Layers,
  ClipboardList,
  CheckCircle,
  Clock,
  XCircle,
  Trophy,
  Medal,
  Smile,
  Snowflake,
  Menu,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MobileNav = () => {
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
    <section className="w-full max-w-[264px] sm:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Menu size={36} className="cursor-pointer text-white" />
        </SheetTrigger>
        <SheetContent side="left" className="border-none bg-[#0a0f1a] text-white">
            <SheetTitle className="hidden">Menu</SheetTitle>
            <SheetDescription className="hidden">Mobile Navigation Menu</SheetDescription>
          <Link href="/admin" className="flex items-center gap-1 pl-6 pt-6">
            <Image
              src="/icons/logo.png"
              alt="Logo"
              width={75}
              height={75}
              className="h-auto"
            />
          </Link>

          <div className="flex h-[calc(100vh-72px)] flex-col justify-between overflow-y-auto">
            <SheetClose asChild>
              <section className="flex h-full flex-col gap-6 pt-16 pb-10 px-6 text-white">
                {adminSideBarLinks.map((link) => {
                  const isActive =
                    link.route === "/admin"
                      ? pathname === "/admin"
                      : pathname === link.route ||
                        pathname.startsWith(`${link.route}/`);

                  // Map icons based on text or route
                  let Icon = Home;
                  if (link.text === "All Users") Icon = Users;
                  if (link.text === "Registration") Icon = ClipboardList;
                  if (link.text === "Teams") Icon = BookOpen;
                  if (link.text === "Waitlist") Icon = Bookmark;
                  if (link.text === "Divisions") Icon = Layers;

                  return (
                    <div key={link.text}>
                      <SheetClose asChild>
                        <Link
                          href={link.route}
                          className={cn(
                            "flex gap-4 items-center p-4 rounded-lg w-full max-w-60",
                            {
                              "bg-white/10": isActive,
                            }
                          )}
                        >
                          <Icon size={20} />
                          <p className="font-semibold">{link.text}</p>
                        </Link>
                      </SheetClose>
                      {link.subItems && isActive && (
                        <div className="ml-12 mt-2 flex flex-col gap-2">
                          {link.subItems.map((subItem: any) => {
                            const isSubActive = pathname === subItem.route;
                            const SubIcon = subItem.icon
                              ? iconMap[subItem.icon]
                              : null;

                            return (
                              <SheetClose asChild key={subItem.text}>
                                <Link
                                  href={subItem.route}
                                  className={cn(
                                    "flex items-center gap-2 text-sm font-medium hover:text-white py-2",
                                    {
                                      "text-white": isSubActive,
                                      "text-gray-500": !isSubActive,
                                    }
                                  )}
                                >
                                  {SubIcon && <SubIcon size={16} />}
                                  {subItem.text}
                                </Link>
                              </SheetClose>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </section>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default MobileNav;
