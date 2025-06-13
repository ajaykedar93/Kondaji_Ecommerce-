import React, { useState } from 'react';
import axios from 'axios';
import {
  FaUpload,
  FaBoxOpen,
  FaDollarSign,
  FaImage,
  FaInfoCircle,
  FaCheckCircle,
  FaTimesCircle,
  FaTag,
  FaWarehouse
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const ProductUpload = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const [discount, setDiscount] = useState('');
  const [stock, setStock] = useState('available');
  const [stockQuantity, setStockQuantity] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (parseFloat(price) <= 0) {
      setMessage('❌ Price must be a positive number');
      setLoading(false);
      return;
    }
    if (parseFloat(discount) < 0 || parseFloat(discount) > 100) {
      setMessage('❌ Discount should be between 0 and 100');
      setLoading(false);
      return;
    }
    if (parseInt(stockQuantity) < 0 || isNaN(parseInt(stockQuantity))) {
      setMessage('❌ Stock quantity must be a valid number');
      setLoading(false);
      return;
    }

    try {
      const imageData = new FormData();
      imageData.append('image', image);

      const uploadRes = await axios.post('https://kondaji-express-api.onrender.com/api/images/upload', imageData);
      const imageUrl = uploadRes.data.url;

      const product = {
        name,
        price,
        image: imageUrl,
        description,
        discount,
        in_stock: stock === 'available',
        stock_quantity: parseInt(stockQuantity)
      };

      await axios.post('https://kondaji-express-api.onrender.com/api/products', product);
      setMessage('✅ Product uploaded successfully!');
      setName('');
      setPrice('');
      setImage(null);
      setDescription('');
      setDiscount('');
      setStock('available');
      setStockQuantity('');
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to upload product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="max-w-2xl mx-auto bg-white p-8 mt-10 rounded-2xl shadow-xl border border-gray-100"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-3xl font-bold text-red-500 mb-6 flex items-center gap-3">
        <FaUpload /> Upload New Product
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center gap-3">
          <FaBoxOpen className="text-gray-500 text-xl" />
          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-red-300"
          />
        </div>

        <div className="flex items-center gap-3">
          <FaDollarSign className="text-gray-500 text-xl" />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-red-300"
          />
        </div>

        <div className="flex items-center gap-3">
          <FaImage className="text-gray-500 text-xl" />
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            required
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div className="flex items-start gap-3">
          <FaInfoCircle className="text-gray-500 text-xl mt-1" />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-red-300"
          />
        </div>

        <div className="flex items-center gap-3">
          <FaTag className="text-gray-500 text-xl" />
          <input
            type="number"
            placeholder="Discount (%)"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-red-300"
          />
        </div>

        <div className="flex items-center gap-3">
          <FaWarehouse className="text-gray-500 text-xl" />
          <input
            type="number"
            placeholder="Stock Quantity"
            value={stockQuantity}
            onChange={(e) => setStockQuantity(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-red-300"
          />
        </div>

        <div>
          <select
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-red-300"
          >
            <option value="available">Available</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={loading}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md flex justify-center items-center gap-2 transition-all"
        >
          <FaUpload />
          {loading ? 'Uploading...' : 'Upload Product'}
        </motion.button>

        {message && (
          <div className="text-center text-sm mt-3 flex justify-center items-center gap-2">
            {message.includes('✅') ? (
              <FaCheckCircle className="text-green-500" />
            ) : (
              <FaTimesCircle className="text-red-500" />
            )}
            <span className="text-gray-700">{message}</span>
          </div>
        )}
      </form>
    </motion.div>
  );
};

export default ProductUpload;
