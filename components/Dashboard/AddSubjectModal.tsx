'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

interface AddSubjectModalProps {
  onClose: () => void;
  onAdd: (subjectName: string, moduleCount: number) => void;
}

export const AddSubjectModal: React.FC<AddSubjectModalProps> = ({ onClose, onAdd }) => {
  const [subjectName, setSubjectName] = useState('');
  const [moduleCount, setModuleCount] = useState<number>(1);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subjectName.trim()) {
      setError('Subject name is required');
      return;
    }

    if (moduleCount < 1 || moduleCount > 100) {
      setError('Module count must be between 1 and 100');
      return;
    }

    onAdd(subjectName.trim(), moduleCount);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Add Custom Subject</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Subject Name
            </label>
            <input
              type="text"
              value={subjectName}
              onChange={(e) => {
                setSubjectName(e.target.value);
                setError('');
              }}
              placeholder="e.g., Data Structures, Machine Learning"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Number of Modules/Chapters
            </label>
            <input
              type="number"
              value={moduleCount}
              onChange={(e) => {
                setModuleCount(parseInt(e.target.value) || 1);
                setError('');
              }}
              min="1"
              max="100"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            />
            <p className="text-sm text-gray-600 mt-1">Modules will be numbered automatically (Module 1, Module 2, etc.)</p>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Add Subject
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
