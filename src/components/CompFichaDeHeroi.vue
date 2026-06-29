<template>
  <div class="ficha-container">
    <q-card
      flat
      bordered
      class="seletor-card print-hide"
    >
      <q-card-section>
        <div class="row col-12 text-subtitle1 text-weight-bold">
          <div class="row col-grow justify-center">
            Seletor de Vantagens
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
      class="carta-heroi"
    >
      <q-input
        v-model="heroi.name"
        dense
        outlined
        label="Nome"
      />
      <q-input
        v-model="heroi.kit"
        dense
        outlined
        label="Kit"
        :readonly="usar_seletor.value == 1"
      />

      <div class="carta-linha">
        <q-input
          v-model="heroi.raca"
          dense
          outlined
          label="Raça"
          class="carta-raca"
          :readonly="usar_seletor.value == 1"
        />
        <q-input
          v-model.number="heroi.ponto"
          dense
          outlined
          type="number"
          label="Pontos"
          class="carta-pontos"
        />
      </div>

      <div class="carta-caracteristicas">
        <div
          v-for="stat in caracteristicas"
          :key="stat.key"
          class="carta-stat"
        >
          <div class="carta-stat-label">
            {{ stat.label }}
          </div>
          <q-input
            v-model.number="heroi.caracteristicas[stat.key]"
            dense
            outlined
            type="number"
            input-class="text-center"
          />
        </div>
      </div>

      <q-input
        v-model="heroi.vantagem"
        outlined
        stack-label
        type="textarea"
        label="Vantagens"
        class="carta-texto"
        input-class="text-primary"
        :readonly="usar_seletor.value == 1"
      />
      <q-input
        v-model="heroi.desvantagem"
        outlined
        stack-label
        type="textarea"
        label="Desvantagens"
        class="carta-texto"
        input-class="text-negative"
        :readonly="usar_seletor.value == 1"
      />

      <div class="carta-linha">
        <q-input
          v-model="heroi.tipo_de_dano_f"
          dense
          outlined
          label="Força"
          class="col tipo-de-dano"
        />
        <q-input
          v-model="heroi.tipo_de_dano_pdf"
          dense
          outlined
          label="Poder de Fogo"
          class="col tipo-de-dano"
        />
      </div>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import type { IHeroi } from 'src/interfaces/heroi-interface'
import type { ICaracteristicaItem } from 'src/interfaces/caracteristica-item-interface'
import { ref } from 'vue'
import { RacasLib } from 'src/libs/racas-lib'
import { IComboBox } from 'src/interfaces/combobox-interface'
import { VantagensEDesvantagensLib } from 'src/libs/vantagens-lib'
import { TipoVantagemEnum } from 'src/enums/tipo-vantagem-enum'

const emit = defineEmits(['remove'])

const props = defineProps<{
  heroi_inicial: IHeroi
}>()

const heroi = ref(props.heroi_inicial)

const usar_seletor = ref<IComboBox>({ label: 'Não', value: 2 })

const seletor_raca = ref<IComboBox | null>(null)
const seletor_kit = ref<IComboBox[] | null>(null)
const seletor_vantagem = ref<IComboBox[] | null>(null)
const seletor_desvantagem = ref<IComboBox[] | null>(null)

const lista_combo_seletor = ref<IComboBox[]>([
  { label: 'Sim', value: 1 },
  { label: 'Não', value: 2 }
])

const lista_raca = ref(RacasLib.listarRacasCombo())
const lista_kit = ref([{ label: 'Guerreiro', value: 'guerreiro' }, { label: 'Mago', value: 'mago' }])
const lista_vantagem = ref(VantagensEDesvantagensLib.listarVantagensEDesvantagensCombo(TipoVantagemEnum.vantagem))
const lista_desvantagem = ref(VantagensEDesvantagensLib.listarVantagensEDesvantagensCombo(TipoVantagemEnum.desvantagem))

const caracteristicas: ICaracteristicaItem[] = [
  { label: 'F', key: 'F' },
  { label: 'H', key: 'H' },
  { label: 'A', key: 'A' },
  { label: 'R', key: 'R' },
  { label: 'PdF', key: 'PdF' }
]

