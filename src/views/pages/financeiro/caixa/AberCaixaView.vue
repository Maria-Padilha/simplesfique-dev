<template>
  <top-all-pages icon="mdi-cash-register">
    <template #titulo>Abertura de Caixa</template>
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
      <!-- Card de Resumo do Caixa Aberto -->
      <v-card v-if="caixaAberto" class="background-secondary mb-4" elevation="0">
        <v-card-text class="pa-4">
          <div class="d-flex align-center justify-space-between">
            <div class="d-flex align-center">
              <v-icon icon="mdi-cash-check" size="32" color="success" class="mr-3"></v-icon>
              <div>
                <div class="text-caption text-grey">Caixa Aberto</div>
                <div class="text-h6 font-weight-bold">
                  {{ caixaAberto.descricao }}
                </div>
                <div class="text-caption">
                  Aberto em: {{ formatarDataHora(caixaAberto.dtabertura) }}
                </div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-caption text-grey">Saldo Inicial</div>
              <div class="text-h5 font-weight-bold" style="color: var(--text-color-laranja)">
                {{ formatarMoeda(caixaAberto.vlrabertura) }}
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <!-- Conteúdo Principal -->
      <v-card :color="themeStore.darkMode ? 'text-white' : ''" class="background-secondary" elevation="0">
        <v-card-text class="pa-4">
          <BotaoExpandTransition
              :formulario-aberto="formularioAberto"
              texto-abrir="Abrir Novo Caixa"
              texto-fechar="Cancelar"
              @toggle="toggleFormulario"
          />

          <!-- Formulário de Abertura -->
          <v-expand-transition>
            <div v-if="formularioAberto">
              <v-card class="background-card mb-7" elevation="0">
                <v-card-title class="text-h6 pa-4">
                  <v-icon icon="mdi-cash-plus" class="mr-2"></v-icon>
                  Abertura de Caixa
                </v-card-title>

                <v-card-text class="pa-4">
                  <v-form ref="formRef" v-model="formValido">
                    <v-row>
                      <!-- Caixa -->
                      <v-col cols="12" md="3">
                        <v-autocomplete
                            v-model="formData.id_caixa"
                            :items="caixasDisponiveis"
                            :loading="loadingCaixas"
                            item-title="desccaixa"
                            item-value="id"
                            label="Caixa *"
                            :rules="[rules.required]"
                            variant="outlined"
                            density="compact"
                            prepend-inner-icon="mdi-cash-register"
                            class="required-left-border"
                            no-data-text="Nenhum caixa disponível"
                        >
                          <template v-slot:item="{ props, item }">
                            <v-list-item v-bind="props">
                              <template v-slot:prepend>
                                <v-icon
                                    :icon="item.raw.status === 'A' ? 'mdi-check-circle' : 'mdi-lock'"
                                    :color="item.raw.status === 'A' ? 'success' : 'grey'"
                                ></v-icon>
                              </template>
                              <v-list-item-title>{{ item.raw.desccaixa }}</v-list-item-title>
                              <v-list-item-subtitle>
                                {{ item.raw.status === 'A' ? 'Ativo' : 'Inativo' }} |
                                Participa Fluxo: {{ item.raw.participa_fluxo === 'S' ? 'Sim' : 'Não' }}
                              </v-list-item-subtitle>
                            </v-list-item>
                          </template>
                        </v-autocomplete>
                      </v-col>

                      <!-- Data de Abertura -->
                      <v-col cols="12" md="3">
                        <v-text-field
                            v-model="formData.dtabertura"
                            label="Data de Abertura *"
                            type="date"
                            :rules="[rules.required]"
                            class="required-left-border"
                            variant="outlined"
                            density="compact"
                            prepend-inner-icon="mdi-calendar"
                            :theme="themeStore.darkMode ? 'dark' : 'light'"
                        ></v-text-field>
                      </v-col>

                      <!-- Hora de Abertura -->
                      <v-col cols="12" md="3">
                        <v-text-field
                            v-model="formData.hrabertura"
                            label="Hora de Abertura *"
                            type="time"
                            :rules="[rules.required]"
                            variant="outlined"
                            density="compact"
                            class="required-left-border"
                            prepend-inner-icon="mdi-clock-outline"
                            :theme="themeStore.darkMode ? 'dark' : 'light'"
                        ></v-text-field>
                      </v-col>

                      <!-- Suprimento -->
                      <v-col cols="12" md="3">
                        <v-text-field
                            v-model="formData.vlrabertura"
                            label="Valor Inicial *"
                            :rules="[rules.required, rules.valorPositivo]"
                            variant="outlined"
                            density="compact"
                            prepend-inner-icon="mdi-currency-usd"
                            prefix="R$"
                            class="required-left-border"
                            type="number"
                            step="0.01"
                            :theme="themeStore.darkMode ? 'dark' : 'light'"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-card-text>

                <v-card-actions class="pa-4">
                  <v-spacer></v-spacer>
                  <v-btn color="grey" variant="text" @click="cancelarFormulario">
                    Cancelar
                  </v-btn>
                  <v-btn
                      color="var(--text-color-laranja)"
                      :loading="loading"
                      :disabled="!formValido"
                      @click="abrirCaixa"
                      variant="flat"
                      class="text-white"
                  >
                    <v-icon start>mdi-cash-check</v-icon>
                    Abrir Caixa
                  </v-btn>
                </v-card-actions>
              </v-card>
            </div>
          </v-expand-transition>

          <!-- Tabela de Aberturas -->
          <TabelaPadrao
              :formulario-aberto="formularioAberto"
              :headers="headers"
              :items="aberturasFiltradasComputadas"
              :loading="loading"
              :search="search"
              @update:search="(value) => search = value"
              search-label="Pesquisar abertura de caixa"
              item-key="id"
              no-data-icon="mdi-cash-register"
              no-data-text="Nenhuma abertura de caixa registrada"
              delete-item-display-field="descricao_caixa"
              @confirm-delete="encerrarCaixa"
              :show-edit="false"
              :show-delete="true"
              delete-icon="mdi-cash-lock"
              delete-tooltip="Encerrar Caixa"
              delete-dialog-title="Encerrar Caixa"
              delete-dialog-text="Deseja realmente encerrar este caixa?"
          >
            <!-- Coluna de Data -->
            <template v-slot:[`item.dtabertura`]="{ item }">
              <div class="text-body-2">{{ formatarData(item.dtabertura) }}</div>
            </template>

            <!-- Coluna Aberto em -->
            <template v-slot:[`item.aberto_em`]="{ item }">
              <div>
                <div class="text-body-2">{{ formatarHora(item.hrabertura) }}</div>
                <div class="text-caption text-grey">{{ item.usuario }}</div>
              </div>
            </template>

            <!-- Coluna Fechado em -->
            <template v-slot:[`item.fechado_em`]="{ item }">
              <div v-if="item.hrfechamento">
                <div class="text-body-2">{{ formatarHora(item.hrfechamento) }}</div>
                <div class="text-caption text-grey">{{ item.usuario }}</div>
              </div>
              <div v-else class="text-grey text-center">-</div>
            </template>

            <!-- Coluna Conferido -->
            <template v-slot:[`item.vlrfechamento`]="{ item }">
              <div class="text-body-2 text-right">
              <span v-if="item.vlrfechamento !== null && item.vlrfechamento !== undefined">
                {{ formatarMoeda(item.vlrfechamento) }}
              </span>
                <span v-else class="text-grey">-</span>
              </div>
            </template>

            <!-- Coluna Sistema -->
            <template v-slot:[`item.vlrabertura`]="{ item }">
              <div class="text-body-2 font-weight-medium text-right">
                {{ formatarMoeda(item.vlrabertura) }}
              </div>
            </template>

            <!-- Coluna Diferença -->
            <template v-slot:[`item.diferenca`]="{ item }">
              <div class="text-body-2 text-right" :class="{
              'text-success': item.diferenca === 0,
              'text-error': item.diferenca !== 0
            }">
                {{ formatarMoeda(item.diferenca) }}
              </div>
            </template>

            <!-- Coluna de Situação -->
            <template v-slot:[`item.status`]="{ item }">
              <v-chip
                  :color="item.status === 'A' ? 'success' : 'error'"
                  variant="flat"
                  size="small"
                  class="font-weight-medium"
              >
                {{ item.status === 'A' ? 'Aberto' : 'Fechado' }}
              </v-chip>
            </template>
          </TabelaPadrao>
        </v-card-text>
      </v-card>

      <!-- Modal de Exportação -->
      <ExportacaoModal
          v-model="modalExportacaoAberto"
          :dados="aberturasCaixa"
          :filtros="{}"
          nome-relatorio="Abertura de Caixa"
          @exportar-pdf="() => {}"
          @exportar-csv="() => {}"
          @exportar-excel="() => {}"
          @imprimir="() => {}"
      />

      <!-- Modal de Preview do PDF -->
      <PdfPreviewModal
          v-model="modalPreviewPDF"
          :html-content="previewHTMLContent"
          :nome-relatorio="dadosPDFAtual?.nomeRelatorio || 'Abertura_Caixa'"
      />
    </template>
  </top-all-pages>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useThemeStore } from '@/stores/config-temas/theme'
