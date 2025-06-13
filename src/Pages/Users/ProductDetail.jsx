import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CartContext } from '../../Context/CartContext';
import { FaStar } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://kondaji-express-api.onrender.com/api/products/${id}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchProduct();
  }, [id]);

  if (error) return <div className="text-center text-red-600 py-10">{error}</div>;
  if (!product) return <div className="text-center py-10">Loading...</div>;

  // 🧮 Convert price safely
  const originalPrice = parseFloat(product.price) || 0;
  const discount = parseFloat(product.discount) || 0;
  const discountedPrice = parseFloat(
    (originalPrice - (originalPrice * discount) / 100).toFixed(2)
  );

  const handleAddToCart = () => {
    addToCart(product);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  return (
    <motion.div
      className="container py-10 px-5 relative"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* ✅ Cart Alert Message */}
      <AnimatePresence>
        {showAlert && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.4 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-800 p-4 rounded-xl shadow-md flex justify-between items-center w-80 z-50"
          >
            <span>✅ Product added to cart!</span>
            <button
              onClick={() => navigate('/cart-new')}
              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            >
              View Cart
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row gap-10 items-start">
        <img
          src={product.image}
          alt={product.name}
          className="w-full md:w-96 max-h-[400px] object-contain bg-white rounded shadow"
        />
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-4 capitalize">{product.name}</h1>

          <div className="flex items-center gap-1 text-yellow-500 mb-2">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className="text-lg" />
            ))}
          </div>

          <p className="text-gray-700 mb-4 text-lg">{product.description}</p>

          <div className="mb-3">
            {discount > 0 ? (
              <h2 className="text-2xl text-orange-600 font-semibold">
                ₹{discountedPrice}
                <span className="text-sm text-gray-500 line-through ml-3">
                  ₹{originalPrice.toFixed(2)}
                </span>
                <span className="text-green-600 text-sm ml-2">({discount}% OFF)</span>
              </h2>
            ) : (
              <h2 className="text-2xl text-black font-semibold">₹{originalPrice.toFixed(2)}</h2>
            )}
          </div>

          {product.offer && (
            <div className="text-sm text-pink-600 font-medium mb-3">
              🎁 {product.offer}
            </div>
          )}

          <div className="mb-4 font-semibold">
            {product.in_stock ? (
              <span className="text-green-600">✔ In Stock ({product.stock_quantity} left)</span>
            ) : (
              <span className="text-red-600">✖ Out of Stock</span>
            )}
          </div>

          <div className="flex gap-4">
            <button
              className={`${
                product.in_stock ? 'bg-primary hover:bg-red-600' : 'bg-gray-400 cursor-not-allowed'
              } text-white px-4 py-2 rounded`}
              disabled={!product.in_stock}
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
            <button
              className={`${
                product.in_stock ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
              } text-white px-4 py-2 rounded`}
              disabled={!product.in_stock}
              onClick={() => {
                addToCart(product);
                navigate('/checkout');
              }}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetail;
