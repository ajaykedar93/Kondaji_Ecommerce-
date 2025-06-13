import React from 'react';
import { FaEnvelope, FaPhoneAlt, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

const Contact = () => {
  return (
    <section className="container py-16 px-6">
      <h1 className="text-4xl font-bold text-center text-red-600 mb-12">Contact Us</h1>

      <div className="flex flex-col md:flex-row justify-between items-start gap-8">

        {/* Contact Info Section */}
        <div className="w-full md:w-1/2 bg-white p-8 shadow-lg rounded-lg transition-transform transform hover:scale-105 hover:shadow-xl">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Get in Touch</h2>
          <p className="text-lg text-gray-600 mb-6">
            We’re here to help! Whether you have a question, need assistance, or want to share your thoughts, feel free to reach out using the contact details below.
          </p>

          {/* Email */}
          <div className="mb-4 flex items-center text-gray-600">
            <FaEnvelope className="mr-3 text-xl" />
            <a href="mailto:contact@kondajichiwda.com" className="text-lg hover:text-red-600 transition-colors">
              contact@kondajichiwda.com
            </a>
          </div>

          {/* Phone */}
          <div className="mb-6 flex items-center text-gray-600">
            <FaPhoneAlt className="mr-3 text-xl" />
            <p className="text-lg">+91-9876543210</p>
          </div>

          {/* Social Media Icons */}
          <div className="flex space-x-6 text-gray-600">
            <a href="https://www.facebook.com/KondajiChiwda" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
              <FaFacebook className="text-2xl" />
            </a>
            <a href="https://www.instagram.com/KondajiChiwda" target="_blank" rel="noopener noreferrer" className="hover:text-pink-600 transition-colors">
              <FaInstagram className="text-2xl" />
            </a>
            <a href="https://twitter.com/KondajiChiwda" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
              <FaTwitter className="text-2xl" />
            </a>
          </div>
        </div>

        {/* Location Section */}
        <div className="w-full md:w-1/2 bg-white p-8 shadow-lg rounded-lg transition-transform transform hover:scale-105 hover:shadow-xl">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Our Location</h2>
          <p className="text-lg text-gray-600 mb-6">
            Visit us in the heart of the city and explore our delicious range of Kondaji Chiwda! We're always happy to welcome our customers.
          </p>

          <div className="bg-gray-200 p-4 rounded-lg">
            <iframe
              src="https://www.google.com/maps/embed/v1/place?q=place_id:ChIJKx2s2pYAzj4ROd1KnRzkN80&key=YOUR_GOOGLE_MAPS_API_KEY"
              width="100%"
              height="300"
              frameBorder="0"
              style={{ border: 0 }}
              allowFullScreen=""
              aria-hidden="false"
              tabIndex="0"
            ></iframe>
          </div>
        </div>
      </div>

      {/* Demo Link */}
      <div className="mt-12 text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Explore Our Products</h3>
        <p className="text-lg text-gray-600 mb-6">
          Discover the amazing range of Kondaji Chiwda products! Click below to explore more.
        </p>
        <a
          href="https://www.kondajichiwda.com"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-red-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-red-700 transition-colors"
        >
          Visit Kondaji Chiwda
        </a>
      </div>
    </section>
  );
};

export default Contact;
