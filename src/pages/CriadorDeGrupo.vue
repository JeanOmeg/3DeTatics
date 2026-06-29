<template>
  <q-page class="row col-12 q-pa-md">
    <div class="text-h4 text-white q-mb-md print-hide row col-12 justify-center">
      <b>Criador de grupo</b>
    </div>
    <q-separator class="q-mb-md print-hide" />

    <div class="row col-12 q-gutter-md q-mb-lg justify-center print-hide">
      <q-btn
        color="primary"
        icon="add"
        label="Adicionar Herói"
        style="max-height: 36px"
        :class="$q.platform.is.mobile ? 'col-12 print-hide' : 'col-3 print-hide'"
        @click="adicionarHeroi"
      />
      <q-btn
        color="secondary"
        icon="print"
        label="Imprimir Grupo"
        style="max-height: 36px"
        :class="$q.platform.is.mobile ? 'col-12 print-hide' : 'col-3 print-hide'"
        @click="imprimirGrupo"
      />
      <q-btn
        color="accent"
        icon="save"
        label="Salvar Grupo"
        style="max-height: 36px"
        :class="$q.platform.is.mobile ? 'col-12 print-hide' : 'col-3 print-hide'"
        @click="salvarGrupo"
      />
    </div>

    <div class="lista-fichas row col-12 items-start q-gutter-md justify-center">
      <CompFichaDeHeroi
        v-for="(char, index) in lista_grupo"
        :key="char.id"
        :heroi_inicial="char"
        @remove="removerHeroi(index)"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { LocalStorage, useQuasar } from 'quasar'
import CompFichaDeHeroi from '../components/CompFichaDeHeroi.vue'
import type { IHeroi } from 'src/interfaces/heroi-interface'
import type { IGrupo } from 'src/interfaces/grupo-interface'
import { obterGrupo, salvarGrupo as persistirGrupo } from 'src/services/grupos-service'

const $q = useQuasar()
const $route = useRoute()

const CHAVE_RASCUNHO = 'rascunho'

const rascunho = LocalStorage.getItem<IHeroi[]>(CHAVE_RASCUNHO)
const lista_grupo = ref<IHeroi[]>(rascunho?.length ? rascunho : [novoHeroi()])

const grupoAtualId = ref<string | null>(null)
const grupoAtualNome = ref('')

function novoHeroi () {
  const heroi: IHeroi = {
    id: globalThis.crypto.randomUUID(),
    name: '',
    pv: 0,
    pm: 0,
    ph: 0,
    raca: '',
    kit: '',
    caracteristicas: {
      F: 0,
      PdF: 0,
      A: 0,
      H: 0,
      R: 0
    },
    vantagem: '',
    desvantagem: '',
    tipo_de_dano_f: '',
    tipo_de_dano_pdf: ''
  }

  return heroi
}

function adicionarHeroi () {
  lista_grupo.value.push(novoHeroi())
}

function removerHeroi (index: number) {
  lista_grupo.value.splice(index, 1)
}

// Mantém um rascunho do trabalho em andamento entre recarregamentos da página
watch(lista_grupo, (valor) => {
  LocalStorage.set(CHAVE_RASCUNHO, valor)
}, { deep: true })

function salvarGrupo () {
  $q.dialog({
    title: 'Salvar grupo',
    message: 'Dê um nome para o grupo:',
    prompt: {
      model: grupoAtualNome.value,
      type: 'text',
      isValid: (valor: string) => valor.trim().length > 0
    },
    cancel: true,
    persistent: true
  }).onOk((nome: string) => {
    const grupo: IGrupo = {
      id: grupoAtualId.value ?? globalThis.crypto.randomUUID(),
      nome: nome.trim(),
      herois: lista_grupo.value,
      criadoEm: new Date().toISOString()
    }

    void persistirGrupo(grupo)
      .then(() => {
        grupoAtualId.value = grupo.id
        grupoAtualNome.value = grupo.nome
        $q.notify({ type: 'positive', message: 'Grupo salvo com sucesso!' })
      })
      .catch(() => {
        $q.notify({ type: 'negative', message: 'Não foi possível salvar o grupo.' })
      })
  })
}

function imprimirGrupo () {
  window.print()
}

onMounted(async () => {
  const id = $route.query.id

  if (typeof id === 'string') {
    const grupo = await obterGrupo(id)

    if (grupo) {
      lista_grupo.value = grupo.herois
      grupoAtualId.value = grupo.id
      grupoAtualNome.value = grupo.nome
    }
  }
})
</script>

<style>
@media print {
  /* A4 com margens mínimas: cabem 3 x 3 = 9 cartas de 63mm x 88mm por página */
  @page {
    size: A4 portrait;
    margin: 6mm;
  }

  html,
  body {
    margin: 0 !important;
    padding: 0 !important;
    min-width: 100%;
    min-height: 100%;
  }

  .q-page-container,
  .q-page {
    padding: 0 !important;
    margin: 0 !important;
  }

  .q-header,
  .q-footer,
  .q-drawer,
  .print-hide,
  .no-print {
    display: none !important;
  }

  .lista-fichas {
    display: flex !important;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-content: flex-start;
    gap: 0 !important;
    margin: 0 !important;
  }

  /* Cada container de ficha ocupa exatamente a largura de uma carta */
  .lista-fichas > * {
    width: 63mm !important;
    margin: 0 !important;
    break-inside: avoid;
    page-break-inside: avoid;
  }
}
</style>
