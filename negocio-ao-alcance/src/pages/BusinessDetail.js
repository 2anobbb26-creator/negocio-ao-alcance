import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { businessData } from '../data/businessData';
import ShareButton from '../components/ShareButton';

// 🎨 ANIMAÇÕES
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

// 🎨 CONTAINER PRINCIPAL
const Container = styled.div`
  max-width: 1000px;
  margin: 30px auto;
  padding: 20px;
  animation: ${fadeInUp} 0.6s ease-out;
`;

// 🔙 BOTÃO VOLTAR
const BackButton = styled.button`
  background: linear-gradient(135deg, #0d1b3e 0%, #142952 50%, #1e3a8a 100%);
  border: 1px solid rgba(74, 140, 247, 0.3);
  color: #ffffff;
  padding: 12px 28px;
  border-radius: 12px;
  cursor: pointer;
  font-family: 'Poppins', 'Inter', sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  letter-spacing: 0.8px;
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(74, 140, 247, 0.15);

  &:hover {
    background: linear-gradient(135deg, #142952 0%, #1e3a8a 50%, #2563eb 100%);
    transform: translateX(-4px);
    border-color: rgba(74, 140, 247, 0.5);
    box-shadow: 
      0 8px 24px rgba(30, 58, 138, 0.4),
      inset 0 1px 0 rgba(74, 140, 247, 0.25);
  }

  &:active {
    transform: translateX(-2px) scale(0.98);
  }
`;

// 🔵 CARD PRINCIPAL
const Card = styled.div`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border-radius: 28px;
  padding: 48px;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.06);

  @media (max-width: 480px) {
    padding: 28px;
    border-radius: 22px;
  }
`;

// 🎯 HEADER DO CARD
const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 28px;
  padding-bottom: 28px;
  border-bottom: 1px solid rgba(74, 140, 247, 0.15);

  @media (max-width: 768px) {
    flex-wrap: wrap;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }
`;

const EmojiWrapper = styled.div`
  font-size: 4rem;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(74, 140, 247, 0.08);
  border-radius: 24px;
  border: 1px solid rgba(74, 140, 247, 0.15);
  flex-shrink: 0;

  @media (max-width: 480px) {
    width: 80px;
    height: 80px;
    font-size: 3rem;
  }
