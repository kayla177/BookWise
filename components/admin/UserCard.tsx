"use client";

import React from "react";
import { Trash, Eye, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UserCardProps {
  user: {
    id: string;
    fullName: string;
    email: string;
    role: "USER" | "ADMIN";
    universityId: number;
    booksBorrowed: number;
  };
  onDelete: (id: string) => void;
  onRoleChange: (id: string, role: "USER" | "ADMIN") => void;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  onDelete,
  onRoleChange,
}) => {
  return (
    <tr className="border-b border-light-700 text-white">
      <td className="py-4 px-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">
          {user.fullName.charAt(0)}
        </div>
        <div>
          <p className="text-black text-sm font-semibold">{user.fullName}</p>
          <p className="text-xs text-gray-400">{user.email}</p>
        </div>
      </td>

      {/* Date Joined */}
      <td className="py-4 px-6 text-dark-600 text-sm">
        {new Date(user.dateJoined).toDateString()}
      </td>

      {/* Role Selector */}
      <td className="py-4 px-6">
        <button
          className={cn(
            "px-3 py-1 rounded-lg text-sm font-medium",
            user.role === "ADMIN"
              ? "bg-green-300 text-green-800"
              : "bg-red-300 text-red-800",
          )}
          onClick={() =>
            onRoleChange(user.id, user.role === "ADMIN" ? "USER" : "ADMIN")
          }
        >
          {user.role}
          <ChevronDown className="inline-block w-4 h-4 ml-2" />
        </button>
      </td>

      {/* Books Borrowed Count */}
      <td className="py-4 px-6 text-dark-600 text-sm">{user.booksBorrowed}</td>

      {/* University ID */}
      <td className="py-4 px-6 text-dark-600 text-sm">{user.universityId}</td>

      {/* View ID Card */}
      <td className="py-4 px-6 text-center">
        <Button
          variant="link"
          className="text-blue-400 flex items-center gap-1"
        >
          <Eye className="w-4 h-4" />
          View ID Card
        </Button>
      </td>

      {/* Delete User */}
      <td className="py-4 px-6 text-center">
        <Button
          variant="ghost"
          onClick={() => onDelete(user.id)}
          className="text-red-400 p-2"
        >
          <Trash className="w-5 h-5" />
        </Button>
      </td>
    </tr>
  );
};

export default UserCard;
