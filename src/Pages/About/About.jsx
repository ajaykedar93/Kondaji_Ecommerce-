import React from 'react';
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="bg-gradient-to-b from-white via-[#fff7f7] to-[#fdfdfd] min-h-screen py-16 px-6 md:px-20 text-gray-800">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto text-center"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
          <span className="text-[#e11d48] font-black drop-shadow-sm">About</span>{' '}
          <span className="text-gray-800 font-black">Kondaji Chivda</span>
        </h1>
        <p className="text-lg md:text-xl leading-relaxed text-gray-600 mb-10">
          <span className="font-semibold text-gray-800">
            Since 1918, Kondaji Chivda has been a legacy in every bite.
          </span>{' '}
          Rooted in rich Maharashtrian tradition, our handcrafted Chivda
          blends premium poha, aromatic spices, and a century-old recipe.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
      >
        <div className="bg-white shadow-md p-6 rounded-xl hover:shadow-xl transition border-t-4 border-[#e11d48]">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Our Mission</h3>
          <p className="text-gray-600 leading-relaxed">
            To deliver <strong>authentic taste</strong> and <strong>premium quality</strong>
            snacks inspired by <em>generations of heritage</em> and love.
          </p>
        </div>

        <div className="bg-white shadow-md p-6 rounded-xl hover:shadow-xl transition border-t-4 border-yellow-400">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Our Legacy</h3>
          <p className="text-gray-600 leading-relaxed">
            Founded by <strong>Kondaji Wavre</strong>, a wrestler turned culinary pioneer,
            and now run by the <em>third generation</em> of the family.
          </p>
        </div>

        <div className="bg-white shadow-md p-6 rounded-xl hover:shadow-xl transition border-t-4 border-green-500">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Why Us?</h3>
          <p className="text-gray-600 leading-relaxed">
            We combine <strong>tradition</strong>, <strong>purity</strong>, and <strong>innovation</strong>
            to create irresistible, flavorful experiences.
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mt-16 text-center"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Connect with Us</h2>
        <div className="flex justify-center space-x-6 text-xl text-gray-600">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#e11d48] transition"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#e11d48] transition"
          >
            <FaInstagram />
          </a>
          <a
            href="https://wa.me/919999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#e11d48] transition"
          >
            <FaWhatsapp />
          </a>
        </div>
        <p className="mt-4 text-gray-500 text-sm">
          Drop us a message anytime. We’d love to hear from you.
        </p>
      </motion.div>
    </div>
  );
};

export default About;
