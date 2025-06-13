import React, { useState, useEffect, useContext } from 'react';
import { useCart } from '../../Context/CartContext';
import { FaTrashAlt, FaPlus, FaMinus } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../Context/AuthContext';

const API_BASE_URL = 'https://kondaji-express-api.onrender.com';

const CartNew = () => {
  const { cart, setCart } = useCart();
  const { user } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [coupons, setCoupons] = useState({});
  const [couponApplied, setCouponApplied] = useState({});
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  const fetchCart = async () => {
    if (!user?.id) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/api/userdata/cart/${user.id}`);
      if (res.status === 200 && Array.isArray(res.data)) {
        setCart(res.data);
      } else {
        setError('❌ Failed to fetch cart.');
      }
    } catch (err) {
      console.error('Fetch Cart Error:', err);
      setError('❌ Failed to fetch cart.');
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const formatPrice = (price) => (isNaN(price) ? '0.00' : Number(price).toFixed(2));

  const calculateTotal = () =>
    cart.reduce((total, item) => total + (Number(item.price) || 0) * (item.quantity || 1), 0).toFixed(2);

  const calculateTotalSavings = () =>
    cart.reduce((sum, item) => sum + ((item.originalPrice || item.price) - item.price) * item.quantity, 0).toFixed(2);

  const handleRemoveFromCart = async (productId) => {
    if (!user?.id) return setError('❌ Please log in to remove items.');
    try {
      setCart(prev => prev.filter(item => item.product_id !== productId));
      await axios.post(`${API_BASE_URL}/api/userdata/cart/remove`, { userId: user.id, productId });
    } catch (err) {
      console.error('Remove Item Error:', err);
      setError('❌ Failed to remove item from cart.');
      fetchCart();
    }
  };

  const updateCartQuantity = async (productId, currentQty, increment = true) => {
    if (!user?.id) return;
    let newCart = [...cart];
    const index = newCart.findIndex(item => item.product_id === productId);
    if (index === -1) return;

    if (increment) {
      newCart[index].quantity += 1;
      setCart(newCart);
      try {
        await axios.post(`${API_BASE_URL}/api/userdata/cart/add`, { userId: user.id, productId });
      } catch (err) {
        console.error('Increment Error:', err);
        setError('❌ Could not update quantity.');
        fetchCart();
      }
    } else {
      if (currentQty <= 1) {
        await handleRemoveFromCart(productId);
      } else {
        newCart[index].quantity -= 1;
        setCart(newCart);
        try {
          await axios.post(`${API_BASE_URL}/api/userdata/cart/remove`, { userId: user.id, productId });
          for (let i = 0; i < currentQty - 1; i++) {
            await axios.post(`${API_BASE_URL}/api/userdata/cart/add`, { userId: user.id, productId });
          }
        } catch (err) {
          console.error('Decrement Error:', err);
          setError('❌ Could not update quantity.');
          fetchCart();
        }
      }
    }
  };

  const applyCoupon = async (productId, code, quantity) => {
    if (!code || quantity < 2) {
      setAlert({ type: 'warning', msg: '⚠️ Minimum 2 quantity required to apply coupon' });
      return;
    }
    if (couponApplied[productId]) {
      setAlert({ type: 'warning', msg: '⚠️ Coupon already applied' });
      return;
    }
    try {
      const res = await axios.post(`${API_BASE_URL}/api/coupons/validate`, { code });
      const coupon = res.data?.coupon;
      if (!coupon || !coupon.discount) {
        setAlert({ type: 'error', msg: '❌ Invalid coupon' });
        return;
      }

      const updatedCart = cart.map(item => {
        if (item.product_id === productId) {
          return {
            ...item,
            originalPrice: item.price,
            price: Number((item.price - (item.price * coupon.discount) / 100).toFixed(2))
          };
        }
        return item;
      });
      setCart(updatedCart);
      setCouponApplied(prev => ({ ...prev, [productId]: code }));
      setAlert({ type: 'success', msg: `✅ Coupon "${code}" applied!` });
    } catch (err) {
      setAlert({ type: 'error', msg: err.response?.data?.error || '❌ Coupon error' });
    } finally {
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const handleProceedToCheckout = () => navigate('/checkout', { state: { cart } });

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-10 flex items-center justify-center gap-2">
        🛒 <span>Your Shopping Cart</span>
      </h1>

      {alert && (
        <div className={`fixed top-20 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg text-center font-medium z-50 shadow-lg ${
          alert.type === 'success' ? 'bg-green-100 text-green-800' : alert.type === 'warning' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
        }`}>
          {alert.msg}
        </div>
      )}

      {cart.length === 0 ? (
        <div className="text-center text-gray-600">
          <p className="text-xl mb-4">Your cart is currently empty.</p>
          <Link to="/products" className="text-blue-600 underline hover:text-blue-800">
            Go to Products →
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {cart.map((item) => (
              <div key={item.product_id} className="flex flex-col md:flex-row items-center justify-between p-5 bg-white border rounded-xl shadow-sm gap-6">
                <div className="flex items-center gap-5 w-full md:w-auto">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-contain rounded-lg border bg-white hover:scale-105 transition cursor-pointer"
                  />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 capitalize">{item.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-green-600 font-semibold text-base">₹{formatPrice(item.price)}</span>
                      <span className="text-gray-500">× {item.quantity}</span>
                    </div>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <p className="text-sm text-green-500 mt-1">You saved ₹{formatPrice(item.originalPrice - item.price)} per item</p>
                    )}
                    {!couponApplied[item.product_id] && (
                      <div className="mt-2 flex gap-2">
                        <input
                          type="text"
                          placeholder="Enter coupon"
                          onChange={(e) => setCoupons(prev => ({ ...prev, [item.product_id]: e.target.value }))}
                          className="border rounded px-3 py-1"
                        />
                        <button
                          onClick={() => applyCoupon(item.product_id, coupons[item.product_id], item.quantity)}
                          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                        >
                          Apply
                        </button>
                      </div>
                    )}
                    {couponApplied[item.product_id] && (
                      <p className="text-sm text-indigo-500 mt-1">Coupon: {couponApplied[item.product_id]}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateCartQuantity(item.product_id, item.quantity, false)} disabled={item.quantity <= 0} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 shadow text-gray-700">
                      <FaMinus size={12} />
                    </button>
                    <span className="text-lg font-medium">{item.quantity}</span>
                    <button onClick={() => updateCartQuantity(item.product_id, item.quantity, true)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 shadow text-gray-700">
                      <FaPlus size={12} />
                    </button>
                  </div>

                  <div className="text-lg font-semibold text-right text-gray-800">
                    ₹{formatPrice(item.price * item.quantity)}
                  </div>

                  <button onClick={() => handleRemoveFromCart(item.product_id)} className="text-red-500 hover:text-red-700 flex items-center gap-1">
                    <FaTrashAlt size={14} /> <span className="text-sm">Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-end">
            <div className="bg-white border rounded-xl p-6 w-full md:w-1/2 shadow-2xl text-right">
              <h2 className="text-2xl font-bold mb-2 text-gray-800">Total: ₹{calculateTotal()}</h2>
              {cart.some(item => item.originalPrice > item.price) && (
                <p className="text-green-600 font-medium mb-4">
                  🎉 You saved ₹{calculateTotalSavings()} on this order
                </p>
              )}
              <button onClick={handleProceedToCheckout} className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-lg font-medium shadow-lg">
                Proceed to Checkout →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartNew;
