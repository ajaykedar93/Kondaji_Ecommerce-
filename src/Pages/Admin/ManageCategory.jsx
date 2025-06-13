import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaPlus, FaToggleOn, FaToggleOff, FaTags } from "react-icons/fa";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

const ManageCategory = () => {
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [updatedCategory, setUpdatedCategory] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cat) => {
    setEditingId(cat.id);
    setUpdatedCategory({ ...cat });
  };

  const handleChange = (e) => {
    setUpdatedCategory({ ...updatedCategory, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/categories/${id}`, updatedCategory);
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const toggleStatus = async (id, current) => {
    try {
      await axios.patch(`http://localhost:5000/api/categories/${id}`, {
        is_active: !current,
      });
      fetchCategories();
    } catch (err) {
      console.error("Toggle status error:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/categories/${id}`);
      setCategories(categories.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-white to-blue-50">
      {loading ? (
        <p className="text-gray-600 text-lg">Loading categories...</p>
      ) : categories.length === 0 ? (
        <div className="text-center mt-20">
          <p className="text-gray-500 text-xl mb-4 flex items-center justify-center gap-2">
            <span className="text-red-500 text-xl">🚫</span> No categories found.
          </p>
          <Link
            to="/admin/add-category"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow"
          >
            ➕ Add First Category
          </Link>
        </div>
      ) : (
        <>
          {/* Only show header and button when categories exist */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-extrabold text-blue-700 shadow-sm flex items-center gap-3">
              <FaTags /> Category Manager
            </h1>
            <Link
              to="/admin/add-category"
              className="bg-green-600 text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 shadow hover:bg-green-700 transition"
            >
              <FaPlus /> Add Category
            </Link>
          </div>

          <div className="overflow-x-auto bg-white rounded-2xl shadow-xl">
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="bg-blue-100 text-blue-700 uppercase text-xs tracking-wide">
                <tr>
                  <th className="px-6 py-4">Image</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Offer</th>
                  <th className="px-6 py-4">Valid Dates</th>
                  <th className="px-6 py-4">Sale</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr
                    key={cat.id}
                    className="border-t hover:bg-blue-50 transition duration-200"
                  >
                    <td className="px-6 py-4">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-14 h-14 rounded-lg object-cover border shadow-sm"
                      />
                    </td>

                    <td className="px-6 py-4 font-semibold text-gray-800">
                      {editingId === cat.id ? (
                        <input
                          name="name"
                          value={updatedCategory.name}
                          onChange={handleChange}
                          className="border border-blue-300 rounded px-2 py-1 w-full"
                        />
                      ) : (
                        cat.name
                      )}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {editingId === cat.id ? (
                        <textarea
                          name="description"
                          value={updatedCategory.description}
                          onChange={handleChange}
                          className="border px-2 py-1 rounded w-full"
                        />
                      ) : (
                        <span>{cat.description || "—"}</span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {cat.offer_type ? (
                        <span className="text-indigo-700 font-semibold text-sm">
                          {cat.offer_type === "flat" ? "₹" : ""}
                          {cat.offer_value}
                          {cat.offer_type === "percent" ? "%" : ""}
                          <div className="text-xs text-gray-500 font-normal">
                            {cat.offer_note}
                          </div>
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-500">
                      {cat.valid_from ? dayjs(cat.valid_from).format("DD MMM") : "—"} to{" "}
                      {cat.valid_to ? dayjs(cat.valid_to).format("DD MMM") : "—"}
                    </td>

                    <td className="px-6 py-4">
                      {cat.is_sale ? (
                        <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-bold">
                          On Sale
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">—</span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleStatus(cat.id, cat.is_active)}
                        title="Toggle active status"
                      >
                        {cat.is_active ? (
                          <FaToggleOn className="text-green-600 text-xl" />
                        ) : (
                          <FaToggleOff className="text-red-500 text-xl" />
                        )}
                      </button>
                    </td>

                    <td className="px-6 py-4 flex gap-3 justify-center">
                      {editingId === cat.id ? (
                        <button
                          onClick={() => handleUpdate(cat.id)}
                          className="bg-blue-600 text-white px-3 py-1 rounded-md shadow hover:bg-blue-700"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEdit(cat)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FaEdit />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageCategory;
