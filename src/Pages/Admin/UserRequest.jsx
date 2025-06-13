import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE = 'https://kondaji-express-api.onrender.com/api/messages';

const UserRequests = () => {
  const [messages, setMessages] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [statusUpdate, setStatusUpdate] = useState('responded');
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const messagesPerPage = 5;

  useEffect(() => { fetchMessages(); }, []);

  useEffect(() => {
    let temp = messages.filter(msg =>
      msg.name.toLowerCase().includes(search.toLowerCase()) ||
      msg.email.toLowerCase().includes(search.toLowerCase())
    );

    if (filterStatus) temp = temp.filter(msg => msg.status === filterStatus);
    if (filterDateFrom) {
      const from = new Date(filterDateFrom);
      temp = temp.filter(msg => new Date(msg.created_at) >= from);
    }
    if (filterDateTo) {
      const to = new Date(filterDateTo);
      temp = temp.filter(msg => new Date(msg.created_at) <= to);
    }

    setFiltered(temp);
    setCurrentPage(1);
  }, [search, filterStatus, filterDateFrom, filterDateTo, messages]);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/all`);
      setMessages(res.data);
    } catch {
      setError('Failed to fetch messages');
    }
  };

  const handleRespond = async (id) => {
    try {
      await axios.post(`${API_BASE}/admin/respond`, {
        messageId: id,
        response: responseText,
        status: statusUpdate,
      });
      toast.success('Response sent successfully');
      resetState();
      fetchMessages();
    } catch {
      toast.error('Failed to send response');
    }
  };

  const confirmDelete = (id) => {
    setConfirmDeleteId(id);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE}/admin/delete/${confirmDeleteId}`);
      toast.success('Message deleted');
      setConfirmDeleteId(null);
      fetchMessages();
    } catch {
      toast.error('Failed to delete message');
    }
  };

  const resetState = () => {
    setSelectedId(null);
    setResponseText('');
    setStatusUpdate('responded');
    setError('');
  };

  const grouped = filtered.reduce((acc, msg) => {
    acc[msg.type].push(msg);
    return acc;
  }, { support: [], feedback: [] });

  const exportToExcel = (type) => {};
  const exportToPDF = (type) => {};

  const paginate = (array) => {
    const start = (currentPage - 1) * messagesPerPage;
    return array.slice(start, start + messagesPerPage);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-3xl font-bold text-center text-purple-800 mb-6">Manage User Requests</h1>
      <div className="flex flex-wrap gap-4 mb-4 justify-center">
        <input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded w-full sm:w-1/3" />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border rounded w-full sm:w-1/6">
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="responded">Responded</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
        <input type="date" value={filterDateFrom} onChange={(e) => setFilterDateFrom(e.target.value)}
          className="px-4 py-2 border rounded w-full sm:w-1/6" />
        <input type="date" value={filterDateTo} onChange={(e) => setFilterDateTo(e.target.value)}
          className="px-4 py-2 border rounded w-full sm:w-1/6" />
      </div>

      {['support', 'feedback'].map(type => {
        const paged = paginate(grouped[type]);
        return (
          <div key={type} className="mb-12">
            <div className="flex justify-between items-center mb-4">
              <h2 className="px-4 py-2 rounded bg-purple-600 text-white">{type} Messages</h2>
              <div className="flex gap-2">
                <button onClick={() => exportToExcel(type)}
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded transition">Excel</button>
                <button onClick={() => exportToPDF(type)}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded transition">PDF</button>
              </div>
            </div>

            <div className="overflow-y-auto max-h-[320px] space-y-6">
              {paged.length === 0 ? (
                <p className="italic text-gray-600">No {type} messages</p>
              ) : paged.map(msg => (
                <div key={msg.id} className="bg-white p-5 rounded shadow">
                  <div className="text-gray-700 text-sm space-y-1 mb-3">
                    <p><strong>{msg.name}</strong> ({msg.email})</p>
                    <p><em>{new Date(msg.created_at).toLocaleString()}</em></p>
                    <p><strong>Status:</strong> {msg.status}</p>
                    <p>{msg.message}</p>
                  </div>
                  {msg.response ? (
                    <div className="bg-green-50 p-3 rounded text-sm">
                      <p><strong>Response:</strong> {msg.response}</p>
                    </div>
                  ) : selectedId === msg.id ? (
                    <div className="space-y-2">
                      <textarea value={responseText} onChange={e => setResponseText(e.target.value)}
                        className="w-full border rounded p-2 text-sm" placeholder="Type response..." />
                      <select value={statusUpdate} onChange={e => setStatusUpdate(e.target.value)}
                        className="border rounded p-2 w-full text-sm">
                        <option value="responded">Responded</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => handleRespond(msg.id)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition">Send</button>
                        <button onClick={resetState}
                          className="flex-1 bg-gray-300 hover:bg-gray-400 text-black p-2 rounded transition">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-4">
                      <button onClick={() => setSelectedId(msg.id)}
                        className="text-blue-600 hover:text-blue-800 underline">Respond</button>
                      <button onClick={() => confirmDelete(msg.id)}
                        className="text-red-600 hover:text-red-800 underline">Delete</button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-center">
              {Array.from({ length: Math.ceil(grouped[type].length / messagesPerPage) })
                .map((_, i) => (
                  <button key={i} onClick={() => setCurrentPage(i+1)}
                    className={`px-3 py-1 rounded ${currentPage===i+1 ? 'bg-purple-700 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>
                    {i+1}
                  </button>
                ))}
            </div>
          </div>
        );
      })}

      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm text-center">
            <p className="mb-4">Are you sure you want to <strong>delete</strong> this message?</p>
            <div className="flex gap-4 justify-center">
              <button onClick={handleDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded">Yes, Delete</button>
              <button onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserRequests;
