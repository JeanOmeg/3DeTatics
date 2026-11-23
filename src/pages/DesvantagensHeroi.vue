<template>
  <q-page class="pagina">
    <CabecalhoPagina
      sobretitulo="Construção de heróis"
      titulo="Desvantagens"
      descricao="Fraquezas que dão pontos extras para gastar na ficha."
    />

    <CaixaDestaque
      tipo="importante"
      titulo="Limites"
    >
      <p>Um herói recém-criado pode ter no máximo 3 Desvantagens e no máximo –6 pontos em Desvantagens, sem contar as que vêm da raça. As Desvantagens raciais aparecem junto de cada raça, na página de Vantagens.</p>
    </CaixaDestaque>

    <div class="barra-filtros">
      <div class="texto-suave">
        {{ desvantagensFiltradas.length }} de {{ lista_desvantagens.length }} desvantagens
      </div>
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

    <div
      v-if="desvantagensFiltradas.length"
      class="pilha"
    >
      <ItemRegra
        v-for="item in desvantagensFiltradas"
        :key="item.value"
        :nome="item.nome"
        :custo="item.custo"
      >
        <p>{{ item.descricao }}</p>
      </ItemRegra>
    </div>

    <EstadoVazio
      v-else
      icone="search_off"
      titulo="Nada encontrado"
      :texto="`Nenhuma desvantagem corresponde a “${busca}”.`"
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
import { correspondeBusca } from 'src/libs/busca-lib'

const busca = ref('')

const lista_desvantagens = VantagensEDesvantagensLib.listarVantagensEDesvantagens().filter(item => item.tipo === TipoVantagemEnum.desvantagem)

const desvantagensFiltradas = computed(() => lista_desvantagens.filter(item => correspondeBusca(busca.value, item.nome, item.descricao)))
</script>
