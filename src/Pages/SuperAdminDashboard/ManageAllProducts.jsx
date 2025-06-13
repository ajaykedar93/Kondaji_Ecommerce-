import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiEdit, FiTrash2, FiSave, FiX } from 'react-icons/fi';

function ManageAllProducts({ setActiveTab }) {
  const [productList, setProductList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });
  const [expandedDescIds, setExpandedDescIds] = useState(new Set());

  // Fetch all products from backend
  const fetchAllProducts = async () => {
    try {
      const res = await axios.get('https://kondaji-express-api.onrender.com/api/products');
      setProductList(res.data.slice().reverse()); // newest first
    } catch (error) {
      showMessage('error', '❌ Failed to fetch products.');
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const startEdit = (product) => {
    setEditingId(product.id);
    setEditData({
      name: product.name,
      price: product.price,
      description: product.description || '',
      discount: product.discount || 0,
      offer: product.offer || '',
      is_sale: product.is_sale,
      in_stock: product.in_stock,
      stock_quantity: product.stock_quantity,
      category_id: product.category_id || '',
      image: product.image,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleEditChange = (field, value) => {
    if (field === 'is_sale' || field === 'in_stock') {
      setEditData({ ...editData, [field]: value === 'true' });
    } else if (
      ['price', 'discount', 'stock_quantity', 'category_id'].includes(field)
    ) {
      setEditData({ ...editData, [field]: value === '' ? '' : Number(value) });
    } else {
      setEditData({ ...editData, [field]: value });
    }
  };

  const saveEdit = async () => {
    try {
      await axios.put(`https://kondaji-express-api.onrender.com/api/products/${editingId}`, editData);
      showMessage('success', '✅ Product updated successfully!');
      cancelEdit();
      setProductList((prevList) =>
        prevList.map((p) => (p.id === editingId ? { ...p, ...editData } : p))
      );
    } catch (error) {
      showMessage('error', '❌ Failed to update product.');
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`https://kondaji-express-api.onrender.com/api/products/${id}`);
      showMessage('success', '🗑️ Product deleted successfully!');
      if (id === editingId) cancelEdit();
      setProductList((prevList) => prevList.filter((p) => p.id !== id));
    } catch {
      showMessage('error', '❌ Failed to delete product.');
    }
  };

  const toggleDescription = (id) => {
    setExpandedDescIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  // Helper to truncate long text for description preview
  const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <div className="max-w-7xl mx-auto my-16 p-8 bg-white rounded-lg shadow-lg border border-gray-300">
      <h2 className="text-4xl font-bold mb-8 text-center text-indigo-700">
        🛠 Manage All Products
      </h2>

      <button
        onClick={() => setActiveTab('addProductBulk')}
        className="mb-6 bg-gray-700 text-white px-6 py-3 rounded hover:bg-gray-800 transition"
      >
        ← Back to Add Products
      </button>

      {productList.length === 0 ? (
        <p className="text-center text-gray-500">No products found.</p>
      ) : (
        <div
          className="overflow-y-auto border border-black rounded-lg mx-auto"
          style={{ maxHeight: '600px', maxWidth: '100%' }}
        >
          <table
            className="min-w-full divide-y divide-gray-200"
            style={{ borderCollapse: 'collapse', border: '1px solid black' }}
          >
            <thead
              className="bg-gray-50 sticky top-0"
              style={{ borderBottom: '1px solid black' }}
            >
              <tr>
                {[
                  'Image',
                  'Name',
                  'Price',
                  'Description',
                  'Discount',
                  'Offer',
                  'Is Sale',
                  'In Stock',
                  'Stock Qty',
                  'Category ID',
                  'Actions',
                ].map((header) => (
                  <th
                    key={header}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                    style={{ borderRight: header !== 'Actions' ? '1px solid black' : 'none' }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {productList.map((prod) => (
                <tr
                  key={prod.id}
                  className="hover:bg-gray-50 transition"
                  style={{ borderBottom: '1px solid black' }}
                >
                  <td className="p-2" style={{ borderRight: '1px solid black' }}>
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>

                  {editingId === prod.id ? (
                    <>
                      <td className="p-2" style={{ borderRight: '1px solid black' }}>
                        <input
                          type="text"
                          value={editData.name}
                          onChange={(e) => handleEditChange('name', e.target.value)}
                          className="w-full border border-gray-300 rounded px-2 py-1"
                        />
                      </td>
                      <td className="p-2" style={{ borderRight: '1px solid black' }}>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={editData.price}
                          onChange={(e) => handleEditChange('price', e.target.value)}
                          className="w-full border border-gray-300 rounded px-2 py-1"
                        />
                      </td>
                      <td className="p-2" style={{ borderRight: '1px solid black', maxWidth: '200px' }}>
                        <textarea
                          value={editData.description}
                          onChange={(e) => handleEditChange('description', e.target.value)}
                          className="w-full border border-gray-300 rounded px-2 py-1 resize-none"
                          rows={3}
                        />
                      </td>
                      <td className="p-2" style={{ borderRight: '1px solid black' }}>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          max="100"
                          value={editData.discount}
                          onChange={(e) => handleEditChange('discount', e.target.value)}
                          className="w-full border border-gray-300 rounded px-2 py-1"
                        />
                      </td>
                      <td className="p-2" style={{ borderRight: '1px solid black' }}>
                        <input
                          type="text"
                          value={editData.offer}
                          onChange={(e) => handleEditChange('offer', e.target.value)}
                          className="w-full border border-gray-300 rounded px-2 py-1"
                        />
                      </td>
                      <td className="p-2" style={{ borderRight: '1px solid black' }}>
                        <select
                          value={editData.is_sale.toString()}
                          onChange={(e) => handleEditChange('is_sale', e.target.value)}
                          className="w-full border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="true">True</option>
                          <option value="false">False</option>
                        </select>
                      </td>
                      <td className="p-2" style={{ borderRight: '1px solid black' }}>
                        <select
                          value={editData.in_stock.toString()}
                          onChange={(e) => handleEditChange('in_stock', e.target.value)}
                          className="w-full border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="true">True</option>
                          <option value="false">False</option>
                        </select>
                      </td>
                      <td className="p-2" style={{ borderRight: '1px solid black' }}>
                        <input
                          type="number"
                          min="0"
                          value={editData.stock_quantity}
                          onChange={(e) => handleEditChange('stock_quantity', e.target.value)}
                          className="w-full border border-gray-300 rounded px-2 py-1"
                        />
                      </td>
                      <td className="p-2" style={{ borderRight: '1px solid black' }}>
                        <input
                          type="number"
                          min="0"
                          value={editData.category_id}
                          onChange={(e) => handleEditChange('category_id', e.target.value)}
                          className="w-full border border-gray-300 rounded px-2 py-1"
                        />
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-2" style={{ borderRight: '1px solid black' }}>
                        {prod.name}
                      </td>
                      <td className="p-2" style={{ borderRight: '1px solid black' }}>
                        {prod.price !== undefined &&
                        prod.price !== null &&
                        !isNaN(prod.price)
                          ? Number(prod.price).toFixed(2)
                          : '-'}
                      </td>
                      <td
                        className="p-2 text-sm text-gray-700"
                        style={{ borderRight: '1px solid black', maxWidth: '200px', whiteSpace: 'normal' }}
                      >
                        {expandedDescIds.has(prod.id) ? prod.description : truncateText(prod.description, 60)}
                        {prod.description && prod.description.length > 60 && (
                          <button
                            onClick={() => toggleDescription(prod.id)}
                            className="ml-2 text-indigo-600 underline text-xs focus:outline-none"
                            type="button"
                          >
                            {expandedDescIds.has(prod.id) ? 'Show Less' : 'View More'}
                          </button>
                        )}
                      </td>
                      <td className="p-2" style={{ borderRight: '1px solid black' }}>
                        {prod.discount}
                      </td>
                      <td className="p-2" style={{ borderRight: '1px solid black' }}>
                        {prod.offer}
                      </td>
                      <td className="p-2" style={{ borderRight: '1px solid black' }}>
                        {prod.is_sale ? 'Yes' : 'No'}
                      </td>
                      <td className="p-2" style={{ borderRight: '1px solid black' }}>
                        {prod.in_stock ? 'Yes' : 'No'}
                      </td>
                      <td className="p-2" style={{ borderRight: '1px solid black' }}>
                        {prod.stock_quantity}
                      </td>
                      <td className="p-2" style={{ borderRight: '1px solid black' }}>
                        {prod.category_id}
                      </td>
                    </>
                  )}

                  <td
                    className="p-2 flex space-x-2 justify-center"
                    style={{ borderLeft: '1px solid black' }}
                  >
                    {editingId === prod.id ? (
                      <>
                        <button
                          onClick={saveEdit}
                          className="text-green-600 hover:text-green-800"
                          title="Save"
                          type="button"
                        >
                          <FiSave size={20} />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="text-gray-600 hover:text-gray-800"
                          title="Cancel"
                          type="button"
                        >
                          <FiX size={20} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(prod)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                          type="button"
                        >
                          <FiEdit size={20} />
                        </button>
                        <button
                          onClick={() => deleteProduct(prod.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                          type="button"
                        >
                          <FiTrash2 size={20} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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

export default ManageAllProducts;
