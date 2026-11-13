import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import styled, { keyframes } from 'styled-components';
import { businessData } from '../data/businessData';
import { useToast } from '../components/Toast';

// ─── ANIMAÇÕES ─────────────────────────────────────────────
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.05); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50%      { transform: translateY(-12px); }
`;

// ─── LAYOUT PRINCIPAL ──────────────────────────────────────
const Page = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 20px 80px;
  position: relative;
`;

const BackgroundDecor = styled.div`
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -15%; right: -10%;
    width: 520px; height: 520px;
    background: radial-gradient(circle, rgba(74, 140, 247, 0.1), transparent 70%);
    border-radius: 50%;
    animation: ${float} 14s ease-in-out infinite;
  }
`;

const Hero = styled.header`
  position: relative;
  padding: 40px 32px;
  margin-bottom: 28px;
  border-radius: 26px;
  overflow: hidden;
  text-align: center;
  animation: ${fadeInUp} 0.6s ease-out;

  background:
    radial-gradient(ellipse at 0% 0%, rgba(74, 140, 247, 0.14), transparent 55%),
    radial-gradient(ellipse at 100% 100%, rgba(168, 85, 247, 0.1), transparent 55%),
    linear-gradient(160deg, rgba(255, 255, 255, 0.045) 0%, rgba(255, 255, 255, 0.015) 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, #4f7cff, #7eb8ff, #a855f7, #ec4899);
  }
`;

const HeroIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 10px;
  animation: ${pulse} 3s ease-in-out infinite;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 800;
  margin: 0 0 8px;
  background: linear-gradient(135deg, #ffffff 0%, #d0e0ff 40%, #7eb8ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  color: #a8b8d8;
  font-size: 0.95rem;
  margin: 0 auto;
  max-width: 500px;
`;

// ─── ABAS (TABS) ───────────────────────────────────────────
const TabsContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  overflow-x: auto;
  padding-bottom: 6px;
  
  &::-webkit-scrollbar { height: 4px; }
  &::-webkit-scrollbar-thumb { background: rgba(74, 140, 247, 0.3); border-radius: 4px; }
`;

const Tab = styled.button`
  padding: 12px 18px;
  border-radius: 12px;
  border: 1px solid ${p => p.$active ? 'rgba(74, 140, 247, 0.6)' : 'rgba(255, 255, 255, 0.05)'};
  background: ${p => p.$active ? 'rgba(74, 140, 247, 0.15)' : 'rgba(255, 255, 255, 0.02)'};
  color: ${p => p.$active ? '#fff' : '#8899aa'};
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;

  &:hover { background: rgba(74, 140, 247, 0.1); }
`;

// ─── CONTAINER DA FERRAMENTA ───────────────────────────────
const ToolBox = styled.section`
  padding: 28px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  animation: ${fadeInUp} 0.4s ease-out;

  @media (max-width: 480px) { padding: 20px; }
`;

const ToolTitle = styled.h2`
  font-size: 1.2rem;
  color: #eef4ff;
  margin: 0 0 8px;
  font-weight: 800;
`;

const ToolDesc = styled.p`
  color: #8899aa;
  font-size: 0.85rem;
  margin: 0 0 20px;
`;

// ─── INPUTS E BOTÕES ───────────────────────────────────────
const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
`;

const Label = styled.label`
  font-size: 0.75rem;
  color: #a8b8d8;
  font-weight: 700;
  text-transform: uppercase;
`;

const Input = styled.input`
  width: 100%;
  padding: 13px 16px;
  background: rgba(10, 21, 48, 0.6);
  border: 1.5px solid rgba(74, 140, 247, 0.2);
  border-radius: 12px;
  color: #e8eef7;
  font-family: inherit;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.25s;

  &:focus { border-color: rgba(74, 140, 247, 0.55); }
`;

const Select = styled.select`
  width: 100%;
  padding: 13px 16px;
  background: rgba(10, 21, 48, 0.6);
  border: 1.5px solid rgba(74, 140, 247, 0.2);
  border-radius: 12px;
  color: #e8eef7;
  font-family: inherit;
  font-size: 0.95rem;
  outline: none;
  cursor: pointer;

  &:focus { border-color: rgba(74, 140, 247, 0.55); }
  option { background: #0d1b3e; color: #fff; }
`;

const Btn = styled.button`
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #2563eb, #4f7cff);
  color: #fff;
  font-family: inherit;
  font-weight: 800;
  font-size: 0.95rem;
  cursor: pointer;
  margin-top: 10px;
  transition: transform 0.2s;

  &:active { transform: scale(0.98); }
`;

const ResultCard = styled.div`
  margin-top: 20px;
  padding: 24px;
  background: rgba(74, 222, 128, 0.08);
  border: 1px solid rgba(74, 222, 128, 0.3);
  border-radius: 14px;
  color: #fff;
  animation: ${fadeInUp} 0.4s ease-out;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ResultRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  padding-bottom: 8px;
  border-bottom: 1px dashed rgba(255,255,255,0.1);

  &:last-child { border: none; font-size: 1.2rem; font-weight: 900; color: #86efac; padding-top: 8px; }
  
  span:first-child { color: #a8b8d8; }
  span:last-child { font-weight: 800; }
`;

// ─── QUIZ MELHORADO ────────────────────────────────────────
const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: rgba(255,255,255,0.1);
  border-radius: 999px;
  margin-bottom: 24px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${p => p.$percent}%;
  background: linear-gradient(90deg, #4f7cff, #a855f7);
  border-radius: 999px;
  transition: width 0.4s ease;
`;

const QuestionText = styled.h3`
  color: #eef4ff;
  font-size: 1.1rem;
  margin: 0 0 20px;
  line-height: 1.4;
`;

const QuizOption = styled.button`
  width: 100%;
  padding: 16px;
  margin-bottom: 10px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #e8eef7;
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 12px;

  &:hover {
    background: rgba(74, 140, 247, 0.1);
    border-color: rgba(74, 140, 247, 0.4);
    transform: translateX(4px);
  }

  .emoji { font-size: 1.4rem; }
`;

const SuggestionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 14px;
  margin-top: 20px;

  @media (max-width: 560px) { grid-template-columns: 1fr; }
`;

const MiniCard = styled.div`
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 14px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(74, 140, 247, 0.08);
    border-color: rgba(74, 140, 247, 0.3);
    transform: translateY(-4px);
  }

  .emoji { font-size: 2rem; }
  .name { color: #fff; font-weight: 800; font-size: 0.95rem; line-height: 1.3; }
  .desc { color: #8899aa; font-size: 0.78rem; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
`;

// ─── CALENDÁRIO ────────────────────────────────────────────
const CalendarList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
`;

const CalendarDay = styled.div`
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  padding: 16px;
`;

const DayTitle = styled.div`
  color: #7eb8ff;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  margin-bottom: 6px;
`;

const DayContent = styled.div`
  color: #e8eef7;
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 1.4;
`;

// ─── VAGAS (RH) ────────────────────────────────────────────
const TextArea = styled.textarea`
  width: 100%;
  padding: 16px;
  background: rgba(10, 21, 48, 0.6);
  border: 1.5px solid rgba(74, 140, 247, 0.2);
  border-radius: 12px;
  color: #e8eef7;
  font-family: inherit;
  font-size: 0.9rem;
  line-height: 1.6;
  resize: vertical;
  min-height: 160px;
  margin-top: 12px;
  outline: none;
`;

const CopyBtn = styled.button`
  margin-top: 12px;
  padding: 10px 18px;
  background: rgba(74, 222, 128, 0.12);
  border: 1px solid rgba(74, 222, 128, 0.35);
  border-radius: 8px;
  color: #86efac;
  font-family: inherit;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;

  &:hover { background: rgba(74, 222, 128, 0.25); color: #fff; }
`;

// ─── COMPONENTE PRINCIPAL ──────────────────────────────────
const Ferramentas = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('quiz');

  // ─── 1. QUIZ DE PERFIL (MELHORADO COM MAIS ALTERNATIVAS) ─
  const [quizStep, setQuizStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizResults, setQuizResults] = useState(null);

  const questions = [
    {
      q: 'Quanto tempo você tem livre por dia?',
      key: 'time',
      options: [
        { label: 'Muito pouco (até 1h)', value: 'pouco', emoji: '⏳' },
        { label: 'Pouco (1-2h)', value: 'medio', emoji: '⏰' },
        { label: 'Meio período (3-4h)', value: 'meio', emoji: '🕐' },
        { label: 'Tempo integral (8h+)', value: 'integral', emoji: '🌞' },
        { label: 'Só nos fins de semana', value: 'fds', emoji: '📅' }
      ]
    },
    {
      q: 'Onde você prefere trabalhar?',
      key: 'work',
      options: [
        { label: 'De casa / Pela internet', value: 'internet', emoji: '🏠' },
        { label: 'Na rua / Visitando clientes', value: 'rua', emoji: '🚗' },
        { label: 'No meu próprio espaço', value: 'servicos', emoji: '🏪' },
        { label: 'Em lojas / Feiras', value: 'loja', emoji: '🛍️' },
        { label: 'Em qualquer lugar', value: 'qualquer', emoji: '🌍' }
      ]
    },
    {
      q: 'Qual é o seu objetivo principal?',
      key: 'goal',
      options: [
        { label: 'Renda extra rápida', value: 'extra', emoji: '⚡' },
        { label: 'Substituir meu salário', value: 'principal', emoji: '💼' },
        { label: 'Criar algo grande e escalável', value: 'escala', emoji: '🚀' },
        { label: 'Aposentadoria / Independência', value: 'aposentadoria', emoji: '🏖️' }
      ]
    },
    {
      q: 'Qual habilidade você domina mais?',
      key: 'skill',
      options: [
        { label: 'Comunicação e Vendas', value: 'comunica', emoji: '🗣️' },
        { label: 'Criatividade e Artes', value: 'cria', emoji: '🎨' },
        { label: 'Cozinhar / Comida', value: 'cozinha', emoji: '🍳' },
        { label: 'Tecnologia / Computador', value: 'tech', emoji: '💻' },
        { label: 'Consertar / Mãos na massa', value: 'conserta', emoji: '🔧' },
        { label: 'Cuidar de pessoas', value: 'cuida', emoji: '❤️' }
      ]
    },
    {
      q: 'Como está a sua vida financeira hoje?',
      key: 'finance',
      options: [
        { label: 'Preciso de retorno urgente', value: 'rapido', emoji: '🚨' },
        { label: 'Posso esperar alguns meses', value: 'espera', emoji: '🌱' },
        { label: 'Tenho uma reserva para investir', value: 'reserva', emoji: '💎' },
        { label: 'Quero começar sem gastar nada', value: 'zero', emoji: '🆓' }
      ]
    },
    {
      q: 'Você tem filhos pequenos ou pessoas para cuidar?',
      key: 'care',
      options: [
        { label: 'Sim, preciso estar 100% em casa', value: 'casa', emoji: '👶' },
        { label: 'Sim, mas tenho uma rede de apoio', value: 'apoio', emoji: '👨‍👩‍👧' },
        { label: 'Não, tenho flexibilidade total', value: 'livre', emoji: '🕊️' },
        { label: 'Não, mas prefiro não sair muito', value: 'reservado', emoji: '🏡' }
      ]
    },
    {
      q: 'Quanto você pode investir para começar?',
      key: 'money',
      options: [
        { label: 'R$ 0 (Apenas meu tempo)', value: '0', emoji: '🆓' },
        { label: 'Até R$ 100', value: '100', emoji: '💵' },
        { label: 'De R$ 100 a R$ 500', value: '500', emoji: '💰' },
        { label: 'De R$ 500 a R$ 1.500', value: '1500', emoji: '💎' },
        { label: 'Acima de R$ 1.500', value: '5000', emoji: '🏦' }
      ]
    }
  ];

  const handleAnswer = (key, value) => {
    const newAnswers = { ...answers, [key]: value };
    setAnswers(newAnswers);
    
    if (quizStep < questions.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      const orcamento = parseInt(newAnswers.money) || 0;
      
      const recomendados = businessData
        .filter(b => b.minInvestment <= orcamento)
        .map(b => {
          let score = 0;
          
          // Perfil e tempo
          if (b.timeProfile?.includes(newAnswers.time)) score += 3;
          if (newAnswers.time === 'fds' && b.timeProfile?.includes('flexivel')) score += 2;
          if (b.workProfile?.includes(newAnswers.work)) score += 3;
          if (newAnswers.work === 'qualquer' && b.workProfile?.length > 0) score += 1;

          // Habilidades
          if (newAnswers.skill === 'cozinha' && b.category === 'Alimentação') score += 4;
          if (newAnswers.skill === 'cria' && ['Artesanato', 'Beleza', 'Tecnologia'].includes(b.category)) score += 4;
          if (newAnswers.skill === 'comunica' && ['Revenda', 'Serviços'].includes(b.category)) score += 4;
          if (newAnswers.skill === 'tech' && b.category === 'Tecnologia') score += 4;
          if (newAnswers.skill === 'conserta' && ['Automotivo', 'Serviços'].includes(b.category)) score += 4;
          if (newAnswers.skill === 'cuida' && ['Beleza', 'Educação'].includes(b.category)) score += 4;

          // Retorno financeiro (payback)
          if (newAnswers.finance === 'rapido' && b.payback?.includes('1')) score += 3;
          if (newAnswers.finance === 'zero' && b.minInvestment < 100) score += 4;
          if (newAnswers.finance === 'reserva' && b.profitMargin?.includes('80')) score += 2;

          // Cuidados com filhos
          if (newAnswers.care === 'casa' && b.workProfile?.includes('casa')) score += 3;
          if (newAnswers.care === 'reservado' && b.workProfile?.includes('internet')) score += 2;

          return { ...b, score };
        })
        .filter(b => b.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 6);

      setQuizResults(recomendados.length > 0 ? recomendados : businessData.slice(0, 6));
    }
  };

  const progressPercent = ((quizStep) / questions.length) * 100;

  // ─── 2. SIMULADOR DE CONTRATAÇÃO (RH) ────────────────────
  const [salarioBase, setSalarioBase] = useState('');
  const [custosExtras, setCustosExtras] = useState(null);

  const calcularCusto = () => {
    const salario = parseFloat(salarioBase.replace(',', '.')) || 0;
    if (salario === 0) return;

    const fgts = salario * 0.08;
    const inss = salario * 0.20;
    const decimoTerceiro = salario / 12;
    const ferias = (salario + (salario/3)) / 12;
    const provisoes = decimoTerceiro + ferias;
    const total = salario + fgts + inss + provisoes;

    setCustosExtras({
      salario: salario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      fgts: fgts.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      inss: inss.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      provisoes: provisoes.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      total: total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      impacto: (total - salario).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    });
  };

  const [cargo, setCargo] = useState('');
  const [atv1, setAtv1] = useState('');
  const [atv2, setAtv2] = useState('');
  const [atv3, setAtv3] = useState('');
  const [vagaGerada, setVagaGerada] = useState('');

  const gerarVaga = () => {
    if (!cargo || !atv1) {
      showToast('⚠️ Preencha o cargo e pelo menos 1 atividade', 'warning', 2000);
      return;
    }

    const texto = `📢 *VAGA ABERTA: ${cargo.toUpperCase()}*\n\nEstamos crescendo e precisamos de alguém proativo e comprometido para fazer parte do nosso time!\n\n*📋 Responsabilidades:*\n• ${atv1}\n${atv2 ? `• ${atv2}\n` : ''}${atv3 ? `• ${atv3}\n` : ''}\n*✅ O que esperamos:*\n• Pontualidade e compromisso\n• Vontade de aprender\n• Bom relacionamento interpessoal\n\n*💼 O que oferecemos:*\n• Ambiente dinâmico e acolhedor\n• Oportunidade de crescimento\n• Salário a combinar\n\n*📍 Local:* [Insira o bairro/cidade]\n*📩 Como se candidatar:*\nEnvie seu currículo para o e-mail [seu-email@exemplo.com] ou chame no WhatsApp [seu-número] com o assunto *Vaga ${cargo}*.\n\n*Vem fazer parte do nosso time! 🚀*`;

    setVagaGerada(texto);
    showToast('📝 Vaga gerada!', 'success', 1500);
  };

  const copiarVaga = () => {
    navigator.clipboard.writeText(vagaGerada);
    showToast('📋 Vaga copiada!', 'success', 1500);
  };

  // ─── 3. CALENDÁRIO DE CONTEÚDO ───────────────────────────
  const [nicho, setNicho] = useState('');
  const [calendario, setCalendario] = useState(null);

  const gerarCalendario = () => {
    if (!nicho) {
      showToast('⚠️ Selecione um nicho', 'warning', 2000);
      return;
    }

    const ideias = {
      beleza: [
        { dia: 'Segunda', tema: 'Antes e Depois', desc: 'Mostre a transformação de uma cliente.' },
        { dia: 'Terça', tema: 'Dica Rápida', desc: 'Ensine um truque de make ou cabelo.' },
        { dia: 'Quarta', tema: 'Bastidores', desc: 'Mostre seu espaço e seus produtos.' },
        { dia: 'Quinta', tema: 'Depoimento', desc: 'Poste o print de uma cliente satisfeita.' },
        { dia: 'Sexta', tema: 'Agenda', desc: 'Lembre que os horários do fim de semana estão abertos.' },
        { dia: 'Sábado', tema: 'Trend', desc: 'Faça um Reels com uma música que está bombando.' },
        { dia: 'Domingo', tema: 'Pessoal', desc: 'Fale um pouco sobre você e sua história.' },
      ],
      alimentacao: [
        { dia: 'Segunda', tema: 'Processo', desc: 'Mostre o preparo do prato da semana.' },
        { dia: 'Terça', tema: 'Cardápio', desc: 'Apresente as novidades do menu.' },
        { dia: 'Quarta', tema: 'Depoimento', desc: 'Poste vídeo de um cliente elogiando.' },
        { dia: 'Quinta', tema: 'Combo', desc: 'Ofereça uma promoção ou combo especial.' },
        { dia: 'Sexta', tema: 'Delivery', desc: 'Lembre que vai abrir os pedidos do fim de semana.' },
        { dia: 'Sábado', tema: 'Bastidores', desc: 'Mostre a correria e o clima da cozinha.' },
        { dia: 'Domingo', tema: 'Sorteio', desc: 'Faça uma ação com os seguidores.' },
      ],
      servicos: [
        { dia: 'Segunda', tema: 'Autoridade', desc: 'Compartilhe uma dica técnica da sua área.' },
        { dia: 'Terça', tema: 'Antes e Depois', desc: 'Mostre um serviço concluído.' },
        { dia: 'Quarta', tema: 'Orçamento', desc: 'Explique como funciona seu processo de orçamento.' },
        { dia: 'Quinta', tema: 'Depoimento', desc: 'Poste a avaliação de um cliente no Google.' },
        { dia: 'Sábado', tema: 'Bastidores', desc: 'Mostre sua rotina de trabalho.' },
        { dia: 'Domingo', tema: 'Pessoal', desc: 'Fale sobre seus valores e sua missão.' },
      ]
    };

    const categoriaBase = nicho === 'beleza' ? 'beleza' : nicho === 'alimentacao' ? 'alimentacao' : 'servicos';
    setCalendario(ideias[categoriaBase]);
  };

  return (
    <>
      <Helmet>
        <title>Ferramentas | Negócio ao Alcance</title>
      </Helmet>

      <BackgroundDecor />

      <Page>
        <Hero>
          <HeroIcon>🚀</HeroIcon>
          <Title>Laboratório de Ideias</Title>
          <Subtitle>
            Ferramentas inteligentes para descobrir seu perfil, 
            contratar com segurança e planejar seu conteúdo.
          </Subtitle>
        </Hero>

        <TabsContainer>
          <Tab $active={activeTab === 'quiz'} onClick={() => setActiveTab('quiz')}>
            🧠 Descubra seu Negócio
          </Tab>
          <Tab $active={activeTab === 'rh'} onClick={() => setActiveTab('rh')}>
            👥 Gestão de Equipe
          </Tab>
          <Tab $active={activeTab === 'calendario'} onClick={() => setActiveTab('calendario')}>
            📅 Calendário de Conteúdo
          </Tab>
        </TabsContainer>

        {/* ABA 1: QUIZ MELHORADO */}
        {activeTab === 'quiz' && (
          <ToolBox>
            {!quizResults ? (
              <>
                <ProgressBar>
                  <ProgressFill $percent={progressPercent} />
                </ProgressBar>
                
                <div style={{ fontSize: '0.75rem', color: '#7eb8ff', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
                  Passo {quizStep + 1} de {questions.length}
                </div>

                <QuestionText>{questions[quizStep].q}</QuestionText>

                {questions[quizStep].options.map((opt) => (
                  <QuizOption 
                    key={opt.value}
                    onClick={() => handleAnswer(questions[quizStep].key, opt.value)}
                  >
                    <span className="emoji">{opt.emoji}</span>
                    {opt.label}
                  </QuizOption>
                ))}
              </>
            ) : (
              <>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🎯</div>
                  <h3 style={{ color: '#fff', fontSize: '1.2rem', margin: '0 0 6px' }}>Seu perfil foi mapeado!</h3>
                  <p style={{ color: '#a8b8d8', fontSize: '0.85rem', margin: 0 }}>
                    Aqui estão os {quizResults.length} negócios que mais combinam com você:
                  </p>
                </div>

                <SuggestionGrid>
                  {quizResults.map((biz) => (
                    <MiniCard key={biz.id} onClick={() => navigate(`/business/${biz.id}`)}>
                      <div className="emoji">{biz.image}</div>
                      <div className="name">{biz.name}</div>
                      <div className="desc">{biz.description}</div>
                      <div style={{ marginTop: 'auto', paddingTop: '10px', color: '#7eb8ff', fontSize: '0.8rem', fontWeight: 800 }}>
                        Ver plano →
                      </div>
                    </MiniCard>
                  ))}
                </SuggestionGrid>

                <Btn 
                  onClick={() => { setQuizStep(0); setAnswers({}); setQuizResults(null); }}
                  style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', marginTop: '20px' }}
                >
                  Refazer Teste
                </Btn>
              </>
            )}
          </ToolBox>
        )}

        {/* ABA 2: GESTÃO DE EQUIPE (RH) */}
        {activeTab === 'rh' && (
          <ToolBox>
            <ToolTitle>Calculadora de Contratação</ToolTitle>
            <ToolDesc>Descubra o custo real de um funcionário CLT e gere o anúncio da vaga.</ToolDesc>

            <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', marginBottom: '20px' }}>
              <Field>
                <Label>Quanto você quer pagar de salário base?</Label>
                <Input 
                  type="text" 
                  placeholder="Ex: 1500" 
                  value={salarioBase}
                  onChange={(e) => setSalarioBase(e.target.value.replace(/[^0-9,.]/g, ''))}
                />
              </Field>
              <Btn onClick={calcularCusto} style={{ marginTop: 0 }}>💰 Calcular Custo Real</Btn>

              {custosExtras && (
                <ResultCard style={{ marginTop: '16px' }}>
                  <h4 style={{ margin: '0 0 10px', color: '#fff' }}>📊 Quanto vai custar de verdade</h4>
                  <ResultRow>
                    <span>Salário Base</span>
                    <span>{custosExtras.salario}</span>
                  </ResultRow>
                  <ResultRow>
                    <span>FGTS (8%)</span>
                    <span>+ {custosExtras.fgts}</span>
                  </ResultRow>
                  <ResultRow>
                    <span>INSS Patronal (20%)</span>
                    <span>+ {custosExtras.inss}</span>
                  </ResultRow>
                  <ResultRow>
                    <span>Provisões (13º + Férias)</span>
                    <span>+ {custosExtras.provisoes}</span>
                  </ResultRow>
                  <ResultRow>
                    <span>**CUSTO TOTAL MENSAL**</span>
                    <span>{custosExtras.total}</span>
                  </ResultRow>
                  <p style={{ margin: '8px 0 0', fontSize: '0.75rem', color: '#a8b8d8' }}>
                    Você precisa faturar pelo menos {custosExtras.impacto} a mais por mês só para pagar os impostos desse funcionário.
                  </p>
                </ResultCard>
              )}
            </div>

            <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
              <h4 style={{ color: '#fff', margin: '0 0 12px' }}>📝 Gerador de Vaga</h4>
              
              <Field>
                <Label>Cargo da Vaga</Label>
                <Input type="text" placeholder="Ex: Vendedor, Manicure, Atendente" value={cargo} onChange={(e) => setCargo(e.target.value)} />
              </Field>
              
              <Field>
                <Label>Atividades (até 3)</Label>
                <Input type="text" placeholder="Atividade 1 (Obrigatória)" value={atv1} onChange={(e) => setAtv1(e.target.value)} />
                <Input type="text" placeholder="Atividade 2 (Opcional)" value={atv2} onChange={(e) => setAtv2(e.target.value)} style={{ marginTop: 8 }} />
                <Input type="text" placeholder="Atividade 3 (Opcional)" value={atv3} onChange={(e) => setAtv3(e.target.value)} style={{ marginTop: 8 }} />
              </Field>

              <Btn onClick={gerarVaga}>✨ Gerar Anúncio de Vaga</Btn>

              {vagaGerada && (
                <div style={{ marginTop: '16px' }}>
                  <TextArea readOnly value={vagaGerada} />
                  <CopyBtn onClick={copiarVaga}>📋 Copiar para divulgar</CopyBtn>
                </div>
              )}
            </div>
          </ToolBox>
        )}

        {/* ABA 3: CALENDÁRIO */}
        {activeTab === 'calendario' && (
          <ToolBox>
            <ToolTitle>O que postar essa semana?</ToolTitle>
            <ToolDesc>Escolha seu nicho e receba um plano de conteúdo pronto para seguir.</ToolDesc>

            <Field>
              <Label>Nicho do Negócio</Label>
              <Select value={nicho} onChange={(e) => setNicho(e.target.value)}>
                <option value="">Selecione seu nicho...</option>
                <option value="beleza">💄 Beleza / Estética</option>
                <option value="alimentacao">🍔 Alimentação / Delivery</option>
                <option value="servicos">🔧 Serviços Gerais</option>
              </Select>
            </Field>

            <Btn onClick={gerarCalendario}>📅 Gerar Calendário</Btn>

            {calendario && (
              <CalendarList>
                {calendario.map((item, idx) => (
                  <CalendarDay key={idx}>
                    <DayTitle>{item.dia}</DayTitle>
                    <DayContent>{item.tema}</DayContent>
                    <div style={{ color: '#8899aa', fontSize: '0.8rem', marginTop: '4px' }}>
                      {item.desc}
                    </div>
                  </CalendarDay>
                ))}
              </CalendarList>
            )}
          </ToolBox>
        )}
      </Page>
    </>
  );
};

export default Ferramentas;