<template>
  <top-all-pages icon="mdi-cash-minus">
    <template #titulo>Baixa de Pagamentos</template>
    <template #acoes>
      <v-btn
          icon
          color="var(--text-color-laranja)"
          variant="outlined"
          size="small"
          @click="modalExportacaoAberto = true"
      >
        <v-icon icon="mdi-printer"></v-icon>
        <v-tooltip activator="parent" location="top">
          Imprimir / Exportar
        </v-tooltip>
      </v-btn>
    </template>
    <template #section>
      <div>
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
                <p class="text-body-1 mb-1">
                  Selecionados: <strong>{{ contasSelecionadas.length }}</strong> |
                  Valor selecionado: <strong>{{ formatarMoeda(valorSelecionado) }}</strong>
                </p>

                <!-- Select para tipo de baixa -->
                <div class="mt-3">
                  <v-select
                      v-model="tipoBaixa"
                      :items="[
                  { title: 'Banco', value: 'banco' },
                  { title: 'Caixa', value: 'caixa' }
                ]"
                      item-title="title"
                      item-value="value"
                      label="Tipo de Baixa"
                      variant="outlined"
                      density="compact"
                      style="max-width: 200px;"
                      hide-details
                  />
                </div>
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
            <div class="mb-4">
              <BuscaAvancadaBaixa
                  entidade="contaspagar"
                  @aplicar="aplicarFiltrosAvancados"
              />
            </div>

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

              <!-- Edição inline de Juros (sempre editável) -->
              <template v-slot:[`item.juros`]="{ item }">
                <v-text-field
                    v-model="item.juros_display"
                    type="text"
                    variant="outlined"
                    density="compact"
                    hide-details
                    class="campo-editavel-tabela juros-input"
                    :class="{ 'campo-editavel-dark': themeStore.darkMode }"
                    style="min-width: 120px; width: 140px;"
                    @update:model-value="(val) => handleItemCurrencyInput(item, 'juros', val)"
                    @blur="() => handleItemCurrencyBlur(item, 'juros')"
                />
              </template>

              <!-- Edição inline de Multa (sempre editável) -->
              <template v-slot:[`item.multa`]="{ item }">
                <v-text-field
                    v-model="item.multa_display"
                    type="text"
                    variant="outlined"
                    density="compact"
                    hide-details
                    :class="{ 'campo-editavel-dark': themeStore.darkMode }"
                    class="campo-editavel-tabela multa-input"
                    style="min-width: 120px; width: 140px;"
                    @update:model-value="(val) => handleItemCurrencyInput(item, 'multa', val)"
                    @blur="() => handleItemCurrencyBlur(item, 'multa')"
                />
              </template>

              <!-- Edição inline de Desconto (sempre editável) -->
              <template v-slot:[`item.desconto`]="{ item }">
                <v-text-field
                    v-model="item.desconto_display"
                    type="text"
                    variant="outlined"
                    density="compact"
                    hide-details
                    class="campo-editavel-tabela desconto-input"
                    :class="{ 'campo-editavel-dark': themeStore.darkMode }"
                    style="min-width: 120px; width: 140px;"
                    @update:model-value="(val) => handleItemCurrencyInput(item, 'desconto', val)"
                    @blur="() => handleItemCurrencyBlur(item, 'desconto')"
                />
              </template>

              <!-- Formatação do saldo devedor (leitura) -->
              <template v-slot:[`item.saldo_devedor`]="{ item }">
                {{ formatarMoeda(item.saldo_devedor) }}
              </template>

              <!-- Edição inline de Vlr a Pagar (novo campo editável) -->
              <template v-slot:[`item.vlrapagar`]="{ item }">
                <v-text-field
                    v-model="item.vlrapagar_display"
                    type="text"
                    step="0.01"
                    variant="outlined"
                    density="compact"
                    hide-details
                    class="campo-editavel-tabela vlr-a-pagar"
                    :class="{ 'campo-editavel-dark': themeStore.darkMode }"
                    style="width: 160px; min-width: 120px;"
                    @update:model-value="(val) => handleItemCurrencyInput(item, 'vlrapagar', val)"
                    @blur="() => handleItemCurrencyBlur(item, 'vlrapagar')"
                />
              </template>

              <!-- Formatação do valor quitado -->
              <template v-slot:[`item.vlrquitado`]="{ item }">
                {{ formatarMoeda(item.vlrquitado) }}
              </template>

              <!-- Formatação do valor liberado -->
              <template v-slot:[`item.vlrliberado`]="{ item }">
                {{ formatarMoeda(item.vlrliberado || 0) }}
              </template>
            </TabelaPadrao>
          </v-card-text>
        </v-card>

        <!-- Modal de Baixa por Caixa -->
        <BaixaCaixaModal
            v-if="tipoBaixa === 'caixa'"
            v-model="dialogBaixa.aberto"
            :id-empresa="idEmpresa"
            :contas-selecionadas="contasSelecionadas"
            :valor-total="valorSelecionado"
            :loading="loadingBaixa"
            @confirmar="executarBaixaCaixa"
        />

        <!-- Modal de Baixa por Banco -->
        <BaixaBancoModal
            v-if="tipoBaixa === 'banco'"
            v-model="dialogBaixa.aberto"
            :contas-selecionadas="contasSelecionadas"
            :valor-total="valorSelecionado"
            :loading="loadingBaixa"
            @confirmar="executarBaixaBanco"
        />

        <!-- Snackbar para feedback -->
        <v-snackbar
            v-model="snackbar.show"
            :color="snackbar.color"
            :timeout="3000"
        >
          {{ snackbar.message }}
        </v-snackbar>

        <!-- Modal de Exportação -->
        <ExportacaoModal
            v-model="modalExportacaoAberto"
            :dados="contasPagarFiltradas"
            :filtros="filtrosAvancados"
            nome-relatorio="Baixa de Pagamentos"
            @exportar-pdf="() => {}"
            @exportar-csv="() => {}"
            @exportar-excel="() => {}"
            @imprimir="() => {}"
        />

        <!-- Modal de Preview do PDF -->
        <PdfPreviewModal
            v-model="modalPreviewPDF"
            :html-content="previewHTMLContent"
            :nome-relatorio="dadosPDFAtual?.nomeRelatorio || 'Baixa_Pagamentos'"
        />
      </div>
    </template>
  </top-all-pages>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useThemeStore } from '@/stores/config-temas/theme'
