import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import styled, { keyframes } from 'styled-components';
import { businessData } from '../data/businessData';
import { businessSteps } from '../data/businessSteps';
import { useToast } from '../components/Toast';
import { generatePlanPDF } from '../utils/generatePlanPDF';
import {
  normalizeStep,
  normalizeMaterial,
  normalizeClient,
  getDifficultyInfo,
  formatCurrencyRange,
  calcMaterialTotal,
  calcMaterialTotalAll,
} from '../utils/normalizeBusiness';

/* ═══════════════════════════════════════════════════════════
   ANIMAÇÕES
   ═══════════════════════════════════════════════════════════ */
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50%      { opacity: 0.7; transform: scale(1.05); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50%      { transform: translateY(-12px); }
`;

/* ═══════════════════════════════════════════════════════════
   LAYOUT
   ═══════════════════════════════════════════════════════════ */
const Page = styled.div`
  min-height: 100vh;
  padding: 32px 20px 80px;
  position: relative;
  overflow-x: hidden;

  @media (max-width: 480px) {
    padding: 20px 14px 60px;
  }
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

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  animation: ${fadeInUp} 0.6s ease-out;
`;

/* ═══════════════════════════════════════════════════════════
   TOP BAR
   ═══════════════════════════════════════════════════════════ */
const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;

    > * { width: 100%; }
  }
`;

const Breadcrumb = styled.nav`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.78rem;
  font-weight: 600;
  color: #7a8a9e;
  flex-wrap: wrap;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 999px;
  width: fit-content;
  max-width: 100%;
  backdrop-filter: blur(10px);

  a {
    color: #7a8a9e;
    text-decoration: none;
    transition: color 0.2s;
    white-space: nowrap;

    &:hover { color: #7eb8ff; }
  }

  .sep {
    color: #4a5a6e;
    opacity: 0.6;
  }

  .current {
    color: #e8eef7;
    font-weight: 700;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 220px;
  }

  @media (max-width: 480px) {
    font-size: 0.7rem;
    padding: 8px 12px;

    .current { max-width: 120px; }
  }
`;

const BackToDetailsBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 999px;

  background: rgba(74, 140, 247, 0.06);
  border: 1px solid rgba(74, 140, 247, 0.28);
  color: #a8ccff;
  font-family: inherit;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  text-decoration: none;
  white-space: nowrap;
  transition: all 0.2s ease;

  svg {
    width: 15px;
    height: 15px;
    transition: transform 0.2s ease;
  }

  &:hover {
    background: rgba(74, 140, 247, 0.14);
    border-color: rgba(74, 140, 247, 0.5);
    color: #fff;
    transform: translateY(-1px);

    svg { transform: translateX(-3px); }
  }

  &:active { transform: translateY(0) scale(0.98); }

  @media (max-width: 640px) {
    padding: 12px 16px;
    font-size: 0.74rem;
  }
`;

/* ═══════════════════════════════════════════════════════════
   HERO
   ═══════════════════════════════════════════════════════════ */
const Hero = styled.header`
  position: relative;
  padding: 40px 36px 32px;
  margin-bottom: 28px;
  border-radius: 26px;
  overflow: hidden;

  background:
    radial-gradient(ellipse at 0% 0%, rgba(74, 140, 247, 0.14), transparent 55%),
    radial-gradient(ellipse at 100% 100%, rgba(168, 85, 247, 0.1), transparent 55%),
    linear-gradient(160deg, rgba(255, 255, 255, 0.045) 0%, rgba(255, 255, 255, 0.015) 100%);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    0 20px 60px -20px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg,
      #4f7cff 0%, #7eb8ff 30%, #a855f7 60%, #ec4899 100%);
    background-size: 200% 100%;
    animation: ${shimmer} 6s linear infinite;
  }

  @media (max-width: 640px) {
    padding: 32px 24px 26px;
    border-radius: 22px;
  }

  @media (max-width: 480px) {
    padding: 26px 20px 22px;
    border-radius: 20px;
  }
`;

const HeroLabel = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  margin-bottom: 16px;
  background: rgba(74, 140, 247, 0.12);
  border: 1px solid rgba(74, 140, 247, 0.3);
  border-radius: 999px;
  color: #a8ccff;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #22c55e;
    box-shadow: 0 0 10px #22c55e;
    animation: ${pulse} 2s ease-in-out infinite;
  }

  @media (max-width: 480px) {
    font-size: 0.62rem;
    padding: 5px 11px;
  }
`;

