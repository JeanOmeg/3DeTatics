<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="cabecalho">
      <q-toolbar class="cabecalho__barra">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Abrir menu"
          @click="toggleLeftDrawer"
        />

        <router-link
          to="/"
          class="marca"
          aria-label="3DeTatics, página inicial"
        >
          <span class="marca__nome">3DeTatics</span>
        </router-link>

        <q-space />

        <q-btn
          flat
          dense
          round
          :icon="iconeTema"
          :aria-label="rotuloTema"
          @click="alternarTema"
        >
          <q-tooltip>{{ rotuloTema }}</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="menu-lateral"
      :width="290"
    >
      <q-scroll-area class="fit">
        <div class="menu-lateral__topo">
          <div class="menu-lateral__marca">
            3DeTatics
          </div>
          <div class="texto-legenda">
            Wargame skirmish baseado no 3D&T
          </div>
        </div>

        <q-list
          v-for="grupo in gruposMenu"
          :key="grupo.titulo"
          class="q-mb-sm"
        >
          <q-item-label
            header
            class="menu-lateral__grupo"
          >
            {{ grupo.titulo }}
          </q-item-label>
          <EssentialLink
            v-for="link in grupo.links"
            :key="link.title"
            v-bind="link"
          />
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container class="conteudo">
      <router-view />

      <footer class="rodape print-hide">
        <div class="rodape__conteudo">
          <p class="q-mb-xs">
            <b>3DeTatics</b> · versão {{ versao }}
          </p>
          <p class="q-mb-none">
            Projeto de fã, gratuito e sem fins lucrativos, baseado no sistema 3D&T (Manual 3D&T Revisado, Ampliado e Turbinado). 3D&T é marca de seus respectivos detentores; este projeto não tem vínculo oficial com eles.
          </p>
        </div>
      </footer>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import EssentialLink, { type EssentialLinkProps } from 'components/EssentialLink.vue'
import { obterConfiguracoes, salvarConfiguracoes, type TTema } from 'src/services/configuracoes-service'

interface IGrupoMenu {
  titulo: string
  links: EssentialLinkProps[]
}

const $q = useQuasar()

const versao = process.env.APP_VERSION

const gruposMenu: IGrupoMenu[] = [
  {
    titulo: 'Regras',
    links: [
      { title: 'Regras do jogo', caption: 'Configuração, turnos e combate', icon: 'menu_book', link: '/regras' },
      { title: 'Vantagens', caption: 'Vantagens, raças e kits', icon: 'add_circle', link: '/vantagens' },
      { title: 'Desvantagens', caption: 'Desvantagens normais', icon: 'remove_circle', link: '/desvantagens' },
      { title: 'Magias', caption: 'Caminhos, Focus e magias', icon: 'auto_fix_high', link: '/magias' }
    ]
  },
  {
    titulo: 'Heróis e grupos',
    links: [
      { title: 'Criador de Grupo', caption: 'Monte e imprima seu grupo', icon: 'military_tech', link: '/grupo' },
      { title: 'Lista de Grupos', caption: 'Grupos salvos neste navegador', icon: 'groups', link: '/grupos' },
      { title: 'Meus Heróis', caption: 'Heróis salvos para reaproveitar', icon: 'bookmarks', link: '/herois' }
    ]
  },
  {
    titulo: 'Projeto',
    links: [
      { title: 'GitHub', caption: 'Código-fonte do projeto', icon: 'code', link: 'https://github.com/JeanOmeg/3DeTatIcs' }
    ]
  }
]

const leftDrawerOpen = ref(false)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

// Tema: 'auto' segue o sistema; o jogador pode fixar claro ou escuro.
const tema = ref<TTema>('auto')

const iconeTema = computed(() => $q.dark.isActive ? 'light_mode' : 'dark_mode')
const rotuloTema = computed(() => $q.dark.isActive ? 'Usar tema claro' : 'Usar tema escuro')

function aplicarTema (valor: TTema) {
  tema.value = valor
  $q.dark.set(valor === 'auto' ? 'auto' : valor === 'escuro')
}

function alternarTema () {
  const novo: TTema = $q.dark.isActive ? 'claro' : 'escuro'
  aplicarTema(novo)
  void salvarConfiguracoes({ tema: novo })
}

onMounted(async () => {
  const configuracoes = await obterConfiguracoes()
  aplicarTema(configuracoes.tema)
})
</script>

<style scoped lang="scss">
.cabecalho {
  background: var(--cor-cabecalho);
  color: var(--cor-cabecalho-texto);
  border-bottom: 3px solid var(--cor-ouro);
}

.cabecalho__barra {
  min-height: 60px;
  gap: var(--esp-2);
}

.marca {
  text-decoration: none;
  margin-left: var(--esp-2);
}

.marca__nome {
  font-family: var(--fonte-titulo);
  font-weight: 700;
  font-size: 1.5rem;
  letter-spacing: 0.04em;
  color: #e9603f;
  text-shadow: 0 2px 0 #3a1408, 0 0 1px #f1c45a;
}

.menu-lateral__topo {
  padding: var(--esp-5) var(--esp-5) var(--esp-3);
  border-bottom: 1px solid var(--cor-borda);
  margin-bottom: var(--esp-2);
}

.menu-lateral__marca {
  font-family: var(--fonte-titulo);
  font-weight: 700;
  font-size: 1.35rem;
  color: var(--cor-titulo);
}

.menu-lateral__grupo {
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--cor-texto-suave);
  padding-bottom: var(--esp-1);
}

.conteudo {
  background: var(--cor-fundo);
}

.rodape {
  border-top: 1px solid var(--cor-borda);
  background: var(--cor-superficie-2);
}

.rodape__conteudo {
  max-width: var(--largura-texto);
  margin: 0 auto;
  padding: var(--esp-5) var(--esp-4);
  font-size: 0.85rem;
  color: var(--cor-texto-suave);
}
</style>

<style lang="scss">
// O Quasar aplica uma borda clara ao cabeçalho no tema escuro; mantemos o dourado
body .q-header.cabecalho {
  border-bottom: 3px solid var(--cor-ouro);
}

// Fundo do menu lateral segue o tema
body .q-drawer {
  background: var(--cor-superficie);
}
</style>
