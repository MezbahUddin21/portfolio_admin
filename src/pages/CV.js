import React, { useState } from 'react';
import axiosInstance from '../axiosConfig';
import AdminNav from '../components/AdminNav';

function CV({ onLogout }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a file');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('cv', file);

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      await axiosInstance.post('/api/cv/upload', formData, config);
      alert('CV uploaded successfully');
      setFile(null);
    } catch (error) {
      console.error('Error uploading CV:', error);
      alert('Error uploading CV');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <AdminNav onLogout={onLogout} />

      <div className="flex-1 md:ml-60 p-12 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-100 mb-2">CV Management</h1>
        <p className="text-slate-400 mb-10">Add your CV</p>


        <div className="bg-slate-800/30 border border-slate-700 p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold text-slate-100 mb-6">Upload CV</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-slate-300 mb-2">Select CV File (PDF)</label>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="w-full p-3 border border-slate-600 rounded-lg bg-slate-700 text-slate-300"
                required
              />
            </div>
            <button
              type="submit"
              disabled={uploading}
              className="bg-slate-700 hover:bg-slate-600 text-slate-100 px-6 py-3 rounded-lg font-semibold shadow-lg transition disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Upload CV'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CV;