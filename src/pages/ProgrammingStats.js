import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNav from '../components/AdminNav';

function ProgrammingStats({ token, onLogout }) {
  const [stats, setStats] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    platform: '',
    icon: '',
    rating: '',
    rank: '',
    solved: '',
    contests: '',
    profileUrl: '',
    color: '',
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/programming');
      setStats(response.data.stats || []);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/api/admin/programming/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post('/api/admin/programming', formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setFormData({
        platform: '',
        icon: '',
        rating: '',
        rank: '',
        solved: '',
        contests: '',
        profileUrl: '',
        color: '',
      });
      setShowForm(false);
      setEditingId(null);
      fetchStats();
    } catch (error) {
      console.error('Error saving stat:', error);
      alert('Error saving stat');
    }
  };

  const handleEdit = (stat) => {
    setFormData({
      platform: stat.platform,
      icon: stat.icon,
      rating: stat.rating,
      rank: stat.rank,
      solved: stat.solved,
      contests: stat.contests,
      profileUrl: stat.profileUrl,
      color: stat.color,
    });
    setEditingId(stat._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this stat?')) {
      try {
        await axios.delete(`/api/admin/programming/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchStats();
      } catch (error) {
        console.error('Error deleting stat:', error);
        alert('Error deleting stat');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <AdminNav onLogout={onLogout} />

      <div className="flex-1 md:ml-60 p-12 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-100 mb-2">Manage Programming Stats</h1>
            <p className="text-slate-400">Create, edit, and organize Programming Stats</p>
          </div>

          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setFormData({
                platform: '',
                icon: '',
                rating: '',
                rank: '',
                solved: '',
                contests: '',
                profileUrl: '',
                color: '',
              });
            }}

            className="bg-slate-700 hover:bg-slate-600 text-slate-100 px-4 py-2 rounded-md shadow hover:shadow-lg transition font-semibold">
            {showForm ? 'Cancel' : '+ Add New Stat'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-slate-800/30 border border-slate-700 p-8 rounded-lg shadow mb-8 space-y-4">
            {['platform','icon','rating','rank','solved','contests','profileUrl','color'].map((field) => (
              <div key={field}>
                <label className="block text-slate-300 mb-1 capitalize font-medium">{field.replace(/([A-Z])/g, ' $1')}</label>
                <input
                  type={field === 'profileUrl' ? 'url' : 'text'}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required={field==='platform'}
                  className="w-full px-4 py-2 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-700 text-slate-100 placeholder-slate-500"
                />
              </div>
            ))}
            <button
              type="submit"
              className="bg-slate-700 hover:bg-slate-600 text-slate-100 px-6 py-2 rounded-md shadow hover:shadow-lg transition font-semibold"
            >
              {editingId ? 'Update Stat' : 'Create Stat'}
            </button>
          </form>
        )}

        <div className="space-y-4">
          {stats.map((stat) => (
            <div
              key={stat._id}
              className="flex justify-between items-center bg-slate-800/30 border border-slate-700 p-4 rounded-lg shadow hover:shadow-lg transition"
            >
              <div>
                <strong className="text-slate-100">{stat.platform}</strong>
                {stat.rating && <span className="text-slate-400"> ({stat.rating})</span>}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(stat)}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-lg text-sm font-medium transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(stat._id)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600/70 hover:bg-red-700 text-slate-100 rounded-lg text-sm font-medium transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProgrammingStats;
