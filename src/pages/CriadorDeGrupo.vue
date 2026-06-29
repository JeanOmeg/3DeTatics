<template>
  <q-page class="criador-page q-pa-md">
    <div class="criador-conteudo">
      <div class="text-h4 text-white text-center q-mb-sm print-hide">
        <b>Criador de grupo</b>
      </div>

      <div class="acoes-barra print-hide">
        <q-btn
          unelevated
          no-caps
          color="primary"
          icon="add"
          label="Adicionar Herói"
          class="acao-btn"
          @click="adicionarHeroi"
        />
        <q-btn
          unelevated
          no-caps
          color="secondary"
          icon="print"
          label="Imprimir Grupo"
          class="acao-btn"
          @click="imprimirGrupo"
        />
        <q-btn
          unelevated
          no-caps
          color="accent"
          icon="save"
          label="Salvar Grupo"
          class="acao-btn"
          @click="salvarGrupo"
        />
      </div>

      <div class="contador-herois print-hide">
        Quantidade de Heróis no grupo: <b>{{ lista_grupo.length }}</b>
      </div>

      <div class="lista-fichas">
        <CompFichaDeHeroi
          v-for="(char, index) in lista_grupo"
          :key="char.id"
          :heroi_inicial="char"
          @remove="removerHeroi(index)"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import CompFichaDeHeroi from '../components/CompFichaDeHeroi.vue'
import type { IHeroi } from 'src/interfaces/heroi-interface'
import type { IGrupo } from 'src/interfaces/grupo-interface'
import { obterGrupo, salvarGrupo as persistirGrupo } from 'src/services/grupos-service'

const $q = useQuasar()
const $route = useRoute()

const lista_grupo = ref<IHeroi[]>([novoHeroi()])

const grupoAtualId = ref<string | null>(null)
const grupoAtualNome = ref('')

function novoHeroi () {
  const heroi: IHeroi = {
    id: globalThis.crypto.randomUUID(),
    name: '',
    pv: null,
    pm: null,
    ph: null,
    raca: '',
    kit: '',
    caracteristicas: {
      F: null,
      PdF: null,
      A: null,
      H: null,
      R: null
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
/* Esta página precisa de toda a largura para encaixar mais cartas lado a lado,
   sobrepondo o limite global de 1000px definido em app.scss. */
.q-page.criador-page {
  max-width: none;
}

.criador-conteudo {
  max-width: 1400px;
  margin: 0 auto;
}

/* Barra de ações no topo */
.acoes-barra {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;
}

.acao-btn {
  min-width: 200px;
  font-weight: 600;
  border-radius: 10px;
}

/* Marcador com a quantidade de heróis */
.contador-herois {
  width: fit-content;
  margin: 0 auto 16px;
  padding: 8px 16px;
  background-color: #fafafa;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  color: #555;
  font-size: 14px;
  font-weight: 600;
}

/* Cartas lado a lado na tela, quebrando conforme o espaço */
.lista-fichas {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  gap: 12px;
}

/* Em telas estreitas os botões ocupam a linha inteira */
@media (max-width: 599px) {
  .acao-btn {
    flex: 1 1 100%;
  }
}

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
    /* Pequeno espaçamento entre as cartas para facilitar o recorte no papel */
    gap: 3mm !important;
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
