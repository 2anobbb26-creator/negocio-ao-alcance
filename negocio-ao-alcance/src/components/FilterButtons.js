import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

const slideDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const Container = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  backdrop-filter: blur(10px);
  animation: ${slideDown} 0.4s ease-out;
`;

const Title = styled.h3`
  color: #fff;
  font-size: 1.1rem;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 10px;

  span {
    font-size: 1.3rem;
  }
`;

const Question = styled.div`
  margin-bottom: 16px;
`;

const QuestionLabel = styled.p`
  color: #b8c6db;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 10px;
`;

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 10px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
`;

const OptionButton = styled.button`
  padding: 10px 16px;
  background: ${props => props.$selected ? 'rgba(102, 126, 234, 0.2)' : 'rgba(255, 255, 255, 0.04)'};
  border: 2px solid ${props => props.$selected ? 'rgba(102, 126, 234, 0.4)' : 'rgba(255, 255, 255, 0.06)'};
  border-radius: 10px;
  color: ${props => props.$selected ? '#fff' : '#b8c6db'};
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: ${props => props.$selected ? '600' : '400'};

  &:hover {
    background: rgba(102, 126, 234, 0.1);
    border-color: rgba(102, 126, 234, 0.2);
    transform: translateY(-2px);
  }

  &:active {
    transform: scale(0.97);
  }

  .icon {
    font-size: 1.2rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 16px;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const ApplyButton = styled.button`
  padding: 12px 32px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  border-radius: 10px;
  color: #fff;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(102, 126, 234, 0.3);
  }

  &:active {
    transform: scale(0.97);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }
`;

const ClearButton = styled.button`
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  color: #b8c6db;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
  }
`;

const ResultBadge = styled.div`
  display: inline-block;
  padding: 4px 14px;
  background: rgba(102, 126, 234, 0.12);
  border-radius: 20px;
  font-size: 0.75rem;
  color: #667eea;
  border: 1px solid rgba(102, 126, 234, 0.1);
  margin-top: 8px;
`;

const ProfileFilter = ({ onApply, onClear, selectedFilters }) => {
  const [time, setTime] = useState(selectedFilters?.time || '');
  const [workType, setWorkType] = useState(selectedFilters?.workType || '');

  const timeOptions = [
    { value: 'pouco', label: '⏱️ Pouco tempo (até 2h/dia)' },
    { value: 'medio', label: '📅 Tempo médio (2-6h/dia)' },
    { value: 'integral', label: '💼 Tempo integral (8h+/dia)' },
    { value: 'flexivel', label: '🔄 Horário flexível' },
  ];

  const workOptions = [
    { value: 'internet', label: '💻 Trabalhar pela internet' },
    { value: 'casa', label: '🏠 Trabalhar em casa' },
    { value: 'rua', label: '🚗 Trabalhar na rua' },
    { value: 'servicos', label: '🛠️ Trabalhar com serviços' },
    { value: 'produtos', label: '🛍️ Vender produtos' },
  ];

  const handleApply = () => {
    if (!time || !workType) {
      alert('Por favor, selecione ambas as opções!');
      return;
    }
    onApply({ time, workType });
  };

  const handleClear = () => {
    setTime('');
    setWorkType('');
    onClear();
  };

  const isSelected = time && workType;

  // Função para extrair apenas o texto (sem emoji)
  const getLabelText = (label) => {
    return label.replace(/^.{1,3}\s/, '');
  };

  return (
    <Container>
      <Title>
        <span>🎯</span> Encontre o negócio ideal para você
      </Title>

      <Question>
        <QuestionLabel>⏰ Quanto tempo você pode dedicar?</QuestionLabel>
        <OptionsGrid>
          {timeOptions.map(opt => (
            <OptionButton
              key={opt.value}
              $selected={time === opt.value}
              onClick={() => setTime(opt.value)}
            >
              <span className="icon">{opt.label.split(' ')[0]}</span>
              {getLabelText(opt.label)}
            </OptionButton>
          ))}
        </OptionsGrid>
      </Question>

      <Question>
        <QuestionLabel>💼 O que você prefere?</QuestionLabel>
        <OptionsGrid>
          {workOptions.map(opt => (
            <OptionButton
              key={opt.value}
              $selected={workType === opt.value}
              onClick={() => setWorkType(opt.value)}
            >
              <span className="icon">{opt.label.split(' ')[0]}</span>
              {getLabelText(opt.label)}
            </OptionButton>
          ))}
        </OptionsGrid>
      </Question>

      {isSelected && (
        <ResultBadge>
          ✅ Perfil: {timeOptions.find(t => t.value === time)?.label.split(' ')[1]} • {workOptions.find(w => w.value === workType)?.label.split(' ')[1]}
        </ResultBadge>
      )}

      <ButtonGroup>
        <ApplyButton onClick={handleApply} disabled={!isSelected}>
          🎯 Filtrar negócios
        </ApplyButton>
        <ClearButton onClick={handleClear}>
          ✕ Limpar filtros
        </ClearButton>
      </ButtonGroup>
    </Container>
  );
};

export default ProfileFilter;