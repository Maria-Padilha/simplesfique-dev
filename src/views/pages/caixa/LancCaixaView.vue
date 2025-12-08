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
        <!-- Filtros de Busca Avançada -->
        <v-card class="mb-4 background-card" elevation="1">
          <v-card-title class="text-h6 pa-4">
            <v-icon icon="mdi-filter" class="mr-2"></v-icon>
            Filtros de Busca
          </v-card-title>
          <v-card-text class="pa-4">
            <v-row>
              <!-- Selecione o Caixa -->
              <v-col cols="12" md="6">
                <v-autocomplete
                  v-model="filtros.id_caixa"
                  :items="caixasDisponiveis"
                  :loading="loadingCaixas"
                  item-title="desccaixa"
                  item-value="id_caixa"
                  label="Selecione o Caixa"
                  variant="outlined"
                  density="compact"
                  prepend-inner-icon="mdi-cash-register"
                  clearable
                  @update:model-value="aplicarFiltros"
                >
                  <template v-slot:prepend-item>
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon>mdi-numeric</v-icon>
                      </template>
                      <template v-slot:title>
                        <span class="font-weight-bold">{{ filtros.id_caixa || '1' }}</span>
                      </template>
                      <template v-slot:append>
                        <span class="text-caption">{{ caixasDisponiveis.find(c => c.id_caixa === filtros.id_caixa)?.desccaixa || 'CAIXA - FINANCEIRO' }}</span>
                      </template>
                    </v-list-item>
                    <v-divider></v-divider>
                  </template>
                </v-autocomplete>
              </v-col>

              <!-- Período de Cadastro -->
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="filtros.dataInicio"
                  label="De"
                  type="date"
                  variant="outlined"
                  density="compact"
                  prepend-inner-icon="mdi-calendar"
                  @update:model-value="aplicarFiltros"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="3">
                <v-text-field
                  v-model="filtros.dataFim"
                  label="A"
                  type="date"
                  variant="outlined"
                  density="compact"
                  prepend-inner-icon="mdi-calendar"
                  @update:model-value="aplicarFiltros"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

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
                      <v-autocomplete
                        v-model="formData.id_planoconta"
                        :items="planosConta"
                        :loading="loadingPlanosConta"
                        item-title="descconta"
                        item-value="id"
                        label="Plano de Conta *"
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

                    <!-- Número Documento -->
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="formData.nrdocumento"
                        label="Número Documento"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-numeric"
                        maxlength="20"
                        counter="20"
                      ></v-text-field>
                    </v-col>

                    <!-- Histórico do Caixa -->
                    <v-col cols="12" md="4">
                      <v-autocomplete
                        v-model="formData.id_caixahist"
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

                    <!-- Tipo (Entrada/Saída) -->
                    <v-col cols="12" md="4">
                      <v-select
                        v-model="formData.tipo"
                        :items="[
                          { title: 'Entrada', value: '+' },
                          { title: 'Saída', value: '-' }
                        ]"
                        label="Tipo *"
                        :rules="[rules.required]"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-swap-vertical"
                      ></v-select>
                    </v-col>

                    <!-- Tipo Pagamento/Recebimento -->
                    <v-col cols="12" md="4">
                      <v-autocomplete
                        v-model="formData.id_tipopagrec"
                        :items="tiposPagRec"
                        :loading="loadingTiposPagRec"
                        item-title="desctipopagrec"
                        item-value="id"
                        label="Tipo Pagamento/Recebimento *"
                        :rules="[rules.required]"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-credit-card"
                        no-data-text="Nenhum tipo disponível"
                      ></v-autocomplete>
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

                    <!-- Rateio por Centro de Custo -->
                    <v-col cols="12" v-if="mostrarRateio">
                      <v-expand-transition>
                        <v-card variant="outlined" class="mt-4" elevation="1">
                          <v-card-title class="text-h6 pa-4 d-flex align-center">
                            <v-icon icon="mdi-swap-horizontal" class="mr-2" color="orange"></v-icon>
                            Rateio por Centro de Custo
                            <v-spacer></v-spacer>
                            <v-btn 
                              size="small" 
                              color="orange" 
                              variant="text" 
                              prepend-icon="mdi-plus"
                              @click="adicionarCentro"
                            >
                              Adicionar Centro
                            </v-btn>
                            <v-btn 
                              size="small" 
                              color="orange" 
                              variant="elevated" 
                              class="ml-2"
                              @click="distribuirIgualmente"
                            >
                              Distribuir igualmente
                            </v-btn>
                          </v-card-title>

                          <v-card-text class="pa-4">
                            <div v-if="ccustosRateio.length === 0" class="text-center text-grey pa-4">
                              Nenhum centro de custo adicionado. Clique em "Adicionar Centro" para começar o rateio.
                            </div>

                            <v-table v-else density="compact">
                              <thead>
                                <tr>
                                  <th style="width: 40%">Centro de Custo</th>
                                  <th style="width: 25%">Valor (R$)</th>
                                  <th style="width: 20%">Porcentagem (%)</th>
                                  <th style="width: 15%; text-align: center">Ações</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr v-for="(linha, index) in ccustosRateio" :key="index">
                                  <td>
                                    <v-select
                                      v-model="linha.id_ccusto"
                                      :items="centrosCusto"
                                      item-title="desccentrocusto"
                                      item-value="id"
                                      label="Selecione"
                                      variant="outlined"
                                      density="compact"
                                      hide-details
                                    />
                                  </td>
                                  <td>
                                    <v-text-field
                                      v-model.number="linha.valor"
                                      type="number"
                                      step="0.01"
                                      variant="outlined"
                                      density="compact"
                                      prefix="R$"
                                      hide-details
                                      @input="onRateioValorChange(index)"
                                    />
                                  </td>
                                  <td>
                                    <v-text-field
                                      v-model.number="linha.porcentagem"
                                      type="number"
                                      step="0.01"
                                      variant="outlined"
                                      density="compact"
                                      suffix="%"
                                      hide-details
                                      @input="onRateioPercentChange(index)"
                                    />
                                  </td>
                                  <td style="text-align: center">
                                    <v-btn
                                      icon="mdi-delete"
                                      size="small"
                                      color="error"
                                      variant="text"
                                      @click="removerCentro(index)"
                                    />
                                  </td>
                                </tr>
                              </tbody>
                              <tfoot>
                                <tr class="font-weight-bold">
                                  <td>TOTAL</td>
                                  <td>{{ formatarMoeda(totalRateadoValor) }}</td>
                                  <td>{{ Number(totalRateadoPercent).toFixed(2) }}%</td>
                                  <td></td>
                                </tr>
                              </tfoot>
                            </v-table>
                          </v-card-text>
                        </v-card>
                      </v-expand-transition>
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
        <v-card class="background-card" elevation="1">
          <v-card-text class="pa-0">
            <!-- Saldo Anterior -->
            <v-card class="ma-4 mb-0 background-card" elevation="2">
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
              class="elevation-0"
              :items-per-page="15"
              density="compact"
            >
              <!-- Coluna Nr Documento -->
              <template v-slot:[`item.nrdocumento`]="{ item }">
                {{ item.nrdocumento || '--' }}
              </template>

              <!-- Coluna Dt Mov. -->
              <template v-slot:[`item.dtlancamento`]="{ item }">
                {{ formatarData(item.dtlancamento) }}
              </template>

              <!-- Coluna Complemento (deschistorico) -->
              <template v-slot:[`item.deschistorico`]="{ item }">
                {{ item.deschistorico || '--' }}
              </template>

              <!-- Coluna Entrada -->
              <template v-slot:[`item.entrada`]="{ item }">
                <span v-if="item.tipo === '+'" class="text-success font-weight-bold">
                  {{ formatarMoeda(item.valor) }}
                </span>
                <span v-else>--</span>
              </template>

              <!-- Coluna Saída -->
              <template v-slot:[`item.saida`]="{ item }">
                <span v-if="item.tipo === '-'" class="text-error font-weight-bold">
                  {{ formatarMoeda(item.valor) }}
                </span>
                <span v-else>--</span>
              </template>

              <!-- Coluna Saldo -->
              <template v-slot:[`item.saldo`]="{ item }">
                <span class="font-weight-bold" :class="calcularSaldo(lancamentosFiltrados.indexOf(item)) >= 0 ? 'text-success' : 'text-error'">
                  {{ formatarMoeda(calcularSaldo(lancamentosFiltrados.indexOf(item))) }}
                </span>
              </template>

              <!-- Coluna Origem -->
              <template v-slot:[`item.origem`]="{ item }">
                {{ obterLabelOrigem(item.origem) }}
              </template>

              <!-- Coluna Tipo Pagamento -->
              <template v-slot:[`item.desctipopagrec`]="{ item }">
                {{ item.desctipopagrec || '--' }}
              </template>

              <!-- Coluna Observação -->
              <template v-slot:[`item.observacao`]="{ item }">
                {{ item.observacao || '--' }}
              </template>

              <!-- Loading -->
              <template v-slot:loading>
                <v-skeleton-loader type="table-row@5"></v-skeleton-loader>
              </template>

              <!-- Sem dados -->
              <template v-slot:no-data>
                <div class="text-center py-8">
                  <v-icon icon="mdi-cash-multiple" size="64" color="grey" class="mb-4"></v-icon>
                  <p class="text-h6 text-grey">Nenhum lançamento encontrado</p>
                </div>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>

        <!-- Card de Totais -->
        <v-card class="mt-4 background-card" elevation="1">
          <v-card-text class="pa-4">
            <v-row>
              <v-col cols="12" md="3">
                <div class="text-caption text-grey">Entrada</div>
                <div class="text-h6 text-success font-weight-bold">{{ formatarMoeda(totalEntradas) }}</div>
              </v-col>
              <v-col cols="12" md="3">
                <div class="text-caption text-grey">Saída</div>
                <div class="text-h6 text-error font-weight-bold">{{ formatarMoeda(totalSaidas) }}</div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="text-caption text-grey">TOTAL DO PERÍODO:</div>
                <div class="text-h5 font-weight-bold" :class="saldoFinal >= 0 ? 'text-success' : 'text-error'">
                  {{ formatarMoeda(saldoFinal) }}
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useThemeStore } from '@/stores/config-temas/theme'
import { useCaixaStore } from '@/stores/APIs/caixa'
import { useEmpresaStore } from '@/stores/APIs/empresa'
import { useFinanceiroStore } from '@/stores/APIs/financeiro'
import { useConfigParfinStore } from '@/stores/APIs/config'
import { useCCustoStore } from '@/stores/APIs/ccusto'
import BotaoExpandTransition from '@/components/base/padrao-paginas/BotaoExpandTransition.vue'

