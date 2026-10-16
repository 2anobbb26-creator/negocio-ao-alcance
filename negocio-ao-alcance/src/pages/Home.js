import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import styled, { keyframes } from 'styled-components';
import { businessData, categories } from '../data/businessData';
import BusinessCard from '../components/BusinessCard';
import { useToast } from '../components/Toast';

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

  @media (max-width: 768px) { padding: 20px; }
  @media (max-width: 480px) { padding: 16px; }
  @media (max-width: 360px) { padding: 12px; }
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

  @media (max-width: 480px) {
    &::before { width: 350px; height: 350px; }
    &::after { width: 300px; height: 300px; }
  }
`;

// 🎯 HEADER PRINCIPAL
const Header = styled.header`
  text-align: center;
  margin-bottom: 40px;
  padding: 60px 40px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(24px);
  border-radius: 28px;
  position: relative;
  overflow: hidden;

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
    animation: ${shimmer} 6s linear infinite;
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }

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
    border-radius: 24px;

    &::before { border-radius: 24px; }
  }

  @media (max-width: 480px) {
    padding: 32px 18px;
    margin-bottom: 24px;
    border-radius: 20px;

    &::before { border-radius: 20px; }
  }

  @media (max-width: 360px) {
    padding: 26px 14px;
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

  @media (max-width: 768px) { font-size: 3rem; }
  @media (max-width: 480px) {
    font-size: 2.2rem;
    letter-spacing: -0.5px;
    margin-bottom: 14px;
  }
  @media (max-width: 360px) { font-size: 1.85rem; }
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
  margin: 0;

  @media (max-width: 480px) {
    font-size: 0.75rem;
    letter-spacing: 1.5px;
    padding: 10px 16px;
  }
  @media (max-width: 360px) {
    font-size: 0.68rem;
    letter-spacing: 1px;
    padding: 8px 12px;
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

  @media (max-width: 480px) {
    width: 90px;
    height: 3px;
    margin: 14px auto;
  }
`;

// ─── 🔍 BARRA DE BUSCA ─────────────────────────────────────
const SearchContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  animation: ${fadeInUp} 0.8s ease-out;
  animation-delay: 0.2s;
  animation-fill-mode: both;
  position: relative;
  z-index: 2;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const SearchInputWrapper = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #7eb8ff;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  transition: color 0.25s ease;

  svg {
    width: 20px;
    height: 20px;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 18px 52px 18px 54px;
  background: rgba(10, 21, 48, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1.5px solid rgba(74, 140, 247, 0.2);
  border-radius: 16px;
  color: #e8eef7;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;

  &::placeholder {
    color: #556677;
    font-weight: 400;
  }

  &:hover {
    border-color: rgba(74, 140, 247, 0.35);
    background: rgba(10, 21, 48, 0.7);
  }

  &:focus {
    border-color: rgba(74, 140, 247, 0.65);
    background: rgba(10, 21, 48, 0.85);
    box-shadow:
      0 0 0 4px rgba(74, 140, 247, 0.12),
      0 8px 32px rgba(74, 140, 247, 0.15);

    & + ${SearchIcon} {
      color: #a8ccff;
    }
  }

  @media (max-width: 480px) {
    padding: 16px 48px 16px 48px;
    font-size: 0.92rem;
    border-radius: 14px;
  }
`;

const ClearButton = styled.button`
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #a8b8d8;
  cursor: pointer;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  padding: 0;
  z-index: 1;

  svg {
    width: 16px;
    height: 16px;
    stroke-width: 2.5;
  }

  &:hover {
    background: rgba(239, 68, 68, 0.2);
    border-color: rgba(239, 68, 68, 0.4);
    color: #f87171;
    transform: translateY(-50%) scale(1.1);
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }
`;

const SearchButton = styled.button`
  padding: 18px 32px;
  background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%);
  border: 1px solid rgba(74, 140, 247, 0.5);
  border-radius: 16px;
  color: #fff;
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 800;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow:
    0 4px 20px rgba(37, 99, 235, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);

  svg {
    width: 18px;
    height: 18px;
  }

  &:hover {
    background: linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #60a5fa 100%);
    transform: translateY(-2px);
    border-color: rgba(74, 140, 247, 0.7);
    box-shadow:
      0 8px 32px rgba(37, 99, 235, 0.5),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }

  @media (max-width: 640px) {
    padding: 16px 24px;
    justify-content: center;
    width: 100%;
  }

  @media (max-width: 480px) {
    padding: 14px 20px;
    font-size: 0.88rem;
    border-radius: 14px;
  }
`;

// ─── 💡 SUGESTÕES RÁPIDAS ──────────────────────────────────
const QuickSuggestions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 32px;
  animation: ${fadeInUp} 0.8s ease-out;
  animation-delay: 0.25s;
  animation-fill-mode: both;
  position: relative;
  z-index: 2;
  align-items: center;

  @media (max-width: 480px) {
    margin-bottom: 24px;
    gap: 6px;
  }
`;

const SuggestionsLabel = styled.span`
  font-size: 0.78rem;
  color: #7a8a9e;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-right: 4px;

  @media (max-width: 480px) {
    font-size: 0.7rem;
    width: 100%;
    margin-bottom: 4px;
  }
`;

const SuggestionChip = styled.button`
  padding: 8px 16px;
  background: rgba(74, 140, 247, 0.08);
  border: 1px solid rgba(74, 140, 247, 0.18);
  border-radius: 999px;
  color: #a8ccff;
  font-family: inherit;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    background: rgba(74, 140, 247, 0.18);
    border-color: rgba(74, 140, 247, 0.4);
    color: #fff;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(74, 140, 247, 0.2);
  }

  &:active {
    transform: translateY(0) scale(0.97);
  }

  @media (max-width: 480px) {
    padding: 6px 12px;
    font-size: 0.75rem;
  }
`;

// 🎯 FILTROS DE CATEGORIA
const FilterContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 8px;
  animation: ${fadeInUp} 0.8s ease-out;
  animation-delay: 0.3s;
  animation-fill-mode: both;
  position: relative;
  z-index: 2;

  @media (max-width: 480px) {
    gap: 6px;
    overflow-x: auto;
    flex-wrap: nowrap;
    padding-bottom: 8px;
    margin-bottom: 4px;
    -webkit-overflow-scrolling: touch;

    &::-webkit-scrollbar {
      height: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(74, 140, 247, 0.3);
      border-radius: 2px;
    }
  }
`;

const FilterChip = styled.button`
  padding: 10px 20px;
  background: ${p => p.$active
    ? 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)'
    : 'rgba(255, 255, 255, 0.04)'};
  border: 1px solid ${p => p.$active
    ? 'rgba(74, 140, 247, 0.6)'
    : 'rgba(255, 255, 255, 0.08)'};
  border-radius: 999px;
  color: ${p => p.$active ? '#fff' : '#a8b8d8'};
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s ease;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: ${p => p.$active
    ? '0 6px 20px rgba(37, 99, 235, 0.4)'
    : 'none'};

  &:hover {
    background: ${p => p.$active
      ? 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)'
      : 'rgba(74, 140, 247, 0.12)'};
    border-color: ${p => p.$active
      ? 'rgba(74, 140, 247, 0.8)'
      : 'rgba(74, 140, 247, 0.3)'};
    color: #fff;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0) scale(0.97);
  }

  @media (max-width: 480px) {
    padding: 8px 16px;
    font-size: 0.78rem;
  }
`;

// 📋 RESULTS HEADER
const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 32px;
  padding: 0 8px;
  flex-wrap: wrap;
  gap: 16px;
  animation: ${slideInLeft} 0.6s ease-out;

  @media (max-width: 768px) {
    margin-top: 28px;
    gap: 12px;
    padding: 0;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    margin-top: 22px;
    gap: 10px;
  }
`;

const ResultsTitle = styled.h2`
  color: #fff;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.5px;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin: 0;

  span {
    background: linear-gradient(135deg, #ffffff 0%, #b8d4ff 40%, #4f7cff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  @media (max-width: 768px) { font-size: 1.3rem; }
  @media (max-width: 480px) {
    font-size: 1.1rem;
    gap: 6px;
  }
  @media (max-width: 360px) { font-size: 1rem; }
`;

const ResultsCount = styled.p`
  color: #8899aa;
  font-size: 0.88rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 8px 18px;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  font-weight: 600;
  animation: ${slideInRight} 0.6s ease-out;
  margin: 0;
  white-space: nowrap;

  span {
    color: #7eb8ff;
    font-weight: 800;
  }

  @media (max-width: 480px) {
    font-size: 0.78rem;
    padding: 6px 14px;
  }

  @media (max-width: 360px) {
    font-size: 0.72rem;
    padding: 5px 12px;
  }
`;

// 📦 RESULTS CONTAINER
const ResultsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 24px;
  margin-top: 28px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
    margin-top: 22px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 16px;
    margin-top: 18px;
  }

  @media (max-width: 360px) {
    gap: 14px;
  }
`;

// 🚫 NO RESULTS
const NoResults = styled.div`
  text-align: center;
  padding: 70px 40px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  grid-column: 1 / -1;
  border: 1px solid rgba(255, 255, 255, 0.08);
  animation: ${fadeIn} 0.6s ease-out;

  h3 {
    color: #fff;
    font-size: 1.7rem;
    margin-bottom: 14px;
    font-weight: 700;
  }

  p {
    color: #8899aa;
    max-width: 450px;
    margin: 0 auto 12px;
    font-size: 0.98rem;
    line-height: 1.6;
  }

  @media (max-width: 768px) {
    padding: 60px 28px;
    h3 { font-size: 1.4rem; }
    p { font-size: 0.92rem; }
  }

  @media (max-width: 480px) {
    padding: 48px 20px;
    border-radius: 18px;
    h3 { font-size: 1.2rem; margin-bottom: 12px; }
    p { font-size: 0.85rem; }
  }
`;

const ClearFiltersBtn = styled.button`
  margin-top: 20px;
  padding: 12px 28px;
  background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
  border: 1px solid rgba(74, 140, 247, 0.5);
  border-radius: 12px;
  color: #fff;
  font-family: inherit;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s ease;
  letter-spacing: 0.5px;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  svg { width: 16px; height: 16px; }

  &:hover {
    background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(37, 99, 235, 0.4);
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }
`;

// ─── ÍCONES SVG ────────────────────────────────────────────
const SearchIconSVG = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const Home = ({ user }) => {
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [appliedSearch, setAppliedSearch] = useState('');

  // ─── FILTRO EM TEMPO REAL ──────────────────────────────────
  const filteredResults = useMemo(() => {
    let results = businessData;

    // 1) Filtro por categoria
    if (selectedCategory !== 'Todos') {
      results = results.filter(item => item.category === selectedCategory);
    }

    // 2) Filtro por texto (nome, categoria, descrição ou valor)
    if (appliedSearch.trim()) {
      const term = appliedSearch.toLowerCase().trim();
      const termAsNumber = parseFloat(term.replace(/[^\d.,]/g, '').replace(',', '.'));

      results = results.filter(item => {
        // Busca por nome
        const matchName = item.name.toLowerCase().includes(term);

        // Busca por categoria
        const matchCategory = item.category.toLowerCase().includes(term);

        // Busca por descrição
        const matchDescription = item.description?.toLowerCase().includes(term);

        // ⭐ Busca por valor exato: só mostra negócios cujo minInvestment seja IGUAL ao valor buscado
        // Ex: buscar "200" → só negócios com minInvestment === 200
        const matchValue = !isNaN(termAsNumber)
          ? item.minInvestment === termAsNumber
          : false;

        return matchName || matchCategory || matchDescription || matchValue;
      });
    }

    return results;
  }, [appliedSearch, selectedCategory]);

  const handleSearch = () => {
    setAppliedSearch(searchTerm);
    if (searchTerm.trim()) {
      showToast(`🔍 Buscando por "${searchTerm}"`, 'info', 1500);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setAppliedSearch('');
    setSelectedCategory('Todos');
    showToast('🧹 Busca limpa', 'info', 1500);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSuggestionClick = (term) => {
    setSearchTerm(term);
    setAppliedSearch(term);
  };

  const hasFilters = appliedSearch.trim() !== '' || selectedCategory !== 'Todos';

  // Sugestões rápidas
  const suggestions = ['Estética', 'Edição de vídeo', 'Artesanato', 'Fotografia', '200'];

  return (
    <>
      <Helmet>
        <title>Negócio ao Alcance | Descubra oportunidades de negócio</title>
        <meta name="description" content="Descubra oportunidades de negócio que cabem no seu bolso! Explore serviços, calcule faturamento e encontre o negócio ideal para você." />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="Negócio ao Alcance | Descubra oportunidades" />
        <meta property="og:description" content="Descubra oportunidades de negócio que cabem no seu bolso!" />
        <meta property="og:image" content={`${window.location.origin}/preview.jpg`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content={window.location.origin} />
        <meta property="og:site_name" content="Negócio ao Alcance" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Negócio ao Alcance" />
        <meta name="twitter:description" content="Descubra oportunidades de negócio que cabem no seu bolso!" />
        <meta name="twitter:image" content={`${window.location.origin}/preview.jpg`} />
      </Helmet>

      <BackgroundDecor />
      <Container>
        <Header>
          <Title>Negócio ao Alcance</Title>
          <GradientLine />
          <Subtitle>Descubra oportunidades que cabem no seu bolso!</Subtitle>
        </Header>

        {/* 🔍 BARRA DE BUSCA */}
        <SearchContainer>
          <SearchInputWrapper>
            <SearchIcon>
              <SearchIconSVG />
            </SearchIcon>
            <SearchInput
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Buscar negócio, categoria ou valor..."
              aria-label="Buscar negócios"
            />
            {searchTerm && (
              <ClearButton
                onClick={() => {
                  setSearchTerm('');
                  setAppliedSearch('');
                }}
                title="Limpar busca"
                aria-label="Limpar busca"
              >
                <XIcon />
              </ClearButton>
            )}
          </SearchInputWrapper>

          <SearchButton onClick={handleSearch}>
            <SearchIconSVG />
            BUSCAR
          </SearchButton>
        </SearchContainer>

        {/* 💡 SUGESTÕES RÁPIDAS */}
        <QuickSuggestions>
          <SuggestionsLabel>💡 Tente:</SuggestionsLabel>
          {suggestions.map(s => (
            <SuggestionChip key={s} onClick={() => handleSuggestionClick(s)}>
              {s}
            </SuggestionChip>
          ))}
        </QuickSuggestions>

        {/* 🏷️ FILTROS DE CATEGORIA */}
        <FilterContainer>
          {categories.map(cat => (
            <FilterChip
              key={cat}
              $active={selectedCategory === cat}
              onClick={() => handleCategoryChange(cat)}
            >
              {cat === 'Todos' && '✨ '}
              {cat}
            </FilterChip>
          ))}
        </FilterContainer>

        {/* 📊 RESULTS */}
        <ResultsHeader>
          <ResultsTitle>
            {hasFilters ? (
              <>📊 Resultados da busca</>
            ) : (
              <>✨ Todos os serviços disponíveis</>
            )}
            {selectedCategory !== 'Todos' && (
              <span> • {selectedCategory}</span>
            )}
          </ResultsTitle>
          <ResultsCount>
            <span>{filteredResults.length}</span>{' '}
            {filteredResults.length === 1 ? 'negócio encontrado' : 'negócios encontrados'}
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
                {appliedSearch
                  ? `Não encontramos nada para "${appliedSearch}". Tente outra palavra.`
                  : 'Nenhum negócio nesta categoria.'}
              </p>
              <ClearFiltersBtn onClick={handleClear}>
                <XIcon />
                Limpar filtros
              </ClearFiltersBtn>
            </NoResults>
          )}
        </ResultsContainer>
      </Container>
    </>
  );
};

export default Home;