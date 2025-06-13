import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';

const CouponsAndDiscounts = () => {
  const [coupons, setCoupons] = useState([]);
  const [newCoupon, setNewCoupon] = useState({ code: '', discount: '', expiry: '' });
  const [popupMessage, setPopupMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchCoupons = async () => {
    try {
      const res = await axios.get('https://kondaji-express-api.onrender.com/api/coupons');
      setCoupons(res.data);
    } catch (err) {
      console.error('❌ Error fetching coupons:', err);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleAddCoupon = async () => {
    const { code, discount, expiry } = newCoupon;
    if (!code || !discount || !expiry) {
      alert('All fields are required');
      return;
    }

    try {
      const res = await axios.post('https://kondaji-express-api.onrender.com/api/coupons/admin', {
        code,
        discount: parseInt(discount),
        expiry,
      });
      setNewCoupon({ code: '', discount: '', expiry: '' });
      showPopupMessage('✅ Coupon added successfully');
      fetchCoupons(); // refresh list
    } catch (err) {
      console.error('❌ Error adding coupon:', err);
      alert(err?.response?.data?.error || 'Error adding coupon');
    }
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setShowPopup(true);
    setPopupMessage('Are you sure you want to delete this coupon?');
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`https://kondaji-express-api.onrender.com/api/coupons/${deleteId}`);
      setDeleteId(null);
      showPopupMessage('🗑️ Coupon deleted successfully');
      fetchCoupons(); // refresh list after delete
    } catch (err) {
      console.error('❌ Error deleting coupon:', err);
    }
  };

  const showPopupMessage = (message) => {
    setPopupMessage(message);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 1500);
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-indigo-700 mb-8">🎟️ Manage Coupons & Discounts</h1>

      {/* Add Coupon Form */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">➕ Add New Coupon</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Coupon Code"
            className="border px-3 py-2 rounded focus:outline-indigo-500"
            value={newCoupon.code}
            onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
          />
          <input
            type="number"
            placeholder="Discount (%)"
            className="border px-3 py-2 rounded focus:outline-indigo-500"
            value={newCoupon.discount}
            onChange={(e) => setNewCoupon({ ...newCoupon, discount: e.target.value })}
          />
          <input
            type="date"
            className="border px-3 py-2 rounded focus:outline-indigo-500"
            value={newCoupon.expiry}
            onChange={(e) => setNewCoupon({ ...newCoupon, expiry: e.target.value })}
          />
          <button
            onClick={handleAddCoupon}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded flex items-center justify-center transition"
          >
            <FaPlus className="mr-2" /> Add
          </button>
        </div>
      </div>

      {/* Coupon Table */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">📋 Existing Coupons</h2>
        {coupons.length === 0 ? (
          <p className="text-gray-500 italic">No coupons available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border text-sm">
              <thead>
                <tr className="bg-gray-100 text-left text-gray-700">
                  <th className="p-3">Code</th>
                  <th className="p-3">Discount (%)</th>
                  <th className="p-3">Expiry Date</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr key={coupon.id} className="border-t hover:bg-gray-50 transition">
                    <td className="p-3 font-medium text-gray-800">{coupon.code}</td>
                    <td className="p-3 text-green-700 font-semibold">{coupon.discount}%</td>
                    <td className="p-3">{new Date(coupon.expiry).toLocaleDateString('en-IN')}</td>
                    <td className="p-3 space-x-4">
                      <button
                        className="text-blue-500 cursor-not-allowed"
                        title="Edit coming soon"
                        disabled
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(coupon.id)}
                        className="text-red-600 hover:text-red-800 transition"
                        title="Delete coupon"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Center Popup */}
      {showPopup && popupMessage.includes('delete') ? (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md text-center">
            <h2 className="text-lg font-bold text-red-600 mb-4">{popupMessage}</h2>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-xl shadow-xl text-center text-green-600 font-semibold w-[90%] max-w-sm">
            {popupMessage}
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponsAndDiscounts;
