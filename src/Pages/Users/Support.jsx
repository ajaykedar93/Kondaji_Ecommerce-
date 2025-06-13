import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { BsFillSendFill } from 'react-icons/bs';

const API_BASE = 'https://kondaji-express-api.onrender.com/api/messages';

const Support = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    type: 'support',
    message: '',
  });

  const [emailValid, setEmailValid] = useState(null); // null | true | false
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Real-time email check
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!form.email || form.email.length < 5) {
        setEmailValid(null);
        return;
      }

      setCheckingEmail(true);
      axios
        .get(`${API_BASE}/users/check-email/${form.email}`)
        .then((res) => setEmailValid(res.data.exists))
        .catch(() => setEmailValid(false))
        .finally(() => setCheckingEmail(false));
    }, 700);

    return () => clearTimeout(timer);
  }, [form.email]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSubmitted(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(false);
    if (!form.name || !form.email || !form.message) {
      setError('Please fill all fields.');
      return;
    }
    if (!emailValid) {
      setError('Please enter a registered email.');
      return;
    }

    try {
      await axios.post(`${API_BASE}/submit`, form);
      setSubmitted(true);
      setForm({ name: '', email: '', type: 'support', message: '' });
      setEmailValid(null);
    } catch (err) {
      setError('❌ Failed to send message. Try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 flex justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg bg-white shadow-md rounded-xl p-6"
      >
        <h2 className="text-2xl font-bold text-center text-red-600 mb-4">Support & Feedback</h2>
        <p className="text-center text-gray-600 mb-6">
          Need help or want to share feedback? Fill out this form and we'll respond shortly.
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your Full Name"
            className="w-full px-4 py-2 border rounded focus:outline-red-500"
          />

          <div>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Your Registered Email"
              className={`w-full px-4 py-2 border rounded ${
                emailValid === false ? 'border-red-500' : ''
              } focus:outline-red-500`}
            />
            {form.email && (
              <p className="text-sm mt-1 text-gray-500">
                {checkingEmail && '🔄 Checking email...'}
                {!checkingEmail && emailValid && '✅ Email is registered'}
                {!checkingEmail && emailValid === false && '❌ Email not found'}
              </p>
            )}
          </div>

          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded text-gray-700 focus:outline-red-500"
          >
            <option value="support">Support</option>
            <option value="feedback">Feedback</option>
          </select>

          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            rows="4"
            placeholder="Your Message..."
            className="w-full px-4 py-2 border rounded focus:outline-red-500"
          />

          <div className="flex flex-col items-center">
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded flex items-center gap-2"
            >
              <BsFillSendFill /> Submit Message
            </button>

            {submitted && (
              <p className="text-green-600 text-sm mt-3 text-center">
                ✅ Message sent successfully!
              </p>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Support;
