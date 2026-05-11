<template>
  <top-all-pages icon="mdi-currency-usd">
    <template #titulo>Adiantamento de Cliente</template>
    <template #section>
      <div>
        <!-- Conteúdo Principal -->
        <v-card :color="themeStore.darkMode ? 'text-white' : ''" class="background-secondary" elevation="0">
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
                <v-card class="background-card mb-7" elevation="0">
                  <v-card-title class="text-h6 pa-4">
                    <v-icon :icon="editando ? 'mdi-pencil' : 'mdi-plus'" class="mr-2"></v-icon>
                    {{ editando ? 'Editar Lançamento' : 'Novo Lançamento' }}
                  </v-card-title>

                  <v-card-text class="pa-4">
                    <v-form ref="formRef" v-model="formValido">
                      <v-row>
                        <!-- Cliente -->
                        <v-col cols="12" md="4">
                          <v-autocomplete
                              v-model="formData.id_pessoa"
                              :items="clientes"
                              :loading="loadingClientes"
                              item-title="nome_razao"
                              item-value="id"
                              label="Cliente *"
                              variant="outlined"
                              density="compact"
                              prepend-inner-icon="mdi-account"
                              no-data-text="Nenhum cliente disponível"
                          >
                            <template v-slot:item="{ props, item }">
                              <v-list-item v-bind="props">
                                <template v-slot:title>
                                  {{ item.raw.nome_razao }}
                                </template>
                                <template v-slot:subtitle>
                              <span class="text-caption opacity-70">
                                {{ item.raw.cpf_cnpj }}
                              </span>
                                </template>
                              </v-list-item>
                            </template>
                          </v-autocomplete>
                        </v-col>

                        <!-- Conta Contábil de Adiantamento -->
                        <v-col cols="12" md="4">
                          <v-autocomplete
                              v-model="formData.id_planoconta"
                              :items="planosConta"
                              :loading="loadingPlanosConta"
                              item-title="descconta"
                              item-value="id"
                              label="Conta Contábil de Adiantamento *"
                              :rules="[rules.required]"
                              variant="outlined"
                              density="compact"
                              prepend-inner-icon="mdi-file-document"
                              no-data-text="Nenhuma conta disponível"
                          >
                            <template v-slot:item="{ props, item }">
                              <v-list-item v-bind="props">
                                <template v-slot:title>
                                  {{ item.raw.id_classificador }} - {{ item.raw.descconta }}
                                </template>
                              </v-list-item>
                            </template>
                            <template v-slot:selection="{ item }">
                              {{ item.raw.id_classificador }} - {{ item.raw.descconta }}
                            </template>
                          </v-autocomplete>
                        </v-col>

                        <!-- Histórico Contábil -->
                        <v-col cols="12" md="4">
                          <v-autocomplete
                              v-model="formData.id_hist_contabil"
                              :items="historicosContabil"
                              :loading="loadingHistContabil"
                              item-title="deschistorico"
                              item-value="id"
                              label="Histórico Contábil"
                              variant="outlined"
                              density="compact"
                              prepend-inner-icon="mdi-book-open-variant"
                              no-data-text="Nenhum histórico disponível"
                              clearable
                          ></v-autocomplete>
                        </v-col>

                        <!-- Local de lançamento -->
                        <v-col cols="12" md="4">
                          <v-select
                              v-model="formData.local_lct"
                              :items="[
                          { title: 'Caixa', value: 'CAI' },
                          { title: 'Banco', value: 'BAN' },
                        ]"
                              label="Local de lançamento *"
                              :rules="[rules.required]"
                              variant="outlined"
                              density="compact"
                              prepend-inner-icon="mdi-map-marker"
                          ></v-select>
                        </v-col>

                        <!-- Caixa (se local_lct = CAI) -->
                        <v-col cols="12" md="4" v-if="formData.local_lct === 'CAI'">
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

                        <!-- Conta Corrente (se local_lct = BAN) -->
                        <v-col cols="12" md="4" v-if="formData.local_lct === 'BAN'">
                          <v-autocomplete
                              v-model="formData.id_ccorrente"
                              :items="contasCorrentes"
                              :loading="loadingContaCorrente"
                              item-title="titular"
                              item-value="id"
                              label="Conta Corrente *"
                              :rules="[rules.required]"
                              variant="outlined"
                              density="compact"
                              prepend-inner-icon="mdi-bank"
                              no-data-text="Nenhuma conta corrente disponível"
                          >
                            <template v-slot:item="{ props, item }">
                              <v-list-item v-bind="props">
                                <template v-slot:title>
                                  {{ item.raw.descbanco || '' }} - {{ item.raw.titular || '' }}
                                </template>
                                <template v-slot:subtitle>
                              <span class="text-caption opacity-70">
                                Agência: {{ item.raw.id_agencia || '--' }} | Conta: {{ item.raw.numero_ccorrente || '--' }}-{{ item.raw.digito_cc || '' }}
                              </span>
                                </template>
                              </v-list-item>
                            </template>
                            <template v-slot:selection="{ item }">
                              {{ item.raw.descbanco || '' }} - {{ item.raw.titular || '' }}
                            </template>
                          </v-autocomplete>
                        </v-col>

                        <!-- Histórico Bancário (se local_lct = BAN) -->
                        <v-col cols="12" md="4" v-if="formData.local_lct === 'BAN'">
                          <v-autocomplete
                              v-model="formData.id_historico"
                              :items="historicosBancarios"
                              :loading="loadingHistBancario"
                              item-title="deschistorico"
                              item-value="id"
                              label="Histórico Bancário *"
                              :rules="[rules.required]"
                              variant="outlined"
                              density="compact"
                              prepend-inner-icon="mdi-history"
                              no-data-text="Nenhum histórico bancário disponível"
                              clearable
                          ></v-autocomplete>
                        </v-col>

                        <!-- Histórico Contábil do Caixa (se local_lct = CAI) -->
                        <v-col cols="12" md="4" v-if="formData.local_lct === 'CAI'">
                          <v-autocomplete
                              v-model="formData.id_hist_contabil_caixa"
                              :items="historicosContabil"
                              :loading="loadingHistContabil"
                              item-title="deschistorico"
                              item-value="id"
                              label="Histórico Contábil do Caixa"
                              variant="outlined"
                              density="compact"
                              prepend-inner-icon="mdi-book-clock"
                              no-data-text="Nenhum histórico disponível"
                              clearable
                          ></v-autocomplete>
                        </v-col>

                        <!-- Tipo Pagamento/Recebimento (se local_lct = CAI) -->
                        <v-col cols="12" md="4" v-if="formData.local_lct === 'CAI'">
                          <v-autocomplete
                              v-model="formData.id_tipopagrec"
                              :items="tiposPagRec"
                              :loading="loadingTiposPagRec"
                              item-title="desctipopagrec"
                              item-value="id"
                              label="Tipo Pagamento / Recebimento *"
                              :rules="[rules.required]"
                              variant="outlined"
                              density="compact"
                              prepend-inner-icon="mdi-credit-card"
                              no-data-text="Nenhum tipo disponível"
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
                              :readonly="formData.local_lct === 'CAI' && formData.id_caixa"
                              :disabled="formData.local_lct === 'CAI' && formData.id_caixa"
                          >
                            <template v-slot:append-inner v-if="formData.local_lct === 'CAI' && formData.id_caixa">
                              <v-tooltip location="top">
                                <template v-slot:activator="{ props }">
                                  <v-icon v-bind="props" size="20" color="grey">mdi-information-outline</v-icon>
                                </template>
                                Data de abertura do caixa selecionado (não editável)
                              </v-tooltip>
                            </template>
                          </v-text-field>
                        </v-col>

                        <!-- Data de Cobrança (não para Banco) -->
                        <v-col cols="12" md="4" v-if="formData.local_lct !== 'BAN'">
                          <v-text-field
                              v-model="formData.dtcobranca"
                              label="Data de Cobrança"
                              type="date"
                              variant="outlined"
                              density="compact"
                              prepend-inner-icon="mdi-calendar"
                          ></v-text-field>
                        </v-col>

                        <!-- Tipo Documento (não para Banco) -->
                        <v-col cols="12" md="4" v-if="formData.local_lct !== 'BAN'">
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

                        <!-- Nr Documento -->
                        <v-col cols="12" md="4">
                          <v-text-field
                              v-model="formData.nrdocumento"
                              label="Nr Documento"
                              variant="outlined"
                              density="compact"
                              prepend-inner-icon="mdi-numeric"
                              maxlength="20"
                              counter="20"
                          ></v-text-field>
                        </v-col>

                        <!-- Valor do Lançamento -->
                        <v-col cols="12" md="4">
                          <v-text-field
                              v-model="formData.valor"
                              label="Valor do Lançamento *"
                              :rules="[rules.required, rules.valorPositivo]"
                              variant="outlined"
                              density="compact"
                              prepend-inner-icon="mdi-currency-usd"
                              prefix="R$"
                              type="number"
                              step="0.01"
                          ></v-text-field>
                        </v-col>

                        <!-- Observação -->
                        <v-col cols="12" md="12">
                          <v-textarea
                              v-model="formData.observacao"
                              label="Observação"
                              variant="outlined"
                              density="compact"
                              prepend-inner-icon="mdi-note-text"
                              rows="3"
                              maxlength="500"
                          ></v-textarea>
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

            <!-- Filtros de Busca -->
            <v-card class="mb-4 background-card" elevation="0">
              <v-card-title class="text-h6 pa-4">
                <v-icon icon="mdi-filter" class="mr-2"></v-icon>
                Filtros de Período e Cliente
              </v-card-title>
              <v-card-text class="pa-4">
                <v-row>
                  <!-- Cliente -->
                  <v-col cols="12" md="3">
                    <v-autocomplete
                        v-model="filtros.id_cliente"
                        :items="clientes"
                        :loading="loadingClientes"
                        item-title="nome_razao"
                        item-value="id"
                        label="Cliente *"
                        :rules="[rules.required]"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-account"
                        no-data-text="Nenhum cliente disponível"
                    >
                      <template v-slot:item="{ props, item }">
                        <v-list-item v-bind="props">
                          <template v-slot:title>
                            {{ item.raw.nome_razao }}
                          </template>
                          <template v-slot:subtitle>
                        <span class="text-caption opacity-70">
                          {{ item.raw.cpf_cnpj }}
                        </span>
                          </template>
                        </v-list-item>
                      </template>
                    </v-autocomplete>
                  </v-col>

                  <!-- Atalho de Período -->
                  <v-col cols="12" md="3">
                    <v-select
                        v-model="periodoSelecionado"
                        :items="periodos"
                        label="Período"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-calendar-clock"
                        @update:model-value="aplicarPeriodo"
                    ></v-select>
                  </v-col>

                  <!-- Data Inicial -->
                  <v-col cols="12" md="2">
                    <v-text-field
                        v-model="filtros.dtini"
                        label="Data Inicial *"
                        type="date"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-calendar"
                    ></v-text-field>
                  </v-col>

                  <!-- Data Final -->
                  <v-col cols="12" md="2">
                    <v-text-field
                        v-model="filtros.dtfim"
                        label="Data Final *"
                        type="date"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-calendar"
                    ></v-text-field>
                  </v-col>

                  <!-- Botão Buscar -->
                  <v-col cols="12" md="2" class="d-flex">
                    <v-btn
                        color="var(--text-color-laranja)"
                        :loading="loading"
                        :disabled=" !filtros.dtini || !filtros.dtfim"
                        @click="carregarLancamentos"
                        variant="flat"
                        class="text-white"
                        block
                    >
                      <v-icon start>mdi-magnify</v-icon>
                      Buscar
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- Tabela de Lançamentos -->
            <v-card class="background-card" elevation="0">
              <v-card-text class="pa-0">
                <!-- Saldo Anterior -->
                <v-card class="ma-4 mb-1 background-card" elevation="0">
                  <v-card-text class="d-flex justify-space-between align-center pa-3">
                    <span class="text-subtitle-1 font-weight-bold">Saldo Anterior</span>
                    <span class="text-h6 font-weight-bold" :class="saldoAnterior >= 0 ? 'text-success' : 'text-error'">
                  {{ formatarMoeda(saldoAnterior) }}
                </span>
                  </v-card-text>
                </v-card>

                <v-data-table
                    :headers="headers"
                    :items="lancamentosFiltrados"
                    :loading="loading"
                    item-key="id"
                    class="background-secondary border"
                    :items-per-page="15"
                    density="compact"
                >
                  <!-- Coluna Cliente -->
                  <template v-slot:[`item.nome_razao`]="{ item }">
                    {{ item.nome_razao || '--' }}
                  </template>

                  <!-- Coluna Data -->
                  <template v-slot:[`item.dtlancamento`]="{ item }">
                    {{ formatarData(item.dtlancamento) }}
                  </template>

                  <!-- Coluna Nr Documento -->
                  <template v-slot:[`item.nrdocumento`]="{ item }">
                    {{ item.nrdocumento || '--' }}
                  </template>

                  <!-- Coluna Valor -->
                  <template v-slot:[`item.valor`]="{ item }">
                <span class="font-weight-bold">
                  {{ formatarMoeda(item.valor) }}
                </span>
                  </template>

                  <!-- Coluna Observação -->
                  <template v-slot:[`item.observacao`]="{ item }">
                    {{ item.observacao || '--' }}
                  </template>

                  <!-- Coluna Ações -->
                  <template v-slot:[`item.actions`]="{ item }">
                    <div class="d-flex justify-center gap-1">
                      <v-btn
                          icon="mdi-pencil"
                          size="small"
                          variant="text"
                          color="primary"
                          @click="editarLancamento(item)"
                      >
                        <v-icon size="20">mdi-pencil</v-icon>
                        <v-tooltip activator="parent" location="top">Editar</v-tooltip>
                      </v-btn>
                      <v-btn
                          icon="mdi-delete"
                          size="small"
                          variant="text"
                          color="error"
                          @click="confirmarExclusao(item)"
                      >
                        <v-icon size="20">mdi-delete</v-icon>
                        <v-tooltip activator="parent" location="top">Excluir</v-tooltip>
                      </v-btn>
                    </div>
                  </template>

                  <!-- Loading -->
                  <template v-slot:loading>
                    <v-skeleton-loader type="table-row@5"></v-skeleton-loader>
                  </template>

                  <!-- Sem dados -->
                  <template v-slot:no-data>
                    <div class="text-center py-8">
                      <v-icon icon="mdi-currency-usd" size="64" color="grey" class="mb-4"></v-icon>
                      <p class="text-h6 text-grey">Nenhum lançamento encontrado</p>
                    </div>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
      </div>
    </template>
  </top-all-pages>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useThemeStore } from '@/stores/config-temas/theme'
