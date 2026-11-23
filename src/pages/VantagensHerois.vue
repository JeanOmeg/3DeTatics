<template>
  <q-page class="pagina">
    <CabecalhoPagina
      sobretitulo="Construção de heróis"
      titulo="Vantagens, raças e kits"
      descricao="Tudo o que você pode comprar com os pontos do herói. Use a busca para encontrar um item pelo nome ou pelo efeito."
    />

    <div class="barra-filtros">
      <q-tabs
        v-model="aba"
        dense
        no-caps
        inline-label
        align="left"
        active-color="primary"
        indicator-color="accent"
        class="barra-filtros__abas"
      >
        <q-tab
          name="vantagens"
          icon="add_circle"
          :label="`Vantagens (${lista_vantagens.length})`"
        />
        <q-tab
          name="racas"
          icon="diversity_3"
          :label="`Raças (${lista_racas.length})`"
        />
        <q-tab
          name="kits"
          icon="shield"
          :label="`Kits (${lista_kits.length})`"
        />
      </q-tabs>

      <q-input
        v-model="busca"
        dense
        outlined
        clearable
        placeholder="Buscar..."
        class="barra-filtros__busca"
      >
        <template #prepend>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>

    <q-tab-panels
      v-model="aba"
      animated
      class="paineis"
    >
      <q-tab-panel
        name="vantagens"
        class="q-pa-none"
      >
        <div class="pilha">
          <ItemRegra
            v-for="item in vantagensFiltradas"
            :key="item.value"
            :nome="item.nome"
            :custo="item.custo"
          >
            <p>{{ item.descricao }}</p>
          </ItemRegra>
        </div>
      </q-tab-panel>

      <q-tab-panel
        name="racas"
        class="q-pa-none"
      >
        <CaixaDestaque tipo="nota">
          <p>Cada herói pode ter apenas uma raça. O custo da raça entra na pontuação do herói, e bônus raciais nunca levam uma Característica acima de 5.</p>
        </CaixaDestaque>
        <div class="pilha">
          <ItemRegra
            v-for="raca in racasFiltradas"
            :key="raca.value"
            :nome="raca.nome"
            :custo="formatarCusto(raca.custo)"
          >
            <ul class="lista-efeitos">
              <li v-if="raca.vantagens.length">
                <span class="termo">Vantagens:</span> {{ raca.vantagens.join('; ') }}.
              </li>
              <li v-if="raca.desvantagens.length">
                <span class="termo">Desvantagens:</span> {{ raca.desvantagens.join('; ') }}.
              </li>
            </ul>
          </ItemRegra>
        </div>
      </q-tab-panel>

      <q-tab-panel
        name="kits"
        class="q-pa-none"
      >
        <CaixaDestaque tipo="nota">
          <p>Kits são arquétipos que ajudam a transformar qualquer miniatura em um herói. Cada herói pode ter no máximo um kit, e dois heróis da mesma faixa de pontos não podem usar o mesmo kit. As Vantagens do kit são gratuitas, as Desvantagens do kit não dão pontos, e o kit define o multiplicador de PV e PM do herói (sem kit, PV e PM são R x 5).</p>
        </CaixaDestaque>
        <div class="pilha">
          <ItemRegra
            v-for="kit in kitsFiltrados"
            :key="kit.value"
            :nome="kit.nome"
            :custo="formatarCusto(kit.custo)"
            :etiquetas="[
              { rotulo: 'PV', valor: kit.pv },
              { rotulo: 'PM', valor: kit.pm },
              { rotulo: 'Restrições', valor: kit.restricoes }
            ]"
          >
            <ul class="lista-efeitos">
              <li v-if="kit.vantagens.length">
                <span class="termo">Vantagens:</span> {{ kit.vantagens.join('; ') }}.
              </li>
              <li v-if="kit.desvantagens.length">
                <span class="termo">Desvantagens:</span> {{ kit.desvantagens.join('; ') }}.
              </li>
            </ul>
          </ItemRegra>
        </div>
      </q-tab-panel>
    </q-tab-panels>

    <EstadoVazio
      v-if="semResultados"
      icone="search_off"
      titulo="Nada encontrado"
      :texto="`Nenhum item corresponde a “${busca}”.`"
    >
      <q-btn
        flat
        no-caps
        color="primary"
        label="Limpar busca"
        @click="busca = ''"
      />
    </EstadoVazio>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import CabecalhoPagina from 'components/CabecalhoPagina.vue'
import CaixaDestaque from 'components/CaixaDestaque.vue'
import EstadoVazio from 'components/EstadoVazio.vue'
import ItemRegra from 'components/ItemRegra.vue'
import { TipoVantagemEnum } from 'src/enums/tipo-vantagem-enum'
import { VantagensEDesvantagensLib } from 'src/libs/vantagens-lib'
import { RacasLib } from 'src/libs/racas-lib'
import { KitsLib } from 'src/libs/kits-lib'
import { correspondeBusca } from 'src/libs/busca-lib'

type TAba = 'vantagens' | 'racas' | 'kits'

const aba = ref<TAba>('vantagens')
const busca = ref('')

const lista_vantagens = VantagensEDesvantagensLib.listarVantagensEDesvantagens().filter(item => item.tipo === TipoVantagemEnum.vantagem)
const lista_racas = RacasLib.listarRacas()
const lista_kits = KitsLib.listarKits()

const vantagensFiltradas = computed(() => lista_vantagens.filter(item => correspondeBusca(busca.value, item.nome, item.descricao)))
const racasFiltradas = computed(() => lista_racas.filter(raca => correspondeBusca(busca.value, raca.nome, ...raca.vantagens, ...raca.desvantagens)))
const kitsFiltrados = computed(() => lista_kits.filter(kit => correspondeBusca(busca.value, kit.nome, kit.restricoes, ...kit.vantagens, ...kit.desvantagens)))

const semResultados = computed(() => {
  const quantidades: Record<TAba, number> = {
    vantagens: vantagensFiltradas.value.length,
    racas: racasFiltradas.value.length,
    kits: kitsFiltrados.value.length
  }
  return quantidades[aba.value] === 0
})

function formatarCusto (custo: number) {
  const plural = Math.abs(custo) === 1 ? 'ponto' : 'pontos'
  return `${custo} ${plural}`
}
</script>

<style scoped lang="scss">
.paineis {
  background: transparent;
}

.lista-efeitos {
  margin: 0;
  padding-left: var(--esp-5);

  li {
    margin-bottom: var(--esp-1);
  }
}
</style>
