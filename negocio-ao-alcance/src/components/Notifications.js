import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { auth } from '../services/firebase';
import { notificationService, NOTIFICATION_TYPES } from '../utils/notificationService';

// ─── ANIMAÇÕES ─────────────────────────────────────────────
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.15); }
  100% { transform: scale(1); }
`;

const slideInItem = keyframes`
  from { opacity: 0; transform: translateX(-6px); }
  to { opacity: 1; transform: translateX(0); }
`;

// ⭐ animação do painel mobile subindo de baixo
const slideUpMobile = keyframes`
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
`;

const fadeInBackdrop = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

// ─── CONTAINER ─────────────────────────────────────────────
const Container = styled.div`
  position: relative;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const BellButton = styled.button`
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  width: 42px;
  height: 42px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  color: #e8eef7;
  padding: 0;
  flex-shrink: 0;

  &:hover {
    background: rgba(74, 140, 247, 0.15);
    border-color: rgba(74, 140, 247, 0.3);
    transform: translateY(-2px);
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    width: 100%;
    height: auto;
    border-radius: 10px;
    padding: 14px 18px;
    justify-content: flex-start;
    gap: 10px;
    font-size: 1rem;
    background: rgba(74, 140, 247, 0.06);
    border: 1px solid rgba(74, 140, 247, 0.1);

    &::after {
      content: 'Notificações';
      font-weight: 600;
      color: #a8b8d8;
    }

    &:hover {
      transform: none;
      background: rgba(74, 140, 247, 0.15);
    }
  }
`;

const Badge = styled.span`
  position: absolute;
  top: -4px;
  right: -4px;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: #fff;
  font-size: 0.65rem;
  font-weight: 800;
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #0a1530;
  animation: ${pulse} 2s ease-in-out infinite;

  @media (max-width: 768px) {
    position: static;
    margin-left: auto;
    border: none;
    min-width: 22px;
    height: 22px;
    font-size: 0.7rem;
  }
`;

// ⭐ Backdrop escuro (só mobile)
const Backdrop = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.55);
    backdrop-filter: blur(2px);
    z-index: 2000;
    animation: ${fadeInBackdrop} 0.25s ease-out;
  }
`;

// ─── DROPDOWN (desktop) / BOTTOM SHEET (mobile) ────────────
const Dropdown = styled.div`
  /* ═══════════ DESKTOP ═══════════ */
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  width: 380px;
  max-height: 520px;
  overflow-y: auto;
  background: linear-gradient(145deg, #0d1b3e 0%, #0a1530 100%);
  border: 1px solid rgba(74, 140, 247, 0.3);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
  z-index: 1001;
  animation: ${fadeIn} 0.3s ease-out;

  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb {
    background: rgba(74, 140, 247, 0.3);
    border-radius: 10px;
  }

  /* ═══════════ MOBILE: BOTTOM SHEET ═══════════ */
  @media (max-width: 768px) {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    top: auto;
    width: 100%;
    max-height: 85vh;
    border-radius: 24px 24px 0 0;
    border: none;
    border-top: 1px solid rgba(74, 140, 247, 0.4);
    box-shadow: 0 -20px 60px rgba(0, 0, 0, 0.6);
    animation: ${slideUpMobile} 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.075);
    z-index: 2001;
    padding-bottom: env(safe-area-inset-bottom, 0);

    /* Alça de arrastar */
    &::before {
      content: '';
      position: absolute;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      width: 42px;
      height: 4px;
      border-radius: 2px;
      background: rgba(255, 255, 255, 0.2);
      z-index: 10;
    }
  }
`;

const DropdownHeader = styled.div`
  padding: 20px 22px 16px;
  border-bottom: 1px solid rgba(74, 140, 247, 0.15);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  position: sticky;
  top: 0;
  background: #0d1b3e;
  z-index: 1;

  @media (max-width: 768px) {
    padding: 28px 20px 14px; /* mais espaço no topo por causa da alça */
    flex-wrap: wrap;
  }
