<template>
  <div
    ref="raiz"
    class="ficha-container"
  >
    <div class="seletor print-hide">
      <div class="seletor__cabecalho">
        <q-toggle
          v-model="seletor_ativo"
          dense
          size="sm"
          color="primary"
          label="Assistente"
          class="seletor__toggle"
          @update:model-value="alternarSeletor"
        >
          <q-tooltip>Monta a ficha pelas listas do jogo e calcula pontos, PV e PM</q-tooltip>
        </q-toggle>
        <q-space />
        <q-btn
          v-if="salvavel"
          flat
          round
          dense
          icon="bookmark_add"
          size="sm"
          class="seletor__salvar"
          aria-label="Salvar em Meus Heróis"
          @click="emit('salvar', heroi)"
        >
          <q-tooltip>Salvar em Meus Heróis</q-tooltip>
        </q-btn>
        <q-btn
          v-if="removivel"
          flat
          round
          dense
          icon="delete_outline"
          size="sm"
          class="seletor__remover"
          aria-label="Remover herói do grupo"
          @click="emit('remove')"
        >
          <q-tooltip>Remover herói</q-tooltip>
        </q-btn>
      </div>

      <!-- Resumo de pontos e problemas -->
      <button
        type="button"
        class="resumo-pontos"
        :class="`resumo-pontos--${estadoPontos}`"
        :aria-expanded="mostrarDetalhes"
        @click="mostrarDetalhes = !mostrarDetalhes"
      >
        <span class="resumo-pontos__valor">{{ calculo.pontos }}<span v-if="heroi.ph !== null"> / {{ heroi.ph }}</span> pts</span>
        <span
          v-if="totalErros"
          class="resumo-pontos__contador resumo-pontos__contador--erro"
        >{{ totalErros }} {{ totalErros === 1 ? 'erro' : 'erros' }}</span>
        <span
          v-if="totalAvisos"
          class="resumo-pontos__contador"
        >{{ totalAvisos }} {{ totalAvisos === 1 ? 'aviso' : 'avisos' }}</span>
        <q-space />
        <q-icon
          size="18px"
          :name="mostrarDetalhes ? 'expand_less' : 'expand_more'"
        />
      </button>

      <q-slide-transition>
        <div
          v-show="mostrarDetalhes"
          class="seletor__detalhes"
        >
          <ul
            v-if="problemas.length"
            class="problemas"
          >
            <li
              v-for="(problema, indice) in problemas"
              :key="indice"
              :class="`problemas__item--${problema.nivel}`"
            >
              <q-icon
                size="14px"
                :name="problema.nivel === 'erro' ? 'error' : 'warning'"
              />
              {{ problema.mensagem }}
            </li>
          </ul>
          <div
            v-else
            class="problemas__ok"
          >
            <q-icon
              name="check_circle"
              size="14px"
            />
            Ficha sem problemas.
          </div>

          <div class="seletor__secao-titulo">
            Detalhamento
          </div>
          <dl class="detalhamento">
            <div
              v-for="item in calculo.itens"
              :key="item.rotulo"
            >
              <dt>{{ item.rotulo }}</dt>
              <dd>{{ item.pontos }}</dd>
            </div>
          </dl>
        </div>
      </q-slide-transition>

      <!-- Assistente -->
      <q-slide-transition>
        <div
          v-show="seletor_ativo"
          class="seletor__campos"
        >
          <q-select
            v-model="seletor_raca"
            dense
            clearable
            outlined
            options-dense
            label="Raça"
            :options="lista_raca"
            @update:model-value="atualizarComboRaca"
          />
          <q-select
            v-model="seletor_kit"
            dense
            clearable
            outlined
            options-dense
            label="Kit"
            :options="lista_kit"
            @update:model-value="atualizarComboKit"
          />

          <q-select
            v-model="seletor_vantagem"
            dense
            outlined
            multiple
            options-dense
            use-chips
            label="Vantagens"
            :options="lista_vantagem"
            @update:model-value="atualizarComboVantagem"
          />
          <div
            v-for="item in ajustesVantagens"
            :key="item.value"
            class="ajuste"
          >
            <span class="ajuste__nome">{{ item.nome }}</span>
            <q-btn-toggle
              v-if="item.opcoes"
              dense
              unelevated
              no-caps
              size="sm"
              toggle-color="primary"
              :model-value="heroi.ajustes[item.value]"
              :options="item.opcoes.map(opcao => ({ label: `${opcao} pt`, value: opcao }))"
              @update:model-value="definirAjuste(item.value, $event)"
            />
            <q-input
              v-else
              dense
              outlined
              type="number"
              min="1"
              prefix="x"
              class="ajuste__quantidade"
              :model-value="heroi.ajustes[item.value] ?? 1"
              @update:model-value="definirAjuste(item.value, Math.max(1, Number($event) || 1))"
            />
          </div>

          <q-select
            v-model="seletor_desvantagem"
            dense
            outlined
            multiple
            options-dense
            use-chips
            label="Desvantagens"
            :options="lista_desvantagem"
            @update:model-value="atualizarComboDesvantagem"
          />
          <div
            v-for="item in ajustesDesvantagens"
            :key="item.value"
            class="ajuste"
          >
            <span class="ajuste__nome">{{ item.nome }}</span>
            <q-btn-toggle
              v-if="item.opcoes"
              dense
              unelevated
              no-caps
              size="sm"
              toggle-color="primary"
              :model-value="heroi.ajustes[item.value]"
              :options="item.opcoes.map(opcao => ({ label: `${opcao}`, value: opcao }))"
              @update:model-value="definirAjuste(item.value, $event)"
            />
            <q-input
              v-else
              dense
              outlined
              type="number"
              min="1"
              prefix="x"
              class="ajuste__quantidade"
              :model-value="heroi.ajustes[item.value] ?? 1"
              @update:model-value="definirAjuste(item.value, Math.max(1, Number($event) || 1))"
            />
          </div>

          <div
            v-if="calculo.focusTotal === 0"
            class="seletor__dica"
          >
            <q-icon
              name="auto_fix_high"
              size="16px"
            />
            Para escolher magias, preencha o Focus na linha "Focus" da carta.
          </div>

          <q-select
            v-if="calculo.focusTotal > 0"
            v-model="seletor_magias"
            dense
            outlined
            multiple
            options-dense
            use-chips
            label="Magias Avançadas"
            :hint="`Até ${calculo.focusTotal} (soma dos Focus). As Iniciais já são conhecidas.`"
            :options="lista_magias"
            :option-disable="opcaoMagiaDesabilitada"
            @update:model-value="atualizarComboMagias"
          />

          <q-toggle
            v-model="heroi.pv_pm_manual"
            dense
            size="sm"
            label="PV e PM manuais"
            class="seletor__toggle-secundario"
          >
            <q-tooltip>Desligado: PV e PM = R x multiplicador do kit (+10 por PV/PM Extras)</q-tooltip>
          </q-toggle>
        </div>
      </q-slide-transition>
    </div>

    <article class="carta">
      <!-- Nome e pontos do herói -->
      <header class="carta__topo">
        <q-input
          v-model="heroi.name"
          dense
          borderless
          placeholder="Nome do herói"
          aria-label="Nome do herói"
          class="carta__nome"
          :dark="false"
        />
        <div class="carta__ph">
          <span class="carta__ph-rotulo">PH</span>
          <q-input
            v-model.number="heroi.ph"
            dense
            borderless
            type="number"
            aria-label="Pontos de herói"
            class="carta__numero"
            :dark="false"
          />
        </div>
      </header>

      <!-- Raça e kit -->
      <div class="carta__linha">
        <label class="carta__campo">
          <span class="carta__rotulo">Raça</span>
          <q-input
            v-model="heroi.raca"
            dense
            borderless
            class="carta__texto-curto"
            :dark="false"
            :readonly="seletor_ativo"
          />
        </label>
        <label class="carta__campo">
          <span class="carta__rotulo">Kit</span>
          <q-input
            v-model="heroi.kit"
            dense
            borderless
            class="carta__texto-curto"
            :dark="false"
            :readonly="seletor_ativo"
          />
        </label>
      </div>

      <!-- Pontos de Vida e de Magia -->
      <div class="carta__vitais">
        <label class="carta__vital carta__vital--pv">
          <span class="carta__vital-rotulo">PV</span>
          <q-input
            v-model.number="heroi.pv"
            dense
            borderless
            type="number"
            class="carta__numero"
            :dark="false"
            :readonly="!heroi.pv_pm_manual"
          />
        </label>
        <label class="carta__vital carta__vital--pm">
          <span class="carta__vital-rotulo">PM</span>
          <q-input
            v-model.number="heroi.pm"
            dense
            borderless
            type="number"
            class="carta__numero"
            :dark="false"
            :readonly="!heroi.pv_pm_manual"
          />
        </label>
      </div>

      <!-- Características -->
      <div class="carta__caracteristicas">
        <label
          v-for="stat in caracteristicas"
          :key="stat.key"
          class="carta__stat"
        >
          <span class="carta__stat-rotulo">{{ stat.label }}</span>
          <q-input
            v-model.number="heroi.caracteristicas[stat.key]"
            dense
            borderless
            type="number"
            class="carta__numero"
            :dark="false"
          />
        </label>
      </div>

      <!-- Focus por Caminho -->
      <div class="carta__focus">
        <span class="carta__focus-titulo">Focus</span>
        <label
          v-for="caminho in CAMINHOS"
          :key="caminho.key"
          class="carta__focus-item"
          :title="`Focus em ${caminho.label}`"
        >
          <span class="carta__focus-rotulo">{{ caminho.sigla }}</span>
          <q-input
            v-model.number="heroi.focus[caminho.key]"
            dense
            borderless
            type="number"
            min="0"
            max="5"
            class="carta__numero carta__numero--focus"
            :aria-label="`Focus em ${caminho.label}`"
            :dark="false"
          />
        </label>
      </div>

      <!-- Vantagens, Desvantagens e Magias -->
      <label
        v-for="bloco in blocosDeTexto"
        :key="bloco.campo"
        class="carta__bloco-texto"
        :data-campo="bloco.campo"
      >
        <span
          class="carta__rotulo"
          :class="`carta__rotulo--${bloco.campo}`"
        >{{ bloco.rotulo }}</span>
        <q-input
          v-model="heroi[bloco.campo]"
          borderless
          type="textarea"
          class="carta__texto-longo print-hide"
          :dark="false"
          :readonly="seletor_ativo"
        />
        <!-- Na impressão o texto vira um bloco comum, que não tem barra de rolagem -->
        <span class="carta__texto-impresso">{{ heroi[bloco.campo] }}</span>
      </label>

      <!-- Tipos de dano -->
      <footer class="carta__linha carta__rodape">
        <label class="carta__campo">
          <span class="carta__rotulo">Dano F</span>
          <q-input
            v-model="heroi.tipo_de_dano_f"
            dense
            borderless
            class="carta__texto-curto"
            :dark="false"
          />
        </label>
        <label class="carta__campo">
          <span class="carta__rotulo">Dano PdF</span>
          <q-input
            v-model="heroi.tipo_de_dano_pdf"
            dense
            borderless
            class="carta__texto-curto"
            :dark="false"
          />
        </label>
      </footer>
    </article>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import type { IHeroi } from 'src/interfaces/heroi-interface'
