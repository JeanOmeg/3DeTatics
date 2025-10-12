<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>3D&Tatics Codex</q-toolbar-title>
        <div>v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Menu Principal </q-item-label>
        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>
    <q-page-container> <router-view /> </q-page-container>
  </q-layout>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import EssentialLink, { type EssentialLinkProps } from 'components/EssentialLink.vue'

const linksList: EssentialLinkProps[] = [
  { title: 'Aprenda o Jogo', caption: 'Regras e exemplos', icon: 'school', link: '/aprender' },
  {
    title: 'Vantagens & Desvantagens',
    caption: 'Características dos personagens',
    icon: 'bolt',
    link: '/vantagens',
  },
  { title: 'Codex', caption: 'Monte seu exército', icon: 'military_tech', link: '/codex' },
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
