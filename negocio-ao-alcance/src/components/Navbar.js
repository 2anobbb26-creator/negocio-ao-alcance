import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Notifications from './Notifications';

// ─── NAVBAR DE TOPO ────────────────────────────────────────
const Nav = styled.nav`
  background: rgba(10, 14, 39, 0.85);
  padding: 16px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(74, 140, 247, 0.15);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  position: sticky;
  top: 0;
  z-index: 1000;
  gap: 15px;

  @media (max-width: 768px) {
    padding: 12px 16px;
  }
`;

const Logo = styled(Link)`
  font-family: 'Arial Black', 'Impact', sans-serif;
  font-size: 1.5rem;
  text-decoration: none;
  font-weight: 900;
  letter-spacing: -0.5px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #ffffff 0%, #d0e0ff 20%, #7eb8ff 45%, #4a8cf7 70%, #6366f1 90%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  flex-shrink: 0;

  @media (max-width: 768px) {
    font-size: 1.15rem;
  }

  @media (max-width: 380px) {
    font-size: 1rem;
  }
`;

// ─── LINKS DESKTOP ─────────────────────────────────────────
const NavLinks = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: #a8b8d8;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.3s;
  padding: 10px 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    color: #fff;
    background: rgba(74, 140, 247, 0.15);
    transform: translateY(-2px);
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: #a8b8d8;
  padding: 6px 6px 6px 16px;
  background: rgba(74, 140, 247, 0.08);
  border-radius: 24px;
  border: 1px solid rgba(74, 140, 247, 0.15);
`;

const UserName = styled.span`
  font-weight: 700;
  color: #e8eef7;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 140px;
`;

const LogoutButton = styled.button`
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.9), rgba(220, 38, 38, 0.9));
  color: #fff;
  border: none;
  padding: 8px 18px;
  border-radius: 18px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 700;
  font-size: 0.85rem;
  letter-spacing: 0.3px;
  font-family: inherit;

  &:hover {
    background: linear-gradient(135deg, #ef4444, #dc2626);
    transform: translateY(-2px);
  }
`;

// ─── MOBILE: ÁREA DIREITA DA NAVBAR ────────────────────────
const MobileRight = styled.div`
  display: none;
  align-items: center;
  gap: 12px;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const MobileAvatar = styled(Link)`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #4a8cf7 0%, #7eb8ff 50%, #a855f7 100%);
  color: #fff;
  font-weight: 800;
  font-size: 0.85rem;
  text-decoration: none;
  border: 2px solid rgba(74, 140, 247, 0.4);
  box-shadow: 0 0 0 3px rgba(74, 140, 247, 0.1);
  letter-spacing: -0.5px;
  flex-shrink: 0;
`;

// ─── MOBILE: BOTÃO DE LOGIN ────────────────────────────────
const MobileLoginButton = styled(Link)`
  padding: 8px 16px;
  background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
  border: 1px solid rgba(74, 140, 247, 0.4);
  border-radius: 10px;
  color: #fff;
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 700;
  text-decoration: none;
  letter-spacing: 0.4px;

  &:active {
    transform: scale(0.96);
  }
`;

// ─── BOTTOM NAVIGATION (mobile) ────────────────────────────
const BottomNav = styled.nav`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 64px;
    background: rgba(10, 14, 39, 0.96);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border-top: 1px solid rgba(74, 140, 247, 0.18);
    box-shadow: 0 -8px 24px rgba(0, 0, 0, 0.35);
    z-index: 999;
    padding-bottom: env(safe-area-inset-bottom, 0);
    justify-content: space-around;
    align-items: stretch;
  }
`;

const BottomNavItem = styled(Link)`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  text-decoration: none;
  color: ${props => props.$active ? '#7eb8ff' : '#7a8a9e'};
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.3px;
  position: relative;
  transition: color 0.25s ease;
  padding: 8px 0;

  svg {
    width: 22px;
    height: 22px;
    transition: transform 0.25s ease;
    stroke-width: ${props => props.$active ? '2.4' : '1.8'};
  }

  &:active {
    svg { transform: scale(0.9); }
  }

  span {
    text-transform: uppercase;
  }

  /* Barra azul em cima quando ativo */
  ${props => props.$active && `
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 28px;
      height: 3px;
      background: linear-gradient(90deg, #4a8cf7, #a855f7);
      border-radius: 0 0 3px 3px;
      box-shadow: 0 2px 8px rgba(74, 140, 247, 0.5);
    }

    svg {
      filter: drop-shadow(0 0 6px rgba(74, 140, 247, 0.5));
    }
  `}
`;

const FavoriteBadge = styled.span`
  position: absolute;
  top: 4px;
  right: 50%;
  transform: translateX(14px);
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 8px;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: #fff;
  font-size: 0.58rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(10, 14, 39, 0.96);
  box-shadow: 0 2px 6px rgba(239, 68, 68, 0.4);
`;

// ─── ÍCONES SVG INLINE ─────────────────────────────────────
const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

// ─── HELPERS ───────────────────────────────────────────────
const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
};

// ─── COMPONENTE ────────────────────────────────────────────
const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  // Verifica se está em uma página de autenticação
  const isAuthPage =
    location.pathname === '/login' ||
    location.pathname === '/register';

  // Verifica rota ativa pra bottom nav
  const isActive = (path) => location.pathname === path;

  const displayName = user?.displayName || user?.name || 'Usuário';

  return (
    <>
      <Nav>
        <Logo to={user ? "/" : "/login"}>
          Negócio ao Alcance
        </Logo>

        {/* 💻 DESKTOP: links normais */}
        <NavLinks>
          {user ? (
            <>
              <NavLink to="/">🏠 Início</NavLink>
              <NavLink to="/favoritos">❤️ Favoritos</NavLink>
              <NavLink to="/perfil">👤 Perfil</NavLink>
              <Notifications />
              <UserInfo>
                <UserName>👋 {displayName}</UserName>
                <LogoutButton onClick={handleLogout}>Sair</LogoutButton>
              </UserInfo>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Cadastrar</NavLink>
            </>
          )}
        </NavLinks>

        {/* 📱 MOBILE: avatar + notificações OU botão de login */}
        <MobileRight>
          {user ? (
            <>
              <Notifications />
              <MobileAvatar to="/perfil" title={displayName}>
                {getInitials(displayName)}
              </MobileAvatar>
            </>
          ) : (
            <MobileLoginButton to="/login">Entrar</MobileLoginButton>
          )}
        </MobileRight>
      </Nav>

      {/* 📱 BOTTOM NAVIGATION (só no mobile e quando logado e não em página auth) */}
      {user && !isAuthPage && (
        <BottomNav>
          <BottomNavItem to="/" $active={isActive('/')}>
            <HomeIcon />
            <span>Início</span>
          </BottomNavItem>

          <BottomNavItem to="/favoritos" $active={isActive('/favoritos')}>
            <HeartIcon />
            <span>Favoritos</span>
          </BottomNavItem>

          <BottomNavItem to="/perfil" $active={isActive('/perfil')}>
            <UserIcon />
            <span>Perfil</span>
          </BottomNavItem>
        </BottomNav>
      )}
    </>
  );
};

export default Navbar;