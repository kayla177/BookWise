"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { requestAdminAccess } from "@/lib/actions/user";
import { toast } from "sonner";
import { Badge } from "@/components/ui/Badge";
import { HelpCircle } from "lucide-react";

interface AdminRequestProps {
  userId: string;
  currentStatus: string | null;
  currentRole: string | null;
}

const AdminRequest: React.FC<AdminRequestProps> = ({
  userId,
  currentStatus,
  currentRole,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const isPending = currentStatus === "PENDING";
  const isAdmin = currentRole === "ADMIN";

  const handleRequest = async () => {
    setIsLoading(true);
    try {
      const result = await requestAdminAccess(userId);

      if (result.success) {
        toast.success("Admin request submitted", {
          description:
            "Your request is pending approval. You'll be notified once it's reviewed.",
        });
        // Force a page refresh to update the UI
        window.location.reload();
      } else {
        toast.error("Request failed", {
          description: result.error || "An error occurred. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error requesting admin access:", error);
      toast.error("Request failed", {
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-dark-400 p-5 rounded-2xl shadow-lg w-full mt-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg text-white">
          Administrative Access
        </h3>
        {isPending && <Badge className="bg-amber-500">Pending</Badge>}
        {isAdmin && <Badge className="bg-green-500">Admin</Badge>}
      </div>

      <p className="text-sm text-light-100 mb-3">
        {isAdmin
          ? "You have administrative privileges. You can manage books, users, and more."
          : isPending
            ? "Your admin request is pending approval. We'll notify you once it's reviewed."
            : "Need to manage books and users? Request admin privileges for BookWise."}
      </p>

      {!isAdmin && !isPending && (
        <Button
          className="w-full bg-amber-600 hover:bg-amber-700"
          onClick={handleRequest}
          disabled={isLoading}
        >
          {isLoading ? "Submitting..." : "Request Admin Access"}
        </Button>
      )}

      {isAdmin && (
        <Button
          className="w-full bg-primary hover:bg-primary/90"
          onClick={() => (window.location.href = "/admin")}
        >
          Access Admin Dashboard
        </Button>
      )}

      {isPending && (
        <div className="flex items-center gap-2 mt-2 text-xs text-light-300">
          <HelpCircle size={14} />
          <p>Requests are typically reviewed within 24-48 hours.</p>
        </div>
      )}
    </Card>
  );
};

export default AdminRequest;
