<template>
  <top-all-pages icon="mdi-chart-timeline-variant">
    <template #titulo>Previsão de Débitos por Centro de Custo</template>
    <template #section>
      <!-- Filtros -->
      <v-card :color="themeStore.darkMode ? 'text-white' : ''" class="background-secondary mb-4">
        <v-card-text class="pa-4">
          <v-row>
            <!-- Select Centro de Custo -->
            <v-col cols="12" md="4" class="d-flex align-center">
              <v-select
                  v-model="filtros.centroCustoSelecionado"
                  :items="centrosCustoOptions"
                  label="Centro de Custo"
                  variant="outlined"
                  density="compact"
                  prepend-inner-icon="mdi-file-tree"
                  hide-details
                  :loading="loadingCentroCusto"
              ></v-select>
            </v-col>

            <!-- Data Inicial -->
            <v-col cols="12" md="3" class="d-flex align-center">
              <v-text-field
                  v-model="filtros.dataInicial"
                  label="Data Inicial"
                  type="date"
                  variant="outlined"
                  density="compact"
                  hide-details
                  @change="validarPeriodo"
                  :theme="themeStore.darkMode ? 'dark' : 'light'"
              ></v-text-field>
            </v-col>

            <!-- Data Final -->
            <v-col cols="12" md="3" class="d-flex align-center">
              <v-text-field
                  v-model="filtros.dataFinal"
                  label="Data Final"
                  type="date"
                  variant="outlined"
                  density="compact"
                  :error-messages="erroData"
                  @change="validarPeriodo"
                  :theme="themeStore.darkMode ? 'dark' : 'light'"
                  hide-details
              ></v-text-field>
            </v-col>

            <!-- Botão Buscar -->
            <v-col cols="12" md="2" class="d-flex align-center">
              <v-btn
                  color="var(--text-color-laranja)"
                  variant="flat"
                  class="text-white"
                  prepend-icon="mdi-magnify"
                  @click="buscarPrevisao"
                  :loading="loading"
                  block
              >
                Buscar
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Tabela de Resultados -->
      <v-card :color="themeStore.darkMode ? 'text-white' : ''" class="background-secondary mb-4">
        <v-card-text class="pa-4">
          <v-data-table
              :headers="headers"
              :items="centrosCustoAgrupados"
              :loading="loading"
              class="elevation-1 background-card"
              density="compact"
              :items-per-page="10"
              :items-per-page-options="[10, 25, 50, 100]"
              :theme="themeStore.darkMode ? 'dark' : 'light'"
              show-expand
              item-value="centroCusto"
          >
            <template v-slot:top>
              <v-toolbar flat>
                <v-toolbar-title>Resultado da Previsão</v-toolbar-title>
              </v-toolbar>
            </template>

            <template v-slot:loading>
              <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
            </template>

            <template v-slot:no-data>
              <div class="text-center pa-4">
                <v-icon size="64" color="grey">mdi-chart-timeline-variant-shimmer</v-icon>
                <p class="text-body-1 mt-2">Nenhuma previsão encontrada</p>
                <p class="text-caption">Configure os filtros e clique em Buscar</p>
              </div>
            </template>

            <!-- Formatação dos valores das colunas de dias -->
            <template v-for="dia in diasComCobranca" :key="dia.key" #[`item.${dia.key}`]="{ item }">
            <span class="font-weight-medium">
              {{ item[dia.key] ? formatarMoeda(item[dia.key]) : '-' }}
            </span>
            </template>

            <!-- Formatação da coluna total -->
            <template #[`item.total`]="{ item }">
            <span class="font-weight-bold" style="color: var(--text-color-laranja)">
              {{ formatarMoeda(item.total) }}
            </span>
            </template>

            <!-- Linha expandida com detalhes das despesas -->
            <template v-slot:expanded-row="{ columns, item }">
              <tr>
                <td :colspan="columns.length" class="pa-0">
                  <v-card flat class="ma-2" color="rgba(var(--v-theme-primary), 0.05)">
                    <v-card-title class="text-subtitle-2 pa-3">
                      <v-icon size="small" class="mr-2">mdi-text-box-multiple-outline</v-icon>
                      Despesas de {{ item.centroCusto }}
                    </v-card-title>
                    <v-card-text class="pa-3">
                      <v-table density="compact" class="background-transparent">
                        <thead>
                        <tr>
                          <th class="text-left">Descrição</th>
                          <th v-for="dia in diasComCobranca" :key="dia.key" class="text-center">
                            {{ dia.label }}
                          </th>
                          <th class="text-center">Total</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(despesa, index) in item.despesas" :key="index">
                          <td class="text-left">{{ despesa.descricao }}</td>
                          <td v-for="dia in diasComCobranca" :key="dia.key" class="text-center">
                            {{ despesa[dia.key] ? formatarMoeda(despesa[dia.key]) : '-' }}
                          </td>
                          <td class="text-center font-weight-medium">
                            {{ formatarMoeda(despesa.total) }}
                          </td>
                        </tr>
                        </tbody>
                      </v-table>
                    </v-card-text>
                  </v-card>
                </td>
              </tr>
            </template>

            <!-- Totais -->
            <template #[`body.append`]>
              <tr v-if="centrosCustoAgrupados.length > 0" class="font-weight-bold total-row">
                <td></td>
                <td class="text-right">TOTAL GERAL:</td>
                <td v-for="(total, index) in totaisPorDia" :key="index" class="text-center">
                  {{ formatarMoeda(total) }}
                </td>
                <td class="text-center" style="color: var(--text-color-laranja)">
                  {{ formatarMoeda(totalGeral) }}
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>

      <!-- Gráfico de Pizza -->
      <v-card :color="themeStore.darkMode ? 'text-white' : ''" class="background-secondary mt-4" v-if="previsoes.length > 0">
        <v-card-title class="text-h6 pa-4">
          <v-icon icon="mdi-chart-pie" class="mr-2"></v-icon>
          Distribuição por Centro de Custo
        </v-card-title>
        <v-card-text class="pa-4">
          <apexchart
              type="pie"
              :options="chartOptions"
              :series="chartSeries"
              height="350"
          />
        </v-card-text>
      </v-card>
    </template>
  </top-all-pages>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useThemeStore } from '@/stores/config-temas/theme'
