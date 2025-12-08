<template>
  <div class="pa-4">
    <!-- Cabeçalho -->
    <v-card class="background-secondary mb-4">
      <v-card-title class="text-h5 pa-4 d-flex justify-space-between align-center">
        <div class="d-flex align-center">
          <v-icon icon="mdi-cash-check" class="mr-3"></v-icon>
          Débitos Realizados por Centro de Custo
        </div>
      </v-card-title>
    </v-card>

    <!-- Conteúdo Principal -->
    <v-card :color="themeStore.darkMode ? 'text-white' : ''" class="background-secondary">
      <v-card-text class="pa-4">
        <!-- Filtros de Período -->
        <v-card class="mb-4 background-card" elevation="1">
          <v-card-title class="text-h6 pa-4">
            <v-icon icon="mdi-filter" class="mr-2"></v-icon>
            Filtros de Período
          </v-card-title>
          <v-card-text class="pa-4">
            <v-row>
              <!-- Atalho de Período -->
              <v-col cols="12" md="2">
                <v-select
                  v-model="periodoSelecionado"
                  :items="periodos"
                  label="Período"
                  variant="outlined"
                  density="compact"
                  prepend-inner-icon="mdi-calendar-clock"
                  @update:model-value="aplicarPeriodo"
                ></v-select>
              </v-col>

              <!-- Data Inicial -->
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="filtros.dataInicio"
                  label="Data Inicial"
                  type="date"
                  variant="outlined"
                  density="compact"
                  prepend-inner-icon="mdi-calendar"
                ></v-text-field>
              </v-col>

              <!-- Data Final -->
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="filtros.dataFim"
                  label="Data Final"
                  type="date"
                  variant="outlined"
                  density="compact"
                  prepend-inner-icon="mdi-calendar"
                ></v-text-field>
              </v-col>

              <!-- Botão Buscar -->
              <v-col cols="12" md="2" class="d-flex align-center">
                <v-btn
                  color="var(--text-color-laranja)"
                  :loading="loading"
                  @click="carregarDebitosRealizados"
                  variant="flat"
                  class="text-white"
                  block
                >
                  <v-icon start>mdi-magnify</v-icon>
                  Buscar
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Tabela de Débitos Realizados -->
        <v-card class="background-card" elevation="1">
          <v-card-text class="pa-0">
            <v-data-table
              :headers="headers"
              :items="debitosRealizados"
              :loading="loading"
              item-key="id_ccusto"
              class="elevation-0"
              :items-per-page="15"
              density="compact"
            >
               <!-- Coluna Centro de Custo -->
              <template v-slot:[`item.desccentrocusto`]="{ item }">
                {{ item.desccentrocusto || '--' }}
              </template>
              <!-- Coluna Data Lançamento -->
              <template v-slot:[`item.dtlancamento`]="{ item }">
                {{ formatarData(item.dtlancamento) }}
              </template>

              <!-- Coluna Conta -->
              <template v-slot:[`item.descconta`]="{ item }">
                {{ item.descconta || '--' }}
              </template>
           
              <!-- Coluna Valor -->
              <template v-slot:[`item.valor`]="{ item }">
                <span class="text-error font-weight-bold">
                  {{ formatarMoeda(item.valor) }}
                </span>
              </template>

              <!-- Loading -->
              <template v-slot:loading>
                <v-skeleton-loader type="table-row@5"></v-skeleton-loader>
              </template>

              <!-- Sem dados -->
              <template v-slot:no-data>
                <div class="text-center py-8">
                  <v-icon icon="mdi-cash-check" size="64" color="grey" class="mb-4"></v-icon>
                  <p class="text-h6 text-grey">Nenhum débito realizado encontrado</p>
                </div>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>

        <!-- Card de Totais -->
        <v-card class="mt-4 background-card" elevation="1">
          <v-card-text class="pa-4">
            <v-row>
              <v-col cols="12" md="6">
                <div class="text-caption text-grey">Total de Débitos</div>
                <div class="text-h6 font-weight-bold">{{ debitosRealizados.length }}</div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="text-caption text-grey">Valor Total dos Débitos</div>
                <div class="text-h5 font-weight-bold text-error">
                  {{ formatarMoeda(totalDebitos) }}
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-card-text>
    </v-card>

    <!-- Gráfico de Pizza -->
    <v-card :color="themeStore.darkMode ? 'text-white' : ''" class="background-secondary mt-4" v-if="debitosRealizados.length > 0">
      <v-card-title class="text-h6 pa-4">
        <v-icon icon="mdi-chart-pie" class="mr-2"></v-icon>
        Distribuição por Centro de Custo
      </v-card-title>
      <v-card-text class="pa-4">
        <apexchart
          type="pie"
          :options="chartPieOptions"
          :series="chartPieSeries"
          height="350"
        />
      </v-card-text>
    </v-card>

    <!-- Gráfico de Barras -->
    <v-card :color="themeStore.darkMode ? 'text-white' : ''" class="background-secondary mt-4" v-if="debitosRealizados.length > 0">
      <v-card-title class="text-h6 pa-4">
        <v-icon icon="mdi-chart-bar" class="mr-2"></v-icon>
        Débitos por Centro de Custo
      </v-card-title>
      <v-card-text class="pa-4">
        <apexchart
          type="bar"
          :options="chartBarOptions"
          :series="chartBarSeries"
          height="350"
        />
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useThemeStore } from '@/stores/config-temas/theme'
import { useCCustoStore } from '@/stores/APIs/ccusto'
import { useEmpresaStore } from '@/stores/APIs/empresa'
import VueApexCharts from 'vue3-apexcharts'

