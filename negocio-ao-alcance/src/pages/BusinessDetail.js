import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { businessData } from '../data/businessData';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  max-width: 900px;
  margin: 30px auto;
  padding: 20px;
  animation: ${fadeIn} 0.5s ease-out;
`;

const BackButton = styled.button`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #b8c6db;
  padding: 10px 24px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
    transform: translateX(-4px);
  }
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 40px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.3);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;

  @media (max-width: 480px) {
    flex-direction: column;
    text-align: center;
  }
`;

const Emoji = styled.span`
  font-size: 4rem;
  filter: drop-shadow(0 4px 20px rgba(102, 126, 234, 0.3));
`;

const HeaderInfo = styled.div`
  flex: 1;
`;

const Name = styled.h1`
  font-size: 2.2rem;
  color: #fff;
  margin: 0;
  font-weight: 700;
  letter-spacing: -0.5px;

  @media (max-width: 480px) {
    font-size: 1.6rem;
  }
`;

const Category = styled.span`
  display: inline-block;
  padding: 4px 16px;
  background: rgba(102, 126, 234, 0.15);
  border-radius: 20px;
  font-size: 0.8rem;
  color: #b8c6db;
  border: 1px solid rgba(102, 126, 234, 0.15);
  margin-top: 8px;
`;

const BadgeContainer = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin: 16px 0 20px;
`;

const Badge = styled.span`
  background: ${props => props.$color || 'rgba(102, 126, 234, 0.12)'};
  color: ${props => props.$textColor || '#b8c6db'};
  padding: 4px 16px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid ${props => props.$color || 'rgba(102, 126, 234, 0.1)'};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Description = styled.p`
  color: #b8c6db;
  font-size: 1.05rem;
  line-height: 1.8;
  margin: 16px 0 24px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  border-left: 3px solid #667eea;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin: 24px 0;
`;

const InfoCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 16px 20px;
  border: 1px solid rgba(255, 255, 255, 0.04);
  text-align: center;
  transition: all 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    transform: translateY(-2px);
  }
`;

const InfoLabel = styled.div`
  color: #8899aa;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const InfoValue = styled.div`
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
  margin-top: 4px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Section = styled.div`
  margin: 24px 0;
`;

const SectionTitle = styled.h3`
  color: #fff;
  font-size: 1.1rem;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 10px;

  span {
    font-size: 1.3rem;
  }
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 8px;
`;

const ListItem = styled.li`
  padding: 10px 16px;
  padding-left: 20px;
  position: relative;
  color: #c8d0d8;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.03);
  transition: all 0.3s;

  &:before {
    content: "▸";
    color: #667eea;
    font-weight: bold;
    position: absolute;
    left: 4px;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(102, 126, 234, 0.1);
  }
`;

const PriceTag = styled.div`
  background: rgba(74, 222, 128, 0.08);
  padding: 8px 20px;
  border-radius: 8px;
  display: inline-block;
  font-weight: 600;
  color: #4ade80;
  border: 1px solid rgba(74, 222, 128, 0.1);
  font-size: 1rem;
  margin: 4px 0;
`;

const NotFound = styled.div`
  text-align: center;
  padding: 60px;
  color: #b8c6db;

  h2 {
    color: #fff;
    font-size: 2rem;
    margin-bottom: 12px;
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
          <Emoji>{business.image}</Emoji>
          <HeaderInfo>
            <Name>{business.name}</Name>
            <Category>{business.category}</Category>
          </HeaderInfo>
        </Header>

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

        <Description>
          {business.description}
        </Description>

        <Grid>
          <InfoCard>
            <InfoLabel>💰 Investimento</InfoLabel>
            <InfoValue>{formatInvestment(business.minInvestment, business.maxInvestment)}</InfoValue>
          </InfoCard>
          <InfoCard>
            <InfoLabel>📈 Faturamento Mensal</InfoLabel>
            <InfoValue>{business.monthlyRevenue}</InfoValue>
          </InfoCard>
          <InfoCard>
            <InfoLabel>💲 Margem de Lucro</InfoLabel>
            <InfoValue>{business.profitMargin}</InfoValue>
          </InfoCard>
          <InfoCard>
            <InfoLabel>⏱️ Tempo de Retorno</InfoLabel>
            <InfoValue>{business.payback}</InfoValue>
          </InfoCard>
        </Grid>

        <Section>
          <SectionTitle>
            <span>📦</span> Materiais Necessários
          </SectionTitle>
          <List>
            {business.materials.map((material, index) => (
              <ListItem key={index}>{material}</ListItem>
            ))}
          </List>
        </Section>

        <Section>
          <SectionTitle>
            <span>💲</span> Preço Sugerido
          </SectionTitle>
          <PriceTag>{business.suggestedPrice}</PriceTag>
        </Section>

        <Section>
          <SectionTitle>
            <span>👥</span> Potenciais Clientes
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