<template>
  <top-all-pages icon="mdi-undo-variant">
    <template #titulo>Estorno de Títulos a Pagar</template>
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
        <!-- Content Card -->
        <v-card :color="themeStore.darkMode ? 'text-white' : ''" class="background-secondary" elevation="0">
          <v-card-text class="pa-4">
            <!-- Filtros -->
            <v-card class="background-card mb-1" elevation="0">
              <v-card-title class="text-h6 pa-4">
                <v-icon icon="mdi-filter" class="mr-2"></v-icon>
                Período da Baixa
              </v-card-title>
              <v-card-text class="pa-4">
                <v-row>
                  <v-col cols="12" md="4">
                    <v-text-field
                        v-model="filtros.dataInicio"
                        label="De"
                        type="date"
                        variant="outlined"
                        density="comfortable"
                        hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                        v-model="filtros.dataFim"
                        label="a"
                        type="date"
                        variant="outlined"
                        density="comfortable"
                        hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" class="d-flex align-center">
                    <v-btn
                        color="var(--text-color-laranja)"
                        :loading="loading"
                        :disabled="!filtros.dataInicio || !filtros.dataFim"
                        @click="pesquisarBaixas"
                        variant="flat"
                        class="text-white"
                        prepend-icon="mdi-magnify"
                    >
                      Pesquisar
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- Tabela de Resultados -->
            <v-card class="background-card" elevation="0">
              <v-card-title class="text-h6 pa-4">
                <v-icon icon="mdi-table" class="mr-2"></v-icon>
                Lotes de Baixa
              </v-card-title>
              <v-card-text class="pa-4 border">
                <v-data-table
                    :headers="headers"
                    :items="baixasAgrupadas"
                    :loading="loading"
                    show-expand
                    item-value="uniqueId"
                    class="background-card"
                    :items-per-page="10"
                    :items-per-page-options="[10, 25, 50, 100]"
                    no-data-text="Nenhum registro encontrado no período"
                    loading-text="Carregando baixas..."
                >
                  <!-- ID Lote -->
                  <template v-slot:[`item.id_pagbaixa_lote`]="{ item }">
                    <div class="font-weight-bold">
                      <v-chip size="small" color="primary">
                        #{{ item.id_pagbaixa_lote || 'S/N' }}
                      </v-chip>
                    </div>
                  </template>

                  <!-- Valor Total Baixado -->
                  <template v-slot:[`item.vlrbaixado_lote`]="{ item }">
                    <div class="font-weight-medium">
                      {{ formatarMoeda(item.vlrbaixado_lote) }}
                    </div>
                  </template>

                  <!-- Data da Baixa -->
                  <template v-slot:[`item.dhinc`]="{ item }">
                    <div>{{ item.dhinc }}</div>
                  </template>

                  <!-- Usuário -->
                  <template v-slot:[`item.usuario_baixou`]="{ item }">
                    <v-chip size="small" color="secondary">
                      {{ item.usuario_baixou }}
                    </v-chip>
                  </template>

                  <!-- Quantidade -->
                  <template v-slot:[`item.quantidade`]="{ item }">
                    <v-chip size="small" color="info">
                      {{ item.quantidade }} título(s)
                    </v-chip>
                  </template>

                  <!-- Detalhes expandidos -->
                  <template v-slot:expanded-row="{ item }">
                    <tr>
                      <td :colspan="headers.length" class="pa-4">
                        <v-card flat class="background-secondary">
                          <v-card-text>
                            <v-data-table
                                :headers="headersDetalhes"
                                :items="item.detalhes"
                                hide-default-footer
                                density="compact"
                                class="elevation-0 background-card"
                            >
                              <!-- Número da Parcela -->
                              <template v-slot:[`item.nrparcela`]="{ item: detalhe }">
                                <v-chip size="small" :color="detalhe.nrparcela ? 'info' : 'grey'">
                                  {{ detalhe.nrparcela || '-' }}
                                </v-chip>
                              </template>

                              <!-- Vencimento -->
                              <template v-slot:[`item.dtvencimento`]="{ item: detalhe }">
                                <div>{{ detalhe.dtvencimento }}</div>
                              </template>

                              <!-- Fornecedor -->
                              <template v-slot:[`item.fornecedor`]="{ item: detalhe }">
                                <div>{{ detalhe.fornecedor || '-' }}</div>
                              </template>

                              <!-- Valor Parcela -->
                              <template v-slot:[`item.vlrparcela`]="{ item: detalhe }">
                                <div>{{ formatarMoeda(detalhe.vlrparcela) }}</div>
                              </template>

                              <!-- Juros -->
                              <template v-slot:[`item.vlrjuros`]="{ item: detalhe }">
                                <div :class="detalhe.vlrjuros > 0 ? 'text-error' : ''">
                                  {{ formatarMoeda(detalhe.vlrjuros) }}
                                </div>
                              </template>

                              <!-- Multa -->
                              <template v-slot:[`item.vlrmulta`]="{ item: detalhe }">
                                <div :class="detalhe.vlrmulta > 0 ? 'text-error' : ''">
                                  {{ formatarMoeda(detalhe.vlrmulta) }}
                                </div>
                              </template>

                              <!-- Desconto -->
                              <template v-slot:[`item.vlrdesconto`]="{ item: detalhe }">
                                <div :class="detalhe.vlrdesconto > 0 ? 'text-success' : ''">
                                  {{ formatarMoeda(detalhe.vlrdesconto) }}
                                </div>
                              </template>

                              <!-- Tipo Composição -->
                              <template v-slot:[`item.tipo_composicao`]="{ item: detalhe }">
                                <v-chip
                                    size="small"
                                    :color="detalhe.tipo_composicao?.includes('CAIXA') ? 'orange' : detalhe.tipo_composicao?.includes('BANCO') ? 'blue' : 'grey'"
                                >
                                  {{ detalhe.tipo_composicao?.includes('CAIXA') ? 'CAIXA' : detalhe.tipo_composicao?.includes('BANCO') ? 'BANCO' : detalhe.tipo_composicao || '-' }}
                                </v-chip>
                              </template>
                            </v-data-table>

                            <!-- Botão de Estorno do Lote -->
                            <div class="d-flex justify-end mt-4">
                              <v-btn
                                  color="error"
                                  variant="flat"
                                  prepend-icon="mdi-undo-variant"
                                  @click="confirmarEstornoLote(item)"
                              >
                                Estornar Lote Completo
                              </v-btn>
                            </div>
                          </v-card-text>
                        </v-card>
                      </td>
                    </tr>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>

        <!-- Dialog de Confirmação de Estorno -->
        <v-dialog v-model="dialogEstorno" max-width="500">
          <v-card>
            <v-card-title class="text-h6 pa-4 background-secondary">
              <v-icon icon="mdi-alert" class="mr-2" color="error"></v-icon>
              Confirmar Estorno do Lote
            </v-card-title>
            <v-card-text class="pa-4">
              <p class="mb-2">Deseja realmente estornar todo o lote de baixa?</p>
              <div v-if="itemParaEstornar">
                <v-divider class="my-3"></v-divider>
                <div><strong>ID Lote:</strong> #{{ itemParaEstornar.id_pagbaixa_lote || 'S/N' }}</div>
                <div><strong>Quantidade de Títulos:</strong> {{ itemParaEstornar.quantidade }}</div>
                <div><strong>Valor Total do Lote:</strong> {{ formatarMoeda(itemParaEstornar.vlrbaixado_lote) }}</div>
                <div><strong>Data da Baixa:</strong> {{ itemParaEstornar.dhinc }}</div>
                <div><strong>Usuário:</strong> {{ itemParaEstornar.usuario_baixou }}</div>
                <v-alert type="warning" variant="tonal" class="mt-3">
                  Esta ação irá estornar TODOS os {{ itemParaEstornar.quantidade }} título(s) deste lote.
                </v-alert>
              </div>
            </v-card-text>
            <v-card-actions class="pa-4">
              <v-spacer></v-spacer>
              <v-btn color="grey" variant="text" @click="dialogEstorno = false">
                Cancelar
              </v-btn>
              <v-btn
                  color="error"
                  variant="flat"
                  :loading="loadingEstorno"
                  @click="executarEstorno"
              >
                Estornar Lote
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Modal de Exportação -->
        <ExportacaoModal
            v-model="modalExportacaoAberto"
            :dados="estornosPagar"
            :filtros="{}"
            nome-relatorio="Estorno de Títulos a Pagar"
            @exportar-pdf="() => {}"
            @exportar-csv="() => {}"
            @exportar-excel="() => {}"
            @imprimir="() => {}"
        />

        <!-- Modal de Preview do PDF -->
        <PdfPreviewModal
            v-model="modalPreviewPDF"
            :html-content="previewHTMLContent"
            :nome-relatorio="dadosPDFAtual?.nomeRelatorio || 'Estorno_Pagar'"
        />

        <!-- Modal de Acesso Negado -->
        <AcessoNegadoModal
            v-model="acessoNegadoModal"
            :nome-programa="'Rotina Estorno de Títulos Pagos'"
            :tipo-acesso="tipoAcessoNegado"
        />
      </div>
    </template>
  </top-all-pages>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useThemeStore } from '@/stores/config-temas/theme'
