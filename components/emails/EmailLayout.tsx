import React from "react";

interface EmailLayoutProps {
  title: string;
  children: React.ReactNode;
}

const EmailLayout = ({ title, children }: EmailLayoutProps) => {
  return (
    <div className="text-dark-600">
      <h2 className="text-white">{title}</h2>
      <div>{children}</div>
      <p className="text-sm text-light-300">
        Happy reading,
        <br />
        The BookWise Team
      </p>
    </div>
  );
};
export default EmailLayout;