import { useFinanceiroStore } from '@/stores/APIs/financeiro'
import { useConfigParfinStore } from '@/stores/APIs/config'
import TabelaPadrao from '@/components/base/padrao-paginas/TabelaPadrao.vue'
import BuscaAvancadaBaixa from '@/components/base/padrao-paginas/BuscaAvancadaBaixa.vue'
import BaixaCaixaModal from '@/components/base/modais/BaixaCaixaModal.vue'
import BaixaBancoModal from '@/components/base/modais/BaixaBancoModal.vue'
import TopAllPages from "@/components/base/padrao-paginas/TopAllPages.vue";
import ExportacaoModal from '@/components/base/modais/ExportacaoModal.vue'
import PdfPreviewModal from '@/components/base/modais/PdfPreviewModal.vue'

const themeStore = useThemeStore()
const financeiroStore = useFinanceiroStore()
const configParfinStore = useConfigParfinStore()

// Refs
const search = ref('')
const loading = ref(false)
const loadingBaixa = ref(false)
const filtrosAvancados = ref({}) // Remover filtro inicial baixado='N'

// Estado dos dados
const contasPagar = ref([])
const contasSelecionadas = ref([])
const todosSelecionados = ref(false)
const tipoBaixa = ref('banco') // Tipo de baixa: banco ou caixa

// Dialog de confirmação de baixa
const dialogBaixa = reactive({
  aberto: false
})

// Snackbar
const snackbar = reactive({
  show: false,
  message: '',
  color: 'success'
})

