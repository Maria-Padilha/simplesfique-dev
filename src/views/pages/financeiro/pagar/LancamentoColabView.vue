<template>
  <top-all-pages icon="mdi-account-cash">
    <template #titulo>Lançamento da Conta do Colaborador</template>
    <template #section>
      <div>
        <v-card :color="themeStore.darkMode ? 'text-white' : ''" class="background-secondary" elevation="0">
          <v-card-text class="pa-4">

            <!-- Toggle button -->
            <div class="d-flex justify-end align-center mb-3">
              <v-btn
                color="var(--text-color-laranja)"
                :prepend-icon="formularioAberto ? 'mdi-minus' : 'mdi-plus'"
                variant="flat"
                size="small"
                class="text-white"
                @click="toggleFormulario"
              >
                {{ formularioAberto ? 'Cancelar' : 'Novo Lançamento' }}
              </v-btn>
            </div>

            <!-- Formulário Expansível -->
            <v-expand-transition>
              <div v-if="formularioAberto">

            <!-- Formulário principal -->
            <v-card class="background-card" elevation="0">
              <v-card-title class="text-h6 pa-4">
                <v-icon :icon="formData.id ? 'mdi-pencil' : 'mdi-plus'" class="mr-2" />
                {{ formData.id ? "Editar Lançamento #" + formData.id : "Novo Lançamento" }}
              </v-card-title>

              <v-card-text class="pa-4">
                <v-form ref="formRef" v-model="formValido">
                  <v-row dense>

                    <!-- Tipo Movimento -->
                    <v-col cols="12" sm="6" md="2">
                      <v-select
                        v-model="formData.tipo_movimento"
                        :items="tiposMovimento"
                        item-title="title"
                        item-value="value"
                        label="Tipo Movimento *"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-swap-horizontal"
                        hide-details
                        :rules="[rules.required]"
                        class="required-left-border"
                        @update:model-value="onTipoMovimentoChange"
                      />
                    </v-col>

                    <!-- Colaborador -->
                    <v-col cols="12" md="3">
                      <v-autocomplete
                        v-model="formData.id_colaborador"
                        :items="colaboradores"
                        :item-title="(item) => item.nome_razao || item.apelido_fantasia || ''"
                        item-value="id"
                        label="Colaborador *"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-account"
                        clearable
                        :rules="[rules.required]"
                        class="required-left-border"
                        no-data-text="Nenhum colaborador encontrado"
                        :loading="loadingColaboradores"
                      >
                        <template #item="{ props, item }">
                          <v-list-item
                            v-bind="props"
                            :title="item.raw.nome_razao || item.raw.apelido_fantasia"
                            :subtitle="item.raw.cpf_cnpj || ''"
                          />
                        </template>
                      </v-autocomplete>
                    </v-col>

                    <!-- Dt Lançamento -->
                    <v-col cols="12" sm="6" md="2">
                      <v-text-field
                        v-model="formData.dtlancamento"
                        label="Dt Lançamento"
                        type="date"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-calendar"
                        hide-details
                      />
                    </v-col>

                    <!-- Tipo Documento -->
                    <v-col cols="12" sm="6" md="2">
                      <v-autocomplete
                        v-model="formData.id_tipodocumento"
                        :items="financeiroStore.tiposDocumento"
                        :item-title="(item) => item.desctipodocumento || item.descricao || ''"
                        item-value="id"
                        label="Tipo Documento"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-file-document-outline"
                        clearable
                        hide-details
                        no-data-text="Nenhum tipo encontrado"
                      />
                    </v-col>

                    <!-- Tipo Pagamento/Recebimento -->
                    <v-col cols="12" sm="6" md="3">
                      <v-autocomplete
                        v-model="formData.id_tipopagrec"
                        :items="financeiroStore.tiposPagRec"
                        :item-title="(item) => item.desctipopagrec || item.descricao || ''"
                        :item-value="(item) => parseInt(item.id) || item.id"
                        label="Tipo Pagamento/Recebimento"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-credit-card-outline"
                        clearable
                        hide-details
                        no-data-text="Nenhum tipo encontrado"
                      />
                    </v-col>

                    <!-- Caixa (quando tipo = C) -->
                    <v-col cols="12" md="3" v-if="formData.tipo_movimento === 'C'">
                      <v-autocomplete
                        v-model="formData.id_caixa"
                        :items="caixas"
                        :item-title="(item) => item.id + ' - ' + (item.descricao || item.nome || '')"
                        item-value="id"
                        label="Caixa"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-cash-register"
                        clearable
                        hide-details
                        no-data-text="Nenhum caixa encontrado"
                      />
                    </v-col>

                    <!-- Histórico Caixa (quando tipo = C) -->
                    <v-col cols="12" md="3" v-if="formData.tipo_movimento === 'C'">
                      <v-autocomplete
                        v-model="formData.id_caixahist"
                        :items="historicosCaixa"
                        :item-title="(item) => item.deschistorico || item.descricao || ''"
                        item-value="id"
                        label="Histórico Caixa"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-history"
                        clearable
                        hide-details
                        no-data-text="Nenhum histórico encontrado"
                      />
                    </v-col>

                    <!-- Conta Corrente (quando tipo = B) -->
                    <v-col cols="12" md="3" v-if="formData.tipo_movimento === 'B'">
                      <v-autocomplete
                        v-model="formData.id_ccorrente"
                        :items="contasCorrentes"
                        :item-title="(item) => (item.id_ccorrente || item.id) + ' - ' + (item.titular || item.numero_ccorrente || '')"
                        item-value="id"
                        label="Conta Corrente"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-bank"
                        clearable
                        hide-details
                        no-data-text="Nenhuma conta encontrada"
                      />
                    </v-col>

                    <!-- Histórico Conta Corrente (quando tipo = B) -->
                    <v-col cols="12" md="3" v-if="formData.tipo_movimento === 'B'">
                      <v-autocomplete
                        v-model="formData.id_ccorrentehist"
                        :items="historicosBancarios"
                        :item-title="(item) => item.deschistorico || item.descricao || ''"
                        item-value="id"
                        label="Histórico Bancário"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-history"
                        clearable
                        hide-details
                        no-data-text="Nenhum histórico encontrado"
                      />
                    </v-col>

                    <!-- Conta Despesa (Plano de Conta) -->
                    <v-col cols="12" md="3">
                      <v-autocomplete
                        v-model="formData.id_conta_despesa"
                        :items="planosContaFormatados"
                        item-title="label"
                        item-value="id"
                        label="Conta Despesa (Plano de Conta)"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-chart-tree"
                        clearable
                        hide-details
                        no-data-text="Nenhum plano encontrado"
                        :loading="loadingPlanos"
                      />
                    </v-col>

                    <!-- Histórico Contábil -->
                    <v-col cols="12" md="3">
                      <v-autocomplete
                        v-model="formData.id_historico_ctb"
                        :items="historicosContabeis"
                        :item-title="(item) => item.deschistorico || item.descricao || ''"
                        item-value="id"
                        label="Histórico Contábil"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-book-open-outline"
                        clearable
                        hide-details
                        no-data-text="Nenhum histórico encontrado"
                      />
                    </v-col>

                    <!-- Vlr Face -->
                    <v-col cols="6" sm="4" md="2">
                      <v-text-field
                        v-model.number="formData.vlrface"
                        label="Valor Face *"
                        type="number"
                        step="0.01"
                        min="0"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-currency-brl"
                        :rules="[rules.required, rules.positivo]"
                        class="required-left-border"
                        :hint="formData.vlrface ? formatarMoeda(formData.vlrface) : ''"
                        persistent-hint
                        @input="calcularTotal"
                      />
                    </v-col>

                    <!-- % Juros -->
                    <v-col cols="6" sm="4" md="1">
                      <v-text-field
                        v-model.number="formData.percjuros"
                        label="% Juros"
                        type="number"
                        step="0.01"
                        min="0"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-percent"
                        hide-details
                        suffix="%"
                        @input="calcularTotal"
                      />
                    </v-col>

                    <!-- Vlr Juros -->
                    <v-col cols="6" sm="4" md="1">
                      <v-text-field
                        v-model.number="formData.vlrjuros"
                        label="Vlr Juros"
                        type="number"
                        step="0.01"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-currency-brl"
                        hide-details
                        readonly
                        :hint="formData.vlrjuros ? formatarMoeda(formData.vlrjuros) : ''"
                        persistent-hint
                      />
                    </v-col>

                    <!-- Vlr Total -->
                    <v-col cols="6" sm="4" md="2">
                      <v-text-field
                        v-model.number="formData.vlrtotal"
                        label="Valor Total"
                        type="number"
                        step="0.01"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-currency-brl"
                        hide-details
                        readonly
                        :hint="formData.vlrtotal ? formatarMoeda(formData.vlrtotal) : ''"
                        persistent-hint
                      />
                    </v-col>

                    <!-- Observação -->
                    <v-col cols="12">
                      <v-text-field
                        v-model="formData.observacao"
                        label="Observação"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-note-text-outline"
                        maxlength="200"
                        hide-details
                      />
                    </v-col>

                  </v-row>
                </v-form>
              </v-card-text>
              <v-card-actions class="pa-4 pt-0">
                <v-spacer />
                <v-btn color="error" variant="outlined" size="default" :disabled="!formData.id || loading" @click="dialogExcluir = true">
                  <template #prepend><v-icon>mdi-delete</v-icon></template>
                  Excluir
                </v-btn>
                <v-btn color="var(--text-color-laranja)" variant="flat" size="default" :loading="loading" @click="salvarLancamento" class="text-white px-6">
                  <template #prepend><v-icon color="white">mdi-content-save</v-icon></template>
                  Salvar
                </v-btn>
              </v-card-actions>
            </v-card>

            <!-- Parcelas -->
            <v-card class="background-card mt-4" elevation="0">
              <v-card-title class="text-subtitle-1 pa-4 d-flex align-center justify-space-between">
                <div class="d-flex align-center">
                  <v-icon icon="mdi-format-list-numbered" class="mr-2" />
                  Parcelas
                  <v-chip v-if="parcelasCalculadas && parcelas.length" size="x-small" color="success" variant="tonal" class="ml-2">
                    {{ parcelas.length }} {{ parcelas.length === 1 ? 'parcela' : 'parcelas' }}
                  </v-chip>
                </div>
                <div class="d-flex ga-2">
                  <v-btn v-if="parcelasCalculadas" color="grey" variant="outlined" size="small" @click="parcelasCalculadas = false">
                    <template #prepend><v-icon>mdi-calculator</v-icon></template>
                    Recalcular
                  </v-btn>
                  <v-btn v-if="parcelasCalculadas" color="var(--text-color-laranja)" variant="outlined" size="small" @click="adicionarParcela">
                    <template #prepend><v-icon>mdi-plus</v-icon></template>
                    Adicionar
                  </v-btn>
                </div>
              </v-card-title>

              <!-- Painel de cálculo -->
              <v-card-text v-if="!parcelasCalculadas" class="pa-4 pt-0">
                <v-card variant="outlined" class="mb-4">
                  <v-card-title class="text-body-1 pa-4 d-flex align-center">
                    <v-icon icon="mdi-calculator-variant" class="mr-2" color="var(--text-color-laranja)" />
                    Configurações das Parcelas
                  </v-card-title>
                  <v-card-text class="pa-4 pt-0">
                    <v-row dense>
                      <!-- Qtd Parcelas -->
                      <v-col cols="6" sm="4" md="2">
                        <v-text-field
                          v-model.number="qtdparcelas"
                          label="Qtd Parcelas"
                          type="number"
                          min="1"
                          variant="outlined"
                          density="compact"
                          prepend-inner-icon="mdi-format-list-numbered"
                          hide-details
                        />
                      </v-col>

                      <!-- Primeiro Vencimento -->
                      <v-col cols="6" sm="4" md="2">
                        <v-text-field
                          v-model="primeirovencimento"
                          label="1º Vencimento"
                          type="date"
                          variant="outlined"
                          density="compact"
                          prepend-inner-icon="mdi-calendar-clock"
                          hide-details
                        />
                      </v-col>

                      <!-- Intervalo -->
                      <v-col cols="6" sm="4" md="2">
                        <v-text-field
                          v-model.number="intervalo"
                          label="Intervalo"
                          type="number"
                          min="1"
                          variant="outlined"
                          density="compact"
                          prepend-inner-icon="mdi-calendar-range"
                          suffix="dias"
                          hide-details
                        />
                      </v-col>

                      <!-- Botão Calcular -->
                      <v-col cols="6" sm="4" md="3" class="d-flex align-center">
                        <v-btn
                          color="var(--text-color-laranja)"
                          variant="flat"
                          class="text-white"
                          :loading="loadingCalculo"
                          :disabled="!formData.vlrtotal || !qtdparcelas"
                          @click="calcularParcelas"
                        >
                          <template #prepend><v-icon color="white">mdi-calculator</v-icon></template>
                          Calcular Parcelas
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-card-text>

              <v-card-text class="pa-4 pt-0">
                <v-data-table
                  :headers="headersParcelas"
                  :items="parcelas"
                  density="compact"
                  :theme="themeStore.darkMode ? 'dark' : 'light'"
                  class="background-secondary"
                  hide-default-footer
                  :items-per-page="-1"
                  no-data-text="Nenhuma parcela adicionada"
                >
                  <template #[`item.nr`]="{ index }">{{ index + 1 }}</template>
                  <template #[`item.valor`]="{ index }">
                    <v-text-field
                      v-model.number="parcelas[index].valor"
                      type="number"
                      step="0.01"
                      min="0"
                      variant="outlined"
                      density="compact"
                      hide-details
                      prefix="R$"
                      style="min-width: 130px"
                    />
                  </template>
                  <template #[`item.dtvencimento`]="{ index }">
                    <v-text-field
                      v-model="parcelas[index].dtvencimento"
                      type="date"
                      variant="outlined"
                      density="compact"
                      hide-details
                      style="min-width: 160px"
                    />
                  </template>
                  <template #[`item.acoes`]="{ index }">
                    <v-btn icon size="x-small" variant="text" color="error" @click="removerParcela(index)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                  <template #bottom>
                    <div class="d-flex justify-end align-center pa-3" v-if="parcelas.length > 0">
                      <span class="text-caption text-grey mr-2">Total parcelas:</span>
                      <strong style="color: var(--text-color-laranja)">{{ formatarMoeda(totalParcelas) }}</strong>
                    </div>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>

              </div>
            </v-expand-transition>

            <!-- Tabela de Lançamentos -->
            <v-card v-if="!formularioAberto" class="background-card mt-4" elevation="0">
              <v-card-title class="text-subtitle-1 pa-4 d-flex align-center justify-space-between">
                <div class="d-flex align-center">
                  <v-icon icon="mdi-table-search" class="mr-2" />
                  Consulta de Lançamentos
                </div>
              </v-card-title>

              <!-- Filtros -->
              <v-card-text class="pa-4 pt-0">
                <v-row dense>
                  <!-- Tipo Período -->
                  <v-col cols="12" sm="6" md="3">
                    <v-select
                      v-model="filtros.tpperiodo"
                      :items="tiposPeriodo"
                      item-title="title"
                      item-value="value"
                      label="Tipo Período"
                      variant="outlined"
                      density="compact"
                      prepend-inner-icon="mdi-calendar-filter"
                      hide-details
                    />
                  </v-col>

                  <!-- Dt Ini -->
                  <v-col cols="6" sm="4" md="2">
                    <v-text-field
                      v-model="filtros.dtini"
                      label="Data Inicial"
                      type="date"
                      variant="outlined"
                      density="compact"
                      prepend-inner-icon="mdi-calendar-start"
                      hide-details
                    />
                  </v-col>

                  <!-- Dt Fim -->
                  <v-col cols="6" sm="4" md="2">
                    <v-text-field
                      v-model="filtros.dtfim"
                      label="Data Final"
                      type="date"
                      variant="outlined"
                      density="compact"
                      prepend-inner-icon="mdi-calendar-end"
                      hide-details
                    />
                  </v-col>

                  <!-- Colaborador filtro -->
                  <v-col cols="12" sm="6" md="3">
                    <v-autocomplete
                      v-model="filtros.idcolabo"
                      :items="colaboradores"
                      :item-title="(item) => item.nome_razao || item.apelido_fantasia || ''"
                      item-value="id"
                      label="Colaborador"
                      variant="outlined"
                      density="compact"
                      prepend-inner-icon="mdi-account"
                      clearable
                      hide-details
                      no-data-text="Nenhum colaborador encontrado"
                    />
                  </v-col>

                  <!-- Botão Buscar -->
                  <v-col cols="12" sm="4" md="2" class="d-flex align-center">
                    <v-btn
                      color="var(--text-color-laranja)"
                      variant="flat"
                      class="text-white"
                      :loading="loadingTabela"
                      @click="buscarLancamentos"
                      block
                    >
                      <template #prepend><v-icon color="white">mdi-magnify</v-icon></template>
                      Buscar
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>

              <!-- Tabela de resultados -->
              <v-card-text class="pa-4 pt-0">
                <v-data-table
                  :headers="headersPesquisa"
                  :items="lancamentosColab"
                  :search="searchTabela"
                  :loading="loadingTabela"
                  item-value="id"
                  density="compact"
                  :theme="themeStore.darkMode ? 'dark' : 'light'"
                  class="background-secondary"
                  show-expand
                  hover
                  :items-per-page="15"
                >
                  <template #[`item.tipo_movimento`]="{ item }">
                    <v-chip size="x-small" :color="item.tipo_movimento === 'C' ? 'blue' : 'purple'" variant="tonal">
                      {{ item.tipo_movimento === 'C' ? 'Caixa' : 'Banco' }}
                    </v-chip>
                  </template>
                  <template #[`item.id_colaborador`]="{ item }">
                    {{ nomeColaborador(item.id_colaborador) }}
                  </template>
                  <template #[`item.vlrface`]="{ item }">{{ formatarMoeda(item.vlrface) }}</template>
                  <template #[`item.vlrtotal`]="{ item }">{{ formatarMoeda(item.vlrtotal) }}</template>
                  <template #[`item.dtlancamento`]="{ item }">
                    {{ item.dtlancamento ? new Date(item.dtlancamento).toLocaleDateString('pt-BR') : '--' }}
                  </template>
                  <template #[`item.acoes`]="{ item }">
                    <v-btn size="x-small" variant="text" color="var(--text-color-laranja)" @click.stop="selecionarLancamento(item)">
                      <v-icon>mdi-pencil</v-icon>
                      <v-tooltip activator="parent">Carregar no formulário</v-tooltip>
                    </v-btn>
                  </template>
                  <template #expanded-row="{ columns, item }">
                    <tr>
                      <td :colspan="columns.length" class="pa-0">
                        <v-table density="compact" class="mx-4 my-2" :theme="themeStore.darkMode ? 'dark' : 'light'">
                          <thead>
                            <tr>
                              <th class="text-left">#</th>
                              <th class="text-left">Valor</th>
                              <th class="text-left">Dt Vencimento</th>
                              <th class="text-left">Sinal</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(parc, i) in item.parcelas" :key="i">
                              <td>{{ i + 1 }}</td>
                              <td>{{ formatarMoeda(parc.valor) }}</td>
                              <td>{{ parc.dtvencimento ? new Date(parc.dtvencimento + 'T00:00:00').toLocaleDateString('pt-BR') : '--' }}</td>
                              <td>
                                <v-chip size="x-small" :color="parc.sinal === '-' ? 'error' : 'success'" variant="tonal">
                                  {{ parc.sinal === '-' ? 'Débito' : 'Crédito' }}
                                </v-chip>
                              </td>
                            </tr>
                          </tbody>
                        </v-table>
                      </td>
                    </tr>
                  </template>
                  <template #no-data>
                    <div class="text-center pa-6">
                      <v-icon size="48" color="grey">mdi-account-cash-outline</v-icon>
                      <p class="text-body-1 mt-2 text-grey">Nenhum lançamento encontrado</p>
                    </div>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>

          </v-card-text>
        </v-card>
        <v-dialog v-model="dialogExcluir" max-width="420" persistent>
          <v-card class="background-secondary">
            <v-card-title class="pa-4 d-flex align-center">
              <v-icon icon="mdi-alert-circle" color="error" class="mr-2" />
              Confirmar Exclusão
            </v-card-title>
            <v-card-text class="pa-4">
              Deseja realmente excluir o lançamento <strong>#{{ formData.id }}</strong>?
              <br />
              <span class="text-caption text-grey">Esta ação não poderá ser desfeita.</span>
            </v-card-text>
            <v-card-actions class="pa-3">
              <v-spacer />
              <v-btn variant="text" @click="dialogExcluir = false">Cancelar</v-btn>
              <v-btn color="error" variant="flat" :loading="loading" @click="confirmarExclusao">Excluir</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </div>
    </template>
  </top-all-pages>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import TopAllPages from '@/components/base/padrao-paginas/TopAllPages.vue'