const themeStore = useThemeStore()
const caixaStore = useCaixaStore()
const empresaStore = useEmpresaStore()
const financeiroStore = useFinanceiroStore()
const configStore = useConfigParfinStore()
const ccustoStore = useCCustoStore()

// Estado
const formularioAberto = ref(false)
const editando = ref(false)
const formValido = ref(false)
const formRef = ref(null)
const loading = ref(false)
const loadingCaixas = ref(false)
const loadingTiposDoc = ref(false)
const loadingHistCaixa = ref(false)
const loadingHistContabil = ref(false)
const loadingPlanosConta = ref(false)
const loadingTiposPagRec = ref(false)

// Rateio por centro de custo
const mostrarRateio = ref(false)
const centrosCusto = ref([])
const ccustosRateio = ref([])

// Dados
const caixasDisponiveis = ref([])
const tiposDocumento = ref([])
const historicosCaixa = ref([])
const historicosContabil = ref([])
const lancamentos = ref([])
const planosConta = ref([])
const tiposPagRec = ref([])

// Formulário
const formData = reactive({
  id: null,
  id_caixa: null,
  id_planoconta: null,
  id_tipodocumento: null,
  nrdocumento: '',
  id_caixahist: null,
  id_hist_contabil: null,
  dtlancamento: new Date().toISOString().split('T')[0],
  valor: 0,
  tipo: '+', // + = Entrada, - = Saída
  id_tipopagrec: null,
  origem: 'M', // M = Manual
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
  { title: 'Nr Documento', key: 'nrdocumento', sortable: true, width: '150px' },
  { title: 'Dt Mov.', key: 'dtlancamento', sortable: true, width: '100px' },
  { title: 'Complemento', key: 'deschistorico', sortable: false, width: '250px' },
  { title: 'Entrada', key: 'entrada', sortable: true, align: 'end', width: '120px' },
  { title: 'Saída', key: 'saida', sortable: true, align: 'end', width: '120px' },
  { title: 'Saldo', key: 'saldo', sortable: false, align: 'end', width: '120px' },
  { title: 'Origem', key: 'origem', sortable: true, width: '100px' },
  { title: 'Tipo Pagamento', key: 'desctipopagrec', sortable: true, width: '150px' },
  { title: 'Observação', key: 'observacao', sortable: false, width: '200px' }
]

// Filtros
const filtros = reactive({
  id_caixa: null,
  dataInicio: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0], // Primeiro dia do mês
  dataFim: new Date().toISOString().split('T')[0] // Hoje
})

