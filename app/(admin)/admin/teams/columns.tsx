"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export type Team = {
  id: string;
  teamName: string | null;
  horseName: string | null;
  status: "APPROVED" | "REJECTED" | "PENDING";
  riderName: string | null;
  skierName: string | null;
};

export const columns: ColumnDef<Team>[] = [
  {
    accessorKey: "teamName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Team Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="text-white">{row.getValue("teamName") || "-"}</div>,
  },
  {
    accessorKey: "horseName",
    header: "Horse Name",
    cell: ({ row }) => <div className="text-gray-300">{row.getValue("horseName") || "-"}</div>,
  },
  {
    accessorKey: "riderName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Rider
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="text-gray-300">{row.getValue("riderName")}</div>,
  },
  {
    accessorKey: "skierName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Skier/Boarder
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="text-gray-300">{row.getValue("skierName")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <div
          className={`font-medium ${
            status === "APPROVED"
              ? "text-green-400"
              : status === "REJECTED"
              ? "text-red-400"
              : "text-yellow-400"
          }`}
        >
          {status}
        </div>
      );
    },
  },
];
