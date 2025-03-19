import React from "react";
import Image from "next/image";
import Link from "next/link";

interface AccountRequest {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  initials: string;
  bgColor: string;
}

interface AccountRequestsProps {
  accountRequests: AccountRequest[];
  loading: boolean;
}

const AccountRequests: React.FC<AccountRequestsProps> = ({
  accountRequests,
  loading,
}) => {
  return (
    <div className="bg-white rounded-2xl p-7">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Account Requests</h2>
        <Link href="/admin/account-requests" className="text-blue-600 text-sm">
          View all
        </Link>
      </div>

      {loading ? (
        <div className="h-40 w-full flex items-center justify-center">
          <p className="text-gray-500">Loading account requests...</p>
        </div>
      ) : accountRequests.length === 0 ? (
        <div className="border border-gray-100 rounded-lg p-8 flex flex-col items-center">
          <div className="bg-gray-50 p-6 rounded-full mb-4">
            <Image
              src="/icons/admin/no-account-request.png"
              alt="No Requests"
              width={200}
              height={150}
            />
          </div>
          <h3 className="text-lg font-medium mb-2">
            No Pending Account Requests
          </h3>
          <p className="text-gray-500 text-center">
            There are currently no account requests awaiting approval.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5">
          {accountRequests.map((account) => (
            <div
              key={account.id}
              className="flex flex-col items-center border border-gray-100 rounded-lg p-4 hover:shadow-sm transition"
            >
              {account.avatar ? (
                <Image
                  src={account.avatar}
                  alt={account.name}
                  width={48}
                  height={48}
                  className="rounded-full mb-2"
                />
              ) : (
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
                  style={{ backgroundColor: account.bgColor }}
                >
                  <span className="text-lg font-medium">
                    {account.initials}
                  </span>
                </div>
              )}
              <h3 className="font-medium text-sm text-center">
                {account.name}
              </h3>
              <p className="text-xs text-gray-500 text-center truncate w-full">
                {account.email}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AccountRequests;