import { useThemeStore } from '@/stores/config-temas/theme'
import { useFinanceiroStore } from '@/stores/APIs/financeiro'
import { usePessoasStore } from '@/stores/APIs/pessoas'
import { useEmpresaStore } from '@/stores/APIs/empresa'

const themeStore = useThemeStore()
const financeiroStore = useFinanceiroStore()
const pessoasStore = usePessoasStore()
const empresaStore = useEmpresaStore()

// ── Estado ────────────────────────────────────────────────────────────────────
const formRef = ref(null)
const formValido = ref(false)
const loading = computed(() => financeiroStore.loading)
const loadingColaboradores = ref(false)
const loadingPlanos = ref(false)
const loadingTabela = ref(false)
const loadingCalculo = ref(false)
const formularioAberto = ref(false)

// Filtros da tabela
const filtros = reactive({
  tpperiodo: 0,
  dtini: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10),
  dtfim: new Date().toISOString().slice(0, 10),
  idcolabo: null,
})
const searchTabela = ref('')

const tiposPeriodo = [
  { title: 'Dt Lançamento', value: 0 },
  { title: 'Dt Vencimento', value: 1 },
]

// Cálculo de parcelas
const qtdparcelas = ref(1)
const intervalo = ref(30)
const primeirovencimento = ref(new Date().toISOString().slice(0, 10))
const parcelasCalculadas = ref(false)

