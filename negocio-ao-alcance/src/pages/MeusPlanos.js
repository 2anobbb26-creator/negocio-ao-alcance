import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import styled, { keyframes } from 'styled-components';
import { businessData } from '../data/businessData';
import { businessSteps } from '../data/businessSteps';
import { auth } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

// ─── ANIMAÇÕES ─────────────────────────────────────────────
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50%      { transform: scale(1.05); opacity: 0.85; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-12px); }
`;

// ─── LAYOUT ────────────────────────────────────────────────
const Page = styled.div`
  max-width: 1100px;
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
    background: radial-gradient(circle, rgba(34, 197, 94, 0.08), transparent 70%);
    border-radius: 50%;
    animation: ${float} 14s ease-in-out infinite;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -15%; left: -10%;
    width: 460px; height: 460px;
    background: radial-gradient(circle, rgba(74, 140, 247, 0.08), transparent 70%);
    border-radius: 50%;
    animation: ${float} 18s ease-in-out infinite reverse;
  }
`;

// ─── HERO ──────────────────────────────────────────────────
const Hero = styled.header`
  position: relative;
  padding: 44px 36px 36px;
  margin-bottom: 24px;
  border-radius: 26px;
  overflow: hidden;
  text-align: center;
  animation: ${fadeInUp} 0.6s ease-out;

  background:
    radial-gradient(ellipse at 0% 0%, rgba(74, 222, 128, 0.12), transparent 55%),
    radial-gradient(ellipse at 100% 100%, rgba(74, 140, 247, 0.1), transparent 55%),
    linear-gradient(160deg, rgba(255, 255, 255, 0.045) 0%, rgba(255, 255, 255, 0.015) 100%);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, #22c55e, #4f7cff, #a855f7);
  }

  @media (max-width: 480px) { padding: 30px 20px 24px; border-radius: 20px; }
`;

const HeroIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 12px;
  animation: ${pulse} 3s ease-in-out infinite;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.6px;
  margin: 0 0 10px;
  background: linear-gradient(135deg, #ffffff 0%, #b8f0c9 40%, #86efac 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 480px) { font-size: 1.5rem; }
`;

const Subtitle = styled.p`
  color: #a8b8d8;
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0 auto;
  max-width: 560px;

  @media (max-width: 480px) { font-size: 0.85rem; }
`;

// ─── ESTATÍSTICAS (Novo) ───────────────────────────────────
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 32px;
  animation: ${fadeInUp} 0.6s ease-out 0.1s both;

  @media (max-width: 600px) { gap: 10px; }
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    transform: translateY(-2px);
  }

  @media (max-width: 480px) { padding: 16px 10px; border-radius: 14px; }
`;

const StatValue = styled.div`
  font-size: 1.8rem;
  font-weight: 800;
  color: #fff;
  line-height: 1;
  margin-bottom: 8px;

  @media (max-width: 480px) { font-size: 1.4rem; }
`;

const StatLabel = styled.div`
  font-size: 0.7rem;
  color: #8899aa;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  @media (max-width: 480px) { font-size: 0.6rem; }
`;

// ─── GRID DE PLANOS ────────────────────────────────────────
const GridWrapper = styled.div`
  display: flex;
  justify-content: center; /* Centraliza se tiver só 1 card */
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 20px;
  width: 100%;
  animation: ${fadeInUp} 0.6s ease-out 0.2s both;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 14px;
  }
`;

const PlanCard = styled.div`
  padding: 22px 20px;
  border-radius: 18px;
  background: linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%);
  border: 1px solid rgba(255, 255, 255, 0.07);
  display: flex;
  flex-direction: column;
  gap: 14px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, #4f7cff, #22c55e);
    opacity: 0.7;
  }

  &:hover {
    border-color: rgba(74, 222, 128, 0.35);
    transform: translateY(-4px);
    box-shadow: 0 20px 40px -16px rgba(34, 197, 94, 0.25);
  }

  @media (max-width: 480px) { padding: 18px 16px; }
`;

const PlanHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

const PlanEmoji = styled.div`
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  border-radius: 12px;
  display: grid;
  place-items: center;
  font-size: 1.7rem;
  background: rgba(74, 140, 247, 0.08);
  border: 1px solid rgba(74, 140, 247, 0.15);
