"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import { Paper } from "@/types";

interface PaperCardProps {
  paper: Paper;
  completedChapters: string[];
  onChapterToggle: (chapterId: string) => void;
}

export const PaperCard: React.FC<PaperCardProps> = ({
  paper,
  completedChapters,
  onChapterToggle,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const totalChapters = paper.chapters?.length || 0;
  const completed = completedChapters?.length || 0;
  const progress =
    totalChapters > 0 ? Math.round((completed / totalChapters) * 100) : 0;

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden transition-all hover:shadow-lg">
      {/* Paper Header */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3 flex-1">
            <div className="p-2 bg-indigo-100 rounded-lg mt-1">
              <BookOpen className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {paper.name}
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-700">
                <span>
                  {completed} of {totalChapters} chapters
                  completed
                </span>
                <span className="font-semibold text-indigo-600">
                  {progress}%
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-gradient-to-r from-indigo-400 to-indigo-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Chapters List */}
      {isExpanded && (
        <div className="border-t border-gray-200 bg-gray-50 p-5">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase">
            Chapters
          </h4>
          <div className="space-y-2">
            {(paper.chapters || []).map((chapter) => {
              const isCompleted = (completedChapters || []).includes(chapter.id);
              return (
                <label
                  key={chapter.id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                    isCompleted
                      ? "bg-green-50 border border-green-200"
                      : "bg-white border border-gray-200 hover:border-indigo-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isCompleted}
                    onChange={() => onChapterToggle(chapter.id)}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  />
                  <span
                    className={`flex-1 ${
                      isCompleted
                        ? "text-green-800 line-through"
                        : "text-gray-800"
                    }`}
                  >
                    {chapter.name}
                  </span>
                  {isCompleted && (
                    <span className="text-green-600 text-sm font-medium">
                      ✓ Done
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
