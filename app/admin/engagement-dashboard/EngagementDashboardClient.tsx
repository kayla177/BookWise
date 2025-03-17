"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Utility to format date
const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "Never";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Calculate days since last activity
const daysSinceActivity = (dateStr: string | null) => {
  if (!dateStr) return "N/A";
  const lastActivity = new Date(dateStr);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - lastActivity.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Get engagement status based on days
const getEngagementStatus = (days: number | string) => {
  if (days === "N/A") {
    return { status: "unknown", label: "Unknown", color: "bg-gray-300" };
  }

  // Ensure 'days' is a number
  const daysNumber = typeof days === "string" ? Number(days) : days;

  if (daysNumber <= 1)
    return { status: "active", label: "Active", color: "bg-green-500" };
  if (daysNumber <= 3)
    return { status: "regular", label: "Regular", color: "bg-blue-400" };
  if (daysNumber <= 7)
    return { status: "cooling", label: "Cooling", color: "bg-yellow-400" };
  if (daysNumber <= 30)
    return { status: "inactive", label: "Inactive", color: "bg-orange-500" };

  return { status: "dormant", label: "Dormant", color: "bg-red-500" };
};

type User = {
  id: string;
  fullName: string;
  email: string;
  lastActivityDate: string | null;
  createdAt: string | null;
  status: string | null;
};

interface DashboardClientProps {
  userData: {
    users: User[];
  };
}

export default function EngagementDashboardClient({
  userData,
}: DashboardClientProps) {
  const [users, setUsers] = useState<User[]>(userData.users || []);
  console.log("Users in EngagementDashboardClient state:", users);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [localStorageData, setLocalStorageData] = useState<
    Record<string, string>
  >({});
  const [cronKey, setCronKey] = useState(
    process.env.NEXT_PUBLIC_CRON_SECRET_KEY || "test-key",
  );
  const [loading, setLoading] = useState({
    triggerCron: false,
    simulateActivity: false,
    simulateInactivity: false,
    resetActivity: false,
    welcome: false,
    inactivity: false,
    "welcome-back": false,
    approval: false,
    borrowed: false,
    "due-reminder": false,
    return: false,
  });

  // Load localStorage data
  useEffect(() => {
    if (typeof window !== "undefined") {
      const items: Record<string, string> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i) || "";
        items[key] = localStorage.getItem(key) || "";
      }
      setLocalStorageData(items);
    }
  }, []);

  // Update localStorage display when it changes
  const refreshLocalStorage = () => {
    if (typeof window !== "undefined") {
      const items: Record<string, string> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i) || "";
        items[key] = localStorage.getItem(key) || "";
      }
      setLocalStorageData(items);
    }
  };

  // Trigger engagement check
  const triggerEngagementCheck = async () => {
    setLoading((prev) => ({ ...prev, triggerCron: true }));
    try {
      const response = await fetch(`/api/cron/engagement?key=${cronKey}`, {
        method: "GET",
      });
      const result = await response.json();

      if (result.success) {
        toast.success("Engagement check completed", {
          description: `Processed ${result.processed} users, reminded ${result.reminded} users`,
        });
      } else {
        toast.error("Error triggering engagement check", {
          description: result.error || "Unknown error occurred",
        });
      }
    } catch (error) {
      toast.error("Error triggering engagement check", {
        description: String(error),
      });
    } finally {
      setLoading((prev) => ({ ...prev, triggerCron: false }));
    }
  };

  // Send test email
  const sendTestEmail = async (type: string) => {
    if (!selectedUser) return;

    // Update loading state for specific email type
    setLoading((prev) => ({ ...prev, [type]: true }));

    try {
      // Determine book title and due date for specific email types
      const bookTitle = "The Great Gatsby"; // Default book title
      const dueDate = new Date().toDateString();

      // Construct query parameters
      const params = new URLSearchParams({
        type,
        email: selectedUser.email,
        name: selectedUser.fullName,
        book: bookTitle,
      });

      const response = await fetch(`/api/test-email?${params.toString()}`, {
        method: "GET",
      });
      const result = await response.json();

      if (result.success) {
        toast.success(
          `${type.charAt(0).toUpperCase() + type.slice(1)} email sent`,
          {
            description: `Test email sent to ${selectedUser.email}`,
          },
        );
      } else {
        toast.error(`Failed to send ${type} email`, {
          description: result.message || "Unknown error occurred",
        });
      }
    } catch (error) {
      toast.error(`Failed to send ${type} email`, {
        description: String(error),
      });
    } finally {
      // Reset loading state for specific email type
      setLoading((prev) => ({ ...prev, [type]: false }));
    }
  };

  // Simulate returning after inactivity
  const simulateReturn = (userId: string) => {
    if (typeof window !== "undefined") {
      setLoading((prev) => ({ ...prev, simulateInactivity: true }));

      // Set last visit to 8 days ago
      const eightDaysAgo = new Date();
      eightDaysAgo.setDate(eightDaysAgo.getDate() - 8);
      localStorage.setItem("lastVisitDate", eightDaysAgo.toISOString());

      // Clear any previous welcome back shown flag
      localStorage.removeItem(`welcomeBackShown_${userId}`);

      refreshLocalStorage();
      toast.success("Simulated return after inactivity", {
        description: "Refresh the page to see welcome back message",
      });

      setLoading((prev) => ({ ...prev, simulateInactivity: false }));
    }
  };

  // Reset welcome back status
  const resetWelcomeBack = (userId: string) => {
    if (typeof window !== "undefined") {
      setLoading((prev) => ({ ...prev, resetActivity: true }));

      localStorage.removeItem(`welcomeBackShown_${userId}`);
      localStorage.removeItem("lastVisitDate");

      refreshLocalStorage();
      toast.success("Reset welcome back status", {
        description: "Status has been reset",
      });

      setLoading((prev) => ({ ...prev, resetActivity: false }));
    }
  };

  // Simulate active user
  const simulateActiveUser = (userId: string) => {
    if (typeof window !== "undefined") {
      setLoading((prev) => ({ ...prev, simulateActivity: true }));

      // Set last visit to recent
      localStorage.setItem("lastVisitDate", new Date().toISOString());

      // Have seen welcome back message
      localStorage.setItem(`welcomeBackShown_${userId}`, "true");

      refreshLocalStorage();
      toast.success("Simulated active user", {
        description: "User is now marked as active",
      });

      setLoading((prev) => ({ ...prev, simulateActivity: false }));
    }
  };

  console.log("User Data received in EngagementDashboardClient:", userData);

  return (
    <Tabs defaultValue="users">
      <TabsList className="mb-4">
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="local-storage">LocalStorage</TabsTrigger>
        <TabsTrigger value="actions">Test Actions</TabsTrigger>
      </TabsList>

      <TabsContent value="users">
        <Card>
          <CardHeader>
            <CardTitle>User Engagement Status</CardTitle>
            <CardDescription>
              View all users and their current engagement status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>A list of all users in the system</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead>Days Inactive</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => {
                  const days = daysSinceActivity(user.lastActivityDate);
                  const status = getEngagementStatus(days);

                  return (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.fullName}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{formatDate(user.lastActivityDate)}</TableCell>
                      <TableCell>{days}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-block w-3 h-3 rounded-full mr-2 ${status.color}`}
                        ></span>
                        {status.label}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedUser(user)}
                          >
                            Details
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {selectedUser && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>User Detail: {selectedUser.fullName}</CardTitle>
              <CardDescription>{selectedUser.email}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">User ID</h3>
                  <p className="mt-1">{selectedUser.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Account Status
                  </h3>
                  <p className="mt-1">{selectedUser.status || "Unknown"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Created At
                  </h3>
                  <p className="mt-1">{formatDate(selectedUser.createdAt)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Last Activity
                  </h3>
                  <p className="mt-1">
                    {formatDate(selectedUser.lastActivityDate)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Days Since Activity
                  </h3>
                  <p className="mt-1">
                    {daysSinceActivity(selectedUser.lastActivityDate)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Engagement Status
                  </h3>
                  <p className="mt-1">
                    <span
                      className={`inline-block w-3 h-3 rounded-full mr-2 ${getEngagementStatus(daysSinceActivity(selectedUser.lastActivityDate)).color}`}
                    ></span>
                    {
                      getEngagementStatus(
                        daysSinceActivity(selectedUser.lastActivityDate),
                      ).label
                    }
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setSelectedUser(null)}>
                Close
              </Button>

              <div className="space-x-2">
                <Button
                  variant="secondary"
                  onClick={() => simulateActiveUser(selectedUser.id)}
                  disabled={loading.simulateActivity}
                >
                  {loading.simulateActivity
                    ? "Processing..."
                    : "Simulate Active"}
                </Button>

                <Button
                  variant="default"
                  onClick={() => simulateReturn(selectedUser.id)}
                  disabled={loading.simulateInactivity}
                >
                  {loading.simulateInactivity
                    ? "Processing..."
                    : "Simulate Return"}
                </Button>

                <Button
                  variant="destructive"
                  onClick={() => resetWelcomeBack(selectedUser.id)}
                  disabled={loading.resetActivity}
                >
                  {loading.resetActivity ? "Resetting..." : "Reset Status"}
                </Button>
              </div>
            </CardFooter>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="local-storage">
        <Card>
          <CardHeader>
            <CardTitle>LocalStorage Data</CardTitle>
            <CardDescription>
              View and manage browser localStorage data used for engagement
              tracking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button variant="outline" onClick={refreshLocalStorage}>
                  Refresh Data
                </Button>
              </div>

              <div className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                <pre>{JSON.stringify(localStorageData, null, 2)}</pre>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">
                    Clear Specific Item
                  </h3>
                  <Select
                    onValueChange={(value) => {
                      localStorage.removeItem(value);
                      refreshLocalStorage();
                      toast.success("Item removed from localStorage");
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select item to remove" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(localStorageData).map((key) => (
                        <SelectItem key={key} value={key}>
                          {key}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Clear All Data</h3>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      localStorage.clear();
                      refreshLocalStorage();
                      toast.success("All localStorage data cleared");
                    }}
                  >
                    Clear All LocalStorage
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="actions">
        <Card>
          <CardHeader>
            <CardTitle>Test Actions</CardTitle>
            <CardDescription>
              Trigger various actions to test the engagement system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">
                Trigger Engagement Check
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Cron Secret Key</label>
                  <Input
                    value={cronKey}
                    onChange={(e) => setCronKey(e.target.value)}
                    placeholder="Enter cron secret key"
                  />
                </div>

                <div className="flex items-end">
                  <Button
                    onClick={triggerEngagementCheck}
                    disabled={loading.triggerCron}
                    className="w-full"
                  >
                    {loading.triggerCron
                      ? "Processing..."
                      : "Run Engagement Check"}
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                This will trigger the cron job that checks for inactive users
                and sends reminder emails.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Test Welcome Back UI</h3>
              <p className="text-sm text-gray-600 mb-4">
                To test the welcome back message UI:
              </p>
              <ol className="list-decimal list-inside space-y-2">
                <li>Select a user from the "Users" tab</li>
                <li>
                  Click "Simulate Return" to set up the localStorage state
                </li>
                <li>Refresh the page to see the welcome back message</li>
                <li>Reset the status when done testing</li>
              </ol>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Email Testing</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">
                      Test Email Address
                    </label>
                    <Input
                      placeholder="Enter your email address"
                      value={selectedUser?.email || ""}
                      onChange={(e) =>
                        setSelectedUser((prev) =>
                          prev ? { ...prev, email: e.target.value } : null,
                        )
                      }
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <Input
                      placeholder="Enter name for email"
                      value={selectedUser?.fullName || ""}
                      onChange={(e) =>
                        setSelectedUser((prev) =>
                          prev ? { ...prev, fullName: e.target.value } : null,
                        )
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Button
                      className="w-full"
                      onClick={() => sendTestEmail("welcome")}
                      disabled={!selectedUser?.email || loading.welcome}
                    >
                      {loading.welcome ? "Sending..." : "Send Welcome Email"}
                    </Button>
                  </div>

                  <div>
                    <Button
                      className="w-full"
                      onClick={() => sendTestEmail("inactivity")}
                      disabled={!selectedUser?.email || loading.inactivity}
                      variant="secondary"
                    >
                      {loading.inactivity
                        ? "Sending..."
                        : "Send Inactivity Reminder"}
                    </Button>
                  </div>

                  <div>
                    <Button
                      className="w-full"
                      onClick={() => sendTestEmail("welcome-back")}
                      disabled={!selectedUser?.email || loading["welcome-back"]}
                      variant="outline"
                    >
                      {loading["welcome-back"]
                        ? "Sending..."
                        : "Send Welcome Back Email"}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Button
                      className="w-full"
                      onClick={() => sendTestEmail("approval")}
                      disabled={!selectedUser?.email || loading.approval}
                      variant="outline"
                    >
                      {loading.approval ? "Sending..." : "Send Approval Email"}
                    </Button>
                  </div>

                  <div>
                    <Button
                      className="w-full"
                      onClick={() => sendTestEmail("borrowed")}
                      disabled={!selectedUser?.email || loading.borrowed}
                      variant="outline"
                    >
                      {loading.borrowed
                        ? "Sending..."
                        : "Send Book Borrowed Email"}
                    </Button>
                  </div>

                  <div>
                    <Button
                      className="w-full"
                      onClick={() => sendTestEmail("due-reminder")}
                      disabled={!selectedUser?.email || loading["due-reminder"]}
                      variant="outline"
                    >
                      {loading["due-reminder"]
                        ? "Sending..."
                        : "Send Due Date Reminder"}
                    </Button>
                  </div>
                </div>

                <div>
                  <Button
                    className="w-full"
                    onClick={() => sendTestEmail("return")}
                    disabled={!selectedUser?.email || loading.return}
                    variant="outline"
                  >
                    {loading.return ? "Sending..." : "Send Return Confirmation"}
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Send test emails to see how they look in your inbox.
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
