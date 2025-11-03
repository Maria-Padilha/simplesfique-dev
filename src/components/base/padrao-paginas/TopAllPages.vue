<template>
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

<script setup>
import {defineProps} from 'vue';

const props = defineProps({
  icon: {
    type: String,
    required: true
  }
});
</script>