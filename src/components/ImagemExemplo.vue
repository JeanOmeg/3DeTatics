<template>
  <figure
    class="imagem-exemplo"
    :class="tipo ? `imagem-exemplo--${tipo}` : ''"
  >
    <q-img
      loading="lazy"
      spinner-color="primary"
      class="imagem-exemplo__img"
      :src="src"
      :alt="alt"
    />
    <figcaption
      v-if="legenda"
      class="imagem-exemplo__legenda"
    >
      <q-icon
        v-if="tipo"
        size="18px"
        :name="tipo === 'certo' ? 'check_circle' : 'cancel'"
      />
      {{ legenda }}
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  src: string
  alt: string
  legenda?: string
  tipo?: '' | 'certo' | 'errado'
}>(), {
  legenda: '',
  tipo: ''
})
</script>

<style scoped lang="scss">
.imagem-exemplo {
  margin: 0;
  border-radius: var(--raio-2);
  overflow: hidden;
  border: 2px solid var(--cor-borda);
  background: var(--cor-superficie-2);
}

.imagem-exemplo--certo {
  border-color: #4e7a3a;
}

.imagem-exemplo--errado {
  border-color: #b3261e;
}

.imagem-exemplo__legenda {
  display: flex;
  align-items: center;
  gap: var(--esp-1);
  padding: var(--esp-2) var(--esp-3);
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--cor-texto);
}

.imagem-exemplo--certo .imagem-exemplo__legenda .q-icon {
  color: #4e7a3a;
}

.imagem-exemplo--errado .imagem-exemplo__legenda .q-icon {
  color: #b3261e;
}

body.body--dark .imagem-exemplo--certo .imagem-exemplo__legenda .q-icon {
  color: #7fae63;
}

body.body--dark .imagem-exemplo--errado .imagem-exemplo__legenda .q-icon {
  color: #f08a6b;
}
</style>
