<template>
  <div class="row col-3" style="min-width: 320px; max-width: 320px; margin: 0px; padding: 0px">
    <q-card class="character-card print-hide" flat bordered>
      <q-card-section>
        <div class="row justify-center text-subtitle1 text-weight-bold">Seletor de Vantagens</div>

        <div class="q-gutter-y-sm">
          <q-select v-model="heroi.raca" outlined use-chips stack-label label="Raça" :options="lista_raca" />
          <q-select v-model="heroi.kit" outlined multiple use-chips stack-label label="Kits" :options="lista_kit" />
          <q-select v-model="heroi.vantagem" outlined multiple use-chips stack-label label="Vantagens" :options="lista_vantagem" />
          <q-select v-model="heroi.desvantagem" outlined multiple use-chips stack-label label="Desvantagens" :options="lista_desvantagem" />
        </div>
      </q-card-section>
    </q-card>

    <q-card class="character-card q-pa-none q-ma-none" flat bordered>
      <q-card-section class="q-pt-none q-mt-none q-pb-xs q-mb-xs q-px-sm">
        <div class="row items-center q-pa-none q-ma-none">
          <div class="row col justify-center text-subtitle1 text-weight-bold">3D&Tatics</div>

          <q-btn flat round icon="close" color="negative" size="sm" class="row justify-end no-print" @click="emit('remove')" />
        </div>

        <div class="row q-x-gutter-sm q-pb-none q-mb-none">
          <q-input v-model="heroi.name" dense outlined label="Nome" class="col-12 q-mb-xs" />
          <q-input v-model="heroi_construtor.kit" dense outlined label="Kit" class="col-12 q-mb-xs" />
          <q-input v-model="heroi_construtor.raca" dense outlined label="Raça" class="col q-mr-xs" />
          <q-input dense outlined v-model="heroi.ponto" label="Pontos" style="max-width: 80px" />
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none q-mt-none q-pb-xs q-mb-xs q-px-sm">
        <div class="row text-center text-weight-bold q-mb-xs q-gutter-x-xs">
          <div v-for="stat in caracteristicas" :key="stat.key" class="row col justify-center">
            {{ stat.label }}
          </div>
        </div>
        <div class="row text-center q-gutter-x-xs">
          <div v-for="stat in caracteristicas" :key="stat.key" class="row col q-pa-none">
            <q-input dense outlined v-model="heroi.stats[stat.key]" input-class="text-center" />
          </div>
        </div>
      </q-card-section>

      <q-card-section class="q-py-none q-my-none q-px-sm">
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

      <q-card-section class="q-pa-sm">
        <div class="q-gutter-y-sm">
          <q-input v-model="heroi_construtor.vantagem" outlined readonly type="textarea" rows="2" input-class="text-primary" />
          <q-input v-model="heroi_construtor.desvantagem" outlined readonly type="textarea" rows="2" input-class="text-negative" />
        </div>
      </q-card-section>
    </q-card>
  </div>
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
const lista_desvantagem = ref(['Desvantagem 1', 'Desvantagem 2', 'Desvantagem 3', 'Desvantagem 4', 'Desvantagem 5', 'Desvantagem 6', 'Desvantagem 7'])

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
  width: 300px;
  max-width: 100%;
  margin: 5px;
  border-radius: 10px;
  border-color: black !important;
  border-width: 2px;
  background-color: #f7f7f7;
  padding: 0px !important;
}

.q-input:deep(.q-field__native) {
  text-align: center;
}

.q-textarea :deep(.q-field__native) {
  resize: none !important;
  padding: 2px 0px 2px 0px;
  min-height: 76px !important;
}
</style>
