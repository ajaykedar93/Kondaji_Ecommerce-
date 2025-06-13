import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ProductUpload from './ProductUpload';
import ManageProducts from './ManageProducts';
import UserRequests from './UserRequest';
import AdminOrders from './AdminOrders';
import AdminAddNotification from './AdminAddNotification';
import AdminUsers from './AdminUsers';
import CouponsAndDiscounts from './CouponsAndDiscounts';
import Home from '../../Pages/Home/Home';



const AdminDashboard = () => {
  const [activeButton, setActiveButton] = useState('upload-product');
  const [content, setContent] = useState(<ProductUpload />);

  const handleActiveButton = (buttonName) => {
    setActiveButton(buttonName);

    switch (buttonName) {
      case 'upload-product':
        setContent(<ProductUpload />);
        break;
      case 'manage-products':
        setContent(<ManageProducts />);
        break;
      case 'user-requests':
        setContent(<UserRequests />);
        break;
      case 'user-orders':
        setContent(<AdminOrders />);
        break;
      case 'add-notification':
        setContent(<AdminAddNotification />);
        break;
      case 'manage-users':
        setContent(<AdminUsers />);
        break;
         case 'coupons-discounts':
        setContent(<CouponsAndDiscounts />);
        break;
     default:
  setContent(<Home />);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/5 bg-purple-700 p-4 shadow-lg h-screen overflow-y-auto">
        <h2 className="text-2xl font-extrabold text-center text-white mb-6">
          Admin Panel
        </h2>
        <hr className="my-4 border-white" />

        <div className="space-y-4">
          {[
             { label: 'Upload Product', key: 'upload-product' },
            { label: 'Manage Products', key: 'manage-products' },
            { label: 'Manage User Requests', key: 'user-requests' },
            { label: 'User Orders', key: 'user-orders' },
            { label: 'Add Notification', key: 'add-notification' },
            { label: 'Manage Users', key: 'manage-users' },
            { label: 'Coupons & Discounts', key: 'coupons-discounts' },
          ].map(({ label, key }) => (
            <button
              key={key}
              className={`w-full text-base py-3 rounded-md ${
                activeButton === key
                  ? 'bg-purple-800 text-white'
                  : 'bg-purple-700 text-white'
              } hover:bg-purple-800 transition-all duration-300 shadow-md hover:shadow-lg font-medium`}
              onClick={() => handleActiveButton(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 p-6 overflow-y-auto">
        <motion.div
          className="bg-white p-6 rounded-lg shadow-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {content}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
