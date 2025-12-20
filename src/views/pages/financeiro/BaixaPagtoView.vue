<template>
  <div class="pa-4">
    <!-- Cabeçalho -->
    <v-card class="background-secondary mb-4">
      <v-card-title class="text-h5 pa-4 d-flex justify-space-between align-center">
        <div class="d-flex align-center">
          <v-icon icon="mdi-cash-minus" class="mr-3"></v-icon>
          Baixa de Pagamentos
        </div>
      </v-card-title>
    </v-card>

    <!-- Card com Total das Parcelas e Ações de Baixa -->
    <v-card class="background-secondary mb-4" elevation="2">
      <v-card-text class="pa-4">
        <div class="d-flex justify-space-between align-items-center">
          <div>
            <h4 class="text-h6 mb-2">Resumo Financeiro</h4>
            <p class="text-body-1 mb-1">
              Total de parcelas: <strong>{{ contasPagar.length }}</strong>
            </p>
            <p class="text-body-1 mb-1">
              Valor total: <strong>{{ formatarMoeda(totalParcelasFiltradas) }}</strong>
            </p>
            <p class="text-body-1">
              Selecionados: <strong>{{ contasSelecionadas.length }}</strong> | 
              Valor selecionado: <strong>{{ formatarMoeda(valorSelecionado) }}</strong>
            </p>
          </div>
          <div class="d-flex flex-column ga-2">
            <v-btn
              color="var(--text-color-laranja)"
              :disabled="contasSelecionadas.length === 0"
              :loading="loadingBaixa"
              @click="confirmarBaixaPagamento"
              variant="flat"
              class="text-white"
              prepend-icon="mdi-cash-minus"
            >
              Baixar {{ contasSelecionadas.length }} Pagamento(s)
            </v-btn>
            <v-btn
              variant="text"
              color="grey"
              :disabled="contasSelecionadas.length === 0"
              @click="limparSelecoes"
              size="small"
            >
              Limpar Seleção
            </v-btn>
          </div>
        </div>
      </v-card-text>
    </v-card>

    <!-- Lista de Contas a Pagar -->
    <v-card :color="themeStore.darkMode ? 'text-white' : ''" class="background-secondary">
      <v-card-text class="pa-4">
        <!-- Busca Avançada -->
        <BuscaAvancada
          entidade="contaspagar"
          @aplicar="aplicarFiltrosAvancados"
        />

        <!-- Tabela de Contas a Pagar -->
        <TabelaPadrao
          :headers="headers"
          :items="contasPagarFiltradas"
          :loading="loading"
          :search="search"
          @update:search="(value) => search = value"
          search-label="Pesquisar contas a pagar"
          item-key="id"
          no-data-icon="mdi-cash-minus-outline"
          no-data-text="Nenhuma conta a pagar encontrada para baixa"
          :hide-delete-action="true"
          :hide-edit-action="true"
          :show-custom-action="false"
        >
          <!-- Checkbox de seleção -->
          <template v-slot:[`item.checkbox`]="{ item }">
            <v-checkbox
              v-model="contasSelecionadas"
              :value="item"
              hide-details
              density="compact"
              color="var(--text-color-laranja)"
            />
          </template>

          <!-- Checkbox no cabeçalho para selecionar todos -->
          <template v-slot:[`header.checkbox`]>
            <v-checkbox
              v-model="todosSelecionados"
              @update:model-value="toggleTodosSelecionados"
              hide-details
              density="compact"
              color="var(--text-color-laranja)"
              :indeterminate="contasSelecionadas.length > 0 && contasSelecionadas.length < contasPagarFiltradas.length"
            />
          </template>

          <!-- Formatação da data de vencimento -->
          <template v-slot:[`item.dtvencimento`]="{ item }">
            <span :class="{ 'text-red': isVencido(item.dtvencimento) }">
              {{ item.dtvencimento ? new Date(item.dtvencimento).toLocaleDateString('pt-BR') : '--' }}
            </span>
          </template>

          <!-- Formatação do valor da parcela -->
          <template v-slot:[`item.vlrparcela`]="{ item }">
            {{ formatarMoeda(item.vlrparcela) }}
          </template>

          <!-- Formatação dos juros -->
          <template v-slot:[`item.juros`]="{ item }">
            {{ formatarMoeda(item.juros || 0) }}
          </template>

          <!-- Formatação da multa -->
          <template v-slot:[`item.multa`]="{ item }">
            {{ formatarMoeda(item.multa || 0) }}
          </template>

          <!-- Formatação do desconto -->
          <template v-slot:[`item.desconto`]="{ item }">
            {{ formatarMoeda(item.desconto || 0) }}
          </template>

          <!-- Formatação do valor quitado -->
          <template v-slot:[`item.vlrquitado`]="{ item }">
            {{ formatarMoeda(item.vlrquitado) }}
          </template>

          <!-- Formatação do saldo devedor -->
          <template v-slot:[`item.saldo_devedor`]="{ item }">
            {{ formatarMoeda(item.saldo_devedor) }}
          </template>

          <!-- Formatação do valor liberado -->
          <template v-slot:[`item.vlrliberado`]="{ item }">
            {{ formatarMoeda(item.vlrliberado || 0) }}
          </template>
        </TabelaPadrao>
      </v-card-text>
    </v-card>

    <!-- Dialog de Confirmação de Baixa -->
    <v-dialog 
      v-model="dialogBaixa.aberto"
      max-width="600px"
      persistent
    >
      <v-card class="background-card">
        <v-card-title class="text-h6 pa-4">
          <v-icon icon="mdi-cash-minus" class="mr-2"></v-icon>
          Confirmar Baixa de Pagamentos
        </v-card-title>
        
        <v-card-text class="pa-4">
          <div class="mb-4">
            <p class="text-body-1 mb-2">
              Você está prestes a realizar a baixa de <strong>{{ contasSelecionadas.length }}</strong> pagamento(s).
            </p>
            <p class="text-body-1 mb-3">
              Valor total: <strong>{{ formatarMoeda(valorSelecionado) }}</strong>
            </p>
          </div>

          <v-form ref="formBaixaRef" v-model="formBaixaValido">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formBaixa.dtpagamento"
                  label="Data do Pagamento"
                  type="date"
                  :rules="[rules.required]"
                  variant="outlined"
                  density="comfortable"
                  required
                />
              </v-col>
              
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formBaixa.vlrpago"
                  label="Valor Pago Total"
                  :rules="[rules.required, rules.currency]"
                  variant="outlined"
                  density="comfortable"
                  prefix="R$"
                  required
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <v-textarea
                  v-model="formBaixa.observacao"
                  label="Observação da Baixa"
                  variant="outlined"
                  density="comfortable"
                  rows="3"
                  placeholder="Informações adicionais sobre o pagamento..."
                />
              </v-col>
            </v-row>
          </v-form>

          <div class="mt-4">
            <h6 class="text-subtitle-1 mb-2">Contas selecionadas:</h6>
            <div class="max-height-200 overflow-y-auto">
              <v-list density="compact" class="background-card">
                <v-list-item
                  v-for="conta in contasSelecionadas"
                  :key="conta.id"
                  class="px-2"
                >
                  <v-list-item-title class="text-body-2">
                    {{ conta.nrdocumento }} - {{ conta.fornecedor }} - {{ formatarMoeda(conta.vlrparcela) }}
                  </v-list-item-title>
                  <v-list-item-subtitle class="text-caption">
                    Venc: {{ new Date(conta.dtvencimento).toLocaleDateString('pt-BR') }}
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </div>
          </div>
        </v-card-text>
        
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn 
            color="grey" 
            variant="text" 
            @click="dialogBaixa.aberto = false"
            :disabled="loadingBaixa"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="var(--text-color-laranja)"
            :loading="loadingBaixa"
            :disabled="!formBaixaValido"
            @click="executarBaixaPagamento"
            variant="flat"
            class="text-white"
          >
            Confirmar Baixa
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar para feedback -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
    >
      {{ snackbar.message }}
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useThemeStore } from '@/stores/config-temas/theme'
import { useFinanceiroStore } from '@/stores/APIs/financeiro'
import TabelaPadrao from '@/components/base/padrao-paginas/TabelaPadrao.vue'
import BuscaAvancada from '@/components/base/padrao-paginas/BuscaAvancada.vue'

