import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { auth, authService } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { businessData } from '../data/businessData';
import BusinessCard from '../components/BusinessCard';
import { useToast } from '../components/Toast';

// ─── ANIMAÇÕES ─────────────────────────────────────────────
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const skeleton = keyframes`
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50%      { transform: scale(1.06); opacity: 0.85; }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// ─── LAYOUT ────────────────────────────────────────────────
const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 24px;
  animation: ${fadeInUp} 0.6s ease-out;
  position: relative;

  @media (max-width: 480px) { padding: 16px; }
`;

// ─── HEADER ────────────────────────────────────────────────
const Header = styled.div`
  position: relative;
  margin-bottom: 32px;
  padding: 60px 40px 40px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;

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

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(74, 140, 247, 0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(74, 140, 247, 0.04) 1px, transparent 1px);
    background-size: 32px 32px;
    pointer-events: none;
    mask-image: radial-gradient(circle at 50% 50%, black 0%, transparent 70%);
    -webkit-mask-image: radial-gradient(circle at 50% 50%, black 0%, transparent 70%);
  }

  @media (max-width: 900px) {
    padding: 70px 20px 28px;
  }

  @media (max-width: 480px) {
    padding: 60px 20px 28px;
    border-radius: 20px;
    margin-bottom: 24px;
  }
`;

const HeaderLeft = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 2.8rem;
  margin: 0 0 12px 0;
  font-weight: 800;
  letter-spacing: -1px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;

  background: linear-gradient(135deg,
    #ffffff 0%, #d0e0ff 30%, #7eb8ff 70%, #4a8cf7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  svg {
    -webkit-text-fill-color: initial;
    width: 40px;
    height: 40px;
  }

  @media (max-width: 768px) {
    font-size: 2.2rem;
    gap: 12px;

    svg {
      width: 32px;
      height: 32px;
    }
  }

  @media (max-width: 480px) {
    font-size: 1.7rem;
    gap: 10px;

    svg {
      width: 26px;
      height: 26px;
    }
  }
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #a8b8d8;
  margin: 0;
  font-weight: 500;
  text-align: center;
  max-width: 520px;
  line-height: 1.5;

  @media (max-width: 480px) {
    font-size: 0.95rem;
  }
`;

const CounterBadge = styled.div`
  position: absolute;
  top: 50%;
  right: 30px;
  transform: translateY(-50%);
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  background: linear-gradient(135deg, rgba(74, 140, 247, 0.12), rgba(37, 99, 235, 0.08));
  border: 1px solid rgba(74, 140, 247, 0.25);
  border-radius: 999px;
  box-shadow: 0 4px 20px rgba(37, 99, 235, 0.15);

  @media (max-width: 900px) {
    position: static;
    transform: none;
    margin-top: 20px;
  }

  @media (max-width: 480px) {
    padding: 8px 18px;
    margin-top: 16px;
  }
`;

const CounterValue = styled.div`
  font-size: 1.5rem;
  font-weight: 800;
  color: #fff;
  line-height: 1;
  letter-spacing: -0.5px;

  @media (max-width: 480px) { font-size: 1.2rem; }
`;

const CounterLabel = styled.div`
  font-size: 0.72rem;
  color: #7eb8ff;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-weight: 700;

  @media (max-width: 480px) { font-size: 0.65rem; }
`;

const BackLink = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: rgba(74, 140, 247, 0.08);
  border: 1px solid rgba(74, 140, 247, 0.18);
  border-radius: 8px;
  color: #7eb8ff;
  font-family: inherit;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.25s ease;
  z-index: 3;

  svg {
    transition: transform 0.25s ease;
    width: 14px;
    height: 14px;
  }

  &:hover {
    background: rgba(74, 140, 247, 0.15);
    border-color: rgba(74, 140, 247, 0.4);
    color: #a8ccff;
    transform: translateX(-2px);

    svg { transform: translateX(-3px); }
  }

  @media (max-width: 480px) {
    top: 14px;
    left: 14px;
    padding: 5px 9px;
    font-size: 0.65rem;
    gap: 5px;

    svg {
      width: 12px;
      height: 12px;
    }
  }
`;

