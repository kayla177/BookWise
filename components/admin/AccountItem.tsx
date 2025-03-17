"use client";

import React from "react";

interface AccountItemProps {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  initials: string;
  bgColor: string;
}

const AccountItem: React.FC<AccountItemProps> = ({
  id,
  name,
  email,
  avatar,
  initials,
  bgColor,
}) => {
  return (
    <div
      key={id}
      className="flex flex-col items-center border border-gray-100 rounded-lg p-4 hover:shadow-sm transition"
    >
      {avatar ? (
        <img src={avatar} alt={name} className="w-12 h-12 rounded-full mb-2" />
      ) : (
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
          style={{ backgroundColor: bgColor }}
        >
          <span className="text-lg font-medium">{initials}</span>
        </div>
      )}
      <h3 className="font-medium text-sm text-center">{name}</h3>
      <p className="text-xs text-gray-500 text-center truncate w-full">
        {email}
      </p>
    </div>
  );
};

export default AccountItem;
