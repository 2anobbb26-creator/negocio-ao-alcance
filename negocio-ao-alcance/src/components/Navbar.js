import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
  background: rgba(10, 14, 39, 0.85);
  padding: 16px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(102, 126, 234, 0.15);
  backdrop-filter: blur(24px);
  position: sticky;
  top: 0;
  z-index: 1000;
  flex-wrap: wrap;
  gap: 15px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.3), rgba(168, 85, 247, 0.3), transparent);
  }

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
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #ffffff 0%, #d0e0ff 20%, #7eb8ff 45%, #4a8cf7 70%, #6366f1 90%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;

  &:hover {
    filter: drop-shadow(0 0 20px rgba(102, 126, 234, 0.6));
    transform: scale(1.02);
  }

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const LogoIcon = styled.span`
  font-size: 1.6rem;
  filter: drop-shadow(0 0 10px rgba(102, 126, 234, 0.5));
  
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
  color: #b8c6db;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.3s;
  padding: 10px 20px;
  border-radius: 10px;
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: '';
    position: absolute;
    bottom: 4px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, #667eea, #a855f7);
    border-radius: 2px;
    transition: width 0.3s ease;
  }

  &:hover {
    color: #fff;
    background: rgba(102, 126, 234, 0.15);
    transform: translateY(-2px);

    &::before {
      width: 60%;
    }
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: #b8c6db;
  padding: 6px 6px 6px 16px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(168, 85, 247, 0.1));
  border-radius: 24px;
  border: 1px solid rgba(102, 126, 234, 0.2);

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const UserName = styled.span`
  font-weight: 700;
  color: #fff;
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
    box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
  }

  &:active {
    transform: translateY(0) scale(0.98);
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
        <LogoIcon></LogoIcon>
        Negócio ao Alcance
      </Logo>
      <NavLinks>
        {user ? (
          <>
            <NavLink to="/perfil">
              👤 Perfil
            </NavLink>
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