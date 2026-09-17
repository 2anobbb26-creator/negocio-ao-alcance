import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { businessData, categories } from '../data/businessData';
import BusinessCard from '../components/BusinessCard';
import SearchBar from '../components/SearchBar';
import FilterButtons from '../components/FilterButtons';

// 🎨 ANIMAÇÕES
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const pulse = keyframes`
  0% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
  100% { opacity: 0.5; transform: scale(1); }
`;

const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(1deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const slideInLeft = keyframes`
  from { opacity: 0; transform: translateX(-30px); }
  to { opacity: 1; transform: translateX(0); }
`;

const slideInRight = keyframes`
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
`;

// 🎨 CONTAINER PRINCIPAL
const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 24px;
  position: relative;
  z-index: 1;
  animation: ${fadeInUp} 0.8s ease-out;
`;

// 🌟 BACKGROUND DECORATIVO
const BackgroundDecor = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -20%;
    right: -10%;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(74, 140, 247, 0.08) 0%, transparent 70%);
    border-radius: 50%;
    animation: ${float} 12s ease-in-out infinite;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -20%;
    left: -10%;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(37, 99, 235, 0.08) 0%, transparent 70%);
    border-radius: 50%;
    animation: ${float} 15s ease-in-out infinite reverse;
  }
`;

// 🚀 HEADER PRINCIPAL - BORDA AO REDOR
// 🚀 HEADER PRINCIPAL - BORDA GRADIENTE SUTIL
const Header = styled.header`
  text-align: center;
  margin-bottom: 40px;
  padding: 60px 40px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(24px);
  border-radius: 28px;
  position: relative;
  overflow: hidden;

  /* ✨ BORDA GRADIENTE SUTIL AO REDOR */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 28px;
    padding: 1px;
    background: linear-gradient(135deg, 
      rgba(74, 140, 247, 0.4) 0%, 
      rgba(126, 184, 255, 0.3) 25%, 
      rgba(168, 85, 247, 0.35) 50%, 
      rgba(126, 184, 255, 0.3) 75%, 
      rgba(74, 140, 247, 0.4) 100%
    );
    background-size: 300% 300%;
    animation: borderShimmer 6s linear infinite;
    -webkit-mask: 
      linear-gradient(#fff 0 0) content-box, 
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }

  /* 🌟 BACKGROUND DECORATIVO INTERNO */
  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: 
      radial-gradient(ellipse at 30% 50%, rgba(74, 140, 247, 0.04), transparent 60%),
      radial-gradient(ellipse at 70% 50%, rgba(102, 126, 234, 0.03), transparent 60%);
    animation: ${float} 10s ease-in-out infinite;
    pointer-events: none;
    z-index: -1;
  }

  @media (max-width: 768px) {
    padding: 40px 24px;
    margin-bottom: 32px;
  }

  @media (max-width: 480px) {
    padding: 32px 16px;
    margin-bottom: 24px;
    border-radius: 22px;

    &::before {
      border-radius: 22px;
    }
  }
`;

const Title = styled.h1`
  font-family: 'Arial Black', 'Impact', sans-serif;
  font-size: 4rem;
  margin-bottom: 20px;
  text-align: center;
  letter-spacing: -0.5px;
  font-weight: 900;
  position: relative;
  z-index: 1;
  background: linear-gradient(135deg, 
    #ffffff 0%, 
    #d0e0ff 15%, 
    #7eb8ff 35%, 
    #4a8cf7 55%, 
    #7c5cf7 75%, 
    #a855f7 90%, 
    #c084fc 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 3rem;
  }

  @media (max-width: 480px) {
    font-size: 2.2rem;
    letter-spacing: -0.5px;
  }
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: #c8d8f0;
  text-align: center;
  font-weight: 600;
  letter-spacing: 3px;
  position: relative;
  z-index: 1;
  text-transform: uppercase;
  text-shadow: 0 0 20px rgba(74, 140, 247, 0.3);
  padding: 12px 24px;
  background: rgba(74, 140, 247, 0.08);
  border-radius: 30px;
  display: inline-block;
  border: 1px solid rgba(74, 140, 247, 0.15);
  backdrop-filter: blur(10px);

  @media (max-width: 480px) {
    font-size: 0.75rem;
    letter-spacing: 1.5px;
    padding: 10px 16px;
  }
`;

const GradientLine = styled.div`
  width: 120px;
  height: 4px;
  background: linear-gradient(90deg, #4a8cf7, #7eb8ff, #a855f7, #7eb8ff, #4a8cf7);
  background-size: 200% auto;
  border-radius: 2px;
  margin: 20px auto;
  animation: ${shimmer} 3s linear infinite, ${pulse} 2s ease-in-out infinite;
  box-shadow: 0 0 20px rgba(74, 140, 247, 0.5);
`;

// 📋 RESULTS HEADER
const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 40px;
  padding: 0 8px;
  flex-wrap: wrap;
  gap: 16px;
  animation: ${slideInLeft} 0.6s ease-out;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ResultsTitle = styled.h2`
  color: #fff;
  font-size: 1.6rem;
  font-weight: 700;
  letter-spacing: -0.5px;
  display: flex;
  align-items: center;
  gap: 10px;

  span {
    background: linear-gradient(135deg, #4a8cf7, #a855f7);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

const ResultsCount = styled.p`
  color: #8899aa;
  font-size: 0.9rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 8px 20px;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  font-weight: 600;
  animation: ${slideInRight} 0.6s ease-out;
`;

// 📦 RESULTS CONTAINER
const ResultsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 24px;
  margin-top: 32px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

// 🚫 NO RESULTS
const NoResults = styled.div`
  text-align: center;
  padding: 80px 40px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  grid-column: 1 / -1;
  border: 1px solid rgba(255, 255, 255, 0.08);
  animation: ${fadeIn} 0.6s ease-out;
  
  h3 {
    color: #fff;
    font-size: 1.8rem;
    margin-bottom: 16px;
    font-weight: 700;
  }

  p {
    color: #8899aa;
    max-width: 450px;
    margin: 0 auto 12px;
    font-size: 1rem;
    line-height: 1.6;
  }

  @media (max-width: 480px) {
    padding: 48px 24px;
    
    h3 {
      font-size: 1.3rem;
    }
  }
`;

// 🎨 DIVIDER
const Divider = styled.div`
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(74, 140, 247, 0.3), transparent);
  margin: 40px 0;
  border: none;
