import React from 'react';
import styled, { keyframes } from 'styled-components';

const glow = keyframes`
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 28px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 340px;
  max-width: 900px;
  background: rgba(10, 21, 48, 0.6);
  border: 1.5px solid rgba(74, 140, 247, 0.2);
  border-radius: 14px;
  padding: 4px;
  backdrop-filter: blur(20px);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
  transition: all 0.3s ease;

  &:focus-within {
    border-color: rgba(74, 140, 247, 0.5);
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.3),
      0 0 0 4px rgba(74, 140, 247, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.06);
  }

  @media (max-width: 768px) {
    min-width: 200px;
  }

  @media (max-width: 480px) {
    min-width: 100%;
    width: 100%;
  }
`;

const InputIcon = styled.span`
  position: absolute;
  left: 22px;
  font-size: 1.1rem;
  color: #4a8cf7;
  pointer-events: none;
  animation: ${glow} 2s ease-in-out infinite;
`;

const Input = styled.input`
  flex: 1;
  padding: 16px 20px 16px 56px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  background: transparent;
  color: #fff;
  width: 100%;
  font-weight: 500;
  letter-spacing: 0.2px;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #6b7fa8;
    font-weight: 400;
    letter-spacing: 0.3px;
  }

  @media (max-width: 480px) {
    font-size: 0.95rem;
    padding: 14px 16px 14px 50px;
  }
`;

const Button = styled.button`
  padding: 14px 32px;
  background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #2563eb 100%);
  color: white;
  border: 1px solid rgba(74, 140, 247, 0.3);
  border-radius: 14px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  letter-spacing: 0.8px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 16px rgba(30, 58, 138, 0.4);
  text-transform: uppercase;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(37, 99, 235, 0.5);
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }

  @media (max-width: 480px) {
    width: 100%;
    justify-content: center;
  }
`;

const ClearButton = styled.button`
  padding: 14px 28px;
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.25);
  border-radius: 14px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  text-transform: uppercase;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(239, 68, 68, 0.25);
    border-color: rgba(239, 68, 68, 0.4);
    color: #fca5a5;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }

  @media (max-width: 480px) {
    padding: 12px 20px;
    font-size: 0.85rem;
    width: 100%;
  }
`;

const SearchBar = ({ budget, onBudgetChange, onSearch, onClear, hasSearched, placeholder }) => {
  return (
    <SearchContainer>
      <InputWrapper>
        <InputIcon>🔍</InputIcon>
        <Input
          type="text"
          placeholder={placeholder || "Digite o valor mínimo (ex: 100) - serviços a partir deste valor"}
          value={budget}
          onChange={onBudgetChange}
          onKeyPress={(e) => e.key === 'Enter' && onSearch()}
        />
      </InputWrapper>
      <Button onClick={onSearch}>🎯 BUSCAR</Button>
      {hasSearched && (
        <ClearButton onClick={onClear}>✕ LIMPAR</ClearButton>
      )}
    </SearchContainer>
  );
};

export default SearchBar;