const formData = reactive({
  id: null,
  tipo_movimento: 'C',
  id_empresa: null,
  id_colaborador: null,
  nrdocumento: '',
  observacao: '',
  vlrface: null,
  percjuros: 0,
  vlrjuros: 0,
  vlrtotal: null,
  dtlancamento: new Date().toISOString().slice(0, 10),
  id_caixa: null,
  id_caixahist: null,
  id_ccorrente: null,
  id_ccorrentehist: null,
  id_historico_ctb: null,
  id_conta_despesa: null,
  id_tipodocumento: null,
  id_tipopagrec: null,
})

const parcelas = ref([{ valor: null, dtvencimento: new Date().toISOString().slice(0, 10) }])

// ── Lookups ───────────────────────────────────────────────────────────────────
const tiposMovimento = [
  { title: 'Caixa', value: 'C' },
  { title: 'Banco', value: 'B' },
]

const caixas = ref([])
const contasCorrentes = ref([])
const colaboradores = ref([])
const historicosBancarios = ref([])
const historicosCaixa = ref([])
const historicosContabeis = ref([])
const lancamentosColab = ref([])

const planosContaFormatados = computed(() => {
  const planos = financeiroStore.planosConta || []
  return planos.map(p => ({
    ...p,
    label: (p.id_classificador || p.id) + ' - ' + (p.descconta || p.descricao || '')
  }))
})

