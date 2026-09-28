import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { auth } from '../services/firebase';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.15); }
  100% { transform: scale(1); }
`;

const Container = styled.div`
  position: relative;
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

  &:hover {
    background: rgba(74, 140, 247, 0.15);
    border-color: rgba(74, 140, 247, 0.3);
    transform: translateY(-2px);
  }

  &:active {
    transform: scale(0.95);
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
`;

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  width: 360px;
  max-height: 480px;
  overflow-y: auto;
  background: linear-gradient(145deg, #0d1b3e 0%, #0a1530 100%);
  border: 1px solid rgba(74, 140, 247, 0.3);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
  z-index: 1001;
  animation: ${fadeIn} 0.3s ease-out;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(74, 140, 247, 0.3);
    border-radius: 10px;
  }

  @media (max-width: 480px) {
    width: 300px;
    right: -20px;
  }
`;

const DropdownHeader = styled.div`
  padding: 18px 20px;
  border-bottom: 1px solid rgba(74, 140, 247, 0.15);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background: #0d1b3e;
  z-index: 1;
`;

const DropdownTitle = styled.h3`
  color: #e8eef7;
  font-size: 1rem;
  font-weight: 800;
  margin: 0;
`;

const MarkAllButton = styled.button`
  background: none;
  border: none;
  color: #7eb8ff;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: #a855f7;
  }
`;

const NotificationItem = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid rgba(74, 140, 247, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  gap: 12px;
  background: ${props => props.$read ? 'transparent' : 'rgba(74, 140, 247, 0.05)'};
  border-left: 3px solid ${props => props.$read ? 'transparent' : '#4a8cf7'};

  &:hover {
    background: rgba(74, 140, 247, 0.1);
  }

  &:last-child {
    border-bottom: none;
  }
`;

const NotificationIcon = styled.div`
  font-size: 1.5rem;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(74, 140, 247, 0.1);
  border-radius: 10px;
`;

const NotificationContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const NotificationTitle = styled.div`
  color: #e8eef7;
  font-size: 0.9rem;
  font-weight: 700;
  margin-bottom: 4px;
`;

const NotificationText = styled.div`
  color: #a8b8d8;
  font-size: 0.8rem;
  line-height: 1.4;
  margin-bottom: 6px;
`;

const NotificationTime = styled.div`
  color: #6b7fa8;
  font-size: 0.7rem;
  font-weight: 600;
`;

const Empty = styled.div`
  padding: 48px 20px;
  text-align: center;
  color: #a8b8d8;
  font-size: 0.9rem;
`;

const EmptyIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 12px;
  opacity: 0.5;
`;

const Notifications = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);

  // 🔄 CARREGAR NOTIFICAÇÕES
  useEffect(() => {
    loadNotifications();
  }, []);

  // 🔒 FECHAR AO CLICAR FORA
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadNotifications = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    // 🔑 Chave única por usuário
    const storageKey = `notifications_${currentUser.uid}`;
    const lastSeenKey = `lastSeenBusiness_${currentUser.uid}`;

    // 📦 Dados do localStorage
    const savedNotifications = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const lastSeen = localStorage.getItem(lastSeenKey);

    setNotifications(savedNotifications);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = (e) => {
    e.stopPropagation();
    
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);

    const storageKey = `notifications_${currentUser.uid}`;
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const handleNotificationClick = (notification) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    // Marcar como lida
    const updated = notifications.map(n =>
      n.id === notification.id ? { ...n, read: true } : n
    );
    setNotifications(updated);

    const storageKey = `notifications_${currentUser.uid}`;
    localStorage.setItem(storageKey, JSON.stringify(updated));

    // Navegar para o negócio
    if (notification.businessId) {
      navigate(`/business/${notification.businessId}`);
      setIsOpen(false);
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Agora mesmo';
    if (diffMins < 60) return `${diffMins} min atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays < 7) return `${diffDays}d atrás`;
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <Container ref={dropdownRef}>
      <BellButton onClick={() => setIsOpen(!isOpen)} title="Notificações">
        🔔
        {unreadCount > 0 && <Badge>{unreadCount}</Badge>}
      </BellButton>

      {isOpen && (
        <Dropdown>
          <DropdownHeader>
            <DropdownTitle>
              🔔 Notificações {unreadCount > 0 && `(${unreadCount})`}
            </DropdownTitle>
            {unreadCount > 0 && (
              <MarkAllButton onClick={handleMarkAllRead}>
                Marcar todas como lidas
              </MarkAllButton>
            )}
          </DropdownHeader>

          {notifications.length === 0 ? (
            <Empty>
              <EmptyIcon>🔕</EmptyIcon>
              Nenhuma notificação ainda
            </Empty>
          ) : (
            notifications.map(notification => (
              <NotificationItem
                key={notification.id}
                $read={notification.read}
                onClick={() => handleNotificationClick(notification)}
              >
                <NotificationIcon>{notification.icon || '🆕'}</NotificationIcon>
                <NotificationContent>
                  <NotificationTitle>{notification.title}</NotificationTitle>
                  <NotificationText>{notification.message}</NotificationText>
                  <NotificationTime>{formatTime(notification.createdAt)}</NotificationTime>
                </NotificationContent>
              </NotificationItem>
            ))
          )}
        </Dropdown>
      )}
    </Container>
  );
};

export default Notifications;