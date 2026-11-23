<template>
  <q-page class="pagina pagina--larga criador">
    <div class="print-hide">
      <CabecalhoPagina
        sobretitulo="Criador de grupo"
        descricao="Preencha as cartas dos seus heróis, salve o grupo neste navegador e imprima para jogar."
        :titulo="grupoAtualNome || 'Novo grupo'"
      />

      <div class="barra-acoes">
        <div class="barra-acoes__botoes">
          <q-btn-dropdown
            split
            unelevated
            no-caps
            color="primary"
            icon="person_add"
            label="Adicionar herói"
            @click="adicionarHeroi"
          >
            <q-list>
              <q-item
                v-close-popup
                clickable
                @click="adicionarHeroi"
              >
                <q-item-section avatar>
                  <q-icon name="person_add" />
                </q-item-section>
                <q-item-section>Herói em branco</q-item-section>
              </q-item>
              <q-item
                v-close-popup
                clickable
                @click="dialogoHeroisAberto = true"
              >
                <q-item-section avatar>
                  <q-icon name="bookmarks" />
                </q-item-section>
                <q-item-section>Herói de Meus Heróis</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
          <q-btn
            outline
            no-caps
            color="primary"
            icon="save"
            label="Salvar grupo"
            @click="salvarGrupo(false)"
          />
          <q-btn
            outline
            no-caps
            color="primary"
            icon="print"
            label="Imprimir"
            @click="imprimirGrupo"
          />
          <q-btn
            flat
            round
            color="primary"
            icon="more_vert"
            aria-label="Mais ações"
          >
            <q-menu>
              <q-list style="min-width: 220px">
                <q-item
                  v-close-popup
                  clickable
                  :disable="!grupoAtualId"
                  @click="salvarGrupo(true)"
                >
                  <q-item-section avatar>
                    <q-icon name="file_copy" />
                  </q-item-section>
                  <q-item-section>Salvar como cópia</q-item-section>
                </q-item>
                <q-item
                  v-close-popup
                  clickable
                  @click="iniciarNovoGrupo"
                >
                  <q-item-section avatar>
                    <q-icon name="note_add" />
                  </q-item-section>
                  <q-item-section>Novo grupo</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>

        <q-select
          dense
          outlined
          emit-value
          map-options
          options-dense
          label="Tamanho do grupo"
          class="seletor-tamanho"
          :model-value="tamanho"
          :options="opcoesTamanho"
          @update:model-value="aoMudarTamanho"
        />

        <dl class="resumo">
          <div class="resumo__item">
            <dt>Heróis</dt>
            <dd>{{ lista_grupo.length }}</dd>
          </div>
          <div class="resumo__item">
            <dt>PH total</dt>
            <dd>{{ totalPh }}</dd>
          </div>
          <div
            v-for="faixa in heroisPorFaixa"
            :key="faixa.pontos"
            class="resumo__item resumo__item--faixa"
            :class="{ 'resumo__item--certo': faixa.esperado !== null && faixa.quantidade === faixa.esperado }"
          >
            <dt>{{ faixa.pontos }} pts</dt>
            <dd>{{ faixa.quantidade }}<span v-if="faixa.esperado !== null">/{{ faixa.esperado }}</span></dd>
          </div>
        </dl>
      </div>

      <CaixaDestaque
        v-if="problemasDoGrupo.length || heroisComErro"
        tipo="importante"
        titulo="Verificação do grupo"
      >
        <ul class="problemas-grupo">
          <li v-if="heroisComErro">
            {{ heroisComErro }} {{ heroisComErro === 1 ? 'herói tem' : 'heróis têm' }} erros na ficha (veja o resumo de pontos acima de cada carta).
          </li>
          <li
            v-for="(problema, indice) in problemasDoGrupo"
            :key="indice"
          >
            <q-icon
              size="16px"
              :name="problema.nivel === 'erro' ? 'error' : 'warning'"
            />
            {{ problema.mensagem }}
          </li>
        </ul>
      </CaixaDestaque>

      <div
        v-if="temAlteracoes"
        class="aviso-alteracoes"
        role="status"
      >
        <q-icon
          name="edit_note"
          size="18px"
        />
        Alterações não salvas
      </div>
    </div>

    <div
      v-if="lista_grupo.length"
      class="lista-fichas"
    >
      <CompFichaDeHeroi
        v-for="(char, index) in lista_grupo"
        :key="char.id"
        :heroi_inicial="char"
        @remove="removerHeroi(index)"
        @salvar="salvarEmMeusHerois"
      />
    </div>

    <EstadoVazio
      v-else
      icone="military_tech"
      titulo="Nenhum herói no grupo"
      texto="Adicione heróis para começar a montar as cartas."
      class="print-hide"
    >
      <q-btn
        unelevated
        no-caps
        color="primary"
        icon="person_add"
        label="Herói em branco"
        @click="adicionarHeroi"
      />
      <q-btn
        outline
        no-caps
        color="primary"
        icon="bookmarks"
        label="Herói de Meus Heróis"
        @click="dialogoHeroisAberto = true"
      />
    </EstadoVazio>

    <DialogoHeroisSalvos
      v-model:aberto="dialogoHeroisAberto"
      @escolher="adicionarHeroiSalvo"
    />
  </q-page>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { onBeforeRouteLeave, onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import CompFichaDeHeroi from 'components/CompFichaDeHeroi.vue'
import CabecalhoPagina from 'components/CabecalhoPagina.vue'
import EstadoVazio from 'components/EstadoVazio.vue'
import DialogoHeroisSalvos from 'components/DialogoHeroisSalvos.vue'
import CaixaDestaque from 'components/CaixaDestaque.vue'
import type { TTamanhoGrupo } from 'src/interfaces/grupo-interface'
import { ajustarGrupoAoTamanho, calcularHeroi, FAIXAS_DE_PONTOS, TAMANHOS_GRUPO, validarGrupo } from 'src/libs/ficha-lib'
import type { IHeroi } from 'src/interfaces/heroi-interface'
import { copiarHeroi, nomeExibicao, novoHeroi } from 'src/libs/heroi-lib'
import { obterGrupo, salvarGrupo as persistirGrupo } from 'src/services/grupos-service'
import { salvarHeroi } from 'src/services/herois-service'

const $q = useQuasar()
const $route = useRoute()
const $router = useRouter()

const lista_grupo = ref<IHeroi[]>([])
const grupoAtualId = ref<string | null>(null)
const grupoAtualNome = ref('')
const tamanho = ref<TTamanhoGrupo>('livre')

// Ex.: "Novato · 3×5 + 2×7 pts"
const opcoesTamanho = Object.entries(TAMANHOS_GRUPO).map(([value, regra]) => {
  const composicao = Object.entries(regra.herois ?? {}).map(([pontos, quantidade]) => `${quantidade}×${pontos}`).join(' + ')
  return { value, label: composicao ? `${regra.nome} · ${composicao} pts` : regra.nome }
})

const problemasDoGrupo = computed(() => validarGrupo(lista_grupo.value, tamanho.value))
const heroisComErro = computed(() => lista_grupo.value.filter(heroi => calcularHeroi(heroi).problemas.some(p => p.nivel === 'erro')).length)
const dialogoHeroisAberto = ref(false)

// Retrato do grupo no último carregamento/salvamento, para detectar alterações.
const retratoSalvo = ref('')
const retratoAtual = computed(() => JSON.stringify({ nome: grupoAtualNome.value, tamanho: tamanho.value, herois: lista_grupo.value }))
const temAlteracoes = computed(() => retratoAtual.value !== retratoSalvo.value)

function marcarComoSalvo () {
  retratoSalvo.value = retratoAtual.value
}

const totalPh = computed(() => lista_grupo.value.reduce((total, heroi) => total + (heroi.ph ?? 0), 0))

const heroisPorFaixa = computed(() => FAIXAS_DE_PONTOS.map(pontos => ({
  pontos,
  esperado: TAMANHOS_GRUPO[tamanho.value].herois ? (TAMANHOS_GRUPO[tamanho.value].herois?.[pontos] ?? 0) : null,
  quantidade: lista_grupo.value.filter(heroi => heroi.ph === pontos).length
})))

// Ao escolher o tamanho, o grupo ganha as cartas que faltam (já com o PH de cada
// faixa) e perde só as cartas vazias que sobram. Cartas preenchidas nunca são apagadas.
function aoMudarTamanho (novo: TTamanhoGrupo) {
  tamanho.value = novo
  const ajuste = ajustarGrupoAoTamanho(lista_grupo.value, novo, novoHeroi)
  lista_grupo.value = ajuste.herois

  const partes = []
  if (ajuste.adicionados) partes.push(`${ajuste.adicionados} ${ajuste.adicionados === 1 ? 'carta adicionada' : 'cartas adicionadas'}`)
  if (ajuste.removidos) partes.push(`${ajuste.removidos} ${ajuste.removidos === 1 ? 'carta vazia removida' : 'cartas vazias removidas'}`)
  if (partes.length) {
    $q.notify({ type: 'info', message: `Grupo ${TAMANHOS_GRUPO[novo].nome}: ${partes.join(' e ')}.` })
  }
}

function adicionarHeroi () {
  lista_grupo.value.push(novoHeroi())
}

function adicionarHeroiSalvo (heroi: IHeroi) {
  lista_grupo.value.push(copiarHeroi(heroi))
  $q.notify({ type: 'positive', message: `${nomeExibicao(heroi)} entrou no grupo.` })
}

function removerHeroi (index: number) {
  lista_grupo.value.splice(index, 1)
}

function salvarEmMeusHerois (heroi: IHeroi) {
  salvarHeroi(heroi)
    .then(() => {
      $q.notify({ type: 'positive', message: `${nomeExibicao(heroi)} salvo em Meus Heróis.` })
    })
    .catch(() => {
      $q.notify({ type: 'negative', message: 'Não foi possível salvar o herói.' })
    })
}

// Salva o grupo atual. Com `comoCopia`, cria um grupo novo e mantém o original.
function salvarGrupo (comoCopia: boolean) {
  $q.dialog({
    title: comoCopia ? 'Salvar como cópia' : 'Salvar grupo',
    message: 'Dê um nome para o grupo:',
    prompt: {
      model: comoCopia ? `${grupoAtualNome.value} (cópia)` : grupoAtualNome.value,
      type: 'text',
      isValid: (valor: string) => valor.trim().length > 0
    },
    cancel: { label: 'Cancelar', flat: true, noCaps: true },
    ok: { label: 'Salvar', color: 'primary', unelevated: true, noCaps: true },
    persistent: true
  }).onOk((nome: string) => {
    const id = !comoCopia && grupoAtualId.value ? grupoAtualId.value : globalThis.crypto.randomUUID()
    const herois = comoCopia ? lista_grupo.value.map(copiarHeroi) : lista_grupo.value

    persistirGrupo({ id, nome: nome.trim(), herois, tamanho: tamanho.value })
      .then(async grupo => {
        lista_grupo.value = herois
        grupoAtualId.value = grupo.id
        grupoAtualNome.value = grupo.nome
        marcarComoSalvo()
        $q.notify({ type: 'positive', message: comoCopia ? 'Cópia salva. Você está editando a cópia.' : 'Grupo salvo com sucesso!' })

        if ($route.query.id !== grupo.id) {
          await $router.replace({ path: '/grupo', query: { id: grupo.id } })
        }
      })
      .catch(() => {
        $q.notify({ type: 'negative', message: 'Não foi possível salvar o grupo.' })
      })
  })
}

function imprimirGrupo () {
  window.print()
}

function resetarParaNovo () {
  lista_grupo.value = [novoHeroi()]
  grupoAtualId.value = null
  grupoAtualNome.value = ''
  tamanho.value = 'livre'
  marcarComoSalvo()
}

async function iniciarNovoGrupo () {
  if ($route.query.id) {
    await $router.push('/grupo')
  } else if (await confirmarDescarte()) {
    resetarParaNovo()
  }
}

async function carregar (id: unknown) {
  if (typeof id !== 'string') {
    resetarParaNovo()
    return
  }

  try {
    const grupo = await obterGrupo(id)

    if (!grupo) {
      $q.notify({ type: 'warning', message: 'Grupo não encontrado. Começando um grupo novo.' })
      await $router.replace('/grupo')
      return
    }

    lista_grupo.value = grupo.herois
    tamanho.value = grupo.tamanho
    grupoAtualId.value = grupo.id
    grupoAtualNome.value = grupo.nome
    marcarComoSalvo()
  } catch {
    $q.notify({ type: 'negative', message: 'Não foi possível abrir o grupo.' })
    resetarParaNovo()
  }
}

// Pergunta antes de descartar alterações não salvas.
function confirmarDescarte (): Promise<boolean> {
  if (!temAlteracoes.value) {
    return Promise.resolve(true)
  }

  return new Promise(resolve => {
    $q.dialog({
      title: 'Alterações não salvas',
      message: 'Este grupo tem alterações que ainda não foram salvas. Deseja sair mesmo assim?',
      cancel: { label: 'Continuar editando', flat: true, noCaps: true },
      ok: { label: 'Sair sem salvar', color: 'negative', unelevated: true, noCaps: true },
      persistent: true
    })
      .onOk(() => resolve(true))
      .onCancel(() => resolve(false))
  })
}

// O mesmo componente é reaproveitado entre /grupo e /grupo?id=X:
// reage à troca de rota em vez de carregar só uma vez.
watch(() => $route.query.id, async (id, idAnterior) => {
  if (id !== idAnterior && id !== grupoAtualId.value) {
    await carregar(id)
  }
})

onBeforeRouteLeave(confirmarDescarte)
onBeforeRouteUpdate(async (para, de) => para.query.id === de.query.id || await confirmarDescarte())

function avisarAntesDeFechar (evento: BeforeUnloadEvent) {
  if (temAlteracoes.value) {
    evento.preventDefault()
  }
}

onMounted(async () => {
  window.addEventListener('beforeunload', avisarAntesDeFechar)
  await carregar($route.query.id)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', avisarAntesDeFechar)
})
</script>

<style scoped lang="scss">
.barra-acoes {
  position: sticky;
  top: 63px;
  z-index: 3;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--esp-3);
  padding: var(--esp-3);
  margin-bottom: var(--esp-5);
  background: var(--cor-superficie);
  border: 1px solid var(--cor-borda);
  border-radius: var(--raio-3);
  box-shadow: var(--sombra-2);
}

