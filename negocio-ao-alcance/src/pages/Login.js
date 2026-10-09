import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

// ─── ANIMAÇÕES ─────────────────────────────────────────────
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50%      { transform: translateY(-8px); }
`;

const glowPulse = keyframes`
  0%, 100% { opacity: 0.35; transform: scale(1); }
  50%      { opacity: 0.6; transform: scale(1.08); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

// ─── WRAPPER (fundo geral) ─────────────────────────────────
const PageWrapper = styled.div`
  position: relative;
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  overflow: hidden;

  /* Grid pattern de fundo */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(74, 140, 247, 0.045) 1px, transparent 1px),
      linear-gradient(90deg, rgba(74, 140, 247, 0.045) 1px, transparent 1px);
    background-size: 44px 44px;
    mask-image: radial-gradient(circle at 50% 40%, black 0%, transparent 75%);
    -webkit-mask-image: radial-gradient(circle at 50% 40%, black 0%, transparent 75%);
    pointer-events: none;
    z-index: 0;
  }

  @media (max-width: 768px) {
    padding: 24px 16px;
    min-height: auto;
  }

  @media (max-width: 480px) {
    padding: 16px 12px;
  }
`;

// ─── GLOW DE FUNDO ─────────────────────────────────────────
const BackgroundGlow = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 720px;
  height: 720px;
  background: radial-gradient(circle,
    rgba(74, 140, 247, 0.18) 0%,
    rgba(74, 140, 247, 0.06) 40%,
    transparent 70%);
  filter: blur(70px);
  pointer-events: none;
  animation: ${glowPulse} 8s ease-in-out infinite;
  z-index: 0;

  @media (max-width: 768px) {
    width: 480px;
    height: 480px;
  }

  @media (max-width: 480px) {
    width: 360px;
    height: 360px;
  }
`;

// ─── CARD PRINCIPAL ────────────────────────────────────────
const Container = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 460px;
  padding: 44px 40px 36px;
  background: rgba(255, 255, 255, 0.035);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-radius: 26px;
  animation: ${fadeInUp} 0.6s ease-out;
  box-shadow:
    0 24px 60px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.04) inset;

  /* Borda gradiente */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 26px;
    padding: 1px;
    background: linear-gradient(135deg,
      rgba(74, 140, 247, 0.45) 0%,
      rgba(126, 184, 255, 0.25) 30%,
      rgba(168, 85, 247, 0.3) 60%,
      rgba(126, 184, 255, 0.25) 100%);
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }

  @media (max-width: 768px) {
    padding: 36px 28px 30px;
    border-radius: 22px;

    &::before { border-radius: 22px; }
  }

  @media (max-width: 480px) {
    padding: 32px 22px 26px;
    border-radius: 20px;

    &::before { border-radius: 20px; }
  }
`;

// ─── TOPO: ÍCONE ───────────────────────────────────────────
const TopIcon = styled.div`
  width: 68px;
  height: 68px;
  margin: 0 auto 18px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg,
    rgba(74, 140, 247, 0.18) 0%,
    rgba(168, 85, 247, 0.12) 100%);
  border: 1px solid rgba(74, 140, 247, 0.28);
  color: #7eb8ff;
  box-shadow:
    0 8px 24px rgba(74, 140, 247, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  position: relative;
  animation: ${float} 5s ease-in-out infinite;

  /* Anel de luz externo */
  &::after {
    content: '';
    position: absolute;
    inset: -8px;
    border-radius: 26px;
    background: radial-gradient(circle,
      rgba(74, 140, 247, 0.15) 0%,
      transparent 70%);
    pointer-events: none;
  }

  svg {
    width: 32px;
    height: 32px;
    position: relative;
    z-index: 1;
  }

  @media (max-width: 480px) {
    width: 58px;
    height: 58px;
    border-radius: 18px;
    margin-bottom: 14px;

    svg {
      width: 26px;
      height: 26px;
    }
  }
`;

// ─── TÍTULO E SUBTÍTULO ────────────────────────────────────
const Title = styled.h1`
  text-align: center;
  font-size: 2rem;
  margin: 0 0 6px;
  font-weight: 800;
  letter-spacing: -0.6px;
  background: linear-gradient(135deg,
    #ffffff 0%,
    #d0e0ff 30%,
    #7eb8ff 70%,
    #4a8cf7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 480px) {
    font-size: 1.7rem;
  }
`;

const Subtitle = styled.p`
  text-align: center;
  color: #8a9bb8;
  margin: 0 0 26px;
  font-size: 0.92rem;
  letter-spacing: 0.2px;
  line-height: 1.5;
  padding: 0 8px;

  @media (max-width: 480px) {
    font-size: 0.85rem;
    margin-bottom: 22px;
  }
`;

// ─── FORM ──────────────────────────────────────────────────
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
  animation: ${fadeInUp} 0.5s ease-out backwards;
  animation-delay: ${props => props.$delay || '0s'};
`;

const Label = styled.label`
  color: #a8b8d8;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding-left: 2px;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  background: rgba(10, 21, 48, 0.55);
  border: 1.5px solid ${props => props.$error
    ? 'rgba(239, 68, 68, 0.45)'
    : 'rgba(74, 140, 247, 0.18)'};
  border-radius: 12px;
  color: #e8eef7;
  font-size: 0.95rem;
  font-weight: 500;
  font-family: inherit;
  transition: all 0.25s ease;
  backdrop-filter: blur(8px);

  &:focus {
    outline: none;
    border-color: ${props => props.$error
      ? '#ef4444'
      : 'rgba(74, 140, 247, 0.6)'};
    box-shadow: 0 0 0 4px ${props => props.$error
      ? 'rgba(239, 68, 68, 0.12)'
      : 'rgba(74, 140, 247, 0.12)'};
    background: rgba(10, 21, 48, 0.75);
  }

  &::placeholder {
    color: #556677;
    font-weight: 400;
  }
`;

// ─── BOTÃO MOSTRAR/OCULTAR SENHA ───────────────────────────
const TogglePassword = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: #7eb8ff;
  cursor: pointer;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  opacity: 0.6;
  padding: 0;

  &:hover {
    background: rgba(74, 140, 247, 0.12);
    opacity: 1;
  }

  svg {
    width: 17px;
    height: 17px;
  }
`;

// ─── BARRA DE FORÇA ────────────────────────────────────────
const StrengthBar = styled.div`
  display: flex;
  gap: 4px;
  margin-top: 6px;
`;

const StrengthSegment = styled.div`
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.07);
  transition: all 0.3s ease;

  ${props => props.$active && props.$color && `
    background: ${props.$color};
    box-shadow: 0 0 8px ${props.$color}40;
  `}
`;

const StrengthLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  margin-top: 4px;
  color: ${props => props.$color || '#8899aa'};
`;

const Checklist = styled.ul`
  list-style: none;
  padding: 0;
  margin: 8px 0 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
`;

const CheckItem = styled.li`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.72rem;
  color: ${props => props.$ok ? '#4ade80' : '#7a8a9e'};
  transition: color 0.25s ease;

  span.icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    font-size: 0.55rem;
    flex-shrink: 0;
    background: ${props => props.$ok
      ? 'rgba(34, 197, 94, 0.18)'
      : 'rgba(255, 255, 255, 0.05)'};
    border: 1px solid ${props => props.$ok
      ? 'rgba(34, 197, 94, 0.45)'
      : 'rgba(255, 255, 255, 0.1)'};
    color: ${props => props.$ok ? '#4ade80' : '#7a8a9e'};
  }

  @media (max-width: 400px) {
    grid-template-columns: 1fr;
    font-size: 0.7rem;
  }
