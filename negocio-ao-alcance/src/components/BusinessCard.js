import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { auth, authService } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import ShareButton from './ShareButton';
import { useToast } from './Toast';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  transition: 
    transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275),
    box-shadow 0.35s ease,
    border-color 0.35s ease,
    background 0.35s ease;
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: #e0e0e0;
  animation: ${fadeIn} 0.5s ease-out;
  position: relative;
  overflow: hidden;
  transform-style: preserve-3d;
  will-change: transform;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg,
      #ffffff 0%,
      #7eb8ff 35%,
      #a855f7 65%,
      #ffffff 100%
    );
    opacity: 0.85;
    transition: opacity 0.4s ease;
  }

  &:hover {
    transform: 
      perspective(1000px)
      rotateX(2deg)
      rotateY(-2deg)
      translateY(-8px)
      scale(1.02);

    box-shadow:
      0 24px 48px rgba(0, 0, 0, 0.4),
      0 0 30px rgba(74, 140, 247, 0.15);

    border-color: rgba(74, 140, 247, 0.35);
    background: rgba(255, 255, 255, 0.05);

    &::before {
      opacity: 1;
      height: 4px;
    }
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
  top: 16px;
  right: 16px;
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
  gap: 14px;
  margin-bottom: 10px;

  @media (max-width: 480px) {
    gap: 10px;
  }
`;

const Emoji = styled.span`
  font-size: 2.2rem;
  flex-shrink: 0;
  margin-top: 4px;

  @media (max-width: 480px) {
    font-size: 1.8rem;
  }
`;

const HeaderContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const Name = styled.h3`
  font-size: 1.2rem;
  color: #e8eef7;
  margin: 0;
  font-weight: 700;
  line-height: 1.3;
  padding-right: 95px;

  @media (max-width: 480px) {
    font-size: 1.05rem;
    padding-right: 85px;
  }

  @media (max-width: 360px) {
    font-size: 1rem;
    padding-right: 80px;
  }
`;

const Category = styled.span`
  display: inline-block;
  padding: 3px 12px;
  background: rgba(74, 140, 247, 0.12);
  border-radius: 20px;
  font-size: 0.65rem;
  color: #a8b8d8;
  border: 1px solid rgba(74, 140, 247, 0.15);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 4px;

  @media (max-width: 480px) {
    font-size: 0.6rem;
    padding: 2px 10px;
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

  &:hover {
    background: ${props => props.$favorited
      ? 'rgba(239, 68, 68, 0.25)'
      : 'rgba(239, 68, 68, 0.1)'};
    border-color: rgba(239, 68, 68, 0.5);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

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
  margin: 6px 0 10px;
`;

const Badge = styled.span`
  background: ${props => props.$color || 'rgba(74, 140, 247, 0.12)'};
  color: ${props => props.$textColor || '#a8b8d8'};
  padding: 2px 12px;
  border-radius: 12px;
  font-size: 0.6rem;
  font-weight: 600;
  border: 1px solid ${props => props.$color || 'rgba(74, 140, 247, 0.1)'};
  text-transform: uppercase;
  letter-spacing: 0.3px;

  @media (max-width: 480px) {
    font-size: 0.55rem;
    padding: 2px 10px;
  }
`;

const Description = styled.p`
  color: #a8b8d8;
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 8px 0 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

const Investment = styled.p`
  font-weight: 600;
  color: #7eb8ff;
  margin: 10px 0 14px;
  font-size: 1rem;
  padding: 8px 16px;
  background: rgba(74, 140, 247, 0.08);
  border-radius: 8px;
  display: inline-block;
  border: 1px solid rgba(74, 140, 247, 0.1);

  @media (max-width: 480px) {
    font-size: 0.9rem;
    padding: 6px 12px;
  }
`;

const DetailButton = styled.button`
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #0a1530 0%, #0d1b3e 50%, #142952 100%);
  border: 1px solid rgba(74, 140, 247, 0.25);
  border-radius: 12px;
  color: #e8eef7;
  font-family: 'Poppins', 'Inter', sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 0.5px;
  text-transform: uppercase;

  &:hover {
    background: linear-gradient(135deg, #0d1b3e 0%, #142952 50%, #1e3a8a 100%);
    transform: translateY(-2px);
    border-color: rgba(74, 140, 247, 0.4);
    color: #fff;
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: 10px;
  }
`;

const BusinessCard = ({ business, style }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
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

      authService.addFavorite(currentUser.uid, business.id)
        .catch(err => console.warn('⚠️ Firestore erro:', err));

      setTimeout(() => {
        navigate('/favoritos');
      }, 400);
    }

    setLoading(false);
  };

  const formatInvestment = (min, max) => {
    if (min === max) return `R$ ${min.toLocaleString('pt-BR')}`;
    return `R$ ${min.toLocaleString('pt-BR')} - R$ ${max.toLocaleString('pt-BR')}`;
  };

  const handleDetailClick = () => {
    navigate(`/business/${business.id}`);
  };

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
        <Emoji>{business.image}</Emoji>
        <HeaderContent>
          <Name>{business.name}</Name>
          <Category>{business.category}</Category>
        </HeaderContent>
      </CardHeader>

      <BadgeContainer>
        {business.minInvestment <= 500 && (
          <Badge $color="rgba(74, 222, 128, 0.12)" $textColor="#4ade80">
            💰 Baixo Investimento
          </Badge>
        )}
        {business.profitMargin && parseInt(business.profitMargin) > 70 && (
          <Badge $color="rgba(251, 191, 36, 0.12)" $textColor="#fbbf24">
            ⭐ Alta Margem
          </Badge>
        )}
        {business.payback && parseInt(business.payback) <= 3 && (
          <Badge $color="rgba(96, 165, 250, 0.12)" $textColor="#60a5fa">
            ⚡ Rápido Retorno
          </Badge>
        )}
      </BadgeContainer>

      <Description>{business.description}</Description>

      <Investment>
        💰 Investimento: {formatInvestment(business.minInvestment, business.maxInvestment)}
      </Investment>

      <DetailButton onClick={handleDetailClick}>
        📋 Ver Detalhes
      </DetailButton>
    </Card>
  );
};

export default BusinessCard;