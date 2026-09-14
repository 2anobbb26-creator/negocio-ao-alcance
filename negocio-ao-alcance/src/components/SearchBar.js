import React from 'react';
import styled from 'styled-components';

const SearchContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  flex-wrap: wrap;
  justify-content: center;

  @media (max-width: 768px) {
    gap: 10px;
    margin-bottom: 20px;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const InputGroup = styled.div`
  display: flex;
  gap: 10px;
  flex: 1;
  min-width: 300px;

  @media (max-width: 768px) {
    min-width: 200px;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    min-width: 100%;
  }
`;

const Input = styled.input`
  flex: 1;
  padding: 15px 20px;
  border: 2px solid rgba(102, 126, 234, 0.3);
  border-radius: 10px;
  font-size: 1.1rem;
  transition: all 0.3s;
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  backdrop-filter: blur(10px);

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
    background: rgba(255, 255, 255, 0.08);
  }

  &::placeholder {
    color: #8899aa;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    padding: 12px 16px;
  }
`;

const Button = styled.button`
  padding: 15px 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 480px) {
    padding: 12px 20px;
    font-size: 1rem;
    width: 100%;
  }
`;

const ClearButton = styled(Button)`
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);

  &:hover {
    box-shadow: 0 5px 20px rgba(239, 68, 68, 0.4);
  }
`;

const SearchBar = ({ budget, onBudgetChange, onSearch, onClear, hasSearched, placeholder }) => {
  return (
    <SearchContainer>
      <InputGroup>
        <Input
          type="text"
          placeholder={placeholder || "Digite o valor mínimo (ex: 500)"}
          value={budget}
          onChange={onBudgetChange}
          onKeyPress={(e) => e.key === 'Enter' && onSearch()}
        />
        <Button onClick={onSearch}>🔍 Buscar</Button>
      </InputGroup>
      {hasSearched && <ClearButton onClick={onClear}>✕ Limpar</ClearButton>}
    </SearchContainer>
  );
};

export default SearchBar;