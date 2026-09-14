import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 450px;
  margin: 50px auto;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(102, 126, 234, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);

  @media (max-width: 480px) {
    margin: 20px 15px;
    padding: 20px;
  }
`;

const Title = styled.h2`
  text-align: center;
  color: #fff;
  font-size: 2rem;
  margin-bottom: 10px;
  background: linear-gradient(135deg, #ffffff 0%, #7eb8ff 25%, #4a8cf7 50%, #6366f1 75%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 480px) {
    font-size: 1.6rem;
  }
`;

const Subtitle = styled.p`
  text-align: center;
  color: #8899aa;
  margin-bottom: 30px;
  font-size: 0.95rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Label = styled.label`
  color: #b8c6db;
  font-size: 0.9rem;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 14px 18px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid ${props => props.$error ? 'rgba(239, 68, 68, 0.5)' : 'rgba(102, 126, 234, 0.2)'};
  border-radius: 10px;
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-color: ${props => props.$error ? '#ef4444' : '#667eea'};
    box-shadow: 0 0 0 3px ${props => props.$error ? 'rgba(239, 68, 68, 0.1)' : 'rgba(102, 126, 234, 0.1)'};
    background: rgba(255, 255, 255, 0.08);
  }

  &::placeholder {
    color: #556677;
  }

  @media (max-width: 480px) {
    padding: 12px 16px;
    font-size: 0.95rem;
  }
`;

const Button = styled.button`
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 10px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 480px) {
    padding: 14px;
    font-size: 1rem;
  }
`;

const SwitchLink = styled.p`
  text-align: center;
  color: #8899aa;
  margin-top: 20px;

  a {
    color: #667eea;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.3s;

    &:hover {
      color: #764ba2;
      text-decoration: underline;
    }
  }
`;

const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  text-align: center;
`;

const SuccessMessage = styled.div`
  background: rgba(34, 197, 94, 0.15);
  border: 1px solid rgba(34, 197, 94, 0.3);
  color: #4ade80;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  text-align: center;
`;

const ErrorText = styled.span`
  color: #ef4444;
  font-size: 0.8rem;
  margin-top: 4px;
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

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const validateName = (name) => {
    return name.trim().length >= 3;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
    setError('');
    setSuccess('');
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let errorMessage = '';

    switch (name) {
      case 'email':
        if (value && !validateEmail(value)) {
          errorMessage = 'Digite um email válido (ex: usuario@email.com)';
        }
        break;
      case 'password':
        if (value && !validatePassword(value)) {
          errorMessage = 'A senha deve ter pelo menos 6 caracteres';
        }
        break;
      case 'confirmPassword':
        if (value && value !== formData.password) {
          errorMessage = 'As senhas não coincidem';
        }
        break;
      case 'name':
        if (value && !validateName(value)) {
          errorMessage = 'Nome deve ter pelo menos 3 caracteres';
        }
        break;
      default:
        break;
    }

    setErrors(prev => ({ ...prev, [name]: errorMessage }));
    return errorMessage === '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validar todos os campos
    let isValid = true;
    const fields = isLogin ? ['email', 'password'] : ['name', 'email', 'password', 'confirmPassword'];
    
    fields.forEach(field => {
      const isFieldValid = validateField(field, formData[field]);
      if (!isFieldValid) {
        isValid = false;
      }
    });

    if (!isValid) {
      setLoading(false);
      return;
    }

    try {
      let result;
      if (isLogin) {
        // 🔑 LOGIN
        result = await onLogin(formData.email, formData.password);
      } else {
        // 📝 CADASTRO
        if (formData.password !== formData.confirmPassword) {
          setError('As senhas não coincidem!');
          setLoading(false);
          return;
        }
        result = await onRegister(
          formData.email,
          formData.password,
          formData.name,
          formData.phone
        );
      }

      if (result.success) {
        if (!isLogin) {
          setSuccess('✅ Cadastro realizado com sucesso! Faça login.');
          setFormData({
            name: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: ''
          });
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        } else {
          // ✅ Login bem-sucedido - vai para a página inicial
          navigate('/');
        }
      } else {
        // Traduzir mensagens de erro
        let errorMessage = result.error;
        if (errorMessage.includes('auth/email-already-in-use')) {
          errorMessage = 'Este email já está cadastrado! Faça login.';
        } else if (errorMessage.includes('auth/invalid-email')) {
          errorMessage = 'Email inválido!';
        } else if (errorMessage.includes('auth/user-not-found')) {
          errorMessage = 'Usuário não encontrado! Cadastre-se.';
        } else if (errorMessage.includes('auth/wrong-password')) {
          errorMessage = 'Senha incorreta!';
        } else if (errorMessage.includes('auth/weak-password')) {
          errorMessage = 'A senha deve ter pelo menos 6 caracteres!';
        } else if (errorMessage.includes('auth/invalid-credential')) {
          errorMessage = 'Email ou senha incorretos!';
        } else if (errorMessage.includes('auth/too-many-requests')) {
          errorMessage = 'Muitas tentativas. Tente novamente mais tarde!';
        }
        setError(errorMessage);
      }
    } catch (error) {
      setError('Ocorreu um erro. Tente novamente.');
    }

    setLoading(false);
  };

  return (
    <Container>
      <Title>{isLogin ? '🎯 Login' : '📝 Cadastro'}</Title>
      <Subtitle>
        {isLogin 
          ? 'Entre e descubra o negócio perfeito para você!' 
          : 'Crie sua conta e comece a empreender!'}
      </Subtitle>

      <Form onSubmit={handleSubmit} noValidate>
        {!isLogin && (
          <FormGroup>
            <Label>Nome completo *</Label>
            <Input
              type="text"
              name="name"
              placeholder="Digite seu nome"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              $error={errors.name}
              required
            />
            {errors.name && <ErrorText>{errors.name}</ErrorText>}
          </FormGroup>
        )}

        <FormGroup>
          <Label>Email *</Label>
          <Input
            type="email"
            name="email"
            placeholder="seu@email.com"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            $error={errors.email}
            required
          />
          {errors.email && <ErrorText>{errors.email}</ErrorText>}
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
              onBlur={handleBlur}
              $error={errors.phone}
            />
            {errors.phone && <ErrorText>{errors.phone}</ErrorText>}
          </FormGroup>
        )}

        <FormGroup>
          <Label>Senha *</Label>
          <Input
            type="password"
            name="password"
            placeholder="•••••••• (mínimo 6 caracteres)"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            $error={errors.password}
            required
          />
          {errors.password && <ErrorText>{errors.password}</ErrorText>}
        </FormGroup>

        {!isLogin && (
          <FormGroup>
            <Label>Confirmar senha *</Label>
            <Input
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              $error={errors.confirmPassword}
              required
            />
            {errors.confirmPassword && <ErrorText>{errors.confirmPassword}</ErrorText>}
          </FormGroup>
        )}

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        <Button type="submit" disabled={loading}>
          {loading ? 'Carregando...' : isLogin ? 'Entrar' : 'Cadastrar'}
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