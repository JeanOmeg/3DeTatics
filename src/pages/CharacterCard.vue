<template>
  <q-card class="character-card q-ma-lg" flat bordered>
    <q-card-section class="q-pa-sm">
      <div class="row items-center q-pb-xs">
        <div class="row col justify-center text-subtitle1 text-weight-bold">3D&Tatics</div>

        <q-btn
          flat
          round
          icon="close"
          color="negative"
          size="sm"
          @click="emit('remove')"
          class="row justify-end no-print"
        />
      </div>

      <div class="row q-gutter-x-sm q-mb-sm">
        <q-input dense outlined v-model="character.name" label="Nome" class="col-grow" />
        <q-input dense outlined v-model="character.pontos" label="Pontos" style="max-width: 80px" />
      </div>

      <div class="row q-gutter-x-sm">
        <q-input dense outlined v-model="character.raca" label="Raça" class="col" />
        <q-input dense outlined v-model="character.kit" label="Kit" class="col" />
      </div>
    </q-card-section>

    <q-separator />

    <q-card-section class="q-pa-sm">
      <div class="row text-center text-weight-bold q-mb-xs q-gutter-x-xs">
        <div v-for="stat in stats1" :key="stat.key" class="row col justify-center">
          {{ stat.label }}
        </div>
      </div>
      <div class="row text-center q-gutter-x-xs">
        <div v-for="stat in stats1" :key="stat.key" class="row col">
          <q-input dense outlined v-model="character.stats[stat.key]" input-class="text-center" />
        </div>
      </div>
    </q-card-section>

    <q-separator />

    <q-card-section class="q-pa-sm">
      <div class="row text-center text-weight-bold q-mb-xs q-gutter-x-xs">
        <div v-for="stat in stats2" :key="stat.key" class="row col justify-center">
          {{ stat.label }}
        </div>
      </div>
      <div class="row text-center q-gutter-x-xs">
        <div v-for="stat in stats2" :key="stat.key" class="row col">
          <q-input dense outlined v-model="character.stats[stat.key]" input-class="text-center" />
        </div>
      </div>
    </q-card-section>

    <q-separator />

    <q-card-section class="q-pa-sm">
      <div class="text-subtitle1 text-weight-bold text-center q-pb-xs">
        Vantagens & Desvantagens
      </div>
      <div class="q-pb-sm">
        <q-input v-model="character.vantagens" outlined type="textarea" :rows="7" />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const emit = defineEmits(['remove'])

interface Character {
  name: string
  pontos: number | null
  raca: string
  kit: string
  stats: { [key: string]: number | null }
  vantagens: string
}

const props = defineProps<{
  initialCharacter?: Character
}>()

const character: Character = reactive(
  props.initialCharacter || {
    name: '',
    pontos: null,
    raca: '',
    kit: '',
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
    vantagens: '',
  },
)

const stats1 = [
  { label: 'F', key: 'F' },
  { label: 'H', key: 'H' },
  { label: 'A', key: 'A' },
  { label: 'R', key: 'R' },
  { label: 'PdF', key: 'PdF' },
]

const stats2 = [
  { label: 'FA', key: 'FA' },
  { label: 'FaD', key: 'FaD' },
  { label: 'FD', key: 'FD' },
  { label: 'PV', key: 'PV' },
  { label: 'PM', key: 'PM' },
]
</script>

<style scoped>
.character-card {
  width: 320px;
  max-width: 100%;
  margin: 5px;
  border-radius: 10px;
  border-color: black !important;
  border-width: 2px;
  background-color: #f7f7f7;
}

.q-input:deep(.q-field__native) {
  text-align: center;
}

.q-textarea :deep(.q-field__native) {
  resize: none !important;
  padding-top: 10px;
  min-height: 100px !important;
}
</style>