const HeroTitle = styled.h1`
  margin: 0 0 12px;
  font-size: clamp(1.6rem, 4vw, 2.2rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.15;
  background: linear-gradient(135deg,
    #ffffff 0%,
    #d0e0ff 40%,
    #7eb8ff 70%,
    #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const HeroSubtitle = styled.p`
  color: #a8b8d8;
  font-size: 0.95rem;
  margin: 0 0 26px;
  line-height: 1.6;
  max-width: 620px;

  strong { color: #e8eef7; font-weight: 700; }

  @media (max-width: 480px) {
    font-size: 0.85rem;
    margin-bottom: 20px;
  }
`;

const ProgressWrapper = styled.div`
  position: relative;
  margin-top: 8px;
`;

const ProgressBar = styled.div`
  height: 10px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 999px;
  overflow: hidden;
  position: relative;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${p => p.$percent}%;
  background: linear-gradient(90deg, #4f7cff 0%, #22c55e 100%);
  border-radius: 999px;
  transition: width 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 0 16px rgba(34, 197, 94, 0.45);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg,
      transparent, rgba(255, 255, 255, 0.35), transparent);
    background-size: 200% 100%;
    animation: ${shimmer} 2.5s linear infinite;
    border-radius: inherit;
  }
`;

const ProgressMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  font-size: 0.78rem;
  font-weight: 700;

  .label {
    color: #a8b8d8;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .value {
    color: #86efac;
    font-size: 0.95rem;
    font-weight: 800;
    letter-spacing: -0.01em;
  }

  @media (max-width: 480px) {
    font-size: 0.72rem;

    .value { font-size: 0.85rem; }
  }
`;

/* ═══════════════════════════════════════════════════════════
   SECTION
   ═══════════════════════════════════════════════════════════ */
const Section = styled.section`
  position: relative;
  padding: 32px 32px 28px;
  margin-bottom: 24px;
  border-radius: 24px;
  overflow: hidden;

  background: linear-gradient(160deg,
    rgba(255, 255, 255, 0.035) 0%,
    rgba(255, 255, 255, 0.012) 100%);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.07);
  box-shadow: 0 12px 40px -16px rgba(0, 0, 0, 0.35);

  animation: ${fadeInUp} 0.6s ease-out both;

  @media (max-width: 768px) { padding: 26px 22px; border-radius: 20px; }
  @media (max-width: 480px) { padding: 22px 18px; border-radius: 18px; }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 22px;

  @media (max-width: 480px) {
    gap: 12px;
    margin-bottom: 18px;
  }
`;

const SectionIcon = styled.div`
  width: 46px;
  height: 46px;
  border-radius: 14px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  font-size: 1.4rem;
  line-height: 1;

  background: radial-gradient(circle at 30% 30%,
    rgba(126, 184, 255, 0.22),
    rgba(168, 85, 247, 0.12));
  border: 1px solid rgba(126, 184, 255, 0.22);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 4px 14px -6px rgba(74, 140, 247, 0.35);

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
    border-radius: 12px;
  }
`;

const SectionTitleBlock = styled.div`
  flex: 1;
  min-width: 0;
`;

const SectionTitle = styled.h2`
  margin: 0 0 4px;
  font-size: 1.15rem;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: #eef4ff;
  line-height: 1.25;

  @media (max-width: 480px) { font-size: 1.02rem; }
`;

const SectionSubtitle = styled.p`
  margin: 0;
  color: #8899aa;
  font-size: 0.85rem;
  line-height: 1.5;

  @media (max-width: 480px) { font-size: 0.78rem; }
`;

/* ═══════════════════════════════════════════════════════════
   STEPS
   ═══════════════════════════════════════════════════════════ */
const StepsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
`;

const StepItem = styled.div`
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 16px 18px;
  border-radius: 16px;
  cursor: ${p => p.$locked ? 'not-allowed' : 'pointer'};
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: ${p => p.$locked ? 0.5 : 1};

  background: ${p => p.$done
    ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.08), rgba(34, 197, 94, 0.03))'
    : p.$locked
      ? 'rgba(255, 255, 255, 0.02)'
      : 'linear-gradient(135deg, rgba(74, 140, 247, 0.06), rgba(74, 140, 247, 0.02))'};

  border: 1px solid ${p => p.$done
    ? 'rgba(34, 197, 94, 0.28)'
    : p.$locked
      ? 'rgba(255, 255, 255, 0.05)'
      : 'rgba(74, 140, 247, 0.16)'};

  &:hover {
    transform: ${p => p.$locked ? 'none' : 'translateY(-2px)'};
    border-color: ${p => p.$locked
      ? 'rgba(255, 255, 255, 0.05)'
      : p.$done
        ? 'rgba(34, 197, 94, 0.5)'
        : 'rgba(74, 140, 247, 0.4)'};
    box-shadow: ${p => p.$locked
      ? 'none'
      : p.$done
        ? '0 8px 24px -8px rgba(34, 197, 94, 0.3)'
        : '0 8px 24px -8px rgba(74, 140, 247, 0.3)'};
  }

  @media (max-width: 480px) {
    padding: 14px 14px;
    gap: 12px;
    border-radius: 14px;
  }
`;

const StepNumber = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  font-size: 0.9rem;
  font-weight: 800;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  background: ${p => p.$done
    ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
    : p.$locked
      ? 'rgba(255, 255, 255, 0.04)'
      : 'linear-gradient(135deg, rgba(74, 140, 247, 0.25), rgba(74, 140, 247, 0.12))'};

  border: 1.5px solid ${p => p.$done
    ? 'rgba(34, 197, 94, 0.6)'
    : p.$locked
      ? 'rgba(255, 255, 255, 0.08)'
      : 'rgba(74, 140, 247, 0.4)'};

  color: ${p => p.$done ? '#fff' : p.$locked ? '#4a5a6e' : '#a8ccff'};

  box-shadow: ${p => p.$done
    ? '0 6px 18px -4px rgba(34, 197, 94, 0.5)'
    : 'none'};

  svg {
    width: 18px;
    height: 18px;
    stroke-width: 3;
  }

  @media (max-width: 480px) {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    font-size: 0.82rem;

    svg { width: 16px; height: 16px; }
  }
`;

const StepContent = styled.div`
  flex: 1;
  min-width: 0;
  padding-top: 2px;
`;

const StepTitle = styled.div`
  color: ${p => p.$done ? '#a8b8d8' : '#eef4ff'};
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1.45;
  text-decoration: ${p => p.$done ? 'line-through' : 'none'};
  text-decoration-thickness: 1.5px;
  text-decoration-color: rgba(168, 184, 216, 0.5);
  margin-bottom: ${p => p.$hasMeta ? '8px' : '0'};

  @media (max-width: 480px) { font-size: 0.88rem; }
`;

const StepDescription = styled.p`
  color: #8899aa;
  font-size: 0.83rem;
  line-height: 1.55;
  margin: 0 0 10px;

  @media (max-width: 480px) { font-size: 0.78rem; }
`;

const StepMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
`;

const MetaChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 0.66rem;
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
  gap: 6px;
  margin-top: 10px;
  padding: 6px 12px;
  background: rgba(74, 140, 247, 0.1);
  border: 1px solid rgba(74, 140, 247, 0.25);
  border-radius: 8px;
  font-size: 0.76rem;
  color: #a8ccff;
  text-decoration: none;
  font-weight: 600;
  width: fit-content;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(74, 140, 247, 0.18);
    border-color: rgba(74, 140, 247, 0.45);
    color: #fff;
    transform: translateY(-1px);
  }
`;

/* ═══════════════════════════════════════════════════════════
   MATERIAIS
   ═══════════════════════════════════════════════════════════ */
const MaterialsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const MaterialCard = styled.div`
  padding: 16px 18px;
  border-radius: 14px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);

  background: ${p => p.$checked
    ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.07), rgba(34, 197, 94, 0.02))'
    : 'linear-gradient(135deg, rgba(74, 140, 247, 0.05), rgba(74, 140, 247, 0.015))'};

  border: 1px solid ${p => p.$checked
    ? 'rgba(34, 197, 94, 0.28)'
    : 'rgba(74, 140, 247, 0.14)'};

  &:hover {
    border-color: ${p => p.$checked
      ? 'rgba(34, 197, 94, 0.5)'
      : 'rgba(74, 140, 247, 0.35)'};
    box-shadow: ${p => p.$checked
      ? '0 8px 24px -10px rgba(34, 197, 94, 0.35)'
      : '0 8px 24px -10px rgba(74, 140, 247, 0.3)'};
  }

  @media (max-width: 480px) { padding: 14px; }
`;

