<template>
  <top-all-pages icon="mdi-cash-multiple">
    <template #titulo>Lançamentos do Caixa</template>
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
                              class="required-left-border"
                              prepend-inner-icon="mdi-cash-register"
                              no-data-text="Nenhum caixa disponível"
                              @update:model-value="onCaixaChange"
                          ></v-autocomplete>
                        </v-col>

                        <!-- Data de Abertura do Caixa -->
                        <v-col cols="12" md="4">
                          <v-text-field
                              v-model="formData.dtlancamento"
                              label="Data de Abertura do Caixa *"
                              type="date"
                              :rules="[rules.required]"
                              variant="outlined"
                              density="compact"
                              class="required-left-border"
                              prepend-inner-icon="mdi-calendar"
                              readonly
                              disabled
                          >
                            <template v-slot:append-inner>
                              <v-tooltip location="top">
                                <template v-slot:activator="{ props }">
                                  <v-icon v-bind="props" size="20" color="grey">mdi-information-outline</v-icon>
                                </template>
                                Data de abertura do caixa selecionado (não editável)
                              </v-tooltip>
                            </template>
                          </v-text-field>
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
                              class="required-left-border"
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
                              class="required-left-border"
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
                              class="required-left-border"
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
                              class="required-left-border"
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
                              class="required-left-border"
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
                              class="required-left-border"
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

            <!-- Filtros de Busca Avançada -->
            <v-card class="mb-1 background-card" elevation="0">
              <v-card-title class="text-h6">
                <v-icon icon="mdi-filter" class="mr-2"></v-icon>
                Filtros de Período e Caixa
              </v-card-title>
              <v-card-text class="pa-4">
                <v-row>
                  <!-- Selecione o Caixa -->
                  <v-col cols="12" md="4">
                    <v-autocomplete
                        v-model="filtros.id_caixa"
                        :items="caixasDisponiveis"
                        :loading="loadingCaixas"
                        item-title="desccaixa"
                        item-value="id_caixa"
                        label="Selecione o Caixa *"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-cash-register"
                        clearable
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

                  <!-- Atalho de Período -->
                  <v-col cols="12" md="2">
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

                  <!-- Período de Cadastro - De -->
                  <v-col cols="12" md="2">
                    <v-text-field
                        v-model="filtros.dataInicio"
                        label="Data Inicial *"
                        type="date"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-calendar"
                    ></v-text-field>
                  </v-col>

                  <!-- Período de Cadastro - Até -->
                  <v-col cols="12" md="2">
                    <v-text-field
                        v-model="filtros.dataFim"
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
                        variant="flat"
                        prepend-icon="mdi-magnify"
                        @click="carregarLancamentos"
                        :loading="loading"
                        :disabled="!filtros.id_caixa || !filtros.dataInicio || !filtros.dataFim"
                        class="text-white"
                    >
                      Buscar
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- Tabela de Lançamentos -->
            <v-card class="background-card border" elevation="0">
              <v-card-text class="pa-0">
                <!-- Saldo Anterior -->
                <v-card class="ma-4 mb-2 background-card" elevation="0">
                  <v-card-text class="d-flex justify-space-between align-center pa-3">
                    <span class="text-subtitle-1 font-weight-bold">Saldo Anterior</span>
                    <span class="text-h6 font-weight-bold" :class="saldoAnterior >= 0 ? 'text-success' : 'text-error'">
                  {{ formatarMoeda(Math.abs(saldoAnterior)) }}
                </span>
                  </v-card-text>
                </v-card>

                <v-data-table
                    :headers="headers"
                    :items="lancamentosFiltrados"
                    :loading="loading"
                    item-key="id"
                    class="elevation-1 background-secondary"
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
                  {{ formatarMoeda(Math.abs(calcularSaldo(lancamentosFiltrados.indexOf(item)))) }}
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

                  <!-- Coluna Ações -->
                  <template v-slot:[`item.actions`]="{ item }">
                    <div class="d-flex justify-center gap-1">
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
                      <v-icon icon="mdi-cash-multiple" size="64" color="grey" class="mb-4"></v-icon>
                      <p class="text-h6 text-grey">Nenhum lançamento encontrado</p>
                    </div>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>

            <!-- Card de Totais -->
            <v-card class="mt-1 background-card" elevation="0">
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
                      {{ formatarMoeda(Math.abs(saldoFinal)) }}
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
      </div>
      <v-card elevation="0" class="background-secondary mt-2 py-3 px-3 d-flex gap-4">
        <v-btn variant="outlined" color="var(--text-color-laranja)" prepend-icon="mdi-file-pdf-box" @click="exportarPDF">PDF</v-btn>
        <v-btn variant="outlined" color="var(--text-color-laranja)" prepend-icon="mdi-file-delimited" @click="exportarCSV">CSV</v-btn>
        <v-btn variant="outlined" color="var(--text-color-laranja)" prepend-icon="mdi-microsoft-excel" @click="exportarExcel">EXCEL</v-btn>
        <v-btn variant="outlined" color="var(--text-color-laranja)" prepend-icon="mdi-printer" @click="imprimirRelatorio">IMPRIMIR</v-btn>
      </v-card>

      <!-- Modal de Exportação -->
      <ExportacaoModal
          v-model="modalExportacaoAberto"
          :dados="lancamentosFiltrados"
          :filtros="{}"
          nome-relatorio="Lançamentos do Caixa"
          @exportar-pdf="() => {}"
          @exportar-csv="() => {}"
          @exportar-excel="() => {}"
          @imprimir="() => {}"
      />

      <!-- Modal de Preview do PDF -->
      <PdfPreviewModal
          v-model="modalPreviewPDF"
          :html-content="previewHTMLContent"
          :nome-relatorio="dadosPDFAtual?.nomeRelatorio || 'Lancamentos_Caixa'"
      />

      <!-- Modal de Exclusão -->
      <ExcluirModal
          :cancelar="cancelarModalExcluir"
          :deletar="excluirLancamento"
          :loading="loading"
          v-model:modal-excluir="excluirModal"
      >
        <template #item>{{ itemSelecionado?.nrdocumento || 'Lançamento' }}</template>
      </ExcluirModal>

      <!-- Modal de Acesso Negado -->
      <AcessoNegadoModal
          v-model="acessoNegadoModal"
          :nome-programa="'Rotina Encerramento de Caixa'"
          :tipo-acesso="tipoAcessoNegado"
      />
    </template>
  </top-all-pages>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useThemeStore } from '@/stores/config-temas/theme'
