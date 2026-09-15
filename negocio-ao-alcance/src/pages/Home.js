import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { businessData, categories } from '../data/businessData';
import BusinessCard from '../components/BusinessCard';
import SearchBar from '../components/SearchBar';
import FilterButtons from '../components/FilterButtons';

// ANIMAÇÕES
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { opacity: 0.6; transform: scale(0.98); }
  50% { opacity: 1; transform: scale(1); }
  100% { opacity: 0.6; transform: scale(0.98); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const glow = keyframes`
  0% { box-shadow: 0 0 20px rgba(102, 126, 234, 0.2); }
  50% { box-shadow: 0 0 40px rgba(102, 126, 234, 0.4); }
  100% { box-shadow: 0 0 20px rgba(102, 126, 234, 0.2); }
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
  z-index: 1;
  animation: ${fadeInUp} 0.6s ease-out;
`;

const WelcomeBanner = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 24px 32px;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  animation: ${glow} 3s ease-in-out infinite;

  @media (max-width: 480px) {
    flex-direction: column;
    text-align: center;
    gap: 12px;
    padding: 20px;
  }
`;

const WelcomeText = styled.div`
  color: #b8c6db;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 12px;

  strong {
    color: #fff;
    font-size: 1.3rem;
    background: linear-gradient(135deg, #667eea, #764ba2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const UserInfo = styled.span`
  color: #667eea;
  font-weight: 600;
  padding: 8px 16px;
  background: rgba(102, 126, 234, 0.15);
  border-radius: 20px;
  border: 1px solid rgba(102, 126, 234, 0.2);
  font-size: 0.9rem;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 40px;
  padding: 40px 30px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(ellipse at 30% 50%, rgba(102, 126, 234, 0.05), transparent 60%),
                radial-gradient(ellipse at 70% 50%, rgba(118, 75, 162, 0.05), transparent 60%);
    animation: ${float} 8s ease-in-out infinite;
  }

  @media (max-width: 480px) {
    padding: 24px 16px;
    margin-bottom: 24px;
  }
`;

const Title = styled.h1`
  font-family: 'Arial Black', 'Impact', sans-serif;
  font-size: 3.8rem;
  margin-bottom: 12px;
  text-align: center;
  letter-spacing: -1px;
  font-weight: 900;
  position: relative;
  z-index: 1;
  background: linear-gradient(135deg, #ffffff 0%, #a8c8ff 30%, #667eea 60%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 2px 20px rgba(102, 126, 234, 0.2));
  animation: ${float} 6s ease-in-out infinite;

  @media (max-width: 768px) {
    font-size: 2.8rem;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  opacity: 0.8;
  color: #b8c6db;
  text-align: center;
  font-weight: 300;
  letter-spacing: 2px;
  position: relative;
  z-index: 1;
  text-shadow: 0 0 30px rgba(102, 126, 234, 0.1);

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const StatsBar = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
  margin: 24px 0 30px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.06);

  @media (max-width: 480px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    padding: 16px;
  }
`;

const StatItem = styled.div`
  text-align: center;
  padding: 8px;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-4px);
  }
`;

const StatValue = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 480px) {
    font-size: 1.4rem;
  }
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: #8899aa;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 4px;
`;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
  padding: 0 4px;
  flex-wrap: wrap;
  gap: 12px;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ResultsTitle = styled.h2`
  color: #fff;
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: -0.5px;

  span {
    color: #667eea;
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

const ResultsCount = styled.p`
  color: #8899aa;
  font-size: 0.95rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 6px 16px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.06);
`;

const ResultsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  margin-top: 24px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const NoResults = styled.div`
  text-align: center;
  padding: 60px 40px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  grid-column: 1 / -1;
  border: 1px solid rgba(255, 255, 255, 0.06);
  
  h3 {
    color: #fff;
    font-size: 1.5rem;
    margin-bottom: 12px;
  }

  p {
    color: #8899aa;
    max-width: 400px;
    margin: 0 auto 8px;
  }

  @media (max-width: 480px) {
    padding: 40px 24px;
    
    h3 {
      font-size: 1.2rem;
    }
  }
