<template>
  <q-item
    v-if="externo"
    clickable
    tag="a"
    target="_blank"
    rel="noopener noreferrer"
    class="link-menu"
    :href="link"
  >
    <q-item-section avatar>
      <q-icon :name="icon" />
    </q-item-section>
    <q-item-section>
      <q-item-label class="link-menu__titulo">
        {{ title }}
      </q-item-label>
      <q-item-label caption>
        {{ caption }}
      </q-item-label>
    </q-item-section>
    <q-item-section side>
      <q-icon
        name="open_in_new"
        size="16px"
      />
    </q-item-section>
  </q-item>

  <q-item
    v-else
    clickable
    exact
    active-class="link-menu--ativo"
    class="link-menu"
    :to="link"
  >
    <q-item-section avatar>
      <q-icon :name="icon" />
    </q-item-section>
    <q-item-section>
      <q-item-label class="link-menu__titulo">
        {{ title }}
      </q-item-label>
      <q-item-label caption>
        {{ caption }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface EssentialLinkProps {
  title: string
  caption: string
  icon: string
  link: string
}

const props = defineProps<EssentialLinkProps>()

const externo = computed(() => props.link.startsWith('http'))
</script>

<style scoped lang="scss">
.link-menu {
  border-radius: var(--raio-2);
  margin: 2px var(--esp-2);
  color: var(--cor-texto);
}

.link-menu__titulo {
  font-weight: 700;
}

.link-menu--ativo {
  background: var(--cor-nota-fundo);
  color: var(--cor-link);
  box-shadow: inset 3px 0 0 var(--cor-destaque);
}
</style>
