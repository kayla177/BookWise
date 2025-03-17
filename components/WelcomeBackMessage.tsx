// components/WelcomeBackMessage.tsx
"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

interface WelcomeBackMessageProps {
  name: string;
  onDismiss: () => void;
}

export default function WelcomeBackMessage({
  name,
  onDismiss,
}: WelcomeBackMessageProps) {
  return (
    <div className="relative bg-amber-500 text-dark-800 p-4 rounded-lg mb-6 shadow-md">
      <button
        onClick={onDismiss}
        className="absolute top-2 right-2 text-dark-800 hover:text-dark-600"
        aria-label="Dismiss welcome message"
      >
        <X size={18} />
      </button>

      <div className="flex items-center">
        <div className="mr-3">
          <span role="img" aria-label="wave" className="text-2xl">
            👋
          </span>
        </div>
        <div>
          <h3 className="font-semibold text-lg">Welcome back, {name}!</h3>
          <p className="text-sm">
            It's great to see you again. Check out the new books we've added
            since your last visit!
          </p>
        </div>
      </div>

      <div className="mt-3">
        <a
          href="/library"
          className="inline-block bg-dark-800 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-dark-700 transition-colors"
        >
          Explore New Arrivals
        </a>
      </div>
    </div>
  );
}
