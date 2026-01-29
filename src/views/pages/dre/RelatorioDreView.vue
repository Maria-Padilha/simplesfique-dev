<template>
  <top-all-pages icon="mdi-file-chart">
    <template #titulo>Relatório DRE</template>
    <template #acoes>
      <v-btn
          color="var(--text-color-laranja)"
          variant="flat"
          class="text-white"
          prepend-icon="mdi-file-pdf-box"
          @click="gerarRelatorio"
          :loading="gerando"
          :disabled="!formularioValido"
      >
        Gerar Relatório
      </v-btn>
    </template>
    <template #section>
      <div>
        <!-- Card de Filtros -->
        <v-card class="background-secondary mb-4" elevation="0">
          <v-card-title class="text-h6 pa-4">
            <v-icon icon="mdi-filter" class="mr-2"></v-icon>
            Parâmetros do Relatório
          </v-card-title>
          <v-card-text class="pa-4">
            <v-form ref="formRef" v-model="formularioValido">
              <v-row>
                <!-- Seletor de Modelo DRE -->
                <v-col cols="12" md="6">
                  <v-select
                      v-model="filtros.modeloId"
                      :items="modelosDisponiveis"
                      label="Modelo de DRE"
                      variant="outlined"
                      density="comfortable"
                      prepend-inner-icon="mdi-file-tree"
                      :loading="carregandoModelos"
                      :rules="[v => !!v || 'Selecione um modelo']"
                      hint="Escolha o modelo de DRE configurado"
                      persistent-hint
                  >
                    <template #item="{ props }">
                      <v-list-item v-bind="props">
                        <template #prepend>
                          <v-icon icon="mdi-file-chart-outline" class="mr-2" color="var(--text-color-laranja)"></v-icon>
                        </template>
                      </v-list-item>
                    </template>
                  </v-select>
                </v-col>

                <!-- Tipo de Período -->
                <v-col cols="12" md="6">
                  <v-select
                      v-model="filtros.tipoPeriodo"
                      :items="tiposPeriodo"
                      label="Tipo de Período"
                      variant="outlined"
                      density="comfortable"
                      prepend-inner-icon="mdi-calendar-range"
                      :rules="[v => !!v || 'Selecione o tipo de período']"
                  ></v-select>
                </v-col>

                <!-- Data Inicial -->
                <v-col cols="12" md="6">
                  <v-text-field
                      v-model="filtros.dataInicial"
                      label="Data Inicial"
                      type="date"
                      variant="outlined"
                      density="comfortable"
                      prepend-inner-icon="mdi-calendar-start"
                      :rules="[v => !!v || 'Informe a data inicial']"
                  ></v-text-field>
                </v-col>

                <!-- Data Final -->
                <v-col cols="12" md="6">
                  <v-text-field
                      v-model="filtros.dataFinal"
                      label="Data Final"
                      type="date"
                      variant="outlined"
                      density="comfortable"
                      prepend-inner-icon="mdi-calendar-end"
                      :rules="[
                        v => !!v || 'Informe a data final',
                        v => !filtros.dataInicial || v >= filtros.dataInicial || 'Data final deve ser maior ou igual à inicial'
                      ]"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>

        <!-- Card de Preview/Resultado -->
        <v-card :color="themeStore.darkMode ? 'text-white' : ''" class="background-secondary">
          <v-card-title class="text-h6 pa-4 d-flex justify-space-between align-center">
            <div>
              <v-icon icon="mdi-table-eye" class="mr-2"></v-icon>
              {{ relatorioGerado ? 'Resultado do DRE' : 'Prévia do Relatório' }}
            </div>
            <v-chip v-if="relatorioGerado" color="var(--text-color-laranja)" size="small">
              {{ modeloSelecionadoNome }}
            </v-chip>
          </v-card-title>

          <v-card-text class="pa-4">
            <!-- Estado Inicial -->
            <div v-if="!relatorioGerado && !gerando" class="text-center pa-12">
              <v-icon size="80" color="grey-lighten-1">mdi-chart-box-outline</v-icon>
              <p class="text-h6 mt-4 mb-2">Nenhum relatório gerado</p>
              <p class="text-body-2 text-grey">
                Selecione os parâmetros acima e clique em "Gerar Relatório" para visualizar o DRE
              </p>
            </div>

            <!-- Loading -->
            <div v-if="gerando" class="text-center pa-12">
              <v-progress-circular
                  indeterminate
                  color="var(--text-color-laranja)"
                  size="64"
              ></v-progress-circular>
              <p class="text-body-1 mt-4">Processando dados...</p>
            </div>

            <!-- Tabela de Resultados -->
            <div v-if="relatorioGerado && !gerando">
              <!-- Cabeçalho do Período -->
              <v-card class="background-card mb-4" elevation="0">
                <v-card-text class="background-cardpa-3">
                  <v-row dense>
                    <v-col cols="12" md="4">
                      <div class="d-flex align-center">
                        <v-icon icon="mdi-calendar-range" size="small" class="mr-2" color="var(--text-color-laranja)"></v-icon>
                        <span class="text-caption text-grey">Período:</span>
                        <span class="text-body-2 ml-2 font-weight-medium">
                          {{ formatarData(filtros.dataInicial) }} a {{ formatarData(filtros.dataFinal) }}
                        </span>
                      </div>
                    </v-col>
                    <v-col cols="12" md="4">
                      <div class="d-flex align-center">
                        <v-icon icon="mdi-chart-timeline" size="small" class="mr-2" color="var(--text-color-laranja)"></v-icon>
                        <span class="text-caption text-grey">Tipo:</span>
                        <span class="text-body-2 ml-2 font-weight-medium">{{ filtros.tipoPeriodo }}</span>
                      </div>
                    </v-col>
                    <v-col cols="12" md="4">
                      <div class="d-flex align-center">
                        <v-icon icon="mdi-update" size="small" class="mr-2" color="var(--text-color-laranja)"></v-icon>
                        <span class="text-caption text-grey">Gerado em:</span>
                        <span class="text-body-2 ml-2 font-weight-medium">{{ dataGeracao }}</span>
                      </div>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>

              <!-- Tabela DRE -->
              <v-table class="dre-table" density="comfortable">
                <thead>
                  <tr>
                    <th class="text-left font-weight-bold" style="width: 60%">Descrição</th>
                    <th class="text-right font-weight-bold" style="width: 40%">Valor (R$)</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="(grupo, index) in dadosRelatorio" :key="index">
                    <!-- Linha do Grupo -->
                    <tr 
                        :class="getLinhaClass(grupo.tipo)"
                        class="grupo-linha"
                    >
                      <td class="font-weight-bold">
                        <v-icon 
                            :icon="getGrupoIcon(grupo.tipo)" 
                            :color="getGrupoIconColor(grupo.tipo)"
                            size="small"
                            class="mr-2"
                        ></v-icon>
                        {{ grupo.nome }}
                      </td>
                      <td class="text-right font-weight-bold" :class="getValorClass(grupo.valor)">
                        {{ formatarValor(grupo.valor) }}
                      </td>
                    </tr>

                    <!-- Linhas das Categorias -->
                    <tr 
                        v-for="(categoria, catIndex) in grupo.categorias" 
                        :key="`cat-${index}-${catIndex}`"
                        class="categoria-linha"
                    >
                      <td class="pl-8">
                        <span class="text-body-2">{{ categoria.nome }}</span>
                        <v-chip size="x-small" variant="outlined" class="ml-2">
                          {{ categoria.classificador }}
                        </v-chip>
                      </td>
                      <td class="text-right text-body-2" :class="getValorClass(categoria.valor)">
                        {{ formatarValor(categoria.valor) }}
                      </td>
                    </tr>
                  </template>
                </tbody>
              </v-table>
            </div>
          </v-card-text>

          <!-- Ações do Relatório -->
          <v-card-actions v-if="relatorioGerado" class="pa-4">
            <v-spacer></v-spacer>
            <v-btn
                color="grey"
                variant="outlined"
                prepend-icon="mdi-printer"
                @click="imprimirRelatorio"
            >
              Imprimir
            </v-btn>
            <v-btn
                color="success"
                variant="outlined"
                prepend-icon="mdi-file-excel"
                @click="exportarExcel"
            >
              Exportar Excel
            </v-btn>
            <v-btn
                color="error"
                variant="outlined"
                prepend-icon="mdi-file-pdf-box"
                @click="exportarPDF"
            >
              Exportar PDF
            </v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </template>
  </top-all-pages>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useThemeStore } from '@/stores/config-temas/theme'
