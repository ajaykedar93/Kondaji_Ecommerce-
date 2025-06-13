import React, { useState } from 'react';
import axios from 'axios';

const AdminAddNotification = () => {
  const [formData, setFormData] = useState({
    type: '',
    title: '',
    link: '',
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Optional link validation
      if (formData.link && !formData.link.startsWith('/')) {
        alert('Redirect link should start with "/"');
        return;
      }

      const res = await axios.post(
        'https://kondaji-express-api.onrender.com/api/notifications',
        formData
      );

      if (res.status === 200 || res.status === 201) {
        alert('✅ Notification Added Successfully!');
        setFormData({ type: '', title: '', link: '' });
      } else {
        alert('❌ Failed to add notification');
      }
    } catch (err) {
      console.error('Error adding notification:', err);
      alert('❌ An error occurred while adding notification');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-red-600 text-center">
        📢 Add New Notification
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        >
          <option value="">Select Type</option>
          <option value="order">Order</option>
          <option value="refund">Refund</option>
          <option value="offer">Offer</option>
          <option value="coupon">Coupon</option>
          <option value="return">Return</option>
          <option value="info">Info</option>
        </select>

        <input
          type="text"
          name="title"
          placeholder="Notification Title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <input
          type="text"
          name="link"
          placeholder="Redirect Link (e.g., /products)"
          value={formData.link}
          onChange={handleChange}
          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <button
          type="submit"
          className="bg-green-600 w-full text-white py-2 rounded hover:bg-green-700 transition"
        >
          ➕ Post Notification
        </button>
      </form>
    </div>
  );
};

export default AdminAddNotification;
