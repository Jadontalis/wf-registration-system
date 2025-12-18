import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

interface RecentUser {
  id: string;
  full_name: string;
  email: string;
  created_at: Date | string | null;
  competitor_type: string;
  division: string | null;
}

interface RecentUsersTableProps {
  users: RecentUser[];
}

export const RecentUsersTable = ({ users }: RecentUsersTableProps) => {
  return (
    <div className="rounded-md border border-white/10 bg-black/20">
      <Table>
        <TableHeader>
          <TableRow className="border-white/10 hover:bg-white/5">
            <TableHead className="text-gray-400">Name</TableHead>
            <TableHead className="text-gray-400">Email</TableHead>
            <TableHead className="text-gray-400">Type</TableHead>
            <TableHead className="text-gray-400">Division</TableHead>
            <TableHead className="text-gray-400 text-right">Joined</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="border-white/10 hover:bg-white/5">
              <TableCell className="font-medium text-white">{user.full_name}</TableCell>
              <TableCell className="text-gray-300">{user.email}</TableCell>
              <TableCell className="text-gray-300">{user.competitor_type.replace(/_/g, ' ')}</TableCell>
              <TableCell className="text-gray-300">{user.division || '-'}</TableCell>
              <TableCell className="text-right text-gray-300">
                {user.created_at ? format(new Date(user.created_at), 'MMM d, yyyy') : '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
