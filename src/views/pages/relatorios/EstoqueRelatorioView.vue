<template>
  <div class="pa-4">
    <v-card class="background-secondary my-4" elevation="1">
      <v-card-title class="text-h5 pa-4 d-flex justify-space-between align-center">
        <div class="d-flex align-center">
          <v-icon icon="mdi-warehouse-outline" class="mr-3"></v-icon>
          Relatório de Estoque
        </div>
      </v-card-title>
    </v-card>

    <v-card elevation="0" class="background-secondary mb-4">
      <v-card-text class="pa-4">
        <v-row class="mb-4">
          <v-col cols="12" md="4">
            <v-text-field
              v-model="filtros.pesquisa"
              label="Pesquisar Produto"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="compact"
              :theme="themeStore.darkMode ? 'dark' : 'light'"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="4">
            <v-select
              v-model="filtros.status"
              :items="[
                { label: 'Todos', value: 'todos' },
                { label: 'Em Estoque', value: 'em_estoque' },
                { label: 'Baixo Estoque', value: 'baixo' },
                { label: 'Fora de Estoque', value: 'fora' }
              ]"
              item-title="label"
              item-value="value"
              label="Status"
              variant="outlined"
              density="compact"
              :theme="themeStore.darkMode ? 'dark' : 'light'"
            ></v-select>
          </v-col>

          <v-col cols="12" md="4" class="d-flex align-end gap-2">
            <v-btn
              color="var(--text-color-laranja)"
              variant="flat"
              class="text-white"
              prepend-icon="mdi-refresh"
              block
              @click="filtrarRelatorio"
            >
              Atualizar
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
          <template v-slot:[`item.quantidade`]="{ item }">
            <v-chip
              :color="getCorQuantidade(item.quantidade)"
              text-color="white"
              label
            >
              {{ item.quantidade }} unidades
            </v-chip>
          </template>

          <template v-slot:bottom>
            <div class="d-flex justify-space-between align-center pa-4 border-t">
              <span class="text-subtitle-2">
                <strong>Total de Produtos:</strong> {{ dadosRelatorio.length }}
              </span>
              <span class="text-subtitle-2">
                <strong>Valor Total:</strong> R$ {{ valorTotal.toFixed(2) }}
              </span>
            </div>
          </template>

          <template v-slot:no-data>
            <div class="text-center pa-4">
              <v-icon icon="mdi-warehouse-off" size="64" class="mb-2 opacity-60"></v-icon>
              <p class="text-body-1">Nenhum produto encontrado</p>
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
  pesquisa: '',
  status: 'todos'
})

const dadosRelatorio = ref([])

const headers = [
  { title: 'Código', key: 'codigo', sortable: true },
  { title: 'Produto', key: 'nome', sortable: true },
  { title: 'Categoria', key: 'categoria', sortable: true },
  { title: 'Quantidade', key: 'quantidade', sortable: true },
  { title: 'Valor Unitário', key: 'valor_unitario', sortable: true },
  { title: 'Valor Total', key: 'valor_total', sortable: true }
]

const valorTotal = computed(() => {
  return dadosRelatorio.value.reduce((sum, item) => sum + (item.valor_total || 0), 0)
})

const getCorQuantidade = (quantidade) => {
  if (quantidade === 0) return 'error'
  if (quantidade < 10) return 'warning'
  return 'success'
}

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
  console.log('Exportar relatório de estoque')
}
</script>