import type { ICaracteristicaItem } from 'src/interfaces/caracteristica-item-interface'
import type { IVantagemDesvantagem } from 'src/interfaces/vantagem-desvantagem-interface'
import { IComboBox } from 'src/interfaces/combobox-interface'
import { RacasLib } from 'src/libs/racas-lib'
import { KitsLib } from 'src/libs/kits-lib'
import { MagiasLib } from 'src/libs/magias-lib'
import { VantagensEDesvantagensLib } from 'src/libs/vantagens-lib'
import { aplicarDiferencaDeBonus, bonusDaFicha, calcularHeroi, gerarTextos, magiaDisponivel, type IProblema } from 'src/libs/ficha-lib'
import { TipoVantagemEnum } from 'src/enums/tipo-vantagem-enum'
import { CAMINHOS } from 'src/types/caminho-type'

type TCampoTexto = 'vantagem' | 'desvantagem' | 'magia'

const emit = defineEmits<{
  remove: []
  salvar: [heroi: IHeroi]
}>()

const props = withDefaults(defineProps<{
  heroi_inicial: IHeroi
  removivel?: boolean
  salvavel?: boolean
}>(), {
  removivel: true,
  salvavel: true
})

const heroi = ref(props.heroi_inicial)
const raiz = ref<HTMLElement | null>(null)