`;

const MatchLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.4px;
  margin-top: 6px;
  color: ${props => props.$ok ? '#4ade80' : '#f87171'};
`;

// ─── BOTÃO PRINCIPAL ───────────────────────────────────────
const Button = styled.button`
  padding: 15px;
  background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
  border: 1px solid rgba(74, 140, 247, 0.4);
  border-radius: 12px;
  color: #ffffff;
  font-family: inherit;
  font-size: 0.98rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 6px;
  letter-spacing: 0.5px;
  box-shadow:
    0 4px 16px rgba(37, 99, 235, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
    transform: translateY(-2px);
    border-color: rgba(74, 140, 247, 0.6);
    box-shadow:
      0 10px 28px rgba(37, 99, 235, 0.45),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
  }

  &:active:not(:disabled) {
    transform: translateY(0) scale(0.98);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  svg {
    width: 18px;
    height: 18px;

    &.spinning {
      animation: ${spin} 1s linear infinite;
    }
  }
`;

const SwitchLink = styled.p`
  text-align: center;
  color: #7a8a9e;
  margin: 22px 0 0;
  font-size: 0.88rem;

  a {
    color: #7eb8ff;
    text-decoration: none;
    font-weight: 700;
    transition: color 0.25s;

    &:hover {
      color: #a8ccff;
      text-decoration: underline;
    }
  }
`;

