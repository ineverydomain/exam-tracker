'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, Trash2 } from 'lucide-react';
import { CustomSubject } from '@/types';

interface CustomSubjectCardProps {
  subject: CustomSubject;
  onModuleToggle: (subjectId: string, moduleId: string) => void;
  onDelete: (subjectId: string) => void;
}

export const CustomSubjectCard: React.FC<CustomSubjectCardProps> = ({
  subject,
  onModuleToggle,
  onDelete,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate progress percentage
  const completedModules = subject.modules.filter(m => m.completed).length;
  const progress = subject.modules.length > 0
    ? Math.round((completedModules / subject.modules.length) * 100)
    : 0;

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${subject.name}"? This action cannot be undone.`)) {
      onDelete(subject.id);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden transition-all hover:shadow-lg">
      {/* Subject Header */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3 flex-1">
            <div className="p-2 bg-purple-100 rounded-lg mt-1">
              <BookOpen className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{subject.name}</h3>
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                  Custom
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-700">
                <span>
                  {completedModules} of {subject.modules.length} modules completed
                </span>
                <span className="font-semibold text-purple-600">{progress}%</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              className="p-2 hover:bg-red-50 rounded-lg transition-colors"
              aria-label="Delete subject"
            >
              <Trash2 className="w-5 h-5 text-red-600" />
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-700" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-gradient-to-r from-purple-400 to-purple-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Modules List */}
      {isExpanded && (
        <div className="border-t border-gray-200 bg-gray-50 p-5">
          <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase">Modules</h4>
          <div className="space-y-2">
            {subject.modules.map((module) => (
              <label
                key={module.id}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                  module.completed
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-white border border-gray-200 hover:border-purple-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={module.completed}
                  onChange={() => onModuleToggle(subject.id, module.id)}
                  className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500 cursor-pointer"
                />
                <span
                  className={`flex-1 ${
                    module.completed
                      ? 'text-green-800 line-through'
                      : 'text-gray-900'
                  }`}
                >
                  {module.name}
                </span>
                {module.completed && (
                  <span className="text-green-600 text-sm font-medium">✓ Done</span>
                )}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
