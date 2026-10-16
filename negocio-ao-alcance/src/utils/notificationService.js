// 🔔 SERVIÇO DE NOTIFICAÇÕES
// Detecta novos negócios, favoritos, lembretes, conquistas e sistema

import { businessData } from '../data/businessData';

const BUSINESS_VERSION_KEY = 'businessDataVersion';

// ─────────────────────────────────────────────────────────────
// TIPOS DE NOTIFICAÇÃO
// Cada tipo tem ícone, cor e "label" própria
// ─────────────────────────────────────────────────────────────
export const NOTIFICATION_TYPES = {
  new_business: {
    id: 'new_business',
    icon: '🆕',
    color: '#4a8cf7',
    bg: 'rgba(74, 140, 247, 0.12)',
    label: 'Novo negócio',
  },
  favorite: {
    id: 'favorite',
    icon: '❤️',
    color: '#ec4899',
    bg: 'rgba(236, 72, 153, 0.12)',
    label: 'Favorito',
  },
  reminder: {
    id: 'reminder',
    icon: '⏰',
    color: '#fbbf24',
    bg: 'rgba(251, 191, 36, 0.12)',
    label: 'Lembrete',
  },
  achievement: {
    id: 'achievement',
    icon: '🏆',
    color: '#22c55e',
    bg: 'rgba(34, 197, 94, 0.12)',
    label: 'Conquista',
  },
  system: {
    id: 'system',
    icon: '⚙️',
    color: '#94a3b8',
    bg: 'rgba(148, 163, 184, 0.12)',
    label: 'Sistema',
  },
};

// Helper interno: salva no localStorage
const saveNotification = (userId, notification) => {
  const storageKey = `notifications_${userId}`;
  const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
  const updated = [notification, ...existing].slice(0, 50);
  localStorage.setItem(storageKey, JSON.stringify(updated));
  return notification;
};

export const notificationService = {
  // ─────────────────────────────────────────────────────────
  // DETECÇÃO AUTOMÁTICA
  // ─────────────────────────────────────────────────────────

  // 🆕 Verifica se há novos negócios na base
  checkForNewBusinesses(userId) {
    if (!userId) return [];

    const currentVersion = businessData.length;
    const lastVersion = parseInt(
      localStorage.getItem(`${BUSINESS_VERSION_KEY}_${userId}`) || '0'
    );

    // Primeira vez: salva versão e não notifica
    if (lastVersion === 0) {
      localStorage.setItem(`${BUSINESS_VERSION_KEY}_${userId}`, currentVersion);
      return [];
    }

    // Detecta novos negócios
    if (currentVersion > lastVersion) {
      const newBusinesses = businessData.slice(lastVersion);
      const notifications = newBusinesses.map(business => ({
        id: `notif_${business.id}_${Date.now()}`,
        type: 'new_business',
        businessId: business.id,
        title: `Novo negócio: ${business.name}`,
        message: `${business.category} · Investimento: R$ ${business.minInvestment.toLocaleString('pt-BR')} - R$ ${business.maxInvestment.toLocaleString('pt-BR')}`,
        createdAt: Date.now(),
        read: false,
        actionUrl: `/business/${business.id}`,
      }));

      // Salva todas
      const storageKey = `notifications_${userId}`;
      const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const updated = [...notifications, ...existing].slice(0, 50);
      localStorage.setItem(storageKey, JSON.stringify(updated));

      // Atualiza versão
      localStorage.setItem(`${BUSINESS_VERSION_KEY}_${userId}`, currentVersion);

      return notifications;
    }

    return [];
  },

  // ─────────────────────────────────────────────────────────
  // CRIAR NOTIFICAÇÕES MANUALMENTE
  // ─────────────────────────────────────────────────────────

  // 🆕 Novo negócio
  notifyNewBusiness(userId, business) {
    if (!userId || !business) return null;
    return saveNotification(userId, {
      id: `notif_new_${business.id}_${Date.now()}`,
      type: 'new_business',
      businessId: business.id,
      title: `Novo negócio: ${business.name}`,
      message: `${business.category} · R$ ${business.minInvestment} - R$ ${business.maxInvestment}`,
      createdAt: Date.now(),
      read: false,
      actionUrl: `/business/${business.id}`,
    });
  },

  // ❤️ Favorito
  notifyFavorite(userId, business) {
    if (!userId || !business) return null;
    return saveNotification(userId, {
      id: `notif_fav_${business.id}_${Date.now()}`,
      type: 'favorite',
      businessId: business.id,
      title: `Adicionado aos favoritos`,
      message: `Você salvou "${business.name}" na sua lista`,
      createdAt: Date.now(),
      read: false,
      actionUrl: `/business/${business.id}`,
    });
  },

  // ⏰ Lembrete
  notifyReminder(userId, { title, message, actionUrl = null }) {
    if (!userId) return null;
    return saveNotification(userId, {
      id: `notif_reminder_${Date.now()}`,
      type: 'reminder',
      title: title || 'Não esqueça!',
      message: message || 'Você tem uma tarefa pendente',
      createdAt: Date.now(),
      read: false,
      actionUrl,
    });
  },

  // 🏆 Conquista
  notifyAchievement(userId, { title, message, actionUrl = null }) {
    if (!userId) return null;
    return saveNotification(userId, {
      id: `notif_ach_${Date.now()}`,
      type: 'achievement',
      title: title || 'Conquista desbloqueada!',
      message: message || 'Você fez algo incrível',
      createdAt: Date.now(),
      read: false,
      actionUrl,
    });
  },

  // ⚙️ Sistema
  notifySystem(userId, { title, message, actionUrl = null }) {
    if (!userId) return null;
    return saveNotification(userId, {
      id: `notif_sys_${Date.now()}`,
      type: 'system',
      title: title || 'Aviso do sistema',
      message: message || '',
      createdAt: Date.now(),
      read: false,
      actionUrl,
    });
  },

  // ─────────────────────────────────────────────────────────
  // LEITURA
  // ─────────────────────────────────────────────────────────

  getNotifications(userId) {
    if (!userId) return [];
    const storageKey = `notifications_${userId}`;
    return JSON.parse(localStorage.getItem(storageKey) || '[]');
  },

  getUnreadCount(userId) {
    return this.getNotifications(userId).filter(n => !n.read).length;
  },

  // ─────────────────────────────────────────────────────────
  // MARCAR COMO LIDA
  // ─────────────────────────────────────────────────────────

  markAsRead(userId, notificationId) {
    if (!userId) return;
    const storageKey = `notifications_${userId}`;
    const notifications = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const updated = notifications.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    );
    localStorage.setItem(storageKey, JSON.stringify(updated));
  },

  markAllAsRead(userId) {
    if (!userId) return;
    const storageKey = `notifications_${userId}`;
    const notifications = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const updated = notifications.map(n => ({ ...n, read: true }));
    localStorage.setItem(storageKey, JSON.stringify(updated));
  },

  // ─────────────────────────────────────────────────────────
  // LIMPAR
  // ─────────────────────────────────────────────────────────

  clearAll(userId) {
    if (!userId) return;
    localStorage.removeItem(`notifications_${userId}`);
  },

  // ─────────────────────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────────────────────

  getTypeInfo(type) {
    return NOTIFICATION_TYPES[type] || NOTIFICATION_TYPES.system;
  },
};