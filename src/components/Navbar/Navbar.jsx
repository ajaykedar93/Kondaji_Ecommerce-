import React, { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { MdOutlineShoppingCart, MdMenu } from 'react-icons/md';
import { AuthContext } from '../../Context/AuthContext';
import ResponsiveMenu from './ResponsiveMenu';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, setUser } = useContext(AuthContext);
  const [dropdown, setDropdown] = useState(false);
  const [open, setOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const dropdownRef = useRef(null);
  const supportRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, [setUser]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdown(false);
      if (supportRef.current && !supportRef.current.contains(e.target)) setSupportOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate('/');
  };

  const getDashboardLink = () => {
    if (user?.role === 'superadmin') return '/superadmin-dashboard';
    if (user?.role === 'admin') return '/admin-dashboard';
    return '/';
  };

  const isUser = user?.role === 'user';

  const scrollToMenusSection = () => {
    const el = document.getElementById('menus');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setDropdown(false);
    setSupportOpen(false);
    setOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120 }}
        className="bg-gradient-to-r from-white via-pink-50 to-white shadow-md fixed top-0 left-0 w-full z-50"
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-4 md:px-12">
          <Link to="/" className="text-[28px] md:text-[32px] font-extrabold tracking-tight flex items-center gap-2">
            <span className="text-gray-900">Kondaji</span>
            <span className="text-pink-600">Chivda</span>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-gray-800 text-sm font-medium">
            {user ? (
              <>
                {(user.role === 'admin' || user.role === 'superadmin') ? (
                  <Link to={getDashboardLink()} className="hover:text-pink-600">Dashboard</Link>
                ) : (
                  <>
                    <Link to="/" className="hover:text-pink-600">Home</Link>
                    <Link to="/products" className="hover:text-pink-600">Products</Link>
                    <div className="relative" ref={supportRef}>
                      <button onClick={() => setSupportOpen(!supportOpen)} className="hover:text-pink-600">Support</button>
                      <AnimatePresence>
                        {supportOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full mt-2 bg-white rounded-md shadow-lg z-40 w-48"
                          >
                            <Link to="/support" className="block px-4 py-2 hover:bg-purple-100">Help Center</Link>
                            <Link to="/chat-bot" className="block px-4 py-2 hover:bg-purple-100">Chat Bot</Link>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <Link to="/about" className="hover:text-pink-600">About</Link>
                    <Link to="/cart-new" className="relative">
                      <MdOutlineShoppingCart className="text-2xl hover:text-pink-600" />
                      {/* Notification dot */}
                      <span className="absolute -top-1 -right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                    </Link>
                  </>
                )}
              </>
            ) : (
              <>
                <Link to="/" className="hover:text-pink-600">Home</Link>
                <button onClick={scrollToMenusSection} className="hover:text-pink-600">Products</button>
                <Link to="/about" className="hover:text-pink-600">About</Link>
              </>
            )}

            {!user ? (
              <button
                onClick={() => navigate('/auth?mode=login')}
                className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition text-sm"
              >
                Sign In
              </button>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdown(!dropdown)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm hover:bg-purple-700"
                >
                  Hi, {user.name || user.username}
                  <span className="text-xs bg-yellow-300 text-yellow-900 font-semibold px-2 py-0.5 rounded">
                    {user.role.toUpperCase()}
                  </span>
                </button>
                <AnimatePresence>
                  {dropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 bg-white rounded-md shadow-lg z-50 w-56"
                    >
                      <Link
                        to={`/${user.role === 'user' ? 'account' : `${user.role}-account`}`}
                        className="block px-4 py-2 hover:bg-purple-100"
                      >
                        My Account
                      </Link>
                      {isUser && (
                        <>
                          <Link to="/wishlist" className="block px-4 py-2 hover:bg-purple-100">Wishlist</Link>
                          <Link to="/my-orders" className="block px-4 py-2 hover:bg-purple-100">My Orders</Link>
                          <Link to="/notifications" className="block px-4 py-2 hover:bg-purple-100">Notifications</Link>
                          <Link to="/saved-addresses" className="block px-4 py-2 hover:bg-purple-100">Saved Addresses</Link>
                        </>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-purple-100"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Mobile Menu Icon */}
          <div className="md:hidden" onClick={() => setOpen(!open)}>
            <MdMenu className="text-3xl text-gray-800 cursor-pointer" />
          </div>
        </div>
      </motion.nav>

      {/* Mobile Nav Drawer */}
      <ResponsiveMenu open={open} setOpen={setOpen} user={user} />
    </>
  );
};

export default Navbar;
