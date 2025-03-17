// components/UserStatusTracker.tsx
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import WelcomeBackMessage from "./WelcomeBackMessage";

const WELCOME_BACK_SHOWN_KEY = "welcomeBackShown";
const LAST_VISIT_KEY = "lastVisitDate";
const INACTIVITY_THRESHOLD_DAYS = 7;

export default function UserStatusTracker({
  userId,
  userName,
}: {
  userId: string;
  userName: string;
}) {
  const pathname = usePathname();
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);

  useEffect(() => {
    // This is client-side activity tracking
    const trackActivity = () => {
      try {
        // Get the previous visit date
        const lastVisitStr = localStorage.getItem(LAST_VISIT_KEY);
        const lastVisit = lastVisitStr ? new Date(lastVisitStr) : null;

        // Check if user should see welcome back message
        const welcomeBackKey = `${WELCOME_BACK_SHOWN_KEY}_${userId}`;
        const welcomeBackShown = localStorage.getItem(welcomeBackKey);

        if (!welcomeBackShown && lastVisit) {
          // Calculate days since last visit
          const now = new Date();
          const timeDiff = now.getTime() - lastVisit.getTime();
          const daysSinceLastVisit = Math.floor(
            timeDiff / (1000 * 60 * 60 * 24),
          );

          // If user hasn't visited in over a week, show welcome back
          if (daysSinceLastVisit >= INACTIVITY_THRESHOLD_DAYS) {
            setShowWelcomeBack(true);
          }
        }

        // Update the last visit date
        localStorage.setItem(LAST_VISIT_KEY, new Date().toISOString());
      } catch (err) {
        console.error("Error tracking user activity", err);
      }
    };

    trackActivity();
  }, [userId, pathname]);

  const dismissWelcomeBack = () => {
    setShowWelcomeBack(false);
    localStorage.setItem(`${WELCOME_BACK_SHOWN_KEY}_${userId}`, "true");
  };

  if (showWelcomeBack) {
    return (
      <WelcomeBackMessage name={userName} onDismiss={dismissWelcomeBack} />
    );
  }

  // If not showing welcome back, don't render anything
  return null;
}
