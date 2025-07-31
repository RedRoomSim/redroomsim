/*
File:                 AuthContext.jsx
Path:                 /src/context/AuthContext.jsx
Author:               Umair Asad
Last Modified By:     Umair Asad
Last Modified Date:   2025-06-15
Version:              1.0.0
Project:              RedRoomSim
License:              MIT
Copyright (c) 2025 RedRoomSim Team
Description:          Context API for managing user authentication state in the Red Room Simulation application.
Changelog:
 - Initial setup for AuthContext.
 - Added support for user role management.
 - Integrated Firebase authentication and Firestore for user data.
 - Implemented login and logout functionality.
 - Improved error handling and loading states.
 - Added user role tracking and management.
 - Ensured secure access to user data with Firestore rules.
 - Added support for user account locking after multiple failed login attempts.
 - Added user role updates after login.
 - Implemented user data fetching on authentication state change.
 - Added automatic session expiration after inactivity and absolute timeout.
*/

// import necessary libraries
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { auth, db } from "../../firebase/firebaseConfig";
import {
  doc,
  getDoc,
  updateDoc,
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore";
////////////////////////////////////////////////////////
import axios from "axios";
////////////////////////////////////////////////////////
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const INACTIVITY_LIMIT = 30 * 60 * 1000; // 30 minutes
  const ABSOLUTE_LIMIT = 24 * 60 * 60 * 1000; // 24 hours

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCurrentUser(user);
        setRole(data.role || "pending");
        setLoading(false);
        if (!localStorage.getItem("loginTime")) {
          const now = Date.now();
          localStorage.setItem("loginTime", now.toString());
          localStorage.setItem("lastActivity", now.toString());
        }
      }
    } else {
      setCurrentUser(null);
      setRole(null);
      setLoading(false);
    }
  });
  return () => unsubscribe();
}, []);


  useEffect(() => {
    if (!currentUser) return;

    const updateActivity = () => {
      localStorage.setItem("lastActivity", Date.now().toString());
    };

    const checkSession = async () => {
      const now = Date.now();
      const loginTime = parseInt(localStorage.getItem("loginTime") || "0");
      const lastActivity = parseInt(localStorage.getItem("lastActivity") || "0");

      if (loginTime && now - loginTime > ABSOLUTE_LIMIT) {
        localStorage.setItem("logoutReason", "session_expired");
        await logout();
        return;
      }

      if (lastActivity && now - lastActivity > INACTIVITY_LIMIT) {
        localStorage.setItem("logoutReason", "inactive");
        await logout();
      }
    };

    const events = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, updateActivity));

    updateActivity();
    checkSession();
    const interval = setInterval(checkSession, 60 * 1000);

    return () => {
      events.forEach((e) => window.removeEventListener(e, updateActivity));
      clearInterval(interval);
    };
  }, [currentUser]);


  const login = async (email, password) => {
  try {
    // Step 1: Sign in using Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Step 2: Get user Firestore document using UID
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      return { success: false, message: "User record not found in Firestore." };
    }

    const userData = docSnap.data();

    if (userData.disabled) {
      return { success: false, message: "Account disabled due to multiple failed login attempts." };
    }

    if (userData.role === "pending") {
      return { success: false, message: "Your account is pending approval. Please wait for an admin to assign a role." };
    }

    // Step 3: Reset failed login attempts
    await updateDoc(userRef, {
      failedAttempt: 0,
      disabled: false,
    });

    setCurrentUser(user);
    setRole(userData.role || "pending");

    const now = Date.now();
    localStorage.setItem("loginTime", now.toString());
    localStorage.setItem("lastActivity", now.toString());

    // Step 4: Log login activity
    await axios.post("https://api.redroomsim.com/logs/log-login", {
      uid: user.uid,
      email: user.email,
      role: userData.role || "pending",
    });

    return { success: true };
  } catch (error) {
    try {
      // Step 5: Attempt to log failure — fallback using email (less secure)
      const q = query(collection(db, "users"), where("email", "==", email));
      const snapshot = await getDocs(q);
      let uid = null;
      let role = "unknown";

      if (!snapshot.empty) {
        const found = snapshot.docs[0];
        const ref = doc(db, "users", found.id);
        const userData = found.data();
        uid = found.id;
        role = userData.role || "unknown";
        const currentAttempts = userData.failedAttempt || 0;

        const updates = {
          failedAttempt: currentAttempts + 1,
        };

        if (currentAttempts + 1 >= 3) {
          updates.disabled = true;
        }

        await updateDoc(ref, updates);
      }

      await axios.post("https://api.redroomsim.com/logs/log-failed-login", {
        uid,
        email,
        role,
      });
    } catch (innerError) {
      console.error("Error tracking login failure:", innerError);
    }

    return { success: false, message: error.message };
  }
};

  const logout = async () => {
    if (currentUser) {
      await axios.post("https://api.redroomsim.com/logs/log-logout", {
        uid: currentUser.uid,
        email: currentUser.email,
        role: role || "unknown",
      });
    }
    localStorage.removeItem("loginTime");
    localStorage.removeItem("lastActivity");
    return signOut(auth);
  };
  
  const logPasswordChange = async () => {
    if (currentUser) {
      await axios.post("https://api.redroomsim.com/logs/log-password-change", {
        uid: currentUser.uid,
        email: currentUser.email,
        role: role || "unknown",
      });
    }
  };


  return (
    <AuthContext.Provider value={{ loading, user: currentUser, role, login, logout, logPasswordChange, setUser: setCurrentUser, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


