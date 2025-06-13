import React, { useState, useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form'; // Import useForm hook
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../Context/AuthContext'; // Import AuthContext for managing user
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';

const LoginForm = ({ role }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm(); // Initialize useForm
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext); // Access the setUser function from AuthContext

  const [forgotMode, setForgotMode] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const onSubmit = async (data) => {
    const endpoint = role === 'admin' || role === 'superadmin'
      ? 'https://kondaji-express-api.onrender.com/api/auth/admin-login'
      : 'https://kondaji-express-api.onrender.com/api/user/user-login';

    try {
      const res = await axios.post(endpoint, data);
      const userData = res.data.admin || res.data.user;

      if (userData.role !== role) {
        setErrorMsg(`❌ Role mismatch: You are trying to login as ${role.toUpperCase()}, but your account is ${userData.role.toUpperCase()}`);
        return;
      }

      localStorage.setItem('auth_token', res.data.token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData); // Set the user data in AuthContext
      setShowSuccessPopup(true);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || '❌ Login failed');
    }
  };

  const sendOTP = async () => {
    try {
      if (!identifier) return alert('Please enter your email or username');

      const isAdmin = role === 'admin' || role === 'superadmin';
      const res = await axios.post(
        isAdmin
          ? 'https://kondaji-express-api.onrender.com/api/auth/check-admin-email'
          : 'https://kondaji-express-api.onrender.com/api/user/check-user-email',
        isAdmin ? { identifier } : { email: identifier }
      );

      if (!res.data.exists) return alert('Email/Username not registered');
      setRegisteredEmail(isAdmin ? res.data.email : identifier);

      await axios.post(
        isAdmin
          ? 'https://kondaji-express-api.onrender.com/api/auth/send-otp'
          : 'https://kondaji-express-api.onrender.com/api/user/send-otp',
        { email: isAdmin ? res.data.email : identifier }
      );

      setOtpSent(true);
    } catch (err) {
      alert('Failed to send OTP');
    }
  };

  const verifyOTP = async () => {
    try {
      await axios.post(
        role === 'admin' || role === 'superadmin'
          ? 'https://kondaji-express-api.onrender.com/api/auth/verify-otp'
          : 'https://kondaji-express-api.onrender.com/api/user/verify-otp',
        { email: registeredEmail, otp }
      );
      setOtpVerified(true);
    } catch {
      alert('Invalid OTP');
    }
  };

  const resetPassword = async () => {
    if (newPassword.length < 8) return alert('Password must be at least 8 characters');

    const endpoint = role === 'admin' || role === 'superadmin'
      ? 'https://kondaji-express-api.onrender.com/api/auth/admin-reset-password'
      : 'https://kondaji-express-api.onrender.com/api/user/reset-password';

    const payload = role === 'admin' || role === 'superadmin'
      ? { identifier, newPassword }
      : { email: identifier, newPassword };

    try {
      await axios.put(endpoint, payload);
      alert('Password reset successful');
      setForgotMode(false);
      setOtpSent(false);
      setOtpVerified(false);
      setIdentifier('');
      setOtp('');
      setNewPassword('');
      reset();
    } catch {
      alert('Failed to reset password');
    }
  };

  const handlePopupClose = () => {
    setShowSuccessPopup(false);
    navigate(role === 'admin' || role === 'superadmin' ? '/admin-dashboard' : '/account');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl shadow-2xl p-8 space-y-6 border-t-4 border-purple-600 relative"
    >
      <AnimatePresence>
        {showSuccessPopup && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white border-4 border-green-500 p-8 rounded-2xl shadow-2xl text-center max-w-sm"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h3 className="text-xl font-bold text-green-600 mb-4">Login Successful</h3>
              <button
                onClick={handlePopupClose}
                className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700"
              >
                OK
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {errorMsg && (
        <div className="bg-red-100 text-red-800 font-bold px-6 py-4 rounded-lg text-center border border-red-400">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {!forgotMode ? (
          <>
            <input
              type={role === 'admin' || role === 'superadmin' ? 'text' : 'email'}
              placeholder={role === 'admin' || role === 'superadmin' ? 'Username' : 'Email'}
              {...register(role === 'admin' || role === 'superadmin' ? 'username' : 'email', { required: true })}
              className="w-full px-4 py-2 border border-purple-700 rounded-md focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="password"
              placeholder="Password"
              {...register('password', { required: true })}
              className="w-full px-4 py-2 border border-purple-700 rounded-md focus:ring-2 focus:ring-purple-500"
            />
            <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700">
              Login
            </button>
            <p
              onClick={() => setForgotMode(true)}
              className="text-sm text-center font-semibold text-purple-700 underline cursor-pointer hover:text-purple-800"
            >
              Forgot Password?
            </p>
          </>
        ) : (
          <>
            {!otpSent ? (
              <>
                <input
                  type="text"
                  placeholder="Enter your email or username"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full px-4 py-2 border border-purple-700 rounded-md"
                />
                <button
                  type="button"
                  onClick={sendOTP}
                  className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700"
                >
                  Send OTP
                </button>
              </>
            ) : !otpVerified ? (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-2 border border-purple-700 rounded-md"
                />
                <button
                  type="button"
                  onClick={verifyOTP}
                  className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700"
                >
                  Verify OTP
                </button>
              </>
            ) : (
              <>
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-purple-700 rounded-md"
                />
                <button
                  type="button"
                  onClick={resetPassword}
                  className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700"
                >
                  Reset Password
                </button>
              </>
            )}
            <p
              onClick={() => setForgotMode(false)}
              className="text-sm font-bold flex items-center justify-center gap-2 text-black cursor-pointer hover:text-gray-800 mt-3"
            >
              <FaArrowLeft className="text-md" /> Back to Login
            </p>
          </>
        )}
      </form>
    </motion.div>
  );
};

export default LoginForm;
