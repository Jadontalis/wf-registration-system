"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { DeleteUserButton } from "@/components/admin/DeleteUserButton"

export type User = {
  id: string
  full_name: string
  email: string
  role: "ADMIN" | "USER"
  competitor_type: string
  bios?: string | null
  address?: string
  phone?: string
}

const RoleCell = ({ row, table }: { row: any, table: any }) => {
  const user = row.original
  const meta = table.options.meta as any
  
  // Check if there is a pending change for this user
  const pendingRole = meta?.pendingChanges?.[user.id]
  const currentRole = pendingRole || user.role

  const onRoleChange = (newRole: "ADMIN" | "USER") => {
     meta?.updateRole?.(user.id, newRole)
  }

  return (
      <Select onValueChange={onRoleChange} value={currentRole}>
        <SelectTrigger className={cn("w-[100px] bg-transparent border-white/10 text-white h-8 cursor-pointer", pendingRole && "border-yellow-500 text-yellow-500")}>
            <SelectValue placeholder="Role" />
        </SelectTrigger>
        <SelectContent className="bg-[#0a0f1a] border-white/10 text-white">
            <SelectItem value="USER" className="focus:bg-white/10 focus:text-white cursor-pointer">USER</SelectItem>
            <SelectItem value="ADMIN" className="focus:bg-white/10 focus:text-white cursor-pointer">ADMIN</SelectItem>
        </SelectContent>
      </Select>
  )
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "full_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent hover:text-white p-0"
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium text-white">{row.getValue("full_name")}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent hover:text-white p-0"
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "bios",
    header: "Bio",
    cell: ({ row }) => <div className="truncate max-w-[200px]">{row.getValue("bios")}</div>,
  },
  {
    accessorKey: "competitor_type",
    header: "Competitor Type",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row, table }) => <RoleCell row={row} table={table} />,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original
      return (
        <div className="flex justify-end">
          <DeleteUserButton userId={user.id} userName={user.full_name} />
        </div>
      )
    },
  },
]
