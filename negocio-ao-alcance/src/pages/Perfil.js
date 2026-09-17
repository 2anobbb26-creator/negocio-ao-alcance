import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { auth, authService } from '../services/firebase';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const shimmer = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 300% 50%; }
`;

const Container = styled.div`
  max-width: 900px;
  margin: 40px auto;
  padding: 20px;
  animation: ${fadeInUp} 0.6s ease-out;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(24px);
  border-radius: 28px;
  padding: 40px;
  position: relative;
  overflow: hidden;

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
    padding: 24px;
    border-radius: 22px;

    &::before {
      border-radius: 22px;
    }
  }
`;

const AvatarSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4a8cf7 0%, #7eb8ff 40%, #a855f7 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3.5rem;
  font-weight: 900;
  color: #fff;
  border: 3px solid rgba(74, 140, 247, 0.3);
  animation: ${float} 6s ease-in-out infinite;
  margin-bottom: 16px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  box-shadow: 0 8px 32px rgba(74, 140, 247, 0.25);

  @media (max-width: 480px) {
    width: 100px;
    height: 100px;
    font-size: 3rem;
  }
`;

const UserName = styled.h1`
  font-size: 2rem;
  margin: 0 0 8px 0;
  font-weight: 800;
  text-align: center;
  letter-spacing: -0.5px;
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
    font-size: 1.5rem;
  }
`;

const UserEmail = styled.p`
  color: #8899aa;
  font-size: 1rem;
  margin: 0;
  text-align: center;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
`;

// ✏️ BOTÃO EDITAR PERFIL
const EditButton = styled.button`
  margin-top: 16px;
  padding: 10px 24px;
  background: linear-gradient(135deg, #0d1b3e 0%, #142952 50%, #1e3a8a 100%);
  border: 1px solid rgba(74, 140, 247, 0.3);
  border-radius: 10px;
  color: #ffffff;
  font-family: 'Poppins', 'Inter', -apple-system, sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 0.8px;
  display: flex;
  align-items: center;
  gap: 8px;
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
`;

const Divider = styled.div`
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(74, 140, 247, 0.3), transparent);
  margin: 32px 0;
`;

const SectionTitle = styled.h3`
  color: #fff;
  font-size: 1.1rem;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  letter-spacing: 0.3px;

  span {
    font-size: 1.3rem;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const InfoCard = styled.div`
  background: rgba(10, 21, 48, 0.5);
  border-radius: 14px;
  padding: 18px;
  border: 1px solid rgba(74, 140, 247, 0.15);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 14px;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(30, 58, 138, 0.2);
    border-color: rgba(74, 140, 247, 0.35);
    transform: translateY(-2px);
  }
`;

const InfoIcon = styled.div`
  font-size: 1.6rem;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(74, 140, 247, 0.15), rgba(168, 85, 247, 0.1));
  border-radius: 12px;
  border: 1px solid rgba(74, 140, 247, 0.15);
  flex-shrink: 0;
`;

const InfoContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const InfoLabel = styled.div`
  color: #6b7fa8;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 700;
  margin-bottom: 4px;
`;

const InfoValue = styled.div`
  color: #fff;
  font-size: 0.95rem;
  font-weight: 600;
  word-break: break-word;
`;

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 24px;

  @media (max-width: 480px) {
    gap: 8px;
  }
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, rgba(13, 27, 62, 0.9) 0%, rgba(10, 21, 48, 0.9) 100%);
  border-radius: 14px;
  padding: 20px 12px;
  text-align: center;
  border: 1px solid rgba(74, 140, 247, 0.15);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, #4a8cf7, transparent);
    opacity: 0.5;
  }

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(74, 140, 247, 0.35);
  }
`;

const StatValue = styled.div`
  font-size: 1.8rem;
  font-weight: 800;
  background: linear-gradient(135deg, #ffffff 0%, #c8d8f0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 480px) {
    font-size: 1.4rem;
  }
`;

const StatLabel = styled.div`
  color: #6b7fa8;
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 700;
  margin-top: 6px;

  @media (max-width: 480px) {
    font-size: 0.55rem;
  }
`;

const BackButton = styled.button`
  padding: 14px 32px;
  background: linear-gradient(135deg, #0d1b3e 0%, #142952 50%, #1e3a8a 100%);
  border: 1px solid rgba(74, 140, 247, 0.3);
  border-radius: 12px;
  color: #ffffff;
  font-family: 'Poppins', 'Inter', -apple-system, sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 32px auto 0;
  letter-spacing: 0.8px;
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
`;

const Loading = styled.div`
  text-align: center;
  color: #b8c6db;
  padding: 60px 20px;
  font-size: 1.1rem;
`;