// Computed
const lancamentosFiltrados = computed(() => {
  // A API já retorna os dados filtrados por caixa e período
  // Então apenas retornamos os lançamentos carregados
  const dados = lancamentos.value || []
  console.log('lancamentosFiltrados computed:', dados.length, 'itens')
  return dados
})

const saldoAnterior = ref(664.90) // Será calculado conforme período

const totalEntradas = computed(() => {
  return lancamentosFiltrados.value
    .filter(l => l.tipo === '+')
    .reduce((sum, l) => sum + parseFloat(l.valor || 0), 0)
})

const totalSaidas = computed(() => {
  return lancamentosFiltrados.value
    .filter(l => l.tipo === '-')
    .reduce((sum, l) => sum + parseFloat(l.valor || 0), 0)
})

const saldoFinal = computed(() => {
  return saldoAnterior.value + totalEntradas.value - totalSaidas.value
})

const totalRateadoValor = computed(() => {
  return ccustosRateio.value.reduce((s, r) => s + (parseFloat(r.valor) || 0), 0)
})

const totalRateadoPercent = computed(() => {
  return ccustosRateio.value.reduce((s, r) => s + (parseFloat(r.porcentagem) || 0), 0)
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

const obterLabelOrigem = (origem) => {
  const origens = {
    'M': 'MANUAL',
    'A': 'AUTOMÁTICO',
    'I': 'IMPORTAÇÃO',
    'T': 'TRANSFERÊNCIA'
  }
  return origens[origem] || origem
}

const calcularSaldo = (index) => {
  let saldo = saldoAnterior.value
  
  for (let i = 0; i <= index; i++) {
    const item = lancamentosFiltrados.value[i]
    if (item.tipo === '+') {
      saldo += parseFloat(item.valor || 0)
    } else {
      saldo -= parseFloat(item.valor || 0)
    }
  }
  
  return saldo
}

const aplicarFiltros = () => {
  // Filtros são aplicados automaticamente via computed
  carregarLancamentos()
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
    id_planoconta: null,
    id_tipodocumento: null,
    nrdocumento: '',
    id_caixahist: null,
    id_hist_contabil: null,
    dtlancamento: new Date().toISOString().split('T')[0],
    valor: 0,
    tipo: '+',
    id_tipopagrec: null,
    origem: 'M',
    observacao: ''
  })
  if (formRef.value) {
    formRef.value.resetValidation()
  }
}