import { usePessoasStore } from '@/stores/APIs/pessoas'
import { useFinanceiroStore } from '@/stores/APIs/financeiro'
import { useCaixaStore } from '@/stores/APIs/caixa'
import { useEmpresaStore } from '@/stores/APIs/empresa'
import { useAdiantamentoStore } from '@/stores/APIs/adiantamento'
import BotaoExpandTransition from '@/components/base/padrao-paginas/BotaoExpandTransition.vue'
import TopAllPages from "@/components/base/padrao-paginas/TopAllPages.vue";

const themeStore = useThemeStore()
const pessoasStore = usePessoasStore()
const financeiroStore = useFinanceiroStore()
const caixaStore = useCaixaStore()
const empresaStore = useEmpresaStore()
const adiantamentoStore = useAdiantamentoStore()

// Estado
const formularioAberto = ref(false)
const editando = ref(false)
const formValido = ref(false)
const formRef = ref(null)
const loading = ref(false)
const loadingClientes = ref(false)
const loadingPlanosConta = ref(false)
const loadingCaixas = ref(false)
const loadingTiposPagRec = ref(false)
const loadingHistContabil = ref(false)
const loadingTiposDoc = ref(false)
const loadingContaCorrente = ref(false)
const loadingHistBancario = ref(false)

