import React, { useEffect, useState } from 'react';
import BannerPng from '../../assets/Images/Banner-removebg-preview.png';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const testimonials = [
  {
    name: 'Ramesh Pawar',
    location: 'Mumbai',
    message:
      'Absolutely delicious! The perfect balance of crunch, spice, and nostalgia. I’ve been ordering Kondaji Chivda for years and it never disappoints.',
  },
  {
    name: 'Sneha Kulkarni',
    location: 'Pune',
    message:
      'Their quality is unmatched! The family touch in every packet makes me feel right at home. Highly recommend to all snack lovers!',
  },
  {
    name: 'Amit Deshmukh',
    location: 'Nagpur',
    message:
      'Light, crispy, and full of flavor. I’ve never had a better chivda. A century-old tradition that still rules hearts today!',
  },
];

const Banners = () => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLearnMore = () => {
    navigate('/about');
    setTimeout(() => window.scrollTo(0, 0), 50);
  };

  return (
    <section className="bg-gradient-to-br from-white via-red-50 to-pink-50 py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <img
            src={BannerPng}
            alt="Kondaji Chivda"
            className="w-[90%] max-w-[450px] h-auto object-contain drop-shadow-2xl rounded-lg hover:scale-105 transition duration-300"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-center md:text-left space-y-6"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-snug">
            Taste Tradition Since <span className="text-[#e11d48]">1918</span>
          </h2>

          <p className="text-lg text-gray-700 leading-relaxed">
            Kondaji Chivda has delighted generations with our signature blend of crunchy poha and aromatic spices.
            <br />
            A family tradition rooted in excellence.
          </p>

          <p className="text-gray-700 text-base">
            Every bite is made from premium ingredients and a passion for authentic taste.
            <br />
            Join us on a journey through over 100 years of irresistible flavor.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLearnMore}
            className="bg-gradient-to-r from-[#e11d48] via-pink-500 to-[#e11d48] text-white text-lg font-semibold px-8 py-3 rounded-xl shadow-xl hover:shadow-pink-400 transition duration-300"
          >
            Learn More
          </motion.button>
        </motion.div>
      </div>

      {/* Auto-sliding testimonials */}
      <div className="mt-20 bg-white rounded-3xl shadow-2xl py-10 px-6 max-w-4xl mx-auto text-center relative overflow-hidden">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-3xl font-bold text-[#e11d48] mb-3">Customer Love</h3>
          <p className="text-gray-700 text-lg max-w-3xl mx-auto italic">“{testimonials[index].message}”</p>
          <div className="mt-4 text-sm text-gray-500">
            — {testimonials[index].name}, {testimonials[index].location}
          </div>
          <div className="mt-4 flex justify-center gap-1">
            {testimonials.map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  i === index ? 'bg-[#e11d48]' : 'bg-gray-300'
                }`}
              ></div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Banners;
