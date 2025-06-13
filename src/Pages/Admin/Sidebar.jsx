import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaPlus,
  FaBoxes,
  FaUsers,
  FaCog,
  FaBox,
} from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();

  const menu = [
    { path: '/admin-dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { path: '/product-upload', label: 'Upload Product', icon: <FaPlus /> },
    { path: '/product-table', label: 'Manage Products', icon: <FaBoxes /> },
    { path: '/admin/low-stock', label: 'Low Stock', icon: <FaBox /> },
    { path: '/admin/users', label: 'View Users', icon: <FaUsers /> },
    { path: '/admin/site-settings', label: 'Site Settings', icon: <FaCog /> },
  ];

  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen px-4 py-8 shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Admin Panel</h2>
      <nav className="space-y-3">
        {menu.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-700 transition ${
              location.pathname === item.path ? 'bg-gray-700' : ''
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