const totalParcelas = computed(() =>
  parcelas.value.reduce((acc, p) => acc + (Number(p.valor) || 0), 0)
)

// ── Diálogos ──────────────────────────────────────────────────────────────────
const dialogExcluir = ref(false)

// ── Cabeçalhos ────────────────────────────────────────────────────────────────
const headersParcelas = [
  { title: '#', key: 'nr', sortable: false, width: '50px' },
  { title: 'Valor (R$)', key: 'valor', sortable: false },
  { title: 'Dt Vencimento', key: 'dtvencimento', sortable: false },
  { title: '', key: 'acoes', sortable: false, width: '50px' },
]

const headersPesquisa = [
  { title: 'ID', key: 'id', sortable: true, width: '70px' },
  { title: 'Nr Doc', key: 'nrdocumento', sortable: true, width: '100px' },
  { title: 'Colaborador', key: 'id_colaborador', sortable: true },
  { title: 'Tipo', key: 'tipo_movimento', sortable: true, width: '80px' },
  { title: 'Vlr Face', key: 'vlrface', sortable: true, width: '110px' },
  { title: 'Vlr Total', key: 'vlrtotal', sortable: true, width: '110px' },
  { title: 'Dt Lançamento', key: 'dtlancamento', sortable: true, width: '120px' },
  { title: 'Ações', key: 'acoes', sortable: false, width: '80px' },
]

