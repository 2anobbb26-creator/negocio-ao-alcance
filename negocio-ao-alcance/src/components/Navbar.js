import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import Notifications from './Notifications';

// ─── ANIMAÇÕES ─────────────────────────────────────────────
const slideDown = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// ─── NAVBAR PRINCIPAL ──────────────────────────────────────
const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 72px;
  background: linear-gradient(90deg, 
    rgba(10, 15, 35, 0.9) 0%, 
    rgba(20, 25, 60, 0.85) 50%, 
    rgba(10, 15, 35, 0.9) 100%
  );
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-bottom: 1px solid rgba(126, 184, 255, 0.15);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3), inset 0 -1px 0 rgba(255,255,255,0.05);

  @media (max-width: 768px) {
    height: 64px;
    padding: 0 16px;
  }
`;

// ─── LOGO ──────────────────────────────────────────────────
const Logo = styled(Link)`
  font-family: 'Arial Black', 'Impact', sans-serif;
  font-size: 1.4rem;
  font-weight: 900;
  letter-spacing: -0.5px;
  text-decoration: none;
  background: linear-gradient(135deg, #ffffff 0%, #a5c9ff 40%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  filter: drop-shadow(0 0 10px rgba(168, 85, 247, 0.3));

  @media (max-width: 1100px) { font-size: 1.2rem; }
  @media (max-width: 768px) { font-size: 1.15rem; }
`;

// ─── MENU CENTRAL ──────────────────────────────────────────
const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);

  @media (max-width: 1024px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: ${p => p.$active ? '#fff' : '#8899aa'};
  background: ${p => p.$active 
    ? 'linear-gradient(135deg, rgba(74, 140, 247, 0.25), rgba(168, 85, 247, 0.25))' 
    : 'transparent'};
  border: 1px solid ${p => p.$active ? 'rgba(126, 184, 255, 0.4)' : 'transparent'};
  padding: 8px 16px;
  border-radius: 10px;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.25s ease;
  white-space: nowrap;
  box-shadow: ${p => p.$active ? '0 0 15px rgba(74, 140, 247, 0.2)' : 'none'};

  svg {
    width: 18px;
    height: 18px;
    stroke-width: 2;
    color: ${p => p.$iconColor || '#fff'};
    transition: all 0.3s;
  }

  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.05);
    svg { filter: drop-shadow(0 0 8px ${p => p.$iconColor || '#fff'}); }
  }
`;

// ─── MENU DROPDOWN ─────────────────────────────────────────
const DropdownWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-left: 4px;
`;

const DotsButton = styled.button`
  background: ${p => p.$open ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};
  border: 1px solid ${p => p.$open ? 'rgba(255,255,255,0.2)' : 'transparent'};
  color: #8899aa;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover { background: rgba(255, 255, 255, 0.08); color: #fff; }
  svg { width: 18px; height: 18px; }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  background: rgba(15, 23, 50, 0.98);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(126, 184, 255, 0.2);
  border-radius: 14px;
  padding: 8px;
  min-width: 200px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(74, 140, 247, 0.1);
  animation: ${slideDown} 0.2s ease-out;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const DropdownItem = styled(Link)`
  padding: 10px 12px;
  color: #a8b8d8;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 600;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.2s;

  &:hover {
    background: rgba(74, 140, 247, 0.15);
    color: #fff;
    transform: translateX(4px);
  }
`;

// ─── ÁREA DO USUÁRIO ───────────────────────────────────────
const UserArea = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Divider = styled.div`
  width: 1px;
  height: 24px;
  background: linear-gradient(to bottom, transparent, rgba(126, 184, 255, 0.3), transparent);
  margin: 0 4px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 4px 4px 14px;
  background: rgba(74, 140, 247, 0.08);
  border: 1px solid rgba(74, 140, 247, 0.2);
  border-radius: 100px;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);

  @media (max-width: 768px) { display: none; }
`;

const UserName = styled.span`
  color: #e8eef7;
  font-size: 0.82rem;
  font-weight: 600;
  white-space: nowrap;
`;

const Avatar = styled(Link)`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4a8cf7, #a855f7);
  color: #fff;
  font-weight: 800;
  font-size: 0.75rem;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 0 12px rgba(168, 85, 247, 0.4);
  transition: all 0.3s;

  &:hover { box-shadow: 0 0 20px rgba(168, 85, 247, 0.6); transform: scale(1.05); }
`;

const LogoutBtn = styled.button`
  background: transparent;
  border: none;
  color: #8899aa;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover { background: rgba(239, 68, 68, 0.15); color: #f87171; }
  svg { width: 16px; height: 16px; }
`;

// ─── MOBILE ────────────────────────────────────────────────
const MobileActions = styled.div`
  display: none;
  align-items: center;
  gap: 12px;

  @media (max-width: 768px) { display: flex; }
`;

const MobileAvatar = styled(Link)`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4a8cf7, #a855f7);
  color: #fff;
  font-weight: 800;
  font-size: 0.8rem;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 0 10px rgba(168, 85, 247, 0.4);
`;

const LoginBtnMobile = styled(Link)`
  background: linear-gradient(135deg, #2563eb, #4f7cff);
  color: #fff;
  padding: 8px 16px;
  border-radius: 10px;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 700;
  box-shadow: 0 4px 15px rgba(37, 99, 235, 0.4);
`;

// ─── BOTTOM NAV (MOBILE) ───────────────────────────────────
const BottomNav = styled.nav`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 64px;
    background: rgba(10, 15, 35, 0.95);
    backdrop-filter: blur(24px);
    border-top: 1px solid rgba(126, 184, 255, 0.15);
    z-index: 999;
    justify-content: space-around;
    align-items: stretch;
    padding-bottom: env(safe-area-inset-bottom, 0);
    box-shadow: 0 -4px 20px rgba(0,0,0,0.4);
  }
`;

const BottomNavItem = styled(Link)`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  text-decoration: none;
  color: ${p => p.$active ? '#fff' : '#6b7a90'};
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  transition: all 0.2s;
  position: relative;

  svg {
    width: 22px;
    height: 22px;
    stroke-width: ${p => p.$active ? '2.5' : '1.8'};
    color: ${p => p.$active ? p.$iconColor : '#6b7a90'};
    transition: all 0.2s;
  }

  ${p => p.$active && `
    &::before {
      content: '';
      position: absolute;
      top: 0;
      width: 32px;
      height: 3px;
      background: ${p.$iconColor || '#7eb8ff'};
      border-radius: 0 0 3px 3px;
      box-shadow: 0 0 10px ${p.$iconColor || '#7eb8ff'};
    }
    svg { filter: drop-shadow(0 0 8px ${p.$iconColor || '#7eb8ff'}); }
  `}
`;

// ─── ÍCONES ────────────────────────────────────────────────
const IcoHome = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>;
const IcoTarget = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>;
const IcoHeart = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>;
const IcoUser = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
const IcoDots = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" /></svg>;
const IcoLogout = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>;
const IcoBrain = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0-1.32 4.24 3 3 0 0 0 .34 5.58 2.5 2.5 0 0 0 2.96 3.08A2.5 2.5 0 0 0 12 19.5a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 12 4.5" /></svg>;

const getInitials = (name) => name ? name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() : '?';

// ─── COMPONENTE ────────────────────────────────────────────
const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMoreOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;
  const displayName = user?.displayName || user?.name || 'Usuário';

  return (
    <>
      <Nav>
        <Logo to={user ? "/" : "/login"}>Negócio ao Alcance</Logo>

        {user && (
          <NavLinks>
            <NavLink to="/" $active={isActive('/')} $iconColor="#7eb8ff">
              <IcoHome /> Início
            </NavLink>
            <NavLink to="/meus-planos" $active={isActive('/meus-planos')} $iconColor="#a855f7">
              <IcoTarget /> Planos
            </NavLink>
            <NavLink to="/favoritos" $active={isActive('/favoritos')} $iconColor="#ec4899">
              <IcoHeart /> Favoritos
            </NavLink>
            
            <DropdownWrapper ref={menuRef}>
              <DotsButton $open={moreOpen} onClick={() => setMoreOpen(!moreOpen)}>
                <IcoDots />
              </DotsButton>
              {moreOpen && (
                <DropdownMenu>
                  <DropdownItem to="/consultor" onClick={() => setMoreOpen(false)}>🧠 Consultor Inteligente</DropdownItem>
                  <DropdownItem to="/ferramentas" onClick={() => setMoreOpen(false)}>🧰 Ferramentas</DropdownItem>
                  <DropdownItem to="/guia" onClick={() => setMoreOpen(false)}>📚 Guia</DropdownItem>
                  <DropdownItem to="/sobre" onClick={() => setMoreOpen(false)}>💙 Sobre</DropdownItem>
                </DropdownMenu>
              )}
            </DropdownWrapper>
          </NavLinks>
        )}

        <UserArea>
          {user ? (
            <>
              <Notifications />
              <Divider />
              <UserInfo>
                <UserName>{displayName.split(' ')[0]}</UserName>
                <Avatar to="/perfil">{getInitials(displayName)}</Avatar>
                <LogoutBtn onClick={handleLogout} title="Sair">
                  <IcoLogout />
                </LogoutBtn>
              </UserInfo>
            </>
          ) : (
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <Link to="/login" style={{ color: '#fff', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>Entrar</Link>
              <Link to="/register" style={{ background: 'linear-gradient(135deg, #2563eb, #4f7cff)', color: '#fff', padding: '8px 16px', borderRadius: 10, textDecoration: 'none', fontSize: '0.85rem', fontWeight: 700, boxShadow: '0 4px 15px rgba(37,99,235,0.3)' }}>Criar Conta</Link>
            </div>
          )}
        </UserArea>

        <MobileActions>
          {user ? (
            <>
              <Notifications />
              <MobileAvatar to="/perfil">{getInitials(displayName)}</MobileAvatar>
            </>
          ) : (
            <LoginBtnMobile to="/login">Entrar</LoginBtnMobile>
          )}
        </MobileActions>
      </Nav>

      {user && (
        <BottomNav>
          <BottomNavItem to="/" $active={isActive('/')} $iconColor="#7eb8ff"><IcoHome /> Início</BottomNavItem>
          <BottomNavItem to="/meus-planos" $active={isActive('/meus-planos')} $iconColor="#a855f7"><IcoTarget /> Planos</BottomNavItem>
          <BottomNavItem to="/consultor" $active={isActive('/consultor')} $iconColor="#a855f7"><IcoBrain /> Consultor</BottomNavItem>
          <BottomNavItem to="/favoritos" $active={isActive('/favoritos')} $iconColor="#ec4899"><IcoHeart /> Favoritos</BottomNavItem>
          <BottomNavItem to="/perfil" $active={isActive('/perfil')} $iconColor="#7eb8ff"><IcoUser /> Perfil</BottomNavItem>
        </BottomNav>
      )}
    </>
  );
};

export default Navbar;