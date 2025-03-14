// app/email-test/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function EmailTestPage() {
  const [status, setStatus] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const sendTestEmail = async (type: string) => {
    setStatus("Sending...");
    try {
      const response = await fetch(
        `/api/test-email?type=${type}&email=${email}`,
      );
      const data = await response.json();

      if (data.success) {
        setStatus(`Success: ${data.message}`);
      } else {
        setStatus(`Error: ${data.error}`);
      }
    } catch (error) {
      setStatus(`Error: ${error}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Email Test Page</h1>

      <div className="mb-4">
        <label htmlFor="email" className="block mb-2">
          Test Email Address:
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 border rounded w-full"
          placeholder="Enter your test email"
        />
      </div>

      <div className="flex gap-4 mb-4">
        <Button onClick={() => sendTestEmail("welcome")}>
          Test Welcome Email
        </Button>
        <Button onClick={() => sendTestEmail("borrowed")}>
          Test Book Borrowed Email
        </Button>
      </div>

      {status && (
        <div
          className={`p-4 rounded ${status.includes("Error") ? "bg-red-100" : "bg-green-100"}`}
        >
          {status}
        </div>
      )}
    </div>
  );
}
