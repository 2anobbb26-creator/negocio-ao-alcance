import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import styled, { keyframes } from 'styled-components';

// ─── ANIMAÇÕES ─────────────────────────────────────────────
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-12px); }
`;

// ─── LAYOUT ────────────────────────────────────────────────
const Page = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 32px 20px 80px;
  position: relative;

  @media (max-width: 480px) { padding: 20px 14px 60px; }
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
    background: radial-gradient(circle, rgba(251, 191, 36, 0.08), transparent 70%);
    border-radius: 50%;
    animation: ${float} 14s ease-in-out infinite;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -15%; left: -10%;
    width: 460px; height: 460px;
    background: radial-gradient(circle, rgba(168, 85, 247, 0.08), transparent 70%);
    border-radius: 50%;
    animation: ${float} 18s ease-in-out infinite reverse;
  }
`;

// ─── HERO ──────────────────────────────────────────────────
const Hero = styled.header`
  position: relative;
  padding: 44px 36px 36px;
  margin-bottom: 30px;
  border-radius: 26px;
  overflow: hidden;
  text-align: center;
  animation: ${fadeInUp} 0.6s ease-out;

  background:
    radial-gradient(ellipse at 0% 0%, rgba(251, 191, 36, 0.1), transparent 55%),
    radial-gradient(ellipse at 100% 100%, rgba(168, 85, 247, 0.1), transparent 55%),
    linear-gradient(160deg, rgba(255, 255, 255, 0.045) 0%, rgba(255, 255, 255, 0.015) 100%);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, #fbbf24, #f59e0b, #ec4899);
  }

  @media (max-width: 480px) { padding: 30px 20px 24px; border-radius: 20px; }
`;

const HeroIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 12px;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.6px;
  margin: 0 0 10px;
  background: linear-gradient(135deg, #ffffff 0%, #fde68a 40%, #fbbf24 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 480px) { font-size: 1.5rem; }
`;

const Subtitle = styled.p`
  color: #a8b8d8;
  font-size: 0.95rem;
  line-height: 1.6;
  max-width: 560px;
  margin: 0 auto;

  @media (max-width: 480px) { font-size: 0.85rem; }
`;

// ─── GRID ──────────────────────────────────────────────────
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  animation: ${fadeInUp} 0.6s ease-out;

  @media (max-width: 480px) { grid-template-columns: 1fr; gap: 12px; }
`;

const Card = styled.article`
  padding: 22px 20px;
  border-radius: 18px;
  background: linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%);
  border: 1px solid rgba(255, 255, 255, 0.07);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, #fbbf24, #ec4899);
    opacity: 0.7;
  }

  &:hover {
    border-color: rgba(251, 191, 36, 0.35);
    transform: translateY(-4px);
    box-shadow: 0 20px 40px -16px rgba(251, 191, 36, 0.25);
  }
`;

const CardEmoji = styled.div`
  font-size: 2.2rem;
  line-height: 1;
`;

const CardTitle = styled.h3`
  font-size: 1.02rem;
  font-weight: 800;
  color: #eef4ff;
  margin: 0;
  line-height: 1.35;
`;

const CardExcerpt = styled.p`
  font-size: 0.82rem;
  color: #8899aa;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ReadMore = styled.div`
  font-size: 0.78rem;
  font-weight: 800;
  color: #fbbf24;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: auto;
  padding-top: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

// ─── MODAL ─────────────────────────────────────────────────
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(10, 15, 35, 0.92);
  backdrop-filter: blur(20px);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  animation: ${fadeInUp} 0.25s ease-out;
  overflow-y: auto;
`;

const Modal = styled.div`
  background: linear-gradient(145deg, #0d1b3e 0%, #0a1530 100%);
  border: 1px solid rgba(251, 191, 36, 0.3);
  border-radius: 24px;
  padding: 32px;
  max-width: 640px;
  width: 100%;
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
  animation: ${fadeInUp} 0.3s ease-out;

  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { background: rgba(251, 191, 36, 0.3); border-radius: 3px; }

  @media (max-width: 480px) { padding: 24px 18px; }
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 14px; right: 14px;
  width: 40px; height: 40px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.08);
  color: #a8b8d8;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  transition: all 0.2s ease;

  &:hover { background: rgba(239, 68, 68, 0.2); color: #f87171; }
`;

const ModalEmoji = styled.div`
  font-size: 2.5rem;
  margin-bottom: 10px;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 800;
  color: #eef4ff;
  margin: 0 0 18px;
  padding-right: 40px;
  line-height: 1.3;
`;

const ModalBody = styled.div`
  color: #cbd9ee;
  font-size: 0.92rem;
  line-height: 1.7;

  h3 {
    color: #fbbf24;
    font-size: 1.05rem;
    margin: 20px 0 8px;
    font-weight: 800;
  }

  p { margin: 0 0 12px; }

  ul, ol {
    margin: 0 0 14px;
    padding-left: 22px;

    li { margin-bottom: 6px; }
  }

  strong { color: #fff; font-weight: 700; }
  em { color: #a8ccff; font-style: normal; font-weight: 600; }
`;

// ─── CONTEÚDO ──────────────────────────────────────────────
const ARTIGOS = [
  {
    id: 1,
    emoji: '📝',
    title: 'Como tirar o MEI em 5 passos',
    excerpt: 'Formalize seu negócio de forma simples e barata. O MEI custa menos de R$ 70/mês e libera CNPJ, nota fiscal e benefícios do INSS.',
    content: (
      <>
        <p>O <strong>MEI (Microempreendedor Individual)</strong> é a forma mais simples de formalizar um pequeno negócio no Brasil. Custa menos de R$ 70 por mês e libera CNPJ, nota fiscal e benefícios do INSS.</p>
        <h3>1. Verifique se sua atividade é permitida</h3>
        <p>Nem toda atividade pode ser MEI. Consulte a lista oficial no Portal do Empreendedor. Beleza, alimentação, artesanato, serviços gerais e tecnologia em geral são permitidos.</p>
        <h3>2. Acesse o Portal do Empreendedor</h3>
        <p>Entre em <em>gov.br/mei</em> com sua conta gov.br (nível prata ou ouro). Todo o processo é online e gratuito.</p>
        <h3>3. Preencha os dados</h3>
        <ul><li>CPF e dados pessoais</li><li>Endereço do negócio (pode ser sua casa)</li><li>Atividade principal (CNAE)</li><li>Nome fantasia (opcional)</li></ul>
        <h3>4. Escolha o regime tributário</h3>
        <p>Comércio/Indústria ou Serviços. Cada um tem um valor mensal de DAS diferente.</p>
        <h3>5. Pague o primeiro DAS</h3>
        <p>Pronto! Em poucos dias você recebe o CNPJ. Não esqueça de pagar o DAS todo mês (vence dia 20).</p>
        <p><strong>💡 Dica:</strong> você pode começar como pessoa física e abrir o MEI quando começar a faturar acima de R$ 3.000/mês.</p>
      </>
    ),
  },
  {
    id: 2,
    emoji: '🧾',
    title: 'Como emitir nota fiscal sendo autônomo',
    excerpt: 'A nota fiscal é obrigatória em muitos casos e passa credibilidade. Veja como emitir sendo MEI, autônomo ou profissional liberal.',
    content: (
      <>
        <p>Emitir <strong>nota fiscal</strong> passa credibilidade, te protege legalmente e é obrigatório em muitos casos. Veja como funciona em cada situação:</p>
        <h3>Se você é MEI</h3>
        <p>Use o <em>Emissor Nacional de Nota Fiscal</em> (gratuito) ou o sistema da prefeitura da sua cidade. Em alguns municípios, é obrigatório.</p>
        <h3>Se você é autônomo (sem CNPJ)</h3>
        <p>Você pode emitir <strong>RPA (Recibo de Pagamento a Autônomo)</strong> ou nota avulsa pela prefeitura. O cliente retém os impostos na fonte.</p>
        <h3>Se você é profissional liberal (advogado, médico, etc.)</h3>
        <p>Emita pela plataforma da sua ordem profissional (OAB, CRM, etc.) ou pela prefeitura.</p>
        <h3>Quando é obrigatório?</h3>
        <ul><li>Vendas para empresas (CNPJ)</li><li>Serviços acima de determinado valor</li><li>Quando o cliente pede</li></ul>
        <p><strong>💡 Dica:</strong> sempre emita nota, mesmo quando não for obrigatório. Isso te protege em caso de problema e te ajuda a comprovar renda.</p>
      </>
    ),
  },
  {
    id: 3,
    emoji: '📸',
    title: '5 dicas para fotografar seus produtos',
    excerpt: 'Fotos boas vendem muito mais. Aprenda a usar luz natural, fundo neutro e enquadramento mesmo com o celular.',
    content: (
      <>
        <p>Não precisa de câmera profissional. Um celular bom + luz natural já fazem milagre. Veja:</p>
        <h3>1. Use luz natural</h3>
        <p>Fotografe perto de uma janela, entre 9h e 15h. Evite sol direto (faz sombras duras) e luz amarela de lâmpada.</p>
        <h3>2. Fundo neutro</h3>
        <p>Uma parede branca, uma cartolina ou um tecido liso já resolvem. Evite fundos bagunçados.</p>
        <h3>3. Ângulo 45° ou de cima</h3>
        <p>O ângulo "flat lay" (de cima) funciona bem para comida e acessórios. O 45° funciona para peças maiores.</p>
        <h3>4. Aproxime, mas não exagere</h3>
        <p>Mostre detalhes importantes, mas deixe o produto inteiro visível. Use o modo retrato se quiser fundo desfocado.</p>
        <h3>5. Edite com moderação</h3>
        <p>Apps como Lightroom Mobile (grátis) ajustam brilho, contraste e saturação. Nada de filtros exagerados.</p>
        <p><strong>💡 Dica:</strong> fotografe várias opções e escolha as 3 melhores. Qualidade vale mais que quantidade.</p>
      </>
    ),
  },
  {
    id: 4,
    emoji: '💰',
    title: 'Como precificar seu serviço sem medo',
    excerpt: 'Cobrar barato demais desvaloriza seu trabalho. Aprenda a calcular um preço justo que cubra custos, tempo e margem.',
    content: (
      <>
        <p>Precificar errado é o erro nº 1 do empreendedor iniciante. Veja o passo a passo:</p>
        <h3>1. Some os custos diretos</h3>
        <p>Tudo que você gasta para entregar o serviço: material, matéria-prima, transporte, embalagem.</p>
        <h3>2. Calcule sua hora</h3>
        <p>Quanto você quer ganhar por hora trabalhada? Ex: R$ 40/h. Se leva 2h, são R$ 80 de mão de obra.</p>
        <h3>3. Adicione custos fixos</h3>
        <p>Internet, aluguel, energia — tudo diluído no preço final. Se você tem R$ 300/mês de custos fixos e faz 20 serviços, são R$ 15 por serviço.</p>
        <h3>4. Defina sua margem</h3>
        <p>A margem é o que sobra após cobrir tudo. Serviços geralmente têm 30-60% de margem.</p>
        <h3>Fórmula mágica</h3>
        <p><em>Preço = (Custos diretos + Mão de obra + Custos fixos) ÷ (1 − Margem)</em></p>
        <p>Exemplo: (R$ 20 + R$ 80 + R$ 15) ÷ (1 − 0,4) = <strong>R$ 191,67</strong>.</p>
        <p><strong>💡 Dica:</strong> nunca comece cobrando barato pra "atrair cliente". Você atrai quem não valoriza e fica difícil aumentar depois.</p>
      </>
    ),
  },
  {
    id: 5,
    emoji: '📱',
    title: 'Como conseguir os primeiros clientes',
    excerpt: 'Sem clientes, sem negócio. Veja táticas gratuitas para conseguir as primeiras vendas em até 2 semanas.',
    content: (
      <>
        <p>Todo mundo começa sem clientes. A diferença é quem age nos primeiros dias. Veja:</p>
        <h3>1. Fale com conhecidos primeiro</h3>
        <p>Amigos, família, vizinhos — ofereça um preço de "lançamento" em troca de depoimento e indicação.</p>
        <h3>2. Monte um Instagram simples</h3>
        <p>Foto de perfil com seu emoji/logo, bio clara, 6 primeiros posts (mesmo que sejam exemplos fictícios), link do WhatsApp.</p>
        <h3>3. Entre em grupos do bairro</h3>
        <p>Grupos de WhatsApp e Facebook do seu bairro/cidade são ouro para serviços locais.</p>
        <h3>4. Ofereça um "primeiro serviço grátis"</h3>
        <p>Não no sentido de graça, mas um desconto agressivo em troca de depoimento em vídeo e indicação para 2 amigos.</p>
        <h3>5. Faça parcerias</h3>
        <p>Quem já tem seu público pode te indicar em troca de comissão. Salões, pet shops, padarias — todos se ajudam.</p>
        <p><strong>💡 Dica:</strong> meta realista — 3 clientes na primeira semana, 10 no primeiro mês. Foco em qualidade, não quantidade.</p>
      </>
    ),
  },
  {
    id: 6,
    emoji: '💵',
    title: 'Como separar as finanças pessoais e do negócio',
    excerpt: 'Misturar as contas é o caminho mais rápido para a falência. Aprenda a organizar desde o primeiro dia.',
    content: (
      <>
        <p>Misturar o dinheiro do negócio com o pessoal é o erro mais comum e mais perigoso. Veja como separar:</p>
        <h3>1. Conta bancária separada</h3>
        <p>Abra uma conta digital PJ (grátis em Nubank, Inter, Cora). Tudo do negócio passa por lá.</p>
        <h3>2. Defina seu "pró-labore"</h3>
        <p>É o salário que você se paga mensalmente. No começo, simbólico (R$ 500-1.000), mas precisa existir.</p>
        <h3>3. Registre tudo</h3>
        <p>Planilha ou app (Organizze, Mobills). Anote entradas e saídas todo dia.</p>
        <h3>4. Reserve um fundo de emergência</h3>
        <p>10% de tudo que entra vai para uma reserva. Cobre meses ruins e imprevistos.</p>
        <h3>5. Separe impostos desde já</h3>
        <p>Se você é MEI, guarde o valor do DAS todo mês. Se não é, guarde 10-15% para o IR.</p>
        <p><strong>💡 Dica:</strong> trate seu negócio como um cliente. Se você não pagaria a conta atrasada, não deixe a sua própria.</p>
      </>
    ),
  },
  {
    id: 7,
    emoji: '📸',
    title: 'Como usar o Instagram para vender de verdade',
    excerpt: 'Não basta postar fotos bonitas. Entenda como transformar seguidores em clientes pagantes.',
    content: (
      <>
        <p>Ter 10 mil seguidores não significa ter vendas. O que vende é <strong>estratégia de conversão</strong>. Veja como fazer:</p>
        <h3>1. Bio que vende</h3>
        <p>Deixe claro <strong>o que você faz</strong> e <strong>como comprar</strong>. Ex: "🍰 Bolos artesanais · Delivery em SP · Peça pelo link abaixo".</p>
        <h3>2. Destaques organizados</h3>
        <p>Crie destaques para "Produtos", "Depoimentos", "Como funciona" e "Quem somos". Facilita a vida de quem chega no perfil.</p>
        <h3>3. Conteúdo que gera desejo</h3>
        <p>Intercale os 3 tipos de post: <em>Autoridade</em> (dicas), <em>Prova Social</em> (depoimentos) e <em>Oferta</em> (promoções diretas).</p>
        <h3>4. CTA em todo post</h3>
        <p>Toda publicação precisa de uma chamada para ação: "Chama no Direct", "Clique no link da bio", "Comente EU QUERO".</p>
        <h3>5. Responda rápido</h3>
        <p>O Direct é sua loja. Responder em até 15 minutos aumenta absurdamente a chance de fechar a venda.</p>
        <p><strong>💡 Dica:</strong> não poste só quando tem produto novo. Poste todo dia para o algoritmo te mostrar.</p>
      </>
    ),
  },
  {
    id: 8,
    emoji: '📊',
    title: 'O que é e como calcular o Preço de Custo',
    excerpt: 'Você sabe quanto custa o que você vende? Muitos empreendedores descobrem que estão perdendo dinheiro.',
    content: (
      <>
        <p>Preço de custo é <strong>tudo que você gasta para produzir uma unidade do seu produto</strong>. Muita gente esquece itens e acaba "vendendo no prejuízo".</p>
        <h3>O que entra no cálculo?</h3>
        <ul>
          <li><strong>Custos diretos:</strong> matéria-prima, embalagem, frete.</li>
          <li><strong>Custos indiretos:</strong> gás, energia, água usados na produção.</li>
          <li><strong>Mão de obra:</strong> mesmo que seja você mesmo, coloque um valor.</li>
          <li><strong>Taxas:</strong> taxa da maquininha, comissão do marketplace.</li>
        </ul>
        <h3>Exemplo prático (um bolo)</h3>
        <p>Farinha + ovos + açúcar (R$ 15) + embalagem (R$ 3) + gás/energia (R$ 2) + seu tempo (R$ 20) = <strong>R$ 40 de custo</strong>.</p>
        <p>Se você vende por R$ 60, seu lucro real é <strong>R$ 20</strong> (33%), não 60%.</p>
        <p><strong>💡 Dica:</strong> refaça esse cálculo a cada 3 meses. Os preços dos insumos mudam.</p>
      </>
    ),
  },
  {
    id: 9,
    emoji: '😤',
    title: 'Como lidar com clientes difíceis',
    excerpt: 'Todo empreendedor vai passar por isso. Aprenda a transformar um cliente insatisfeito em fã.',
    content: (
      <>
        <p>Não importa o quão bom você seja, <strong>uma hora vai aparecer um cliente difícil</strong>. O segredo é como você reage.</p>
        <h3>1. Respire antes de responder</h3>
        <p>Nunca responda no calor da emoção. Espere 10 minutos, releia a mensagem e só então digite.</p>
        <h3>2. Escute sem interromper</h3>
        <p>Deixe o cliente desabafar. Muitas vezes ele só quer ser ouvido. Anote os pontos principais.</p>
        <h3>3. Use a fórmula "Empatia + Solução"</h3>
        <p>Ex: "Eu entendo sua frustração. Vamos resolver juntos da seguinte forma..."</p>
        <h3>4. Seja firme, mas educado</h3>
        <p>Não precisa aceitar tudo. Se o cliente está errado, mostre os fatos com educação, sem elevar o tom.</p>
        <h3>5. Saiba a hora de dizer "não"</h3>
        <p>Se o cliente é abusivo, não vale a pena o dinheiro. Uma venda perdida é melhor que um problema de cabeça.</p>
        <p><strong>💡 Dica:</strong> clientes insatisfeitos bem atendidos viram os mais fiéis. Estatística mostra que eles contam a história positiva pra 5 pessoas.</p>
      </>
    ),
  },
  {
    id: 10,
    emoji: '🏢',
    title: 'MEI, ME ou LTDA: qual escolher?',
    excerpt: 'Entenda as diferenças entre os tipos de empresa e escolha o certo para o seu momento.',
    content: (
      <>
        <p>Cada tipo de empresa tem regras, impostos e limites diferentes. Veja qual se encaixa no seu momento:</p>
        <h3>MEI (Microempreendedor Individual)</h3>
        <ul>
          <li><strong>Faturamento:</strong> até R$ 81.000/ano.</li>
          <li><strong>Imposto:</strong> valor fixo mensal (DAS), em torno de R$ 70.</li>
          <li><strong>Funcionários:</strong> pode ter 1 empregado.</li>
          <li><strong>Melhor para:</strong> quem está começando e quer testar o negócio.</li>
        </ul>
        <h3>ME (Microempresa)</h3>
        <ul>
          <li><strong>Faturamento:</strong> até R$ 360.000/ano.</li>
          <li><strong>Imposto:</strong> Simples Nacional (varia entre 4% e 19%).</li>
          <li><strong>Funcionários:</strong> sem limite.</li>
          <li><strong>Melhor para:</strong> quem já passou do teto do MEI e quer crescer.</li>
        </ul>
        <h3>LTDA (Sociedade Limitada)</h3>
        <ul>
          <li><strong>Melhor para:</strong> negócios com sócios ou que precisam de mais credibilidade no mercado.</li>
        </ul>
        <p><strong>💡 Dica:</strong> comece como MEI. Quando estourar o limite (R$ 81.000/ano), migre para ME. Só abra LTDA se realmente precisar de sócios.</p>
      </>
    ),
  },
  {
    id: 11,
    emoji: '💸',
    title: 'Como organizar o fluxo de caixa',
    excerpt: 'Fluxo de caixa é o oxigênio do negócio. Sem ele, sua empresa pode morrer mesmo vendendo bem.',
    content: (
      <>
        <p>Você pode ter um mês ótimo de vendas e <strong>quebrar no mês seguinte</strong>. Isso acontece quando não se controla o fluxo de caixa.</p>
        <h3>O que é fluxo de caixa?</h3>
        <p>É o registro de <strong>todo dinheiro que entra e sai</strong> da empresa, dia a dia. Simples assim.</p>
        <h3>Como fazer na prática</h3>
        <ol>
          <li><strong>Anote tudo:</strong> use uma planilha (Google Sheets) ou app (Conta Azul, Mobills).</li>
          <li><strong>Separe por categoria:</strong> Vendas, Materiais, Aluguel, Impostos, Pró-labore.</li>
          <li><strong>Projete o futuro:</strong> saiba quanto vai entrar e sair nos próximos 30 dias.</li>
        </ol>
        <h3>O que observar?</h3>
        <ul>
          <li>Se o caixa está sempre apertado mesmo vendendo bem (custos altos).</li>
          <li>Se você está tirando mais do que deveria para o pessoal.</li>
          <li>Se tem meses de "vaca magra" (planeje reserva).</li>
        </ul>
        <p><strong>💡 Dica:</strong> reserve 30 minutos toda sexta-feira para atualizar o fluxo de caixa. É o hábito que salva empresas.</p>
      </>
    ),
  },
  {
    id: 12,
    emoji: '🧪',
    title: 'O que é MVP e por que você precisa dele',
    excerpt: 'Não gaste R$ 5.000 antes de saber se o negócio funciona. Entenda o conceito de Mínimo Produto Viável.',
    content: (
      <>
        <p><strong>MVP</strong> significa <em>Minimum Viable Product</em> (Mínimo Produto Viável). É a versão mais simples do seu negócio que já permite testar se as pessoas querem comprar.</p>
        <h3>Por que usar?</h3>
        <ul>
          <li>Você gasta pouco no começo.</li>
          <li>Aprende rápido o que funciona.</li>
          <li>Evita investir alto em algo que ninguém quer.</li>
        </ul>
        <h3>Exemplos práticos</h3>
        <p><strong>Se quer fazer bolos:</strong> venda para 5 vizinhos antes de comprar a batedeira profissional.</p>
        <p><strong>Se quer abrir loja de roupa:</strong> venda pelo Instagram antes de alugar um ponto físico.</p>
        <p><strong>Se quer fazer site:</strong> use uma página simples no Notion ou uma landing page gratuita antes de contratar designer.</p>
        <h3>Como validar?</h3>
        <p>Converse com 10 pessoas do seu público. Se pelo menos 3 disserem "eu compraria", você tem sinal verde.</p>
        <p><strong>💡 Dica:</strong> MVP não é produto ruim, é produto <strong>mínimo</strong>. Ele precisa resolver o problema do cliente, mesmo que de forma simples.</p>
      </>
    ),
  },
];

// ─── COMPONENTE ────────────────────────────────────────────
const Guia = () => {
  const [artigoAberto, setArtigoAberto] = useState(null);

  return (
    <>
      <Helmet>
        <title>Guia do Empreendedor | Negócio ao Alcance</title>
      </Helmet>

      <BackgroundDecor />

      <Page>
        <Hero>
          <HeroIcon>📚</HeroIcon>
          <Title>Guia do Empreendedor</Title>
          <Subtitle>
            Conteúdo direto ao ponto pra você tirar seu negócio do papel.
            Sem enrolação, sem termos complicados.
          </Subtitle>
        </Hero>

        <Grid>
          {ARTIGOS.map((artigo) => (
            <Card key={artigo.id} onClick={() => setArtigoAberto(artigo)}>
              <CardEmoji>{artigo.emoji}</CardEmoji>
              <CardTitle>{artigo.title}</CardTitle>
              <CardExcerpt>{artigo.excerpt}</CardExcerpt>
              <ReadMore>Ler artigo →</ReadMore>
            </Card>
          ))}
        </Grid>
      </Page>

      {artigoAberto && (
        <Overlay onClick={() => setArtigoAberto(null)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <CloseBtn onClick={() => setArtigoAberto(null)}>✕</CloseBtn>
            <ModalEmoji>{artigoAberto.emoji}</ModalEmoji>
            <ModalTitle>{artigoAberto.title}</ModalTitle>
            <ModalBody>{artigoAberto.content}</ModalBody>
          </Modal>
        </Overlay>
      )}
    </>
  );
};

export default Guia;