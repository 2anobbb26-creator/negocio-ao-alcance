import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// ─── URL BASE DO APP ───────────────────────────────────────
// Usa a variável de ambiente (produção) ou cai pra localhost (dev)
const APP_URL =
  process.env.REACT_APP_APP_URL ||
  (typeof window !== 'undefined' ? window.location.origin : '');

const IconButton = styled.button`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  width: 38px;
  height: 38px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #7eb8ff;
  transition: all 0.3s ease;
  padding: 0;
  flex-shrink: 0;

  &:hover {
    background: rgba(74, 140, 247, 0.15);
    border-color: rgba(74, 140, 247, 0.4);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    width: 18px;
    height: 18px;
  }

  @media (max-width: 480px) {
    width: 34px;
    height: 34px;

    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(10px);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  animation: ${fadeIn} 0.2s ease-out;
`;

const Modal = styled.div`
  background: linear-gradient(145deg, #0d1b3e 0%, #0a1530 100%);
  border: 1px solid rgba(74, 140, 247, 0.25);
  border-radius: 22px;
  padding: 24px;
  max-width: 420px;
  width: 100%;
  position: relative;
  animation: ${slideUp} 0.3s ease-out;
`;

const ModalTitle = styled.h3`
  color: #e8eef7;
  font-size: 1.1rem;
  margin: 0 0 20px 0;
  font-weight: 800;
  text-align: center;
`;

const PreviewCard = styled.div`
  background: linear-gradient(135deg, #0a1530 0%, #0d1b3e 50%, #142952 100%);
  border: 1px solid rgba(74, 140, 247, 0.3);
  border-radius: 18px;
  padding: 24px;
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, #ffffff 0%, #7eb8ff 50%, #a855f7 100%);
  }
`;

const PreviewEmoji = styled.div`
  font-size: 3rem;
  text-align: center;
  margin-bottom: 12px;
`;

const PreviewName = styled.h4`
  color: #e8eef7;
  font-size: 1.15rem;
  margin: 0 0 6px 0;
  font-weight: 800;
  text-align: center;
  line-height: 1.3;
`;

const PreviewCategory = styled.div`
  display: inline-block;
  padding: 3px 12px;
  background: rgba(74, 140, 247, 0.15);
  border-radius: 20px;
  font-size: 0.62rem;
  color: #a8b8d8;
  border: 1px solid rgba(74, 140, 247, 0.2);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 auto 12px;
  display: block;
  text-align: center;
  width: fit-content;
`;

const PreviewDescription = styled.p`
  color: #a8b8d8;
  font-size: 0.8rem;
  line-height: 1.5;
  text-align: center;
  margin: 0;
`;

const PreviewBranding = styled.div`
  text-align: center;
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px dashed rgba(74, 140, 247, 0.2);
  font-size: 0.7rem;
  color: #7eb8ff;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
`;

const ActionsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 8px;

  @media (max-width: 480px) {
    gap: 6px;
  }
`;

const ActionBtn = styled.button`
  padding: 12px 8px;
  border-radius: 12px;
  border: 1px solid ${props => props.$color || 'rgba(74, 140, 247, 0.3)'};
  background: ${props => props.$bg || 'rgba(74, 140, 247, 0.1)'};
  color: ${props => props.$textColor || '#7eb8ff'};
  font-family: inherit;
  font-size: 0.7rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  letter-spacing: 0.3px;
  text-transform: uppercase;

  svg {
    width: 20px;
    height: 20px;
  }

  &:hover {
    transform: translateY(-2px);
    filter: brightness(1.3);
  }

  &:active {
    transform: translateY(0) scale(0.97);
  }

  @media (max-width: 480px) {
    padding: 10px 6px;
    font-size: 0.62rem;

    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 14px;
  right: 14px;
  background: none;
  border: none;
  color: #a8b8d8;
  cursor: pointer;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    color: #fff;
  }
`;

const Toast = styled.div`
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #1e3a8a, #2563eb);
  color: #fff;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 700;
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.4);
  z-index: 1001;
  animation: ${slideUp} 0.3s ease-out;
`;

// ─── ÍCONES SVG ────────────────────────────────────────────
const ShareIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

const WhatsappIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

// ─── COMPONENTE ────────────────────────────────────────────
const ShareButton = ({ business }) => {
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState('');

  // 🌐 URL final (produção ou localhost como fallback)
  const shareUrl = `${APP_URL}/business/${business.id}`;
  const shareTitle = `Conheça: ${business.name}`;
  const shareText = `💰 ${business.name}\n${business.description}\n\nVeja mais em: ${shareUrl}`;

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const handleShareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
    showToast('Abrindo WhatsApp...');
  };

  const handleShareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`,
      '_blank'
    );
    showToast('Abrindo Twitter...');
  };

  const handleCopyLink = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: shareTitle,
          text: business.description,
          url: shareUrl,
        });
        setOpen(false);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        showToast('Link copiado! 📋');
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        showToast('Link copiado! 📋');
        await navigator.clipboard.writeText(shareUrl).catch(() => {});
      }
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: business.description,
          url: shareUrl,
        });
        setOpen(false);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.warn('Erro no compartilhamento:', err);
        }
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <>
      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        title="Compartilhar"
        aria-label="Compartilhar negócio"
      >
        <ShareIcon />
      </IconButton>

      {open && (
        <Overlay onClick={() => setOpen(false)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={() => setOpen(false)}>✕</CloseButton>

            <ModalTitle>Compartilhar</ModalTitle>

            {/* Preview do card */}
            <PreviewCard>
              <PreviewEmoji>{business.image}</PreviewEmoji>
              <PreviewName>{business.name}</PreviewName>
              <PreviewCategory>{business.category}</PreviewCategory>
              <PreviewDescription>{business.description}</PreviewDescription>
              <PreviewBranding>Negócio ao Alcance</PreviewBranding>
            </PreviewCard>

            {/* Ações */}
            <ActionsRow>
              <ActionBtn
                onClick={handleShareWhatsApp}
                $bg="rgba(37, 211, 102, 0.12)"
                $color="rgba(37, 211, 102, 0.35)"
                $textColor="#25d366"
              >
                <WhatsappIcon />
                WhatsApp
              </ActionBtn>

              <ActionBtn
                onClick={handleShareTwitter}
                $bg="rgba(255, 255, 255, 0.08)"
                $color="rgba(255, 255, 255, 0.15)"
                $textColor="#e8eef7"
              >
                <TwitterIcon />
                Twitter
              </ActionBtn>

              <ActionBtn
                onClick={handleCopyLink}
                $bg="rgba(74, 140, 247, 0.12)"
                $color="rgba(74, 140, 247, 0.35)"
                $textColor="#7eb8ff"
              >
                <LinkIcon />
                Copiar
              </ActionBtn>
            </ActionsRow>

            {typeof navigator.share === 'function' && (
              <ActionsRow style={{ gridTemplateColumns: '1fr' }}>
                <ActionBtn
                  onClick={handleNativeShare}
                  $bg="linear-gradient(135deg, #1e3a8a, #2563eb)"
                  $color="rgba(74, 140, 247, 0.6)"
                  $textColor="#fff"
                  style={{ padding: '14px', flexDirection: 'row', fontSize: '0.8rem' }}
                >
                  <ShareIcon />
                  Compartilhar via...
                </ActionBtn>
              </ActionsRow>
            )}
          </Modal>
        </Overlay>
      )}

      {toast && <Toast>{toast}</Toast>}
    </>
  );
};

export default ShareButton;