import { useFinanceiroStore } from '@/stores/APIs/financeiro'
import { usePermissoes } from '@/utils/usePermissoes'
import { toast } from 'vue3-toastify'
import TopAllPages from "@/components/base/padrao-paginas/TopAllPages.vue";
import ExportacaoModal from '@/components/base/modais/ExportacaoModal.vue'
import PdfPreviewModal from '@/components/base/modais/PdfPreviewModal.vue'
import AcessoNegadoModal from '@/components/base/modais/AcessoNegadoModal.vue'

// ID do programa desta tela
const ID_PROGRAMA = 'FFIN208E'

const themeStore = useThemeStore()
const financeiroStore = useFinanceiroStore()
const { podeVisualizar, podeAlterar, podeExportar, podePDF } = usePermissoes()

// Modal de acesso negado
const acessoNegadoModal = ref(false)
const tipoAcessoNegado = ref('')

const loading = ref(false)
const loadingEstorno = ref(false)
const dialogEstorno = ref(false)
const itemParaEstornar = ref(null)

// Modais de exportação
const modalExportacaoAberto = ref(false)
const modalPreviewPDF = ref(false)
const previewHTMLContent = ref('')
const dadosPDFAtual = ref(null)

// Data
const estornosPagar = ref([])

// ...existing code...

