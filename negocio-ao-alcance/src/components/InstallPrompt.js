import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(100%); }
  to { opacity: 1; transform: translateY(0); }
`;

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Detecta iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(iOS);

    // Detecta se já está instalado (standalone)
    const standalone = window.matchMedia('(display-mode: standalone)').matches 
      || window.navigator.standalone === true;
    setIsStandalone(standalone);

    // Não mostra se já está instalado
    if (standalone) return;

    // Verifica se o usuário já dispensou recentemente
    const dismissed = localStorage.getItem('installPromptDismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) return; // Não mostra por 7 dias
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Se for iOS, mostra o banner manualmente após 3 segundos
    if (iOS) {
      const timer = setTimeout(() => setVisible(true), 3000);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('beforeinstallprompt', handler);
      };
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (isIOS) {
      // iOS não suporta o prompt automático
      return;
    }

    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log('📱 Instalação:', outcome);
    
    setDeferredPrompt(null);
    setVisible(false);

    if (outcome === 'accepted') {
      localStorage.setItem('installPromptDismissed', Date.now().toString());
    }
  };

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem('installPromptDismissed', Date.now().toString());
  };

  if (!visible || isStandalone) return null;

  return (
    <Banner>
      <BannerContent>
        <BannerIcon>📱</BannerIcon>
        <BannerText>
          <BannerTitle>Instale o app!</BannerTitle>
          <BannerSubtitle>
            {isIOS 
              ? 'Toque em Compartilhar → Adicionar à Tela de Início'
              : 'Acesso rápido direto da sua tela inicial'}
          </BannerSubtitle>
        </BannerText>
      </BannerContent>

      <BannerActions>
        {!isIOS && (
          <InstallButton onClick={handleInstall}>
            Instalar
          </InstallButton>
        )}
        <DismissButton onClick={handleDismiss}>
          Agora não
        </DismissButton>
      </BannerActions>
    </Banner>
  );
};

export default InstallPrompt;

/* ========== ESTILOS ========== */

const Banner = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  max-width: 420px;
  width: calc(100% - 32px);
  background: linear-gradient(135deg, #0d1b3e 0%, #1e3a8a 100%);
  border: 1px solid rgba(74, 140, 247, 0.35);
  border-radius: 18px;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(74, 140, 247, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  z-index: 9999;
  animation: ${slideUp} 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  backdrop-filter: blur(20px);

  @media (max-width: 480px) {
    bottom: 12px;
    padding: 14px 16px;
    gap: 12px;
  }
`;

const BannerContent = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const BannerIcon = styled.div`
  font-size: 2rem;
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(74, 140, 247, 0.15);
  border-radius: 14px;
  border: 1px solid rgba(74, 140, 247, 0.25);
`;

const BannerText = styled.div`
  flex: 1;
  min-width: 0;
`;

const BannerTitle = styled.div`
  color: #e8eef7;
  font-size: 0.95rem;
  font-weight: 800;
  margin-bottom: 3px;
  letter-spacing: -0.2px;
`;

const BannerSubtitle = styled.div`
  color: #a8b8d8;
  font-size: 0.78rem;
  line-height: 1.4;
`;

const BannerActions = styled.div`
  display: flex;
  gap: 8px;
`;

const InstallButton = styled.button`
  flex: 1;
  padding: 11px 20px;
  background: linear-gradient(135deg, #3d7eeb 0%, #4a8cf7 50%, #6b7cf7 100%);
  border: none;
  border-radius: 12px;
  color: #fff;
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  letter-spacing: 0.4px;
  box-shadow: 0 4px 12px rgba(74, 140, 247, 0.35);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(74, 140, 247, 0.45);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const DismissButton = styled.button`
  padding: 11px 16px;
  background: transparent;
  border: 1px solid rgba(168, 184, 216, 0.2);
  border-radius: 12px;
  color: #8899aa;
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #e8eef7;
    border-color: rgba(168, 184, 216, 0.35);
  }
`;