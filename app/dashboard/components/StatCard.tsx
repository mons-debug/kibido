"use client";

import { ReactNode } from "react";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: ReactNode;
}

export default function StatCard({ title, value, change, trend, icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          <div className="flex items-center mt-2">
            {trend === "up" && (
              <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
            )}
            {trend === "down" && (
              <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span 
              className={`text-sm font-medium ${
                trend === "up" 
                  ? "text-green-500" 
                  : trend === "down" 
                  ? "text-red-500" 
                  : "text-gray-500"
              }`}
            >
              {change}
            </span>
          </div>
        </div>
        <div className="p-3 rounded-full bg-gray-50">{icon}</div>
      </div>
    </div>
  );
} 