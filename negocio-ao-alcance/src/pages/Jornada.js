import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import styled, { keyframes } from 'styled-components';

// ─── ANIMAÇÕES ─────────────────────────────────────────────
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.05); }
`;

// ─── LAYOUT ────────────────────────────────────────────────
const Page = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 20px 80px;
`;

const Hero = styled.header`
  padding: 44px 36px 36px;
  margin-bottom: 32px;
  border-radius: 26px;
  text-align: center;
  animation: ${fadeInUp} 0.6s ease-out;
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, #22c55e, #4f7cff);
  }
`;

const HeroIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 10px;
  animation: ${pulse} 3s ease-in-out infinite;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 800;
  margin: 0 0 8px;
  color: #fff;
`;

const Subtitle = styled.p`
  color: #a8b8d8;
  font-size: 0.95rem;
  margin: 0 auto;
  max-width: 500px;
`;

// ─── ESTATÍSTICAS ──────────────────────────────────────────
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 32px;
  animation: ${fadeInUp} 0.6s ease-out 0.1s both;

  @media (max-width: 480px) { gap: 10px; }
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

  @media (max-width: 480px) { padding: 16px 10px; }
`;

const StatValue = styled.div`
  font-size: 1.8rem;
  font-weight: 800;
  color: ${p => p.$color || '#fff'};
  line-height: 1;
  margin-bottom: 8px;

  @media (max-width: 480px) { font-size: 1.4rem; }
`;

const StatLabel = styled.div`
  font-size: 0.7rem;
  color: #8899aa;
  font-weight: 700;
  text-transform: uppercase;

  @media (max-width: 480px) { font-size: 0.6rem; }
`;

// ─── MAPA DE CALOR ─────────────────────────────────────────
const HeatmapSection = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 24px;
  animation: ${fadeInUp} 0.6s ease-out 0.2s both;
  overflow-x: auto;

  &::-webkit-scrollbar { height: 6px; }
  &::-webkit-scrollbar-thumb { background: rgba(74, 140, 247, 0.3); border-radius: 6px; }
`;

const HeatmapTitle = styled.h3`
  color: #eef4ff;
  font-size: 1rem;
  margin: 0 0 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-rows: repeat(7, 1fr);
  grid-auto-flow: column;
  grid-auto-columns: 14px;
  gap: 4px;
  width: max-content;
  padding-bottom: 8px;
`;

const Day = styled.div`
  width: 14px;
  height: 14px;
  border-radius: 3px;
  background: ${p => {
    if (p.$level === 0) return 'rgba(255,255,255,0.05)';
    if (p.$level === 1) return 'rgba(34, 197, 94, 0.3)';
    if (p.$level === 2) return 'rgba(34, 197, 94, 0.6)';
    return '#22c55e';
  }};
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.3);
    box-shadow: 0 0 8px rgba(34, 197, 94, 0.5);
  }
`;

const Legend = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
  font-size: 0.7rem;
  color: #8899aa;
  margin-top: 12px;
`;