`;

// 🎯 ANIMAÇÕES EM CASCATA
const SearchWrapper = styled.div`
  animation: ${fadeInUp} 0.8s ease-out;
  animation-delay: 0.2s;
  animation-fill-mode: both;
`;

const FilterWrapper = styled.div`
  animation: ${fadeInUp} 0.8s ease-out;
  animation-delay: 0.3s;
  animation-fill-mode: both;
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

    const results = businessData.filter(item => item.minInvestment >= budgetValue);

    let finalResults = results;
    if (selectedCategory !== 'Todos') {
      finalResults = results.filter(item => item.category === selectedCategory);
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

    let results = businessData.filter(item => item.category === category);

    if (budget && budget !== '' && hasSearched) {
      const cleanBudget = budget.replace(/\./g, '').replace(',', '.');
      const budgetValue = parseFloat(cleanBudget);
      if (!isNaN(budgetValue) && budgetValue > 0) {
        results = results.filter(item => item.minInvestment >= budgetValue);
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

  const minInvestment = businessData.length > 0 
    ? Math.min(...businessData.map(item => item.minInvestment))
    : 0;

  return (
    <>
      <BackgroundDecor />
      <Container>
        <Header>
          <Title>Negócio ao Alcance</Title>
          <GradientLine />
          <Subtitle>Descubra oportunidades de negócio que cabem no seu bolso!</Subtitle>
        </Header>

        <SearchWrapper>
          <SearchBar
            budget={budget}
            onBudgetChange={handleBudgetChange}
            onSearch={handleSearch}
            onClear={clearSearch}
            hasSearched={hasSearched}
            placeholder="Digite o valor mínimo (ex: 100) - serviços a partir deste valor"
          />
        </SearchWrapper>

        <FilterWrapper>
          <FilterButtons
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </FilterWrapper>

        <Divider />

        <ResultsHeader>
          <ResultsTitle>
            {selectedCategory === 'Todos' && !hasSearched ? (
              <>✨ Todos os serviços disponíveis</>
            ) : hasSearched && budget ? (
              <>📊 Resultados para <span>R$ {budget}</span></>
            ) : (
              <>✨ Todos os serviços disponíveis</>
            )}
            {selectedCategory !== 'Todos' && ` • ${selectedCategory}`}
          </ResultsTitle>
          <ResultsCount>
            {filteredResults.length} {filteredResults.length === 1 ? 'negócio encontrado' : 'negócios encontrados'}
          </ResultsCount>
        </ResultsHeader>

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
              <p style={{ marginTop: '12px', color: '#4a8cf7', fontWeight: '600' }}>
                💡 Dica: Existem serviços a partir de R$ {minInvestment.toLocaleString('pt-BR')}
              </p>
            </NoResults>
          )}
        </ResultsContainer>
      </Container>
    </>
  );
};

export default Home;