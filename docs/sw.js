// Kill-switch service worker.
//
// Este projeto NÃO é mais um PWA. Porém, dispositivos que visitaram o site
// quando ele ainda era PWA ficaram com um service worker antigo registrado,
// servindo uma versão em cache e ignorando atualizações da rede.
//
// Este arquivo é publicado no mesmo caminho do service worker antigo
// (/3DeTatics/sw.js). Quando o navegador desses dispositivos faz a verificação
// de atualização do service worker, ele baixa este script, que limpa todos os
// caches, se desregistra e recarrega as abas abertas. Depois disso o site volta
// a ser um SPA normal, sem service worker.
//
// Mantenha este arquivo por um bom tempo (meses) até ter certeza de que todos
// os dispositivos afetados já se atualizaram. Ele é inofensivo para quem nunca
// teve o PWA instalado.

self.addEventListener('install', () => {
  // Não esperar: assume o controle imediatamente.
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Apaga todos os caches criados pelo Workbox/PWA antigo.
      const keys = await caches.keys()
      await Promise.all(keys.map((key) => caches.delete(key)))

      // Remove este service worker do dispositivo.
      await self.registration.unregister()

      // Recarrega as abas abertas para buscar o conteúdo fresco da rede.
      const clients = await self.clients.matchAll({ type: 'window' })
      clients.forEach((client) => client.navigate(client.url))
    })(),
  )
})
