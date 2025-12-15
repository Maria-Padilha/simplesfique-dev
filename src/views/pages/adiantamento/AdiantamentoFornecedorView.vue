<template>
  <div class="pa-4">
    <!-- Header Card -->
    <v-card class="background-secondary mb-4">
      <v-card-title class="text-h5 pa-4 d-flex justify-space-between align-center">
        <div class="d-flex align-center">
          <v-icon icon="mdi-account-cash" class="mr-3"></v-icon>
          Adiantamento de Fornecedores
        </div>
      </v-card-title>
    </v-card>

    <!-- Content Card -->
    <v-card :color="themeStore.darkMode ? 'text-white' : ''" class="background-secondary">
      <v-card-text class="pa-4">
        <BotaoExpandTransition
          :formulario-aberto="formularioAberto"
          texto-abrir="Novo Adiantamento"
          texto-fechar="Cancelar"
          @toggle="toggleFormulario"
        />

        <!-- Expandable Form -->
        <v-expand-transition>
          <div v-if="formularioAberto">
            <v-card class="background-card mb-7" elevation="2">
              <v-card-title class="text-h6 pa-4">
                <v-icon :icon="editando ? 'mdi-pencil' : 'mdi-plus'" class="mr-2"></v-icon>
                {{ editando ? 'Editar Adiantamento' : 'Novo Adiantamento' }}
              </v-card-title>
              <v-card-text class="pa-4">
                <v-form ref="formRef" v-model="formValido">
                  <v-row>
                    <!-- Fornecedor -->
                    <v-col cols="12" md="6">
                      <v-autocomplete
                        v-model="formData.id_fornecedor"
                        :items="fornecedores"
                        :loading="loadingFornecedores"
                        item-title="nome_razao"
                        item-value="id"
                        label="Fornecedor *"
                        :rules="[rules.required]"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-account"
                        no-data-text="Nenhum fornecedor disponível"
                        @update:search="buscarFornecedores"
                        @update:model-value="onFornecedorChange"
                      >
                        <template v-slot:item="{ props, item }">
                          <v-list-item v-bind="props" :title="item.raw.nome_razao">
                            <v-list-item-subtitle>
                              {{ item.raw.cnpj_cpf }}
                            </v-list-item-subtitle>
                          </v-list-item>
                        </template>
                      </v-autocomplete>
                    </v-col>

                    <!-- CPF/CNPJ -->
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="formData.cnpj_cpf"
                        label="CPF/CNPJ"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-card-account-details"
                        readonly
                      />
                    </v-col>

                    <!-- Conta Contábil de Adiantamento -->
                    <v-col cols="12" md="6">
                      <v-autocomplete
                        v-model="formData.id_planoconta"
                        :items="planosConta"
                        :loading="loadingPlanosConta"
                        item-title="descplanoconta"
                        item-value="id"
                        label="Conta Contábil de Adiantamento *"
                        :rules="[rules.required]"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-chart-tree"
                        no-data-text="Nenhuma conta disponível"
                      >
                        <template v-slot:item="{ props, item }">
                          <v-list-item v-bind="props" :title="item.raw.descplanoconta">
                            <v-list-item-subtitle>
                              Código: {{ item.raw.codplanoconta }}
                            </v-list-item-subtitle>
                          </v-list-item>
                        </template>
                      </v-autocomplete>
                    </v-col>

                    <!-- Previsão de Pagamento -->
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="formData.dtprevisao_pagamento"
                        label="Previsão de Pagamento *"
                        type="date"
                        :rules="[rules.required]"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-calendar"
                      />
                    </v-col>

                    <!-- Valor Solicitado -->
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="formData.valor_solicitado"
                        label="Valor Solicitado *"
                        type="number"
                        step="0.01"
                        min="0"
                        :rules="[rules.required, rules.valorPositivo]"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-currency-usd"
                        @input="calcularValorAdiantamento"
                      />
                    </v-col>

                    <!-- Valor Documento -->
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="formData.valor_documento"
                        label="Valor Documento *"
                        type="number"
                        step="0.01"
                        min="0"
                        :rules="[rules.required, rules.valorPositivo]"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-file-document"
                        @input="calcularValorAdiantamento"
                      />
                    </v-col>

                    <!-- Valor Adiantamento (calculado) -->
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="formData.valor_adiantamento"
                        label="Valor Adiantamento"
                        type="number"
                        step="0.01"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-cash-multiple"
                        readonly
                        :color="formData.valor_adiantamento < 0 ? 'error' : 'success'"
                      />
                    </v-col>

                    <!-- Observações -->
                    <v-col cols="12">
                      <v-textarea
                        v-model="formData.observacoes"
                        label="Observações"
                        variant="outlined"
                        density="compact"
                        rows="3"
                        prepend-inner-icon="mdi-text"
                      />
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
              <v-card-actions class="pa-4">
                <v-spacer></v-spacer>
                <v-btn color="grey" variant="text" @click="cancelarFormulario">Cancelar</v-btn>
                <v-btn
                  color="var(--text-color-laranja)"
                  :loading="loading"
                  :disabled="!formValido"
                  @click="salvarAdiantamento"
                  variant="flat"
                  class="text-white"
                >
                  {{ editando ? 'Atualizar' : 'Salvar' }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </div>
        </v-expand-transition>

        <!-- Data Table -->
        <TabelaPadrao
          :formulario-aberto="formularioAberto"
          :headers="headers"
          :items="itemsFiltrados"
          :loading="loading"
          :search="search"
          @update:search="(value) => search = value"
          search-label="Pesquisar Adiantamento"
          item-key="id"
          no-data-icon="mdi-account-cash-outline"
          no-data-text="Nenhum adiantamento de fornecedor cadastrado"
          delete-item-display-field="fornecedor_nome"
          @edit-item="editarAdiantamento"
          @confirm-delete="excluirAdiantamento"
        >
          <!-- Slot customizado para valor solicitado -->
          <template v-slot:[`item.valor_solicitado`]="{ item }">
            <span class="font-weight-medium text-success">
              {{ formatarMoeda(item.valor_solicitado) }}
            </span>
          </template>

          <!-- Slot customizado para valor documento -->
          <template v-slot:[`item.valor_documento`]="{ item }">
            <span class="font-weight-medium text-info">
              {{ formatarMoeda(item.valor_documento) }}
            </span>
          </template>

          <!-- Slot customizado para valor adiantamento -->
          <template v-slot:[`item.valor_adiantamento`]="{ item }">
            <span 
              class="font-weight-bold" 
              :class="item.valor_adiantamento >= 0 ? 'text-success' : 'text-error'"
            >
              {{ formatarMoeda(item.valor_adiantamento) }}
            </span>
          </template>

          <!-- Slot customizado para data de previsão -->
          <template v-slot:[`item.dtprevisao_pagamento`]="{ item }">
            {{ formatarData(item.dtprevisao_pagamento) }}
          </template>

          <!-- Slot customizado para status -->
          <template v-slot:[`item.status`]="{ item }">
            <v-chip
              :color="getStatusColor(item.status)"
              size="small"
              variant="flat"
            >
              {{ getStatusLabel(item.status) }}
            </v-chip>
          </template>
        </TabelaPadrao>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useThemeStore } from '@/stores/config-temas/theme'