const themeStore = useThemeStore()
const financeiroStore = useFinanceiroStore()

// Refs
const search = ref('')
const loading = ref(false)
const loadingBaixa = ref(false)
const filtrosAvancados = ref({}) // Remover filtro inicial baixado='N'

// Estado dos dados
const contasPagar = ref([])
const contasSelecionadas = ref([])
const todosSelecionados = ref(false)

// Dialog de confirmação de baixa
const dialogBaixa = reactive({
  aberto: false
})

// Form de baixa
const formBaixaRef = ref(null)
const formBaixaValido = ref(false)
const formBaixa = reactive({
  dtpagamento: new Date().toISOString().substr(0, 10), // Data atual
  vlrpago: 0,
  observacao: ''
})

// Snackbar
const snackbar = reactive({
  show: false,
  message: '',
  color: 'success'
})

// ID da empresa (temporário - deve vir do contexto/autenticação)
const idEmpresa = ref(1)

// Headers da tabela - incluindo checkbox e colunas conforme solicitado
const headers = computed(() => {
  const baseHeaders = [
    { title: '', key: 'checkbox', sortable: false, width: '60px' },
    { title: 'DT Vencimento', key: 'dtvencimento', sortable: true },
    { title: 'Nr Documento', key: 'nrdocumento', sortable: true },
    { title: 'Nr Parcela', key: 'id_pagparcela', sortable: true },
    { title: 'Filial', key: 'filial', sortable: true },
    { title: 'Vlr Parcela', key: 'vlrparcela', sortable: true },
    { title: 'Juros', key: 'juros', sortable: true },
    { title: 'Multa', key: 'multa', sortable: true },
    { title: 'Desconto', key: 'desconto', sortable: true },
    { title: 'Vlr Quitado', key: 'vlrquitado', sortable: true },
    { title: 'Vlr Saldo', key: 'saldo_devedor', sortable: true },
    { title: 'Vlr Liberado', key: 'vlrliberado', sortable: true },
    { title: 'Fornecedor', key: 'fornecedor', sortable: true }
  ]

  return baseHeaders
})

