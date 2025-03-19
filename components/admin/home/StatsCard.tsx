import React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number;
  change: number;
  icon: React.ReactNode;
  loading: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  icon,
  loading,
}) => {
  const isPositive = change >= 0;

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm h-32 flex items-center justify-center">
        <p className="text-gray-500">Loading statistics...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-start mb-5">
        <p className="text-gray-500">{title}</p>
        <div className="p-2 rounded-full bg-gray-50">{icon}</div>
      </div>

      <div className="flex justify-between items-end">
        <h3 className="text-4xl font-bold">{value.toLocaleString()}</h3>
        <div
          className={`flex items-center gap-1 text-sm ${isPositive ? "text-green-500" : "text-orange-500"}`}
        >
          {isPositive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
          <span>{Math.abs(change)}</span>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