import { useCaixaStore } from '@/stores/APIs/caixa'
import { useEmpresaStore } from '@/stores/APIs/empresa'
import { useFinanceiroStore } from '@/stores/APIs/financeiro'
import { useConfigParfinStore } from '@/stores/APIs/config'
import { useCCustoStore } from '@/stores/APIs/ccusto'
import { usePermissoes } from '@/utils/usePermissoes'
import BotaoExpandTransition from '@/components/base/padrao-paginas/BotaoExpandTransition.vue'
import html2pdf from 'html2pdf.js'

const escapeHtml = (text) => {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }
  return String(text).replace(/[&<>"']/g, c => map[c])
}

import TopAllPages from "@/components/base/padrao-paginas/TopAllPages.vue";
import ExportacaoModal from '@/components/base/modais/ExportacaoModal.vue'
import PdfPreviewModal from '@/components/base/modais/PdfPreviewModal.vue'
// eslint-disable-next-line no-unused-vars
import AcessoNegadoModal from '@/components/base/modais/AcessoNegadoModal.vue'
import ExcluirModal from "@/components/base/modais/ExcluirModal.vue";

// ID do programa desta tela (Rotina Encerramento de Caixa)
const ID_PROGRAMA = 'FFIN204E'

const themeStore = useThemeStore()
const caixaStore = useCaixaStore()
const empresaStore = useEmpresaStore()
const financeiroStore = useFinanceiroStore()
const configStore = useConfigParfinStore()
const ccustoStore = useCCustoStore()
const { podeVisualizar, podeIncluir, podeExcluir, podeExportar, podePDF } = usePermissoes()

// Modal de acesso negado
const acessoNegadoModal = ref(false)
const tipoAcessoNegado = ref('')

const excluirModal = ref(false)
const itemSelecionado = ref(null)

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

// Template HTML
const templateLancamentosCaixa = ref('')

// Dados
const caixasDisponiveis = ref([])
const tiposDocumento = ref([])
const historicosCaixa = ref([])
const historicosContabil = ref([])
const lancamentos = ref([])

// Modais de exportação
const modalExportacaoAberto = ref(false)
const modalPreviewPDF = ref(false)
const previewHTMLContent = ref('')
const dadosPDFAtual = ref(null)
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
  { title: 'Observação', key: 'observacao', sortable: false, width: '200px' },
  { title: 'Ações', key: 'actions', sortable: false, align: 'center', width: '100px' }
]

