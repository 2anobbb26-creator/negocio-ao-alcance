import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { businessData } from '../data/businessData';

// 🎨 ANIMAÇÕES
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0px); }
`;

const shimmer = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 300% 50%; }
`;

const pulse = keyframes`
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
`;

// 🎨 CONTAINER PRINCIPAL
const Container = styled.div`
  max-width: 1000px;
  margin: 30px auto;
  padding: 20px;
  animation: ${fadeInUp} 0.6s ease-out;
`;

// 🔙 BOTÃO VOLTAR
const BackButton = styled.button`
  background: linear-gradient(135deg, #0d1b3e 0%, #142952 50%, #1e3a8a 100%);
  border: 1px solid rgba(74, 140, 247, 0.3);
  color: #ffffff;
  padding: 12px 28px;
  border-radius: 12px;
  cursor: pointer;
  font-family: 'Poppins', 'Inter', sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  letter-spacing: 0.8px;
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(74, 140, 247, 0.15);

  &:hover {
    background: linear-gradient(135deg, #142952 0%, #1e3a8a 50%, #2563eb 100%);
    transform: translateX(-4px);
    border-color: rgba(74, 140, 247, 0.5);
    box-shadow: 
      0 8px 24px rgba(30, 58, 138, 0.4),
      inset 0 1px 0 rgba(74, 140, 247, 0.25);
  }

  &:active {
    transform: translateX(-2px) scale(0.98);
  }
`;

// 🔵 CARD PRINCIPAL
const Card = styled.div`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(24px);
  border-radius: 28px;
  padding: 48px;
  position: relative;
  overflow: hidden;

  @media (max-width: 480px) {
    padding: 28px;
    border-radius: 22px;
  }
`;

// 🎯 HEADER DO CARD
const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 28px;
  padding-bottom: 28px;
  border-bottom: 1px solid rgba(74, 140, 247, 0.15);

  @media (max-width: 480px) {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }
`;

const EmojiWrapper = styled.div`
  font-size: 4rem;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(74, 140, 247, 0.12), rgba(168, 85, 247, 0.08));
  border-radius: 24px;
  border: 1px solid rgba(74, 140, 247, 0.2);
  animation: ${float} 6s ease-in-out infinite;
  flex-shrink: 0;

  @media (max-width: 480px) {
    width: 80px;
    height: 80px;
    font-size: 3rem;
  }
`;

const HeaderContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const Name = styled.h1`
  font-size: 2.4rem;
  margin: 0 0 12px 0;
  font-weight: 900;
  letter-spacing: -0.5px;
  line-height: 1.2;
  color: #000000;

  @media (max-width: 768px) {
    font-size: 1.9rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const Category = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 18px;
  background: rgba(74, 140, 247, 0.12);
  border-radius: 24px;
  font-size: 0.75rem;
  color: #000000;
  font-weight: 800;
  border: 1px solid rgba(74, 140, 247, 0.2);
  text-transform: uppercase;
  letter-spacing: 1px;
`;

// 📄 DESCRIÇÃO
const Description = styled.p`
  color: #000000;
  font-size: 1.05rem;
  line-height: 1.8;
  margin: 0 0 32px 0;
  padding: 24px;
  background: rgba(74, 140, 247, 0.06);
  border-radius: 16px;
  border-left: 4px solid #4a8cf7;
  font-weight: 600;

  @media (max-width: 480px) {
    font-size: 0.95rem;
    padding: 18px;
  }
`;

// 📊 GRID DE INFORMAÇÕES
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin: 0 0 32px 0;
`;

const InfoCard = styled.div`
  background: rgba(74, 140, 247, 0.08);
  border-radius: 16px;
  padding: 24px 20px;
  border: 1px solid rgba(74, 140, 247, 0.15);
  text-align: center;
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
    opacity: 0.6;
  }

  &:hover {
    background: rgba(74, 140, 247, 0.12);
    border-color: rgba(74, 140, 247, 0.3);
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(74, 140, 247, 0.15);
  }

  @media (max-width: 480px) {
    padding: 18px 16px;
  }
`;

const InfoLabel = styled.div`
  color: #000000;
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  font-weight: 800;
  margin-bottom: 8px;
`;

const InfoValue = styled.div`
  color: #000000;
  font-size: 1.15rem;
  font-weight: 900;
  letter-spacing: -0.3px;

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

// 📋 SEÇÕES
const Section = styled.div`
  margin: 32px 0;
`;

const SectionTitle = styled.h3`
  color: #000000;
  font-size: 1.15rem;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 900;
  letter-spacing: 0.3px;

  span {
    font-size: 1.4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, rgba(74, 140, 247, 0.15), rgba(168, 85, 247, 0.1));
    border-radius: 12px;
    border: 1px solid rgba(74, 140, 247, 0.15);
  }

  @media (max-width: 480px) {
    font-size: 1rem;

    span {
      width: 36px;
      height: 36px;
      font-size: 1.2rem;
    }
  }
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 10px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const ListItem = styled.li`
  padding: 14px 18px 14px 42px;
  position: relative;
  color: #000000;
  font-weight: 700;
  background: rgba(74, 140, 247, 0.06);
  border-radius: 12px;
  border: 1px solid rgba(74, 140, 247, 0.12);
  transition: all 0.3s ease;
  font-size: 0.95rem;

  &:before {
    content: "▸";
    color: #000000;
    font-weight: 900;
    position: absolute;
    left: 18px;
    font-size: 1rem;
  }

  &:hover {
    background: rgba(74, 140, 247, 0.12);
    border-color: rgba(74, 140, 247, 0.25);
    transform: translateX(4px);
  }

  @media (max-width: 480px) {
    padding: 12px 16px 12px 38px;
    font-size: 0.9rem;
  }
`;

