<template>
  <top-all-pages icon="mdi-bank-transfer">
    <template #titulo>Movimentações Bancárias</template>
    <template #section>
      <div>
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
                  <!-- Selecione a Conta -->
                  <v-col cols="12" md="3">
                    <v-autocomplete
                        v-model="filtros.id_ccorrente"
                        :items="contasDisponiveis"
                        :loading="loadingContas"
                        item-title="titular"
                        item-value="id"
                        label="Selecione a Conta"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-bank"
                        clearable
                        hide-details
                    >
                      <template v-slot:item="{ props, item }">
                        <v-list-item v-bind="props">
                          <template v-slot:prepend>
                            <v-icon icon="mdi-bank" size="20" class="mr-2"></v-icon>
                          </template>
                          <template v-slot:title>
                            {{ item.raw.titular }}
                          </template>
                          <template v-slot:subtitle>
                        <span class="text-caption opacity-70">
                          {{ item.raw.descbanco }} - {{ item.raw.numero_ccorrente }}-{{ item.raw.digito_cc }}
                        </span>
                          </template>
                        </v-list-item>
                      </template>
                      <template v-slot:selection="{ item }">
                        {{ item.raw.titular }} - {{ item.raw.numero_ccorrente }}-{{ item.raw.digito_cc }}
                      </template>
                    </v-autocomplete>
                  </v-col>

                  <!-- Período -->
                  <v-col cols="12" md="2">
                    <v-select
                        v-model="filtros.periodo"
                        :items="opcoesPeriodo"
                        label="Período"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-calendar-month"
                        hide-details
                        clearable
                    ></v-select>
                  </v-col>

                  <!-- Data Início -->
                  <v-col cols="12" md="2">
                    <v-text-field
                        v-model="filtros.dataInicio"
                        label="Data Início"
                        type="date"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-calendar-start"
                        hide-details
                    ></v-text-field>
                  </v-col>

                  <!-- Data Fim -->
                  <v-col cols="12" md="2">
                    <v-text-field
                        v-model="filtros.dataFim"
                        label="Data Fim"
                        type="date"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-calendar-end"
                        hide-details
                    ></v-text-field>
                  </v-col>
                  <!-- Botão Buscar -->
                  <v-col cols="12" md="3">
                    <v-btn
                        color="var(--text-color-laranja)"
                        variant="flat"
                        class="text-white"
                        prepend-icon="mdi-magnify"
                        @click="aplicarFiltros"
                        :loading="loading"
                        :disabled="!filtros.id_ccorrente"
                        block
                    >
                      Buscar
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <BotaoExpandTransition
                :formulario-aberto="formularioAberto"
                texto-abrir="Nova Movimentação"
                texto-fechar="Cancelar"
                @toggle="toggleFormulario"
            />

            <!-- Formulário de Movimentação -->
            <v-expand-transition>
              <div v-if="formularioAberto">
                <v-card class="background-card mb-7" elevation="2">
                  <v-card-title class="text-h6 pa-4">
                    <v-icon :icon="editando ? 'mdi-pencil' : 'mdi-plus'" class="mr-2"></v-icon>
                    {{ editando ? 'Editar Movimentação' : 'Nova Movimentação' }}
                  </v-card-title>

                  <v-card-text class="pa-4">
                    <v-form ref="formRef" v-model="formValido">
                      <v-row>
                        <!-- Conta Bancária -->
                        <v-col cols="12" md="4">
                          <v-autocomplete
                              v-model="formData.id_ccorrente"
                              :items="contasDisponiveis"
                              :loading="loadingContas"
                              item-title="titular"
                              item-value="id"
                              label="Conta Bancária *"
                              :rules="[rules.required]"
                              variant="outlined"
                              density="compact"
                              prepend-inner-icon="mdi-bank"
                              no-data-text="Nenhuma conta disponível"
                          >
                            <template v-slot:item="{ props, item }">
                              <v-list-item v-bind="props">
                                <template v-slot:prepend>
                                  <v-icon icon="mdi-bank" size="20" class="mr-2"></v-icon>
                                </template>
                                <template v-slot:title>
                                  {{ item.raw.titular }}
                                </template>
                                <template v-slot:subtitle>
                              <span class="text-caption opacity-70">
                                {{ item.raw.descbanco }} - {{ item.raw.numero_ccorrente }}-{{ item.raw.digito_cc }}
                              </span>
                                </template>
                              </v-list-item>
                            </template>
                            <template v-slot:selection="{ item }">
                              {{ item.raw.titular }} - {{ item.raw.numero_ccorrente }}-{{ item.raw.digito_cc }}
                            </template>
                          </v-autocomplete>
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

                        <!-- Histórico -->
                        <v-col cols="12" md="4">
                          <v-autocomplete
                              v-model="formData.id_historico"
                              :items="historicos"
                              :loading="loadingHistoricos"
                              item-title="deschistorico"
                              item-value="id"
                              label="Histórico *"
                              :rules="[rules.required]"
                              variant="outlined"
                              density="compact"
                              prepend-inner-icon="mdi-history"
                              no-data-text="Nenhum histórico disponível"
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

                        <!-- Plano de Conta -->
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
                    <v-spacer></v-spacer>
                    <v-btn color="grey" variant="text" @click="cancelarFormulario">
                      Cancelar
                    </v-btn>
                    <v-btn
                        color="var(--text-color-laranja)"
                        :loading="loading"
                        :disabled="!formValido"
                        @click="salvarMovimentacao"
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

            <!-- Tabela de Movimentações -->
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
                    :items="movimentacoesFiltradas"
                    :loading="loading"
                    item-key="id"
                    class="elevation-1 background-secondary"
                    :items-per-page="15"
                    density="compact"
                >
                  <!-- Coluna Data -->
                  <template v-slot:[`item.dtlancamento`]="{ item }">
                    {{ formatarData(item.dtlancamento) }}
                  </template>

                  <!-- Coluna Nr Documento -->
                  <template v-slot:[`item.nrdocumento`]="{ item }">
                    {{ item.nrdocumento || '--' }}
                  </template>

                  <!-- Coluna Histórico -->
                  <template v-slot:[`item.deschistorico`]="{ item }">
                    {{ item.deschistorico || '--' }}
                  </template>

                  <!-- Coluna Usuário -->
                  <template v-slot:[`item.nome`]="{ item }">
                    {{ item.nome || '--' }}
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
                <span class="font-weight-bold" :class="calcularSaldo(movimentacoesFiltradas.indexOf(item)) >= 0 ? 'text-success' : 'text-error'">
                  {{ formatarMoeda(calcularSaldo(movimentacoesFiltradas.indexOf(item))) }}
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
                          @click="editarMovimentacao(item)"
                      >
                        <v-icon size="20">mdi-pencil</v-icon>
                        <v-tooltip activator="parent" location="top">Editar</v-tooltip>
                      </v-btn>
                      <v-btn
                          icon="mdi-delete"
                          size="small"
                          variant="text"
                          color="error"
                          @click="excluirMovimentacao(item)"
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
                      <v-icon icon="mdi-bank-transfer" size="64" color="grey" class="mb-4"></v-icon>
                      <p class="text-h6 text-grey">Nenhuma movimentação encontrada</p>
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
                    <div class="text-caption text-grey">SALDO DO PERÍODO:</div>
                    <div class="text-h5 font-weight-bold" :class="saldoFinal >= 0 ? 'text-success' : 'text-error'">
                      {{ formatarMoeda(saldoFinal) }}
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
        <v-card class="background-secondary mb-4 ma-4 py-3 px-3 d-flex gap-4">
          <v-btn variant="outlined" color="var(--text-color-laranja)" prepend-icon="mdi-file-pdf-box" @click="exportarPDF">PDF</v-btn>
          <v-btn variant="outlined" color="var(--text-color-laranja)" prepend-icon="mdi-file-delimited" @click="exportarCSV">CSV</v-btn>
          <v-btn variant="outlined" color="var(--text-color-laranja)" prepend-icon="mdi-microsoft-excel" @click="exportarExcel">EXCEL</v-btn>
          <v-btn variant="outlined" color="var(--text-color-laranja)" prepend-icon="mdi-printer" @click="imprimirRelatorio">IMPRIMIR</v-btn>
        </v-card>


      </div>
    </template>
  </top-all-pages>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useThemeStore } from '@/stores/config-temas/theme'
