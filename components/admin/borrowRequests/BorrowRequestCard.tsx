"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IKImage } from "imagekitio-next";
import { BorrowStatusDropdown } from "@/components/admin/borrowRequests/BorrowStatusDropdown";
import { Button } from "@/components/ui/button";

interface BorrowRequestCardProps {
  borrowRequests: BorrowRequest[];
  handleStatusChange: (
    requestId: string,
    newStatus: "Borrowed" | "Returned" | "Late Return",
  ) => void;
  generateReceipt: (requestId: string) => void;
}

const BorrowRequestCard: React.FC<BorrowRequestCardProps> = ({
  borrowRequests,
  handleStatusChange,
  generateReceipt,
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Book</TableHead>
          <TableHead>User Requested</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Borrowed date</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Return date</TableHead>
          <TableHead>Receipt</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {borrowRequests.map((request) => (
          <TableRow key={request.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <div className="h-12 w-10 relative">
                  {request.bookCover ? (
                    <IKImage
                      path={request.bookCover}
                      alt={request.bookTitle}
                      width={40}
                      height={48}
                      className="object-cover rounded"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-12 w-10 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                      No Image
                    </div>
                  )}
                </div>
                <p className="font-medium text-sm">{request.bookTitle}</p>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-light-400 flex items-center justify-center">
                  {request.userName.charAt(0)}
                </div>
                <div>
                  <p className="text-dark-400 font-medium">
                    {request.userName}
                  </p>
                  <p className="text-light-500 text-xs">{request.userEmail}</p>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <BorrowStatusDropdown
                status={request.status}
                onStatusChange={(newStatus) =>
                  handleStatusChange(request.id, newStatus)
                }
              />
            </TableCell>
            <TableCell>{request.borrowedDate}</TableCell>
            <TableCell>{request.dueDate}</TableCell>
            <TableCell>{request.returnDate}</TableCell>
            <TableCell>
              <Button
                className="book-receipt_admin-btn"
                onClick={() => {
                  console.log(
                    "[BORROWREQUESTCARD] Generate button clicked, request ID:",
                    request.id,
                  );
                  generateReceipt(request.id);
                }}
              >
                Generate
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default BorrowRequestCard;
