<template>
  <main class="my-10 mx-3">
    <v-card elevation="0" class="background-secondary mb-4">
      <v-card-title class="text-h5 pa-4 d-flex justify-space-between align-center w-100">
        <div class="d-flex align-center w-100">
          <v-icon :icon="props.icon" class="mr-3"></v-icon>
          <div class="w-100">
            <slot name="titulo" />
          </div>
        </div>
        <div class="d-flex gap-2">
          <slot name="acoes" />
        </div>
      </v-card-title>
    </v-card>

    <slot name="section"></slot>
    <slot></slot>
  </main>
</template>

<script setup>
import {defineProps} from 'vue';

const props = defineProps({
  icon: {
    type: String,
    required: true
  }
});
</script>

<style scoped>
.v-virtual-scroll::-webkit-scrollbar {
  width: 10px;
}

/* Fundo da barra de rolagem */
.v-virtual-scroll::-webkit-scrollbar-track {
  background: var(--color-scroll-track);
  border-radius: 5px;
}

/* Cor da parte que "rola" */
.v-virtual-scroll::-webkit-scrollbar-thumb {
  background: var(--color-scroll);
  border-radius: 5px;
}

/* Quando passa o mouse por cima do scroll */
.v-virtual-scroll::-webkit-scrollbar-thumb:hover {
  background: var(--color-scroll-hover);
}
</style>