import { useCaixaStore } from '@/stores/APIs/caixa'
import { useEmpresaStore } from '@/stores/APIs/empresa'
import BotaoExpandTransition from '@/components/base/padrao-paginas/BotaoExpandTransition.vue'
import TabelaPadrao from '@/components/base/padrao-paginas/TabelaPadrao.vue'
import TopAllPages from "@/components/base/padrao-paginas/TopAllPages.vue";
import ExportacaoModal from '@/components/base/modais/ExportacaoModal.vue'
import PdfPreviewModal from '@/components/base/modais/PdfPreviewModal.vue'

const themeStore = useThemeStore()
const caixaStore = useCaixaStore()
const empresaStore = useEmpresaStore()

// Estado
const formularioAberto = ref(false)
const formValido = ref(false)
const formRef = ref(null)
const search = ref('')
const loading = ref(false)
const loadingCaixas = ref(false)

// Dados
const caixasDisponiveis = ref([])
const aberturas = ref([])
const caixaAberto = ref(null)

// Modais de exportação
const modalExportacaoAberto = ref(false)
const modalPreviewPDF = ref(false)
const previewHTMLContent = ref('')
const dadosPDFAtual = ref(null)

// Data para modais
const aberturasCaixa = ref([])

// Formulário
const formData = reactive({
  id_caixa: null,
  dtabertura: new Date().toISOString().split('T')[0],
  hrabertura: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
  vlrabertura: 0,
})