// ── Regras ────────────────────────────────────────────────────────────────────
const rules = {
  required: (v) => (v !== null && v !== undefined && v !== '') || 'Campo obrigatório',
  positivo: (v) => (!v || Number(v) >= 0) || 'Valor deve ser positivo',
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatarMoeda = (v) => {
  if (v === null || v === undefined || v === '') return ''
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(v))
}

const calcularTotal = () => {
  const face = Number(formData.vlrface) || 0
  const perc = Number(formData.percjuros) || 0
  const juros = face * (perc / 100)
  formData.vlrjuros = parseFloat(juros.toFixed(2))
  formData.vlrtotal = parseFloat((face + juros).toFixed(2))
}

const onTipoMovimentoChange = () => {
  formData.id_caixa = null
  formData.id_caixahist = null
  formData.id_ccorrente = null
  formData.id_ccorrentehist = null
}

const nomeColaborador = (id) => {
  if (!id) return '--'
  const c = colaboradores.value.find(c => c.id === id)
  return c ? (c.nome_razao || c.apelido_fantasia || '--') : `#${id}`
}

const toggleFormulario = () => {
  if (formularioAberto.value) {
    novoLancamento()
    formularioAberto.value = false
  } else {
    novoLancamento()
    formularioAberto.value = true
  }
}

