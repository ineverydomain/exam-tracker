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
            "studyStreak.lastCheckedDate": new Date().toISOString(),
          });
        }
      }
    };

    checkAndResetStreak();
  }, [user, userData]);

  // Real-time user data subscription with error handling
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, "users", user.uid),
      (doc) => {
        if (doc.exists()) {
          const data = doc.data() as UserData;
          setUserData(data);

          // Load papers based on user's course and groups
          if (data.course && data.groups && data.course !== "Other") {
            try {
              const userPapers = getPapers(data.course, data.level, data.groups);
              setPapers(userPapers);
            } catch (error) {
              console.error("Error loading papers:", error);
              setPapers([]);
            }
          } else {
            setPapers([]);
          }
        } else {
          console.error("User document does not exist");
          setToast({
            message: "User data not found. Please try logging out and back in.",
            type: "error",
          });
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching user data:", error);
        setToast({
          message: "Failed to load user data. Please check your connection.",
          type: "error",
        });
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Add custom subject
  const handleAddCustomSubject = async (subjectName: string, moduleCount: number) => {
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

    try {
      await updateDoc(doc(db, "users", user.uid), {
        customSubjects: arrayUnion(newSubject),
      });
      setToast({ message: "Custom subject added successfully!", type: "success" });
    } catch (error) {
      console.error("Error adding custom subject:", error);
      setToast({ message: "Failed to add custom subject.", type: "error" });
    }
  };

  // Toggle module completion in custom subject
  const handleModuleToggle = async (subjectId: string, moduleId: string) => {
    if (!user || !userData) return;

    const updatedSubjects = (userData.customSubjects || []).map((subject) => {
      if (subject.id === subjectId) {
        return {
          ...subject,
          modules: subject.modules.map((module) =>
            module.id === moduleId
              ? { ...module, completed: !module.completed }
              : module
          ),
        };
      }
      return subject;
    });

    try {
      await updateDoc(doc(db, "users", user.uid), {
        customSubjects: updatedSubjects,
      });
    } catch (error) {
      console.error("Error updating module:", error);
      setToast({ message: "Failed to update progress.", type: "error" });
    }
  };

  // Delete custom subject
  const handleDeleteCustomSubject = async (subjectId: string) => {
    if (!user || !userData) return;

    const updatedSubjects = (userData.customSubjects || []).filter(
      (subject) => subject.id !== subjectId
    );

    try {
      await updateDoc(doc(db, "users", user.uid), {
        customSubjects: updatedSubjects,
      });
      setToast({ message: "Subject deleted successfully.", type: "success" });
    } catch (error) {
      console.error("Error deleting subject:", error);
      setToast({ message: "Failed to delete subject.", type: "error" });
    }
  };

  // Rename module in custom subject
  const handleModuleRename = async (subjectId: string, moduleId: string, newName: string) => {
    if (!user || !userData) return;

    const updatedSubjects = (userData.customSubjects || []).map((subject) => {
      if (subject.id === subjectId) {
        return {
          ...subject,
          modules: subject.modules.map((module) =>
            module.id === moduleId ? { ...module, name: newName } : module
          ),
        };
      }
      return subject;
    });

    try {
      await updateDoc(doc(db, "users", user.uid), {
        customSubjects: updatedSubjects,
      });
    } catch (error) {
      console.error("Error renaming module:", error);
      setToast({ message: "Failed to rename module.", type: "error" });
    }
  };

  // Handle daily study check - YES
  const handleStudyCheckYes = async () => {
    if (!user || !userData) return;

    const today = new Date().toISOString().split("T")[0];
    const lastChecked = userData.studyStreak?.lastCheckedDate?.split("T")[0] || "";

    // Check if already logged today
    if (lastChecked === today) {
      setToast({ message: "You've already logged your study for today!", type: "info" });
      setShowStudyCheck(false);
      return;
    }

    let newStreak = userData.studyStreak?.current || 0;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    if (lastChecked === yesterdayStr) {
      // Checked in yesterday - increment streak
      newStreak += 1;
    } else if (lastChecked === "" || lastChecked === null) {
      // First time checking in - start at 1
      newStreak = 1;
    } else {
      // Missed days - restart streak at 1
      newStreak = 1;
    }

    try {
      await updateDoc(doc(db, "users", user.uid), {
        "studyStreak.current": newStreak,
        "studyStreak.lastCheckedDate": new Date().toISOString(),
      });
      setToast({ message: `Great! Your streak is now ${newStreak} days!`, type: "success" });
    } catch (error) {
      console.error("Error updating streak:", error);
      setToast({ message: "Failed to update your streak.", type: "error" });
    }

    setShowStudyCheck(false);
  };

  // Handle daily study check - NO
  const handleStudyCheckNo = async () => {
    if (!user) return;

    try {
      await updateDoc(doc(db, "users", user.uid), {
        "studyStreak.current": 0,
        "studyStreak.lastCheckedDate": new Date().toISOString(),
      });
      setToast({ message: "No worries! Tomorrow is a new day to start your streak.", type: "info" });
    } catch (error) {
      console.error("Error resetting streak:", error);
      setToast({ message: "Failed to update your streak.", type: "error" });
    }

    setShowStudyCheck(false);
  };

  // Toggle chapter completion
  const handleChapterToggle = async (paperId: string, chapterId: string) => {
    if (!user || !userData) return;

    const currentProgress = userData.progress || {};
    const paperProgress = currentProgress[paperId] || [];
    
    const updatedProgress = paperProgress.includes(chapterId)
      ? paperProgress.filter((id) => id !== chapterId)
      : [...paperProgress, chapterId];

    try {
      await updateDoc(doc(db, "users", user.uid), {
        [`progress.${paperId}`]: updatedProgress,
      });
    } catch (error) {
      console.error("Error updating chapter progress:", error);
      setToast({ message: "Failed to update progress.", type: "error" });
    }
  };

  // Calculate overall progress
  const calculateOverallProgress = () => {
    if (!userData) return 0;

    // Get custom subjects
    const customSubjects = userData.customSubjects || [];
    
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
    const totalCustomModules = customSubjects.reduce(
      (sum, subject) => sum + (subject?.modules?.length || 0),
      0
    );
    const completedCustomModules = customSubjects.reduce(
      (sum, subject) =>
        sum + (subject?.modules?.filter((m) => m?.completed)?.length || 0),
      0
    );

    const totalItems = totalPaperChapters + totalCustomModules;
    const completedItems = completedPaperChapters + completedCustomModules;

    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome!</h2>
          <p className="text-gray-600 mb-6">Setting up your dashboard...</p>
          <button
            onClick={logout}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  const overallProgress = calculateOverallProgress();

  return (
    <>
      {/* Toast Notification */}
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome back, {userData.displayName || "Student"}!
                </h1>
                <p className="text-lg text-gray-600 mt-1">
                  {userData.course} {userData.level && userData.level !== "Not Applicable" ? `- ${userData.level}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
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

        {/* Settings Panel */}
        <div className="relative">
          {showSettings && (
            <SettingsPanel
              userData={userData}
              onClose={() => setShowSettings(false)}
              userId={user!.uid}
            />
          )}
        </div>

        {/* Study Check Popup */}
        {showStudyCheck && (
          <StudyCheckPopup
            onYes={handleStudyCheckYes}
            onNo={handleStudyCheckNo}
            onClose={() => setShowStudyCheck(false)}
          />
        )}

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Top Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <ProgressCard progress={overallProgress} />
            <div onClick={() => setShowStudyCheck(true)}>
              <StudyStreakCard streak={userData.studyStreak?.current || 0} />
            </div>
            {userData.targetExam && (
              <CountdownCard targetExam={userData.targetExam} />
            )}
          </div>

          {/* Custom Subjects Section */}
          {(userData.customSubjects?.length || 0) > 0 && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Custom Subjects
                </h2>
                {userData.course === "Other" && (
                  <button
                    onClick={() => setShowAddSubject(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Add Subject
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {userData.customSubjects?.map((subject) => (
                  <CustomSubjectCard
                    key={subject.id}
                    subject={subject}
                    onModuleToggle={handleModuleToggle}
                    onDelete={handleDeleteCustomSubject}
                    onModuleRename={handleModuleRename}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Papers Section */}
          {papers.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Syllabus Papers
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {papers.map((paper) => (
                  <PaperCard
                    key={paper.id}
                    paper={paper}
                    completedChapters={userData.progress?.[paper.id] || []}
                    onChapterToggle={(chapterId) =>
                      handleChapterToggle(paper.id, chapterId)
                    }
                  />
                ))}
              </div>
            </div>
          )}

          {/* Add Subject Button for Other Course */}
          {userData.course === "Other" && (!userData.customSubjects || userData.customSubjects.length === 0) && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Ready to start tracking?
              </h3>
              <p className="text-gray-600 mb-6">
                Add your first custom subject to begin tracking your study progress.
              </p>
              <button
                onClick={() => setShowAddSubject(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                <Plus className="w-5 h-5" />
                Add Your First Subject
              </button>
            </div>
          )}

          {/* Milestones Section */}
          <MilestonesSection progress={overallProgress} />
        </main>

        {/* Add Subject Modal */}
        {showAddSubject && (
          <AddSubjectModal
            onClose={() => setShowAddSubject(false)}
            onAdd={handleAddCustomSubject}
          />
        )}
      </div>
    </>
  );
};
