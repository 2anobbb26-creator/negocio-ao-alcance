import React from 'react';
import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(74, 140, 247, 0.4); }
  70% { box-shadow: 0 0 0 8px rgba(74, 140, 247, 0); }
  100% { box-shadow: 0 0 0 0 rgba(74, 140, 247, 0); }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 28px;
  padding: 8px;

  @media (max-width: 480px) {
    gap: 6px;
  }
`;

const FilterButton = styled.button`
  padding: 11px 24px;
  border: 1.5px solid ${props => props.$active 
    ? 'rgba(74, 140, 247, 0.6)' 
    : 'rgba(74, 140, 247, 0.15)'};
  border-radius: 24px;
  background: ${props => props.$active 
    ? 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #4a8cf7 100%)' 
    : 'rgba(10, 21, 48, 0.5)'};
  color: ${props => props.$active ? '#fff' : '#a8b8d8'};
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  font-weight: ${props => props.$active ? '700' : '500'};
  backdrop-filter: blur(20px);
  font-size: 0.88rem;
  position: relative;
  overflow: hidden;
  letter-spacing: 0.4px;
  box-shadow: ${props => props.$active 
    ? '0 8px 24px rgba(37, 99, 235, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 0 20px rgba(74, 140, 247, 0.2)' 
    : '0 4px 12px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.03)'};
  animation: ${props => props.$active ? pulse : 'none'} 2s ease-in-out infinite;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
    transition: left 0.6s ease;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: ${props => props.$active 
      ? 'linear-gradient(90deg, transparent, rgba(147, 197, 253, 0.8), transparent)' 
      : 'transparent'};
  }

  &:hover {
    border-color: rgba(74, 140, 247, 0.5);
    transform: translateY(-3px);
    color: #fff;
    background: ${props => props.$active 
      ? 'linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #3b82f6 100%)' 
      : 'rgba(37, 99, 235, 0.15)'};
    box-shadow: 
      0 12px 28px rgba(37, 99, 235, 0.35),
      inset 0 1px 0 rgba(255, 255, 255, 0.15),
      0 0 30px rgba(74, 140, 247, 0.25);

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(-1px) scale(0.97);
  }

  @media (max-width: 768px) {
    padding: 9px 18px;
    font-size: 0.82rem;
  }

  @media (max-width: 480px) {
    padding: 8px 14px;
    font-size: 0.75rem;
    border-radius: 18px;
  }
`;

const FilterButtons = ({ categories, selectedCategory, onCategoryChange }) => {
  return (
    <FilterContainer>
      {categories.map(category => (
        <FilterButton
          key={category}
          $active={selectedCategory === category}
          onClick={() => onCategoryChange(category)}
        >
          {category}
        </FilterButton>
      ))}
    </FilterContainer>
  );
};

export default FilterButtons;