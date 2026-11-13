import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import styled, { keyframes } from 'styled-components';
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

// ─── LAYOUT ────────────────────────────────────────────────
const Page = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 20px 80px;
`;

const Hero = styled.header`
  position: relative;
  padding: 44px 36px 36px;
  margin-bottom: 24px;
  border-radius: 26px;
  text-align: center;
  overflow: hidden;
  animation: ${fadeInUp} 0.6s ease-out;
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, #4f7cff, #a855f7);
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

// ─── ABAS ──────────────────────────────────────────────────
const TabsContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
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

const Card = styled.section`
  padding: 28px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  animation: ${fadeInUp} 0.4s ease-out;
`;

const CardTitle = styled.h3`
  font-size: 1.15rem;
  color: #eef4ff;
  margin: 0 0 20px;
  font-weight: 800;
`;

// ─── CHAT (MENTOR) ─────────────────────────────────────────
const ChatWindow = styled.div`
  height: 450px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background: rgba(10, 21, 48, 0.4);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  margin-bottom: 16px;

  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { background: rgba(74, 140, 247, 0.3); border-radius: 6px; }
`;

const Message = styled.div`
  display: flex;
  gap: 12px;
  max-width: 85%;
  align-self: ${p => p.$isUser ? 'flex-end' : 'flex-start'};
  flex-direction: ${p => p.$isUser ? 'row-reverse' : 'row'};
  animation: ${fadeInUp} 0.3s ease-out;
`;

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  font-size: 1.1rem;
  background: ${p => p.$isUser ? 'linear-gradient(135deg, #a855f7, #ec4899)' : 'linear-gradient(135deg, #4f7cff, #7eb8ff)'};
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const Bubble = styled.div`
  padding: 12px 16px;
  border-radius: 16px;
  font-size: 0.9rem;
  line-height: 1.5;
  background: ${p => p.$isUser ? 'rgba(168, 85, 247, 0.15)' : 'rgba(74, 140, 247, 0.1)'};
  color: #e8eef7;
  border: 1px solid ${p => p.$isUser ? 'rgba(168, 85, 247, 0.3)' : 'rgba(74, 140, 247, 0.2)'};
  border-top-right-radius: ${p => p.$isUser ? '4px' : '16px'};
  border-top-left-radius: ${p => p.$isUser ? '16px' : '4px'};
  white-space: pre-wrap;
`;

const SuggestionsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
`;

const SuggestionChip = styled.button`
  padding: 8px 14px;
  background: rgba(74, 140, 247, 0.08);
  border: 1px solid rgba(74, 140, 247, 0.2);
  border-radius: 100px;
  color: #a8ccff;
  font-family: inherit;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(74, 140, 247, 0.2);
    color: #fff;
  }
`;

const InputRow = styled.div`
  display: flex;
  gap: 10px;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 14px 20px;
  background: rgba(10, 21, 48, 0.8);
  border: 1.5px solid rgba(74, 140, 247, 0.3);
  border-radius: 100px;
  color: #e8eef7;
  font-family: inherit;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.25s;

  &:focus { border-color: rgba(74, 140, 247, 0.7); }
  &::placeholder { color: #556677; }
`;

const SendBtn = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #2563eb, #4f7cff);
  color: #fff;
  cursor: pointer;
  display: grid;
  place-items: center;
  box-shadow: 0 4px 15px rgba(37, 99, 235, 0.4);
  transition: all 0.2s;

  &:hover { transform: scale(1.05); }
  svg { width: 20px; height: 20px; margin-left: -2px; }
`;

// ─── CHECKLIST ─────────────────────────────────────────────
const ProgressCircleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 30px;
  padding-bottom: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 480px) { flex-direction: column; text-align: center; }
`;

const ProgressCircle = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  position: relative;
  background: conic-gradient(#22c55e ${p => p.$percent * 3.6}deg, rgba(255,255,255,0.05) 0deg);
  flex-shrink: 0;

  &::before {
    content: '';
    position: absolute;
    inset: 8px;
    border-radius: 50%;
    background: #0d1b3e;
  }
`;

