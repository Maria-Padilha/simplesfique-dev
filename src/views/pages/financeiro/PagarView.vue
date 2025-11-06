<template>
  <div class="pa-4">
    <!-- Cabeçalho -->
    <v-card class="background-secondary mb-4">
      <v-card-title class="text-h5 pa-4 d-flex justify-space-between align-center">
        <div class="d-flex align-center">
          <v-icon icon="mdi-credit-card-outline" class="mr-3"></v-icon>
          Contas a Pagar
        </div>
      </v-card-title>
    </v-card>

    <!-- Lista de Contas a Pagar -->
    <v-card :color="themeStore.darkMode ? 'text-white' : ''" class="background-secondary">
      <v-card-text class="pa-4">
        <BotaoExpandTransition
          :formulario-aberto="formularioAberto"
          texto-abrir="Nova Conta a Pagar"
          texto-fechar="Cancelar"
          @toggle="toggleFormulario"
        />

        <!-- Formulário Expansível -->
        <v-expand-transition>
          <div v-if="formularioAberto">
            <v-card class="background-card mb-7" elevation="2">
              <v-card-title class="text-h6 pa-4">
                <v-icon :icon="editando ? 'mdi-pencil' : 'mdi-plus'" class="mr-2"></v-icon>
                {{ editando ? 'Editar Conta a Pagar' : 'Nova Conta a Pagar' }}
              </v-card-title>

              <v-card-text class="pa-4">
                <v-form ref="formRef" v-model="formValido">
                  <v-row>
                    <!-- Número do Documento (Obrigatório) -->
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="formData.nrdocumento"
                        label="Número do Documento *"
                        :rules="[rules.required]"
                        maxlength="20"
                        variant="outlined"
                        density="compact"
                        class="custom-text-field"
                        prepend-inner-icon="mdi-file-document"
                      ></v-text-field>
                    </v-col>

                    <!-- Série -->
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="formData.serie"
                        label="Série"
                        maxlength="10"
                        variant="outlined"
                        density="compact"
                        class="custom-text-field"
                        prepend-inner-icon="mdi-numeric"
                      ></v-text-field>
                    </v-col>

                    <!-- Espécie -->
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="formData.especie"
                        label="Espécie"
                        maxlength="10"
                        variant="outlined"
                        density="compact"
                        class="custom-text-field"
                        prepend-inner-icon="mdi-tag"
                      ></v-text-field>
                    </v-col>

                    <!-- Tipo de Documento -->
                    <v-col cols="12" md="4">
                      <div class="d-flex align-center">
                        <v-select
                          v-model="formData.id_tipodocumen"
                          :items="tiposDocumento"
                          item-title="descricaodocumento"
                          item-value="id"
                          label="Tipo Documento"
                          variant="outlined"
                          density="compact"
                          class="custom-text-field mr-2"
                          prepend-inner-icon="mdi-file-document-outline"
                        ></v-select>
                        <v-btn
                          icon="mdi-plus"
                          size="small"
                          color="primary"
                          variant="elevated"
                          @click="abrirModalTipoDocumento"
                        ></v-btn>
                      </div>
                    </v-col>

                    <!-- Fornecedor -->
                    <v-col cols="12" md="4">
                      <v-select
                        v-model="formData.id_fornecedor"
                        :items="pessoas"
                        item-title="nome"
                        item-value="id"
                        label="Fornecedor"
                        variant="outlined"
                        density="compact"
                        class="custom-text-field"
                        prepend-inner-icon="mdi-account-box"
                      ></v-select>
                    </v-col>

                    <!-- Valor Original (Obrigatório) -->
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="formData.vlroriginal"
                        label="Valor Original *"
                        :rules="[rules.required, rules.currency]"
                        type="number"
                        step="0.01"
                        variant="outlined"
                        density="compact"
                        class="custom-text-field"
                        prepend-inner-icon="mdi-currency-usd"
                        prefix="R$"
                      ></v-text-field>
                    </v-col>

                    <!-- Origem -->
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="formData.origem"
                        label="Origem"
                        maxlength="3"
                        variant="outlined"
                        density="compact"
                        class="custom-text-field"
                        prepend-inner-icon="mdi-source-branch"
                      ></v-text-field>
                    </v-col>

                    <!-- Quantidade de Parcelas -->
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model.number="formData.qtdparcelas"
                        label="Quantidade de Parcelas"
                        type="number"
                        min="1"
                        variant="outlined"
                        density="compact"
                        class="custom-text-field"
                        prepend-inner-icon="mdi-format-list-numbered"
                      ></v-text-field>
                    </v-col>

                    <!-- Data de Emissão (Obrigatório) -->
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="formData.dtemissao"
                        label="Data de Emissão *"
                        :rules="[rules.required]"
                        type="date"
                        variant="outlined"
                        density="compact"
                        class="custom-text-field"
                        prepend-inner-icon="mdi-calendar"
                      ></v-text-field>
                    </v-col>

                    <!-- Juros -->
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="formData.juros"
                        label="Juros"
                        type="number"
                        step="0.01"
                        variant="outlined"
                        density="compact"
                        class="custom-text-field"
                        prefix="R$"
                        prepend-inner-icon="mdi-percent"
                      ></v-text-field>
                    </v-col>

                    <!-- Multa -->
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="formData.multa"
                        label="Multa"
                        type="number"
                        step="0.01"
                        variant="outlined"
                        density="compact"
                        class="custom-text-field"
                        prefix="R$"
                        prepend-inner-icon="mdi-alert-circle"
                      ></v-text-field>
                    </v-col>

                    <!-- Desconto -->
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="formData.desconto"
                        label="Desconto"
                        type="number"
                        step="0.01"
                        variant="outlined"
                        density="compact"
                        class="custom-text-field"
                        prefix="R$"
                        prepend-inner-icon="mdi-sale"
                      ></v-text-field>
                    </v-col>

                    <!-- Campos de Cálculo e Botão - Apenas para múltiplas parcelas -->
                    <v-col cols="12" v-if="formData.qtdparcelas > 1">
                      <v-card variant="outlined" class="mb-4" elevation="1">
                        <v-card-title class="text-h6 pa-4 d-flex align-center">
                          <v-icon icon="mdi-calculator-variant" class="mr-2" color="primary"></v-icon>
                          Configurações das Parcelas
                        </v-card-title>

                        <v-card-text class="pa-4">
                          <v-row>
                            <!-- Valor da Primeira Parcela -->
                            <v-col cols="12" md="4">
                              <v-text-field
                                v-model="formData.valor_primeira_parcela"
                                label="Valor 1ª Parcela"
                                type="number"
                                step="0.01"
                                variant="outlined"
                                density="compact"
                                prefix="R$"
                                prepend-inner-icon="mdi-cash"
                              ></v-text-field>
                            </v-col>

                            <!-- Vencimento Primeira Parcela -->
                            <v-col cols="12" md="4">
                              <v-text-field
                                v-model="formData.venc_primeira_parcela"
                                label="Venc. 1ª Parcela"
                                type="date"
                                variant="outlined"
                                density="compact"
                                prepend-inner-icon="mdi-calendar-clock"
                              ></v-text-field>
                            </v-col>

                            <!-- Intervalo entre Parcelas -->
                            <v-col cols="12" md="4">
                              <v-text-field
                                v-model.number="formData.intervalo_parcelas"
                                label="Intervalo (dias)"
                                type="number"
                                min="1"
                                variant="outlined"
                                density="compact"
                                prepend-inner-icon="mdi-calendar-range"
                                suffix="dias"
                              ></v-text-field>
                            </v-col>

                            <!-- Botão Calcular -->
                            <v-col cols="12" class="d-flex justify-center">
                              <v-btn
                                color="primary"
                                variant="elevated"
                                @click="calcularParcelas"
                                :disabled="!formData.vlroriginal || !formData.qtdparcelas"
                                size="large"
                                min-width="200"
                              >
                                <v-icon class="mr-2">mdi-calculator</v-icon>
                                Calcular Parcelas
                              </v-btn>
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>
                    </v-col>
                    

                    <!-- Tabela de Parcelas -->
                    <v-col cols="12">
                      <v-expand-transition>
                        
                        <div v-if="parcelas.length > 0 || (formData.qtdparcelas === 1 && formData.vlroriginal)">
                          <v-divider class="mb-4"></v-divider>
                          <div class="d-flex align-center mb-4">
                            <v-icon icon="mdi-format-list-numbered" class="mr-3" color="primary"></v-icon>
                            <h4 class="text-h6 mb-0">Detalhamento das Parcelas</h4>
                            <v-spacer></v-spacer>
                            <v-chip
                              :color="(parcelas.length === 1 || formData.qtdparcelas === 1) ? 'success' : 'primary'"
                              variant="elevated"
                              size="small"
                            >
                              {{ formData.qtdparcelas === 1 ? '1 Parcela (Única)' : `${parcelas.length} ${parcelas.length === 1 ? 'Parcela' : 'Parcelas'}` }}
                            </v-chip>
                          </div>
                          
                          <!-- Mensagem informativa para parcela única -->
                          <v-alert
                            v-if="formData.qtdparcelas === 1"
                            type="info"
                            variant="tonal"
                            class="mb-4"
                            density="compact"
                          >
                            Para parcela única, não é necessário calcular. Os valores são gerados automaticamente.
                          </v-alert>

                          
                          <v-card 
                            variant="outlined" 
                            class="mb-4"
                            elevation="2"
                          >
                            <v-card-text class="pa-4">
                              <v-data-table
                                :headers="headersParcelas"
                                :items="parcelas"
                                :items-per-page="itemsPerPageParcelas"
                                :items-per-page-options="[5, 10, 25, 50]"
                                class="parcelas-table elevation-0"
                                density="compact"
                                :page="currentPageParcelas"
                                @update:page="currentPageParcelas = $event"
                                @update:items-per-page="itemsPerPageParcelas = $event"
                              >
                            <template v-slot:[`item.nrparcela`]="{ item }">
                              <div class="d-flex align-center">
                                <v-avatar 
                                  :color="item.nrparcela === 1 && valorEntrada > 0 ? 'primary' : 'secondary'"
                                  size="28"
                                  class="mr-2"
                                >
                                  <span class="text-caption font-weight-bold text-white">
                                    {{ item.nrparcela }}
                                  </span>
                                </v-avatar>
                                <v-scale-transition>
                                  <v-chip
                                    v-if="item.nrparcela === 1 && valorEntrada > 0"
                                    size="x-small"
                                    color="primary"
                                    variant="elevated"
                                  >
                                    <v-icon size="x-small" class="mr-1">mdi-cash</v-icon>
                                    Entrada
                                  </v-chip>
                                </v-scale-transition>
                              </div>
                            </template>

                            <template v-slot:[`item.dtvencimento`]="{ item }">
                              <v-text-field
                                v-model="item.dtvencimento"
                                type="date"
                                variant="outlined"
                                density="compact"
                                hide-details
                                prepend-inner-icon="mdi-calendar"
                                @input="calcularTotalParcelas"
                              ></v-text-field>
                            </template>

                            <template v-slot:[`item.vlrparcela`]="{ item }">
                              <v-text-field
                                v-model="item.vlrparcela"
                                type="number"
                                step="0.01"
                                variant="outlined"
                                density="compact"
                                hide-details
                                prefix="R$"
                                prepend-inner-icon="mdi-currency-usd"
                                @input="calcularTotalParcelas"
                              ></v-text-field>
                            </template>

                            <template v-slot:[`item.id_localcobranca`]="{ item }">
                              <div class="d-flex align-center">
                                <v-select
                                  v-model="item.id_localcobranca"
                                  :items="locaisCobranca"
                                  item-title="desclocalcobranca"
                                  item-value="id"
                                  variant="outlined"
                                  density="compact"
                                  hide-details
                                  placeholder="Selecione o local"
                                  prepend-inner-icon="mdi-map-marker"
                                  class="mr-2"
                                ></v-select>
                                <v-btn
                                  icon="mdi-plus"
                                  size="x-small"
                                  color="primary"
                                  variant="elevated"
                                  @click="abrirModalLocalCobranca"
                                ></v-btn>
                              </div>
                            </template>

                            <template v-slot:[`item.observacao`]="{ item }">
                              <v-text-field
                                v-model="item.observacao"
                                variant="outlined"
                                density="compact"
                                hide-details
                                placeholder="Observação da parcela"
                                prepend-inner-icon="mdi-note-text-outline"
                              ></v-text-field>
                            </template>
                          </v-data-table>

                          <!-- Resumo das Parcelas -->
                          <v-row class="mt-4" v-if="parcelas.length > 0">
                            <v-col cols="12">
                              <v-card 
                                variant="tonal" 
                                class="pa-3"
                                color="success"
                              >
                                <div class="d-flex align-center justify-space-between">
                                  <div class="d-flex align-center">
                                    <v-icon 
                                      icon="mdi-chart-pie" 
                                      class="mr-2" 
                                      size="small"
                                      color="success"
                                    ></v-icon>
                                    <h5 class="text-subtitle-1 mb-0 font-weight-medium">
                                      Resumo das Parcelas
                                    </h5>
                                  </div>
                                  <v-chip 
                                    color="success"
                                    variant="elevated"
                                  >
                                    Total: R$ {{ totalParcelas.toFixed(2) }}
                                  </v-chip>
                                </div>
                              </v-card>
                            </v-col>
                          </v-row>
                            </v-card-text>
                          </v-card>

                         
                        </div>
                      </v-expand-transition>
                    </v-col>

                    <!-- Observação -->
                    <v-col cols="12">
                      <v-textarea
                        v-model="formData.observacao"
                        label="Observação"
                        maxlength="500"
                        variant="outlined"
                        density="compact"
                        class="custom-text-field"
                        prepend-inner-icon="mdi-note-text"
                        rows="3"
                        auto-grow
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>

              <v-card-actions class="pa-4">
                <v-spacer></v-spacer>
                <v-btn
                  color="grey"
                  variant="text"
                  @click="cancelarFormulario"
                >
                  Cancelar
                </v-btn>
                <v-btn
                  color="var(--text-color-laranja)"
                  :loading="loading"
                  :disabled="!formValido"
                  @click="salvarContaPagar"
                  variant="flat"
                  class="text-white"
                >
                  {{ editando ? 'Atualizar' : 'Salvar' }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </div>
        </v-expand-transition>

        <!-- Tabela de Contas a Pagar -->
        <TabelaPadrao
          :formulario-aberto="formularioAberto"
          :headers="headers"
          :items="contasPagarFiltradas"
          :loading="loading"
          :search="search"
          @update:search="(value) => search = value"
          search-label="Pesquisar Conta a Pagar"
          item-key="id"
          no-data-icon="mdi-credit-card-outline"
          no-data-text="Nenhuma conta a pagar cadastrada"
          :show-custom-action="false"
          delete-dialog-message="Esta ação não pode ser desfeita."
          delete-item-display-field="nrdocumento"
          @edit-item="editarContaPagar"
          @confirm-delete="excluirContaPagar"
        ></TabelaPadrao>
      </v-card-text>
    </v-card>

    <!-- Modal Tipo Documento -->
    <v-dialog v-model="modalTipoDocumento" max-width="500px">
      <v-card>
        <v-card-title class="text-h6 pa-4">
          <v-icon icon="mdi-file-document-plus" class="mr-2"></v-icon>
          Novo Tipo de Documento
        </v-card-title>

        <v-card-text class="pa-4">
          <v-form ref="formTipoDocRef" v-model="formTipoDocValido">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="novoTipoDoc.descricaodocumento"
                  label="Descrição *"
                  :rules="[rules.required]"
                  maxlength="60"
                  variant="outlined"
                  density="compact"
                  prepend-inner-icon="mdi-text"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="novoTipoDoc.abreviatura"
                  label="Abreviatura *"
                  :rules="[rules.required]"
                  maxlength="3"
                  variant="outlined"
                  density="compact"
                  prepend-inner-icon="mdi-format-letter-case"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn
            color="grey"
            variant="text"
            @click="fecharModalTipoDocumento"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            :loading="loadingModal"
            :disabled="!formTipoDocValido"
            @click="salvarTipoDocumento"
            variant="elevated"
          >
            Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal Local Cobrança -->
    <v-dialog v-model="modalLocalCobranca" max-width="500px">
      <v-card>
        <v-card-title class="text-h6 pa-4">
          <v-icon icon="mdi-map-marker-plus" class="mr-2"></v-icon>
          Novo Local de Cobrança
        </v-card-title>

        <v-card-text class="pa-4">
          <v-form ref="formLocalCobrancaRef" v-model="formLocalCobrancaValido">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="novoLocalCobranca.desclocalcobranca"
                  label="Descrição *"
                  :rules="[rules.required]"
                  maxlength="60"
                  variant="outlined"
                  density="compact"
                  prepend-inner-icon="mdi-text"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn
            color="grey"
            variant="text"
            @click="fecharModalLocalCobranca"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            :loading="loadingModal"
            :disabled="!formLocalCobrancaValido"
            @click="salvarLocalCobranca"
            variant="elevated"
          >
            Salvar
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
import BotaoExpandTransition from '@/components/base/padrao-paginas/BotaoExpandTransition.vue'
import TabelaPadrao from '@/components/base/padrao-paginas/TabelaPadrao.vue'

const themeStore = useThemeStore()
const financeiroStore = useFinanceiroStore()

// Refs
const formularioAberto = ref(false)
const editando = ref(false)
const formValido = ref(false)
const formRef = ref(null)
const search = ref('')
const loading = ref(false)

// Estado dos dados
const contasPagar = ref([])
const parcelas = ref([])
const totalParcelas = ref(0)
const valorEntrada = ref(0)

// Paginação das parcelas
const currentPageParcelas = ref(1)
const itemsPerPageParcelas = ref(10)

// Snackbar
const snackbar = reactive({
  show: false,
  message: '',
  color: 'success'
})

// Headers da tabela
const headers = [
  { title: 'ID', key: 'id', sortable: true },
  { title: 'Documento', key: 'nrdocumento', sortable: true },
  { title: 'Série', key: 'serie', sortable: true },
  { title: 'Espécie', key: 'especie', sortable: true },
  { title: 'Tipo Doc.', key: 'id_tipodocumen', sortable: true },
  { title: 'Fornecedor', key: 'id_fornecedor', sortable: true },
  { title: 'Valor Original', key: 'vlroriginal', sortable: true },
  { title: 'Origem', key: 'origem', sortable: true },
  { title: 'Parcelas', key: 'qtdparcelas', sortable: true },
  { title: 'Data Emissão', key: 'dtemissao', sortable: true },
  { title: 'Ações', key: 'actions', sortable: false }
]

// Headers da tabela de parcelas
const headersParcelas = [
  { title: 'Parcela', key: 'nrparcela', sortable: false, width: '100px' },
  { title: 'Data Vencimento', key: 'dtvencimento', sortable: false, width: '180px' },
  { title: 'Valor', key: 'vlrparcela', sortable: false, width: '200px' },
  { title: 'Local Cobrança', key: 'id_localcobranca', sortable: false, width: '200px' },
  { title: 'Observação', key: 'observacao', sortable: false, width: '150px' }
]

// Dados do formulário
const formData = reactive({
  id: null,
  nrdocumento: '',
  serie: '',
  especie: '',
  id_tipodocumen: null,
  id_fornecedor: null,
  observacao: '',
  vlroriginal: null,
  origem: '',
  qtdparcelas: 1,
  dtemissao: '',
  // Campos simplificados
  juros: 0,
  multa: 0,
  desconto: 0,
  valor_primeira_parcela: 0,
  venc_primeira_parcela: '',
  intervalo_parcelas: 30
})

// ID da empresa (temporário - deve vir do contexto/autenticação)
const idEmpresa = ref(1) // TODO: Obter do contexto de autenticação

// Dados dos dropdowns
const tiposDocumento = ref([])
const locaisCobranca = ref([])
const pessoas = ref([])

// Controle dos modais
const modalTipoDocumento = ref(false)
const modalLocalCobranca = ref(false)
const loadingModal = ref(false)
const formTipoDocValido = ref(false)
const formLocalCobrancaValido = ref(false)
const formTipoDocRef = ref(null)
const formLocalCobrancaRef = ref(null)

// Dados dos formulários dos modais
const novoTipoDoc = reactive({
  descricaodocumento: '',
  abreviatura: ''
})

const novoLocalCobranca = reactive({
  desclocalcobranca: ''
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
  return Array.isArray(dados) ? dados : []
})

// Ciclo de vida
onMounted(async () => {
  await Promise.all([
    carregarContasPagar(),
    carregarDadosAuxiliares()
  ])
})

// Watchers - simplificados
// Resetar parcelas quando campos principais mudarem
watch([() => formData.qtdparcelas, () => formData.vlroriginal], () => {
  // Limpar parcelas existentes quando alterar campos principais
  parcelas.value = []
  totalParcelas.value = 0
  
  // Se for parcela única e tiver valor, gerar automaticamente
  if (formData.qtdparcelas === 1 && formData.vlroriginal) {
    // Usar timeout para garantir que a UI atualize
    setTimeout(() => {
      gerarParcelaUnica()
    }, 100)
  }
})

// Watcher específico para gerar parcela única quando campos relevantes mudarem
watch([() => formData.venc_primeira_parcela, () => formData.dtemissao, () => formData.valor_primeira_parcela], () => {
  // Se for parcela única e já tiver valor, atualizar automaticamente
  if (formData.qtdparcelas === 1 && formData.vlroriginal && parcelas.value.length > 0) {
    gerarParcelaUnica()
  }
})

// Métodos
const carregarContasPagar = async () => {
  try {
    loading.value = true
    const dados = await financeiroStore.buscarContasPagar(idEmpresa.value)
    contasPagar.value = dados
    console.log('Contas a pagar carregadas:', dados)
  } catch (error) {
    console.error('Erro ao carregar contas a pagar:', error)
    mostrarMensagem('Erro ao carregar contas a pagar', 'error')
    contasPagar.value = []
  } finally {
    loading.value = false
  }
}

// Carregar dados auxiliares dos dropdowns
const carregarDadosAuxiliares = async () => {
  try {
    // Carregar tipos de documento
    const tiposDoc = await financeiroStore.buscarTiposDocumento()
    tiposDocumento.value = tiposDoc

    // Carregar locais de cobrança  
    const locaisCobrancaData = await financeiroStore.buscarLocaisCobranca()
    locaisCobranca.value = locaisCobrancaData

    // Carregar pessoas/fornecedores
    const pessoasData = await financeiroStore.buscarPessoas()
    pessoas.value = pessoasData

    console.log('Dados auxiliares carregados:', {
      tiposDocumento: tiposDocumento.value,
      locaisCobranca: locaisCobranca.value,
      pessoas: pessoas.value
    })
  } catch (error) {
    console.error('Erro ao carregar dados auxiliares:', error)
    mostrarMensagem('Erro ao carregar dados auxiliares', 'error')
  }
}

const toggleFormulario = () => {
  if (formularioAberto.value) {
    cancelarFormulario()
  } else {
    abrirFormulario()
  }
}

const abrirFormulario = () => {
  editando.value = false
  resetarForm()
  formularioAberto.value = true
  
  // Se for parcela única, gerar automaticamente após um pequeno delay
  setTimeout(() => {
    if (formData.qtdparcelas === 1) {
      gerarParcelaUnica()
    }
  }, 200)
}

const editarContaPagar = (item) => {
  editando.value = true
  Object.assign(formData, {
    id: item.id,
    nrdocumento: item.nrdocumento || '',
    serie: item.serie || '',
    especie: item.especie || '',
    id_tipodocumen: item.id_tipodocumen || null,
    id_fornecedor: item.id_fornecedor || null,
    observacao: item.observacao || '',
    vlroriginal: item.vlroriginal || null,
    origem: item.origem || '',
    qtdparcelas: item.qtdparcelas || 1,
    dtemissao: item.dtemissao || ''
  })
  formularioAberto.value = true
}

const cancelarFormulario = () => {
  formularioAberto.value = false
  resetarForm()
}

const resetarForm = () => {
  Object.assign(formData, {
    id: null,
    nrdocumento: '',
    serie: '',
    especie: '',
    id_tipodocumen: null,
    id_fornecedor: null,
    observacao: '',
    vlroriginal: null,
    origem: '',
    qtdparcelas: 1,
    dtemissao: '',
    juros: 0,
    multa: 0,
    desconto: 0,
    valor_primeira_parcela: 0,
    venc_primeira_parcela: '',
    intervalo_parcelas: 30
  })

  // Limpar parcelas
  parcelas.value = []
  totalParcelas.value = 0
  valorEntrada.value = 0

  if (formRef.value) {
    formRef.value.resetValidation()
  }
  
  // Gerar parcela única automaticamente após reset se tiver valor
  setTimeout(() => {
    if (formData.qtdparcelas === 1 && formData.vlroriginal) {
      gerarParcelaUnica()
    }
  }, 100)
}

const salvarContaPagar = async () => {
  try {
    loading.value = true
    
    // Validar se há parcelas calculadas
    if (parcelas.value.length === 0) {
      mostrarMensagem('É necessário calcular as parcelas antes de salvar', 'warning')
      return
    }
    
    // Dados principais da conta a pagar
    const dadosPrincipais = {
      nrdocumento: formData.nrdocumento,
      serie: formData.serie,
      especie: formData.especie,
      id_tipodocumento: formData.id_tipodocumen,
      id_fornecedor: formData.id_fornecedor,
      observacao: formData.observacao,
      vlroriginal: parseFloat(formData.vlroriginal),
      origem: formData.origem,
      qtdparcelas: parseInt(formData.qtdparcelas),
      dtemissao: formData.dtemissao
    }
    
    // Preparar parcelas no formato esperado pelo THorse
    const parcelasFormatadas = parcelas.value.map((parcela, index) => ({
      id: String(parcela.nrparcela || (index + 1)),
      id_localcobranca: String(parcela.id_localcobranca || 1),
      vlroriginalparcela: String(parseFloat(parcela.vlrparcela) || 0),
      dtvencimento: parcela.dtvencimento || '',
      perc_juros: String(parseFloat(formData.juros) || 0),
      perc_desconto: String(parseFloat(formData.desconto) || 0),
      perc_multa: String(parseFloat(formData.multa) || 0)
    }))
    
    // Payload completo no formato THorse
    const payloadCompleto = {
      data: [dadosPrincipais],
      parcela: parcelasFormatadas
    }
    
    console.log('Payload completo para envio:', payloadCompleto)

    if (editando.value) {
      await financeiroStore.atualizarContaPagar(idEmpresa.value, formData.id, payloadCompleto)
      mostrarMensagem('Conta a pagar atualizada com sucesso!', 'success')
    } else {
      await financeiroStore.criarContaPagar(idEmpresa.value, payloadCompleto)
      mostrarMensagem('Conta a pagar cadastrada com sucesso!', 'success')
    }
    
    await carregarContasPagar()
    cancelarFormulario()
  } catch (error) {
    console.error('Erro ao salvar conta a pagar:', error)
    mostrarMensagem('Erro ao salvar conta a pagar', 'error')
  } finally {
    loading.value = false
  }
}

const excluirContaPagar = async (item) => {
  try {
    loading.value = true
    await financeiroStore.deletarContaPagar(idEmpresa.value, item.id)
    await carregarContasPagar()
    mostrarMensagem('Conta a pagar excluída com sucesso!', 'success')
  } catch (error) {
    console.error('Erro ao excluir conta a pagar:', error)
    mostrarMensagem('Erro ao excluir conta a pagar', 'error')
  } finally {
    loading.value = false
  }
}

const mostrarMensagem = (mensagem, tipo) => {
  snackbar.message = mensagem
  snackbar.color = tipo
  snackbar.show = true
}

// Métodos para Modal Tipo Documento
const abrirModalTipoDocumento = () => {
  modalTipoDocumento.value = true
  resetarFormTipoDocumento()
}

const fecharModalTipoDocumento = () => {
  modalTipoDocumento.value = false
  resetarFormTipoDocumento()
}

const resetarFormTipoDocumento = () => {
  novoTipoDoc.descricaodocumento = ''
  novoTipoDoc.abreviatura = ''
  if (formTipoDocRef.value) {
    formTipoDocRef.value.resetValidation()
  }
}

const salvarTipoDocumento = async () => {
  try {
    loadingModal.value = true
    
    const payload = {
      descricao: novoTipoDoc.descricaodocumento,
      abreviatura: novoTipoDoc.abreviatura
    }
    
    console.log('Salvando tipo documento:', payload)
    await financeiroStore.criarTipoDocumento(payload)
    
    // Recarregar lista
    await carregarDadosAuxiliares()
    
    mostrarMensagem('Tipo de documento criado com sucesso!', 'success')
    fecharModalTipoDocumento()
  } catch (error) {
    console.error('Erro ao salvar tipo documento:', error)
    mostrarMensagem('Erro ao salvar tipo de documento', 'error')
  } finally {
    loadingModal.value = false
  }
}

// Métodos para Modal Local Cobrança
const abrirModalLocalCobranca = () => {
  modalLocalCobranca.value = true
  resetarFormLocalCobranca()
}

const fecharModalLocalCobranca = () => {
  modalLocalCobranca.value = false
  resetarFormLocalCobranca()
}

const resetarFormLocalCobranca = () => {
  novoLocalCobranca.desclocalcobranca = ''
  if (formLocalCobrancaRef.value) {
    formLocalCobrancaRef.value.resetValidation()
  }
}

const salvarLocalCobranca = async () => {
  try {
    loadingModal.value = true
    
    const payload = {
      desclocalcobranca: novoLocalCobranca.desclocalcobranca
    }
    
    console.log('Salvando local cobrança:', payload)
    await financeiroStore.criarLocalCobranca(payload)
    
    // Recarregar lista
    await carregarDadosAuxiliares()
    
    mostrarMensagem('Local de cobrança criado com sucesso!', 'success')
    fecharModalLocalCobranca()
  } catch (error) {
    console.error('Erro ao salvar local cobrança:', error)
    mostrarMensagem('Erro ao salvar local de cobrança', 'error')
  } finally {
    loadingModal.value = false
  }
}

// Métodos para gerenciar parcelas



const calcularTotalParcelas = () => {
  totalParcelas.value = parcelas.value.reduce((total, parcela) => {
    return total + (parseFloat(parcela.vlrparcela) || 0)
  }, 0)
}



// Função para calcular parcelas usando o backend
const calcularParcelas = async () => {
  try {
    loading.value = true
    
    const qtdParcelas = parseInt(formData.qtdparcelas) || 1
    
    // Se for apenas 1 parcela, fazer cálculo local sem chamar API
    if (qtdParcelas === 1) {
      console.log('Calculando parcela única localmente')
      gerarParcelaUnica()
      mostrarMensagem('Parcela calculada com sucesso!', 'success')
      loading.value = false
      return
    }
    
    // Preparar dados conforme payload esperado pelo backend (apenas para múltiplas parcelas)
    const dadosCalculo = {
      vlrdocumento: parseFloat(formData.vlroriginal),
      vlrprimeiraparcela: parseFloat(formData.valor_primeira_parcela) || 0,
      qtdparcelas: qtdParcelas,
      primeirovencimento: formData.venc_primeira_parcela || formData.dtemissao,
      intervalo: parseInt(formData.intervalo_parcelas) || 30
    }
    
    console.log('Enviando dados para cálculo de múltiplas parcelas:', dadosCalculo)
    
    // Chamar API do backend apenas para múltiplas parcelas
    const parcelasCalculadas = await financeiroStore.calcularParcelasContaPagar(dadosCalculo)
    
    // Processar resultado e atualizar a tabela de parcelas
    if (parcelasCalculadas && Array.isArray(parcelasCalculadas)) {
      parcelas.value = parcelasCalculadas.map((parcela, index) => {
        // Converter valor brasileiro (com vírgula) para formato JavaScript (com ponto)
        let valorParcela = parcela.vlrparcela || parcela.valor || '0'
        if (typeof valorParcela === 'string') {
          valorParcela = valorParcela.replace(',', '.')
        }
        
        return {
          nrparcela: parcela.id_parcela || (index + 1),
          dtvencimento: parcela.dtvencimento || parcela.data_vencimento || '',
          vlrparcela: parseFloat(valorParcela || 0).toFixed(2),
          id_localcobranca: null,
          observacao: parcela.observacao || `Parcela ${parcela.id_parcela || (index + 1)} de ${dadosCalculo.qtdparcelas}`
        }
      })
      
      calcularTotalParcelas()
      mostrarMensagem('Parcelas calculadas com sucesso!', 'success')
    } else {
      // Fallback para geração local se backend não retornar dados válidos
      console.warn('Backend não retornou parcelas válidas, usando cálculo local')
      gerarParcelasTemporario()
      mostrarMensagem('Parcelas calculadas localmente!', 'warning')
    }
    
  } catch (error) {
    console.error('Erro ao calcular parcelas:', error)
    mostrarMensagem('Erro ao calcular parcelas. Usando cálculo local.', 'warning')
    
    // Fallback para geração local em caso de erro
    gerarParcelasTemporario()
  } finally {
    loading.value = false
  }
}

// Função otimizada para gerar uma única parcela (sem API)
const gerarParcelaUnica = () => {
  const valorOriginal = parseFloat(formData.vlroriginal) || 0
  const valorPrimeiraParcela = parseFloat(formData.valor_primeira_parcela) || 0
  const dataVencimento = formData.venc_primeira_parcela || formData.dtemissao
  
  if (valorOriginal > 0) {
    // Para parcela única, usar valor da primeira parcela se informado, senão usar o valor original
    const valorFinal = valorPrimeiraParcela > 0 ? valorPrimeiraParcela : valorOriginal
    
    parcelas.value = [{
      nrparcela: 1,
      dtvencimento: dataVencimento || '',
      vlrparcela: valorFinal.toFixed(2),
      id_localcobranca: null,
      observacao: 'Parcela única'
    }]
    
    calcularTotalParcelas()
  } else {
    // Mesmo sem valor, mostrar estrutura da parcela para deixar claro que é única
    parcelas.value = [{
      nrparcela: 1,
      dtvencimento: dataVencimento || '',
      vlrparcela: '0.00',
      id_localcobranca: null,
      observacao: 'Parcela única'
    }]
    totalParcelas.value = 0
  }
}

// Função temporária para gerar parcelas (remover quando backend estiver pronto)
const gerarParcelasTemporario = () => {
  const qtd = parseInt(formData.qtdparcelas) || 0
  const valorOriginal = parseFloat(formData.vlroriginal) || 0
  const valorPrimeiraParcela = parseFloat(formData.valor_primeira_parcela) || 0
  const dataVencPrimeira = formData.venc_primeira_parcela || formData.dtemissao
  
  if (qtd > 0 && valorOriginal > 0) {
    parcelas.value = []
    
    for (let i = 1; i <= qtd; i++) {
      let valorParcela = valorOriginal / qtd
      let dataVencimento = dataVencPrimeira
      
      // Se é a primeira parcela e tem valor específico
      if (i === 1 && valorPrimeiraParcela > 0) {
        valorParcela = valorPrimeiraParcela
      } else if (valorPrimeiraParcela > 0 && qtd > 1) {
        // Distribuir o restante nas outras parcelas
        valorParcela = (valorOriginal - valorPrimeiraParcela) / (qtd - 1)
      }
      
      // Calcular data de vencimento
      if (dataVencPrimeira && i > 1) {
        const data = new Date(dataVencPrimeira)
        data.setMonth(data.getMonth() + (i - 1))
        dataVencimento = data.toISOString().split('T')[0]
      }
      
      parcelas.value.push({
        nrparcela: i,
        dtvencimento: dataVencimento || '',
        vlrparcela: valorParcela.toFixed(2),
        id_localcobranca: null,
        observacao: `Parcela ${i} de ${qtd}`
      })
    }
    
    calcularTotalParcelas()
  }
}


</script>

<style scoped>
.background-secondary {
  background-color: var(--bg-color-secondary);
  color: var(--text-color);
}

.custom-text-field :deep(.v-field) {
  background-color: rgba(var(--v-theme-surface), 0.7);
}
</style>