// Modais de exportação
const modalExportacaoAberto = ref(false)
const modalPreviewPDF = ref(false)
const previewHTMLContent = ref('')
const dadosPDFAtual = ref(null)

// ID da empresa (temporário - deve vir do contexto/autenticação)
const idEmpresa = ref(1)

// Cache local dos parâmetros financeiros (Contas a Pagar)
const parfinPagar = ref(null)

const round2 = (n) => Math.round((Number(n) || 0) * 100) / 100

const normalizarPrimeiroRegistro = (resp) => {
  if (!resp) return null
  if (Array.isArray(resp)) return resp[0] || null
  if (Array.isArray(resp.data)) return resp.data[0] || null
  return resp?.data || resp
}

const carregarParfinPagarSeNecessario = async () => {
  if (parfinPagar.value) return parfinPagar.value
  const resp = await configParfinStore.buscarParametrosFinanceirosPagar(idEmpresa.value)
  parfinPagar.value = normalizarPrimeiroRegistro(resp)
  return parfinPagar.value
}

const montarPayloadBaixa = async (tipo, dadosBaixa) => {
  const parfin = (await carregarParfinPagarSeNecessario()) || {}
  const local_lct = tipo === 'caixa' ? 'CAI' : 'BAN'

  const data = (contasSelecionadas.value || []).map((item) => {
    const vlrparcela = round2(item?.saldo_devedor ?? item?.vlrparcela ?? 0)
    const vlrjuros = round2(item?.juros ?? 0)
    const vlrmulta = round2(item?.multa ?? 0)
    const vlrdesconto = round2(item?.desconto ?? 0)

    const vlrNormal = round2(item?.vlrapagar ?? vlrparcela)
    const vlrbaixa = round2(vlrNormal + vlrjuros + vlrmulta - vlrdesconto)

    return {
      // Identificadores (para a API saber qual parcela baixar)
      id: item?.id ?? null,
      id_parcela: item?.id_parcela ?? item?.id ?? null,  // ← ADICIONADO
      nrparcela: item?.nrparcela ?? null,

      // Campos do payload solicitado
      id_empresa: idEmpresa.value,
      local_lct,
      dt_baixa: dadosBaixa?.dtPagamento ?? null,
      vlrbaixa,
      vlrparcela,
      vlrjuros,
      vlrmulta,
      vlrdesconto,
      id_lote_ccusto: item?.id_lote_ccusto ?? item?.id_lote_ccusto_previsto ?? null,
      pag_id_red_ctb_juros_pago: parfin?.pag_id_red_ctb_juros_pago ?? null,
      pag_id_red_ctb_multa_paga: parfin?.pag_id_red_ctb_multa_paga ?? null,
      id_reduzido_for: parfin?.pag_id_red_ctb_for ?? parfin?.id_reduzido_for ?? null,
      id_reduzido_ctb_caixa: dadosBaixa?.id_reduzido_ctb_caixa ?? parfin?.pag_id_red_ctb_caixa ?? null,
      id_reduzido_ctb_banco: dadosBaixa?.id_reduzido_ctb_banco ?? parfin?.pag_id_red_ctb_banco ?? null,
      id_caixa: tipo === 'caixa' ? (dadosBaixa?.codigoCaixa ?? null) : null,
      id_ccorrente: tipo === 'banco' ? (dadosBaixa?.codigoBanco ?? null) : null,
      pag_id_hist_bxa_caixa: local_lct === 'CAI' ? (parfin?.pag_id_hist_bxa_caixa ?? null) : null,
      pag_id_hist_bxa_caixa_ctb: local_lct === 'CAI' ? (parfin?.pag_id_hist_bxa_caixa_ctb ?? null) : null,
      pag_id_hist_bxa_banco: local_lct === 'BAN' ? (parfin?.pag_id_hist_bxa_banco ?? null) : null,
      pag_id_hist_bxa_banco_ctb: local_lct === 'BAN' ? (parfin?.pag_id_hist_bxa_banco_ctb ?? null) : null,
      id_tipodocumento:
        dadosBaixa?.id_tipodocumento ??
        item?.id_tipodocumento ??
        item?.idtpdocumento ??
        parfin?.tipo_documento_padrao ??
        null,
      id_tipopagrc: dadosBaixa?.id_tipopagrc ?? item?.id_tipopagrc ?? null,
      observacao:
        local_lct === 'CAI'
          ? (dadosBaixa?.descricao ?? '')
          : (dadosBaixa?.observacao ?? ''),
      nrdocumento: dadosBaixa?.nrdocumento ?? item?.nrdocumento ?? null
    }
  })

  const restoDoModal = { ...(dadosBaixa || {}) }
  delete restoDoModal.contasSelecionadas

  const dataCompleto = data.map((parcela) => ({
    tipo,
    baixadopor: tipo === 'caixa' ? 'CAI' : 'BAN',
    ...restoDoModal,
    ...parcela
  }))
  
  return {
    data: dataCompleto 
  }
}

