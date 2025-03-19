"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type StatusType = "Borrowed" | "Returned" | "Late Return";

interface StatusDropdownProps {
  status: StatusType;
  onStatusChange: (status: StatusType) => void;
}

export const BorrowStatusDropdown: React.FC<StatusDropdownProps> = ({
  status,
  onStatusChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getStatusColor = (statusType: StatusType) => {
    switch (statusType) {
      case "Borrowed":
        return "text-blue-500";
      case "Returned":
        return "text-green-500";
      case "Late Return":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className={cn(
          "inline-flex cursor-pointer items-center gap-1",
          getStatusColor(status),
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {status}
        <Image
          src="/icons/admin/caret-down.svg"
          alt="Change status"
          width={14}
          height={14}
        />
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-32 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            <button
              className={cn(
                "block w-full px-4 py-2 text-left text-sm",
                getStatusColor("Borrowed"),
                status === "Borrowed" ? "bg-blue-50" : "hover:bg-gray-100",
              )}
              onClick={() => {
                onStatusChange("Borrowed");
                setIsOpen(false);
              }}
            >
              Borrowed
            </button>
            <button
              className={cn(
                "block w-full px-4 py-2 text-left text-sm",
                getStatusColor("Returned"),
                status === "Returned" ? "bg-green-50" : "hover:bg-gray-100",
              )}
              onClick={() => {
                onStatusChange("Returned");
                setIsOpen(false);
              }}
            >
              Returned
            </button>
            <button
              className={cn(
                "block w-full px-4 py-2 text-left text-sm",
                getStatusColor("Late Return"),
                status === "Late Return" ? "bg-red-50" : "hover:bg-gray-100",
              )}
              onClick={() => {
                onStatusChange("Late Return");
                setIsOpen(false);
              }}
            >
              Late Return
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
