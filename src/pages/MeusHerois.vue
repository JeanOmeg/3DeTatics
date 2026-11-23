<template>
  <q-page class="pagina pagina--larga">
    <CabecalhoPagina
      sobretitulo="Heróis e grupos"
      titulo="Meus Heróis"
      descricao="Heróis salvos neste navegador. Use-os em quantos grupos quiser: cada grupo recebe uma cópia."
    >
      <div class="acoes-cabecalho">
        <q-btn
          unelevated
          no-caps
          color="primary"
          icon="person_add"
          label="Novo herói"
          to="/heroi"
        />
        <BotoesBackup @importado="carregar" />
      </div>
    </CabecalhoPagina>

    <div
      v-if="herois.length"
      class="barra-filtros"
    >
      <div class="texto-suave">
        {{ filtrados.length }} de {{ herois.length }} heróis
      </div>
      <q-input
        v-model="busca"
        dense
        outlined
        clearable
        placeholder="Buscar por nome, raça ou kit..."
        class="barra-filtros__busca"
      >
        <template #prepend>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>

    <div
      v-if="carregando"
      class="grade-cards"
      aria-busy="true"
    >
      <q-skeleton
        v-for="n in 3"
        :key="n"
        height="170px"
        class="cartao-skeleton"
      />
    </div>

    <EstadoVazio
      v-else-if="erro"
      icone="error_outline"
      titulo="Não foi possível carregar os heróis"
      texto="Os dados do navegador não puderam ser lidos. Tente novamente."
    >
      <q-btn
        unelevated
        no-caps
        color="primary"
        icon="refresh"
        label="Tentar de novo"
        @click="carregar"
      />
    </EstadoVazio>

    <EstadoVazio
      v-else-if="!herois.length"
      icone="person"
      titulo="Nenhum herói salvo ainda"
      texto="Crie um herói aqui ou use o botão de salvar em uma carta do Criador de Grupo."
    >
      <q-btn
        unelevated
        no-caps
        color="primary"
        icon="person_add"
        label="Criar um herói"
        to="/heroi"
      />
    </EstadoVazio>

    <EstadoVazio
      v-else-if="!filtrados.length"
      icone="search_off"
      titulo="Nada encontrado"
      :texto="`Nenhum herói corresponde a “${busca}”.`"
    />

    <div
      v-else
      class="grade-cards"
    >
      <article
        v-for="heroi in filtrados"
        :key="heroi.id"
        class="cartao-heroi"
      >
        <header class="cartao-heroi__topo">
          <h2 class="cartao-heroi__nome">
            {{ nomeExibicao(heroi) }}
          </h2>
          <span
            v-if="heroi.ph !== null"
            class="cartao-heroi__ph"
          >{{ heroi.ph }} PH</span>
        </header>
        <div class="cartao-heroi__info">
          {{ [heroi.raca, heroi.kit].filter(Boolean).join(' · ') || 'Sem raça e kit' }}
        </div>
        <dl class="cartao-heroi__stats">
          <div
            v-for="stat in caracteristicas"
            :key="stat"
          >
            <dt>{{ stat }}</dt>
            <dd>{{ heroi.caracteristicas[stat] ?? '–' }}</dd>
          </div>
        </dl>
        <div class="texto-legenda">
          Atualizado em {{ formatarData(heroi.atualizadoEm) }}
        </div>
        <div class="cartao-heroi__acoes">
          <q-btn
            unelevated
            no-caps
            color="primary"
            icon="edit"
            label="Editar"
            :to="{ path: '/heroi', query: { id: heroi.id } }"
          />
          <q-btn
            flat
            round
            color="primary"
            icon="content_copy"
            aria-label="Duplicar herói"
            @click="duplicar(heroi)"
          >
            <q-tooltip>Duplicar</q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            icon="delete_outline"
            aria-label="Excluir herói"
            class="cartao-heroi__excluir"
            @click="confirmarRemocao(heroi)"
          >
            <q-tooltip>Excluir</q-tooltip>
          </q-btn>
        </div>
      </article>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import CabecalhoPagina from 'components/CabecalhoPagina.vue'