// Regras de validação
const rules = {
  required: (value) => !!value || 'Campo obrigatório',
  currency: (value) => {
    if (!value) return true
    return !isNaN(parseFloat(value)) || 'Valor deve ser numérico'
  }
}

// Computed
const contasPagarFiltradas = computed(() => {
  const dados = contasPagar.value || []
  if (!Array.isArray(dados)) return []
  
  // Toda filtragem é feita pela API
  return dados
})

// Calcular o valor total das parcelas filtradas
const totalParcelasFiltradas = computed(() => {
  return contasPagarFiltradas.value.reduce((total, item) => {
    const valor = parseFloat(item.vlrparcela || 0)
    return total + valor
  }, 0)
})

// Calcular valor total das contas selecionadas
const valorSelecionado = computed(() => {
  return contasSelecionadas.value.reduce((total, item) => {
    const valor = parseFloat(item.vlrparcela || 0)
    return total + valor
  }, 0)
})

// Watchers
watch(valorSelecionado, (novoValor) => {
  formBaixa.vlrpago = novoValor.toFixed(2)
})

watch(() => contasSelecionadas.value.length, (novaQtd) => {
  if (novaQtd === 0) {
    todosSelecionados.value = false
  } else if (novaQtd === contasPagarFiltradas.value.length) {
    todosSelecionados.value = true
  }
})

// Função para formatação monetária brasileira
const formatarMoeda = (valor) => {
  if (!valor && valor !== 0) return 'R$ 0,00'
  
  const numero = parseFloat(valor)
  if (isNaN(numero)) return 'R$ 0,00'
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numero)
}



// Verificar se uma conta está vencida
const isVencido = (dataVencimento) => {
  if (!dataVencimento) return false
  const hoje = new Date()
  const vencimento = new Date(dataVencimento)
  return vencimento < hoje
}

// Métodos
const carregarContasPagar = async (filtrosApi = null) => {
  try {
    loading.value = true
    
    console.log('🔍 Carregando contas a pagar com filtros:', filtrosApi)
    
    // Verificar se há pelo menos um filtro válido
    const temFiltros = filtrosApi && Object.keys(filtrosApi).length > 0
    if (!temFiltros) {
      console.log('❌ Busca não executada: nenhum filtro aplicado')
      contasPagar.value = []
      mostrarMensagem('Aplique pelo menos um filtro para buscar as contas', 'info')
      return
    }
    
    const dados = await financeiroStore.buscarContasPagar(
      idEmpresa.value,
      filtrosApi
    )
    
    contasPagar.value = dados?.map(item => ({
      ...item,
      vlrparcela: parseFloat(item.vlrparcela || 0),
      vlrquitado: parseFloat(item.vlrquitado || 0),
      saldo_devedor: parseFloat(item.saldo_devedor || 0),
      juros: parseFloat(item.juros || 0),
      multa: parseFloat(item.multa || 0),
      desconto: parseFloat(item.desconto || 0),
      vlrliberado: parseFloat(item.vlrliberado || 0),
      id_media: item.id_media || ''
    })) || []
    
  } catch (error) {
    console.error('Erro ao carregar contas a pagar:', error)
    mostrarMensagem('Erro ao carregar contas a pagar', 'error')
    contasPagar.value = []
  } finally {
    loading.value = false
  }
}

