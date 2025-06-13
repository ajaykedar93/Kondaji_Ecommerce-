// src/Pages/Account/AccountAdmin.jsx

import React, { useState } from 'react';
import { FaUserCircle, FaEdit, FaSave } from 'react-icons/fa';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import CropModal from '../../components/Cropper';

const AccountAdmin = () => {
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const [user, setUser] = useState(storedUser);
  const [editField, setEditField] = useState(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });
  const [newUsername, setNewUsername] = useState(user?.username || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpStage, setOtpStage] = useState(0);
  const [otpFor, setOtpFor] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [cropImage, setCropImage] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  if (!user || user.role !== 'admin') {
    return <div className="text-center mt-10 text-lg text-red-500">You are not authorized to view this page.</div>;
  }

  const handleEditToggle = (field) => {
    setEditField((prev) => (prev === field ? null : field));
  };

  const validateForm = () => {
    if (!formData.name.match(/^[a-zA-Z\s]+$/)) {
      setMessage('❌ Name should only contain letters');
      return false;
    }
    if (!formData.phone.match(/^\d{10}$/)) {
      setMessage('❌ Phone number must be exactly 10 digits');
      return false;
    }
    return true;
  };

  const showTempMessage = (msg) => {
    setMessage(msg);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 4000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!validateForm()) return showTempMessage(message);
    try {
      const res = await axios.put(`https://kondaji-express-api.onrender.com/api/auth/update/${user.id}`, formData);
      const updated = { ...user, ...formData };
      localStorage.setItem('user', JSON.stringify(updated));
      setUser(updated);
      showTempMessage('✅ Profile updated successfully');
      setEditField(null);
    } catch (err) {
      showTempMessage('❌ Failed to update profile');
    }
  };

  const sendOtp = async (purpose) => {
    try {
      await axios.post('https://kondaji-express-api.onrender.com/api/auth/send-otp', { email: user.email });
      setOtpStage(1);
      setOtpFor(purpose);
      showTempMessage(`OTP sent to ${user.email}`);
    } catch (err) {
      showTempMessage('❌ Failed to send OTP');
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await axios.post('https://kondaji-express-api.onrender.com/api/auth/verify-otp', {
        email: user.email,
        otp,
      });
      if (res.data.verified) {
        setOtpStage(2);
        showTempMessage('✅ OTP verified');
      }
    } catch (err) {
      showTempMessage('❌ Invalid OTP');
    }
  };

  const handleUsernameUpdate = async () => {
    if (otpStage !== 2) return showTempMessage('Complete OTP verification first');
    try {
      const res = await axios.put(`https://kondaji-express-api.onrender.com/api/auth/change-username/${user.id}`, { newUsername });
      const updated = { ...user, username: newUsername };
      localStorage.setItem('user', JSON.stringify(updated));
      setUser(updated);
      setOtpStage(0);
      showTempMessage('✅ Username updated');
    } catch (err) {
      showTempMessage('❌ Username update failed');
    }
  };

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword || newPassword.length < 6) {
      return showTempMessage('❌ Passwords must match and be at least 6 characters');
    }
    if (otpStage !== 2) return showTempMessage('Complete OTP verification first');
    try {
      await axios.put(`https://kondaji-express-api.onrender.com/api/auth/change-password/${user.id}`, {
        newPassword,
        method: 'otp',
      });
      setNewPassword('');
      setConfirmPassword('');
      setOtpStage(0);
      showTempMessage('✅ Password updated');
    } catch (err) {
      showTempMessage('❌ Password update failed');
    }
  };

  const handleEmailUpdate = async () => {
    if (!currentPassword) return showTempMessage('Enter current password');
    try {
      const res = await axios.put(`https://kondaji-express-api.onrender.com/api/auth/change-email/${user.id}`, {
        newEmail,
        currentPassword,
      });
      const updated = { ...user, email: newEmail };
      localStorage.setItem('user', JSON.stringify(updated));
      setUser(updated);
      setNewEmail('');
      setCurrentPassword('');
      showTempMessage('✅ Email updated');
    } catch (err) {
      showTempMessage('❌ Email update failed');
    }
  };

  const handleImageCrop = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setCropImage(reader.result);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };
  
 
  const handleCroppedUpload = async (blob) => {
    const form = new FormData();
    form.append('image', blob); // Must be a valid Blob
  
    try {
      const res = await axios.post(
        `https://kondaji-express-api.onrender.com/api/auth/upload-image/${user.id}`,
        form,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      localStorage.setItem('user', JSON.stringify(res.data));
      setUser(res.data);
      setShowCropper(false);
      showTempMessage('✅ Profile image updated');
    } catch (err) {
      console.error('Upload error:', err.response?.data || err.message);
      showTempMessage('❌ Upload failed');
    }
  };
  
 return (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="max-w-3xl mx-auto mt-10 mb-20 p-6 md:p-12 bg-gradient-to-b from-blue-50 to-white rounded-3xl shadow-2xl"
  >
    {showCropper && (
      <CropModal
        image={cropImage}
        onClose={() => setShowCropper(false)}
        onCropComplete={handleCroppedUpload}
      />
    )}

    <div className="flex flex-col items-center">
      {user.image ? (
        <img
          src={
            user.image.startsWith('http')
              ? user.image
              : `https://kondaji-express-api.onrender.com${user.image}`
          }
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-md"
        />
      ) : (
        <FaUserCircle className="text-8xl text-blue-500 mb-2 animate-pulse" />
      )}

      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleImageCrop(e.target.files[0])}
        className="mt-3 text-sm text-gray-600"
      />
      <h2 className="text-4xl font-bold text-blue-700 mt-4">Admin Account</h2>
    </div>

    <div className="mt-10 space-y-6 bg-white rounded-xl shadow-md p-6">
      {['name', 'phone'].map((field, index) => (
        <div
          key={field}
          className={`flex justify-between items-center px-4 py-3 rounded-lg ${
            index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-50'
          }`}
        >
          <span className="font-medium capitalize text-gray-600">
            {field}:
          </span>
          {editField === field ? (
            <div className="flex items-center gap-2 w-2/3">
              <input
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="border px-3 py-2 w-full rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              />
              <button onClick={() => handleEditToggle(field)}>
                <FaEdit className="text-blue-500" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-end gap-2 w-2/3">
              <span className="text-gray-800 w-full text-right">
                {user[field] || '-'}
              </span>
              <button onClick={() => handleEditToggle(field)}>
                <FaEdit className="text-blue-500 hover:text-blue-700" />
              </button>
            </div>
          )}
        </div>
      ))}

      <div className="flex justify-between items-center px-4 py-3 bg-gray-100 rounded-lg">
        <span className="font-medium text-gray-600">Email:</span>
        <span className="text-right text-gray-800">{user.email}</span>
      </div>

      <div className="flex flex-col mt-4">
        <label className="font-semibold text-gray-700">
          Change Email (Password Required)
        </label>
        <input
          type="email"
          placeholder="New Email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          className="border p-2 rounded w-full mt-2 shadow-sm"
        />
        <input
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="border p-2 rounded w-full mt-2 shadow-sm"
        />
        <button
          onClick={handleEmailUpdate}
          className="bg-blue-700 text-white px-4 py-2 rounded mt-2 hover:bg-blue-800"
        >
          Update Email
        </button>
      </div>

      <div className="flex flex-col mt-6">
        <label className="font-semibold text-gray-700">Change Username (OTP)</label>
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            className="border p-2 rounded w-full shadow-sm"
          />
          <button
            onClick={() => sendOtp('username')}
            className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Send OTP
          </button>
        </div>
      </div>

      <div className="flex flex-col mt-6">
        <label className="font-semibold text-gray-700">Change Password (OTP)</label>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="border p-2 rounded w-full mt-2 shadow-sm"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="border p-2 rounded w-full mt-2 shadow-sm"
        />
        <button
          onClick={() => sendOtp('password')}
          className="bg-gray-700 text-white px-4 py-2 mt-2 rounded hover:bg-gray-800"
        >
          Send OTP
        </button>
      </div>

      {otpStage > 0 && (
        <div className="flex flex-col mt-6 bg-gray-50 p-4 rounded-lg border">
          <label className="font-semibold text-gray-700">Enter OTP:</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="border p-2 rounded w-full mt-2 shadow-sm"
          />
          <button
            onClick={verifyOtp}
            className="bg-green-600 text-white px-4 py-2 mt-2 rounded hover:bg-green-700"
          >
            Verify OTP
          </button>

          {otpFor === 'username' && (
            <button
              onClick={handleUsernameUpdate}
              className="bg-blue-600 text-white px-4 py-2 mt-2 rounded hover:bg-blue-700"
            >
              Update Username
            </button>
          )}

          {otpFor === 'password' && (
            <button
              onClick={handlePasswordUpdate}
              className="bg-purple-600 text-white px-4 py-2 mt-2 rounded hover:bg-purple-700"
            >
              Update Password
            </button>
          )}
        </div>
      )}

      <div className="text-center font-bold text-lg mt-8">
        Role:{' '}
        <span className="uppercase px-3 py-1 bg-[#ffe5e8] text-[#e63946] font-bold rounded-full shadow-sm">
          {user.role}
        </span>
      </div>
    </div>

    {editField && (
      <motion.button
        onClick={handleSave}
        className="mt-8 w-full bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition shadow-lg"
        whileTap={{ scale: 0.97 }}
      >
        <FaSave className="inline mr-2" /> Save All Changes
      </motion.button>
    )}

    <AnimatePresence>
      {showMessage && (
        <motion.p
          className="mt-6 font-semibold text-center text-green-700"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  </motion.div>
);

};

export default AccountAdmin;
