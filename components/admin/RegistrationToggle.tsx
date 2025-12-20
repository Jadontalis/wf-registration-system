"use client";

import { Button } from "@/components/ui/button";
import { toggleRegistrationStatus } from "@/lib/actions/admin";
import { useTransition } from "react";
import { toast } from "sonner";

interface RegistrationToggleProps {
    isOpen: boolean;
}

export const RegistrationToggle = ({ isOpen }: RegistrationToggleProps) => {
    const [isPending, startTransition] = useTransition();

    const handleToggle = () => {
        startTransition(async () => {
            const result = await toggleRegistrationStatus();
            if (result.success) {
                toast.success(isOpen ? "Registration Closed" : "Registration Opened");
            } else {
                toast.error("Failed to update status");
            }
        });
    };

    return (
        <Button 
            onClick={handleToggle} 
            disabled={isPending}
            variant={isOpen ? "destructive" : "default"}
            className={`${!isOpen ? "bg-white text-black hover:bg-gray-200" : "bg-red-600 hover:bg-red-700 text-white"} cursor-pointer`}
        >
            {isOpen ? "Close Registration" : "Open Registration"}
        </Button>
    );
};
