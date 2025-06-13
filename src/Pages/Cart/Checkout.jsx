import React, { useState, useEffect, useContext } from 'react';
import { useCart } from '../../Context/CartContext';
import { AuthContext } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'https://kondaji-express-api.onrender.com';

const Checkout = () => {
  const { cart, address, updateAddress, clearCart } = useCart();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formAddress, setFormAddress] = useState(address);
  const [useSaved, setUseSaved] = useState(true);
  const [errors, setErrors] = useState({});
  const [addressConfirmed, setAddressConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    if (useSaved) {
      setFormAddress(address);
      if (
        address?.name?.trim() &&
        address?.phone?.trim() &&
        address?.street?.trim() &&
        address?.city?.trim() &&
        address?.state?.trim() &&
        address?.pincode?.trim()
      ) {
        setAddressConfirmed(true);
      } else {
        setAddressConfirmed(false);
      }
    } else {
      setAddressConfirmed(false);
    }
  }, [useSaved, address]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormAddress((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setAddressConfirmed(false);
  };

  const validateAddress = () => {
    const newErrors = {};
    if (!formAddress.name?.trim()) newErrors.name = 'Full name is required';
    if (!formAddress.phone?.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\+?\d{7,15}$/.test(formAddress.phone.trim())) newErrors.phone = 'Invalid phone number';
    if (!formAddress.street?.trim()) newErrors.street = 'Street address is required';
    if (!formAddress.city?.trim()) newErrors.city = 'City is required';
    if (!formAddress.state?.trim()) newErrors.state = 'State is required';
    if (!formAddress.pincode?.trim()) newErrors.pincode = 'Pincode is required';
    else if (!/^\d{4,10}$/.test(formAddress.pincode.trim())) newErrors.pincode = 'Invalid pincode';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveAddress = async () => {
    if (!validateAddress()) return;

    try {
      const res = await axios.post(`${API_BASE_URL}/api/userdata/address/save`, {
        userId: user.id,
        name: formAddress.name,
        phone: formAddress.phone,
        street: formAddress.street,
        city: formAddress.city,
        state: formAddress.state,
        pincode: formAddress.pincode,
      });

      if (res.status === 200) {
        updateAddress(formAddress);
        setUseSaved(true);
        setAddressConfirmed(true);
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
      }
    } catch (err) {
      console.error('Error saving address:', err);
      alert('❌ Failed to save address');
    }
  };

  const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const handlePayment = async () => {
    if (!user?.id) return alert('❌ Please login to continue.');
    if (cart.length === 0) return alert('🛒 Your cart is empty.');
    if (!addressConfirmed) return alert('📦 Please confirm your delivery address.');

    setLoading(true);
    const addressString = `${formAddress.street}, ${formAddress.city}, ${formAddress.state} - ${formAddress.pincode}`;

    const options = {
      key: 'rzp_test_PhScEkB6NOqwDJ',
      amount: totalAmount * 100,
      currency: 'INR',
      name: 'Kondaji Chivada Nashik',
      description: 'Order Payment',
      handler: async function (response) {
        try {
          const orderData = {
            userId: user.id,
            items: cart.map(({ product_id, name, quantity, price }) => ({
              id: product_id,
              name,
              quantity,
              price,
            })),
            address: formAddress,
            payment_method: 'Razorpay',
            payment_status: 'Paid',
            total: totalAmount,
            discount_code: null,
            discount_amount: 0,
            delivery_charge: 0,
            customer_notes: '',
          };

          const res = await fetch(`${API_BASE_URL}/api/orders/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData),
          });

          if (!res.ok) {
            const errorText = await res.text();
            alert('❌ Order failed:\n' + errorText);
            setLoading(false);
            return;
          }

          const data = await res.json();

          alert('✅ Order placed successfully!');

          localStorage.setItem(
            'orderSuccess',
            JSON.stringify({
              orderId: data.orderId || data.id || 'Unknown',
              paymentId: response.razorpay_payment_id,
              timestamp: new Date().toISOString(),
              amount: totalAmount,
              cart,
              address: formAddress,
              paymentStatus: 'success',
            })
          );

          clearCart();
          navigate('/order-success');
        } catch (error) {
          console.error('Order creation error:', error);
          alert('❌ Order creation error: ' + error.message);
        } finally {
          setLoading(false);
        }
      },
      prefill: {
        name: formAddress.name,
        email: user?.email || 'test@example.com',
        contact: formAddress.phone,
      },
      notes: { address: addressString },
      theme: { color: '#2f7d32' },
      modal: { ondismiss: () => setLoading(false) },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <h2 className="text-3xl font-bold mb-8 text-center text-green-700">Checkout</h2>

      {/* Cart Summary */}
      <section className="bg-white rounded-lg shadow p-6 mb-10">
        <h3 className="text-xl font-semibold mb-4">Your Products</h3>
        {cart.length === 0 ? (
          <p className="text-center text-gray-500">Your cart is empty</p>
        ) : (
          cart.map((item) => (
            <div key={item.product_id} className="flex items-center justify-between border-b py-4">
              <div className="flex gap-4 items-center">
                <img
                  src={item.image?.startsWith('http') ? item.image : `${API_BASE_URL}${item.image}`}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded border"
                />
                <div>
                  <h4 className="font-semibold text-gray-800">{item.name}</h4>
                  <p className="text-gray-500 text-sm">₹{item.price} × {item.quantity}</p>
                </div>
              </div>
              <div className="text-lg font-medium text-gray-800">
                ₹{(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))
        )}
        <div className="text-right font-bold text-xl mt-4 text-green-700">
          Total: ₹{totalAmount.toFixed(2)}
        </div>
      </section>

      {/* Address Form */}
      <section className="bg-white rounded-lg shadow p-6 mb-10">
        <h3 className="text-xl font-semibold mb-4">Delivery Address</h3>

        {showSuccessMessage && (
          <div className="bg-green-100 p-4 text-center mb-4 text-green-700">
            <strong>✅ Address saved successfully!</strong>
          </div>
        )}

        {address && (
          <div className="mb-4 flex gap-6 items-center">
            <label className="flex gap-2 items-center cursor-pointer">
              <input
                type="radio"
                checked={useSaved}
                onChange={() => {
                  setUseSaved(true);
                  if (
                    address.name?.trim() &&
                    address.phone?.trim() &&
                    address.street?.trim() &&
                    address.city?.trim() &&
                    address.state?.trim() &&
                    address.pincode?.trim()
                  ) {
                    setFormAddress(address);
                    setAddressConfirmed(true);
                  }
                }}
              />
              <span>Use Saved Address</span>
            </label>
            <label className="flex gap-2 items-center cursor-pointer">
              <input
                type="radio"
                checked={!useSaved}
                onChange={() => {
                  setUseSaved(false);
                  setAddressConfirmed(false);
                }}
              />
              <span>Enter New Address</span>
            </label>
          </div>
        )}

        {!useSaved && (
          <>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              {['name', 'phone', 'street', 'city', 'state', 'pincode'].map((field) => (
                <div key={field}>
                  <input
                    name={field}
                    value={formAddress[field] || ''}
                    onChange={handleChange}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    className={`w-full border rounded px-3 py-2 ${
                      errors[field] ? 'border-red-600' : 'border-gray-300'
                    }`}
                  />
                  {errors[field] && <p className="text-red-600 text-sm mt-1">{errors[field]}</p>}
                </div>
              ))}
            </div>
            <button
              onClick={saveAddress}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Save Address
            </button>
          </>
        )}

        {useSaved && address && (
          <div className="bg-gray-50 mt-4 p-4 border rounded">
            <p><strong>{address.name}</strong></p>
            <p>{address.street}, {address.city}</p>
            <p>{address.state} - {address.pincode}</p>
            <p>📞 {address.phone}</p>
          </div>
        )}
      </section>

      {addressConfirmed && (
        <div className="text-center">
          <button
            disabled={cart.length === 0 || loading}
            onClick={handlePayment}
            className={`bg-green-600 text-white px-8 py-3 rounded text-lg font-semibold hover:bg-green-700 transition ${
              cart.length === 0 || loading ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Processing Payment...' : `Pay ₹${totalAmount.toFixed(2)} and Place Order →`}
          </button>
        </div>
      )}
    </div>
  );
};

export default Checkout;
