const eslint_plugin_typescript = require('@typescript-eslint/eslint-plugin')
const vue_plugin = require('eslint-plugin-vue')
const vue_parser = require('vue-eslint-parser')
const parser = require('@typescript-eslint/parser')
const import_plugin = require('eslint-plugin-import')
const n_plugin = require('eslint-plugin-n')
const pluginQuasar = require('@quasar/app-vite/eslint')
const { defineConfigWithVueTs } = require('@vue/eslint-config-typescript')
const promise_plugin = require('eslint-plugin-promise')
const standard = require('eslint-config-standard').rules
const vue_essential = require('eslint-plugin-vue/lib/configs/vue3-essential').rules
const ts_recommended = require('@typescript-eslint/eslint-plugin').configs.recommended.rules
const ts_recommended_type_checking = require('@typescript-eslint/eslint-plugin').configs['recommended-requiring-type-checking'].rules

module.exports = defineConfigWithVueTs(
  ...vue_plugin.configs['flat/recommended'],
  {
    files: ['src/**/*.{ts,vue}'],
    languageOptions: {
      parser: vue_parser,
      parserOptions: {
        parser: require.resolve('@typescript-eslint/parser'),
        ecmaVersion: 2020,
        sourceType: 'module',
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
        extraFileExtensions: ['.vue'],
      },
      globals: {
        ga: 'readonly',
        cordova: 'readonly',
        __statics: 'readonly',
        __QUASAR_SSR__: 'readonly',
        __QUASAR_SSR_SERVER__: 'readonly',
        __QUASAR_SSR_CLIENT__: 'readonly',
        __QUASAR_SSR_PWA__: 'readonly',
        process: 'readonly',
        Capacitor: 'readonly',
        chrome: 'readonly',
        window: 'readonly',
        document: 'readonly',
        caches: 'readonly',
        setTimeout: 'readonly',
        FormData: 'readonly',
        FileReader: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': eslint_plugin_typescript,
      'import': import_plugin,
      'n': n_plugin,
      'vue': vue_plugin,
      'promise': promise_plugin
    },
    ignores: [
      '.quasar/**/*',
      '.vscode/**/*',
      'node_modules/**/*',
      'public/**/*',
      'docs/**/*',
      'eslint.config.js'
    ],
    rules: {
      ...ts_recommended,
      ...ts_recommended_type_checking,
      ...standard,
      ...vue_essential,
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/prefer-namespace-keyword': 'off',
      '@typescript-eslint/no-namespace': 'off',
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
      'vue/attribute-hyphenation': 'off',
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
      }]
    }
  }
)