import { useFinanceiroStore } from '@/stores/APIs/financeiro'
import { useEmpresaStore } from '@/stores/APIs/empresa'
import { useCCustoStore } from '@/stores/APIs/ccusto'
import BotaoExpandTransition from '@/components/base/padrao-paginas/BotaoExpandTransition.vue'
import html2pdf from 'html2pdf.js'
import logoImg from '@/assets/img/logo/logo-2.png'
import TopAllPages from "@/components/base/padrao-paginas/TopAllPages.vue";

const themeStore = useThemeStore()
const financeiroStore = useFinanceiroStore()
const empresaStore = useEmpresaStore()
const ccustoStore = useCCustoStore()

// Estado
const formularioAberto = ref(false)
const editando = ref(false)
const formValido = ref(false)
const formRef = ref(null)
const loading = ref(false)
const loadingContas = ref(false)
const loadingHistoricos = ref(false)
const loadingPlanosConta = ref(false)
const loadingHistContabil = ref(false)

// Dados
const contasDisponiveis = ref([])
const historicos = ref([])
const planosConta = ref([])
const historicosContabil = ref([])
const movimentacoes = ref([])
const saldoAnterior = ref(0)
const centrosCusto = ref([])
const ccustosRateio = ref([])
const mostrarRateio = ref(false)
const loadingCentros = ref(false)