// ─── BARRA DE AÇÕES ────────────────────────────────────────
const ActionsBar = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  animation: ${slideIn} 0.5s ease-out;
  animation-delay: 0.1s;
  animation-fill-mode: both;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const SearchWrapper = styled.div`
  flex: 1;
  min-width: 240px;
  position: relative;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    min-width: 100%;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 14px 44px 14px 46px;
  background: rgba(10, 21, 48, 0.6);
  backdrop-filter: blur(16px);
  border: 1.5px solid rgba(74, 140, 247, 0.2);
  border-radius: 14px;
  color: #e8eef7;
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 500;
  outline: none;
  transition: all 0.25s ease;

  &::placeholder {
    color: #556677;
    font-weight: 400;
  }

  &:focus {
    border-color: rgba(74, 140, 247, 0.55);
    background: rgba(10, 21, 48, 0.85);
    box-shadow: 0 0 0 4px rgba(74, 140, 247, 0.1);
  }
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #7eb8ff;
  pointer-events: none;
  display: flex;
  align-items: center;
`;

const SearchClear = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #a8b8d8;
  cursor: pointer;
  display: grid;
  place-items: center;
  padding: 0;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(239, 68, 68, 0.15);
    border-color: rgba(239, 68, 68, 0.35);
    color: #f87171;
  }

  svg { width: 12px; height: 12px; stroke-width: 2.5; }
`;

const RandomButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 22px;
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(124, 92, 255, 0.12));
  border: 1px solid rgba(168, 85, 247, 0.35);
  border-radius: 14px;
  color: #c4a3ff;
  font-family: inherit;
  font-size: 0.88rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  cursor: pointer;
  transition: all 0.25s ease;
  white-space: nowrap;

  svg { width: 16px; height: 16px; }

  &:hover {
    background: linear-gradient(135deg, rgba(168, 85, 247, 0.25), rgba(124, 92, 255, 0.2));
    border-color: rgba(168, 85, 247, 0.6);
    color: #fff;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(168, 85, 247, 0.3);
  }

  &:active { transform: translateY(0) scale(0.98); }

  @media (max-width: 768px) {
    justify-content: center;
    width: 100%;
  }
`;

const ExploreHeaderBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 22px;
  background: rgba(74, 140, 247, 0.08);
  border: 1px solid rgba(74, 140, 247, 0.25);
  border-radius: 14px;
  color: #a8ccff;
  font-family: inherit;
  font-size: 0.88rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  cursor: pointer;
  transition: all 0.25s ease;
  white-space: nowrap;

  svg { width: 16px; height: 16px; }

  &:hover {
    background: rgba(74, 140, 247, 0.16);
    border-color: rgba(74, 140, 247, 0.5);
    color: #fff;
    transform: translateY(-2px);
  }

  &:active { transform: translateY(0) scale(0.98); }

  @media (max-width: 768px) {
    justify-content: center;
    width: 100%;
  }
`;

// ─── GRID ──────────────────────────────────────────────────
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 24px;

  & > * {
    animation: ${fadeInUp} 0.5s ease-out backwards;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

// ⭐ Wrapper simples — sem badge, sem moldura
const FavoriteCardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

// ─── NOTA PESSOAL ──────────────────────────────────────────
const NoteBox = styled.div`
  background: linear-gradient(135deg,
    rgba(74, 140, 247, 0.06),
    rgba(168, 85, 247, 0.03));
  border: 1px solid rgba(74, 140, 247, 0.15);
  border-radius: 12px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: all 0.25s ease;

  &:hover {
    border-color: rgba(74, 140, 247, 0.3);
    background: linear-gradient(135deg,
      rgba(74, 140, 247, 0.1),
      rgba(168, 85, 247, 0.05));
  }
`;

const NoteHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;

  .label {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: #7eb8ff;
    font-size: 0.68rem;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .actions {
    display: flex;
    gap: 4px;
  }
`;

