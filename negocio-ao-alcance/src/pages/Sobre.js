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
  50%      { transform: scale(1.06); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-12px); }
`;

// ─── LAYOUT ────────────────────────────────────────────────
const Page = styled.div`
  max-width: 900px;
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
    background: radial-gradient(circle, rgba(74, 140, 247, 0.1), transparent 70%);
    border-radius: 50%;
    animation: ${float} 14s ease-in-out infinite;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -15%; left: -10%;
    width: 460px; height: 460px;
    background: radial-gradient(circle, rgba(168, 85, 247, 0.08), transparent 70%);
    border-radius: 50%;
    animation: ${float} 18s ease-in-out infinite reverse;
  }
`;

// ─── HERO ──────────────────────────────────────────────────
const Hero = styled.header`
  position: relative;
  padding: 50px 36px 40px;
  margin-bottom: 30px;
  border-radius: 26px;
  overflow: hidden;
  text-align: center;
  animation: ${fadeInUp} 0.6s ease-out;

  background:
    radial-gradient(ellipse at 0% 0%, rgba(74, 140, 247, 0.14), transparent 55%),
    radial-gradient(ellipse at 100% 100%, rgba(168, 85, 247, 0.1), transparent 55%),
    linear-gradient(160deg, rgba(255, 255, 255, 0.045) 0%, rgba(255, 255, 255, 0.015) 100%);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, #4f7cff, #7eb8ff, #a855f7, #ec4899);
  }

  @media (max-width: 480px) { padding: 34px 20px 26px; border-radius: 20px; }
`;

const HeroIcon = styled.div`
  font-size: 3.5rem;
  margin-bottom: 14px;
  animation: ${pulse} 3s ease-in-out infinite;
`;

const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: 800;
  letter-spacing: -0.6px;
  margin: 0 0 12px;
  background: linear-gradient(135deg, #ffffff 0%, #d0e0ff 40%, #7eb8ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 480px) { font-size: 1.6rem; }
`;

const Subtitle = styled.p`
  color: #a8b8d8;
  font-size: 1rem;
  line-height: 1.65;
  max-width: 580px;
  margin: 0 auto;

  @media (max-width: 480px) { font-size: 0.88rem; }
`;

// ─── CARDS ─────────────────────────────────────────────────
const Section = styled.section`
  padding: 30px 28px;
  margin-bottom: 20px;
  border-radius: 22px;
  background: linear-gradient(160deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.012) 100%);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.07);
  animation: ${fadeInUp} 0.6s ease-out both;

  @media (max-width: 480px) { padding: 22px 18px; border-radius: 18px; }
`;

const SectionTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 800;
  color: #eef4ff;
  margin: 0 0 14px;
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 480px) { font-size: 1.05rem; }
`;

const Paragraph = styled.p`
  color: #cbd9ee;
  font-size: 0.92rem;
  line-height: 1.75;
  margin: 0 0 14px;

  strong { color: #fff; font-weight: 700; }

  @media (max-width: 480px) { font-size: 0.86rem; }
`;

// ─── SEÇÃO DE CRIADORES ────────────────────────────────────
const CreatorsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 24px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const CreatorCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 30px 20px;
  border-radius: 16px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(74, 140, 247, 0.3);
    transform: translateY(-3px);
  }
`;

const Avatar = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 800;
  color: #e8eef7;
  background: rgba(74, 140, 247, 0.1);
  border: 1px solid rgba(74, 140, 247, 0.3);
  letter-spacing: -0.5px;
`;

const CreatorName = styled.h3`
  color: #fff;
  font-size: 1.05rem;
  font-weight: 700;
  margin: 0;
  text-align: center;
`;

// ─── HELPERS ───────────────────────────────────────────────
const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
};

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

        <Section>
          <SectionTitle>🎯 Nossa missão</SectionTitle>
          <Paragraph>
            Acreditamos que o empreendedorismo é um dos maiores motores de transformação social. 
            No entanto, muitas pessoas desistem por falta de informação clara, não por falta de capacidade.
          </Paragraph>
          <Paragraph>
            O <strong>Negócio ao Alcance</strong> resolve isso centralizando oportunidades reais, 
            planos de ação estruturados e materiais de apoio, para que você pare de apenas planejar 
            e comece a executar.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>💻 Quem construiu</SectionTitle>
          <Paragraph>
            O projeto foi idealizado, desenhado e desenvolvido por:
          </Paragraph>
          
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
        </Section>
      </Page>
    </>
  );
};

export default Sobre;