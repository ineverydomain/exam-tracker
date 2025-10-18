'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { UserData, Course } from '@/types';

interface SettingsPanelProps {
  userData: UserData;
  userId: string;
  onClose: () => void;
}

const examOptions = ['Dec 2025', 'June 2026', 'Dec 2026', 'June 2027', 'Dec 2027'];
const groupOptions = ['Group 1', 'Group 2', 'Both Groups'];

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ userData, userId, onClose }) => {
  const [targetExam, setTargetExam] = useState(userData.targetExam);
  const [selectedGroups, setSelectedGroups] = useState<string[]>(userData.groups);
  const [loading, setLoading] = useState(false);

  const handleGroupToggle = (group: string) => {
    if (group === 'Both Groups') {
      setSelectedGroups(['Both Groups']);
    } else {
      setSelectedGroups((prev) => {
        const filtered = prev.filter((g) => g !== 'Both Groups');
        if (prev.includes(group)) {
          return filtered.filter((g) => g !== group);
        }
        return [...filtered, group];
      });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateDoc(doc(db, 'users', userId), {
        targetExam,
        groups: selectedGroups,
      });
      alert('Settings updated successfully!');
      onClose();
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('Failed to update settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Target Exam */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Target Exam</h3>
            <div className="grid grid-cols-2 gap-3">
              {examOptions.map((exam) => (
                <button
                  key={exam}
                  onClick={() => setTargetExam(exam)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    targetExam === exam
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-blue-300'
                  }`}
                >
                  {exam}
                </button>
              ))}
            </div>
          </div>

          {/* Groups */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Your Groups</h3>
            <div className="space-y-2">
              {groupOptions.map((group) => (
                <button
                  key={group}
                  onClick={() => handleGroupToggle(group)}
                  className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                    selectedGroups.includes(group)
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{group}</span>
                    {selectedGroups.includes(group) && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading || selectedGroups.length === 0}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
