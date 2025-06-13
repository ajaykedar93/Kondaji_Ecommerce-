import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://kondaji-express-api.onrender.com/api/products');
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      setError('❌ Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-center">Our Products</h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-600">No products available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-52 object-cover" />
              <div className="p-4 space-y-2">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-700 truncate">{product.description}</p>
                <p className="text-gray-800 font-bold">₹{product.price}</p>
                {product.discount > 0 && (
                  <p className="text-green-600 text-sm">Discount: {product.discount}%</p>
                )}
                {product.offer && (
                  <p className="text-yellow-600 text-sm">Offer: {product.offer}</p>
                )}
                <p className={`text-sm font-medium ${product.in_stock ? 'text-green-700' : 'text-red-600'}`}>
                  {product.in_stock ? 'Available' : 'Out of Stock'}
                </p>
                <button className="mt-2 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductPage;