// ─── MENSAGENS ─────────────────────────────────────────────
const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #f87171;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 0.85rem;
  text-align: center;
  font-weight: 500;
  line-height: 1.5;
  animation: ${fadeInUp} 0.3s ease-out;
`;

const WarningMessage = styled.div`
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.3);
  color: #fbbf24;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 0.85rem;
  text-align: center;
  font-weight: 500;
  line-height: 1.5;
  animation: ${fadeInUp} 0.3s ease-out;
`;

const SuccessMessage = styled.div`
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  color: #4ade80;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 0.85rem;
  text-align: center;
  font-weight: 500;
  line-height: 1.5;
  animation: ${fadeInUp} 0.3s ease-out;
`;

// ─── ÍCONES SVG INLINE ─────────────────────────────────────
const CompassIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
);

const EyeIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const SpinnerIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="spinning"
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

// ─── HELPERS ───────────────────────────────────────────────
const getPasswordStrength = (password) => {
  if (!password) {
    return {
      level: 0,
      label: '',
      color: '',
      checks: { length: false, letter: false, number: false },
    };
  }

  const checks = {
    length: password.length >= 6,
    letter: /[a-zA-Z]/.test(password),
    number: /[0-9]/.test(password),
  };

  const passed = Object.values(checks).filter(Boolean).length;
  const hasExtra =
    password.length >= 8 &&
    /[A-Z!@#$%^&*(),.?":{}|<>]/.test(password);

  let level = 1;
  let label = 'Fraca';
  let color = '#f87171';

  if (passed === 2) {
    level = 2;
    label = 'Média';
    color = '#fbbf24';
  } else if (passed >= 3) {
    if (hasExtra) {
      level = 3;
      label = 'Forte';
      color = '#4ade80';
    } else {
      level = 2;
      label = 'Média';
      color = '#fbbf24';
    }
  }

  return { level, label, color, checks };
};

// ─── COMPONENTE ────────────────────────────────────────────
const Login = ({ onLogin, onRegister }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLogin = location.pathname === '/login';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const strength = !isLogin ? getPasswordStrength(formData.password) : null;
  const passwordsMatch =
    !isLogin && formData.confirmPassword
      ? formData.password === formData.confirmPassword
      : null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setWarning('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setWarning('');
    setSuccess('');

    if (!isLogin) {
      if (!formData.name.trim()) {
        setError('Por favor, digite seu nome!');
        return;
      }
      if (!strength.checks.length) {
        setError('A senha deve ter pelo menos 6 caracteres!');
        return;
      }
      if (!strength.checks.letter) {
        setError('A senha precisa ter pelo menos 1 letra!');
        return;
      }
      if (!strength.checks.number) {
        setError('A senha precisa ter pelo menos 1 número!');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('As senhas não coincidem!');
        return;
      }
    }

    setLoading(true);

    try {
      let result;
      if (isLogin) {
        result = await onLogin(formData.email, formData.password);
      } else {
        result = await onRegister(
          formData.email,
          formData.password,
          formData.name,
          formData.phone
        );
      }

      if (result.success) {
        if (!isLogin) {
          setSuccess(
            'Cadastro realizado! Enviamos um e-mail de verificação. ' +
            'Verifique sua caixa de entrada e o spam.'
          );
          setFormData({
            name: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: '',
          });
        } else {
          navigate('/');
        }
      } else {
        if (result.error === 'EMAIL_NOT_VERIFIED') {
          setWarning(
            `Confirme seu e-mail antes de entrar! Enviamos um link para ${formData.email}. ` +
            `Verifique também a caixa de spam.`
          );
        } else {
          let errorMessage = result.error;
          if (errorMessage.includes('auth/email-already-in-use')) {
            errorMessage = 'Este email já está cadastrado!';
          } else if (errorMessage.includes('auth/invalid-email')) {
            errorMessage = 'Email inválido!';
          } else if (errorMessage.includes('auth/user-not-found')) {
            errorMessage = 'Usuário não encontrado!';
          } else if (errorMessage.includes('auth/wrong-password')) {
            errorMessage = 'Senha incorreta!';
          } else if (errorMessage.includes('auth/invalid-credential')) {
            errorMessage = 'Email ou senha incorretos!';
          } else if (errorMessage.includes('auth/weak-password')) {
            errorMessage = 'A senha deve ter pelo menos 6 caracteres!';
          } else if (errorMessage.includes('auth/too-many-requests')) {
            errorMessage = 'Muitas tentativas. Tente novamente mais tarde.';
          }
          setError(errorMessage);
        }
      }
    } catch (err) {
      setError('Ocorreu um erro. Tente novamente.');
    }

    setLoading(false);
  };

  return (
    <PageWrapper>
      <BackgroundGlow />
      <Container>
        <TopIcon>
          <CompassIcon />
        </TopIcon>

        <Title>{isLogin ? 'Bem-vindo' : 'Criar Conta'}</Title>
        <Subtitle>
          {isLogin
            ? 'Entre e descubra o negócio perfeito para você'
            : 'Crie sua conta e comece a empreender'}
        </Subtitle>

        <Form onSubmit={handleSubmit} noValidate>
          {!isLogin && (
            <FormGroup $delay="0.05s">
              <Label>Nome completo</Label>
              <InputWrapper>
                <Input
                  type="text"
                  name="name"
                  placeholder="Digite seu nome"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </InputWrapper>
            </FormGroup>
          )}

          <FormGroup $delay="0.1s">
            <Label>Email</Label>
            <InputWrapper>
              <Input
                type="email"
                name="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </InputWrapper>
          </FormGroup>

          {!isLogin && (
            <FormGroup $delay="0.15s">
              <Label>Telefone</Label>
              <InputWrapper>
                <Input
                  type="tel"
                  name="phone"
                  placeholder="(11) 99999-9999"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </InputWrapper>
            </FormGroup>
          )}

          <FormGroup $delay="0.2s">
            <Label>Senha</Label>
            <InputWrapper>
              <Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                style={{ paddingRight: '48px' }}
              />
              <TogglePassword
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </TogglePassword>
            </InputWrapper>

            {!isLogin && formData.password && (
              <>
                <StrengthBar>
                  <StrengthSegment
                    $active={strength.level >= 1}
                    $color={strength.color}
                  />
                  <StrengthSegment
                    $active={strength.level >= 2}
                    $color={strength.color}
                  />
                  <StrengthSegment
                    $active={strength.level >= 3}
                    $color={strength.color}
                  />
                </StrengthBar>

                <StrengthLabel $color={strength.color}>
                  Força: {strength.label}
                </StrengthLabel>

                <Checklist>
                  <CheckItem $ok={strength.checks.length}>
                    <span className="icon">
                      {strength.checks.length ? '✓' : '·'}
                    </span>
                    6+ caracteres
                  </CheckItem>
                  <CheckItem $ok={strength.checks.letter}>
                    <span className="icon">
                      {strength.checks.letter ? '✓' : '·'}
                    </span>
                    1 letra
                  </CheckItem>
                  <CheckItem $ok={strength.checks.number}>
                    <span className="icon">
                      {strength.checks.number ? '✓' : '·'}
                    </span>
                    1 número
                  </CheckItem>
                </Checklist>
              </>
            )}
          </FormGroup>

          {!isLogin && (
            <FormGroup $delay="0.25s">
              <Label>Confirmar senha</Label>
              <InputWrapper>
                <Input
                  type={showConfirm ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  $error={passwordsMatch === false}
                  style={{ paddingRight: '48px' }}
                />
                <TogglePassword
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  tabIndex="-1"
                  aria-label={showConfirm ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                </TogglePassword>
              </InputWrapper>

              {formData.confirmPassword && (
                <MatchLabel $ok={passwordsMatch}>
                  {passwordsMatch
                    ? '✓ Senhas coincidem'
                    : '✕ Senhas não coincidem'}
                </MatchLabel>
              )}
            </FormGroup>
          )}

          {error && <ErrorMessage>{error}</ErrorMessage>}
          {warning && <WarningMessage>{warning}</WarningMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}

          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <SpinnerIcon />
                Carregando...
              </>
            ) : isLogin ? (
              'Entrar'
            ) : (
              'Criar minha conta'
            )}
          </Button>
        </Form>

        <SwitchLink>
          {isLogin ? (
            <>
              Não tem uma conta? <Link to="/register">Cadastre-se</Link>
            </>
          ) : (
            <>
              Já tem uma conta? <Link to="/login">Faça login</Link>
            </>
          )}
        </SwitchLink>
      </Container>
    </PageWrapper>
  );
};

export default Login;