const ProgressText = styled.div`
  position: relative;
  z-index: 1;
  font-size: 1.5rem;
  font-weight: 800;
  color: #fff;
`;

const ProgressInfo = styled.div`
  h4 { color: #fff; font-size: 1.2rem; margin: 0 0 4px; }
  p { color: #8899aa; font-size: 0.9rem; margin: 0; line-height: 1.5; }
`;

const CheckList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CheckItem = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid ${p => p.$checked ? 'rgba(34, 197, 94, 0.4)' : 'rgba(255, 255, 255, 0.08)'};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover { background: rgba(255, 255, 255, 0.04); }
`;

const Checkbox = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 6px;
  flex-shrink: 0;
  border: 2px solid ${p => p.$checked ? '#22c55e' : 'rgba(255,255,255,0.2)'};
  background: ${p => p.$checked ? '#22c55e' : 'transparent'};
  display: grid;
  place-items: center;
  transition: all 0.2s;

  svg { width: 14px; height: 14px; color: #fff; stroke-width: 3; }
`;

const CheckContent = styled.div`
  flex: 1;
  strong {
    display: block;
    color: ${p => p.$checked ? '#86efac' : '#e8eef7'};
    font-size: 0.95rem;
    margin-bottom: 4px;
    text-decoration: ${p => p.$checked ? 'line-through' : 'none'};
  }
  span { color: #8899aa; font-size: 0.82rem; line-height: 1.4; display: block; }
`;

