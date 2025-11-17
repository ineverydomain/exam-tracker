"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

// Helper function to ensure user document exists in Firestore
const ensureUserDocument = async (user: User) => {
  try {
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      // Create a new user document with safe defaults
      const userData = {
        email: user.email || "",
        displayName: user.displayName || "Student",
        course: "Other",
        level: "Not Applicable",
        targetExam: "",
        groups: [],
        progress: {},
        customSubjects: [],
        studyStreak: {
          current: 0,
          lastCheckedDate: "",
        },
        createdAt: new Date().toISOString(),
      };

      await setDoc(userDocRef, userData);
      console.log("Created new user document in Firestore");
    }
  } catch (error) {
    console.error("Error ensuring user document:", error);
    throw error;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          await ensureUserDocument(user);
          setUser(user);
        } catch (error) {
          console.error("Error in onAuthStateChanged:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Ensure user document exists in Firestore
    await ensureUserDocument(userCredential.user);
  };

  const signUp = async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Create user document immediately after signup
    try {
      await ensureUserDocument(userCredential.user);
      console.log("User document created during signup");
    } catch (error) {
      console.error("Error creating user document during signup:", error);
    }

    // User is now signed in and can access the app immediately
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);

    // Ensure user document exists in Firestore
    await ensureUserDocument(userCredential.user);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
