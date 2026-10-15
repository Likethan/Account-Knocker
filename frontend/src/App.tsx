import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Accounts from './pages/Accounts';
import AIChat from './pages/AIChat';
import SecurityReport from './pages/SecurityReport';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center font-mono text-xs text-zinc-500">
        <span>Initializing security workspace...</span>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Dashboard Workspace */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/accounts"
        element={
          <ProtectedRoute>
            <Accounts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <AIChat />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <SecurityReport />
          </ProtectedRoute>
        }
      />

      {/* Fallback to landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
