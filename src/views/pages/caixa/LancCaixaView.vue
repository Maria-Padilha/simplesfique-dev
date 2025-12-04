<template>
  <div class="pa-4">
    <!-- Cabeçalho -->
    <v-card class="background-secondary mb-4">
      <v-card-title class="text-h5 pa-4 d-flex justify-space-between align-center">
        <div class="d-flex align-center">
          <v-icon icon="mdi-cash-multiple" class="mr-3"></v-icon>
          Lançamentos do Caixa
        </div>
      </v-card-title>
    </v-card>

    <!-- Conteúdo Principal -->
    <v-card :color="themeStore.darkMode ? 'text-white' : ''" class="background-secondary">
      <v-card-text class="pa-4">
        <BotaoExpandTransition
          :formulario-aberto="formularioAberto"
          texto-abrir="Novo Lançamento"
          texto-fechar="Cancelar"
          @toggle="toggleFormulario"
        />

        <!-- Formulário de Lançamento -->
        <v-expand-transition>
          <div v-if="formularioAberto">
            <v-card class="background-card mb-7" elevation="2">
              <v-card-title class="text-h6 pa-4">
                <v-icon :icon="editando ? 'mdi-pencil' : 'mdi-plus'" class="mr-2"></v-icon>
                {{ editando ? 'Editar Lançamento' : 'Novo Lançamento' }}
              </v-card-title>

              <v-card-text class="pa-4">
                <v-form ref="formRef" v-model="formValido">
                  <v-row>
                    <!-- Caixa -->
                    <v-col cols="12" md="4">
                      <v-autocomplete
                        v-model="formData.id_caixa"
                        :items="caixasDisponiveis"
                        :loading="loadingCaixas"
                        item-title="desccaixa"
                        item-value="id_caixa"
                        label="Caixa *"
                        :rules="[rules.required]"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-cash-register"
                        no-data-text="Nenhum caixa disponível"
                      ></v-autocomplete>
                    </v-col>

                    <!-- Data de Lançamento -->
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="formData.dtlancamento"
                        label="Data de Lançamento *"
                        type="date"
                        :rules="[rules.required]"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-calendar"
                      ></v-text-field>
                    </v-col>

                    <!-- Valor -->
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="formData.valor"
                        label="Valor *"
                        :rules="[rules.required, rules.valorPositivo]"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-currency-usd"
                        prefix="R$"
                        type="number"
                        step="0.01"
                      ></v-text-field>
                    </v-col>

                    <!-- Código da Conta (Despesa ou Receita) -->
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="formData.codigo_conta"
                        label="Código da Conta *"
                        :rules="[rules.required]"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-file-document"
                        @blur="buscarContaPorCodigo"
                      ></v-text-field>
                    </v-col>

                    <!-- Tipo Documento -->
                    <v-col cols="12" md="4">
                      <v-autocomplete
                        v-model="formData.id_tipodocumento"
                        :items="tiposDocumento"
                        :loading="loadingTiposDoc"
                        item-title="desctipodocumento"
                        item-value="id"
                        label="Tipo Documento *"
                        :rules="[rules.required]"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-file-document-outline"
                        no-data-text="Nenhum tipo disponível"
                      ></v-autocomplete>
                    </v-col>

                    <!-- Histórico do Caixa -->
                    <v-col cols="12" md="4">
                      <v-autocomplete
                        v-model="formData.id_historicocaixa"
                        :items="historicosCaixa"
                        :loading="loadingHistCaixa"
                        item-title="deschistorico"
                        item-value="id"
                        label="Histórico do Caixa *"
                        :rules="[rules.required]"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-history"
                        no-data-text="Nenhum histórico disponível"
                      ></v-autocomplete>
                    </v-col>

                    <!-- Sinal (Entrada/Saída) -->
                    <v-col cols="12" md="4">
                      <v-select
                        v-model="formData.sinal"
                        :items="[
                          { title: 'Entrada', value: 'E' },
                          { title: 'Saída', value: 'S' }
                        ]"
                        label="Sinal *"
                        :rules="[rules.required]"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-swap-vertical"
                      ></v-select>
                    </v-col>

                    <!-- Tipo Pagamento/Recebimento -->
                    <v-col cols="12" md="4">
                      <v-select
                        v-model="formData.tipo_pagamento"
                        :items="tiposPagamento"
                        item-title="label"
                        item-value="value"
                        label="Tipo Pagamento/Recebimento *"
                        :rules="[rules.required]"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-credit-card"
                      ></v-select>
                    </v-col>

                    <!-- Observação -->
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="formData.observacao"
                        label="Observação"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-note-text"
                        maxlength="500"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>

              <v-card-actions class="pa-4">
                <v-btn
                  color="grey"
                  variant="outlined"
                  @click="excluirLancamento"
                  v-if="editando"
                >
                  <v-icon start>mdi-delete</v-icon>
                  Excluir
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn color="grey" variant="text" @click="cancelarFormulario">
                  Cancelar
                </v-btn>
                <v-btn
                  color="var(--text-color-laranja)"
                  :loading="loading"
                  :disabled="!formValido"
                  @click="salvarLancamento"
                  variant="flat"
                  class="text-white"
                >
                  <v-icon start>mdi-content-save</v-icon>
                  {{ editando ? 'Atualizar' : 'Salvar' }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </div>
        </v-expand-transition>

        <!-- Tabela de Lançamentos -->
        <TabelaPadrao
          :formulario-aberto="formularioAberto"
          :headers="headers"
          :items="lancamentosFiltradasComputadas"
          :loading="loading"
          :search="search"
          @update:search="(value) => search = value"
          search-label="Pesquisar lançamento"
          item-key="id"
          no-data-icon="mdi-cash-multiple"
          no-data-text="Nenhum lançamento registrado"
          delete-item-display-field="nrlancamento"
          @edit-item="editarLancamento"
          @confirm-delete="excluirLancamento"
        >
          <!-- Coluna de Data -->
          <template v-slot:[`item.dtlancamento`]="{ item }">
            {{ formatarData(item.dtlancamento) }}
          </template>

          <!-- Coluna de Valor -->
          <template v-slot:[`item.valor`]="{ item }">
            <span 
              :class="item.sinal === 'E' ? 'text-success' : 'text-error'" 
              class="font-weight-bold"
            >
              {{ item.sinal === 'E' ? '+' : '-' }} {{ formatarMoeda(item.valor) }}
            </span>
          </template>

          <!-- Coluna de Sinal -->
          <template v-slot:[`item.sinal`]="{ item }">
            <v-chip
              :color="item.sinal === 'E' ? 'success' : 'error'"
              variant="tonal"
              size="small"
            >
              <v-icon start size="small">
                {{ item.sinal === 'E' ? 'mdi-arrow-down' : 'mdi-arrow-up' }}
              </v-icon>
              {{ item.sinal === 'E' ? 'Entrada' : 'Saída' }}
            </v-chip>
          </template>

          <!-- Coluna de Tipo Pagamento -->
          <template v-slot:[`item.tipo_pagamento`]="{ item }">
            {{ obterLabelTipoPagamento(item.tipo_pagamento) }}
          </template>
        </TabelaPadrao>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useThemeStore } from '@/stores/config-temas/theme'
