/* eslint-disable no-restricted-globals */

const CACHE_VERSION = 'v2';
const CACHE_NAME = `negocio-alcance-${CACHE_VERSION}`;

// Arquivos essenciais que sempre devem estar em cache
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png',
  '/maskable-icon-192.png',
  '/maskable-icon-512.png',
  '/apple-touch-icon.png'
];

// 🔧 INSTALL: faz o pré-cache dos arquivos essenciais
self.addEventListener('install', (event) => {
  console.log('📦 Service Worker: instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS).catch((err) => {
        console.warn('⚠️ Erro ao pré-cachear alguns arquivos:', err);
      });
    })
  );
  self.skipWaiting();
});

// 🔄 ACTIVATE: limpa caches antigos
self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker: ativando...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('negocio-alcance-') && name !== CACHE_NAME)
          .map((name) => {
            console.log('🗑️ Removendo cache antigo:', name);
            return caches.delete(name);
          })
      );
    })
  );
  self.clients.claim();
});

// 🌐 FETCH: estratégias inteligentes
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignora requisições não-GET
  if (request.method !== 'GET') return;

  // Ignora requisições para Firebase e APIs externas
  if (
    url.hostname.includes('firestore.googleapis.com') ||
    url.hostname.includes('identitytoolkit.googleapis.com') ||
    url.hostname.includes('firebase') ||
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('gstatic.com') ||
    url.hostname.includes('google-analytics.com')
  ) {
    return;
  }

  // Ignora requisições de dev (hot reload)
  if (url.pathname.includes('sockjs-node') || url.pathname.includes('/ws')) {
    return;
  }

  // 📄 Para navegação (HTML): network first, cache fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          return caches.match(request).then((cachedResponse) => {
            return cachedResponse || caches.match('/index.html');
          });
        })
    );
    return;
  }

  // 🖼️ Para imagens e assets estáticos: cache first, network fallback
  if (
    request.destination === 'image' ||
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'font'
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          // Atualiza em background
          fetch(request)
            .then((response) => {
              const responseClone = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseClone);
              });
            })
            .catch(() => {});
          return cachedResponse;
        }

        return fetch(request).then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        });
      })
    );
    return;
  }

  // 🎯 Para o resto: network first, cache fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseClone);
        });
        return response;
      })
      .catch(() => caches.match(request))
  );
});

// 💬 Mensagens do cliente (para forçar atualização)
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});