`;

const DropdownTitle = styled.h3`
  color: #e8eef7;
  font-size: 0.95rem;
  font-weight: 800;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;

  span.count {
    color: #7eb8ff;
    font-size: 0.82rem;
    font-weight: 700;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const MarkAllButton = styled.button`
  background: none;
  border: none;
  color: #7eb8ff;
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;
  transition: color 0.3s;
  font-family: inherit;
  padding: 4px 0;
  white-space: nowrap;

  &:hover { color: #a855f7; }

  @media (max-width: 768px) {
    font-size: 0.78rem;
    padding: 6px 0;
  }
`;

// ⭐ Botão de fechar no mobile
const CloseButton = styled.button`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #a8b8d8;
    cursor: pointer;
    padding: 0;
    flex-shrink: 0;

    svg {
      width: 14px;
      height: 14px;
      stroke-width: 2.5;
    }

    &:active {
      transform: scale(0.92);
      background: rgba(239, 68, 68, 0.15);
      color: #f87171;
    }
  }
`;

// ─── GRUPO POR DIA ─────────────────────────────────────────
const GroupLabel = styled.div`
  padding: 12px 22px 6px;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #6b7fa8;
  background: rgba(74, 140, 247, 0.02);
  position: sticky;
  top: 61px;
  backdrop-filter: blur(6px);
  z-index: 0;

  @media (max-width: 768px) {
    padding: 12px 20px 6px;
    font-size: 0.68rem;
    top: 78px;
  }
`;

// ─── ITEM ──────────────────────────────────────────────────
const NotificationItem = styled.div`
  padding: 14px 22px;
  border-bottom: 1px solid rgba(74, 140, 247, 0.08);
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  gap: 12px;
  position: relative;
  animation: ${slideInItem} 0.3s ease-out;

  background: ${props => props.$read
    ? 'transparent'
    : props.$bg || 'rgba(74, 140, 247, 0.05)'};

  border-left: 3px solid ${props => props.$read
    ? 'transparent'
    : props.$color || '#4a8cf7'};

  &:hover {
    background: rgba(74, 140, 247, 0.1);
    transform: translateX(2px);
  }

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    padding: 16px 20px;
    gap: 14px;

    /* Torna clicável de forma clara no touch */
    &:active {
      background: rgba(74, 140, 247, 0.15);
      transform: scale(0.99);
    }

    &:hover {
      transform: none; /* sem translate no mobile */
    }
  }
`;

const NotificationIcon = styled.div`
  font-size: 1.3rem;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;

  background: ${props => props.$bg || 'rgba(74, 140, 247, 0.1)'};
  border: 1px solid ${props => props.$border || 'transparent'};

  @media (max-width: 768px) {
    width: 44px;
    height: 44px;
    font-size: 1.4rem;
    border-radius: 13px;
  }
`;

const NotificationContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const NotificationTitle = styled.div`
  color: #e8eef7;
  font-size: 0.87rem;
  font-weight: 700;
  margin-bottom: 4px;
  line-height: 1.35;

  @media (max-width: 768px) {
    font-size: 0.92rem;
    margin-bottom: 5px;
  }
`;

const NotificationText = styled.div`
  color: #a8b8d8;
  font-size: 0.78rem;
  line-height: 1.45;
  margin-bottom: 6px;

  @media (max-width: 768px) {
    font-size: 0.82rem;
    line-height: 1.5;
  }
`;

const NotificationTime = styled.div`
  color: #6b7fa8;
  font-size: 0.68rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;

  .dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #6b7fa8;
    opacity: 0.5;
  }

  @media (max-width: 768px) {
    font-size: 0.72rem;
    gap: 8px;
  }
`;

const UnreadDot = styled.span`
  position: absolute;
  top: 20px;
  right: 16px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4a8cf7;
  box-shadow: 0 0 8px rgba(74, 140, 247, 0.8);

  @media (max-width: 768px) {
    top: 24px;
    right: 18px;
    width: 9px;
    height: 9px;
  }
`;

// ─── EMPTY STATE ───────────────────────────────────────────
const Empty = styled.div`
  padding: 52px 32px 44px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;

  @media (max-width: 768px) {
    padding: 48px 24px 56px;
    gap: 16px;
  }
`;

const EmptyIconWrapper = styled.div`
  width: 76px;
  height: 76px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: radial-gradient(circle at 50% 50%,
    rgba(74, 140, 247, 0.14),
    rgba(168, 85, 247, 0.06));
  border: 1px solid rgba(74, 140, 247, 0.2);
  color: #7eb8ff;
  margin-bottom: 4px;

  svg {
    width: 36px;
    height: 36px;
    stroke-width: 1.8;
  }

  @media (max-width: 768px) {
    width: 88px;
    height: 88px;

    svg { width: 42px; height: 42px; }
  }
`;

const EmptyTitle = styled.div`
  color: #e8eef7;
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: -0.01em;

  @media (max-width: 768px) {
    font-size: 1.05rem;
  }
`;

const EmptyText = styled.div`
  color: #8899aa;
  font-size: 0.82rem;
  line-height: 1.5;
  max-width: 260px;

  @media (max-width: 768px) {
    font-size: 0.85rem;
    max-width: 280px;
  }
`;

// ─── ÍCONES SVG ────────────────────────────────────────────
const BellOffIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    <path d="M18.63 13A17.89 17.89 0 0 1 18 8" />
    <path d="M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14" />
    <path d="M18 8a6 6 0 0 0-9.33-5" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ─── HELPERS ───────────────────────────────────────────────
const getTypeInfo = (type) => {
  return NOTIFICATION_TYPES[type] || NOTIFICATION_TYPES.system;
};

const getDayGroup = (timestamp) => {
  const now = new Date();
  const date = new Date(timestamp);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const notifDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.floor((today - notifDay) / 86400000);

  if (diffDays === 0) return 'Hoje';
  if (diffDays === 1) return 'Ontem';
  if (diffDays < 7) return 'Esta semana';
  return 'Mais antigas';
};

const formatTime = (timestamp) => {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Agora mesmo';
  if (diffMins < 60) return `${diffMins} min`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return date.toLocaleDateString('pt-BR');
};

// ⭐ Detecta se é mobile
const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= 768;
};

