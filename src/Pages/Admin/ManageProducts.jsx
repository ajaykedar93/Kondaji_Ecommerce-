import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaSave } from "react-icons/fa";

const ManageProduct = () => {
  const [products, setProducts] = useState([]);
  const [editData, setEditData] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("https://kondaji-express-api.onrender.com/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch products");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setEditData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleUpdateProduct = async (id) => {
    try {
      const intFields = ["discount", "stock_quantity", "category_id"];
      const sanitized = { ...editData };

      intFields.forEach((field) => {
        if (sanitized[field] === "" || sanitized[field] === null) {
          sanitized[field] = null;
        } else {
          sanitized[field] = Number(sanitized[field]);
          if (isNaN(sanitized[field])) sanitized[field] = null;
        }
      });

      await axios.put(`https://kondaji-express-api.onrender.com/api/products/${id}`, sanitized);
      setEditingId(null);
      setSuccess("✅ Product updated successfully!");
      fetchProducts();
    } catch (err) {
      console.error("Update error:", err);
      setError("❌ Failed to update product");
    }
  };

  const confirmDelete = (id) => {
    setConfirmDeleteId(id);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`https://kondaji-express-api.onrender.com/api/products/${confirmDeleteId}`);
      setConfirmDeleteId(null);
      setSuccess("🗑️ Product deleted successfully.");
      fetchProducts();
    } catch (err) {
      console.error("Delete error:", err);
      setError("❌ Failed to delete product");
    }
  };

  return (
    <div className="p-6 bg-gradient-to-b from-white to-blue-50 min-h-screen relative">
      <h1 className="text-4xl font-extrabold text-blue-700 mb-8 text-center shadow-md">📦 Manage Products</h1>

      <div className="overflow-x-auto max-h-[600px] overflow-y-auto bg-white rounded-2xl shadow-2xl">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-blue-100 text-blue-700 text-xs uppercase tracking-wider">
            <tr>
              <th className="p-4">Image</th>
              <th className="p-4">Name</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Discount</th>
              <th className="p-4">Offer</th>
              <th className="p-4">Sale</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t hover:bg-gray-50 transition">
                <td className="p-4">
                  <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded shadow" />
                </td>
                <td className="p-4">
                  {editingId === p.id ? (
                    <input name="name" value={editData.name || ""} onChange={handleChange} className="border px-2 py-1 rounded w-full" />
                  ) : (
                    <strong>{p.name}</strong>
                  )}
                </td>
                <td className="p-4">
                  {editingId === p.id ? (
                    <input name="price" value={editData.price || ""} onChange={handleChange} className="border px-2 py-1 rounded w-full" />
                  ) : (
                    `₹${p.price}`
                  )}
                </td>
                <td className="p-4">
                  {editingId === p.id ? (
                    <input name="stock_quantity" value={editData.stock_quantity || ""} onChange={handleChange} className="border px-2 py-1 rounded w-full" />
                  ) : (
                    p.stock_quantity || 0
                  )}
                </td>
                <td className="p-4">
                  {editingId === p.id ? (
                    <input name="discount" value={editData.discount || ""} onChange={handleChange} className="border px-2 py-1 rounded w-full" />
                  ) : (
                    <span className="text-purple-600">{p.discount || 0}%</span>
                  )}
                </td>
                <td className="p-4">
                  {editingId === p.id ? (
                    <input name="offer" value={editData.offer || ""} onChange={handleChange} className="border px-2 py-1 rounded w-full" />
                  ) : (
                    <span className="text-sm text-gray-600">{p.offer || "—"}</span>
                  )}
                </td>
                <td className="p-4">
                  {editingId === p.id ? (
                    <input type="checkbox" name="is_sale" checked={editData.is_sale || false} onChange={handleChange} />
                  ) : p.is_sale ? (
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">Sale</span>
                  ) : (
                    <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs">—</span>
                  )}
                </td>
                <td className="p-4 flex items-center gap-3 justify-center">
                  {editingId === p.id ? (
                    <button onClick={() => handleUpdateProduct(p.id)} className="text-blue-600 hover:text-blue-800 text-lg">
                      <FaSave />
                    </button>
                  ) : (
                    <button onClick={() => { setEditingId(p.id); setEditData(p); }} className="text-blue-600 hover:text-blue-800 text-lg">
                      <FaEdit />
                    </button>
                  )}
                  <button onClick={() => confirmDelete(p.id)} className="text-red-600 hover:text-red-800 text-lg">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="8" className="p-6 text-center text-gray-500">No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Success/Error Messages */}
      {success && <div className="text-green-600 mt-4">{success}</div>}
      {error && <div className="text-red-600 mt-4">{error}</div>}

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm text-center">
            <p className="mb-4">Are you sure you want to <strong>delete</strong> this product?</p>
            <div className="flex gap-4 justify-center">
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded">Delete</button>
              <button onClick={() => setConfirmDeleteId(null)} className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProduct;
