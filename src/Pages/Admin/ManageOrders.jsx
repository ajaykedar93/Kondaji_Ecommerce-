import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const STATUS_COLORS = {
  Pending: 'bg-yellow-500',
  Confirmed: 'bg-blue-600',
  Shipped: 'bg-purple-600',
  Delivered: 'bg-green-600',
  Cancelled: 'bg-red-600',
  Rejected: 'bg-gray-600',
};

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState('');
  const [expandedProductId, setExpandedProductId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('https://kondaji-express-api.onrender.com/api/orders');
      if (!res.ok) throw new Error('Failed to fetch orders');
      const ordersData = await res.json();

      // Fetch product details for each item in orders
      const ordersWithProducts = await Promise.all(
        ordersData.map(async (order) => {
          const detailedItems = await Promise.all(
            order.items.map(async (item) => {
              try {
                const productRes = await fetch(
                  `https://kondaji-express-api.onrender.com/api/products/${item.product_id}`
                );
                if (!productRes.ok) throw new Error('Product fetch failed');
                const productData = await productRes.json();

                return {
                  ...item,
                  product_name: productData.name,
                  product_image: productData.image,
                  product_description: productData.description,
                  discount: productData.discount,
                  offer: productData.offer,
                };
              } catch {
                return {
                  ...item,
                  product_name: 'Unknown Product',
                  product_image: '',
                  product_description: '',
                  discount: 0,
                  offer: '',
                };
              }
            })
          );

          return { ...order, items: detailedItems };
        })
      );

      setOrders(ordersWithProducts);
    } catch (err) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setActionLoading(orderId);
    setError('');
    try {
      const res = await fetch('https://kondaji-express-api.onrender.com/api/orders/update-status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, order_status: newStatus } : order
        )
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <p className="text-center py-10 text-gray-600 font-semibold">Loading orders...</p>;

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-4xl font-extrabold text-red-600 mb-8 text-center">Manage All Orders</h1>

      {error && (
        <div className="mb-6 bg-red-100 text-red-700 border border-red-400 rounded p-4 text-center">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No orders found.</p>
      ) : (
        <div className="space-y-12">
          {orders.map((order) => {
            const canConfirm = order.order_status === 'Pending' && order.payment_status === 'Paid';
            const canCancel =
              !['Cancelled', 'Delivered', 'Rejected'].includes(order.order_status);

            return (
              <div key={order.id} className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                {/* Order & User Info */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-start md:gap-8 mb-6">
                  <div>
                    <p><strong>Order ID:</strong> {order.id}</p>
                    <p><strong>User ID:</strong> {order.user_id}</p>
                    <p><strong>Payment Status: </strong>
                      <span
                        className={`inline-block px-3 py-1 rounded-full font-semibold text-white ${
                          order.payment_status === 'Paid' ? 'bg-green-600' :
                          order.payment_status === 'Failed' ? 'bg-red-600' : 'bg-yellow-500'
                        }`}
                      >
                        {order.payment_status}
                      </span>
                    </p>
                    <p><strong>Order Status: </strong>
                      <span
                        className={`inline-block px-3 py-1 rounded-full font-semibold text-white ${
                          STATUS_COLORS[order.order_status] || 'bg-gray-500'
                        }`}
                      >
                        {order.order_status}
                      </span>
                    </p>
                  </div>

                  <div className="mt-4 md:mt-0">
                    <h3 className="font-semibold mb-2 text-lg text-gray-700">Shipping Address</h3>
                    <p>{order.address}</p>
                  </div>
                </div>

                {/* Admin Action Buttons */}
                <div className="flex flex-wrap gap-3 mb-6">
                  {canConfirm && (
                    <button
                      disabled={actionLoading === order.id}
                      onClick={() => updateOrderStatus(order.id, 'Confirmed')}
                      className={`px-6 py-2 rounded-lg font-semibold text-white transition-colors duration-300 ${
                        actionLoading === order.id
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {actionLoading === order.id ? 'Confirming...' : 'Confirm'}
                    </button>
                  )}

                  {canCancel && (
                    <>
                      <button
                        disabled={actionLoading === order.id}
                        onClick={() => updateOrderStatus(order.id, 'Cancelled')}
                        className={`px-6 py-2 rounded-lg font-semibold text-white transition-colors duration-300 ${
                          actionLoading === order.id
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-red-600 hover:bg-red-700'
                        }`}
                      >
                        {actionLoading === order.id ? 'Cancelling...' : 'Cancel'}
                      </button>
                      <button
                        disabled={actionLoading === order.id}
                        onClick={() => updateOrderStatus(order.id, 'Rejected')}
                        className={`px-6 py-2 rounded-lg font-semibold text-white transition-colors duration-300 ${
                          actionLoading === order.id
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-gray-600 hover:bg-gray-700'
                        }`}
                      >
                        {actionLoading === order.id ? 'Rejecting...' : 'Reject'}
                      </button>
                    </>
                  )}
                </div>

                {/* Products Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-4 py-3 border border-gray-300">Product</th>
                        <th className="px-4 py-3 border border-gray-300">Quantity</th>
                        <th className="px-4 py-3 border border-gray-300">Price</th>
                        <th className="px-4 py-3 border border-gray-300">Total</th>
                        <th className="px-4 py-3 border border-gray-300">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items && order.items.length > 0 ? (
                        order.items.map((item) => {
                          const price = parseFloat(item.price);
                          const displayPrice = isNaN(price) ? 0 : price;

                          return (
                            <ProductRow
                              key={item.id || item.product_id}
                              item={{ ...item, price: displayPrice }}
                              paymentMethod={order.payment_method}
                              expandedProductId={expandedProductId}
                              setExpandedProductId={setExpandedProductId}
                            />
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center py-4 text-gray-500">
                            No items found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const ProductRow = ({
  item,
  paymentMethod,
  expandedProductId,
  setExpandedProductId,
}) => {
  const isExpanded = expandedProductId === (item.id || item.product_id);

  return (
    <>
      <tr
        className="cursor-pointer hover:bg-gray-50 transition"
        onClick={() =>
          setExpandedProductId(isExpanded ? null : item.id || item.product_id)
        }
      >
        <td className="px-4 py-3 border border-gray-300 flex items-center gap-3">
          <img
            src={
              item.product_image?.startsWith('http')
                ? item.product_image
                : `https://kondaji-express-api.onrender.com${item.product_image}`
            }
            alt={item.product_name}
            className="w-12 h-12 object-cover rounded"
          />
          <span>{item.product_name}</span>
        </td>
        <td className="px-4 py-3 border border-gray-300 text-center">{item.quantity}</td>
        <td className="px-4 py-3 border border-gray-300 text-right">₹{item.price.toFixed(2)}</td>
        <td className="px-4 py-3 border border-gray-300 text-right">
          ₹{(item.price * item.quantity).toFixed(2)}
        </td>
        <td className="px-4 py-3 border border-gray-300 text-center text-blue-600 font-semibold">
          {isExpanded ? 'Hide' : 'View'}
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan="5" className="p-0 border-0 bg-gray-50">
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden px-6 py-4 text-gray-700"
            >
              <p><strong>Description:</strong> {item.product_description || 'No description'}</p>
              <p><strong>Price:</strong> ₹{item.price.toFixed(2)}</p>
              <p><strong>Discount:</strong> {item.discount || 'N/A'}</p>
              <p><strong>Offer:</strong> {item.offer || 'N/A'}</p>
              <p><strong>Payment Method:</strong> {paymentMethod}</p>
            </motion.div>
          </td>
        </tr>
      )}
    </>
  );
};

export default ManageOrders;