const NoteBtn = styled.button`
  background: transparent;
  border: none;
  color: #8899aa;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  display: grid;
  place-items: center;
  transition: all 0.2s ease;

  svg { width: 14px; height: 14px; }

  &:hover {
    background: rgba(74, 140, 247, 0.15);
    color: #7eb8ff;
  }

  &.delete:hover {
    background: rgba(239, 68, 68, 0.15);
    color: #f87171;
  }
`;

const NoteText = styled.div`
  color: #cbd9ee;
  font-size: 0.82rem;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
`;

const NotePlaceholder = styled.button`
  background: transparent;
  border: 1px dashed rgba(74, 140, 247, 0.25);
  border-radius: 10px;
  padding: 10px 14px;
  color: #6b7fa8;
  font-family: inherit;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;

  svg { width: 14px; height: 14px; }

  &:hover {
    border-color: rgba(74, 140, 247, 0.5);
    background: rgba(74, 140, 247, 0.05);
    color: #a8ccff;
  }
`;

const NoteInput = styled.textarea`
  width: 100%;
  min-height: 70px;
  padding: 10px 12px;
  background: rgba(10, 21, 48, 0.6);
  border: 1.5px solid rgba(74, 140, 247, 0.3);
  border-radius: 10px;
  color: #e8eef7;
  font-family: inherit;
  font-size: 0.82rem;
  line-height: 1.5;
  resize: vertical;
  outline: none;

  &::placeholder { color: #556677; }

  &:focus {
    border-color: rgba(74, 140, 247, 0.6);
    box-shadow: 0 0 0 3px rgba(74, 140, 247, 0.1);
  }
`;

const NoteActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

const NoteSaveBtn = styled.button`
  padding: 6px 14px;
  background: linear-gradient(135deg, #2563eb, #4f7cff);
  border: none;
  border-radius: 8px;
  color: #fff;
  font-family: inherit;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
  }
`;

const NoteCancelBtn = styled.button`
  padding: 6px 14px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  color: #8899aa;
  font-family: inherit;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #cbd9ee;
  }
`;

// ─── SKELETON ──────────────────────────────────────────────
const SkeletonCard = styled.div`
  height: 280px;
  border-radius: 20px;
  background: linear-gradient(90deg,
    rgba(255, 255, 255, 0.03) 0%,
    rgba(255, 255, 255, 0.07) 50%,
    rgba(255, 255, 255, 0.03) 100%);
  background-size: 800px 100%;
  animation: ${skeleton} 1.6s infinite linear;
  border: 1px solid rgba(255, 255, 255, 0.04);
`;

// ─── EMPTY STATE ───────────────────────────────────────────
const Empty = styled.div`
  text-align: center;
  padding: 60px 40px 50px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
  overflow: hidden;
  animation: ${fadeInUp} 0.6s ease-out;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(74, 140, 247, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(74, 140, 247, 0.03) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
    mask-image: radial-gradient(circle at 50% 50%, black 0%, transparent 60%);
    -webkit-mask-image: radial-gradient(circle at 50% 50%, black 0%, transparent 60%);
  }

  @media (max-width: 480px) {
    padding: 40px 20px 36px;
    border-radius: 20px;
  }
`;

const EmptyIcon = styled.div`
  position: relative;
  z-index: 1;
  font-size: 4rem;
  margin-bottom: 20px;
  color: #f87171;
  animation: ${pulse} 3s ease-in-out infinite;

  @media (max-width: 480px) { font-size: 3rem; margin-bottom: 16px; }
`;

const EmptyTitle = styled.h3`
  position: relative;
  z-index: 1;
  color: #e8eef7;
  font-size: 1.5rem;
  margin: 0 0 14px 0;
  font-weight: 800;
  letter-spacing: -0.4px;

  @media (max-width: 480px) { font-size: 1.2rem; }
`;

const EmptyText = styled.p`
  position: relative;
  z-index: 1;
  color: #a8b8d8;
  max-width: 520px;
  margin: 0 auto 28px;
  font-size: 0.95rem;
  line-height: 1.65;

  strong {
    color: #cbd9ee;
    font-weight: 700;
  }

  @media (max-width: 480px) { font-size: 0.88rem; margin-bottom: 22px; }
`;

