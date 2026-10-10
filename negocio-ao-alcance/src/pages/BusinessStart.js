import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import styled, { keyframes } from 'styled-components';
import { businessData } from '../data/businessData';
import { businessSteps } from '../data/businessSteps';
import { useToast } from '../components/Toast';
import {
  normalizeStep,
  normalizeMaterial,
  normalizeClient,
  getDifficultyInfo,
  formatCurrencyRange,
  calcMaterialTotal,
} from '../utils/normalizeBusiness';

// ─── ANIMAÇÕES ─────────────────────────────────────────────
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

// ─── CONTAINER ─────────────────────────────────────────────
const Container = styled.div`
  max-width: 1000px;
  margin: 30px auto;
  padding: 20px;
  animation: ${fadeInUp} 0.6s ease-out;
  position: relative;

  @media (max-width: 480px) {
    margin: 16px auto;
    padding: 16px;
  }
`;

// ─── BREADCRUMB ────────────────────────────────────────────
const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.78rem;
  font-weight: 600;
  color: #7a8a9e;
  margin-bottom: 20px;
  flex-wrap: wrap;

  a {
    color: #7a8a9e;
    text-decoration: none;
    transition: color 0.2s;

    &:hover { color: #7eb8ff; }
  }

  span.sep { color: #4a5a6e; }
  span.current { color: #e8eef7; font-weight: 700; }

  @media (max-width: 480px) { font-size: 0.72rem; }
`;

// ─── HERO ──────────────────────────────────────────────────
const Hero = styled.div`
  background: linear-gradient(135deg,
    rgba(74, 140, 247, 0.12) 0%,
    rgba(168, 85, 247, 0.08) 100%);
  border: 1px solid rgba(74, 140, 247, 0.2);
  border-radius: 24px;
  padding: 36px 32px;
  margin-bottom: 28px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%; right: -20%;
    width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(74, 140, 247, 0.15), transparent 70%);
    pointer-events: none;
  }

  @media (max-width: 480px) {
    padding: 24px 20px;
    border-radius: 20px;
  }
`;

const HeroTitle = styled.h1`
  font-size: 2rem;
  margin: 0 0 10px;
  font-weight: 800;
  letter-spacing: -0.5px;
  background: linear-gradient(135deg, #ffffff 0%, #b8d4ff 50%, #4f7cff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  z-index: 1;

  @media (max-width: 480px) { font-size: 1.5rem; }
`;

const HeroSubtitle = styled.p`
  color: #a8b8d8;
  font-size: 0.95rem;
  margin: 0 0 20px;
  line-height: 1.6;
  position: relative;
  z-index: 1;

  strong { color: #e8eef7; font-weight: 700; }

  @media (max-width: 480px) { font-size: 0.85rem; }
`;

const ProgressBar = styled.div`
  height: 8px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  z-index: 1;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${p => p.$percent}%;
  background: linear-gradient(90deg, #4a8cf7 0%, #22c55e 100%);
  border-radius: 4px;
  transition: width 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 0 10px rgba(34, 197, 94, 0.4);
`;

const ProgressText = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  color: #a8b8d8;
  font-size: 0.78rem;
  font-weight: 700;
  position: relative;
  z-index: 1;

  span { color: #7eb8ff; }
`;

// ─── SECTIONS ──────────────────────────────────────────────
const Section = styled.section`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 22px;
  padding: 30px;
  margin-bottom: 24px;
  position: relative;

  @media (max-width: 768px) { padding: 24px; border-radius: 18px; }
  @media (max-width: 480px) { padding: 20px 16px; border-radius: 16px; }
`;

const SectionTitle = styled.h2`
  color: #e8eef7;
  font-size: 1.15rem;
  margin: 0 0 6px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 800;
  letter-spacing: -0.2px;

  .icon { font-size: 1.3rem; line-height: 1; }

  @media (max-width: 480px) { font-size: 1rem; }
`;

const SectionSubtitle = styled.p`
  color: #8899aa;
  font-size: 0.85rem;
  margin: 0 0 22px;
  line-height: 1.55;

  @media (max-width: 480px) { font-size: 0.78rem; margin-bottom: 18px; }
`;

// ─── STEPS ─────────────────────────────────────────────────
const StepsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const StepItem = styled.div`
  background: ${p => p.$done
    ? 'rgba(34, 197, 94, 0.06)'
    : p.$locked
      ? 'rgba(255, 255, 255, 0.02)'
      : 'rgba(74, 140, 247, 0.05)'};
  border: 1px solid ${p => p.$done
    ? 'rgba(34, 197, 94, 0.25)'
    : p.$locked
      ? 'rgba(255, 255, 255, 0.05)'
      : 'rgba(74, 140, 247, 0.15)'};
  border-radius: 14px;
  padding: 16px 18px;
  cursor: ${p => p.$locked ? 'not-allowed' : 'pointer'};
  transition: all 0.25s ease;
  opacity: ${p => p.$locked ? 0.5 : 1};

  &:hover {
    background: ${p => p.$locked
      ? 'rgba(255, 255, 255, 0.02)'
      : p.$done
        ? 'rgba(34, 197, 94, 0.1)'
        : 'rgba(74, 140, 247, 0.1)'};
    transform: ${p => p.$locked ? 'none' : 'translateY(-2px)'};
  }

  @media (max-width: 480px) { padding: 14px; }
`;

const StepTop = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
`;

const StepNumber = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 800;
  flex-shrink: 0;
  transition: all 0.3s ease;

  background: ${p => p.$done
    ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
    : p.$locked
      ? 'rgba(255, 255, 255, 0.04)'
      : 'rgba(74, 140, 247, 0.18)'};

  border: 2px solid ${p => p.$done
    ? 'rgba(34, 197, 94, 0.6)'
    : p.$locked
      ? 'rgba(255, 255, 255, 0.08)'
      : 'rgba(74, 140, 247, 0.35)'};

  color: ${p => p.$done
    ? '#fff'
    : p.$locked
      ? '#4a5a6e'
      : '#7eb8ff'};

  box-shadow: ${p => p.$done
    ? '0 4px 14px rgba(34, 197, 94, 0.35)'
    : 'none'};

  svg { width: 16px; height: 16px; }
`;

const StepContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const StepTitle = styled.div`
  color: ${p => p.$done ? '#a8b8d8' : '#e8eef7'};
  font-size: 0.95rem;
  font-weight: 700;
  text-decoration: ${p => p.$done ? 'line-through' : 'none'};
  text-decoration-thickness: 1.5px;
  text-decoration-color: rgba(168, 184, 216, 0.5);
  line-height: 1.45;
  margin-bottom: ${p => p.$hasMeta ? '8px' : '0'};

  @media (max-width: 480px) { font-size: 0.88rem; }
`;

const StepDescription = styled.p`
  color: #8899aa;
  font-size: 0.82rem;
  line-height: 1.55;
  margin: 0 0 10px;
`;

const StepMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const MetaChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;

  background: ${p => p.$bg || 'rgba(255, 255, 255, 0.05)'};
  color: ${p => p.$color || '#94a3b8'};
  border: 1px solid ${p => p.$border || 'rgba(255, 255, 255, 0.08)'};
`;

const ResourcesLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  color: #7eb8ff;
  text-decoration: none;
  margin-top: 8px;
  font-weight: 600;

  &:hover { color: #a8ccff; text-decoration: underline; }
`;

// ─── MATERIAIS ─────────────────────────────────────────────
const MaterialsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const MaterialItem = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  background: rgba(74, 140, 247, 0.04);
  border: 1px solid rgba(74, 140, 247, 0.1);
  border-radius: 12px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(74, 140, 247, 0.08);
    border-color: rgba(74, 140, 247, 0.25);
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    padding: 12px 14px;
  }
`;

const MaterialCheckbox = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 6px;
  border: 2px solid ${p => p.$checked
    ? 'rgba(34, 197, 94, 0.6)'
    : 'rgba(74, 140, 247, 0.35)'};
  background: ${p => p.$checked
    ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
    : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  cursor: pointer;
  transition: all 0.2s ease;

  svg {
    width: 12px;
    height: 12px;
    color: #fff;
    stroke-width: 3;
  }
`;

const MaterialInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const MaterialName = styled.div`
  color: #e8eef7;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 4px;

  @media (max-width: 480px) { font-size: 0.85rem; }
`;

const MaterialTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const MaterialTag = styled.span`
  font-size: 0.62rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 2px 8px;
  border-radius: 999px;

  color: ${p => p.$essential ? '#4ade80' : '#94a3b8'};
  background: ${p => p.$essential
    ? 'rgba(74, 222, 128, 0.1)'
    : 'rgba(148, 163, 184, 0.1)'};
  border: 1px solid ${p => p.$essential
    ? 'rgba(74, 222, 128, 0.3)'
    : 'rgba(148, 163, 184, 0.2)'};
`;

const MaterialPrice = styled.div`
  color: #86efac;
  font-size: 0.85rem;
  font-weight: 700;
  white-space: nowrap;

  @media (max-width: 480px) { font-size: 0.8rem; }
`;

const MaterialTotal = styled.div`
  margin-top: 16px;
  padding: 16px 20px;
  background: linear-gradient(135deg,
    rgba(74, 222, 128, 0.08),
    rgba(34, 197, 94, 0.04));
  border: 1px solid rgba(74, 222, 128, 0.25);
  border-radius: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;

  .label {
    color: #a8d5b8;
    font-size: 0.78rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .value {
    color: #86efac;
    font-size: 1.05rem;
    font-weight: 800;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
    padding: 14px 16px;

    .value { font-size: 0.95rem; }
  }
`;

// ─── CLIENTES ──────────────────────────────────────────────
const ClientsList = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
`;

const ClientItem = styled.div`
  padding: 16px 18px;
  background: rgba(74, 140, 247, 0.04);
  border: 1px solid rgba(74, 140, 247, 0.1);
  border-radius: 12px;

  &:hover {
    background: rgba(74, 140, 247, 0.07);
    border-color: rgba(74, 140, 247, 0.2);
  }
`;

const ClientName = styled.div`
  color: #e8eef7;
  font-size: 0.92rem;
  font-weight: 700;
  margin-bottom: 8px;
`;

const ClientDetail = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  color: #a8b8d8;
  font-size: 0.8rem;
  line-height: 1.5;
  margin-bottom: 4px;

  .emoji { flex-shrink: 0; font-size: 0.85rem; }
  strong { color: #cbd9ee; font-weight: 700; }
`;

// ─── PRICING TABLE ─────────────────────────────────────────
const PricingTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const PricingRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.2fr 0.9fr;
  gap: 12px;
  padding: 14px 16px;
  background: ${p => p.$header
    ? 'rgba(74, 140, 247, 0.12)'
    : 'rgba(74, 140, 247, 0.04)'};
  border: 1px solid rgba(74, 140, 247, 0.1);
  border-radius: 10px;
  align-items: center;
  font-size: 0.85rem;

  span {
    color: ${p => p.$header ? '#a8ccff' : '#cbd9ee'};
    font-weight: ${p => p.$header ? 800 : 600};
    text-transform: ${p => p.$header ? 'uppercase' : 'none'};
    letter-spacing: ${p => p.$header ? '0.06em' : '0'};
    font-size: ${p => p.$header ? '0.7rem' : '0.85rem'};
  }

  span.price { color: #86efac; font-weight: 800; }
  span.time  { color: #a8b8d8; font-weight: 600; }

  @media (max-width: 480px) {
    grid-template-columns: 1fr 1fr;
    gap: 6px;
    padding: 12px;

    span.time { grid-column: 1 / -1; font-size: 0.75rem; }
  }
`;

const PricingNote = styled.p`
  margin: 16px 0 0;
  padding: 12px 16px;
  background: rgba(251, 191, 36, 0.06);
  border: 1px solid rgba(251, 191, 36, 0.2);
  border-radius: 10px;
  color: #fbbf24;
  font-size: 0.8rem;
  line-height: 1.5;
  font-weight: 500;
`;

// ─── TIMELINE ──────────────────────────────────────────────
const Timeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TimelineRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 16px;
  background: rgba(74, 140, 247, 0.04);
  border: 1px solid rgba(74, 140, 247, 0.1);
  border-radius: 12px;

  @media (max-width: 480px) { padding: 10px 12px; gap: 10px; }
`;

const TimelineDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #4f7cff;
  box-shadow: 0 0 8px rgba(79, 124, 255, 0.6);
  flex-shrink: 0;
`;

const TimelineLabel = styled.div`
  color: #7eb8ff;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  min-width: 80px;
  flex-shrink: 0;

  @media (max-width: 480px) { min-width: 70px; font-size: 0.7rem; }
`;

const TimelineText = styled.div`
  color: #cbd9ee;
  font-size: 0.87rem;
  font-weight: 500;
  line-height: 1.45;
`;

// ─── FOOTER ACTIONS ────────────────────────────────────────
const ActionsFooter = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 8px;

  @media (max-width: 480px) {
    flex-direction: column;

    > * { width: 100%; justify-content: center; }
  }
`;

const ButtonPrimary = styled.button`
  flex: 1;
  min-width: 200px;
  padding: 16px 24px;
  border-radius: 14px;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  background: linear-gradient(135deg, #2563eb 0%, #4f7cff 50%, #7c5cff 100%);
  background-size: 200% 100%;
  box-shadow: 0 10px 28px -10px rgba(37, 99, 235, 0.7);
  transition: all 0.3s ease;

  &:hover {
    background-position: 100% 50%;
    transform: translateY(-2px);
    box-shadow: 0 14px 34px -10px rgba(37, 99, 235, 0.9);
  }

  &:active { transform: translateY(0) scale(0.98); }
`;

const ButtonGhost = styled(Link)`
  padding: 16px 24px;
  border-radius: 14px;
  border: 1px solid rgba(74, 140, 247, 0.3);
  background: rgba(74, 140, 247, 0.06);
  color: #a8ccff;
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.25s ease;

  &:hover {
    background: rgba(74, 140, 247, 0.15);
    border-color: rgba(74, 140, 247, 0.5);
    color: #fff;
  }
`;

// ─── NOT FOUND ─────────────────────────────────────────────
const NotFound = styled.div`
  text-align: center;
  padding: 70px 40px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.06);

  h2 { color: #e8eef7; font-size: 1.8rem; margin-bottom: 12px; font-weight: 800; }
  p  { color: #a8b8d8; margin-bottom: 24px; font-size: 0.95rem; }
`;

// ─── ÍCONES ────────────────────────────────────────────────
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

// ─── COMPONENTE ────────────────────────────────────────────
const BusinessStart = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const business = useMemo(
    () => businessData.find(b => b.id === parseInt(id)),
    [id]
  );

  const [completedSteps, setCompletedSteps] = useState({});
  const [checkedMaterials, setCheckedMaterials] = useState({});

  // ─── Carrega progresso salvo ─────────────────────────────
  useEffect(() => {
    if (!business) return;

    const savedSteps = localStorage.getItem(`steps_${business.id}`);
    if (savedSteps) {
      try { setCompletedSteps(JSON.parse(savedSteps)); }
      catch { setCompletedSteps({}); }
    } else {
      setCompletedSteps({});
    }

    const savedMats = localStorage.getItem(`materials_${business.id}`);
    if (savedMats) {
      try { setCheckedMaterials(JSON.parse(savedMats)); }
      catch { setCheckedMaterials({}); }
    } else {
      setCheckedMaterials({});
    }
  }, [business]);

  // ─── Normaliza dados ─────────────────────────────────────
  const steps = useMemo(() => {
    if (!business) return [];
    const raw = businessSteps[business.name] || [];
    return raw.map((s, i) => normalizeStep(s, i));
  }, [business]);

  const materials = useMemo(() => {
    if (!business?.materials) return [];
    return business.materials.map(normalizeMaterial);
  }, [business]);

  const clients = useMemo(() => {
    if (!business?.potentialClients) return [];
    return business.potentialClients.map(normalizeClient);
  }, [business]);

  const pricing = useMemo(() => {
    return business?.pricing || null;
  }, [business]);

  const materialTotal = useMemo(() => calcMaterialTotal(materials), [materials]);
  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPct = steps.length > 0 ? (completedCount / steps.length) * 100 : 0;

  // ─── Toggle step (sequencial) ────────────────────────────
  const toggleStep = (index) => {
    if (!completedSteps[index]) {
      const previousDone = index === 0 || completedSteps[index - 1];
      if (!previousDone) return;
    }

    const newState = { ...completedSteps };
    if (newState[index]) {
      for (let i = index; i < steps.length; i++) delete newState[i];
    } else {
      newState[index] = true;
    }

    setCompletedSteps(newState);
    localStorage.setItem(`steps_${business.id}`, JSON.stringify(newState));

    if (newState[index]) {
      const done = Object.values(newState).filter(Boolean).length;
      if (done === steps.length) {
        showToast('🎉 Parabéns! Você completou todos os passos!', 'success', 4000);
      } else {
        showToast(`✅ Passo ${index + 1} concluído!`, 'success', 1800);
      }
    }
  };

  const toggleMaterial = (index) => {
    const newState = { ...checkedMaterials, [index]: !checkedMaterials[index] };
    setCheckedMaterials(newState);
    localStorage.setItem(`materials_${business.id}`, JSON.stringify(newState));
  };

  // ─── Not found ───────────────────────────────────────────
  if (!business) {
    return (
      <Container>
        <Helmet>
          <title>Serviço não encontrado | Negócio ao Alcance</title>
        </Helmet>
        <NotFound>
          <h2>😕 Serviço não encontrado</h2>
          <p>O serviço que você procura não existe ou foi removido.</p>
          <ButtonGhost to="/">
            <ArrowLeftIcon />
            Voltar para o início
          </ButtonGhost>
        </NotFound>
      </Container>
    );
  }

  const essentials = materials.filter(m => m.essential);
  const optionals  = materials.filter(m => !m.essential);

  return (
    <Container>
      <Helmet>
        <title>Meu plano — {business.name} | Negócio ao Alcance</title>
        <meta name="description" content={`Roteiro completo, materiais e orçamento para começar: ${business.name}`} />
      </Helmet>

      <Breadcrumb>
        <Link to="/">Início</Link>
        <span className="sep">›</span>
        <Link to={`/business/${business.id}`}>{business.category}</Link>
        <span className="sep">›</span>
        <Link to={`/business/${business.id}`}>{business.name}</Link>
        <span className="sep">›</span>
        <span className="current">Meu plano</span>
      </Breadcrumb>

      {/* ─── HERO ─────────────────────────────────────────── */}
      <Hero>
        <HeroTitle>🚀 Vamos começar!</HeroTitle>
        <HeroSubtitle>
          Siga o roteiro abaixo para tirar <strong>{business.name}</strong> do papel.
          Marque cada etapa concluída para acompanhar seu progresso.
        </HeroSubtitle>

        <ProgressBar>
          <ProgressFill $percent={progressPct} />
        </ProgressBar>
        <ProgressText>
          <span>{completedCount} de {steps.length} etapas concluídas</span>
          <span>{Math.round(progressPct)}%</span>
        </ProgressText>
      </Hero>

      {/* ─── ROTEIRO ──────────────────────────────────────── */}
      {steps.length > 0 && (
        <Section>
          <SectionTitle>
            <span className="icon">🎯</span>
            Roteiro de ação
          </SectionTitle>
          <SectionSubtitle>
            Conclua cada etapa para desbloquear a próxima. Seu progresso fica salvo.
          </SectionSubtitle>

          <StepsList>
            {steps.map((step, index) => {
              const isDone = !!completedSteps[index];
              const isLocked = !isDone && index > 0 && !completedSteps[index - 1];
              const difficulty = getDifficultyInfo(step.difficulty);
              const hasMeta = step.estimatedTime || difficulty;

              return (
                <StepItem
                  key={index}
                  $done={isDone}
                  $locked={isLocked}
                  onClick={() => !isLocked && toggleStep(index)}
                  role="button"
                  tabIndex={isLocked ? -1 : 0}
                  aria-disabled={isLocked}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isLocked) toggleStep(index);
                  }}
                >
                  <StepTop>
                    <StepNumber $done={isDone} $locked={isLocked}>
                      {isDone ? <CheckIcon /> : isLocked ? <LockIcon /> : index + 1}
                    </StepNumber>

                    <StepContent>
                      <StepTitle $done={isDone} $hasMeta={hasMeta}>
                        {step.title}
                      </StepTitle>

                      {step.description && (
                        <StepDescription>{step.description}</StepDescription>
                      )}

                      {hasMeta && (
                        <StepMeta>
                          {step.estimatedTime && (
                            <MetaChip
                              $bg="rgba(96, 165, 250, 0.1)"
                              $color="#60a5fa"
                              $border="rgba(96, 165, 250, 0.3)"
                            >
                              ⏱ {step.estimatedTime}
                            </MetaChip>
                          )}
                          {difficulty && (
                            <MetaChip
                              $bg={difficulty.bg}
                              $color={difficulty.color}
                              $border={`${difficulty.color}55`}
                            >
                              {difficulty.label}
                            </MetaChip>
                          )}
                        </StepMeta>
                      )}

                      {step.resources.length > 0 && (
                        <ResourcesLink
                          href={step.resources[0].url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          🔗 {step.resources[0].label}
                        </ResourcesLink>
                      )}
                    </StepContent>
                  </StepTop>
                </StepItem>
              );
            })}
          </StepsList>
        </Section>
      )}

      {/* ─── MATERIAIS ────────────────────────────────────── */}
      {materials.length > 0 && (
        <Section>
          <SectionTitle>
            <span className="icon">📦</span>
            Materiais necessários
          </SectionTitle>
          <SectionSubtitle>
            Marque o que você já tem. O valor é uma estimativa inicial.
          </SectionSubtitle>

          <MaterialsList>
            {materials.map((material, index) => {
              const price = formatCurrencyRange(
                material.priceMin,
                material.priceMax,
                material.period
              );
              const isChecked = !!checkedMaterials[index];

              return (
                <MaterialItem key={index}>
                  <MaterialCheckbox
                    $checked={isChecked}
                    onClick={() => toggleMaterial(index)}
                  >
                    {isChecked && <CheckIcon />}
                  </MaterialCheckbox>

                  <MaterialInfo>
                    <MaterialName>{material.name}</MaterialName>
                    <MaterialTags>
                      <MaterialTag $essential={material.essential}>
                        {material.essential ? 'Essencial' : 'Opcional'}
                      </MaterialTag>
                    </MaterialTags>
                  </MaterialInfo>

                  {price && <MaterialPrice>{price}</MaterialPrice>}
                </MaterialItem>
              );
            })}
          </MaterialsList>

          {materialTotal && (
            <MaterialTotal>
              <span className="label">💰 Investimento estimado</span>
              <span className="value">
                {formatCurrencyRange(materialTotal.min, materialTotal.max)}
              </span>
            </MaterialTotal>
          )}
        </Section>
      )}

      {/* ─── CLIENTES ─────────────────────────────────────── */}
      {clients.length > 0 && (
        <Section>
          <SectionTitle>
            <span className="icon">👥</span>
            Potenciais clientes
          </SectionTitle>
          <SectionSubtitle>
            Perfis de quem pode comprar seu serviço e onde encontrá-los.
          </SectionSubtitle>

          <ClientsList>
            {clients.map((client, index) => (
              <ClientItem key={index}>
                <ClientName>{client.name}</ClientName>

                {client.where && (
                  <ClientDetail>
                    <span className="emoji">📍</span>
                    <span><strong>Onde:</strong> {client.where}</span>
                  </ClientDetail>
                )}

                {client.tip && (
                  <ClientDetail>
                    <span className="emoji">💡</span>
                    <span><strong>Abordagem:</strong> {client.tip}</span>
                  </ClientDetail>
                )}

                {(client.ticketMin !== null || client.ticketMax !== null) && (
                  <ClientDetail>
                    <span className="emoji">💵</span>
                    <span>
                      <strong>Ticket médio:</strong>{' '}
                      {formatCurrencyRange(client.ticketMin, client.ticketMax)}
                    </span>
                  </ClientDetail>
                )}
              </ClientItem>
            ))}
          </ClientsList>
        </Section>
      )}

      {/* ─── TABELA DE PREÇOS ─────────────────────────────── */}
      {pricing && pricing.length > 0 && (
        <Section>
          <SectionTitle>
            <span className="icon">📊</span>
            Quanto cobrar?
          </SectionTitle>
          <SectionSubtitle>
            Sugestão de faixa de preço baseada no seu nível de experiência.
          </SectionSubtitle>

          <PricingTable>
            <PricingRow $header>
              <span>Nível</span>
              <span>Preço sugerido</span>
              <span className="time">Prazo</span>
            </PricingRow>

            {pricing.map((row, index) => (
              <PricingRow key={index}>
                <span>{row.level}</span>
                <span className="price">
                  {formatCurrencyRange(row.min, row.max)}
                </span>
                <span className="time">{row.time}</span>
              </PricingRow>
            ))}
          </PricingTable>

          <PricingNote>
            💡 Dica: comece pelo nível iniciante. Conforme seu portfólio cresce,
            aumente os preços gradualmente.
          </PricingNote>
        </Section>
      )}

      {/* ─── TIMELINE (opcional) ──────────────────────────── */}
      {business.startTimeline && business.startTimeline.length > 0 && (
        <Section>
          <SectionTitle>
            <span className="icon">🗓️</span>
            Cronograma sugerido
          </SectionTitle>
          <SectionSubtitle>
            Uma referência de ritmo para tirar o negócio do papel em 4 semanas.
          </SectionSubtitle>

          <Timeline>
            {business.startTimeline.map((item, index) => (
              <TimelineRow key={index}>
                <TimelineDot />
                <TimelineLabel>{item.week}</TimelineLabel>
                <TimelineText>{item.task}</TimelineText>
              </TimelineRow>
            ))}
          </Timeline>
        </Section>
      )}

      {/* ─── FOOTER ───────────────────────────────────────── */}
      <ActionsFooter>
        <ButtonPrimary
          onClick={() => {
            showToast('✅ Plano salvo! Bom trabalho 🚀', 'success', 2500);
          }}
        >
          ✅ Salvar meu plano
        </ButtonPrimary>

        <ButtonGhost to={`/business/${business.id}`}>
          <ArrowLeftIcon />
          Voltar aos detalhes
        </ButtonGhost>
      </ActionsFooter>
    </Container>
  );
};

export default BusinessStart;