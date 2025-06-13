import React, { useEffect, useState } from 'react';

const Payment = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch('https://kondaji-express-api.onrender.com/api/orders')
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error('❌ Failed to fetch orders:', err));
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-green-700 text-center">All Payments</h2>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-green-100 text-green-800">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Products</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Payment Status</th>
                <th className="px-4 py-3">Order Status</th>
                <th className="px-4 py-3">Placed On</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700 font-medium">#{order.id}</td>
                  <td className="px-4 py-3">{order.user_name || 'N/A'}</td>
                  <td className="px-4 py-3">
                    <ul className="list-disc pl-4">
                      {order.items.map((item, idx) => (
                        <li key={idx}>
                          {item.product_name} × {item.quantity} — ₹{item.price}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-3 font-semibold text-green-700">₹{order.total}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-white text-xs ${order.payment_status === 'Paid' ? 'bg-green-500' : 'bg-red-500'}`}>
                      {order.payment_status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-blue-600">{order.order_status || 'Pending'}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-sm">
                    {new Date(order.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Payment;
