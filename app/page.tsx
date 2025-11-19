"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { LoginForm } from "@/components/Auth/LoginForm";
import { SignupForm } from "@/components/Auth/SignupForm";
import { OnboardingWizard } from "@/components/Onboarding/OnboardingWizard";
import { Dashboard } from "@/components/Dashboard/Dashboard";

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const [showSignup, setShowSignup] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkUserData = async () => {
      if (!user) {
        setCheckingOnboarding(false);
        return;
      }

      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          // Document should have been created by AuthContext, but user might need onboarding
          setNeedsOnboarding(true);
        } else {
          const userData = userDoc.data();
          // Check if user has completed onboarding
          const hasValidCourse = userData?.course && userData.course !== "";
          const hasDisplayName = userData?.displayName && userData.displayName !== "";
          // For "Other" course, we just need course and display name
          // For specific courses, we also need targetExam
          const needsTargetExam = userData?.course && userData.course !== "Other";
          const hasTargetExam = !needsTargetExam || (userData?.targetExam && userData.targetExam !== "");
          
          const hasCompletedOnboarding = hasValidCourse && hasDisplayName && hasTargetExam;
          setNeedsOnboarding(!hasCompletedOnboarding);
        }
      } catch (error) {
        console.error("Error checking user data:", error);
        setError("Error loading user data. Please try refreshing the page.");
        // If there's an error, assume they need onboarding to be safe
        setNeedsOnboarding(true);
      } finally {
        setCheckingOnboarding(false);
      }
    };

    if (!authLoading) {
      checkUserData();
    }
  }, [user, authLoading]);

  if (authLoading || checkingOnboarding) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-2xl text-gray-700 font-semibold">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        {showSignup ? (
          <SignupForm onToggleForm={() => setShowSignup(false)} />
        ) : (
          <LoginForm onToggleForm={() => setShowSignup(true)} />
        )}
      </div>
    );
  }

  if (needsOnboarding) {
    return (
      <OnboardingWizard
        userId={user.uid}
        userEmail={user.email || ""}
        onComplete={() => setNeedsOnboarding(false)}
      />
    );
  }

  return <Dashboard />;
}
