import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNav from '../components/AdminNav';

function Highlights({ token, onLogout }) {
  const [highlights, setHighlights] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    highlights: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHighlights();
  }, []);

  const fetchHighlights = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/highlights');
      setHighlights(response.data || []);
    } catch (error) {
      console.error('Error fetching highlights:', error);
      setError('Failed to load highlights');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.highlights.trim()) {
      setError('Highlight text cannot be empty');
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };

      if (editingId) {
        await axios.put(`/api/admin/highlights/${editingId}`, formData, { headers });
      } else {
        await axios.post('/api/admin/highlights', formData, { headers });
      }

      await fetchHighlights();
      setShowForm(false);
      setEditingId(null);
      setFormData({ highlights: '' });
      setError('');
    } catch (error) {
      console.error('Error saving highlight:', error);
      setError(error.response?.data?.message || 'Error saving highlight');
    }
  };

  const handleEdit = (highlight) => {
    setFormData({
      highlights: highlight.highlights,
    });
    setEditingId(highlight._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this highlight?')) {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        await axios.delete(`/api/admin/highlights/${id}`, { headers });
        await fetchHighlights();
      } catch (error) {
        console.error('Error deleting highlight:', error);
        setError('Error deleting highlight');
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ highlights: '' });
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <AdminNav onLogout={onLogout} />

      <div className="flex-1 md:ml-60 p-6 md:p-12 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-100 mb-2">Manage Highlights</h1>
            <p className="text-slate-400">Add, edit, and manage your portfolio highlights</p>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setFormData({ highlights: '' });
              setError('');
            }}
            className="self-start md:self-center px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-100 font-semibold rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105 whitespace-nowrap"
          >
            {showForm ? '✕ Cancel' : '+ Add Highlight'}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-8 mb-10">
            <h2 className="text-2xl font-bold text-slate-100 mb-6">
              {editingId ? 'Edit Highlight' : 'Add New Highlight'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-slate-300 font-semibold mb-2">Highlight Text</label>
                <textarea
                  required
                  name="highlights"
                  value={formData.highlights}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-600 rounded-lg bg-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows="4"
                  placeholder="Enter your highlight text (e.g., 'Achieved top 100 rank in Codeforces')"
                />
              </div>

              {error && <div className="text-red-400 text-sm">{error}</div>}

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-100 font-semibold rounded-lg shadow-lg hover:shadow-xl transition"
                >
                  {editingId ? 'Update Highlight' : 'Add Highlight'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 bg-slate-700/50 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg border border-slate-600 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Highlights List */}
        <div className="bg-slate-800/30 border border-slate-700 rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-400">Loading highlights...</div>
          ) : highlights.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              No highlights added yet. Click "Add Highlight" to create one.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700/30 border-b border-slate-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-slate-300 font-semibold">Highlight</th>
                    <th className="px-6 py-4 text-left text-slate-300 font-semibold">Added Date</th>
                    <th className="px-6 py-4 text-center text-slate-300 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {highlights.map((highlight) => (
                    <tr key={highlight._id} className="hover:bg-slate-700/20 transition">
                      <td className="px-6 py-4 text-slate-200">{highlight.highlights}</td>
                      <td className="px-6 py-4 text-slate-400 text-sm">
                        {new Date(highlight.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleEdit(highlight)}
                          className="px-3 py-1 bg-slate-700/50 text-slate-300 rounded-md hover:bg-slate-700 transition text-sm mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(highlight._id)}
                          className="px-3 py-1 bg-red-600/20 text-red-400 rounded-md hover:bg-red-600/40 transition text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>


      </div>
    </div>
  );
}

export default Highlights;
