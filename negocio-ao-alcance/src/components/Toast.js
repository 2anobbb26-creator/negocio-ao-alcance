import React, { createContext, useContext, useState, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';

// ─── ANIMAÇÕES ─────────────────────────────────────────────
const slideIn = keyframes`
  from { opacity: 0; transform: translateY(20px) scale(0.95); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;

const slideOut = keyframes`
  from { opacity: 1; transform: translateY(0) scale(1); }
  to   { opacity: 0; transform: translateY(20px) scale(0.95); }
`;

// ─── CONTEXT ───────────────────────────────────────────────
const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast precisa estar dentro de <ToastProvider>');
  }
  return context;
};

// ─── ESTILOS ───────────────────────────────────────────────
const ToastContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 99999;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none;
  max-width: calc(100vw - 40px);

  @media (max-width: 480px) {
    top: 12px;
    right: 12px;
    left: 12px;
    max-width: none;
  }
`;

const ToastItem = styled.div`
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  border-radius: 14px;
  background: ${p => {
    if (p.$type === 'success') return 'linear-gradient(135deg, rgba(34, 197, 94, 0.95), rgba(22, 163, 74, 0.95))';
    if (p.$type === 'error') return 'linear-gradient(135deg, rgba(239, 68, 68, 0.95), rgba(220, 38, 38, 0.95))';
    if (p.$type === 'warning') return 'linear-gradient(135deg, rgba(251, 191, 36, 0.95), rgba(245, 158, 11, 0.95))';
    return 'linear-gradient(135deg, rgba(74, 140, 247, 0.95), rgba(37, 99, 235, 0.95))';
  }};
  color: #fff;
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.2px;
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.35),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  animation: ${p => p.$leaving ? slideOut : slideIn} 0.3s ease-out forwards;
  min-width: 240px;
  max-width: 380px;
  cursor: pointer;

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }

  @media (max-width: 480px) {
    padding: 12px 16px;
    font-size: 0.85rem;
    min-width: 0;
  }
`;

const ToastMessage = styled.div`
  flex: 1;
  line-height: 1.3;
  word-break: break-word;
`;

// ─── ÍCONES ────────────────────────────────────────────────
const SuccessIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ErrorIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const WarningIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const InfoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const getIcon = (type) => {
  switch (type) {
    case 'success': return <SuccessIcon />;
    case 'error': return <ErrorIcon />;
    case 'warning': return <WarningIcon />;
    case 'info':
    default: return <InfoIcon />;
  }
};

// ─── PROVIDER ──────────────────────────────────────────────
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 2500) => {
    const id = Date.now() + Math.random();

    setToasts(prev => [...prev, { id, message, type, leaving: false }]);

    setTimeout(() => {
      setToasts(prev =>
        prev.map(t => t.id === id ? { ...t, leaving: true } : t)
      );
    }, duration - 300);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev =>
      prev.map(t => t.id === id ? { ...t, leaving: true } : t)
    );
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 300);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <ToastContainer>
        {toasts.map(toast => (
          <ToastItem
            key={toast.id}
            $type={toast.type}
            $leaving={toast.leaving}
            onClick={() => removeToast(toast.id)}
            role="alert"
          >
            {getIcon(toast.type)}
            <ToastMessage>{toast.message}</ToastMessage>
          </ToastItem>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
};