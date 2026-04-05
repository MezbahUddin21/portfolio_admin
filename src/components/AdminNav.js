import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

function AdminNav({ onLogout }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    if (onLogout) onLogout();
    navigate('/login');
  };

  const toggleNav = () => setIsOpen(!isOpen);

  const closeNav = () => setIsOpen(false);

  return (
    <>
      {/* Hamburger Button for small screens */}
      <button
        onClick={toggleNav}
        className="fixed top-4 left-4 z-50 md:hidden bg-slate-700 text-slate-100 p-2 rounded-lg shadow-lg hover:bg-slate-600 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay for small screens */}
      {isOpen && (
        <div
          onClick={closeNav}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
        ></div>
      )}

      {/* Navigation */}
      <nav className={`fixed inset-y-0 left-0 w-60 bg-gradient-to-br from-slate-800 to-slate-900 text-slate-100 p-8 flex flex-col justify-between shadow-lg z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`}>
        <div className="text-xl font-bold uppercase tracking-wide text-center text-slate-50 border-b border-slate-700 pb-4">Admin Panel</div>

        <ul className="flex flex-col gap-2 mt-10">
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-slate-700 font-semibold text-slate-50' : 'text-slate-300 hover:bg-slate-700/50 hover:text-slate-100'
                }`
              }
              onClick={closeNav}
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/projects"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-slate-700 font-semibold text-slate-50' : 'text-slate-300 hover:bg-slate-700/50 hover:text-slate-100'
                }`
              }
              onClick={closeNav}
            >
              Projects
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/programming"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-slate-700 font-semibold text-slate-50' : 'text-slate-300 hover:bg-slate-700/50 hover:text-slate-100'
                }`
              }
              onClick={closeNav}
            >
              Programming
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/cv"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-slate-700 font-semibold text-slate-50' : 'text-slate-300 hover:bg-slate-700/50 hover:text-slate-100'
                }`
              }
              onClick={closeNav}
            >
              CV
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/skills"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-slate-700 font-semibold text-slate-50' : 'text-slate-300 hover:bg-slate-700/50 hover:text-slate-100'
                }`
              }
              onClick={closeNav}
            >
              Skills
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/highlights"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-slate-700 font-semibold text-slate-50' : 'text-slate-300 hover:bg-slate-700/50 hover:text-slate-100'
                }`
              }
              onClick={closeNav}
            >
              Highlights
            </NavLink>
          </li>
        </ul>

        <button
          onClick={() => {
            handleLogout();
            closeNav();
          }}
          className="w-full bg-red-600/80 hover:bg-red-700 text-slate-100 px-4 py-3 rounded-lg transition-colors font-semibold border border-red-500/30"
        >
          Logout
        </button>
      </nav>
    </>
  );
}

export default AdminNav;