// Dados
const clientes = ref([])
const planosConta = ref([])
const caixasDisponiveis = ref([])
const tiposPagRec = ref([])
const historicosContabil = ref([])
const tiposDocumento = ref([])
const contasCorrentes = ref([])
const historicosBancarios = ref([])
const lancamentos = ref([])
const saldoAnterior = ref(0)

// Filtros de busca
const periodoSelecionado = ref('mes')
const filtros = reactive({
  id_cliente: null,
  dtini: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0], // Primeiro dia do mês
  dtfim: new Date().toISOString().split('T')[0] // Data atual
})

// Opções de período
const periodos = [
  { title: 'Hoje', value: 'hoje' },
  { title: 'Essa Semana', value: 'semana' },
  { title: 'Esse Mês', value: 'mes' },
  { title: 'Esse Ano', value: 'ano' },
  { title: 'Últimos 7 dias', value: '7dias' },
  { title: 'Últimos 30 dias', value: '30dias' },
  { title: 'Personalizado', value: 'personalizado' }
]

// Formulário
const formData = reactive({
  id: null,
  id_pessoa: null,
  id_planoconta: null,
  id_hist_contabil: null,
  local_lct: 'CAI',
  id_caixa: null,
  id_ccorrente: null,
  id_historico: null,
  id_hist_contabil_caixa: null,
  id_tipopagrec: null,
  id_tipodocumento: null,
  dtlancamento: new Date().toISOString().split('T')[0],
  dtcobranca: '',
  nrdocumento: '',
  valor: 0,
  observacao: ''
})

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
  { title: 'Cliente', key: 'nome_razao', sortable: true, width: '250px' },
  { title: 'Data', key: 'dtlancamento', sortable: true, width: '100px' },
  { title: 'Nr Documento', key: 'nrdocumento', sortable: true, width: '120px' },
  { title: 'Valor', key: 'valor', sortable: true, align: 'end', width: '120px' },
  { title: 'Observação', key: 'observacao', sortable: false, width: '200px' },
  { title: 'Ações', key: 'actions', sortable: false, align: 'center', width: '100px' }
]

