<template>
  <q-page class="pagina pagina--larga">
    <CabecalhoPagina
      sobretitulo="Heróis e grupos"
      titulo="Grupos salvos"
      descricao="Os grupos ficam guardados neste navegador. Abra um grupo para editar ou imprimir."
    >
      <div class="acoes-cabecalho">
        <q-btn
          unelevated
          no-caps
          color="primary"
          icon="add"
          label="Novo grupo"
          to="/grupo"
        />
        <BotoesBackup @importado="carregarGrupos" />
      </div>
    </CabecalhoPagina>

    <div
      v-if="carregando"
      class="grade-cards"
      aria-busy="true"
    >
      <q-skeleton
        v-for="n in 3"
        :key="n"
        height="150px"
        class="cartao-skeleton"
      />
    </div>

    <EstadoVazio
      v-else-if="erro"
      icone="error_outline"
      titulo="Não foi possível carregar os grupos"
      texto="Os dados do navegador não puderam ser lidos. Tente novamente."
    >
      <q-btn
        unelevated
        no-caps
        color="primary"
        icon="refresh"
        label="Tentar de novo"
        @click="carregarGrupos"
      />
    </EstadoVazio>

    <EstadoVazio
      v-else-if="!grupos.length"
      icone="groups"
      titulo="Nenhum grupo salvo ainda"
      texto="Monte seus heróis no Criador de Grupo e use o botão Salvar grupo."
    >
      <q-btn
        unelevated
        no-caps
        color="primary"
        icon="military_tech"
        label="Criar um grupo"
        to="/grupo"
      />
    </EstadoVazio>

    <div
      v-else
      class="grade-cards"
    >
      <article
        v-for="grupo in grupos"
        :key="grupo.id"
        class="cartao-grupo"
      >
        <h2 class="cartao-grupo__nome">
          {{ grupo.nome }}
        </h2>
        <div class="cartao-grupo__info">
          <span>
            <q-icon
              name="person"
              size="16px"
            />
            {{ grupo.herois.length }} {{ grupo.herois.length === 1 ? 'herói' : 'heróis' }}
          </span>
          <span>
            <q-icon
              name="update"
              size="16px"
            />
            {{ formatarData(grupo.atualizadoEm) }}
          </span>
        </div>
        <div class="cartao-grupo__herois">
          {{ resumoHerois(grupo) }}
        </div>
        <div class="cartao-grupo__acoes">
          <q-btn
            unelevated
            no-caps
            color="primary"
            icon="edit"
            label="Abrir"
            @click="abrirGrupo(grupo)"
          />
          <q-btn
            flat
            no-caps
            icon="delete_outline"
            label="Excluir"
            class="cartao-grupo__excluir"
            @click="confirmarRemocao(grupo)"
          />
        </div>
      </article>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import CabecalhoPagina from 'components/CabecalhoPagina.vue'
import EstadoVazio from 'components/EstadoVazio.vue'
import BotoesBackup from 'components/BotoesBackup.vue'
import type { IGrupo } from 'src/interfaces/grupo-interface'
import { listarGrupos, removerGrupo } from 'src/services/grupos-service'

const $q = useQuasar()
const $router = useRouter()

const grupos = ref<IGrupo[]>([])
const carregando = ref(false)
const erro = ref(false)

async function carregarGrupos () {
  carregando.value = true
  erro.value = false
  try {
    grupos.value = await listarGrupos()
  } catch {
    erro.value = true
  } finally {
    carregando.value = false
  }
}

function formatarData (data: string) {
  return new Date(data).toLocaleDateString('pt-BR')
}

function resumoHerois (grupo: IGrupo) {
  const nomes = grupo.herois.map(heroi => heroi.name.trim()).filter(Boolean)
  return nomes.length ? nomes.join(', ') : 'Heróis sem nome'
}

async function abrirGrupo (grupo: IGrupo) {
  await $router.push({ path: '/grupo', query: { id: grupo.id } })
}

function confirmarRemocao (grupo: IGrupo) {
  $q.dialog({
    title: 'Excluir grupo',
    message: `Tem certeza que deseja excluir o grupo "${grupo.nome}"? Essa ação não pode ser desfeita.`,
    cancel: { label: 'Cancelar', flat: true, noCaps: true },
    ok: { label: 'Excluir', color: 'negative', unelevated: true, noCaps: true },
    persistent: true
  }).onOk(() => {
    removerGrupo(grupo.id)
      .then(async () => {
        $q.notify({ type: 'positive', message: 'Grupo excluído.' })
        await carregarGrupos()
      })
      .catch(() => {
        $q.notify({ type: 'negative', message: 'Não foi possível excluir o grupo.' })
      })
  })
}

onMounted(carregarGrupos)
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

.cartao-grupo {
  display: flex;
  flex-direction: column;
  gap: var(--esp-2);
  padding: var(--esp-5);
  background: var(--cor-superficie);
  border: 1px solid var(--cor-borda);
  border-top: 4px solid var(--cor-destaque);
  border-radius: var(--raio-3);
  box-shadow: var(--sombra-1);
}

.cartao-grupo__nome {
  font-size: 1.2rem;
  font-weight: 700;
  overflow-wrap: anywhere;
}

.cartao-grupo__info {
  display: flex;
  flex-wrap: wrap;
  gap: var(--esp-4);
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--cor-texto-suave);

  span {
    display: inline-flex;
    align-items: center;
    gap: var(--esp-1);
  }
}

.cartao-grupo__herois {
  flex: 1 1 auto;
  font-size: 0.9rem;
  color: var(--cor-texto);
}

.cartao-grupo__acoes {
  display: flex;
  justify-content: space-between;
  gap: var(--esp-2);
  margin-top: var(--esp-2);
}

.cartao-grupo__excluir {
  color: var(--cor-destaque);
}
</style>
