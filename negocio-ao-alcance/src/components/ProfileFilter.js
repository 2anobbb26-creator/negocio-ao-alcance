import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
`;

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

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${fadeIn} 0.3s ease-out;
`;

const Modal = styled.div`
  background: linear-gradient(145deg, #1a1a3e, #0a0e27);
  border: 1px solid rgba(102, 126, 234, 0.15);
  border-radius: 20px;
  padding: 32px;
  max-width: 700px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: ${slideDown} 0.3s ease-out;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(102, 126, 234, 0.3);
    border-radius: 10px;
  }

  @media (max-width: 480px) {
    padding: 24px;
    width: 95%;
    max-height: 85vh;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 20px;
  background: none;
  border: none;
  color: #8899aa;
  font-size: 1.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.05);
    transform: rotate(90deg);
  }
`;

const FilterButton = styled.button`
  padding: 10px 20px;
  background: rgba(102, 126, 234, 0.12);
  border: 1px solid rgba(102, 126, 234, 0.15);
  border-radius: 12px;
  color: #b8c6db;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: rgba(102, 126, 234, 0.2);
    border-color: rgba(102, 126, 234, 0.3);
    color: #fff;
    transform: translateY(-2px);
  }

  .badge {
    background: #667eea;
    color: #fff;
    font-size: 0.6rem;
    padding: 2px 8px;
    border-radius: 10px;
    font-weight: 600;
  }
`;

const Title = styled.h3`
  color: #fff;
  font-size: 1.2rem;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding-right: 40px;

  span {
    font-size: 1.4rem;
  }
`;

const Question = styled.div`
  margin-bottom: 18px;
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
  margin-top: 20px;
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
  flex: 1;

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
  const [isOpen, setIsOpen] = useState(false);
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

  // ✅ FUNÇÃO CORRIGIDA - CHAMA onApply APENAS SE FOR UMA FUNÇÃO
  const handleApply = () => {
    console.log('🔘 handleApply chamado');
    console.log('📌 time:', time);
    console.log('📌 workType:', workType);
    console.log('📌 onApply é função?', typeof onApply === 'function');
    
    if (!time || !workType) {
      alert('Por favor, selecione ambas as opções!');
      return;
    }
    
    // ✅ VERIFICA SE onApply É UMA FUNÇÃO ANTES DE CHAMAR
    if (typeof onApply === 'function') {
      onApply({ time, workType });
      setIsOpen(false);
    } else {
      console.error('❌ ERRO: onApply NÃO é uma função!');
      console.error('📌 Valor de onApply:', onApply);
      alert('Erro interno: função de filtro não encontrada. Por favor, recarregue a página.');
    }
  };

  const handleClear = () => {
    setTime('');
    setWorkType('');
    if (typeof onClear === 'function') {
      onClear();
      setIsOpen(false);
    } else {
      console.error('❌ ERRO: onClear NÃO é uma função!');
    }
  };

  const isSelected = time && workType;
  const hasActiveFilter = selectedFilters?.time || selectedFilters?.workType;

  const getLabelText = (label) => {
    return label.replace(/^.{1,3}\s/, '');
  };

  // 🔍 LOG PARA DIAGNÓSTICO
  console.log('🔍 ProfileFilter renderizado');
  console.log('📌 onApply:', onApply);
  console.log('📌 onClear:', onClear);
  console.log('📌 selectedFilters:', selectedFilters);

  return (
    <>
      <FilterButton onClick={() => setIsOpen(true)}>
        🎯 Filtros
        {hasActiveFilter && <span className="badge">Ativo</span>}
      </FilterButton>

      {isOpen && (
        <Overlay onClick={() => setIsOpen(false)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={() => setIsOpen(false)}>✕</CloseButton>

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
                ✕ Limpar
              </ClearButton>
            </ButtonGroup>
          </Modal>
        </Overlay>
      )}
    </>
  );
};

export default ProfileFilter;