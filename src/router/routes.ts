import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/', component: () => import('src/pages/PaginaInicial.vue') },
      { path: '/regras', component: () => import('src/pages/RegrasDoJogo.vue') },
      { path: '/vantagens', component: () => import('src/pages/VantagensHerois.vue') },
      { path: '/desvantagens', component: () => import('src/pages/DesvantagensHeroi.vue') },
      { path: '/magias', component: () => import('src/pages/MagiasHeroi.vue') },
      { path: '/grupo', component: () => import('src/pages/CriadorDeGrupo.vue') },
      { path: '/herois', component: () => import('src/pages/MeusHerois.vue') },
      { path: '/heroi', component: () => import('src/pages/EditorHeroi.vue') },
      { path: '/grupos', component: () => import('src/pages/ListaDeGrupos.vue') },
      { path: '/:catchAll(.*)*', component: () => import('pages/ErrorNotFound.vue') }
    ]
  }
]

export default routes
