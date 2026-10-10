import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import styled, { keyframes } from 'styled-components';
import { GlobalStyle } from './styles/GlobalStyles';
import { authService } from './services/firebase';
import { notificationService } from './utils/notificationService';
import Navbar from './components/Navbar';
import InstallPrompt from './components/InstallPrompt';

// ─── IMPORTS NORMAIS (não-lazy) ────────────────────────────
// Navbar e InstallPrompt ficam fora porque aparecem em todas as páginas

// ─── IMPORTS LAZY (só baixam quando o usuário entra) ──────
const Home = React.lazy(() => import('./pages/Home'));
const Login = React.lazy(() => import('./pages/Login'));
const BusinessDetail = React.lazy(() => import('./pages/BusinessDetail'));
const Perfil = React.lazy(() => import('./pages/Perfil'));
const Favoritos = React.lazy(() => import('./pages/Favoritos'));
const EmailVerification = React.lazy(() => import('./components/EmailVerification'));

// ─── ANIMAÇÕES ─────────────────────────────────────────────
const pageEnter = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

// ─── CONTAINERS ────────────────────────────────────────────
const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a1530 0%, #0d1b3e 50%, #0a1530 100%);
  padding-bottom: 0;

  @media (max-width: 768px) {
    padding-bottom: calc(64px + env(safe-area-inset-bottom, 0));
  }
`;

const PageWrapper = styled.div`
  animation: ${pageEnter} 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: opacity, transform;
`;

// ─── FALLBACK DE SUSPENSE (SKELETON) ──────────────────────
const SuspenseFallback = styled.div`
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  gap: 20px;
`;

const FallbackCard = styled.div`
  width: 100%;
  max-width: 340px;
  height: 280px;
  border-radius: 20px;
  background: linear-gradient(90deg,
    rgba(255, 255, 255, 0.03) 0%,
    rgba(255, 255, 255, 0.07) 50%,
    rgba(255, 255, 255, 0.03) 100%);
  background-size: 800px 100%;
  animation: ${shimmer} 1.6s infinite linear;
  border: 1px solid rgba(255, 255, 255, 0.04);
`;

// ─── FALLBACK SIMPLES PRA SUSPENSE ────────────────────────
const LazyFallback = () => (
  <SuspenseFallback>
    <FallbackCard />
  </SuspenseFallback>
);

// ─── TRANSIÇÃO DE PÁGINA ──────────────────────────────────
const PageTransition = ({ children }) => {
  const location = useLocation();
  return <PageWrapper key={location.pathname}>{children}</PageWrapper>;
};

// ─── ROTA PRIVADA ──────────────────────────────────────────
const PrivateRoute = ({ user, children }) => {
  return user ? children : <Navigate to="/login" replace />;
};

// ─── CONTEÚDO DAS ROTAS ────────────────────────────────────
const AppRoutes = ({ user, handleLogin, handleRegister }) => {
  const location = useLocation();

  return (
    <PageTransition>
      <Suspense fallback={<LazyFallback />}>
        <Routes location={location} key={location.pathname}>
          <Route
            path="/login"
            element={user ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} onRegister={handleRegister} />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} onRegister={handleRegister} />}
          />

          {/* 🔓 ROTAS PÚBLICAS */}
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
      </Suspense>
    </PageTransition>
  );
};

// ─── APP PRINCIPAL ─────────────────────────────────────────
function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [needsVerification, setNeedsVerification] = useState(false);

  useEffect(() => {
    const splash = document.getElementById('splash-screen');
    if (splash) {
      setTimeout(() => {
        splash.classList.add('hidden');
        setTimeout(() => splash.remove(), 500);
      }, 300);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        if (!firebaseUser.emailVerified) {
          console.log('📧 E-mail não verificado:', firebaseUser.email);
          setUser({
            ...firebaseUser,
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuário',
          });
          setNeedsVerification(true);
          setLoading(false);
          return;
        }

        setNeedsVerification(false);
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
        setNeedsVerification(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
    if (!result.success && result.error === 'EMAIL_NOT_VERIFIED') {
      return { success: false, error: 'EMAIL_NOT_VERIFIED', user: result.user };
    }
    if (result.success) return { success: true };
    return { success: false, error: result.error };
  };

  const handleRegister = async (email, password, name, phone) => {
    const result = await authService.register(email, password, name, phone);
    if (result.success) return { success: true };
    return { success: false, error: result.error };
  };

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    setNeedsVerification(false);
  };

  if (loading) {
    return (
      <div style={{ color: '#fff', textAlign: 'center', marginTop: '50px', fontSize: '1.2rem' }}>
        Carregando...
      </div>
    );
  }

  if (user && needsVerification) {
    return (
      <HelmetProvider>
        <Router>
          <GlobalStyle />
          <Suspense fallback={<LazyFallback />}>
            <EmailVerification
              user={user}
              onVerified={() => {
                setNeedsVerification(false);
                window.location.reload();
              }}
            />
          </Suspense>
        </Router>
      </HelmetProvider>
    );
  }

  return (
    <HelmetProvider>
      <Router>
        <GlobalStyle />
        <AppContainer>
          <Navbar user={user} onLogout={handleLogout} />
          <InstallPrompt />
          <AppRoutes
            user={user}
            handleLogin={handleLogin}
            handleRegister={handleRegister}
          />
        </AppContainer>
      </Router>
    </HelmetProvider>
  );
}

export default App;