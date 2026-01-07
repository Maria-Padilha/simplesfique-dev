<template>
  <div class="pa-4">
    <!-- Cabeçalho -->
    <v-card class="background-secondary mb-4">
      <v-card-title class="text-h5 pa-4 d-flex justify-space-between align-center">
        <div class="d-flex align-center">
          <v-icon icon="mdi-cash-check" class="mr-3"></v-icon>
          Débitos Realizados por Centro de Custo
        </div>
        <v-btn
          icon="mdi-printer"
          variant="text"
          color="var(--text-color-laranja)"
          @click="abrirModalExportacao"
          title="Exportar/Imprimir relatório"
          :disabled="debitosPorCentroCusto.length === 0"
        ></v-btn>
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
              <v-col cols="12" md="2" class="d-flex">
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
              :items="debitosPorCentroCusto"
              :loading="loading"
              item-value="id"
              class="elevation-0 background-card"
              :items-per-page="15"
              :items-per-page-options="[10, 25, 50, 100]"
              density="compact"
              :theme="themeStore.darkMode ? 'dark' : 'light'"
              show-expand
              :single-expand="true"
            >
              <template v-slot:top>
                <v-toolbar flat>
                  <v-toolbar-title>Resultado dos Débitos Realizados</v-toolbar-title>
                </v-toolbar>
              </template>

              <!-- Coluna Centro de Custo -->
              <template v-slot:[`item.centroCusto`]="{ item }">
                <span class="font-weight-medium">{{ item.centroCusto }}</span>
              </template>

              <!-- Colunas de datas (dinâmicas) -->
              <template v-for="data in datasUnicas" :key="data" v-slot:[`item.data_${data}`]="{ item }">
                <span>
                  {{ item[`data_${data}`] ? formatarMoeda(item[`data_${data}`]) : '-' }}
                </span>
              </template>
           
              <!-- Coluna Total -->
              <template v-slot:[`item.total`]="{ item }">
                <span class="font-weight-bold" style="color: var(--text-color-laranja)">
                  {{ formatarMoeda(item.total) }}
                </span>
              </template>

              <!-- Conteúdo expandido -->
              <template v-slot:expanded-row="{ item }">
                <tr>
                  <td :colspan="headers.length + 1" class="pa-0">
                    <v-card flat class="background-card ma-2">
                      <v-card-title class="text-subtitle-2 pa-3 d-flex align-center">
                        <v-icon icon="mdi-format-list-bulleted" size="small" class="mr-2"></v-icon>
                        Detalhamento das Despesas
                      </v-card-title>
                      <v-divider></v-divider>
                      <v-card-text class="pa-0">
                        <v-table density="compact">
                          <thead>
                            <tr>
                              <th class="text-left">Conta</th>
                              <th v-for="data in datasUnicas" :key="data" class="text-center">
                                {{ formatarDataCurta(data) }}
                              </th>
                              <th class="text-center">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(despesaAgrupada, index) in agruparDespesasPorConta(item.despesas)" :key="index">
                              <td class="text-left">{{ despesaAgrupada.conta }}</td>
                              <td v-for="data in datasUnicas" :key="data" class="text-center">
                                {{ despesaAgrupada[`data_${data}`] ? formatarMoeda(despesaAgrupada[`data_${data}`]) : '-' }}
                              </td>
                              <td class="text-center font-weight-medium">
                                {{ formatarMoeda(despesaAgrupada.total) }}
                              </td>
                            </tr>
                          </tbody>
                          <tfoot>
                            <tr class="font-weight-bold">
                              <td class="text-right">Subtotal:</td>
                              <td v-for="data in datasUnicas" :key="data" class="text-center">
                                {{ formatarMoeda(calcularTotalPorData(item.despesas, data)) }}
                              </td>
                              <td class="text-center" style="color: var(--text-color-laranja)">
                                {{ formatarMoeda(item.total) }}
                              </td>
                            </tr>
                          </tfoot>
                        </v-table>
                      </v-card-text>
                    </v-card>
                  </td>
                </tr>
              </template>

              <!-- Loading -->
              <template v-slot:loading>
                <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
              </template>

              <!-- Sem dados -->
              <template v-slot:no-data>
                <div class="text-center pa-4">
                  <v-icon size="64" color="grey">mdi-cash-check</v-icon>
                  <p class="text-body-1 mt-2">Nenhum débito realizado encontrado</p>
                  <p class="text-caption">Configure os filtros e clique em Buscar</p>
                </div>
              </template>

              <!-- Totais -->
              <template #[`body.append`]>
                <tr v-if="debitosPorCentroCusto.length > 0" class="font-weight-bold total-row">
                  <td class="text-right">TOTAL GERAL:</td>
                  <td v-for="data in datasUnicas" :key="data" class="text-center">
                    {{ formatarMoeda(totaisPorData[`data_${data}`] || 0) }}
                  </td>
                  <td class="text-center" style="color: var(--text-color-laranja)">
                    {{ formatarMoeda(totalDebitos) }}
                  </td>
                </tr>
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

    <!-- Modal de Exportação/Impressão -->
    <ExportacaoModal
      v-model="modalExportacaoAberto"
      :dados="debitosPorCentroCusto"
      :filtros="filtros"
      nome-relatorio="Débitos Realizados"
      @exportar-pdf="handleExportarPDF"
      @exportar-csv="handleExportarCSV"
      @exportar-excel="handleExportarExcel"
      @imprimir="handleImprimir"
    ></ExportacaoModal>

    <!-- Modal de Preview do PDF -->
    <PdfPreviewModal
      v-model="modalPreviewPDF"
      :html-content="previewHTMLContent"
      :nome-relatorio="dadosPDFAtual?.nomeRelatorio || 'Debitos_Realizados'"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useThemeStore } from '@/stores/config-temas/theme'
