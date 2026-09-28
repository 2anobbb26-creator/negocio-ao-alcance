import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { auth, authService } from '../services/firebase';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
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
  backdrop-filter: blur(10px);
  border-radius: 28px;
  padding: 40px;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.06);

  @media (max-width: 480px) {
    padding: 24px;
    border-radius: 22px;
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
  margin-bottom: 16px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

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
  color: #a8b8d8;
  font-size: 1rem;
  margin: 0;
  text-align: center;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
`;

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

  &:hover {
    background: linear-gradient(135deg, #142952 0%, #1e3a8a 50%, #2563eb 100%);
    transform: translateY(-2px);
  }
`;

const Divider = styled.div`
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(74, 140, 247, 0.3), transparent);
  margin: 32px 0;
`;

const SectionTitle = styled.h3`
  color: #e8eef7;
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
  background: rgba(74, 140, 247, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(74, 140, 247, 0.15);
  flex-shrink: 0;
`;

const InfoContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const InfoLabel = styled.div`
  color: #a8b8d8;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 700;
  margin-bottom: 4px;
`;

const InfoValue = styled.div`
  color: #e8eef7;
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
  background: rgba(10, 21, 48, 0.6);
  border-radius: 14px;
  padding: 20px 12px;
  text-align: center;
  border: 1px solid rgba(74, 140, 247, 0.15);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(74, 140, 247, 0.35);
  }
`;

const StatValue = styled.div`
  font-size: 1.8rem;
  font-weight: 800;
  color: #e8eef7;

  @media (max-width: 480px) {
    font-size: 1.4rem;
  }
`;

const StatLabel = styled.div`
  color: #a8b8d8;
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
  font-family: 'Poppins', 'Inter', sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 32px auto 0;
  letter-spacing: 0.8px;

  &:hover {
    background: linear-gradient(135deg, #142952 0%, #1e3a8a 50%, #2563eb 100%);
    transform: translateY(-2px);
  }
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
`;

const Modal = styled.div`
  background: linear-gradient(145deg, #0d1b3e 0%, #0a1530 100%);
  border: 1px solid rgba(74, 140, 247, 0.3);
  border-radius: 24px;
  padding: 32px;
  max-width: 500px;
  width: 100%;
  position: relative;

  @media (max-width: 480px) {
    padding: 24px;
  }
`;

const ModalTitle = styled.h2`
  color: #e8eef7;
  font-size: 1.5rem;
  margin-bottom: 24px;
  font-weight: 800;
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
  color: #a8b8d8;
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
  color: #e8eef7;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-color: rgba(74, 140, 247, 0.5);
    box-shadow: 0 0 0 4px rgba(74, 140, 247, 0.1);
  }

  &::placeholder {
    color: #556677;
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
  color: #a8b8d8;
  font-family: 'Poppins', 'Inter', sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 0.5px;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
  }
`;

const ModalCloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 20px;
  background: none;
  border: none;
  color: #a8b8d8;
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
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', success: true });

  // ⚡ CARREGAMENTO INSTANTÂNEO - SEM ESPERAR FIRESTORE
  useEffect(() => {
    const currentUser = auth.currentUser;
    
    if (currentUser) {
      // Dados iniciais instantâneos (do Auth)
      const initialData = {
        name: currentUser.displayName || currentUser.email?.split('@')[0] || 'Usuário',
        email: currentUser.email,
        phone: '',
        uid: currentUser.uid,
        createdAt: currentUser.metadata?.creationTime,
        lastLogin: currentUser.metadata?.lastSignInTime,
        emailVerified: currentUser.emailVerified
      };

      setUserData(initialData);
      setEditData({ name: initialData.name, phone: '' });

      // 🔄 BUSCAR DADOS DO FIRESTORE EM SEGUNDO PLANO (sem bloquear)
      authService.getUserData(currentUser.uid)
        .then((result) => {
          if (result.success && result.data) {
            setUserData(prev => ({
              ...prev,
              name: result.data.name || prev.name,
              phone: result.data.phone || ''
            }));
            setEditData(prev => ({
              ...prev,
              name: result.data.name || prev.name,
              phone: result.data.phone || ''
            }));
          }
        })
        .catch((error) => {
          console.warn('⚠️ Erro ao buscar dados extras do Firestore:', error);
        });
    }
  }, []);

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
      
      setUserData(prev => ({
        ...prev,
        name: editData.name.trim(),
        phone: editData.phone.trim()
      }));

      setTimeout(() => {
        setIsEditing(false);
        setMessage({ text: '', success: true });
      }, 1500);
    } else {
      setMessage({ text: `❌ Erro: ${result.error}`, success: false });
    }

    setSaving(false);
  };

  // ⚡ SE NÃO TIVER DADOS AINDA, MOSTRA NADA (evita loading demorado)
  if (!userData) {
    return (
      <Container>
        <Card>
          <AvatarSection>
            <Avatar>...</Avatar>
            <UserName>Carregando...</UserName>
          </AvatarSection>
        </Card>
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