const apexchart = VueApexCharts

const themeStore = useThemeStore()
const ccustoStore = useCCustoStore()
const empresaStore = useEmpresaStore()

// Estado
const loading = ref(false)
const debitosRealizados = ref([])
const periodoSelecionado = ref('mes')

// Filtros de período
const filtros = reactive({
  dataInicio: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0], // Primeiro dia do mês
  dataFim: new Date().toISOString().split('T')[0] // Hoje
})

// Opções de período
const periodos = [
  { title: 'Hoje', value: 'hoje' },
  { title: 'Essa Semana', value: 'semana' },
  { title: 'Esse Mês', value: 'mes' },
  { title: 'Esse Ano', value: 'ano' },
  { title: 'Últimos 7 dias', value: '7dias' },
  { title: 'Últimos 30 dias', value: '30dias' },
  { title: 'Personalizado', value: 'personalizado' }
]

// Headers da tabela
const headers = [
  { title: 'Centro de Custo', key: 'desccentrocusto', sortable: true, width: '250px' },
  { title: 'Data Lançamento', key: 'dtlancamento', sortable: true, width: '130px' },
  { title: 'Conta', key: 'descconta', sortable: true, width: '200px' },
  { title: 'Valor', key: 'valor', sortable: true, align: 'end', width: '150px' }
]

// Computed
const totalDebitos = computed(() => {
  return debitosRealizados.value.reduce((sum, item) => {
    return sum + parseFloat(item.valor || 0)
  }, 0)
})

// Agrupa débitos por centro de custo
const debitosPorCentroCusto = computed(() => {
  if (!debitosRealizados.value.length) return []
  
  const agrupado = {}
  
  debitosRealizados.value.forEach(item => {
    const centroCusto = item.desccentrocusto || 'Sem Centro de Custo'
    
    if (!agrupado[centroCusto]) {
      agrupado[centroCusto] = {
        desccentrocusto: centroCusto,
        total: 0,
        quantidade: 0
      }
    }
    
    agrupado[centroCusto].total += parseFloat(item.valor || 0)
    agrupado[centroCusto].quantidade += 1
  })
  
  return Object.values(agrupado).sort((a, b) => b.total - a.total)
})

// Dados do gráfico de pizza
const chartPieSeries = computed(() => {
  return debitosPorCentroCusto.value.map(item => item.total)
})

const chartPieOptions = computed(() => ({
  chart: {
    type: 'pie',
    background: 'transparent',
    fontFamily: 'Roboto, sans-serif',
    toolbar: {
      show: true,
      tools: {
        download: true
      }
    }
  },
  labels: debitosPorCentroCusto.value.map(item => item.desccentrocusto),
  colors: ['#FF8C42', '#FFA726', '#FFB74D', '#FFCC80', '#FFE0B2', '#FF9800', '#FB8C00', '#F57C00', '#EF6C00', '#E65100'],
  theme: {
    mode: themeStore.darkMode ? 'dark' : 'light',
    palette: 'palette1'
  },
  legend: {
    position: 'bottom',
    horizontalAlign: 'center',
    fontSize: '13px',
    labels: {
      colors: themeStore.darkMode ? '#FFFFFF' : '#000000'
    }
  },
  dataLabels: {
    enabled: true,
    formatter: function (val) {
      return val.toFixed(1) + '%'
    },
    style: {
      fontSize: '12px',
      fontWeight: 'bold',
      colors: ['#FFFFFF']
    },
    dropShadow: {
      enabled: true,
      top: 1,
      left: 1,
      blur: 1,
      opacity: 0.45
    }
  },
  tooltip: {
    theme: themeStore.darkMode ? 'dark' : 'light',
    y: {
      formatter: function (val) {
        return formatarMoeda(val)
      }
    }
  },
  responsive: [{
    breakpoint: 480,
    options: {
      chart: {
        width: 300
      },
      legend: {
        position: 'bottom'
      }
    }
  }]
}))

// Dados do gráfico de barras
const chartBarSeries = computed(() => [{
  name: 'Débitos Realizados',
  data: debitosPorCentroCusto.value.map(item => item.total)
}])

