<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-toolbar-title @click="paginaInicial">3D&Tatics</q-toolbar-title>
        <div>v {{ '1.0.0' }}</div>
      </q-toolbar>
    </q-header>
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>
    <q-page-container> <router-view /> </q-page-container>
  </q-layout>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import EssentialLink, { type EssentialLinkProps } from 'components/EssentialLink.vue'
import { useRouter } from 'vue-router'

const $router = useRouter()

const linksList: EssentialLinkProps[] = [
  { title: 'Aprenda o Jogo', caption: 'Regras e exemplos', icon: 'school', link: '/regras' },
  {
    title: 'Vantagens & Desvantagens',
    caption: 'Características especiais dos Heróis',
    icon: 'bolt',
    link: '/vantagens',
  },
  {
    title: 'Criador de Grupo',
    caption: 'Monte seu Grupo de Heróis',
    icon: 'military_tech',
    link: '/grupo',
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

async function paginaInicial() {
  await $router.push('/')
}
</script>
