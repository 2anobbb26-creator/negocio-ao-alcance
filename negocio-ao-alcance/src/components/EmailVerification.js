import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { authService } from '../services/firebase';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: linear-gradient(135deg, #0a1530 0%, #0d1b3e 50%, #0a1530 100%);
`;

const Card = styled.div`
  max-width: 480px;
  width: 100%;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(24px);
  border-radius: 24px;
  padding: 48px 40px;
  border: 1px solid rgba(74, 140, 247, 0.2);
  text-align: center;
  animation: ${fadeInUp} 0.5s ease-out;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);

  @media (max-width: 480px) {
    padding: 32px 24px;
  }
`;

const Icon = styled.div`
  font-size: 4rem;
  margin-bottom: 24px;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const Title = styled.h1`
  color: #e8eef7;
  font-size: 1.6rem;
  font-weight: 800;
  margin-bottom: 12px;
  letter-spacing: -0.5px;

  @media (max-width: 480px) {
    font-size: 1.3rem;
  }
`;

const Description = styled.p`
  color: #a8b8d8;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 32px;

  strong {
    color: #7eb8ff;
    font-weight: 700;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #4a8cf7, #a855f7);
  border: none;
  border-radius: 12px;
  color: #fff;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 12px;
  font-family: inherit;
  letter-spacing: 0.5px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(74, 140, 247, 0.4);
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const SecondaryButton = styled.button`
  width: 100%;
  padding: 12px;
  background: transparent;
  border: 1px solid rgba(168, 184, 216, 0.2);
  border-radius: 12px;
  color: #a8b8d8;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-family: inherit;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #e8eef7;
  }
`;

const Message = styled.div`
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 20px;
  background: ${props => props.$error 
    ? 'rgba(239, 68, 68, 0.1)' 
    : 'rgba(74, 222, 128, 0.1)'};
  border: 1px solid ${props => props.$error 
    ? 'rgba(239, 68, 68, 0.3)' 
    : 'rgba(74, 222, 128, 0.3)'};
  color: ${props => props.$error ? '#fca5a5' : '#86efac'};
`;

const EmailVerification = ({ user, onVerified }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [checking, setChecking] = useState(false);

  const handleResend = async () => {
    setLoading(true);
    setMessage(null);

    const result = await authService.resendVerificationEmail();

    if (result.success) {
      setMessage({ 
        type: 'success', 
        text: '📧 E-mail reenviado! Verifique sua caixa de entrada e o spam.' 
      });
    } else {
      setMessage({ 
        type: 'error', 
        text: '❌ ' + (result.error || 'Erro ao reenviar e-mail') 
      });
    }

    setLoading(false);
  };

  const handleCheckVerified = async () => {
    setChecking(true);
    setMessage(null);

    const result = await authService.reloadUser();

    if (result.success && result.emailVerified) {
      setMessage({ 
        type: 'success', 
        text: '✅ E-mail verificado! Redirecionando...' 
      });
      setTimeout(() => {
        if (onVerified) onVerified();
      }, 1500);
    } else {
      setMessage({ 
        type: 'error', 
        text: '❌ E-mail ainda não verificado. Verifique sua caixa de entrada.' 
      });
    }

    setChecking(false);
  };

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  return (
    <Container>
      <Card>
        <Icon>📧</Icon>
        <Title>Verifique seu e-mail</Title>
        <Description>
          Enviamos um link de verificação para<br />
          <strong>{user?.email}</strong><br /><br />
          Abra o e-mail e clique no link para ativar sua conta.
        </Description>

        {message && (
          <Message $error={message.type === 'error'}>
            {message.text}
          </Message>
        )}

        <Button onClick={handleCheckVerified} disabled={checking}>
          {checking ? '⏳ Verificando...' : '✅ Já verifiquei meu e-mail'}
        </Button>

        <Button onClick={handleResend} disabled={loading}>
          {loading ? '⏳ Enviando...' : '📧 Reenviar e-mail'}
        </Button>

        <SecondaryButton onClick={handleLogout}>
          🚪 Sair e usar outra conta
        </SecondaryButton>
      </Card>
    </Container>
  );
};

export default EmailVerification;