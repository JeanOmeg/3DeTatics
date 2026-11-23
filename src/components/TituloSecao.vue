<template>
  <component
    :is="nivel === 2 ? 'h2' : 'h3'"
    :id="ancora || undefined"
    :class="nivel === 2 ? 'titulo-secao titulo-secao--2' : 'titulo-subsecao titulo-secao--3'"
  >
    <span
      v-if="numero"
      class="titulo-secao__numero"
    >{{ numero }}</span>
    {{ titulo }}
  </component>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  titulo: string
  nivel?: 2 | 3
  ancora?: string
  numero?: string
}>(), {
  nivel: 2,
  ancora: '',
  numero: ''
})
</script>

<style scoped lang="scss">
.titulo-secao--2 {
  display: flex;
  align-items: baseline;
  gap: var(--esp-3);
  margin: 0 0 var(--esp-4);
  padding-bottom: var(--esp-2);
  border-bottom: 1px solid var(--cor-borda);
  scroll-margin-top: 80px;
}

.titulo-secao--3 {
  margin: var(--esp-5) 0 var(--esp-2);
  scroll-margin-top: 80px;
}

.titulo-secao__numero {
  font-size: 0.9em;
  color: var(--cor-destaque);
}
</style>
