/*
File:                 AdminUserList.jsx
Path:                 /src/components/AdminPanel/AdminUserList.jsx
Author:               Umair Asad
Last Modified By:     Umair Asad
Last Modified Date:   2025-06-15
Version:              1.0.0
Project:              RedRoomSim
License:              MIT
Copyright (c) 2025 RedRoomSim Team
Description:          Admin user management component for the Red Room Simulation application.
Changelog:
 - Initial setup for AdminUserList component.
 - Implemented user fetching and editing functionality.
 - Added loading state and error handling.
 - Implemented search functionality for user list.  
 - Added modal for editing user details.
 - Fixed the user role after editing.
*/

import React, { useEffect, useState } from "react";
import { db } from "../../../firebase/firebaseConfig";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

const AdminUserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [loading, setLoading] = useState(true);

  const totalUsers = users.filter(user => user.role !== 'pending').length;
  const activeUsers = users.filter(user => !user.disabled && user.role !== 'pending').length;
  const disabledUsers = users.filter(user => user.disabled).length;
  const usersWithoutRole = users.filter(user => user.role === 'pending').length;


  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const userList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(userList);
      setFilteredUsers(userList);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user =>
      `${user.firstName} ${user.lastName} ${user.email} ${user.role} ${user.designation}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setEditForm({ ...user });
  };

  const toggleAccountStatus = async (user) => {
    const userRef = doc(db, "users", user.id);
    const newStatus = !user.disabled;
    await updateDoc(userRef, { disabled: newStatus });
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, disabled: newStatus } : u));
    setFilteredUsers(prev => prev.map(u => u.id === user.id ? { ...u, disabled: newStatus } : u));
    if (selectedUser && selectedUser.id === user.id) {
      setSelectedUser(prev => ({ ...prev, disabled: newStatus }));
      setEditForm(prev => ({ ...prev, disabled: newStatus }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const userRef = doc(db, "users", selectedUser.id);
    await updateDoc(userRef, editForm);
    setUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...u, ...editForm } : u));
    setSelectedUser(null);
  };

  if (loading) return <div className="p-6 text-gray-900 dark:text-white">Loading users...</div>;

  return (
    <>
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-6">
        <h2 className="text-2xl font-bold mb-4">Manage User</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded shadow">
            <p className="text-sm">Total Users</p>
            <p className="text-lg font-bold">{totalUsers}</p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded shadow">
            <p className="text-sm">Active Users</p>
            <p className="text-lg font-bold">{activeUsers}</p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded shadow">
            <p className="text-sm">Disabled Users</p>
            <p className="text-lg font-bold">{disabledUsers}</p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded shadow">
            <p className="text-sm">Pending Approval</p>
            <p className="text-lg font-bold">{usersWithoutRole}</p>
          </div>
        </div>
        <input
          type="text"
          placeholder="Search users..."
          className="mb-4 p-2 border rounded w-full dark:bg-gray-700 dark:text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 rounded shadow overflow-hidden">
          <thead className="bg-gray-200 dark:bg-gray-700 text-left">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Designation</th>
              <th className="px-4 py-2">Account Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id} className="border-t border-gray-300 dark:border-gray-600">
                <td className="px-4 py-2">{user.firstName} {user.lastName}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.role}</td>
                <td className="px-4 py-2">{user.designation}</td>
                <td className="px-4 py-2">{user.disabled ? "Disabled" : "Active"}</td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-4">
                    <button onClick={() => handleEditClick(user)} className="text-blue-600 hover:underline">
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Edit User</h3>
            <div className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">First Name</label>
                <input
                  name="firstName"
                  value={editForm.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Last Name</label>
                <input
                  name="lastName"
                  value={editForm.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Designation</label>
                <input
                  name="designation"
                  value={editForm.designation}
                  onChange={handleChange}
                  placeholder="Designation"
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Role</label>
                <select
                  name="role"
                  value={editForm.role}
                  onChange={handleChange}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                >
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="inline-flex relative items-center cursor-pointer">Account Status</label>
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={!selectedUser.disabled}
                    onChange={() => toggleAccountStatus(selectedUser)}
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:bg-red-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-4">
              <button onClick={() => setSelectedUser(null)} className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700">Save</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminUserList;
