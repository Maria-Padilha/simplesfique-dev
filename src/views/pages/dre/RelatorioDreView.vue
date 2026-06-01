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
                <v-col cols="12" md="4">
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
                <v-col cols="12" md="4">
                  <v-select
                      v-model="filtros.tipoPeriodo"
                      :items="tiposPeriodo"
                      label="Tipo de Período"
                      variant="outlined"
                      density="comfortable"
                      prepend-inner-icon="mdi-calendar-range"
                      :rules="[v => !!v || 'Selecione o tipo de período']"
                      @update:model-value="atualizarCamposPorPeriodo"
                  ></v-select>
                </v-col>

                <!-- Regime -->
                <v-col cols="12" md="4">
                  <v-select
                      v-model="filtros.regime"
                      :items="regimesDisponiveis"
                      label="Regime *"
                      variant="outlined"
                      density="comfortable"
                      prepend-inner-icon="mdi-calendar-check"
                      :rules="[v => !!v || 'Selecione o regime']"
                      hint="Define como os valores serão calculados"
                      persistent-hint
                  >
                    <template #item="{ props, item }">
                      <v-list-item v-bind="props">
                        <template #prepend>
                          <v-icon 
                            :icon="item.raw.icon" 
                            :color="item.raw.color"
                            class="mr-2"
                          ></v-icon>
                        </template>
                      </v-list-item>
                    </template>
                  </v-select>
                </v-col>

                <!-- Ano -->
                <v-col cols="12" md="4">
                  <v-text-field
                      v-model.number="filtros.ano"
                      label="Ano *"
                      type="number"
                      variant="outlined"
                      density="comfortable"
                      prepend-inner-icon="mdi-calendar"
                      :rules="[
                        v => !!v || 'Informe o ano',
                        v => v >= 2000 && v <= 2100 || 'Ano inválido'
                      ]"
                  ></v-text-field>
                </v-col>

                <!-- Mês (Apenas para Mensal) -->
                <v-col v-if="filtros.tipoPeriodo === 'Mensal'" cols="12" md="4">
                  <v-select
                      v-model="filtros.mes"
                      :items="mesesDisponiveis"
                      label="Mês *"
                      variant="outlined"
                      density="comfortable"
                      prepend-inner-icon="mdi-calendar-month"
                      :rules="[v => !!v || 'Selecione o mês']"
                      @update:model-value="atualizarDatasMensal"
                  ></v-select>
                </v-col>

                <!-- Trimestre (Apenas para Trimestral) -->
                <v-col v-if="filtros.tipoPeriodo === 'Trimestral'" cols="12" md="4">
                  <v-select
                      v-model="filtros.trimestre"
                      :items="trimestresDisponiveis"
                      label="Trimestre *"
                      variant="outlined"
                      density="comfortable"
                      prepend-inner-icon="mdi-calendar-clock"
                      :rules="[v => !!v || 'Selecione o trimestre']"
                      @update:model-value="atualizarDatasTrimestral"
                  ></v-select>
                </v-col>

                <!-- Semestre (Apenas para Semestral) -->
                <v-col v-if="filtros.tipoPeriodo === 'Semestral'" cols="12" md="4">
                  <v-select
                      v-model="filtros.semestre"
                      :items="semestresDisponiveis"
                      label="Semestre *"
                      variant="outlined"
                      density="comfortable"
                      prepend-inner-icon="mdi-calendar-multiple"
                      :rules="[v => !!v || 'Selecione o semestre']"
                      @update:model-value="atualizarDatasSemestral"
                  ></v-select>
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
                <v-card-text class="pa-3">
                  <v-row dense>
                    <v-col cols="12" md="4">
                      <div class="d-flex align-center">
                        <v-icon icon="mdi-chart-timeline" size="small" class="mr-2" color="var(--text-color-laranja)"></v-icon>
                        <span class="text-caption text-grey">Regime:</span>
                        <span class="text-body-2 ml-2 font-weight-medium">
                          {{ filtros.regime === 1 ? 'Competência' : 'Caixa' }}
                        </span>
                      </div>
                    </v-col>
                    <v-col cols="12" md="4">
                      <div class="d-flex align-center">
                        <v-icon icon="mdi-calendar" size="small" class="mr-2" color="var(--text-color-laranja)"></v-icon>
                        <span class="text-caption text-grey">Período:</span>
                        <span class="text-body-2 ml-2 font-weight-medium">
                          {{ getPeriodoFormatado() }}
                        </span>
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
                      <td class="text-right font-weight-bold" :class="getValorClass(grupo.valor, grupo.natureza)">
                        {{ formatarValor(aplicarSinalVisual(grupo.valor, grupo.natureza)) }}
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
                      <td class="text-right text-body-2" :class="getValorClass(categoria.valor, grupo.natureza)">
                        {{ formatarValor(aplicarSinalVisual(categoria.valor, grupo.natureza)) }}
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
import { useDreStore } from '@/stores/APIs/dre'
import { toast } from 'vue3-toastify'
import TopAllPages from '@/components/base/padrao-paginas/TopAllPages.vue'
import { imprimirRelatorioDRE } from '@/components/impressos/dre.js'