// Computed
const lancamentosFiltrados = computed(() => {
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
    const d = typeof data === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(data)
      ? new Date(data + 'T00:00:00')
      : new Date(data)
    return d.toLocaleDateString('pt-BR')
  } catch {
    return '--'
  }
}

// Aplicar período selecionado
const aplicarPeriodo = (periodo) => {
  const hoje = new Date()
  let dataInicio = new Date()
  let dataFim = new Date()

  switch (periodo) {
    case 'hoje':
      dataInicio = hoje
      dataFim = hoje
      break
    
    case 'semana': {
      // Primeiro dia da semana (domingo)
      const primeiroDiaSemana = hoje.getDate() - hoje.getDay()
      dataInicio = new Date(hoje.getFullYear(), hoje.getMonth(), primeiroDiaSemana)
      dataFim = hoje
      break
    }
    
    case 'mes':
      // Primeiro dia do mês
      dataInicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
      dataFim = hoje
      break
    
    case 'ano':
      // Primeiro dia do ano
      dataInicio = new Date(hoje.getFullYear(), 0, 1)
      dataFim = hoje
      break
    
    case '7dias':
      // Últimos 7 dias
      dataInicio = new Date(hoje.getTime() - 7 * 24 * 60 * 60 * 1000)
      dataFim = hoje
      break
    
    case '30dias':
      // Últimos 30 dias
      dataInicio = new Date(hoje.getTime() - 30 * 24 * 60 * 60 * 1000)
      dataFim = hoje
      break
    
    case 'personalizado':
      // Não altera as datas, usuário define manualmente
      return
  }

  filtros.dtini = dataInicio.toISOString().split('T')[0]
  filtros.dtfim = dataFim.toISOString().split('T')[0]
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
    id_pessoa: null,
    id_planoconta: null,
    id_hist_contabil: null,
    local_lct: 'CAI',
    id_caixa: null,
    id_ccorrente: null,
    id_historico: null,
    id_hist_contabil_caixa: null,
    id_tipopagrec: null,
    id_tipodocumento: null,
    dtlancamento: new Date().toISOString().split('T')[0],
    dtcobranca: '',
    nrdocumento: '',
    valor: 0,
    observacao: ''
  })
  if (formRef.value) {
    formRef.value.resetValidation()
  }
}

