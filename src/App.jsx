import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginScreen from './components/LoginScreen';
import HomeScreen from './components/HomeScreen';
import TestHomeScreen from './components/TestHomeScreen';
import SimpleHomeScreen from './components/SimpleHomeScreen';
import SimpleTest from './components/SimpleTest';
import ProjectsScreen from './components/ProjectsScreen';
import CalendarScreen from './components/CalendarScreen';
import StatsScreen from './components/StatsScreen';
import ProfileScreen from './components/ProfileScreen';
import OrganizationSetup from './components/OrganizationSetup';
import Navbar from './components/Navbar';
import SimpleNavbar from './components/SimpleNavbar';
import ErrorBoundary from './components/ErrorBoundary';
import ApiService from './services/api';
import './App.css';

function App() {
  console.log('🚀 App component rendering...');
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('🚀 App component mounted');
    checkAuth();
    
    // Fallback: force loading to false after 5 seconds
    const timeout = setTimeout(() => {
      console.log('🔍 App - Loading timeout, forcing loading to false');
      setLoading(false);
    }, 5000);
    
    return () => clearTimeout(timeout);
  }, []);

  const checkAuth = () => {
    try {
      console.log('🔍 Checking authentication...');
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('user');
      
      console.log('🔍 Auth check - Token exists:', !!token);
      console.log('🔍 Auth check - User data exists:', !!userData);
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          console.log('🔍 Auth check - User parsed successfully:', parsedUser.email);
          setUser(parsedUser);
        } catch (error) {
          console.error('🔍 Auth check - Failed to parse user data:', error);
          logout();
        }
      } else {
        console.log('🔍 Auth check - No stored auth data found');
      }
    } catch (error) {
      console.error('🔍 Auth check - Error during auth check:', error);
      setError('Failed to check authentication status');
    } finally {
      console.log('🔍 Auth check - Setting loading to false');
      setLoading(false);
    }
  };

  const handleLogin = async (userData) => {
    try {
      console.log('🔍 Login handler - Setting user:', userData.email);
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('🔍 Login handler - Error:', error);
      setError('Failed to complete login');
    }
  };

  const handleLogout = () => {
    console.log('🔍 Logout handler - Logging out user');
    logout();
  };

  const logout = () => {
    setUser(null);
    setError(null);
    ApiService.clearToken();
    localStorage.removeItem('user');
    localStorage.removeItem('currentOrganization');
    console.log('🔍 Logout - Cleared all auth data');
  };

  const handleOrganizationSetup = () => {
    console.log('🔍 Organization setup handler - Refreshing auth');
    checkAuth();
  };

  console.log('🔍 App render state:', { loading, user: !!user, error: !!error });

  if (loading) {
    console.log('🔍 App - Showing loading screen');
    return (
      <div className="app" style={{ backgroundColor: 'white', minHeight: '100vh', padding: '20px' }}>
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading Foundly...</p>
          <p style={{ fontSize: '14px', color: '#666' }}>Debug: Loading state active</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.log('🔍 App - Showing error screen:', error);
    return (
      <div className="app" style={{ backgroundColor: 'white', minHeight: '100vh', padding: '20px' }}>
        <div style={{
          padding: '20px',
          margin: '20px',
          border: '2px solid red',
          borderRadius: '8px',
          backgroundColor: '#fff5f5',
          textAlign: 'center'
        }}>
          <h2 style={{ color: 'red' }}>🚨 Application Error</h2>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  console.log('🔍 App - Rendering main app, user:', user?.email || 'not logged in');

  return (
    <Router>
      <div className="app">
        {user && <Navbar user={user} onLogout={handleLogout} />}
        <main className={user ? 'main-content' : 'main-content-full'}>
          <ErrorBoundary>
            <Routes>
              <Route 
                path="/login" 
                element={!user ? <LoginScreen onLogin={handleLogin} /> : <Navigate to="/" />} 
              />
              <Route 
                path="/" 
                element={user ? <HomeScreen user={user} /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/projects" 
                element={user ? <ProjectsScreen user={user} /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/calendar" 
                element={user ? <CalendarScreen user={user} /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/stats" 
                element={user ? <StatsScreen user={user} /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/profile" 
                element={user ? <ProfileScreen user={user} /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/organization/create" 
                element={user ? <OrganizationSetup onComplete={handleOrganizationSetup} /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/test" 
                element={<SimpleTest />} 
              />
              <Route 
                path="/debug" 
                element={
                  <div style={{
                    padding: '20px',
                    backgroundColor: 'white',
                    color: 'black',
                    minHeight: '100vh',
                    fontFamily: 'Arial, sans-serif'
                  }}>
                    <h1>🔧 Debug Page</h1>
                    <p>React is working! Current state:</p>
                    <ul>
                      <li>Loading: {loading ? 'true' : 'false'}</li>
                      <li>User: {user ? user.email : 'none'}</li>
                      <li>Error: {error || 'none'}</li>
                    </ul>
                    <button onClick={() => window.location.reload()}>Reload Page</button>
                  </div>
                } 
              />
              <Route 
                path="/simple" 
                element={
                  <div style={{
                    padding: '20px',
                    backgroundColor: '#f0f9ff',
                    color: '#1e40af',
                    minHeight: '100vh',
                    fontFamily: 'Arial, sans-serif',
                    textAlign: 'center'
                  }}>
                    <h1>✅ React is Working!</h1>
                    <p>This is a simple test page to verify React is rendering correctly.</p>
                    <p>Current state: Loading={loading ? 'true' : 'false'}, User={user ? user.email : 'none'}</p>
                    <button 
                      onClick={() => setUser({ email: 'test@example.com' })}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: '#10B981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        margin: '10px'
                      }}
                    >
                      Set Test User
                    </button>
                    <button 
                      onClick={() => window.location.reload()}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: '#3B82F6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        margin: '10px'
                      }}
                    >
                      Reload Page
                    </button>
                  </div>
                } 
              />
            </Routes>
          </ErrorBoundary>
        </main>
      </div>
    </Router>
  );
}

export default App;