import { useFinanceiroStore } from '@/stores/APIs/financeiro'
import { useEmpresaStore } from '@/stores/APIs/empresa'
import BotaoExpandTransition from '@/components/base/padrao-paginas/BotaoExpandTransition.vue'
import TabelaPadrao from '@/components/base/padrao-paginas/TabelaPadrao.vue'

const themeStore = useThemeStore()
const financeiroStore = useFinanceiroStore()
const empresaStore = useEmpresaStore()

// Estado
const formularioAberto = ref(false)
const editando = ref(false)
const formValido = ref(false)
const formRef = ref(null)
const search = ref('')
const loading = ref(false)
const loadingFornecedores = ref(false)
const loadingPlanosConta = ref(false)

// Dados
const fornecedores = ref([])
const planosConta = ref([])
const adiantamentos = ref([]) // Dados simulados por enquanto

// Formulário
const formData = reactive({
  id: null,
  id_fornecedor: null,
  fornecedor_nome: '',
  cnpj_cpf: '',
  id_planoconta: null,
  observacoes: '',
  valor_solicitado: 0,
  valor_documento: 0,
  valor_adiantamento: 0,
  dtprevisao_pagamento: '',
  status: 'pendente' // pendente, aprovado, pago, cancelado
})

// Regras de validação
const rules = {
  required: (value) => !!value || 'Campo obrigatório',
  valorPositivo: (value) => {
    if (!value) return 'Campo obrigatório'
    if (parseFloat(value) <= 0) return 'Valor deve ser maior que zero'
    return true
  }
}