`;

const GradientLine = styled.div`
  width: 80px;
  height: 3px;
  background: linear-gradient(90deg, #667eea, #764ba2, #a855f7);
  border-radius: 2px;
  margin: 12px auto 0;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const Home = ({ user }) => {
  const [budget, setBudget] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [filteredResults, setFilteredResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    console.log('📦 Total de serviços:', businessData.length);
    setFilteredResults(businessData);
    setHasSearched(false);
  }, []);

  const handleSearch = () => {
    if (!budget || budget === '') {
      setFilteredResults(businessData);
      setHasSearched(false);
      return;
    }

    const cleanBudget = budget.replace(/\./g, '').replace(',', '.');
    const budgetValue = parseFloat(cleanBudget);
    
    if (isNaN(budgetValue) || budgetValue <= 0) {
      alert('Por favor, insira um valor válido.');
      return;
    }

    const results = businessData.filter(item => {
      const minInvest = item.minInvestment;
      return minInvest >= budgetValue;
    });

    let finalResults = results;
    if (selectedCategory !== 'Todos') {
      finalResults = results.filter(
        item => item.category === selectedCategory
      );
    }

    setFilteredResults(finalResults);
    setHasSearched(true);
  };

  const handleBudgetChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value) {
      const number = parseFloat(value);
      setBudget(number.toLocaleString('pt-BR'));
    } else {
      setBudget('');
      setFilteredResults(businessData);
      setHasSearched(false);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    
    if (category === 'Todos') {
      setFilteredResults(businessData);
      setHasSearched(false);
      setBudget('');
      return;
    }

    let results = businessData.filter(
      item => item.category === category
    );

    if (budget && budget !== '' && hasSearched) {
      const cleanBudget = budget.replace(/\./g, '').replace(',', '.');
      const budgetValue = parseFloat(cleanBudget);
      if (!isNaN(budgetValue) && budgetValue > 0) {
        results = results.filter(
          item => item.minInvestment >= budgetValue
        );
      }
    }

    setFilteredResults(results);
    setHasSearched(true);
  };

  const clearSearch = () => {
    setBudget('');
    setSelectedCategory('Todos');
    setFilteredResults(businessData);
    setHasSearched(false);
  };

  const totalServices = businessData.length;
  const totalCategories = categories.length - 1;

  const minInvestment = businessData.length > 0 
    ? Math.min(...businessData.map(item => item.minInvestment))
    : 0;
  const maxInvestment = businessData.length > 0 
    ? Math.max(...businessData.map(item => item.maxInvestment))
    : 0;

  return (
    <Container>
      <WelcomeBanner>
        <WelcomeText>
          <span>👋</span> Olá, <strong>{user?.displayName || user?.name || 'Usuário'}</strong>
        </WelcomeText>
        <UserInfo>
          {hasSearched && budget ? `📊 A partir de R$ ${budget}` : '💡 Digite um valor e busque'}
        </UserInfo>
      </WelcomeBanner>

      <Header>
        <Title>🚀 Negócio ao Alcance</Title>
        <GradientLine />
        <Subtitle>
          Descubra oportunidades de negócio que cabem no seu bolso!
        </Subtitle>
      </Header>

      <SearchBar
        budget={budget}
        onBudgetChange={handleBudgetChange}
        onSearch={handleSearch}
        onClear={clearSearch}
        hasSearched={hasSearched}
        placeholder="Digite o valor mínimo (ex: 100) - serviços a partir deste valor"
      />

      <FilterButtons
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      <StatsBar>
        <StatItem>
          <StatValue>{totalServices}</StatValue>
          <StatLabel>📦 Serviços</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{totalCategories}</StatValue>
          <StatLabel>📂 Categorias</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>R$ {minInvestment.toLocaleString('pt-BR')}</StatValue>
          <StatLabel>💰 Mínimo</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>R$ {maxInvestment.toLocaleString('pt-BR')}</StatValue>
          <StatLabel>💰 Máximo</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{filteredResults.length}</StatValue>
          <StatLabel>🔍 Encontrados</StatLabel>
        </StatItem>
      </StatsBar>

      <ResultsHeader>
        <ResultsTitle>
          {selectedCategory === 'Todos' && !hasSearched ? (
            '📊 Todos os serviços disponíveis'
          ) : hasSearched && budget ? (
            <>📊 Resultados para <span>R$ {budget}</span></>
          ) : (
            '📊 Todos os serviços disponíveis'
          )}
          {selectedCategory !== 'Todos' && ` • ${selectedCategory}`}
        </ResultsTitle>
        <ResultsCount>
          {filteredResults.length} negócios encontrados
        </ResultsCount>
      </ResultsHeader>

      {/* 🔥 VERIFICAÇÃO VISUAL: Mostra uma mensagem se não houver resultados */}
      {filteredResults.length === 0 && (
        <div style={{ color: '#ff6b6b', textAlign: 'center', padding: '20px', background: 'rgba(255,0,0,0.1)', borderRadius: '10px' }}>
          ⚠️ Nenhum serviço encontrado. Verifique se o businessData tem dados.
        </div>
      )}

      <ResultsContainer>
        {filteredResults.length > 0 ? (
          filteredResults.map((business, index) => (
            <BusinessCard 
              key={business.id} 
              business={business} 
              style={{ animationDelay: `${index * 0.05}s` }}
            />
          ))
        ) : (
          <NoResults>
            <h3>😕 Nenhum negócio encontrado</h3>
            <p>
              {budget && hasSearched
                ? `Nenhum serviço encontrado com investimento a partir de R$ ${budget}. Tente um valor menor!`
                : 'Nenhum serviço encontrado nesta categoria.'}
            </p>
            <p style={{ marginTop: '8px', color: '#667eea' }}>
              💡 Dica: Existem serviços a partir de R$ {minInvestment.toLocaleString('pt-BR')}
            </p>
          </NoResults>
        )}
      </ResultsContainer>
    </Container>
  );
};

export default Home;