`;

const PlanInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const PlanName = styled.h3`
  font-size: 1rem;
  color: #eef4ff;
  font-weight: 700;
  margin: 0 0 4px;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PlanCategory = styled.span`
  display: inline-block;
  font-size: 0.6rem;
  color: #9db8ff;
  background: rgba(74, 140, 247, 0.1);
  border: 1px solid rgba(74, 140, 247, 0.25);
  border-radius: 999px;
  padding: 2px 9px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.07em;
`;

const ProgressWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ProgressBar = styled.div`
  height: 8px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 999px;
  overflow: hidden;
  position: relative;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${p => p.$percent}%;
  background: linear-gradient(90deg, #4f7cff 0%, #22c55e 100%);
  border-radius: 999px;
  transition: width 0.4s ease;
  box-shadow: 0 0 12px rgba(34, 197, 94, 0.5);
`;

const ProgressMeta = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.72rem;
  font-weight: 700;

  .label { color: #a8b8d8; }
  .value { color: #86efac; }
`;

const ContinueBtn = styled.button`
  padding: 11px 16px;
  border-radius: 10px;
  border: 1px solid rgba(74, 222, 128, 0.4);
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.12), rgba(22, 163, 74, 0.08));
  color: #86efac;
  font-family: inherit;
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: 0.03em;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.25s ease;

  &:hover {
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.25), rgba(22, 163, 74, 0.18));
    border-color: rgba(74, 222, 128, 0.7);
    color: #fff;
    transform: translateY(-1px);
  }
`;

// ─── EXPLORAR BANNER (Novo) ────────────────────────────────
const ExploreBanner = styled.div`
  margin-top: 40px;
  padding: 30px;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(74, 140, 247, 0.08), rgba(168, 85, 247, 0.05));
  border: 1px solid rgba(74, 140, 247, 0.2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  animation: ${fadeInUp} 0.6s ease-out 0.3s both;

  @media (max-width: 640px) {
    flex-direction: column;
    text-align: center;
    padding: 24px 20px;
  }
`;

const BannerText = styled.div`
  h3 {
    color: #eef4ff;
    font-size: 1.15rem;
    font-weight: 800;
    margin: 0 0 6px;
  }
  p {
    color: #8899aa;
    font-size: 0.85rem;
    margin: 0;
    line-height: 1.5;
  }
`;

const ExploreBtn = styled.button`
  padding: 12px 24px;
  border-radius: 12px;
  border: 1px solid rgba(74, 140, 247, 0.4);
  background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
  color: #fff;
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(37, 99, 235, 0.4);
  }

  @media (max-width: 640px) { width: 100%; justify-content: center; }
`;

// ─── EMPTY STATE ───────────────────────────────────────────
const Empty = styled.div`
  text-align: center;
  padding: 60px 30px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  animation: ${fadeInUp} 0.6s ease-out;
`;

const EmptyIcon = styled.div`
  font-size: 3.5rem;
  margin-bottom: 16px;
  animation: ${pulse} 3s ease-in-out infinite;
`;

const EmptyTitle = styled.h3`
  font-size: 1.3rem;
  color: #e8eef7;
  font-weight: 800;
  margin: 0 0 10px;
