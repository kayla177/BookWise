"use client";

import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { Session } from "next-auth";
import { IKImage, ImageKitProvider } from "imagekitio-next";
import config from "@/lib/config";
import Image from "next/image";

interface ProfileCardProps {
  user: {
    id: string;
    fullName: string;
    email: string;
    universityId: number;
    universityCard: string;
  };
  session: Session;
}

const ProfileCard = ({ user, session }: ProfileCardProps) => {
  return (
    <ImageKitProvider
      publicKey={config.env.imagekit.publicKey}
      urlEndpoint={config.env.imagekit.urlEndpoint}
    >
      <div className="bg-dark-400 p-6 rounded-2xl shadow-lg w-full">
        {/* Profile Header */}
        <div className="flex flex-col items-center">
          {/* Circular Background for Avatar */}
          <div className="relative flex items-center justify-center w-24 h-24 mb-4 rounded-full bg-light-500 shadow-md">
            <Avatar className="w-20 h-20 ">
              <AvatarFallback className="text-lg font-semibold bg-amber-100">
                {getInitials(session?.user?.name || "IN")}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex flex-row gap-1">
            <Image
              src="/icons/verified.svg"
              alt="verified"
              width={13}
              height={13}
              className="object-contain"
            />
            <p className="text-light-100 text-[12px]">Verified Student</p>
          </div>

          <h2 className="text-xl font-semibold text-white">{user.fullName}</h2>
          <p className="text-sm text-light-100">{user.email}</p>
        </div>

        {/* University Info */}
        <div className="mt-4">
          <h3 className="text-light-100 text-sm">University</h3>
          <p className="text-white font-semibold">University of Waterloo</p>

          <h3 className="text-light-100 text-sm mt-4">Student ID</h3>
          <p className="font-semibold text-white">{user.universityId}</p>
        </div>

        {/* University Card */}
        <div className="mt-4">
          <IKImage
            path={user.universityCard}
            alt="University Card"
            width={280}
            height={160}
            className="rounded-lg shadow-md"
          />
        </div>
      </div>
    </ImageKitProvider>
  );
};

export default ProfileCard;
