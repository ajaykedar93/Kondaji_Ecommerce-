// src/Pages/Admin/AdminUsers.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaUsers } from 'react-icons/fa';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await axios.get('https://kondaji-express-api.onrender.com/api/user/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      setError('❌ Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (user) => {
    setUserToDelete(user);
    setShowDeletePopup(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`https://kondaji-express-api.onrender.com/api/user/delete-user/${userToDelete.id}`);
      setUsers(users.filter((u) => u.id !== userToDelete.id));
      setShowDeletePopup(false);
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  const handleViewUser = async (id) => {
    try {
      const res = await axios.get(`https://kondaji-express-api.onrender.com/api/user/profile/${id}`);
      setSelectedUser(res.data);
    } catch (err) {
      console.error('Profile fetch failed');
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`https://kondaji-express-api.onrender.com/api/user/update/${selectedUser.id}`, {
        phone: selectedUser.phone,
        email: selectedUser.email
      });
      alert('Profile updated');
      fetchUsers();
      setSelectedUser(null);
    } catch (err) {
      alert('Update failed');
    }
  };

  const filteredUsers = users.filter(user =>
    (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold mb-6 flex items-center gap-2 text-red-700"
      >
        <FaUsers /> Manage Website Users
      </motion.h1>

      <input
        type="text"
        placeholder="Search by name or email"
        className="mb-4 px-4 py-2 border w-full rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading ? (
        <p className="text-center">Loading users...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : filteredUsers.length === 0 ? (
        <p className="text-center text-gray-500">No users found.</p>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="overflow-x-auto bg-white shadow-xl rounded-xl"
        >
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Phone</th>
                <th className="px-6 py-3">Address</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-t hover:bg-gray-50 transition">
                  <td className="px-6 py-3 font-medium text-blue-600 cursor-pointer" onClick={() => handleViewUser(user.id)}>
                    {user.name || user.username}
                  </td>
                  <td className="px-6 py-3">{user.email}</td>
                  <td className="px-6 py-3">{user.phone || '-'}</td>
                  <td className="px-6 py-3">
                    {user.address ? `${user.address}, ${user.city}, ${user.state}` : '-'}
                  </td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.role === 'admin' ? 'bg-blue-100 text-blue-600' : 'bg-yellow-100 text-yellow-700'}`}>
                      {(user.role || 'user').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-3 space-x-2">
                    <button
                      onClick={() => handleDelete(user)}
                      className="bg-red-100 text-red-600 px-3 py-1 text-xs rounded hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {showDeletePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-lg font-bold mb-4 text-center text-red-600">⚠️ Confirm Permanent Deletion</h2>
            <p className="text-center mb-6">Are you sure you want to delete <strong>{userToDelete?.name}</strong>?</p>
            <div className="flex justify-center gap-4">
              <button onClick={confirmDelete} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Yes, Delete</button>
              <button onClick={() => setShowDeletePopup(false)} className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[500px]">
            <h2 className="text-xl font-bold mb-4 text-center text-purple-700">Update User Contact Info</h2>
            <div className="space-y-4">
              <input type="text" className="w-full border p-2 rounded" placeholder="Phone" value={selectedUser.phone} onChange={e => setSelectedUser({ ...selectedUser, phone: e.target.value })} />
              <input type="email" className="w-full border p-2 rounded" placeholder="Email" value={selectedUser.email} onChange={e => setSelectedUser({ ...selectedUser, email: e.target.value })} />
            </div>
            <div className="flex justify-between mt-6">
              <button onClick={handleUpdate} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Save</button>
              <button onClick={() => setSelectedUser(null)} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;