const themeStore = useThemeStore()
const financeiroStore = useFinanceiroStore()
const dreStore = useDreStore()

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
  regime: 1, // 1=Competência (padrão), 2=Caixa
  ano: new Date().getFullYear(),
  mes: new Date().getMonth() + 1,
  trimestre: null,
  semestre: null,
  dataInicial: '',
  dataFinal: ''
})

// Modelos disponíveis
const modelosDisponiveis = ref([])

// Regimes disponíveis
const regimesDisponiveis = [
  { 
    title: 'Competência', 
    value: 1,
    icon: 'mdi-calendar-check',
    color: 'success'
  },
  { 
    title: 'Caixa', 
    value: 2,
    icon: 'mdi-cash',
    color: 'primary'
  }
]

// Meses disponíveis
const mesesDisponiveis = [
  { title: 'Janeiro', value: 1 },
  { title: 'Fevereiro', value: 2 },
  { title: 'Março', value: 3 },
  { title: 'Abril', value: 4 },
  { title: 'Maio', value: 5 },
  { title: 'Junho', value: 6 },
  { title: 'Julho', value: 7 },
  { title: 'Agosto', value: 8 },
  { title: 'Setembro', value: 9 },
  { title: 'Outubro', value: 10 },
  { title: 'Novembro', value: 11 },
  { title: 'Dezembro', value: 12 }
]

// Trimestres disponíveis
const trimestresDisponiveis = [
  { title: '1º Trimestre (Jan-Mar)', value: 1, mesInicial: 1, mesFinal: 3 },
  { title: '2º Trimestre (Abr-Jun)', value: 2, mesInicial: 4, mesFinal: 6 },
  { title: '3º Trimestre (Jul-Set)', value: 3, mesInicial: 7, mesFinal: 9 },
  { title: '4º Trimestre (Out-Dez)', value: 4, mesInicial: 10, mesFinal: 12 }
]

// Semestres disponíveis
const semestresDisponiveis = [
  { title: '1º Semestre (Jan-Jun)', value: 1, mesInicial: 1, mesFinal: 6 },
  { title: '2º Semestre (Jul-Dez)', value: 2, mesInicial: 7, mesFinal: 12 }
]

// Tipos de período
const tiposPeriodo = [
  { title: 'Mensal', value: 'Mensal' },
  { title: 'Trimestral', value: 'Trimestral' },
  { title: 'Semestral', value: 'Semestral' },
  { title: 'Anual', value: 'Anual' }
]

// Nome do modelo selecionado
const modeloSelecionadoNome = computed(() => {
  if (!filtros.modeloId) return ''
  const modelo = modelosDisponiveis.value.find(m => m.value === filtros.modeloId)
  return modelo?.title || ''
})

// Métodos de formatação
const getPeriodoFormatado = () => {
  switch (filtros.tipoPeriodo) {
    case 'Mensal':
      return `${mesesDisponiveis.find(m => m.value === filtros.mes)?.title}/${filtros.ano}`
    case 'Trimestral':
      return `${trimestresDisponiveis.find(t => t.value === filtros.trimestre)?.title}/${filtros.ano}`
    case 'Semestral':
      return `${semestresDisponiveis.find(s => s.value === filtros.semestre)?.title}/${filtros.ano}`
    case 'Anual':
      return `${filtros.ano}`
    default:
      return ''
  }
}

const formatarValor = (valor) => {
  if (valor === null || valor === undefined) return 'R$ 0,00'
  
  const num = parseFloat(valor)
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(num)
}