// Obter primeiro e último dia do mês atual
const obterDatasDoMesAtual = () => {
  const hoje = new Date()
  const ano = hoje.getFullYear()
  const mes = hoje.getMonth()
  
  const primeiroDia = new Date(ano, mes, 1)
  const ultimoDia = new Date(ano, mes + 1, 0)
  
  const formatarData = (data) => {
    const ano = data.getFullYear()
    const mes = String(data.getMonth() + 1).padStart(2, '0')
    const dia = String(data.getDate()).padStart(2, '0')
    return `${ano}-${mes}-${dia}`
  }
  
  return {
    dataInicio: formatarData(primeiroDia),
    dataFim: formatarData(ultimoDia)
  }
}

const filtros = ref(obterDatasDoMesAtual())

const baixas = ref([])

// Headers da tabela principal
const headers = [
  { title: '', key: 'data-table-expand', sortable: false },
  { title: 'ID Lote', key: 'id_pagbaixa_lote', sortable: true },
  { title: 'Valor Total Baixado', key: 'vlrbaixado_lote', sortable: true },
  { title: 'Data da Baixa', key: 'dhinc', sortable: true },
  { title: 'Usuário', key: 'usuario_baixou', sortable: true },
  { title: 'Qtd Títulos', key: 'quantidade', sortable: true }
]

// Headers da tabela de detalhes
const headersDetalhes = [
  { title: 'Parcela', key: 'nrparcela', sortable: false },
  { title: 'Vencimento', key: 'dtvencimento', sortable: false },
  { title: 'Fornecedor', key: 'fornecedor', sortable: false },
  { title: 'Vlr Parcela', key: 'vlrparcela', sortable: false },
  { title: 'Juros', key: 'vlrjuros', sortable: false },
  { title: 'Multa', key: 'vlrmulta', sortable: false },
  { title: 'Desconto', key: 'vlrdesconto', sortable: false },
  { title: 'Tipo', key: 'tipo_composicao', sortable: false }
]

