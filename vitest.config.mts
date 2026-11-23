import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

// Testes unitários das regras do jogo (calculadora, validações, dados) e dos
// serviços do Localbase. Rodar com `npm test` (ou `npm run test:watch`).
export default defineConfig({
  resolve: {
    alias: {
      src: fileURLToPath(new URL('./src', import.meta.url)),
      components: fileURLToPath(new URL('./src/components', import.meta.url))
    }
  },
  test: {
    include: ['test/**/*.test.ts'],
    environment: 'node',
    // IndexedDB simulado para os serviços do Localbase
    setupFiles: ['fake-indexeddb/auto']
  }
})