// Aplicar sinal visual baseado na natureza (apenas para exibição)
const aplicarSinalVisual = (valor, natureza) => {
  if (natureza === '-') {
    // Despesas: mostrar como negativo
    return -Math.abs(valor)
  }
  // Receitas e totalizadores: manter o valor original
  return valor
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

const getValorClass = (valor, natureza) => {
  // Se for despesa, sempre vermelho
  if (natureza === '-') return 'text-error'
  
  // Para receitas e totalizadores, usar o valor
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

// Atualizar campos baseado no tipo de período
const atualizarCamposPorPeriodo = () => {
  const ano = filtros.ano || new Date().getFullYear()
  
  switch (filtros.tipoPeriodo) {
    case 'Mensal':
      if (!filtros.mes) filtros.mes = new Date().getMonth() + 1
      atualizarDatasMensal()
      break
      
    case 'Trimestral':
      if (!filtros.trimestre) filtros.trimestre = Math.ceil((new Date().getMonth() + 1) / 3)
      atualizarDatasTrimestral()
      break
      
    case 'Semestral':
      if (!filtros.semestre) filtros.semestre = new Date().getMonth() < 6 ? 1 : 2
      atualizarDatasSemestral()
      break
      
    case 'Anual':
      // Ano inteiro: 01/01 a 31/12
      filtros.dataInicial = `${ano}-01-01`
      filtros.dataFinal = `${ano}-12-31`
      filtros.mes = 1 // Janeiro representa o ano todo para a API
      break
  }
}

// Atualizar datas para período mensal
const atualizarDatasMensal = () => {
  if (!filtros.ano || !filtros.mes) return
  
  const primeiroDia = new Date(filtros.ano, filtros.mes - 1, 1)
  const ultimoDia = new Date(filtros.ano, filtros.mes, 0)
  
  filtros.dataInicial = primeiroDia.toISOString().split('T')[0]
  filtros.dataFinal = ultimoDia.toISOString().split('T')[0]
}

// Atualizar datas para período trimestral
const atualizarDatasTrimestral = () => {
  if (!filtros.ano || !filtros.trimestre) return
  
  const trimestre = trimestresDisponiveis.find(t => t.value === filtros.trimestre)
  if (!trimestre) return
  
  const primeiroDia = new Date(filtros.ano, trimestre.mesInicial - 1, 1)
  const ultimoDia = new Date(filtros.ano, trimestre.mesFinal, 0)
  
  filtros.dataInicial = primeiroDia.toISOString().split('T')[0]
  filtros.dataFinal = ultimoDia.toISOString().split('T')[0]
  
  // Atualizar mês para o primeiro mês do trimestre (para a API)
  filtros.mes = trimestre.mesInicial
}

// Atualizar datas para período semestral
const atualizarDatasSemestral = () => {
  if (!filtros.ano || !filtros.semestre) return
  
  const semestre = semestresDisponiveis.find(s => s.value === filtros.semestre)
  if (!semestre) return
  
  const primeiroDia = new Date(filtros.ano, semestre.mesInicial - 1, 1)
  const ultimoDia = new Date(filtros.ano, semestre.mesFinal, 0)
  
  filtros.dataInicial = primeiroDia.toISOString().split('T')[0]
  filtros.dataFinal = ultimoDia.toISOString().split('T')[0]
  
  // Atualizar mês para o primeiro mês do semestre (para a API)
  filtros.mes = semestre.mesInicial
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
    
    // Buscar dados da empresa
    const empresaSelecionada = JSON.parse(localStorage.getItem('empresaSelecionada') || '{}')
    const idEmpresa = empresaSelecionada?.id || localStorage.getItem('empresa')

    if (!idEmpresa) {
      toast.error('Empresa não identificada')
      return
    }

    // Buscar movimentações de DRE
    const movimentacoes = await dreStore.buscarMovimentacoesDRE({
      id: filtros.modeloId,
      idEmpresa: parseInt(idEmpresa),
      idAno: filtros.ano,
      idMes: filtros.mes,
      regime: filtros.regime
    })

    console.log('[DRE Relatório] Movimentações recebidas:', movimentacoes)
    
    // Processar dados do relatório
    dadosRelatorio.value = processarDadosDRE(movimentacoes)

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

// Processar dados da API para o formato do relatório
const processarDadosDRE = (movimentacoes) => {
  if (!Array.isArray(movimentacoes) || movimentacoes.length === 0) {
    return []
  }

  // Agrupar movimentações por ID e descdredetalhe
  const gruposMap = {}
  
  movimentacoes.forEach(mov => {
    const grupoId = mov.id
    const nomeGrupo = mov.descdredetalhe
    
    if (!gruposMap[grupoId]) {
      gruposMap[grupoId] = {
        id: grupoId,
        nome: nomeGrupo,
        tipo: getTipoGrupo(mov.natureza),
        natureza: mov.natureza,
        natureza_formula: mov.natureza_formula,
        categorias: [],
        valor: 0
      }
    }

    // Adicionar categoria apenas se houver classificador (não é totalizador)
    if (mov.id_classificador && mov.descconta) {
      const valor = calcularValorMovimentacao(mov)
      
      gruposMap[grupoId].categorias.push({
        nome: mov.descconta,
        classificador: mov.id_classificador,
        valor: valor
      })
      
      // Somar ao valor do grupo
      gruposMap[grupoId].valor += valor
    }
  })

  // Converter map para array ordenado por ID
  const grupos = Object.values(gruposMap).sort((a, b) => a.id - b.id)
  
  // Calcular totalizadores (grupos com natureza "=")
  grupos.forEach(grupo => {
    if (grupo.natureza === '=' && grupo.natureza_formula) {
      grupo.valor = calcularFormula(grupo.natureza_formula, gruposMap)
    }
  })

  return grupos
}

// Determinar tipo do grupo baseado na natureza
const getTipoGrupo = (natureza) => {
  switch (natureza) {
    case '+':
      return 'RECEITA'
    case '-':
      return 'DESPESA'
    case '=':
      return 'TOTALIZADOR'
    default:
      return 'OUTROS'
  }
}

// Calcular valor da movimentação
const calcularValorMovimentacao = (mov) => {
  // Se tem crédito, usar crédito (receitas)
  if (mov.credito !== null && mov.credito !== undefined) {
    return parseFloat(mov.credito) || 0
  }
  
  // Se tem débito, usar débito positivo (despesas - sem inverter o sinal)
  if (mov.debito !== null && mov.debito !== undefined) {
    return parseFloat(mov.debito) || 0
  }
  
  // Se tem saldo, usar saldo
  if (mov.saldo !== null && mov.saldo !== undefined) {
    return parseFloat(mov.saldo) || 0
  }
  
  return 0
}

// Calcular fórmula de totalizadores (ex: "1 - 2" = grupo 1 menos grupo 2)
const calcularFormula = (formula, gruposMap) => {
  if (!formula) return 0
  
  try {
    // Substituir IDs dos grupos pelos seus valores
    let expressao = formula
    
    // Pegar todos os IDs únicos da fórmula
    const idsNaFormula = formula.match(/\d+/g) || []
    
    idsNaFormula.forEach(id => {
      const idNum = parseInt(id)
      const grupo = gruposMap[idNum]
      
      if (grupo) {
        // Substituir todas as ocorrências deste ID pelo valor do grupo
        const regex = new RegExp(`\\b${id}\\b`, 'g')
        expressao = expressao.replace(regex, `(${grupo.valor})`)
      }
    })
    
    console.log('[DRE] Fórmula original:', formula)
    console.log('[DRE] Expressão calculada:', expressao)
    
    // Avaliar a expressão matemática (seguro)
    const resultado = (() => {
      const expr = String(expressao ?? '').replace(/,/g, '.')
      if (!/^[\d+\-*/().\s]+$/.test(expr)) {
        console.error('[DRE] Expressão inválida:', expressao)
        return 0
      }
      try {
        const fn = new Function(`return (${expr})`)
        const val = fn()
        return typeof val === 'number' && isFinite(val) ? val : 0
      } catch { return 0 }
    })()
    
    console.log('[DRE] Resultado:', resultado)
    
    return resultado
  } catch (error) {
    console.error('Erro ao calcular fórmula:', formula, error)
    return 0
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
    regime: filtros.regime,
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
  
  // Inicializar datas baseado no tipo de período padrão (Mensal)
  atualizarCamposPorPeriodo()
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

/* Texto da tabela */
.dre-table tbody tr td {
  color: var(--text-color) !important;
}

/* Linhas de Grupo */
.grupo-linha {
  font-size: 1rem;
  border-top: 2px solid rgba(var(--v-border-color), 0.3);
}

.grupo-linha td {
  color: var(--text-color) !important;
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

.categoria-linha td {
  color: var(--text-color) !important;
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

