<template>
  <div
    class="estado-vazio"
    role="status"
  >
    <q-icon
      size="48px"
      class="estado-vazio__icone"
      :name="icone"
    />
    <div class="estado-vazio__titulo">
      {{ titulo }}
    </div>
    <p
      v-if="texto"
      class="estado-vazio__texto"
    >
      {{ texto }}
    </p>
    <div
      v-if="$slots.default"
      class="estado-vazio__acoes"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  titulo: string
  texto?: string
  icone?: string
}>(), {
  texto: '',
  icone: 'inbox'
})
</script>

<style scoped lang="scss">
.estado-vazio {
  text-align: center;
  padding: var(--esp-7) var(--esp-4);
  border: 2px dashed var(--cor-borda);
  border-radius: var(--raio-3);
  background: var(--cor-superficie);
}

.estado-vazio__icone {
  color: var(--cor-ouro);
  margin-bottom: var(--esp-3);
}

.estado-vazio__titulo {
  font-family: var(--fonte-titulo);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--cor-titulo);
}

.estado-vazio__texto {
  margin: var(--esp-2) auto 0;
  max-width: 48ch;
  color: var(--cor-texto-suave);
}

.estado-vazio__acoes {
  margin-top: var(--esp-4);
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--esp-3);
}
</style>
