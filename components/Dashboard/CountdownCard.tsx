"use client";

import React, { useState, useEffect } from "react";
import { Calendar } from "lucide-react";

interface CountdownCardProps {
  targetExam: string;
}

export const CountdownCard: React.FC<CountdownCardProps> = ({ targetExam }) => {
  const [timeLeft, setTimeLeft] = useState({ months: 0, days: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      // Handle empty or invalid targetExam
      if (!targetExam || targetExam.trim() === "") {
        setTimeLeft({ months: 0, days: 0 });
        return;
      }

      let targetDate: Date;

      // Check if targetExam is in DD-MM-YYYY format
      const dateRegex = /^(\d{2})-(\d{2})-(\d{4})$/;
      const match = targetExam.match(dateRegex);

      if (match) {
        // Parse DD-MM-YYYY format
        const [, day, month, year] = match;
        targetDate = new Date(
          parseInt(year),
          parseInt(month) - 1,
          parseInt(day)
        );
      } else {
        // Parse "Month Year" format (backward compatibility)
        const examMonth = targetExam.split(" ")[0];
        const examYear = parseInt(targetExam.split(" ")[1]);

        if (isNaN(examYear)) {
          setTimeLeft({ months: 0, days: 0 });
          return;
        }

        if (examMonth === "June") {
          targetDate = new Date(examYear, 5, 1); // June is month 5 (0-indexed)
        } else {
          targetDate = new Date(examYear, 11, 1); // December is month 11
        }
      }

      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      // Handle negative differences (past dates)
      if (diff < 0 || isNaN(diff)) {
        setTimeLeft({ months: 0, days: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const months = Math.floor(days / 30);
      const remainingDays = days % 30;

      setTimeLeft({ months, days: remainingDays });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000 * 60 * 60); // Update every hour

    return () => clearInterval(interval);
  }, [targetExam]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-blue-100 rounded-lg">
          <Calendar className="w-6 h-6 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Countdown to Exam
        </h3>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-bold text-blue-600">
          {timeLeft.months}
        </span>
        <span className="text-lg text-gray-700">months</span>
        <span className="text-4xl font-bold text-blue-600">
          {timeLeft.days}
        </span>
        <span className="text-lg text-gray-700">days</span>
      </div>
      <p className="text-sm text-gray-700 mt-2">
        Target: {targetExam || "Not set"}
      </p>
    </div>
  );
};
