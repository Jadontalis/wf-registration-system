"use client";

import { useState } from "react";
import { MoreHorizontal, Check, Clock, X, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RegistrationRow } from "@/app/(admin)/admin/registration/columns";
import { updateTeamStatus, deleteTeam } from "@/lib/actions/admin";
import { toast } from "sonner";

interface RegistrationActionsProps {
  row: RegistrationRow;
}

export function RegistrationActions({ row }: RegistrationActionsProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusUpdate = async (status: 'APPROVED' | 'PENDING') => {
    if (!row.teamId) return;
    setIsLoading(true);
    try {
      const result = await updateTeamStatus(row.teamId, status);
      if (result.success) {
        toast.success(`Team status updated to ${status}`);
        setIsSheetOpen(false);
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!row.teamId) return;
    setIsLoading(true);
    try {
      const result = await deleteTeam(row.teamId);
      if (result.success) {
        toast.success("Team deleted successfully");
        setIsDeleteDialogOpen(false);
        setIsSheetOpen(false);
      } else {
        toast.error("Failed to delete team");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (!row.teamId) {
    return <div className="text-gray-500 text-xs">No Actions</div>;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-[#0a0f1a] border-white/10 text-white">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(row.id)}
            className="cursor-pointer hover:bg-white/10 focus:bg-white/10"
          >
            Copy Cart ID
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-white/10" />
          <DropdownMenuItem 
            onClick={() => setIsSheetOpen(true)}
            className="cursor-pointer hover:bg-white/10 focus:bg-white/10"
          >
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => handleStatusUpdate('APPROVED')}
            className="cursor-pointer hover:bg-white/10 focus:bg-white/10 text-green-400"
          >
            <Check className="mr-2 h-4 w-4" />
            Approve
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => handleStatusUpdate('PENDING')}
            className="cursor-pointer hover:bg-white/10 focus:bg-white/10 text-yellow-400"
          >
            <Clock className="mr-2 h-4 w-4" />
            Waitlist
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setIsDeleteDialogOpen(true)}
            className="cursor-pointer hover:bg-white/10 focus:bg-white/10 text-red-400"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Team
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* View Details Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="bg-[#0a0f1a] border-white/10 text-white sm:max-w-xl p-6">
          <SheetHeader className="px-1">
            <SheetTitle className="text-white text-2xl">Team Details</SheetTitle>
            <SheetDescription className="text-gray-400">
              Detailed information for Team #{row.teamNumber}
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-6 space-y-6 px-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-gray-500">Cart ID</h4>
                <p className="text-sm font-mono text-white">{row.id}</p>
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-gray-500">Status</h4>
                <p className={`text-sm font-bold ${
                  row.status === "APPROVED" ? "text-green-400" : 
                  row.status === "REJECTED" ? "text-red-400" : "text-yellow-400"
                }`}>
                  {row.status}
                </p>
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-gray-500">User</h4>
                <p className="text-sm text-white">{row.userName}</p>
                <p className="text-xs text-gray-400">{row.userEmail}</p>
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-gray-500">Division</h4>
                <p className="text-sm text-white">{row.division}</p>
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-gray-500">Rider</h4>
                <p className="text-sm text-white">{row.riderName}</p>
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-gray-500">Skier</h4>
                <p className="text-sm text-white">{row.skierName}</p>
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-gray-500">Horse</h4>
                <p className="text-sm text-white">{row.horseName}</p>
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-gray-500">Submitted</h4>
                <p className="text-sm text-white">{new Date(row.updatedAt).toLocaleString()}</p>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6">
              <h4 className="text-sm font-medium text-gray-500 mb-4">Quick Actions</h4>
              <div className="flex gap-3">
                <Button 
                  onClick={() => handleStatusUpdate('APPROVED')}
                  disabled={isLoading}
                  className="flex-1 bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/50 cursor-pointer"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Approve
                </Button>
                <Button 
                  onClick={() => handleStatusUpdate('PENDING')}
                  disabled={isLoading}
                  className="flex-1 bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 border border-yellow-500/50 cursor-pointer"
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Waitlist
                </Button>
                <Button 
                  onClick={() => setIsDeleteDialogOpen(true)}
                  disabled={isLoading}
                  className="flex-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/50 cursor-pointer"
                >
                  <X className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-[#0a0f1a] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Delete Team</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete this team? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="ghost"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="hover:bg-white/10 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? "Deleting..." : "Delete Team"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
