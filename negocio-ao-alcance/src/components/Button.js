import React, { useState, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

// ─── ANIMAÇÕES ─────────────────────────────────────────────
const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

const rippleAnim = keyframes`
  from {
    transform: scale(0);
    opacity: 0.55;
  }
  to {
    transform: scale(2.5);
    opacity: 0;
  }
`;

const successPop = keyframes`
  0%   { transform: scale(1); }
  50%  { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// ─── BOTÃO BASE ────────────────────────────────────────────
const StyledButton = styled.button`
  position: relative;
  overflow: hidden;
  padding: 14px 24px;
  border-radius: 12px;
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.4px;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.3s ease,
    background 0.3s ease,
    border-color 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  user-select: none;
  -webkit-tap-highlight-color: transparent;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }

  /* Success state */
  ${props => props.$success && `
    animation: ${successPop} 0.35s ease;
  `}

  /* Ripple */
  span.ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.55);
    transform: scale(0);
    animation: ${rippleAnim} 0.6s ease-out;
    pointer-events: none;
  }
`;

// ─── VARIAÇÕES ─────────────────────────────────────────────
const variants = {
  primary: `
    background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
    border: 1px solid rgba(74, 140, 247, 0.4);
    color: #ffffff;
    box-shadow:
      0 4px 16px rgba(37, 99, 235, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);

    &:hover:not(:disabled) {
      background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
      transform: translateY(-2px);
      border-color: rgba(74, 140, 247, 0.6);
      box-shadow:
        0 10px 28px rgba(37, 99, 235, 0.45),
        inset 0 1px 0 rgba(255, 255, 255, 0.15);
    }
  `,
  ghost: `
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #a8b8d8;

    &:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
      transform: translateY(-2px);
    }
  `,
  danger: `
    background: rgba(239, 68, 68, 0.12);
    border: 1px solid rgba(239, 68, 68, 0.35);
    color: #f87171;

    &:hover:not(:disabled) {
      background: rgba(239, 68, 68, 0.2);
      color: #fff;
      transform: translateY(-2px);
    }
  `,
};

const VariantButton = styled(StyledButton)`
  ${props => variants[props.$variant] || variants.primary}
`;

// ─── ÍCONE SPINNER ─────────────────────────────────────────
const SpinnerSVG = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ animation: `${spin} 0.9s linear infinite` }}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

// ─── ÍCONE CHECK ───────────────────────────────────────────
const CheckSVG = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// ─── COMPONENTE PRINCIPAL ──────────────────────────────────
const Button = ({
  children,
  variant = 'primary',
  loading = false,
  loadingText,
  success = false,
  successText = 'Feito!',
  onClick,
  disabled,
  type = 'button',
  ...rest
}) => {
  const [ripples, setRipples] = useState([]);
  const buttonRef = useRef(null);

  const handleClick = (e) => {
    if (loading || disabled) return;

    // Cria ripple no ponto do clique
    const button = buttonRef.current;
    if (button) {
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      const newRipple = {
        id: Date.now() + Math.random(),
        x,
        y,
        size,
      };

      setRipples(prev => [...prev, newRipple]);

      // Remove depois da animação
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 600);
    }

    if (onClick) onClick(e);
  };

  // Define o conteúdo do botão
  let content = children;
  if (loading) {
    content = (
      <>
        <SpinnerSVG />
        {loadingText || children}
      </>
    );
  } else if (success) {
    content = (
      <>
        <CheckSVG />
        {successText}
      </>
    );
  }

  return (
    <VariantButton
      ref={buttonRef}
      $variant={variant}
      $success={success}
      type={type}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-busy={loading}
      aria-disabled={disabled || loading}
      {...rest}
    >
      {content}
      {ripples.map(r => (
        <span
          key={r.id}
          className="ripple"
          style={{
            width: r.size,
            height: r.size,
            left: r.x,
            top: r.y,
          }}
        />
      ))}
    </VariantButton>
  );
};

export default Button;