import { useFinanceiroStore } from '@/stores/APIs/financeiro'
import { toast } from 'vue3-toastify'
import TopAllPages from '@/components/base/padrao-paginas/TopAllPages.vue'
import { imprimirRelatorioDRE } from '@/components/impressos/dre.js'

const themeStore = useThemeStore()
const financeiroStore = useFinanceiroStore()

// Estado
const carregandoModelos = ref(false)
const gerando = ref(false)
const formularioValido = ref(false)
const formRef = ref(null)
const relatorioGerado = ref(false)
const dadosRelatorio = ref([])
const dataGeracao = ref('')

// Filtros
const filtros = reactive({
  modeloId: null,
  tipoPeriodo: 'Mensal',
  dataInicial: '',
  dataFinal: ''
})

// Modelos disponíveis
const modelosDisponiveis = ref([])

// Tipos de período
const tiposPeriodo = [
  { title: 'Mensal', value: 'Mensal' },
  { title: 'Trimestral', value: 'Trimestral' },
  { title: 'Semestral', value: 'Semestral' },
  { title: 'Anual', value: 'Anual' },
  { title: 'Personalizado', value: 'Personalizado' }
]

// Nome do modelo selecionado
const modeloSelecionadoNome = computed(() => {
  if (!filtros.modeloId) return ''
  const modelo = modelosDisponiveis.value.find(m => m.value === filtros.modeloId)
  return modelo?.title || ''
})

