import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { businessData, categories } from './data/businessData';
import BusinessCard from './components/BusinessCard';
import SearchBar from './components/SearchBar';
import FilterButtons from './components/FilterButtons';
import { GlobalStyle } from './styles/GlobalStyles';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import { authService } from './services/firebase';
import BusinessDetail from './pages/BusinessDetail'; // 👈 NOVO IMPORT

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1a3e 30%, #16213e 60%, #1a1a4e 80%, #2d1b69 100%);
`;

const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
  z-index: 1;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 40px;
  padding: 30px;
  background: rgba(10, 14, 39, 0.95);
  border-radius: 15px;
  border: 1px solid rgba(102, 126, 234, 0.15);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
`;

const Title = styled.h1`
  font-family: 'Arial Black', 'Impact', sans-serif;
  font-size: 3.5rem;
  margin-bottom: 10px;
  text-align: center;
  letter-spacing: 0px;
  font-weight: 900;
  background: linear-gradient(135deg, #ffffff 0%, #7eb8ff 25%, #4a8cf7 50%, #6366f1 75%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
`;

const Subtitle = styled.p`
  font-size: 1.3rem;
  opacity: 0.85;
  color: #b8c6db;
  text-align: center;
  font-weight: 400;
  letter-spacing: 1px;
  text-shadow: 0 0 20px rgba(102, 126, 234, 0.15);
`;

const ResultsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 30px;
`;

const NoResults = styled.div`
  text-align: center;
  padding: 50px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  grid-column: 1 / -1;
  border: 1px solid rgba(102, 126, 234, 0.2);
  color: #b8c6db;
  
  h3 {
    color: #fff;
    font-size: 1.5rem;
    margin-bottom: 10px;
  }
`;

const ResultsTitle = styled.h2`
  margin-top: 30px;
  color: #fff !important;
  text-align: center;
`;

const ResultsCount = styled.p`
  color: #b8c6db !important;
  text-align: center;
`;

// Componente Home
function Home() {
  const [budget, setBudget] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [filteredResults, setFilteredResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    const cleanBudget = budget.replace(/\./g, '').replace(',', '.');
    const budgetValue = parseFloat(cleanBudget);
    
    if (!budget || isNaN(budgetValue) || budgetValue <= 0) {
      alert('Por favor, insira um valor válido para o orçamento.');
      return;
    }

    setHasSearched(true);

    let results = businessData.filter(
      business => business.minInvestment >= budgetValue
    );

    if (selectedCategory !== 'Todos') {
      results = results.filter(
        business => business.category === selectedCategory
      );
    }

    setFilteredResults(results);
  };

  const handleBudgetChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value) {
      const number = parseFloat(value);
      setBudget(number.toLocaleString('pt-BR'));
    } else {
      setBudget('');
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (hasSearched) {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setBudget('');
    setFilteredResults([]);
    setHasSearched(false);
    setSelectedCategory('Todos');
  };

  return (
    <HomeContainer>
      <Header>
        <Title> Negócio ao Alcance</Title>
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
      />

      <FilterButtons
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      {hasSearched && (
        <>
          <ResultsTitle>
            📊 Resultados para R$ {budget}
          </ResultsTitle>
          <ResultsCount>
            {filteredResults.length} negócios encontrados
          </ResultsCount>
          <ResultsContainer>
            {filteredResults.length > 0 ? (
              filteredResults.map(business => (
                <BusinessCard key={business.id} business={business} />
              ))
            ) : (
              <NoResults>
                <h3>😕 Nenhum negócio encontrado</h3>
                <p>
                  Com R$ {budget}, você pode considerar economizar mais um pouco
                  ou buscar alternativas criativas!
                </p>
                <p style={{ marginTop: '10px' }}>
                  💡 Dica: Alguns negócios podem ser iniciados com menos de
                  R$ 100,00!
                </p>
              </NoResults>
            )}
          </ResultsContainer>
        </>
      )}
    </HomeContainer>
  );
}

// ⚡ App principal com login instantâneo
function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Escuta mudanças no estado de autenticação
    const unsubscribe = authService.onAuthStateChanged((firebaseUser) => {
      console.log('🔥 Auth state mudou:', firebaseUser?.email || 'null');
      
      if (firebaseUser) {
        // Usuário logado
        const userData = {
          ...firebaseUser,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuário',
          phone: '',
          favorites: [],
          searchHistory: []
        };
        console.log('✅ Usuário definido:', userData.name);
        setUser(userData);
      } else {
        console.log('👤 Usuário deslogado');
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (email, password) => {
    console.log('🔑 Tentando login...');
    try {
      const result = await authService.login(email, password);
      console.log('📊 Resultado do login:', result);
      
      if (result.success) {
        console.log('✅ Login bem sucedido!');
        // O onAuthStateChanged vai atualizar o user automaticamente
        return { success: true };
      } else {
        console.log('❌ Login falhou:', result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.log('❌ Erro no login:', error.message);
      return { success: false, error: error.message };
    }
  };

  const handleRegister = async (email, password, name, phone) => {
    console.log('📝 Tentando cadastrar...');
    try {
      const result = await authService.register(email, password, name, phone);
      console.log('📊 Resultado do cadastro:', result);
      
      if (result.success) {
        console.log('✅ Cadastro bem sucedido!');
        return { success: true };
      } else {
        console.log('❌ Cadastro falhou:', result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.log('❌ Erro no cadastro:', error.message);
      return { success: false, error: error.message };
    }
  };

  const handleLogout = async () => {
    console.log('🚪 Fazendo logout...');
    await authService.logout();
    setUser(null);
    console.log('✅ Logout realizado');
  };

  // Enquanto carrega, mostra uma tela simples
  if (loading) {
    return (
      <div style={{ 
        color: '#fff', 
        textAlign: 'center', 
        marginTop: '50px',
        fontSize: '1.2rem'
      }}>
        Carregando...
      </div>
    );
  }

  return (
    <Router>
      <GlobalStyle />
      <AppContainer>
        <Navbar user={user} onLogout={handleLogout} />
        <Routes>
          <Route 
            path="/login" 
            element={user ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} onRegister={handleRegister} />} 
          />
          <Route 
            path="/register" 
            element={user ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} onRegister={handleRegister} />} 
          />
          <Route 
            path="/" 
            element={user ? <Home /> : <Navigate to="/login" replace />} 
          />
          {/* 👈 NOVA ROTA PARA DETALHES DO NEGÓCIO */}
          <Route 
            path="/business/:id" 
            element={user ? <BusinessDetail /> : <Navigate to="/login" replace />} 
          />
        </Routes>
      </AppContainer>
    </Router>
  );
}

export default App;