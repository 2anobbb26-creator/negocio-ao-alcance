import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  flex-wrap: wrap;
  gap: 15px;

  @media (max-width: 768px) {
    padding: 12px 20px;
    flex-direction: column;
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

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const LogoIcon = styled.span`
  font-size: 1.6rem;
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 12px;
    justify-content: center;
    width: 100%;
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

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const UserName = styled.span`
  font-weight: 700;
  color: #e8eef7;
  font-size: 0.9rem;
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

  &:hover {
    background: linear-gradient(135deg, #ef4444, #dc2626);
    transform: translateY(-2px);
  }
`;

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <Nav>
      <Logo to={user ? "/" : "/login"}>
        <LogoIcon>🚀</LogoIcon>
        Negócio ao Alcance
      </Logo>
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
    </Nav>
  );
};

export default Navbar;