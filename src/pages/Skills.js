import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import AdminNav from '../components/AdminNav';

function Skills({ token, onLogout }) {
  const [skills, setSkills] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    category: '',
    skills: '',
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await axiosInstance.get('/api/skills');
      setSkills(response.data);
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const skillsArray = formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill);
      const dataToSend = {
        category: formData.category,
        skills: skillsArray,
      };

      if (editingId) {
        // Update existing
        await axiosInstance.put(`/api/skills/${editingId}`, dataToSend);
      } else {
        // Add new
        await axiosInstance.post('/api/skills', dataToSend);
      }

      fetchSkills();
      setShowForm(false);
      setEditingId(null);
      setFormData({ category: '', skills: '' });
    } catch (error) {
      console.error('Error saving skills:', error);
    }
  };

  const handleEdit = (skill) => {
    setFormData({
      category: skill.category,
      skills: skill.skills.join(', '),
    });
    setEditingId(skill._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this skill category?')) {
      try {
        await axiosInstance.delete(`/api/skills/${id}`);
        fetchSkills();
      } catch (error) {
        console.error('Error deleting skill:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <AdminNav onLogout={onLogout} />

      <div className="flex-1 md:ml-60 p-6 md:p-12 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-100 mb-2">Manage Skills</h1>
            <p className="text-slate-400">Create, edit, and organize your skill categories</p>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setFormData({ category: '', skills: '' });
            }}
            className="self-start md:self-center px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-100 font-semibold rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105 whitespace-nowrap"
          >
            {showForm ? '✕ Cancel' : '+ Add Skill Category'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-slate-800/30 border-2 border-slate-700 p-8 md:p-12 rounded-xl shadow-2xl mb-8 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-slate-100 mb-8">{editingId ? 'Edit Skill Category' : 'Create New Skill Category'}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="form-group">
                <label className="block text-sm font-semibold text-slate-100 mb-2">Category Name *</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g., Languages, Frontend, Backend"
                  className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 text-slate-100 placeholder-slate-500 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition"
                  required
                />
              </div>

              <div className="form-group">
                <label className="block text-sm font-semibold text-slate-100 mb-2">Skills (comma-separated) *</label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="e.g., React, Node.js, Express"
                  className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 text-slate-100 placeholder-slate-500 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition"
                  required
                />
              </div>
            </div>

            <div className="flex gap-4 justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({ category: '', skills: '' });
                }}
                className="px-6 py-3 bg-slate-600 hover:bg-slate-500 text-slate-100 font-semibold rounded-lg shadow transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-slate-100 font-semibold rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105"
              >
                {editingId ? '✓ Update Category' : '+ Create Category'}
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.length === 0 ? (
            <div className="col-span-full text-center py-16 bg-slate-800/30 border-2 border-dashed border-slate-700 rounded-lg">
              <p className="text-slate-400">No skill categories yet. Create your first one!</p>
            </div>
          ) : (
            skills.map((skill) => (
              <div key={skill._id} className="group bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-700 rounded-xl shadow-lg hover:shadow-2xl hover:border-slate-600 transition overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-100 mb-4 group-hover:text-slate-50 transition">{skill.category}</h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {skill.skills.map((s, index) => (
                      <span key={index} className="inline-block px-3 py-1 bg-slate-700/50 text-slate-300 text-xs font-semibold rounded-full">
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(skill)}
                      className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-100 font-semibold rounded-lg shadow transition transform hover:scale-105"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(skill._id)}
                      className="flex-1 px-4 py-2 bg-red-600/70 hover:bg-red-700 text-slate-100 font-semibold rounded-lg shadow transition transform hover:scale-105"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Skills;