// 🎯 MODAL DE EDIÇÃO
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(10px);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  animation: ${fadeInUp} 0.3s ease-out;
`;

const Modal = styled.div`
  background: linear-gradient(145deg, #0d1b3e 0%, #0a1530 100%);
  border: 1px solid rgba(74, 140, 247, 0.3);
  border-radius: 24px;
  padding: 32px;
  max-width: 500px;
  width: 100%;
  position: relative;
  animation: ${fadeInUp} 0.3s ease-out;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);

  @media (max-width: 480px) {
    padding: 24px;
  }
`;

const ModalTitle = styled.h2`
  color: #fff;
  font-size: 1.5rem;
  margin-bottom: 24px;
  font-weight: 800;
  background: linear-gradient(135deg, #ffffff 0%, #7eb8ff 50%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const ModalForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ModalFormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ModalLabel = styled.label`
  color: #b8c6db;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.8px;
  text-transform: uppercase;
`;

const ModalInput = styled.input`
  padding: 14px 18px;
  background: rgba(10, 21, 48, 0.7);
  border: 1.5px solid rgba(74, 140, 247, 0.2);
  border-radius: 12px;
  color: #fff;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-color: rgba(74, 140, 247, 0.5);
    box-shadow: 0 0 0 4px rgba(74, 140, 247, 0.1);
    background: rgba(10, 21, 48, 0.9);
  }

  &::placeholder {
    color: #556677;
    font-weight: 400;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ModalButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const ModalSaveButton = styled.button`
  flex: 1;
  padding: 14px 24px;
  background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
  border: 1px solid rgba(74, 140, 247, 0.5);
  border-radius: 12px;
  color: #fff;
  font-family: 'Poppins', 'Inter', sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 0.5px;

  &:hover {
    background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(37, 99, 235, 0.4);
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

const ModalCancelButton = styled.button`
  flex: 1;
  padding: 14px 24px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #b8c6db;
  font-family: 'Poppins', 'Inter', sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 0.5px;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }
`;

const ModalCloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 20px;
  background: none;
  border: none;
  color: #8899aa;
  font-size: 1.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.05);
    transform: rotate(90deg);
  }
`;

const Message = styled.div`
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 0.9rem;
  text-align: center;
  font-weight: 500;
  background: ${props => props.$success 
    ? 'rgba(34, 197, 94, 0.1)' 
    : 'rgba(239, 68, 68, 0.1)'};
  border: 1px solid ${props => props.$success 
    ? 'rgba(34, 197, 94, 0.3)' 
    : 'rgba(239, 68, 68, 0.3)'};
  color: ${props => props.$success ? '#4ade80' : '#f87171'};
`;

