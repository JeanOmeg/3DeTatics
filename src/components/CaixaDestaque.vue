<template>
  <aside
    class="caixa-destaque"
    :class="`caixa-destaque--${tipo}`"
  >
    <q-icon
      size="20px"
      class="caixa-destaque__icone"
      :name="icones[tipo]"
    />
    <div class="caixa-destaque__conteudo">
      <div
        v-if="titulo"
        class="caixa-destaque__titulo"
      >
        {{ titulo }}
      </div>
      <slot />
    </div>
  </aside>
</template>

<script setup lang="ts">
type TTipoDestaque = 'nota' | 'exemplo' | 'importante'

withDefaults(defineProps<{
  tipo?: TTipoDestaque
  titulo?: string
}>(), {
  tipo: 'nota',
  titulo: ''
})

const icones: Record<TTipoDestaque, string> = {
  nota: 'info',
  exemplo: 'lightbulb',
  importante: 'priority_high'
}
</script>

<style scoped lang="scss">
.caixa-destaque {
  display: flex;
  gap: var(--esp-3);
  padding: var(--esp-3) var(--esp-4);
  margin: var(--esp-3) 0 var(--esp-4);
  border-radius: var(--raio-2);
  border-left: 4px solid;
}

.caixa-destaque :deep(p:last-child) {
  margin-bottom: 0;
}

.caixa-destaque__icone {
  margin-top: 3px;
}

.caixa-destaque__titulo {
  font-weight: 800;
  margin-bottom: var(--esp-1);
}

.caixa-destaque--nota {
  background: var(--cor-nota-fundo);
  border-color: var(--cor-nota-borda);

  .caixa-destaque__icone {
    color: var(--cor-nota-borda);
  }
}

.caixa-destaque--exemplo {
  background: var(--cor-exemplo-fundo);
  border-color: var(--cor-exemplo-borda);

  .caixa-destaque__icone {
    color: var(--cor-exemplo-borda);
  }
}

.caixa-destaque--importante {
  background: var(--cor-importante-fundo);
  border-color: var(--cor-importante-borda);

  .caixa-destaque__icone {
    color: var(--cor-importante-borda);
  }
}
</style>
