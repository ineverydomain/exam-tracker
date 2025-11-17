'use client';

import React from 'react';
import { Trophy, Target, Star, Award, Zap, CheckCircle } from 'lucide-react';

interface MilestonesSectionProps {
  progress: number;
}

const milestones = [
  { id: 1, threshold: 0, title: 'Getting Started', icon: Star, color: 'blue' },
  { id: 2, threshold: 25, title: '25% Complete', icon: Target, color: 'purple' },
  { id: 3, threshold: 50, title: 'Halfway There', icon: Zap, color: 'yellow' },
  { id: 4, threshold: 75, title: '75% Complete', icon: Award, color: 'orange' },
  { id: 5, threshold: 100, title: 'Completed!', icon: Trophy, color: 'green' },
];

export const MilestonesSection: React.FC<MilestonesSectionProps> = ({ progress }) => {
  return (
    <div className="mb-8 bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Trophy className="w-6 h-6 text-yellow-600" />
        Achievements & Milestones
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {milestones.map((milestone) => {
          const isUnlocked = progress >= milestone.threshold;
          const IconComponent = milestone.icon;
          
          const colorClasses = {
            blue: 'bg-blue-100 text-blue-600 border-blue-300',
            purple: 'bg-purple-100 text-purple-600 border-purple-300',
            yellow: 'bg-yellow-100 text-yellow-600 border-yellow-300',
            orange: 'bg-orange-100 text-orange-600 border-orange-300',
            green: 'bg-green-100 text-green-600 border-green-300',
          };

          const lockedClasses = 'bg-gray-100 text-gray-400 border-gray-300';

          return (
            <div
              key={milestone.id}
              className={`relative p-4 rounded-lg border-2 text-center transition-all ${
                isUnlocked ? colorClasses[milestone.color as keyof typeof colorClasses] : lockedClasses
              } ${isUnlocked ? 'scale-100' : 'scale-95 opacity-60'}`}
            >
              {isUnlocked && (
                <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              )}
              <IconComponent className={`w-8 h-8 mx-auto mb-2 ${isUnlocked ? '' : 'opacity-40'}`} />
              <h3 className="font-semibold text-sm">{milestone.title}</h3>
              <p className="text-xs mt-1 opacity-75">{milestone.threshold}%</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
