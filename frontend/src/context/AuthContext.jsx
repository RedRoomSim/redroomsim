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
        }
      } else {
        setCurrentUser(null);
        setRole(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      // Check if user exists in Firestore
      const q = query(collection(db, "users"), where("email", "==", email));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return { success: false, message: "Firebase: Error (auth/invalid-credential)." };
      }

      const found = snapshot.docs[0];
      const uid = found.id;
      const userData = found.data();

      if (userData.disabled) {
        return { success: false, message: "Account disabled due to multiple failed login attempts." };
      }
      if (userData.role === "pending") {
        return { success: false, message: "Your account is pending approval. Please wait for an admin to assign a role." };
      }
      // Try Firebase Auth login
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Reset login attempts
      await updateDoc(doc(db, "users", uid), {
        failedAttempt: 0,
        disabled: false,
      });

      setCurrentUser(userCredential.user);
      setRole(userData.role || "pending");
      
      // Log login activity to backend
      await axios.post("http://localhost:8000/api/logs/log-login", {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        role: userData.role || "pending",
      });

      return { success: true };
    } catch (error) {
      try {
        // Track failed login
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
        await axios.post("http://localhost:8000/api/logs/log-failed-login", {
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
      await axios.post("http://localhost:8000/api/logs/log-logout", {
        uid: currentUser.uid,
        email: currentUser.email,
        role: role || "unknown",
      });
    }
    return signOut(auth);
  };
  
  const logPasswordChange = async () => {
    if (currentUser) {
      await axios.post("http://localhost:8000/api/logs/log-password-change", {
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


