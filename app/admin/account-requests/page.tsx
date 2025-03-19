"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ImageKitProvider, IKImage } from "imagekitio-next";
import config from "@/lib/config";
import { AccountRequestModal } from "@/components/admin/modals/AccountRequestModal";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import AccountRequestCard from "@/components/admin/accountRequests/AccountRequestCard";

interface User {
  id: string;
  fullName: string;
  email: string;
  universityId: number;
  universityCard: string;
  dateJoined: string;
  status: string;
  role: string;
}

const Page = () => {
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isDenyModalOpen, setIsDenyModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [pendingAdminUsers, setPendingAdminUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewingCard, setViewingCard] = useState<{
    isOpen: boolean;
    url: string;
  }>({
    isOpen: false,
    url: "",
  });
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc"); // Default to newest first
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPendingUsers = async (
    order: "asc" | "desc" = "desc",
    page: number = 1,
  ) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/admin/account-requests?sort=${order}&page=${page}`,
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch account requests: ${response.statusText}`,
        );
      }

      const data = await response.json();

      // Transform data to match our component's expected format
      const formattedUsers = data.map((user: any) => ({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        universityId: user.universityId,
        universityCard: user.universityCard,
        dateJoined: user.createdAt,
        status: user.status,
        role: user.role,
      }));

      // Filter users based on status and role
      // - Pending account approval: status is PENDING and role is not ADMIN
      // - Pending admin requests: status is PENDING and user has made request through our feature
      //   (we'll need to distinguish them. For now, let's also check requested admin)

      // Filter for first-time account requests
      const newAccountRequests = formattedUsers.filter(
        (user: User) =>
          user.status === "PENDING" && user.role !== "ADMIN" && !user.role,
      );

      // Filter for admin requests - these are approved users requesting admin access
      const adminRequests = formattedUsers.filter(
        (user: User) => user.status === "PENDING" && user.role === "USER",
      );

      console.log("New account requests:", newAccountRequests);
      console.log("Admin requests:", adminRequests);

      setPendingUsers(newAccountRequests);
      setPendingAdminUsers(adminRequests);

      // Set total pages based on headers or response data
      if (response.headers.get("X-Total-Pages")) {
        setTotalPages(parseInt(response.headers.get("X-Total-Pages") || "1"));
      }
    } catch (err) {
      console.error("Error fetching pending users:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load account requests",
      );

      // For development, add some sample data if the API fails
      setPendingUsers([]);
      setPendingAdminUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingUsers(sortOrder, currentPage);
  }, [sortOrder, currentPage]);

  const toggleSortOrder = () => {
    const newOrder = sortOrder === "desc" ? "asc" : "desc";
    setSortOrder(newOrder);
    fetchPendingUsers(newOrder, currentPage);

    toast.success(
      newOrder === "asc" ? "Showing oldest first" : "Showing newest first",
    );
  };

  const handleApprove = (user: User) => {
    setSelectedUser(user);
    setIsApproveModalOpen(true);
  };

  const handleDeny = (user: User) => {
    setSelectedUser(user);
    setIsDenyModalOpen(true);
  };

  const confirmApprove = async () => {
    if (!selectedUser) return;

    try {
      const response = await fetch(
        `/api/admin/account-requests/${selectedUser.id}/approve`,
        {
          method: "POST",
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to approve user: ${response.statusText}`);
      }

      // Remove from pending list
      setPendingUsers(
        pendingUsers.filter((user) => user.id !== selectedUser.id),
      );
      setIsApproveModalOpen(false);

      toast.success("Account approved", {
        description: `${selectedUser.fullName}'s account has been approved.`,
      });
    } catch (error) {
      console.error("Error approving user:", error);
      toast.error("Failed to approve account", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  };

  const confirmDeny = async () => {
    if (!selectedUser) return;

    try {
      const response = await fetch(
        `/api/admin/account-requests/${selectedUser.id}/deny`,
        {
          method: "POST",
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to deny user: ${response.statusText}`);
      }

      // Remove from pending list
      setPendingUsers(
        pendingUsers.filter((user) => user.id !== selectedUser.id),
      );
      setIsDenyModalOpen(false);

      toast.success("Account request denied", {
        description: `${selectedUser.fullName}'s account request has been denied.`,
      });
    } catch (error) {
      console.error("Error denying user:", error);
      toast.error("Failed to deny account", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  };

  const viewIdCard = (user: User) => {
    setViewingCard({
      isOpen: true,
      url: user.universityCard,
    });
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return (
      <section className="w-full rounded-2xl bg-white p-7">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading account requests...</p>
        </div>
      </section>
    );
  }

  if (error && pendingUsers.length === 0 && pendingAdminUsers.length === 0) {
    return (
      <section className="w-full rounded-2xl bg-white p-7">
        <div className="flex justify-center flex-col items-center h-64">
          <p className="text-red-500 mb-2">Failed to load account requests</p>
          <p className="text-gray-500">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <ImageKitProvider
      publicKey={config.env.imagekit.publicKey}
      urlEndpoint={config.env.imagekit.urlEndpoint}
    >
      <section className="w-full rounded-2xl bg-white p-7 space-y-10">
        {/* Admin Access Requests Section */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
            <h2 className="text-xl font-semibold">Admin Access Requests</h2>
            <div className="flex items-center gap-2">
              <button
                className="p-2 bg-light-800 rounded-md"
                onClick={toggleSortOrder}
                title={
                  sortOrder === "desc" ? "Sort by oldest" : "Sort by newest"
                }
              >
                <ArrowUpDown size={20} className="text-gray-500" />
              </button>
              <div id="pagination" className="flex-shrink-0">
                <Button
                  className="pagination-btn_light"
                  size="icon"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={16} className="text-gray-700" />
                </Button>
                <p className="bg-primary-admin text-white">{currentPage}</p>
                <Button
                  className="pagination-btn_light"
                  size="icon"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight size={16} className="text-gray-700" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {pendingUsers.length === 0 ? (
          <div className="bg-light-700 rounded-lg p-8 text-center">
            <p className="text-gray-600">
              No pending account requests available.
            </p>
          </div>
        ) : (
          <AccountRequestCard
            pendingUsers={pendingUsers}
            viewIdCard={viewIdCard}
            handleApprove={handleApprove}
            handleDeny={handleDeny}
          />
        )}

        {/* Approve Modal */}
        <AccountRequestModal
          isOpen={isApproveModalOpen}
          onClose={() => setIsApproveModalOpen(false)}
          onConfirm={confirmApprove}
          type="approve"
          user={selectedUser}
        />

        {/* Deny Modal */}
        <AccountRequestModal
          isOpen={isDenyModalOpen}
          onClose={() => setIsDenyModalOpen(false)}
          onConfirm={confirmDeny}
          type="deny"
          user={selectedUser}
        />

        {/* ID Card Viewer Modal */}
        {viewingCard.isOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-4 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">University ID Card</h3>
                <button
                  onClick={() => setViewingCard({ isOpen: false, url: "" })}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <div className="border rounded-lg overflow-hidden">
                {viewingCard.url.startsWith("/") ? (
                  // For local paths or development data
                  <div className="h-48 bg-gray-200 flex items-center justify-center text-gray-400">
                    University ID Card Preview (Development)
                  </div>
                ) : (
                  // Real image via ImageKit
                  <IKImage
                    path={viewingCard.url}
                    alt="University ID Card"
                    width="400"
                    height="300"
                    className="w-full object-contain"
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </section>
    </ImageKitProvider>
  );
};

export default Page;
