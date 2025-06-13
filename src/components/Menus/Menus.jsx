import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { AuthContext } from '../../Context/AuthContext';

const Menus = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [menus, setMenus] = useState([]);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://kondaji-express-api.onrender.com/api/products');
        const data = await response.json();
        setMenus(data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching products');
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const nextSlide = () => {
    if (visibleIndex < menus.length - 2) {
      setVisibleIndex(visibleIndex + 1);
    }
  };

  const prevSlide = () => {
    if (visibleIndex > 0) {
      setVisibleIndex(visibleIndex - 1);
    }
  };

  const handleCheckNowClick = (menuId) => {
    if (user) {
      navigate(`/product/${menuId}`, { replace: false });
      // Delay scroll to top after navigation
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 50);
    } else {
      navigate('/auth?mode=login', { replace: false });
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 50);
    }
  };

  if (loading) return <div className="text-center py-10 text-gray-500">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <section className="py-16 bg-gradient-to-b from-white to-red-50 relative">
      <div className="max-w-6xl mx-auto px-4 relative">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-10 text-gray-800">
          ✨ Trending Products
        </h1>

        {/* Arrows */}
        <button
          onClick={prevSlide}
          disabled={visibleIndex === 0}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border shadow rounded-full p-3 hover:bg-red-100 disabled:opacity-40"
          aria-label="Previous products"
        >
          <FaChevronLeft />
        </button>

        <div className="flex gap-8 overflow-hidden">
          {menus.slice(visibleIndex, visibleIndex + 2).map((menu, index) => {
            const price = parseFloat(menu.price).toFixed(2);
            const maskedPrice = user ? `₹${price}` : `₹${price[0]}***${price[price.length - 1]}`;

            return (
              <motion.div
                key={menu.id}
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="flex-1 bg-white rounded-2xl p-6 border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300"
              >
                <img
                  src={menu.image}
                  alt={menu.name}
                  className="w-full h-52 object-contain mx-auto rounded-lg border"
                />
                <div className="text-center mt-4">
                  <h3 className="text-lg font-semibold text-gray-800 capitalize truncate">{menu.name}</h3>
                  <h4 className="text-red-600 font-bold text-base mt-1">{maskedPrice}</h4>
                </div>
                <div className="block mt-4">
                  <button
                    onClick={() => handleCheckNowClick(menu.id)}
                    className="w-full py-2 bg-gradient-to-r from-red-500 via-pink-500 to-red-600 text-white text-sm font-semibold rounded-lg hover:opacity-90 transition"
                  >
                    Check Now
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        <button
          onClick={nextSlide}
          disabled={visibleIndex >= menus.length - 2}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border shadow rounded-full p-3 hover:bg-red-100 disabled:opacity-40"
          aria-label="Next products"
        >
          <FaChevronRight />
        </button>
      </div>
    </section>
  );
};

export default Menus;
