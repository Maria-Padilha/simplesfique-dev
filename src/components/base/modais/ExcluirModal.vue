<template>
  <v-dialog v-model="modalExcluir" max-width="400">
    <v-card class="background-secondary" elevation="0">
      <v-card-title class="px-4 mt-5">
        <div class="w-100 flex flex-col items-center justify-center">
          <v-icon icon="mdi-close-circle-outline" color="red" size="70px" class="opacity-70 mb-2" />
          <p class="text-xl font-semibold texto-color-primary">Excluir <slot name="item" />?</p>
        </div>
      </v-card-title>

      <v-card-text class="px-4">
        Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn color="grey" variant="text" @click="cancelar" size="small">Cancelar</v-btn>

        <v-btn
            color="error"
            :loading="loading"
            @click="deletar"
            variant="flat" size="small"
            class="text-white">
          Excluir
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
  modalExcluir: {
    type: Boolean,
    required: true
  },
  loading: {
    type: Boolean,
    required: true
  },
  deletar: {
    type: Function,
    required: true
  },
  cancelar: {
    type: Function,
    required: true
  }
});

const loading = computed(() => props.loading);
const modalExcluir = computed(() => props.modalExcluir);

const cancelar = () => {
  props.cancelar();
}

const deletar = () => {
  props.deletar();
};
</script>