import React from 'react';
import { Helmet } from 'react-helmet-async';
import styled, { keyframes } from 'styled-components';

// ─── ANIMAÇÕES ─────────────────────────────────────────────
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.05); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-12px); }
`;

// ─── LAYOUT GERAL ──────────────────────────────────────────
const Page = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 32px 20px 80px;
  position: relative;

  @media (max-width: 480px) { padding: 20px 14px 60px; }
`;

const BackgroundDecor = styled.div`
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -15%; right: -10%;
    width: 520px; height: 520px;
    background: radial-gradient(circle, rgba(74, 140, 247, 0.08), transparent 70%);
    border-radius: 50%;
    animation: ${float} 14s ease-in-out infinite;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -15%; left: -10%;
    width: 460px; height: 460px;
    background: radial-gradient(circle, rgba(168, 85, 247, 0.06), transparent 70%);
    border-radius: 50%;
    animation: ${float} 18s ease-in-out infinite reverse;
  }
`;

// ─── HERO ──────────────────────────────────────────────────
const Hero = styled.header`
  position: relative;
  padding: 60px 36px 50px;
  margin-bottom: 32px;
  border-radius: 28px;
  overflow: hidden;
  text-align: center;
  animation: ${fadeInUp} 0.6s ease-out;

  background: linear-gradient(160deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 20px 40px -20px rgba(0, 0, 0, 0.5);

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 4px;
    background: linear-gradient(90deg, #4f7cff, #7eb8ff, #a855f7, #ec4899);
  }

  @media (max-width: 480px) { padding: 40px 20px 36px; border-radius: 22px; }
`;

const HeroIcon = styled.div`
  font-size: 3.5rem;
  margin-bottom: 16px;
  animation: ${pulse} 3s ease-in-out infinite;
`;

