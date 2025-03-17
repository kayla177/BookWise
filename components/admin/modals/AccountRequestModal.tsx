"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface User {
  id: string;
  fullName: string;
  email: string;
  universityId: number;
  universityCard: string;
  dateJoined: string;
}

interface AccountRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type: "approve" | "deny";
  user: User | null;
}

export const AccountRequestModal: React.FC<AccountRequestModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  type,
  user,
}) => {
  if (!isOpen || !user) return null;

  const isApprove = type === "approve";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <div
            className={cn(
              "rounded-full w-12 h-12 flex items-center justify-center",
              isApprove ? "bg-green-100" : "bg-red-100",
            )}
          >
            <Image
              src={
                isApprove ? "/icons/admin/tick.svg" : "/icons/admin/info.svg"
              }
              alt={isApprove ? "Approve" : "Deny"}
              width={24}
              height={24}
              className={isApprove ? "text-green-500" : "text-red-500"}
            />
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <Image
              src="/icons/admin/close.svg"
              alt="Close"
              width={24}
              height={24}
            />
          </button>
        </div>

        <h3 className="text-lg font-semibold mb-2">
          {isApprove ? "Approve Book Request" : "Deny Account Request"}
        </h3>

        <p className="text-gray-600 mb-6">
          {isApprove
            ? "Approve the student's account request and grant access. A confirmation email will be sent upon approval."
            : "Denying this request will notify the student they're not eligible due to unsuccessful ID card verification."}
        </p>

        <Button
          className={cn(
            "w-full py-3",
            isApprove
              ? "bg-green-500 hover:bg-green-600 text-white"
              : "bg-red-500 hover:bg-red-600 text-white",
          )}
          onClick={onConfirm}
        >
          {isApprove ? "Approve & Send Confirmation" : "Deny & Notify Student"}
        </Button>
      </div>
    </div>
  );
};
