import js from '@eslint/js'
import globals from 'globals'
import pluginVue from 'eslint-plugin-vue'
import pluginQuasar from '@quasar/app-vite/eslint'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import prettierSkipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default defineConfigWithVueTs(
  {
    ignores: ['**/*.js', '!src/**/*.js'],
  },

  pluginQuasar.configs.recommended(),
  js.configs.recommended,
  pluginVue.configs['flat/essential'],

  {
    files: ['**/*.ts', '**/*.vue'],

    languageOptions: {
      parserOptions: {
        project: 'tsconfig.json',
        parser: '@typescript-eslint/parser',
        projectFolderIgnoreList: [
          '.github/**/*',
          '.scannerwork/**/*',
          '.sonar/**/*',
          '.vscode/**/*',
          '.yarn/**/*',
          '_tests_/**/*',
          '_utils_/**/*',
          'eslint.config.js',
          'dist/**/*',
          'coverage/**/*',
          'database/**/*',
          'src/enum/**/*',
          'library/**/*',
          'lib/**/*',
          'node_modules/**/*',
          'public/**/*',
          'utilitarios/**/*',
          '**/*.test.ts',
          '*.test.ts',
        ],
      },
    },

    rules: {
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
    },
  },

  vueTsConfigs.recommendedTypeChecked,

  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        process: 'readonly',
        ga: 'readonly',
        cordova: 'readonly',
        Capacitor: 'readonly',
        chrome: 'readonly',
        browser: 'readonly',
      },
    },

    // Regras globais
    rules: {
      'prefer-promise-reject-errors': 'off',
      'no-debugger': process.env.NODE_ENV === 'prod' ? 'error' : 'off',
      '@typescript-eslint/no-floating-promises': 'off',
    },
  },

  {
    files: ['src-pwa/custom-service-worker.ts'],
    languageOptions: {
      globals: {
        ...globals.serviceworker,
      },
    },
  },

  prettierSkipFormatting,
)