// Headers da tabela - incluindo checkbox e colunas conforme solicitado
const headers = computed(() => {
  return [
    { title: '', key: 'checkbox', sortable: false, width: '60px' },
    { title: 'DT Vencimento', key: 'dtvencimento', sortable: true },
    { title: 'Nr Documento', key: 'nrdocumento', sortable: true },
    { title: 'Nr Parcela', key: 'nrparcela', sortable: true },
    { title: 'Vlr Parcela', key: 'vlrparcela', sortable: true },
    { title: 'Juros', key: 'juros', sortable: true },
    { title: 'Multa', key: 'multa', sortable: true },
    { title: 'Desconto', key: 'desconto', sortable: true },
    { title: 'Vlr Quitado', key: 'vlrquitado', sortable: true },
    { title: 'Vlr Saldo', key: 'saldo_devedor', sortable: true },
    { title: 'Vlr a Pagar', key: 'vlrapagar', sortable: true },
    { title: 'Vlr Liberado', key: 'vlrliberado', sortable: true },
    { title: 'Fornecedor', key: 'fornecedor', sortable: true }
  ]
})

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

// Calcular valor total das contas selecionadas considerando campos editáveis
const valorSelecionado = computed(() => {
  return contasSelecionadas.value.reduce((total, item) => {
    const vlrAPagar = parseFloat(item.vlrapagar || item.saldo_devedor || 0)
    const juros = parseFloat(item.juros || 0)
    const multa = parseFloat(item.multa || 0)
    const desconto = parseFloat(item.desconto || 0)
    const valorFinal = vlrAPagar + juros + multa - desconto
    return total + (isNaN(valorFinal) ? 0 : valorFinal)
  }, 0)
})

// Função chamada quando usuário edita um dos campos na tabela
function atualizarValorSelecionado() {
  // O computed `valorSelecionado` depende dos campos reativos dos itens selecionados,
  // então não precisamos fazer nada além de acessar os valores para forçar reatividade
  // (manter função para ligação ao evento @input nos campos)
  void valorSelecionado.value
}

// Watchers

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

// Formata número para moeda BRL (string)
const formatCurrencyBR = (value) => {
  const numero = Number(value) || 0
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(numero)
}