// ─── BASE DE CONHECIMENTO (MENTOR) ─────────────────────────
const CONHECIMENTO = [
  // ─── CONVERSAS CASUAIS ──────────────────────────────────
  {
    keywords: ['oi', 'ola', 'olá', 'bom dia', 'boa tarde', 'boa noite', 'eae', 'e ai', 'tudo bem', 'opa'],
    pergunta: 'Saudação',
    resposta: 'Olá! 👋 Que bom te ver por aqui. Sou seu Mentor Virtual e estou pronto para tirar suas dúvidas sobre empreendedorismo.\n\nVocê pode perguntar sobre:\n• MEI e CNPJ\n• Precificação\n• Nota fiscal\n• Como conseguir clientes\n• Fluxo de caixa\n\nComo posso te ajudar hoje?'
  },
  {
    keywords: ['obrigado', 'obrigada', 'valeu', 'vlw', 'brigado', 'brigada', 'agradeco', 'agradeço'],
    pergunta: 'Agradecimento',
    resposta: 'Por nada! 😊 Estou sempre aqui se precisar. Continue firme no seu negócio, cada passo conta! 🚀'
  },
  {
    keywords: ['tchau', 'ate logo', 'até logo', 'falou', 'flw', 'adeus', 'ate mais', 'até mais'],
    pergunta: 'Despedida',
    resposta: 'Até logo! 👋 Volte sempre que precisar. Sucesso no seu empreendimento! 💙'
  },
  {
    keywords: ['quem e voce', 'quem é você', 'seu nome', 'o que voce faz', 'o que você faz', 'como funciona'],
    pergunta: 'Sobre o Mentor',
    resposta: 'Sou o Mentor Virtual do Negócio ao Alcance! 🧠\n\nFui criado para te ajudar com dúvidas sobre empreendedorismo, baseado no nosso Guia do Empreendedor.\n\nPosso te explicar sobre MEI, precificação, nota fiscal, clientes, finanças e muito mais. É só perguntar!'
  },
  {
    keywords: ['me ajuda', 'ajuda', 'socorro', 'nao sei', 'não sei', 'duvida', 'dúvida', 'como faco', 'como faço', 'preciso de ajuda'],
    pergunta: 'Ajuda',
    resposta: 'Estou aqui para te ajudar! 🤝\n\nEu sou especialista em empreendedorismo e posso te orientar sobre:\n\n• 🏢 Formalização (MEI, CNPJ, nota fiscal)\n• 💰 Finanças (precificação, fluxo de caixa, lucro)\n• 📱 Marketing (Instagram, clientes, vendas)\n• 🧠 Mentalidade (medo de começar, lidar com erros)\n\nMe diga o que está te travando e eu te ajudo com o próximo passo!'
  },

  // ─── DÚVIDAS DE NEGÓCIO ──────────────────────────────────
  {
    keywords: ['mei', 'abrir mei', 'microempreendedor', 'cnpj'],
    pergunta: 'Como abrir um MEI?',
    resposta: 'O MEI custa menos de R$ 70/mês e libera CNPJ, nota fiscal e INSS.\n\nPara abrir:\n1) Acesse gov.br/mei\n2) Preencha seus dados\n3) Escolha a atividade (CNAE)\n4) Pague o primeiro DAS\n\nÉ tudo online e gratuito!'
  },
  {
    keywords: ['nota fiscal', 'emitir nota', 'rpa', 'emissor'],
    pergunta: 'Como emitir nota fiscal?',
    resposta: 'Se você é MEI, use o Emissor Nacional de Nota Fiscal (grátis).\n\nSe é autônomo, pode emitir RPA pela prefeitura.\n\nEmita sempre, mesmo quando não for obrigatório: protege você e comprova renda.'
  },
  {
    keywords: ['preço', 'precificar', 'quanto cobrar', 'preço de custo', 'margem', 'lucro'],
    pergunta: 'Como precificar meu serviço?',
    resposta: 'A fórmula é:\n\n(Custos diretos + Mão de obra + Custos fixos) ÷ (1 − Margem)\n\nExemplo: se gasta R$ 20 de material, R$ 80 de mão de obra e R$ 15 de custos fixos, e quer 40% de margem:\n(20+80+15) ÷ (1-0,4) = R$ 191,67'
  },
  {
    keywords: ['cliente', 'primeiro cliente', 'vender', 'conseguir clientes', 'clientes'],
    pergunta: 'Como conseguir os primeiros clientes?',
    resposta: 'Comece com quem você conhece (amigos, família), monte um Instagram simples, entre em grupos do bairro, ofereça um desconto agressivo em troca de depoimento e faça parcerias.\n\nMeta realista: 3 clientes na 1ª semana, 10 no primeiro mês.'
  },
  {
    keywords: ['separar', 'finanças', 'conta', 'dinheiro', 'pj', 'pf'],
    pergunta: 'Como separar finanças pessoais e do negócio?',
    resposta: 'Abra uma conta PJ grátis (Nubank, Inter, Cora), defina seu pró-labore mensal, registre tudo em planilha ou app, reserve 10% para emergência e separe o valor dos impostos.\n\nTrate seu negócio como um cliente.'
  },
  {
    keywords: ['instagram', 'vender no instagram', 'redes sociais', 'postar'],
    pergunta: 'Como vender pelo Instagram?',
    resposta: 'Bio que vende (o que faz + como comprar), destaques organizados (Produtos, Depoimentos, Como funciona), conteúdo que gera desejo, CTA em todo post ("Chama no Direct") e responda rápido!\n\nO Direct é sua loja.'
  },
  {
    keywords: ['fluxo de caixa', 'organizar dinheiro', 'controle', 'planilha'],
    pergunta: 'Como organizar o fluxo de caixa?',
    resposta: 'Registre todo dinheiro que entra e sai (planilha ou app), separe por categoria (Vendas, Materiais, Impostos), projete os próximos 30 dias e reserve 30 min toda sexta-feira para atualizar.\n\nÉ o hábito que salva empresas.'
  },
  {
    keywords: ['mvp', 'mínimo viável', 'validar', 'testar'],
    pergunta: 'O que é MVP?',
    resposta: 'MVP é a versão mais simples do negócio que já permite testar se as pessoas querem comprar.\n\nEx: se quer fazer bolos, venda para 5 vizinhos antes de comprar a batedeira profissional.\n\nConverse com 10 pessoas; se 3 disserem "eu compraria", é sinal verde.'
  },
  {
    keywords: ['cliente difícil', 'reclamação', 'insatisfeito', 'reclamar'],
    pergunta: 'Como lidar com clientes difíceis?',
    resposta: '1) Respire antes de responder\n2) Escute sem interromper\n3) Use a fórmula "Empatia + Solução"\n4) Seja firme mas educado\n5) Saiba dizer "não" se o cliente for abusivo\n\nClientes insatisfeitos bem atendidos viram os mais fiéis.'
  },
  {
    keywords: ['mei me ltda', 'qual escolher', 'tipo de empresa', 'mei ou me'],
    pergunta: 'MEI, ME ou LTDA?',
    resposta: 'MEI: até R$ 81 mil/ano, imposto fixo (~R$ 70/mês), 1 funcionário.\n\nME: até R$ 360 mil/ano, Simples Nacional (4-19%), sem limite de funcionários.\n\nLTDA: para sócios.\n\nComece como MEI e migre para ME quando estourar o limite.'
  },

  // ─── NOVAS PERGUNTAS (X) ─────────────────────────────────
  {
    keywords: ['medo', 'tenho medo', 'receio', 'insegurança', 'inseguro', 'travado', 'bloqueado'],
    pergunta: 'Medo de empreender',
    resposta: 'É normal ter medo! 😰 Todo empreendedor sente isso no começo.\n\nO segredo é não deixar o medo te paralisar. Comece pequeno, teste sua ideia com poucos clientes e vá ajustando. Não precisa ser perfeito, precisa começar.\n\nLembre-se: quem não arrisca, não petisca! 🚀'
  },
  {
    keywords: ['falir', 'medo de falir', 'prejuízo', 'perder dinheiro', 'não der certo'],
    pergunta: 'Medo de falir',
    resposta: 'O medo de falir é real, mas a falência geralmente acontece por falta de planejamento, não por azar.\n\nPara evitar:\n• Separe as finanças pessoais das do negócio\n• Tenha uma reserva de emergência\n• Comece com baixo investimento\n• Aprenda com os erros rápido\n\nFalir não é o fim, é aprendizado. Muitos grandes negócios começaram após uma queda. 💪'
  },
  {
    keywords: ['estou perdido', 'não sei por onde começar', 'por onde começo', 'primeiro passo', 'começar'],
    pergunta: 'Por onde começar',
    resposta: 'Se você está perdido, siga esse roteiro:\n\n1) Descubra o que você sabe fazer bem (habilidades)\n2) Veja quanto pode investir (orçamento)\n3) Escolha um negócio que combine com os dois\n4) Faça um plano simples de ação\n5) Comece com 1 cliente\n\nNão tente abraçar o mundo, foque em dar o primeiro passo. O resto vem com o tempo! 🚀'
  },
  {
    keywords: ['quanto custa', 'custo', 'investimento', 'preciso de dinheiro'],
    pergunta: 'Quanto custa começar',
    resposta: 'Depende do negócio! Tem ideias que começam com R$ 0 (usando só o celular e internet) e outras que exigem mais.\n\nAqui no app você pode filtrar por investimento. Se você tem pouco, comece com negócios de serviços digitais (artes, currículos, social media).\n\nO importante é começar com o que tem e crescer aos poucos. 💰'
  },
  {
    keywords: ['quanto tempo', 'demora', 'quando vou lucrar', 'retorno', 'payback'],
    pergunta: 'Tempo para lucrar',
    resposta: 'Depende do negócio e do seu esforço. Mas em média:\n\n• Serviços digitais (artes, currículo): 1 a 2 meses\n• Alimentação caseira (bolos, doces): 2 a 3 meses\n• Serviços físicos (limpeza, reparos): 3 a 6 meses\n\nO importante é ter constância. Não desanime nos primeiros meses! 💪'
  },
  {
    keywords: ['sozinho', 'sem sócio', 'preciso de sócio', 'sócio'],
    pergunta: 'Preciso de sócio?',
    resposta: 'Não! A maioria dos negócios pode ser tocada sozinho no começo.\n\nSócio só é bom quando:\n• Você já tem clientes e precisa dividir tarefas\n• Falta uma habilidade essencial (ex: um técnico e um vendedor)\n\nNo início, menos gente = menos dor de cabeça e mais lucro pra você. Comece solo e cresça com segurança. 🚀'
  },
  {
    keywords: ['criar instagram', 'perfil profissional', 'instagram profissional', 'como criar perfil'],
    pergunta: 'Como criar um Instagram profissional',
    resposta: 'Passo a passo rápido:\n\n1) Crie uma conta no Instagram\n2) Troque para conta profissional (Configurações > Conta > Profissional)\n3) Escolha a categoria\n4) Foto de perfil com logo ou rosto\n5) Bio clara: O que faz + Como comprar (link do WhatsApp)\n6) 6 primeiros posts\n\nPronto, seu Instagram já está pronto pra vender! 📱'
  },
  {
    keywords: ['whatsapp business', 'whatsapp comercial', 'whatsapp'],
    pergunta: 'WhatsApp Business',
    resposta: 'O WhatsApp Business é gratuito e ótimo pra vender!\n\nO que configurar:\n• Nome do negócio\n• Foto de perfil\n• Catálogo de produtos\n• Mensagem automática de boas-vindas\n• Respostas rápidas (ex: "preço", "horário")\n\nÉ a sua loja no bolso do cliente! 💬'
  },
  {
    keywords: ['fidelizar', 'cliente fiel', 'fidelidade', 'voltar a comprar', 'cliente voltar'],
    pergunta: 'Como fidelizar clientes',
    resposta: 'Cliente fiel é ouro! 5 dicas:\n\n1) Entregue mais do que prometeu\n2) Responda rápido e com educação\n3) Peça feedback e melhore\n4) Ofereça descontos em compras recorrentes\n5) Lembre-se do cliente (nome, preferências)\n\nCliente bem atendido volta e ainda indica você pra outros. O boca a boca é o melhor marketing! 🎯'
  },
  {
    keywords: ['cobrar caro', 'aumentar preço', 'reajustar', 'aumentar valor', 'preço justo'],
    pergunta: 'Como aumentar meus preços',
    resposta: 'Se você entrega qualidade, pode (e deve) cobrar mais!\n\nComo aumentar sem perder clientes:\n• Avise com antecedência (30 dias)\n• Mostre o valor do seu trabalho (depoimentos, portfólio)\n• Ofereça um plano de transição (preço antigo por tempo limitado)\n• Aumente só se o mercado permite\n\nCobrar barato demais atrai cliente que não valoriza. 💎'
  },
  {
    keywords: ['demitir', 'contratar', 'funcionário', 'empregado', 'ajudante'],
    pergunta: 'Hora de contratar',
    resposta: 'Hora de contratar é quando:\n\n• Você não consegue mais dar conta sozinho\n• Já tem clientes fixos e receita estável\n• O lucro já cobre o custo do funcionário (cerca de 1,7x o salário)\n\nCuidado: contratar antes da hora pode quebrar o negócio. Prefira freelancers no começo. 👥'
  },
  {
    keywords: ['não consigo vender', 'não estou vendendo', 'vendas baixas', 'não vende'],
    pergunta: 'Não estou conseguindo vender',
    resposta: 'Vendas baixas geralmente são sintoma de:\n\n1) Falta de divulgação (você aparece todos os dias?)\n2) Público errado (está falando com quem realmente compra?)\n3) Preço desalinhado\n4) Oferta confusa (as pessoas entendem o que você vende?)\n\nEscolha um ponto e melhore essa semana. Vendas é teste e ajuste constante! 📈'
  },
  {
    keywords: ['concorrente', 'concorrência', 'competição', 'concorrente forte'],
    pergunta: 'E se tiver concorrência?',
    resposta: 'Concorrência é bom sinal! Significa que existe mercado.\n\nO segredo é se diferenciar:\n• Atendimento mais humano\n• Preço justo com qualidade\n• Especialize em um nicho\n• Crie uma identidade visual única\n\nVocê não precisa ser o melhor do mundo, só o melhor pra um grupo específico. 🎯'
  },
  {
    keywords: ['planejamento', 'planejar', 'meta', 'objetivo', 'organizar', 'onde quero chegar'],
    pergunta: 'Como planejar meu negócio',
    resposta: 'Um plano simples em 5 etapas:\n\n1) Onde estou hoje? (faturamento atual)\n2) Onde quero chegar? (meta em 3 meses)\n3) O que preciso fazer pra chegar lá?\n4) Quais obstáculos podem aparecer?\n5) Como vou medir se está funcionando?\n\nEscreva, revise toda semana e ajuste. Planejamento é bússola, não trilho. 🗺️'
  },
  {
    keywords: ['estresse', 'ansiedade', 'desanimado', 'cansaço', 'esgotado', 'burnout'],
    pergunta: 'Saúde mental do empreendedor',
    resposta: 'Empreender cansa! É normal sentir ansiedade e desânimo.\n\nO que ajuda:\n• Reserve 1 dia da semana pra descansar\n• Faça atividade física (mesmo 15 min)\n• Converse com outros empreendedores\n• Celebre pequenas vitórias\n• Aceite que não vai dar conta de tudo\n\nVocê não é uma máquina. Cuidar de si é parte do negócio. 💙'
  },
  {
    keywords: ['primeira venda', 'primeira cliente', 'como vender o primeiro', 'primeira vez'],
    pergunta: 'Primeira venda',
    resposta: 'A primeira venda é sempre a mais difícil, mas é possível! 🎯\n\nEstratégia:\n1) Faça uma oferta especial pra amigos e família\n2) Peça depoimento em vídeo após entregar\n3) Poste o resultado nas redes sociais\n4) Ofereça um combo com bônus\n\nUma vez que você tiver o primeiro cliente, os próximos ficam mais fáceis. 💪'
  }
];

