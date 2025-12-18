"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Maximize2 } from "lucide-react";
import { useState } from "react";

interface ExpandableChartProps {
  title: string;
  children: React.ReactNode;
  details?: React.ReactNode;
  className?: string;
}

export function ExpandableChart({ 
  title, 
  children, 
  details,
  className 
}: ExpandableChartProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`bg-black/20 backdrop-blur-md p-6 rounded-xl border border-white/10 hover:border-white/50 transition-colors relative group ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white text-lg font-bold">{title}</h3>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <Maximize2 className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh] bg-[#0a0f1a] border-t border-white/10 text-white overflow-y-auto">
            <SheetHeader className="mb-6 px-10 pt-10">
              <SheetTitle className="text-white text-2xl">{title}</SheetTitle>
            </SheetHeader>
            
            <div className="space-y-8 px-10">
              <div className="h-[500px] w-full bg-white/5 rounded-xl p-6">
                {children}
              </div>
              
              {details && (
                <div className="space-y-4 pb-10">
                  <h4 className="text-xl font-semibold text-white">Details</h4>
                  {details}
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <div className="h-[350px] w-full">
        {children}
      </div>
    </div>
  );
}
