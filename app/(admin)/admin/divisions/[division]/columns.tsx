"use client"

import { ColumnDef } from "@tanstack/react-table"

export type TeamRow = {
  id: string
  teamNumber: number
  riderName: string
  riderBio: string | null
  skierName: string
  skierBio: string | null
  horseName: string | null
  horseOwner: string | null
}

export const columns: ColumnDef<TeamRow>[] = [
  {
    accessorKey: "teamNumber",
    header: "Team #",
    cell: ({ row }) => row.getValue("teamNumber") || "N/A",
  },
  {
    accessorKey: "riderName",
    header: "Rider",
  },
  {
    accessorKey: "riderBio",
    header: "Rider Bio",
  },
  {
    accessorKey: "skierName",
    header: "Skier",
  },
  {
    accessorKey: "skierBio",
    header: "Skier Bio",
  },
  {
    accessorKey: "horseName",
    header: "Horse Name",
  },
  {
    accessorKey: "horseOwner",
    header: "Horse Owner",
  },
]
