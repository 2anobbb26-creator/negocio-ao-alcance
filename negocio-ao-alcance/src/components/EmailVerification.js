import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { authService } from '../services/firebase';

// 🎨 ANIMAÇÕES
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-12px) rotate(3deg); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(74, 140, 247, 0.4); }
  50% { transform: scale(1.05); box-shadow: 0 0 0 20px rgba(74, 140, 247, 0); }
`;

const shimmer = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 300% 50%; }
`;

const envelope = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-8px) rotate(-5deg); }
  75% { transform: translateY(-8px) rotate(5deg); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

// 🎨 CONTAINER PRINCIPAL
const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: linear-gradient(135deg, #0a1530 0%, #0d1b3e 50%, #0a1530 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -150px;
    right: -150px;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(74, 140, 247, 0.15) 0%, transparent 70%);
    border-radius: 50%;
    animation: ${float} 12s ease-in-out infinite;
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -150px;
    left: -150px;
    width: 450px;
    height: 450px;
    background: radial-gradient(circle, rgba(126, 184, 255, 0.12) 0%, transparent 70%);
    border-radius: 50%;
    animation: ${float} 15s ease-in-out infinite reverse;
    pointer-events: none;
  }
`;

// 🔵 CARD
const Card = styled.div`
  max-width: 480px;
  width: 100%;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(24px);
  border-radius: 28px;
  padding: 56px 44px 44px;
  position: relative;
  text-align: center;
  animation: ${fadeInUp} 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 28px;
    padding: 1.5px;
    background: linear-gradient(
      135deg,
      rgba(74, 140, 247, 0.6) 0%,
      rgba(126, 184, 255, 0.4) 25%,
      rgba(37, 99, 235, 0.5) 50%,
      rgba(126, 184, 255, 0.4) 75%,
      rgba(74, 140, 247, 0.6) 100%
    );
    background-size: 300% 300%;
    animation: ${shimmer} 6s linear infinite;
    -webkit-mask: 
      linear-gradient(#fff 0 0) content-box, 
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }

  @media (max-width: 480px) {
    padding: 40px 24px 32px;
    border-radius: 22px;

    &::before {
      border-radius: 22px;
    }
  }
`;

// 📧 ÍCONE DO ENVELOPE
const IconWrapper = styled.div`
  width: 100px;
  height: 100px;
  margin: 0 auto 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(74, 140, 247, 0.15), rgba(37, 99, 235, 0.15));
  border-radius: 50%;
  border: 2px solid rgba(74, 140, 247, 0.25);
  position: relative;
  animation: ${pulse} 2.5s ease-in-out infinite;

  &::after {
    content: '';
    position: absolute;
    inset: -6px;
    border-radius: 50%;
    border: 1px dashed rgba(126, 184, 255, 0.3);
    animation: ${spin} 20s linear infinite;
  }

  @media (max-width: 480px) {
    width: 80px;
    height: 80px;
  }
`;

const Envelope = styled.span`
  font-size: 3rem;
  animation: ${envelope} 3s ease-in-out infinite;
  display: inline-block;

  @media (max-width: 480px) {
    font-size: 2.4rem;
  }
`;

// 📝 TÍTULOS
const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 800;
  margin-bottom: 12px;
  letter-spacing: -0.5px;
  line-height: 1.2;
  background: linear-gradient(135deg, 
    #ffffff 0%, 
    #d0e0ff 40%, 
    #7eb8ff 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 480px) {
    font-size: 1.4rem;
  }
`;

const Description = styled.p`
  color: #a8b8d8;
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0 0 8px;
`;

const EmailHighlight = styled.div`
  display: inline-block;
  padding: 8px 18px;
  background: rgba(74, 140, 247, 0.1);
  border: 1px solid rgba(74, 140, 247, 0.25);
  border-radius: 12px;
  color: #7eb8ff;
  font-weight: 700;
  font-size: 0.95rem;
  margin-bottom: 24px;
  word-break: break-all;
  letter-spacing: 0.2px;

  @media (max-width: 480px) {
    font-size: 0.85rem;
    padding: 6px 14px;
  }
`;

const Hint = styled.p`
  color: #8899aa;
  font-size: 0.85rem;
  margin: 0 0 28px;
  line-height: 1.5;

  strong {
    color: #fbbf24;
    font-weight: 700;
  }
`;