const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: 900;
  letter-spacing: -0.8px;
  margin: 0 0 12px;
  background: linear-gradient(135deg, #ffffff 0%, #d0e0ff 50%, #7eb8ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 480px) { font-size: 1.6rem; }
`;

const Subtitle = styled.p`
  color: #a8b8d8;
  font-size: 1.05rem;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;

  @media (max-width: 480px) { font-size: 0.9rem; }
`;

// ─── GRID DE CONTEÚDO ──────────────────────────────────────
const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
  animation: ${fadeInUp} 0.6s ease-out 0.1s both;

  @media (max-width: 768px) { grid-template-columns: 1fr; gap: 16px; }
`;

const Card = styled.section`
  padding: 32px 28px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  position: relative;
  overflow: hidden;

  @media (max-width: 480px) { padding: 24px 20px; }
`;

const CardTitle = styled.h2`
  font-size: 1.15rem;
  font-weight: 800;
  color: #eef4ff;
  margin: 0 0 16px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Paragraph = styled.p`
  color: #cbd9ee;
  font-size: 0.92rem;
  line-height: 1.7;
  margin: 0 0 12px;

  strong { color: #fff; font-weight: 700; }
  &:last-child { margin-bottom: 0; }
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ListItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  color: #a8b8d8;
  font-size: 0.88rem;
  line-height: 1.5;

  .icon { font-size: 1.1rem; flex-shrink: 0; }
  strong { color: #fff; font-weight: 600; }
`;

// ─── ÁREA DOS CRIADORES ────────────────────────────────────
const TeamSection = styled.section`
  padding: 36px 28px;
  border-radius: 22px;
  background: linear-gradient(135deg, rgba(74, 140, 247, 0.05), rgba(168, 85, 247, 0.02));
  border: 1px solid rgba(74, 140, 247, 0.15);
  animation: ${fadeInUp} 0.6s ease-out 0.2s both;
  text-align: center;

  @media (max-width: 480px) { padding: 28px 18px; }
`;

const TeamHeader = styled.div`
  margin-bottom: 28px;
`;

const TeamTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 800;
  color: #fff;
  margin: 0 0 8px;
`;

const TeamSubtitle = styled.p`
  color: #8899aa;
  font-size: 0.88rem;
  margin: 0;
`;

const CreatorsGrid = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
`;

const CreatorCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 24px 20px;
  background: rgba(10, 21, 48, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  min-width: 170px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(74, 140, 247, 0.1);
    border-color: rgba(74, 140, 247, 0.3);
    transform: translateY(-4px);
  }
`;

const Avatar = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  font-weight: 800;
  color: #e8eef7;
  background: linear-gradient(135deg, rgba(74, 140, 247, 0.2), rgba(168, 85, 247, 0.2));
  border: 1px solid rgba(126, 184, 255, 0.3);
  letter-spacing: -0.5px;
`;

const CreatorName = styled.h3`
  color: #fff;
  font-size: 0.98rem;
  font-weight: 700;
  margin: 0;
`;

const getInitials = (name) => name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

// ─── COMPONENTE ────────────────────────────────────────────
const Sobre = () => {
  return (
    <>
      <Helmet>
        <title>Sobre | Negócio ao Alcance</title>
        <meta name="description" content="Conheça o Negócio ao Alcance — a plataforma que ajuda você a tirar seu negócio do papel." />
      </Helmet>

      <BackgroundDecor />

      <Page>
        <Hero>
          <HeroIcon>💙</HeroIcon>
          <Title>Negócio ao Alcance</Title>
          <Subtitle>
            A plataforma que simplifica o caminho para quem quer empreender, 
            fornecendo as ferramentas e o direcionamento necessário para começar.
          </Subtitle>
        </Hero>

        <ContentGrid>
          {/* MISSÃO */}
          <Card>
            <CardTitle>🎯 Nossa Missão</CardTitle>
            <Paragraph>
              Acreditamos que o empreendedorismo é um dos maiores motores de transformação social. 
              No entanto, muitas pessoas desistem por falta de informação clara, não por falta de capacidade.
            </Paragraph>
            <Paragraph>
              O <strong>Negócio ao Alcance</strong> resolve isso centralizando oportunidades reais, 
              planos de ação estruturados e materiais de apoio, para que você pare de apenas planejar 
              e comece a executar.
            </Paragraph>
          </Card>

          {/* O QUE OFERECEMOS */}
          <Card>
            <CardTitle>🚀 O que você encontra aqui</CardTitle>
            <List>
              <ListItem>
                <span className="icon">💼</span>
                <span><strong>+90 ideias de negócio</strong> com investimento, margem e retorno.</span>
              </ListItem>
              <ListItem>
                <span className="icon">📋</span>
                <span><strong>Roteiros passo a passo</strong> para cada negócio.</span>
              </ListItem>
              <ListItem>
                <span className="icon">🧮</span>
                <span><strong>Ferramentas de gestão</strong> para precificar e organizar.</span>
              </ListItem>
              <ListItem>
                <span className="icon">📚</span>
                <span><strong>Guia do Empreendedor</strong> com conteúdo direto e prático.</span>
              </ListItem>
            </List>
          </Card>
        </ContentGrid>

        {/* CRIADORES */}
        <TeamSection>
          <TeamHeader>
            <TeamTitle>💻 Quem construiu</TeamTitle>
            <TeamSubtitle>Um projeto feito por pessoas apaixonadas por tecnologia e empreendedorismo.</TeamSubtitle>
          </TeamHeader>
          
          <CreatorsGrid>
            <CreatorCard>
              <Avatar>{getInitials('Lívia Johanne')}</Avatar>
              <CreatorName>Lívia Johanne</CreatorName>
            </CreatorCard>

            <CreatorCard>
              <Avatar>{getInitials('Núbia Pinheiro')}</Avatar>
              <CreatorName>Núbia Pinheiro</CreatorName>
            </CreatorCard>

            <CreatorCard>
              <Avatar>{getInitials('Jerry Filho')}</Avatar>
              <CreatorName>Jerry Filho</CreatorName>
            </CreatorCard>
          </CreatorsGrid>
        </TeamSection>
      </Page>
    </>
  );
};

export default Sobre;