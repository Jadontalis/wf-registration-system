"use client"

import { DataTable } from "@/components/ui/data-table"
import { columns, User } from "./columns"
import { useState, useTransition } from "react"
import { updateUserRoleBulk } from "@/lib/actions/user"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface UsersTableProps {
    data: User[]
}

export function UsersTable({ data }: UsersTableProps) {
    const [pendingChanges, setPendingChanges] = useState<Record<string, "ADMIN" | "USER">>({})
    const [isSaving, startTransition] = useTransition()
    const router = useRouter()

    const updateRole = (userId: string, role: "ADMIN" | "USER") => {
        const originalUser = data.find(u => u.id === userId)
        if (originalUser && originalUser.role === role) {
             const newPending = { ...pendingChanges }
             delete newPending[userId]
             setPendingChanges(newPending)
        } else {
            setPendingChanges(prev => ({
                ...prev,
                [userId]: role
            }))
        }
    }

    const saveChanges = () => {
        startTransition(async () => {
            const updates = Object.entries(pendingChanges).map(([id, role]) => ({ id, role }))
            const result = await updateUserRoleBulk(updates)
            
            if (result.success) {
                toast.success("Changes saved successfully")
                setPendingChanges({})
                router.refresh()
            } else {
                toast.error(result.error || "Failed to save changes")
            }
        })
    }

    const hasChanges = Object.keys(pendingChanges).length > 0

    return (
        <DataTable 
            columns={columns} 
            data={data} 
            searchKey="full_name" 
            meta={{
                updateRole,
                pendingChanges
            }}
            onSave={saveChanges}
            hasPendingChanges={hasChanges}
            isSaving={isSaving}
        />
    )
}
