import confetti from 'canvas-confetti';

// ─────────────────────────────────────────────────────────────
// Confetti "primeira vez" — dispara só na primeira vez que o
// usuário favorita algo. Depois, fica salvo no localStorage.
// ─────────────────────────────────────────────────────────────

const CONFETTI_FLAG_KEY = (userId) => `confetti_shown_${userId}`;

export const shouldShowConfetti = (userId) => {
  if (!userId) return false;
  return localStorage.getItem(CONFETTI_FLAG_KEY(userId)) !== 'true';
};

export const markConfettiShown = (userId) => {
  if (!userId) return;
  localStorage.setItem(CONFETTI_FLAG_KEY(userId), 'true');
};

/**
 * Dispara o confetti "wow" — uma explosão em 2 lados
 * + um "estouro" central. Paleta rosa/roxo/azul (combina com o app).
 */
export const fireFavoriteConfetti = () => {
  const colors = ['#ec4899', '#a855f7', '#4f7cff', '#fb7185', '#c084fc'];

  const duration = 1500;
  const end = Date.now() + duration;

  // Explosão central (estouro no início)
  confetti({
    particleCount: 80,
    spread: 90,
    origin: { y: 0.5 },
    colors,
    startVelocity: 45,
    gravity: 0.9,
    scalar: 1.1,
    disableForReducedMotion: true,
    zIndex: 9999,
  });

  // Explosões laterais contínuas
  const sideBurst = () => {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors,
      disableForReducedMotion: true,
      zIndex: 9999,
    });

    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors,
      disableForReducedMotion: true,
      zIndex: 9999,
    });

    if (Date.now() < end) {
      requestAnimationFrame(sideBurst);
    }
  };

  sideBurst();
};