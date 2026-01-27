<template>
  <v-dialog
    v-model="modal"
    persistent
    max-width="400"
  >
    <v-card :color="themeStore.darkMode ? '#1e1e1e' : 'white'" class="background-secondary">
      <v-card-title class="text-h5 pa-4 d-flex justify-center align-center">
        <v-icon icon="mdi-lock-outline" size="30px" class="mr-3 text-orange-600"></v-icon>
        <span>Acesso Negado</span>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-6 text-center">
        <p class="text-base mb-4">
          Você não possui permissão para acessar este recurso.
        </p>

        <v-alert
          type="warning"
          variant="tonal"
          class="mb-4 background-card"
          density="compact"
        >
          <p class="text-sm mb-0">
            <strong>Programa:</strong> {{ nomePrograma }}
          </p>
          <p class="text-sm mb-0">
            <strong>Tipo:</strong> {{ tipoAcesso }}
          </p>
        </v-alert>

        <p class="text-sm opacity-75">
          Entre em contato com seu administrador para solicitar acesso.
        </p>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-4 justify-center">
        <v-btn
          color="var(--text-color-laranja)"
          variant="flat"
          @click="fecharModal"
          class="text-white"
        >
          Entendido
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useThemeStore } from '@/stores/config-temas/theme'

const themeStore = useThemeStore()

/* eslint-disable no-undef */
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  nomePrograma: {
    type: String,
    default: 'Recurso'
  },
  tipoAcesso: {
    type: String,
    default: 'visualizar'
  }
})

const emit = defineEmits(['update:modelValue'])
/* eslint-enable no-undef */

const modal = ref(false)

watch(() => props.modelValue, (newVal) => {
  modal.value = newVal
})

watch(modal, (newVal) => {
  emit('update:modelValue', newVal)
})

const fecharModal = () => {
  modal.value = false
}
</script>

<style scoped>
.text-orange-600 {
  color: var(--text-color-laranja);
}
</style>

