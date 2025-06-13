import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import RoleSelector from '../components/RoleSelector';

const AuthPage = () => {
  const [role, setRole] = useState(null);
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex justify-center items-start pt-10 pb-32 px-4 bg-white">
      <div className="bg-white shadow-lg p-10 rounded-2xl w-full max-w-xl">
        {!role ? (
          <RoleSelector onSelect={setRole} />
        ) : isLogin ? (
          <>
            <LoginForm role={role} />
            <p className="text-sm text-center mt-4">
              Don't have an account?{' '}
              <button className="text-blue-600 font-semibold hover:underline" onClick={() => setIsLogin(false)}>
                Register
              </button>
            </p>
          </>
        ) : (
          <>
            <RegisterForm role={role} />
            <p className="text-sm text-center mt-4">
              Already have an account?{' '}
              <button className="text-blue-600 font-semibold hover:underline" onClick={() => setIsLogin(true)}>
                Login
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
