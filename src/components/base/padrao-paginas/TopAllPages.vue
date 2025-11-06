<template>
  <v-virtual-scroll height="90vh" :items="['main']">
    <template v-slot:default>
      <main class="my-10 mx-3">
        <v-card elevation="0" class="background-secondary mb-4">
          <v-card-title class="text-h5 pa-4 d-flex justify-space-between align-center">
            <div class="d-flex align-center">
              <v-icon :icon="props.icon" class="mr-3"></v-icon>
              <slot name="titulo" />
            </div>
          </v-card-title>
        </v-card>

        <slot name="section"></slot>
      </main>
    </template>
  </v-virtual-scroll>
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