// ─── COMPONENTE ────────────────────────────────────────────
const Notifications = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    loadNotifications();
  }, []);

  // ─── Fecha ao clicar fora (só desktop) ──────────────────
  useEffect(() => {
    const handleClickOutside = (event) => {
      // No mobile o dropdown é um bottom sheet com backdrop, não precisa detectar click fora
      if (isMobile()) return;

      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ─── Bloqueia scroll do body quando o sheet tá aberto (mobile) ──
  useEffect(() => {
    if (!isMobile()) return;

    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // ─── ⭐ MARCA COMO LIDA AO ABRIR ────────────────────────
  useEffect(() => {
    if (isOpen && notifications.some(n => !n.read)) {
      const timer = setTimeout(() => {
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        notificationService.markAllAsRead(currentUser.uid);
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const loadNotifications = () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const storageKey = `notifications_${currentUser.uid}`;
    const savedNotifications = JSON.parse(localStorage.getItem(storageKey) || '[]');

    savedNotifications.sort((a, b) => b.createdAt - a.createdAt);
    setNotifications(savedNotifications);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = (e) => {
    e.stopPropagation();

    const currentUser = auth.currentUser;
    if (!currentUser) return;

    notificationService.markAllAsRead(currentUser.uid);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleNotificationClick = (notification) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    notificationService.markAsRead(currentUser.uid, notification.id);
    setNotifications(prev =>
      prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
    );

    if (notification.actionUrl) {
      navigate(notification.actionUrl);
      setIsOpen(false);
    } else if (notification.businessId) {
      navigate(`/business/${notification.businessId}`);
      setIsOpen(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // ─── Agrupa por dia ─────────────────────────────────────
  const groupedNotifications = notifications.reduce((acc, notif) => {
    const group = getDayGroup(notif.createdAt);
    if (!acc[group]) acc[group] = [];
    acc[group].push(notif);
    return acc;
  }, {});

  const groupOrder = ['Hoje', 'Ontem', 'Esta semana', 'Mais antigas'];
  const orderedGroups = groupOrder.filter(g => groupedNotifications[g]?.length > 0);

  return (
    <Container ref={dropdownRef}>
      <BellButton onClick={() => setIsOpen(!isOpen)} title="Notificações">
        🔔
        {unreadCount > 0 && (
          <Badge>{unreadCount > 9 ? '9+' : unreadCount}</Badge>
        )}
      </BellButton>

      {isOpen && (
        <>
          {/* Backdrop (só aparece no mobile) */}
          <Backdrop onClick={handleClose} />

          <Dropdown>
            <DropdownHeader>
              <DropdownTitle>
                🔔 Notificações
                {unreadCount > 0 && <span className="count">({unreadCount})</span>}
              </DropdownTitle>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {unreadCount > 0 && (
                  <MarkAllButton onClick={handleMarkAllRead}>
                    Marcar todas
                  </MarkAllButton>
                )}
                <CloseButton onClick={handleClose} aria-label="Fechar">
                  <XIcon />
                </CloseButton>
              </div>
            </DropdownHeader>

            {notifications.length === 0 ? (
              <Empty>
                <EmptyIconWrapper>
                  <BellOffIcon />
                </EmptyIconWrapper>
                <EmptyTitle>Tudo em dia por aqui!</EmptyTitle>
                <EmptyText>
                  Quando algo novo aparecer, você será notificado.
                </EmptyText>
              </Empty>
            ) : (
              orderedGroups.map(group => (
                <div key={group}>
                  <GroupLabel>{group}</GroupLabel>
                  {groupedNotifications[group].map(notification => {
                    const typeInfo = getTypeInfo(notification.type);
                    return (
                      <NotificationItem
                        key={notification.id}
                        $read={notification.read}
                        $bg={typeInfo.bg}
                        $color={typeInfo.color}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <NotificationIcon
                          $bg={typeInfo.bg}
                          $border={`${typeInfo.color}40`}
                        >
                          {typeInfo.icon}
                        </NotificationIcon>

                        <NotificationContent>
                          <NotificationTitle>{notification.title}</NotificationTitle>
                          <NotificationText>{notification.message}</NotificationText>
                          <NotificationTime>
                            {typeInfo.label}
                            <span className="dot" />
                            {formatTime(notification.createdAt)}
                          </NotificationTime>
                        </NotificationContent>

                        {!notification.read && <UnreadDot />}
                      </NotificationItem>
                    );
                  })}
                </div>
              ))
            )}
          </Dropdown>
        </>
      )}
    </Container>
  );
};

export default Notifications;