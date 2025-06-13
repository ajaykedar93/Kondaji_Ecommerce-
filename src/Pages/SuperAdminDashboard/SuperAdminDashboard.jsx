import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddBulkProduct from './AddBulkProduct';
import ManageAllProducts from './ManageAllProducts';
import SiteSettings from '../Admin/SiteSettings';
import AdminManageFull from './AdminManageFull';
import Analytics from './Analytics';

const BASE_URL_ADMIN = 'https://kondaji-express-api.onrender.com/api/auth';
const BASE_URL_USER = 'https://kondaji-express-api.onrender.com/api/user';

function SuperAdminDashboard() {
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const [newAdmin, setNewAdmin] = useState({ name: '', username: '', email: '', phone: '', password: '' });
  const [activeTab, setActiveTab] = useState('add');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [editingAdmin, setEditingAdmin] = useState(null);

  useEffect(() => {
    if (activeTab === 'manage') fetchAdmins();
    if (activeTab === 'users') fetchUsers();
  }, [activeTab]);

  const fetchAdmins = async () => {
    try {
      const res = await axios.get(`${BASE_URL_ADMIN}/admins`);
      setAdmins(res.data);
    } catch {
      showMessage('error', '❌ Failed to fetch admins');
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${BASE_URL_USER}/users`);
      setUsers(res.data);
    } catch {
      showMessage('error', '❌ Failed to fetch users');
    }
  };

  const handleAddAdmin = async () => {
    const { name, username, email, password } = newAdmin;
    if (!name || !username || !email || !password) {
      showMessage('error', 'All required fields must be filled');
      return;
    }
    try {
      await axios.post(`${BASE_URL_ADMIN}/add-admin`, newAdmin);
      showMessage('success', '✅ Admin registered successfully!');
      setNewAdmin({ name: '', username: '', email: '', phone: '', password: '' });
      fetchAdmins();
    } catch (error) {
      showMessage('error', error.response?.data?.message || '❌ Failed to register admin');
    }
  };

  const handleDeleteAdmin = async (id) => {
    try {
      await axios.delete(`${BASE_URL_ADMIN}/delete-admin/${id}`);
      showMessage('success', '🗑️ Admin deleted successfully');
      fetchAdmins();
    } catch {
      showMessage('error', '❌ Failed to delete admin');
    }
  };

  const handleUpdateAdmin = async () => {
    const { id, name, phone, email } = editingAdmin;
    try {
      await axios.put(`${BASE_URL_ADMIN}/update-admin/${id}`, { name, phone, email });
      showMessage('success', '✅ Admin updated successfully!');
      setEditingAdmin(null);
      fetchAdmins();
    } catch {
      showMessage('error', '❌ Failed to update admin');
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`${BASE_URL_USER}/delete-user/${id}`);
      showMessage('success', '🗑️ User deleted successfully');
      fetchUsers();
    } catch {
      showMessage('error', '❌ Failed to delete user');
    }
  };

  const handleInputChange = (e) => setNewAdmin({ ...newAdmin, [e.target.name]: e.target.value });
  const startEdit = (admin) => setEditingAdmin(admin);
  const handleEditChange = (e) => setEditingAdmin({ ...editingAdmin, [e.target.name]: e.target.value });
  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 bg-purple-700 text-white p-6 space-y-4 shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <button onClick={() => setActiveTab('add')} className={`w-full text-left px-4 py-2 rounded hover:bg-purple-600 transition ${activeTab === 'add' ? 'bg-purple-600' : ''}`}>➕ Add Admin</button>
        <button onClick={() => setActiveTab('manage')} className={`w-full text-left px-4 py-2 rounded hover:bg-purple-600 transition ${activeTab === 'manage' ? 'bg-purple-600' : ''}`}>🧑‍💻 Manage Admins</button>
        <button onClick={() => setActiveTab('users')} className={`w-full text-left px-4 py-2 rounded hover:bg-purple-600 transition ${activeTab === 'users' ? 'bg-purple-600' : ''}`}>👤 Manage Users</button>
        <button onClick={() => setActiveTab('settings')} className={`w-full text-left px-4 py-2 rounded hover:bg-purple-600 transition ${activeTab === 'settings' ? 'bg-purple-600' : ''}`}>⚙️ Site Settings</button>
        <button onClick={() => setActiveTab('addProductBulk')} className={`w-full text-left px-4 py-2 rounded hover:bg-purple-600 transition ${activeTab === 'addProductBulk' ? 'bg-purple-600' : ''}`}>📦 Add Product Bulk</button>
        <button onClick={() => setActiveTab('analytics')} className={`w-full text-left px-4 py-2 rounded hover:bg-purple-600 transition ${activeTab === 'analytics' ? 'bg-purple-600' : ''}`}>📊 Analytics</button>
      </div>

      <div className="flex-1 p-8 overflow-auto">
        {message.text && (
          <div className={`text-center mb-6 py-3 px-6 rounded shadow ${message.type === 'success' ? 'bg-green-100 text-green-700 border border-green-400' : 'bg-red-100 text-red-700 border border-red-400'}`}>{message.text}</div>
        )}

        {activeTab === 'add' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-3xl font-semibold text-purple-700 mb-6">Register New Admin</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {['name', 'username', 'email', 'phone', 'password'].map((field) => (
                <div key={field}>
                  <label className="block mb-1 text-gray-600 capitalize">{field}</label>
                  <input type={field === 'password' ? 'password' : 'text'} name={field} value={newAdmin[field]} onChange={handleInputChange} placeholder={`Enter ${field}`} className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" />
                </div>
              ))}
            </div>
            <button onClick={handleAddAdmin} className="mt-6 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition">➕ Register Admin</button>
          </div>
        )}

        {activeTab === 'manage' && <AdminManageFull admins={admins} editingAdmin={editingAdmin} startEdit={startEdit} handleEditChange={handleEditChange} handleUpdateAdmin={handleUpdateAdmin} handleDeleteAdmin={handleDeleteAdmin} />}
        {activeTab === 'users' && <AdminManageFull isUserList users={users} handleDeleteUser={handleDeleteUser} />}
        {activeTab === 'settings' && <SiteSettings />}
        {activeTab === 'addProductBulk' && <AddBulkProduct setActiveTab={setActiveTab} />}
        {activeTab === 'manageProducts' && <ManageAllProducts setActiveTab={setActiveTab} />}
        {activeTab === 'analytics' && <Analytics />}
      </div>
    </div>
  );
}

export default SuperAdminDashboard;
