<template>
  <top-all-pages icon="mdi-cash-plus">
    <template #titulo>Baixa de Recebimentos</template>
    <template #acoes>
      <v-btn
          icon
          color="var(--text-color-laranja)"
          variant="outlined"
          size="small"
          :disabled="!podeExportar(ID_PROGRAMA) && !podePDF(ID_PROGRAMA)"
          @click="modalExportacaoAberto = true"
      >
        <v-icon icon="mdi-printer"></v-icon>
        <v-tooltip activator="parent" location="top">
          {{ !podeExportar(ID_PROGRAMA) && !podePDF(ID_PROGRAMA) ? 'Sem permissão' : 'Imprimir / Exportar' }}
        </v-tooltip>
      </v-btn>
    </template>
    <template #section>
      <div>
        <!-- Card com Total das Parcelas e Ações de Baixa -->
        <v-card class="background-secondary mb-4" elevation="0">
          <v-card-text class="pa-4">
            <div class="d-flex justify-space-between align-items-center">
              <div>
                <h4 class="text-h6 mb-2">Resumo Financeiro</h4>
                <p class="text-body-1 mb-1">
                  Total de parcelas: <strong>{{ contasReceber.length }}</strong>
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
                    @click="confirmarBaixaRecebimento"
                    variant="flat"
                    class="text-white"
                    prepend-icon="mdi-cash-plus"
                >
                  Baixar {{ contasSelecionadas.length }} Recebimento(s)
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

        <!-- Lista de Contas a Receber -->
        <v-card :color="themeStore.darkMode ? 'text-white' : ''" class="background-secondary" elevation="0">
          <v-card-text class="pa-4">
            <!-- Busca Avançada -->
            <BuscaAvancadaBaixa
                entidade="contasreceber"
                @aplicar="aplicarFiltrosAvancados"
            />

            <!-- Tabela de Contas a Receber -->
            <TabelaPadrao
                :headers="headers"
                :items="contasReceberFiltradas"
                :loading="loading"
                :search="search"
                @update:search="(value) => search = value"
                search-label="Pesquisar contas a receber"
                item-key="id"
                no-data-icon="mdi-cash-plus-outline"
                no-data-text="Nenhuma conta a receber encontrada para baixa"
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
                    :indeterminate="contasSelecionadas.length > 0 && contasSelecionadas.length < contasReceberFiltradas.length"
                />
              </template>

              <!-- Formatação da data de vencimento -->
              <template v-slot:[`item.dtvencimento`]="{ item }">
            <span :class="{ 'text-red': isVencido(item.dtvencimento) }">
              {{ item.dtvencimento ? new Date(item.dtvencimento.length === 10 ? item.dtvencimento + 'T00:00:00' : item.dtvencimento).toLocaleDateString('pt-BR') : '--' }}
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

              <!-- Edição inline de Vlr a Receber (novo campo editável) -->
              <template v-slot:[`item.vlrareceber`]="{ item }">
                <v-text-field
                    v-model="item.vlrareceber_display"
                    type="text"
                    step="0.01"
                    variant="outlined"
                    density="compact"
                    hide-details
                    class="campo-editavel-tabela vlr-a-receber"
                    :class="{ 'campo-editavel-dark': themeStore.darkMode }"
                    style="width: 160px; min-width: 120px;"
                    @update:model-value="(val) => handleItemCurrencyInput(item, 'vlrareceber', val)"
                    @blur="() => handleItemCurrencyBlur(item, 'vlrareceber')"
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
            :dados="contasReceber"
            :filtros="{}"
            nome-relatorio="Baixa de Recebimentos"
            @exportar-pdf="() => {}"
            @exportar-csv="() => {}"
            @exportar-excel="() => {}"
            @imprimir="() => {}"
        />

        <!-- Modal de Preview do PDF -->
        <PdfPreviewModal
            v-model="modalPreviewPDF"
            :html-content="previewHTMLContent"
            :nome-relatorio="dadosPDFAtual?.nomeRelatorio || 'Baixa_Recebimentos'"
        />

        <!-- Modal de Acesso Negado -->
        <AcessoNegadoModal
            v-model="acessoNegadoModal"
            :nome-programa="'Rotina Baixa de Títulos a Receber'"
            :tipo-acesso="tipoAcessoNegado"
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
import { usePermissoes } from '@/utils/usePermissoes'
import TabelaPadrao from '@/components/base/padrao-paginas/TabelaPadrao.vue'
import BuscaAvancadaBaixa from '@/components/base/padrao-paginas/BuscaAvancadaBaixa.vue'
import BaixaCaixaModal from '@/components/base/modais/BaixaCaixaModal.vue'
import BaixaBancoModal from '@/components/base/modais/BaixaBancoModal.vue'
import TopAllPages from "@/components/base/padrao-paginas/TopAllPages.vue";
import ExportacaoModal from '@/components/base/modais/ExportacaoModal.vue'
import PdfPreviewModal from '@/components/base/modais/PdfPreviewModal.vue'
import AcessoNegadoModal from '@/components/base/modais/AcessoNegadoModal.vue'

