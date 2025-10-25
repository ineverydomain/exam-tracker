'use client';

import React from 'react';
import { CheckCircle, X } from 'lucide-react';

interface StudyCheckPopupProps {
  onYes: () => void;
  onNo: () => void;
  onClose: () => void;
}

export const StudyCheckPopup: React.FC<StudyCheckPopupProps> = ({ onYes, onNo, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Daily Study Check</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        <div className="p-6 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Did you study today?
            </h3>
            <p className="text-gray-700 font-medium mb-2">
              You can choose your streak option only once today.
            </p>
            <p className="text-gray-700">
              Be honest to yourself.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onNo}
              className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-900"
            >
              No
            </button>
            <button
              onClick={onYes}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Yes, I Did! ✓
            </button>
          </div>

          <p className="text-sm text-gray-600 mt-4">
            Honesty helps build genuine study habits.
          </p>
        </div>
      </div>
    </div>
  );
};