// Carregar dados
const carregarClientes = async () => {
  loadingClientes.value = true
  try {
    await pessoasStore.buscarTodasPessoas()
    // Filtrar apenas clientes
    clientes.value = (pessoasStore.pessoas || []).filter(p => p.cliente === 'S')
  } catch (error) {
    console.error('Erro ao carregar clientes:', error)
    clientes.value = []
  } finally {
    loadingClientes.value = false
  }
}

const carregarPlanosConta = async () => {
  loadingPlanosConta.value = true
  try {
    const response = await financeiroStore.buscarPlanosConta()
    const dados = response?.data || response || []
    planosConta.value = Array.isArray(dados) ? dados : []
  } catch (error) {
    console.error('Erro ao carregar planos de conta:', error)
    planosConta.value = []
  } finally {
    loadingPlanosConta.value = false
  }
}

const carregarCaixas = async () => {
  loadingCaixas.value = true
  try {
    const idEmpresa = empresaStore.empresa?.id || empresaStore.empresaSelecionada?.id
    if (!idEmpresa) return
    
    const dados = await caixaStore.buscarCaixasUsuarioAberto(idEmpresa)
    caixasDisponiveis.value = Array.isArray(dados) ? dados : []
  } catch (error) {
    console.error('Erro ao carregar caixas:', error)
    caixasDisponiveis.value = []
  } finally {
    loadingCaixas.value = false
  }
}

