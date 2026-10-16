import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { auth, authService } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import ShareButton from './ShareButton';
import { useToast } from './Toast';
import {
  shouldShowConfetti,
  markConfettiShown,
  fireFavoriteConfetti,
} from '../utils/confetti';

/* ─────────────────────────────  Animações  ───────────────────────────── */
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1);   opacity: 1; }
  50%      { transform: scale(1.4); opacity: 0.6; }
`;

/* ─────────────────────────────  Card  ───────────────────────────── */
const Card = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 22px 22px 20px;
  border-radius: 18px;
  overflow: hidden;
  cursor: default;

  background:
    radial-gradient(circle at 0% 0%, rgba(74, 140, 247, 0.09), transparent 45%),
    radial-gradient(circle at 100% 100%, rgba(168, 85, 247, 0.07), transparent 45%),
    linear-gradient(160deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.015) 100%);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.07);
  box-shadow:
    0 4px 24px rgba(0, 0, 0, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);

  color: #e0e0e0;
  animation: ${fadeIn} 0.5s ease-out both;
  transform-style: preserve-3d;
  will-change: transform, box-shadow;

  transition:
    transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275),
    box-shadow 0.35s ease,
    border-color 0.35s ease,
    background 0.35s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2.5px;
    background: linear-gradient(90deg,
      #4f7cff 0%,
      #7eb8ff 30%,
      #a855f7 60%,
      #ec4899 100%);
    background-size: 200% 100%;
    opacity: 0.75;
    transition: opacity 0.4s ease;
  }

  &::after {
    content: '';
    position: absolute;
    inset: -1px;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(135deg,
      rgba(126, 184, 255, 0.6),
      transparent 30%,
      transparent 70%,
      rgba(168, 85, 247, 0.5));
    -webkit-mask:
      linear-gradient(#000 0 0) content-box,
      linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
            mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.4s ease;
    pointer-events: none;
  }

  &:hover {
    transform:
      perspective(1000px)
      rotateX(2deg)
      rotateY(-2deg)
      translateY(-8px)
      scale(1.02);

    box-shadow:
      0 24px 48px rgba(0, 0, 0, 0.45),
      0 0 40px rgba(74, 140, 247, 0.18),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);

    border-color: rgba(74, 140, 247, 0.35);
    background:
      radial-gradient(circle at 0% 0%, rgba(74, 140, 247, 0.15), transparent 50%),
      radial-gradient(circle at 100% 100%, rgba(168, 85, 247, 0.1), transparent 50%),
      linear-gradient(160deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%);

    &::before { opacity: 1; animation: ${shimmer} 3s ease infinite; }
    &::after  { opacity: 1; }
  }

  &:active {
    transform:
      perspective(1000px)
      rotateX(1deg)
      rotateY(-1deg)
      translateY(-4px)
      scale(1.01);
  }

  @media (max-width: 768px) {
    &:hover {
      transform: translateY(-4px);
    }
  }

  @media (max-width: 480px) {
    padding: 18px;
    border-radius: 14px;
  }
`;

const TopActions = styled.div`
  position: absolute;
  top: 14px;
  right: 14px;
  display: flex;
  gap: 8px;
  align-items: center;
  z-index: 10;

  @media (max-width: 480px) {
    top: 12px;
    right: 12px;
    gap: 6px;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 14px;
  padding-right: 88px;

  @media (max-width: 480px) {
    gap: 10px;
    padding-right: 84px;
  }
`;

const EmojiWrapper = styled.div`
  position: relative;
  flex-shrink: 0;
  width: 52px;
  height: 52px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  font-size: 1.9rem;
  line-height: 1;

  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.07);

  @media (max-width: 480px) {
    width: 46px;
    height: 46px;
    font-size: 1.65rem;
    border-radius: 12px;
  }
`;

const HeaderContent = styled.div`
  flex: 1;
  min-width: 0;
  padding-top: 2px;
`;