// Métodos de formatação
const formatarData = (data) => {
  if (!data) return ''
  const [ano, mes, dia] = data.split('-')
  return `${dia}/${mes}/${ano}`
}

const formatarValor = (valor) => {
  if (valor === null || valor === undefined) return 'R$ 0,00'
  
  const num = parseFloat(valor)
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(num)
}

// Métodos de estilo
const getLinhaClass = (tipo) => {
  switch (tipo) {
    case 'RECEITA':
      return themeStore.darkMode ? 'receita-dark' : 'receita-light'
    case 'DESPESA':
      return themeStore.darkMode ? 'despesa-dark' : 'despesa-light'
    case 'TOTALIZADOR':
      return themeStore.darkMode ? 'totalizador-dark' : 'totalizador-light'
    default:
      return ''
  }
}

const getValorClass = (valor) => {
  if (valor > 0) return 'text-success'
  if (valor < 0) return 'text-error'
  return ''
}

const getGrupoIcon = (tipo) => {
  switch (tipo) {
    case 'RECEITA':
      return 'mdi-cash-plus'
    case 'DESPESA':
      return 'mdi-cash-minus'
    case 'TOTALIZADOR':
      return 'mdi-calculator'
    default:
      return 'mdi-folder'
  }
}

const getGrupoIconColor = (tipo) => {
  switch (tipo) {
    case 'RECEITA':
      return 'success'
    case 'DESPESA':
      return 'error'
    case 'TOTALIZADOR':
      return 'var(--text-color-laranja)'
    default:
      return 'grey'
  }
}

// Carregar modelos disponíveis
const carregarModelos = async () => {
  carregandoModelos.value = true
  try {
    const modelos = await financeiroStore.buscarModelosDRE()
    modelosDisponiveis.value = modelos
    console.log('[DRE Relatório] Modelos carregados:', modelos)
  } catch (error) {
    console.error('[DRE Relatório] Erro ao carregar modelos:', error)
    toast.error('Erro ao carregar modelos de DRE')
  } finally {
    carregandoModelos.value = false
  }
}