// Headers da tabela
const headers = [
  { title: 'ID', key: 'id', sortable: true, width: '80px' },
  { title: 'Fornecedor', key: 'fornecedor_nome', sortable: true },
  { title: 'CPF/CNPJ', key: 'cnpj_cpf', sortable: true, width: '150px' },
  { title: 'Valor Solicitado', key: 'valor_solicitado', sortable: true, align: 'end', width: '140px' },
  { title: 'Valor Documento', key: 'valor_documento', sortable: true, align: 'end', width: '140px' },
  { title: 'Valor Adiantamento', key: 'valor_adiantamento', sortable: true, align: 'end', width: '150px' },
  { title: 'Previsão Pagamento', key: 'dtprevisao_pagamento', sortable: true, width: '140px' },
  { title: 'Status', key: 'status', sortable: true, width: '100px' },
  { title: 'Ações', key: 'actions', sortable: false, align: 'center', width: '100px' }
]

// Computed
const itemsFiltrados = computed(() => {
  const dados = adiantamentos.value || []
  return Array.isArray(dados) ? dados : []
})

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

const getStatusColor = (status) => {
  const cores = {
    'pendente': 'warning',
    'aprovado': 'info',
    'pago': 'success',
    'cancelado': 'error'
  }
  return cores[status] || 'grey'
}

const getStatusLabel = (status) => {
  const labels = {
    'pendente': 'Pendente',
    'aprovado': 'Aprovado',
    'pago': 'Pago',
    'cancelado': 'Cancelado'
  }
  return labels[status] || status
}

// Métodos de negócio
const calcularValorAdiantamento = () => {
  const solicitado = parseFloat(formData.valor_solicitado) || 0
  const documento = parseFloat(formData.valor_documento) || 0
  formData.valor_adiantamento = solicitado - documento
}

const onFornecedorChange = (idFornecedor) => {
  const fornecedor = fornecedores.value.find(f => f.id === idFornecedor)
  if (fornecedor) {
    formData.fornecedor_nome = fornecedor.nome_razao
    formData.cnpj_cpf = fornecedor.cnpj_cpf || ''
  } else {
    formData.fornecedor_nome = ''
    formData.cnpj_cpf = ''
  }
}

// Métodos de ação
const toggleFormulario = () => {
  formularioAberto.value = !formularioAberto.value
  if (!formularioAberto.value) {
    resetFormulario()
  }
}

const cancelarFormulario = () => {
  resetFormulario()
  formularioAberto.value = false
  editando.value = false
}

const resetFormulario = () => {
  Object.assign(formData, {
    id: null,
    id_fornecedor: null,
    fornecedor_nome: '',
    cnpj_cpf: '',
    id_planoconta: null,
    observacoes: '',
    valor_solicitado: 0,
    valor_documento: 0,
    valor_adiantamento: 0,
    dtprevisao_pagamento: '',
    status: 'pendente'
  })
  
  if (formRef.value) {
    formRef.value.resetValidation()
  }
}

// Buscar dados
const buscarFornecedores = async (searchTerm = '') => {
  if (loadingFornecedores.value) return
  
  loadingFornecedores.value = true
  try {
    const idEmpresa = empresaStore.empresa?.id || empresaStore.empresaSelecionada?.id
    const dados = await financeiroStore.buscarPessoasFornecedores(searchTerm, idEmpresa)
    fornecedores.value = Array.isArray(dados) ? dados : []
  } catch (error) {
    console.error('Erro ao buscar fornecedores:', error)
    fornecedores.value = []
  } finally {
    loadingFornecedores.value = false
  }
}

