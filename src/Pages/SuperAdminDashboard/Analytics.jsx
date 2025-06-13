import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUser, FaMoneyBillWave, FaChartLine, FaBoxOpen } from 'react-icons/fa';

const API_BASE = 'https://kondaji-express-api.onrender.com';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/analytics/dashboard`);
        setData(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load analytics');
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return <div className="text-center p-10 text-lg">Loading analytics...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Admin Dashboard Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
          <FaUser className="text-4xl text-pink-600 mb-2" />
          <h3 className="text-lg font-semibold">Total Users</h3>
          <p className="text-2xl font-bold text-gray-700">{data.total_users}</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
          <FaChartLine className="text-4xl text-green-600 mb-2" />
          <h3 className="text-lg font-semibold">Total Sales</h3>
          <p className="text-2xl font-bold text-gray-700">{data.total_sales}</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
          <FaMoneyBillWave className="text-4xl text-yellow-500 mb-2" />
          <h3 className="text-lg font-semibold">Total Revenue</h3>
          <p className="text-2xl font-bold text-gray-700">
            ₹{data.total_revenue.toLocaleString('en-IN')}
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
          <FaUser className="text-4xl text-blue-500 mb-2" />
          <h3 className="text-lg font-semibold">Active Users</h3>
          <p className="text-2xl font-bold text-gray-700">{data.active_users}</p>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Top 5 Products</h3>
        <ul className="divide-y divide-gray-200">
          {data.top_products.map((product, idx) => (
            <li key={idx} className="py-3 flex justify-between">
              <span className="font-medium text-gray-700">{product.name}</span>
              <span className="text-gray-600">{product.quantity_sold} sold</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Analytics;