// Agrupar baixas por lote
const baixasAgrupadas = computed(() => {
  const grupos = {}
  
  baixas.value.forEach(baixa => {
    const loteId = baixa.id_pagbaixa_lote || 'sem-lote'
    
    if (!grupos[loteId]) {
      grupos[loteId] = {
        id_pagbaixa_lote: baixa.id_pagbaixa_lote,
        vlrbaixado_lote: parseFloat(baixa.vlrbaixado_lote || 0),
        dhinc: formatarDataHora(baixa.dhinc),
        usuario_baixou: baixa.usuario_baixou,
        quantidade: 0,
        detalhes: []
      }
    }
    
    grupos[loteId].quantidade += 1
    grupos[loteId].detalhes.push({
      ...baixa,
      dhinc: formatarDataHora(baixa.dhinc),
      dtvencimento: formatarData(baixa.dtvencimento)
    })
  })
  
  // Adicionar ID único para cada grupo
  return Object.values(grupos).map((grupo, index) => ({
    ...grupo,
    uniqueId: `lote-${grupo.id_pagbaixa_lote || 'sem'}-${index}`
  }))
})

// Pesquisar baixas
const pesquisarBaixas = async () => {
  if (!filtros.value.dataInicio || !filtros.value.dataFim) {
    toast.error('Informe o período da baixa')
    return
  }

  loading.value = true
  try {
    // Aqui você deve ajustar a chamada da API conforme seu backend
    // Este é um exemplo genérico
    const response = await financeiroStore.buscarBaixasPagar({
      data_inicio: filtros.value.dataInicio,
      data_fim: filtros.value.dataFim
    })
    
    baixas.value = Array.isArray(response) ? response : []
    
    if (baixas.value.length === 0) {
      toast.info('Nenhuma baixa encontrada no período informado')
    }
  } catch (error) {
    console.error('Erro ao buscar baixas:', error)
    toast.error('Erro ao buscar baixas')
    baixas.value = []
  } finally {
    loading.value = false
  }
}

// Confirmar estorno do lote
const confirmarEstornoLote = (lote) => {
  // Verificar permissão para alterar (fazer estorno é uma alteração)
  if (!podeAlterar(ID_PROGRAMA)) {
    tipoAcessoNegado.value = 'alterar'
    acessoNegadoModal.value = true
    return
  }

  itemParaEstornar.value = lote
  dialogEstorno.value = true
}

// Executar estorno
const executarEstorno = async () => {
  if (!itemParaEstornar.value) return

  loadingEstorno.value = true
  try {
    // Estornar usando o id_pagbaixa_lote
    await financeiroStore.estornarBaixaPagar(itemParaEstornar.value.id_pagbaixa_lote)
    
    toast.success('Lote estornado com sucesso!')
    dialogEstorno.value = false
    itemParaEstornar.value = null
    
    // Recarregar a lista
    await pesquisarBaixas()
  } catch (error) {
    console.error('Erro ao estornar baixa:', error)
    toast.error('Erro ao estornar baixa')
  } finally {
    loadingEstorno.value = false
  }
}

// Formatar moeda
const formatarMoeda = (valor) => {
  if (!valor && valor !== 0) return 'R$ 0,00'
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor)
}

// Formatar data e hora
const formatarDataHora = (dataISO) => {
  if (!dataISO) return '-'
  
  const data = new Date(dataISO)
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(data)
}

// Formatar apenas data
const formatarData = (dataISO) => {
  if (!dataISO) return '-'
  
  const data = new Date(dataISO + 'T00:00:00')
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(data)
}

// Buscar baixas ao montar o componente
onMounted(async () => {
  // Verificar se o usuário tem permissão para visualizar este programa
  if (!podeVisualizar(ID_PROGRAMA)) {
    console.warn('[EstornoPagarView] Usuário sem permissão para visualizar')
    tipoAcessoNegado.value = 'visualizar'
    acessoNegadoModal.value = true
    return
  }

  await pesquisarBaixas()
})
</script>

<style scoped>
.background-primary {
  background-color: var(--background-primary);
}

.background-secondary {
  background-color: var(--background-secondary);
}

.background-card {
  background-color: var(--background-card);
}
</style>
