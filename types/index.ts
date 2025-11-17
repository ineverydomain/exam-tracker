export type Course = 'CS' | 'CA' | 'CMA' | 'Other';

export type Level = {
  CS: 'Executive' | 'Professional';
  CA: 'Foundation' | 'Intermediate' | 'Final';
  CMA: 'Foundation' | 'Intermediate' | 'Final';
};

export type Group = 'Group 1' | 'Group 2' | 'Both Groups';

export interface Chapter {
  id: string;
  name: string;
}

export interface Paper {
  id: string;
  name: string;
  chapters: Chapter[];
}

// Custom subject module interface
export interface Module {
  id: string;
  name: string;
  completed: boolean;
}

// Custom subject interface
export interface CustomSubject {
  id: string;
  name: string;
  modules: Module[];
  createdAt: string;
}

export interface UserData {
  email: string;
  displayName: string;
  course: Course;
  level: string;
  targetExam: string; // Now stored as DD-MM-YYYY format
  groups: string[];
  progress: Record<string, string[]>; // paperId -> completed chapterIds
  customSubjects: CustomSubject[]; // User-defined subjects
  studyStreak: {
    current: number;
    lastCheckedDate: string; // YYYY-MM-DD format
  };
  streakCount: number; // Alias for backward compatibility
  lastCheckInDate: string; // Alias for backward compatibility
  createdAt: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  threshold: number; // percentage
  icon: string;
  unlocked: boolean;
}
