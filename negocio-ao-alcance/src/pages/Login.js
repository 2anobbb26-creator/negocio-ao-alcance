import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 300% 50%; }
`;

const Container = styled.div`
  max-width: 460px;
  margin: 60px auto;
  padding: 40px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(24px);
  border-radius: 28px;
  position: relative;
  overflow: hidden;
  animation: ${fadeInUp} 0.6s ease-out;

  /* ✨ BORDA GRADIENTE AZUL → ROXO */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 28px;
    padding: 1px;
    background: linear-gradient(135deg, 
      rgba(74, 140, 247, 0.5) 0%, 
      rgba(126, 184, 255, 0.4) 25%, 
      rgba(168, 85, 247, 0.35) 50%, 
      rgba(126, 184, 255, 0.4) 75%, 
      rgba(74, 140, 247, 0.5) 100%
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
    margin: 20px 15px;
    padding: 28px;
    border-radius: 22px;

    &::before {
      border-radius: 22px;
    }
  }
`;

const Title = styled.h2`
  text-align: center;
  font-size: 2.2rem;
  margin-bottom: 8px;
  font-weight: 800;
  letter-spacing: -0.5px;
  /* 🎨 DEGRADÊ BRANCO → AZUL → ROXO */
  background: linear-gradient(135deg, 
    #ffffff 0%, 
    #d0e0ff 20%, 
    #7eb8ff 40%, 
    #4a8cf7 60%, 
    #6366f1 80%, 
    #a855f7 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 480px) {
    font-size: 1.8rem;
  }
`;

const Subtitle = styled.p`
  text-align: center;
  color: #8899aa;
  margin-bottom: 32px;
  font-size: 0.95rem;
  letter-spacing: 0.3px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  color: #b8c6db;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.8px;
  text-transform: uppercase;
`;

const Input = styled.input`
  padding: 14px 18px;
  background: rgba(10, 21, 48, 0.5);
  border: 1.5px solid ${props => props.$error 
    ? 'rgba(239, 68, 68, 0.4)' 
    : 'rgba(74, 140, 247, 0.2)'};
  border-radius: 12px;
  color: #fff;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s;
  backdrop-filter: blur(10px);

  &:focus {
    outline: none;
    border-color: ${props => props.$error 
      ? '#ef4444' 
      : 'rgba(74, 140, 247, 0.5)'};
    box-shadow: 0 0 0 4px ${props => props.$error 
      ? 'rgba(239, 68, 68, 0.1)' 
      : 'rgba(74, 140, 247, 0.1)'};
    background: rgba(10, 21, 48, 0.7);
  }

  &::placeholder {
    color: #556677;
    font-weight: 400;
  }
`;

// 🔵 BOTÃO ENTRAR - AZUL ESCURO ELEGANTE (SEM NEON)
const Button = styled.button`
  padding: 16px;
  background: linear-gradient(135deg, #0d1b3e 0%, #142952 50%, #1e3a8a 100%);
  border: 1px solid rgba(74, 140, 247, 0.3);
  border-radius: 12px;
  color: #ffffff;
  font-family: 'Poppins', 'Inter', -apple-system, sans-serif;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 8px;
  letter-spacing: 0.8px;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(74, 140, 247, 0.15);

  &:hover {
    background: linear-gradient(135deg, #142952 0%, #1e3a8a 50%, #2563eb 100%);
    transform: translateY(-2px);
    border-color: rgba(74, 140, 247, 0.5);
    box-shadow: 
      0 8px 24px rgba(30, 58, 138, 0.4),
      inset 0 1px 0 rgba(74, 140, 247, 0.25);
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

const SwitchLink = styled.p`
  text-align: center;
  color: #8899aa;
  margin-top: 24px;
  font-size: 0.9rem;

  a {
    color: #7eb8ff;
    text-decoration: none;
    font-weight: 700;
    transition: color 0.3s;

    &:hover {
      color: #a855f7;
      text-decoration: underline;
    }
  }
`;

const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #f87171;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 0.9rem;
  text-align: center;
  font-weight: 500;
`;

const SuccessMessage = styled.div`
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  color: #4ade80;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 0.9rem;
  text-align: center;
  font-weight: 500;
`;

const Login = ({ onLogin, onRegister }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLogin = location.pathname === '/login';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!isLogin) {
      if (formData.password !== formData.confirmPassword) {
        setError('As senhas não coincidem!');
        setLoading(false);
        return;
      }
      if (formData.password.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres!');
        setLoading(false);
        return;
      }
      if (!formData.name.trim()) {
        setError('Por favor, digite seu nome!');
        setLoading(false);
        return;
      }
    }

    try {
      let result;
      if (isLogin) {
        result = await onLogin(formData.email, formData.password);
      } else {
        result = await onRegister(formData.email, formData.password, formData.name, formData.phone);
      }

      if (result.success) {
        if (!isLogin) {
          setSuccess('✅ Cadastro realizado com sucesso! Faça login.');
          setFormData({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
          setTimeout(() => navigate('/login'), 2000);
        } else {
          navigate('/');
        }
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
        }
        setError(errorMessage);
      }
    } catch (err) {
      setError('Ocorreu um erro. Tente novamente.');
    }

    setLoading(false);
  };

  return (
    <Container>
      <Title>{isLogin ? ' Bem-vindo' : ' Criar Conta'}</Title>
      <Subtitle>
        {isLogin 
          ? 'Entre e descubra o negócio perfeito para você!' 
          : 'Crie sua conta e comece a empreender!'}
      </Subtitle>

      <Form onSubmit={handleSubmit} noValidate>
        {!isLogin && (
          <FormGroup>
            <Label>Nome completo</Label>
            <Input
              type="text"
              name="name"
              placeholder="Digite seu nome"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </FormGroup>
        )}

        <FormGroup>
          <Label>Email</Label>
          <Input
            type="email"
            name="email"
            placeholder="seu@email.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </FormGroup>

        {!isLogin && (
          <FormGroup>
            <Label>Telefone</Label>
            <Input
              type="tel"
              name="phone"
              placeholder="(11) 99999-9999"
              value={formData.phone}
              onChange={handleChange}
            />
          </FormGroup>
        )}

        <FormGroup>
          <Label>Senha</Label>
          <Input
            type="password"
            name="password"
            placeholder="•••••••• (mínimo 6 caracteres)"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </FormGroup>

        {!isLogin && (
          <FormGroup>
            <Label>Confirmar senha</Label>
            <Input
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </FormGroup>
        )}

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        <Button type="submit" disabled={loading}>
          {loading ? ' Carregando...' : isLogin ? ' Entrar' : ' Cadastrar'}
        </Button>
      </Form>

      <SwitchLink>
        {isLogin ? (
          <>Não tem uma conta? <Link to="/register">Cadastre-se</Link></>
        ) : (
          <>Já tem uma conta? <Link to="/login">Faça login</Link></>
        )}
      </SwitchLink>
    </Container>
  );
};

export default Login;