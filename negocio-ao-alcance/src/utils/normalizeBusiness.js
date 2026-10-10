// ─────────────────────────────────────────────────────────────
// Normaliza dados de negócio — aceita formato antigo (string)
// ou novo (objeto) sem quebrar.
// ─────────────────────────────────────────────────────────────

const DIFFICULTY_MAP = {
  easy:   { label: 'Fácil', color: '#4ade80', bg: 'rgba(74, 222, 128, 0.12)' },
  medium: { label: 'Médio', color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.12)' },
  hard:   { label: 'Difícil', color: '#f87171', bg: 'rgba(248, 113, 113, 0.12)' },
};

export const normalizeStep = (step, index) => {
  // Já é objeto?
  if (typeof step === 'object' && step !== null) {
    return {
      title: step.title || `Passo ${index + 1}`,
      description: step.description || '',
      estimatedTime: step.estimatedTime || null,
      difficulty: step.difficulty || null,
      resources: step.resources || [],
    };
  }

  // É string (formato antigo)
  return {
    title: step,
    description: '',
    estimatedTime: null,
    difficulty: null,
    resources: [],
  };
};

export const normalizeMaterial = (material) => {
  // Objeto completo
  if (typeof material === 'object' && material !== null) {
    return {
      name: material.name || '',
      priceMin: material.priceMin ?? null,
      priceMax: material.priceMax ?? null,
      period: material.period || null,
      essential: material.essential !== false, // default true
    };
  }

  // String antiga
  return {
    name: material,
    priceMin: null,
    priceMax: null,
    period: null,
    essential: true,
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

export const calcMaterialTotal = (materials) => {
  let totalMin = 0;
  let totalMax = 0;
  let hasPrice = false;

  materials.forEach(m => {
    if (m.priceMin === null && m.priceMax === null) return;
    hasPrice = true;
    totalMin += m.priceMin ?? 0;
    totalMax += m.priceMax ?? m.priceMin ?? 0;
  });

  return hasPrice ? { min: totalMin, max: totalMax } : null;
};