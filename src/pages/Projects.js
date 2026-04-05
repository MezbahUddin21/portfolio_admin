import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNav from '../components/AdminNav';

function Projects({ token, onLogout }) {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null,
    technologies: '',
    liveLink: '',
    githubLink: '',
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('/api/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      setFormData({ ...formData, [name]: file });
      if (file) {
        setImagePreview(URL.createObjectURL(file));
      } else {
        setImagePreview(null);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      if (formData.image instanceof File) {
        formDataToSend.append('image', formData.image);
      } else if (typeof formData.image === 'string' && formData.image) {
        formDataToSend.append('image', formData.image);
      }
      const technologiesArray = formData.technologies
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      formDataToSend.append('technologies', JSON.stringify(technologiesArray));
      formDataToSend.append('liveLink', formData.liveLink);
      formDataToSend.append('githubLink', formData.githubLink);

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (editingId) {
        await axios.put(`/api/admin/projects/${editingId}`, formDataToSend, config);
      } else {
        await axios.post('/api/admin/projects', formDataToSend, config);
      }

      setFormData({
        title: '',
        description: '',
        image: null,
        technologies: '',
        liveLink: '',
        githubLink: '',
      });
      setImagePreview(null);
      setShowForm(false);
      setEditingId(null);
      fetchProjects();
    } catch (error) {
      const status = error?.response?.status;
      const serverMessage = error?.response?.data?.message || error?.response?.data || error.message;

      console.error('Error saving project:', error?.response || error);

      if (status === 401 && serverMessage.toLowerCase().includes('expired')) {
        alert('Session expired. Please log in again.');
        onLogout();
        return;
      }

      alert(`Error saving project: ${serverMessage}`);
    }
  };

  const handleEdit = (project) => {
    setFormData({
      title: project.title,
      description: project.description,
      image: project.image,
      technologies: project.technologies.join(', '),
      liveLink: project.liveLink,
      githubLink: project.githubLink,
    });
    setImagePreview(project.image || null);
    setEditingId(project._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await axios.delete(`/api/admin/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Error deleting project');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <AdminNav onLogout={onLogout} />

      <div className="flex-1 md:ml-60 p-6 md:p-12 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-100 mb-2">Manage Projects</h1>
            <p className="text-slate-400">Create, edit, and manage your portfolio projects</p>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setImagePreview(null);
              setFormData({
                title: '',
                description: '',
                image: null,
                technologies: '',
                liveLink: '',
                githubLink: '',
              });
            }}
            className="self-start md:self-center px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-100 font-semibold rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105 whitespace-nowrap"
          >
            {showForm ? '✕ Cancel' : '+ Add New Project'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-slate-800/30 border-2 border-slate-700 p-8 md:p-12 rounded-xl shadow-2xl mb-8 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-slate-100 mb-8">{editingId ? 'Edit Project' : 'Create New Project'}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="form-group">
                <label className="block text-sm font-semibold text-slate-100 mb-2">Project Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter project title"
                  className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 text-slate-100 placeholder-slate-500 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition"
                  required
                />
              </div>

              <div className="form-group">
                <label className="block text-sm font-semibold text-slate-100 mb-2">Technologies (comma-separated) *</label>
                <input
                  type="text"
                  name="technologies"
                  value={formData.technologies}
                  onChange={handleChange}
                  placeholder="e.g., React, Node.js, MongoDB"
                  className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 text-slate-100 placeholder-slate-500 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition"
                />
              </div>
            </div>

            <div className="form-group mb-6">
              <label className="block text-sm font-semibold text-slate-100 mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your project in detail..."
                rows="5"
                className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 text-slate-100 placeholder-slate-500 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition resize-none"
                required
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="form-group">
                <label className="block text-sm font-semibold text-slate-100 mb-2">Project Image *</label>
                <label className="relative flex items-center justify-center px-4 py-6 bg-slate-700 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer hover:bg-slate-600 transition group min-h-[14rem] overflow-hidden">
                  {imagePreview ? (
                    <>
                      <img
                        src={imagePreview}
                        alt="Selected project"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                      <div className="relative text-center text-slate-100 z-10">
                        <p className="text-lg font-semibold">Change image</p>
                        <p className="text-sm text-slate-300">Click to replace the current image</p>
                      </div>
                    </>
                  ) : (
                    <div className="text-center">
                      <svg className="mx-auto h-10 w-10 text-slate-400 group-hover:text-slate-300 transition" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V16a4 4 0 00-4-4z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="20" cy="20" r="2" fill="currentColor" />
                        <path d="M36 32L24 18 12 32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <p className="mt-2 text-sm text-slate-400">Click to upload or drag and drop</p>
                      <p className="text-xs text-slate-500">PNG, JPG, GIF up to 5MB</p>
                    </div>
                  )}
                  <input
                    type="file"
                    name="image"
                    onChange={handleChange}
                    accept="image/*"
                    className="hidden"
                    required={!editingId}
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="form-group">
                  <label className="block text-sm font-semibold text-slate-100 mb-2">Live Link</label>
                  <input
                    type="url"
                    name="liveLink"
                    value={formData.liveLink}
                    onChange={handleChange}
                    placeholder="https://your-project.com"
                    className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 text-slate-100 placeholder-slate-500 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition"
                  />
                </div>
              </div>
            </div>

            <div className="form-group mb-8">
              <label className="block text-sm font-semibold text-slate-100 mb-2">GitHub Link</label>
              <input
                type="url"
                name="githubLink"
                value={formData.githubLink}
                onChange={handleChange}
                placeholder="https://github.com/your-repo"
                className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 text-slate-100 placeholder-slate-500 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition"
              />
            </div>

            <div className="flex gap-4 justify-end">
              <button 
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setImagePreview(null);
                  setFormData({
                    title: '',
                    description: '',
                    image: null,
                    technologies: '',
                    liveLink: '',
                    githubLink: '',
                  });
                }}
                className="px-6 py-3 bg-slate-600 hover:bg-slate-500 text-slate-100 font-semibold rounded-lg shadow transition"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-slate-100 font-semibold rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105"
              >
                {editingId ? '✓ Update Project' : '+ Create Project'}
              </button>
            </div>
          </form>
        )}

        <div className="space-y-6">
          {projects.length === 0 ? (
            <div className="text-center py-16 bg-slate-800/30 border-2 border-dashed border-slate-700 rounded-lg">
              <p className="text-slate-400">No projects yet. Create your first project!</p>
            </div>
          ) : (
            projects.map((project) => (
              <div key={project._id} className="group bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-700 rounded-xl shadow-lg hover:shadow-2xl hover:border-slate-600 transition overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-100 mb-3 group-hover:text-slate-50 transition">{project.title}</h3>
                      <p className="text-slate-300 mb-4 leading-relaxed">{project.description.slice(0,100)}{project.description.length > 100 && "..."}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies && project.technologies.map((tech, index) => (
                          <span key={index} className="inline-block px-3 py-1 bg-slate-700/50 text-slate-300 text-xs font-semibold rounded-full">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {project.liveLink && (
                        <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 text-slate-300 hover:bg-slate-700 rounded-lg text-sm font-medium transition">
                          Live Demo
                        </a>
                      )}
                      {project.githubLink && (
                        <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 text-slate-300 hover:bg-slate-700 rounded-lg text-sm font-medium transition">
                          GitHub
                        </a>
                      )}
                      <button 
                        onClick={() => handleEdit(project)} 
                        className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-lg text-sm font-medium transition"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(project._id)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600/70 hover:bg-red-700 text-slate-100 rounded-lg text-sm font-medium transition"
                      >
                        Delete
                      </button>
                    </div>
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

export default Projects;
