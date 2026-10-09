import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import {
  FiUser, FiMail, FiPhone, FiCalendar, FiLogOut,
  FiEdit2, FiLock, FiTrash2, FiShield, FiHeart,
  FiSearch, FiBriefcase, FiCheckCircle, FiX, FiAlertTriangle
} from 'react-icons/fi';
import { auth, authService } from '../services/firebase';

// ─── ANIMAÇÕES ─────────────────────────────────────────────
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50%      { transform: scale(1.05); opacity: 0.85; }
`;

const skeleton = keyframes`
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

// ─── LAYOUT ────────────────────────────────────────────────
const Container = styled.div`
  max-width: 1080px;
  margin: 40px auto;
  padding: 20px;
  animation: ${fadeInUp} 0.6s ease-out;

  @media (max-width: 768px) { margin: 20px auto; padding: 16px; }
`;

const PageTitle = styled.h1`
  font-size: 1.9rem;
  font-weight: 800;
  color: #e8eef7;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;

  @media (max-width: 480px) { font-size: 1.5rem; }
`;

const PageSubtitle = styled.p`
  color: #a8b8d8;
  margin: 0 0 32px 0;
  font-size: 0.95rem;
`;

const Section = styled.section`
  margin-bottom: 24px;
  animation: ${fadeInUp} 0.6s ease-out backwards;
  animation-delay: ${props => props.$delay || '0s'};
`;

const SectionTitle = styled.h2`
  color: #e8eef7;
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0 14px 4px;
  display: flex;
  align-items: center;
  gap: 10px;
  letter-spacing: 0.3px;

  svg { color: #4a8cf7; }
`;

const Grid2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 768px) { grid-template-columns: 1fr; gap: 16px; }
`;

// ─── CARDS ─────────────────────────────────────────────────
const Card = styled.div`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  padding: 24px;
  position: relative;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(74, 140, 247, 0.2);
  }

  @media (max-width: 480px) { padding: 20px; border-radius: 16px; }
`;

// ─── HEADER DO PERFIL ──────────────────────────────────────
const ProfileHeader = styled(Card)`
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 32px;

  @media (max-width: 600px) {
    flex-direction: column;
    text-align: center;
    padding: 24px;
    gap: 16px;
  }
`;

const AvatarWrap = styled.div`
  position: relative;
  flex-shrink: 0;
`;

const Avatar = styled.div`
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.4rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: -1px;
  box-shadow: 
    0 0 0 3px #0a1530,
    0 0 0 5px transparent,
    0 6px 18px rgba(37, 99, 235, 0.3);
  border: none;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: -5px;
    border-radius: 50%;
    background: linear-gradient(135deg, #60a5fa, #1d4ed8, #3b82f6);
    z-index: -1;
  }
`;

const VerifiedBadge = styled.div`
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  border: 3px solid #0a1530;
  font-size: 0.75rem;
  animation: ${pulse} 3s ease-in-out infinite;
`;

const HeaderInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const UserName = styled.h2`
  font-size: 1.6rem;
  font-weight: 800;
  margin: 0 0 6px 0;
  letter-spacing: -0.4px;
  color: #fff;
  word-break: break-word;

  @media (max-width: 480px) { font-size: 1.3rem; }
`;

const UserMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #a8b8d8;
  font-size: 0.9rem;
  margin-bottom: 4px;
  flex-wrap: wrap;

  svg { flex-shrink: 0; }
`;

const EditButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
  border: 1px solid rgba(74, 140, 247, 0.4);
  border-radius: 10px;
  color: #fff;
  font-size: 0.85rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.25s ease;
  letter-spacing: 0.4px;

  &:hover {
    background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(37, 99, 235, 0.25);
  }
`;

// ─── ESTATÍSTICAS ──────────────────────────────────────────
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;

  @media (max-width: 480px) { gap: 10px; }
`;

const StatCard = styled(Card)`
  padding: 20px 16px;
  text-align: center;

  &:hover {
    transform: translateY(-3px);
    border-color: rgba(74, 140, 247, 0.3);
  }
`;

