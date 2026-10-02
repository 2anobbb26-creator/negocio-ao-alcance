import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { auth, authService } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { businessData } from '../data/businessData';
import BusinessCard from '../components/BusinessCard';

// 🎨 ANIMAÇÕES
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

const gradientFlow = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 300% 50%; }
`;

// 🎨 CONTAINER
const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 24px;
  animation: ${fadeInUp} 0.6s ease-out;

  @media (max-width: 480px) {
    padding: 16px;
  }
`;

// 🎯 HEADER
const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
  padding: 60px 40px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(24px);
  border-radius: 28px;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.06);

  /* ✨ BORDA GRADIENTE NO TOPO */
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
    animation: ${gradientFlow} 4s linear infinite;
  }

  @media (max-width: 480px) {
    padding: 40px 20px;
    margin-bottom: 24px;
    border-radius: 22px;
  }
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 16px;
  font-weight: 800;
  letter-spacing: -1px;
  position: relative;
  z-index: 1;
  background: linear-gradient(135deg, 
    #ffffff 0%, 
    #d0e0ff 20%, 
    #7eb8ff 45%, 
    #4a8cf7 65%, 
    #a855f7 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.8rem;
  }
`;

const Subtitle = styled.p`
  font-size: 0.9rem;
  color: #a8b8d8;
  margin: 0;
  position: relative;
  z-index: 1;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  padding: 10px 24px;
  background: rgba(74, 140, 247, 0.08);
  border-radius: 30px;
  display: inline-block;
  border: 1px solid rgba(74, 140, 247, 0.2);

  @media (max-width: 480px) {
    font-size: 0.7rem;
    letter-spacing: 1px;
    padding: 8px 16px;
  }
`;

// 📋 RESULTS HEADER
const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin: 32px 0 24px;
  padding: 20px 24px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);

  @media (max-width: 480px) {
    padding: 16px 18px;
    margin: 24px 0 18px;
    flex-wrap: wrap;
  }
`;

const ResultsTitle = styled.h2`
  color: #e8eef7;
  font-size: 1.15rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;

  &::before {
    content: '';
    display: block;
    width: 4px;
    height: 20px;
    background: linear-gradient(180deg, #4a8cf7, #2563eb);
    border-radius: 2px;
  }

  @media (max-width: 480px) {
    font-size: 1rem;

    &::before {
      height: 16px;
    }
  }
`;

const ResultsCount = styled.div`
  color: #a8b8d8;
  font-size: 0.8rem;
  background: rgba(74, 140, 247, 0.08);
  padding: 8px 16px;
  border-radius: 10px;
  border: 1px solid rgba(74, 140, 247, 0.18);
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  white-space: nowrap;

  span {
    color: #7eb8ff;
    font-weight: 800;
    font-size: 0.95rem;
    margin-right: 8px;
  }

  @media (max-width: 480px) {
    font-size: 0.7rem;
    padding: 6px 12px;

    span {
      font-size: 0.85rem;
      margin-right: 6px;
    }
  }
`;

// 📦 GRID
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

// 🚫 EMPTY
const Empty = styled.div`
  text-align: center;
  padding: 80px 40px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.06);

  h3 {
    color: #e8eef7;
    font-size: 1.5rem;
    margin-bottom: 16px;
    font-weight: 700;
  }

  p {
    color: #a8b8d8;
    max-width: 450px;
    margin: 0 auto 24px;
    font-size: 1rem;
    line-height: 1.6;
  }

  @media (max-width: 480px) {
    padding: 50px 24px;

    h3 {
      font-size: 1.2rem;
    }

    p {
      font-size: 0.9rem;
    }
  }
`;

const BackButton = styled.button`
  padding: 14px 32px;
  background: linear-gradient(135deg, #0d1b3e 0%, #142952 50%, #1e3a8a 100%);
  border: 1px solid rgba(74, 140, 247, 0.3);
  border-radius: 12px;
  color: #ffffff;
  font-family: 'Poppins', 'Inter', sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  letter-spacing: 0.8px;

  &:hover {
    background: linear-gradient(135deg, #142952 0%, #1e3a8a 50%, #2563eb 100%);
    transform: translateY(-2px);
  }

  @media (max-width: 480px) {
    padding: 12px 24px;
    font-size: 0.85rem;
  }
`;

const Loading = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #a8b8d8;
  font-size: 1.1rem;
`;

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

  if (loading) {
    return (
      <Container>
        <Loading>⏳ Carregando favoritos...</Loading>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Meus Favoritos</Title>
        <br />
        <Subtitle>Seus negócios favoritos em um só lugar</Subtitle>
      </Header>

      {favorites.length > 0 ? (
        <>
          <ResultsHeader>
            <ResultsTitle>Negócios Favoritados</ResultsTitle>
            <ResultsCount>
              <span>{favorites.length}</span>
              {favorites.length === 1 ? 'NEGÓCIO' : 'NEGÓCIOS'}
            </ResultsCount>
          </ResultsHeader>

          <Grid>
            {favorites.map((business, index) => (
              <BusinessCard
                key={business.id}
                business={business}
                style={{ animationDelay: `${index * 0.05}s` }}
              />
            ))}
          </Grid>
        </>
      ) : (
        <Empty>
          <h3>💔 Nenhum favorito ainda</h3>
          <p>
            Você ainda não favoritou nenhum negócio. Explore os serviços disponíveis e clique no coração ❤️ para salvar seus favoritos!
          </p>
          <BackButton onClick={() => navigate('/')}>
            🔍 Explorar Negócios
          </BackButton>
        </Empty>
      )}
    </Container>
  );
};

export default Favoritos;