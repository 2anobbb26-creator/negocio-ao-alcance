// 🔔 SERVIÇO DE NOTIFICAÇÕES
// Detecta quando novos negócios são adicionados

import { businessData } from '../data/businessData';

const BUSINESS_VERSION_KEY = 'businessDataVersion';

export const notificationService = {
  // 🆕 Verificar se há novos negócios
  checkForNewBusinesses(userId) {
    if (!userId) return [];

    const currentVersion = businessData.length;
    const lastVersion = parseInt(localStorage.getItem(`${BUSINESS_VERSION_KEY}_${userId}`) || '0');

    // Se for a primeira vez, salva a versão atual e não notifica
    if (lastVersion === 0) {
      localStorage.setItem(`${BUSINESS_VERSION_KEY}_${userId}`, currentVersion);
      return [];
    }

    // Detecta novos negócios
    if (currentVersion > lastVersion) {
      const newBusinesses = businessData.slice(lastVersion);
      const notifications = newBusinesses.map(business => ({
        id: `notif_${business.id}_${Date.now()}`,
        businessId: business.id,
        icon: business.image,
        title: `🆕 Novo negócio: ${business.name}`,
        message: `${business.category} • Investimento: R$ ${business.minInvestment.toLocaleString('pt-BR')} - R$ ${business.maxInvestment.toLocaleString('pt-BR')}`,
        createdAt: Date.now(),
        read: false
      }));

      // Salvar no localStorage
      const storageKey = `notifications_${userId}`;
      const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const updated = [...notifications, ...existing].slice(0, 50); // Máx 50
      localStorage.setItem(storageKey, JSON.stringify(updated));

      // Atualizar versão
      localStorage.setItem(`${BUSINESS_VERSION_KEY}_${userId}`, currentVersion);

      return notifications;
    }

    return [];
  },

  // 📥 Pegar todas as notificações
  getNotifications(userId) {
    if (!userId) return [];
    const storageKey = `notifications_${userId}`;
    return JSON.parse(localStorage.getItem(storageKey) || '[]');
  },

  // ✅ Marcar como lida
  markAsRead(userId, notificationId) {
    if (!userId) return;
    const storageKey = `notifications_${userId}`;
    const notifications = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const updated = notifications.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    );
    localStorage.setItem(storageKey, JSON.stringify(updated));
  },

  // 🧹 Limpar notificações
  clearAll(userId) {
    if (!userId) return;
    localStorage.removeItem(`notifications_${userId}`);
  }
};