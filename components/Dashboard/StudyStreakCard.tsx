'use client';

import React from 'react';
import { Flame } from 'lucide-react';

interface StudyStreakCardProps {
  streak: number;
}

export const StudyStreakCard: React.FC<StudyStreakCardProps> = ({ streak }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-orange-100 cursor-pointer hover:border-orange-300 hover:shadow-xl transition-all">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-orange-100 rounded-lg">
          <Flame className="w-6 h-6 text-orange-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Study Streak</h3>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-5xl font-bold text-orange-600">{streak}</span>
        <span className="text-xl text-gray-700">days</span>
      </div>
      <p className="text-sm text-gray-700 mt-2">
        {streak === 0 && 'Start your streak today!'}
        {streak > 0 && streak < 7 && 'Great start!'}
        {streak >= 7 && streak < 30 && 'Building momentum!'}
        {streak >= 30 && 'Incredible dedication! 🔥'}
      </p>
      <p className="text-xs text-gray-600 mt-3 italic">
        Click to mark today&apos;s study
      </p>
    </div>
  );
};