const getResposta = (texto) => {
  const t = texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

  // Se a mensagem for muito curta (ex: "oi"), só procura por saudações
  // para evitar conflito com outras palavras-chave.
  for (const item of CONHECIMENTO) {
    if (item.keywords.some(kw => {
      const kwNorm = kw.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return t === kwNorm || t.includes(kwNorm);
    })) {
      return item.resposta;
    }
  }
  return 'Ainda não tenho a resposta para isso, mas recomendo dar uma olhada no nosso **Guia do Empreendedor**, lá tem vários artigos que podem te ajudar!\n\nSe a dúvida persistir, tente reformular com palavras mais simples (ex: "MEI", "precificar", "nota fiscal").';
};

// ─── BASE DE CHECKLIST ─────────────────────────────────────
const CHECKLIST_ITEMS = [
  { id: 1, titulo: 'Tenho CNPJ (MEI ou outro)', desc: 'Emitir nota fiscal e abrir conta PJ exige CNPJ.' },
  { id: 2, titulo: 'Tenho Alvará de Funcionamento', desc: 'Obrigatório para a maioria dos negócios físicos.' },
  { id: 3, titulo: 'Conheço as regras do meu setor', desc: 'Vigilância Sanitária, Bombeiros, etc.' },
  { id: 4, titulo: 'Tenho contrato de prestação de serviço', desc: 'Protege você e o cliente de imprevistos.' },
  { id: 5, titulo: 'Tenho seguro do negócio', desc: 'Contra incêndio, roubo ou danos a terceiros.' },
  { id: 6, titulo: 'Separo as finanças (PJ x PF)', desc: 'Nunca misture o dinheiro da empresa com o pessoal.' },
  { id: 7, titulo: 'Guardo 10% do faturamento', desc: 'Fundo de emergência para meses ruins.' },
  { id: 8, titulo: 'Pago os impostos em dia', desc: 'Evita multas, juros e problemas com o Fisco.' },
  { id: 9, titulo: 'Tenho reserva para 3 meses', desc: 'Cobre contas fixas caso o negócio demore a engrenar.' },
  { id: 10, titulo: 'Registro todas as vendas', desc: 'Necessário para IR, controle e crescimento.' }
];