const Name = styled.h3`
  font-size: 1.05rem;
  color: #eef4ff;
  margin: 0 0 8px;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.01em;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (max-width: 480px) {
    font-size: 0.98rem;
  }
`;

const Category = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: #9db8ff;
  background: rgba(74, 140, 247, 0.1);
  border: 1px solid rgba(74, 140, 247, 0.28);
  border-radius: 999px;

  @media (max-width: 480px) {
    font-size: 0.58rem;
    padding: 2px 8px;
  }
`;

const FavoriteButton = styled.button`
  background: ${props => props.$favorited
    ? 'rgba(239, 68, 68, 0.15)'
    : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${props => props.$favorited
    ? 'rgba(239, 68, 68, 0.4)'
    : 'rgba(255, 255, 255, 0.1)'};
  width: 38px;
  height: 38px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  padding: 0;
  flex-shrink: 0;
  filter: ${props => props.$favorited
    ? 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.5))'
    : 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))'};

  &:hover {
    background: ${props => props.$favorited
      ? 'rgba(239, 68, 68, 0.25)'
      : 'rgba(239, 68, 68, 0.1)'};
    border-color: rgba(239, 68, 68, 0.5);
    transform: scale(1.1);
  }

  &:active { transform: scale(0.95); }
  &:disabled { opacity: 0.6; cursor: not-allowed; }

  @media (max-width: 480px) {
    width: 34px;
    height: 34px;
    font-size: 1rem;
  }
`;

const BadgeContainer = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin: 0 0 14px;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  border-radius: 999px;
  background: ${props => props.$bg || 'rgba(74, 140, 247, 0.08)'};
  color: ${props => props.$fg || '#9db8ff'};
  border: 1px solid ${props => props.$border || 'rgba(74, 140, 247, 0.3)'};

  @media (max-width: 480px) {
    font-size: 0.56rem;
    padding: 2px 8px;
  }
`;

const Description = styled.p`
  color: #94a3b8;
  font-size: 0.85rem;
  line-height: 1.55;
  margin: 0 0 14px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const Investment = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  margin: 0 0 16px;
  border-radius: 10px;
  font-size: 0.85rem;
  color: #cbd5e1;

  background: linear-gradient(90deg,
    rgba(74, 140, 247, 0.1),
    rgba(168, 85, 247, 0.05));
  border: 1px solid rgba(74, 140, 247, 0.22);

  .label {
    color: #8ea9d8;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.65rem;
    letter-spacing: 0.06em;
  }

  .value {
    margin-left: auto;
    color: #fff;
    font-weight: 700;
    font-size: 0.9rem;
    white-space: nowrap;
  }

  @media (max-width: 480px) {
    padding: 8px 12px;
    font-size: 0.8rem;

    .value { font-size: 0.85rem; }
  }
`;

const DetailButton = styled.button`
  position: relative;
  width: 100%;
  padding: 12px 16px;
  margin-top: auto;
  border-radius: 12px;
  border: 1px solid rgba(74, 140, 247, 0.35);
  background: rgba(74, 140, 247, 0.08);
  color: #cbd9ff;
  font-family: inherit;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  overflow: hidden;
  transition:
    color 0.3s ease,
    background 0.3s ease,
    border-color 0.3s ease,
    box-shadow 0.3s ease,
    transform 0.15s ease;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, #4f7cff, #7c5cff, #a855f7);
    background-size: 200% 100%;
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 0;
  }

  span { position: relative; z-index: 1; }

  &:hover {
    color: #fff;
    border-color: transparent;
    box-shadow: 0 10px 24px -10px rgba(79, 124, 255, 0.8);
    transform: translateY(-1px);

    &::before {
      opacity: 1;
      animation: ${shimmer} 3s ease infinite;
    }
  }

  &:active { transform: translateY(0) scale(0.98); }

  @media (max-width: 480px) {
    font-size: 0.72rem;
    padding: 11px;
  }
`;

/* ─────────────────────────────────────────────────────────────────────
   COMPONENTE
   ───────────────────────────────────────────────────────────────────── */