const StatIcon = styled.div`
  font-size: 1.3rem;
  color: #4a8cf7;
  margin-bottom: 8px;
`;

const StatValue = styled.div`
  font-size: 1.7rem;
  font-weight: 800;
  color: #fff;
  line-height: 1;

  @media (max-width: 480px) { font-size: 1.3rem; }
`;

const StatLabel = styled.div`
  color: #a8b8d8;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  font-weight: 700;
  margin-top: 6px;
`;

// ─── LISTA DE INFO ─────────────────────────────────────────
const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 4px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);

  &:last-child { border-bottom: none; }
`;

const InfoIconBox = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: rgba(74, 140, 247, 0.1);
  border: 1px solid rgba(74, 140, 247, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #7eb8ff;
  font-size: 1rem;
  flex-shrink: 0;
`;

const InfoBody = styled.div`
  flex: 1;
  min-width: 0;
`;

const InfoLabel = styled.div`
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 700;
  color: #a8b8d8;
  margin-bottom: 2px;
`;

const InfoValue = styled.div`
  font-size: 0.95rem;
  font-weight: 600;
  color: #e8eef7;
  word-break: break-word;
`;

const StatusPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  background: ${p => p.$ok ? 'rgba(34, 197, 94, 0.12)' : 'rgba(251, 191, 36, 0.12)'};
  border: 1px solid ${p => p.$ok ? 'rgba(34, 197, 94, 0.3)' : 'rgba(251, 191, 36, 0.3)'};
  color: ${p => p.$ok ? '#4ade80' : '#fbbf24'};
