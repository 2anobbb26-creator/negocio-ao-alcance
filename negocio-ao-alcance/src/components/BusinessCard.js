import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { auth, authService } from '../services/firebase';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const borderFlow = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 300% 50%; }
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: #e0e0e0;
  animation: ${fadeIn} 0.5s ease-out;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, 
      #4a8cf7 0%, 
      #7eb8ff 20%, 
      #a855f7 45%, 
      #ffffff 60%, 
      #a855f7 75%, 
      #7eb8ff 90%, 
      #4a8cf7 100%
    );
    background-size: 300% auto;
    opacity: 0.7;
    transition: opacity 0.4s ease;
    animation: ${borderFlow} 4s linear infinite;
  }
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
    border-color: rgba(74, 140, 247, 0.3);
    background: rgba(255, 255, 255, 0.05);

    &::before {
      opacity: 1;
      height: 4px;
    }
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 10px;
`;

const Emoji = styled.span`
  font-size: 2.2rem;
  flex-shrink: 0;
  margin-top: 4px;
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
  padding-right: 45px;
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
`;

const FavoriteButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: ${props => props.$favorited 
    ? 'rgba(239, 68, 68, 0.15)' 
    : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${props => props.$favorited 
    ? 'rgba(239, 68, 68, 0.4)' 
    : 'rgba(255, 255, 255, 0.1)'};
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  z-index: 10;
  padding: 0;

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
`;

const BusinessCard = ({ business, style }) => {
  const navigate = useNavigate();
  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔍 VERIFICAR SE JÁ É FAVORITO
  useEffect(() => {
    const checkFavorite = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const result = await authService.getFavorites(currentUser.uid);
      if (result.success) {
        setFavorited(result.data.includes(business.id));
      }
    };

    checkFavorite();
  }, [business.id]);

  // ❤️ CLICAR NO CORAÇÃO
  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    
    const currentUser = auth.currentUser;
    if (!currentUser) {
      alert('Faça login para favoritar!');
      return;
    }

    setLoading(true);

    if (favorited) {
      // Remove dos favoritos
      const result = await authService.removeFavorite(currentUser.uid, business.id);
      if (result.success) {
        setFavorited(false);
        console.log('💔 Removido dos favoritos');
      }
    } else {
      // Adiciona aos favoritos
      const result = await authService.addFavorite(currentUser.uid, business.id);
      if (result.success) {
        setFavorited(true);
        console.log('❤️ Adicionado aos favoritos');
      }
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
      {/* ❤️ BOTÃO DE FAVORITO */}
      <FavoriteButton
        $favorited={favorited}
        onClick={handleFavoriteClick}
        disabled={loading}
        title={favorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      >
        {loading ? '⏳' : favorited ? '❤️' : '🤍'}
      </FavoriteButton>

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