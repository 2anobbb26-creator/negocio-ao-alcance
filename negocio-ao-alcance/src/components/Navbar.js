import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Notifications from './Notifications';

const Nav = styled.nav`
  background: rgba(10, 14, 39, 0.85);
  padding: 16px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(74, 140, 247, 0.15);
  backdrop-filter: blur(24px);
  position: sticky;
  top: 0;
  z-index: 1000;
  gap: 15px;

  @media (max-width: 768px) {
    padding: 12px 20px;
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

/* 🆕 Botão hambúrguer (visível só no mobile) */
const MenuButton = styled.button`
  display: none;
  background: rgba(74, 140, 247, 0.1);
  border: 1px solid rgba(74, 140, 247, 0.25);
  border-radius: 10px;
  color: #7eb8ff;
  width: 42px;
  height: 42px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;
  padding: 0;
  flex-shrink: 0;
  z-index: 1001;

  &:hover {
    background: rgba(74, 140, 247, 0.2);
    color: #fff;
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    width: 22px;
    height: 22px;
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;

/* 🆕 Painel do menu mobile */
const MobileMenu = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 8px;
    position: fixed;
    top: 0;
    right: 0;
    width: 78%;
    max-width: 320px;
    height: 100vh;
    background: rgba(10, 14, 39, 0.98);
    backdrop-filter: blur(30px);
    padding: 80px 24px 32px;
    border-left: 1px solid rgba(74, 140, 247, 0.2);
    box-shadow: -20px 0 60px rgba(0, 0, 0, 0.5);
    transform: translateX(${props => props.$open ? '0' : '100%'});
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow-y: auto;
    z-index: 999;
  }
`;

/* 🆕 Overlay escuro atrás do menu */
const Overlay = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: ${props => props.$open ? 'block' : 'none'};
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    z-index: 998;
    animation: fadeIn 0.2s ease-out;

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  }
`;

/* 🆕 Container dos links no desktop */
const NavLinks = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    display: none;
  }
`;

/* 🆕 Container dos links no mobile */
const MobileLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
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

  @media (max-width: 768px) {
    padding: 14px 18px;
    font-size: 1rem;
    background: rgba(74, 140, 247, 0.06);
    border: 1px solid rgba(74, 140, 247, 0.1);

    &:hover {
      transform: none;
      background: rgba(74, 140, 247, 0.15);
    }
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

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    padding: 16px;
    border-radius: 14px;
    gap: 14px;
    margin-top: 12px;
  }
`;

const UserName = styled.span`
  font-weight: 700;
  color: #e8eef7;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 140px;

  @media (max-width: 768px) {
    font-size: 1rem;
    max-width: 100%;
    text-align: center;
  }
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

  @media (max-width: 768px) {
    width: 100%;
    padding: 12px 18px;
    font-size: 0.95rem;
    border-radius: 12px;
  }
`;

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // 🔒 Fecha o menu ao mudar de rota
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // 🔒 Trava o scroll do body quando o menu está aberto
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const handleLogout = () => {
    setMenuOpen(false);
    onLogout();
    navigate('/login');
  };

  const toggleMenu = () => setMenuOpen(prev => !prev);

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
                <UserName>👋 {user?.displayName || user?.name || 'Usuário'}</UserName>
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

        {/* 📱 MOBILE: botão hambúrguer */}
        <MenuButton onClick={toggleMenu} aria-label="Menu">
          {menuOpen ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </MenuButton>
      </Nav>

      {/* 📱 MENU MOBILE + OVERLAY */}
      <Overlay $open={menuOpen} onClick={() => setMenuOpen(false)} />
      <MobileMenu $open={menuOpen}>
        <MobileLinks>
          {user ? (
            <>
              <NavLink to="/">🏠 Início</NavLink>
              <NavLink to="/favoritos">❤️ Favoritos</NavLink>
              <NavLink to="/perfil">👤 Perfil</NavLink>
              <Notifications />
              <UserInfo>
                <UserName>👋 {user?.displayName || user?.name || 'Usuário'}</UserName>
                <LogoutButton onClick={handleLogout}>Sair</LogoutButton>
              </UserInfo>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Cadastrar</NavLink>
            </>
          )}
        </MobileLinks>
      </MobileMenu>
    </>
  );
};

export default Navbar;