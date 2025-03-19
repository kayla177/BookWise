// "use client";
//
// import React from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// // NOTE:: As long as you use hook within your component, have to add "use client"
// import { cn, getInitials } from "@/lib/utils";
// import Image from "next/image";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Session } from "next-auth";
//
// const Header = ({ session }: { session: Session }) => {
//   //   get the current path, inorder to control the color of the header choice
//   const pathname = usePathname();
//   // console.log(session);
//
//   return (
//     <header className="my-10 flex justify-between gap-5">
//       <Link href="/">
//         <Image src="/icons/logo.svg" alt="logo" width={40} height={40} />
//       </Link>
//       <ul className="flex flex-row items-center gap-8">
//         <li>
//           <Link
//             href="/library"
//             className={cn(
//               "text-base cursor-pointer capitalize",
//               pathname === "/library" ? "text-light-200" : "text-light-100",
//             )}
//           >
//             Library
//           </Link>
//         </li>
//
//         <li>
//           <Link
//             href="/search"
//             className={cn(
//               "text-base cursor-pointer capitalize",
//               pathname === "/search" ? "text-light-200" : "text-light-100",
//             )}
//           >
//             Search
//           </Link>
//         </li>
//
//         <li>
//           <Link href="/my-profile">
//             <Avatar>
//               <AvatarFallback className="bg-amber-100">
//                 {getInitials(session?.user?.name || "IN")}
//               </AvatarFallback>
//             </Avatar>
//           </Link>
//         </li>
//       </ul>
//     </header>
//   );
// };
// export default Header;

// Update components/Header.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn, getInitials } from "@/lib/utils";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Session } from "next-auth";
import { User, LogOut, ChevronDown, LayoutDashboard } from "lucide-react";
import { toast } from "sonner";
import { logoutAction } from "@/lib/actions/auth-actions";

const Header = ({ session }: { session: Session }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isAdmin = session?.user?.role === "ADMIN";

  const handleAdminAccess = () => {
    if (isAdmin) {
      router.push("/admin");
    } else {
      router.push("/my-profile");
      toast.info("Admin access required", {
        description:
          "You need admin privileges to access the dashboard. Request access from your profile page.",
      });
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      setIsDropdownOpen(false);
      toast.loading("Signing out...", { id: "logout" });

      // Call the server action
      await logoutAction();

      // Redirect client-side as a fallback
      setTimeout(() => {
        window.location.href = "/sign-in";
      }, 1000);
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to sign out. Please try again.", { id: "logout" });
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="my-10 flex justify-between gap-5">
      <Link href="/">
        <Image src="/icons/logo.svg" alt="logo" width={40} height={40} />
      </Link>
      <ul className="flex flex-row items-center gap-8">
        <li>
          <Link
            href="/library"
            className={cn(
              "text-base cursor-pointer capitalize",
              pathname === "/library" ? "text-light-200" : "text-light-100",
            )}
          >
            Library
          </Link>
        </li>

        <li>
          <Link
            href="/search"
            className={cn(
              "text-base cursor-pointer capitalize",
              pathname === "/search" ? "text-light-200" : "text-light-100",
            )}
          >
            Search
          </Link>
        </li>

        <li>
          <button
            onClick={handleAdminAccess}
            className={cn(
              "text-base cursor-pointer capitalize flex items-center",
              pathname.startsWith("/admin")
                ? "text-light-200"
                : "text-light-100",
            )}
          >
            Admin
          </button>
        </li>

        <li className="relative">
          <div
            className="flex items-center gap-1 cursor-pointer group"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <Avatar className="transition-transform group-hover:ring-2 group-hover:ring-primary group-hover:scale-105">
              <AvatarFallback className="bg-amber-100">
                {getInitials(session?.user?.name || "IN")}
              </AvatarFallback>
            </Avatar>
            <ChevronDown className="h-4 w-4 text-light-100 transition-transform group-hover:text-primary group-hover:-rotate-180" />
          </div>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 bg-dark-300 rounded-lg shadow-lg w-48 py-1 z-50">
              <div className="px-4 py-2 border-b border-dark-200">
                <p className="text-sm font-semibold text-white">
                  {session?.user?.name}
                </p>
                <p className="text-xs text-light-400 truncate">
                  {session?.user?.email}
                </p>
              </div>

              <Link
                href="/my-profile"
                className="flex items-center gap-2 px-4 py-2 text-sm text-light-100 hover:bg-dark-200"
              >
                <User className="h-4 w-4" />
                <span>My Profile</span>
              </Link>

              {isAdmin && (
                <Link
                  href="/admin"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-light-100 hover:bg-dark-200"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Admin Dashboard</span>
                </Link>
              )}

              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center gap-2 px-4 py-2 text-sm text-rose-400 hover:bg-dark-200 w-full text-left"
              >
                <LogOut className="h-4 w-4" />
                <span>{isLoggingOut ? "Signing out..." : "Logout"}</span>
              </button>
            </div>
          )}
        </li>
      </ul>
    </header>
  );
};

export default Header;