function atualizarComboSeletor (combo: IComboBox) {
  usar_seletor.value = combo

  seletor_raca.value = null
  seletor_kit.value = null
  seletor_vantagem.value = null
  seletor_desvantagem.value = null

  heroi.value.name = ''
  heroi.value.ponto = 0
  heroi.value.raca = ''
  heroi.value.kit = ''
  heroi.value.vantagem = ''
  heroi.value.desvantagem = ''
  heroi.value.tipo_de_dano_f = ''
  heroi.value.tipo_de_dano_pdf = ''
  heroi.value.caracteristicas = {
    F: 0,
    H: 0,
    A: 0,
    R: 0,
    PdF: 0
  }
}

function atualizarComboRaca (combo: IComboBox) {
  heroi.value.raca = combo.label
}

function atualizarComboKit (combo: IComboBox[]) {
  heroi.value.kit = combo.map(item => item.label).join(', ')
}

function atualizarComboVantagem (combo: IComboBox[]) {
  heroi.value.vantagem = combo.map(item => item.label).join(', ')
}

function atualizarComboDesvantagem (combo: IComboBox[]) {
  heroi.value.desvantagem = combo.map(item => item.label).join(', ')
}
</script>

<style scoped>
/* Tamanho padrão de carta: Magic: The Gathering = 63mm x 88mm */
.ficha-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 5px;
}

.seletor-card {
  width: 63mm;
  max-width: 100%;
  margin-bottom: 8px;
  border-radius: 10px;
  border-color: black !important;
  border-width: 2px;
  background-color: #fff;
}

/* Carta do herói: dimensões exatas de carta MTG (63mm x 88mm) */
.carta-heroi {
  width: 63mm;
  height: 88mm;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 6px;
  border-radius: 10px;
  border-color: black !important;
  border-width: 2px;
  background-color: #fff;
}

/* Linha com dois campos lado a lado */
.carta-linha {
  display: flex;
  gap: 4px;
}

.carta-raca {
  flex: 1 1 auto;
}

.carta-pontos {
  flex: 0 0 58px;
}

/* Grade de características (F H A R PdF) */
.carta-caracteristicas {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 3px;
  text-align: center;
}

.carta-stat-label {
  font-weight: bold;
  font-size: 10px;
  line-height: 1.4;
}

/* Áreas de texto crescem igualmente para preencher a carta */
.carta-texto {
  flex: 1 1 0;
  min-height: 0;
}

/* Centraliza valores numéricos */
.carta-heroi :deep(.q-field__native) {
  text-align: center;
}

/* Remove as setinhas (spinners) dos inputs do tipo number */
.carta-heroi :deep(input[type='number']) {
  -moz-appearance: textfield;
  appearance: textfield;
}

.carta-heroi :deep(input[type='number']::-webkit-outer-spin-button),
.carta-heroi :deep(input[type='number']::-webkit-inner-spin-button) {
  -webkit-appearance: none;
  margin: 0;
}

/* Compacta os campos densos para caber em 88mm */
.carta-heroi :deep(.q-field--dense .q-field__control) {
  height: 26px;
  min-height: 26px;
}

.carta-heroi :deep(.q-field--dense .q-field__native),
.carta-heroi :deep(.q-field--dense .q-field__input) {
  font-size: 10px;
  min-height: 24px;
}

.carta-heroi :deep(.q-field__label) {
  font-size: 9px;
}

/* Textareas preenchem o espaço restante da carta */
.carta-texto :deep(.q-field__control),
.carta-texto :deep(.q-field__control-container) {
  height: 100%;
  min-height: 0;
}

.carta-texto :deep(textarea.q-field__native) {
  height: 100% !important;
  min-height: 0 !important;
  resize: none !important;
  padding: 0;
  font-size: 9px !important;
  line-height: 1.15 !important;
}

.tipo-de-dano :deep(.q-field__native) {
  font-size: 10px;
}

/* Impressão: garante o tamanho exato da carta */
@media print {
  .ficha-container {
    margin: 0;
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .carta-heroi {
    width: 63mm !important;
    height: 88mm !important;
  }
}
</style>