`;

const HeaderContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const ShareButtonWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const Name = styled.h1`
  font-size: 2.4rem;
  margin: 0 0 12px 0;
  font-weight: 800;
  letter-spacing: -0.5px;
  line-height: 1.2;
  background: linear-gradient(135deg, 
    #ffffff 0%, 
    #d0e0ff 30%, 
    #7eb8ff 60%, 
    #4a8cf7 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 1.9rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const Category = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 18px;
  background: rgba(74, 140, 247, 0.12);
  border-radius: 24px;
  font-size: 0.75rem;
  color: #c8d8f0;
  font-weight: 700;
  border: 1px solid rgba(74, 140, 247, 0.2);
  text-transform: uppercase;
  letter-spacing: 1px;
`;

// 📄 DESCRIÇÃO
const Description = styled.p`
  color: #d8e4f5;
  font-size: 1.05rem;
  line-height: 1.8;
  margin: 0 0 32px 0;
  padding: 24px;
  background: rgba(74, 140, 247, 0.06);
  border-radius: 16px;
  border-left: 4px solid #4a8cf7;
  font-weight: 500;

  @media (max-width: 480px) {
    font-size: 0.95rem;
    padding: 18px;
  }
`;

// 📊 GRID DE INFORMAÇÕES
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin: 0 0 32px 0;
`;

const InfoCard = styled.div`
  background: rgba(74, 140, 247, 0.06);
  border-radius: 16px;
  padding: 24px 20px;
  border: 1px solid rgba(74, 140, 247, 0.12);
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(74, 140, 247, 0.1);
    border-color: rgba(74, 140, 247, 0.2);
    transform: translateY(-3px);
  }

  @media (max-width: 480px) {
    padding: 18px 16px;
  }
`;

const InfoLabel = styled.div`
  color: #a8b8d8;
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const InfoValue = styled.div`
  color: #e8eef7;
  font-size: 1.15rem;
  font-weight: 800;
  letter-spacing: -0.3px;

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

// 🧮 CALCULADORA DE FATURAMENTO
const CalculatorSection = styled.div`
  background: rgba(74, 140, 247, 0.06);
  border-radius: 20px;
  padding: 28px;
  border: 1px solid rgba(74, 140, 247, 0.15);
  margin: 0 0 32px 0;

  @media (max-width: 480px) {
    padding: 20px;
  }
`;

const CalculatorTitle = styled.h3`
  color: #e8eef7;
  font-size: 1.15rem;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 800;
  letter-spacing: 0.3px;

  span {
    font-size: 1.4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: rgba(74, 140, 247, 0.1);
    border-radius: 12px;
    border: 1px solid rgba(74, 140, 247, 0.15);
  }
`;

const CalculatorSubtitle = styled.p`
  color: #a8b8d8;
  font-size: 0.85rem;
  margin-bottom: 24px;
  line-height: 1.6;
`;

const CalculatorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const CalculatorField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CalculatorLabel = styled.label`
  color: #a8b8d8;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  font-weight: 700;
`;

const CalculatorInput = styled.input`
  padding: 14px 16px;
  background: rgba(10, 21, 48, 0.6);
  border: 1.5px solid rgba(74, 140, 247, 0.2);
  border-radius: 12px;
  color: #e8eef7;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: rgba(74, 140, 247, 0.5);
    box-shadow: 0 0 0 4px rgba(74, 140, 247, 0.1);
    background: rgba(10, 21, 48, 0.8);
  }

  &::placeholder {
    color: #556677;
    font-weight: 400;
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  -moz-appearance: textfield;
`;

const CalculatorResult = styled.div`
  background: rgba(74, 222, 128, 0.08);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(74, 222, 128, 0.25);
  text-align: center;
`;

const ResultLabel = styled.div`
  color: #a8b8d8;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const ResultValue = styled.div`
  color: #86efac;
  font-size: 2.2rem;
  font-weight: 900;
  letter-spacing: -0.5px;

  @media (max-width: 480px) {
    font-size: 1.7rem;
  }
`;

const ResultDetails = styled.div`
  color: #a8b8d8;
  font-size: 0.85rem;
  margin-top: 12px;
  line-height: 1.6;
  font-weight: 500;

  strong {
    color: #e8eef7;
    font-weight: 700;
  }
`;

const ResultGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(74, 222, 128, 0.15);

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const ResultItem = styled.div`
  text-align: center;
`;

const ResultItemLabel = styled.div`
  color: #a8b8d8;
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 700;
  margin-bottom: 4px;
`;

const ResultItemValue = styled.div`
  color: #e8eef7;
  font-size: 1.1rem;
  font-weight: 800;
`;

// 📋 SEÇÕES
const Section = styled.div`
  margin: 32px 0;
`;

const SectionTitle = styled.h3`
  color: #e8eef7;
  font-size: 1.15rem;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 800;
  letter-spacing: 0.3px;

  span {
    font-size: 1.4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: rgba(74, 140, 247, 0.1);
    border-radius: 12px;
    border: 1px solid rgba(74, 140, 247, 0.15);
  }

  @media (max-width: 480px) {
    font-size: 1rem;

    span {
      width: 36px;
      height: 36px;
      font-size: 1.2rem;
    }
  }
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 10px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const ListItem = styled.li`
  padding: 14px 18px 14px 42px;
  position: relative;
  color: #d8e4f5;
  font-weight: 500;
  background: rgba(74, 140, 247, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(74, 140, 247, 0.1);
  transition: all 0.3s ease;
  font-size: 0.95rem;

  &:before {
    content: "▸";
    color: #7eb8ff;
    font-weight: 900;
    position: absolute;
    left: 18px;
    font-size: 1rem;
  }

  &:hover {
    background: rgba(74, 140, 247, 0.1);
    border-color: rgba(74, 140, 247, 0.2);
    color: #e8eef7;
    transform: translateX(4px);
  }

  @media (max-width: 480px) {
    padding: 12px 16px 12px 38px;
    font-size: 0.9rem;
  }
`;

// 💰 PREÇO
const PriceTag = styled.div`
  background: rgba(74, 222, 128, 0.08);
  padding: 16px 28px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-weight: 800;
  color: #86efac;
  border: 1px solid rgba(74, 222, 128, 0.2);
  font-size: 1.1rem;
  margin: 4px 0;

  &::before {
    content: '💰';
    font-size: 1.4rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    padding: 14px 22px;
  }
`;

// 🚫 NÃO ENCONTRADO
const NotFound = styled.div`
  text-align: center;
  padding: 80px 40px;
  color: #d8e4f5;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.06);

  h2 {
    color: #e8eef7;
    font-size: 2rem;
    margin-bottom: 12px;
    font-weight: 800;
  }

  p {
    color: #a8b8d8;
    margin-bottom: 24px;
  }
`;

const BusinessDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const business = businessData.find(b => b.id === parseInt(id));

  // 🧮 ESTADOS DA CALCULADORA
  const [precoServico, setPrecoServico] = useState('');
  const [clientesDia, setClientesDia] = useState('');
  const [diasMes, setDiasMes] = useState('22');

  if (!business) {
    return (
      <Container>
        <NotFound>
          <h2>😕 Serviço não encontrado</h2>
          <p>O serviço que você procura não existe ou foi removido.</p>
          <BackButton onClick={() => navigate('/')}>
            ← Voltar para a página inicial
          </BackButton>
        </NotFound>
      </Container>
    );
  }

  const formatInvestment = (min, max) => {
    if (min === max) return `R$ ${min.toLocaleString('pt-BR')}`;
    return `R$ ${min.toLocaleString('pt-BR')} - R$ ${max.toLocaleString('pt-BR')}`;
  };

  // 🧮 FUNÇÃO DE CÁLCULO
  const calcularFaturamento = () => {
    const preco = parseFloat(precoServico.replace(',', '.')) || 0;
    const clientes = parseInt(clientesDia) || 0;
    const dias = parseInt(diasMes) || 0;

    const faturamento = preco * clientes * dias;

    // Calcular margem média
    let margem = 0;
    if (business.profitMargin) {
      const margemStr = business.profitMargin.replace('%', '').split('-');
      const min = parseFloat(margemStr[0]) || 0;
      const max = margemStr[1] ? parseFloat(margemStr[1]) : min;
      margem = (min + max) / 2 / 100;
    }

    const lucro = faturamento * margem;

    return { faturamento, lucro, margem: margem * 100 };
  };

  const resultado = calcularFaturamento();
  const mostrarResultado = precoServico && clientesDia && diasMes;

  const formatCurrency = (value) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <Container>
      <BackButton onClick={() => navigate('/')}>
        ← Voltar para os serviços
      </BackButton>

      <Card>
        <Header>
          <EmojiWrapper>{business.image}</EmojiWrapper>
          <HeaderContent>
            <Name>{business.name}</Name>
            <Category>📂 {business.category}</Category>
          </HeaderContent>
          <ShareButtonWrapper>
            <ShareButton business={business} variant="large" />
          </ShareButtonWrapper>
        </Header>

        <Description>{business.description}</Description>

        <Grid>
          <InfoCard>
            <InfoLabel>💰 Investimento</InfoLabel>
            <InfoValue>{formatInvestment(business.minInvestment, business.maxInvestment)}</InfoValue>
          </InfoCard>
          <InfoCard>
            <InfoLabel>💲 Margem</InfoLabel>
            <InfoValue>{business.profitMargin}</InfoValue>
          </InfoCard>
          <InfoCard>
            <InfoLabel>⏱️ Retorno</InfoLabel>
            <InfoValue>{business.payback}</InfoValue>
          </InfoCard>
        </Grid>

        {/* 🧮 CALCULADORA DE FATURAMENTO */}
        <CalculatorSection>
          <CalculatorTitle>
            <span>🧮</span>
            Calculadora de Faturamento
          </CalculatorTitle>
          <CalculatorSubtitle>
            Descubra quanto você pode faturar com este negócio! Preencha os campos abaixo:
          </CalculatorSubtitle>

          <CalculatorGrid>
            <CalculatorField>
              <CalculatorLabel>💵 Preço por serviço (R$)</CalculatorLabel>
              <CalculatorInput
                type="text"
                placeholder="Ex: 40"
                value={precoServico}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9,.]/g, '');
                  setPrecoServico(value);
                }}
              />
            </CalculatorField>

            <CalculatorField>
              <CalculatorLabel>👥 Clientes por dia</CalculatorLabel>
              <CalculatorInput
                type="number"
                placeholder="Ex: 5"
                value={clientesDia}
                onChange={(e) => setClientesDia(e.target.value)}
                min="0"
              />
            </CalculatorField>

            <CalculatorField>
              <CalculatorLabel>📅 Dias por mês</CalculatorLabel>
              <CalculatorInput
                type="number"
                placeholder="Ex: 22"
                value={diasMes}
                onChange={(e) => setDiasMes(e.target.value)}
                min="0"
                max="31"
              />
            </CalculatorField>
          </CalculatorGrid>

          {mostrarResultado && (
            <CalculatorResult>
              <ResultLabel>💰 Faturamento Mensal Estimado</ResultLabel>
              <ResultValue>{formatCurrency(resultado.faturamento)}</ResultValue>
              
              <ResultDetails>
                Baseado em <strong>{clientesDia} clientes/dia</strong> × <strong>{diasMes} dias</strong> × <strong>{formatCurrency(parseFloat(precoServico.replace(',', '.')) || 0)}</strong>
              </ResultDetails>

              <ResultGrid>
                <ResultItem>
                  <ResultItemLabel>💵 Lucro Estimado</ResultItemLabel>
                  <ResultItemValue style={{ color: '#86efac' }}>
                    {formatCurrency(resultado.lucro)}
                  </ResultItemValue>
                </ResultItem>
                <ResultItem>
                  <ResultItemLabel>📊 Margem Média</ResultItemLabel>
                  <ResultItemValue>{resultado.margem.toFixed(0)}%</ResultItemValue>
                </ResultItem>
              </ResultGrid>
            </CalculatorResult>
          )}
        </CalculatorSection>

        <Section>
          <SectionTitle>
            <span>📦</span>
            Materiais Necessários
          </SectionTitle>
          <List>
            {business.materials.map((material, index) => (
              <ListItem key={index}>{material}</ListItem>
            ))}
          </List>
        </Section>

        <Section>
          <SectionTitle>
            <span>💲</span>
            Preço Sugerido
          </SectionTitle>
          <PriceTag>{business.suggestedPrice}</PriceTag>
        </Section>

        <Section>
          <SectionTitle>
            <span>👥</span>
            Potenciais Clientes
          </SectionTitle>
          <List>
            {business.potentialClients.map((client, index) => (
              <ListItem key={index}>{client}</ListItem>
            ))}
          </List>
        </Section>
      </Card>
    </Container>
  );
};

export default BusinessDetail;