// Template HTML para impressão
const templateMovimentacoes = ref('')

// Opções de período
const opcoesPeriodo = [
  { title: 'Hoje', value: 'hoje' },
  { title: 'Essa Semana', value: 'semana' },
  { title: 'Esse Mês', value: 'mes' },
  { title: 'Esse Ano', value: 'ano' },
  { title: 'Últimos 7 dias', value: 'ultimos7' },
  { title: 'Últimos 30 dias', value: 'ultimos30' },
  { title: 'Personalizado', value: 'personalizado' }
]

// Filtros
const filtros = reactive({
  id_ccorrente: null,
  periodo: 'mes',
  dataInicio: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
  dataFim: new Date().toISOString().split('T')[0]
})

// Formulário
const formData = reactive({
  id: null,
  id_ccorrente: null,
  id_empresa: null,
  id_historico: null,
  id_hist_contabil: null,
  id_planoconta: null,
  nrdocumento: '',
  observacao: '',
  valor: 0,
  dtlancamento: new Date().toISOString().split('T')[0],
  origem: 'BAN', // BAN = Banco
  tipo: '+' // + = Entrada, - = Saída
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
  { title: 'Data', key: 'dtlancamento', sortable: true, width: '100px' },
  { title: 'Nr Documento', key: 'nrdocumento', sortable: true, width: '120px' },
  { title: 'Histórico', key: 'deschistorico', sortable: false, width: '200px' },
  { title: 'Usuário', key: 'nome', sortable: true, width: '150px' },
  { title: 'Entrada', key: 'entrada', sortable: true, align: 'end', width: '120px' },
  { title: 'Saída', key: 'saida', sortable: true, align: 'end', width: '120px' },
  { title: 'Saldo', key: 'saldo', sortable: false, align: 'end', width: '120px' },
  { title: 'Observação', key: 'observacao', sortable: false, width: '150px' },
  { title: 'Ações', key: 'actions', sortable: false, align: 'center', width: '100px' }
]

// Computed
const movimentacoesFiltradas = computed(() => {
  const dados = movimentacoes.value || []
  return Array.isArray(dados) ? dados : []
})

const totalEntradas = computed(() => {
  return movimentacoesFiltradas.value
      .filter(m => m.tipo === '+')
      .reduce((sum, m) => sum + parseFloat(m.valor || 0), 0)
})

const totalSaidas = computed(() => {
  return movimentacoesFiltradas.value
      .filter(m => m.tipo === '-')
      .reduce((sum, m) => sum + parseFloat(m.valor || 0), 0)
})

const saldoFinal = computed(() => {
  return saldoAnterior.value + totalEntradas.value - totalSaidas.value
})

const totalRateadoValor = computed(() => {
  return ccustosRateio.value.reduce((sum, r) => sum + (parseFloat(r.valor) || 0), 0)
})

const totalRateadoPercent = computed(() => {
  return ccustosRateio.value.reduce((sum, r) => sum + (parseFloat(r.porcentagem) || 0), 0)
})

// Métodos de formatação
// Watch para controlar exibição do rateio
watch(() => formData.tipo, async (novoTipo) => {
  if (novoTipo === '-') {
    await verificarUtilizaCCusto()
  } else {
    mostrarRateio.value = false
    ccustosRateio.value = []
  }
})

// Watch para atualizar datas quando período mudar
watch(() => filtros.periodo, (novoPeriodo) => {
  if (!novoPeriodo) return

  const hoje = new Date()
  let dataInicio = new Date()
  let dataFim = new Date()

  switch (novoPeriodo) {
    case 'hoje': {
      dataInicio = hoje
      dataFim = hoje
      break
    }

    case 'semana': {
      const diaSemana = hoje.getDay()
      dataInicio = new Date(hoje)
      dataInicio.setDate(hoje.getDate() - diaSemana)
      dataFim = new Date(dataInicio)
      dataFim.setDate(dataInicio.getDate() + 6)
      break
    }

    case 'mes': {
      dataInicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
      dataFim = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0)
      break
    }

    case 'ano': {
      dataInicio = new Date(hoje.getFullYear(), 0, 1)
      dataFim = new Date(hoje.getFullYear(), 11, 31)
      break
    }

    case 'ultimos7': {
      dataInicio = new Date(hoje)
      dataInicio.setDate(hoje.getDate() - 6)
      dataFim = hoje
      break
    }

    case 'ultimos30': {
      dataInicio = new Date(hoje)
      dataInicio.setDate(hoje.getDate() - 29)
      dataFim = hoje
      break
    }

    case 'personalizado': {
      // Não altera as datas, deixa o usuário escolher
      return
    }
  }

  filtros.dataInicio = dataInicio.toISOString().split('T')[0]
  filtros.dataFim = dataFim.toISOString().split('T')[0]
})

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

