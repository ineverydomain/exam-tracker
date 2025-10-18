'use client';

import React, { useState } from 'react';
import { Course } from '@/types';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface OnboardingWizardProps {
  userId: string;
  userEmail: string;
  onComplete: () => void;
}

const courseOptions: Course[] = ['CS', 'CA', 'CMA'];

const levelOptions: Record<Course, string[]> = {
  CS: ['Executive', 'Professional'],
  CA: ['Foundation', 'Intermediate', 'Final'],
  CMA: ['Foundation', 'Intermediate', 'Final'],
};

const examOptions = [
  'Dec 2025',
  'June 2026',
  'Dec 2026',
  'June 2027',
  'Dec 2027',
];

const groupOptions = ['Group 1', 'Group 2', 'Both Groups'];

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  userId,
  userEmail,
  onComplete,
}) => {
  const [step, setStep] = useState(1);
  const [course, setCourse] = useState<Course>('CS');
  const [level, setLevel] = useState('');
  const [targetExam, setTargetExam] = useState('');
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [displayName, setDisplayName] = useState('');
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

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const userData = {
        email: userEmail,
        displayName: displayName || 'Student',
        course,
        level,
        targetExam,
        groups: selectedGroups,
        progress: {},
        customSubjects: [], // Initialize empty custom subjects array
        studyStreak: {
          current: 0,
          lastCheckedDate: '', // Changed from lastMarkedDate
        },
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'users', userId), userData);
      onComplete();
    } catch (error) {
      console.error('Error saving user data:', error);
      alert('Failed to save data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return displayName.trim() !== '';
      case 2:
        return course !== '';
      case 3:
        return level !== '';
      case 4:
        return targetExam !== '';
      case 5:
        return selectedGroups.length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold text-gray-800">Setup Your Profile</h2>
            <span className="text-sm text-gray-500">Step {step} of 5</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Display Name */}
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-800">What should we call you?</h3>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
          </div>
        )}

        {/* Step 2: Course Selection */}
        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-800">Select Your Course</h3>
            <div className="grid grid-cols-3 gap-4">
              {courseOptions.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setCourse(c);
                    setLevel('');
                  }}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    course === c
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-blue-300'
                  }`}
                >
                  <div className="text-3xl font-bold">{c}</div>
                  <div className="text-sm mt-2">
                    {c === 'CS' && 'Company Secretary'}
                    {c === 'CA' && 'Chartered Accountancy'}
                    {c === 'CMA' && 'Cost & Management'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Level Selection */}
        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-800">Select Your Level</h3>
            <div className="grid grid-cols-2 gap-4">
              {levelOptions[course].map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    level === l
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-blue-300'
                  }`}
                >
                  <div className="text-xl font-semibold">{l}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Target Exam */}
        {step === 4 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-800">Select Target Exam</h3>
            <div className="grid grid-cols-2 gap-4">
              {examOptions.map((exam) => (
                <button
                  key={exam}
                  onClick={() => setTargetExam(exam)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    targetExam === exam
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-blue-300'
                  }`}
                >
                  <div className="text-lg font-semibold">{exam}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Group Selection */}
        {step === 5 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-800">Select Your Group(s)</h3>
            <div className="space-y-3">
              {groupOptions.map((group) => (
                <button
                  key={group}
                  onClick={() => handleGroupToggle(group)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    selectedGroups.includes(group)
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">{group}</span>
                    {selectedGroups.includes(group) && (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
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

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between">
          <button
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
            className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Back
          </button>

          {step < 5 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!isStepValid()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!isStepValid() || loading}
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
            >
              {loading ? 'Saving...' : 'Complete Setup'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