// Filtros
const periodoSelecionado = ref('mes')
const filtros = reactive({
  id_caixa: null,
  dataInicio: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0], // Primeiro dia do mês
  dataFim: new Date().toISOString().split('T')[0] // Hoje
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
    const d = typeof data === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(data)
      ? new Date(data + 'T00:00:00')
      : new Date(data)
    return d.toLocaleDateString('pt-BR')
  } catch {
    return '--'
  }
}

const obterLabelOrigem = (origem) => {
  const origens = {
    'CAI': 'CAIXA',
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

  filtros.dataInicio = dataInicio.toISOString().split('T')[0]
  filtros.dataFim = dataFim.toISOString().split('T')[0]
}

// Métodos de ação
const toggleFormulario = () => {
  // Verificar permissão para incluir
  if (!formularioAberto.value && !podeIncluir(ID_PROGRAMA)) {
    tipoAcessoNegado.value = 'incluir'
    acessoNegadoModal.value = true
    return
  }

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

// Atualizar data quando caixa for selecionado
const onCaixaChange = (idCaixa) => {
  console.log('Caixa selecionado:', idCaixa)

  if (!idCaixa) {
    formData.dtlancamento = new Date().toISOString().split('T')[0]
    return
  }

  const caixaSelecionado = caixasDisponiveis.value.find(c => c.id_caixa === idCaixa)
  console.log('Dados do caixa:', caixaSelecionado)

  if (caixaSelecionado && caixaSelecionado.dt_abertura) {
    formData.dtlancamento = caixaSelecionado.dt_abertura
    console.log('Data de abertura atribuída:', formData.dtlancamento)
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
      caixasDisponiveis.value = dados.map(c => ({
        ...c,
        id_caixa: c.id ?? c.id_caixa,
      }))
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
    mostrarMensagem('Preencha todos os campos obrigatórios', 'warning')
    return
  }

  loading.value = true
  try {
    const idEmpresa = empresaStore.empresa?.id || empresaStore.empresaSelecionada?.id

    if (!idEmpresa) {
      mostrarMensagem('ID da empresa não encontrado', 'error')
      loading.value = false
      return
    }

    if (!formData.id_caixa) {
      mostrarMensagem('Selecione um caixa', 'warning')
      loading.value = false
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
      tipo: formData.tipo,
      dtlancamento: formData.dtlancamento,
      valor: parseFloat(formData.valor),
      origem: formData.origem,
      observacao: formData.observacao || null,
      id_tipopagrec: formData.id_tipopagrec,
      id_tipodocumento: formData.id_tipodocumento,
      id_caixahist: formData.id_caixahist,
      id_hist_contabil: formData.id_hist_contabil || null,
      id_planoconta: formData.id_planoconta,
      nrdocumento: formData.nrdocumento || null,
      ccusto: ccustoArray
    }

    console.log('Payload a ser enviado:', payload)
    console.log('Editando?', editando.value, 'ID:', formData.id)

    if (editando.value && formData.id) {
      console.log('Atualizando lançamento:', idEmpresa, formData.id_caixa, formData.id)
      await caixaStore.atualizarLancamentoCaixa(idEmpresa, formData.id_caixa, formData.id, payload)
      mostrarMensagem('Lançamento atualizado com sucesso!', 'success')
    } else {
      console.log('Criando novo lançamento:', idEmpresa, formData.id_caixa)
      await caixaStore.criarLancamentoCaixa(idEmpresa, formData.id_caixa, payload)
      mostrarMensagem('Lançamento cadastrado com sucesso!', 'success')
    }

    cancelarFormulario()
    await carregarLancamentos()
  } catch (error) {
    console.error('Erro ao salvar lançamento:', error)
    mostrarMensagem(error?.response?.data?.message || 'Erro ao salvar lançamento', 'error')
  } finally {
    loading.value = false
  }
}

const mostrarMensagem = (mensagem, tipo) => {
  console.log(`[${tipo}] ${mensagem}`)
  // Aqui você pode adicionar um toast/snackbar se quiser
}

// Editar lançamento
// Confirmar exclusão
const confirmarExclusao = (item) => {
  if (!podeExcluir(ID_PROGRAMA)) {
    tipoAcessoNegado.value = 'excluir'
    acessoNegadoModal.value = true
    return
  }

  itemSelecionado.value = item
  excluirModal.value = true
}

const cancelarModalExcluir = () => {
  excluirModal.value = false
  itemSelecionado.value = null
}

const excluirLancamento = async () => {
  const item = itemSelecionado.value
  if (!item) return

  loading.value = true
  try {
    const idParaExcluir = item.id

    if (!idParaExcluir) {
      mostrarMensagem('ID do lançamento não encontrado', 'error')
      loading.value = false
      return
    }

    await caixaStore.deletarLancamentoCaixaPorId(idParaExcluir)

    mostrarMensagem('Lançamento cancelado com sucesso!', 'success')
    excluirModal.value = false
    itemSelecionado.value = null
    cancelarFormulario()
    await carregarLancamentos()
  } catch (error) {
    console.error('Erro ao cancelar lançamento:', error)
    mostrarMensagem(error?.response?.data?.message || 'Erro ao cancelar lançamento', 'error')
  } finally {
    loading.value = false
  }
}

// ========== FUNÇÕES DE IMPRESSÃO E EXPORTAÇÃO ==========

// Preparar dados para impressão/exportação
const prepararDadosRelatorio = () => {
  const caixaSelecionado = caixasDisponiveis.value.find(c => c.id_caixa === filtros.id_caixa)
  const empresa = empresaStore.empresa || empresaStore.empresaSelecionada

  // Calcular saldo acumulado para cada lançamento
  let saldoAcumulado = saldoAnterior.value
  const lancamentosComSaldo = lancamentosFiltrados.value.map(item => {
    if (item.tipo === '+') {
      saldoAcumulado += parseFloat(item.valor || 0)
    } else {
      saldoAcumulado -= parseFloat(item.valor || 0)
    }
    return {
      ...item,
      saldoCalculado: saldoAcumulado,
      isEntrada: item.tipo === '+'
    }
  })

  return {
    nomeCaixa: escapeHtml(caixaSelecionado?.desccaixa || 'Caixa'),
    operador: escapeHtml(lancamentosFiltrados.value[0]?.nome || 'N/A'),
    empresa: escapeHtml(empresa?.razao || empresa?.fantasia || 'Empresa'),
    dataInicio: formatarData(filtros.dataInicio),
    dataFim: formatarData(filtros.dataFim),
    saldoAnterior: formatarMoeda(saldoAnterior.value),
    totalEntradas: formatarMoeda(totalEntradas.value),
    totalSaidas: formatarMoeda(totalSaidas.value),
    saldoAtual: formatarMoeda(saldoFinal.value),
    totalLancamentos: lancamentosFiltrados.value.length,
    dataImpressao: new Date().toLocaleString('pt-BR'),
    logoUrl: new URL('/src/assets/img/logo/logo-2.png', import.meta.url).href,
    lancamentos: lancamentosComSaldo.map(item => ({
      ...item,
      deschistorico: escapeHtml(item.deschistorico || ''),
      desctipo: escapeHtml(item.desctipo || ''),
      desctipopagrec: escapeHtml(item.desctipopagrec || ''),
      nrdocumento: escapeHtml(item.nrdocumento || ''),
      nome: escapeHtml(item.nome || ''),
      dtlancamento: formatarData(item.dtlancamento),
      valor: formatarMoeda(item.valor),
      saldo: formatarMoeda(item.saldoCalculado)
    }))
  }
}

// Processar template com Handlebars simples
const processarTemplate = (template, dados) => {
  let html = template

  // Substituir variáveis simples {{variavel}}
  html = html.replace(/{{([^}]+)}}/g, (match, variable) => {
    return dados[variable.trim()] || match
  })

  // Processar loop {{#each lancamentos}}...{{/each}}
  const eachRegex = /{{#each\s+(\w+)}}([\s\S]*?){{\/each}}/g
  html = html.replace(eachRegex, (match, arrayName, content) => {
    const array = dados[arrayName.trim()] || []
    return array.map(item => {
      let itemHtml = content
      // Substituir {{this.propriedade}} por {{propriedade}} para processamento
      itemHtml = itemHtml.replace(/{{this\.(\w+)}}/g, (m, prop) => {
        return item[prop] !== undefined ? item[prop] : m
      })
      // Processar if {{#if condicao}}...{{else}}...{{/if}}
      itemHtml = itemHtml.replace(/{{#if\s+this\.(\w+)}}([\s\S]*?){{else}}([\s\S]*?){{\/if}}/g, (m, prop, trueHtml, falseHtml) => {
        return item[prop] ? trueHtml : falseHtml
      })
      // Processar if sem else {{#if condicao}}...{{/if}}
      itemHtml = itemHtml.replace(/{{#if\s+this\.(\w+)}}([\s\S]*?){{\/if}}/g, (m, prop, trueHtml) => {
        return item[prop] ? trueHtml : ''
      })
      return itemHtml
    }).join('')
  })

  return html
}

// Gerar HTML do relatório
const gerarHtmlRelatorio = () => {
  const dados = prepararDadosRelatorio()

  // Processar template
  return processarTemplate(templateLancamentosCaixa.value, dados)
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

    // Configurações do pdf
    const opt = {
      margin: 10,
      filename: `lancamentos-caixa-${filtros.dataInicio}-${filtros.dataFim}.pdf`,
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
  const cabecalho = ['Data', 'Tipo', 'Histórico', 'Forma Pgto', 'Nº Documento', 'Valor', 'Saldo']

  // Linhas de dados
  const linhas = dados.lancamentos.map(item => [
    item.dtlancamento,
    item.desctipo,
    item.deschistorico || '',
    item.desctipopagrec || '',
    item.nrdocumento || '',
    item.valor,
    item.saldo
  ])

  // Adicionar linha de saldo anterior no início
  linhas.unshift(['', '', 'SALDO ANTERIOR', '', '', '', dados.saldoAnterior])

  // Adicionar resumo no final
  linhas.push([])
  linhas.push(['', '', 'RESUMO', '', '', '', ''])
  linhas.push(['', '', 'Saldo Anterior', '', '', '', dados.saldoAnterior])
  linhas.push(['', '', 'Total de Entradas', '', '', '', dados.totalEntradas])
  linhas.push(['', '', 'Total de Saídas', '', '', '', dados.totalSaidas])
  linhas.push(['', '', 'Saldo Atual', '', '', '', dados.saldoAtual])

  // Converter para CSV
  const csv = [
    cabecalho.join(';'),
    ...linhas.map(linha => linha.join(';'))
  ].join('\n')

  // Download
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `lancamentos-caixa-${filtros.dataInicio}-${filtros.dataFim}.csv`
  link.click()
  URL.revokeObjectURL(link.href)
}

// Exportar Excel (usa CSV com separador de ponto-e-vírgula que Excel reconhece)
const exportarExcel = () => {
  const dados = prepararDadosRelatorio()

  // HTML com tabela que Excel pode abrir
  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
    <head><meta charset="UTF-8"></head>
    <body>
      <table border="1">
        <tr><td colspan="7" style="font-size:16px;font-weight:bold;">Lançamentos de Caixa - ${dados.nomeCaixa}</td></tr>
        <tr><td colspan="7">Período: ${dados.dataInicio} a ${dados.dataFim}</td></tr>
        <tr><td colspan="7">Empresa: ${dados.empresa}</td></tr>
        <tr><td colspan="7"></td></tr>
        <tr style="background:#F57C00;color:white;font-weight:bold;">
          <td>Data</td>
          <td>Tipo</td>
          <td>Histórico</td>
          <td>Forma Pgto</td>
          <td>Nº Documento</td>
          <td>Valor</td>
          <td>Saldo</td>
        </tr>
        <tr style="background:#fff3e0;font-style:italic;">
          <td></td>
          <td></td>
          <td>SALDO ANTERIOR</td>
          <td></td>
          <td></td>
          <td></td>
          <td>${dados.saldoAnterior}</td>
        </tr>
        ${dados.lancamentos.map(item => `
          <tr>
            <td>${item.dtlancamento}</td>
            <td style="color:${item.isEntrada ? 'green' : 'red'}">${item.desctipo}</td>
            <td>${item.deschistorico || ''}</td>
            <td>${item.desctipopagrec || ''}</td>
            <td>${item.nrdocumento || ''}</td>
            <td style="color:${item.isEntrada ? 'green' : 'red'}">${item.isEntrada ? '+' : '-'} ${item.valor}</td>
            <td>${item.saldo}</td>
          </tr>
        `).join('')}
        <tr><td colspan="7"></td></tr>
        <tr style="background:#fafafa;"><td colspan="6">Saldo Anterior</td><td>${dados.saldoAnterior}</td></tr>
        <tr style="background:#e8f5e9;"><td colspan="6" style="color:green">Total de Entradas</td><td style="color:green">${dados.totalEntradas}</td></tr>
        <tr style="background:#ffebee;"><td colspan="6" style="color:red">Total de Saídas</td><td style="color:red">${dados.totalSaidas}</td></tr>
        <tr style="background:#fff3e0;font-weight:bold;"><td colspan="6">Saldo Atual</td><td style="color:#F57C00">${dados.saldoAtual}</td></tr>
        <tr><td colspan="6">Total de Lançamentos</td><td>${dados.totalLancamentos}</td></tr>
      </table>
    </body>
    </html>
  `

  const blob = new Blob(['\ufeff' + html], { type: 'application/vnd.ms-excel;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `lancamentos-caixa-${filtros.dataInicio}-${filtros.dataFim}.xls`
  link.click()
  URL.revokeObjectURL(link.href)
}

// Lifecycle
onMounted(async () => {
  // Verificar se o usuário tem permissão para visualizar este programa
  if (!podeVisualizar(ID_PROGRAMA)) {
    console.warn('[LancCaixaView] Usuário sem permissão para visualizar')
    tipoAcessoNegado.value = 'visualizar'
    acessoNegadoModal.value = true
    return
  }

  console.log('🚀 Iniciando carregamento de dados...')

  // Carregar template HTML
  try {
    const response = await fetch(new URL('@/components/impressos/lancamentos-caixa.html', import.meta.url))
    templateLancamentosCaixa.value = await response.text()
  } catch (error) {
    console.error('Erro ao carregar template:', error)
    // Fallback: usar template vazio se não conseguir carregar
    templateLancamentosCaixa.value = ''
  }

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

  // Também definir o caixa no formulário e sua data de abertura
  if (caixasDisponiveis.value.length > 0 && !formData.id_caixa) {
    formData.id_caixa = caixasDisponiveis.value[0].id_caixa
    formData.dtlancamento = caixasDisponiveis.value[0].dt_abertura
    console.log('Caixa e data iniciais:', formData.id_caixa, formData.dtlancamento)
  }

  await carregarLancamentos()
  console.log('✅ Carregamento inicial completo')
})
</script>

<style scoped>
/* Estilos específicos se necessário */
</style>