const calcularSaldo = (index) => {
  if (index < 0) return saldoAnterior.value

  let saldo = saldoAnterior.value
  for (let i = 0; i <= index; i++) {
    const mov = movimentacoesFiltradas.value[i]
    if (mov.tipo === '+') {
      saldo += parseFloat(mov.valor || 0)
    } else {
      saldo -= parseFloat(mov.valor || 0)
    }
  }
  return saldo
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
    id: null,
    id_ccorrente: filtros.id_ccorrente,
    id_empresa: null,
    id_historico: null,
    id_hist_contabil: null,
    id_planoconta: null,
    nrdocumento: '',
    observacao: '',
    valor: 0,
    dtlancamento: new Date().toISOString().split('T')[0],
    origem: 'BAN',
    tipo: '+'
  })
  editando.value = false
  if (formRef.value) {
    formRef.value.resetValidation()
  }
}

const aplicarFiltros = () => {
  carregarMovimentacoes()
}

const editarMovimentacao = async (item) => {
  try {
    loading.value = true
    const idEmpresa = empresaStore.empresa?.id || empresaStore.empresaSelecionada?.id

    if (!idEmpresa) {
      console.error('ID da empresa não encontrado')
      return
    }

    console.log('Buscando movimentação completa:', item.id, item.id_ccorrente)

    // Buscar dados completos da movimentação da API
    const response = await financeiroStore.buscarMovimentacaoContaCorrente(idEmpresa, item.id_ccorrente, item.id)

    console.log('Resposta completa da API:', response)

    // A API retorna { data: [...], contabil: [...], ccusto: [...] }
    const dados = Array.isArray(response?.data) ? response.data[0] : response?.data || item
    const contabil = response?.contabil || []
    const ccusto = response?.ccusto || []

    console.log('Dados da movimentação:', dados)
    console.log('Dados contábeis:', contabil)
    console.log('Rateio de centro de custo:', ccusto)

    // Buscar id_planoconta e id_hist_contabil do array contabil
    const contabilPrincipal = contabil.find(c => c.id_planoconta) || {}
    const contabilHistorico = contabil.find(c => c.id_historico_ctb) || {}

    Object.assign(formData, {
      id: dados.id,
      id_ccorrente: dados.id_ccorrente,
      id_empresa: dados.id_empresa,
      id_historico: dados.id_historico,
      id_hist_contabil: contabilHistorico.id_historico_ctb || null,
      id_planoconta: contabilPrincipal.id_planoconta || null,
      nrdocumento: dados.nrdocumento || '',
      observacao: dados.observacao || '',
      valor: dados.valor,
      dtlancamento: dados.dtlancamento,
      origem: dados.origem,
      tipo: dados.tipo
    })

    console.log('Dados carregados no formulário:', formData)

    editando.value = true
    formularioAberto.value = true

    // Se for saída, verificar e carregar rateio de centro de custo
    if (dados.tipo === '-') {
      await verificarUtilizaCCusto()

      // Se houver rateio no lançamento, carregar
      if (Array.isArray(ccusto) && ccusto.length > 0) {
        console.log('Carregando rateio existente:', ccusto)

        // Calcular porcentagem baseado no valor total
        const valorTotal = parseFloat(dados.valor || 0)

        ccustosRateio.value = ccusto.map(c => ({
          id_ccusto: c.id_ccusto,
          desccentrocusto: c.desccentrocusto || '',
          valor: parseFloat(c.valor || 0),
          porcentagem: valorTotal > 0 ? ((parseFloat(c.valor || 0) / valorTotal) * 100).toFixed(2) : 0
        }))

        console.log('Rateio carregado:', ccustosRateio.value)
      }
    }
  } catch (error) {
    console.error('Erro ao carregar movimentação para edição:', error)
  } finally {
    loading.value = false
  }
}

