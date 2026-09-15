import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { GlobalStyle } from './styles/GlobalStyles';
import { authService } from './services/firebase';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import BusinessDetail from './pages/BusinessDetail';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1a3e 30%, #16213e 60%, #1a1a4e 80%, #2d1b69 100%);
`;

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setUser({
          ...firebaseUser,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuário',
          phone: '',
          favorites: [],
          searchHistory: []
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (email, password) => {
    const result = await authService.login(email, password);
    if (result.success) {
      return { success: true };
    } else {
      return { success: false, error: result.error };
    }
  };

  const handleRegister = async (email, password, name, phone) => {
    const result = await authService.register(email, password, name, phone);
    if (result.success) {
      return { success: true };
    } else {
      return { success: false, error: result.error };
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
  };

  if (loading) {
    return <div style={{ color: '#fff', textAlign: 'center', marginTop: '50px' }}>Carregando...</div>;
  }

  return (
    <Router>
      <GlobalStyle />
      <AppContainer>
        <Navbar user={user} onLogout={handleLogout} />
        <Routes>
          <Route 
            path="/login" 
            element={user ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} onRegister={handleRegister} />} 
          />
          <Route 
            path="/register" 
            element={user ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} onRegister={handleRegister} />} 
          />
          <Route 
            path="/" 
            element={user ? <Home /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/business/:id" 
            element={user ? <BusinessDetail /> : <Navigate to="/login" replace />} 
          />
        </Routes>
      </AppContainer>
    </Router>
  );
}

export default App;