// Gerar relatório
const gerarRelatorio = async () => {
  if (!formRef.value.validate()) {
    toast.warning('Preencha todos os campos obrigatórios')
    return
  }

  gerando.value = true
  try {
    console.log('[DRE Relatório] Gerando relatório com filtros:', filtros)
    
    // Buscar modelo completo
    const modelo = await financeiroStore.buscarModeloDRE(filtros.modeloId)
    
    if (!modelo || !modelo.grupos) {
      toast.error('Modelo DRE não encontrado ou inválido')
      return
    }

    // TODO: Aqui você vai fazer a requisição para buscar os dados contábeis
    // Por enquanto, vou simular os dados
    dadosRelatorio.value = modelo.grupos.map(grupo => ({
      nome: grupo.nome,
      tipo: grupo.tipo,
      valor: Math.random() * 10000 - 5000, // Valor simulado
      categorias: (grupo.categorias || []).map(cat => ({
        nome: cat.nome,
        classificador: cat.classificador,
        valor: Math.random() * 5000 - 2500 // Valor simulado
      }))
    }))

    dataGeracao.value = new Date().toLocaleString('pt-BR')
    relatorioGerado.value = true
    
    toast.success('Relatório gerado com sucesso!')
  } catch (error) {
    console.error('[DRE Relatório] Erro ao gerar relatório:', error)
    toast.error('Erro ao gerar relatório')
  } finally {
    gerando.value = false
  }
}

// Exportar/Imprimir
const imprimirRelatorio = () => {
  if (!relatorioGerado.value || !dadosRelatorio.value.length) {
    toast.warning('Gere o relatório antes de imprimir')
    return
  }

  // Buscar dados da empresa (você pode pegar do store ou API)
  const nomeEmpresa = localStorage.getItem('nomeEmpresa') || 'Nome da Empresa'
  const cnpjEmpresa = localStorage.getItem('cnpjEmpresa') || '00.000.000/0000-00'

  imprimirRelatorioDRE({
    nomeEmpresa,
    cnpjEmpresa,
    tituloDre: modeloSelecionadoNome.value,
    nomeModelo: modeloSelecionadoNome.value,
    dataInicial: filtros.dataInicial,
    dataFinal: filtros.dataFinal,
    tipoPeriodo: filtros.tipoPeriodo,
    dadosRelatorio: dadosRelatorio.value
  })
}

const exportarExcel = () => {
  toast.info('Exportação para Excel em desenvolvimento')
}

const exportarPDF = () => {
  toast.info('Exportação para PDF em desenvolvimento')
}

// Lifecycle
onMounted(async () => {
  await carregarModelos()
  
  // Definir datas padrão (mês atual)
  const hoje = new Date()
  const primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
  const ultimoDia = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0)
  
  filtros.dataInicial = primeiroDia.toISOString().split('T')[0]
  filtros.dataFinal = ultimoDia.toISOString().split('T')[0]
})
</script>

<style scoped>

.background-card {
  background-color: var(--background-card);
  color: var(--text-color);
}

/* Tabela DRE */
.dre-table {
  border: 1px solid rgba(var(--v-border-color), 0.12);
}

.dre-table thead tr {
  background-color: var(--text-color-laranja);
}

.dre-table thead th {
  color: white !important;
  font-weight: 700 !important;
}

/* Linhas de Grupo */
.grupo-linha {
  font-size: 1rem;
  border-top: 2px solid rgba(var(--v-border-color), 0.3);
}

.receita-light {
  background-color: #f1f8f4 !important;
}

.receita-dark {
  background-color: rgba(76, 175, 80, 0.15) !important;
}

.despesa-light {
  background-color: #fff3f3 !important;
}

.despesa-dark {
  background-color: rgba(244, 67, 54, 0.15) !important;
}

.totalizador-light {
  background-color: #fff5f0 !important;
}

.totalizador-dark {
  background-color: rgba(255, 152, 0, 0.15) !important;
}

/* Linhas de Categoria */
.categoria-linha {
  opacity: 0.9;
}

.categoria-linha:hover {
  background-color: rgba(var(--text-color-laranja), 0.05) !important;
}

/* Classes de valor */
.text-success {
  color: #4caf50 !important;
  font-weight: 600;
}

.text-error {
  color: #f44336 !important;
  font-weight: 600;
}

/* Modo escuro */
:deep(.v-table) {
  background-color: transparent;
}

:deep(.v-table__wrapper) {
  background-color: var(--background-card);
}

/* Print styles */
@media print {
  .v-card-actions,
  .v-btn {
    display: none !important;
  }
  
  .dre-table {
    border: 1px solid #000;
  }
  
  .grupo-linha {
    border-top: 2px solid #000;
  }
}
</style>