const ExploreButton = styled.button`
  position: relative;
  z-index: 1;
  padding: 14px 32px;
  background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
  border: 1px solid rgba(74, 140, 247, 0.4);
  border-radius: 12px;
  color: #fff;
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s ease;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.25);

  svg { width: 18px; height: 18px; }

  &:hover {
    background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(37, 99, 235, 0.4);
  }

  @media (max-width: 480px) {
    padding: 12px 24px;
    font-size: 0.88rem;
  }
`;

// ─── SUGESTÕES POPULARES ───────────────────────────────────
const SuggestionsSection = styled.div`
  position: relative;
  z-index: 1;
  margin-top: 48px;
  padding-top: 36px;
  border-top: 1px solid rgba(74, 140, 247, 0.12);
`;

const SuggestionsHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 22px;
  justify-content: center;

  .icon { font-size: 1.3rem; }

  h4 {
    color: #e8eef7;
    font-size: 1.1rem;
    font-weight: 800;
    margin: 0;
    letter-spacing: -0.02em;
  }

  @media (max-width: 480px) {
    h4 { font-size: 1rem; }
  }
`;

const SuggestionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  text-align: left;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SuggestionCard = styled.div`
  padding: 16px 18px;
  background: rgba(74, 140, 247, 0.05);
  border: 1px solid rgba(74, 140, 247, 0.15);
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  align-items: center;
  gap: 12px;

  &:hover {
    background: rgba(74, 140, 247, 0.1);
    border-color: rgba(74, 140, 247, 0.35);
    transform: translateY(-3px);
    box-shadow: 0 10px 24px -8px rgba(74, 140, 247, 0.3);
  }
`;

const SuggestionEmoji = styled.div`
  font-size: 1.6rem;
  flex-shrink: 0;
  width: 46px;
  height: 46px;
  display: grid;
  place-items: center;
  background: rgba(74, 140, 247, 0.08);
  border-radius: 12px;