const carregarHistoricosContabil = async () => {
  loadingHistContabil.value = true
  try {
    const dados = await financeiroStore.buscarHistoricosContabil()
    
    // Normalizar resposta
    let historicos = []
    if (dados && dados.data && Array.isArray(dados.data)) {
      historicos = dados.data
    } else if (Array.isArray(dados)) {
      historicos = dados
    } else if (dados && typeof dados === 'object') {
      historicos = [dados]
    }
    
    historicosContabil.value = historicos
  } catch (error) {
    console.error('Erro ao carregar históricos contábeis:', error)
    historicosContabil.value = []
  } finally {
    loadingHistContabil.value = false
  }
}

const carregarTiposPagRec = async () => {
  loadingTiposPagRec.value = true
  try {
    await financeiroStore.buscarTiposPagRec()
    tiposPagRec.value = financeiroStore.tiposPagRec || []
  } catch (error) {
    console.error('Erro ao carregar tipos de pagamento/recebimento:', error)
    tiposPagRec.value = []
  } finally {
    loadingTiposPagRec.value = false
  }
}

const carregarTiposDocumento = async () => {
  loadingTiposDoc.value = true
  try {
    await financeiroStore.buscarTiposDocumento()
    tiposDocumento.value = financeiroStore.tiposDocumento || []
  } catch (error) {
    console.error('Erro ao carregar tipos de documento:', error)
    tiposDocumento.value = []
  } finally {
    loadingTiposDoc.value = false
  }
}

const carregarContasCorrentes = async () => {
  loadingContaCorrente.value = true
  try {
    const response = await financeiroStore.buscarContasCorrentes()
    const dados = response?.data || response || []
    contasCorrentes.value = Array.isArray(dados) ? dados : []
    console.log('Contas correntes carregadas:', contasCorrentes.value)
  } catch (error) {
    console.error('Erro ao carregar contas correntes:', error)
    contasCorrentes.value = []
  } finally {
    loadingContaCorrente.value = false
  }
}

const carregarHistoricosBancarios = async () => {
  loadingHistBancario.value = true
  try {
    const response = await financeiroStore.buscarHistoricosBancarios()
    const dados = response?.data || response || []
    historicosBancarios.value = Array.isArray(dados) ? dados : []
    console.log('Históricos bancários carregados:', historicosBancarios.value)
  } catch (error) {
    console.error('Erro ao carregar históricos bancários:', error)
    historicosBancarios.value = []
  } finally {
    loadingHistBancario.value = false
  }
}

const carregarLancamentos = async () => {

  if (!filtros.dtini || !filtros.dtfim) {
    console.warn('Selecione as datas para buscar os lançamentos')
    return
  }

  loading.value = true
  try {
    const idEmpresa = empresaStore.empresa?.id || empresaStore.empresaSelecionada?.id
    
    if (!idEmpresa) {
      console.error('ID da empresa não encontrado')
      loading.value = false
      return
    }

    console.log('Buscando lançamentos:', {
      idEmpresa,
      dtini: filtros.dtini,
      dtfim: filtros.dtfim,
      idCliente: filtros.id_cliente
    })
    
    const resultado = await adiantamentoStore.buscarAdiantamentos(
      idEmpresa,
      filtros.dtini,
      filtros.dtfim,
      filtros.id_cliente
    )
    
    console.log('Resultado da API:', resultado)
    
    // A API retorna { saldoanterior: [valor], data: [...], records: N }
    saldoAnterior.value = Array.isArray(resultado.saldoanterior) ? resultado.saldoanterior[0] : (resultado.saldoanterior || 0)
    lancamentos.value = Array.isArray(resultado.data) ? resultado.data : []
    
    console.log('Lançamentos carregados:', lancamentos.value.length)
    console.log('Saldo anterior:', saldoAnterior.value)
  } catch (error) {
    console.error('Erro ao carregar lançamentos:', error)
    lancamentos.value = []
    saldoAnterior.value = 0
  } finally {
    loading.value = false
  }
}