import { useCCustoStore } from '@/stores/APIs/ccusto'
import { useEmpresaStore } from '@/stores/APIs/empresa'
import { toast } from 'vue3-toastify'
import { gerarHTMLCentroCusto, abrirImpressaoCentroCusto } from '@/components/impressos/centrodecusto'
import ExportacaoModal from '@/components/base/modais/ExportacaoModal.vue'
import PdfPreviewModal from '@/components/base/modais/PdfPreviewModal.vue'
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

// Headers da tabela (dinâmicos baseados nas datas)
const headers = computed(() => {
  const baseHeaders = [
    { title: 'Centro de Custo', key: 'centroCusto', sortable: true, width: '200px' }
  ]
  
  // Adiciona uma coluna para cada data encontrada
  const dataHeaders = datasUnicas.value.map(data => ({
    title: formatarDataCurta(data),
    key: `data_${data}`,
    sortable: false,
    align: 'center',
    width: '120px'
  }))
  
  return [
    ...baseHeaders,
    ...dataHeaders,
    { title: 'Total', key: 'total', sortable: true, align: 'end', width: '150px' }
  ]
})

// Datas únicas encontradas nos débitos
const datasUnicas = computed(() => {
  if (!debitosRealizados.value.length) return []
  
  const datas = new Set()
  debitosRealizados.value.forEach(item => {
    if (item.dtvencimento) {
      datas.add(item.dtvencimento)
    }
  })
  
  return Array.from(datas).sort()
})

// Computed
const totalDebitos = computed(() => {
  return debitosRealizados.value.reduce((sum, item) => {
    return sum + parseFloat(item.valor || 0)
  }, 0)
})

