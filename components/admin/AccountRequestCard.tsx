import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Trash2 } from "lucide-react";

interface User {
  id: string;
  fullName: string;
  email: string;
  universityId: number;
  universityCard: string;
  dateJoined: string;
}

interface AccountRequestCardProps {
  pendingUsers: User[];
  viewIdCard: (user: User) => void;
  handleApprove: (user: User) => void;
  handleDeny: (user: User) => void;
}

const AccountRequestCard = ({
  pendingUsers,
  viewIdCard,
  handleApprove,
  handleDeny,
}: AccountRequestCardProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Date Joined</TableHead>
          <TableHead>University ID No</TableHead>
          <TableHead>University ID Card</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pendingUsers.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-light-400 flex items-center justify-center">
                  {user.fullName.charAt(0)}
                </div>
                <div>
                  <p className="text-dark-400 font-medium">{user.fullName}</p>
                  <p className="text-light-500 text-sm">{user.email}</p>
                </div>
              </div>
            </TableCell>
            <TableCell>{user.dateJoined}</TableCell>
            <TableCell>{user.universityId}</TableCell>
            <TableCell>
              <Button
                variant="link"
                className="text-blue-500 flex items-center gap-1"
                onClick={() => viewIdCard(user)}
              >
                <Eye size={16} className="text-blue-500" />
                View ID Card
              </Button>
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleApprove(user)}
                  className="bg-green-500 text-white hover:bg-green-600"
                >
                  Approve Account
                </Button>
                <Button
                  onClick={() => handleDeny(user)}
                  variant="ghost"
                  className="text-red-500"
                >
                  <Trash2 size={18} className="text-red-500" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
export default AccountRequestCard;
