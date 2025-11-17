"use client";

import React, { useState, useEffect } from "react";
import { doc, onSnapshot, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserData, Paper, CustomSubject } from "@/types";
import { getPapers } from "@/data/syllabus";
import { CountdownCard } from "./CountdownCard";
import { ProgressCard } from "./ProgressCard";
import { StudyStreakCard } from "./StudyStreakCard";
import { PaperCard } from "./PaperCard";
import { CustomSubjectCard } from "./CustomSubjectCard";
import { AddSubjectModal } from "./AddSubjectModal";
import { StudyCheckPopup } from "./StudyCheckPopup";
import { MilestonesSection } from "./MilestonesSection";
import { SettingsPanel } from "./SettingsPanel";
import { useAuth } from "@/contexts/AuthContext";
import { Plus } from "lucide-react";
import { Toast } from "../Toast";

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [showStudyCheck, setShowStudyCheck] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  // Check if streak should be reset due to missed days (only runs once on load)
  useEffect(() => {
    if (!user || !userData) return;

    const checkAndResetStreak = async () => {
      const today = new Date().toISOString().split("T")[0];
      const lastChecked = userData.studyStreak?.lastCheckedDate
        ? userData.studyStreak.lastCheckedDate.split("T")[0]
        : "";

      // If there's a last check date and streak is not 0
      if (lastChecked && (userData.studyStreak?.current || 0) > 0) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];

        // If last check was NOT yesterday or today, reset streak
        if (lastChecked !== yesterdayStr && lastChecked !== today) {
          await updateDoc(doc(db, "users", user.uid), {
            "studyStreak.current": 0,
          });
        }
      }
    };

    checkAndResetStreak();
  }, [user, userData]);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(doc(db, "users", user.uid), (doc) => {
      if (doc.exists()) {
        const data = doc.data() as UserData;
        // Ensure customSubjects exists (for migration from old data)
        if (!data.customSubjects) {
          data.customSubjects = [];
        }
        setUserData(data);
        const userPapers = getPapers(data.course, data.level, data.groups);
        setPapers(userPapers);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Handle toggling chapters for predefined papers
  const handleChapterToggle = async (paperId: string, chapterId: string) => {
    if (!user || !userData) return;

    const currentProgress = userData.progress[paperId] || [];
    const isCompleted = currentProgress.includes(chapterId);

    const newProgress = isCompleted
      ? currentProgress.filter((id) => id !== chapterId)
      : [...currentProgress, chapterId];

    const updatedProgress = {
      ...userData.progress,
      [paperId]: newProgress,
    };

    await updateDoc(doc(db, "users", user.uid), {
      progress: updatedProgress,
    });
  };

  // Handle adding a new custom subject
  const handleAddSubject = async (subjectName: string, moduleCount: number) => {
    if (!user) return;

    const newSubject: CustomSubject = {
      id: `custom_${Date.now()}`,
      name: subjectName,
      modules: Array.from({ length: moduleCount }, (_, i) => ({
        id: `module_${i + 1}`,
        name: `Module ${i + 1}`,
        completed: false,
      })),
      createdAt: new Date().toISOString(),
    };

    await updateDoc(doc(db, "users", user.uid), {
      customSubjects: arrayUnion(newSubject),
    });
  };

  // Handle toggling module completion for custom subjects
  const handleModuleToggle = async (subjectId: string, moduleId: string) => {
    if (!user || !userData) return;

    const updatedSubjects = (userData.customSubjects || []).map((subject) => {
      if (subject.id === subjectId) {
        return {
          ...subject,
          modules: (subject.modules || []).map((module) =>
            module.id === moduleId
              ? { ...module, completed: !module.completed }
              : module
          ),
        };
      }
      return subject;
    });

    await updateDoc(doc(db, "users", user.uid), {
      customSubjects: updatedSubjects,
    });
  };

  // Handle deleting a custom subject
  const handleDeleteSubject = async (subjectId: string) => {
    if (!user || !userData) return;

    const updatedSubjects = (userData.customSubjects || []).filter(
      (subject) => subject.id !== subjectId
    );

    await updateDoc(doc(db, "users", user.uid), {
      customSubjects: updatedSubjects,
    });
  };

  // Handle renaming a module
  const handleModuleRename = async (
    subjectId: string,
    moduleId: string,
    newName: string
  ) => {
    if (!user || !userData) return;

    const updatedSubjects = (userData.customSubjects || []).map((subject) => {
      if (subject.id === subjectId) {
        return {
          ...subject,
          modules: (subject.modules || []).map((module) =>
            module.id === moduleId ? { ...module, name: newName } : module
          ),
        };
      }
      return subject;
    });

    await updateDoc(doc(db, "users", user.uid), {
      customSubjects: updatedSubjects,
    });
  };

  // Handle daily study check - YES
  const handleStudyCheckYes = async () => {
    if (!user || !userData) return;

    const today = new Date().toISOString().split("T")[0];
    const lastChecked = userData.studyStreak?.lastCheckedDate
      ? userData.studyStreak.lastCheckedDate.split("T")[0]
      : "";

    // Check if already logged today
    if (lastChecked === today) {
      setToast({ message: "Today's streak already recorded.", type: "info" });
      setShowStudyCheck(false);
      return;
    }

    let newStreak = userData.studyStreak?.current || 0;

    // Calculate yesterday's date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    // Determine new streak value
    if (lastChecked === yesterdayStr) {
      // Checked in yesterday - increment streak
      newStreak += 1;
    } else if (lastChecked === "" || lastChecked === null) {
      // First time checking in - start at 1
      newStreak = 1;
    } else {
      // More than 1 day gap - reset to 1
      newStreak = 1;
    }

    // Update in database
    await updateDoc(doc(db, "users", user.uid), {
      "studyStreak.current": newStreak,
      "studyStreak.lastCheckedDate": new Date().toISOString(),
    });

    setShowStudyCheck(false);
  };

  // Handle daily study check - NO
  const handleStudyCheckNo = async () => {
    if (!user) return;

    // Reset streak to 0 and update last checked date
    await updateDoc(doc(db, "users", user.uid), {
      "studyStreak.current": 0,
      "studyStreak.lastCheckedDate": new Date().toISOString(),
    });

    setShowStudyCheck(false);
  };

  const handleResetProgress = async () => {
    if (!user) return;

    const confirmed = window.confirm(
      "Are you sure you want to reset ALL progress (including custom subjects)? This action cannot be undone."
    );

    if (confirmed) {
      // Reset all custom subjects modules to incomplete
      const resetCustomSubjects = (userData?.customSubjects || []).map(
        (subject) => ({
          ...subject,
          modules: (subject?.modules || []).map((module) => ({
            ...module,
            completed: false,
          })),
        })
      );

      await updateDoc(doc(db, "users", user.uid), {
        progress: {},
        customSubjects: resetCustomSubjects,
        "studyStreak.current": 0,
        "studyStreak.lastCheckedDate": "",
      });
    }
  };

  // Calculate overall progress including custom subjects
  const calculateOverallProgress = () => {
    if (!userData) return 0;

    // Calculate progress from predefined papers
    const totalPaperChapters =
      papers?.reduce((sum, paper) => sum + (paper?.chapters?.length || 0), 0) ||
      0;
    const completedPaperChapters = userData.progress
      ? Object.values(userData.progress).reduce(
          (sum, chapters) => sum + (chapters?.length || 0),
          0
        )
      : 0;

    // Calculate progress from custom subjects
    const customSubjects = userData.customSubjects || [];
    const totalCustomModules = customSubjects.reduce(
      (sum, subject) => sum + (subject?.modules?.length || 0),
      0
    );
    const completedCustomModules = customSubjects.reduce(
      (sum, subject) =>
        sum + (subject?.modules?.filter((m) => m?.completed)?.length || 0),
      0
    );

    // Combined calculation
    const totalItems = totalPaperChapters + totalCustomModules;
    const completedItems = completedPaperChapters + completedCustomModules;

    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-2xl text-gray-600">No data found</div>
      </div>
    );
  }

  const overallProgress = calculateOverallProgress();

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {userData.course} {userData.level} Exam Tracker
                </h1>
                <p className="text-gray-600 mt-1">
                  Welcome back, {userData.displayName || 'Student'}!
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Settings
                </button>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Modals and Popups */}
          {showSettings && (
            <SettingsPanel
              userData={userData}
              userId={user!.uid}
              onClose={() => setShowSettings(false)}
            />
          )}

          {showAddSubject && (
            <AddSubjectModal
              onClose={() => setShowAddSubject(false)}
              onAdd={handleAddSubject}
            />
          )}

          {showStudyCheck && (
            <StudyCheckPopup
              onYes={handleStudyCheckYes}
              onNo={handleStudyCheckNo}
              onClose={() => setShowStudyCheck(false)}
            />
          )}

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <CountdownCard targetExam={userData.targetExam || ""} />
            <ProgressCard progress={overallProgress} />
            <div onClick={() => setShowStudyCheck(true)}>
              <StudyStreakCard streak={userData.studyStreak?.current || 0} />
            </div>
          </div>

          {/* Milestones */}
          <MilestonesSection progress={overallProgress} />

          {/* Custom Subjects Section */}
          {userData.customSubjects && userData.customSubjects.length > 0 && (
            <>
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  Custom Subjects
                </h2>
                <button
                  onClick={() => setShowAddSubject(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add Subject
                </button>
              </div>

              <div className="space-y-4 mb-8">
                {userData.customSubjects.map((subject) => (
                  <CustomSubjectCard
                    key={subject.id}
                    subject={subject}
                    onModuleToggle={handleModuleToggle}
                    onDelete={handleDeleteSubject}
                    onModuleRename={handleModuleRename}
                  />
                ))}
              </div>
            </>
          )}

          {/* Papers Section - Hide for Other course if no papers */}
          {(userData.course !== "Other" || papers.length > 0) && (
            <>
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {userData.customSubjects && userData.customSubjects.length > 0
                    ? "Course Papers"
                    : "Your Papers"}
                </h2>
                <div className="flex gap-3">
                  {(!userData.customSubjects ||
                    userData.customSubjects.length === 0) && (
                    <button
                      onClick={() => setShowAddSubject(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      Add Custom Subject
                    </button>
                  )}
                  <button
                    onClick={handleResetProgress}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    Reset All Progress
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {papers.map((paper) => (
                  <PaperCard
                    key={paper.id}
                    paper={paper}
                    completedChapters={userData.progress[paper.id] || []}
                    onChapterToggle={(chapterId) =>
                      handleChapterToggle(paper.id, chapterId)
                    }
                  />
                ))}
              </div>
            </>
          )}

          {papers.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              {userData.course === "Other" ? (
                <>
                  <div className="mb-4">
                    <svg
                      className="w-16 h-16 mx-auto text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No subjects found
                  </h3>
                  <p className="text-gray-700 mb-6">
                    Add your own subjects to start tracking your progress!
                  </p>
                  <button
                    onClick={() => setShowAddSubject(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                  >
                    <Plus className="w-5 h-5" />
                    Add Your First Subject
                  </button>
                </>
              ) : (
                <>
                  <p className="text-gray-700 text-lg">
                    No papers found for your selection.
                  </p>
                  <button
                    onClick={() => setShowAddSubject(true)}
                    className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                  >
                    <Plus className="w-5 h-5" />
                    Add Your First Custom Subject
                  </button>
                </>
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
};