const MaterialTop = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

const MaterialCheckbox = styled.button`
  width: 26px;
  height: 26px;
  border-radius: 8px;
  flex-shrink: 0;
  margin-top: 2px;
  padding: 0;
  cursor: pointer;
  display: grid;
  place-items: center;
  transition: all 0.2s ease;

  background: ${p => p.$checked
    ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
    : 'transparent'};

  border: 2px solid ${p => p.$checked
    ? 'rgba(34, 197, 94, 0.7)'
    : 'rgba(74, 140, 247, 0.4)'};

  box-shadow: ${p => p.$checked
    ? '0 4px 12px -2px rgba(34, 197, 94, 0.5)'
    : 'none'};

  svg {
    width: 14px;
    height: 14px;
    color: #fff;
    stroke-width: 3;
  }

  &:hover {
    transform: scale(1.08);
    border-color: ${p => p.$checked
      ? 'rgba(34, 197, 94, 1)'
      : 'rgba(74, 140, 247, 0.7)'};
  }

  &:active { transform: scale(0.95); }
`;

const MaterialMain = styled.div`
  flex: 1;
  min-width: 0;
`;

const MaterialTitleRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

const MaterialName = styled.div`
  color: ${p => p.$checked ? '#8899aa' : '#eef4ff'};
  font-size: 0.94rem;
  font-weight: 700;
  line-height: 1.4;
  text-decoration: ${p => p.$checked ? 'line-through' : 'none'};
  text-decoration-thickness: 1.5px;
  text-decoration-color: rgba(136, 153, 170, 0.5);

  @media (max-width: 480px) { font-size: 0.86rem; }
`;

const MaterialPrice = styled.div`
  color: ${p => p.$checked ? '#8899aa' : '#86efac'};
  font-size: 0.88rem;
  font-weight: 800;
  white-space: nowrap;
  text-decoration: ${p => p.$checked ? 'line-through' : 'none'};

  @media (max-width: 480px) { font-size: 0.8rem; }
`;

const MaterialTagsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
`;

const MaterialTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 9px;
  border-radius: 999px;
  font-size: 0.62rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  background: ${p => p.$bg || 'rgba(148, 163, 184, 0.1)'};
  color: ${p => p.$color || '#94a3b8'};
  border: 1px solid ${p => p.$border || 'rgba(148, 163, 184, 0.25)'};
`;

const MaterialDescription = styled.p`
  color: #a8b8d8;
  font-size: 0.82rem;
  line-height: 1.55;
  margin: 10px 0 0;
`;

const MaterialBody = styled.div`
  padding-left: 38px;
  margin-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 14px;

  @media (max-width: 480px) { padding-left: 32px; }
`;

const MaterialSubsection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const MaterialSubTitle = styled.div`
  color: #7eb8ff;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 6px;

  .emoji { font-size: 0.85rem; }
`;

const MaterialSubList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const MaterialSubItem = styled.li`
  color: #cbd9ee;
  font-size: 0.82rem;
  line-height: 1.5;
  padding-left: 18px;
  position: relative;

  &::before {
    content: '${p => p.$bullet || '›'}';
    color: #7eb8ff;
    font-weight: 900;
    position: absolute;
    left: 2px;
    top: -1px;
    font-size: 0.9rem;
  }
`;

const WhereLinksRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const MaterialWhereLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(74, 140, 247, 0.08);
  border: 1px solid rgba(74, 140, 247, 0.2);
  border-radius: 8px;
  color: #a8ccff;
  font-size: 0.76rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(74, 140, 247, 0.15);
    border-color: rgba(74, 140, 247, 0.4);
    color: #fff;
    transform: translateY(-1px);
  }

  .icon { font-size: 0.85rem; }