const seletor_ativo = ref(false)
const mostrarDetalhes = ref(false)

const seletor_raca = ref<IComboBox | null>(null)
const seletor_kit = ref<IComboBox | null>(null)
const seletor_vantagem = ref<IComboBox[]>([])
const seletor_desvantagem = ref<IComboBox[]>([])
const seletor_magias = ref<IComboBox[]>([])

const lista_raca = RacasLib.listarRacasCombo()
const lista_kit = KitsLib.listarKitsCombo()
const lista_vantagem = VantagensEDesvantagensLib.listarVantagensEDesvantagensCombo(TipoVantagemEnum.vantagem)
const lista_desvantagem = VantagensEDesvantagensLib.listarVantagensEDesvantagensCombo(TipoVantagemEnum.desvantagem)
const lista_magias: IComboBox[] = MagiasLib.listarMagias().filter(magia => !magia.inicial).map(magia => ({ label: magia.nome, value: magia.value }))

const caracteristicas: ICaracteristicaItem[] = [
  { label: 'F', key: 'F' },
  { label: 'H', key: 'H' },
  { label: 'R', key: 'R' },
  { label: 'A', key: 'A' },
  { label: 'PdF', key: 'PdF' }
]

// ---------------------------------------------------------------------------
// Cálculo, validação e textos que não cabem na carta
// ---------------------------------------------------------------------------
const calculo = computed(() => calcularHeroi(heroi.value))
const textosCortados = ref<string[]>([])

