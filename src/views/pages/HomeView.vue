<template>
  <main class="my-12 mx-10">
    <h1 class="text-2xl mb-5">Modais já disponíveis</h1>

    <v-btn @click="modal = !modal" variant="tonal" color="var(--text-color-laranja)">Modal País</v-btn>
  </main>
</template>

<script setup>
import { ref } from 'vue';

const modal = ref(false);
</script>