<template>
  <q-item
    clickable
    :to="!isExternal ? link : undefined"
    @click="handleClick"
    active-class="q-item--active"
  >
    <q-item-section avatar>
      <q-icon :name="icon" />
    </q-item-section>
    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>{{ caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

export interface EssentialLinkProps {
  title: string
  caption: string
  icon: string
  link: string
}

const $router = useRouter()
const props = defineProps<EssentialLinkProps>()

const isExternal = props.link.startsWith('http')

async function handleClick() {
  if (isExternal) {
    window.open(props.link, '_blank')
  } else {
    await $router.push(props.link)
  }
}
</script>