const problemas = computed<IProblema[]>(() => [
  ...calculo.value.problemas,
  ...textosCortados.value.map(rotulo => ({ nivel: 'aviso' as const, mensagem: `O texto de ${rotulo} não cabe inteiro na carta.` }))
])
const totalErros = computed(() => problemas.value.filter(p => p.nivel === 'erro').length)
const totalAvisos = computed(() => problemas.value.filter(p => p.nivel === 'aviso').length)

const estadoPontos = computed(() => {
  if (totalErros.value) return 'erro'
  if (heroi.value.ph === null || calculo.value.pontos !== heroi.value.ph) return 'aviso'
  return 'ok'
})

const blocosDeTexto = computed(() => {
  const blocos: { campo: TCampoTexto, rotulo: string }[] = [
    { campo: 'vantagem', rotulo: 'Vantagens' },
    { campo: 'desvantagem', rotulo: 'Desvantagens' }
  ]
  if (heroi.value.magia || calculo.value.focusTotal > 0) {
    blocos.push({ campo: 'magia', rotulo: 'Magias' })
  }
  return blocos
})

function itensComAjuste (valores: string[]) {
  return valores
    .map(valor => VantagensEDesvantagensLib.obter(valor))
    .filter((item): item is IVantagemDesvantagem => Boolean(item && (item.repetivel || item.opcoes)))
}

const ajustesVantagens = computed(() => itensComAjuste(heroi.value.vantagens_valores))
const ajustesDesvantagens = computed(() => itensComAjuste(heroi.value.desvantagens_valores))