import { useCCustoStore } from '@/stores/APIs/ccusto'
import VueApexCharts from 'vue3-apexcharts'
import TopAllPages from "@/components/base/padrao-paginas/TopAllPages.vue";

const apexchart = VueApexCharts

const themeStore = useThemeStore()
const ccustoStore = useCCustoStore()

// Refs
const loading = ref(false)
const previsoes = ref([])
const erroData = ref('')
const idEmpresa = ref(1) // TODO: Obter do contexto de autenticação
const diasComCobranca = ref([]) // Dias únicos que têm cobranças

// Filtros
const filtros = reactive({
  centroCustoSelecionado: 'todos',
  periodo: 'competencia',
  dataInicial: '',
  dataFinal: ''
})

// Meses
const meses = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

// Computed para centros de custo
const centrosCustoOptions = computed(() => {
  const options = [{ title: 'Todos', value: 'todos' }]
  
  if (ccustoStore.centrosCusto && Array.isArray(ccustoStore.centrosCusto)) {
    ccustoStore.centrosCusto.forEach(ccusto => {
      options.push({
        title: `${ccusto.id_classificador} - ${ccusto.desccentrocusto}`,
        value: ccusto.id_classificador
      })
    })
  }
  
  return options
})

const loadingCentroCusto = computed(() => ccustoStore.loading)

// Agrupa previsões por centro de custo
const centrosCustoAgrupados = computed(() => {
  if (!previsoes.value.length) return []
  
  const agrupado = {}
  
  previsoes.value.forEach(item => {
    if (!agrupado[item.centroCusto]) {
      agrupado[item.centroCusto] = {
        centroCusto: item.centroCusto,
        despesas: [],
        total: 0
      }
      
      // Inicializa as colunas de dias
      diasComCobranca.value.forEach(dia => {
        agrupado[item.centroCusto][dia.key] = 0
      })
    }
    
    // Adiciona a despesa
    agrupado[item.centroCusto].despesas.push(item)
    agrupado[item.centroCusto].total += item.total || 0
    
    // Soma os valores por dia
    diasComCobranca.value.forEach(dia => {
      agrupado[item.centroCusto][dia.key] += item[dia.key] || 0
    })
  })
  
  return Object.values(agrupado)
})

// Headers da tabela (será dinâmico baseado nos dias com cobranças)
const headers = computed(() => {
  const baseHeaders = [
    { title: 'Centro de Custo', key: 'centroCusto', sortable: true, align: 'start' }
  ]

  // Adiciona colunas apenas para dias que têm cobranças
  diasComCobranca.value.forEach(dia => {
    baseHeaders.push({
      title: dia.label,
      key: dia.key,
      sortable: false,
      align: 'center'
    })
  })

  baseHeaders.push({ title: 'Total', key: 'total', sortable: true, align: 'center' })
  
  return baseHeaders
})

// Computed
const totaisPorDia = computed(() => {
  if (!previsoes.value.length) return []
  
  return diasComCobranca.value.map(dia => {
    return previsoes.value.reduce((sum, item) => sum + (item[dia.key] || 0), 0)
  })
})

const totalGeral = computed(() => {
  return previsoes.value.reduce((sum, item) => sum + (item.total || 0), 0)
})

// Dados do gráfico de pizza
const chartSeries = computed(() => {
  return centrosCustoAgrupados.value.map(item => item.total)
})

