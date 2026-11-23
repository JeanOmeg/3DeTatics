<template>
  <article class="item-regra">
    <header class="item-regra__cabecalho">
      <h3 class="item-regra__nome">
        {{ nome }}
      </h3>
      <span
        v-if="custo"
        class="item-regra__custo"
      >{{ custo }}</span>
    </header>

    <dl
      v-if="etiquetas.length"
      class="item-regra__etiquetas"
    >
      <div
        v-for="etiqueta in etiquetas"
        :key="etiqueta.rotulo"
        class="item-regra__etiqueta"
      >
        <dt>{{ etiqueta.rotulo }}</dt>
        <dd>{{ etiqueta.valor }}</dd>
      </div>
    </dl>

    <div class="item-regra__descricao">
      <slot />
    </div>
  </article>
</template>

<script setup lang="ts">
export interface IEtiquetaRegra {
  rotulo: string
  valor: string
}

withDefaults(defineProps<{
  nome: string
  custo?: string
  etiquetas?: IEtiquetaRegra[]
}>(), {
  custo: '',
  etiquetas: () => []
})
</script>

<style scoped lang="scss">
.item-regra {
  background: var(--cor-superficie);
  border: 1px solid var(--cor-borda);
  border-radius: var(--raio-2);
  padding: var(--esp-4);
  box-shadow: var(--sombra-1);
}

.item-regra__cabecalho {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--esp-2);
  margin-bottom: var(--esp-2);
}

.item-regra__nome {
  font-size: 1.1rem;
  font-weight: 700;
}

.item-regra__custo {
  font-size: 0.85rem;
  font-weight: 800;
  color: var(--cor-destaque);
  background: var(--cor-importante-fundo);
  border-radius: 999px;
  padding: 2px var(--esp-3);
}

.item-regra__etiquetas {
  display: flex;
  flex-wrap: wrap;
  gap: var(--esp-2);
  margin: 0 0 var(--esp-3);
}

.item-regra__etiqueta {
  display: flex;
  gap: var(--esp-1);
  font-size: 0.8rem;
  background: var(--cor-superficie-2);
  border-radius: var(--raio-1);
  padding: 2px var(--esp-2);

  dt {
    font-weight: 800;
    color: var(--cor-titulo);
  }

  dt::after {
    content: ':';
  }

  dd {
    margin: 0;
    color: var(--cor-texto);
  }
}

.item-regra__descricao {
  color: var(--cor-texto);

  :deep(p:last-child),
  :deep(ul:last-child) {
    margin-bottom: 0;
  }
}
</style>
