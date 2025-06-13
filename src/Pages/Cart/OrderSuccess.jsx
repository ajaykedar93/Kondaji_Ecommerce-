import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OrderSuccess = () => {
  const [orderData, setOrderData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const dataStr = localStorage.getItem('orderSuccess');
    if (!dataStr) {
      // No order data, redirect home
      navigate('/');
      return;
    }
    try {
      const data = JSON.parse(dataStr);
      setOrderData(data);
    } catch {
      navigate('/');
    }
  }, [navigate]);

  if (!orderData) return null;

  const {
    orderId,
    paymentId,
    timestamp,
    amount,
    cart,
    address,
    paymentStatus = 'success',
  } = orderData;

  const isSuccess = paymentStatus.toLowerCase() === 'success';

  const formatDateTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  return (
    <div
      className="max-w-4xl mx-auto py-16 px-8 bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-lg"
      style={{ animation: 'fadeIn 0.7s ease forwards' }}
    >
      <div className="text-center mb-12">
        {isSuccess ? (
          <>
            <div className="text-6xl mb-4 animate-bounce text-green-600">🎉</div>
            <h1 className="text-5xl font-extrabold text-green-700 mb-2">
              Order Placed Successfully!
            </h1>
            <p className="text-lg text-green-800">
              Thank you for shopping with Kondaji Chivda.
            </p>
          </>
        ) : (
          <>
            <div className="text-6xl mb-4 animate-pulse text-red-600">❌</div>
            <h1 className="text-5xl font-extrabold text-red-700 mb-2">Order Rejected</h1>
            <p className="text-lg text-red-800">
              Unfortunately, your payment was not successful. Please try again or contact support.
            </p>
          </>
        )}
      </div>

      <section
        className="bg-white rounded-lg shadow-md p-8 mb-10"
        style={{ animation: 'slideInUp 0.6s ease forwards' }}
      >
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          🧾 Order Details
          {isSuccess ? (
            <span className="text-green-600 font-bold ml-auto px-3 py-1 rounded bg-green-100 text-sm">
              Paid
            </span>
          ) : (
            <span className="text-red-600 font-bold ml-auto px-3 py-1 rounded bg-red-100 text-sm">
              Failed
            </span>
          )}
        </h2>

        <div className="grid grid-cols-2 gap-6 mb-6 text-gray-700">
          <div>
            <p>
              <strong>Order ID:</strong> <span className="font-mono">{orderId}</span>
            </p>
            <p>
              <strong>Payment ID:</strong>{' '}
              <span className="font-mono">{paymentId || 'N/A'}</span>
            </p>
          </div>
          <div>
            <p>
              <strong>Date & Time:</strong> {formatDateTime(timestamp)}
            </p>
            <p>
              <strong>Total Paid:</strong> ₹{amount?.toFixed(2) ?? '0.00'}
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-4">🛍️ Ordered Products</h3>
        <div className="divide-y divide-gray-200 border border-gray-200 rounded-md">
          {cart.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image.startsWith('http') ? item.image : `http://localhost:5000${item.image}`}
                  alt={item.name}
                  className="w-16 h-16 rounded border object-cover"
                />
                <div>
                  <h4 className="font-semibold">{item.name}</h4>
                  <p className="text-sm text-gray-600">
                    Qty: {item.quantity} × ₹{item.price}
                  </p>
                </div>
              </div>
              <p className="font-bold text-gray-900">
                ₹{(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        className="bg-white rounded-lg shadow-md p-8 mb-10"
        style={{ animation: 'slideInUp 0.6s ease 0.2s forwards' }}
      >
        <h2 className="text-2xl font-semibold mb-4">📦 Delivery Address</h2>
        <div className="text-gray-700 space-y-1">
          <p className="font-semibold">{address.name}</p>
          <p>{address.phone}</p>
          <p>{address.street}</p>
          <p>
            {address.city}, {address.state} - {address.pincode}
          </p>
        </div>
      </section>

      <div className="flex justify-center gap-6 mt-10">
        <button
          onClick={() => navigate('/')}
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition shadow-md"
          aria-label="Continue Shopping"
        >
          Continue Shopping
        </button>
        <button
          onClick={() => navigate('/my-orders')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md"
          aria-label="Check My Orders"
        >
          Check My Orders
        </button>
      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes fadeIn {
          from {opacity: 0;}
          to {opacity: 1;}
        }
        @keyframes slideInUp {
          from {opacity: 0; transform: translateY(30px);}
          to {opacity: 1; transform: translateY(0);}
        }
        .animate-bounce {
          animation: bounce 1s infinite;
        }
        .animate-pulse {
          animation: pulse 2s infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15%); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default OrderSuccess;
