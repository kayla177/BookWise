"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

// all email types that can be tested
const emailTypes = [
  { id: "welcome", name: "Welcome Email", description: "For new users" },
  {
    id: "approved",
    name: "Account Approval",
    description: "When account is approved",
  },
  {
    id: "borrowed",
    name: "Book Borrowed",
    description: "Confirmation of borrowing a book",
  },
  {
    id: "due",
    name: "Book Due Reminder",
    description: "Reminder that a book is due soon",
  },
  {
    id: "return",
    name: "Book Return",
    description: "Confirmation of book return",
  },
  {
    id: "receipt",
    name: "Book Receipt",
    description: "Receipt for borrowed book",
  },
  {
    id: "reminder",
    name: "Inactivity Reminder",
    description: "For inactive users (3+ days)",
  },
  {
    id: "checkin",
    name: "Check-In Reminder",
    description: "Reminder to check in",
  },
  {
    id: "welcomeback",
    name: "Welcome Back",
    description: "For returning users",
  },
];

export default function TestEmailPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailType, setEmailType] = useState("welcome");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [book, setBook] = useState("");
  const [testResults, setTestResults] = useState<any>(null);

  const handleSendTestEmail = async () => {
    if (!email) {
      return toast.error("Email address is required");
    }

    setIsLoading(true);

    try {
      // build query parameters by adding user input to URL
      const params = new URLSearchParams();
      console.log("[TEST-EMAIL] params: ", params);
      params.append("type", emailType);
      params.append("email", email);
      if (name) params.append("name", name);
      if (book) params.append("book", book);
      console.log("[TEST-EMAIL] params after: ", params);

      // send request to test-email API route
      const response = await fetch(`/api/test-email?${params.toString()}`);
      const data = await response.json();

      setTestResults(data);

      if (data.success) {
        toast.success("Email sent successfully", {
          description: `Test email sent to ${email}`,
        });
      } else {
        toast.error("Failed to send email", {
          description: data.error || "An unknown error occurred",
        });
      }
    } catch (error) {
      console.error("Error sending test email:", error);
      toast.error("Error sending test email");
    } finally {
      setIsLoading(false);
    }
  };

  // Get currently selected email type info
  const selectedEmailType = emailTypes.find((type) => type.id === emailType);

  // Determine if book title is needed
  const requiresBookTitle = ["borrowed", "due", "return", "receipt"].includes(
    emailType,
  );

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col items-center justify-center mb-8">
        <div className="flex items-center mb-4">
          <Link href="/">
            <img
              src="/icons/logo.svg"
              alt="BookWise"
              className="h-10 w-10 mr-2"
            />
          </Link>
          <h1 className="text-3xl font-bold">BookWise Email Testing</h1>
        </div>
        <p className="text-light-500 text-center max-w-xl">
          Use this dashboard to test email templates for BookWise. Select an
          email type, enter test parameters, and send a test email to see how it
          looks.
        </p>
      </div>

      <Tabs defaultValue="send" className="max-w-3xl mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="send">Send Test Email</TabsTrigger>
          <TabsTrigger value="results">Test Results</TabsTrigger>
        </TabsList>

        <TabsContent value="send">
          <Card>
            <CardHeader>
              <CardTitle>Send Test Email</CardTitle>
              <CardDescription>
                {selectedEmailType?.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="emailType">Email Template</Label>
                <Select value={emailType} onValueChange={setEmailType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select email type" />
                  </SelectTrigger>
                  <SelectContent>
                    {emailTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Recipient Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Recipient Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {requiresBookTitle && (
                <div className="space-y-2">
                  <Label htmlFor="book">Book Title</Label>
                  <Input
                    id="book"
                    placeholder="The Great Gatsby"
                    value={book}
                    onChange={(e) => setBook(e.target.value)}
                  />
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSendTestEmail}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Sending..." : "Send Test Email"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
              <CardDescription>
                Results from your last test email
              </CardDescription>
            </CardHeader>
            <CardContent>
              {testResults ? (
                <div className="bg-dark-300 rounded-md p-4 overflow-auto max-h-80">
                  <pre className="text-light-100 whitespace-pre-wrap">
                    {JSON.stringify(testResults, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="text-center py-8 text-light-500">
                  No test results yet. Send a test email to see results.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
