import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log('📱 Instalação:', outcome);
    setDeferredPrompt(null);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <Banner>
      <Text>📱 Instale o app no seu celular!</Text>
      <Button onClick={handleInstall}>Instalar</Button>
      <CloseBtn onClick={() => setVisible(false)}>✕</CloseBtn>
    </Banner>
  );
};

export default InstallPrompt;

const Banner = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #0d1b3e, #1e3a8a);
  border: 1px solid rgba(74, 140, 247, 0.3);
  border-radius: 14px;
  padding: 14px 18px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  z-index: 9999;
  animation: slideUp 0.4s ease-out;

  @keyframes slideUp {
    from { opacity: 0; transform: translateX(-50%) translateY(20px); }
    to { opacity: 1; transform: translateX(-50%) translateY(0); }
  }

  @media (max-width: 480px) {
    left: 12px;
    right: 12px;
    transform: none;
    flex-wrap: wrap;
    padding: 12px;

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  }
`;

const Text = styled.span`
  color: #e8eef7;
  font-size: 0.9rem;
  font-weight: 600;
  flex: 1;

  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

const Button = styled.button`
  background: linear-gradient(135deg, #4a8cf7, #a855f7);
  border: none;
  color: #fff;
  padding: 8px 18px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: transform 0.2s;
  font-family: inherit;

  &:hover {
    transform: scale(1.05);
  }
`;

const CloseBtn = styled.button`
  background: transparent;
  border: none;
  color: #a8b8d8;
  font-size: 1rem;
  cursor: pointer;
  padding: 4px 8px;
  font-family: inherit;

  &:hover {
    color: #fff;
  }
`;