`;

const EmptyText = styled.p`
  color: #a8b8d8;
  font-size: 0.9rem;
  line-height: 1.6;
  max-width: 440px;
  margin: 0 auto 22px;

  strong { color: #cbd9ee; }
`;

// ─── COMPONENTE ────────────────────────────────────────────
const MeusPlanos = () => {
  const navigate = useNavigate();
  const [planos, setPlanos] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user?.uid || null);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;

    const todosPlanos = [];

    businessData.forEach((business) => {
      const savedSteps = localStorage.getItem(`steps_${business.id}`);
      if (savedSteps) {
        try {
          const completedSteps = JSON.parse(savedSteps);
          const doneCount = Object.values(completedSteps).filter(Boolean).length;
          if (doneCount > 0) {
            const totalSteps = (businessSteps[business.name] || []).length;
            todosPlanos.push({
              business,
              doneCount,
              totalSteps,
              pct: totalSteps > 0 ? Math.round((doneCount / totalSteps) * 100) : 0,
            });
          }
        } catch {}
      }
    });

    todosPlanos.sort((a, b) => b.pct - a.pct);
    setPlanos(todosPlanos);
  }, [loading]);

  // ─── CÁLCULO DE ESTATÍSTICAS ─────────────────────────────
  const stats = useMemo(() => {
    if (planos.length === 0) return { total: 0, avgProgress: 0, totalTasks: 0 };
    
    const totalTasks = planos.reduce((acc, p) => acc + p.doneCount, 0);
    const totalPct = planos.reduce((acc, p) => acc + p.pct, 0);
    
    return {
      total: planos.length,
      avgProgress: Math.round(totalPct / planos.length),
      totalTasks,
    };
  }, [planos]);

  return (
    <>
      <Helmet>
        <title>Meus Planos | Negócio ao Alcance</title>
      </Helmet>

      <BackgroundDecor />

      <Page>
        <Hero>
          <HeroIcon>🎯</HeroIcon>
          <Title>Meus Planos</Title>
          <Subtitle>
            Acompanhe o progresso dos negócios que você já começou.
            Cada passo conta pra tirar o projeto do papel!
          </Subtitle>
        </Hero>

        {loading ? (
          <Empty>
            <EmptyIcon>⏳</EmptyIcon>
            <EmptyTitle>Carregando...</EmptyTitle>
          </Empty>
        ) : planos.length === 0 ? (
          <Empty>
            <EmptyIcon>🚀</EmptyIcon>
            <EmptyTitle>Nenhum plano iniciado ainda</EmptyTitle>
            <EmptyText>
              Escolha um negócio que combine com você e comece
              a <strong>marcar os passos</strong>. Seu progresso ficará salvo aqui!
            </EmptyText>
            <ExploreBtn onClick={() => navigate('/')}>
              🔍 Explorar Negócios
            </ExploreBtn>
          </Empty>
        ) : (
          <>
            {/* 📊 ESTATÍSTICAS */}
            <StatsGrid>
              <StatCard>
                <StatValue>{stats.total}</StatValue>
                <StatLabel>Planos Ativos</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{stats.avgProgress}%</StatValue>
                <StatLabel>Progresso Médio</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{stats.totalTasks}</StatValue>
                <StatLabel>Tarefas Feitas</StatLabel>
              </StatCard>
            </StatsGrid>

            {/* 📋 LISTA DE PLANOS */}
            <GridWrapper>
              <Grid>
                {planos.map(({ business, doneCount, totalSteps, pct }) => (
                  <PlanCard key={business.id}>
                    <PlanHeader>
                      <PlanEmoji>{business.image}</PlanEmoji>
                      <PlanInfo>
                        <PlanName>{business.name}</PlanName>
                        <PlanCategory>{business.category}</PlanCategory>
                      </PlanInfo>
                    </PlanHeader>

                    <ProgressWrapper>
                      <ProgressBar>
                        <ProgressFill $percent={pct} />
                      </ProgressBar>
                      <ProgressMeta>
                        <span className="label">
                          {doneCount} de {totalSteps} etapas
                        </span>
                        <span className="value">{pct}%</span>
                      </ProgressMeta>
                    </ProgressWrapper>

                    <ContinueBtn onClick={() => navigate(`/business/${business.id}/comecar`)}>
                      {pct === 100 ? '🏆 Ver plano concluído' : '▶ Continuar de onde parei'}
                    </ContinueBtn>
                  </PlanCard>
                ))}
              </Grid>
            </GridWrapper>

            {/* 🚀 BANNER EXPLORAR */}
            <ExploreBanner>
              <BannerText>
                <h3>Quer expandir seus horizontes?</h3>
                <p>Descubra outras oportunidades e comece um novo plano hoje mesmo.</p>
              </BannerText>
              <ExploreBtn onClick={() => navigate('/')}>
                ✨ Explorar Negócios
              </ExploreBtn>
            </ExploreBanner>
          </>
        )}
      </Page>
    </>
  );
};

export default MeusPlanos;