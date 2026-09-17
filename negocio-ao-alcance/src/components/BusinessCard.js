import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const pulse = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.7; }
  100% { opacity: 1; }
`;

const Card = styled.div`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%);
  backdrop-filter: blur(24px);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.05);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 1px solid rgba(255, 255, 255, 0.08);
  position: relative;
  overflow: hidden;
  animation: ${fadeIn} 0.6s ease-out;
  cursor: pointer;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #667eea, #a855f7, #667eea);
    background-size: 200% auto;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent);
    transition: left 0.6s;
  }
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.4), 0 0 40px rgba(102, 126, 234, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1);
    border-color: rgba(102, 126, 234, 0.3);
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%);

    &::before {
      opacity: 1;
      animation: ${shimmer} 2s linear infinite;
    }

    &::after {
      left: 100%;
    }
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 12px;
`;

const Emoji = styled.div`
  font-size: 2.5rem;
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(168, 85, 247, 0.1));
  border-radius: 16px;
  border: 1px solid rgba(102, 126, 234, 0.15);
  transition: all 0.4s ease;

  ${Card}:hover & {
    transform: scale(1.1) rotate(-5deg);
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
  }
`;

const HeaderContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const Name = styled.h3`
  font-size: 1.15rem;
  color: #fff;
  margin: 0 0 6px 0;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.3px;
  transition: color 0.3s ease;

  ${Card}:hover & {
    background: linear-gradient(135deg, #ffffff, #a8c8ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const Category = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.18), rgba(168, 85, 247, 0.12));
  border-radius: 20px;
  font-size: 0.65rem;
  color: #b8c6db;
  border: 1px solid rgba(102, 126, 234, 0.2);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.8px;
`;

const BadgeContainer = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin: 12px 0;
`;

const Badge = styled.span`
  background: ${props => props.$color || 'rgba(102, 126, 234, 0.12)'};
  color: ${props => props.$textColor || '#b8c6db'};
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.65rem;
  font-weight: 700;
  border: 1px solid ${props => props.$borderColor || 'rgba(102, 126, 234, 0.15)'};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;

  ${Card}:hover & {
    transform: translateY(-2px);
  }
`;

const Description = styled.p`
  color: #b8c6db;
  font-size: 0.9rem;
  line-height: 1.6;
  margin: 12px 0 16px;
  opacity: 0.9;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Investment = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.12), rgba(168, 85, 247, 0.08));
  border-radius: 12px;
  border: 1px solid rgba(102, 126, 234, 0.15);
  margin-bottom: 16px;
  transition: all 0.3s ease;

  ${Card}:hover & {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.18), rgba(168, 85, 247, 0.12));
    border-color: rgba(102, 126, 234, 0.3);
  }
`;

const InvestmentLabel = styled.span`
  font-size: 0.7rem;
  color: #8899aa;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  font-weight: 600;
`;

const InvestmentValue = styled.span`
  font-weight: 700;
  color: #fff;
  font-size: 0.95rem;
  background: linear-gradient(135deg, #a8c8ff, #667eea);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const DetailButton = styled.button`
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #0d1b3e 0%, #142952 50%, #1e3a8a 100%);
  border: 1px solid rgba(74, 140, 247, 0.3);
  border-radius: 12px;
  color: #ffffff;
  font-family: 'Poppins', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
  overflow: hidden;
  letter-spacing: 1px;
  text-transform: uppercase;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(74, 140, 247, 0.15);

  &:hover {
    background: linear-gradient(135deg, #142952 0%, #1e3a8a 50%, #2563eb 100%);
    transform: translateY(-2px);
    border-color: rgba(74, 140, 247, 0.5);
    text-shadow: 0 1px 8px rgba(255, 255, 255, 0.2);
    box-shadow: 
      0 8px 24px rgba(30, 58, 138, 0.5),
      0 0 20px rgba(74, 140, 247, 0.2),
      inset 0 1px 0 rgba(74, 140, 247, 0.25);
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }
`;

const BusinessCard = ({ business, style }) => {
  const navigate = useNavigate();

  const formatInvestment = (min, max) => {
    if (min === max) return `R$ ${min.toLocaleString('pt-BR')}`;
    return `R$ ${min.toLocaleString('pt-BR')} - R$ ${max.toLocaleString('pt-BR')}`;
  };

  const handleDetailClick = (e) => {
    e.stopPropagation();
    navigate(`/business/${business.id}`);
  };

  return (
    <Card style={style} onClick={handleDetailClick}>
      <CardHeader>
        <Emoji>{business.image}</Emoji>
        <HeaderContent>
          <Name>{business.name}</Name>
          <Category>{business.category}</Category>
        </HeaderContent>
      </CardHeader>

      <BadgeContainer>
        {business.minInvestment <= 500 && (
          <Badge 
            $color="rgba(74, 222, 128, 0.12)" 
            $textColor="#4ade80"
            $borderColor="rgba(74, 222, 128, 0.2)"
          >
            💰 Baixo Investimento
          </Badge>
        )}
        {business.profitMargin && parseInt(business.profitMargin) > 70 && (
          <Badge 
            $color="rgba(251, 191, 36, 0.12)" 
            $textColor="#fbbf24"
            $borderColor="rgba(251, 191, 36, 0.2)"
          >
            ⭐ Alta Margem
          </Badge>
        )}
        {business.payback && parseInt(business.payback) <= 3 && (
          <Badge 
            $color="rgba(96, 165, 250, 0.12)" 
            $textColor="#60a5fa"
            $borderColor="rgba(96, 165, 250, 0.2)"
          >
            ⚡ Rápido Retorno
          </Badge>
        )}
      </BadgeContainer>

      <Description>{business.description}</Description>

      <Investment>
        <InvestmentLabel>💰 Investimento</InvestmentLabel>
        <InvestmentValue>
          {formatInvestment(business.minInvestment, business.maxInvestment)}
        </InvestmentValue>
      </Investment>

      <DetailButton onClick={handleDetailClick}>
        📋 Ver Detalhes Completos
      </DetailButton>
    </Card>
  );
};

export default BusinessCard;