import React, { useContext } from 'react';
import { SettingsContext } from '../../Context/SettingsContext';
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Footer = () => {
  const { settings, loading } = useContext(SettingsContext);

  if (loading || !settings) return null;

  const hasSocial =
    settings.facebook_url?.trim() ||
    settings.instagram_url?.trim() ||
    settings.whatsapp_url?.trim();

  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-gradient-to-tr from-[#1e1e2f] via-[#2a2a40] to-[#1e1e2f] text-gray-200 pt-12 pb-8 border-t-4 border-[#e11d48] rounded-t-3xl shadow-inner"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand & Footer Message */}
        <div>
          <h2 className="text-3xl font-extrabold text-white mb-4 tracking-widest uppercase">
            <span className="text-[#e11d48]">{settings.site_name?.split(' ')[0] || 'Kondaji'}</span>{' '}
            {settings.site_name?.split(' ')[1] || 'Chivda'}
          </h2>
          <p className="text-gray-400 leading-relaxed text-sm">
            {settings.footer_message || '© 2025 Kondaji Chivda – All Rights Reserved'}
          </p>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-xl font-semibold text-[#f43f5e] mb-4 uppercase tracking-wide">
            Contact Us
          </h3>
          <ul className="space-y-3 text-gray-400 text-sm">
            <li>
              <span className="font-semibold text-white">Email: </span>
              <a
                href={`mailto:${settings.contact_email}`}
                className="hover:text-[#f43f5e] transition-colors duration-300"
              >
                {settings.contact_email || 'support@kondajichivda.com'}
              </a>
            </li>
            <li>
              <span className="font-semibold text-white">Phone: </span>
              <a
                href={`tel:${settings.phone}`}
                className="hover:text-[#f43f5e] transition-colors duration-300"
              >
                {settings.phone || '+91-22-12345678'}
              </a>
            </li>
            <li>
              <span className="font-semibold text-white">Address: </span>
              <address className="not-italic leading-relaxed">
                {settings.address || '123 Kondaji Street, Nashik, Maharashtra, India'}
              </address>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-xl font-semibold text-[#f43f5e] mb-4 uppercase tracking-wide">
            Follow Us
          </h3>
          {hasSocial ? (
            <div className="flex space-x-6 text-gray-400 text-2xl">
              {settings.facebook_url && (
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#f43f5e] transition-colors duration-300 hover:scale-110"
                  aria-label="Facebook"
                >
                  <FaFacebookF />
                </a>
              )}
              {settings.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#f43f5e] transition-colors duration-300 hover:scale-110"
                  aria-label="Instagram"
                >
                  <FaInstagram />
                </a>
              )}
              {settings.whatsapp_url && (
                <a
                  href={settings.whatsapp_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#f43f5e] transition-colors duration-300 hover:scale-110"
                  aria-label="WhatsApp"
                >
                  <FaWhatsapp />
                </a>
              )}
            </div>
          ) : (
            <p className="text-gray-500 italic">No social media links added yet.</p>
          )}

          <p className="mt-8 text-gray-500 text-xs tracking-wide">
            Designed with ❤️ by the Kondaji Chivda Dev Team
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
