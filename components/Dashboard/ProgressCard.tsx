'use client';

import React from 'react';
import { TrendingUp } from 'lucide-react';

interface ProgressCardProps {
  progress: number;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({ progress }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-green-100 rounded-lg">
          <TrendingUp className="w-6 h-6 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Overall Progress</h3>
      </div>
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-5xl font-bold text-green-600">{progress}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-sm text-gray-700 mt-2">
        {progress < 25 && 'Just getting started!'}
        {progress >= 25 && progress < 50 && 'Keep it up!'}
        {progress >= 50 && progress < 75 && "You're halfway there!"}
        {progress >= 75 && progress < 100 && 'Almost there!'}
        {progress === 100 && 'Completed! 🎉'}
      </p>
    </div>
  );
};