// Regras de validação
const rules = {
  required: (value) => {
    if (value === null || value === undefined || value === '') return 'Campo obrigatório'
    return true
  },
  valorPositivo: (value) => {
    if (value === null || value === undefined || value === '') return 'Campo obrigatório'
    if (parseFloat(value) < 0) return 'Valor deve ser positivo'
    return true
  }
}

// Headers da tabela
const headers = [
  { title: 'Data', key: 'dtabertura', sortable: true, width: '120px' },
  { title: 'Aberto em', key: 'aberto_em', sortable: false, width: '140px' },
  { title: 'Fechado em', key: 'fechado_em', sortable: false, width: '140px' },
  { title: 'Conferido', key: 'vlrfechamento', sortable: true, align: 'end', width: '130px' },
  { title: 'Sistema', key: 'vlrabertura', sortable: true, align: 'end', width: '130px' },
  { title: 'Diferença', key: 'diferenca', sortable: true, align: 'end', width: '130px' },
  { title: 'Situação', key: 'status', sortable: true, align: 'center', width: '120px' },
  { title: 'Ações', key: 'actions', sortable: false, align: 'center', width: '80px' }
]

// Computed
const aberturasFiltradasComputadas = computed(() => {
  const dados = aberturas.value || []
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
    const d = typeof data === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(data)
      ? new Date(data + 'T00:00:00')
      : new Date(data)
    return d.toLocaleDateString('pt-BR')
  } catch {
    return '--'
  }
}

const formatarHora = (hora) => {
  if (!hora) return '--'
  try {
    // Se vier no formato HH:MM:SS.mmm, extrair apenas HH:MM
    if (typeof hora === 'string' && hora.includes(':')) {
      const partes = hora.split(':')
      return `${partes[0]}:${partes[1]}`
    }
    return hora
  } catch {
    return '--'
  }
}