const chartOptions = computed(() => ({
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
  labels: centrosCustoAgrupados.value.map(item => item.centroCusto),
  colors: ['#FF8C42', '#FFA726', '#FFB74D', '#FFCC80', '#FFE0B2', '#FF9800', '#FB8C00', '#F57C00'],
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
        return 'R$ ' + formatarMoeda(val)
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

// Métodos
const validarPeriodo = () => {
  erroData.value = ''
  
  if (!filtros.dataInicial || !filtros.dataFinal) {
    return
  }
  
  const dataInicial = new Date(filtros.dataInicial)
  const dataFinal = new Date(filtros.dataFinal)
  
  // Verifica se data inicial é menor ou igual que data final
  if (dataInicial > dataFinal) {
    erroData.value = 'Data inicial deve ser menor ou igual que data final'
    return
  }
}

const buscarPrevisao = async () => {
  // Valida se as datas foram preenchidas
  if (!filtros.dataInicial || !filtros.dataFinal) {
    erroData.value = 'Preencha as datas inicial e final'
    return
  }
  
  // Valida se não há erro de período
  validarPeriodo()
  if (erroData.value) {
    return
  }
  
  loading.value = true
  
  try {
    console.log('🔍 Iniciando busca de previsão...')
    console.log('Parâmetros:', {
      idEmpresa: idEmpresa.value,
      dtini: filtros.dataInicial,
      dtfim: filtros.dataFinal,
      id_ccusto: filtros.centroCustoSelecionado
    })
    
    // Chamada real à API
    const dados = await ccustoStore.buscarPrevisaoDebitos({
      idEmpresa: idEmpresa.value,
      dtini: filtros.dataInicial,
      dtfim: filtros.dataFinal,
      id_ccusto: filtros.centroCustoSelecionado
    })
    
    console.log('📊 Dados recebidos da API:', dados)
    
    // Processar dados da API
    if (dados && Array.isArray(dados) && dados.length > 0) {
      // Extrair todas as datas únicas de vencimento
      const datasUnicas = new Set()
      dados.forEach(item => {
        if (item.dtvencimento) {
          datasUnicas.add(item.dtvencimento)
        }
      })
      
      // Ordenar datas e criar estrutura de dias
      const datasOrdenadas = Array.from(datasUnicas).sort()
      diasComCobranca.value = datasOrdenadas.map(dataStr => {
        const data = new Date(dataStr + 'T00:00:00')
        const dia = data.getDate()
        const mes = meses[data.getMonth()]
        
        return {
          key: `dia_${dataStr}`,
          label: `${dia}/${mes.substring(0, 3)}`,
          data: data,
          dataStr: dataStr
        }
      })
      
      console.log('📅 Dias com cobrança:', diasComCobranca.value)
      
      // Mapear dados da API para o formato esperado pela tabela
      previsoes.value = dados.map(item => {
        const previsao = {
          centroCusto: item.desccentrocusto || '',
          descricao: item.descconta || item.descplanoconta || '',
          id_ccusto: item.id_ccusto,
          id_reduzido_despesa: item.id_reduzido_despesa,
          dtvencimento: item.dtvencimento,
          total: parseFloat(item.valor || 0)
        }
        
        // Inicializar todos os dias com 0
        diasComCobranca.value.forEach(dia => {
          previsao[dia.key] = 0
        })
        
        // Colocar o valor no dia correto de vencimento
        if (item.dtvencimento) {
          const diaKey = `dia_${item.dtvencimento}`
          previsao[diaKey] = parseFloat(item.valor || 0)
        }
        
        return previsao
      })
      
      console.log('✅ Previsões processadas:', previsoes.value.length)
    } else {
      console.warn('⚠️ Nenhuma previsão encontrada')
      previsoes.value = []
      diasComCobranca.value = []
    }
    
  } catch (error) {
    console.error('❌ Erro ao buscar previsão:', error)
    previsoes.value = []
    diasComCobranca.value = []
  } finally {
    loading.value = false
  }
}

const formatarMoeda = (valor) => {
  if (!valor || valor === 0) return '0,00'
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(valor)
}

// Lifecycle
onMounted(async () => {
  await ccustoStore.listarCCusto()
})
</script>

<style scoped>
.v-data-table {
  background-color: transparent !important;
}

.v-data-table :deep(.v-data-table__td),
.v-data-table :deep(.v-data-table__th) {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

/* Linhas zebradas */
.v-data-table :deep(tbody tr:nth-child(odd)) {
  background-color: rgba(var(--v-theme-on-surface), 0.02);
}

.v-data-table :deep(tbody tr:nth-child(even)) {
  background-color: rgba(var(--v-theme-on-surface), 0.05);
}

/* Hover effect */
.v-data-table :deep(tbody tr:hover) {
  background-color: rgba(var(--v-theme-primary), 0.08) !important;
}

/* Linha de totais */
.total-row {
  background-color: rgba(var(--v-theme-primary), 0.1) !important;
  border-top: 2px solid rgba(var(--v-theme-primary), 0.3) !important;
}

/* Tabela expandida */
.background-transparent {
  background-color: transparent !important;
}

.background-transparent :deep(thead) {
  background-color: rgba(var(--v-theme-on-surface), 0.05);
}

.background-transparent :deep(tbody tr:hover) {
  background-color: rgba(var(--v-theme-primary), 0.05) !important;
}
</style>
