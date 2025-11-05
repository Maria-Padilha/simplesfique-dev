<template>
  <v-expand-transition>
    <div v-if="formularioAberto">
      <v-card class="background-card" elevation="0">
        <v-card-title class="text-h6 pa-4">
          <v-icon :icon="editando ? 'mdi-pencil' : 'mdi-plus'" class="mr-2" size="23px"/>
          {{ editando ? 'Editar' : 'Cadastrar' }}
        </v-card-title>

        <v-card-text class="pa-4">
          <slot name="form" />
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn v-if="!editando" color="grey" variant="text" @click="cancelarFormulario" size="small">Cancelar</v-btn>

          <v-btn
              color="var(--text-color-laranja)"
              :loading="loading"
              @click="salvarFormulario"
              variant="flat" size="small"
              class="text-white">
            {{ editando ? 'Atualizar' : 'Salvar' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </v-expand-transition>
</template>

<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
  formularioAberto: {
    type: Boolean,
    required: true
  },
  editando: {
    type: Boolean,
    required: true
  },
  cancelarFormulario: {
    type: Function,
    required: true
  },
  loading: {
    type: Boolean,
    required: false,
    default: false
  },
  salvarFormulario: {
    type: Function,
    required: true
  }
});

const formularioAberto = computed(() => props.formularioAberto);
const editando = computed(() => props.editando);
const loading = computed(() => props.loading);

const cancelarFormulario = () => {
  props.cancelarFormulario();
}

const salvarFormulario = () => {
  props.salvarFormulario();
}
</script>