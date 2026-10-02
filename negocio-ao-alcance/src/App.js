import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import styled from 'styled-components';
import { GlobalStyle } from './styles/GlobalStyles';
import { authService } from './services/firebase';
import { notificationService } from './utils/notificationService';
import Navbar from './components/Navbar';
import InstallPrompt from './components/InstallPrompt';
import Home from './pages/Home';
import Login from './pages/Login';
import BusinessDetail from './pages/BusinessDetail';
import Perfil from './pages/Perfil';
import Favoritos from './pages/Favoritos';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a1530 0%, #0d1b3e 50%, #0a1530 100%);
`;

// 🔒 Rota que exige login
const PrivateRoute = ({ user, children }) => {
  return user ? children : <Navigate to="/login" replace />;
};

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

        const newNotifs = notificationService.checkForNewBusinesses(firebaseUser.uid);
        if (newNotifs.length > 0) {
          console.log('🔔 Novos negócios detectados:', newNotifs.length);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 📱 REGISTRAR SERVICE WORKER (PWA)
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/service-worker.js')
          .then((registration) => {
            console.log('✅ Service Worker registrado:', registration.scope);
          })
          .catch((error) => {
            console.warn('⚠️ Erro ao registrar Service Worker:', error);
          });
      });
    }
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
    <HelmetProvider>
      <Router>
        <GlobalStyle />
        <AppContainer>
          <Navbar user={user} onLogout={handleLogout} />
          <InstallPrompt />
          <Routes>
            <Route 
              path="/login" 
              element={user ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} onRegister={handleRegister} />} 
            />
            <Route 
              path="/register" 
              element={user ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} onRegister={handleRegister} />} 
            />

            {/* 🔓 ROTAS PÚBLICAS (funcionam sem login) */}
            <Route path="/business/:id" element={<BusinessDetail user={user} />} />

            {/* 🔒 ROTAS PRIVADAS */}
            <Route 
              path="/" 
              element={<PrivateRoute user={user}><Home user={user} /></PrivateRoute>} 
            />
            <Route 
              path="/perfil" 
              element={<PrivateRoute user={user}><Perfil /></PrivateRoute>} 
            />
            <Route 
              path="/favoritos" 
              element={<PrivateRoute user={user}><Favoritos /></PrivateRoute>} 
            />
          </Routes>
        </AppContainer>
      </Router>
    </HelmetProvider>
  );
}

export default App;