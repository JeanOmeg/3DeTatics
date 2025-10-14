import js from '@eslint/js'
import globals from 'globals'
import pluginVue from 'eslint-plugin-vue'
import pluginQuasar from '@quasar/app-vite/eslint'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import prettierSkipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import standardPkg from 'eslint-config-standard'
import vueEssentialPkg from 'eslint-plugin-vue/lib/configs/vue3-essential.js'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import pluginImport from 'eslint-plugin-import'

// Cada pacote exporta de forma diferente, então a gente acessa as regras
const standard = standardPkg.rules
const vue_essential = vueEssentialPkg.rules
const ts_recommended = tsPlugin.configs.recommended.rules
const ts_recommended_type_checking = tsPlugin.configs['recommended-requiring-type-checking'].rules
import pluginN from 'eslint-plugin-n'
import pluginPromise from 'eslint-plugin-promise'

export default defineConfigWithVueTs(
  {
    ignores: ['**/*.js', 'quasar.config.ts', '!src/**/*.js'],
  },

  pluginQuasar.configs.recommended(),
  js.configs.recommended,
  pluginVue.configs['flat/essential'],

  {
    files: ['**/*.ts', '**/*.vue'],
    plugins: {
      import: pluginImport,
      n: pluginN,
      promise: pluginPromise,
    },

    languageOptions: {
      parserOptions: {
        project: 'tsconfig.json',
        parser: '@typescript-eslint/parser',
        projectFolderIgnoreList: ['.vscode/**/*', 'eslint.config.js', 'docs/**/*', 'node_modules/**/*', 'public/**/*', '*.config.ts'],
      },
    },

    rules: {
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      // Regras do vue/quasar
      ...ts_recommended,
      ...ts_recommended_type_checking,
      ...standard,
      ...vue_essential,
      // Regras recomendadas do typescript
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/prefer-namespace-keyword': 'off',
      '@typescript-eslint/no-namespace': 'off',
      // Regras do eslint
      indent: ['error', 2],
      quotes: ['warn', 'single', { avoidEscape: true }],
      semi: ['error', 'never'],
      'no-mixed-spaces-and-tabs': 'off',
      'no-unused-vars': 'error',
      'no-console': 'warn',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'padded-blocks': ['error', 'never'],
      'generator-star-spacing': 'off',
      'arrow-parens': 'off',
      'one-var': 'off',
      'no-void': 'off',
      'multiline-ternary': 'off',
      'import/first': 'off',
      'import/named': 'error',
      'import/namespace': 'error',
      'import/default': 'error',
      'import/export': 'error',
      'import/extensions': 'off',
      'import/no-unresolved': 'off',
      'import/no-extraneous-dependencies': 'off',
      'prefer-promise-reject-errors': 'off',
      'camelcase': 'off',
      'eqeqeq': 'off',
      // Vue
      'vue/component-definition-name-casing': ['error', 'kebab-case'],
      'vue/prop-name-casing': ['error', 'snake_case'],
      'vue/script-setup-uses-vars': 'off',
      'vue/require-explicit-emits': 'off',
      'vue/order-in-components': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/no-lone-template': 'off',
      'vue/no-template-shadow': 'off',
      'vue/no-useless-template-attributes': 'off',
      'vue/v-slot-style': 'off',
      'vue/attribute-hyphenation': 'off', // Desativa erro de innerHTML
      'vue/attributes-order': ['error', {
        'order': [
          'DEFINITION',
          'LIST_RENDERING',
          'CONDITIONALS',
          'RENDER_MODIFIERS',
          'GLOBAL',
          ['UNIQUE', 'SLOT'],
          'TWO_WAY_BINDING',
          'OTHER_DIRECTIVES',
          'ATTR_SHORTHAND_BOOL',
          'ATTR_STATIC',
          'ATTR_DYNAMIC',
          'EVENTS',
          'CONTENT'
        ],
        'alphabetical': false
      }],
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