const carregarPlanosConta = async () => {
  loadingPlanosConta.value = true
  try {
    const dados = await financeiroStore.buscarPlanosConta()
    planosConta.value = Array.isArray(dados) ? dados : []
  } catch (error) {
    console.error('Erro ao carregar planos de conta:', error)
    planosConta.value = []
  } finally {
    loadingPlanosConta.value = false
  }
}

// CRUD - Por enquanto simulado, será conectado à API depois
const salvarAdiantamento = async () => {
  if (!formValido.value) return

  loading.value = true
  try {
    // Simular salvamento - substituir pela chamada da API quando estiver disponível
    const novoAdiantamento = {
      ...formData,
      id: editando.value ? formData.id : Date.now(), // ID temporário
      dtcriacao: new Date().toISOString().split('T')[0]
    }

    if (editando.value) {
      const index = adiantamentos.value.findIndex(a => a.id === formData.id)
      if (index !== -1) {
        adiantamentos.value[index] = novoAdiantamento
      }
      console.log('✅ Adiantamento atualizado (simulado):', novoAdiantamento)
    } else {
      adiantamentos.value.push(novoAdiantamento)
      console.log('✅ Adiantamento criado (simulado):', novoAdiantamento)
    }

    cancelarFormulario()
  } catch (error) {
    console.error('❌ Erro ao salvar adiantamento:', error)
  } finally {
    loading.value = false
  }
}

const editarAdiantamento = (item) => {
  editando.value = true
  formularioAberto.value = true
  
  Object.assign(formData, {
    id: item.id,
    id_fornecedor: item.id_fornecedor,
    fornecedor_nome: item.fornecedor_nome,
    cnpj_cpf: item.cnpj_cpf,
    id_planoconta: item.id_planoconta,
    observacoes: item.observacoes,
    valor_solicitado: item.valor_solicitado,
    valor_documento: item.valor_documento,
    valor_adiantamento: item.valor_adiantamento,
    dtprevisao_pagamento: item.dtprevisao_pagamento,
    status: item.status
  })
}

const excluirAdiantamento = async (item) => {
  loading.value = true
  try {
    // Simular exclusão - substituir pela chamada da API quando estiver disponível
    const index = adiantamentos.value.findIndex(a => a.id === item.id)
    if (index !== -1) {
      adiantamentos.value.splice(index, 1)
    }
    console.log('✅ Adiantamento excluído (simulado):', item.id)
  } catch (error) {
    console.error('❌ Erro ao excluir adiantamento:', error)
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(async () => {
  console.log('🚀 Carregando dados iniciais...')
  await Promise.all([
    buscarFornecedores(),
    carregarPlanosConta()
  ])
  
  // Dados simulados para demonstração
  adiantamentos.value = [
    {
      id: 1,
      id_fornecedor: 1,
      fornecedor_nome: 'Fornecedor Exemplo Ltda',
      cnpj_cpf: '12.345.678/0001-90',
      id_planoconta: 1,
      observacoes: 'Adiantamento para compra de materiais',
      valor_solicitado: 5000.00,
      valor_documento: 3000.00,
      valor_adiantamento: 2000.00,
      dtprevisao_pagamento: '2024-12-30',
      status: 'pendente',
      dtcriacao: '2024-12-15'
    },
    {
      id: 2,
      id_fornecedor: 2,
      fornecedor_nome: 'Outro Fornecedor S.A.',
      cnpj_cpf: '98.765.432/0001-10',
      id_planoconta: 2,
      observacoes: 'Adiantamento para serviços de manutenção',
      valor_solicitado: 8000.00,
      valor_documento: 8500.00,
      valor_adiantamento: -500.00,
      dtprevisao_pagamento: '2025-01-15',
      status: 'aprovado',
      dtcriacao: '2024-12-10'
    }
  ]
  
  console.log('✅ Dados carregados')
})
</script>

<style scoped>
/* Estilos específicos se necessário */
</style>
