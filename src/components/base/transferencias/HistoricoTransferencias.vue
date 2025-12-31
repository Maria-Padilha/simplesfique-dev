<template>
  <div>
    <!-- Filtros -->
    <v-card 
      class="background-secondary mb-4" 
      elevation="1"
      :class="{ 'mt-4': formularioAberto }"
    >
      <v-card-text class="pa-4">
        <v-row>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="filtros.dtini"
              label="Data Inicial *"
              type="date"
              density="compact"
              variant="outlined"
              hide-details="auto"
              prepend-inner-icon="mdi-calendar"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="filtros.dtfim"
              label="Data Final *"
              type="date"
              density="compact"
              variant="outlined"
              hide-details="auto"
              prepend-inner-icon="mdi-calendar"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="filtros.tipo_transf"
              label="Tipo de Transferência"
              :items="tiposTransferencia"
              item-title="text"
              item-value="value"
              density="compact"
              variant="outlined"
              hide-details="auto"
              clearable
              prepend-inner-icon="mdi-swap-horizontal"
            ></v-select>
          </v-col>
          <v-col cols="12" md="3" class="d-flex align-center">
              <v-btn
                color="var(--text-color-laranja)"
                variant="flat"
                class="text-white"
                :loading="loading"
                @click="buscarTransferencias"
                block
              >
                <v-icon icon="mdi-magnify" class="mr-1"></v-icon>
                Buscar
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

    <!-- Tabela de Resultados -->
    <v-data-table
        :headers="headers"
        :items="transferencias"
        :loading="loading"
        class="elevation-1"
        density="compact"
        :items-per-page="10"
        :items-per-page-options="[10, 25, 50, 100]"
      >
        <template #[`item.tipo_transf`]="{ item }">
          <v-chip
            :color="getTipoColor(item.tipo_transf)"
            size="small"
            variant="flat"
          >
            {{ item.tipo_transf }}
          </v-chip>
        </template>

        <template #[`item.dhinc`]="{ item }">
          {{ formatarDataHora(item.dhinc) }}
        </template>

        <template #[`item.valor`]="{ item }">
          <span class="font-weight-medium">
            {{ formatarValor(item.valor) }}
          </span>
        </template>

        <template #[`item.nome`]="{ item }">
          <v-chip
            color="primary"
            size="small"
            variant="tonal"
          >
            <v-icon icon="mdi-account" size="small" class="mr-1"></v-icon>
            {{ item.nome }}
          </v-chip>
        </template>

        <template #no-data>
          <div class="text-center pa-4">
            <v-icon icon="mdi-transfer" size="48" class="mb-2 text-medium-emphasis"></v-icon>
            <p class="text-body-1 text-medium-emphasis">Nenhuma transferência encontrada</p>
            <p class="text-caption text-medium-emphasis">Ajuste os filtros e clique em Buscar</p>
          </div>
        </template>

        <template #loading>
          <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
        </template>
      </v-data-table>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useFinanceiroStore } from '@/stores/APIs/financeiro'

const financeiroStore = useFinanceiroStore()

const loading = ref(false)
const transferencias = ref([])

const filtros = reactive({
  dtini: new Date(new Date().setDate(1)).toISOString().split('T')[0], // Primeiro dia do mês
  dtfim: new Date().toISOString().split('T')[0], // Hoje
  tipo_transf: null
})

const tiposTransferencia = [
  { text: 'Todas', value: null },
  { text: 'Interbancária', value: 1 },
  { text: 'Banco → Caixa', value: 2 },
  { text: 'Intercaixa', value: 3 },
  { text: 'Caixa → Banco', value: 4 }
]

const headers = [
  { title: 'ID', key: 'id', sortable: true },
  { title: 'Data/Hora', key: 'dhinc', sortable: true },
  { title: 'Tipo', key: 'tipo_transf', sortable: true },
  { title: 'Valor', key: 'valor', sortable: true },
  { title: 'Usuário', key: 'nome', sortable: true },
  { title: 'Observação', key: 'observacao', sortable: false }
]

const rules = {
  required: (value) => !!value || 'Campo obrigatório'
}

const buscarTransferencias = async () => {
  if (!filtros.dtini || !filtros.dtfim) {
    return
  }

  loading.value = true
  try {
    const empresaSelecionada = JSON.parse(localStorage.getItem('empresaSelecionada') || '{}')
    const idEmpresa = empresaSelecionada?.id || localStorage.getItem('empresa')

    if (!idEmpresa) {
      console.error('ID da empresa não encontrado')
      return
    }

    const resultado = await financeiroStore.buscarTransferenciasFinanceiras(
      idEmpresa,
      filtros.dtini,
      filtros.dtfim,
      filtros.tipo_transf
    )

    transferencias.value = Array.isArray(resultado) ? resultado : (resultado?.data || [])
  } catch (error) {
    console.error('Erro ao buscar transferências:', error)
    transferencias.value = []
  } finally {
    loading.value = false
  }
}

const getTipoColor = (tipo) => {
  if (!tipo) return 'grey'
  const tipoLower = tipo.toLowerCase()
  
  if (tipoLower.includes('interbancaria')) return 'blue'
  if (tipoLower.includes('banco') && tipoLower.includes('caixa')) {
    return tipoLower.indexOf('banco') < tipoLower.indexOf('caixa') ? 'green' : 'purple'
  }
  if (tipoLower.includes('intercaixa')) return 'orange'
  
  return 'grey'
}

const formatarDataHora = (data) => {
  if (!data) return '-'
  try {
    const date = new Date(data)
    const dia = String(date.getDate()).padStart(2, '0')
    const mes = String(date.getMonth() + 1).padStart(2, '0')
    const ano = date.getFullYear()
    const hora = String(date.getHours()).padStart(2, '0')
    const min = String(date.getMinutes()).padStart(2, '0')
    return `${dia}/${mes}/${ano} ${hora}:${min}`
  } catch {
    return data
  }
}

const formatarValor = (valor) => {
  if (!valor) return 'R$ 0,00'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor)
}

// Buscar automaticamente ao montar
onMounted(() => {
  buscarTransferencias()
})

// Expor método para ser chamado via ref
// eslint-disable-next-line no-undef
defineExpose({
  buscarTransferencias
})
</script>

<style scoped>
.background-card {
  background-color: var(--bg-card);
  color: var(--text-color);
}

.background-secondary {
  background-color: var(--bg-secondary);
}
</style>
