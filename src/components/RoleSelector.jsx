import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const RoleSelector = () => {
  const [role, setRole] = useState(null);
  const [mode, setMode] = useState('login');
  const [step, setStep] = useState(1);

  useEffect(() => {
    const handleSwitchToRegister = () => setMode('register');
    window.addEventListener('switchToRegister', handleSwitchToRegister);
    return () => window.removeEventListener('switchToRegister', handleSwitchToRegister);
  }, []);

  const handleBack = () => {
    if (mode === 'register') {
      setMode('login');
    } else if (step === 2) {
      setStep(1);
    } else if (step === 3 && (role === 'admin' || role === 'superadmin')) {
      setStep(2);
    } else {
      setRole(null);
      setStep(1);
    }
  };

  return (
    <motion.div
      className={`max-w-md mx-auto mt-24 mb-20 px-8 py-10 rounded-3xl shadow-2xl border border-gray-200 transition-all duration-500
        ${!role
          ? 'bg-gradient-to-br from-pink-300 to-pink-400' // Faint shade of pink
          : mode === 'login'
          ? 'bg-gradient-to-br from-pink-300 to-pink-400' // Faint shade of pink
          : 'bg-gradient-to-br from-pink-300 to-pink-400'}` // Faint shade of pink
      }
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Step 1 */}
      {step === 1 && !role ? (
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <h2 className="text-3xl font-extrabold text-white mb-6">Choose Your Role</h2>
          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="w-full py-3 rounded-xl font-semibold text-lg bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg"
              onClick={() => {
                setRole('user');
                setStep(3);
              }}
            >
              👤 I am a User
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="w-full py-3 rounded-xl font-semibold text-lg bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg"
              onClick={() => setStep(2)}
            >
              🛠️ I am an Admin
            </motion.button>
          </div>
        </motion.div>
      ) : step === 2 ? (
        // Step 2: Admin Role Selection
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Admin Type</h2>
          <div className="space-y-4 mb-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="w-full py-3 rounded-xl font-semibold text-lg bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg"
              onClick={() => {
                setRole('admin');
                setStep(3);
              }}
            >
              🧑‍💼 Admin
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="w-full py-3 rounded-xl font-semibold text-lg bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg"
              onClick={() => {
                setRole('superadmin');
                setStep(3);
              }}
            >
              👑 Superadmin
            </motion.button>
          </div>

          {/* ✅ Back Button for Admin Type Step */}
          <div className="mt-6 text-center">
            <button
              onClick={handleBack}
              className="text-sm font-bold text-white hover:text-gray-800 transition-all flex items-center justify-center gap-1"
            >
              ← Back
            </button>
          </div>
        </motion.div>
      ) : (
        // Step 3: Login/Register Form
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl text-center font-bold text-white mb-4">
            {mode === 'login' ? `${role.charAt(0).toUpperCase() + role.slice(1)} Login` : `Register as ${role}`}
          </h2>

          {mode === 'login' ? <LoginForm role={role} /> : <RegisterForm role={role} />}

          {(mode === 'login' && (role === 'user' || role === 'superadmin')) && (
            <p className="text-center mt-6 text-sm text-gray-700">
              Don’t have an account?{' '}
              <span
                className="font-bold text-black cursor-pointer hover:underline"
                onClick={() => setMode('register')}
              >
                Register Here
              </span>
            </p>
          )}

          {mode === 'register' && (
            <p className="text-center mt-6 text-sm text-gray-700">
              Already registered?{' '}
              <span
                className="text-pink-600 font-medium cursor-pointer hover:underline"
                onClick={() => setMode('login')}
              >
                Login Here
              </span>
            </p>
          )}

          {/* ✅ Back Button for Step 3 */}
          <div className="mt-6 text-center">
            <button
              onClick={handleBack}
              className="text-sm font-bold text-white hover:text-gray-800 transition-all flex items-center justify-center gap-1"
            >
              ← Back
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default RoleSelector;
