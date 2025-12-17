<template>
  <div class="pa-4">
    <v-card class="background-secondary my-4" elevation="1">
      <v-card-title class="text-h5 pa-4 d-flex justify-space-between align-center">
        <div class="d-flex align-center">
          <v-icon icon="mdi-account-multiple-outline" class="mr-3"></v-icon>
          Relatório de Pessoas
        </div>
      </v-card-title>
    </v-card>

    <v-card elevation="0" class="background-secondary mb-4">
      <v-card-text class="pa-4">
        <v-row class="mb-4">
          <v-col cols="12" md="4">
            <v-text-field
              v-model="filtros.pesquisa"
              label="Pesquisar por Nome/CPF/CNPJ"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="compact"
              :theme="themeStore.darkMode ? 'dark' : 'light'"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="4">
            <v-select
              v-model="filtros.tipo"
              :items="[
                { label: 'Todas', value: 'todas' },
                { label: 'Pessoas Físicas', value: 'F' },
                { label: 'Pessoas Jurídicas', value: 'J' }
              ]"
              item-title="label"
              item-value="value"
              label="Tipo de Pessoa"
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
          <template v-slot:[`item.tipo_pessoa`]="{ item }">
            <v-chip
              :color="item.tipo_pessoa === 'F' ? 'primary' : 'success'"
              text-color="white"
              label
            >
              {{ item.tipo_pessoa === 'F' ? 'Física' : 'Jurídica' }}
            </v-chip>
          </template>

          <template v-slot:[`item.ativo`]="{ item }">
            <v-chip
              :color="item.ativo === 'S' ? 'success' : 'error'"
              text-color="white"
              label
            >
              {{ item.ativo === 'S' ? 'Ativa' : 'Inativa' }}
            </v-chip>
          </template>

          <template v-slot:no-data>
            <div class="text-center pa-4">
              <v-icon icon="mdi-account-off" size="64" class="mb-2 opacity-60"></v-icon>
              <p class="text-body-1">Nenhuma pessoa encontrada</p>
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
  pesquisa: '',
  tipo: 'todas'
})

const dadosRelatorio = ref([])

const headers = [
  { title: 'ID', key: 'id', sortable: true },
  { title: 'Tipo', key: 'tipo_pessoa', sortable: true },
  { title: 'Nome / Razão', key: 'nome_razao', sortable: true },
  { title: 'Apelido', key: 'apelido_fantasia', sortable: true },
  { title: 'CPF/CNPJ', key: 'cpf_cnpj', sortable: false },
  { title: 'Celular', key: 'celular', sortable: false },
  { title: 'Status', key: 'ativo', sortable: true }
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
  console.log('Exportar relatório de pessoas')
}
</script>
