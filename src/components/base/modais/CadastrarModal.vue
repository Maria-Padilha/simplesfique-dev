<template>
  <v-dialog v-model="cadastrar" max-width="400">
    <v-card color="var(--bg-card)" class="texto-color-primary">
      <v-card-title class="pa-0">
        <div class="background-laranja d-flex align-center justify-between py-0 pl-2">
          <p class="text-lg text-capitalize">Cadastrar <slot name="titulo" /></p>
          <v-btn icon="mdi-close" variant="text" @click="clearInput" />
        </div>
      </v-card-title>

      <v-card-text class="pa-0">
        <v-form class="d-flex flex-column gap-3">
          <slot name="textfields" />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-btn
            color="var(--text-color-laranja)"
            class="text-none"
            variant="tonal"
            density="comfortable"
            prepend-icon="mdi-cancel"
            @click="clearInput"
        >
          Cancelar
        </v-btn>

        <v-btn
            color="var(--text-color-laranja)"
            class="text-none text-white"
            variant="flat"
            density="comfortable"
            prepend-icon="mdi-plus-circle-outline"
            @click="cadastrarcidade"
        >
          Cadastrar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { defineProps, computed } from "vue";

const props = defineProps({
  cadastrarModal: Boolean,
  clearInput: Function,
  cadastrarcidade: Function,
});

const cadastrar = computed(() => props.cadastrarModal);
</script>