// ── Parcelas ──────────────────────────────────────────────────────────────────
const adicionarParcela = () => {
  parcelas.value.push({ valor: null, dtvencimento: new Date().toISOString().slice(0, 10) })
}

const removerParcela = (index) => {
  parcelas.value.splice(index, 1)
}

const calcularParcelas = async () => {
  const qtd = parseInt(qtdparcelas.value) || 1
  const total = parseFloat(formData.vlrtotal) || 0

  if (!total) return

  // Parcela única — cálculo local
  if (qtd === 1) {
    parcelas.value = [{ valor: total, dtvencimento: primeirovencimento.value }]
    parcelasCalculadas.value = true
    return
  }

  loadingCalculo.value = true
  try {
    const dadosCalculo = {
      vlrtotal: total,
      qtdparcelas: qtd,
      intervalo: parseInt(intervalo.value) || 30,
      primeirovencimento: primeirovencimento.value,
    }

    const resultado = await financeiroStore.calcularParcelasColab(dadosCalculo)

    if (resultado && Array.isArray(resultado) && resultado.length) {
      parcelas.value = resultado.map((p) => {
        let valor = p.vlrparcela || p.valor || '0'
        if (typeof valor === 'string') valor = valor.replace(',', '.')
        return {
          valor: parseFloat(valor || 0),
          dtvencimento: (p.dtvencimento || p.data_vencimento || '').slice(0, 10),
        }
      })
    } else {
      // fallback local
      const valorParcela = parseFloat((total / qtd).toFixed(2))
      const diff = parseFloat((total - valorParcela * qtd).toFixed(2))
      const base = new Date(primeirovencimento.value + 'T00:00:00')
      parcelas.value = Array.from({ length: qtd }, (_, i) => {
        const dt = new Date(base)
        dt.setDate(dt.getDate() + i * (parseInt(intervalo.value) || 30))
        return {
          valor: i === qtd - 1 ? parseFloat((valorParcela + diff).toFixed(2)) : valorParcela,
          dtvencimento: dt.toISOString().slice(0, 10),
        }
      })
    }
    parcelasCalculadas.value = true
  } catch {
    // fallback local em caso de erro
    const valorParcela = parseFloat((total / qtd).toFixed(2))
    const diff = parseFloat((total - valorParcela * qtd).toFixed(2))
    const base = new Date(primeirovencimento.value + 'T00:00:00')
    parcelas.value = Array.from({ length: qtd }, (_, i) => {
      const dt = new Date(base)
      dt.setDate(dt.getDate() + i * (parseInt(intervalo.value) || 30))
      return {
        valor: i === qtd - 1 ? parseFloat((valorParcela + diff).toFixed(2)) : valorParcela,
        dtvencimento: dt.toISOString().slice(0, 10),
      }
    })
    parcelasCalculadas.value = true
  } finally {
    loadingCalculo.value = false
  }
}

