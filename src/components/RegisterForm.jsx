// RegisterForm.jsx
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const RegisterForm = ({ role }) => {
  const [adminExists, setAdminExists] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // ✅ Check if superadmin already exists
  useEffect(() => {
    const checkSuperadmin = async () => {
      if (role === 'superadmin') {
        try {
          const res = await axios.get('https://kondaji-express-api.onrender.com/api/auth/admin-exists');
          if (res.data.exists) {
            setAdminExists(true);
          }
        } catch (err) {
          console.error('Error checking superadmin existence:', err);
        }
      }
    };
    checkSuperadmin();
  }, [role]);

  // ❌ If superadmin already registered, show red alert
  if (role === 'superadmin' && adminExists) {
    return (
      <motion.div
        className="text-center bg-red-50 border border-red-300 text-red-700 font-bold text-lg p-6 rounded-xl mt-6 shadow-lg"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        🚫 Superadmin is already registered!<br />
        Please <span className="underline">login</span> instead.
      </motion.div>
    );
  }

  const onSubmit = async (data) => {
   try {
  await axios.post('https://kondaji-express-api.onrender.com/api/auth/register', {
    ...data,
    role,
  });
  setShowPopup(true);
  reset();
  setRegistrationError('');
} catch (err) {
  const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
  setRegistrationError(errorMessage);
}

  };

  const handlePopupClose = () => {
    setShowPopup(false);
    window.location.reload(); // Refresh page
  };

  return (
    <>
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5 mt-4 bg-gradient-to-br from-purple-200 to-purple-300 p-6 rounded-2xl shadow-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Name */}
        <div>
          <input
            {...register('name', { required: 'Full Name is required' })}
            placeholder="Full Name"
            className="w-full px-4 py-2 border border-purple-400 rounded shadow-sm focus:ring-2 focus:ring-purple-500"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        {/* Username for Superadmin */}
        {role === 'superadmin' && (
          <div>
            <input
              {...register('username', { required: 'Username is required' })}
              placeholder="Username"
              className="w-full px-4 py-2 border border-purple-400 rounded shadow-sm focus:ring-2 focus:ring-purple-500"
            />
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
          </div>
        )}

        {/* Email */}
        <div>
          <input
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^\S+@\S+$/, message: 'Invalid email format' },
            })}
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border border-purple-400 rounded shadow-sm focus:ring-2 focus:ring-purple-500"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <input
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Minimum 6 characters required' },
            })}
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border border-purple-400 rounded shadow-sm focus:ring-2 focus:ring-purple-500"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>

        {/* Phone (optional) */}
        <div>
          <input
            {...register('phone')}
            placeholder="Phone (optional)"
            className="w-full px-4 py-2 border border-purple-400 rounded shadow-sm"
          />
        </div>

        {/* Address fields for users only */}
        {role === 'user' && (
          <>
            <div><input {...register('address')} placeholder="Address" className="w-full px-4 py-2 border border-purple-400 rounded shadow-sm" /></div>
            <div><input {...register('city')} placeholder="City" className="w-full px-4 py-2 border border-purple-400 rounded shadow-sm" /></div>
            <div><input {...register('state')} placeholder="State" className="w-full px-4 py-2 border border-purple-400 rounded shadow-sm" /></div>
            <div><input {...register('postal_code')} placeholder="Postal Code" className="w-full px-4 py-2 border border-purple-400 rounded shadow-sm" /></div>
            <div><input {...register('country')} placeholder="Country" className="w-full px-4 py-2 border border-purple-400 rounded shadow-sm" /></div>
          </>
        )}

        {/* Submit */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.04 }}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded font-semibold shadow-md"
        >
          Register
        </motion.button>
      </motion.form>

      {/* ✅ Centered Success Popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 shadow-2xl text-center border border-purple-400"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-purple-600 text-xl font-bold mb-4">
                ✅ {role.charAt(0).toUpperCase() + role.slice(1)} Registered Successfully!
              </h2>
              <button
                onClick={handlePopupClose}
                className="mt-3 px-6 py-2 bg-purple-600 text-white font-semibold rounded shadow-md hover:bg-purple-700"
              >
                OK
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default RegisterForm;
