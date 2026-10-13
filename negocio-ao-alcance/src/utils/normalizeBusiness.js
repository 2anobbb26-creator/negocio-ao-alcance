// ─────────────────────────────────────────────────────────────
// Normaliza dados de negócio — aceita formato antigo (string)
// ou novo (objeto) sem quebrar.
// ─────────────────────────────────────────────────────────────

const DIFFICULTY_MAP = {
  easy:   { label: 'Fácil',   color: '#4ade80', bg: 'rgba(74, 222, 128, 0.12)' },
  medium: { label: 'Médio',   color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.12)' },
  hard:   { label: 'Difícil', color: '#f87171', bg: 'rgba(248, 113, 113, 0.12)' },
};

const PRIORITY_MAP = {
  alta:  { label: 'Prioridade alta',  color: '#f87171', bg: 'rgba(248, 113, 113, 0.1)', border: 'rgba(248, 113, 113, 0.3)' },
  media: { label: 'Prioridade média', color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.1)',  border: 'rgba(251, 191, 36, 0.3)' },
  baixa: { label: 'Prioridade baixa', color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.1)', border: 'rgba(148, 163, 184, 0.25)' },
};

const CATEGORY_MAP = {
  equipamento: { label: 'Equipamento', icon: '🔧' },
  software:    { label: 'Software',    icon: '💻' },
  insumo:      { label: 'Insumo',      icon: '📦' },
  servico:     { label: 'Serviço',     icon: '⚙️' },
  curso:       { label: 'Curso',       icon: '🎓' },
  outro:       { label: 'Outro',       icon: '📌' },
};

export const normalizeStep = (step, index) => {
  if (typeof step === 'object' && step !== null) {
    return {
      title: step.title || `Passo ${index + 1}`,
      description: step.description || '',
      estimatedTime: step.estimatedTime || null,
      difficulty: step.difficulty || null,
      resources: step.resources || [],
    };
  }

  return {
    title: step,
    description: '',
    estimatedTime: null,
    difficulty: null,
    resources: [],
  };
};

export const normalizeMaterial = (material) => {
  if (typeof material === 'object' && material !== null) {
    const priceMin = material.priceMin ?? null;
    const priceMax = material.priceMax ?? null;

    let priority = material.priority;
    if (!priority) {
      priority = material.essential === false ? 'baixa' : 'alta';
    }

    return {
      name: material.name || '',
      category: material.category || 'outro',
      priceMin,
      priceMax,
      period: material.period || null,
      essential: material.essential !== false,
      priority,
      description: material.description || '',
      quantity: material.quantity || '',
      tips: material.tips || [],
      whereToBuy: material.whereToBuy || [],
      alternatives: material.alternatives || [],
      canBeShared: material.canBeShared ?? false,
      oneTimeBuy: material.oneTimeBuy ?? true,
    };
  }

  return {
    name: material,
    category: 'outro',
    priceMin: null,
    priceMax: null,
    period: null,
    essential: true,
    priority: 'alta',
    description: '',
    quantity: '',
    tips: [],
    whereToBuy: [],
    alternatives: [],
    canBeShared: false,
    oneTimeBuy: true,
  };
};

export const normalizeClient = (client) => {
  if (typeof client === 'object' && client !== null) {
    return {
      name: client.name || '',
      where: client.where || null,
      tip: client.tip || null,
      ticketMin: client.ticketMin ?? null,
      ticketMax: client.ticketMax ?? null,
    };
  }

  return {
    name: client,
    where: null,
    tip: null,
    ticketMin: null,
    ticketMax: null,
  };
};

export const getDifficultyInfo = (key) => DIFFICULTY_MAP[key] || null;
export const getPriorityInfo   = (key) => PRIORITY_MAP[key]   || null;
export const getCategoryInfo   = (key) => CATEGORY_MAP[key]   || CATEGORY_MAP.outro;

export const formatCurrencyRange = (min, max, period = null) => {
  if (min === null && max === null) return null;
  if (min === 0 && max === 0) return 'Grátis';

  const fmt = (v) => `R$ ${v.toLocaleString('pt-BR')}`;
  let result;

  if (min === max || max === null) {
    result = fmt(min ?? 0);
  } else {
    result = `${fmt(min)} - ${fmt(max)}`;
  }

  return period ? `${result}${period}` : result;
};

// Total apenas dos materiais NÃO marcados (o que falta investir)
export const calcMaterialTotal = (materials, checkedMap = {}) => {
  let totalMin = 0;
  let totalMax = 0;
  let hasPrice = false;

  materials.forEach((m, index) => {
    if (checkedMap[index]) return;
    if (m.priceMin === null && m.priceMax === null) return;

    hasPrice = true;
    totalMin += m.priceMin ?? 0;
    totalMax += m.priceMax ?? m.priceMin ?? 0;
  });

  return hasPrice ? { min: totalMin, max: totalMax } : null;
};

// Total absoluto (ignora marcações)
export const calcMaterialTotalAll = (materials) => {
  let totalMin = 0;
  let totalMax = 0;
  let hasPrice = false;

  materials.forEach((m) => {
    if (m.priceMin === null && m.priceMax === null) return;
    hasPrice = true;
    totalMin += m.priceMin ?? 0;
    totalMax += m.priceMax ?? m.priceMin ?? 0;
  });

  return hasPrice ? { min: totalMin, max: totalMax } : null;
};