// Watcher para verificar se utiliza centro de custo quando tipo for '-' (Saída)
watch(() => formData.tipo, async (novoTipo) => {
  if (novoTipo === '-') {
    await verificarUtilizaCCusto()
  } else {
    mostrarRateio.value = false
    ccustosRateio.value = []
  }
})

// Verificar se utiliza centro de custo
const verificarUtilizaCCusto = async () => {
  try {
    const idEmpresa = empresaStore.empresa?.id || empresaStore.empresaSelecionada?.id
    if (!idEmpresa) return

    console.log('🔍 Verificando parâmetros de centro de custo para empresa:', idEmpresa)
    const response = await ccustoStore.buscarParametrosCCusto(idEmpresa)
    console.log('📦 Resposta completa da API:', response)
    
    // A API retorna { data: [{ utiliza_ccusto: "S", ... }] }
    const dataArray = response?.data || response
    const params = Array.isArray(dataArray) ? dataArray[0] : dataArray
    console.log('📋 Parâmetros processados:', params)
    console.log('✅ utiliza_ccusto:', params?.utiliza_ccusto)
    
    if (params && params.utiliza_ccusto === 'S') {
      console.log('✅ Centro de custo ATIVO - Mostrando rateio')
      mostrarRateio.value = true
      
      // Carregar centros de custo se ainda não foram carregados
      if (centrosCusto.value.length === 0) {
        console.log('📥 Carregando centros de custo...')
        await ccustoStore.listarCCusto()
        centrosCusto.value = ccustoStore.centrosCusto || []
        console.log('📊 Centros carregados:', centrosCusto.value.length)
      }
      
      // Inicializar com uma linha se estiver vazio
      if (ccustosRateio.value.length === 0) {
        console.log('➕ Adicionando primeira linha de rateio')
        adicionarCentro()
      }
    } else {
      console.log('❌ Centro de custo INATIVO ou não configurado')
      mostrarRateio.value = false
      ccustosRateio.value = []
    }
  } catch (error) {
    console.error('❌ Erro ao verificar parâmetros de centro de custo:', error)
    mostrarRateio.value = false
  }
}

