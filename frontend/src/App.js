import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import InputBox from './components/InputBox';

// Home component (you can replace this with your actual home page)
const Home = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Fake News Detection</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {user && (
            <div>
              <span>Welcome, {user.name}!</span>
            </div>
          )}
          <button onClick={handleLogout} style={{ padding: '8px 16px', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </div>
      <InputBox />
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

