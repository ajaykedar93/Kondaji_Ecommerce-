import React, { useState } from 'react';
import { FaUserCircle, FaEdit, FaSave } from 'react-icons/fa';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import CropModal from '../../components/Cropper';

const Account = () => {
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const [user, setUser] = useState(storedUser);
  const [editField, setEditField] = useState(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    postal_code: user?.postal_code || '',
    country: user?.country || '',
  });

  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [otpStage, setOtpStage] = useState(0);
  const [otp, setOtp] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [emailEdit, setEmailEdit] = useState(false);
  const [cropImage, setCropImage] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  if (!user || user.role !== 'user') {
    return (
      <div className="text-center mt-10 text-lg text-red-500 font-semibold">
        You are not authorized to view this page.
      </div>
    );
  }

  const showTempMessage = (msg) => {
    setMessage(msg);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 4000);
  };

  const handleEditToggle = (field) => {
    setEditField((prev) => (prev === field ? null : field));
  };

  const validateForm = () => {
    if (!formData.name.match(/^[a-zA-Z\s]+$/))
      return showTempMessage('❌ Name must contain only letters');
    if (!formData.phone.match(/^\d{10}$/))
      return showTempMessage('❌ Phone must be exactly 10 digits');
    return true;
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    try {
      const res = await axios.put(
        `https://kondaji-express-api.onrender.com/api/user/update/${user.id}`,
        formData
      );
      const updatedUser = { ...user, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setEditField(null);
      showTempMessage('✅ Profile updated successfully');
    } catch (err) {
      showTempMessage('❌ Failed to update profile');
    }
  };

  const handleSendOtp = async () => {
    try {
      await axios.post('https://kondaji-express-api.onrender.com/api/user/send-otp', {
        email: user.email,
      });
      setOtpStage(1);
      showTempMessage('📩 OTP sent to your email.');
    } catch {
      showTempMessage('❌ Failed to send OTP');
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const res = await axios.post('https://kondaji-express-api.onrender.com/api/user/verify-otp', {
        email: user.email,
        otp,
      });
      if (res.data.verified) {
        setOtpStage(2);
        showTempMessage('✅ OTP verified. Enter new email.');
      }
    } catch {
      showTempMessage('❌ Invalid OTP.');
    }
  };

  const handleEmailUpdate = async () => {
    try {
      const res = await axios.put(
        `https://kondaji-express-api.onrender.com/api/user/change-email/${user.id}`,
        { newEmail }
      );
      const updatedUser = { ...user, email: newEmail };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setEmailEdit(false);
      setOtp('');
      setNewEmail('');
      setOtpStage(0);
      showTempMessage('✅ Email updated successfully');
    } catch {
      showTempMessage('❌ Failed to update email');
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
    form.append('image', blob);

    try {
      const res = await axios.post(
        `https://kondaji-express-api.onrender.com/api/user/upload-image/${user.id}`,
        form,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      localStorage.setItem('user', JSON.stringify(res.data));
      setUser(res.data);
      setShowCropper(false);
      showTempMessage('✅ Profile image updated');
    } catch (err) {
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
        {user.profile_image ? (
          <img
            src={
              user.profile_image.startsWith('http')
                ? user.profile_image
                : `https://kondaji-express-api.onrender.com/${user.profile_image}`
            }
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-lg"
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
        <h2 className="text-4xl font-bold text-blue-700 mt-4">My Account</h2>
      </div>

      <div className="mt-10 space-y-4 bg-white rounded-xl shadow-md p-6">
        {Object.keys(formData).map((field, index) => (
          <div
            key={field}
            className={`flex justify-between items-center px-4 py-3 rounded-lg ${
              index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-50'
            }`}
          >
            <span className="font-medium capitalize text-gray-600">{field.replace('_', ' ')}:</span>
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
                <span className="text-gray-800 w-full text-right">{user[field] || '-'}</span>
                <button onClick={() => handleEditToggle(field)}>
                  <FaEdit className="text-blue-500 hover:text-blue-700" />
                </button>
              </div>
            )}
          </div>
        ))}

        <div className="flex justify-between items-center px-4 py-3 bg-gray-100 rounded-lg">
          <span className="font-medium text-gray-600">Email:</span>
          <div className="flex items-center gap-2 w-2/3 justify-end">
            <span>{user.email}</span>
            {!emailEdit && (
              <button onClick={() => setEmailEdit(true)} className="text-blue-500 hover:text-blue-700">
                <FaEdit />
              </button>
            )}
          </div>
        </div>

        {emailEdit && (
          <div className="space-y-4">
            {otpStage === 0 && (
              <button
                onClick={handleSendOtp}
                className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
              >
                Send OTP to current email
              </button>
            )}
            {otpStage === 1 && (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="border p-2 rounded w-full shadow-sm"
                />
                <button
                  onClick={handleVerifyOtp}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 shadow"
                >
                  Verify OTP
                </button>
              </>
            )}
            {otpStage === 2 && (
              <>
                <input
                  type="email"
                  placeholder="Enter new email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="border p-2 rounded w-full shadow-sm"
                />
                <button
                  onClick={handleEmailUpdate}
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 shadow"
                >
                  Save New Email
                </button>
              </>
            )}
          </div>
        )}

        <div className="text-center text-md font-semibold mt-6">
  Role:
  <span className="ml-2 px-3 py-1 bg-[#ffe5e8] text-[#e63946] font-bold rounded-full uppercase shadow-sm">
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

export default Account;
