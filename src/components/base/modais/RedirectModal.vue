<template>
  <v-dialog v-model="modalRedirect" max-width="450">
    <v-card class="background-secondary" elevation="0">
      <v-card-title class="px-4 mt-5">
        <div class="w-100 flex flex-col items-center justify-center">
          <v-icon icon="mdi-refresh" color="var(--text-color-laranja)" size="70px" class="opacity-60 mb-2" />
          <p class="text-xl font-semibold texto-color-primary">Redirecionar <slot name="item" />?</p>
        </div>
      </v-card-title>

      <v-card-text><slot /></v-card-text>

      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn color="grey" variant="text" @click="cancelar" size="small">Cancelar</v-btn>

        <v-btn
            color="var(--text-color-laranja)"
            :loading="loadingRedirect"
            @click="redirect"
            variant="flat" size="small"
            class="text-white">
          Continuar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
  modalRedirect: {
    type: Boolean,
    required: true
  },
  loadingRedirect: {
    type: Boolean,
    required: true
  },
  redirect: {
    type: Function,
    required: true
  },
  cancelar: {
    type: Function,
    required: true
  }
});

const loadingRedirect = computed(() => props.loadingRedirect);
const modalRedirect = computed(() => props.modalRedirect);

const redirect = () => {
  props.redirect();
}

const cancelar = () => {
  props.cancelar();
}
</script>