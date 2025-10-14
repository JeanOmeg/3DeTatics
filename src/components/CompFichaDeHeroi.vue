<template>
  <div
    class="row col-3"
    style="min-width: 320px; max-width: 320px; margin: 0px; padding: 0px"
  >
    <q-card
      flat
      bordered
      class="ficha-de-heroi print-hide"
    >
      <q-card-section>
        <div class="row justify-center text-subtitle1 text-weight-bold">
          Seletor de Vantagens
        </div>

        <div class="q-gutter-y-sm">
          <q-select
            v-model="usar_seletor"
            outlined
            use-chips
            stack-label
            label="Usar seletor de vantagens"
            :options="lista_combo_seletor"
            @update:model-value="atualizarComboSeletor"
          />
          <q-select
            v-if="usar_seletor.value == 1"
            v-model="seletor_raca"
            outlined
            use-chips
            stack-label
            label="Raça"
            :options="lista_raca"
            @update:model-value="atualizarComboRaca"
          />
          <q-select
            v-if="usar_seletor.value == 1"
            v-model="seletor_kit"
            outlined
            multiple
            use-chips
            stack-label
            label="Kits"
            :options="lista_kit"
            @update:model-value="atualizarComboKit"
          />
          <q-select
            v-if="usar_seletor.value == 1"
            v-model="seletor_vantagem"
            outlined
            multiple
            use-chips
            stack-label
            label="Vantagens"
            :options="lista_vantagem"
            @update:model-value="atualizarComboVantagem"
          />
          <q-select
            v-if="usar_seletor.value == 1"
            v-model="seletor_desvantagem"
            outlined
            multiple
            use-chips
            stack-label
            label="Desvantagens"
            :options="lista_desvantagem"
            @update:model-value="atualizarComboDesvantagem"
          />
        </div>
      </q-card-section>
    </q-card>

    <q-card
      flat
      bordered
      class="ficha-de-heroi q-pa-none q-ma-none"
    >
      <q-card-section class="q-pt-none q-mt-none q-pb-xs q-mb-xs q-px-sm">
        <div class="row items-center q-pa-none q-ma-none">
          <div class="row col justify-center text-subtitle1 text-weight-bold">
            3D&Tatics
          </div>

          <q-btn
            flat
            round
            icon="close"
            color="negative"
            size="sm"
            class="row justify-end no-print"
            @click="emit('remove')"
          />
        </div>

        <div class="row q-x-gutter-sm q-pb-none q-mb-none">
          <q-input
            v-model="heroi.name"
            dense
            outlined
            label="Nome"
            class="col-12 q-mb-xs"
          />
          <q-input
            v-model="heroi.kit"
            dense
            outlined
            label="Kit"
            class="col-12 q-mb-xs"
            :readonly="usar_seletor.value == 1"
          />
          <q-input
            v-model="heroi.raca"
            dense
            outlined
            label="Raça"
            class="col q-mr-xs"
            :readonly="usar_seletor.value == 1"
          />
          <q-input
            v-model="heroi.ponto"
            dense
            outlined
            label="Pontos"
            style="max-width: 80px"
          />
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none q-mt-none q-pb-xs q-mb-xs q-px-sm">
        <div class="row text-center text-weight-bold q-mb-xs q-gutter-x-xs">
          <div
            v-for="stat in caracteristicas"
            :key="stat.key"
            class="row col justify-center"
          >
            {{ stat.label }}
          </div>
        </div>
        <div class="row text-center q-gutter-x-xs">
          <div
            v-for="stat in caracteristicas"
            :key="stat.key"
            class="row col q-pa-none"
          >
            <q-input
              v-model="heroi.caracteristicas[stat.key]"
              dense
              outlined
              input-class="text-center"
            />
          </div>
        </div>
      </q-card-section>

      <q-card-section class="q-py-none q-my-none q-px-sm">
        <div class="row text-center text-weight-bold q-mb-xs q-gutter-x-xs">
          <div
            v-for="stat in caracteristicas_status"
            :key="stat.key"
            class="row col justify-center"
          >
            {{ stat.label }}
          </div>
        </div>
        <div class="row text-center q-gutter-x-xs">
          <div
            v-for="stat in caracteristicas_status"
            :key="stat.key"
            class="row col"
          >
            <q-input
              v-model="heroi.caracteristicas[stat.key]"
              dense
              outlined
              input-class="text-center"
            />
          </div>
        </div>
      </q-card-section>

      <q-card-section class="q-pa-sm">
        <div class="q-gutter-y-sm">
          <q-input
            v-model="heroi.vantagem"
            outlined
            type="textarea"
            rows="2"
            input-class="text-primary"
            :readonly="usar_seletor.value == 1"
          />
          <q-input
            v-model="heroi.desvantagem"
            outlined
            rows="2"
            input-class="text-negative"
            type="textarea"
            :readonly="usar_seletor.value == 1"
          />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import type { IHeroi } from 'src/interfaces/heroi-interface'
