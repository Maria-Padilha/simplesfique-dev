<template>
  <v-dialog v-model="cadastrar" :max-width="props.width || 400">
    <v-card color="var(--bg-card)" class="texto-color-primary" min-height="auto">
      <v-card-title class="pa-0">
        <div class="background-laranja d-flex align-center justify-between py-0 pl-2">
          <p class="text-lg text-capitalize">
            {{ props.tituloAcao || 'Cadastrar' }} <slot name="titulo" />
          </p>

          <v-btn icon="mdi-close" variant="text" @click="onClose" />
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
            @click="onClose"
        >
          Cancelar
        </v-btn>

        <v-btn
            color="var(--text-color-laranja)"
            class="text-none text-white"
            variant="flat"
            density="comfortable"
            :prepend-icon="props.iconeBotao || 'mdi-plus-circle-outline'"
            :loading="loading"
            @click="cadastrarcidade"
        >
          {{ props.textoBotao || 'Cadastrar' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { defineProps, computed, defineEmits } from "vue";

const emit = defineEmits(["update:cadastrarModal"]);

const props = defineProps({
  cadastrarModal: Boolean,
  clearInput: Function,
  cadastrarcidade: Function,
  width: Number,
  loading: Boolean,

  // NOVO (opcional)
  tituloAcao: String,   // "Cadastrar" | "Editar"
  textoBotao: String,   // "Cadastrar" | "Salvar alterações"
  iconeBotao: String,   // mdi-plus... | mdi-content-save-outline
});

const cadastrar = computed({
  get: () => props.cadastrarModal,
  set: (val) => emit("update:cadastrarModal", val),
});

function onClose() {
  props.clearInput?.();
  cadastrar.value = false;
}
</script>