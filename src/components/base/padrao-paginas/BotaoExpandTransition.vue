<template>
  <div class="w-100 flex justify-end">
    <v-btn
        color="var(--text-color-laranja)"
        @click="props.toggleFormulario"
        :prepend-icon="props.formularioAberto ? 'mdi-minus' : 'mdi-plus'"
        variant="flat" size="small"
        class="mb-3 ml-3 text-white">
      <slot />
    </v-btn>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  formularioAberto: { type: Boolean, default: false },
  toggleFormulario: { type: Function }
})
</script>