// Compara a altura do texto com a área visível de cada bloco da carta.
function verificarTextosCortados () {
  const blocos = raiz.value?.querySelectorAll<HTMLElement>('.carta__bloco-texto') ?? []
  const cortados: string[] = []
  blocos.forEach(bloco => {
    const area = bloco.querySelector('textarea')
    if (area && area.scrollHeight > area.clientHeight + 2) {
      cortados.push(bloco.querySelector('.carta__rotulo')?.textContent?.trim() ?? 'um campo')
    }
  })
  textosCortados.value = cortados
}

watch(() => [heroi.value.vantagem, heroi.value.desvantagem, heroi.value.magia, blocosDeTexto.value.length], async () => {
  await nextTick()
  verificarTextosCortados()
})

onMounted(verificarTextosCortados)

// ---------------------------------------------------------------------------
// Automação: PV/PM e texto da carta
// ---------------------------------------------------------------------------

// Bônus de raça, kit e Arcano entram (e saem) sozinhos dos valores da carta.
// Ex.: escolher Elfo soma H+1; trocar para Humano tira o H+1.
const bonusAtual = computed(() => bonusDaFicha(heroi.value))

watch(bonusAtual, (novo, antigo) => {
  if (JSON.stringify(novo) !== JSON.stringify(antigo)) {
    aplicarDiferencaDeBonus(heroi.value, antigo, novo)
  }
})

// PV e PM automáticos (a não ser que o jogador marque "PV e PM manuais").
watch(() => [calculo.value.pv, calculo.value.pm, heroi.value.pv_pm_manual] as const, ([pv, pm, manual]) => {
  if (manual) return
  if (heroi.value.pv !== pv) heroi.value.pv = pv
  if (heroi.value.pm !== pm) heroi.value.pm = pm
}, { immediate: true })

// Com o assistente ligado, o texto da carta acompanha as escolhas.
function aplicarTextos () {
  const textos = gerarTextos(heroi.value)
  heroi.value.vantagem = textos.vantagem
  heroi.value.desvantagem = textos.desvantagem
  heroi.value.magia = textos.magia
}

watch(() => [
  heroi.value.raca_valor,
  heroi.value.kit_valor,
  heroi.value.vantagens_valores,
  heroi.value.desvantagens_valores,
  heroi.value.ajustes,
  heroi.value.focus,
  heroi.value.magias_valores
], () => {
  if (seletor_ativo.value) aplicarTextos()
}, { deep: true })

// ---------------------------------------------------------------------------
// Assistente
// ---------------------------------------------------------------------------
function buscarOpcao (lista: IComboBox[], valor: string) {
  return lista.find(item => item.value === valor) ?? null
}

function buscarOpcoes (lista: IComboBox[], valores: string[]) {
  return valores
    .map(valor => buscarOpcao(lista, valor))
    .filter((item): item is IComboBox => item !== null)
}

// Ao ligar, o assistente reabre com as escolhas salvas no herói.
// Ligar ou desligar nunca apaga a ficha.
function alternarSeletor (ativo: boolean) {
  if (!ativo) return

  seletor_raca.value = buscarOpcao(lista_raca, heroi.value.raca_valor)
  seletor_kit.value = buscarOpcao(lista_kit, heroi.value.kit_valor)
  seletor_vantagem.value = buscarOpcoes(lista_vantagem, heroi.value.vantagens_valores)
  seletor_desvantagem.value = buscarOpcoes(lista_desvantagem, heroi.value.desvantagens_valores)
  seletor_magias.value = buscarOpcoes(lista_magias, heroi.value.magias_valores)
}

function opcaoMagiaDesabilitada (opcao: IComboBox) {
  const valor = String(opcao.value)
  return !heroi.value.magias_valores.includes(valor) && !magiaDisponivel(heroi.value, valor)
}

function definirAjuste (value: string, valor: number | null | undefined) {
  heroi.value.ajustes = { ...heroi.value.ajustes, [value]: Number(valor) }
}

// Remove ajustes de itens que deixaram de ser escolhidos.
function limparAjustes () {
  const escolhidos = new Set([...heroi.value.vantagens_valores, ...heroi.value.desvantagens_valores])
  heroi.value.ajustes = Object.fromEntries(Object.entries(heroi.value.ajustes).filter(([value]) => escolhidos.has(value)))
}

