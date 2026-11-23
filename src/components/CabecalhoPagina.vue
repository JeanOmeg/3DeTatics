<template>
  <header class="cabecalho-pagina">
    <div
      v-if="sobretitulo"
      class="cabecalho-pagina__sobretitulo"
    >
      {{ sobretitulo }}
    </div>
    <h1 class="titulo-pagina">
      {{ titulo }}
    </h1>
    <p
      v-if="descricao"
      class="cabecalho-pagina__descricao"
    >
      {{ descricao }}
    </p>
    <div
      class="cabecalho-pagina__linha"
      aria-hidden="true"
    />
    <div
      v-if="$slots.default"
      class="cabecalho-pagina__extra"
    >
      <slot />
    </div>
  </header>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  titulo: string
  sobretitulo?: string
  descricao?: string
}>(), {
  sobretitulo: '',
  descricao: ''
})
</script>

<style scoped lang="scss">
.cabecalho-pagina {
  margin-bottom: var(--esp-5);
}

.cabecalho-pagina__sobretitulo {
  font-size: 0.8rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--cor-destaque);
  margin-bottom: var(--esp-1);
}

.cabecalho-pagina__descricao {
  margin: var(--esp-2) 0 0;
  max-width: 68ch;
  font-size: 1.05rem;
  color: var(--cor-texto-suave);
}

.cabecalho-pagina__extra {
  margin-top: var(--esp-4);
}

.cabecalho-pagina__linha {
  width: 72px;
  height: 3px;
  margin-top: var(--esp-4);
  border-radius: 2px;
  background: linear-gradient(90deg, var(--cor-destaque), var(--cor-ouro));
}
</style>
