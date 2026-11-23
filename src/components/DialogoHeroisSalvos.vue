<template>
  <q-dialog
    :model-value="aberto"
    @update:model-value="emit('update:aberto', $event)"
    @show="carregar"
  >
    <q-card class="dialogo">
      <q-card-section class="dialogo__cabecalho">
        <div class="dialogo__titulo">
          Adicionar herói salvo
        </div>
        <div class="texto-legenda">
          O herói entra no grupo como uma cópia: editar aqui não altera o herói salvo.
        </div>
        <q-input
          v-model="busca"
          dense
          outlined
          clearable
          autofocus
          placeholder="Buscar por nome, raça ou kit..."
          class="q-mt-md"
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </q-card-section>

      <q-separator />

      <q-card-section class="dialogo__lista">
        <div
          v-if="carregando"
          class="text-center q-pa-lg"
        >
          <q-spinner
            color="primary"
            size="32px"
          />
        </div>

        <EstadoVazio
          v-else-if="!herois.length"
          icone="person_off"
          titulo="Nenhum herói salvo"
          texto="Use o botão de salvar em uma carta ou crie heróis em Meus Heróis."
        />

        <EstadoVazio
          v-else-if="!filtrados.length"
          icone="search_off"
          titulo="Nada encontrado"
        />

        <q-list
          v-else
          separator
        >
          <q-item
            v-for="heroi in filtrados"
            :key="heroi.id"
            v-close-popup
            clickable
            @click="emit('escolher', heroi)"
          >
            <q-item-section avatar>
              <div class="dialogo__ph">
                {{ heroi.ph ?? '–' }}
              </div>
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-bold">
                {{ nomeExibicao(heroi) }}
              </q-item-label>
              <q-item-label caption>
                {{ descricaoCurta(heroi) }}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="add_circle" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn
          v-close-popup
          flat
          no-caps
          color="primary"
          label="Fechar"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useQuasar } from 'quasar'
import EstadoVazio from 'components/EstadoVazio.vue'
import type { IHeroiSalvo } from 'src/interfaces/heroi-interface'
import { listarHerois } from 'src/services/herois-service'
import { nomeExibicao } from 'src/libs/heroi-lib'
import { correspondeBusca } from 'src/libs/busca-lib'

defineProps<{ aberto: boolean }>()

const emit = defineEmits<{
  'update:aberto': [valor: boolean]
  escolher: [heroi: IHeroiSalvo]
}>()

const $q = useQuasar()

const herois = ref<IHeroiSalvo[]>([])
const carregando = ref(false)
const busca = ref('')

const filtrados = computed(() => herois.value.filter(heroi => correspondeBusca(busca.value, heroi.name, heroi.raca, heroi.kit)))

function descricaoCurta (heroi: IHeroiSalvo) {
  const partes = [heroi.raca, heroi.kit].filter(Boolean)
  return partes.length ? partes.join(' · ') : 'Sem raça e kit'
}

async function carregar () {
  carregando.value = true
  busca.value = ''
  try {
    herois.value = await listarHerois()
  } catch {
    $q.notify({ type: 'negative', message: 'Não foi possível carregar os heróis salvos.' })
  } finally {
    carregando.value = false
  }
}
</script>

<style scoped lang="scss">
.dialogo {
  width: 520px;
  max-width: 92vw;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
}

.dialogo__titulo {
  font-family: var(--fonte-titulo);
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--cor-titulo);
}

.dialogo__lista {
  overflow-y: auto;
  flex: 1 1 auto;
}

.dialogo__ph {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--raio-1);
  background: var(--cor-superficie-2);
  font-family: var(--fonte-titulo);
  font-weight: 700;
  color: var(--cor-destaque);
}
</style>