`;

// ─── AÇÕES ─────────────────────────────────────────────────
const ActionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 14px 16px;
  background: rgba(10, 21, 48, 0.5);
  border: 1px solid rgba(74, 140, 247, 0.15);
  border-radius: 12px;
  color: #e8eef7;
  font-family: inherit;
  font-size: 0.92rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  text-align: left;

  svg { color: #7eb8ff; flex-shrink: 0; }
  span.arrow { margin-left: auto; color: #556677; transition: transform 0.25s; }

  &:hover {
    background: rgba(30, 58, 138, 0.18);
    border-color: rgba(74, 140, 247, 0.35);
    transform: translateX(2px);

    span.arrow { transform: translateX(4px); color: #7eb8ff; }
  }

  &:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  ${p => p.$danger && `
    border-color: rgba(239, 68, 68, 0.2);
    color: #f87171;

    svg { color: #f87171; }

    &:hover {
      background: rgba(239, 68, 68, 0.1);
      border-color: rgba(239, 68, 68, 0.4);
    }
  `}
`;

// ─── MODAIS ────────────────────────────────────────────────
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(10px);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  animation: ${fadeInUp} 0.2s ease-out;
`;

const Modal = styled.div`
  background: linear-gradient(145deg, #0d1b3e 0%, #0a1530 100%);
  border: 1px solid rgba(74, 140, 247, 0.25);
  border-radius: 22px;
  padding: 28px;
  max-width: 480px;
  width: 100%;
  position: relative;
  max-height: 90vh;
  overflow-y: auto;

  @media (max-width: 480px) { padding: 22px; border-radius: 18px; }
`;

const ModalClose = styled.button`
  position: absolute;
  top: 14px;
  right: 14px;
  background: none;
  border: none;
  color: #a8b8d8;
  cursor: pointer;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  transition: all 0.2s;

  &:hover { background: rgba(255, 255, 255, 0.06); color: #fff; }
`;

const ModalIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${p => p.$danger ? 'rgba(239, 68, 68, 0.12)' : 'rgba(74, 140, 247, 0.12)'};
  color: ${p => p.$danger ? '#f87171' : '#7eb8ff'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  margin-bottom: 16px;
  border: 1px solid ${p => p.$danger ? 'rgba(239, 68, 68, 0.3)' : 'rgba(74, 140, 247, 0.25)'};
`;

const ModalTitle = styled.h2`
  color: #e8eef7;
  font-size: 1.25rem;
  margin: 0 0 8px 0;
  font-weight: 800;
`;

const ModalText = styled.p`
  color: #a8b8d8;
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0 0 22px 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  color: #a8b8d8;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.9px;
  text-transform: uppercase;
`;

const Input = styled.input`
  padding: 13px 16px;
  background: rgba(10, 21, 48, 0.7);
  border: 1.5px solid rgba(74, 140, 247, 0.2);
  border-radius: 11px;
  color: #e8eef7;
  font-size: 0.95rem;
  font-family: inherit;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: rgba(74, 140, 247, 0.5);
    box-shadow: 0 0 0 4px rgba(74, 140, 247, 0.1);
  }

  &::placeholder { color: #556677; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 6px;

  @media (max-width: 480px) { flex-direction: column; }
`;

const Btn = styled.button`
  flex: 1;
  padding: 13px 20px;
  border-radius: 11px;
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  letter-spacing: 0.4px;

  &:disabled { opacity: 0.6; cursor: not-allowed; transform: none !important; }
`;

const BtnPrimary = styled(Btn)`
  background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
  border: 1px solid rgba(74, 140, 247, 0.4);
  color: #fff;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
  }
`;

const BtnGhost = styled(Btn)`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #a8b8d8;

  &:hover:not(:disabled) { background: rgba(255, 255, 255, 0.1); color: #fff; }
`;

const BtnDanger = styled(Btn)`
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.35);
  color: #f87171;

  &:hover:not(:disabled) {
    background: rgba(239, 68, 68, 0.2);
    color: #fff;
    transform: translateY(-2px);
  }
`;

const Message = styled.div`
  padding: 11px 14px;
  border-radius: 10px;
  font-size: 0.85rem;
  text-align: center;
  font-weight: 600;
  background: ${p => p.$ok ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
  border: 1px solid ${p => p.$ok ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'};
  color: ${p => p.$ok ? '#4ade80' : '#f87171'};
`;

// ─── SKELETON ──────────────────────────────────────────────
const SkeletonBox = styled.div`
  background: linear-gradient(90deg,
    rgba(255, 255, 255, 0.04) 0%,
    rgba(255, 255, 255, 0.08) 50%,
    rgba(255, 255, 255, 0.04) 100%);
  background-size: 800px 100%;
  animation: ${skeleton} 1.6s infinite linear;
  border-radius: ${p => p.$radius || '12px'};
  height: ${p => p.$h || '20px'};
  width: ${p => p.$w || '100%'};
  margin-bottom: ${p => p.$mb || '0'};
`;

// ─── HELPERS ───────────────────────────────────────────────
const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
};

const formatDate = (dateString) => {
  if (!dateString) return 'Não disponível';
  try {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
  } catch { return 'Não disponível'; }
};

// ─── COMPONENTE ────────────────────────────────────────────
const Perfil = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [favoritesCount, setFavoritesCount] = useState(0);

  // Modais
  const [modal, setModal] = useState(null); // 'edit' | 'logout' | 'delete' | 'password'
  const [editData, setEditData] = useState({ name: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', ok: true });

  // ─── CARREGAMENTO ────────────────────────────────────────
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    // 1) Imediato: Auth
    const initial = {
      name: currentUser.displayName || currentUser.email?.split('@')[0] || 'Usuário',
      email: currentUser.email,
      phone: '',
      uid: currentUser.uid,
      createdAt: currentUser.metadata?.creationTime,
      lastLogin: currentUser.metadata?.lastSignInTime,
      emailVerified: currentUser.emailVerified,
    };
    setUserData(initial);
    setEditData({ name: initial.name, phone: '' });

    // 2) Firestore em background
    authService.getUserData(currentUser.uid)
      .then((res) => {
        if (res.success && res.data) {
          setUserData(prev => ({
            ...prev,
            name: res.data.name || prev.name,
            phone: res.data.phone || '',
          }));
          setEditData(prev => ({
            ...prev,
            name: res.data.name || prev.name,
            phone: res.data.phone || '',
          }));

          // Estatísticas reais
          const favs = res.data.favorites;
          setFavoritesCount(Array.isArray(favs) ? favs.length : 0);
        }
      })
      .catch((err) => console.warn('⚠️ Firestore:', err));
  }, []);

  // ─── AÇÕES ───────────────────────────────────────────────
  const openModal = (type) => {
    setMessage({ text: '', ok: true });
    if (type === 'edit' && userData) {
      setEditData({ name: userData.name, phone: userData.phone || '' });
    }
    setModal(type);
  };

  const closeModal = () => !saving && setModal(null);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', ok: true });

    if (!editData.name.trim() || editData.name.trim().length < 3) {
      setMessage({ text: 'O nome deve ter pelo menos 3 caracteres', ok: false });
      setSaving(false);
      return;
    }

    try {
      const result = await authService.updateProfile(
        { uid: userData.uid },
        { name: editData.name.trim(), phone: editData.phone.trim() }
      );

      if (result.success) {
        setUserData(prev => ({
          ...prev,
          name: editData.name.trim(),
          phone: editData.phone.trim(),
        }));
        setMessage({ text: 'Perfil atualizado com sucesso!', ok: true });
        setTimeout(() => setModal(null), 1400);
      } else {
        setMessage({ text: `Erro: ${result.error}`, ok: false });
      }
    } catch (err) {
      setMessage({ text: 'Erro inesperado ao salvar', ok: false });
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    setSaving(true);
    try {
      await authService.logout();
      navigate('/login');
    } catch (err) {
      setMessage({ text: 'Erro ao sair', ok: false });
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setSaving(true);
    setMessage({ text: '', ok: true });
    try {
      const result = await authService.deleteAccount();
      if (result?.success !== false) {
        navigate('/login');
      } else {
        setMessage({ text: `Erro: ${result.error}`, ok: false });
        setSaving(false);
      }
    } catch (err) {
      setMessage({ text: 'Erro ao excluir conta', ok: false });
      setSaving(false);
    }
  };

  const handleResetPassword = async () => {
    setSaving(true);
    setMessage({ text: '', ok: true });
    try {
      const result = await authService.resetPassword(userData.email);
      if (result?.success !== false) {
        setMessage({ text: 'Enviamos um link de redefinição para seu email.', ok: true });
      } else {
        setMessage({ text: `Erro: ${result.error}`, ok: false });
      }
    } catch (err) {
      setMessage({ text: 'Erro ao enviar link', ok: false });
    }
    setSaving(false);
  };

  // ─── SKELETON ────────────────────────────────────────────
  if (!userData) {
    return (
      <Container>
        <PageTitle>Meu Perfil</PageTitle>
        <PageSubtitle>Gerencie suas informações</PageSubtitle>
        <ProfileHeader>
          <SkeletonBox $w="96px" $h="96px" $radius="50%" />
          <div style={{ flex: 1 }}>
            <SkeletonBox $w="60%" $h="24px" $mb="10px" />
            <SkeletonBox $w="40%" $h="16px" />
          </div>
        </ProfileHeader>
      </Container>
    );
  }

  // ─── RENDER ──────────────────────────────────────────────
  return (
    <>
      <Container>
        <PageTitle>Meu Perfil</PageTitle>
        <PageSubtitle>Gerencie suas informações e preferências</PageSubtitle>

        {/* HEADER */}
        <Section $delay="0.05s">
          <ProfileHeader>
            <AvatarWrap>
              <Avatar>{getInitials(userData.name)}</Avatar>
              {userData.emailVerified && (
                <VerifiedBadge title="Email verificado">
                  <FiCheckCircle />
                </VerifiedBadge>
              )}
            </AvatarWrap>
            <HeaderInfo>
              <UserName>{userData.name}</UserName>
              <UserMeta>
                <FiMail size={14} />
                {userData.email}
              </UserMeta>
              {userData.phone && (
                <UserMeta>
                  <FiPhone size={14} />
                  {userData.phone}
                </UserMeta>
              )}
              <EditButton onClick={() => openModal('edit')}>
                <FiEdit2 size={14} />
                Editar Perfil
              </EditButton>
            </HeaderInfo>
          </ProfileHeader>
        </Section>

        {/* ESTATÍSTICAS */}
        <Section $delay="0.1s">
          <SectionTitle>
            <FiBriefcase size={16} />
            Estatísticas
          </SectionTitle>
          <StatsGrid>
            <StatCard>
              <StatIcon><FiHeart /></StatIcon>
              <StatValue>{favoritesCount}</StatValue>
              <StatLabel>Favoritos</StatLabel>
            </StatCard>
            <StatCard>
              <StatIcon><FiSearch /></StatIcon>
              <StatValue>0</StatValue>
              <StatLabel>Buscas</StatLabel>
            </StatCard>
            <StatCard>
              <StatIcon><FiBriefcase /></StatIcon>
              <StatValue>0</StatValue>
              <StatLabel>Negócios</StatLabel>
            </StatCard>
          </StatsGrid>
        </Section>

        {/* 2 COLUNAS: INFO + SEGURANÇA */}
        <Section $delay="0.15s">
          <Grid2>
            {/* INFORMAÇÕES DA CONTA */}
            <div>
              <SectionTitle>
                <FiUser size={16} />
                Informações da Conta
              </SectionTitle>
              <Card>
                <InfoList>
                  <InfoRow>
                    <InfoIconBox><FiUser /></InfoIconBox>
                    <InfoBody>
                      <InfoLabel>Nome completo</InfoLabel>
                      <InfoValue>{userData.name}</InfoValue>
                    </InfoBody>
                  </InfoRow>
                  <InfoRow>
                    <InfoIconBox><FiMail /></InfoIconBox>
                    <InfoBody>
                      <InfoLabel>Email</InfoLabel>
                      <InfoValue>{userData.email}</InfoValue>
                    </InfoBody>
                  </InfoRow>
                  <InfoRow>
                    <InfoIconBox><FiPhone /></InfoIconBox>
                    <InfoBody>
                      <InfoLabel>Telefone</InfoLabel>
                      <InfoValue>{userData.phone || 'Não informado'}</InfoValue>
                    </InfoBody>
                  </InfoRow>
                  <InfoRow>
                    <InfoIconBox><FiCalendar /></InfoIconBox>
                    <InfoBody>
                      <InfoLabel>Conta criada em</InfoLabel>
                      <InfoValue>{formatDate(userData.createdAt)}</InfoValue>
                    </InfoBody>
                  </InfoRow>
                  <InfoRow>
                    <InfoIconBox><FiCalendar /></InfoIconBox>
                    <InfoBody>
                      <InfoLabel>Último acesso</InfoLabel>
                      <InfoValue>{formatDate(userData.lastLogin)}</InfoValue>
                    </InfoBody>
                  </InfoRow>
                  <InfoRow>
                    <InfoIconBox><FiCheckCircle /></InfoIconBox>
                    <InfoBody>
                      <InfoLabel>Status do email</InfoLabel>
                      <StatusPill $ok={userData.emailVerified}>
                        <FiCheckCircle size={11} />
                        {userData.emailVerified ? 'Verificado' : 'Não verificado'}
                      </StatusPill>
                    </InfoBody>
                  </InfoRow>
                </InfoList>
              </Card>
            </div>

            {/* SEGURANÇA */}
            <div>
              <SectionTitle>
                <FiShield size={16} />
                Segurança
              </SectionTitle>
              <Card>
                <ActionList>
                  <ActionButton onClick={() => openModal('password')}>
                    <FiLock />
                    Alterar senha
                    <span className="arrow">→</span>
                  </ActionButton>
                  <ActionButton onClick={() => openModal('logout')}>
                    <FiLogOut />
                    Sair da conta
                    <span className="arrow">→</span>
                  </ActionButton>
                  <ActionButton $danger onClick={() => openModal('delete')}>
                    <FiTrash2 />
                    Excluir conta
                    <span className="arrow">→</span>
                  </ActionButton>
                </ActionList>
              </Card>
            </div>
          </Grid2>
        </Section>
      </Container>

      {/* ─── MODAL: EDITAR PERFIL ────────────────────────── */}
      {modal === 'edit' && (
        <Overlay onClick={closeModal}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalClose onClick={closeModal} disabled={saving}><FiX /></ModalClose>
            <ModalIcon><FiEdit2 /></ModalIcon>
            <ModalTitle>Editar Perfil</ModalTitle>
            <ModalText>Atualize suas informações pessoais.</ModalText>

            <Form onSubmit={handleSaveProfile}>
              <Field>
                <Label>Nome completo</Label>
                <Input
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={handleEditChange}
                  placeholder="Digite seu nome"
                  required
                  disabled={saving}
                />
              </Field>
              <Field>
                <Label>Email (não editável)</Label>
                <Input type="email" value={userData.email} disabled />
              </Field>
              <Field>
                <Label>Telefone</Label>
                <Input
                  type="tel"
                  name="phone"
                  value={editData.phone}
                  onChange={handleEditChange}
                  placeholder="(11) 99999-9999"
                  disabled={saving}
                />
              </Field>

              {message.text && <Message $ok={message.ok}>{message.text}</Message>}

              <ButtonGroup>
                <BtnGhost type="button" onClick={closeModal} disabled={saving}>
                  Cancelar
                </BtnGhost>
                <BtnPrimary type="submit" disabled={saving}>
                  {saving ? 'Salvando...' : 'Salvar alterações'}
                </BtnPrimary>
              </ButtonGroup>
            </Form>
          </Modal>
        </Overlay>
      )}

      {/* ─── MODAL: TROCAR SENHA ─────────────────────────── */}
      {modal === 'password' && (
        <Overlay onClick={closeModal}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalClose onClick={closeModal} disabled={saving}><FiX /></ModalClose>
            <ModalIcon><FiLock /></ModalIcon>
            <ModalTitle>Alterar senha</ModalTitle>
            <ModalText>
              Enviaremos um link para <strong>{userData.email}</strong>.
              Clique nele para definir uma nova senha com segurança.
            </ModalText>

            {message.text && <Message $ok={message.ok}>{message.text}</Message>}

            <ButtonGroup>
              <BtnGhost type="button" onClick={closeModal} disabled={saving}>
                Fechar
              </BtnGhost>
              <BtnPrimary onClick={handleResetPassword} disabled={saving}>
                {saving ? 'Enviando...' : 'Enviar link'}
              </BtnPrimary>
            </ButtonGroup>
          </Modal>
        </Overlay>
      )}

      {/* ─── MODAL: LOGOUT ───────────────────────────────── */}
      {modal === 'logout' && (
        <Overlay onClick={closeModal}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalClose onClick={closeModal} disabled={saving}><FiX /></ModalClose>
            <ModalIcon $danger><FiLogOut /></ModalIcon>
            <ModalTitle>Sair da conta</ModalTitle>
            <ModalText>Tem certeza que deseja sair? Você poderá entrar novamente depois.</ModalText>
            <ButtonGroup>
              <BtnGhost onClick={closeModal} disabled={saving}>Cancelar</BtnGhost>
              <BtnDanger onClick={handleLogout} disabled={saving}>
                <FiLogOut size={14} />
                {saving ? 'Saindo...' : 'Sair'}
              </BtnDanger>
            </ButtonGroup>
          </Modal>
        </Overlay>
      )}

      {/* ─── MODAL: EXCLUIR CONTA ────────────────────────── */}
      {modal === 'delete' && (
        <Overlay onClick={closeModal}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalClose onClick={closeModal} disabled={saving}><FiX /></ModalClose>
            <ModalIcon $danger><FiAlertTriangle /></ModalIcon>
            <ModalTitle>Excluir conta permanentemente</ModalTitle>
            <ModalText>
              <strong style={{ color: '#f87171' }}>Esta ação é irreversível.</strong><br />
              Todos os seus dados, favoritos e histórico serão apagados para sempre.
            </ModalText>

            {message.text && <Message $ok={message.ok}>{message.text}</Message>}

            <ButtonGroup>
              <BtnGhost onClick={closeModal} disabled={saving}>Cancelar</BtnGhost>
              <BtnDanger onClick={handleDeleteAccount} disabled={saving}>
                <FiTrash2 size={14} />
                {saving ? 'Excluindo...' : 'Excluir conta'}
              </BtnDanger>
            </ButtonGroup>
          </Modal>
        </Overlay>
      )}
    </>
  );
};

export default Perfil;