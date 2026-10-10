import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import styled, { keyframes } from 'styled-components';
import { businessData } from '../data/businessData';
import { businessSteps } from '../data/businessSteps';
import ShareButton from '../components/ShareButton';

// ─── ANIMAÇÕES ─────────────────────────────────────────────
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-10px); }
  to   { opacity: 1; transform: translateX(0); }
`;

const glowPulse = keyframes`
  0%, 100% { opacity: 0.4; }
  50%      { opacity: 0.8; }
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

  &::before {
    content: '';
    position: absolute;
    inset: -60px -20px;
    background-image:
      linear-gradient(rgba(74, 140, 247, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(74, 140, 247, 0.03) 1px, transparent 1px);
    background-size: 32px 32px;
    mask-image: radial-gradient(circle at 50% 20%, black 0%, transparent 70%);
    -webkit-mask-image: radial-gradient(circle at 50% 20%, black 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

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
  position: relative;
  z-index: 1;
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

  span.current { color: #e8eef7; font-weight: 700; }

  @media (max-width: 480px) {
    font-size: 0.72rem;
  }
`;

// ─── CARD ──────────────────────────────────────────────────
const Card = styled.div`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 24px;
  padding: 36px;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.06);
  overflow: hidden;
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg,
      #ffffff 0%,
      #7eb8ff 35%,
      #a855f7 65%,
      #ffffff 100%);
  }

  @media (max-width: 768px) {
    padding: 24px;
    border-radius: 20px;
  }

  @media (max-width: 480px) {
    padding: 20px 16px;
    border-radius: 18px;
  }
`;

// ─── HEADER DO NEGÓCIO ─────────────────────────────────────
const Header = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 24px;
  margin-bottom: 28px;
  padding-bottom: 24px;
  border-bottom: 1px solid rgba(74, 140, 247, 0.12);

  @media (max-width: 768px) {
    gap: 16px;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 14px;
    padding-bottom: 20px;
  }
`;

const EmojiWrapper = styled.div`
  font-size: 3.4rem;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg,
    rgba(74, 140, 247, 0.12) 0%,
    rgba(168, 85, 247, 0.08) 100%);
  border-radius: 22px;
  border: 1px solid rgba(74, 140, 247, 0.2);
  flex-shrink: 0;
  position: relative;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);

  &::after {
    content: '';
    position: absolute;
    inset: -6px;
    border-radius: 26px;
    background: radial-gradient(circle, rgba(74, 140, 247, 0.15) 0%, transparent 70%);
    pointer-events: none;
    animation: ${glowPulse} 4s ease-in-out infinite;
  }

  @media (max-width: 768px) {
    width: 84px;
    height: 84px;
    font-size: 2.8rem;
    border-radius: 20px;
  }

  @media (max-width: 480px) {
    width: 76px;
    height: 76px;
    font-size: 2.4rem;
    border-radius: 18px;
  }
`;

const HeaderContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const Name = styled.h1`
  font-size: 2.2rem;
  margin: 0 0 10px 0;
  font-weight: 800;
  letter-spacing: -0.7px;
  line-height: 1.15;
  background: linear-gradient(135deg,
    #ffffff 0%,
    #d0e0ff 40%,
    #7eb8ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) { font-size: 1.8rem; }
  @media (max-width: 480px) { font-size: 1.5rem; }
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

  svg { width: 12px; height: 12px; }

  @media (max-width: 480px) { font-size: 0.62rem; padding: 4px 12px; }
`;

const ShareWrapper = styled.div`
  flex-shrink: 0;
  margin-top: 4px;

  @media (max-width: 480px) {
    order: -1;
    margin-top: 0;
  }
`;

// ─── DESCRIÇÃO ─────────────────────────────────────────────
const Description = styled.p`
  color: #e8eef7;
  font-size: 1rem;
  line-height: 1.7;
  margin: 0 0 28px 0;
  padding: 20px 22px;
  background: linear-gradient(135deg,
    rgba(74, 140, 247, 0.12) 0%,
    rgba(255, 255, 255, 0.05) 100%);
  border-radius: 14px;
  border: 1px solid rgba(74, 140, 247, 0.2);
  border-left: 3px solid #7eb8ff;
  font-weight: 500;

  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  letter-spacing: 0.15px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);

  @media (max-width: 480px) {
    font-size: 0.92rem;
    padding: 16px 18px;
    margin-bottom: 22px;
  }
`;

// ─── GRID DE STATS ─────────────────────────────────────────
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-bottom: 28px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
`;

const StatCard = styled.div`
  background: rgba(74, 140, 247, 0.06);
  border-radius: 16px;
  padding: 18px 16px;
  border: 1px solid rgba(74, 140, 247, 0.12);
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    background: rgba(74, 140, 247, 0.1);
    border-color: rgba(74, 140, 247, 0.3);
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(74, 140, 247, 0.15);
  }

  @media (max-width: 480px) {
    padding: 16px 14px;
  }
`;

const StatIconBox = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  margin: 0 auto 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  background: ${props => props.$bg || 'rgba(74, 140, 247, 0.15)'};
  border: 1px solid ${props => props.$border || 'rgba(74, 140, 247, 0.2)'};

  @media (max-width: 480px) {
    width: 36px;
    height: 36px;
    font-size: 1.05rem;
    margin-bottom: 8px;
  }
`;

const StatLabel = styled.div`
  color: #a8b8d8;
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  font-weight: 700;
  margin-bottom: 6px;
`;

const StatValue = styled.div`
  color: #e8eef7;
  font-size: 1.1rem;
  font-weight: 800;
  letter-spacing: -0.3px;

  @media (max-width: 480px) { font-size: 1rem; }
`;

// ─── SEÇÕES GENÉRICAS ──────────────────────────────────────
const SectionTitle = styled.h3`
  color: #e8eef7;
  font-size: 1.15rem;
  margin: 0 0 10px 0;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 800;
  letter-spacing: -0.2px;
  position: relative;
  z-index: 1;

  svg { color: #7eb8ff; width: 20px; height: 20px; }

  @media (max-width: 480px) { font-size: 1rem; }
`;

const SectionSubtitle = styled.p`
  color: #a8b8d8;
  font-size: 0.85rem;
  margin: 0 0 22px 0;
  line-height: 1.6;
  position: relative;
  z-index: 1;

  @media (max-width: 480px) {
    font-size: 0.78rem;
    margin-bottom: 18px;
  }
`;

// ─── CALCULADORA ───────────────────────────────────────────
const CalculatorSection = styled.div`
  background: linear-gradient(135deg,
    rgba(74, 140, 247, 0.06) 0%,
    rgba(168, 85, 247, 0.04) 100%);
  border-radius: 20px;
  padding: 28px;
  border: 1px solid rgba(74, 140, 247, 0.15);
  margin-bottom: 28px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -40px;
    right: -40px;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle,
      rgba(74, 140, 247, 0.1) 0%,
      transparent 70%);
    pointer-events: none;
  }

  @media (max-width: 480px) {
    padding: 20px 16px;
    margin-bottom: 22px;
  }
`;

const CalcGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-bottom: 22px;
  position: relative;
  z-index: 1;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
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

const CalcResult = styled.div`
  background: rgba(34, 197, 94, 0.06);
  border-radius: 16px;
  padding: 24px 20px;
  border: 1px solid rgba(74, 222, 128, 0.2);
  text-align: center;
  animation: ${fadeInUp} 0.4s ease-out;
  position: relative;
  z-index: 1;

  @media (max-width: 480px) {
    padding: 18px 14px;
  }
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
  position: relative;

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

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
`;

const ResultItem = styled.div`
  text-align: center;
`;

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

// ─── PASSO A PASSO ─────────────────────────────────────────
const StepsSection = styled.div`
  background: linear-gradient(135deg,
    rgba(74, 140, 247, 0.05) 0%,
    rgba(168, 85, 247, 0.03) 100%);
  border-radius: 20px;
  padding: 28px;
  border: 1px solid rgba(74, 140, 247, 0.15);
  margin-bottom: 28px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -40px;
    right: -40px;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle,
      rgba(74, 140, 247, 0.08) 0%,
      transparent 70%);
    pointer-events: none;
  }

  @media (max-width: 480px) {
    padding: 20px 16px;
    margin-bottom: 22px;
  }
`;

const StepsList = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
  margin-top: 20px;
`;

const StepItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 12px 8px;
  position: relative;
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.25s ease;
  user-select: none;

  &:hover {
    background: rgba(74, 140, 247, 0.06);
    transform: translateX(3px);
  }

  &:active {
    transform: translateX(1px) scale(0.99);
  }
`;

const StepNumber = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: 800;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;

  background: ${p => p.$done
    ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
    : 'rgba(74, 140, 247, 0.15)'};
  border: 2px solid ${p => p.$done
    ? 'rgba(34, 197, 94, 0.6)'
    : 'rgba(74, 140, 247, 0.3)'};
  color: ${p => p.$done ? '#fff' : '#7eb8ff'};

  svg {
    width: 16px;
    height: 16px;
    stroke-width: 3;
  }

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: 24px;
    background: ${p => p.$done
      ? 'linear-gradient(180deg, #22c55e 0%, rgba(74, 140, 247, 0.2) 100%)'
      : 'rgba(74, 140, 247, 0.15)'};
    transition: background 0.3s ease;
  }

  ${p => p.$last && `
    &::after { display: none; }
  `}