function atualizarComboRaca (combo: IComboBox | null) {
  heroi.value.raca = combo?.label ?? ''
  heroi.value.raca_valor = String(combo?.value ?? '')
}

function atualizarComboKit (combo: IComboBox | null) {
  heroi.value.kit = combo?.label ?? ''
  heroi.value.kit_valor = String(combo?.value ?? '')
}

function atualizarComboVantagem (combo: IComboBox[] | null) {
  heroi.value.vantagens_valores = (combo ?? []).map(item => String(item.value))
  limparAjustes()
}

function atualizarComboDesvantagem (combo: IComboBox[] | null) {
  heroi.value.desvantagens_valores = (combo ?? []).map(item => String(item.value))
  limparAjustes()
}

function atualizarComboMagias (combo: IComboBox[] | null) {
  heroi.value.magias_valores = (combo ?? []).map(item => String(item.value))
}
</script>

<style scoped lang="scss">
// A carta tem o tamanho padrão de carta de jogo (63mm x 88mm) e é sempre clara,
// mesmo no tema escuro, porque é feita para ser impressa (também em preto e branco).
$tinta: #1e2433;
$tinta-suave: #4a4f5c;
$papel: #fffdf8;
$papel-2: #f1eadb;
$linha: #2b2f3a;
$azul: #2b4c8c;
$vermelho: #9e3520;
$verde: #3f6a2e;

.ficha-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--esp-2);
  margin: var(--esp-1);
}

// ---------------------------------------------------------------------------
// Assistente (fica fora da impressão)
// ---------------------------------------------------------------------------
.seletor {
  width: 63mm;
  max-width: 100%;
  background: var(--cor-superficie);
  border: 1px solid var(--cor-borda);
  border-radius: var(--raio-2);
  box-shadow: var(--sombra-1);
  overflow: hidden;
}

.seletor__cabecalho {
  display: flex;
  align-items: center;
  padding: var(--esp-1) var(--esp-1) var(--esp-1) var(--esp-3);
}

.seletor__toggle {
  font-size: 0.8rem;
  font-weight: 800;
  color: var(--cor-texto);
}

.seletor__salvar {
  color: var(--cor-link);
}

.seletor__remover {
  color: var(--cor-destaque);
}

.seletor__campos {
  display: flex;
  flex-direction: column;
  gap: var(--esp-2);
  padding: 0 var(--esp-2) var(--esp-3);
}

// ---------------------------------------------------------------------------
// Carta
// ---------------------------------------------------------------------------
.carta {
  width: 63mm;
  height: 88mm;
  display: flex;
  flex-direction: column;
  gap: 1.2mm;
  padding: 2mm;
  overflow: hidden;
  background: $papel;
  color: $tinta;
  border: 0.6mm solid $linha;
  border-radius: 3mm;
  box-shadow: var(--sombra-2);
  font-family: var(--fonte-texto);
}

// Campos do Quasar dentro da carta: compactos e sem moldura própria
.carta :deep(.q-field__control),
.carta :deep(.q-field__marginal) {
  height: auto;
  min-height: 0;
}

.carta :deep(.q-field__native) {
  min-height: 0;
  padding: 0;
  color: $tinta;
  line-height: 1.2;
}

.carta :deep(input[type='number']) {
  -moz-appearance: textfield;
  appearance: textfield;
}

.carta :deep(input[type='number']::-webkit-outer-spin-button),
.carta :deep(input[type='number']::-webkit-inner-spin-button) {
  -webkit-appearance: none;
  margin: 0;
}

.carta__rotulo {
  display: block;
  font-size: 6.5px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: $tinta-suave;
  line-height: 1;
}

.carta__rotulo--vantagem {
  color: $azul;
}

.carta__rotulo--desvantagem {
  color: $vermelho;
}

// Topo: nome + PH
.carta__topo {
  display: flex;
  align-items: stretch;
  gap: 1.2mm;
  padding-bottom: 1mm;
  border-bottom: 0.4mm solid $linha;
}