import { useCaixaStore } from '@/stores/APIs/caixa'
import { useEmpresaStore } from '@/stores/APIs/empresa'
import { useFinanceiroStore } from '@/stores/APIs/financeiro'
import { useConfigParfinStore } from '@/stores/APIs/config'
import BotaoExpandTransition from '@/components/base/padrao-paginas/BotaoExpandTransition.vue'
import TabelaPadrao from '@/components/base/padrao-paginas/TabelaPadrao.vue'

const themeStore = useThemeStore()
const caixaStore = useCaixaStore()
const empresaStore = useEmpresaStore()
const financeiroStore = useFinanceiroStore()
const configStore = useConfigParfinStore()

// Estado
const formularioAberto = ref(false)
const editando = ref(false)
const formValido = ref(false)
const formRef = ref(null)
const search = ref('')
const loading = ref(false)
const loadingCaixas = ref(false)
const loadingTiposDoc = ref(false)
const loadingHistCaixa = ref(false)

// Dados
const caixasDisponiveis = ref([])
const tiposDocumento = ref([])
const historicosCaixa = ref([])
const lancamentos = ref([])
const planosConta = ref([])

// Formulário
const formData = reactive({
  id: null,
  id_caixa: null,
  codigo_conta: '',
  id_tipodocumento: null,
  id_historicocaixa: null,
  dtlancamento: new Date().toISOString().split('T')[0],
  valor: 0,
  sinal: 'E', // E = Entrada, S = Saída
  tipo_pagamento: '001', // 001 = DINHEIRO (padrão)
  observacao: ''
})