const LegendBox = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background: ${p => p.$bg};
`;

// ─── MENSAGEM MOTIVACIONAL ─────────────────────────────────
const MessageCard = styled.div`
  background: linear-gradient(135deg, rgba(74, 140, 247, 0.1), rgba(34, 197, 94, 0.05));
  border: 1px solid rgba(74, 140, 247, 0.2);
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  animation: ${fadeInUp} 0.6s ease-out 0.3s both;
`;

const MessageText = styled.p`
  color: #e8eef7;
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0;
  font-weight: 600;

  strong { color: #86efac; }
`;

// ─── COMPONENTE ────────────────────────────────────────────
const Jornada = () => {
  // Puxa as datas do localStorage
  const historico = useMemo(() => {
    return JSON.parse(localStorage.getItem('@app:jornada') || '[]');
  }, []);

  // Calcula os últimos 90 dias
  const mapaDias = useMemo(() => {
    const dias = [];
    const hoje = new Date();
    
    // Volta 90 dias atrás
    for (let i = 89; i >= 0; i--) {
      const data = new Date(hoje);
      data.setDate(hoje.getDate() - i);
      const iso = data.toISOString().split('T')[0];
      
      const ativo = historico.includes(iso);
      dias.push({ data, iso, ativo });
    }
    return dias;
  }, [historico]);

  // Calcula Streak (dias consecutivos)
  const streakAtual = useMemo(() => {
    if (historico.length === 0) return 0;
    
    let streak = 0;
    const hoje = new Date();
    
    // Verifica de hoje para trás
    for (let i = 0; i < 365; i++) {
      const data = new Date(hoje);
      data.setDate(hoje.getDate() - i);
      const iso = data.toISOString().split('T')[0];
      
      if (historico.includes(iso)) {
        streak++;
      } else if (i > 0) {
        // Se não tem hoje, ainda pode ter ontem. Se não tem ontem, quebra.
        break;
      }
    }
    return streak;
  }, [historico]);

  const maiorStreak = useMemo(() => {
    if (historico.length === 0) return 0;
    const sorted = [...historico].sort();
    let max = 1, current = 1;
    
    for (let i = 1; i < sorted.length; i++) {
      const prev = new Date(sorted[i - 1]);
      const curr = new Date(sorted[i]);
      const diff = (curr - prev) / (1000 * 60 * 60 * 24);
      
      if (diff === 1) {
        current++;
        if (current > max) max = current;
      } else {
        current = 1;
      }
    }
    return max;
  }, [historico]);

  return (
    <>
      <Helmet>
        <title>Minha Jornada | Negócio ao Alcance</title>
      </Helmet>

      <Page>
        <Hero>
          <HeroIcon>🔥</HeroIcon>
          <Title>Minha Jornada</Title>
          <Subtitle>
            Aqui está o seu histórico de consistência. Cada dia em que você marcou um passo no seu plano, o quadradinho ficou verde!
          </Subtitle>
        </Hero>

        <StatsGrid>
          <StatCard>
            <StatValue $color="#fbbf24">{streakAtual}</StatValue>
            <StatLabel>Dias Seguidos</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue $color="#86efac">{historico.length}</StatValue>
            <StatLabel>Dias Ativos Totais</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue $color="#7eb8ff">{maiorStreak}</StatValue>
            <StatLabel>Seu Recorde</StatLabel>
          </StatCard>
        </StatsGrid>

        <HeatmapSection>
          <HeatmapTitle>
            <span>📅</span> Atividade nos últimos 90 dias
          </HeatmapTitle>
          
          <Grid>
            {mapaDias.map((dia, i) => (
              <Day 
                key={i} 
                $level={dia.ativo ? 3 : 0} 
                title={dia.ativo ? `Você foi ativo em ${dia.iso}` : `Sem atividade em ${dia.iso}`}
              />
            ))}
          </Grid>

          <Legend>
            <span>Menos</span>
            <LegendBox $bg="rgba(255,255,255,0.05)" />
            <LegendBox $bg="rgba(34, 197, 94, 0.3)" />
            <LegendBox $bg="rgba(34, 197, 94, 0.6)" />
            <LegendBox $bg="#22c55e" />
            <span>Mais</span>
          </Legend>
        </HeatmapSection>

        <MessageCard>
          <MessageText>
            {streakAtual > 0 ? (
              <>
                Você está em uma sequência de <strong>{streakAtual} dias</strong> produtivos. Não quebre a corrente! Volte amanhã e marque mais um passo.
              </>
            ) : (
              <>
                Toda grande jornada começa com o primeiro passo. Vá até o seu plano e marque uma tarefa hoje para acender seu primeiro quadradinho!
              </>
            )}
          </MessageText>
        </MessageCard>
      </Page>
    </>
  );
};

export default Jornada;