`;

const StepContent = styled.div`
  flex: 1;
  padding-top: 6px;
  min-width: 0;
`;

const StepTitle = styled.div`
  color: ${p => p.$done ? '#a8b8d8' : '#e8eef7'};
  font-size: 0.95rem;
  font-weight: 600;
  text-decoration: ${p => p.$done ? 'line-through' : 'none'};
  text-decoration-thickness: 1.5px;
  text-decoration-color: rgba(168, 184, 216, 0.5);
  transition: all 0.3s ease;
  line-height: 1.5;

  @media (max-width: 480px) {
    font-size: 0.88rem;
  }
`;

const StepProgress = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  padding: 12px 16px;
  background: rgba(74, 140, 247, 0.08);
  border-radius: 12px;
  border: 1px solid rgba(74, 140, 247, 0.15);
  position: relative;
  z-index: 1;
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 3px;
  overflow: hidden;
  position: relative;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${p => p.$percent}%;
  background: linear-gradient(90deg, #4a8cf7 0%, #22c55e 100%);
  border-radius: 3px;
  transition: width 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 0 8px rgba(34, 197, 94, 0.4);
`;

const ProgressText = styled.div`
  color: #7eb8ff;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.5px;
  min-width: 40px;
  text-align: right;
`;

// ─── SEÇÕES (Materiais, Clientes, Preço) ───────────────────
const SectionsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Section = styled.div`
  background: rgba(74, 140, 247, 0.04);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid rgba(74, 140, 247, 0.1);
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(74, 140, 247, 0.25);
    background: rgba(74, 140, 247, 0.06);
  }

  @media (max-width: 480px) {
    padding: 16px;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;

  svg {
    color: #7eb8ff;
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }

  h3 {
    color: #e8eef7;
    font-size: 0.95rem;
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
  padding: 10px 12px 10px 32px;
  position: relative;
  color: #c8d8e8;
  font-weight: 500;
  background: rgba(74, 140, 247, 0.05);
  border-radius: 10px;
  border: 1px solid rgba(74, 140, 247, 0.08);
  transition: all 0.25s ease;
  font-size: 0.88rem;
  line-height: 1.4;

  &::before {
    content: '▸';
    color: #7eb8ff;
    font-weight: 900;
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.9rem;
  }

  &:hover {
    background: rgba(74, 140, 247, 0.1);
    border-color: rgba(74, 140, 247, 0.2);
    color: #e8eef7;
    transform: translateX(3px);
  }
`;

