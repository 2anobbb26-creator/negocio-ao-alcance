import React from 'react';
import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

const SkeletonBase = styled.div`
  background: linear-gradient(90deg,
    rgba(255, 255, 255, 0.03) 0%,
    rgba(255, 255, 255, 0.08) 50%,
    rgba(255, 255, 255, 0.03) 100%);
  background-size: 800px 100%;
  animation: ${shimmer} 1.6s infinite linear;
  border-radius: ${props => props.$radius || '12px'};
  height: ${props => props.$h || '20px'};
  width: ${props => props.$w || '100%'};
  margin-bottom: ${props => props.$mb || '0'};
`;

// ─── COMPONENTES PRONTOS ───────────────────────────────────

/** Linha genérica de skeleton */
export const SkeletonLine = ({ w = '100%', h = '16px', radius = '8px', mb = '12px' }) => (
  <SkeletonBase $w={w} $h={h} $radius={radius} $mb={mb} />
);

/** Card de negócio em skeleton */
export const SkeletonBusinessCard = () => (
  <SkeletonCardWrapper>
    <SkeletonBase $w="70%" $h="20px" $mb="12px" />
    <SkeletonBase $w="40%" $h="14px" $mb="20px" />
    <SkeletonBase $w="100%" $h="60px" $mb="16px" />
    <SkeletonBase $w="100%" $h="44px" $mb="0" $radius="12px" />
  </SkeletonCardWrapper>
);

/** Grid de skeletons (para listas) */
export const SkeletonGrid = ({ count = 6 }) => (
  <GridWrapper>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonBusinessCard key={i} />
    ))}
  </GridWrapper>
);

/** Header de página em skeleton */
export const SkeletonHeader = () => (
  <HeaderWrapper>
    <SkeletonBase $w="60%" $h="28px" $mb="12px" $radius="14px" />
    <SkeletonBase $w="40%" $h="16px" $mb="0" $radius="8px" />
  </HeaderWrapper>
);

// ─── WRAPPERS ──────────────────────────────────────────────
const SkeletonCardWrapper = styled.div`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 24px;
  min-height: 260px;

  @media (max-width: 480px) {
    padding: 18px;
    border-radius: 14px;
  }
`;

const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const HeaderWrapper = styled.div`
  padding: 40px 32px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 24px;
  margin-bottom: 24px;
  border: 1px solid rgba(255, 255, 255, 0.04);

  @media (max-width: 480px) {
    padding: 28px 20px;
    border-radius: 18px;
  }
`;