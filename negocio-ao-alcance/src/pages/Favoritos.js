import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { auth, authService } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { businessData } from '../data/businessData';
import BusinessCard from '../components/BusinessCard';

// ─── ANIMAÇÕES ─────────────────────────────────────────────
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const gradientFlow = keyframes`
  0%   { background-position: 0% 50%; }
  100% { background-position: 300% 50%; }
`;

const skeleton = keyframes`
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50%      { transform: scale(1.06); opacity: 0.85; }
`;

// ─── LAYOUT ────────────────────────────────────────────────
const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 24px;
  animation: ${fadeInUp} 0.6s ease-out;
  position: relative;

  @media (max-width: 480px) { padding: 16px; }
`;

// ─── HEADER ────────────────────────────────────────────────
const Header = styled.div`
  position: relative;
  margin-bottom: 32px;
  padding: 60px 40px 40px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;

  &::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg,
    #ffffff 0%,
    #7eb8ff 35%,
    #a855f7 65%,
    #ffffff 100%);
}

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(74, 140, 247, 0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(74, 140, 247, 0.04) 1px, transparent 1px);
    background-size: 32px 32px;
    pointer-events: none;
    mask-image: radial-gradient(circle at 50% 50%, black 0%, transparent 70%);
    -webkit-mask-image: radial-gradient(circle at 50% 50%, black 0%, transparent 70%);
  }

  @media (max-width: 480px) {
    padding: 50px 20px 28px;
    border-radius: 20px;
    margin-bottom: 24px;
  }
`;

const HeaderLeft = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 2.8rem;
  margin: 0 0 12px 0;
  font-weight: 800;
  letter-spacing: -1px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;

  background: linear-gradient(135deg,
    #ffffff 0%, #d0e0ff 30%, #7eb8ff 70%, #4a8cf7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  svg {
    -webkit-text-fill-color: initial;
    color: #f87171;
    width: 40px;
    height: 40px;
  }

  @media (max-width: 768px) {
    font-size: 2.2rem;
    gap: 12px;

    svg {
      width: 32px;
      height: 32px;
    }
  }

  @media (max-width: 480px) {
    font-size: 1.7rem;
    gap: 10px;

    svg {
      width: 26px;
      height: 26px;
    }
  }
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: #a8b8d8;
  margin: 0;
  font-weight: 500;
  text-align: center;
  max-width: 480px;
  line-height: 1.5;

  @media (max-width: 480px) {
    font-size: 0.88rem;
  }
`;

const CounterBadge = styled.div`
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  padding: 10px 22px;
  background: linear-gradient(135deg, rgba(74, 140, 247, 0.12), rgba(37, 99, 235, 0.08));
  border: 1px solid rgba(74, 140, 247, 0.25);
  border-radius: 999px;
  box-shadow: 0 4px 20px rgba(37, 99, 235, 0.15);

  @media (max-width: 480px) {
    padding: 8px 16px;
    margin-top: 14px;
  }
`;

const CounterValue = styled.div`
  font-size: 1.4rem;
  font-weight: 800;
  color: #fff;
  line-height: 1;
  letter-spacing: -0.5px;

  @media (max-width: 480px) { font-size: 1.1rem; }
`;

const CounterLabel = styled.div`
  font-size: 0.7rem;
  color: #7eb8ff;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-weight: 700;

  @media (max-width: 480px) { font-size: 0.62rem; }
`;

// ─── BOTÃO VOLTAR (canto esquerdo) ─────────────────────────
const BackLink = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: rgba(74, 140, 247, 0.08);
  border: 1px solid rgba(74, 140, 247, 0.18);
  border-radius: 8px;
  color: #7eb8ff;
  font-family: inherit;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.25s ease;
  z-index: 3;

  svg {
    transition: transform 0.25s ease;
    width: 14px;
    height: 14px;
  }

  &:hover {
    background: rgba(74, 140, 247, 0.15);
    border-color: rgba(74, 140, 247, 0.4);
    color: #a8ccff;
    transform: translateX(-2px);

    svg { transform: translateX(-3px); }
  }

  @media (max-width: 480px) {
    top: 14px;
    left: 14px;
    padding: 5px 9px;
    font-size: 0.65rem;
    gap: 5px;

    svg {
      width: 12px;
      height: 12px;
    }
  }
`;

// ─── GRID ──────────────────────────────────────────────────
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 24px;

  & > * {
    animation: ${fadeInUp} 0.5s ease-out backwards;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

// ─── SKELETON ──────────────────────────────────────────────
const SkeletonCard = styled.div`
  height: 280px;
  border-radius: 20px;
  background: linear-gradient(90deg,
    rgba(255, 255, 255, 0.03) 0%,
    rgba(255, 255, 255, 0.07) 50%,
    rgba(255, 255, 255, 0.03) 100%);
  background-size: 800px 100%;
  animation: ${skeleton} 1.6s infinite linear;
  border: 1px solid rgba(255, 255, 255, 0.04);
