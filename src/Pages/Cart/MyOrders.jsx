import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

const API_BASE_ORDERS = 'https://kondaji-express-api.onrender.com/api/orders';
const API_BASE_PRODUCTS = 'https://kondaji-express-api.onrender.com/api/products';
const API_BASE_ADDRESS = 'https://kondaji-express-api.onrender.com/api/userdata/address';
const API_BASE_URL = 'https://kondaji-express-api.onrender.com';

const MyOrders = () => {
  const { user } = useContext(AuthContext);
  const userId = user?.id || user?.userId || null;
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [productsMap, setProductsMap] = useState({});
  const [userAddress, setUserAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOrder, setModalOrder] = useState(null); // For Track Delivery popup

  const parseItems = (itemsStr) => {
    try {
      if (typeof itemsStr === 'string') return JSON.parse(itemsStr);
      return itemsStr;
    } catch {
      return [];
    }
  };

  const getFullImageUrl = (img) => {
    if (!img) return '/default-product.png';
    return img.startsWith('http') ? img : `${API_BASE_URL}/${img}`;
  };

  useEffect(() => {
    const fetchOrdersAndProducts = async () => {
      try {
        // Orders
        const res = await fetch(`${API_BASE_ORDERS}/user/${userId}`);
        const data = await res.json();
        setOrders(data);

        // Collect product IDs
        const allIds = new Set();
        data.forEach((o) => parseItems(o.items).forEach((i) => allIds.add(i.id)));

        // Products
        const prodRes = await fetch(`${API_BASE_PRODUCTS}`);
        const prods = await prodRes.json();

        const map = {};
        prods.forEach((p) => allIds.has(p.id) && (map[p.id] = p));
        setProductsMap(map);
      } catch (err) {
        setError('Failed to fetch orders or products');
      } finally {
        setLoading(false);
      }
    };

    const fetchUserAddress = async () => {
      try {
        const res = await fetch(`${API_BASE_ADDRESS}/${userId}`);
        const data = await res.json();
        setUserAddress(data);
      } catch (err) {
        console.error('Error fetching address:', err);
        setUserAddress(null);
      }
    };

    if (userId) {
      fetchOrdersAndProducts();
      fetchUserAddress();
    }
  }, [userId]);

  if (loading) return <div className="text-center py-20">Loading orders...</div>;
  if (error) return <div className="text-red-600 text-center py-20">{error}</div>;
  if (!orders.length) return <div className="text-center py-20">No orders yet.</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center text-purple-800 mb-8">My Orders</h2>

      {orders.map((order) => {
        const item = parseItems(order.items)[0];
        const product = productsMap[item?.id] || {};

        return (
          <div key={order.id} className="bg-white shadow-md rounded-lg mb-6 p-6 flex flex-col md:flex-row gap-6 justify-between">
            {/* Left side: Product image and details */}
            <div
              className="flex items-start gap-4 cursor-pointer w-full md:w-1/2"
              onClick={() => navigate(`/product-details/${item.id}`)}
            >
              <img
                src={getFullImageUrl(product.image)}
                alt={item.name}
                className="w-28 h-28 object-cover rounded-md border hover:scale-105 transition-transform"
              />
              <div>
                <h3 className="text-xl font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                <p className="text-sm text-gray-700">Price: ₹{item.price}</p>
              </div>
            </div>

            {/* Right side: User order summary and fetched address */}
            <div className="w-full md:w-1/2 text-sm text-gray-700 space-y-1">
              <p><strong>Order ID:</strong> #{order.id}</p>
              <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
              <p><strong>Status:</strong> <span className="text-green-600 font-bold">{order.order_status}</span></p>
              <p><strong>Total:</strong> ₹{order.total}</p>

              <div className="pt-2">
                <p className="font-semibold">Shipping Address:</p>
                {userAddress ? (
                  <>
                    <p><strong>Name:</strong> {userAddress.name}</p>
                    <p><strong>Phone:</strong> {userAddress.phone}</p>
                    <p><strong>Address:</strong> {`${userAddress.street}, ${userAddress.city}, ${userAddress.state} - ${userAddress.pincode}`}</p>
                  </>
                ) : (
                  <p className="text-red-500">No saved address found.</p>
                )}
              </div>

              <button
                onClick={() => setModalOrder(order)}
                className="mt-3 inline-block text-sm text-blue-600 underline hover:text-blue-800"
              >
                Track Delivery
              </button>
            </div>
          </div>
        );
      })}

      {/* Track Delivery Popup */}
      {modalOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full text-center">
            <h3 className="text-xl font-semibold mb-4 text-purple-800">Delivery Status</h3>
            <p><strong>Order ID:</strong> #{modalOrder.id}</p>
            <p><strong>Status:</strong> <span className="text-green-700 font-bold">{modalOrder.order_status}</span></p>
            <p><strong>Placed On:</strong> {new Date(modalOrder.created_at).toLocaleDateString()}</p>
            <p className="mt-2 text-gray-600">Estimated delivery: 3–5 working days after approval.</p>
            <button
              onClick={() => setModalOrder(null)}
              className="mt-4 px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-800 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
