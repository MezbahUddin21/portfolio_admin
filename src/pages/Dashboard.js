import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { Link } from 'react-router-dom';
import AdminNav from '../components/AdminNav';

function Dashboard({ token, onLogout }) {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    programming: 0,
    contacts: 0,
    highlights: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const [projectsRes, skillsRes, programmingRes, contactsRes, highlightsRes] = await Promise.all([
        axiosInstance.get('/api/projects'),
        axiosInstance.get('/api/skills'),
        axiosInstance.get('/api/programming'),
        axiosInstance.get('/api/contacts'),
        axiosInstance.get('/api/highlights'),
      ]);

      setStats({
        projects: projectsRes.data?.length || 0,
        skills: skillsRes.data?.length || 0,
        programming: programmingRes.data?.stats?.length || 0,
        contacts: contactsRes.data?.length || 0,
        highlights: highlightsRes.data?.length || 0,
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, count, icon, link, color, trend }) => (
    <Link to={link} className="no-underline">
      <div className={`bg-gradient-to-br ${color} rounded-lg p-6 shadow-lg hover:shadow-xl transition transform hover:scale-105 cursor-pointer border border-slate-600/50 hover:border-slate-500/80 relative overflow-hidden group`}>
        {/* Accent bar on top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-slate-400 text-sm uppercase tracking-wide font-medium">{title}</p>
            <p className="text-4xl font-bold text-slate-100 mt-2">{loading ? '-' : count}</p>
            {trend && (
              <div className="mt-3 flex items-center gap-1">
                <span className={`text-sm font-semibold ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                </span>
                <span className="text-xs text-slate-500">vs last week</span>
              </div>
            )}
          </div>
          
          {/* Visual indicator on right */}
          <div className="ml-4 flex flex-col gap-1 h-12 justify-end">
            <div className="w-1 h-2 bg-blue-500 rounded-full opacity-80"></div>
            <div className="w-1 h-2 bg-purple-500 rounded-full opacity-60"></div>
            <div className="w-1 h-2 bg-pink-500 rounded-full opacity-40"></div>
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex">
      <AdminNav onLogout={onLogout} />

      <div className="flex-1 md:ml-60 p-6 md:p-12 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-100 mb-2">Dashboard</h1>
          <p className="text-slate-400">Welcome to your portfolio admin panel</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-8 text-red-400">
            {error}
          </div>
        )}

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          <StatCard
            title="Projects"
            count={stats.projects}
            link="/projects"
            color="from-slate-700 to-slate-800"
            trend={12}
          />
          <StatCard
            title="Skills"
            count={stats.skills}
            link="/skills"
            color="from-slate-700 to-slate-800"
            trend={8}
          />
          <StatCard
            title="Programming"
            count={stats.programming}
            link="/programming"
            color="from-slate-700 to-slate-800"
            trend={15}
          />
          <StatCard
            title="Contacts"
            count={stats.contacts}
            link="/dashboard"
            color="from-slate-700 to-slate-800"
            trend={-3}
          />
          <StatCard
            title="Highlights"
            count={stats.highlights}
            link="/highlights"
            color="from-slate-700 to-slate-800"
            trend={25}
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-slate-100 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link to="/projects">
              <button className="w-full px-4 py-3 bg-gradient-to-br from-slate-700 to-slate-600 text-slate-100 font-semibold rounded-lg shadow-lg hover:shadow-xl hover:from-slate-600 hover:to-slate-700 transition transform hover:scale-105">
                + Add Project
              </button>
            </Link>
            <Link to="/skills">
              <button className="w-full px-4 py-3 bg-gradient-to-br from-slate-700 to-slate-600 text-slate-100 font-semibold rounded-lg shadow-lg hover:shadow-xl hover:from-slate-600 hover:to-slate-700 transition transform hover:scale-105">
                + Add Skill
              </button>
            </Link>
            <Link to="/programming">
              <button className="w-full px-4 py-3 bg-gradient-to-br from-slate-700 to-slate-600 text-slate-100 font-semibold rounded-lg shadow-lg hover:shadow-xl hover:from-slate-600 hover:to-slate-700 transition transform hover:scale-105">
                + Add Programming Stat
              </button>
            </Link>
            <Link to="/cv">
              <button className="w-full px-4 py-3 bg-gradient-to-br from-slate-700 to-slate-600 text-slate-100 font-semibold rounded-lg shadow-lg hover:shadow-xl hover:from-slate-600 hover:to-slate-700 transition transform hover:scale-105">
                📄 Upload CV
              </button>
            </Link>
            <Link to="/highlights">
              <button className="w-full px-4 py-3 bg-gradient-to-br from-slate-700 to-slate-600 text-slate-100 font-semibold rounded-lg shadow-lg hover:shadow-xl hover:from-slate-600 hover:to-slate-700 transition transform hover:scale-105">
                ⭐ Add Highlight
              </button>
            </Link>
            <button
              onClick={fetchStats}
              className="w-full px-4 py-3 bg-gradient-to-br from-slate-700 to-slate-600 text-slate-100 font-semibold rounded-lg shadow-lg hover:shadow-xl hover:from-slate-600 hover:to-slate-700 transition transform hover:scale-105"
            >
              🔄 Refresh Stats
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
