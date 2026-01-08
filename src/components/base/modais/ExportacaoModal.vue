<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="fechar"
    max-width="600px"
    persistent
  >
    <v-card class="background-card">
      <v-card-title class="text-h6 pa-4">
        <v-icon icon="mdi-printer" class="mr-2"></v-icon>
        Exportar/Imprimir Relatório
      </v-card-title>

      <v-card-text class="pa-4">
        <p class="text-body-2 mb-4">Escolha o formato para exportar ou imprimir o relatório com os filtros selecionados:</p>

        <v-row>
          <v-col cols="12" md="6">
            <v-card
              class="background-secondary pa-4 d-flex flex-column align-center justify-center cursor-pointer"
              style="min-height: 150px; transition: all 0.3s ease;"
              @click="exportar('pdf')"
              @mouseover="hoverCard = 'pdf'"
              @mouseleave="hoverCard = ''"
              :style="{ borderColor: hoverCard === 'pdf' ? 'var(--text-color-laranja)' : 'transparent', borderWidth: '2px' }"
            >
              <v-icon icon="mdi-file-pdf-box" size="48" color="error" class="mb-3"></v-icon>
              <h3 class="text-h6 text-center">PDF</h3>
              <p class="text-caption text-center mt-2">Formato portátil para impressão</p>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-card
              class="background-secondary pa-4 d-flex flex-column align-center justify-center cursor-pointer"
              style="min-height: 150px; transition: all 0.3s ease;"
              @click="exportar('csv')"
              @mouseover="hoverCard = 'csv'"
              @mouseleave="hoverCard = ''"
              :style="{ borderColor: hoverCard === 'csv' ? 'var(--text-color-laranja)' : 'transparent', borderWidth: '2px' }"
            >
              <v-icon icon="mdi-file-delimited" size="48" color="info" class="mb-3"></v-icon>
              <h3 class="text-h6 text-center">CSV</h3>
              <p class="text-caption text-center mt-2">Formato de texto delimitado</p>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-card
              class="background-secondary pa-4 d-flex flex-column align-center justify-center cursor-pointer"
              style="min-height: 150px; transition: all 0.3s ease;"
              @click="exportar('excel')"
              @mouseover="hoverCard = 'excel'"
              @mouseleave="hoverCard = ''"
              :style="{ borderColor: hoverCard === 'excel' ? 'var(--text-color-laranja)' : 'transparent', borderWidth: '2px' }"
            >
              <v-icon icon="mdi-microsoft-excel" size="48" color="success" class="mb-3"></v-icon>
              <h3 class="text-h6 text-center">EXCEL</h3>
              <p class="text-caption text-center mt-2">Formato do Microsoft Excel</p>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-card
              class="background-secondary pa-4 d-flex flex-column align-center justify-center cursor-pointer"
              style="min-height: 150px; transition: all 0.3s ease;"
              @click="exportar('impressao')"
              @mouseover="hoverCard = 'impressao'"
              @mouseleave="hoverCard = ''"
              :style="{ borderColor: hoverCard === 'impressao' ? 'var(--text-color-laranja)' : 'transparent', borderWidth: '2px' }"
            >
              <v-icon icon="mdi-printer" size="48" color="var(--text-color-laranja)" class="mb-3"></v-icon>
              <h3 class="text-h6 text-center">IMPRIMIR</h3>
              <p class="text-caption text-center mt-2">Abrir janela de impressão</p>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn color="grey" variant="text" @click="fechar" size="small">Cancelar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue'

// eslint-disable-next-line no-undef
const props = defineProps({
  modelValue: Boolean,
  dados: Array,
  filtros: Object,
  nomeRelatorio: String
})

// eslint-disable-next-line no-undef
const emit = defineEmits(['update:modelValue', 'exportar-pdf', 'exportar-csv', 'exportar-excel', 'imprimir'])

const hoverCard = ref('')

const fechar = () => {
  emit('update:modelValue', false)
}

const exportar = (tipo) => {
  switch (tipo) {
    case 'pdf':
      emit('exportar-pdf', { dados: props.dados, filtros: props.filtros, nomeRelatorio: props.nomeRelatorio })
      break
    case 'csv':
      emit('exportar-csv', { dados: props.dados, filtros: props.filtros, nomeRelatorio: props.nomeRelatorio })
      break
    case 'excel':
      emit('exportar-excel', { dados: props.dados, filtros: props.filtros, nomeRelatorio: props.nomeRelatorio })
      break
    case 'impressao':
      emit('imprimir', { dados: props.dados, filtros: props.filtros, nomeRelatorio: props.nomeRelatorio })
      break
  }
  fechar()
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.background-secondary {
  background-color: var(--bg-color-secondary);
  color: var(--text-color);
  transition: all 0.3s ease;
}

.background-secondary:hover {
  box-shadow: 0 4px 12px rgba(245, 124, 0, 0.15);
}

.background-card {
  background-color: var(--bg-card);
  color: var(--text-color);
}
</style>

