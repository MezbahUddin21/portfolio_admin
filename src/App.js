import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Skills from './pages/Skills';
import ProgrammingStats from './pages/ProgrammingStats';
import CV from './pages/CV';
import Highlights from './pages/Highlights';

const ProtectedRoute = ({ token, children }) => {
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  const [token, setToken] = useState(localStorage.getItem('adminToken'));

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('adminToken'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={token ? '/dashboard' : '/login'} replace />} />
        <Route path="/login" element={token ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/register" element={token ? <Navigate to="/dashboard" replace /> : <Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute token={token}>
              <Dashboard token={token} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <ProtectedRoute token={token}>
              <Projects token={token} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/skills"
          element={
            <ProtectedRoute token={token}>
              <Skills token={token} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/programming"
          element={
            <ProtectedRoute token={token}>
              <ProgrammingStats token={token} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cv"
          element={
            <ProtectedRoute token={token}>
              <CV token={token} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/highlights"
          element={
            <ProtectedRoute token={token}>
              <Highlights token={token} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to={token ? '/dashboard' : '/login'} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