const excluirMovimentacao = async (item) => {
  if (!confirm(`Deseja realmente excluir esta movimentação?\n\nDocumento: ${item.nrdocumento || 'Sem número'}\nValor: ${formatarMoeda(item.valor)}`)) {
    return
  }

  loading.value = true
  try {
    const idEmpresa = empresaStore.empresa?.id || empresaStore.empresaSelecionada?.id

    if (!idEmpresa) {
      console.error('ID da empresa não encontrado')
      return
    }

    await financeiroStore.deletarMovimentacaoContaCorrente(
        idEmpresa,
        item.id_ccorrente,
        item.id
    )

    await carregarMovimentacoes()
  } catch (error) {
    console.error('Erro ao excluir movimentação:', error)
  } finally {
    loading.value = false
  }
}

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
    if (index === count - 1) {
      r.valor = (total - valorAcumulado).toFixed(2)
    } else {
      r.valor = valorPorCentro.toFixed(2)
      valorAcumulado += parseFloat(r.valor)
    }
    r.porcentagem = ((parseFloat(r.valor) / total) * 100).toFixed(2)
  })
}

// Carregar dados
const carregarContas = async () => {
  loadingContas.value = true
  try {
    const dados = await financeiroStore.buscarContasUsuarioAtivo()
    contasDisponiveis.value = Array.isArray(dados) ? dados : []
  } catch (error) {
    console.error('Erro ao carregar contas:', error)
  } finally {
    loadingContas.value = false
  }
}