const Perfil = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', success: true });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const currentUser = auth.currentUser;
    
    if (currentUser) {
      // Buscar dados do Firestore
      const result = await authService.getUserData(currentUser.uid);
      
      const userInfo = {
        name: currentUser.displayName || 
              result.data?.name || 
              currentUser.email?.split('@')[0] || 
              'Usuário',
        email: currentUser.email,
        phone: result.data?.phone || '',
        uid: currentUser.uid,
        createdAt: currentUser.metadata?.creationTime,
        lastLogin: currentUser.metadata?.lastSignInTime,
        emailVerified: currentUser.emailVerified
      };
      
      setUserData(userInfo);
      setEditData({ name: userInfo.name, phone: userInfo.phone });
    }
    
    setLoading(false);
  };

  const handleEditClick = () => {
    setEditData({ name: userData.name, phone: userData.phone });
    setMessage({ text: '', success: true });
    setIsEditing(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', success: true });

    // Validações
    if (!editData.name.trim() || editData.name.trim().length < 3) {
      setMessage({ text: 'O nome deve ter pelo menos 3 caracteres', success: false });
      setSaving(false);
      return;
    }

    const result = await authService.updateProfile(
      { uid: userData.uid },
      { name: editData.name.trim(), phone: editData.phone.trim() }
    );

    if (result.success) {
      setMessage({ text: '✅ Perfil atualizado com sucesso!', success: true });
      
      // Atualizar os dados locais
      setUserData(prev => ({
        ...prev,
        name: editData.name.trim(),
        phone: editData.phone.trim()
      }));

      // Fechar modal após 1.5 segundos
      setTimeout(() => {
        setIsEditing(false);
        setMessage({ text: '', success: true });
      }, 1500);
    } else {
      setMessage({ text: `❌ Erro: ${result.error}`, success: false });
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <Container>
        <Loading>⏳ Carregando perfil...</Loading>
      </Container>
    );
  }

  if (!userData) {
    return (
      <Container>
        <Loading>❌ Usuário não encontrado</Loading>
      </Container>
    );
  }

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Não disponível';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <>
      <Container>
        <Card>
          <AvatarSection>
            <Avatar>{getInitials(userData.name)}</Avatar>
            <UserName>{userData.name}</UserName>
            <UserEmail>📧 {userData.email}</UserEmail>
            <EditButton onClick={handleEditClick}>
              ✏️ Editar Perfil
            </EditButton>
          </AvatarSection>

          <Divider />

          <SectionTitle>
            <span>📋</span> Informações da Conta
          </SectionTitle>

          <InfoGrid>
            <InfoCard>
              <InfoIcon>👤</InfoIcon>
              <InfoContent>
                <InfoLabel>Nome</InfoLabel>
                <InfoValue>{userData.name}</InfoValue>
              </InfoContent>
            </InfoCard>

            <InfoCard>
              <InfoIcon>📧</InfoIcon>
              <InfoContent>
                <InfoLabel>Email</InfoLabel>
                <InfoValue>{userData.email}</InfoValue>
              </InfoContent>
            </InfoCard>

            <InfoCard>
              <InfoIcon>📱</InfoIcon>
              <InfoContent>
                <InfoLabel>Telefone</InfoLabel>
                <InfoValue>{userData.phone || 'Não informado'}</InfoValue>
              </InfoContent>
            </InfoCard>

            <InfoCard>
              <InfoIcon>🆔</InfoIcon>
              <InfoContent>
                <InfoLabel>ID do Usuário</InfoLabel>
                <InfoValue style={{ fontSize: '0.75rem' }}>
                  {userData.uid.substring(0, 16)}...
                </InfoValue>
              </InfoContent>
            </InfoCard>

            <InfoCard>
              <InfoIcon>✅</InfoIcon>
              <InfoContent>
                <InfoLabel>Status</InfoLabel>
                <InfoValue style={{ color: userData.emailVerified ? '#4ade80' : '#fbbf24' }}>
                  {userData.emailVerified ? 'Verificado' : 'Não verificado'}
                </InfoValue>
              </InfoContent>
            </InfoCard>

            <InfoCard>
              <InfoIcon>📅</InfoIcon>
              <InfoContent>
                <InfoLabel>Conta criada em</InfoLabel>
                <InfoValue>{formatDate(userData.createdAt)}</InfoValue>
              </InfoContent>
            </InfoCard>

            <InfoCard>
              <InfoIcon>🔑</InfoIcon>
              <InfoContent>
                <InfoLabel>Último acesso</InfoLabel>
                <InfoValue>{formatDate(userData.lastLogin)}</InfoValue>
              </InfoContent>
            </InfoCard>
          </InfoGrid>

          <Divider />

          <SectionTitle>
            <span>📊</span> Estatísticas
          </SectionTitle>

          <StatsSection>
            <StatCard>
              <StatValue>0</StatValue>
              <StatLabel>❤️ Favoritos</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>0</StatValue>
              <StatLabel>🔍 Buscas</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>0</StatValue>
              <StatLabel>📊 Negócios</StatLabel>
            </StatCard>
          </StatsSection>

          <BackButton onClick={() => navigate('/')}>
            ← Voltar para os negócios
          </BackButton>
        </Card>
      </Container>

      {/* 🎯 MODAL DE EDIÇÃO */}
      {isEditing && (
        <Overlay onClick={() => !saving && setIsEditing(false)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalCloseButton 
              onClick={() => !saving && setIsEditing(false)}
              disabled={saving}
            >
              ✕
            </ModalCloseButton>

            <ModalTitle>✏️ Editar Perfil</ModalTitle>

            <ModalForm onSubmit={handleSaveProfile}>
              <ModalFormGroup>
                <ModalLabel>Nome completo</ModalLabel>
                <ModalInput
                  type="text"
                  name="name"
                  placeholder="Digite seu nome"
                  value={editData.name}
                  onChange={handleEditChange}
                  required
                  disabled={saving}
                />
              </ModalFormGroup>

              <ModalFormGroup>
                <ModalLabel>Email (não editável)</ModalLabel>
                <ModalInput
                  type="email"
                  value={userData.email}
                  disabled
                />
              </ModalFormGroup>

              <ModalFormGroup>
                <ModalLabel>Telefone</ModalLabel>
                <ModalInput
                  type="tel"
                  name="phone"
                  placeholder="(11) 99999-9999"
                  value={editData.phone}
                  onChange={handleEditChange}
                  disabled={saving}
                />
              </ModalFormGroup>

              {message.text && (
                <Message $success={message.success}>
                  {message.text}
                </Message>
              )}

              <ModalButtonGroup>
                <ModalCancelButton
                  type="button"
                  onClick={() => !saving && setIsEditing(false)}
                  disabled={saving}
                >
                  Cancelar
                </ModalCancelButton>
                <ModalSaveButton type="submit" disabled={saving}>
                  {saving ? '⏳ Salvando...' : '💾 Salvar'}
                </ModalSaveButton>
              </ModalButtonGroup>
            </ModalForm>
          </Modal>
        </Overlay>
      )}
    </>
  );
};

export default Perfil;