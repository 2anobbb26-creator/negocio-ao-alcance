import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
  background: rgba(10, 14, 39, 0.95);
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(102, 126, 234, 0.15);
  backdrop-filter: blur(10px);
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
  color: #fff;
  text-decoration: none;
  background: linear-gradient(135deg, #ffffff 0%, #7eb8ff 25%, #4a8cf7 50%, #6366f1 75%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 900;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 15px;
    justify-content: center;
    width: 100%;
  }
`;

const NavLink = styled(Link)`
  color: #b8c6db;
  text-decoration: none;
  font-size: 1rem;
  transition: all 0.3s;
  padding: 8px 16px;
  border-radius: 8px;

  &:hover {
    color: #fff;
    background: rgba(102, 126, 234, 0.15);
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 6px 12px;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  color: #b8c6db;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const UserName = styled.span`
  font-weight: 600;
  color: #fff;
`;

const LogoutButton = styled.button`
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 600;

  &:hover {
    background: rgba(239, 68, 68, 0.3);
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 0.9rem;
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
      <Logo to={user ? "/" : "/login"}>🚀 Negócio ao Alcance</Logo>
      <NavLinks>
        {user ? (
          <>
            <NavLink to="/">Início</NavLink>
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