`;

const SuggestionInfo = styled.div`
  flex: 1;
  min-width: 0;

  .name {
    color: #e8eef7;
    font-size: 0.85rem;
    font-weight: 700;
    margin-bottom: 3px;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .category {
    color: #8899aa;
    font-size: 0.68rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
`;

// ─── ÍCONES SVG ────────────────────────────────────────────
const HeartIcon = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="url(#heartGradient)"
    stroke="none"
  >
    <defs>
      <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fb7185" />
        <stop offset="100%" stopColor="#e11d48" />
      </linearGradient>
    </defs>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const SearchIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const BackArrow = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 12H5" />
    <path d="m12 19-7-7 7-7" />
  </svg>
);

const DiceIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="3" ry="3" />
    <circle cx="8.5" cy="8.5" r="0.8" fill="currentColor" />
    <circle cx="15.5" cy="8.5" r="0.8" fill="currentColor" />
    <circle cx="12" cy="12" r="0.8" fill="currentColor" />
    <circle cx="8.5" cy="15.5" r="0.8" fill="currentColor" />
    <circle cx="15.5" cy="15.5" r="0.8" fill="currentColor" />
  </svg>
);

const CompassIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
);

const NoteIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const EditIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

// ─── HELPERS ───────────────────────────────────────────────
const NOTES_KEY = (userId, businessId) => `note_${userId}_${businessId}`;

const loadNote = (userId, businessId) => {
  if (!userId) return '';
  return localStorage.getItem(NOTES_KEY(userId, businessId)) || '';
};

const saveNote = (userId, businessId, note) => {
  if (!userId) return;
  if (note.trim()) {
    localStorage.setItem(NOTES_KEY(userId, businessId), note.trim());
  } else {
    localStorage.removeItem(NOTES_KEY(userId, businessId));
  }
};

// ─── COMPONENTE ────────────────────────────────────────────
const Favoritos = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');

  const [editingNote, setEditingNote] = useState(null);
  const [noteDraft, setNoteDraft] = useState('');
  const [notes, setNotes] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const loadFavorites = async () => {
      setLoading(true);

      const result = await authService.getFavorites(userId);

      if (result.success && result.data.length > 0) {
        const favoriteBusinesses = businessData.filter(b =>
          result.data.includes(b.id)
        );
        setFavorites(favoriteBusinesses);

        const loadedNotes = {};
        favoriteBusinesses.forEach(b => {
          const note = loadNote(userId, b.id);
          if (note) loadedNotes[b.id] = note;
        });
        setNotes(loadedNotes);
      } else {
        setFavorites([]);
        setNotes({});
      }

      setLoading(false);
    };

    loadFavorites();
  }, [userId]);

  const filteredFavorites = useMemo(() => {
    if (!searchTerm.trim()) return favorites;
    const term = searchTerm.toLowerCase().trim();

    return favorites.filter(b =>
      b.name.toLowerCase().includes(term) ||
      b.category.toLowerCase().includes(term) ||
      b.description?.toLowerCase().includes(term)
    );
  }, [favorites, searchTerm]);

  const handleRandom = () => {
    if (favorites.length === 0) return;
    const random = favorites[Math.floor(Math.random() * favorites.length)];
    showToast(`🎲 Surpresa: ${random.name}`, 'success', 2000);
    setTimeout(() => {
      navigate(`/business/${random.id}`);
    }, 400);
  };

  const startEditNote = (businessId) => {
    setEditingNote(businessId);
    setNoteDraft(notes[businessId] || '');
  };

  const cancelEditNote = () => {
    setEditingNote(null);
    setNoteDraft('');
  };

  const handleSaveNote = (businessId) => {
    const trimmed = noteDraft.trim();
    saveNote(userId, businessId, trimmed);

    if (trimmed) {
      setNotes(prev => ({ ...prev, [businessId]: trimmed }));
      showToast('📝 Nota salva!', 'success', 1500);
    } else {
      setNotes(prev => {
        const next = { ...prev };
        delete next[businessId];
        return next;
      });
      showToast('🗑️ Nota removida', 'info', 1500);
    }

    setEditingNote(null);
    setNoteDraft('');
  };

  const handleDeleteNote = (businessId) => {
    saveNote(userId, businessId, '');
    setNotes(prev => {
      const next = { ...prev };
      delete next[businessId];
      return next;
    });
    showToast('🗑️ Nota removida', 'info', 1500);
  };

  const popularSuggestions = useMemo(() => {
    return businessData.slice(0, 3);
  }, []);

  if (loading) {
    return (
      <Container>
        <Header>
          <BackLink onClick={() => navigate('/')}>
            <BackArrow />
            Voltar ao início
          </BackLink>
          <HeaderLeft>
            <Title>
              <HeartIcon />
              Meus Favoritos
            </Title>
            <Subtitle>Carregando seus negócios salvos...</Subtitle>
          </HeaderLeft>
        </Header>
        <Grid>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <SkeletonCard key={i} style={{ animationDelay: `${i * 0.08}s` }} />
          ))}
        </Grid>
      </Container>
    );
  }

  const hasFavorites = favorites.length > 0;
  const hasSearchResults = filteredFavorites.length > 0;

  return (
    <Container>
      <Header>
        <BackLink onClick={() => navigate('/')}>
          <BackArrow />
          Voltar ao início
        </BackLink>

        <HeaderLeft>
          <Title>
            <HeartIcon />
            Meus Favoritos
          </Title>
          <Subtitle>
            {hasFavorites
              ? 'Os negócios que você salvou em um só lugar'
              : 'Sua lista pessoal de negócios'}
          </Subtitle>
        </HeaderLeft>

        {hasFavorites && (
          <CounterBadge>
            <CounterValue>{favorites.length}</CounterValue>
            <CounterLabel>
              {favorites.length === 1 ? 'Negócio' : 'Negócios'}
            </CounterLabel>
          </CounterBadge>
        )}
      </Header>

      {hasFavorites ? (
        <>
          <ActionsBar>
            <SearchWrapper>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <SearchInput
                type="text"
                placeholder="Buscar nos favoritos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Buscar nos favoritos"
              />
              {searchTerm && (
                <SearchClear
                  onClick={() => setSearchTerm('')}
                  aria-label="Limpar busca"
                >
                  <XIcon />
                </SearchClear>
              )}
            </SearchWrapper>

            {favorites.length >= 2 && (
              <RandomButton onClick={handleRandom} title="Escolher um aleatório">
                <DiceIcon />
                Surpreenda-me
              </RandomButton>
            )}

            <ExploreHeaderBtn onClick={() => navigate('/')}>
              <CompassIcon />
              Explorar
            </ExploreHeaderBtn>
          </ActionsBar>

          {hasSearchResults ? (
            <Grid>
              {filteredFavorites.map((business, index) => (
                <FavoriteCardWrapper
                  key={business.id}
                  style={{ animationDelay: `${index * 0.06}s` }}
                >
                  <BusinessCard business={business} />

                  {editingNote === business.id ? (
                    <NoteBox>
                      <NoteHeader>
                        <span className="label">
                          <NoteIcon />
                          Sua nota
                        </span>
                      </NoteHeader>

                      <NoteInput
                        autoFocus
                        placeholder="Ex: Vou testar esse em março..."
                        value={noteDraft}
                        onChange={(e) => setNoteDraft(e.target.value)}
                        maxLength={200}
                      />

                      <NoteActions>
                        <NoteCancelBtn onClick={cancelEditNote}>
                          Cancelar
                        </NoteCancelBtn>
                        <NoteSaveBtn onClick={() => handleSaveNote(business.id)}>
                          Salvar
                        </NoteSaveBtn>
                      </NoteActions>
                    </NoteBox>
                  ) : notes[business.id] ? (
                    <NoteBox>
                      <NoteHeader>
                        <span className="label">
                          <NoteIcon />
                          Sua nota
                        </span>
                        <div className="actions">
                          <NoteBtn
                            onClick={() => startEditNote(business.id)}
                            title="Editar nota"
                          >
                            <EditIcon />
                          </NoteBtn>
                          <NoteBtn
                            className="delete"
                            onClick={() => handleDeleteNote(business.id)}
                            title="Excluir nota"
                          >
                            <TrashIcon />
                          </NoteBtn>
                        </div>
                      </NoteHeader>

                      <NoteText>{notes[business.id]}</NoteText>
                    </NoteBox>
                  ) : (
                    <NotePlaceholder onClick={() => startEditNote(business.id)}>
                      <NoteIcon />
                      Adicionar nota pessoal
                    </NotePlaceholder>
                  )}
                </FavoriteCardWrapper>
              ))}
            </Grid>
          ) : (
            <Empty>
              <EmptyIcon>🔍</EmptyIcon>
              <EmptyTitle>Nenhum resultado</EmptyTitle>
              <EmptyText>
                Não encontramos nenhum favorito para <strong>"{searchTerm}"</strong>.
                Tente outra palavra ou limpe a busca.
              </EmptyText>
              <ExploreButton onClick={() => setSearchTerm('')}>
                <XIcon />
                Limpar busca
              </ExploreButton>
            </Empty>
          )}
        </>
      ) : (
        <Empty>
          <EmptyIcon>💔</EmptyIcon>
          <EmptyTitle>Você ainda não favoritou nada</EmptyTitle>
          <EmptyText>
            Salve os negócios que mais te interessam tocando no{' '}
            <strong>coração 🤍</strong> dos cards. Eles ficam guardados
            aqui pra você consultar quando quiser.
          </EmptyText>

          <ExploreButton onClick={() => navigate('/')}>
            <SearchIcon />
            Explorar Negócios
          </ExploreButton>

          <SuggestionsSection>
            <SuggestionsHeader>
              <span className="icon">🔥</span>
              <h4>Populares pra começar</h4>
            </SuggestionsHeader>

            <SuggestionsGrid>
              {popularSuggestions.map(business => (
                <SuggestionCard
                  key={business.id}
                  onClick={() => navigate(`/business/${business.id}`)}
                >
                  <SuggestionEmoji>{business.image}</SuggestionEmoji>
                  <SuggestionInfo>
                    <div className="name">{business.name}</div>
                    <div className="category">{business.category}</div>
                  </SuggestionInfo>
                </SuggestionCard>
              ))}
            </SuggestionsGrid>
          </SuggestionsSection>
        </Empty>
      )}
    </Container>
  );
};

export default Favoritos;