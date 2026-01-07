<template>
  <div class="pa-4">
    <!-- Header Card -->
    <v-card class="background-secondary mb-4">
      <v-card-title class="text-h5 pa-4 d-flex justify-space-between align-center">
        <div class="d-flex align-center">
          <v-icon icon="mdi-undo-variant" class="mr-3"></v-icon>
          Estorno de Títulos Recebidos
        </div>
      </v-card-title>
    </v-card>

    <!-- Content Card -->
    <v-card :color="themeStore.darkMode ? 'text-white' : ''" class="background-secondary">
      <v-card-text class="pa-4">
        <!-- Filtros -->
        <v-card class="background-card mb-4" elevation="2">
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
        <v-card class="background-card" elevation="2">
          <v-card-title class="text-h6 pa-4">
            <v-icon icon="mdi-table" class="mr-2"></v-icon>
            Código da Baixa / Nf Documento
          </v-card-title>
          <v-card-text class="pa-4">
            <v-data-table
              :headers="headers"
              :items="baixasAgrupadas"
              :loading="loading"
              class="elevation-1"
              :items-per-page="10"
              :items-per-page-options="[10, 25, 50, 100]"
              no-data-text="Nenhum registro encontrado no período"
              loading-text="Carregando baixas..."
            >
              <!-- Cabeçalho expandível -->
              <template v-slot:[`item.data-table-expand`]="{ item, toggleExpand, isExpanded }">
                <v-btn
                  :icon="isExpanded(item) ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                  variant="text"
                  size="small"
                  @click="toggleExpand(item)"
                ></v-btn>
              </template>

              <!-- Código da Baixa -->
              <template v-slot:[`item.codigo_baixa`]="{ item }">
                <div class="font-weight-bold">{{ item.codigo_baixa }}</div>
                <div class="text-caption">{{ item.data_baixa }}</div>
              </template>

              <!-- Cliente -->
              <template v-slot:[`item.cliente`]="{ item }">
                <div>{{ item.cliente }}</div>
              </template>

              <!-- Valor Baixado -->
              <template v-slot:[`item.valor_total`]="{ item }">
                <div class="font-weight-medium">
                  {{ formatarMoeda(item.valor_total) }}
                </div>
              </template>

              <!-- Data de Vencimento -->
              <template v-slot:[`item.dt_vencto`]="{ item }">
                <div>{{ item.dt_vencto }}</div>
              </template>

              <!-- Data da Baixa -->
              <template v-slot:[`item.data_baixa`]="{ item }">
                <div>{{ item.data_baixa }}</div>
              </template>

              <!-- Tipo de Documento -->
              <template v-slot:[`item.tipo_doc`]="{ item }">
                <v-chip
                  size="small"
                  :color="item.tipo_doc === 'DUPLICATA' ? 'primary' : 'secondary'"
                >
                  {{ item.tipo_doc }}
                </v-chip>
              </template>

              <!-- Detalhes expandidos -->
              <template v-slot:expanded-row="{ item }">
                <tr>
                  <td :colspan="headers.length" class="pa-4">
                    <v-card flat class="background-primary">
                      <v-card-text>
                        <v-data-table
                          :headers="headersDetalhes"
                          :items="item.detalhes"
                          hide-default-footer
                          density="compact"
                          class="elevation-0"
                        >
                          <!-- Documento -->
                          <template v-slot:[`item.nf_documento`]="{ item: detalhe }">
                            <div>{{ detalhe.nf_documento }}</div>
                          </template>

                          <!-- Cliente -->
                          <template v-slot:[`item.cliente`]="{ item: detalhe }">
                            <div>{{ detalhe.cliente }}</div>
                          </template>

                          <!-- Valor Baixado -->
                          <template v-slot:[`item.valor_baixado`]="{ item: detalhe }">
                            <div>{{ formatarMoeda(detalhe.valor_baixado) }}</div>
                          </template>

                          <!-- Data de Vencimento -->
                          <template v-slot:[`item.dt_vencto`]="{ item: detalhe }">
                            <div>{{ detalhe.dt_vencto }}</div>
                          </template>

                          <!-- Data da Baixa -->
                          <template v-slot:[`item.data_baixa`]="{ item: detalhe }">
                            <div>{{ detalhe.data_baixa }}</div>
                          </template>

                          <!-- Tipo de Documento -->
                          <template v-slot:[`item.tipo_doc`]="{ item: detalhe }">
                            <v-chip
                              size="small"
                              :color="detalhe.tipo_doc === 'DUPLICATA' ? 'primary' : 'secondary'"
                            >
                              {{ detalhe.tipo_doc }}
                            </v-chip>
                          </template>

                          <!-- Ações -->
                          <template v-slot:[`item.actions`]="{ item: detalhe }">
                            <v-tooltip text="Estornar Baixa">
                              <template #activator="{ props }">
                                <v-btn
                                  v-bind="props"
                                  icon="mdi-undo-variant"
                                  variant="text"
                                  color="error"
                                  size="small"
                                  @click="confirmarEstorno(detalhe)"
                                ></v-btn>
                              </template>
                            </v-tooltip>
                          </template>
                        </v-data-table>
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
          Confirmar Estorno
        </v-card-title>
        <v-card-text class="pa-4">
          <p class="mb-2">Deseja realmente estornar esta baixa?</p>
          <div v-if="itemParaEstornar">
            <v-divider class="my-3"></v-divider>
            <div><strong>Documento:</strong> {{ itemParaEstornar.nf_documento }}</div>
            <div><strong>Cliente:</strong> {{ itemParaEstornar.cliente }}</div>
            <div><strong>Valor:</strong> {{ formatarMoeda(itemParaEstornar.valor_baixado) }}</div>
            <div><strong>Data Baixa:</strong> {{ itemParaEstornar.data_baixa }}</div>
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
            Estornar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useThemeStore } from '@/stores/config-temas/theme'