const chartBarOptions = computed(() => ({
  chart: {
    type: 'bar',
    background: 'transparent',
    fontFamily: 'Roboto, sans-serif',
    toolbar: {
      show: true,
      tools: {
        download: true
      }
    }
  },
  plotOptions: {
    bar: {
      horizontal: true,
      borderRadius: 4,
      dataLabels: {
        position: 'top'
      }
    }
  },
  dataLabels: {
    enabled: true,
    formatter: function (val) {
      return formatarMoeda(val)
    },
    offsetX: 0,
    style: {
      fontSize: '11px',
      colors: [themeStore.darkMode ? '#FFFFFF' : '#000000']
    }
  },
  xaxis: {
    categories: debitosPorCentroCusto.value.map(item => item.desccentrocusto),
    labels: {
      formatter: function (val) {
        return formatarMoeda(val)
      },
      style: {
        colors: themeStore.darkMode ? '#FFFFFF' : '#000000'
      }
    }
  },
  yaxis: {
    labels: {
      style: {
        colors: themeStore.darkMode ? '#FFFFFF' : '#000000'
      }
    }
  },
  colors: ['#FF8C42'],
  theme: {
    mode: themeStore.darkMode ? 'dark' : 'light'
  },
  tooltip: {
    theme: themeStore.darkMode ? 'dark' : 'light',
    y: {
      formatter: function (val) {
        return formatarMoeda(val)
      }
    }
  },
  grid: {
    borderColor: themeStore.darkMode ? '#444' : '#e0e0e0'
  }
}))

// Métodos de formatação
const formatarMoeda = (valor) => {
  if (valor === null || valor === undefined) return 'R$ 0,00'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor)
}

const formatarData = (data) => {
  if (!data) return '--'
  try {
    return new Date(data).toLocaleDateString('pt-BR')
  } catch {
    return '--'
  }
}

// Aplicar período selecionado
const aplicarPeriodo = (periodo) => {
  const hoje = new Date()
  let dataInicio = new Date()
  let dataFim = new Date()

  switch (periodo) {
    case 'hoje':
      dataInicio = hoje
      dataFim = hoje
      break
    
    case 'semana': {
      // Primeiro dia da semana (domingo)
      const primeiroDiaSemana = hoje.getDate() - hoje.getDay()
      dataInicio = new Date(hoje.getFullYear(), hoje.getMonth(), primeiroDiaSemana)
      dataFim = hoje
      break
    }
    
    case 'mes':
      // Primeiro dia do mês
      dataInicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
      dataFim = hoje
      break
    
    case 'ano':
      // Primeiro dia do ano
      dataInicio = new Date(hoje.getFullYear(), 0, 1)
      dataFim = hoje
      break
    
    case '7dias':
      // Últimos 7 dias
      dataInicio = new Date(hoje.getTime() - 7 * 24 * 60 * 60 * 1000)
      dataFim = hoje
      break
    
    case '30dias':
      // Últimos 30 dias
      dataInicio = new Date(hoje.getTime() - 30 * 24 * 60 * 60 * 1000)
      dataFim = hoje
      break
    
    case 'personalizado':
      // Não altera as datas, usuário define manualmente
      return
  }

  filtros.dataInicio = dataInicio.toISOString().split('T')[0]
  filtros.dataFim = dataFim.toISOString().split('T')[0]
}

// Carregar dados
const carregarDebitosRealizados = async () => {
  loading.value = true
  try {
    const idEmpresa = empresaStore.empresa?.id || empresaStore.empresaSelecionada?.id
    
    if (!idEmpresa) {
      console.warn('ID da empresa não encontrado')
      return
    }
    
    if (!filtros.dataInicio || !filtros.dataFim) {
      console.warn('Filtros de data não preenchidos')
      debitosRealizados.value = []
      return
    }
    
    console.log('Carregando débitos realizados com filtros:', {
      idEmpresa,
      dataInicio: filtros.dataInicio,
      dataFim: filtros.dataFim
    })
    
    const response = await ccustoStore.buscarDebitosRealizados(
      idEmpresa, 
      filtros.dataInicio, 
      filtros.dataFim
    )
    
    console.log('Resposta da API:', response)
    
    // A API pode retornar { data: [...] } ou diretamente [...]
    const dados = response?.data || response || []
    debitosRealizados.value = Array.isArray(dados) ? dados : []
    
    console.log('Débitos realizados carregados:', debitosRealizados.value.length)
  } catch (error) {
    console.error('Erro ao carregar débitos realizados:', error)
    debitosRealizados.value = []
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(async () => {
  console.log('🚀 Iniciando carregamento de débitos realizados...')
  await carregarDebitosRealizados()
  console.log('✅ Carregamento completo')
})
</script>

<style scoped>
/* Estilos específicos se necessário */
</style>
