'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { LoginForm } from '@/components/Auth/LoginForm';
import { SignupForm } from '@/components/Auth/SignupForm';
import { OnboardingWizard } from '@/components/Onboarding/OnboardingWizard';
import { Dashboard } from '@/components/Dashboard/Dashboard';

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const [showSignup, setShowSignup] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);

  useEffect(() => {
    const checkUserData = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          setNeedsOnboarding(!userDoc.exists());
        } catch (error) {
          console.error('Error checking user data:', error);
          setNeedsOnboarding(true);
        }
      }
      setCheckingOnboarding(false);
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
        userEmail={user.email || ''}
        onComplete={() => setNeedsOnboarding(false)}
      />
    );
  }

  return <Dashboard />;
}
