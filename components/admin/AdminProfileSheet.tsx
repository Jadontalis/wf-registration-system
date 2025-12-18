"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import AccountSettingsForm from "@/components/AccountSettingsForm";
import { Settings } from "lucide-react";
import { useState } from "react";

interface AdminProfileSheetProps {
  user: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AdminProfileSheet = ({ user, open, onOpenChange }: AdminProfileSheetProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-[#0a0f1a] border-l border-white/10 text-white overflow-y-auto w-full sm:max-w-xl">
        <SheetHeader className="px-8">
          <SheetTitle className="text-white">Account Settings</SheetTitle>
          <SheetDescription className="text-gray-400">
            Update your account details here.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 px-8">
            <AccountSettingsForm userId={user.id} initialData={user} />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AdminProfileSheet;