import EstadoVazio from 'components/EstadoVazio.vue'
import BotoesBackup from 'components/BotoesBackup.vue'
import type { IHeroiSalvo } from 'src/interfaces/heroi-interface'
import type { TCaracteristicaKey } from 'src/types/caracteristica-key-type'
import { copiarHeroi, nomeExibicao } from 'src/libs/heroi-lib'
import { correspondeBusca } from 'src/libs/busca-lib'
import { listarHerois, removerHeroi, salvarHeroi } from 'src/services/herois-service'

const $q = useQuasar()

const caracteristicas: TCaracteristicaKey[] = ['F', 'H', 'R', 'A', 'PdF']

const herois = ref<IHeroiSalvo[]>([])
const carregando = ref(false)
const erro = ref(false)
const busca = ref('')

const filtrados = computed(() => herois.value.filter(heroi => correspondeBusca(busca.value, heroi.name, heroi.raca, heroi.kit)))

async function carregar () {
  carregando.value = true
  erro.value = false
  try {
    herois.value = await listarHerois()
  } catch {
    erro.value = true
  } finally {
    carregando.value = false
  }
}

function formatarData (data: string) {
  return new Date(data).toLocaleDateString('pt-BR')
}

function duplicar (heroi: IHeroiSalvo) {
  const copia = copiarHeroi(heroi)
  copia.name = `${nomeExibicao(heroi)} (cópia)`

  salvarHeroi(copia)
    .then(async () => {
      $q.notify({ type: 'positive', message: 'Herói duplicado.' })
      await carregar()
    })
    .catch(() => {
      $q.notify({ type: 'negative', message: 'Não foi possível duplicar o herói.' })
    })
}

function confirmarRemocao (heroi: IHeroiSalvo) {
  $q.dialog({
    title: 'Excluir herói',
    message: `Tem certeza que deseja excluir "${nomeExibicao(heroi)}"? Os grupos que já usam este herói não são afetados.`,
    cancel: { label: 'Cancelar', flat: true, noCaps: true },
    ok: { label: 'Excluir', color: 'negative', unelevated: true, noCaps: true },
    persistent: true
  }).onOk(() => {
    removerHeroi(heroi.id)
      .then(async () => {
        $q.notify({ type: 'positive', message: 'Herói excluído.' })
        await carregar()
      })
      .catch(() => {
        $q.notify({ type: 'negative', message: 'Não foi possível excluir o herói.' })
      })
  })
}

onMounted(carregar)
</script>

<style scoped lang="scss">
.acoes-cabecalho {
  display: flex;
  flex-wrap: wrap;
  gap: var(--esp-2);
}

.cartao-skeleton {
  border-radius: var(--raio-3);
}

.cartao-heroi {
  display: flex;
  flex-direction: column;
  gap: var(--esp-2);
  padding: var(--esp-5);
  background: var(--cor-superficie);
  border: 1px solid var(--cor-borda);
  border-top: 4px solid var(--cor-link);
  border-radius: var(--raio-3);
  box-shadow: var(--sombra-1);
}

.cartao-heroi__topo {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--esp-2);
}

.cartao-heroi__nome {
  font-size: 1.2rem;
  font-weight: 700;
  overflow-wrap: anywhere;
}

.cartao-heroi__ph {
  flex: 0 0 auto;
  font-size: 0.8rem;
  font-weight: 800;
  color: var(--cor-destaque);
  background: var(--cor-importante-fundo);
  border-radius: 999px;
  padding: 2px var(--esp-3);
}

.cartao-heroi__info {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--cor-texto-suave);
}

.cartao-heroi__stats {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: var(--esp-1);
  margin: 0;

  div {
    text-align: center;
    border-radius: var(--raio-1);
    background: var(--cor-superficie-2);
    padding: 2px 0;
  }

  dt {
    font-size: 0.7rem;
    font-weight: 800;
    color: var(--cor-texto-suave);
  }

  dd {
    margin: 0;
    font-family: var(--fonte-titulo);
    font-weight: 700;
    color: var(--cor-titulo);
  }
}

.cartao-heroi__acoes {
  display: flex;
  align-items: center;
  gap: var(--esp-1);
  margin-top: var(--esp-2);

  .q-btn:first-child {
    margin-right: auto;
  }
}

.cartao-heroi__excluir {
  color: var(--cor-destaque);
}
</style>
