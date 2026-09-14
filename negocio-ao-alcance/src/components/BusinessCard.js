import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-left: 4px solid #667eea;
  color: #e0e0e0;
  animation: ${fadeIn} 0.5s ease-out;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
    border-color: rgba(102, 126, 234, 0.3);
    background: rgba(255, 255, 255, 0.06);
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
  filter: drop-shadow(0 2px 8px rgba(102, 126, 234, 0.2));
  flex-shrink: 0;
  margin-top: 4px;
`;

const HeaderContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const Name = styled.h3`
  font-size: 1.2rem;
  color: #fff;
  margin: 0;
  font-weight: 600;
  letter-spacing: -0.3px;
  line-height: 1.3;
`;

const Category = styled.span`
  display: inline-block;
  padding: 3px 12px;
  background: rgba(102, 126, 234, 0.15);
  border-radius: 20px;
  font-size: 0.65rem;
  color: #b8c6db;
  border: 1px solid rgba(102, 126, 234, 0.15);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 4px;
`;

const BadgeContainer = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin: 6px 0 10px;
`;

const Badge = styled.span`
  background: ${props => props.$color || 'rgba(102, 126, 234, 0.12)'};
  color: ${props => props.$textColor || '#b8c6db'};
  padding: 2px 12px;
  border-radius: 12px;
  font-size: 0.6rem;
  font-weight: 600;
  border: 1px solid ${props => props.$color || 'rgba(102, 126, 234, 0.1)'};
  text-transform: uppercase;
  letter-spacing: 0.3px;
`;

const Description = styled.p`
  color: #b8c6db;
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 8px 0 12px;
  opacity: 0.85;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Investment = styled.p`
  font-weight: 600;
  color: #667eea;
  margin: 10px 0 14px;
  font-size: 1rem;
  padding: 8px 16px;
  background: rgba(102, 126, 234, 0.08);
  border-radius: 8px;
  display: inline-block;
  border: 1px solid rgba(102, 126, 234, 0.1);
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: rgba(102, 126, 234, 0.15);
  }
`;

const DetailButton = styled.button`
  width: 100%;
  padding: 10px;
  margin-top: 8px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  border-radius: 10px;
  color: #fff;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const BusinessCard = ({ business, style }) => {
  const navigate = useNavigate();

  const formatInvestment = (min, max) => {
    if (min === max) return `R$ ${min.toLocaleString('pt-BR')}`;
    return `R$ ${min.toLocaleString('pt-BR')} - R$ ${max.toLocaleString('pt-BR')}`;
  };

  const handleDetailClick = () => {
    navigate(`/business/${business.id}`);
  };

  return (
    <Card style={style}>
      <CardHeader>
        <Emoji>{business.image}</Emoji>
        <HeaderContent>
          <Name>{business.name}</Name>
          <Category>{business.category}</Category>
        </HeaderContent>
      </CardHeader>

      <BadgeContainer>
        {business.minInvestment <= 500 && (
          <Badge $color="rgba(74, 222, 128, 0.15)" $textColor="#4ade80">💰 Baixo Investimento</Badge>
        )}
        {business.profitMargin && parseInt(business.profitMargin) > 70 && (
          <Badge $color="rgba(251, 191, 36, 0.15)" $textColor="#fbbf24">⭐ Alta Margem</Badge>
        )}
        {business.payback && parseInt(business.payback) <= 3 && (
          <Badge $color="rgba(96, 165, 250, 0.15)" $textColor="#60a5fa">⚡ Rápido Retorno</Badge>
        )}
      </BadgeContainer>

      <Description>{business.description}</Description>

      <Investment>
        💰 Investimento: {formatInvestment(business.minInvestment, business.maxInvestment)}
      </Investment>

      <DetailButton onClick={handleDetailClick}>
        📋 Ver detalhes completos
      </DetailButton>
    </Card>
  );
};

export default BusinessCard;