const carregarHistoricos = async () => {
  loadingHistoricos.value = true
  try {
    const dados = await financeiroStore.buscarHistoricosBancarios()
    historicos.value = Array.isArray(dados) ? dados : []
  } catch (error) {
    console.error('Erro ao carregar históricos:', error)
  } finally {
    loadingHistoricos.value = false
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

const carregarCentrosCusto = async () => {
  loadingCentros.value = true
  try {
    await ccustoStore.listarCCusto()
    centrosCusto.value = ccustoStore.centrosCusto || []
    console.log('✅ Centros de custo carregados:', centrosCusto.value.length)
  } catch (error) {
    console.error('Erro ao carregar centros de custo:', error)
    centrosCusto.value = []
  } finally {
    loadingCentros.value = false
  }
}

const carregarMovimentacoes = async () => {
  loading.value = true
  try {
    const idEmpresa = empresaStore.empresa?.id || empresaStore.empresaSelecionada?.id

    if (!idEmpresa) {
      console.warn('ID da empresa não encontrado')
      return
    }

    if (!filtros.id_ccorrente || !filtros.dataInicio || !filtros.dataFim) {
      console.warn('Filtros incompletos:', filtros)
      movimentacoes.value = []
      saldoAnterior.value = 0
      return
    }

    const resultado = await financeiroStore.buscarMovimentacoesContaCorrente(
        idEmpresa,
        filtros.id_ccorrente,
        filtros.dataInicio,
        filtros.dataFim
    )

    // API retorna saldoant_conciliado e saldoant_naoconciliado
    saldoAnterior.value = resultado.saldoant_conciliado || 0
    movimentacoes.value = Array.isArray(resultado.data) ? resultado.data : []
  } catch (error) {
    console.error('Erro ao carregar movimentações:', error)
    movimentacoes.value = []
    saldoAnterior.value = 0
  } finally {
    loading.value = false
  }
}

const salvarMovimentacao = async () => {
  if (!formValido.value) {
    return
  }

  loading.value = true
  try {
    const idEmpresa = empresaStore.empresa?.id || empresaStore.empresaSelecionada?.id

    if (!idEmpresa) {
      return
    }

    const payload = {
      data: [{
        id_ccorrente: formData.id_ccorrente,
        id_empresa: idEmpresa,
        id_historico: formData.id_historico,
        id_hist_contabil: formData.id_hist_contabil || null,
        id_planoconta: formData.id_planoconta,
        nrdocumento: formData.nrdocumento || null,
        observacao: formData.observacao || null,
        valor: parseFloat(formData.valor),
        dtlancamento: formData.dtlancamento,
        origem: 'BAN',
        tipo: formData.tipo
      }],
      ccusto: ccustosRateio.value.map(c => ({
        id_ccusto: c.id_ccusto,
        valor: parseFloat(c.valor) || 0,
        perc_ccusto: parseFloat(c.porcentagem) || 0
      }))
    }

    if (editando.value && formData.id) {
      await financeiroStore.atualizarMovimentacaoContaCorrente(
          idEmpresa,
          formData.id_ccorrente,
          formData.id,
          payload
      )
    } else {
      await financeiroStore.criarMovimentacaoContaCorrente(
          idEmpresa,
          formData.id_ccorrente,
          payload
      )
    }

    cancelarFormulario()
    await carregarMovimentacoes()
  } catch (error) {
    console.error('Erro ao salvar movimentação:', error)
  } finally {
    loading.value = false
  }
}

// ========== FUNÇÕES DE EXPORTAÇÃO ==========


// Processar template com Handlebars simples
const processarTemplate = (template, dados) => {
  let html = template

  // Substituir variáveis simples {{variavel}}
  html = html.replace(/{{([^}#/]+)}}/g, (match, variable) => {
    const trimmed = variable.trim()
    return dados[trimmed] !== undefined ? dados[trimmed] : match
  })

  // Processar {{#if variavel}}...{{/if}}
  html = html.replace(/{{#if\s+(\w+)}}([\s\S]*?){{\/if}}/g, (match, variable, content) => {
    return dados[variable.trim()] ? content : ''
  })

  // Processar loop {{#each array}}...{{/each}}
  const eachRegex = /{{#each\s+(\w+)}}([\s\S]*?){{\/each}}/g
  html = html.replace(eachRegex, (match, arrayName, content) => {
    const array = dados[arrayName.trim()] || []
    return array.map(item => {
      let itemHtml = content
      // Substituir {{this.propriedade}}
      itemHtml = itemHtml.replace(/{{this\.(\w+)}}/g, (m, prop) => {
        return item[prop] !== undefined ? item[prop] : ''
      })
      // Processar if dentro do each
      itemHtml = itemHtml.replace(/{{#if\s+this\.(\w+)}}([\s\S]*?){{\/if}}/g, (m, prop, trueHtml) => {
        return item[prop] ? trueHtml : ''
      })
      return itemHtml
    }).join('')
  })

  return html
}

// Preparar dados para o relatório
const prepararDadosRelatorio = () => {
  const contaSelecionada = contasDisponiveis.value.find(c => c.id === filtros.id_ccorrente)
  const empresa = empresaStore.empresa || empresaStore.empresaSelecionada

  // Pegar dados da primeira movimentação (informações da conta vêm na API)
  const primeiraMovimentacao = movimentacoesFiltradas.value[0] || {}

  // Calcular saldo acumulado para cada movimentação
  let saldoAcumulado = saldoAnterior.value
  const movimentacoesComSaldo = movimentacoesFiltradas.value.map(item => {
    if (item.tipo === '+') {
      saldoAcumulado += parseFloat(item.valor || 0)
    } else {
      saldoAcumulado -= parseFloat(item.valor || 0)
    }
    return {
      ...item,
      saldoCalculado: saldoAcumulado,
      valorNegativo: item.tipo === '-'
    }
  })

  // Calcular totais
  const totalEntradas = movimentacoesFiltradas.value
      .filter(m => m.tipo === '+')
      .reduce((acc, m) => acc + parseFloat(m.valor || 0), 0)

  const totalSaidas = movimentacoesFiltradas.value
      .filter(m => m.tipo === '-')
      .reduce((acc, m) => acc + parseFloat(m.valor || 0), 0)

  const saldoAtual = saldoAnterior.value + totalEntradas - totalSaidas

  // Usar dados da API: titular, numero_ccorrente, limite, dtvenctolimite, nome (operador)
  return {
    logoUrl: logoImg,
    associado: primeiraMovimentacao.titular || contaSelecionada?.titular || 'N/A',
    empresa: empresa?.razao || empresa?.fantasia || 'Empresa',
    conta: primeiraMovimentacao.numero_ccorrente
        ? `${primeiraMovimentacao.numero_ccorrente}`
        : (contaSelecionada ? `${contaSelecionada.numero_ccorrente}-${contaSelecionada.digito_cc}` : 'N/A'),
    operador: primeiraMovimentacao.nome || 'N/A',
    agencia: primeiraMovimentacao.id_agencia || 'N/A',
    dataInicio: formatarData(filtros.dataInicio),
    dataFim: formatarData(filtros.dataFim),
    saldoAnterior: formatarMoeda(saldoAnterior.value),
    saldoAtual: formatarMoeda(saldoAtual),
    totalEntradas: formatarMoeda(totalEntradas),
    totalSaidas: formatarMoeda(totalSaidas),
    totalMovimentacoes: movimentacoesFiltradas.value.length,
    saldoBloqueado: formatarMoeda(0),
    lancamentosConferir: formatarMoeda(0),
    saldoInvestimentos: formatarMoeda(0),
    limiteChequeEspecial: formatarMoeda(primeiraMovimentacao.limite || contaSelecionada?.limite || 0),
    limiteDisponivelCheque: formatarMoeda(primeiraMovimentacao.limite || contaSelecionada?.limite || 0),
    vencimentoChequeEspecial: formatarData(primeiraMovimentacao.dtvenctolimite || contaSelecionada?.dtvenctolimite),
    dataImpressao: new Date().toLocaleString('pt-BR'),
    movimentacoes: movimentacoesComSaldo.map(item => ({
      data: formatarData(item.dtlancamento),
      descricao: item.deschistorico || '--',
      documento: item.nrdocumento || '--',
      tipo: item.desctipo || (item.tipo === '+' ? 'Entrada' : 'Saída'),
      valor: `${item.tipo === '-' ? '-' : '+'} ${formatarMoeda(item.valor)}`,
      saldo: formatarMoeda(item.saldoCalculado),
      valorNegativo: item.tipo === '-',
      observacao: item.observacao || '',
      conciliado: item.dtconciliacao ? 'Sim' : 'Não'
    })),
    lancamentosFuturos: [] // Para implementação futura
  }
}

// Gerar HTML do relatório
const gerarHtmlRelatorio = () => {
  const dados = prepararDadosRelatorio()
  return processarTemplate(templateMovimentacoes.value, dados)
}

// Imprimir relatório
const imprimirRelatorio = () => {
  const html = gerarHtmlRelatorio()
  const janela = window.open('', '_blank')
  janela.document.write(html)
  janela.document.close()
  janela.focus()
  setTimeout(() => {
    janela.print()
  }, 500)
}

// Exportar PDF
const exportarPDF = () => {
  try {
    const html = gerarHtmlRelatorio()

    // Criar elemento temporário com o HTML
    const element = document.createElement('div')
    element.innerHTML = html

    // Configurações do PDF
    const opt = {
      margin: 10,
      filename: `extrato-bancario-${filtros.dataInicio}-${filtros.dataFim}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    }

    // Gerar PDF
    html2pdf().set(opt).from(element).save()
  } catch (error) {
    console.error('Erro ao gerar PDF:', error)
    alert('Erro ao gerar PDF. Tente novamente.')
  }
}

// Exportar CSV
const exportarCSV = () => {
  const dados = prepararDadosRelatorio()

  // Cabeçalho
  const cabecalho = ['Data', 'Tipo', 'Descrição', 'Documento', 'Valor', 'Saldo']

  // Linhas de dados
  const linhas = dados.movimentacoes.map(item => [
    item.data,
    item.tipo,
    item.descricao,
    item.documento,
    item.valor,
    item.saldo
  ])

  // Adicionar linha de saldo anterior no início
  linhas.unshift(['', '', 'SALDO ANTERIOR', '', '', dados.saldoAnterior])

  // Adicionar resumo no final
  linhas.push([])
  linhas.push(['', '', 'RESUMO', '', '', ''])
  linhas.push(['', '', 'Saldo Anterior', '', '', dados.saldoAnterior])
  linhas.push(['', '', 'Total de Entradas', '', '', dados.totalEntradas])
  linhas.push(['', '', 'Total de Saídas', '', '', dados.totalSaidas])
  linhas.push(['', '', 'Saldo Atual', '', '', dados.saldoAtual])

  // Converter para CSV
  const csv = [
    cabecalho.join(';'),
    ...linhas.map(linha => linha.join(';'))
  ].join('\n')

  // Criar e baixar arquivo
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `extrato-bancario-${filtros.dataInicio}-${filtros.dataFim}.csv`
  link.click()
}

// Exportar Excel
const exportarExcel = () => {
  const dados = prepararDadosRelatorio()

  const htmlExcel = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
    <head><meta charset="utf-8"></head>
    <body>
      <h2>Extrato Bancário - ${dados.associado}</h2>
      <p>Período: ${dados.dataInicio} a ${dados.dataFim}</p>
      <p>Conta: ${dados.conta} | Operador: ${dados.operador}</p>
      <table border="1">
        <tr><th>Data</th><th>Tipo</th><th>Descrição</th><th>Documento</th><th>Valor</th><th>Saldo</th></tr>
        <tr><td></td><td></td><td>SALDO ANTERIOR</td><td></td><td></td><td>${dados.saldoAnterior}</td></tr>
        ${dados.movimentacoes.map(item => `
          <tr>
            <td>${item.data}</td>
            <td>${item.tipo}</td>
            <td>${item.descricao}</td>
            <td>${item.documento}</td>
            <td>${item.valor}</td>
            <td>${item.saldo}</td>
          </tr>
        `).join('')}
        <tr><td colspan="6"></td></tr>
        <tr><td colspan="4"><strong>RESUMO</strong></td><td colspan="2"></td></tr>
        <tr><td colspan="4">Saldo Anterior</td><td colspan="2">${dados.saldoAnterior}</td></tr>
        <tr><td colspan="4">Total de Entradas</td><td colspan="2">${dados.totalEntradas}</td></tr>
        <tr><td colspan="4">Total de Saídas</td><td colspan="2">${dados.totalSaidas}</td></tr>
        <tr><td colspan="4"><strong>Saldo Atual</strong></td><td colspan="2"><strong>${dados.saldoAtual}</strong></td></tr>
      </table>
    </body>
    </html>
  `

  const blob = new Blob([htmlExcel], { type: 'application/vnd.ms-excel' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `extrato-bancario-${filtros.dataInicio}-${filtros.dataFim}.xls`
  link.click()
}

// Lifecycle
onMounted(async () => {
  console.log('🚀 Iniciando carregamento de dados...')

  // Carregar template HTML
  try {
    const response = await fetch(new URL('@/components/impressos/movimentacoes.html', import.meta.url))
    templateMovimentacoes.value = await response.text()
  } catch (error) {
    console.error('Erro ao carregar template:', error)
  }

  await Promise.all([
    carregarContas(),
    carregarHistoricos(),
    carregarPlanosConta(),
    carregarHistoricosContabil(),
    carregarCentrosCusto()
  ])

  if (contasDisponiveis.value.length > 0 && !filtros.id_ccorrente) {
    filtros.id_ccorrente = contasDisponiveis.value[0].id
  }

  console.log('✅ Carregamento inicial completo')
})
</script>

<style scoped>
/* Estilos específicos se necessário */
</style>
