<template>
  <div class="pa-4">
    <v-card class="background-secondary my-4" elevation="1">
      <v-card-title class="text-h5 pa-4 d-flex justify-space-between align-center">
        <div class="d-flex align-center">
          <v-icon icon="mdi-cash-register-outline" class="mr-3"></v-icon>
          Relatório de Caixa
        </div>
      </v-card-title>
    </v-card>

    <v-card elevation="0" class="background-secondary mb-4">
      <v-card-text class="pa-4">
        <v-row class="mb-4">
          <v-col cols="12" md="3">
            <v-text-field
              v-model="filtros.dataInicio"
              type="date"
              label="Data Início"
              variant="outlined"
              density="compact"
              :theme="themeStore.darkMode ? 'dark' : 'light'"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="3">
            <v-text-field
              v-model="filtros.dataFim"
              type="date"
              label="Data Fim"
              variant="outlined"
              density="compact"
              :theme="themeStore.darkMode ? 'dark' : 'light'"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="3">
            <v-select
              v-model="filtros.caixa"
              label="Caixa"
              variant="outlined"
              density="compact"
              :theme="themeStore.darkMode ? 'dark' : 'light'"
            ></v-select>
          </v-col>

          <v-col cols="12" md="3" class="d-flex align-end gap-2">
            <v-btn
              color="var(--text-color-laranja)"
              variant="flat"
              class="text-white"
              prepend-icon="mdi-magnify"
              block
              @click="filtrarRelatorio"
            >
              Filtrar
            </v-btn>
            <v-btn
              color="primary"
              variant="outlined"
              prepend-icon="mdi-download"
              @click="exportarRelatorio"
            >
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-card elevation="0" class="background-secondary">
      <v-card-text class="pa-4">
        <v-data-table
          :headers="headers"
          :items="dadosRelatorio"
          :loading="loading"
          item-key="id"
          class="background-secondary"
        >
          <template v-slot:[`item.tipo`]="{ item }">
            <v-chip
              :color="item.tipo === 'entrada' ? 'success' : 'error'"
              text-color="white"
              label
            >
              {{ item.tipo === 'entrada' ? 'Entrada' : 'Saída' }}
            </v-chip>
          </template>

          <template v-slot:[`item.valor`]="{ item }">
            <span :style="{ color: item.tipo === 'entrada' ? 'var(--text-color)' : '#d32f2f' }">
              R$ {{ item.valor.toFixed(2) }}
            </span>
          </template>

          <template v-slot:bottom>
            <div class="d-flex justify-space-between align-center pa-4 border-t">
              <span class="text-subtitle-2">
                <strong>Total de Movimentações:</strong> {{ dadosRelatorio.length }}
              </span>
              <span class="text-subtitle-2">
                <strong>Saldo:</strong> R$ {{ saldoFinal.toFixed(2) }}
              </span>
            </div>
          </template>

          <template v-slot:no-data>
            <div class="text-center pa-4">
              <v-icon icon="mdi-cash-register-off" size="64" class="mb-2 opacity-60"></v-icon>
              <p class="text-body-1">Nenhuma movimentação encontrada</p>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useThemeStore } from '@/stores/config-temas/theme'

const themeStore = useThemeStore()
const loading = ref(false)

const filtros = reactive({
  dataInicio: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
  dataFim: new Date().toISOString().split('T')[0],
  caixa: ''
})

const dadosRelatorio = ref([])

const headers = [
  { title: 'Data', key: 'data', sortable: true },
  { title: 'Hora', key: 'hora', sortable: true },
  { title: 'Tipo', key: 'tipo', sortable: true },
  { title: 'Descrição', key: 'descricao', sortable: true },
  { title: 'Valor', key: 'valor', sortable: true },
  { title: 'Usuário', key: 'usuario', sortable: true }
]

const totalEntradas = computed(() => {
  return dadosRelatorio.value
    .filter(item => item.tipo === 'entrada')
    .reduce((sum, item) => sum + (item.valor || 0), 0)
})

const totalSaidas = computed(() => {
  return dadosRelatorio.value
    .filter(item => item.tipo === 'saida')
    .reduce((sum, item) => sum + (item.valor || 0), 0)
})

const saldoFinal = computed(() => totalEntradas.value - totalSaidas.value)

const filtrarRelatorio = () => {
  loading.value = true
  try {
    dadosRelatorio.value = []
  } catch (error) {
    console.error('Erro:', error)
  } finally {
    loading.value = false
  }
}
</script>