// 💰 PREÇO
const PriceTag = styled.div`
  background: linear-gradient(135deg, rgba(74, 222, 128, 0.15), rgba(34, 197, 94, 0.08));
  padding: 16px 28px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-weight: 900;
  color: #000000;
  border: 1px solid rgba(74, 222, 128, 0.3);
  font-size: 1.1rem;
  margin: 4px 0;

  &::before {
    content: '💰';
    font-size: 1.4rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    padding: 14px 22px;
  }
`;

// 🚫 NÃO ENCONTRADO
const NotFound = styled.div`
  text-align: center;
  padding: 80px 40px;
  color: #000000;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 24px;

  h2 {
    color: #000000;
    font-size: 2rem;
    margin-bottom: 12px;
    font-weight: 900;
  }

  p {
    color: #000000;
    font-weight: 600;
    margin-bottom: 24px;
  }
`;

const BusinessDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const business = businessData.find(b => b.id === parseInt(id));

  if (!business) {
    return (
      <Container>
        <NotFound>
          <h2>😕 Serviço não encontrado</h2>
          <p>O serviço que você procura não existe ou foi removido.</p>
          <BackButton onClick={() => navigate('/')}>
            ← Voltar para a página inicial
          </BackButton>
        </NotFound>
      </Container>
    );
  }

  const formatInvestment = (min, max) => {
    if (min === max) return `R$ ${min.toLocaleString('pt-BR')}`;
    return `R$ ${min.toLocaleString('pt-BR')} - R$ ${max.toLocaleString('pt-BR')}`;
  };

  return (
    <Container>
      <BackButton onClick={() => navigate('/')}>
        ← Voltar para os serviços
      </BackButton>

      <Card>
        <Header>
          <EmojiWrapper>{business.image}</EmojiWrapper>
          <HeaderContent>
            <Name>{business.name}</Name>
            <Category>📂 {business.category}</Category>
          </HeaderContent>
        </Header>

        <Description>{business.description}</Description>

        <Grid>
          <InfoCard>
            <InfoLabel>💰 Investimento</InfoLabel>
            <InfoValue>{formatInvestment(business.minInvestment, business.maxInvestment)}</InfoValue>
          </InfoCard>
          <InfoCard>
            <InfoLabel>📈 Faturamento</InfoLabel>
            <InfoValue>{business.monthlyRevenue}</InfoValue>
          </InfoCard>
          <InfoCard>
            <InfoLabel>💲 Margem</InfoLabel>
            <InfoValue>{business.profitMargin}</InfoValue>
          </InfoCard>
          <InfoCard>
            <InfoLabel>⏱️ Retorno</InfoLabel>
            <InfoValue>{business.payback}</InfoValue>
          </InfoCard>
        </Grid>

        <Section>
          <SectionTitle>
            <span>📦</span>
            Materiais Necessários
          </SectionTitle>
          <List>
            {business.materials.map((material, index) => (
              <ListItem key={index}>{material}</ListItem>
            ))}
          </List>
        </Section>

        <Section>
          <SectionTitle>
            <span>💲</span>
            Preço Sugerido
          </SectionTitle>
          <PriceTag>{business.suggestedPrice}</PriceTag>
        </Section>

        <Section>
          <SectionTitle>
            <span>👥</span>
            Potenciais Clientes
          </SectionTitle>
          <List>
            {business.potentialClients.map((client, index) => (
              <ListItem key={index}>{client}</ListItem>
            ))}
          </List>
        </Section>
      </Card>
    </Container>
  );
};

export default BusinessDetail;