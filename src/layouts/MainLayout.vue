<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Cabeçalho -->
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>3D&Tatics Codex</q-toolbar-title>

        <div>v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <!-- Menu lateral -->
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Menu Principal </q-item-label>

        <!-- Mantém o mesmo componente EssentialLink -->
        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <!-- Área de conteúdo -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import EssentialLink, { type EssentialLinkProps } from 'components/EssentialLink.vue'

/**
 * Mantém o mesmo padrão do projeto base do Quasar,
 * mas com os links internos do jogo.
 */
const linksList: EssentialLinkProps[] = [
  {
    title: 'Aprenda o Jogo',
    caption: 'Regras e exemplos',
    icon: 'school',
    link: '/aprender',
  },
  {
    title: 'Vantagens & Desvantagens',
    caption: 'Características dos personagens',
    icon: 'bolt',
    link: '/vantagens',
  },
  {
    title: 'Codex',
    caption: 'Monte seu exército',
    icon: 'military_tech',
    link: '/codex',
  },
  {
    title: 'Github',
    caption: 'Projeto no GitHub',
    icon: 'code',
    link: 'https://github.com/JeanOmeg/3DeTatIcs',
  },
]

const leftDrawerOpen = ref(false)
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