`;

// ─── EMPTY STATE ───────────────────────────────────────────
const Empty = styled.div`
  text-align: center;
  padding: 80px 40px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
  overflow: hidden;
  animation: ${fadeInUp} 0.6s ease-out;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(74, 140, 247, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(74, 140, 247, 0.03) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
    mask-image: radial-gradient(circle at 50% 50%, black 0%, transparent 60%);
    -webkit-mask-image: radial-gradient(circle at 50% 50%, black 0%, transparent 60%);
  }

  @media (max-width: 480px) {
    padding: 50px 24px;
    border-radius: 20px;
  }
`;

const EmptyIcon = styled.div`
  position: relative;
  z-index: 1;
  font-size: 4rem;
  margin-bottom: 20px;
  color: #f87171;
  animation: ${pulse} 3s ease-in-out infinite;

  @media (max-width: 480px) { font-size: 3rem; margin-bottom: 16px; }
`;

const EmptyTitle = styled.h3`
  position: relative;
  z-index: 1;
  color: #e8eef7;
  font-size: 1.5rem;
  margin: 0 0 14px 0;
  font-weight: 800;
  letter-spacing: -0.4px;

  @media (max-width: 480px) { font-size: 1.2rem; }
`;

const EmptyText = styled.p`
  position: relative;
  z-index: 1;
  color: #a8b8d8;
  max-width: 480px;
  margin: 0 auto 28px;
  font-size: 0.95rem;
  line-height: 1.6;

  @media (max-width: 480px) { font-size: 0.88rem; margin-bottom: 22px; }
`;

const ExploreButton = styled.button`
  position: relative;
  z-index: 1;
  padding: 14px 32px;
  background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
  border: 1px solid rgba(74, 140, 247, 0.4);
  border-radius: 12px;
  color: #fff;
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s ease;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.25);

  &:hover {
    background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(37, 99, 235, 0.4);
  }

  @media (max-width: 480px) {
    padding: 12px 24px;
    font-size: 0.88rem;
  }
`;

// ─── ÍCONES SVG ────────────────────────────────────────────
const HeartIcon = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="url(#heartGradient)"
    stroke="none"
  >
    <defs>
      <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fb7185" />
        <stop offset="100%" stopColor="#e11d48" />
      </linearGradient>
    </defs>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const SearchIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const BackArrow = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 12H5" />
    <path d="m12 19-7-7 7-7" />
  </svg>
);

// ─── COMPONENTE ────────────────────────────────────────────
const Favoritos = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const loadFavorites = async () => {
      setLoading(true);
      console.log('📥 Carregando favoritos para:', userId);

      const result = await authService.getFavorites(userId);
      console.log('📦 Resultado:', result);

      if (result.success && result.data.length > 0) {
        const favoriteBusinesses = businessData.filter(b =>
          result.data.includes(b.id)
        );
        console.log('✅ Favoritos encontrados:', favoriteBusinesses.length);
        setFavorites(favoriteBusinesses);
      } else {
        console.log('⚠️ Nenhum favorito encontrado');
        setFavorites([]);
      }

      setLoading(false);
    };

    loadFavorites();
  }, [userId]);

  // ─── LOADING (SKELETON) ──────────────────────────────────
  if (loading) {
    return (
      <Container>
        <Header>
          <BackLink onClick={() => navigate('/')}>
            <BackArrow />
            Voltar ao início
          </BackLink>
          <HeaderLeft>
            <Title>
              <HeartIcon />
              Meus Favoritos
            </Title>
            <Subtitle>Carregando seus negócios salvos...</Subtitle>
          </HeaderLeft>
        </Header>
        <Grid>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <SkeletonCard key={i} style={{ animationDelay: `${i * 0.08}s` }} />
          ))}
        </Grid>
      </Container>
    );
  }

  // ─── RENDER ──────────────────────────────────────────────
  const hasFavorites = favorites.length > 0;

  return (
    <Container>
      {/* HEADER */}
      <Header>
        <BackLink onClick={() => navigate('/')}>
          <BackArrow />
          Voltar ao início
        </BackLink>

        <HeaderLeft>
          <Title>
            <HeartIcon />
            Meus Favoritos
          </Title>
          <Subtitle>
            {hasFavorites
              ? 'Os negócios que você salvou em um só lugar'
              : 'Sua lista pessoal de negócios'}
          </Subtitle>

          {hasFavorites && (
            <CounterBadge>
              <CounterValue>{favorites.length}</CounterValue>
              <CounterLabel>
                {favorites.length === 1 ? 'Negócio' : 'Negócios'}
              </CounterLabel>
            </CounterBadge>
          )}
        </HeaderLeft>
      </Header>

      {/* CONTEÚDO */}
      {hasFavorites ? (
        <Grid>
          {favorites.map((business, index) => (
            <div
              key={business.id}
              style={{ animationDelay: `${index * 0.06}s` }}
            >
              <BusinessCard business={business} />
            </div>
          ))}
        </Grid>
      ) : (
        <Empty>
          <EmptyIcon>💔</EmptyIcon>
          <EmptyTitle>Nenhum favorito ainda</EmptyTitle>
          <EmptyText>
            Você ainda não salvou nenhum negócio. Explore os serviços
            disponíveis e toque no coração para adicionar aos seus favoritos!
          </EmptyText>
          <ExploreButton onClick={() => navigate('/')}>
            <SearchIcon />
            Explorar Negócios
          </ExploreButton>
        </Empty>
      )}
    </Container>
  );
};

export default Favoritos;