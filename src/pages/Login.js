import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/api/admin/login', { email, password });
      localStorage.setItem('adminToken', response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="bg-slate-800 border border-slate-700 p-10 rounded-xl shadow-2xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-slate-100">Admin Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-700 text-slate-100 placeholder-slate-500"
            />
          </div>
          <div>
            <label className="block text-slate-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-700 text-slate-100 placeholder-slate-500"
            />
          </div>
          {error && <p className="text-red-400 text-center text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-700 hover:bg-slate-600 text-slate-100 py-2 rounded-md transition disabled:opacity-70 disabled:cursor-not-allowed font-semibold"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-center mt-4 text-sm text-slate-400">
          Don't have an admin account?{' '}
          <Link to="/register" className="text-slate-300 hover:text-slate-100 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
