<template>
  <q-page class="q-pa-md">
    <q-card
      flat
      bordered
      class="q-mb-lg"
    >
      <q-card-section>
        <div class="text-h4 text-center text-primary q-pb-md">
          <b>DESVANTAGENS</b>
        </div>
        <q-separator />
      </q-card-section>

      <q-card-section class="q-pa-none">
        <div class="text-h5 text-center text-negative">
          <b>Vantagens</b>
        </div>
      </q-card-section>

      <q-card-section>
        <p
          v-for="(item, index) in lista_desvantagens"
          :key="index"
          class="text-body1"
        >
          <span class="text-primary"><b>{{ `${item.nome} - ${item.custo}: ` }}</b></span>{{ `${item.descricao}` }}<br>
        </p>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { TipoVantagemEnum } from 'src/enums/tipo-vantagem-enum'
import { VantagensEDesvantagensLib } from 'src/libs/vantagens-lib'
import { ref } from 'vue'

const lista_desvantagens = ref(VantagensEDesvantagensLib.listarVantagensEDesvantagens().filter(item => item.tipo == TipoVantagemEnum.desvantagem))
</script>

<style scoped>
.q-page {
  max-width: 1000px; /* Limita a largura para melhor leitura */
  margin: 0 auto; /* Centraliza a página de regras */
}
</style>