.barra-acoes__botoes {
  display: flex;
  flex-wrap: wrap;
  gap: var(--esp-2);

  @media (max-width: 599px) {
    width: 100%;

    .q-btn {
      flex: 1 1 100%;
    }
  }
}

.resumo {
  display: flex;
  flex-wrap: wrap;
  gap: var(--esp-2);
  margin: 0;
}

.resumo__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 56px;
  padding: var(--esp-1) var(--esp-3);
  border-radius: var(--raio-2);
  background: var(--cor-superficie-2);

  dt {
    font-size: 0.7rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--cor-texto-suave);
  }

  dd {
    margin: 0;
    font-family: var(--fonte-titulo);
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--cor-titulo);
  }
}

.seletor-tamanho {
  min-width: 260px;
}

.resumo__item--certo dd {
  color: #2e7d4f !important;
}

body.body--dark .resumo__item--certo dd {
  color: #7fd39d !important;
}

.problemas-grupo {
  list-style: none;
  margin: 0;
  padding: 0;

  li {
    display: flex;
    gap: var(--esp-1);
    align-items: center;
  }
}

.resumo__item--faixa dd {
  color: var(--cor-destaque);
}

.aviso-alteracoes {
  display: inline-flex;
  align-items: center;
  gap: var(--esp-1);
  margin: calc(var(--esp-3) * -1) 0 var(--esp-4);
  padding: 2px var(--esp-3);
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--cor-destaque);
  background: var(--cor-importante-fundo);
}

// Cartas lado a lado, quebrando conforme o espaço
.lista-fichas {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  gap: var(--esp-4);
}
</style>

<style lang="scss">
@media print {
  // A4 com margens mínimas: cabem 3 x 3 = 9 cartas de 63mm x 88mm por página
  @page {
    size: A4 portrait;
    margin: 6mm;
  }

  html,
  body {
    margin: 0 !important;
    padding: 0 !important;
  }

  .q-header,
  .q-footer,
  .q-drawer,
  .q-drawer-container,
  .print-hide,
  .no-print {
    display: none !important;
  }

  .q-page-container,
  .q-page,
  .pagina {
    padding: 0 !important;
    margin: 0 !important;
    max-width: none !important;
  }

  .criador .lista-fichas {
    display: flex !important;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-content: flex-start;
    // Pequeno espaçamento entre as cartas para facilitar o recorte
    gap: 3mm !important;
    margin: 0 !important;
  }

  .criador .lista-fichas > * {
    width: 63mm !important;
    margin: 0 !important;
    break-inside: avoid;
    page-break-inside: avoid;
  }
}
</style>