// Agrupa débitos por centro de custo com valores por data
const debitosPorCentroCusto = computed(() => {
  if (!debitosRealizados.value.length) return []
  
  const agrupado = {}
  
  debitosRealizados.value.forEach(item => {
    const centroCusto = item.desccentrocusto || 'Sem Centro de Custo'
    const key = `${item.id_ccusto || 0}_${centroCusto}`
    const data = item.dtvencimento
    const dataKey = `data_${data}`
    
    if (!agrupado[key]) {
      agrupado[key] = {
        id: key,
        centroCusto: centroCusto,
        total: 0,
        despesas: [] // Armazena despesas agrupadas por data
      }
      
      // Inicializa todas as datas com 0
      datasUnicas.value.forEach(d => {
        agrupado[key][`data_${d}`] = 0
      })
    }
    
    // Acumula o valor na data correspondente
    const valor = parseFloat(item.valor || 0)
    agrupado[key][dataKey] = (agrupado[key][dataKey] || 0) + valor
    agrupado[key].total += valor
    
    // Armazena despesa para o detalhamento
    agrupado[key].despesas.push({
      dtvencimento: item.dtvencimento,
      descconta: item.descconta,
      valor: valor
    })
  })
  
  return Object.values(agrupado).sort((a, b) => b.total - a.total)
})