// ─── COMPONENTE ────────────────────────────────────────────
const Consultor = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('mentor');

  // Mentor (Chat)
  const [messages, setMessages] = useState([
    { text: 'Olá! Sou seu Mentor Virtual. 👋\n\nPode me perguntar qualquer coisa sobre empreendedorismo: MEI, precificação, nota fiscal, como conseguir clientes... Estou aqui pra ajudar!', isUser: false }
  ]);
  const [input, setInput] = useState('');
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const textoUser = input;
    const userMsg = { text: textoUser, isUser: true };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      const resp = getResposta(textoUser);
      setMessages(prev => [...prev, { text: resp, isUser: false }]);
    }, 600);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  const sugestoes = [
    'Como abrir um MEI?',
    'Como precificar?',
    'Como conseguir clientes?',
    'O que é MVP?'
  ];

  // Checklist
  const [checked, setChecked] = useState({});
  
  const toggleCheck = (id) => {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const checkedCount = Object.values(checked).filter(Boolean).length;
  const totalItems = CHECKLIST_ITEMS.length;
  const percent = Math.round((checkedCount / totalItems) * 100);

  const getFeedback = () => {
    if (percent === 100) return { title: 'Negócio Blindado! 🛡️', desc: 'Você está protegido em todas as frentes. Continue assim!' };
    if (percent >= 70) return { title: 'Muito Bom! 👏', desc: 'Você já está bem protegido, mas ainda faltam alguns itens para ficar 100% seguro.' };
    if (percent >= 40) return { title: 'Atenção! ⚠️', desc: 'Você tem pontos importantes descobertos. Não deixe para depois: um imprevisto pode custar caro.' };
    return { title: 'Alerta Vermelho! 🚨', desc: 'Seu negócio está muito vulnerável. Priorize os itens básicos como CNPJ e separação de finanças.' };
  };

  const feedback = getFeedback();

  return (
    <>
      <Helmet>
        <title>Consultor | Negócio ao Alcance</title>
      </Helmet>

      <Page>
        <Hero>
          <HeroIcon>🧠</HeroIcon>
          <Title>Consultor Inteligente</Title>
          <Subtitle>
            Seu assistente 24h para tirar dúvidas e proteger seu negócio.
          </Subtitle>
        </Hero>

        <TabsContainer>
          <Tab $active={activeTab === 'mentor'} onClick={() => setActiveTab('mentor')}>
            💬 Mentor Virtual
          </Tab>
          <Tab $active={activeTab === 'checklist'} onClick={() => setActiveTab('checklist')}>
            🛡️ Checklist de Segurança
          </Tab>
        </TabsContainer>

        {/* ABA MENTOR */}
        {activeTab === 'mentor' && (
          <Card>
            <CardTitle>Pergunte o que quiser</CardTitle>
            
            <ChatWindow ref={chatRef}>
              {messages.map((msg, idx) => (
                <Message key={idx} $isUser={msg.isUser}>
                  <Avatar $isUser={msg.isUser}>{msg.isUser ? '👤' : '🤖'}</Avatar>
                  <Bubble $isUser={msg.isUser}>{msg.text}</Bubble>
                </Message>
              ))}
            </ChatWindow>

            <SuggestionsRow>
              {sugestoes.map((s, i) => (
                <SuggestionChip key={i} onClick={() => { setInput(s); }}>
                  {s}
                </SuggestionChip>
              ))}
            </SuggestionsRow>

            <InputRow>
              <ChatInput 
                type="text" 
                placeholder="Digite sua dúvida..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <SendBtn onClick={handleSend}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </SendBtn>
            </InputRow>
          </Card>
        )}

        {/* ABA CHECKLIST */}
        {activeTab === 'checklist' && (
          <Card>
            <ProgressCircleWrapper>
              <ProgressCircle $percent={percent}>
                <ProgressText>{percent}%</ProgressText>
              </ProgressCircle>
              <ProgressInfo>
                <h4>{feedback.title}</h4>
                <p>{feedback.desc}</p>
              </ProgressInfo>
            </ProgressCircleWrapper>

            <CheckList>
              {CHECKLIST_ITEMS.map(item => (
                <CheckItem key={item.id} $checked={checked[item.id]}>
                  <Checkbox $checked={checked[item.id]} onClick={() => toggleCheck(item.id)}>
                    {checked[item.id] && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </Checkbox>
                  <CheckContent $checked={checked[item.id]}>
                    <strong>{item.titulo}</strong>
                    <span>{item.desc}</span>
                  </CheckContent>
                </CheckItem>
              ))}
            </CheckList>
          </Card>
        )}
      </Page>
    </>
  );
};

export default Consultor;