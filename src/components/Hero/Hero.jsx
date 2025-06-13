import React from 'react';
import { IoBagHandleOutline } from 'react-icons/io5';
import Heropng from "../../assets/Images/Makhmal-removebg-preview.png";
import { motion } from "framer-motion";
import { FadeRight } from '../../utility/animation';

const Hero = () => {
  const handleOrderNow = () => {
    const el = document.getElementById('menus');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden">
      {/* Glowing background blur */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-purple-600 via-pink-400 to-yellow-400 opacity-20 blur-3xl" />

      <div className="container grid grid-cols-1 md:grid-cols-2 items-center min-h-[650px] py-12 px-6 md:px-16 relative z-10 bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 rounded-b-[60px] shadow-2xl">
        
        {/* Left Section */}
        <div className="flex flex-col justify-center text-center md:text-left space-y-6 z-10">
          <motion.h1
            variants={FadeRight(0.6)}
            initial="hidden"
            animate="visible"
            className="text-5xl font-extrabold tracking-tight leading-snug text-white"
          >
            Healthy <br />
            <span className="text-blue-400 hover:underline">Delicious</span>{" "}
            <span className="text-yellow-300">Chivda!</span>
          </motion.h1>

          <motion.p
            variants={FadeRight(0.9)}
            initial="hidden"
            animate="visible"
            className="text-xl font-medium text-white/90"
          >
            Order Now and Enjoy the Taste of Tradition 🍽️
          </motion.p>

          <motion.p
            variants={FadeRight(1.2)}
            initial="hidden"
            animate="visible"
            className="text-white/80 text-sm leading-relaxed"
          >
            Kondaji Chivda was founded in 1918 by wrestler Kondaji Wavre. Today, the third generation of the Wavre family continues the legacy with pride and passion for authentic snacks.
          </motion.p>

          <motion.div
            variants={FadeRight(1.5)}
            initial="hidden"
            animate="visible"
            className="mt-6 flex justify-center md:justify-start"
          >
            <button
              onClick={handleOrderNow}
              className="animate-pulse-custom flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold border-2 border-white text-white bg-transparent
                         hover:bg-white hover:text-purple-700 hover:shadow-2xl hover:scale-105 transition-all duration-300"
              style={{ minWidth: 140 }}
              aria-label="Order Now"
            >
              <IoBagHandleOutline className="text-lg" />
              Order Now
            </button>
          </motion.div>
        </div>

        {/* Right Section (Image with floating animation) */}
        <motion.div
          className="flex justify-center items-center mt-10 md:mt-0"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <img
            src={Heropng}
            alt="Kondaji Chivda"
            className="w-[300px] md:w-[500px] object-contain rounded-xl drop-shadow-xl transition duration-300 hover:scale-105"
          />
        </motion.div>
      </div>

      {/* Custom glowing pulse keyframes */}
      <style>{`
        @keyframes pulse-custom {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
          }
          50% {
            box-shadow: 0 0 15px 8px rgba(255, 255, 255, 0.3);
          }
        }
        .animate-pulse-custom {
          animation: pulse-custom 2s infinite;
        }
      `}</style>
    </section>
  );
};

export default Hero;
