import React, { useState } from 'react';
import styled from 'styled-components';

const ShareButton = ({ business, variant = 'default' }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/business/${business.id}`;
  const shareText = `Confira esse negócio: ${business.name} ${business.image || ''}`;

  const handleNativeShare = async (e) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: business.name,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        // usuário cancelou
      }
    } else {
      setShowMenu(true);
    }
  };

  const shareWhatsApp = (e) => {
    e.stopPropagation();
    const url = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`;
    window.open(url, '_blank');
    setShowMenu(false);
  };

  const shareFacebook = (e) => {
    e.stopPropagation();
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
    setShowMenu(false);
  };

  const shareTwitter = (e) => {
    e.stopPropagation();
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
    setShowMenu(false);
  };

  const copyLink = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('❌ Erro ao copiar:', err);
    }
    setShowMenu(false);
  };

  return (
    <Wrapper>
      <MainButton
        onClick={handleNativeShare}
        aria-label="Compartilhar"
        title="Compartilhar"
        $variant={variant}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
      </MainButton>

      {showMenu && (
        <>
          <Overlay onClick={(e) => { e.stopPropagation(); setShowMenu(false); }} />
          <Menu onClick={(e) => e.stopPropagation()}>
            <MenuItem onClick={shareWhatsApp}>
              <Icon style={{ color: '#25D366' }}>💬</Icon>
              WhatsApp
            </MenuItem>
            <MenuItem onClick={shareFacebook}>
              <Icon style={{ color: '#1877F2' }}>📘</Icon>
              Facebook
            </MenuItem>
            <MenuItem onClick={shareTwitter}>
              <Icon style={{ color: '#1DA1F2' }}>🐦</Icon>
              Twitter / X
            </MenuItem>
            <MenuItem onClick={copyLink}>
              <Icon style={{ color: '#4a8cf7' }}>🔗</Icon>
              {copied ? 'Link copiado!' : 'Copiar link'}
            </MenuItem>
          </Menu>
        </>
      )}
    </Wrapper>
  );
};

export default ShareButton;

/* ========== ESTILOS ========== */

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const MainButton = styled.button`
  background: ${props => props.$variant === 'large'
    ? 'rgba(74, 140, 247, 0.12)'
    : 'rgba(74, 140, 247, 0.1)'
  };
  border: 1px solid rgba(74, 140, 247, 0.25);
  border-radius: ${props => props.$variant === 'large' ? '12px' : '50%'};
  color: #7eb8ff;
  width: ${props => props.$variant === 'large' ? '48px' : '38px'};
  height: ${props => props.$variant === 'large' ? '48px' : '38px'};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.25s ease;
  flex-shrink: 0;
  padding: 0;

  &:hover {
    background: rgba(74, 140, 247, 0.22);
    color: #ffffff;
    transform: translateY(-2px);
    border-color: rgba(74, 140, 247, 0.5);
  }

  &:active {
    transform: translateY(0) scale(0.96);
  }

  svg {
    width: ${props => props.$variant === 'large' ? '20px' : '16px'};
    height: ${props => props.$variant === 'large' ? '20px' : '16px'};
  }

  @media (max-width: 480px) {
    width: ${props => props.$variant === 'large' ? '42px' : '34px'};
    height: ${props => props.$variant === 'large' ? '42px' : '34px'};

    svg {
      width: ${props => props.$variant === 'large' ? '18px' : '15px'};
      height: ${props => props.$variant === 'large' ? '18px' : '15px'};
    }
  }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 998;
`;

const Menu = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  z-index: 999;
  background: #0d1b3e;
  border: 1px solid rgba(74, 140, 247, 0.3);
  border-radius: 12px;
  padding: 6px;
  min-width: 180px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  animation: fadeInMenu 0.15s ease-out;

  @keyframes fadeInMenu {
    from { opacity: 0; transform: translateY(-6px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 480px) {
    min-width: 160px;
    right: -8px;
  }
`;

const MenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: #e8eef7;
  font-size: 0.9rem;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  transition: background 0.2s;
  font-family: inherit;

  &:hover {
    background: rgba(74, 140, 247, 0.15);
  }
`;

const Icon = styled.span`
  font-size: 1.1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
`;