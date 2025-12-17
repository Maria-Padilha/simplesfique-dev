<template>
  <div class="pa-4">
    <v-card class="background-secondary my-4" elevation="1">
      <v-card-title class="text-h5 pa-4 d-flex justify-space-between align-center">
        <div class="d-flex align-center">
          <v-icon icon="mdi-cart-outline" class="mr-3"></v-icon>
          Relatório de Vendas
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
              v-model="filtros.vendedor"
              label="Vendedor"
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
          <template v-slot:no-data>
            <div class="text-center pa-4">
              <v-icon icon="mdi-cart-off" size="64" class="mb-2 opacity-60"></v-icon>
              <p class="text-body-1">Nenhuma venda encontrada</p>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useThemeStore } from '@/stores/config-temas/theme'

const themeStore = useThemeStore()
const loading = ref(false)

const filtros = reactive({
  dataInicio: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
  dataFim: new Date().toISOString().split('T')[0],
  vendedor: ''
})

const dadosRelatorio = ref([])

const headers = [
  { title: 'Data', key: 'data', sortable: true },
  { title: 'Número Venda', key: 'numero_venda', sortable: true },
  { title: 'Cliente', key: 'cliente', sortable: true },
  { title: 'Vendedor', key: 'vendedor', sortable: true },
  { title: 'Quantidade', key: 'quantidade', sortable: true },
  { title: 'Valor Total', key: 'valor_total', sortable: true }
]


const filtrarRelatorio = async () => {
  loading.value = true
  try {
    // TODO: Fazer requisição à API
    dadosRelatorio.value = []
  } catch (error) {
    console.error('Erro ao filtrar relatório:', error)
  } finally {
    loading.value = false
  }
}

const exportarRelatorio = () => {
  // TODO: Implementar export para Excel/PDF
  console.log('Exportar relatório de vendas')
}
</script>