`;

/* ═══════════════════════════════════════════════════════════
   TOTAIS
   ═══════════════════════════════════════════════════════════ */
const MaterialTotalsBox = styled.div`
  margin-top: 20px;
  padding: 20px 22px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  background: linear-gradient(135deg,
    rgba(74, 222, 128, 0.08),
    rgba(34, 197, 94, 0.03));
  border: 1px solid rgba(74, 222, 128, 0.24);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);

  @media (max-width: 480px) { padding: 16px 18px; }
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  font-size: 0.85rem;

  .label {
    color: #a8b8d8;
    font-weight: 600;
  }

  .value {
    color: #cbd9ee;
    font-weight: 700;
    white-space: nowrap;
  }

  &.muted {
    .label, .value { color: #8899aa; }
  }

  &.highlight {
    padding-top: 12px;
    border-top: 1px solid rgba(74, 222, 128, 0.2);
    margin-top: 4px;

    .label {
      color: #a8d5b8;
      font-size: 0.78rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    .value {
      color: #86efac;
      font-size: 1.15rem;
      font-weight: 800;
      letter-spacing: -0.01em;
    }
  }

  @media (max-width: 480px) {
    &.highlight .value { font-size: 1rem; }
  }
`;

const SavedBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  margin-top: 4px;
  background: rgba(74, 222, 128, 0.12);
  border: 1px solid rgba(74, 222, 128, 0.35);
  border-radius: 999px;
  color: #86efac;
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  align-self: flex-start;
`;

/* ═══════════════════════════════════════════════════════════
   CLIENTES
   ═══════════════════════════════════════════════════════════ */
const ClientsList = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ClientItem = styled.div`
  padding: 16px 18px;
  border-radius: 14px;
  transition: all 0.25s ease;

  background: linear-gradient(135deg, rgba(74, 140, 247, 0.05), rgba(74, 140, 247, 0.015));
  border: 1px solid rgba(74, 140, 247, 0.12);

  &:hover {
    background: linear-gradient(135deg, rgba(74, 140, 247, 0.09), rgba(74, 140, 247, 0.03));
    border-color: rgba(74, 140, 247, 0.3);
    transform: translateY(-2px);
  }
`;

const ClientName = styled.div`
  color: #eef4ff;
  font-size: 0.92rem;
  font-weight: 700;
  margin-bottom: 10px;
  line-height: 1.3;
`;

const ClientDetail = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  color: #a8b8d8;
  font-size: 0.8rem;
  line-height: 1.5;
  margin-bottom: 5px;

  .emoji { flex-shrink: 0; font-size: 0.85rem; }
  strong { color: #cbd9ee; font-weight: 700; }
`;

/* ═══════════════════════════════════════════════════════════
   PRICING
   ═══════════════════════════════════════════════════════════ */
const PricingTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const PricingRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.2fr 0.9fr;
  gap: 12px;
  padding: 14px 18px;
  border-radius: 12px;
  align-items: center;

  background: ${p => p.$header
    ? 'linear-gradient(135deg, rgba(74, 140, 247, 0.14), rgba(74, 140, 247, 0.06))'
    : 'rgba(74, 140, 247, 0.035)'};

  border: 1px solid ${p => p.$header
    ? 'rgba(74, 140, 247, 0.25)'
    : 'rgba(74, 140, 247, 0.1)'};

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
    padding: 12px 14px;

    span.time { grid-column: 1 / -1; font-size: 0.75rem; }
  }
`;

const PricingNote = styled.p`
  margin: 16px 0 0;
  padding: 14px 16px;
  background: rgba(251, 191, 36, 0.06);
  border: 1px solid rgba(251, 191, 36, 0.22);
  border-radius: 12px;
  color: #fbbf24;
  font-size: 0.8rem;
  line-height: 1.55;
  font-weight: 500;
`;

/* ═══════════════════════════════════════════════════════════
   TIMELINE
   ═══════════════════════════════════════════════════════════ */
const Timeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
`;

const TimelineRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  border-radius: 12px;

  background: linear-gradient(135deg, rgba(74, 140, 247, 0.05), rgba(74, 140, 247, 0.015));
  border: 1px solid rgba(74, 140, 247, 0.12);
  transition: all 0.25s ease;

  &:hover {
    background: linear-gradient(135deg, rgba(74, 140, 247, 0.09), rgba(74, 140, 247, 0.03));
    border-color: rgba(74, 140, 247, 0.28);
  }

  @media (max-width: 480px) { padding: 12px 14px; gap: 10px; }
`;

const TimelineDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
  background: #4f7cff;
  box-shadow: 0 0 12px rgba(79, 124, 255, 0.7);
`;

const TimelineLabel = styled.div`
  color: #7eb8ff;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  min-width: 80px;
  flex-shrink: 0;

  @media (max-width: 480px) { min-width: 68px; font-size: 0.68rem; }
`;

const TimelineText = styled.div`
  color: #cbd9ee;
  font-size: 0.87rem;
  font-weight: 500;
  line-height: 1.45;
`;

/* ═══════════════════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════════════════ */
const ActionsFooter = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-start;
  margin-top: 20px;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;

    > * { width: 100%; }
  }
`;

const ButtonPrimary = styled.button`
  padding: 14px 28px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
  overflow: hidden;
  width: fit-content;

  background: linear-gradient(135deg, #2563eb 0%, #4f7cff 50%, #7c5cff 100%);
  background-size: 200% 100%;
  box-shadow: 0 12px 32px -10px rgba(37, 99, 235, 0.75);
  transition: all 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 20% 50%,
      rgba(255, 255, 255, 0.15), transparent 60%);
    pointer-events: none;
  }

  &:hover {
    background-position: 100% 50%;
    transform: translateY(-2px);
    box-shadow: 0 16px 40px -10px rgba(37, 99, 235, 0.9);
  }

  &:active { transform: translateY(0) scale(0.98); }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ButtonGhost = styled(Link)`
  padding: 16px 24px;
  border-radius: 14px;
  border: 1px solid rgba(74, 140, 247, 0.3);
  background: rgba(74, 140, 247, 0.06);
  color: #a8ccff;
  font-family: inherit;
  font-size: 0.88rem;
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
    transform: translateY(-2px);
  }
`;

/* ═══════════════════════════════════════════════════════════
   NOT FOUND
   ═══════════════════════════════════════════════════════════ */
const NotFound = styled.div`
  text-align: center;
  padding: 80px 40px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.06);

  h2 {
    color: #e8eef7;
    font-size: 1.8rem;
    margin-bottom: 12px;
    font-weight: 800;
  }

  p {
    color: #a8b8d8;
    margin-bottom: 24px;
    font-size: 0.95rem;
  }

  @media (max-width: 480px) {
    padding: 50px 24px;
    h2 { font-size: 1.4rem; }
  }
`;

/* ═══════════════════════════════════════════════════════════
   ÍCONES
   ═══════════════════════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════════════════════
   COMPONENTE
   ═══════════════════════════════════════════════════════════ */
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
  const [generatingPDF, setGeneratingPDF] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

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

  const pricing = useMemo(() => business?.pricing || null, [business]);

  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPct = steps.length > 0 ? (completedCount / steps.length) * 100 : 0;

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

  const handleDownloadPDF = () => {
    if (generatingPDF || !business) return;

    try {
      setGeneratingPDF(true);

      generatePlanPDF({
        business,
        steps,
        completedSteps,
        materials,
        checkedMaterials,
        pricing,
        timeline: business.startTimeline || null,
      });

      showToast('📄 PDF gerado! Verifique seus downloads.', 'success', 3000);
    } catch (err) {
      console.error('Erro ao gerar PDF:', err);
      showToast('❌ Erro ao gerar PDF. Tente novamente.', 'error', 3000);
    } finally {
      setGeneratingPDF(false);
    }
  };

  if (!business) {
    return (
      <Page>
        <BackgroundDecor />
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
      </Page>
    );
  }

  return (
    <Page>
      <BackgroundDecor />

      <Container>
        <Helmet>
          <title>Meu plano — {business.name} | Negócio ao Alcance</title>
          <meta name="description" content={`Roteiro completo, materiais e orçamento para começar: ${business.name}`} />
        </Helmet>

        {/* ─── TOP BAR ─────────────────────────────────── */}
        <TopBar>
          <Breadcrumb>
            <Link to="/">Início</Link>
            <span className="sep">›</span>
            <Link to={`/business/${business.id}`}>{business.category}</Link>
            <span className="sep">›</span>
            <Link to={`/business/${business.id}`}>{business.name}</Link>
            <span className="sep">›</span>
            <span className="current">Meu plano</span>
          </Breadcrumb>

          <BackToDetailsBtn to={`/business/${business.id}`}>
            <ArrowLeftIcon />
            Voltar aos detalhes
          </BackToDetailsBtn>
        </TopBar>

        {/* ─── HERO ─────────────────────────────────────── */}
        <Hero>
          <HeroLabel>Plano em andamento</HeroLabel>

          <HeroTitle>Vamos tirar do papel</HeroTitle>

          <HeroSubtitle>
            Você está construindo <strong>{business.name}</strong>.
            Siga o roteiro, marque seu progresso e acompanhe quanto falta pra começar.
          </HeroSubtitle>

          <ProgressWrapper>
            <ProgressBar>
              <ProgressFill $percent={progressPct} />
            </ProgressBar>
            <ProgressMeta>
              <span className="label">
                {completedCount} de {steps.length} etapas concluídas
              </span>
              <span className="value">{Math.round(progressPct)}%</span>
            </ProgressMeta>
          </ProgressWrapper>
        </Hero>

        {/* ─── ROTEIRO ──────────────────────────────────── */}
        {steps.length > 0 && (
          <Section>
            <SectionHeader>
              <SectionIcon>🎯</SectionIcon>
              <SectionTitleBlock>
                <SectionTitle>Roteiro de ação</SectionTitle>
                <SectionSubtitle>
                  Conclua cada etapa para desbloquear a próxima. Progresso salvo automaticamente.
                </SectionSubtitle>
              </SectionTitleBlock>
            </SectionHeader>

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
                  </StepItem>
                );
              })}
            </StepsList>
          </Section>
        )}

        {/* ─── MATERIAIS ────────────────────────────────── */}
        {materials.length > 0 && (
          <Section>
            <SectionHeader>
              <SectionIcon>📦</SectionIcon>
              <SectionTitleBlock>
                <SectionTitle>Materiais necessários</SectionTitle>
                <SectionSubtitle>
                  Marque o que você já tem — o orçamento se ajusta automaticamente.
                </SectionSubtitle>
              </SectionTitleBlock>
            </SectionHeader>

            <MaterialsList>
              {materials.map((material, index) => {
                const price = formatCurrencyRange(
                  material.priceMin,
                  material.priceMax,
                  material.period
                );
                const isChecked = !!checkedMaterials[index];

                const hasBody = Boolean(
                  material.description ||
                  material.tips.length > 0 ||
                  material.whereToBuy.length > 0 ||
                  material.alternatives.length > 0
                );

                return (
                  <MaterialCard key={index} $checked={isChecked}>
                    <MaterialTop>
                      <MaterialCheckbox
                        $checked={isChecked}
                        onClick={() => toggleMaterial(index)}
                        aria-label={isChecked ? 'Desmarcar material' : 'Marcar como adquirido'}
                      >
                        {isChecked && <CheckIcon />}
                      </MaterialCheckbox>

                      <MaterialMain>
                        <MaterialTitleRow>
                          <MaterialName $checked={isChecked}>
                            {material.name}
                          </MaterialName>
                          {price && (
                            <MaterialPrice $checked={isChecked}>{price}</MaterialPrice>
                          )}
                        </MaterialTitleRow>

                        {material.quantity && (
                          <MaterialTagsRow>
                            <MaterialTag
                              $bg="rgba(148, 163, 184, 0.08)"
                              $color="#94a3b8"
                              $border="rgba(148, 163, 184, 0.2)"
                            >
                              📏 {material.quantity}
                            </MaterialTag>
                          </MaterialTagsRow>
                        )}

                        {material.description && (
                          <MaterialDescription>
                            {material.description}
                          </MaterialDescription>
                        )}
                      </MaterialMain>
                    </MaterialTop>

                    {hasBody && (
                      <MaterialBody>
                        {material.tips.length > 0 && (
                          <MaterialSubsection>
                            <MaterialSubTitle>
                              <span className="emoji">💡</span> Dicas
                            </MaterialSubTitle>
                            <MaterialSubList>
                              {material.tips.map((tip, i) => (
                                <MaterialSubItem key={i} $bullet="•">
                                  {tip}
                                </MaterialSubItem>
                              ))}
                            </MaterialSubList>
                          </MaterialSubsection>
                        )}

                        {material.alternatives.length > 0 && (
                          <MaterialSubsection>
                            <MaterialSubTitle>
                              <span className="emoji">🔄</span> Alternativas econômicas
                            </MaterialSubTitle>
                            <MaterialSubList>
                              {material.alternatives.map((alt, i) => (
                                <MaterialSubItem key={i} $bullet="↻">
                                  {alt}
                                </MaterialSubItem>
                              ))}
                            </MaterialSubList>
                          </MaterialSubsection>
                        )}

                        {material.whereToBuy.length > 0 && (
                          <MaterialSubsection>
                            <MaterialSubTitle>
                              <span className="emoji">🛒</span> Onde encontrar
                            </MaterialSubTitle>
                            <WhereLinksRow>
                              {material.whereToBuy.map((link, i) => (
                                <MaterialWhereLink
                                  key={i}
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <span className="icon">🔗</span>
                                  {link.label}
                                </MaterialWhereLink>
                              ))}
                            </WhereLinksRow>
                          </MaterialSubsection>
                        )}
                      </MaterialBody>
                    )}
                  </MaterialCard>
                );
              })}
            </MaterialsList>

            {(() => {
              const totalAll = calcMaterialTotalAll(materials);
              const totalLeft = calcMaterialTotal(materials, checkedMaterials);
              const saved = totalAll && totalLeft
                ? {
                    min: totalAll.min - totalLeft.min,
                    max: totalAll.max - totalLeft.max,
                  }
                : null;

              if (!totalAll) return null;

              return (
                <MaterialTotalsBox>
                  <TotalRow className="muted">
                    <span className="label">Investimento total estimado</span>
                    <span className="value">
                      {formatCurrencyRange(totalAll.min, totalAll.max)}
                    </span>
                  </TotalRow>

                  {saved && (saved.min > 0 || saved.max > 0) && (
                    <TotalRow className="muted">
                      <span className="label">✓ Você já tem (economia)</span>
                      <span className="value" style={{ color: '#86efac' }}>
                        − {formatCurrencyRange(saved.min, saved.max)}
                      </span>
                    </TotalRow>
                  )}

                  <TotalRow className="highlight">
                    <span className="label">💰 Falta investir</span>
                    <span className="value">
                      {totalLeft
                        ? formatCurrencyRange(totalLeft.min, totalLeft.max)
                        : 'R$ 0 · Você já tem tudo! 🎉'}
                    </span>
                  </TotalRow>

                  {totalLeft === null && (
                    <SavedBadge>🎉 Pronto pra começar</SavedBadge>
                  )}
                </MaterialTotalsBox>
              );
            })()}
          </Section>
        )}

        {/* ─── CLIENTES ─────────────────────────────────── */}
        {clients.length > 0 && (
          <Section>
            <SectionHeader>
              <SectionIcon>👥</SectionIcon>
              <SectionTitleBlock>
                <SectionTitle>Potenciais clientes</SectionTitle>
                <SectionSubtitle>
                  Perfis de quem pode comprar seu serviço e onde encontrá-los.
                </SectionSubtitle>
              </SectionTitleBlock>
            </SectionHeader>

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

        {/* ─── PRICING ──────────────────────────────────── */}
        {pricing && pricing.length > 0 && (
          <Section>
            <SectionHeader>
              <SectionIcon>📊</SectionIcon>
              <SectionTitleBlock>
                <SectionTitle>Quanto cobrar</SectionTitle>
                <SectionSubtitle>
                  Sugestão de faixa de preço baseada no seu nível de experiência.
                </SectionSubtitle>
              </SectionTitleBlock>
            </SectionHeader>

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

        {/* ─── TIMELINE ─────────────────────────────────── */}
        {business.startTimeline && business.startTimeline.length > 0 && (
          <Section>
            <SectionHeader>
              <SectionIcon>🗓️</SectionIcon>
              <SectionTitleBlock>
                <SectionTitle>Cronograma sugerido</SectionTitle>
                <SectionSubtitle>
                  Uma referência de ritmo para tirar o negócio do papel em 4 semanas.
                </SectionSubtitle>
              </SectionTitleBlock>
            </SectionHeader>

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

        {/* ─── FOOTER ───────────────────────────────────── */}
        <ActionsFooter>
          <ButtonPrimary
            onClick={handleDownloadPDF}
            disabled={generatingPDF}
          >
            {generatingPDF ? '⏳ Gerando PDF...' : '📄 Baixar plano em PDF'}
          </ButtonPrimary>
        </ActionsFooter>
      </Container>
    </Page>
  );
};

export default BusinessStart;