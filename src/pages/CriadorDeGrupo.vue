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
        @click="salvarLista"
      />
    </div>

    <div class="row col-12 items-start q-gutter-md justify-center">
      <CompFichaDeHeroi
        v-for="(char, index) in lista_grupo"
        :key="index"
        :heroi_inicial="char"
        @remove="removerHeroi(index)"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CompFichaDeHeroi from '../components/CompFichaDeHeroi.vue'
import { LocalStorage } from 'quasar'
import type { IHeroi } from 'src/interfaces/heroi-interface'

const lista_grupo = ref([novoHeroi()])

function novoHeroi () {
  const heroi: IHeroi = {
    name: '',
    ponto: 0,
    raca: '',
    kit: '',
    caracteristicas: {
      F: 0,
      H: 0,
      A: 0,
      R: 0,
      PdF: 0,
      FA: 0,
      FaD: 0,
      FD: 0,
      PV: 0,
      PM: 0
    },
    vantagem: '',
    desvantagem: ''
  }

  return heroi
}

function adicionarHeroi () {
  lista_grupo.value.push(novoHeroi())
}

function removerHeroi (index: number) {
  lista_grupo.value.splice(index, 1)
}

function salvarLista () {
  LocalStorage.set('lista', lista_grupo.value)
}

function imprimirGrupo () {
  window.print()
}
</script>

<style>
@media print {

  html,
  body {
    margin: 0 !important;
    padding: 0 !important;
    min-width: 100%;
    min-height: 100%;
  }

  .q-page-container {
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

  .row.q-gutter-md {
    display: flex !important;
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 0;
  }

  .ficha-de-heroi {
    margin: 10px !important;
  }
}
</style>
