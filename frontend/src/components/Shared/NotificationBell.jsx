import React, { useEffect, useState } from "react";
import axios from "axios";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import { useAuth } from "../../context/AuthContext";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const { role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const notes = [];
    try {
      if (role === "admin") {
        const querySnapshot = await getDocs(collection(db, "users"));
        const pending = querySnapshot.docs.filter(doc => doc.data().role === "pending");
        if (pending.length > 0) {
          notes.push({
            id: "pending",
            message: `${pending.length} user${pending.length > 1 ? "s" : ""} pending approval`,
            link: "/admin/pending-users"
          });
        }
      }
    } catch (err) {
      console.error("Failed to fetch users", err);
    }

      try {
        const response = await axios.get("https://api.redroomsim.com/sim/list");
        const scenarioCount = (response.data.scenarios || []).length;
        const lastCount = parseInt(localStorage.getItem("scenarioCount") || "0", 10);
        if (scenarioCount > lastCount) {
          notes.push({
            id: "scenario",
            message: "New scenario uploaded",
            link: "/scenarios"
          });
        }
        localStorage.setItem("scenarioCount", String(scenarioCount));
      } catch (err) {
        console.error("Failed to fetch scenarios", err);
      }

      setNotifications(notes);
    };

    fetchData();
  }, [role]);

  return (
    <div className="relative flex items-center">
      <button
        onClick={() => setOpen(!open)}
        className="relative accent-text accent-glow opacity-80 hover:opacity-100 flex items-center"
        title="Notifications"
      >
        <Bell
          className={`w-5 h-5 ${notifications.length > 0 ? 'pulse accent-glow' : ''}`}
        />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full text-xs px-1">
            {notifications.length}
          </span>
        )}
      </button>
      {open && notifications.length > 0 && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded shadow-lg z-[60]">
          <ul className="p-2 text-sm text-gray-900 dark:text-white">
            {notifications.map(note => (
              <li
                key={note.id}
                className="py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <button
                  onClick={() => {

                    if (note.id === "scenario") {
                      setNotifications(prev =>
                        prev.filter(n => n.id !== "scenario")
                      );
                    }
                    navigate(note.link);
                    setOpen(false);
                  }}
                  className="text-left w-full"
                >
                  {note.message}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {open && notifications.length === 0 && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded shadow-lg z-[60]">
          <div className="p-2 text-sm text-gray-900 dark:text-white">No new notifications.</div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
