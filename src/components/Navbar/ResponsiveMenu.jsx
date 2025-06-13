import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdClose } from 'react-icons/md';

const ResponsiveMenu = ({ open, setOpen, user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    setOpen(false);
    navigate('/');
  };

  return (
    <motion.div
      initial={{ x: '-100%' }}
      animate={{ x: open ? 0 : '-100%' }}
      transition={{ type: 'tween', duration: 0.3 }}
      className={`fixed top-0 left-0 w-72 h-full bg-white shadow-lg z-50 p-6 flex flex-col gap-4 transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <div className="flex justify-between items-center mb-4">
        <span className="text-xl font-bold text-gray-800">Menu</span>
        <MdClose className="text-2xl cursor-pointer" onClick={() => setOpen(false)} />
      </div>

      {user?.role === 'admin' ? (
        <Link
          to="/admin-dashboard"
          onClick={() => setOpen(false)}
          className="text-gray-700 hover:text-[#e11d48] font-medium"
        >
          Dashboard
        </Link>
      ) : (
        <>
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="text-gray-700 hover:text-[#e11d48] font-medium"
          >
            Home
          </Link>

          <Link
            to="/products"
            onClick={() => setOpen(false)}
            className="text-gray-700 hover:text-[#e11d48] font-medium"
          >
            Products
          </Link>

          <Link
            to="/support"
            onClick={() => setOpen(false)}
            className="text-gray-700 hover:text-[#e11d48] font-medium"
          >
            Support
          </Link>

          <Link
            to="/chat-bot"
            onClick={() => setOpen(false)}
            className="text-gray-700 hover:text-[#e11d48] font-medium"
          >
            Chat-Bot
          </Link>

          {!user && (
            <Link
              to="/about"
              onClick={() => setOpen(false)}
              className="text-gray-700 hover:text-[#e11d48] font-medium"
            >
              About
            </Link>
          )}

          {user && user.role !== 'admin' && (
            <Link
              to="/cart-new"
              onClick={() => setOpen(false)}
              className="text-gray-700 hover:text-[#e11d48] font-medium"
            >
              Cart
            </Link>
          )}
        </>
      )}

      {!user ? (
        <button
          onClick={() => {
            setOpen(false);
            navigate('/auth?mode=login');
          }}
          className="mt-4 bg-[#e11d48] text-white py-2 px-4 rounded hover:bg-[#c81038] text-sm"
        >
          Sign In
        </button>
      ) : (
        <>
          <Link
            to={user.role === 'admin' ? '/admin-account' : '/account'}
            onClick={() => setOpen(false)}
            className="text-gray-700 hover:text-[#e11d48] font-medium"
          >
            My Account
          </Link>

          {user.role !== 'admin' && (
            <>
              <Link to="/wishlist" onClick={() => setOpen(false)} className="text-gray-700 hover:text-[#e11d48] font-medium">Wishlist</Link>
              <Link to="/my-orders" onClick={() => setOpen(false)} className="text-gray-700 hover:text-[#e11d48] font-medium">My Orders</Link>
              <Link to="/notifications" onClick={() => setOpen(false)} className="text-gray-700 hover:text-[#e11d48] font-medium">Notifications</Link>
              <Link to="/saved-addresses" onClick={() => setOpen(false)} className="text-gray-700 hover:text-[#e11d48] font-medium">Saved Addresses</Link>
            </>
          )}

          <button
            onClick={handleLogout}
            className="mt-4 text-red-600 font-medium hover:underline text-left"
          >
            Logout
          </button>
        </>
      )}
    </motion.div>
  );
};

export default ResponsiveMenu;