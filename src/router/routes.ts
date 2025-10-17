import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/PaginaInicial.vue') },
      { path: '/regras', component: () => import('src/pages/RegrasDoJogo.vue') },
      { path: '/vantagens', component: () => import('src/pages/VantagensHerois.vue') },
      { path: '/desvantagens', component: () => import('src/pages/DesvantagensHeroi.vue') },
      { path: '/grupo', component: () => import('src/pages/CriadorDeGrupo.vue') },
      { path: '/:catchAll(.*)*', component: () => import('pages/ErrorNotFound.vue') }
    ]
  }
]

export default routes