// Totais por data
const totaisPorData = computed(() => {
  const totais = {}
  
  datasUnicas.value.forEach(data => {
    const dataKey = `data_${data}`
    totais[dataKey] = debitosPorCentroCusto.value.reduce((sum, item) => {
      return sum + (item[dataKey] || 0)
    }, 0)
  })
  
  return totais
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
  labels: debitosPorCentroCusto.value.map(item => item.centroCusto),
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
    categories: debitosPorCentroCusto.value.map(item => item.centroCusto),
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

const formatarDataCurta = (data) => {
  if (!data) return '--'
  try {
    const [, mes, dia] = data.split('-')
    return `${dia}/${mes.substring(1) || mes}`
  } catch {
    return '--'
  }
}

// Agrupa despesas por conta para exibição detalhada
const agruparDespesasPorConta = (despesas) => {
  const agrupado = {}
  
  despesas.forEach(despesa => {
    const conta = despesa.descconta || 'Sem Conta'
    const data = despesa.dtvencimento
    const dataKey = `data_${data}`
    
    if (!agrupado[conta]) {
      agrupado[conta] = {
        conta: conta,
        total: 0
      }
      // Inicializa todas as datas
      datasUnicas.value.forEach(d => {
        agrupado[conta][`data_${d}`] = 0
      })
    }
    
    agrupado[conta][dataKey] = (agrupado[conta][dataKey] || 0) + despesa.valor
    agrupado[conta].total += despesa.valor
  })
  
  return Object.values(agrupado)
}

// Calcula total de despesas por data
const calcularTotalPorData = (despesas, data) => {
  return despesas
    .filter(d => d.dtvencimento === data)
    .reduce((sum, d) => sum + d.valor, 0)
}

// ========== EXPORTAÇÃO E IMPRESSÃO ==========

// Modal de Exportação/Impressão
const modalExportacaoAberto = ref(false)

// Modal de Preview do PDF
const modalPreviewPDF = ref(false)
const previewHTMLContent = ref('')
const dadosPDFAtual = ref(null)

const abrirModalExportacao = () => {
  if (debitosPorCentroCusto.value.length === 0) {
    toast.warning('Nenhum débito para exportar. Aplique filtros primeiro.')
    return
  }
  modalExportacaoAberto.value = true
}

// Preparar dados para o template de impressão
const prepararDadosParaImpressao = () => {
  return debitosPorCentroCusto.value.map(ccusto => ({
    centroCusto: ccusto.centroCusto,
    total: ccusto.total,
    despesas: agruparDespesasPorConta(ccusto.despesas).map(d => ({
      descricao: d.conta,
      total: d.total,
      ...Object.fromEntries(
        datasUnicas.value.map(data => [`data_${data}`, d[`data_${data}`] || 0])
      )
    }))
  }))
}

// Função para exportar PDF (abre preview primeiro)
const handleExportarPDF = async ({ nomeRelatorio }) => {
  try {
    const dadosFormatados = prepararDadosParaImpressao()

    if (!dadosFormatados || dadosFormatados.length === 0) {
      toast.warning('Nenhum dado para exportar')
      return
    }

    console.log('📄 Preparando preview do PDF:', dadosFormatados.length, 'centros de custo')

    // Gerar HTML com os dados
    const htmlContent = gerarHTMLCentroCusto('Débitos Realizados', dadosFormatados, filtros, datasUnicas.value)

    if (!htmlContent) {
      toast.error('Erro ao gerar conteúdo do PDF')
      return
    }

    // Extrair o conteúdo do body e os estilos para o preview
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlContent, 'text/html')

    const styleContent = doc.querySelector('style')?.textContent || ''
    const bodyContent = doc.body.innerHTML

    previewHTMLContent.value = `<style>${styleContent}</style>${bodyContent}`
    dadosPDFAtual.value = { nomeRelatorio: nomeRelatorio || 'Débitos_Realizados' }

    modalPreviewPDF.value = true

  } catch (err) {
    console.error('❌ Erro ao preparar PDF:', err)
    toast.error('Erro ao preparar PDF')
  }
}

// Função para exportar CSV
const handleExportarCSV = ({ nomeRelatorio }) => {
  try {
    if (debitosPorCentroCusto.value.length === 0) {
      toast.warning('Nenhum dado para exportar')
      return
    }

    // Cabeçalhos
    const cabecalhos = ['Centro de Custo', ...datasUnicas.value.map(d => formatarDataCurta(d)), 'Total']
    const linhas = [cabecalhos.map(h => `"${h}"`).join(',')]

    debitosPorCentroCusto.value.forEach(item => {
      const valores = [
        `"${item.centroCusto}"`,
        ...datasUnicas.value.map(d => `"${formatarMoeda(item[`data_${d}`] || 0)}"`),
        `"${formatarMoeda(item.total)}"`
      ]
      linhas.push(valores.join(','))
    })

    // Linha de totais
    linhas.push([
      '"TOTAL GERAL"',
      ...datasUnicas.value.map(d => `"${formatarMoeda(totaisPorData.value[`data_${d}`] || 0)}"`),
      `"${formatarMoeda(totalDebitos.value)}"`
    ].join(','))

    const csv = linhas.join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${nomeRelatorio.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success('CSV exportado com sucesso!')
  } catch (err) {
    console.error('❌ Erro ao exportar CSV:', err)
    toast.error('Erro ao exportar CSV')
  }
}

// Função para exportar Excel
const handleExportarExcel = ({ nomeRelatorio }) => {
  try {
    if (debitosPorCentroCusto.value.length === 0) {
      toast.warning('Nenhum dado para exportar')
      return
    }

    const cabecalhos = ['Centro de Custo', ...datasUnicas.value.map(d => formatarDataCurta(d)), 'Total']
    const linhas = [cabecalhos.join('\t')]

    debitosPorCentroCusto.value.forEach(item => {
      const valores = [
        item.centroCusto,
        ...datasUnicas.value.map(d => formatarMoeda(item[`data_${d}`] || 0)),
        formatarMoeda(item.total)
      ]
      linhas.push(valores.join('\t'))
    })

    // Linha de totais
    linhas.push([
      'TOTAL GERAL',
      ...datasUnicas.value.map(d => formatarMoeda(totaisPorData.value[`data_${d}`] || 0)),
      formatarMoeda(totalDebitos.value)
    ].join('\t'))

    const BOM = '\uFEFF'
    const blob = new Blob([BOM + linhas.join('\n')], { type: 'application/vnd.ms-excel;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${nomeRelatorio.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.xlsx`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success('Excel exportado com sucesso!')
  } catch (err) {
    console.error('❌ Erro ao exportar Excel:', err)
    toast.error('Erro ao exportar Excel')
  }
}

// Função para imprimir
const handleImprimir = ({ nomeRelatorio }) => {
  try {
    // Usar dados RAW da API
    if (!debitosRealizados.value || debitosRealizados.value.length === 0) {
      toast.warning('Nenhum dado para imprimir')
      return
    }

    abrirImpressaoCentroCusto(nomeRelatorio || 'Débitos Realizados', debitosRealizados.value, filtros)
  } catch (err) {
    console.error('❌ Erro ao imprimir:', err)
    toast.error('Erro ao imprimir')
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
</style>