// Métodos de rateio
const adicionarCentro = () => {
  ccustosRateio.value.push({
    id_ccusto: null,
    desccentrocusto: '',
    valor: 0,
    porcentagem: 0
  })
}

const removerCentro = (index) => {
  ccustosRateio.value.splice(index, 1)
  recalcularPorcentagens()
}

const onRateioValorChange = (index) => {
  const total = parseFloat(formData.valor) || 0
  if (total === 0) return
  
  const r = ccustosRateio.value[index]
  if (!r) return
  
  const valorAtual = parseFloat(r.valor) || 0
  r.porcentagem = ((valorAtual / total) * 100).toFixed(2)
}

const onRateioPercentChange = (index) => {
  const total = parseFloat(formData.valor) || 0
  if (total === 0) return
  
  const r = ccustosRateio.value[index]
  if (!r) return
  
  const porcAtual = parseFloat(r.porcentagem) || 0
  r.valor = ((porcAtual * total) / 100).toFixed(2)
}

const recalcularPorcentagens = () => {
  const total = parseFloat(formData.valor) || 0
  if (total === 0) return
  
  ccustosRateio.value.forEach(r => {
    const valorNum = parseFloat(r.valor) || 0
    r.porcentagem = ((valorNum / total) * 100).toFixed(2)
  })
}

