import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { GlobalStyle } from './styles/GlobalStyles';
import { authService } from './services/firebase';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import BusinessDetail from './pages/BusinessDetail';
import Perfil from './pages/Perfil';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a1530 0%, #0d1b3e 50%, #0a1530 100%);
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
    }
    return { success: false, error: result.error };
  };

  const handleRegister = async (email, password, name, phone) => {
    const result = await authService.register(email, password, name, phone);
    if (result.success) {
      return { success: true };
    }
    return { success: false, error: result.error };
  };

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
  };

  if (loading) {
    return (
      <div style={{ color: '#fff', textAlign: 'center', marginTop: '50px', fontSize: '1.2rem' }}>
        Carregando...
      </div>
    );
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
            element={user ? <Home user={user} /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/perfil" 
            element={user ? <Perfil /> : <Navigate to="/login" replace />} 
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