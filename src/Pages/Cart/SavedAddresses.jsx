import React, { useState, useEffect, useContext } from 'react';
import { useCart } from '../../Context/CartContext';
import { AuthContext } from '../../Context/AuthContext';
import axios from 'axios';

const API_BASE_URL = 'https://kondaji-express-api.onrender.com';

const SavedAddresses = () => {
  const { address, updateAddress, clearAddress } = useCart();
  const { user } = useContext(AuthContext);

  const [formAddress, setFormAddress] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // ✅ Fetch address on mount
  useEffect(() => {
    if (user?.id) {
      fetchAddress(user.id);
    }
  }, [user]);

  // ✅ Get address from DB
  const fetchAddress = async (userId) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/userdata/address/${userId}`);
      if (res.status === 200 && res.data) {
        setFormAddress(res.data);
        updateAddress(res.data); // optional: update context too
      }
    } catch (err) {
      console.error('Error fetching address:', err);
      alert('❌ Failed to fetch address');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormAddress((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateAddress = () => {
    const newErrors = {};
    if (!formAddress.name.trim()) newErrors.name = 'Full name is required';
    if (!formAddress.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^[0-9]{10,15}$/.test(formAddress.phone)) newErrors.phone = 'Invalid phone number';
    if (!formAddress.street.trim()) newErrors.street = 'Street is required';
    if (!formAddress.city.trim()) newErrors.city = 'City is required';
    if (!formAddress.state.trim()) newErrors.state = 'State is required';
    if (!formAddress.pincode.trim()) newErrors.pincode = 'Pincode is required';
    else if (!/^[0-9]{4,10}$/.test(formAddress.pincode)) newErrors.pincode = 'Invalid pincode';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveAddress = async () => {
    if (!validateAddress()) return;

    try {
      const res = await axios.post(`${API_BASE_URL}/api/userdata/address/save`, {
        userId: user.id,
        ...formAddress
      });

      if (res.status === 200) {
        updateAddress(formAddress);
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Error saving address:', err);
      alert('❌ Failed to save address');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        const res = await axios.post(`${API_BASE_URL}/api/userdata/address/delete`, {
          userId: user.id
        });

        if (res.status === 200) {
          clearAddress();
          setFormAddress({ name: '', phone: '', street: '', city: '', state: '', pincode: '' });
          alert('❌ Address deleted.');
        }
      } catch (err) {
        console.error('Error deleting address:', err);
        alert('❌ Failed to delete address');
      }
    }
  };

  const isEmptyAddress = Object.values(formAddress).every(val => val === '');

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <h2 className="text-3xl font-bold text-center text-green-700 mb-6">Saved Address</h2>

      {showSuccessMessage && (
        <div className="bg-green-100 p-4 text-center mb-4 text-green-700">
          <strong>✅ Address saved successfully!</strong>
        </div>
      )}

      {isEmptyAddress && !isEditing ? (
        <div className="text-center text-gray-600">
          <p>No saved address found.</p>
          <button
            onClick={() => setIsEditing(true)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Address
          </button>
        </div>
      ) : (
        <div className="bg-white p-6 shadow-md rounded-lg space-y-4">
          {isEditing ? (
            <>
              {['name', 'phone', 'street', 'city', 'state', 'pincode'].map((field) => (
                <div key={field}>
                  <input
                    name={field}
                    value={formAddress[field]}
                    onChange={handleChange}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    className={`input w-full border rounded px-3 py-2 ${
                      errors[field] ? 'border-red-600' : 'border-gray-300'
                    }`}
                  />
                  {errors[field] && <p className="text-red-600 text-sm mt-1">{errors[field]}</p>}
                </div>
              ))}
              <div className="flex gap-4 mt-4">
                <button
                  onClick={saveAddress}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setFormAddress(address);
                    setIsEditing(false);
                    setErrors({});
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <p><strong>Name:</strong> {formAddress.name}</p>
              <p><strong>Phone:</strong> {formAddress.phone}</p>
              <p><strong>Street:</strong> {formAddress.street}</p>
              <p><strong>City:</strong> {formAddress.city}</p>
              <p><strong>State:</strong> {formAddress.state}</p>
              <p><strong>Pincode:</strong> {formAddress.pincode}</p>
              <p className="text-sm text-gray-500 mt-2">
                🔒 This address is saved. You can <strong>Edit</strong> or <strong>Delete</strong> it at any time.
              </p>
              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SavedAddresses;