import { useFinanceiroStore } from '@/stores/APIs/financeiro'
import { toast } from 'vue3-toastify'

const themeStore = useThemeStore()
const financeiroStore = useFinanceiroStore()

const loading = ref(false)
const loadingEstorno = ref(false)
const dialogEstorno = ref(false)
const itemParaEstornar = ref(null)

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
  { title: 'Código da Baixa', key: 'codigo_baixa', sortable: true },
  { title: 'Cliente', key: 'cliente', sortable: true },
  { title: 'Valor Baixado', key: 'valor_total', sortable: true },
  { title: 'Dt Vencto', key: 'dt_vencto', sortable: true },
  { title: 'Data Baixa', key: 'data_baixa', sortable: true },
  { title: 'Tipo Doc', key: 'tipo_doc', sortable: true }
]

// Headers da tabela de detalhes
const headersDetalhes = [
  { title: 'Nf Documento', key: 'nf_documento', sortable: false },
  { title: 'Cliente', key: 'cliente', sortable: false },
  { title: 'Valor Baixado', key: 'valor_baixado', sortable: false },
  { title: 'Dt Vencto', key: 'dt_vencto', sortable: false },
  { title: 'Data Baixa', key: 'data_baixa', sortable: false },
  { title: 'Tipo Doc', key: 'tipo_doc', sortable: false },
  { title: 'Ações', key: 'actions', sortable: false }
]

// Agrupar baixas por código de baixa
const baixasAgrupadas = computed(() => {
  const grupos = {}
  
  baixas.value.forEach(baixa => {
    const codigo = baixa.codigo_baixa
    
    if (!grupos[codigo]) {
      grupos[codigo] = {
        codigo_baixa: codigo,
        cliente: baixa.cliente,
        data_baixa: baixa.data_baixa,
        dt_vencto: baixa.dt_vencto,
        tipo_doc: baixa.tipo_doc,
        valor_total: 0,
        detalhes: []
      }
    }
    
    grupos[codigo].valor_total += parseFloat(baixa.valor_baixado || 0)
    grupos[codigo].detalhes.push(baixa)
  })
  
  return Object.values(grupos)
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
    const response = await financeiroStore.buscarBaixasReceber({
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

// Confirmar estorno
const confirmarEstorno = (item) => {
  itemParaEstornar.value = item
  dialogEstorno.value = true
}

// Executar estorno
const executarEstorno = async () => {
  if (!itemParaEstornar.value) return

  loadingEstorno.value = true
  try {
    // Ajuste a chamada conforme sua API
    await financeiroStore.estornarBaixaReceber(itemParaEstornar.value.id)
    
    toast.success('Baixa estornada com sucesso!')
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

// Buscar baixas ao montar o componente
onMounted(async () => {
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
