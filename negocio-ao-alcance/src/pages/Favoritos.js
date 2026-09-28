import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { auth, authService } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { businessData } from '../data/businessData';
import BusinessCard from '../components/BusinessCard';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 24px;
  animation: ${fadeInUp} 0.6s ease-out;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
  padding: 40px 30px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(20px);
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 12px;
  font-weight: 800;
  background: linear-gradient(135deg, #ffffff 0%, #d0e0ff 40%, #7eb8ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 480px) {
    font-size: 1.8rem;
  }
`;

const Subtitle = styled.p`
  color: #a8b8d8;
  font-size: 1rem;
  margin: 0;
`;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 32px 0 24px;
  padding: 20px 24px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
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
    background: linear-gradient(180deg, #ef4444, #dc2626);
    border-radius: 2px;
  }
`;

const ResultsCount = styled.div`
  color: #a8b8d8;
  font-size: 0.8rem;
  background: rgba(239, 68, 68, 0.08);
  padding: 8px 16px;
  border-radius: 10px;
  border: 1px solid rgba(239, 68, 68, 0.15);
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;

  span {
    color: #ef4444;
    font-weight: 800;
    font-size: 0.95rem;
    margin-right: 2px;
  }
`;

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

  // 🔥 ESCUTAR MUDANÇAS DE AUTENTICAÇÃO
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

  // 🔥 CARREGAR FAVORITOS QUANDO O USERID ESTIVER DISPONÍVEL
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
        <Title>❤️ Meus Favoritos</Title>
        <Subtitle>Seus negócios favoritos em um só lugar</Subtitle>
      </Header>

      {favorites.length > 0 ? (
        <>
          <ResultsHeader>
            <ResultsTitle>Negócios Favoritados</ResultsTitle>
            <ResultsCount>
              <span>{favorites.length}</span>
              {favorites.length === 1 ? 'negócio' : 'negócios'}
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