// 🔔 MENSAGENS
const Message = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 18px;
  border-radius: 12px;
  font-size: 0.88rem;
  font-weight: 600;
  margin-bottom: 20px;
  text-align: left;
  line-height: 1.4;
  animation: ${slideIn} 0.3s ease-out;

  background: ${props => props.$error 
    ? 'rgba(239, 68, 68, 0.1)' 
    : 'rgba(34, 197, 94, 0.1)'};
  border: 1px solid ${props => props.$error 
    ? 'rgba(239, 68, 68, 0.3)' 
    : 'rgba(34, 197, 94, 0.3)'};
  color: ${props => props.$error ? '#fca5a5' : '#86efac'};

  svg {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
  }
`;

// 🔘 BOTÕES BASE
const Button = styled.button`
  width: 100%;
  padding: 15px 20px;
  border: none;
  border-radius: 14px;
  font-family: 'Poppins', 'Inter', -apple-system, sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  margin-bottom: 10px;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

// 🔵 BOTÃO PRINCIPAL — COR FIXA AZUL → BRANCO (SEM MUDAR NO HOVER)
const PrimaryButton = styled(Button)`
  background: linear-gradient(
    135deg, 
    #1e3a8a 0%, 
    #2563eb 40%, 
    #4a8cf7 70%, 
    #7eb8ff 100%
  );
  color: #ffffff;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  box-shadow: 
    0 4px 12px rgba(37, 99, 235, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(74, 140, 247, 0.3);

  &:hover:not(:disabled) {
    /* ✅ Cor NÃO muda — só sobe levinho */
    transform: translateY(-2px);
    box-shadow: 
      0 6px 18px rgba(37, 99, 235, 0.35),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
`;

const SecondaryButton = styled(Button)`
  background: rgba(74, 140, 247, 0.08);
  color: #7eb8ff;
  border: 1px solid rgba(74, 140, 247, 0.25);
  transition: transform 0.2s ease, background 0.3s ease, border-color 0.3s ease, color 0.3s ease;

  &:hover:not(:disabled) {
    background: rgba(74, 140, 247, 0.15);
    border-color: rgba(74, 140, 247, 0.4);
    color: #fff;
    transform: translateY(-2px);
  }
`;

const TertiaryButton = styled(Button)`
  background: transparent;
  color: #8899aa;
  border: 1px solid rgba(168, 184, 216, 0.15);
  font-size: 0.85rem;
  padding: 12px 20px;
  margin-bottom: 0;
  transition: background 0.3s ease, color 0.3s ease, border-color 0.3s ease;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.04);
    color: #e8eef7;
    border-color: rgba(168, 184, 216, 0.3);
  }
`;

// ⏳ SPINNER
const Spinner = styled.span`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
  display: inline-block;
`;

// 🔽 COMPONENTE
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
        text: 'E-mail reenviado! Verifique sua caixa de entrada e o spam.' 
      });
    } else {
      setMessage({ 
        type: 'error', 
        text: result.error || 'Erro ao reenviar e-mail' 
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
        text: 'E-mail verificado com sucesso! Redirecionando...' 
      });
      setTimeout(() => {
        if (onVerified) onVerified();
      }, 1500);
    } else {
      setMessage({ 
        type: 'error', 
        text: 'E-mail ainda não verificado. Verifique sua caixa de entrada.' 
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
        <IconWrapper>
          <Envelope>📧</Envelope>
        </IconWrapper>

        <Title>Verifique seu e-mail</Title>
        <Description>Enviamos um link de verificação para</Description>
        <EmailHighlight>{user?.email}</EmailHighlight>

        <Hint>
          Abra o e-mail e clique no link para ativar sua conta.<br />
          Não recebeu? <strong>Verifique a caixa de spam</strong> também.
        </Hint>

        {message && (
          <Message $error={message.type === 'error'}>
            {message.type === 'error' ? '❌' : '✅'}
            <span>{message.text}</span>
          </Message>
        )}

        <PrimaryButton onClick={handleCheckVerified} disabled={checking}>
          {checking ? (
            <>
              <Spinner /> Verificando...
            </>
          ) : (
            <>✅ Já verifiquei meu e-mail</>
          )}
        </PrimaryButton>

        <SecondaryButton onClick={handleResend} disabled={loading}>
          {loading ? (
            <>
              <Spinner /> Enviando...
            </>
          ) : (
            <>📧 Reenviar e-mail</>
          )}
        </SecondaryButton>

        <TertiaryButton onClick={handleLogout}>
          🚪 Sair e usar outra conta
        </TertiaryButton>
      </Card>
    </Container>
  );
};

export default EmailVerification;