import type { ICaracteristicaItem } from 'src/interfaces/caracteristica-item-interface'
import { ref } from 'vue'

const emit = defineEmits(['remove'])

const props = defineProps<{
  heroi_inicial: IHeroi
}>()

const heroi = ref(props.heroi_inicial)

const usar_seletor = ref({ label: 'Não', value: 2 })

const seletor_raca = ref()
const seletor_kit = ref()
const seletor_vantagem = ref()
const seletor_desvantagem = ref()

const lista_combo_seletor = ref([
  { label: 'Sim', value: 1 },
  { label: 'Não', value: 2 }
])

const lista_raca = ref(['Humano', 'Elfo', 'Anão', 'Halfling'])
const lista_kit = ref(['Guerreiro', 'Mago', 'Clérigo', 'Paladino', 'Arqueiro', 'Ladino'])
const lista_vantagem = ref(['Vantagem 1', 'Vantagem 2', 'Vantagem 3', 'Vantagem 4', 'Vantagem 5'])
const lista_desvantagem = ref(['Desvantagem 1', 'Desvantagem 2', 'Desvantagem 3', 'Desvantagem 4', 'Desvantagem 5', 'Desvantagem 6', 'Desvantagem 7'])

const caracteristicas: ICaracteristicaItem[] = [
  { label: 'F', key: 'F' },
  { label: 'H', key: 'H' },
  { label: 'A', key: 'A' },
  { label: 'R', key: 'R' },
  { label: 'PdF', key: 'PdF' }
]

const caracteristicas_status: ICaracteristicaItem[] = [
  { label: 'FA', key: 'FA' },
  { label: 'FaD', key: 'FaD' },
  { label: 'FD', key: 'FD' },
  { label: 'PV', key: 'PV' },
  { label: 'PM', key: 'PM' }
]

function atualizarComboSeletor (combo: { label: string; value: number }) {
  usar_seletor.value = combo

  seletor_raca.value = null as unknown as string
  seletor_kit.value = null as unknown as string
  seletor_vantagem.value = null as unknown as string
  seletor_desvantagem.value = null as unknown as string

  heroi.value.name = ''
  heroi.value.ponto = 0
  heroi.value.raca = ''
  heroi.value.kit = ''
  heroi.value.vantagem = ''
  heroi.value.desvantagem = ''
  heroi.value.caracteristicas = {
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
  }
}

function atualizarComboRaca (combo: string) {
  heroi.value.raca = combo
}

function atualizarComboKit (combo: string[]) {
  heroi.value.kit = combo.join(', ')
}

function atualizarComboVantagem (combo: string[]) {
  heroi.value.vantagem = combo.join(', ')
}

function atualizarComboDesvantagem (combo: string[]) {
  heroi.value.desvantagem = combo.join(', ')
}
</script>

<style scoped>
.ficha-de-heroi {
  width: 300px;
  max-width: 100%;
  margin: 5px;
  border-radius: 10px;
  border-color: black !important;
  border-width: 2px;
  background-color: #fff;
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
