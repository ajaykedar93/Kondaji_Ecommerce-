import React, { useState } from 'react';
import axios from 'axios';

const defaultProduct = {
  name: '',
  price: '',
  description: '',
  discount: '',
  offer: '',
  is_sale: false,
  in_stock: true,
  stock_quantity: '',
  category_id: '',
};

function AddBulkProduct({ setActiveTab }) {
  // States for bulk add form
  const [products, setProducts] = useState([{ ...defaultProduct }]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Handle bulk add form product changes
  const handleProductChange = (index, field, value) => {
    const newProducts = [...products];
    if (field === 'is_sale' || field === 'in_stock') {
      newProducts[index][field] = value === 'true';
    } else if (
      ['price', 'discount', 'stock_quantity', 'category_id'].includes(field)
    ) {
      newProducts[index][field] = value === '' ? '' : Number(value);
    } else {
      newProducts[index][field] = value;
    }
    setProducts(newProducts);
  };

  const addRow = () => setProducts([...products, { ...defaultProduct }]);

  const removeRow = (index) => {
    const newProducts = products.filter((_, i) => i !== index);
    setProducts(newProducts);
    const newImages = Array.from(images);
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleImagesChange = (e) => {
    setImages(e.target.files);
  };

  // Validate bulk add form before submission
  const validate = () => {
    if (products.length === 0) {
      setMessage({ type: 'error', text: 'Add at least one product.' });
      return false;
    }
    for (let i = 0; i < products.length; i++) {
      if (!products[i].name || products[i].price === '') {
        setMessage({
          type: 'error',
          text: `Name and Price required for product #${i + 1}.`,
        });
        return false;
      }
    }
    if (images.length !== products.length) {
      setMessage({
        type: 'error',
        text: 'Number of images must exactly match number of products.',
      });
      return false;
    }
    return true;
  };

  // Submit bulk add
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    if (!validate()) return;

    const formData = new FormData();
    formData.append('products', JSON.stringify(products));
    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i]);
    }

    try {
      setLoading(true);
      const res = await axios.post(
        'https://kondaji-express-api.onrender.com/api/products/bulk-add',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      setMessage({
        type: 'success',
        text: `✅ Added ${res.data.products.length} products successfully!`,
      });
      setProducts([{ ...defaultProduct }]);
      setImages([]);
      e.target.reset();
    } catch (error) {
      setMessage({
        type: 'error',
        text:
          error.response?.data?.message ||
          '❌ Failed to add products. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto my-16 p-8 bg-white rounded-lg shadow-lg border border-gray-300">
      <h2 className="text-4xl font-bold mb-8 text-center text-indigo-700">
        📦 Bulk Add Products
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product input table */}
        <div className="overflow-auto max-h-[350px] border border-gray-300 rounded-lg mb-6">
          <table
            className="min-w-full divide-y divide-gray-200"
            style={{ borderCollapse: 'collapse' }}
          >
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                {[
                  'Name *',
                  'Price *',
                  'Description',
                  'Discount %',
                  'Offer',
                  'Is Sale *',
                  'In Stock *',
                  'Stock Qty *',
                  'Category ID',
                  'Remove',
                ].map((header) => (
                  <th
                    key={header}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                    style={{ border: '1px solid black' }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-gray-50 transition"
                  style={{ border: '1px solid black' }}
                >
                  <td className="p-2" style={{ border: '1px solid black' }}>
                    <input
                      type="text"
                      value={product.name}
                      onChange={(e) => handleProductChange(idx, 'name', e.target.value)}
                      required
                      className="w-full border border-gray-300 rounded px-2 py-1"
                    />
                  </td>
                  <td className="p-2" style={{ border: '1px solid black' }}>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={product.price}
                      onChange={(e) => handleProductChange(idx, 'price', e.target.value)}
                      required
                      className="w-full border border-gray-300 rounded px-2 py-1"
                    />
                  </td>
                  <td className="p-2" style={{ border: '1px solid black' }}>
                    <input
                      type="text"
                      value={product.description}
                      onChange={(e) => handleProductChange(idx, 'description', e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1"
                    />
                  </td>
                  <td className="p-2" style={{ border: '1px solid black' }}>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={product.discount}
                      onChange={(e) => handleProductChange(idx, 'discount', e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1"
                    />
                  </td>
                  <td className="p-2" style={{ border: '1px solid black' }}>
                    <input
                      type="text"
                      value={product.offer}
                      onChange={(e) => handleProductChange(idx, 'offer', e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1"
                    />
                  </td>
                  <td className="p-2" style={{ border: '1px solid black' }}>
                    <select
                      value={product.is_sale.toString()}
                      onChange={(e) => handleProductChange(idx, 'is_sale', e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1"
                      required
                    >
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </select>
                  </td>
                  <td className="p-2" style={{ border: '1px solid black' }}>
                    <select
                      value={product.in_stock.toString()}
                      onChange={(e) => handleProductChange(idx, 'in_stock', e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1"
                      required
                    >
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </select>
                  </td>
                  <td className="p-2" style={{ border: '1px solid black' }}>
                    <input
                      type="number"
                      min="0"
                      value={product.stock_quantity}
                      onChange={(e) => handleProductChange(idx, 'stock_quantity', e.target.value)}
                      required
                      className="w-full border border-gray-300 rounded px-2 py-1"
                    />
                  </td>
                  <td className="p-2" style={{ border: '1px solid black' }}>
                    <input
                      type="number"
                      min="0"
                      value={product.category_id}
                      onChange={(e) => handleProductChange(idx, 'category_id', e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1"
                    />
                  </td>
                  <td className="p-2 text-center" style={{ border: '1px solid black' }}>
                    {products.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRow(idx)}
                        className="text-red-600 font-bold hover:text-red-800"
                        title="Remove this product"
                      >
                        &times;
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Images upload */}
        <div>
          <label htmlFor="images" className="block mb-2 font-semibold text-gray-700">
            Upload Product Images (one per product)
          </label>
          <input
            id="images"
            type="file"
            multiple
            accept="image/*"
            onChange={handleImagesChange}
            className="block w-full text-gray-700"
          />
          <p className="mt-1 text-xs text-gray-500 italic">
            Upload exactly one image per product in the same order as the table rows.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={addRow}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            + Add Product Row
          </button>

          <button
            type="submit"
            disabled={loading}
            className={`bg-indigo-600 text-white font-semibold px-12 py-3 rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300 ${
              loading ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Uploading...' : 'Add Products'}
          </button>
        </div>
      </form>

      {/* See Products button */}
      <div className="mt-8 text-center">
        <button
          onClick={() => setActiveTab('manageProducts')}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
        >
          See Products
        </button>
      </div>

      {/* Message box */}
      {message.text && (
        <div
          role="alert"
          className={`mt-6 p-4 rounded max-w-lg mx-auto text-center ${
            message.type === 'success'
              ? 'bg-green-100 border border-green-400 text-green-700'
              : 'bg-red-100 border border-red-400 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}

export default AddBulkProduct;