// ── CRUD ──────────────────────────────────────────────────────────────────────
const novoLancamento = () => {
  const idEmpresa = empresaStore.empresa?.id || empresaStore.empresaSelecionada?.id || null
  Object.assign(formData, {
    id: null,
    tipo_movimento: 'C',
    id_empresa: idEmpresa,
    id_colaborador: null,
    nrdocumento: '',
    observacao: '',
    vlrface: null,
    percjuros: 0,
    vlrjuros: 0,
    vlrtotal: null,
    dtlancamento: new Date().toISOString().slice(0, 10),
    id_caixa: null,
    id_caixahist: null,
    id_ccorrente: null,
    id_ccorrentehist: null,
    id_historico_ctb: null,
    id_conta_despesa: null,
    id_tipodocumento: null,
    id_tipopagrec: null,
  })
  parcelas.value = [{ valor: null, dtvencimento: new Date().toISOString().slice(0, 10) }]
  qtdparcelas.value = 1
  intervalo.value = 30
  primeirovencimento.value = new Date().toISOString().slice(0, 10)
  parcelasCalculadas.value = false
  formRef.value?.resetValidation()
}

const salvarLancamento = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  const idEmpresa = empresaStore.empresa?.id || empresaStore.empresaSelecionada?.id

  const payload = {
    data: [{
      tipo_movimento: formData.tipo_movimento,
      id_empresa: idEmpresa,
      id_colaborador: formData.id_colaborador,
      nrdocumento: formData.nrdocumento,
      observacao: formData.observacao,
      vlrface: formData.vlrface,
      percjuros: formData.percjuros,
      vlrjuros: formData.vlrjuros,
      vlrtotal: formData.vlrtotal,
      dtlancamento: formData.dtlancamento,
      id_caixa: formData.tipo_movimento === 'C' ? formData.id_caixa : null,
      id_caixahist: formData.tipo_movimento === 'C' ? formData.id_caixahist : null,
      id_ccorrente: formData.tipo_movimento === 'B' ? formData.id_ccorrente : null,
      id_ccorrentehist: formData.tipo_movimento === 'B' ? formData.id_ccorrentehist : null,
      id_historico_ctb: formData.id_historico_ctb,
      id_conta_despesa: formData.id_conta_despesa,
      id_tipodocumento: formData.id_tipodocumento,
      id_tipopagrec: formData.id_tipopagrec,
    }],
    parcela: parcelas.value.map(p => ({
      valor: p.valor,
      dtvencimento: p.dtvencimento,
    })),
  }

  try {
    if (formData.id) {
      await financeiroStore.atualizarLancamentoColab(formData.id, payload)
    } else {
      const resultado = await financeiroStore.criarLancamentoColab(payload)
      if (resultado?.id) formData.id = resultado.id
    }
  } catch { /* toast já exibido pelo store */ }
}

