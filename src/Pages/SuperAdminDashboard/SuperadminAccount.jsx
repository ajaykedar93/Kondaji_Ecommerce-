import React, { useEffect, useState, useRef, useContext } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../Context/AuthContext'; // adjust path as needed
import CropModal from '../../components/Cropper';

const API_BASE = 'https://kondaji-express-api.onrender.com/api/superadmin';
const AUTH_BASE = 'https://kondaji-express-api.onrender.com/api/superadmin';

const SuperadminAccount = () => {
  // States
  const { user } = useContext(AuthContext);
  const userId = user?.id;

  const [superadminList, setSuperadminList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [editModeId, setEditModeId] = useState(null);
  const [formData, setFormData] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [emailToVerify, setEmailToVerify] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const messageTimeoutRef = useRef(null);

  // Delete modal states
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState('');
  const [deletedAccountMsg, setDeletedAccountMsg] = useState('');

  const [usernameCurrentPassword, setUsernameCurrentPassword] = useState('');

  // Password change modes & states
  const [passwordChangeMode, setPasswordChangeMode] = useState('oldpass'); // 'oldpass' or 'otp'
  const [oldPassword, setOldPassword] = useState('');
  const [passwordResetOtpSent, setPasswordResetOtpSent] = useState(false);
  const [passwordResetOtp, setPasswordResetOtp] = useState('');
  const [passwordResetOtpVerified, setPasswordResetOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  // Crop modal states
  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedImageForCrop, setSelectedImageForCrop] = useState(null);

  // Fetch superadmins
  const fetchSuperadmins = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}`);
      setSuperadminList(res.data);
      setLoading(false);
    } catch {
      setError('Failed to fetch superadmin data.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuperadmins();
  }, []);

  // Clear messages timeout
  useEffect(() => {
    if (message || error) {
      if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
      messageTimeoutRef.current = setTimeout(() => {
        setMessage('');
        setError('');
      }, 4000);
    }
  }, [message, error]);

  // Reset edit-related states
  const resetEditStates = () => {
    setOtpSent(false);
    setOtpVerified(false);
    setOtpValue('');
    setEmailToVerify('');
    setError('');
    setMessage('');
    setUsernameCurrentPassword('');
    setPasswordChangeMode('oldpass');
    setOldPassword('');
    setPasswordResetOtpSent(false);
    setPasswordResetOtpVerified(false);
    setPasswordResetOtp('');
    setNewPassword('');
  };

  // Show/hide details row
  const handleShow = (id) => {
    setSelectedId(id === selectedId ? null : id);
    setEditModeId(null);
    resetEditStates();
  };

  // Edit button handler
  const handleEdit = (admin) => {
    setEditModeId(admin.id);
    setSelectedId(admin.id);
    setFormData({
      name: admin.name || '',
      username: admin.username || '',
      email: admin.email || '',
      phone: admin.phone || '',
      image: admin.image || '',
      newPassword: '',
    });
    resetEditStates();
  };

  // Form input change
  const handleChange = (e) => {
    if (otpSent && e.target.name === 'email') {
      setOtpSent(false);
      setOtpVerified(false);
      setOtpValue('');
      setEmailToVerify('');
    }
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Validate username (letters + numbers)
  const validateUsername = (username) =>
    /[a-zA-Z]/.test(username) && /\d/.test(username);

  // Send OTP for email verification
  const sendOtp = async () => {
    if (!formData.email) {
      setError('Please enter an email address.');
      return;
    }
    try {
      setError('');
      setMessage('');
      setEmailToVerify(formData.email);
      await axios.post(`${AUTH_BASE}/send-otp`, { userId: editModeId, email: formData.email });
      setOtpSent(true);
      setMessage(`OTP sent to ${formData.email}. Please check your inbox.`);
    } catch {
      setError('Failed to send OTP.');
    }
  };

  // Verify email OTP
  const verifyOtp = async () => {
    try {
      setError('');
      setMessage('');
      const res = await axios.post(`${AUTH_BASE}/verify-otp`, { userId: editModeId, otp: otpValue });
      if (res.data.success) {
        setOtpVerified(true);
        setOtpSent(false);
        setMessage('Email verified successfully.');
      } else {
        setError('Incorrect OTP.');
      }
    } catch {
      setError('Failed to verify OTP.');
    }
  };

  // Send OTP for password reset (to registered email)
  const sendPasswordResetOtp = async () => {
    const admin = superadminList.find((a) => a.id === editModeId);
    if (!admin || !admin.email) {
      setError('No registered email found for password reset.');
      return;
    }
    try {
      setError('');
      setMessage('');
      await axios.post(`${AUTH_BASE}/send-otp`, { userId: editModeId, email: admin.email });
      setPasswordResetOtpSent(true);
      setMessage(`Password reset OTP sent to ${admin.email}`);
    } catch {
      setError('Failed to send password reset OTP.');
    }
  };

  // Verify password reset OTP
  const verifyPasswordResetOtp = async () => {
    try {
      setError('');
      setMessage('');
      const res = await axios.post(`${AUTH_BASE}/verify-otp`, { userId: editModeId, otp: passwordResetOtp });
      if (res.data.success) {
        setPasswordResetOtpVerified(true);
        setPasswordResetOtpSent(false);
        setMessage('Password reset OTP verified. You can now set a new password.');
      } else {
        setError('Incorrect OTP.');
      }
    } catch {
      setError('Failed to verify password reset OTP.');
    }
  };


  const handleCropComplete = async (croppedBlob) => {
    try {
     
      const file = new File([croppedBlob], 'cropped-image.jpg', { type: croppedBlob.type });
      const formDataUpload = new FormData();
      formDataUpload.append('image', file);

      
      const uploadResponse = await axios.post(
        `${API_BASE}/upload-image/${editModeId}`,
        formDataUpload,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

     
      setFormData((prev) => ({ ...prev, image: uploadResponse.data.image || uploadResponse.data.url || '' }));
      setShowCropModal(false);
      setMessage('Image cropped and uploaded successfully.');
    } catch (uploadErr) {
      setError('Image upload failed.');
    }
  };

  // Update handler
  const handleUpdate = async () => {
    setError('');
    setMessage('');

    if (!validateUsername(formData.username)) {
      setError('Username must contain both letters and numbers.');
      return;
    }

    const original = superadminList.find((a) => a.id === editModeId);
    if (!original) {
      setError('Original data not found.');
      return;
    }

    // Email change requires OTP verification
    if (formData.email !== original.email && !otpVerified) {
      setError('Please verify your new email before updating.');
      return;
    }

    // Username change requires current password input & verification
    if (formData.username !== original.username && usernameCurrentPassword.trim() === '') {
      setError('Please enter your current password to change username.');
      return;
    }
    if (formData.username !== original.username && usernameCurrentPassword.trim()) {
      try {
        const verifyRes = await axios.post(
          `${AUTH_BASE}/verify-password`,
          { userId: editModeId, password: usernameCurrentPassword }
        );
        if (!verifyRes.data.success) {
          setError('Current password is incorrect for username change.');
          return;
        }
      } catch {
        setError('Failed to verify current password for username change.');
        return;
      }
    }

    
    if (newPassword.trim()) {
      if (passwordResetOtpVerified) {
       
      } else if (passwordChangeMode === 'oldpass') {
        if (!oldPassword.trim()) {
          setError('Please enter your old password to change password.');
          return;
        }
        try {
          const verifyOldPass = await axios.post(
            `${AUTH_BASE}/verify-password`,
            { userId: editModeId, password: oldPassword }
          );
          if (!verifyOldPass.data.success) {
            setError('Old password is incorrect.');
            return;
          }
        } catch {
          setError('Failed to verify old password.');
          return;
        }
      } else {
        setError('Please verify password reset OTP or enter old password.');
        return;
      }
    }

    const payload = {
      name: formData.name,
      username: formData.username,
      email: formData.email,
      phone: formData.phone,
      image: formData.image,
    };

    if (newPassword.trim()) {
      payload.password = newPassword.trim();
    }

    try {
      const res = await axios.put(`${API_BASE}/${editModeId}`, payload);
      setMessage(res.data.message || 'Profile updated successfully.');
      setEditModeId(null);
      resetEditStates();
      fetchSuperadmins();
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed.');
    }
  };

  // Delete modal handlers
  const openDeleteModal = (id) => {
    setSelectedId(id);
    setShowDeleteConfirm(true);
    setDeletePassword('');
    setDeleteError('');
    setDeleteSuccess('');
  };

  const handleDelete = async () => {
    setDeleteError('');
    setDeleteSuccess('');
    if (!deletePassword) {
      setDeleteError('Please enter your password to confirm.');
      return;
    }
    try {
      // Verify password first
      const verifyRes = await axios.post(
        `${AUTH_BASE}/verify-password`,
        { userId: selectedId, password: deletePassword }
      );
      if (!verifyRes.data.success) {
        setDeleteError('Incorrect password.');
        return;
      }
      await axios.delete(`${API_BASE}/${selectedId}`, {
        data: { requesterId: userId }, // your id
      });

      setDeleteSuccess('Account deleted successfully. Logging out...');
      setShowDeleteConfirm(false);

      // Refresh superadmin list
      await fetchSuperadmins();

      // If deleted own account, logout & redirect
      if (selectedId === userId) {
        setDeletedAccountMsg('Your account has been permanently deleted.');
        localStorage.clear();
        setTimeout(() => {
          window.location.href = '/auth?mode=register';
        }, 4000);
      }

      setSelectedId(null);
      setDeletePassword('');
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'Failed to delete account.');
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-purple-700 via-pink-600 to-red-500 text-white font-semibold text-lg">
        Loading superadmin data...
      </div>
    );

  if (deletedAccountMsg)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-r from-gray-900 to-black text-red-400 text-2xl font-extrabold px-4 text-center">
        <p>{deletedAccountMsg}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-100 p-8 font-sans text-gray-900">
      <h1 className="text-4xl font-extrabold text-center mb-10 text-indigo-900 tracking-wide drop-shadow-md">
        Superadmin Accounts Management
      </h1>

      {/* Fixed bottom-center message container */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 max-w-lg w-full px-4">
        <AnimatePresence>
          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mb-3 bg-red-600 text-white px-5 py-3 rounded shadow font-semibold text-center"
            >
              {error}
            </motion.div>
          )}
          {message && (
            <motion.div
              key="message"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mb-3 bg-green-600 text-white px-5 py-3 rounded shadow font-semibold text-center"
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow-md bg-white max-w-6xl mx-auto">
        <table className="min-w-full divide-y divide-indigo-200">
          <thead className="bg-indigo-600 text-white text-lg select-none">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Username</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Phone</th>
              <th className="px-6 py-3 text-left">Image</th>
              <th className="px-6 py-3 text-center w-40">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-indigo-100">
            {superadminList.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-10 text-gray-500 font-medium">
                  No superadmin accounts found.
                </td>
              </tr>
            )}

            {superadminList.map((admin) => (
              <React.Fragment key={admin.id}>
                <tr
                  className={`cursor-pointer hover:bg-indigo-50 transition ${
                    selectedId === admin.id ? 'bg-indigo-100' : ''
                  }`}
                >
                  <td className="px-6 py-4">{admin.name}</td>
                  <td className="px-6 py-4">{admin.username}</td>
                  <td className="px-6 py-4">{admin.email || '-'}</td>
                  <td className="px-6 py-4">{admin.phone || '-'}</td>
                  <td className="px-6 py-4 text-center">
                    {admin.image ? (
                      <img
                        src={admin.image}
                        alt={admin.name}
                        className="rounded-full object-cover border border-indigo-300"
                        style={{ width: '80px', height: '80px', display: 'block', margin: 'auto' }}
                      />
                    ) : (
                      <span className="italic text-gray-400">No Image</span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-center space-x-2">
                    <button
                      onClick={() => handleShow(admin.id)}
                      className="text-indigo-700 hover:text-indigo-900 font-semibold transition"
                      title="Show Details"
                    >
                      Show
                    </button>
                    <button
                      onClick={() => handleEdit(admin)}
                      className="text-green-600 hover:text-green-800 font-semibold transition"
                      title="Edit Profile"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(admin.id)}
                      className="text-red-600 hover:text-red-800 font-semibold transition"
                      title="Delete Account"
                    >
                      Delete
                    </button>
                  </td>
                </tr>

                {/* Show/Edit details */}
                {selectedId === admin.id && (
                  <tr className="bg-indigo-50">
                    <td colSpan="6" className="p-6">
                      {editModeId === admin.id ? (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleUpdate();
                          }}
                          className="space-y-5"
                        >
                          {/* Name */}
                          <div>
                            <label htmlFor="name" className="block font-semibold mb-1 text-indigo-900">
                              Name
                            </label>
                            <input
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              required
                              className="w-full border border-indigo-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>

                          {/* Username + current password */}
                          <div>
                            <label htmlFor="username" className="block font-semibold mb-1 text-indigo-900">
                              Username (letters & numbers)
                            </label>
                            <input
                              id="username"
                              name="username"
                              value={formData.username}
                              onChange={handleChange}
                              required
                              className="w-full border border-indigo-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            {formData.username !==
                              superadminList.find((a) => a.id === editModeId)?.username && (
                              <input
                                type="password"
                                placeholder="Enter current password to change username"
                                value={usernameCurrentPassword}
                                onChange={(e) => setUsernameCurrentPassword(e.target.value)}
                                className="mt-2 w-full border border-indigo-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                              />
                            )}
                          </div>

                          {/* Email + OTP */}
                          <div className="relative">
                            <label htmlFor="email" className="block font-semibold mb-1 text-indigo-900">
                              Email
                            </label>
                            <input
                              id="email"
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              disabled={otpSent && !otpVerified}
                              required
                              className={`w-full border border-indigo-400 rounded px-3 py-2 focus:outline-none focus:ring-2 ${
                                otpSent && !otpVerified
                                  ? 'bg-indigo-100 cursor-not-allowed'
                                  : 'focus:ring-indigo-500'
                              }`}
                            />
                            {!otpSent && formData.email !==
                              superadminList.find((a) => a.id === editModeId)?.email && (
                              <button
                                type="button"
                                onClick={sendOtp}
                                className="absolute right-2 top-8 px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                              >
                                Send OTP
                              </button>
                            )}
                          </div>

                          {otpSent && !otpVerified && (
                            <div className="flex items-center gap-2 mt-2">
                              <input
                                type="text"
                                placeholder="Enter OTP"
                                value={otpValue}
                                onChange={(e) => setOtpValue(e.target.value)}
                                className="border border-indigo-400 rounded px-3 py-2 w-40"
                              />
                              <button
                                type="button"
                                onClick={verifyOtp}
                                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition"
                              >
                                Verify OTP
                              </button>
                            </div>
                          )}

                          {/* Phone */}
                          <div>
                            <label htmlFor="phone" className="block font-semibold mb-1 text-indigo-900">
                              Phone
                            </label>
                            <input
                              id="phone"
                              type="text"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              className="w-full border border-indigo-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>

                          {/* Image */}
                          <div>
                            <label htmlFor="image" className="block font-semibold mb-1 text-indigo-900">
                              Image URL
                            </label>
                            <input
                              id="image"
                              type="text"
                              name="image"
                              value={formData.image}
                              onChange={handleChange}
                              className="w-full border border-indigo-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (formData.image) {
                                setSelectedImageForCrop(formData.image);
                                setShowCropModal(true);
                              } else {
                                setError('Please enter/select an image URL before cropping.');
                              }
                            }}
                            className="mt-2 px-4 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                          >
                            Crop Image
                          </button>

                          {/* Password change section */}
                          <div>
                            <label className="block font-semibold mb-2 text-indigo-900">
                              Change Password
                            </label>

                            <div className="mb-2">
                              <label className="inline-flex items-center mr-4 cursor-pointer">
                                <input
                                  type="radio"
                                  name="passwordChangeMode"
                                  checked={passwordChangeMode === 'oldpass'}
                                  onChange={() => {
                                    setPasswordChangeMode('oldpass');
                                    setPasswordResetOtpSent(false);
                                    setPasswordResetOtpVerified(false);
                                    setOldPassword('');
                                    setPasswordResetOtp('');
                                    setNewPassword('');
                                    setError('');
                                    setMessage('');
                                  }}
                                  className="form-radio text-indigo-600"
                                />
                                <span className="ml-2">Use Old Password</span>
                              </label>

                              <label className="inline-flex items-center cursor-pointer">
                                <input
                                  type="radio"
                                  name="passwordChangeMode"
                                  checked={passwordChangeMode === 'otp'}
                                  onChange={() => {
                                    setPasswordChangeMode('otp');
                                    setOldPassword('');
                                    setPasswordResetOtpSent(false);
                                    setPasswordResetOtpVerified(false);
                                    setPasswordResetOtp('');
                                    setNewPassword('');
                                    setError('');
                                    setMessage('');
                                  }}
                                  className="form-radio text-indigo-600"
                                />
                                <span className="ml-2">Reset via OTP</span>
                              </label>
                            </div>

                            {passwordChangeMode === 'oldpass' && (
                              <>
                                <input
                                  type="password"
                                  placeholder="Old Password"
                                  value={oldPassword}
                                  onChange={(e) => setOldPassword(e.target.value)}
                                  className="w-full border border-indigo-400 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <input
                                  type="password"
                                  placeholder="New Password"
                                  value={newPassword}
                                  onChange={(e) => setNewPassword(e.target.value)}
                                  className="w-full border border-indigo-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                              </>
                            )}

                            {passwordChangeMode === 'otp' && (
                              <>
                                {!passwordResetOtpSent && (
                                  <button
                                    type="button"
                                    onClick={sendPasswordResetOtp}
                                    className="px-5 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition"
                                  >
                                    Send OTP to Registered Email
                                  </button>
                                )}

                                {passwordResetOtpSent && !passwordResetOtpVerified && (
                                  <div className="mt-2 flex items-center gap-2">
                                    <input
                                      type="text"
                                      placeholder="Enter OTP"
                                      value={passwordResetOtp}
                                      onChange={(e) => setPasswordResetOtp(e.target.value)}
                                      className="border border-indigo-400 rounded px-3 py-2 w-40"
                                    />
                                    <button
                                      type="button"
                                      onClick={verifyPasswordResetOtp}
                                      className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition"
                                    >
                                      Verify OTP
                                    </button>
                                  </div>
                                )}

                                {passwordResetOtpVerified && (
                                  <input
                                    type="password"
                                    placeholder="New Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full border border-indigo-400 rounded px-3 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                  />
                                )}
                              </>
                            )}
                          </div>

                          <div className="flex gap-4">
                            <button
                              type="submit"
                              className="bg-indigo-700 text-white px-6 py-2 rounded hover:bg-indigo-800 transition"
                            >
                              Save Changes
                            </button>
                            <button
                              type="button"
                              className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400 transition"
                              onClick={() => {
                                setEditModeId(null);
                                resetEditStates();
                                // Reset formData to original admin data on cancel
                                const original = superadminList.find((a) => a.id === admin.id);
                                if (original) {
                                  setFormData({
                                    name: original.name || '',
                                    username: original.username || '',
                                    email: original.email || '',
                                    phone: original.phone || '',
                                    image: original.image || '',
                                    newPassword: '',
                                  });
                                }
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="grid grid-cols-2 gap-4 text-indigo-900 font-medium">
                          <div>
                            <p>
                              <strong>Name:</strong> {admin.name}
                            </p>
                            <p>
                              <strong>Username:</strong> {admin.username}
                            </p>
                            <p>
                              <strong>Email:</strong> {admin.email || '-'}
                            </p>
                          </div>
                          <div>
                            <p>
                              <strong>Phone:</strong> {admin.phone || '-'}
                            </p>
                            <p>
                              <strong>Image:</strong>
                            </p>
                            {admin.image ? (
                              <img
                                src={admin.image}
                                alt={admin.name}
                                className="w-20 h-20 rounded-full object-cover border border-indigo-300"
                              />
                            ) : (
                              <span className="italic text-gray-400">No Image</span>
                            )}
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            key="modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white rounded-lg p-6 w-96 max-w-full shadow-lg"
            >
              <h2 className="text-xl font-bold mb-4 text-center text-red-700 tracking-wide">
                Confirm Account Deletion
              </h2>
              <p className="mb-4 text-center text-gray-700">
                Enter your password to confirm deleting this superadmin account. This action{' '}
                <strong>cannot be undone</strong>.
              </p>
              <input
                type="password"
                placeholder="Password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                className="w-full border border-red-400 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
              {deleteError && (
                <p className="text-red-600 text-center mb-4 font-semibold">{deleteError}</p>
              )}
              {deleteSuccess && (
                <p className="text-green-600 text-center mb-4 font-semibold">{deleteSuccess}</p>
              )}
              <div className="flex justify-between">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 rounded bg-red-700 text-white hover:bg-red-800 transition"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Crop Modal */}
      <AnimatePresence>
        {showCropModal && (
          <CropModal
            image={selectedImageForCrop}
            onClose={() => setShowCropModal(false)}
            onCropComplete={handleCropComplete}
            role="superadmin"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SuperadminAccount;
