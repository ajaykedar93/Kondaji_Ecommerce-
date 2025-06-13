import React, { useEffect, useState } from 'react';
import {
  FaTruck,
  FaUndoAlt,
  FaRupeeSign,
  FaTag,
  FaInfoCircle,
  FaBell,
  FaCheckCircle
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import axios from 'axios';

// ✅ Change this to your actual backend URL
const BASE_URL = 'https://kondaji-express-api.onrender.com/api/notifications';

const getIcon = (type) => {
  switch (type) {
    case 'order':
      return <FaTruck className="text-green-600" />;
    case 'return':
      return <FaUndoAlt className="text-yellow-600" />;
    case 'refund':
      return <FaRupeeSign className="text-blue-600" />;
    case 'coupon':
      return <FaTag className="text-purple-600" />;
    case 'offer':
      return <FaTag className="text-red-600" />;
    case 'info':
    default:
      return <FaInfoCircle className="text-gray-500" />;
  }
};

const Notification = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(BASE_URL);
      // Sort: unread first (assuming read is boolean)
      const sorted = res.data.sort((a, b) => (a.read ? 1 : -1));
      setNotifications(sorted);
    } catch (err) {
      console.error('❌ Failed to fetch notifications:', err.message);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`${BASE_URL}/read/${id}`);
      fetchNotifications();
    } catch (err) {
      console.error('❌ Error marking as read:', err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto bg-white shadow-2xl rounded-xl p-8"
      >
        <h2 className="text-3xl font-bold text-orange-600 mb-8 flex items-center gap-3">
          <FaBell className="text-orange-500" /> Notifications Center
        </h2>

        <ul className="space-y-5">
          {notifications.length === 0 ? (
            <p className="text-gray-500">No notifications to show.</p>
          ) : (
            notifications.map((note) => (
              <motion.li
                key={note.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`flex justify-between items-start p-5 rounded-lg border shadow-sm ${
                  note.read
                    ? 'bg-gray-50 border-gray-200'
                    : 'bg-yellow-50 border-yellow-300'
                } hover:shadow-md transition-all`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-2xl">{getIcon(note.type)}</div>
                  <div>
                    <p className="font-medium text-gray-800">{note.title}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(note.time).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end gap-2">
                  <a
                    href={note.link || '#'}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    View
                  </a>
                  {!note.read ? (
                    <button
                      onClick={() => markAsRead(note.id)}
                      className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200"
                    >
                      Mark as Read
                    </button>
                  ) : (
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <FaCheckCircle /> Read
                    </div>
                  )}
                </div>
              </motion.li>
            ))
          )}
        </ul>
      </motion.div>
    </div>
  );
};

export default Notification;