const BusinessCard = ({ business, style }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => setCurrentUser(user));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    const storageKey = `favorites_${currentUser.uid}`;
    const savedFavorites = JSON.parse(localStorage.getItem(storageKey) || '[]');
    setFavorited(savedFavorites.includes(business.id));
  }, [business.id, currentUser]);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();

    if (!currentUser) {
      showToast('Faça login para favoritar!', 'warning');
      return;
    }

    setLoading(true);
    const storageKey = `favorites_${currentUser.uid}`;
    const savedFavorites = JSON.parse(localStorage.getItem(storageKey) || '[]');

    if (favorited) {
      const newFavorites = savedFavorites.filter(id => id !== business.id);
      localStorage.setItem(storageKey, JSON.stringify(newFavorites));
      setFavorited(false);
      showToast('💔 Removido dos favoritos', 'info');

      authService.removeFavorite(currentUser.uid, business.id)
        .catch(err => console.warn('⚠️ Firestore erro:', err));
    } else {
      if (!savedFavorites.includes(business.id)) {
        savedFavorites.push(business.id);
        localStorage.setItem(storageKey, JSON.stringify(savedFavorites));
      }
      setFavorited(true);
      showToast('❤️ Adicionado aos favoritos!', 'success');

      // ⭐ CONFETTI na primeira vez
      if (shouldShowConfetti(currentUser.uid)) {
        fireFavoriteConfetti();
        markConfettiShown(currentUser.uid);
      }

      authService.addFavorite(currentUser.uid, business.id)
        .catch(err => console.warn('⚠️ Firestore erro:', err));

      setTimeout(() => navigate('/favoritos'), 400);
    }
    setLoading(false);
  };

  const formatInvestment = (min, max) => {
    if (min === max) return `R$ ${min.toLocaleString('pt-BR')}`;
    return `R$ ${min.toLocaleString('pt-BR')} - R$ ${max.toLocaleString('pt-BR')}`;
  };

  const handleDetailClick = () => navigate(`/business/${business.id}`);

  return (
    <Card style={style}>
      <TopActions>
        <ShareButton business={business} />
        <FavoriteButton
          $favorited={favorited}
          onClick={handleFavoriteClick}
          disabled={loading}
          title={favorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          {loading ? '⏳' : favorited ? '❤️' : '🤍'}
        </FavoriteButton>
      </TopActions>

      <CardHeader>
        <EmojiWrapper>{business.image}</EmojiWrapper>
        <HeaderContent>
          <Name>{business.name}</Name>
          <Category>{business.category}</Category>
        </HeaderContent>
      </CardHeader>

      <BadgeContainer>
        {business.minInvestment <= 500 && (
          <Badge
            $bg="rgba(74, 222, 128, 0.08)"
            $fg="#4ade80"
            $border="rgba(74, 222, 128, 0.3)"
          >
            💰 Baixo Investimento
          </Badge>
        )}
        {business.profitMargin && parseInt(business.profitMargin) > 70 && (
          <Badge
            $bg="rgba(251, 191, 36, 0.08)"
            $fg="#fbbf24"
            $border="rgba(251, 191, 36, 0.3)"
          >
            ⭐ Alta Margem
          </Badge>
        )}
        {business.payback && parseInt(business.payback) <= 3 && (
          <Badge
            $bg="rgba(96, 165, 250, 0.08)"
            $fg="#60a5fa"
            $border="rgba(96, 165, 250, 0.3)"
          >
            ⚡ Rápido Retorno
          </Badge>
        )}
      </BadgeContainer>

      <Description>{business.description}</Description>

      <Investment>
        <span className="label">💰 Investimento</span>
        <span className="value">
          {formatInvestment(business.minInvestment, business.maxInvestment)}
        </span>
      </Investment>

      <DetailButton onClick={handleDetailClick}>
        <span>📋 Ver Detalhes</span>
      </DetailButton>
    </Card>
  );
};

export default BusinessCard;