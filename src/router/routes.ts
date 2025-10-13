import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/PaginaInicial.vue') },
      { path: '/regras', component: () => import('src/pages/RegrasDoJogo.vue') },
      { path: '/grupo', component: () => import('src/pages/CriadorDeGrupo.vue') },
      { path: '/:catchAll(.*)*', component: () => import('pages/ErrorNotFound.vue') },
    ],
  },
]

export default routes