const distribuirIgualmente = () => {
  const total = parseFloat(formData.valor) || 0
  const count = ccustosRateio.value.length || 1
  
  if (count === 0 || total === 0) return
  
  const valorPorCentro = total / count
  let valorAcumulado = 0
  
  ccustosRateio.value.forEach((r, index) => {
    // Para o último centro, ajustar para garantir que a soma seja exatamente o total
    if (index === count - 1) {
      r.valor = (total - valorAcumulado).toFixed(2)
    } else {
      r.valor = valorPorCentro.toFixed(2)
      valorAcumulado += parseFloat(r.valor)
    }
    
    // Calcular porcentagem
    r.porcentagem = ((parseFloat(r.valor) / total) * 100).toFixed(2)
  })
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

const carregarLancamentos = async () => {
  loading.value = true
  try {
    const idEmpresa = empresaStore.empresa?.id || empresaStore.empresaSelecionada?.id
    
    if (!idEmpresa) {
      console.warn('ID da empresa não encontrado')
      return
    }

    // Verificar se há caixa e datas selecionadas
    if (!filtros.id_caixa || !filtros.dataInicio || !filtros.dataFim) {
      console.warn('Filtros incompletos:', filtros)
      lancamentos.value = []
      saldoAnterior.value = 0
      return
    }
    
    console.log('Carregando lançamentos com filtros:', {
      idEmpresa,
      id_caixa: filtros.id_caixa,
      dataInicio: filtros.dataInicio,
      dataFim: filtros.dataFim
    })
    
    const resultado = await caixaStore.buscarLancamentosCaixa(
      idEmpresa, 
      filtros.id_caixa, 
      filtros.dataInicio, 
      filtros.dataFim
    )
    
    console.log('Resultado da API:', resultado)
    
    // A API retorna { saldoanterior, data, records }
    saldoAnterior.value = resultado.saldoanterior || 0
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

    // Montar array ccusto no formato solicitado: [{ id_ccusto, valor, perc_ccusto }]
    const ccustoArray = ccustosRateio.value
      .filter(r => r.id_ccusto) // Só incluir linhas com centro selecionado
      .map(r => ({
        id_ccusto: r.id_ccusto,
        valor: (parseFloat(r.valor) || 0).toFixed(2),
        perc_ccusto: (parseFloat(r.porcentagem) || 0).toFixed(2)
      }))

    // Validar soma do rateio (se houver rateios) contra o valor do lançamento
    if (ccustoArray.length > 0) {
      const totalRateado = parseFloat(totalRateadoValor.value) || 0
      const valorLancamento = parseFloat(formData.valor) || 0
      if (Math.abs(totalRateado - valorLancamento) > 0.01) {
        mostrarMensagem('Total do rateio por centro de custo não corresponde ao valor do lançamento', 'warning')
        loading.value = false
        return
      }
    }

    const payload = {
      data: [{
        tipo: formData.tipo,
        valor: parseFloat(formData.valor),
        origem: formData.origem,
        observacao: formData.observacao || null,
        id_tipopagrec: formData.id_tipopagrec,
        id_caixahist: formData.id_caixahist,
        id_hist_contabil: formData.id_hist_contabil || null,
        id_planoconta: formData.id_planoconta,
        nrdocumento: formData.nrdocumento || null
      }],
      ccusto: ccustoArray
    }

    if (editando.value && formData.id) {
      await caixaStore.atualizarLancamentoCaixa(idEmpresa, formData.id_caixa, formData.id, payload)
    } else {
      await caixaStore.criarLancamentoCaixa(idEmpresa, formData.id_caixa, payload)
    }
    
    cancelarFormulario()
    await carregarLancamentos()
  } catch (error) {
    console.error('Erro ao salvar lançamento:', error)
  } finally {
    loading.value = false
  }
}

const mostrarMensagem = (mensagem, tipo) => {
  console.log(`[${tipo}] ${mensagem}`)
  // Aqui você pode adicionar um toast/snackbar se quiser
}

// Editar lançamento (funcionalidade futura)
// const editarLancamento = (item) => {
//   editando.value = true
//   formularioAberto.value = true
//   
//   Object.assign(formData, {
//     id: item.id,
//     id_caixa: item.id_caixa,
//     id_planoconta: item.id_planoconta || null,
//     id_tipodocumento: item.id_tipodocumento,
//     nrdocumento: item.nrdocumento || '',
//     id_caixahist: item.id_caixahist,
//     id_hist_contabil: item.id_hist_contabil || null,
//     dtlancamento: item.dtlancamento,
//     valor: item.valor,
//     tipo: item.tipo,
//     id_tipopagrec: item.id_tipopagrec,
//     origem: item.origem || 'M',
//     observacao: item.observacao || ''
//   })
// }

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

    await caixaStore.deletarLancamentoCaixa(idEmpresa, idParaExcluir)
    
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
  console.log('🚀 Iniciando carregamento de dados...')
  await Promise.all([
    carregarCaixas(),
    carregarTiposDocumento(),
    carregarHistoricosCaixa(),
    carregarHistoricosContabil(),
    carregarPlanosConta(),
    carregarTiposPagRec()
  ])
  
  // Carregar lançamentos após carregar os caixas
  console.log('Filtros após carregamento:', filtros)
  console.log('Caixas disponíveis:', caixasDisponiveis.value)
  
  // Se há caixas disponíveis e nenhum está selecionado, selecionar o primeiro
  if (caixasDisponiveis.value.length > 0 && !filtros.id_caixa) {
    filtros.id_caixa = caixasDisponiveis.value[0].id_caixa
    console.log('Caixa selecionado automaticamente:', filtros.id_caixa)
  }
  
  await carregarLancamentos()
  console.log('✅ Carregamento inicial completo')
})
</script>

<style scoped>
/* Estilos específicos se necessário */
</style>
