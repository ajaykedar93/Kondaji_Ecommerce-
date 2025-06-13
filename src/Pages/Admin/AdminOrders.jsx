import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaClipboardList } from 'react-icons/fa';

const API_BASE_URL = 'https://kondaji-express-api.onrender.com';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/orders`);
      setOrders(res.data);
    } catch (err) {
      console.error('❌ Failed to fetch orders:', err);
      setMessage('❌ Could not load orders.');
    } finally {
      setLoading(false);
    }
  };

  const fetchProductDetails = async (productId) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/products/${productId}`);
      setSelectedProduct(res.data);
    } catch (err) {
      console.error('❌ Failed to fetch product details:', err);
    }
  };

  const handleReturnRequest = async (orderId, action) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/orders/${orderId}/return`, { action });
      if (res.status === 200) {
        setOrders(orders.map(order =>
          order.id === orderId ? { ...order, order_status: action === 'approve' ? 'Returned' : 'Return Rejected' } : order
        ));
      }
    } catch (err) {
      console.error('❌ Error handling return request:', err);
      setMessage('❌ Failed to process return request.');
    }
  };

  const initiateRefund = async (orderId) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/orders/${orderId}/refund`);
      if (res.status === 200) {
        setOrders(orders.map(order =>
          order.id === orderId ? { ...order, order_status: 'Refunded' } : order
        ));
      }
    } catch (err) {
      console.error('❌ Error processing refund:', err);
      setMessage('❌ Failed to process refund.');
    }
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setSelectedProduct(null);
  };

  return (
    <motion.div className="p-6 max-w-7xl mx-auto" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
      <div className="bg-purple-600 text-white rounded-2xl shadow-lg p-6 flex items-center justify-center mb-10">
        <FaClipboardList className="text-3xl mr-3" />
        <h1 className="text-2xl font-semibold">Manage Orders</h1>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading orders...</p>
      ) : message ? (
        <p className="text-center text-red-600">{message}</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full table-auto text-sm text-left">
            <thead className="bg-gray-100 text-gray-700 uppercase">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">User ID</th>
                <th className="px-4 py-3">Total (₹)</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Return Request</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {orders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-4 py-3">{order.id}</td>
                  <td className="px-4 py-3">{order.user_id}</td>
                  <td className="px-4 py-3">₹{Number(order.total).toFixed(2)}</td>
                  <td className="px-4 py-3 capitalize">{order.payment_method}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded font-semibold
                      ${order.payment_status === 'Paid' ? 'bg-green-100 text-green-700' :
                        order.payment_status === 'Failed' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'}`}>
                      {order.payment_status}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded font-semibold
                      ${order.order_status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                        order.order_status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                        order.order_status === 'Delivered' ? 'bg-green-100 text-green-700' :
                        order.order_status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                        order.order_status === 'Returned' ? 'bg-purple-100 text-purple-700' :
                        'bg-gray-100 text-gray-600'}`}>
                      {order.order_status}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    {order.order_status === 'Return Requested' ? (
                      <>
                        <button onClick={() => handleReturnRequest(order.id, 'approve')} className="text-green-600 hover:underline">Approve Return</button>
                        <button onClick={() => handleReturnRequest(order.id, 'reject')} className="text-red-600 hover:underline ml-2">Reject Return</button>
                      </>
                    ) : order.order_status === 'Returned' ? (
                      <button onClick={() => initiateRefund(order.id)} className="text-blue-600 hover:underline">Initiate Refund</button>
                    ) : (
                      '—'
                    )}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <button onClick={() => openOrderDetails(order)} className="text-indigo-600 hover:underline">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full overflow-auto max-h-[90vh]">
            <h2 className="text-xl font-bold mb-4">Order #{selectedOrder.id} Details</h2>
            <p><strong>User ID:</strong> {selectedOrder.user_id}</p>
            <p><strong>Total:</strong> ₹{selectedOrder.total}</p>
            <p><strong>Status:</strong> {selectedOrder.order_status}</p>
            <p><strong>Payment:</strong> {selectedOrder.payment_status}</p>
            <p><strong>Shipping:</strong> {selectedOrder.shipping_street}, {selectedOrder.shipping_city}, {selectedOrder.shipping_state} - {selectedOrder.shipping_pincode} 📞 {selectedOrder.shipping_phone}</p>

            <h3 className="text-lg font-semibold mt-4">Items:</h3>
            <ul className="list-disc list-inside space-y-2">
              {Array.isArray(selectedOrder.items) && selectedOrder.items.map((item, idx) => (
                <li key={idx} className="flex justify-between items-center">
                  <span>{item.name} × {item.quantity}</span>
                  <button
                    onClick={() => fetchProductDetails(item.id)}
                    className="text-sm text-blue-600 underline ml-4"
                  >
                    View Product
                  </button>
                </li>
              ))}
            </ul>

            <button onClick={() => setSelectedOrder(null)} className="mt-6 bg-red-500 text-white py-2 px-4 rounded">
              Close
            </button>

            {/* Product Details Inside Modal */}
            {selectedProduct && (
              <div className="mt-6 border-t pt-4">
                <h3 className="text-lg font-bold mb-2">Product Details</h3>
                <img src={selectedProduct.image.startsWith('http') ? selectedProduct.image : `${API_BASE_URL}${selectedProduct.image}`} alt={selectedProduct.name} className="w-32 h-32 object-cover rounded mb-2" />
                <p><strong>Name:</strong> {selectedProduct.name}</p>
                <p><strong>Price:</strong> ₹{selectedProduct.price}</p>
                <p><strong>Description:</strong> {selectedProduct.description}</p>
               
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AdminOrders;
