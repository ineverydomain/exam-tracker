'use client';

import React, { useState } from 'react';
import { X, Trash2, Plus } from 'lucide-react';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { UserData, CustomSubject } from '@/types';
import { Toast } from '../Toast';

interface SettingsPanelProps {
  userData: UserData;
  userId: string;
  onClose: () => void;
}

const groupOptions = ['Group 1', 'Group 2', 'Both Groups'];

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ userData, userId, onClose }) => {
  const [targetExam, setTargetExam] = useState(userData.targetExam);
  const [dateError, setDateError] = useState('');
  const [selectedGroups, setSelectedGroups] = useState<string[]>(userData.groups);
  const [customSubjects, setCustomSubjects] = useState<CustomSubject[]>(userData.customSubjects || []);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const validateDate = (dateString: string): boolean => {
    setDateError('');
    
    if (!dateString) {
      setDateError('Exam date cannot be empty.');
      return false;
    }

    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(\d{4})$/;
    if (!dateRegex.test(dateString)) {
      setDateError('Please enter a valid date in DD-MM-YYYY format.');
      return false;
    }

    const [day, month, year] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    
    if (
      date.getDate() !== day ||
      date.getMonth() !== month - 1 ||
      date.getFullYear() !== year
    ) {
      setDateError('Please enter a valid exam date.');
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) {
      setDateError('Exam date must be in the future.');
      return false;
    }

    return true;
  };

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

  const handleDeleteSubject = (subjectId: string) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      setCustomSubjects(customSubjects.filter(s => s.id !== subjectId));
    }
  };

  const handleAddSubject = () => {
    if (!newSubjectName.trim()) return;

    const newSubject: CustomSubject = {
      id: `custom_${Date.now()}`,
      name: newSubjectName,
      modules: [],
      createdAt: new Date().toISOString(),
    };

    setCustomSubjects([...customSubjects, newSubject]);
    setNewSubjectName('');
    setShowAddSubject(false);
  };

  const handleSave = async () => {
    if (!validateDate(targetExam)) {
      return;
    }

    setLoading(true);
    try {
      const updateData: Partial<UserData> = {
        targetExam,
        customSubjects,
      };

      // Only update groups if not "Other" course
      if (userData.course !== 'Other') {
        updateData.groups = selectedGroups;
      }

      await updateDoc(doc(db, 'users', userId), updateData);
      setToast({ message: 'Settings updated successfully!', type: 'success' });
      setTimeout(() => onClose(), 1500);
    } catch (error) {
      console.error('Error updating settings:', error);
      setToast({ message: 'Failed to update settings. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
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
          {/* Target Exam Date */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Target Exam Date</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exam Date (DD-MM-YYYY)
              </label>
              <input
                type="text"
                value={targetExam}
                onChange={(e) => {
                  setTargetExam(e.target.value);
                  setDateError('');
                }}
                onBlur={() => targetExam && validateDate(targetExam)}
                placeholder="25-12-2025"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {dateError && (
                <p className="mt-2 text-sm text-red-600">{dateError}</p>
              )}
              <p className="mt-2 text-sm text-gray-600">
                Enter your exam date in the format: Day-Month-Year (e.g., 15-06-2026)
              </p>
            </div>
          </div>

          {/* Groups - Only show for CA, CS, CMA */}
          {(userData.course === 'CA' || userData.course === 'CS' || userData.course === 'CMA') && (
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
          )}

          {/* Subject Management */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-800">Custom Subjects</h3>
              <button
                onClick={() => setShowAddSubject(!showAddSubject)}
                className="flex items-center gap-1 px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>

            {showAddSubject && (
              <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                <input
                  type="text"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  placeholder="Enter subject name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 mb-2"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAddSubject}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                  >
                    Add Subject
                  </button>
                  <button
                    onClick={() => {
                      setShowAddSubject(false);
                      setNewSubjectName('');
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {customSubjects.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No custom subjects yet</p>
              ) : (
                customSubjects.map((subject) => (
                  <div
                    key={subject.id}
                    className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
                  >
                    <span className="font-medium text-gray-900">{subject.name}</span>
                    <button
                      onClick={() => handleDeleteSubject(subject.id)}
                      className="p-1.5 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                ))
              )}
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
              disabled={loading || (userData.course !== 'Other' && selectedGroups.length === 0)}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};