// ID do programa desta tela
const ID_PROGRAMA = 'FFIN211E'

const themeStore = useThemeStore()
const financeiroStore = useFinanceiroStore()
const configParfinStore = useConfigParfinStore()
const { podeVisualizar, podeAlterar, podeExportar, podePDF } = usePermissoes()

// Modal de acesso negado
const acessoNegadoModal = ref(false)
const tipoAcessoNegado = ref('')

// Refs
const search = ref('')
const loading = ref(false)
const loadingBaixa = ref(false)
const filtrosAvancados = ref({})

// Estado dos dados
const contasReceber = ref([])
const contasSelecionadas = ref([])
const todosSelecionados = ref(false)
const tipoBaixa = ref('banco')

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

// ID da empresa
const idEmpresa = ref(1)

// Cache local dos parâmetros financeiros (Contas a Receber)
const parfinReceber = ref(null)

const round2 = (n) => Math.round((Number(n) || 0) * 100) / 100

const normalizarPrimeiroRegistro = (resp) => {
  if (!resp) return null
  if (Array.isArray(resp)) return resp[0] || null
  if (Array.isArray(resp.data)) return resp.data[0] || null
  return resp?.data || resp
}

const carregarParfinReceberSeNecessario = async () => {
  if (parfinReceber.value) return parfinReceber.value
  const resp = await configParfinStore.buscarParametrosFinanceirosReceber(idEmpresa.value)
  parfinReceber.value = normalizarPrimeiroRegistro(resp)
  return parfinReceber.value
}