const formatarDataHora = (data) => {
  if (!data) return '--'
  try {
    return new Date(data).toLocaleString('pt-BR')
  } catch {
    return '--'
  }
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
}

const limparFormulario = () => {
  Object.assign(formData, {
    id_caixa: null,
    dtabertura: new Date().toISOString().split('T')[0],
    hrabertura: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    vlrabertura: 0,
  })
  if (formRef.value) {
    formRef.value.resetValidation()
  }
}

// Carregar dados
const carregarDadosAuxiliares = async () => {
  try {
    // Garantir que a empresa está carregada
    if (!empresaStore.empresa?.id && !empresaStore.empresaSelecionada?.id) {
      empresaStore.carregarEmpresaSelecionada()
    }
    
    const idEmpresa = empresaStore.empresa?.id || empresaStore.empresaSelecionada?.id
    
    if (!idEmpresa) {
      console.warn('ID da empresa não encontrado')
      return
    }

    // Carregar caixas do usuário (ativos e com histórico de abertura)
    const dadosCaixas = await caixaStore.buscarCaixasUsuarioAtivo(idEmpresa)
    const lista = Array.isArray(dadosCaixas) ? dadosCaixas : []

    // Dropdown: todos os caixas disponíveis
    caixasDisponiveis.value = lista

    // Tabela de aberturas: mapear campos da API para o formato da tabela
    aberturas.value = lista.map(c => ({
      id: c.id,
      id_caixa: c.id,
      descricao_caixa: c.desccaixa || '',
      status: c.situacao === 'A' ? 'A' : 'F',
      dtabertura: c.dt_abertura || null,
      hrabertura: c.h_abertura || null,
      dtfechamento: c.dt_encerramento || null,
      hrfechamento: c.h_encerramento || null,
      vlrabertura: 0,
      vlrfechamento: null,
      diferenca: 0,
      usuario: c.id_user_abertura || 'N/A',
      id_usuario: c.id_user_abertura || null
    }))

    // Verificar se há caixa aberto
    const caixasAbertas = aberturas.value.filter(a => a.status === 'A')
    caixaAberto.value = caixasAbertas.length > 0 ? caixasAbertas[0] : null
  } catch (error) {
    console.error('Erro ao carregar dados auxiliares:', error)
  }
}

// Abrir caixa
const abrirCaixa = async () => {
  if (!formValido.value) {
    return
  }

  loading.value = true
  try {
    const idEmpresa = empresaStore.empresa?.id || empresaStore.empresaSelecionada?.id
    if (!idEmpresa) {
      console.error('ID da empresa não encontrado!')
      return
    }

    if (!formData.id_caixa) {
      console.error('ID do caixa não selecionado!')
      return
    }

    // Montar payload (formato flat Laravel)
    const payload = {
      dtabertura: formData.dtabertura,
      horaabertura: formData.hrabertura,
      saldoinicial: parseFloat(formData.vlrabertura)
    }

    const resultado = await caixaStore.abrirCaixa(idEmpresa, formData.id_caixa, payload)
    
    if (resultado) {
      cancelarFormulario()
      await carregarDadosAuxiliares()
    }
  } catch (error) {
    console.error('Erro ao abrir caixa:', error)
  } finally {
    loading.value = false
  }
}

// Fechar caixa
const encerrarCaixa = async (item) => {
  loading.value = true
  try {
    const idEmpresa = empresaStore.empresa?.id || empresaStore.empresaSelecionada?.id
    if (!idEmpresa) {
      console.error('ID da empresa não encontrado!')
      return
    }

    if (!item.id || !item.id_caixa) {
      console.error('ID do registro ou do caixa não encontrado!')
      return
    }

    const resultado = await caixaStore.encerrarCaixa(item.id, idEmpresa, item.id_caixa)
    
    if (resultado) {
      await carregarDadosAuxiliares()
    }
  } catch (error) {
    console.error('Erro ao encerrar caixa:', error)
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(async () => {
  await carregarDadosAuxiliares()
})
</script>

<style scoped>
/* Estilos específicos se necessário */
</style>
