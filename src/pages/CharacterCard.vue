<template>
  <q-card class="character-card q-ma-lg" flat bordered>
    <q-card-section class="row col-12 print-hide" style="max-width: 320px">
      <div class="row col-12 justify-center text-subtitle1 text-weight-bold">
        Seletor de Vantagens
      </div>

      <div class="row col-12 q-gutter-y-sm">
        <q-select
          class="row col-12"
          outlined
          v-model="heroi.raca"
          :options="lista_raca"
          use-chips
          stack-label
          label="Raça"
        />
        <q-select
          class="row col-12"
          outlined
          v-model="heroi.kit"
          multiple
          :options="lista_kit"
          use-chips
          stack-label
          label="Kits"
        />
        <q-select
          class="row col-12"
          outlined
          v-model="heroi.vantagem"
          multiple
          :options="lista_vantagem"
          use-chips
          stack-label
          label="Vantagens"
        />
        <q-select
          class="row col-12"
          outlined
          v-model="heroi.desvantagem"
          multiple
          :options="lista_desvantagem"
          use-chips
          stack-label
          label="Desvantagens"
        />
      </div>
    </q-card-section>

    <q-separator class="print-hide" />

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

      <div class="row q-x-gutter-sm">
        <q-input dense outlined v-model="heroi.name" label="Nome" class="col-12 q-mb-xs" />
        <q-input
          dense
          outlined
          v-model="heroi_construtor.kit"
          readonly
          label="Kit"
          class="col-12 q-mb-xs"
        />
        <q-input
          dense
          outlined
          v-model="heroi_construtor.raca"
          label="Raça"
          readonly
          class="col-grow q-mr-xs"
        />
        <q-input dense outlined v-model="heroi.ponto" label="Pontos" style="max-width: 80px" />
      </div>
    </q-card-section>

    <q-separator />

    <q-card-section class="q-pa-sm">
      <div class="row text-center text-weight-bold q-mb-xs q-gutter-x-xs">
        <div v-for="stat in caracteristicas" :key="stat.key" class="row col justify-center">
          {{ stat.label }}
        </div>
      </div>
      <div class="row text-center q-gutter-x-xs">
        <div v-for="stat in caracteristicas" :key="stat.key" class="row col">
          <q-input dense outlined v-model="heroi.stats[stat.key]" input-class="text-center" />
        </div>
      </div>
    </q-card-section>

    <q-separator />

    <q-card-section class="q-pa-sm">
      <div class="row text-center text-weight-bold q-mb-xs q-gutter-x-xs">
        <div v-for="stat in status" :key="stat.key" class="row col justify-center">
          {{ stat.label }}
        </div>
      </div>
      <div class="row text-center q-gutter-x-xs">
        <div v-for="stat in status" :key="stat.key" class="row col">
          <q-input dense outlined v-model="heroi.stats[stat.key]" input-class="text-center" />
        </div>
      </div>
    </q-card-section>

    <q-separator />

    <q-card-section class="q-pa-sm">
      <div class="q-gutter-y-sm">
        <q-input
          v-model="heroi_construtor.vantagem"
          outlined
          type="textarea"
          rows="2"
          input-class="text-primary"
        />
        <q-input
          v-model="heroi_construtor.desvantagem"
          outlined
          type="textarea"
          rows="2"
          input-class="text-negative"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const emit = defineEmits(['remove'])

const props = defineProps<{
  heroi_inicial?: IHeroi
}>()

export interface IHeroi {
  name: string
  ponto: number | null
  raca: string | null
  kit: []
  stats: { [key: string]: number | null }
  vantagem: []
  desvantagem: []
}

type StatKey = 'F' | 'H' | 'A' | 'R' | 'PdF' | 'FA' | 'FaD' | 'FD' | 'PV' | 'PM'

interface StatItem {
  label: string
  key: StatKey
}

const lista_raca = ref(['Humano', 'Elfo', 'Anão', 'Halfling'])
const lista_kit = ref(['Guerreiro', 'Mago', 'Clérigo', 'Paladino', 'Arqueiro', 'Ladino'])
const lista_vantagem = ref(['Vantagem 1', 'Vantagem 2', 'Vantagem 3', 'Vantagem 4', 'Vantagem 5'])
const lista_desvantagem = ref([
  'Desvantagem 1',
  'Desvantagem 2',
  'Desvantagem 3',
  'Desvantagem 4',
  'Desvantagem 5',
  'Desvantagem 6',
  'Desvantagem 7',
])

const heroi = ref(
  props.heroi_inicial || {
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
  },
)

const heroi_construtor = computed(() => {
  const hero = {
    raca: heroi.value.raca,
    kit: heroi.value.kit.join(', '),
    vantagem: heroi.value.vantagem.join(', '),
    desvantagem: heroi.value.desvantagem.join(', '),
  }
  return hero
})

const caracteristicas: StatItem[] = [
  { label: 'F', key: 'F' },
  { label: 'H', key: 'H' },
  { label: 'A', key: 'A' },
  { label: 'R', key: 'R' },
  { label: 'PdF', key: 'PdF' },
]

const status: StatItem[] = [
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
  min-height: 50px !important;
}
</style>
