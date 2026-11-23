<template>
  <nav
    class="indice-secoes"
    aria-label="Índice da página"
  >
    <div class="indice-secoes__titulo">
      Nesta página
    </div>
    <ul class="indice-secoes__lista">
      <li
        v-for="item in itens"
        :key="item.ancora"
      >
        <button
          type="button"
          class="indice-secoes__link"
          @click="irPara(item.ancora)"
        >
          {{ item.titulo }}
        </button>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
export interface IItemIndice {
  ancora: string
  titulo: string
}

defineProps<{
  itens: IItemIndice[]
}>()

// O roteador usa modo hash, então âncoras via "#id" não funcionam: rolamos manualmente.
function irPara (ancora: string) {
  document.getElementById(ancora)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<style scoped lang="scss">
.indice-secoes {
  background: var(--cor-superficie);
  border: 1px solid var(--cor-borda);
  border-radius: var(--raio-3);
  padding: var(--esp-4) var(--esp-5);
  margin-bottom: var(--esp-5);
}

.indice-secoes__titulo {
  font-size: 0.8rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--cor-texto-suave);
  margin-bottom: var(--esp-2);
}

.indice-secoes__lista {
  margin: 0;
  padding-left: 0;
  list-style: none;
  columns: 2 200px;
  column-gap: var(--esp-6);
}

.indice-secoes__link {
  background: none;
  border: 0;
  padding: 2px 0;
  font: inherit;
  font-weight: 700;
  color: var(--cor-link);
  cursor: pointer;
  text-align: left;

  &:hover {
    text-decoration: underline;
  }
}
</style>
