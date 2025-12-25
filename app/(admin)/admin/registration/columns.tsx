"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RegistrationActions } from "@/components/admin/RegistrationActions";

export type RegistrationRow = {
  id: string;
  cartNumber: number;
  status: "APPROVED" | "PENDING" | "REJECTED" | "SUBMITTED";
  userName: string | null;
  userEmail: string | null;
  createdAt: Date;
  updatedAt: Date;
  teamId: string | null;
  teamNumber: number | null;
  division: string | null;
  horseName: string | null;
  riderName: string | null;
  skierName: string | null;
};

export const columns: ColumnDef<RegistrationRow>[] = [
  {
    accessorKey: "cartNumber",
    header: "Cart #",
    cell: ({ row }) => <div className="text-white font-mono">{row.getValue("cartNumber")}</div>,
  },
  {
    accessorKey: "userName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          User
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="text-white">{row.getValue("userName")}</div>,
  },
  {
    accessorKey: "userEmail",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="text-gray-300">{row.getValue("userEmail")}</div>,
  },
  {
    accessorKey: "teamNumber",
    header: "Team #",
    cell: ({ row }) => <div className="text-white font-mono">{row.getValue("teamNumber") || "-"}</div>,
  },
  {
    accessorKey: "division",
    header: "Division",
    cell: ({ row }) => <div className="text-gray-300">{row.getValue("division") || "-"}</div>,
  },
  {
    accessorKey: "riderName",
    header: "Rider",
    cell: ({ row }) => <div className="text-gray-300">{row.getValue("riderName") || "-"}</div>,
  },
  {
    accessorKey: "skierName",
    header: "Skier",
    cell: ({ row }) => <div className="text-gray-300">{row.getValue("skierName") || "-"}</div>,
  },
  {
    accessorKey: "horseName",
    header: "Horse",
    cell: ({ row }) => <div className="text-gray-300">{row.getValue("horseName") || "-"}</div>,
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
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return <div className="text-gray-300">{date.toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Last Updated
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("updatedAt"));
      return <div className="text-gray-300">{date.toLocaleDateString()}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <RegistrationActions row={row.original} />,
  },
];
