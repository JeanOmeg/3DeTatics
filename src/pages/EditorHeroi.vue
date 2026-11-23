<template>
  <q-page class="pagina">
    <CabecalhoPagina
      sobretitulo="Meus Heróis"
      descricao="As alterações valem para o herói salvo. Grupos que já usam este herói não mudam."
      :titulo="heroiSalvoId ? 'Editar herói' : 'Novo herói'"
    >
      <div class="acoes-cabecalho">
        <q-btn
          unelevated
          no-caps
          color="primary"
          icon="save"
          label="Salvar herói"
          :disable="!heroi"
          @click="salvar"
        />
        <q-btn
          flat
          no-caps
          color="primary"
          icon="arrow_back"
          label="Voltar para Meus Heróis"
          to="/herois"
        />
      </div>
    </CabecalhoPagina>

    <div
      v-if="heroi"
      class="area-carta"
    >
      <CompFichaDeHeroi
        :key="heroi.id"
        :heroi_inicial="heroi"
        :removivel="false"
        :salvavel="false"
      />
    </div>

    <div
      v-else
      class="text-center q-pa-xl"
    >
      <q-spinner
        color="primary"
        size="40px"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import CabecalhoPagina from 'components/CabecalhoPagina.vue'
import CompFichaDeHeroi from 'components/CompFichaDeHeroi.vue'
import type { IHeroi } from 'src/interfaces/heroi-interface'
import { migrarHeroi, nomeExibicao, novoHeroi } from 'src/libs/heroi-lib'
import { obterHeroi, salvarHeroi } from 'src/services/herois-service'

const $q = useQuasar()
const $route = useRoute()
const $router = useRouter()

const heroi = ref<IHeroi | null>(null)
const heroiSalvoId = ref<string | null>(null)

async function carregar (id: unknown) {
  heroi.value = null

  if (typeof id !== 'string') {
    heroi.value = novoHeroi()
    heroiSalvoId.value = null
    return
  }

  try {
    const salvo = await obterHeroi(id)

    if (!salvo) {
      $q.notify({ type: 'warning', message: 'Herói não encontrado. Começando um herói novo.' })
      await $router.replace('/heroi')
      return
    }

    heroi.value = migrarHeroi(salvo)
    heroiSalvoId.value = salvo.id
  } catch {
    $q.notify({ type: 'negative', message: 'Não foi possível abrir o herói.' })
    heroi.value = novoHeroi()
  }
}

function salvar () {
  if (!heroi.value) {
    return
  }

  salvarHeroi(heroi.value)
    .then(async salvo => {
      heroiSalvoId.value = salvo.id
      $q.notify({ type: 'positive', message: `${nomeExibicao(salvo)} salvo.` })

      if ($route.query.id !== salvo.id) {
        await $router.replace({ path: '/heroi', query: { id: salvo.id } })
      }
    })
    .catch(() => {
      $q.notify({ type: 'negative', message: 'Não foi possível salvar o herói.' })
    })
}

watch(() => $route.query.id, async id => {
  if (id !== heroiSalvoId.value) {
    await carregar(id)
  }
}, { immediate: true })
</script>

<style scoped lang="scss">
.acoes-cabecalho {
  display: flex;
  flex-wrap: wrap;
  gap: var(--esp-2);
}

.area-carta {
  display: flex;
  justify-content: center;
  padding: var(--esp-5) 0;
}
</style>