// Tipos de pagamento baseados na imagem
const tiposPagamento = [
  { label: '001 - DINHEIRO', value: '001' },
  { label: '002 - CHEQUE', value: '002' },
  { label: '003 - CARTÃO DE CRÉDITO', value: '003' },
  { label: '004 - CARTÃO DE DÉBITO', value: '004' },
  { label: '005 - CRÉDITO LOJA', value: '005' },
  { label: '010 - VALE ALIMENTAÇÃO', value: '010' },
  { label: '011 - VALE REFEIÇÃO', value: '011' },
  { label: '012 - VALE PRESENTE', value: '012' },
  { label: '013 - VALE COMBUSTÍVEL', value: '013' },
  { label: '015 - BOLETO BANCÁRIO', value: '015' },
  { label: '016 - DEPÓSITO BANCÁRIO', value: '016' },
  { label: '017 - PIX', value: '017' },
  { label: '018 - TRANSFERÊNCIA BANCÁRIA', value: '018' },
  { label: '019 - PROGRAMA DE FIDELIDADE', value: '019' },
  { label: '090 - SEM PAGAMENTO', value: '090' },
  { label: '099 - OUTROS', value: '099' }
]

// Regras de validação
const rules = {
  required: (value) => {
    if (value === null || value === undefined || value === '') return 'Campo obrigatório'
    return true
  },
  valorPositivo: (value) => {
    if (value === null || value === undefined || value === '') return 'Campo obrigatório'
    if (parseFloat(value) <= 0) return 'Valor deve ser maior que zero'
    return true
  }
}

// Headers da tabela
const headers = [
  { title: 'Nr', key: 'nrlancamento', sortable: true },
  { title: 'Caixa', key: 'descricao_caixa', sortable: true },
  { title: 'Data', key: 'dtlancamento', sortable: true },
  { title: 'Histórico', key: 'historico', sortable: true },
  { title: 'Tipo Doc', key: 'tipo_documento', sortable: true },
  { title: 'Tipo Pgto', key: 'tipo_pagamento', sortable: true },
  { title: 'Sinal', key: 'sinal', sortable: true },
  { title: 'Valor', key: 'valor', sortable: true },
  { title: 'Ações', key: 'actions', sortable: false }
]

