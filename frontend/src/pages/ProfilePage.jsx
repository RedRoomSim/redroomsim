/*
File:                 ProfilePage.jsx
Path:                 /src/pages/ProfilePage.jsx
Author:               Umair Asad
Last Modified By:     Umair Asad
Last Modified Date:   2025-06-15
Version:              1.0.0
Project:              RedRoomSim
License:              MIT
Copyright (c) 2025 RedRoomSim Team
Description:          User profile information and update screen.
Changelog:
 - Initial setup for ProfilePage component.
 - Integrated user information retrieval and display from firebase database.
 - Added profile update functionality.
 - Implemented responsive design for better user experience.
 - Added profile picture upload feature - not implemented fully yet, but structure is in place.
 - dark mode support for better user experience.
*/


// Import necessary libraries and components
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../../firebase/firebaseConfig";

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    designation: "",
    role: "",
    photoURL: "",
    profilePicture: null
  });
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProfile(prev => ({
          ...prev,
          ...data,
          email: user.email,
        }));
      }
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfile({ ...profile, profilePicture: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    let photoURL = profile.photoURL;

    if (profile.profilePicture) {
      const fileRef = ref(storage, `profilePictures/${user.uid}`);
      await uploadBytes(fileRef, profile.profilePicture);
      photoURL = await getDownloadURL(fileRef);
    }

    const updateData = {
      firstName: profile.firstName,
      lastName: profile.lastName,
      designation: profile.designation,
      photoURL,
    };

    await updateDoc(doc(db, "users", user.uid), updateData);
    setSuccess("Profile updated successfully!");
    setTimeout(() => setSuccess(""), 3000);
  };

  if (loading) return <div className="p-6 text-gray-900 dark:text-white">Loading profile...</div>;

  return (
    <div className="p-6 text-gray-900 dark:text-white">
      <h2 className="text-2xl font-bold mb-6">My Profile</h2>

      {success && (
        <div className="bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-200 p-3 rounded mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <div>
          <label className="block font-semibold mb-1">First Name</label>
          <input
            type="text"
            name="firstName"
            value={profile.firstName}
            onChange={handleChange}
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={profile.lastName}
            onChange={handleChange}
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Email Address</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            disabled
            className="border bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 p-2 rounded w-full cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Designation</label>
          <input
            type="text"
            name="designation"
            value={profile.designation}
            onChange={handleChange}
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">User Role</label>
          <input
            type="text"
            name="role"
            value={profile.role}
            disabled
            className="border bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 p-2 rounded w-full cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Profile Picture</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border border-gray-300 dark:border-gray-600 p-2 rounded w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
          {profile.photoURL && (
            <div className="mt-2">
              <img
                src={profile.photoURL}
                alt="Profile"
                className="h-24 w-24 rounded-full object-cover border border-gray-300 dark:border-gray-600"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
