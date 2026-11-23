// Configuração do Quasar (SPA)
// https://v2.quasar.dev/quasar-cli-vite/quasar-config-file

import { readFileSync } from 'node:fs'
import { defineConfig } from '#q-app/wrappers'

const isProd = process.env.NODE_ENV === 'prod'
const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf-8')) as { version: string }

export default defineConfig(() => {
  return {
    // Arquivos de boot (src/boot)
    boot: ['fontes'],

    // CSS global (src/css)
    css: ['app.scss'],

    // Ícones do Quasar
    extras: ['material-icons'],

    build: {
      target: {
        browser: ['es2022', 'firefox115', 'chrome115', 'safari14'],
        node: 'node20'
      },

      typescript: {
        strict: true,
        vueShim: true
      },

      vueRouterMode: 'hash',
      publicPath: isProd ? '/3DeTatics/' : '/',
      distDir: 'docs',

      env: {
        APP_VERSION: pkg.version
      },

      vitePlugins: [
        [
          'vite-plugin-checker',
          {
            vueTsc: true,
            eslint: {
              lintCommand: 'eslint -c ./eslint.config.js "./src*/**/*.{ts,js,mjs,cjs,vue}"',
              useFlatConfig: true
            }
          },
          { server: false }
        ]
      ]
    },

    devServer: {
      open: false
    },

    framework: {
      lang: 'pt-BR',
      config: {
        // Segue o tema do sistema até o jogador escolher um no app
        dark: 'auto'
      },
      plugins: ['Dialog', 'Notify']
    },

    animations: []

    // PWA removido: este projeto é SPA puro (build com `-m spa`).
    // Um kill-switch service worker vive em `public/sw.js` para desregistrar
    // service workers antigos que ainda existam em dispositivos de visitantes.
  }
})