// Função para aplicar filtros avançados
const aplicarFiltrosAvancados = async (filtros) => {
  try {
    console.log('📋 Filtros recebidos do componente BuscaAvancada:', filtros)

    // Usa os filtros exatamente como recebidos (dtini/dtfim)
    filtrosAvancados.value = { ...filtros };

    const filtrosApi = Object.entries(filtrosAvancados.value)
      .filter(([, valor]) => valor !== null && valor !== undefined && valor !== '')
      .reduce((acc, [chave, valor]) => {
        acc[chave] = valor
        return acc
      }, {});

    console.log('🔧 Filtros processados para API:', filtrosApi);

    await carregarContasPagar(filtrosApi);
  } catch (error) {
    console.error('Erro ao aplicar filtros:', error);
    mostrarMensagem('Erro ao aplicar filtros', 'error');
  }
}

// Controle de seleção
const toggleTodosSelecionados = (selecionado) => {
  if (selecionado) {
    contasSelecionadas.value = [...contasPagarFiltradas.value]
  } else {
    contasSelecionadas.value = []
  }
}

const limparSelecoes = () => {
  contasSelecionadas.value = []
  todosSelecionados.value = false
}

// Confirmar baixa
const confirmarBaixaPagamento = () => {
  if (contasSelecionadas.value.length === 0) {
    mostrarMensagem('Selecione pelo menos uma conta para baixar', 'warning')
    return
  }
  
  dialogBaixa.aberto = true
}

// Executar baixa de pagamento
const executarBaixaPagamento = async () => {
  try {
    loadingBaixa.value = true
    
    // Preparar dados para baixa
    const dadosBaixa = {
      ids: contasSelecionadas.value.map(conta => conta.id),
      dtpagamento: formBaixa.dtpagamento,
      vlrpago: parseFloat(formBaixa.vlrpago || 0),
      observacao: formBaixa.observacao || '',
      baixadopor: 'SISTEMA' // TODO: Obter usuário logado
    }
    
    // Chamar API de baixa (assumindo que existe um método para isso)
    await financeiroStore.baixarPagamentos(idEmpresa.value, dadosBaixa)
    
    mostrarMensagem(`${contasSelecionadas.value.length} pagamento(s) baixado(s) com sucesso!`, 'success')
    
    // Limpar seleções e fechar dialog
    limparSelecoes()
    dialogBaixa.aberto = false
    
    // Recarregar dados
    await carregarContasPagar(filtrosAvancados.value)
    
  } catch (error) {
    console.error('Erro ao baixar pagamentos:', error)
    mostrarMensagem('Erro ao baixar pagamentos', 'error')
  } finally {
    loadingBaixa.value = false
  }
}

const mostrarMensagem = (mensagem, tipo) => {
  snackbar.message = mensagem
  snackbar.color = tipo
  snackbar.show = true
}

// Ciclo de vida
onMounted(async () => {
  // Não carregar dados automaticamente - aguardar filtros com datas obrigatórias
  console.log('Tela de baixa de pagamento carregada. Aguardando filtros com datas para buscar dados.')
})
</script>

<style scoped>
.background-secondary {
  background-color: var(--bg-color-secondary);
  color: var(--text-color);
}

.background-card {
  background-color: var(--bg-card);
  color: var(--text-color);
}

/* Forçar elementos internos do Vuetify (v-data-table etc.) a herdar o tema */
.background-secondary :deep(.v-data-table),
.background-secondary :deep(.v-data-table__wrapper),
.background-secondary :deep(.v-simple-table),
.background-secondary :deep(.v-data-table__wrapper) > * {
  background-color: transparent;
  color: var(--text-color);
}

.max-height-200 {
  max-height: 200px;
}

.text-red {
  color: #f44336 !important;
}
</style>
