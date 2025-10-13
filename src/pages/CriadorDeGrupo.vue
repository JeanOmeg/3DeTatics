<template>
  <q-page class="row col-12 q-pa-md">
    <div class="text-h4 q-mb-md print-hide">Criador de grupo</div>
    <q-separator class="q-mb-md print-hide" />

    <div class="row col-12 q-gutter-md q-mb-lg justify-center print-hide">
      <q-btn color="primary" icon="add" label="Adicionar Herói" @click="addCharacter" :class="$q.platform.is.mobile ? 'col-12 print-hide' : 'col-3 print-hide'" />
      <q-btn color="secondary" icon="print" label="Imprimir Grupo" @click="printArmy" :class="$q.platform.is.mobile ? 'col-12 print-hide' : 'col-3 print-hide'" />
      <q-btn color="accent" icon="save" label="Salvar Grupo" @click="salvarLista" :class="$q.platform.is.mobile ? 'col-12 print-hide' : 'col-3 print-hide'" />
    </div>

    <div class="row col-12 items-start q-gutter-md justify-center">
      <CharacterCard v-for="(char, index) in armyList" :key="index" :heroi_inicial="char" @remove="removeCharacter(index)" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { IHeroi } from './CharacterCard.vue'
import CharacterCard from './CharacterCard.vue'
import { LocalStorage } from 'quasar'

const newCharacterTemplate = (): IHeroi => ({
  name: '',
  ponto: null,
  raca: null,
  kit: [],
  stats: {
    F: null,
    H: null,
    A: null,
    R: null,
    PdF: null,
    FA: null,
    FaD: null,
    FD: null,
    PV: null,
    PM: null,
  },
  vantagem: [],
  desvantagem: [],
})

const armyList = ref([newCharacterTemplate()])

const addCharacter = () => {
  armyList.value.push(newCharacterTemplate())
}

const removeCharacter = (index: number) => {
  armyList.value.splice(index, 1)
}

function salvarLista() {
  LocalStorage.set('lista', armyList.value)
}

const printArmy = () => {
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

  .character-card {
    margin: 10px !important;
    min-height: 10% !important;
    max-height: 10% !important;
  }
}
</style>
