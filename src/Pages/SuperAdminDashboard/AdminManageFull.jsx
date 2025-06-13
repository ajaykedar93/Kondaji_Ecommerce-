import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BASE_URL = 'https://kondaji-express-api.onrender.com/api/admin'; 

function AdminManageFull() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const [newAdmin, setNewAdmin] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    role: 'admin',
    status: 'active',
  });

  // Fetch all admins
  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/admins`);
      setAdmins(res.data);
    } catch {
      showMessage('error', 'Failed to fetch admins');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Show message helper
  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  // Handle input for edit
  const handleEditChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  // Start editing an admin
  const startEdit = (admin) => {
    setEditingId(admin.id);
    setEditData({
      name: admin.name || '',
      email: admin.email || '',
      phone: admin.phone || '',
      role: admin.role || 'admin',
      status: admin.status || 'active',
    });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  // Save edits
  const saveEdit = async () => {
    try {
      const payload = {
        name: editData.name,
        email: editData.email,
        phone: editData.phone,
        role: editData.role,
        status: editData.status,
      };
      await axios.put(`${BASE_URL}/admins/${editingId}`, payload);
      showMessage('success', 'Admin updated successfully');
      cancelEdit();
      fetchAdmins();
    } catch {
      showMessage('error', 'Failed to update admin');
    }
  };

  // Delete admin
  const deleteAdmin = async (id) => {
    if (!window.confirm('Are you sure you want to delete this admin?')) return;
    try {
      await axios.delete(`${BASE_URL}/admins/${id}`);
      showMessage('success', 'Admin deleted successfully');
      if (editingId === id) cancelEdit();
      fetchAdmins();
    } catch {
      showMessage('error', 'Failed to delete admin');
    }
  };

  // Handle new admin input change
  const handleNewAdminChange = (e) => {
    setNewAdmin({ ...newAdmin, [e.target.name]: e.target.value });
  };

  // Create new admin
  const addAdmin = async () => {
    const { name, username, email, password } = newAdmin;
    if (!name || !username || !email || !password) {
      showMessage('error', 'Please fill all required fields');
      return;
    }
    try {
      await axios.post(`${BASE_URL}/admins`, newAdmin);
      showMessage('success', 'New admin added successfully');
      setNewAdmin({
        name: '',
        username: '',
        email: '',
        phone: '',
        password: '',
        role: 'admin',
        status: 'active',
      });
      fetchAdmins();
    } catch (err) {
      showMessage('error', err.response?.data?.error || 'Failed to add admin');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-3xl font-bold mb-6 text-center">Superadmin - Manage Admins</h1>

      {/* Add New Admin Section */}
      <section className="mb-8 border p-4 rounded">
        <h2 className="text-xl font-semibold mb-4">Add New Admin</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['name', 'username', 'email', 'phone', 'password'].map((field) => (
            <div key={field}>
              <label className="block mb-1 capitalize">{field}</label>
              <input
                type={field === 'password' ? 'password' : 'text'}
                name={field}
                value={newAdmin[field]}
                onChange={handleNewAdminChange}
                placeholder={`Enter ${field}`}
                className="w-full border p-2 rounded"
              />
            </div>
          ))}
          <div>
            <label className="block mb-1 capitalize">Role</label>
            <select
              name="role"
              value={newAdmin.role}
              onChange={handleNewAdminChange}
              className="w-full border p-2 rounded"
            >
              <option value="admin">Admin</option>
              <option value="superadmin">Superadmin</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 capitalize">Status</label>
            <select
              name="status"
              value={newAdmin.status}
              onChange={handleNewAdminChange}
              className="w-full border p-2 rounded"
            >
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
        <button
          onClick={addAdmin}
          className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Add Admin
        </button>
      </section>

      {/* List All Admins */}
      <section>
        <h2 className="text-xl font-semibold mb-4">All Admins</h2>
        {loading ? (
          <p>Loading admins...</p>
        ) : admins.length === 0 ? (
          <p>No admins found.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300 rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Name</th>
                <th className="border p-2">Username</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Phone</th>
                <th className="border p-2">Role</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Created At</th>
                <th className="border p-2">Updated At</th>
                <th className="border p-2">Last Login</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50">
                  <td className="border p-2">
                    {editingId === admin.id ? (
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) => handleEditChange('name', e.target.value)}
                        className="border p-1 rounded w-full"
                      />
                    ) : (
                      admin.name
                    )}
                  </td>
                  <td className="border p-2">{admin.username}</td>
                  <td className="border p-2">
                    {editingId === admin.id ? (
                      <input
                        type="email"
                        value={editData.email}
                        onChange={(e) => handleEditChange('email', e.target.value)}
                        className="border p-1 rounded w-full"
                      />
                    ) : (
                      admin.email
                    )}
                  </td>
                  <td className="border p-2">
                    {editingId === admin.id ? (
                      <input
                        type="text"
                        value={editData.phone}
                        onChange={(e) => handleEditChange('phone', e.target.value)}
                        className="border p-1 rounded w-full"
                      />
                    ) : (
                      admin.phone
                    )}
                  </td>
                  <td className="border p-2">
                    {editingId === admin.id ? (
                      <select
                        value={editData.role}
                        onChange={(e) => handleEditChange('role', e.target.value)}
                        className="border p-1 rounded w-full"
                      >
                        <option value="admin">Admin</option>
                        <option value="superadmin">Superadmin</option>
                      </select>
                    ) : (
                      admin.role
                    )}
                  </td>
                  <td className="border p-2">
                    {editingId === admin.id ? (
                      <select
                        value={editData.status}
                        onChange={(e) => handleEditChange('status', e.target.value)}
                        className="border p-1 rounded w-full"
                      >
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    ) : (
                      admin.status
                    )}
                  </td>
                  <td className="border p-2">{new Date(admin.created_at).toLocaleString()}</td>
                  <td className="border p-2">{admin.updated_at ? new Date(admin.updated_at).toLocaleString() : '-'}</td>
                  <td className="border p-2">{admin.last_login ? new Date(admin.last_login).toLocaleString() : '-'}</td>
                  <td className="border p-2 space-x-2">
                    {editingId === admin.id ? (
                      <>
                        <button
                          onClick={saveEdit}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="bg-gray-400 text-white px-3 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(admin)}
                          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteAdmin(admin.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Message Box */}
      {message.text && (
        <div
          className={`fixed bottom-4 right-4 px-4 py-3 rounded shadow text-white ${
            message.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}

export default AdminManageFull;