const confirmarExclusao = async () => {
  try {
    await financeiroStore.deletarLancamentoColab(formData.id)
    dialogExcluir.value = false
    novoLancamento()
    formularioAberto.value = false
  } catch { /* toast já exibido pelo store */ }
}

const buscarLancamentos = async () => {
  const idEmpresa = empresaStore.empresa?.id || empresaStore.empresaSelecionada?.id
  if (!idEmpresa) return
  loadingTabela.value = true
  try {
    const params = {
      tpperiodo: filtros.tpperiodo,
      dtini: filtros.dtini,
      dtfim: filtros.dtfim,
    }
    if (filtros.idcolabo) params.idcolabo = filtros.idcolabo
    const raw = await financeiroStore.buscarLancamentosColab(idEmpresa, params)
    // API returns flat rows (one per parcela) — group by id
    const map = new Map()
    for (const row of raw) {
      if (!map.has(row.id)) {
        map.set(row.id, {
          ...row,
          tipo_movimento: row.id_caixamov ? 'C' : 'B',
          parcelas: [],
        })
      }
      map.get(row.id).parcelas.push({
        valor: row.valor,
        dtvencimento: row.dtvencimento,
        sinal: row.sinal,
      })
    }
    lancamentosColab.value = [...map.values()]
  } catch {
    lancamentosColab.value = []
  } finally {
    loadingTabela.value = false
  }
}

const selecionarLancamento = (item) => {
  Object.assign(formData, {
    id: item.id ?? null,
    tipo_movimento: item.tipo_movimento || (item.id_caixamov ? 'C' : 'B'),
    id_empresa: item.id_empresa ?? null,
    id_colaborador: item.id_colaborador ?? null,
    nrdocumento: item.nrdocumento || '',
    observacao: item.observacao || '',
    vlrface: item.vlrface ?? null,
    percjuros: item.percjuros ?? 0,
    vlrjuros: item.vlrjuros ?? 0,
    vlrtotal: item.vlrtotal ?? null,
    dtlancamento: item.dtlancamento ? item.dtlancamento.slice(0, 10) : new Date().toISOString().slice(0, 10),
    id_caixa: item.id_caixa ?? item.id_caixamov ?? null,
    id_caixahist: item.id_caixahist ?? null,
    id_ccorrente: item.id_ccorrente ?? item.id_ccorrentemov ?? null,
    id_ccorrentehist: item.id_ccorrentehist ?? null,
    id_historico_ctb: item.id_historico_ctb ?? null,
    id_conta_despesa: item.id_conta_despesa ?? null,
    id_tipodocumento: item.id_tipodocumento ?? null,
    id_tipopagrec: item.id_tipopagrec ?? null,
  })
  parcelas.value = Array.isArray(item.parcelas) && item.parcelas.length
    ? item.parcelas.map(p => ({ valor: p.valor, dtvencimento: p.dtvencimento?.slice(0, 10) || '' }))
    : [{ valor: null, dtvencimento: new Date().toISOString().slice(0, 10) }]
  parcelasCalculadas.value = parcelas.value.length > 0
  qtdparcelas.value = parcelas.value.length || 1
  formularioAberto.value = true
  formRef.value?.resetValidation()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// ── Mount ─────────────────────────────────────────────────────────────────────
onMounted(async () => {
  const idEmpresa = empresaStore.empresa?.id || empresaStore.empresaSelecionada?.id
  formData.id_empresa = idEmpresa || null

  if (idEmpresa) {
    try { caixas.value = await financeiroStore.buscarCaixas(idEmpresa) } catch { caixas.value = [] }
  }

  try {
    await financeiroStore.buscarContasCorrentes()
    contasCorrentes.value = financeiroStore.contas || []
  } catch { contasCorrentes.value = [] }

  try {
    historicosBancarios.value = await financeiroStore.buscarHistoricosBancarios()
    historicosCaixa.value = historicosBancarios.value
    historicosContabeis.value = historicosBancarios.value
  } catch {
    historicosBancarios.value = []
    historicosCaixa.value = []
    historicosContabeis.value = []
  }

  loadingColaboradores.value = true
  try {
    await pessoasStore.buscarTodasPessoas()
    colaboradores.value = (pessoasStore.pessoas || []).filter(p => p.colaborador === 'S')
  } catch { colaboradores.value = [] }
  finally { loadingColaboradores.value = false }

  loadingPlanos.value = true
  try { await financeiroStore.buscarPlanosConta() } catch { /* silent */ }
  finally { loadingPlanos.value = false }

  try { await financeiroStore.buscarTiposDocumento() } catch { /* silent */ }
  try { await financeiroStore.buscarTiposPagRec() } catch { /* silent */ }
})
</script>
