<template>
  <q-page>
    <div
      class="row col-12 justify-center"
      :style="{
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        height: '100vh',
        maxWidth: '100vw',
      }"
    />
  </q-page>
</template>

<script setup lang="ts">
import bg from 'src/assets/3detatics.png'
</script>

<style scoped></style>
