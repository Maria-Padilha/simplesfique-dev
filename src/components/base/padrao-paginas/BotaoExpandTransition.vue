<template>
  <div class="w-100 flex justify-end">
    <v-btn
      color="var(--text-color-laranja)"
      @click="$emit('toggle')"
      :prepend-icon="formularioAberto ? 'mdi-minus' : 'mdi-plus'"
      variant="flat" 
      :size="size"
      class="mb-3 ml-3 text-white"
    >
      <slot>
        {{ formularioAberto ? textoFechar : textoAbrir }}
      </slot>
    </v-btn>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  formularioAberto: { 
    type: Boolean, 
    default: false 
  },
  size: { 
    type: String, 
    default: 'default' 
  },
  textoAbrir: { 
    type: String, 
    default: 'Novo' 
  },
  textoFechar: { 
    type: String, 
    default: 'Cancelar' 
  }
})

defineEmits(['toggle'])
</script>