.carta__nome {
  flex: 1 1 auto;

  :deep(.q-field__native) {
    font-family: var(--fonte-titulo);
    font-weight: 700;
    font-size: 12px;
  }
}

.carta__ph {
  flex: 0 0 11mm;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 0.4mm solid $linha;
  border-radius: 1.5mm;
  background: $papel-2;
}

.carta__ph-rotulo {
  font-size: 6px;
  font-weight: 800;
  line-height: 1;
}

.carta__numero :deep(.q-field__native) {
  text-align: center;
  font-weight: 800;
  font-size: 11px;
  min-height: 4.5mm;
}

// Linhas de dois campos (raça/kit e tipos de dano)
.carta__linha {
  display: flex;
  gap: 1.2mm;
}

.carta__campo {
  flex: 1 1 0;
  min-width: 0;
  padding: 0.6mm 1mm;
  border-bottom: 0.3mm solid $tinta-suave;
}

.carta__texto-curto :deep(.q-field__native) {
  font-size: 9px;
  font-weight: 700;
}

// PV e PM
.carta__vitais {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.2mm;
}

.carta__vital {
  display: flex;
  align-items: center;
  gap: 1mm;
  padding: 0.6mm 1.2mm;
  border: 0.4mm solid $linha;
  border-radius: 1.5mm;
}

.carta__vital-rotulo {
  font-size: 8px;
  font-weight: 800;
  color: #fff;
  border-radius: 1mm;
  padding: 0.4mm 1mm;
}

.carta__vital--pv .carta__vital-rotulo {
  background: $vermelho;
}

.carta__vital--pm .carta__vital-rotulo {
  background: $azul;
}

.carta__vital .carta__numero {
  flex: 1 1 auto;
}

// Características
.carta__caracteristicas {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1mm;
}

.carta__stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 0.4mm solid $linha;
  border-radius: 1.5mm;
  overflow: hidden;
}

.carta__stat-rotulo {
  width: 100%;
  text-align: center;
  font-size: 7px;
  font-weight: 800;
  color: $papel;
  background: $linha;
  line-height: 1.5;
}

// Vantagens e Desvantagens ocupam o espaço que sobrar
.carta__bloco-texto {
  flex: 1 1 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: 0.6mm 1mm;
  border: 0.3mm solid $tinta-suave;
  border-radius: 1.5mm;
}

.carta__texto-longo {
  flex: 1 1 0;
  min-height: 0;

  :deep(.q-field__control),
  :deep(.q-field__control-container) {
    height: 100%;
    min-height: 0;
  }

  :deep(textarea.q-field__native) {
    height: 100% !important;
    min-height: 0 !important;
    resize: none !important;
    font-size: 8px !important;
    line-height: 1.2 !important;
  }
}

.carta__rodape .carta__campo {
  border-bottom: 0;
  border-top: 0.3mm solid $tinta-suave;
}

// ---------------------------------------------------------------------------
// Resumo de pontos, detalhamento e problemas (fora da impressão)
// ---------------------------------------------------------------------------
.resumo-pontos {
  display: flex;
  align-items: center;
  gap: var(--esp-1);
  width: 100%;
  padding: var(--esp-1) var(--esp-3);
  border: 0;
  border-top: 1px solid var(--cor-borda);
  background: var(--cor-superficie-2);
  color: var(--cor-texto);
  font: inherit;
  font-size: 0.8rem;
  cursor: pointer;
  text-align: left;
}

.resumo-pontos__valor {
  font-weight: 800;
}

.resumo-pontos--ok .resumo-pontos__valor {
  color: #2e7d4f;
}

.resumo-pontos--aviso .resumo-pontos__valor {
  color: #9a6a08;
}

.resumo-pontos--erro .resumo-pontos__valor {
  color: #b3261e;
}

body.body--dark .resumo-pontos--ok .resumo-pontos__valor {
  color: #7fd39d;
}

