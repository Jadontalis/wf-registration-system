"use client";

import React, { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { scratchTeam } from "@/lib/actions/registration";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface Registration {
  teamId: string;
  teamNumber: number;
  division: string | null;
  horseName: string | null;
  horseOwner: string | null;
  status: string;
  createdAt: Date | null;
  riderName: string;
  riderId: string;
  skierName: string;
  skierId: string;
  creatorName: string;
  creatorId: string;
  cartStatus: string;
}

interface AccountActivityListProps {
  registrations: Registration[];
  currentUserId: string;
}

const RegistrationCard = ({ reg, currentUserId }: { reg: Registration, currentUserId: string }) => {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      const result = await scratchTeam(reg.teamId);
      if (result.success) {
        toast.success(result.message);
        setOpen(false);
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <Card className="mb-4 bg-white/5 border-white/10 text-white">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold">
              Team #{reg.teamNumber} - {reg.division || 'No Division'}
            </CardTitle>
            <p className="text-sm text-gray-400">
              Registered on {reg.createdAt ? format(new Date(reg.createdAt), 'PPP') : 'Unknown date'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={reg.status === 'APPROVED' ? 'default' : 'secondary'}>
              {reg.status}
            </Badge>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm" className="h-6 px-2 text-xs cursor-pointer hover:bg-red-600">
                  Scratch
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-slate-900 text-white border-slate-800">
                <DialogHeader>
                  <DialogTitle>Are you sure you want to delete?</DialogTitle>
                  <DialogDescription className="text-slate-400">
                    NOTE: THIS WILL SCRATCH THE TEAM IF YOU PROCEED?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending} className="bg-transparent border-slate-700 text-white hover:bg-slate-800">
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleDelete} disabled={isPending} className="cursor-pointer">
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-1">Team Members</h4>
            <p className="text-sm">
              <span className="font-semibold">Rider:</span> {reg.riderName} {reg.riderId === currentUserId && '(You)'}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Skier/Boarder:</span> {reg.skierName} {reg.skierId === currentUserId && '(You)'}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-1">Horse Details</h4>
            <p className="text-sm">
              <span className="font-semibold">Name:</span> {reg.horseName || 'N/A'}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Owner:</span> {reg.horseOwner || 'N/A'}
            </p>
          </div>
        </div>
        {reg.creatorId !== currentUserId && (
            <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-xs text-gray-400">
                    Registered by: <span className="text-white">{reg.creatorName}</span>
                </p>
            </div>
        )}
      </CardContent>
    </Card>
  );
};

const AccountActivityList = ({ registrations, currentUserId }: AccountActivityListProps) => {
  const myRegistrations = registrations.filter(r => r.creatorId === currentUserId);
  const invitedRegistrations = registrations.filter(r => r.creatorId !== currentUserId);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4 text-white">My Registrations</h2>
        {myRegistrations.length > 0 ? (
          myRegistrations.map(reg => (
            <RegistrationCard key={reg.teamId} reg={reg} currentUserId={currentUserId} />
          ))
        ) : (
          <p className="text-gray-400">No registrations found.</p>
        )}
      </div>

      {invitedRegistrations.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-white">Teams I've Been Added To</h2>
          {invitedRegistrations.map(reg => (
            <RegistrationCard key={reg.teamId} reg={reg} currentUserId={currentUserId} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AccountActivityList;