const PriceTag = styled.div`
  background: linear-gradient(135deg,
    rgba(74, 222, 128, 0.1) 0%,
    rgba(34, 197, 94, 0.08) 100%);
  padding: 16px 20px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 800;
  color: #86efac;
  border: 1px solid rgba(74, 222, 128, 0.25);
  font-size: 1.05rem;
  justify-content: center;
  text-align: center;

  svg { width: 22px; height: 22px; flex-shrink: 0; }

  @media (max-width: 480px) {
    font-size: 0.95rem;
    padding: 14px 16px;
  }
`;

// ─── NOT FOUND ─────────────────────────────────────────────
const NotFound = styled.div`
  text-align: center;
  padding: 70px 40px;
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

// ─── ÍCONES SVG ────────────────────────────────────────────
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

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// ─── COMPONENTE ────────────────────────────────────────────
const BusinessDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);

  // Estados da calculadora
  const [precoServico, setPrecoServico] = useState('');
  const [clientesDia, setClientesDia] = useState('');
  const [diasMes, setDiasMes] = useState('22');

  // Estados do passo a passo
  const [completedSteps, setCompletedSteps] = useState({});

  // Carrega dados com um pequeno delay pra skeleton
  useEffect(() => {
    setLoading(true);
    const found = businessData.find(b => b.id === parseInt(id));
    setTimeout(() => {
      setBusiness(found);
      setLoading(false);
    }, 250);
  }, [id]);

  // Carrega passos concluídos do localStorage quando o negócio muda
  useEffect(() => {
    if (!business) return;
    const saved = localStorage.getItem(`steps_${business.id}`);
    if (saved) {
      try {
        setCompletedSteps(JSON.parse(saved));
      } catch {
        setCompletedSteps({});
      }
    } else {
      setCompletedSteps({});
    }
  }, [business]);

  // Alterna um passo e salva no localStorage
  const toggleStep = (index) => {
    const newState = { ...completedSteps, [index]: !completedSteps[index] };
    setCompletedSteps(newState);
    if (business) {
      localStorage.setItem(`steps_${business.id}`, JSON.stringify(newState));
    }
  };

  // ─── SKELETON ────────────────────────────────────────────
  if (loading) {
    return (
      <Container>
        <SkeletonBox $w="180px" $h="14px" $mb="20px" />
        <Card>
          <Header>
            <SkeletonBox $w="100px" $h="100px" $radius="22px" />
            <div style={{ flex: 1 }}>
              <SkeletonBox $w="70%" $h="28px" $mb="12px" />
              <SkeletonBox $w="100px" $h="24px" $radius="999px" />
            </div>
          </Header>
          <SkeletonBox $w="100%" $h="80px" $mb="24px" />
          <StatsGrid>
            <SkeletonBox $w="100%" $h="110px" $radius="16px" />
            <SkeletonBox $w="100%" $h="110px" $radius="16px" />
            <SkeletonBox $w="100%" $h="110px" $radius="16px" />
          </StatsGrid>
        </Card>
      </Container>
    );
  }

  // ─── NOT FOUND ───────────────────────────────────────────
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

  // ─── HELPERS ─────────────────────────────────────────────
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

  // Passos do negócio atual
  const steps = businessSteps[business.name] || [];
  const completedCount = Object.values(completedSteps).filter(Boolean).length;

  const shareUrl = `${window.location.origin}/business/${business.id}`;
  const previewImage = `${window.location.origin}/preview.jpg`;

  // ─── RENDER ──────────────────────────────────────────────
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

      {/* BREADCRUMB */}
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
        {/* HEADER */}
        <Header>
          <EmojiWrapper>{business.image}</EmojiWrapper>
          <HeaderContent>
            <Name>{business.name}</Name>
            <Category>
              <PackageIcon />
              {business.category}
            </Category>
          </HeaderContent>
          <ShareWrapper>
            <ShareButton business={business} />
          </ShareWrapper>
        </Header>

        {/* DESCRIÇÃO */}
        <Description>{business.description}</Description>

        {/* STATS */}
        <StatsGrid>
          <StatCard>
            <StatIconBox $bg="rgba(74, 222, 128, 0.12)" $border="rgba(74, 222, 128, 0.25)">
              <MoneyIcon style={{ color: '#86efac' }} />
            </StatIconBox>
            <StatLabel>Investimento</StatLabel>
            <StatValue>{formatInvestment(business.minInvestment, business.maxInvestment)}</StatValue>
          </StatCard>

          <StatCard>
            <StatIconBox $bg="rgba(251, 191, 36, 0.12)" $border="rgba(251, 191, 36, 0.25)">
              <ChartIcon style={{ color: '#fbbf24' }} />
            </StatIconBox>
            <StatLabel>Margem de Lucro</StatLabel>
            <StatValue>{business.profitMargin}</StatValue>
          </StatCard>

          <StatCard>
            <StatIconBox $bg="rgba(96, 165, 250, 0.12)" $border="rgba(96, 165, 250, 0.25)">
              <ClockIcon style={{ color: '#60a5fa' }} />
            </StatIconBox>
            <StatLabel>Retorno</StatLabel>
            <StatValue>{business.payback}</StatValue>
          </StatCard>
        </StatsGrid>

        {/* CALCULADORA */}
        <CalculatorSection>
          <SectionTitle>
            <CalcIcon />
            Calculadora de Faturamento
          </SectionTitle>
          <SectionSubtitle>
            Descubra quanto você pode faturar com este negócio! Preencha os campos abaixo:
          </SectionSubtitle>

          <CalcGrid>
            <CalcField>
              <CalcLabel>
                <MoneyIcon />
                Preço por serviço (R$)
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
            </CalcResult>
          )}
        </CalculatorSection>

        {/* 🎯 PASSO A PASSO */}
        {steps.length > 0 && (
          <StepsSection>
            <SectionTitle>
              <TargetIcon />
              Como começar
            </SectionTitle>
            <SectionSubtitle>
              Siga este roteiro pra tirar seu negócio do papel. Toque em cada passo pra marcar como concluído:
            </SectionSubtitle>

            <StepsList>
              {steps.map((step, index) => (
                <StepItem
                  key={index}
                  onClick={() => toggleStep(index)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && toggleStep(index)}
                >
                  <StepNumber
                    $done={completedSteps[index]}
                    $last={index === steps.length - 1}
                  >
                    {completedSteps[index] ? <CheckIcon /> : index + 1}
                  </StepNumber>
                  <StepContent>
                    <StepTitle $done={completedSteps[index]}>
                      {step}
                    </StepTitle>
                  </StepContent>
                </StepItem>
              ))}
            </StepsList>

            <StepProgress>
              <ProgressBar>
                <ProgressFill
                  $percent={(completedCount / steps.length) * 100}
                />
              </ProgressBar>
              <ProgressText>
                {completedCount}/{steps.length}
              </ProgressText>
            </StepProgress>
          </StepsSection>
        )}

        {/* SEÇÕES FINAIS EM GRID */}
        <SectionsGrid>
          <Section>
            <SectionHeader>
              <PackageIcon />
              <h3>Materiais Necessários</h3>
            </SectionHeader>
            <List>
              {business.materials.map((material, index) => (
                <ListItem key={index}>{material}</ListItem>
              ))}
            </List>
          </Section>

          <Section>
            <SectionHeader>
              <UsersIcon />
              <h3>Potenciais Clientes</h3>
            </SectionHeader>
            <List>
              {business.potentialClients.map((client, index) => (
                <ListItem key={index}>{client}</ListItem>
              ))}
            </List>
          </Section>

          <Section style={{ gridColumn: '1 / -1' }}>
            <SectionHeader>
              <MoneyIcon />
              <h3>Preço Sugerido</h3>
            </SectionHeader>
            <PriceTag>
              <MoneyIcon />
              {business.suggestedPrice}
            </PriceTag>
          </Section>
        </SectionsGrid>
      </Card>
    </Container>
  );
};

export default BusinessDetail;