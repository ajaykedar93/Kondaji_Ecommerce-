import React, { useState } from "react";
import axios from "axios";
import { FaPlus, FaImage, FaTags, FaSave } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AddCategory = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    offer_type: "",
    offer_value: "",
    offer_note: "",
    valid_from: "",
    valid_to: "",
    is_sale: false,
    is_active: true,
    image: null,
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Upload image
      const imgData = new FormData();
      imgData.append("image", form.image);
      const uploadRes = await axios.post("http://localhost:5000/api/images/upload", imgData);
      const imageUrl = uploadRes.data.url;

      const payload = {
        ...form,
        image: imageUrl,
        offer_value: parseFloat(form.offer_value) || null,
      };

      await axios.post("http://localhost:5000/api/categories", payload);

      setMessage("✅ Category added successfully!");
      setTimeout(() => navigate("/admin/manage-category"), 1500);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to add category.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow-xl mt-10">
      <h2 className="text-3xl font-bold text-blue-700 flex items-center gap-3 mb-6">
        <FaPlus /> Add New Category
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="font-medium">Category Name *</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded p-2 mt-1"
          />
        </div>

        <div>
          <label className="font-medium">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2 mt-1"
            rows="3"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-medium">Offer Type</label>
            <select
              name="offer_type"
              value={form.offer_type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2 mt-1"
            >
              <option value="">None</option>
              <option value="flat">Flat ₹</option>
              <option value="percent">Percent %</option>
            </select>
          </div>

          <div>
            <label className="font-medium">Offer Value</label>
            <input
              type="number"
              name="offer_value"
              value={form.offer_value}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2 mt-1"
              step="0.01"
            />
          </div>
        </div>

        <div>
          <label className="font-medium">Offer Note</label>
          <input
            type="text"
            name="offer_note"
            value={form.offer_note}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2 mt-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-medium">Valid From</label>
            <input
              type="date"
              name="valid_from"
              value={form.valid_from}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2 mt-1"
            />
          </div>

          <div>
            <label className="font-medium">Valid To</label>
            <input
              type="date"
              name="valid_to"
              value={form.valid_to}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2 mt-1"
            />
          </div>
        </div>

        <div>
          <label className="font-medium block mb-1">Category Image *</label>
          <input
            type="file"
            onChange={handleImageChange}
            required
            className="border border-gray-300 rounded p-2 w-full"
          />
        </div>

        <div className="flex items-center gap-4 mt-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_sale"
              checked={form.is_sale}
              onChange={handleChange}
            />
            On Sale
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
            />
            Active
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded shadow mt-4 flex justify-center items-center gap-2"
        >
          <FaSave />
          {loading ? "Saving..." : "Add Category"}
        </button>

        {message && (
          <p className="text-center mt-4 font-medium text-sm text-gray-700">
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default AddCategory;