const montarPayloadBaixa = async (tipo, dadosBaixa) => {
  const parfin = (await carregarParfinReceberSeNecessario()) || {}
  const local_lct = tipo === 'caixa' ? 'CAI' : 'BAN'

  const data = (contasSelecionadas.value || []).map((item) => {
    const vlrparcela = round2(item?.saldo_devedor ?? item?.vlrparcela ?? 0)
    const vlrjuros = round2(item?.juros ?? 0)
    const vlrmulta = round2(item?.multa ?? 0)
    const vlrdesconto = round2(item?.desconto ?? 0)

    const vlrNormal = round2(item?.vlrareceber ?? vlrparcela)
    const vlrbaixa = round2(vlrNormal + vlrjuros + vlrmulta - vlrdesconto)

    return {
      // Identificadores
      id: item?.id ?? null,
      id_parcela: item?.id_parcela ?? item?.id ?? null,
      nrparcela: item?.nrparcela ?? null,

      // Campos do payload
      id_empresa: idEmpresa.value,
      local_lct,
      dt_baixa: dadosBaixa?.dtPagamento ?? null,
      vlrbaixa,
      vlrparcela,
      vlrjuros,
      vlrmulta,
      vlrdesconto,
      id_lote_ccusto: item?.id_lote_ccusto ?? item?.id_lote_ccusto_previsto ?? null,
      rec_id_red_ctb_juros_recebido: parfin?.rec_id_red_ctb_juros_recebido ?? null,
      rec_id_red_ctb_multa_recebida: parfin?.rec_id_red_ctb_multa_recebida ?? null,
      rec_id_red_ctb_desc_concedido: parfin?.rec_id_red_ctb_desc_concedido ?? null,
      id_reduzido_cli: parfin?.rec_id_red_ctb_cli ?? parfin?.id_reduzido_cli ?? null,
      id_reduzido_ctb_caixa: dadosBaixa?.id_reduzido_ctb_caixa ?? parfin?.rec_id_red_ctb_caixa ?? null,
      id_reduzido_ctb_banco: dadosBaixa?.id_reduzido_ctb_banco ?? parfin?.rec_id_red_ctb_banco ?? null,
      id_caixa: tipo === 'caixa' ? (dadosBaixa?.codigoCaixa ?? null) : null,
      id_ccorrente: tipo === 'banco' ? (dadosBaixa?.codigoBanco ?? null) : null,
      rec_id_hist_bxa_caixa: local_lct === 'CAI' ? (parfin?.rec_id_hist_bxa_caixa ?? null) : null,
      rec_id_hist_bxa_caixa_ctb: local_lct === 'CAI' ? (parfin?.rec_id_hist_bxa_caixa_ctb ?? null) : null,
      rec_id_hist_bxa_banco: local_lct === 'BAN' ? (parfin?.rec_id_hist_bxa_banco ?? null) : null,
      rec_id_hist_bxa_banco_ctb: local_lct === 'BAN' ? (parfin?.rec_id_hist_bxa_banco_ctb ?? null) : null,
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

// Headers da tabela
const headers = computed(() => {
  const baseHeaders = [
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
    { title: 'Vlr a Receber', key: 'vlrareceber', sortable: true },
    { title: 'Vlr Liberado', key: 'vlrliberado', sortable: true },
    { title: 'Cliente', key: 'cliente', sortable: true }
  ]

  return baseHeaders
})

// Computed
const contasReceberFiltradas = computed(() => {
  const dados = contasReceber.value || []
  if (!Array.isArray(dados)) return []
  
  return dados
})

const totalParcelasFiltradas = computed(() => {
  return contasReceberFiltradas.value.reduce((total, item) => {
    const valor = parseFloat(item.vlrparcela || 0)
    return total + valor
  }, 0)
})

const valorSelecionado = computed(() => {
  return contasSelecionadas.value.reduce((total, item) => {
    const vlrAReceber = parseFloat(item.vlrareceber || item.saldo_devedor || 0)
    const juros = parseFloat(item.juros || 0)
    const multa = parseFloat(item.multa || 0)
    const desconto = parseFloat(item.desconto || 0)
    const valorFinal = vlrAReceber + juros + multa - desconto
    return total + (isNaN(valorFinal) ? 0 : valorFinal)
  }, 0)
})

function atualizarValorSelecionado() {
  void valorSelecionado.value
}

// Watchers
watch(() => contasSelecionadas.value.length, (novaQtd) => {
  if (novaQtd === 0) {
    todosSelecionados.value = false
  } else if (novaQtd === contasReceberFiltradas.value.length) {
    todosSelecionados.value = true
  }
})

// Formatação monetária
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

const formatCurrencyBR = (value) => {
  const numero = Number(value) || 0
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(numero)
}

const parseCurrencyBR = (str) => {
  if (str === null || str === undefined) return 0
  if (typeof str === 'number') return str
  const s = String(str)
  const cleaned = s.replace(/R\$|\s/g, '').replace(/\./g, '').replace(/,/g, '.')
  const n = parseFloat(cleaned.replace(/[^[0-9\-.]/g, ''))
  return isNaN(n) ? 0 : n
}

const handleItemCurrencyInput = (item, field, val) => {
  item[field + '_display'] = val
  item[field] = parseCurrencyBR(val)
  atualizarValorSelecionado()
}

const handleItemCurrencyBlur = (item, field) => {
  item[field + '_display'] = formatCurrencyBR(item[field])
}

const isVencido = (dataVencimento) => {
  if (!dataVencimento) return false
  const hoje = new Date()
  const vencimento = new Date(dataVencimento)
  return vencimento < hoje
}

// Métodos
const carregarContasReceber = async (filtrosApi = null) => {
  try {
    loading.value = true
    
    console.log('🔍 Carregando contas a receber com filtros:', filtrosApi)
    
    const temFiltros = filtrosApi && Object.keys(filtrosApi).length > 0
    if (!temFiltros) {
      console.log('❌ Busca não executada: nenhum filtro aplicado')
      contasReceber.value = []
      mostrarMensagem('Aplique pelo menos um filtro para buscar as contas', 'info')
      return
    }

    const temDataInicio = filtrosApi.dtini || filtrosApi.dt_inicio
    const temDataFim = filtrosApi.dtfim || filtrosApi.dt_fim
    
    if (!temDataInicio || !temDataFim) {
      console.log('❌ Busca não executada: datas obrigatórias não informadas')
      return
    }
    
    console.log('🚀 Chamando buscarContasReceberBaixa com filtros:', filtrosApi)
    const dados = await financeiroStore.buscarContasReceberBaixa(
      idEmpresa.value,
      filtrosApi
    )
    
    contasReceber.value = dados?.map(item => ({
      ...item,
      vlrparcela: parseFloat(item.vlrparcela || 0),
      vlrquitado: parseFloat(item.vlrquitado || 0),
      saldo_devedor: parseFloat(item.saldo_devedor || 0),
      vlrareceber: parseFloat(item.vlrareceber || item.saldo_devedor || 0),
      juros: parseFloat(item.juros || 0),
      multa: parseFloat(item.multa || 0),
      desconto: parseFloat(item.desconto || 0),
      vlrliberado: parseFloat(item.vlrliberado || 0),
      vlrareceber_display: formatCurrencyBR(item.vlrareceber || item.saldo_devedor || 0),
      juros_display: formatCurrencyBR(item.juros || 0),
      multa_display: formatCurrencyBR(item.multa || 0),
      desconto_display: formatCurrencyBR(item.desconto || 0),
      id_media: item.id_media || ''
    })) || []
    
  } catch (error) {
    console.error('Erro ao carregar contas a receber:', error)
    mostrarMensagem('Erro ao carregar contas a receber', 'error')
    contasReceber.value = []
  } finally {
    loading.value = false
  }
}

const aplicarFiltrosAvancados = async (filtros) => {
  try {
    console.log('📋 Filtros recebidos do componente BuscaAvancada:', filtros)

    filtrosAvancados.value = { ...filtros };

    const filtrosApi = Object.entries(filtrosAvancados.value)
      .filter(([, valor]) => valor !== null && valor !== undefined && valor !== '')
      .reduce((acc, [chave, valor]) => {
        acc[chave] = valor
        return acc
      }, {});

    console.log('🔧 Filtros processados para API:', filtrosApi);

    await carregarContasReceber(filtrosApi);
  } catch (error) {
    console.error('Erro ao aplicar filtros:', error);
    mostrarMensagem('Erro ao aplicar filtros', 'error');
  }
}

const toggleTodosSelecionados = (selecionado) => {
  if (selecionado) {
    contasSelecionadas.value = [...contasReceberFiltradas.value]
  } else {
    contasSelecionadas.value = []
  }
}

const limparSelecoes = () => {
  contasSelecionadas.value = []
  todosSelecionados.value = false
}

const confirmarBaixaRecebimento = () => {
  // Verificar permissão para alterar (fazer a baixa é uma alteração)
  if (!podeAlterar(ID_PROGRAMA)) {
    tipoAcessoNegado.value = 'alterar'
    acessoNegadoModal.value = true
    return
  }

  if (contasSelecionadas.value.length === 0) {
    mostrarMensagem('Selecione pelo menos uma conta para baixar', 'warning')
    return
  }
  
  dialogBaixa.aberto = true
}

const executarBaixaCaixa = async (dadosBaixa) => {
  try {
    loadingBaixa.value = true

    console.log('Dados da baixa por caixa:', dadosBaixa)

    const payload = await montarPayloadBaixa('caixa', dadosBaixa)

    await financeiroStore.baixarContasReceber(idEmpresa.value, payload)
    
    mostrarMensagem(`${contasSelecionadas.value.length} recebimento(s) baixado(s) por caixa com sucesso!`, 'success')
    
    limparSelecoes()
    dialogBaixa.aberto = false
    
    await carregarContasReceber(filtrosAvancados.value)
    
  } catch (error) {
    console.error('Erro ao baixar recebimentos por caixa:', error)
    mostrarMensagem('Erro ao baixar recebimentos por caixa', 'error')
  } finally {
    loadingBaixa.value = false
  }
}

const executarBaixaBanco = async (dadosBaixa) => {
  try {
    loadingBaixa.value = true

    const payload = await montarPayloadBaixa('banco', dadosBaixa)

    await financeiroStore.baixarContasReceber(idEmpresa.value, payload)
    
    mostrarMensagem(`${contasSelecionadas.value.length} recebimento(s) baixado(s) por banco com sucesso!`, 'success')
    
    limparSelecoes()
    dialogBaixa.aberto = false
    
    await carregarContasReceber(filtrosAvancados.value)
    
  } catch (error) {
    console.error('Erro ao baixar recebimentos por banco:', error)
    mostrarMensagem('Erro ao baixar recebimentos por banco', 'error')
  } finally {
    loadingBaixa.value = false
  }
}

const mostrarMensagem = (mensagem, tipo) => {
  snackbar.message = mensagem
  snackbar.color = tipo
  snackbar.show = true
}

onMounted(async () => {
  // Verificar se o usuário tem permissão para visualizar este programa
  if (!podeVisualizar(ID_PROGRAMA)) {
    console.warn('[BaixaRecebView] Usuário sem permissão para visualizar')
    tipoAcessoNegado.value = 'visualizar'
    acessoNegadoModal.value = true
    return
  }

  console.log('Tela de baixa de recebimento carregada. Aguardando filtros com datas para buscar dados.')
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

.vlr-a-receber input {
  text-align: right;
}

.text-red {
  color: #f44336 !important;
}
</style>
