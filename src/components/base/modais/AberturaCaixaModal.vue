<template>
  <v-dialog v-model="dialogLocal" max-width="500" persistent>
    <v-card class="modal-abertura-caixa">
      <v-card-title class="text-h5 pa-6">
        <div class="d-flex align-center justify-space-between">
          <span>Controle de abertura</span>
        </div>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-6">
        <div class="mb-4">
          <label class="text-body-2 font-weight-bold mb-2 d-block">
            Abertura de caixa
          </label>
          <v-text-field
            v-model="valorAbertura"
            variant="outlined"
            density="comfortable"
            type="number"
            step="0.01"
            placeholder="0,00"
            prefix="R$"
            hide-details
          ></v-text-field>
        </div>

        <div>
          <label class="text-body-2 font-weight-bold mb-2 d-block">
            Nota inicial
          </label>
          <v-textarea
            v-model="notaInicial"
            variant="outlined"
            density="comfortable"
            placeholder="Adicionar nota de abertura..."
            rows="3"
            hide-details
          ></v-textarea>
        </div>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-4">
        <v-btn
          variant="text"
          @click="cancelar"
          class="text-none"
        >
          Cancelar
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          variant="flat"
          color="var(--text-color-laranja)"
          @click="confirmarAbertura"
          class="text-none px-6"
        >
          Abrir caixa registradora
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';

// eslint-disable-next-line no-undef
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
});

// eslint-disable-next-line no-undef
const emit = defineEmits(['update:modelValue', 'confirmar']);

const dialogLocal = ref(props.modelValue);
const valorAbertura = ref('0.00');
const notaInicial = ref('');

watch(() => props.modelValue, (newVal) => {
  dialogLocal.value = newVal;
});

watch(dialogLocal, (newVal) => {
  emit('update:modelValue', newVal);
});

const cancelar = () => {
  dialogLocal.value = false;
  valorAbertura.value = '0.00';
  notaInicial.value = '';
};

const confirmarAbertura = () => {
  emit('confirmar', {
    valor: parseFloat(valorAbertura.value),
    nota: notaInicial.value
  });
  dialogLocal.value = false;
};
</script>

<style scoped>
.modal-abertura-caixa {
  background-color: var(--bg-color-secondary);
  color: var(--text-color);
}

:deep(.v-field) {
  background-color: var(--bg-color);
  color: var(--text-color);
}

:deep(.v-field__input) {
  color: var(--text-color);
}

:deep(.v-field__outline) {
  color: var(--text-color);
  opacity: 0.3;
}
</style>