// Converte string formatada (ex: "1.234,56" ou "R$ 1.234,56") para número
const parseCurrencyBR = (str) => {
  if (str === null || str === undefined) return 0
  if (typeof str === 'number') return str
  const s = String(str)
  // Remove prefix R$, espaços, e pontos de milhar, substitui vírgula por ponto
  const cleaned = s.replace(/R\$|\s/g, '').replace(/\./g, '').replace(/,/g, '.')
  const n = parseFloat(cleaned.replace(/[^[0-9\-.]/g, ''))
  return isNaN(n) ? 0 : n
}

// Handlers para inputs em linhas da tabela
const handleItemCurrencyInput = (item, field, val) => {
  // val é a string exibida; atualiza o campo numérico e a string
  item[field + '_display'] = val
  item[field] = parseCurrencyBR(val)
  atualizarValorSelecionado()
}

const handleItemCurrencyBlur = (item, field) => {
  item[field + '_display'] = formatCurrencyBR(item[field])
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

    // Verificar obrigatoriedade de datas (dtini/dtfim ou dt_inicio/dt_fim)
    const temDataInicio = filtrosApi.dtini || filtrosApi.dt_inicio
    const temDataFim = filtrosApi.dtfim || filtrosApi.dt_fim
    
    if (!temDataInicio || !temDataFim) {
      console.log('❌ Busca não executada: datas obrigatórias não informadas')
      // mostrarMensagem('Informe o período para buscar as contas', 'info')
      return
    }
    
    console.log('🚀 Chamando buscarContasPagarBaixa com filtros:', filtrosApi)
    const dados = await financeiroStore.buscarContasPagarBaixa(
      idEmpresa.value,
      filtrosApi
    )
    
    contasPagar.value = dados?.map(item => ({
      ...item,
      vlrparcela: parseFloat(item.vlrparcela || 0),
      vlrquitado: parseFloat(item.vlrquitado || 0),
      saldo_devedor: parseFloat(item.saldo_devedor || 0),
      // Inicializa o valor que será pago com o saldo_devedor quando não houver valor específico
      vlrapagar: parseFloat(item.vlrapagar || item.saldo_devedor || 0),
      juros: parseFloat(item.juros || 0),
      multa: parseFloat(item.multa || 0),
      desconto: parseFloat(item.desconto || 0),
      vlrliberado: parseFloat(item.vlrliberado || 0),
      // campos de display para edição com máscara
      vlrapagar_display: formatCurrencyBR(item.vlrapagar || item.saldo_devedor || 0),
      juros_display: formatCurrencyBR(item.juros || 0),
      multa_display: formatCurrencyBR(item.multa || 0),
      desconto_display: formatCurrencyBR(item.desconto || 0),
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

// Executar baixa por caixa
const executarBaixaCaixa = async (dadosBaixa) => {
  try {
    loadingBaixa.value = true

    const payload = await montarPayloadBaixa('caixa', dadosBaixa)

    // Chamar API de baixa (local_lct = CAI)
    await financeiroStore.baixarPagamentos(idEmpresa.value, payload)
    
    mostrarMensagem(`${contasSelecionadas.value.length} pagamento(s) baixado(s) por caixa com sucesso!`, 'success')
    
    // Limpar seleções e fechar dialog
    limparSelecoes()
    dialogBaixa.aberto = false
    
    // Recarregar dados
    await carregarContasPagar(filtrosAvancados.value)
    
  } catch (error) {
    console.error('Erro ao baixar pagamentos por caixa:', error)
    mostrarMensagem('Erro ao baixar pagamentos por caixa', 'error')
  } finally {
    loadingBaixa.value = false
  }
}

// Executar baixa por banco
const executarBaixaBanco = async (dadosBaixa) => {
  try {
    loadingBaixa.value = true

    const payload = await montarPayloadBaixa('banco', dadosBaixa)

    // Chamar API de baixa (local_lct = BAN)
    await financeiroStore.baixarPagamentos(idEmpresa.value, payload)
    
    mostrarMensagem(`${contasSelecionadas.value.length} pagamento(s) baixado(s) por banco com sucesso!`, 'success')
    
    // Limpar seleções e fechar dialog
    limparSelecoes()
    dialogBaixa.aberto = false
    
    // Recarregar dados
    await carregarContasPagar(filtrosAvancados.value)
    
  } catch (error) {
    console.error('Erro ao baixar pagamentos por banco:', error)
    mostrarMensagem('Erro ao baixar pagamentos por banco', 'error')
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

.campo-editavel-tabela {
  background-color: #faf2e5 !important;
}

.campo-editavel-dark {
  background-color: rgba(255, 255, 255, 0.05) !important;
  color: white !important;
}

.campo-editavel-tabela input {
  text-align: right;
}

.vlr-a-pagar input {
  text-align: right;
}

.text-red {
  color: #f44336 !important;
}
</style>