// Computed
const lancamentosFiltradasComputadas = computed(() => {
  const dados = lancamentos.value || []
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

const obterLabelTipoPagamento = (codigo) => {
  const tipo = tiposPagamento.find(t => t.value === codigo)
  return tipo ? tipo.label : codigo
}

// Métodos de ação
const toggleFormulario = () => {
  formularioAberto.value = !formularioAberto.value
  if (!formularioAberto.value) {
    limparFormulario()
  }
}

const cancelarFormulario = () => {
  limparFormulario()
  formularioAberto.value = false
  editando.value = false
}

const limparFormulario = () => {
  Object.assign(formData, {
    id: null,
    id_caixa: null,
    codigo_conta: '',
    id_tipodocumento: null,
    id_historicocaixa: null,
    dtlancamento: new Date().toISOString().split('T')[0],
    valor: 0,
    sinal: 'E',
    tipo_pagamento: '001',
    observacao: ''
  })
  if (formRef.value) {
    formRef.value.resetValidation()
  }
}

// Buscar conta por código
const buscarContaPorCodigo = async () => {
  if (!formData.codigo_conta) return

  try {
    const conta = planosConta.value.find(p => 
      p.codigo === formData.codigo_conta || 
      p.id === parseInt(formData.codigo_conta)
    )
    
    if (!conta) {
      formData.codigo_conta = ''
    }
  } catch (error) {
    console.error('Erro ao buscar conta:', error)
    formData.codigo_conta = ''
  }
}

// Carregar dados
const carregarCaixas = async () => {
  loadingCaixas.value = true
  try {
    const idEmpresa = empresaStore.empresa?.id || empresaStore.empresaSelecionada?.id
    
    if (!idEmpresa) {
      console.warn('ID da empresa não encontrado')
      return
    }
    
    console.log('Buscando caixas abertos para empresa:', idEmpresa)
    const dados = await caixaStore.buscarCaixasUsuarioAberto(idEmpresa)
    console.log('Caixas recebidos:', dados)
    
    if (Array.isArray(dados) && dados.length > 0) {
      caixasDisponiveis.value = dados
      console.log('Caixas disponíveis atualizados:', caixasDisponiveis.value)
    } else {
      caixasDisponiveis.value = []
      console.warn('Nenhum caixa aberto encontrado')
    }
  } catch (error) {
    console.error('Erro ao carregar caixas:', error)
    caixasDisponiveis.value = []
  } finally {
    loadingCaixas.value = false
  }
}

const carregarTiposDocumento = async () => {
  loadingTiposDoc.value = true
  try {
    const dados = await financeiroStore.buscarTiposDocumento()
    tiposDocumento.value = Array.isArray(dados) ? dados : []
  } catch (error) {
    console.error('Erro ao carregar tipos de documento:', error)
    tiposDocumento.value = []
  } finally {
    loadingTiposDoc.value = false
  }
}

const carregarHistoricosCaixa = async () => {
  loadingHistCaixa.value = true
  try {
    const dados = await configStore.buscarHistoricoCaixa()
    
    // Normalizar resposta
    let historicos = []
    if (dados && dados.data && Array.isArray(dados.data)) {
      historicos = dados.data
    } else if (Array.isArray(dados)) {
      historicos = dados
    } else if (dados && typeof dados === 'object') {
      historicos = [dados]
    }
    
    historicosCaixa.value = historicos
  } catch (error) {
    console.error('Erro ao carregar históricos de caixa:', error)
    historicosCaixa.value = []
  } finally {
    loadingHistCaixa.value = false
  }
}

const carregarPlanosConta = async () => {
  try {
    const dados = await financeiroStore.buscarPlanosConta()
    planosConta.value = Array.isArray(dados) ? dados : []
  } catch (error) {
    console.error('Erro ao carregar planos de conta:', error)
    planosConta.value = []
  }
}

const carregarLancamentos = async () => {
  loading.value = true
  try {
    const idEmpresa = empresaStore.empresa?.id || empresaStore.empresaSelecionada?.id
    
    if (!idEmpresa) {
      return
    }
    
    // TODO: Implementar endpoint /caixalancamento/:idempresa
    lancamentos.value = []
  } catch (error) {
    console.error('Erro ao carregar lançamentos:', error)
    lancamentos.value = []
  } finally {
    loading.value = false
  }
}

// Salvar lançamento
const salvarLancamento = async () => {
  if (!formValido.value) {
    return
  }

  loading.value = true
  try {
    const idEmpresa = empresaStore.empresa?.id || empresaStore.empresaSelecionada?.id
    
    if (!idEmpresa) {
      return
    }

    // TODO: Implementar endpoint POST/PUT /caixalancamento
    // const payload = {
    //   data: [{
    //     id_empresa: parseInt(idEmpresa),
    //     id_caixa: formData.id_caixa,
    //     codigo_conta: formData.codigo_conta,
    //     id_tipodocumento: formData.id_tipodocumento,
    //     id_historicocaixa: formData.id_historicocaixa,
    //     dtlancamento: formData.dtlancamento,
    //     valor: parseFloat(formData.valor),
    //     sinal: formData.sinal,
    //     tipo_pagamento: formData.tipo_pagamento,
    //     observacao: formData.observacao || null
    //   }]
    // }

    // if (editando.value && formData.id) {
    //   await financeiroStore.atualizarLancamentoCaixa(idEmpresa, formData.id, payload)
    // } else {
    //   await financeiroStore.criarLancamentoCaixa(payload)
    // }
    
    cancelarFormulario()
    await carregarLancamentos()
  } catch (error) {
    console.error('Erro ao salvar lançamento:', error)
  } finally {
    loading.value = false
  }
}

// Editar lançamento
const editarLancamento = (item) => {
  editando.value = true
  formularioAberto.value = true
  
  Object.assign(formData, {
    id: item.id,
    id_caixa: item.id_caixa,
    codigo_conta: item.codigo_conta || '',
    id_tipodocumento: item.id_tipodocumento,
    id_historicocaixa: item.id_historicocaixa,
    dtlancamento: item.dtlancamento,
    valor: item.valor,
    sinal: item.sinal,
    tipo_pagamento: item.tipo_pagamento,
    observacao: item.observacao || ''
  })
}

// Excluir lançamento
const excluirLancamento = async (item) => {
  loading.value = true
  try {
    const idEmpresa = empresaStore.empresa?.id || empresaStore.empresaSelecionada?.id
    
    if (!idEmpresa) {
      return
    }

    const idParaExcluir = item?.id || formData.id
    if (!idParaExcluir) {
      return
    }

    // TODO: Implementar endpoint DELETE /caixalancamento/:idempresa/id/:id
    // await financeiroStore.deletarLancamentoCaixa(idEmpresa, idParaExcluir)
    
    cancelarFormulario()
    await carregarLancamentos()
  } catch (error) {
    console.error('Erro ao excluir lançamento:', error)
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    carregarCaixas(),
    carregarTiposDocumento(),
    carregarHistoricosCaixa(),
    carregarPlanosConta(),
    carregarLancamentos()
  ])
})
</script>

<style scoped>
/* Estilos específicos se necessário */
</style>
