import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import styled, { keyframes } from 'styled-components';
import { businessData } from '../data/businessData';
import { businessSteps } from '../data/businessSteps';
import ShareButton from '../components/ShareButton';
import { useToast } from '../components/Toast';
import { auth, authService } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { normalizeStep } from '../utils/normalizeBusiness';

// ─── ANIMAÇÕES ─────────────────────────────────────────────
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-10px); }
  to   { opacity: 1; transform: translateX(0); }
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
  animation: ${slideIn} 0.4s ease-out;

  a {
    color: #7a8a9e;
    text-decoration: none;
    transition: color 0.2s;
    display: flex;
    align-items: center;
    gap: 6px;

    &:hover { color: #7eb8ff; }
  }

  span.sep { color: #4a5a6e; }

  span.current {
    color: #e8eef7;
    font-weight: 700;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  @media (max-width: 480px) {
    font-size: 0.72rem;
    span.current { max-width: 140px; }
  }
`;

// ─── CARD PRINCIPAL (sem linha gradiente no topo) ──────────
const Card = styled.div`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(14px);
  border-radius: 26px;
  padding: 40px;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.07);
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);

  @media (max-width: 768px) { padding: 28px; border-radius: 22px; }
  @media (max-width: 480px) { padding: 22px 18px; border-radius: 20px; }
`;

// ─── HEADER ────────────────────────────────────────────────
const Header = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 24px;
  margin-bottom: 26px;
  padding-bottom: 24px;
  border-bottom: 1px solid rgba(74, 140, 247, 0.12);

  @media (max-width: 768px) { gap: 18px; }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 14px;
    padding-bottom: 20px;
  }
`;

const EmojiWrapper = styled.div`
  font-size: 3rem;
  width: 88px;
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(74, 140, 247, 0.08);
  border-radius: 20px;
  border: 1px solid rgba(74, 140, 247, 0.18);
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 76px;
    height: 76px;
    font-size: 2.5rem;
    border-radius: 18px;
  }

  @media (max-width: 480px) {
    width: 68px;
    height: 68px;
    font-size: 2.2rem;
    border-radius: 16px;
  }
`;

const HeaderContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const Name = styled.h1`
  font-size: 2rem;
  margin: 0 0 12px 0;
  font-weight: 800;
  letter-spacing: -0.6px;
  line-height: 1.15;
  background: linear-gradient(135deg,
    #ffffff 0%, #d0e0ff 40%, #7eb8ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) { font-size: 1.7rem; }
  @media (max-width: 480px) { font-size: 1.4rem; }
`;

const Category = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 14px;
  background: rgba(74, 140, 247, 0.12);
  border-radius: 999px;
  font-size: 0.68rem;
  color: #a8ccff;
  font-weight: 700;
  border: 1px solid rgba(74, 140, 247, 0.25);
  text-transform: uppercase;
  letter-spacing: 1px;

  @media (max-width: 480px) { font-size: 0.62rem; padding: 4px 12px; }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  flex-shrink: 0;

  @media (max-width: 480px) {
    order: -1;
    margin-bottom: 4px;
  }
`;

const FavoriteBtn = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: all 0.25s ease;
  font-size: 1.2rem;
  padding: 0;

  background: ${p => p.$active
    ? 'rgba(239, 68, 68, 0.15)'
    : 'rgba(74, 140, 247, 0.08)'};
  border: 1px solid ${p => p.$active
    ? 'rgba(239, 68, 68, 0.4)'
    : 'rgba(74, 140, 247, 0.2)'};

  &:hover {
    background: ${p => p.$active
      ? 'rgba(239, 68, 68, 0.25)'
      : 'rgba(74, 140, 247, 0.15)'};
    transform: translateY(-2px);
  }

  &:active { transform: translateY(0) scale(0.95); }

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
  }
`;

// ─── DESCRIÇÃO ─────────────────────────────────────────────
const DescriptionBox = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  margin-bottom: 24px;
  padding: 18px 20px;
  background: linear-gradient(135deg,
    rgba(74, 140, 247, 0.08) 0%,
    rgba(168, 85, 247, 0.04) 100%);
  border: 1px solid rgba(74, 140, 247, 0.18);
  border-left: 3px solid #7eb8ff;
  border-radius: 14px;

  @media (max-width: 480px) {
    padding: 14px 16px;
    margin-bottom: 20px;
  }
`;

const DescriptionIcon = styled.div`
  font-size: 1.2rem;
  flex-shrink: 0;
  line-height: 1;
  margin-top: 2px;
`;

const DescriptionText = styled.p`
  color: #e8eef7;
  font-size: 0.95rem;
  line-height: 1.65;
  margin: 0;
  font-weight: 500;

  @media (max-width: 480px) { font-size: 0.88rem; }
`;

// ─── STATS (4 cards) ──────────────────────────────────────
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 28px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
`;

const StatCard = styled.div`
  background: ${p => p.$bg || 'rgba(74, 140, 247, 0.05)'};
  border-radius: 16px;
  padding: 20px 16px;
  border: 1px solid ${p => p.$border || 'rgba(74, 140, 247, 0.12)'};
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    border-color: ${p => p.$borderHover || 'rgba(74, 140, 247, 0.35)'};
    box-shadow: 0 10px 28px ${p => p.$glow || 'rgba(74, 140, 247, 0.15)'};
  }

  @media (max-width: 480px) {
    padding: 16px 12px;
    border-radius: 14px;
  }
`;

const StatIconBox = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  margin: 0 auto 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${p => p.$bg || 'rgba(74, 140, 247, 0.15)'};
  border: 1px solid ${p => p.$border || 'rgba(74, 140, 247, 0.25)'};

  svg { width: 20px; height: 20px; }

  @media (max-width: 480px) {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    margin-bottom: 10px;
    svg { width: 18px; height: 18px; }
  }
`;

const StatLabel = styled.div`
  color: #a8b8d8;
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 1.1px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const StatValue = styled.div`
  color: #e8eef7;
  font-size: 1.1rem;
  font-weight: 800;
  letter-spacing: -0.3px;
  line-height: 1.2;

  @media (max-width: 480px) { font-size: 0.95rem; }
`;

// ─── TÍTULOS DE SEÇÃO ──────────────────────────────────────
const SectionTitle = styled.h3`
  color: #e8eef7;
  font-size: 1.15rem;
  margin: 0 0 10px 0;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 800;
  letter-spacing: -0.2px;

  svg { color: #7eb8ff; width: 20px; height: 20px; flex-shrink: 0; }

  @media (max-width: 480px) { font-size: 1rem; }
`;

const SectionSubtitle = styled.p`
  color: #a8b8d8;
  font-size: 0.85rem;
  margin: 0 0 20px 0;
  line-height: 1.6;

  @media (max-width: 480px) {
    font-size: 0.78rem;
    margin-bottom: 16px;
  }
`;

// ─── BASE SECTION ──────────────────────────────────────────
const BaseSection = styled.div`
  border-radius: 22px;
  padding: 28px;
  margin-bottom: 24px;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) { padding: 22px; border-radius: 18px; }
  @media (max-width: 480px) { padding: 18px 14px; margin-bottom: 20px; border-radius: 16px; }
`;

// ─── PREÇO SUGERIDO ────────────────────────────────────────
const PriceBox = styled(BaseSection)`
  background: linear-gradient(135deg,
    rgba(74, 222, 128, 0.08) 0%,
    rgba(34, 197, 94, 0.03) 100%);
  border: 1px solid rgba(74, 222, 128, 0.22);
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 22px 24px;
  margin-bottom: 24px;

  .icon {
    font-size: 1.6rem;
    flex-shrink: 0;
    width: 52px;
    height: 52px;
    display: grid;
    place-items: center;
    background: rgba(74, 222, 128, 0.12);
    border-radius: 14px;
    border: 1px solid rgba(74, 222, 128, 0.3);
  }

  .content { flex: 1; min-width: 0; }

  .label {
    color: #a8d5b8;
    font-size: 0.68rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1.2px;
    margin-bottom: 4px;
  }

  .value {
    color: #86efac;
    font-size: 1.3rem;
    font-weight: 800;
    letter-spacing: -0.3px;
  }

  @media (max-width: 480px) {
    padding: 16px 18px;
    gap: 12px;

    .icon { width: 44px; height: 44px; font-size: 1.3rem; }
    .value { font-size: 1.1rem; }
  }
`;

// ─── CALCULADORA ───────────────────────────────────────────
const CalculatorSection = styled(BaseSection)`
  background: linear-gradient(135deg,
    rgba(74, 140, 247, 0.07) 0%,
    rgba(168, 85, 247, 0.04) 100%);
  border: 1px solid rgba(74, 140, 247, 0.15);
`;

const CalcGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-bottom: 22px;

  @media (max-width: 640px) { grid-template-columns: 1fr; gap: 12px; }
`;

const CalcField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const CalcLabel = styled.label`
  color: #a8b8d8;
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 1.1px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 6px;

  svg { width: 12px; height: 12px; color: #7eb8ff; }
`;

const CalcInput = styled.input`
  padding: 13px 16px;
  background: rgba(10, 21, 48, 0.55);
  border: 1.5px solid rgba(74, 140, 247, 0.18);
  border-radius: 12px;
  color: #e8eef7;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.25s;
  font-family: inherit;
  width: 100%;

  &:focus {
    outline: none;
    border-color: rgba(74, 140, 247, 0.55);
    box-shadow: 0 0 0 4px rgba(74, 140, 247, 0.1);
    background: rgba(10, 21, 48, 0.75);
  }

  &::placeholder { color: #556677; font-weight: 400; }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
  -moz-appearance: textfield;
`;

const CalcResult = styled.div`
  background: rgba(34, 197, 94, 0.06);
  border-radius: 16px;
  padding: 24px 20px;
  border: 1px solid rgba(74, 222, 128, 0.2);
  text-align: center;
  animation: ${fadeInUp} 0.4s ease-out;

  @media (max-width: 480px) { padding: 18px 14px; }
`;

const ResultLabel = styled.div`
  color: #a8d5b8;
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const ResultValue = styled.div`
  color: #86efac;
  font-size: 2.4rem;
  font-weight: 900;
  letter-spacing: -0.8px;
  line-height: 1;

  @media (max-width: 480px) { font-size: 1.8rem; }
`;

const ResultDetails = styled.div`
  color: #a8b8d8;
  font-size: 0.8rem;
  margin-top: 12px;
  line-height: 1.6;
  font-weight: 500;

  strong { color: #e8eef7; font-weight: 700; }

  @media (max-width: 480px) { font-size: 0.75rem; }
`;

const ResultGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 18px;
  padding-top: 18px;
  border-top: 1px solid rgba(74, 222, 128, 0.15);

  @media (max-width: 480px) { grid-template-columns: 1fr; gap: 10px; }
`;

const ResultItem = styled.div`text-align: center;`;

const ResultItemLabel = styled.div`
  color: #a8b8d8;
  font-size: 0.62rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 700;
  margin-bottom: 4px;
`;

const ResultItemValue = styled.div`
  color: #e8eef7;
  font-size: 1.05rem;
  font-weight: 800;

  @media (max-width: 480px) { font-size: 0.95rem; }
`;

// ─── PREVIEW PASSOS ────────────────────────────────────────
const PreviewSection = styled(BaseSection)`
  background: linear-gradient(135deg,
    rgba(74, 140, 247, 0.05) 0%,
    rgba(168, 85, 247, 0.03) 100%);
  border: 1px solid rgba(74, 140, 247, 0.15);
`;

const PreviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 14px;
`;

const PreviewStep = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 14px;
  background: rgba(74, 140, 247, 0.05);
  border: 1px solid rgba(74, 140, 247, 0.12);
  border-radius: 12px;
  color: #cbd9ee;
  font-size: 0.87rem;
  line-height: 1.5;

  @media (max-width: 480px) { font-size: 0.82rem; padding: 10px 12px; }
`;

const PreviewNumber = styled.div`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: rgba(74, 140, 247, 0.18);
  border: 1px solid rgba(74, 140, 247, 0.4);
  color: #7eb8ff;
  font-size: 0.75rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
`;

const PreviewMore = styled.div`
  text-align: center;
  color: #8899aa;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 10px 14px;
  font-style: italic;
  background: rgba(74, 140, 247, 0.04);
  border: 1px dashed rgba(74, 140, 247, 0.2);
  border-radius: 10px;
`;

// ─── GRID INFO (materiais + clientes) ─────────────────────
const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-bottom: 24px;

  @media (min-width: 768px) { grid-template-columns: 1fr 1fr; }
`;

const InfoBox = styled.div`
  background: rgba(74, 140, 247, 0.04);
  border: 1px solid rgba(74, 140, 247, 0.12);
  border-radius: 20px;
  padding: 22px;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(74, 140, 247, 0.28);
    background: rgba(74, 140, 247, 0.06);
  }

  @media (max-width: 768px) { padding: 18px; }
  @media (max-width: 480px) { padding: 16px 14px; border-radius: 16px; }
`;

const InfoHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;

  svg { color: #7eb8ff; width: 18px; height: 18px; flex-shrink: 0; }

  h3 {
    color: #e8eef7;
    font-size: 0.92rem;
    margin: 0;
    font-weight: 800;
    letter-spacing: -0.2px;
  }
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ListItem = styled.li`
  padding: 9px 12px 9px 30px;
  position: relative;
  color: #c8d8e8;
  font-weight: 500;
  background: rgba(74, 140, 247, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(74, 140, 247, 0.08);
  transition: all 0.25s ease;
  font-size: 0.85rem;
  line-height: 1.4;

  &::before {
    content: '▸';
    color: #7eb8ff;
    font-weight: 900;
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.85rem;
  }

  &:hover {
    background: rgba(74, 140, 247, 0.1);
    border-color: rgba(74, 140, 247, 0.25);
    color: #e8eef7;
    transform: translateX(3px);
  }
`;

// ─── CTA FINAL ────────────────────────────────────────────
const CTAWrapper = styled.div`
  background: linear-gradient(135deg,
    rgba(37, 99, 235, 0.12) 0%,
    rgba(124, 92, 255, 0.08) 100%);
  border: 1px solid rgba(74, 140, 247, 0.3);
  border-radius: 22px;
  padding: 28px;
  position: relative;
  overflow: hidden;

  @media (max-width: 480px) { padding: 22px 18px; border-radius: 18px; }
`;

const CTATitle = styled.h3`
  color: #e8eef7;
  font-size: 1.2rem;
  font-weight: 800;
  margin: 0 0 8px;
  letter-spacing: -0.3px;

  @media (max-width: 480px) { font-size: 1.05rem; }
`;

const CTASubtitle = styled.p`
  color: #a8b8d8;
  font-size: 0.85rem;
  line-height: 1.55;
  margin: 0 0 18px;

  @media (max-width: 480px) { font-size: 0.78rem; margin-bottom: 16px; }
`;

const CTAButton = styled.button`
  width: 100%;
  padding: 18px 24px;
  border-radius: 14px;
  border: none;
  cursor: pointer;
  font-family: inherit;
  position: relative;
  overflow: hidden;

  background: linear-gradient(135deg, #2563eb 0%, #4f7cff 50%, #7c5cff 100%);
  background-size: 200% 100%;
  color: #fff;
  text-align: left;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  box-shadow:
    0 12px 32px -8px rgba(37, 99, 235, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);

  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 20% 50%,
      rgba(255, 255, 255, 0.15), transparent 60%);
    pointer-events: none;
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: 3px;
    flex: 1;
    min-width: 0;
    position: relative;
    z-index: 1;
  }

  .label {
    font-size: 1rem;
    font-weight: 800;
    letter-spacing: 0.01em;
  }

  .hint {
    font-size: 0.78rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.78);
  }

  .arrow {
    font-size: 1.4rem;
    flex-shrink: 0;
    transition: transform 0.3s ease;
    position: relative;
    z-index: 1;
  }

  &:hover {
    background-position: 100% 50%;
    transform: translateY(-2px);
    box-shadow:
      0 16px 40px -8px rgba(37, 99, 235, 0.85),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);

    .arrow { transform: translateX(6px); }
  }

  &:active { transform: translateY(0) scale(0.99); }

  @media (max-width: 480px) {
    padding: 16px 20px;

    .label { font-size: 0.92rem; }
    .hint { font-size: 0.72rem; }
    .arrow { font-size: 1.2rem; }
  }
`;

const LoginHint = styled.div`
  margin-top: 14px;
  padding: 12px 16px;
  background: rgba(251, 191, 36, 0.06);
  border: 1px solid rgba(251, 191, 36, 0.25);
  border-radius: 10px;
  color: #fbbf24;
  font-size: 0.8rem;
  font-weight: 600;
  text-align: center;

  a {
    color: #fbbf24;
    text-decoration: underline;
    font-weight: 800;

    &:hover { color: #fde047; }
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

  @media (max-width: 480px) {
    padding: 50px 24px;
    h2 { font-size: 1.4rem; }
  }
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
  border: 1px solid rgba(74, 140, 247, 0.4);
  border-radius: 12px;
  color: #fff;
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 700;
  text-decoration: none;
  letter-spacing: 0.4px;
  transition: all 0.25s ease;

  &:hover {
    background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(37, 99, 235, 0.4);
  }

  svg { width: 16px; height: 16px; }
`;

// ─── SKELETON ──────────────────────────────────────────────
const SkeletonBox = styled.div`
  background: linear-gradient(90deg,
    rgba(255, 255, 255, 0.03) 0%,
    rgba(255, 255, 255, 0.07) 50%,
    rgba(255, 255, 255, 0.03) 100%);
  background-size: 800px 100%;
  animation: ${shimmer} 1.6s infinite linear;
  border-radius: ${p => p.$radius || '12px'};
  height: ${p => p.$h || '20px'};
  width: ${p => p.$w || '100%'};
  margin-bottom: ${p => p.$mb || '0'};
`;

// ─── ÍCONES ────────────────────────────────────────────────
const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const ChevronIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const MoneyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const ChartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const TrendingIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const CalcIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
    <line x1="8" y1="6" x2="16" y2="6" />
    <line x1="16" y1="14" x2="16" y2="18" />
    <path d="M16 10h.01M12 10h.01M8 10h.01M12 14h.01M8 14h.01M12 18h.01M8 18h.01" />
  </svg>
);

const PackageIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const UsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const TargetIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

// ─── COMPONENTE ────────────────────────────────────────────
const BusinessDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriting, setFavoriting] = useState(false);

  const [precoServico, setPrecoServico] = useState('');
  const [clientesDia, setClientesDia] = useState('');
  const [diasMes, setDiasMes] = useState('22');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => setCurrentUser(user));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setLoading(true);
    const found = businessData.find(b => b.id === parseInt(id));
    setTimeout(() => {
      setBusiness(found);
      setLoading(false);
    }, 250);
  }, [id]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  useEffect(() => {
    if (!currentUser || !business) return;
    const storageKey = `favorites_${currentUser.uid}`;
    const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
    setIsFavorited(saved.includes(business.id));
  }, [business, currentUser]);

  const toggleFavorite = () => {
    if (!currentUser) {
      showToast('🔒 Faça login para favoritar', 'warning', 2500);
      return;
    }

    if (favoriting) return;
    setFavoriting(true);

    try {
      const storageKey = `favorites_${currentUser.uid}`;
      const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');

      if (isFavorited) {
        const next = saved.filter(fid => fid !== business.id);
        localStorage.setItem(storageKey, JSON.stringify(next));
        setIsFavorited(false);
        showToast('💔 Removido dos favoritos', 'info', 1800);
        authService.removeFavorite(currentUser.uid, business.id)
          .catch(err => console.warn(err));
      } else {
        if (!saved.includes(business.id)) {
          saved.push(business.id);
          localStorage.setItem(storageKey, JSON.stringify(saved));
        }
        setIsFavorited(true);
        showToast('❤️ Adicionado aos favoritos', 'success', 1800);
        authService.addFavorite(currentUser.uid, business.id)
          .catch(err => console.warn(err));
      }
    } finally {
      setFavoriting(false);
    }
  };

  const previewSteps = useMemo(() => {
    if (!business) return [];
    const raw = businessSteps[business.name] || [];
    return raw.slice(0, 2).map((s, i) => normalizeStep(s, i));
  }, [business]);

  const totalSteps = business ? (businessSteps[business.name] || []).length : 0;

  const formatInvestment = (min, max) => {
    if (min === max) return `R$ ${min.toLocaleString('pt-BR')}`;
    return `R$ ${min.toLocaleString('pt-BR')} - R$ ${max.toLocaleString('pt-BR')}`;
  };

  const formatCurrency = (value) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const calcularFaturamento = () => {
    const preco = parseFloat(precoServico.replace(',', '.')) || 0;
    const clientes = parseInt(clientesDia) || 0;
    const dias = parseInt(diasMes) || 0;
    const faturamento = preco * clientes * dias;

    let margem = 0;
    if (business?.profitMargin) {
      const margemStr = business.profitMargin.replace('%', '').split('-');
      const min = parseFloat(margemStr[0]) || 0;
      const max = margemStr[1] ? parseFloat(margemStr[1]) : min;
      margem = (min + max) / 2 / 100;
    }

    const lucro = faturamento * margem;
    return { faturamento, lucro, margem: margem * 100 };
  };

  if (loading) {
    return (
      <Container>
        <SkeletonBox $w="180px" $h="14px" $mb="20px" />
        <Card>
          <Header>
            <SkeletonBox $w="100px" $h="100px" $radius="24px" />
            <div style={{ flex: 1 }}>
              <SkeletonBox $w="70%" $h="28px" $mb="12px" />
              <SkeletonBox $w="100px" $h="24px" $radius="999px" />
            </div>
          </Header>
          <SkeletonBox $w="100%" $h="80px" $mb="24px" />
          <StatsGrid>
            <SkeletonBox $w="100%" $h="130px" $radius="18px" />
            <SkeletonBox $w="100%" $h="130px" $radius="18px" />
            <SkeletonBox $w="100%" $h="130px" $radius="18px" />
            <SkeletonBox $w="100%" $h="130px" $radius="18px" />
          </StatsGrid>
        </Card>
      </Container>
    );
  }

  if (!business) {
    return (
      <Container>
        <Helmet>
          <title>Serviço não encontrado | Negócio ao Alcance</title>
        </Helmet>
        <NotFound>
          <h2>😕 Serviço não encontrado</h2>
          <p>O serviço que você procura não existe ou foi removido.</p>
          <BackLink to="/">
            <ArrowLeftIcon />
            Voltar para o início
          </BackLink>
        </NotFound>
      </Container>
    );
  }

  const resultado = calcularFaturamento();
  const mostrarResultado = precoServico && clientesDia && diasMes;

  const shareUrl = `${window.location.origin}/business/${business.id}`;
  const previewImage = `${window.location.origin}/preview.jpg`;

  return (
    <Container>
      <Helmet>
        <title>{business.name} | Negócio ao Alcance</title>
        <meta name="description" content={business.description} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`${business.name} | Negócio ao Alcance`} />
        <meta property="og:description" content={business.description} />
        <meta property="og:image" content={previewImage} />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:site_name" content="Negócio ao Alcance" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${business.name} | Negócio ao Alcance`} />
        <meta name="twitter:description" content={business.description} />
      </Helmet>

      <Breadcrumb>
        <Link to="/">
          <HomeIcon />
          Início
        </Link>
        <span className="sep"><ChevronIcon /></span>
        <span>{business.category}</span>
        <span className="sep"><ChevronIcon /></span>
        <span className="current">{business.name}</span>
      </Breadcrumb>

      <Card>
        <Header>
          <EmojiWrapper>{business.image}</EmojiWrapper>

          <HeaderContent>
            <Name>{business.name}</Name>
            <Category>
              <PackageIcon />
              {business.category}
            </Category>
          </HeaderContent>

          <HeaderActions>
            <FavoriteBtn
              $active={isFavorited}
              onClick={toggleFavorite}
              disabled={favoriting}
              title={isFavorited ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
              aria-label={isFavorited ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
            >
              {isFavorited ? '❤️' : '🤍'}
            </FavoriteBtn>
            <ShareButton business={business} />
          </HeaderActions>
        </Header>

        <DescriptionBox>
          <DescriptionIcon>📝</DescriptionIcon>
          <DescriptionText>{business.description}</DescriptionText>
        </DescriptionBox>

        <StatsGrid>
          <StatCard
            $bg="rgba(74, 222, 128, 0.06)"
            $border="rgba(74, 222, 128, 0.18)"
            $borderHover="rgba(74, 222, 128, 0.4)"
            $glow="rgba(74, 222, 128, 0.2)"
          >
            <StatIconBox $bg="rgba(74, 222, 128, 0.15)" $border="rgba(74, 222, 128, 0.3)">
              <MoneyIcon style={{ color: '#86efac' }} />
            </StatIconBox>
            <StatLabel>Investimento</StatLabel>
            <StatValue>{formatInvestment(business.minInvestment, business.maxInvestment)}</StatValue>
          </StatCard>

          <StatCard
            $bg="rgba(251, 191, 36, 0.06)"
            $border="rgba(251, 191, 36, 0.18)"
            $borderHover="rgba(251, 191, 36, 0.4)"
            $glow="rgba(251, 191, 36, 0.2)"
          >
            <StatIconBox $bg="rgba(251, 191, 36, 0.15)" $border="rgba(251, 191, 36, 0.3)">
              <ChartIcon style={{ color: '#fbbf24' }} />
            </StatIconBox>
            <StatLabel>Margem</StatLabel>
            <StatValue>{business.profitMargin}</StatValue>
          </StatCard>

          <StatCard
            $bg="rgba(96, 165, 250, 0.06)"
            $border="rgba(96, 165, 250, 0.18)"
            $borderHover="rgba(96, 165, 250, 0.4)"
            $glow="rgba(96, 165, 250, 0.2)"
          >
            <StatIconBox $bg="rgba(96, 165, 250, 0.15)" $border="rgba(96, 165, 250, 0.3)">
              <ClockIcon style={{ color: '#60a5fa' }} />
            </StatIconBox>
            <StatLabel>Retorno</StatLabel>
            <StatValue>{business.payback}</StatValue>
          </StatCard>

          {business.monthlyRevenue && (
            <StatCard
              $bg="rgba(168, 85, 247, 0.06)"
              $border="rgba(168, 85, 247, 0.18)"
              $borderHover="rgba(168, 85, 247, 0.4)"
              $glow="rgba(168, 85, 247, 0.2)"
            >
              <StatIconBox $bg="rgba(168, 85, 247, 0.15)" $border="rgba(168, 85, 247, 0.3)">
                <TrendingIcon style={{ color: '#c084fc' }} />
              </StatIconBox>
              <StatLabel>Faturamento/mês</StatLabel>
              <StatValue style={{ fontSize: '0.9rem' }}>{business.monthlyRevenue}</StatValue>
            </StatCard>
          )}
        </StatsGrid>

        {business.suggestedPrice && (
          <PriceBox>
            <div className="icon">💰</div>
            <div className="content">
              <div className="label">Preço sugerido</div>
              <div className="value">{business.suggestedPrice}</div>
            </div>
          </PriceBox>
        )}

        <CalculatorSection>
          <SectionTitle>
            <CalcIcon />
            Calculadora de Faturamento
          </SectionTitle>
          <SectionSubtitle>
            Descubra quanto você pode faturar! Preencha os campos abaixo:
          </SectionSubtitle>

          <CalcGrid>
            <CalcField>
              <CalcLabel>
                <MoneyIcon />
                Preço por serviço
              </CalcLabel>
              <CalcInput
                type="text"
                placeholder="Ex: 40"
                value={precoServico}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9,.]/g, '');
                  setPrecoServico(value);
                }}
              />
            </CalcField>

            <CalcField>
              <CalcLabel>
                <UsersIcon />
                Clientes por dia
              </CalcLabel>
              <CalcInput
                type="number"
                placeholder="Ex: 5"
                value={clientesDia}
                onChange={(e) => setClientesDia(e.target.value)}
                min="0"
              />
            </CalcField>

            <CalcField>
              <CalcLabel>
                <ClockIcon />
                Dias por mês
              </CalcLabel>
              <CalcInput
                type="number"
                placeholder="Ex: 22"
                value={diasMes}
                onChange={(e) => setDiasMes(e.target.value)}
                min="0"
                max="31"
              />
            </CalcField>
          </CalcGrid>

          {mostrarResultado && (
            <CalcResult>
              <ResultLabel>💰 Faturamento Mensal Estimado</ResultLabel>
              <ResultValue>{formatCurrency(resultado.faturamento)}</ResultValue>

              <ResultDetails>
                <strong>{clientesDia} clientes/dia</strong> × <strong>{diasMes} dias</strong> × <strong>{formatCurrency(parseFloat(precoServico.replace(',', '.')) || 0)}</strong>
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
            </CalcResult>
          )}
        </CalculatorSection>

        {previewSteps.length > 0 && (
          <PreviewSection>
            <SectionTitle>
              <TargetIcon />
              Como começar
            </SectionTitle>
            <SectionSubtitle>
              Uma prévia do que você precisa fazer. O roteiro completo está no seu plano:
            </SectionSubtitle>

            <PreviewList>
              {previewSteps.map((step, index) => (
                <PreviewStep key={index}>
                  <PreviewNumber>{index + 1}</PreviewNumber>
                  <span>{step.title}</span>
                </PreviewStep>
              ))}
            </PreviewList>

            {totalSteps > previewSteps.length && (
              <PreviewMore>
                + {totalSteps - previewSteps.length} etapas no plano completo
              </PreviewMore>
            )}
          </PreviewSection>
        )}

        <InfoGrid>
          <InfoBox>
            <InfoHeader>
              <PackageIcon />
              <h3>Materiais necessários</h3>
            </InfoHeader>
            <List>
              {business.materials.map((material, index) => (
                <ListItem key={index}>{material}</ListItem>
              ))}
            </List>
          </InfoBox>

          <InfoBox>
            <InfoHeader>
              <UsersIcon />
              <h3>Potenciais clientes</h3>
            </InfoHeader>
            <List>
              {business.potentialClients.map((client, index) => (
                <ListItem key={index}>{client}</ListItem>
              ))}
            </List>
          </InfoBox>
        </InfoGrid>

        <CTAWrapper>
          <CTATitle>Pronto para começar?</CTATitle>
          <CTASubtitle>
            Acesse o roteiro completo, materiais detalhados com faixa de preço
            e uma tabela de quanto cobrar em cada nível.
          </CTASubtitle>

          <CTAButton
            onClick={() => {
              if (!currentUser) {
                showToast('🔒 Faça login para acessar seu plano', 'warning', 2500);
                setTimeout(() => navigate('/login'), 800);
                return;
              }
              navigate(`/business/${business.id}/comecar`);
            }}
          >
            <div className="content">
              <div className="label">Quero fazer esse serviço</div>
              <div className="hint">Ver roteiro, materiais e orçamento</div>
            </div>
            <div className="arrow">→</div>
          </CTAButton>

          {!currentUser && (
            <LoginHint>
              Você precisa estar logado. <Link to="/login">Entrar agora →</Link>
            </LoginHint>
          )}
        </CTAWrapper>
      </Card>
    </Container>
  );
};

export default BusinessDetail;