// Watch para atualizar data quando caixa for selecionado
watch(() => formData.id_caixa, (novoIdCaixa) => {
  if (!novoIdCaixa || formData.local_lct !== 'CAI') return
  
  const caixaSelecionado = caixasDisponiveis.value.find(c => c.id_caixa === novoIdCaixa)
  console.log('Caixa selecionado:', caixaSelecionado)
  
  if (caixaSelecionado && caixaSelecionado.dt_abertura) {
    formData.dtlancamento = caixaSelecionado.dt_abertura
    console.log('Data de abertura atribuída:', formData.dtlancamento)
  }
})

// Salvar lançamento
const salvarLancamento = async () => {
  if (!formValido.value) {
    console.warn('Preencha todos os campos obrigatórios')
    return
  }

  loading.value = true
  try {
    const idEmpresa = empresaStore.empresa?.id || empresaStore.empresaSelecionada?.id
    
    if (!idEmpresa) {
      console.error('ID da empresa não encontrado')
      loading.value = false
      return
    }

    const payload = {
      data: [{
        id_cliente: formData.id_pessoa,
        id_empresa: idEmpresa,
        id_caixahist: formData.local_lct === 'CAI' ? formData.id_hist_contabil_caixa : null,
        id_caixa: formData.local_lct === 'CAI' ? formData.id_caixa : null,
        id_ccorrente: formData.local_lct === 'BAN' ? formData.id_ccorrente : null,
        id_historico: formData.local_lct === 'BAN' ? formData.id_historico : null,      
        local_lct: formData.local_lct,
        tipo: formData.tipo,
        dtlancamento: formData.dtlancamento,
        valor: parseFloat(formData.valor),
        origem: 'ADT',
        observacao: formData.observacao || null,
        id_tipopagrec: formData.id_tipopagrec,
        id_hist_contabil: formData.id_hist_contabil || null,
        id_planoconta: formData.id_planoconta,
        id_tipodocumento: formData.local_lct !== 'BAN' ? formData.id_tipodocumento : null,
        nrdocumento: formData.nrdocumento || null
      }]
    }

    console.log('Payload a ser enviado:', payload)

    if (editando.value && formData.id) {
      await adiantamentoStore.atualizarAdiantamento(formData.id, payload)
      console.log('Lançamento atualizado com sucesso!')
    } else {
      await adiantamentoStore.criarAdiantamento(payload)
      console.log('Lançamento cadastrado com sucesso!')
    }
    
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
  Object.assign(formData, {
    id: item.id,
    id_pessoa: item.id_pessoa,
    id_planoconta: item.id_planoconta,
    id_hist_contabil: item.id_hist_contabil || null,
    local_lct: item.local_lct || 'CAI',
    id_caixa: item.id_caixa,
    id_ccorrente: item.id_ccorrente || null,
    id_historico: item.id_historico || null,
    id_hist_contabil_caixa: item.id_hist_contabil_caixa || null,
    id_tipopagrec: item.id_tipopagrec,
    id_tipodocumento: item.id_tipodocumento || null,
    dtlancamento: item.dtlancamento,
    dtcobranca: item.dtcobranca || '',
    nrdocumento: item.nrdocumento || '',
    valor: item.valor,
    observacao: item.observacao || ''
  })
  
  editando.value = true
  formularioAberto.value = true
}

// Confirmar exclusão
const confirmarExclusao = (item) => {
  if (confirm(`Deseja realmente excluir este lançamento?\n\nCliente: ${item.nome_razao}\nValor: ${formatarMoeda(item.valor)}`)) {
    excluirLancamento(item)
  }
}

// Excluir lançamento
const excluirLancamento = async (item) => {
  loading.value = true
  try {
    const idEmpresa = empresaStore.empresa?.id || empresaStore.empresaSelecionada?.id
    
    if (!idEmpresa) {
      console.error('ID da empresa não encontrado')
      loading.value = false
      return
    }
    
    await adiantamentoStore.excluirAdiantamento(idEmpresa, item.id)
    console.log('Lançamento excluído com sucesso!')
    await carregarLancamentos()
  } catch (error) {
    console.error('Erro ao excluir lançamento:', error)
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(async () => {
  console.log('🚀 Iniciando carregamento de dados...')
  await Promise.all([
    carregarClientes(),
    carregarPlanosConta(),
    carregarCaixas(),
    carregarTiposPagRec(),
    carregarHistoricosContabil(),
    carregarTiposDocumento(),
    carregarContasCorrentes(),
    carregarHistoricosBancarios()
  ])
  
  console.log('✅ Carregamento inicial completo')
})
</script>

<style scoped>
/* Estilos específicos se necessário */
</style>