body.body--dark .resumo-pontos--aviso .resumo-pontos__valor {
  color: #f1c45a;
}

body.body--dark .resumo-pontos--erro .resumo-pontos__valor {
  color: #f59a8f;
}

.resumo-pontos__contador {
  font-size: 0.7rem;
  font-weight: 800;
  padding: 0 var(--esp-2);
  border-radius: 999px;
  background: var(--cor-nota-fundo);
}

.resumo-pontos__contador--erro {
  background: var(--cor-importante-fundo);
  color: var(--cor-destaque);
}

.seletor__detalhes {
  padding: var(--esp-2) var(--esp-3) var(--esp-3);
  border-top: 1px solid var(--cor-borda);
  font-size: 0.78rem;
}

.seletor__secao-titulo {
  margin-top: var(--esp-2);
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--cor-texto-suave);
}

.problemas {
  list-style: none;
  margin: 0;
  padding: 0;

  li {
    display: flex;
    gap: var(--esp-1);
    align-items: flex-start;
    margin-bottom: 2px;
    line-height: 1.3;

    .q-icon {
      margin-top: 1px;
      flex: 0 0 auto;
    }
  }
}

.problemas__item--erro .q-icon {
  color: #b3261e;
}

.problemas__item--aviso .q-icon {
  color: #c98a12;
}

.problemas__ok {
  display: flex;
  align-items: center;
  gap: var(--esp-1);
  color: #2e7d4f;
  font-weight: 700;
}

.detalhamento {
  margin: var(--esp-1) 0 0;

  div {
    display: flex;
    justify-content: space-between;
    gap: var(--esp-2);
    border-bottom: 1px dotted var(--cor-borda);
  }

  dd {
    margin: 0;
    font-weight: 800;
  }
}

// Ajustes de quantidade/custo e Focus
.ajuste {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--esp-2);
  font-size: 0.78rem;
}

.ajuste__nome {
  font-weight: 700;
}

.ajuste__quantidade {
  width: 70px;
}

.seletor__dica {
  display: flex;
  align-items: center;
  gap: var(--esp-1);
  font-size: 0.75rem;
  color: var(--cor-texto-suave);
}

// Linha de Focus na carta: rótulo + 6 Caminhos em caixas pequenas
.carta__focus {
  display: grid;
  grid-template-columns: auto repeat(6, 1fr);
  align-items: stretch;
  gap: 0.8mm;
}

.carta__focus-titulo {
  display: flex;
  align-items: center;
  padding-right: 0.5mm;
  font-size: 6.5px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: $verde;
}

.carta__focus-item {
  display: flex;
  align-items: center;
  border: 0.3mm solid $tinta-suave;
  border-radius: 1mm;
  overflow: hidden;
}

.carta__focus-rotulo {
  flex: 0 0 auto;
  padding: 0 0.6mm;
  font-size: 6px;
  font-weight: 800;
  line-height: 1;
  color: $papel;
  background: $verde;
  align-self: stretch;
  display: flex;
  align-items: center;
}

.carta__numero--focus :deep(.q-field__native) {
  font-size: 9px;
  min-height: 3.6mm;
}

.seletor__toggle-secundario {
  margin-top: var(--esp-3);
  font-size: 0.78rem;
  font-weight: 700;
}

// ---------------------------------------------------------------------------
// Texto longo: na tela é um campo editável; na impressão, um bloco de texto
// ---------------------------------------------------------------------------
.carta__rotulo--magia {
  color: $verde;
}

.carta__texto-impresso {
  display: none;
}

// ---------------------------------------------------------------------------
// Impressão: tamanho exato da carta, sem sombra
// ---------------------------------------------------------------------------
@media print {
  .ficha-container {
    margin: 0;
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .carta__texto-impresso {
    display: block;
    flex: 1 1 0;
    min-height: 0;
    overflow: hidden;
    font-size: 7px;
    line-height: 1.2;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    color: #1e2433;
  }

  .carta {
    width: 63mm !important;
    height: 88mm !important;
    box-shadow: none;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
</style>
