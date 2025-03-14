"use client";

import React, { useState, useEffect } from "react";
import UserCard from "@/components/admin/UserCard";

const UserList = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async (id: string, newRole: "USER" | "ADMIN") => {
    try {
      await fetch(`/api/users/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ role: newRole }),
        headers: { "Content-Type": "application/json" },
      });

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, role: newRole } : user,
        ),
      );
    } catch (error) {
      console.error("Failed to update role:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/users/${id}`, { method: "DELETE" });
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  if (loading) {
    return <p className="text-dark-600 text-center mt-10">Loading users...</p>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-dark-600 mb-4">All Users</h2>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full border-collapse">
          <thead className="bg-light-800 rounded-lg">
            <tr className="text-dark-600 text-sm border-b border-light-700">
              <th className="py-2 px-4 text-left font-normal ">Name</th>
              <th className="py-2 px-4 text-left font-normal">Date Joined</th>
              <th className="py-2 px-4 text-left font-normal">Role</th>
              <th className="py-2 px-4 text-left font-normal">
                Books Borrowed
              </th>
              <th className="py-2 px-4 text-left font-normal">
                University ID No
              </th>
              <th className="py-2 px-4 text-left font-normal">
                University ID Card
              </th>
              <th className="py-2 px-4 text-left font-normal">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onDelete={handleDelete}
                onRoleChange={handleRoleChange}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
