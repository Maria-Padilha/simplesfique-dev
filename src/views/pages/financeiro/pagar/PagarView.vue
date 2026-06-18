<template>
  <top-all-pages icon="mdi-credit-card-outline">
    <template #titulo>Contas a Pagar</template>
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
      <div>
        <!-- Card com Total das Parcelas -->
        <v-card class="background-secondary mb-4" elevation="0">
          <v-card-text class="pa-4">
            <div class="d-flex align-center justify-space-between">
              <div class="d-flex align-center">
                <v-icon icon="mdi-cash-multiple" size="32" color="var(--text-color-laranja)" class="mr-3"></v-icon>
                <div>
                  <div class="text-caption text-grey">Total A Pagar</div>
                  <div class="text-h5 font-weight-bold" style="color: var(--text-color-laranja)">
                    {{ formatarMoeda(totalParcelasFiltradas) }}
                  </div>
                </div>
              </div>
              <v-chip color="var(--text-color-laranja)" variant="tonal">
                {{ contasPagarFiltradas.length }} {{ contasPagarFiltradas.length === 1 ? 'parcela' : 'parcelas' }}
              </v-chip>
            </div>
          </v-card-text>
        </v-card>

        <!-- Lista de Contas a Pagar -->
        <v-card :color="themeStore.darkMode ? 'text-white' : ''" class="background-secondary" elevation="0">
          <v-card-text class="pa-4">
            <div class="d-flex justify-end align-center mb-3 gap-2">
              <v-btn
                  color="var(--text-color-laranja)"
                  :prepend-icon="formularioAberto ? 'mdi-minus' : 'mdi-plus'"
                  variant="flat"
                  size="small"
                  class="text-white"
                  @click="toggleFormulario"
              >
                {{ formularioAberto ? 'Cancelar' : 'Nova Conta a Pagar' }}
              </v-btn>
            </div>

            <!-- Formulário Expansível -->
            <v-expand-transition>
              <div v-if="formularioAberto">
                <v-card class="background-card mb-7" elevation="0">
                  <v-card-title class="text-h6 pa-4">
                    <v-icon :icon="editando ? 'mdi-pencil' : 'mdi-plus'" class="mr-2"></v-icon>
                    {{ editando ? 'Editar Conta a Pagar' : 'Nova Conta a Pagar' }}
                  </v-card-title>

                  <v-card-text class="pa-4">
                    <!-- Opção de Importar XML -->
                    <v-card variant="outlined" class="mb-4 pa-3">
                      <v-card-title class="text-subtitle-2 pa-2">
                        <v-icon icon="mdi-xml" class="mr-2" color="black"></v-icon>
                        Importar dados de XML
                      </v-card-title>
                      <v-card-text class="pa-2 d-flex flex-column align-center">
                        <div class="text-caption text-grey mb-2 text-center" style="max-width: 300px;">
                          Importe dados de uma Nota Fiscal de Produto (NFe) ou Nota Fiscal de Serviço (NFSe) para preencher automaticamente o formulário.
                        </div>
                        <v-btn
                            color="var(--text-color-laranja)"
                            variant="outlined"
                            size="small"
                            prepend-icon="mdi-cloud-upload-outline"
                            @click="abrirModalImportarXML"
                        >
                          Selecionar arquivo XML
                        </v-btn>
                      </v-card-text>
                    </v-card>

                    <v-divider class="my-4"></v-divider>

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
                              class="required-left-border"
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
                              class=""
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
                              class=""
                              prepend-inner-icon="mdi-tag"
                          ></v-text-field>
                        </v-col>

                        <!-- Tipo de Documento -->
                        <v-col cols="12" md="4">
                          <v-text-field
                              label="Tipo Documento *"
                              v-model="tipoDocumentoSelecionado"
                              variant="outlined"
                              density="compact"
                              hide-details="auto"
                              :rules="[rules.required]"
                              class="required-left-border"
                              prepend-inner-icon="mdi-file-document-outline"
                          >
                            <template #append-inner>
                              <TipoDocumentoMenu @selecionar="selecionarTipoDocumento"/>
                            </template>
                          </v-text-field>
                        </v-col>

                        <!-- Fornecedor -->
                        <v-col cols="12" md="4">
                          <v-text-field
                              label="Fornecedor *"
                              v-model="fornecedorSelecionado"
                              variant="outlined"
                              density="compact"
                              hide-details="auto"
                              :rules="[rules.required]"
                              class="required-left-border"
                              prepend-inner-icon="mdi-account-box"
                              readonly
                              placeholder="Selecione um fornecedor"
                          >
                            <template #append-inner>
                              <busca-padrao-menu
                                  v-model="menuFornecedor"
                                  :pesquisar="pesquisarFornecedores"
                                  :modelInput="termoFornecedor"
                                  :resultados="fornecedorResultados"
                                  @update:modelInput="termoFornecedor = $event"
                                  @selecionar="selecionarFornecedor"
                              >
                                <template #resultados="{ selecionar }">
                                  <v-virtual-scroll
                                      :items="fornecedorResultados"
                                      :height="120"
                                      item-height="42"
                                      class="mt-3"
                                  >
                                    <template #default="{ item }">
                                      <div
                                          class="hover:bg-surface-variant rounded-md px-3 py-2 cursor-pointer"
                                          @click="selecionar(item)"
                                      >
                                        <p class="text-body-1">{{ item.apelido_fantasia || item.nome_razao || item.nome || item.apelido }}</p>
                                      </div>
                                    </template>
                                  </v-virtual-scroll>
                                </template>
                              </busca-padrao-menu>
                            </template>
                          </v-text-field>
                        </v-col>

                        <!-- Plano de Conta -->
                        <v-col cols="12" md="4">
                          <v-autocomplete
                              v-model="formData.id_planoconta"
                              :items="planosContaDisponiveis"
                              item-title="label"
                              item-value="id"
                              label="Plano de Conta *"
                              variant="outlined"
                              density="compact"
                              :rules="[rules.required]"
                              class="required-left-border"
                              prepend-inner-icon="mdi-chart-tree"
                              clearable
                              v-model:search-input="planoContaSearch"
                              no-data-text="Nenhum plano de conta encontrado"
                          >
                          </v-autocomplete>
                        </v-col>

                        <!-- Histórico Contábil -->
                        <v-col cols="12" md="4">
                          <v-text-field
                              label="Histórico Contábil"
                              v-model="histContabilLabel"
                              variant="outlined"
                              density="compact"
                              hide-details="auto"
                              class="required-left-border"
                              prepend-inner-icon="mdi-file-document"
                              readonly
                              placeholder="Selecione um histórico"
                          >
                            <template #append-inner>
                              <div class="d-flex align-center">
                                <busca-padrao-menu
                                    v-model="menuHistContabil"
                                    :pesquisar="pesquisarHistoricosContabil"
                                    :modalCadastrar="abrirModalCadastrarHistorico"
                                    :modelInput="termoHistContabil"
                                    :resultados="historicoContabilResultados"
                                    @update:modelInput="termoHistContabil = $event"
                                    @selecionar="selecionarHistoricoContabil"
                                    :cadastrar-btn="true"
                                >
                                  <template #resultados="{ selecionar }">
                                    <v-virtual-scroll
                                        :items="historicoContabilResultados"
                                        :height="120"
                                        item-height="42"
                                        class="mt-3"
                                    >
                                      <template #default="{ item }">
                                        <div
                                            class="hover:bg-surface-variant rounded-md px-3 py-2 cursor-pointer"
                                            @click="selecionar(item)"
                                        >
                                          <p class="text-body-1">({{ item.id }}) - {{ item.deschistorico || item.descricao }}</p>
                                        </div>
                                      </template>
                                    </v-virtual-scroll>
                                  </template>
                                </busca-padrao-menu>
                              </div>
                            </template>
                          </v-text-field>

                          <CadastrarModal
                              :cadastrarModal="cadastrarHistoricoModal"
                              :clearInput="clearHistoricoInputs"
                              :cadastrarcidade="cadastrarHistorico"
                          >
                            <template #titulo>Histórico Contábil</template>
                            <template #textfields>
                              <v-card-text>
                                <v-form class="d-flex flex-column gap-3 w-100">
                                  <v-text-field
                                      label="Descrição do Histórico"
                                      variant="outlined"
                                      density="comfortable"
                                      hide-details="auto"
                                      v-model="descricaoHistorico"
                                  />
                                </v-form>
                              </v-card-text>
                            </template>
                          </CadastrarModal>
                        </v-col>


                        <!-- Valor Original (Obrigatório) -->
                        <v-col cols="12" md="2">
                          <v-text-field
                              v-model="formData.vlroriginal"
                              label="Valor Original *"
                              :rules="[rules.required, rules.currency]"
                              type="number"
                              step="0.01"
                              variant="outlined"
                              density="compact"
                              class="required-left-border"
                              prepend-inner-icon="mdi-currency-usd"
                              prefix="R$"
                              :hint="formData.vlroriginal ? formatarMoeda(formData.vlroriginal) : ''"
                              persistent-hint
                          ></v-text-field>
                        </v-col>

                        <!-- Quantidade de Parcelas -->
                        <v-col cols="12" md="2">
                          <v-text-field
                              v-model.number="formData.qtdparcelas"
                              label="Qtd Parcelas"
                              type="number"
                              min="1"
                              variant="outlined"
                              density="compact"
                              class=""
                              prepend-inner-icon="mdi-format-list-numbered"
                          ></v-text-field>
                        </v-col>

                        <!-- Data de Emissão (Obrigatório) -->
                        <v-col cols="12" md="2">
                          <v-text-field
                              v-model="formData.dtemissao"
                              label="Data Emissão *"
                              :rules="[rules.required]"
                              type="date"
                              variant="outlined"
                              density="compact"
                              class="required-left-border"
                              prepend-inner-icon="mdi-calendar"
                          ></v-text-field>
                        </v-col>


                        <!-- Juros -->
                        <v-col cols="12" md="2">
                          <v-text-field
                              v-model="formData.juros"
                              label="Juros"
                              type="number"
                              step="0.01"
                              variant="outlined"
                              density="compact"
                              class=""
                              prefix="R$"
                              prepend-inner-icon="mdi-percent"
                              :hint="formData.juros ? formatarMoeda(formData.juros) : ''"
                              persistent-hint
                          ></v-text-field>
                        </v-col>

                        <!-- Multa -->
                        <v-col cols="12" md="2">
                          <v-text-field
                              v-model="formData.multa"
                              label="Multa"
                              type="number"
                              step="0.01"
                              variant="outlined"
                              density="compact"
                              class=""
                              prefix="R$"
                              prepend-inner-icon="mdi-alert-circle"
                              :hint="formData.multa ? formatarMoeda(formData.multa) : ''"
                              persistent-hint
                          ></v-text-field>
                        </v-col>

                        <!-- Desconto -->
                        <v-col cols="12" md="2">
                          <v-text-field
                              v-model="formData.desconto"
                              label="Desconto"
                              type="number"
                              step="0.01"
                              variant="outlined"
                              density="compact"
                              class=""
                              prefix="R$"
                              prepend-inner-icon="mdi-sale"
                              :hint="formData.desconto ? formatarMoeda(formData.desconto) : ''"
                              persistent-hint
                          ></v-text-field>
                        </v-col>

                        <!-- Placeholder col for balance -->
                        <v-col cols="12" md="2">
                          <!-- Empty column to maintain layout -->
                        </v-col>

                        <!-- Campos de Cálculo e Botão - Apenas para múltiplas parcelas -->
                        <v-col cols="12" v-if="formData.qtdparcelas > 1 && !parcelasCalculadas">
                          <v-card variant="outlined" class="mb-4" elevation="1">
                            <v-card-title class="text-h6 pa-4 d-flex align-center">
                              <v-icon icon="mdi-calculator-variant" class="mr-2" color="orange"></v-icon>
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
                                      :hint="formData.valor_primeira_parcela ? formatarMoeda(formData.valor_primeira_parcela) : ''"
                                      persistent-hint
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
                                      color="orange"
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
                                <v-icon icon="mdi-format-list-numbered" class="mr-3" color="orange"></v-icon>
                                <h4 class="text-h6 mb-0">Detalhamento das Parcelas</h4>
                                <v-spacer></v-spacer>
                                <v-chip
                                    :color="(parcelas.length === 1 || formData.qtdparcelas === 1) ? 'success' : 'orange'"
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
                                  class="background-secondary"
                                  elevation="2"
                                  :color="themeStore.darkMode ? 'text-white' : ''"
                              >
                                <v-card-text class="background-secondary" :color="themeStore.darkMode ? 'text-white' : ''">
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
                                            :color="item.nrparcela === 1 && valorEntrada > 0 ? 'orange' : 'orange lighten-2'"
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
                                        <v-text-field
                                            v-model="item.localCobrancaTexto"
                                            variant="outlined"
                                            density="compact"
                                            hide-details
                                            placeholder="Selecione o local"
                                            prepend-inner-icon="mdi-map-marker"
                                        >
                                          <template #append-inner>
                                            <LocalCobrancaMenu @selecionar="(local) => selecionarLocalCobranca(local, item)"/>
                                          </template>
                                        </v-text-field>
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
                                          color="orange"
                                      >
                                        <div class="d-flex align-center justify-space-between">
                                          <div class="d-flex align-center">
                                            <v-icon
                                                icon="mdi-chart-pie"
                                                class="mr-2"
                                                size="small"
                                                color="orange"
                                            ></v-icon>
                                            <h5 class="text-subtitle-1 mb-0 font-weight-medium">
                                              Resumo das Parcelas
                                            </h5>
                                          </div>
                                          <v-chip
                                              color="success"
                                              variant="elevated"
                                          >
                                            Total: {{ formatarMoeda(totalParcelas) }}
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

                        <!-- Rateio por Centro de Custo (select acima e tabela de centros selecionados) -->
                        <v-col cols="12" v-if="parcelas.length > 0">
                          <v-card variant="outlined" class="background-secondary mb-4" elevation="1">
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

                              <v-table class="background-secondary" v-else density="compact">
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
                                        label="Selecione *"
                                        variant="outlined"
                                        density="compact"
                                        hide-details
                                        :class="ccustoParametro.utiliza_ccusto === 'S' ? 'required-left-border' : ''"
                                    />
                                    <div v-if="linha.desccentrocusto" class="text-caption text-grey mt-1">
                                      API: {{ linha.desccentrocusto }}
                                    </div>
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
                                        :class="ccustoParametro.utiliza_ccusto === 'S' ? 'required-left-border' : ''"
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
                        </v-col>

                        <!-- Anexar Documento -->
                        <v-col cols="12">
                          <v-card variant="outlined" class="mb-4" elevation="1">
                            <v-card-title class="text-h6 pa-4 d-flex align-center">
                              <v-icon icon="mdi-file-image" class="mr-2" color="orange"></v-icon>
                              Anexar um Documento
                            </v-card-title>

                            <v-card-text class="pa-4">
                              <MediaSave
                                  id-saas="1"
                                  id-usuario="1"
                                  :on-upload-success="handleMediaUpload"
                                  @upload-success="onMediaSuccess"
                                  @upload-error="onMediaError"
                              />

                              <!-- Indicador de imagem anexada -->
                              <v-alert
                                  v-if="formData.id_media || financeiroStore.getMediaKeyTemporaria()"
                                  type="success"
                                  variant="tonal"
                                  density="compact"
                                  class="mt-3"
                              >
                                <div class="d-flex align-center">
                                  <v-icon icon="mdi-check-circle" class="mr-2"></v-icon>
                                  <div>
                                    <strong>Documento anexado com sucesso!</strong>
                                    <br>
                                    <small class="text-medium-emphasis">Key: {{ financeiroStore.getMediaKeyTemporaria() || formData.id_media }}</small>
                                  </div>
                                </div>
                              </v-alert>
                            </v-card-text>
                          </v-card>
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
                        :disabled="!formValidoComCCusto"
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

            <!-- Busca Avançada -->
            <div v-if="!formularioAberto" class="my-4">
              <BuscaAvancada
                  v-model="filtrosAvancados"
                  @aplicar="aplicarFiltrosAvancados"
              />
            </div>

            <!-- Tabela de Contas a Pagar -->
            <TabelaPadrao
                :formulario-aberto="formularioAberto"
                :headers="headers"
                :items="contasPagarFiltradas"
                :loading="loading"
                :search="search"
                @update:search="(value) => search = value"
                search-label="Pesquisar Parcelas"
                item-key="id"
                no-data-icon="mdi-credit-card-outline"
                no-data-text="Nenhuma registro encontrado."
                :show-custom-action="false"
                delete-dialog-message="Esta ação excluirá esta parcela específica. Não pode ser desfeita."
                delete-item-display-field="nrdocumento"
                @edit-item="editarContaPagar"
                @confirm-delete="excluirContaPagar"
            >
              <!-- Coluna de Imagem -->
              <template v-slot:[`item.imagem`]="{ item }">
                <MediaShow
                    v-if="item.id_media"
                    :image-key="item.id_media"
                    height="40"
                    width="40"
                    :show-actions="false"
                    :show-loading-text="false"
                    no-image-text=""
                    class="rounded"
                />
                <v-icon
                    v-else
                    icon="mdi-image-off-outline"
                    size="20"
                    color="grey"
                ></v-icon>
              </template>

              <!-- Formatação para Valor do Documento -->
              <template v-slot:[`item.vlrdocumento`]="{ item }">
                <span class="font-weight-medium">{{ formatarMoeda(item.vlrdocumento) }}</span>
              </template>

              <!-- Formatação para Valor da Parcela -->
              <template v-slot:[`item.vlrparcela`]="{ item }">
                <v-chip
                    :color="parseFloat(item.vlrparcela) > 1000 ? 'orange' : 'primary'"
                    variant="tonal"
                    size="small"
                >
                  {{ formatarMoeda(item.vlrparcela) }}
                </v-chip>
              </template>

              <!-- Formatação para Saldo Devedor -->
              <template v-slot:[`item.saldo_devedor`]="{ item }">
            <span v-if="item.pag_utiliza_aut_pagto === 'N'" class="font-weight-medium">
              {{ formatarMoeda(item.saldo_devedor) }}
            </span>
                <span v-else class="text-grey">-</span>
              </template>

              <!-- Formatação para Valor Quitado -->
              <template v-slot:[`item.vlrquitado`]="{ item }">
            <span v-if="item.pag_utiliza_aut_pagto === 'N'" class="font-weight-medium text-success">
              {{ formatarMoeda(item.vlrquitado) }}
            </span>
                <span v-else class="text-grey">-</span>
              </template>

              <!-- Autorizado Por -->
              <template v-slot:[`item.user_liberou`]="{ item }">
            <span v-if="item.pag_utiliza_aut_pagto === 'S' && item.user_liberou" class="font-weight-medium">
              {{ item.user_liberou }}
            </span>
                <span v-else class="text-grey">-</span>
              </template>

              <!-- Valor Autorizado -->
              <template v-slot:[`item.vlrliberadopagto`]="{ item }">
            <span v-if="item.pag_utiliza_aut_pagto === 'S' && item.vlrliberadopagto > 0" class="font-weight-medium text-success">
              {{ formatarMoeda(item.vlrliberadopagto) }}
            </span>
                <span v-else class="text-grey">-</span>
              </template>

              <!-- Data de Autorização -->
              <template v-slot:[`item.dhliberacaopagto`]="{ item }">
            <span v-if="item.pag_utiliza_aut_pagto === 'S' && item.dhliberacaopagto">
              {{ formatarDataHora(item.dhliberacaopagto) }}
            </span>
                <span v-else class="text-grey">-</span>
              </template>

              <!-- Formatação para Data de Emissão -->
              <template v-slot:[`item.dtemissao`]="{ item }">
            <span v-if="item.dtemissao">
              {{ new Date(item.dtemissao + 'T00:00:00').toLocaleDateString('pt-BR') }}
            </span>
                <span v-else class="text-grey">-</span>
              </template>

              <!-- Formatação para Data de Vencimento -->
              <template v-slot:[`item.dtvencimento`]="{ item }">
            <span v-if="item.dtvencimento">
              {{ new Date(item.dtvencimento + 'T00:00:00').toLocaleDateString('pt-BR') }}
            </span>
                <span v-else class="text-grey">-</span>
              </template>

              <!-- Formatação para Data de Inclusão -->
              <template v-slot:[`item.dhinc`]="{ item }">
            <span v-if="item.dhinc">
              {{ formatarDataHora(item.dhinc) }}
            </span>
                <span v-else class="text-grey">-</span>
              </template>

              <!-- Formatação do fornecedor com truncamento -->
              <template v-slot:[`item.fornecedor`]="{ item }">
                <v-tooltip location="top">
                  <template v-slot:activator="{ props }">
                    <span v-bind="props" class="fornecedor-truncado">
                      {{ item.fornecedor || '--' }}
                    </span>
                  </template>
                  <span>{{ item.fornecedor || 'Sem fornecedor' }}</span>
                </v-tooltip>
              </template>

              <!-- Ações personalizadas -->
              <template v-slot:[`item.actions`]="{ item }">
                <div class="d-flex gap-1">
                  <!-- Editar -->
                  <v-btn
                      icon="mdi-pencil"
                      size="small"
                      color="primary"
                      variant="text"
                      title="Editar"
                      @click="editarContaPagar(item)"
                  ></v-btn>

                  <!-- Excluir -->
                  <v-btn
                      icon="mdi-delete"
                      size="small"
                      color="error"
                      variant="text"
                      title="Excluir"
                      @click="confirmarExclusao(item)"
                  ></v-btn>
                </div>
              </template>
            </TabelaPadrao>
          </v-card-text>
        </v-card>





        <!-- Dialog de Confirmação de Exclusão -->
        <v-dialog
            v-model="dialogExclusao.aberto"
            max-width="400px"
            persistent
        >
          <v-card>
            <v-card-title class="text-h6">
              <v-icon icon="mdi-delete-alert" color="error" class="mr-2"></v-icon>
              Confirmar Exclusão
            </v-card-title>
            <v-card-text>
              Tem certeza que deseja excluir a parcela do documento
              <strong>{{ dialogExclusao.item?.nrdocumento }}</strong>?
              <br><br>
              Esta ação não pode ser desfeita.
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                  color="grey"
                  variant="text"
                  @click="dialogExclusao.aberto = false"
              >
                Cancelar
              </v-btn>
              <v-btn
                  color="error"
                  variant="flat"
                  @click="confirmarExclusaoFinal"
                  :loading="loading"
              >
                Excluir
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Modal de Exportação/Impressão -->
        <ExportacaoModal
            v-model="modalExportacaoAberto"
            :dados="contasPagarFiltradas"
            :filtros="filtrosAvancados"
            nome-relatorio="Contas a Pagar"
            @exportar-pdf="handleExportarPDF"
            @exportar-csv="handleExportarCSV"
            @exportar-excel="handleExportarExcel"
            @imprimir="handleImprimir"
        ></ExportacaoModal>

        <!-- Modal de Preview do PDF -->
        <PdfPreviewModal
            v-model="modalPreviewPDF"
            :html-content="previewHTMLContent"
            :nome-relatorio="dadosPDFAtual?.nomeRelatorio || 'Contas_a_Pagar'"
        />

        <!-- Modal de Importar XML NFe -->
        <v-dialog
            v-model="modalImportarXML"
            max-width="900px"
            persistent
        >
          <v-card class="align-center justify-center d-flex">
            <v-card-title class="text-h6 pa-4 d-flex align-center">
              <v-icon icon="mdi-file-xml-box" color="orange" class="mr-2"></v-icon>
              Importar Conta a Pagar de XML (NFe)
              <v-spacer></v-spacer>
              <v-btn icon="mdi-close" variant="text" @click="fecharModalImportarXML"></v-btn>
            </v-card-title>

            <v-divider></v-divider>

            <v-card-text class="pa-4">
              <!-- Upload do arquivo XML -->
              <div v-if="!dadosXMLImportado">
                <v-file-input
                    v-model="arquivoXML"
                    label="Selecione o arquivo XML da NFe"
                    accept=".xml"
                    prepend-icon="mdi-file-xml-box"
                    variant="outlined"
                    density="comfortable"
                    @update:modelValue="processarArquivoXML"
                    :loading="processandoXML"
                    show-size
                ></v-file-input>

                <v-alert
                    v-if="erroXML"
                    type="error"
                    variant="tonal"
                    class="mt-3"
                    closable
                    @click:close="erroXML = ''"
                >
                  {{ erroXML }}
                </v-alert>
              </div>

              <!-- Dados extraídos do XML -->
              <div v-else>
                <v-alert type="success" variant="tonal" class="mb-4" density="compact">
                  <div class="d-flex align-center">
                    <v-icon icon="mdi-check-circle" class="mr-2"></v-icon>
                    XML processado com sucesso!
                    <v-chip size="small" class="ml-2" :color="dadosXMLImportado.tipoNota === 'NFSe' ? 'blue' : 'green'" variant="flat">
                      {{ dadosXMLImportado.tipoNota === 'NFSe' ? 'Nota de Serviço' : 'Nota de Produto' }}
                    </v-chip>
                  </div>
                </v-alert>

                <!-- Informações do Emitente (Fornecedor) -->
                <v-card variant="outlined" class="mb-4">
                  <v-card-title class="text-subtitle-1 pa-3 d-flex align-center">
                    <v-icon icon="mdi-account-box" class="mr-2" color="orange"></v-icon>
                    Emitente (Fornecedor)
                  </v-card-title>
                  <v-card-text class="pa-3">
                    <v-row dense>
                      <v-col cols="12" md="6">
                        <div class="text-caption text-grey">Razão Social</div>
                        <div class="text-body-1 font-weight-medium">{{ dadosXMLImportado.emitente.razaoSocial }}</div>
                      </v-col>
                      <v-col cols="12" md="3">
                        <div class="text-caption text-grey">CNPJ/CPF</div>
                        <div class="text-body-1">{{ formatarCNPJ(dadosXMLImportado.emitente.cnpj || dadosXMLImportado.emitente.cpf) }}</div>
                      </v-col>
                      <v-col cols="12" md="3">
                        <div class="text-caption text-grey">{{ dadosXMLImportado.tipoNota === 'NFSe' ? 'IM' : 'IE' }}</div>
                        <div class="text-body-1">{{ dadosXMLImportado.emitente.im || dadosXMLImportado.emitente.ie || 'N/A' }}</div>
                      </v-col>
                      <v-col cols="12" v-if="dadosXMLImportado.emitente.email">
                        <div class="text-caption text-grey">E-mail</div>
                        <div class="text-body-2">{{ dadosXMLImportado.emitente.email }}</div>
                      </v-col>
                      <v-col cols="12">
                        <div class="text-caption text-grey">Endereço</div>
                        <div class="text-body-2">
                          {{ dadosXMLImportado.emitente.endereco.logradouro }}, {{ dadosXMLImportado.emitente.endereco.numero }}
                          <template v-if="dadosXMLImportado.emitente.endereco.complemento"> - {{ dadosXMLImportado.emitente.endereco.complemento }}</template>
                          - {{ dadosXMLImportado.emitente.endereco.bairro }},
                          {{ dadosXMLImportado.emitente.endereco.cidade || dadosXMLImportado.emitente.endereco.codigoMunicipio }}/{{ dadosXMLImportado.emitente.endereco.uf }}
                        </div>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>

                <!-- Alerta: Fornecedor não encontrado -->
                <v-alert
                    v-if="fornecedorNaoEncontrado"
                    type="warning"
                    variant="tonal"
                    class="mb-4"
                    density="compact"
                    icon="mdi-alert-circle"
                >
                  <strong>Fornecedor não cadastrado!</strong>
                  O fornecedor <strong>{{ dadosFornecedorNovo?.razaoSocial || dadosFornecedorNovo?.nomeFantasia }}</strong>
                  (CNPJ: {{ formatarCNPJ(dadosFornecedorNovo?.cnpj) }}) será criado automaticamente ao confirmar.
                </v-alert>

                <!-- Dados da NFe/NFSe -->
                <v-card variant="outlined" class="mb-4">
                  <v-card-title class="text-subtitle-1 pa-3 d-flex align-center">
                    <v-icon icon="mdi-file-document" class="mr-2" color="orange"></v-icon>
                    Dados da {{ dadosXMLImportado.tipoNota === 'NFSe' ? 'Nota Fiscal de Serviço' : 'Nota Fiscal' }}
                  </v-card-title>
                  <v-card-text class="pa-3">
                    <v-row dense>
                      <v-col cols="6" md="2">
                        <div class="text-caption text-grey">Número</div>
                        <div class="text-body-1 font-weight-medium">{{ dadosXMLImportado.nfe.numero }}</div>
                      </v-col>
                      <v-col cols="6" md="2">
                        <div class="text-caption text-grey">Série</div>
                        <div class="text-body-1">{{ dadosXMLImportado.nfe.serie }}</div>
                      </v-col>
                      <v-col cols="12" md="3">
                        <div class="text-caption text-grey">Data Emissão</div>
                        <div class="text-body-1">{{ formatarDataHora(dadosXMLImportado.nfe.dataEmissao) }}</div>
                      </v-col>
                      <v-col cols="12" md="5" v-if="dadosXMLImportado.nfe.chaveAcesso">
                        <div class="text-caption text-grey">Chave de Acesso</div>
                        <div class="text-body-2" style="word-break: break-all;">{{ dadosXMLImportado.nfe.chaveAcesso }}</div>
                      </v-col>
                      <v-col cols="12" md="6">
                        <div class="text-caption text-grey">{{ dadosXMLImportado.tipoNota === 'NFSe' ? 'Descrição do Serviço' : 'Natureza da Operação' }}</div>
                        <div class="text-body-1">{{ dadosXMLImportado.nfe.naturezaOperacao }}</div>
                      </v-col>
                      <v-col cols="6" md="3">
                        <div class="text-caption text-grey">Tipo</div>
                        <div class="text-body-1">{{ dadosXMLImportado.nfe.modelo }} ({{ dadosXMLImportado.tipoNota }})</div>
                      </v-col>
                      <v-col cols="6" md="3" v-if="dadosXMLImportado.nfe.localEmissao">
                        <div class="text-caption text-grey">Local Emissão</div>
                        <div class="text-body-1">{{ dadosXMLImportado.nfe.localEmissao }}</div>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>

                <!-- Valores -->
                <v-card variant="outlined" class="mb-4">
                  <v-card-title class="text-subtitle-1 pa-3 d-flex align-center">
                    <v-icon icon="mdi-currency-usd" class="mr-2" color="orange"></v-icon>
                    Valores
                  </v-card-title>
                  <v-card-text class="pa-3">
                    <v-row dense>
                      <!-- Para NFe (Produtos) -->
                      <template v-if="dadosXMLImportado.tipoNota !== 'NFSe'">
                        <v-col cols="6" md="3">
                          <div class="text-caption text-grey">Valor Produtos</div>
                          <div class="text-body-1">{{ formatarMoeda(dadosXMLImportado.valores.valorProdutos) }}</div>
                        </v-col>
                        <v-col cols="6" md="2">
                          <div class="text-caption text-grey">Frete</div>
                          <div class="text-body-1">{{ formatarMoeda(dadosXMLImportado.valores.valorFrete) }}</div>
                        </v-col>
                        <v-col cols="6" md="2">
                          <div class="text-caption text-grey">Desconto</div>
                          <div class="text-body-1">{{ formatarMoeda(dadosXMLImportado.valores.valorDesconto) }}</div>
                        </v-col>
                        <v-col cols="6" md="2">
                          <div class="text-caption text-grey">Outros</div>
                          <div class="text-body-1">{{ formatarMoeda(dadosXMLImportado.valores.valorOutro) }}</div>
                        </v-col>
                      </template>
                      <!-- Para NFSe (Serviços) -->
                      <template v-else>
                        <v-col cols="6" md="3">
                          <div class="text-caption text-grey">Valor Serviços</div>
                          <div class="text-body-1">{{ formatarMoeda(dadosXMLImportado.valores.valorServicos) }}</div>
                        </v-col>
                        <v-col cols="6" md="2">
                          <div class="text-caption text-grey">Base Cálculo</div>
                          <div class="text-body-1">{{ formatarMoeda(dadosXMLImportado.valores.baseCalculo) }}</div>
                        </v-col>
                        <v-col cols="6" md="2">
                          <div class="text-caption text-grey">Alíquota ISS</div>
                          <div class="text-body-1">{{ dadosXMLImportado.valores.aliquotaISS }}%</div>
                        </v-col>
                        <v-col cols="6" md="2">
                          <div class="text-caption text-grey">Valor ISS</div>
                          <div class="text-body-1">{{ formatarMoeda(dadosXMLImportado.valores.valorISS) }}</div>
                        </v-col>
                      </template>
                      <v-col cols="12" md="3">
                        <div class="text-caption text-grey">Valor Total</div>
                        <div class="text-h6 font-weight-bold" style="color: var(--text-color-laranja)">
                          {{ formatarMoeda(dadosXMLImportado.valores.valorTotalNF || dadosXMLImportado.valores.valorServicos) }}
                        </div>
                      </v-col>
                    </v-row>

                    <!-- Tributos Retidos (somente para NFSe) -->
                    <template v-if="dadosXMLImportado.tipoNota === 'NFSe' && dadosXMLImportado.valores.valorRetencoes > 0">
                      <v-divider class="my-3"></v-divider>
                      <div class="text-subtitle-2 mb-2">
                        <v-icon icon="mdi-receipt-text-minus" size="small" class="mr-1"></v-icon>
                        Tributos Retidos
                      </div>
                      <v-row dense>
                        <v-col cols="6" md="2" v-if="dadosXMLImportado.valores.valorPIS > 0">
                          <div class="text-caption text-grey">PIS</div>
                          <div class="text-body-2 text-error">{{ formatarMoeda(dadosXMLImportado.valores.valorPIS) }}</div>
                        </v-col>
                        <v-col cols="6" md="2" v-if="dadosXMLImportado.valores.valorCOFINS > 0">
                          <div class="text-caption text-grey">COFINS</div>
                          <div class="text-body-2 text-error">{{ formatarMoeda(dadosXMLImportado.valores.valorCOFINS) }}</div>
                        </v-col>
                        <v-col cols="6" md="2" v-if="dadosXMLImportado.valores.valorIRRF > 0">
                          <div class="text-caption text-grey">IRRF</div>
                          <div class="text-body-2 text-error">{{ formatarMoeda(dadosXMLImportado.valores.valorIRRF) }}</div>
                        </v-col>
                        <v-col cols="6" md="2" v-if="dadosXMLImportado.valores.valorCSLL > 0">
                          <div class="text-caption text-grey">CSLL</div>
                          <div class="text-body-2 text-error">{{ formatarMoeda(dadosXMLImportado.valores.valorCSLL) }}</div>
                        </v-col>
                        <v-col cols="6" md="2" v-if="dadosXMLImportado.valores.valorINSS > 0">
                          <div class="text-caption text-grey">INSS</div>
                          <div class="text-body-2 text-error">{{ formatarMoeda(dadosXMLImportado.valores.valorINSS) }}</div>
                        </v-col>
                        <v-col cols="6" md="2">
                          <div class="text-caption text-grey">Total Retido</div>
                          <div class="text-body-1 font-weight-bold text-error">{{ formatarMoeda(dadosXMLImportado.valores.valorRetencoes) }}</div>
                        </v-col>
                        <v-col cols="12" md="3">
                          <div class="text-caption text-grey">Valor Líquido</div>
                          <div class="text-h6 font-weight-bold" style="color: #4CAF50;">
                            {{ formatarMoeda(dadosXMLImportado.valores.valorLiquido) }}
                          </div>
                        </v-col>
                      </v-row>
                    </template>
                  </v-card-text>
                </v-card>

                <!-- Pagamento (somente para NFe) -->
                <v-card variant="outlined" class="mb-4" v-if="dadosXMLImportado.pagamento && dadosXMLImportado.pagamento.length > 0">
                  <v-card-title class="text-subtitle-1 pa-3 d-flex align-center">
                    <v-icon icon="mdi-credit-card" class="mr-2" color="orange"></v-icon>
                    Pagamento
                  </v-card-title>
                  <v-card-text class="pa-3">
                    <v-table density="compact">
                      <thead>
                        <tr>
                          <th>Forma de Pagamento</th>
                          <th>Valor</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(pag, index) in dadosXMLImportado.pagamento" :key="index">
                          <td>{{ getDescricaoFormaPagamento(pag.tipo) }}</td>
                          <td>{{ formatarMoeda(pag.valor) }}</td>
                        </tr>
                      </tbody>
                    </v-table>
                  </v-card-text>
                </v-card>

                <!-- Produtos/Serviços (collapsible) -->
                <v-expansion-panels class="mb-4" v-if="dadosXMLImportado.produtos && dadosXMLImportado.produtos.length > 0">
                  <v-expansion-panel>
                    <v-expansion-panel-title>
                      <v-icon :icon="dadosXMLImportado.tipoNota === 'NFSe' ? 'mdi-briefcase' : 'mdi-package-variant-closed'" class="mr-2" color="orange"></v-icon>
                      {{ dadosXMLImportado.tipoNota === 'NFSe' ? 'Serviços' : 'Produtos/Itens' }} ({{ dadosXMLImportado.produtos.length }})
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                      <v-table density="compact">
                        <thead>
                          <tr>
                            <th>Cód.</th>
                            <th>Descrição</th>
                            <th v-if="dadosXMLImportado.tipoNota !== 'NFSe'">NCM</th>
                            <th class="text-right">Qtd</th>
                            <th v-if="dadosXMLImportado.tipoNota !== 'NFSe'">Unid.</th>
                            <th class="text-right">Vlr Unit.</th>
                            <th class="text-right">Vlr Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(prod, index) in dadosXMLImportado.produtos" :key="index">
                            <td>{{ prod.codigo || prod.codigoMunicipal || '-' }}</td>
                            <td>{{ prod.descricao }}</td>
                            <td v-if="dadosXMLImportado.tipoNota !== 'NFSe'">{{ prod.ncm }}</td>
                            <td class="text-right">{{ prod.quantidade }}</td>
                            <td v-if="dadosXMLImportado.tipoNota !== 'NFSe'">{{ prod.unidade }}</td>
                            <td class="text-right">{{ formatarMoeda(prod.valorUnitario) }}</td>
                            <td class="text-right">{{ formatarMoeda(prod.valorTotal) }}</td>
                          </tr>
                        </tbody>
                      </v-table>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>

                <!-- Opções para importação -->
                <v-card variant="outlined">
                  <v-card-title class="text-subtitle-1 pa-3 d-flex align-center">
                    <v-icon icon="mdi-cog" class="mr-2" color="orange"></v-icon>
                    Opções de Importação
                  </v-card-title>
                  <v-card-text class="pa-3">
                    <v-row>
                      <v-col cols="12" md="4">
                        <v-text-field
                            v-model.number="opcoesImportXML.qtdParcelas"
                            label="Quantidade de Parcelas"
                            type="number"
                            min="1"
                            variant="outlined"
                            density="compact"
                            prepend-inner-icon="mdi-format-list-numbered"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field
                            v-model="opcoesImportXML.dataVencimento"
                            label="Data Primeiro Vencimento"
                            type="date"
                            variant="outlined"
                            density="compact"
                            prepend-inner-icon="mdi-calendar"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field
                            v-model.number="opcoesImportXML.intervaloParcelas"
                            label="Intervalo entre Parcelas (dias)"
                            type="number"
                            min="1"
                            variant="outlined"
                            density="compact"
                            prepend-inner-icon="mdi-calendar-range"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </div>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions class="pa-4">
              <v-btn
                  color="grey"
                  variant="text"
                  @click="fecharModalImportarXML"
              >
                Cancelar
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                  v-if="dadosXMLImportado"
                  color="grey"
                  variant="outlined"
                  prepend-icon="mdi-refresh"
                  @click="limparDadosXML"
              >
                Importar Outro
              </v-btn>
              <v-btn
                  v-if="dadosXMLImportado"
                  color="var(--text-color-laranja)"
                  variant="flat"
                  class="text-white"
                  prepend-icon="mdi-check"
                  @click="confirmarImportacaoXML"
                  :loading="loading"
              >
                Usar Dados para Nova Conta
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

        <!-- Modal de Acesso Negado -->
        <AcessoNegadoModal
            v-model="acessoNegadoModal"
            :nome-programa="'Lançamentos de Contas a Pagar'"
            :tipo-acesso="tipoAcessoNegado"
        />
      </div>
    </template>
  </top-all-pages>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useThemeStore } from '@/stores/config-temas/theme'
import { useFinanceiroStore } from '@/stores/APIs/financeiro'
import { useCCustoStore } from '@/stores/APIs/ccusto'
import { usePermissoes } from '@/utils/usePermissoes'
import { toast } from 'vue3-toastify'
import { abrirImpressaoTitulos, gerarHTMLTitulos } from '@/components/impressos/titulos'
import ExportacaoModal from '@/components/base/modais/ExportacaoModal.vue'
import PdfPreviewModal from '@/components/base/modais/PdfPreviewModal.vue'
// eslint-disable-next-line no-unused-vars
import AcessoNegadoModal from '@/components/base/modais/AcessoNegadoModal.vue'
import TabelaPadrao from '@/components/base/padrao-paginas/TabelaPadrao.vue'
import BuscaAvancada from '@/components/base/padrao-paginas/BuscaAvancada.vue'
import TipoDocumentoMenu from '@/components/base/menu/TipoDocumentoMenu.vue'
import LocalCobrancaMenu from '@/components/base/menu/LocalCobrancaMenu.vue'
import MediaSave from '@/components/base/media/MediaSave.vue'
import MediaShow from '@/components/base/media/MediaShow.vue'
import BuscaPadraoMenu from '@/components/base/menu/BuscaPadraoMenu.vue'
import CadastrarModal from '@/components/base/modais/CadastrarModal.vue'
// eslint-disable-next-line no-unused-vars
import numeric from 'numeric'
import apiPhp from '@/services/apiPhp'
import TopAllPages from "@/components/base/padrao-paginas/TopAllPages.vue";

// ID do programa desta tela
// eslint-disable-next-line no-unused-vars
const ID_PROGRAMA = 'FFIN205E'

const route = useRoute()
const themeStore = useThemeStore()
const financeiroStore = useFinanceiroStore()
const ccustoStore = useCCustoStore()
// eslint-disable-next-line no-unused-vars
const { podeVisualizar, podeIncluir, podeAlterar, podeExcluir, podeExportar, podePDF } = usePermissoes()

// Modal de acesso negado
// eslint-disable-next-line no-unused-vars
const acessoNegadoModal = ref(false)
// eslint-disable-next-line no-unused-vars
const tipoAcessoNegado = ref('')

// Refs
const formularioAberto = ref(false)
const editando = ref(false)
const formValido = ref(false)
const formRef = ref(null)
const search = ref('')
const loading = ref(false)
const filtrosAvancados = ref({})

// Estado dos dados
const contasPagar = ref([])
const parcelas = ref([])
const totalParcelas = ref(0)
const valorEntrada = ref(0)
// Flag para controlar quando as parcelas já foram calculadas (esconder configurações)
const parcelasCalculadas = ref(false)

// Flag para suprimir o watcher que limpa parcelas enquanto carregamos um documento existente
const suppressParcelWatcher = ref(false)

// Rateio por centro de custo
const centrosCusto = ref([])

// Parâmetro de centro de custo (obrigatoriedade)
const ccustoParametro = ref({
  utiliza_ccusto: 'N'
})

// Array direto de rateios (simplificado)
const ccustosRateio = ref([])

const totalRateadoValor = computed(() => {
  return ccustosRateio.value.reduce((s, r) => s + (parseFloat(r.valor) || 0), 0)
})

const totalRateadoPercent = computed(() => {
  return ccustosRateio.value.reduce((s, r) => s + (parseFloat(r.porcentagem) || 0), 0)
})



// Paginação das parcelas
const currentPageParcelas = ref(1)
const itemsPerPageParcelas = ref(10)

// Snackbar
const snackbar = reactive({
  show: false,
  message: '',
  color: 'success'
})

// Modal de Exportação/Impressão
const modalExportacaoAberto = ref(false)

// Modal de Preview do PDF
const modalPreviewPDF = ref(false)
const previewHTMLContent = ref('')
const dadosPDFAtual = ref(null)

// Modal de Importar XML
const modalImportarXML = ref(false)
const arquivoXML = ref(null)
const processandoXML = ref(false)
const erroXML = ref('')
const dadosXMLImportado = ref(null)
const opcoesImportXML = reactive({
  qtdParcelas: 1,
  dataVencimento: '',
  intervaloParcelas: 30
})

// Status do fornecedor durante importação XML
const fornecedorNaoEncontrado = ref(false)
const dadosFornecedorNovo = ref(null)

// Dialog de confirmação de exclusão
const dialogExclusao = reactive({
  aberto: false,
  item: null
})

// Headers da tabela - computados dinamicamente baseado na utilização de autorização
const headers = computed(() => {
  const baseHeaders = [
    { title: '', key: 'imagem', sortable: false, width: '60px' },
    { title: 'Documento', key: 'nrdocumento', sortable: true },
    { title: 'Série', key: 'serie', sortable: true },
    { title: 'Espécie', key: 'especie', sortable: true },
    { title: 'Parcela', key: 'id_pagparcela', sortable: true },
    { title: 'Qtd Total', key: 'qtdparcelas', sortable: true },
    { title: 'Data Emissão', key: 'dtemissao', sortable: true },
    { title: 'Vencimento', key: 'dtvencimento', sortable: true },
    { title: 'Fornecedor', key: 'fornecedor', sortable: true, width: '200px' },
    { title: 'Vlr Documento', key: 'vlrdocumento', sortable: true },
    { title: 'Vlr Parcela', key: 'vlrparcela', sortable: true },
    { title: 'Vlr Quitado', key: 'vlrquitado', sortable: true },
    { title: 'Saldo Devedor', key: 'saldo_devedor', sortable: true }
  ]

  // Verificar se algum item tem autorização ativa para mostrar as colunas de autorização
  const temAutorizacao = contasPagar.value.some(item => item.pag_utiliza_aut_pagto === 'S')

  if (temAutorizacao) {
    baseHeaders.push(
        { title: 'Autorizado Por', key: 'user_liberou', sortable: true },
        { title: 'Vlr Autorizado', key: 'vlrliberadopagto', sortable: true },
        { title: 'Data Autorização', key: 'dhliberacaopagto', sortable: true }
    )
  }

  baseHeaders.push(
      { title: 'Origem', key: 'origem', sortable: true },
      { title: 'Tipo Doc.', key: 'abreviatura', sortable: true },
      { title: 'Local Cobrança', key: 'desclocalcobranca', sortable: true },
      { title: 'Usuário', key: 'user_inc', sortable: true },
      { title: 'Data Inclusão', key: 'dhinc', sortable: true },
      { title: 'Ações', key: 'actions', sortable: false }
  )

  return baseHeaders
})

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
  id_red_ctb_for: null,
  id_planoconta: null,
  id_historicocontabil: null,
  observacao: '',
  vlroriginal: null,
  qtdparcelas: 1,
  dtemissao: new Date().toISOString().split('T')[0], // Data atual
  // Campos simplificados
  juros: 0,
  multa: 0,
  desconto: 0,
  valor_primeira_parcela: 0,
  venc_primeira_parcela: '',
  intervalo_parcelas: 30,
  // ID da media anexada (key retornada da API)
  id_media: '',
  // Array de centros de custo para rateio
  ccustos: [] // [{ id_ccusto, valor, desccentrocusto, porcentagem }]
})

// ID da empresa (temporário - deve vir do contexto/autenticação)
const idEmpresa = ref(1) // TODO: Obter do contexto de autenticação

// Dados dos dropdowns
const tiposDocumento = ref([])
const locaisCobranca = ref([])
const pessoas = ref([])

// Campos de texto para os menus
const tipoDocumentoSelecionado = ref('')
const fornecedorSelecionado = ref('')
const planoContaSearch = ref('')

// Histórico Contábil (campo de busca + modal de cadastro)
const menuHistContabil = ref(false)
const termoHistContabil = ref('')
const cadastrarHistoricoModal = ref(false)
const historicoContabilResultados = ref([])
const histContabilLabel = ref('')
const descricaoHistorico = ref('')

// Fornecedor (campo de busca)
const menuFornecedor = ref(false)
const termoFornecedor = ref('')
const fornecedorResultados = ref([])

// Fornecedor autocomplete
const fornecedorSearch = ref('')
const fornecedorLoading = ref(false)
let fornecedorSearchTimer = null

// Planos de conta formatados
const planosContaDisponiveis = computed(() => {
  const planos = financeiroStore.planosConta || []
  return planos.map(plano => ({
    ...plano,
    label: `${plano.id_classificador || ''} - ${plano.descconta || plano.descricao || ''}`
  }))
})

// store label/name of selected fornecedor to ensure we can include it in payload
const fornecedorLabel = ref('')

// Buscar fornecedor específico por ID (usado ao editar documento)
const buscarFornecedorPorId = async (idFornecedor) => {
  try {
    fornecedorLoading.value = true

    // Busca o fornecedor pelo ID na API - isso faz GET /pessoafor/:idempresa?find=ID
    const items = await financeiroStore.buscarPessoasFornecedores(String(idFornecedor), idEmpresa.value)

    if (items && items.length > 0) {
      const fornecedor = items[0]

      // Atualizar a lista de pessoas com o fornecedor encontrado
      pessoas.value = [fornecedor]

      // Preencher o label do fornecedor
      fornecedorLabel.value = fornecedor.apelido_fantasia || fornecedor.nome_razao || fornecedor.nome || ''

      // Atualizar o valor de busca para exibir no autocomplete
      fornecedorSearch.value = fornecedorLabel.value

      // IMPORTANTE: Capturar id_red_ctb_for da resposta da API
      if (fornecedor.id_red_ctb_for || fornecedor.id_red_ctb) {
        formData.id_red_ctb_for = fornecedor.id_red_ctb_for || fornecedor.id_red_ctb
      }

      return fornecedor
    } else {
      console.warn('Fornecedor não encontrado com ID:', idFornecedor)
      return null
    }
  } catch (err) {
    console.error('Erro ao buscar fornecedor por ID:', err)
    return null
  } finally {
    fornecedorLoading.value = false
  }
}

// Debounced remote search for fornecedores
watch(fornecedorSearch, (val) => {
  if (fornecedorSearchTimer) clearTimeout(fornecedorSearchTimer)

  const searchValue = String(val || '').trim()

  // Validação: se for numérico, aceita 1+ dígito; se for texto, precisa 3+ caracteres
  const isNumeric = /^\d+$/.test(searchValue)
  const minLength = isNumeric ? 1 : 3

  if (!searchValue || searchValue.length < minLength) {
    pessoas.value = []
    fornecedorLoading.value = false
    return
  }

  fornecedorSearchTimer = setTimeout(async () => {
    try {
      console.debug('Buscando fornecedores para:', searchValue, isNumeric ? '(numérico)' : '(texto)')
      fornecedorLoading.value = true
      const items = await financeiroStore.buscarPessoasFornecedores(searchValue, idEmpresa.value)
      console.debug('Fornecedores retornados:', items?.length)
      pessoas.value = items || []
    } catch (err) {
      console.error('Erro buscando fornecedores:', err)
      pessoas.value = []
    } finally {
      fornecedorLoading.value = false
    }
  }, 300)
})



// Função para formatação monetária brasileira
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

// Função para formatação de data e hora brasileira
const formatarDataHora = (dataHora) => {
  if (!dataHora) return '--'
  try {
    return new Date(dataHora).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return '--'
  }
}

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
  if (!Array.isArray(dados)) return []

  // Toda filtragem é feita pela API
  return dados
})

// Calcular o valor total das parcelas filtradas
const totalParcelasFiltradas = computed(() => {
  return contasPagarFiltradas.value.reduce((total, item) => {
    const valor = parseFloat(item.vlrparcela || 0)
    return total + valor
  }, 0)
})

// Validar se o formulário está realmente válido (inclui ccusto obrigatório)
const formValidoComCCusto = computed(() => {
  // Primeiro verificar se o formulário está válido
  if (!formValido.value) {
    console.log('Formulário inválido - preencha todos os campos obrigatórios')
    return false
  }

  // Se centro de custo é obrigatório, verificar se foi selecionado com valor válido
  const utilizaCCusto = ccustoParametro.value?.utiliza_ccusto?.trim?.() === 'S' || ccustoParametro.value?.utiliza_ccusto === 'S'

  if (utilizaCCusto) {
    const temCCustoValido = ccustosRateio.value && ccustosRateio.value.some(cc => {
      const valido = cc.id_ccusto && parseFloat(cc.valor) > 0
      if (valido) {
        console.log('Centro de custo válido encontrado:', cc.desccentrocusto, 'valor:', cc.valor)
      }
      return valido
    })

    if (!temCCustoValido) {
      console.log('Centro de custo é obrigatório e não foi selecionado ou sem valor válido')
      return false
    }

    console.log('Todos os validações passadas - Centro de custo obrigatório OK, Formulário OK')
    return true
  }

  console.log('Centro de custo não é obrigatório - apenas validação de formulário OK')
  return true
})

// Ciclo de vida
onMounted(async () => {
  // Carregar apenas dados auxiliares no mount
  // As contas a pagar só serão carregadas após aplicar filtros obrigatórios
  await carregarDadosAuxiliares()
  
  // Verificar se há query param 'novo' para abrir o formulário automaticamente
  if (route.query.novo === 'true') {
    formularioAberto.value = true
  }
})

// Watchers - simplificados
// Resetar parcelas quando campos principais mudarem
watch([() => formData.qtdparcelas, () => formData.vlroriginal], () => {
  // Limpar parcelas existentes quando alterar campos principais
  if (suppressParcelWatcher.value) {
    // ao editar um documento, suprimimos o watcher temporariamente
    return
  }

  parcelas.value = []
  totalParcelas.value = 0
  parcelasCalculadas.value = false

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

// Inicializar rateios quando parcelas já foram calculadas
watch(() => parcelasCalculadas.value, (val) => {
  if (val && ccustosRateio.value.length === 0) {
    // garantir que centros já foram carregados
    if ((centrosCusto.value || []).length === 0) {
      // tentar carregar novamente
      ccustoStore.listarCCusto().then(() => {
        centrosCusto.value = ccustoStore.centrosCusto || []
        inicializarRateio()
      }).catch(() => {
        inicializarRateio()
      })
    } else {
      inicializarRateio()
    }
  }
})

// Métodos
const carregarContasPagar = async (filtrosApi = null) => {
  try {
    loading.value = true

    // Se filtros foram passados, usa eles; senão busca todos
    const dados = await financeiroStore.buscarContasPagar(
        idEmpresa.value,
        filtrosApi || {}
    )

    // Esses sao os dados expandidos da tabela
    contasPagar.value = dados?.map(item => ({
      id: item.id || null,
      nrdocumento: item.nrdocumento || '',
      serie: item.serie || '',
      especie: item.especie || '',
      id_parcela: item.id_parcela || 1,
      id_pagparcela: item.id_pagparcela || null,
      qtdparcelas: item.qtdparcelas || 1,
      dtemissao: item.dtemissao || '',
      dtvencimento: item.dtvencimento || '',
      fornecedor: item.fornecedor || '',
      vlrdocumento: parseFloat(item.vlrdocumento || 0),
      vlrparcela: parseFloat(item.vlrparcela || 0),
      saldo_devedor: parseFloat(item.saldo_devedor || 0),
      vlrquitado: parseFloat(item.vlrquitado || 0),
      vlrliberadopagto: parseFloat(item.vlrliberadopagto || 0),
      origem: item.origem || '',
      user_inc: item.user_inc || '',
      user_liberou: item.user_liberou || '',
      abreviatura: item.abreviatura || '',
      desctipodocumento: item.desctipodocumento || '',
      desclocalcobranca: item.desclocalcobranca || '',
      dhinc: item.dhinc || '',
      dhliberacaopagto: item.dhliberacaopagto || '',
      pag_utiliza_aut_pagto: item.pag_utiliza_aut_pagto || 'N',
      id_media: item.id_media || ''
    })) || []

  } catch (error) {
    console.error('Erro ao carregar contas a pagar:', error)
    mostrarMensagem('Erro ao carregar contas a pagar', 'error')
    contasPagar.value = []
  } finally {
    loading.value = false
  }
}

// Carregar parâmetros de centro de custo
const carregarCCustoParametro = async () => {
  try {
    console.log('Iniciando carregamento de ccustoparametro...')

    const response = await apiPhp.get('/financeiro/centro-custo-parametros/parametro')

    console.log('Resposta de ccustoparametro:', response)

    if (Array.isArray(response.data) && response.data.length > 0) {
      ccustoParametro.value = response.data[0]
      console.log('Centro de custo parâmetro carregado com sucesso:', ccustoParametro.value)
      console.log('utiliza_ccusto value:', ccustoParametro.value.utiliza_ccusto)
    } else if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
      ccustoParametro.value = response.data
      console.log('Centro de custo parâmetro carregado com sucesso:', ccustoParametro.value)
      console.log('utiliza_ccusto value:', ccustoParametro.value.utiliza_ccusto)
    } else {
      console.warn('Nenhum parâmetro de centro de custo retornado, usando padrão N')
      ccustoParametro.value = { utiliza_ccusto: 'N' }
    }
  } catch (error) {
    console.error('Erro ao carregar parâmetro de centro de custo:', error)
    ccustoParametro.value = { utiliza_ccusto: 'N' }
  }
}

// Carregar dados auxiliares dos dropdowns
const carregarDadosAuxiliares = async () => {
  try {
    // Carregar parâmetro de centro de custo
    await carregarCCustoParametro()

    // Carregar tipos de documento
    const tiposDoc = await financeiroStore.buscarTiposDocumento()
    tiposDocumento.value = tiposDoc

    // Carregar locais de cobrança
    const locaisCobrancaData = await financeiroStore.buscarLocaisCobranca()
    locaisCobranca.value = locaisCobrancaData

    // Não carregar fornecedores por padrão — busca remota só ao digitar (>=3 chars)
    pessoas.value = []

    // Carregar planos de conta
    await financeiroStore.buscarPlanosConta()

    // Carregar históricos contábeis
    try {
      const historicosRes = await financeiroStore.buscarHistoricosContabil()
      historicoContabilResultados.value = historicosRes || []
    } catch (err) {
      console.warn('Não foi possível carregar históricos contábeis:', err)
    }

    // Carregar centros de custo
    try {
      await ccustoStore.listarCCusto()
      centrosCusto.value = ccustoStore.centrosCusto || []
    } catch (err) {
      console.warn('Não foi possível carregar centros de custo:', err)
    }

  } catch (error) {
    console.error('Erro ao carregar dados auxiliares:', error)
    mostrarMensagem('Erro ao carregar dados auxiliares', 'error')
  }
}

// Inicializar rateio com uma linha vazia
const inicializarRateio = () => {
  if (ccustosRateio.value.length === 0) {
    adicionarCentro()
  }
}

// Adicionar nova linha de rateio
const adicionarCentro = () => {
  ccustosRateio.value.push({
    id_ccusto: null,
    desccentrocusto: '',
    valor: 0,
    porcentagem: 0
  })
}

// Remover linha de rateio
// eslint-disable-next-line no-unused-vars
const removerCentro = (index) => {
  ccustosRateio.value.splice(index, 1)
  recalcularPorcentagens()
}

// Atualiza porcentagem ao alterar valor
const onRateioValorChange = (index) => {
  const total = parseFloat(totalParcelas.value) || 0
  if (total === 0) return

  const r = ccustosRateio.value[index]
  if (!r) return

  const valorAtual = parseFloat(r.valor) || 0
  r.porcentagem = ((valorAtual / total) * 100).toFixed(2)
}

// Atualiza valor ao alterar porcentagem
const onRateioPercentChange = (index) => {
  const total = parseFloat(totalParcelas.value) || 0
  if (total === 0) return

  const r = ccustosRateio.value[index]
  if (!r) return

  const porcAtual = parseFloat(r.porcentagem) || 0
  r.valor = ((porcAtual * total) / 100).toFixed(2)
}

// Recalcular todas as porcentagens baseado nos valores
const recalcularPorcentagens = () => {
  const total = parseFloat(totalParcelas.value) || 0
  if (total === 0) return

  ccustosRateio.value.forEach(r => {
    const valorNum = parseFloat(r.valor) || 0
    r.porcentagem = ((valorNum / total) * 100).toFixed(2)
  })
}

// Distribuir igualmente entre os centros
const distribuirIgualmente = () => {
  const total = parseFloat(totalParcelas.value) || 0
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

const editarContaPagar = async (item) => {

  editando.value = true
  // esconder imediatamente o card de configurações de parcelas antes do template renderizar
  parcelasCalculadas.value = true
  formularioAberto.value = true
  loading.value = true
  try {
    // Tentar obter o documento completo via API (deve retornar o payload criado)
    // Suprimir o watcher que limpa parcelas enquanto fazemos o mapeamento
    suppressParcelWatcher.value = true

    const documento = await financeiroStore.buscarContaPagarPorId(idEmpresa.value, item.id)

    // documento pode ter a forma { data: [...], parcela: [...], ccusto: [...], media: [...] }
    const dados = (documento && documento.data && documento.data[0]) ? documento.data[0] : documento

    // Preencher formData com os campos retornados
    if (dados) {
      formData.id = dados.id || item.id || null
      formData.nrdocumento = dados.nrdocumento || dados.nrdocumento || formData.nrdocumento
      formData.serie = dados.serie || formData.serie
      formData.especie = dados.especie || formData.especie
      formData.id_tipodocumen = dados.id_tipodocumento || dados.id_tipodocumen || null
      formData.observacao = dados.observacao || ''
      formData.vlroriginal = dados.vlroriginal || parseFloat(dados.vlrdocumento || 0) || formData.vlroriginal
      formData.qtdparcelas = parseInt(dados.qtdparcelas || formData.qtdparcelas || 1)
      formData.dtemissao = dados.dtemissao || formData.dtemissao
      formData.id_media = (dados.id_media || (documento && documento.media && documento.media[0] && documento.media[0].id_media)) || formData.id_media

      // Buscar campos contábeis no array contabil (documento.contabil ou dados.contabil)
      const contabil = documento?.contabil || dados?.contabil || []
      if (Array.isArray(contabil) && contabil.length > 0) {
        // Procurar id_red_ctb_for no array (priorizar o primeiro não-nulo)
        const contabilComRedCtb = contabil.find(c => c.id_red_ctb_for != null || c.id_red_ctb_cli != null)
        formData.id_red_ctb_for = contabilComRedCtb?.id_red_ctb_for || contabilComRedCtb?.id_red_ctb_cli || null

        // Procurar id_planoconta no array (priorizar o primeiro não-nulo)
        const contabilComPlano = contabil.find(c => c.id_planoconta != null)
        formData.id_planoconta = contabilComPlano?.id_planoconta || null

        // id_historico_ctb geralmente é o mesmo em todos, pegar do primeiro
        formData.id_historicocontabil = contabil[0]?.id_historico_ctb || null
      } else {
        // Fallback para buscar diretamente em dados (caso API antiga)
        formData.id_red_ctb_for = dados.id_red_ctb_for || dados.id_red_ctb || null
        formData.id_planoconta = dados.id_planoconta || null
        formData.id_historicocontabil = dados.id_historico_ctb || dados.id_historicocontabil || dados.id_historico || null
      }

      // Fornecedor
      if (dados.id_fornecedor) {
        formData.id_fornecedor = dados.id_fornecedor
        // garantir que o fornecedor esteja na lista de pessoas para exibição
        const exists = (pessoas.value || []).some(p => p.id === dados.id_fornecedor)
        if (!exists) {
          pessoas.value = [...(pessoas.value || []), {
            id: dados.id_fornecedor,
            apelido_fantasia: dados.fornecedor || dados.apelido_fantasia || dados.nome_razao || '' ,
            nome_razao: dados.nome_razao || dados.fornecedor || '' ,
            id_red_ctb_for: dados.id_red_ctb_for || dados.id_red_ctb || null
          }]
        }
        // ensure formData.fornecedor text is set
        formData.fornecedor = dados.fornecedor || dados.apelido_fantasia || dados.nome_razao || fornecedorLabel.value || ''
      }
      const histId = formData.id_historicocontabil
      if (histId) {
        // try to resolve label from previously loaded historicos, or fetch
        let found = (historicoContabilResultados.value || []).find(h => h.id === histId)
        if (!found) {
          try {
            const all = await financeiroStore.buscarHistoricosContabil()
            found = (all || []).find(h => h.id === histId)
          } catch (e) {
            // ignore
          }
        }
        histContabilLabel.value = found ? (found.deschistorico || found.descricao || `(${histId})`) : (dados.deschistorico || dados.descricao || `(${histId})`)
      }

      // Resolver labels de Tipo de Documento, Plano de Conta e Fornecedor quando API retornar apenas ids
      try {
        // Tipo de documento
        const tipoId = dados.id_tipodocumento || dados.id_tipodocumen || dados.id_tipo || null
        if (tipoId) {
          const tipo = (tiposDocumento.value || []).find(t => String(t.id) === String(tipoId))
          if (tipo) {
            tipoDocumentoSelecionado.value = tipo.abreviatura || tipo.desctipodocumento || tipo.descricao || ''
            formData.id_tipodocumen = tipo.id
          } else if (dados.abreviatura) {
            tipoDocumentoSelecionado.value = dados.abreviatura
          }
        }

        // Plano de conta (já foi carregado do array contabil acima)
        // Já será selecionado automaticamente pelo v-autocomplete

        // Fornecedor: buscar por ID quando disponível
        if (formData.id_fornecedor) {
          // Primeiro tenta encontrar na lista já carregada
          const foundPessoa = (pessoas.value || []).find(p => String(p.id) === String(formData.id_fornecedor))

          if (foundPessoa) {
            fornecedorLabel.value = foundPessoa.apelido_fantasia || foundPessoa.nome_razao || foundPessoa.nome || ''
            fornecedorSelecionado.value = fornecedorLabel.value
          } else {
            // Se não encontrar, busca na API pelo ID
            await buscarFornecedorPorId(formData.id_fornecedor)

            // Se ainda assim não encontrou mas tem o nome no dados, usar como fallback
            if (!fornecedorLabel.value && dados.fornecedor) {
              const novo = {
                id: formData.id_fornecedor,
                apelido_fantasia: dados.fornecedor || '',
                nome_razao: dados.nome_razao || dados.fornecedor || ''
              }
              pessoas.value = [...(pessoas.value || []), novo]
              fornecedorLabel.value = novo.apelido_fantasia || novo.nome_razao || ''
              fornecedorSelecionado.value = fornecedorLabel.value
            }
          }
        }
      } catch (e) {
        // não bloquear o fluxo por erro na resolução de labels
        console.warn('Erro ao resolver labels a partir dos ids:', e)
      }
    }

    // Parcelas: a API pode retornar `pagparcela` aninhado em `data[0]` (dados) ou no objeto raiz (documento).
    // Priorizar os campos dentro de `dados` (documento.data[0]) quando presentes.
    const parcelasRet = (dados && dados.pagparcela) ? dados.pagparcela
        : (dados && dados.parcela) ? dados.parcela
            : (dados && dados.parcelas) ? dados.parcelas
                : (documento && documento.pagparcela) ? documento.pagparcela
                    : (documento && documento.parcela) ? documento.parcela
                        : (documento && documento.parcelas) ? documento.parcelas
                            : []
    if (Array.isArray(parcelasRet) && parcelasRet.length > 0) {
      parcelas.value = parcelasRet.map((p, idx) => {
        const nr = p.id || p.id_parcela || p.id_pagconta || (idx + 1)
        const rawValor = p.vlroriginalparcela ?? p.vlrparcela ?? p.valor ?? 0
        const vlr = parseFloat(String(rawValor).toString().replace(',', '.')) || 0
        return {
          nrparcela: nr,
          dtvencimento: p.dtvencimento || p.data_vencimento || p.dtvencimento_parcela || '',
          vlrparcela: vlr.toFixed(2),
          id_localcobranca: p.id_localcobranca || null,
          localCobrancaTexto: '',
          _localcobrancaEdited: false,
          observacao: p.observacao || ''
        }
      })
      calcularTotalParcelas()
      parcelasCalculadas.value = true
      // preencher os campos do card de cálculo com a primeira parcela (valor e vencimento)
      try {
        const primeira = parcelas.value[0]
        if (primeira) {
          formData.valor_primeira_parcela = parseFloat(primeira.vlrparcela) || 0
          formData.venc_primeira_parcela = primeira.dtvencimento || ''
        }
      } catch (e) {
        // ignore
      }
      // garantir que o watcher não venha a limpar as parcelas carregadas
      await nextTick()
      suppressParcelWatcher.value = false
    } else {
      // fallback: manter lógica anterior (buscar por documento na lista local)
      const parcelasDoDocumento = contasPagar.value.filter(cp =>
          cp.nrdocumento === item.nrdocumento &&
          cp.serie === item.serie &&
          cp.especie === item.especie
      )
      parcelas.value = parcelasDoDocumento.map(parcela => ({
        nrparcela: parcela.id_parcela,
        dtvencimento: parcela.dtvencimento || '',
        vlrparcela: parseFloat(parcela.vlrparcela || 0).toFixed(2),
        id_localcobranca: null,
        localCobrancaTexto: parcela.desclocalcobranca || '',
        _localcobrancaEdited: false,
        observacao: ''
      }))
      // preencher os campos do card de cálculo com a primeira parcela encontrada
      if (parcelas.value && parcelas.value.length > 0) {
        const p0 = parcelas.value[0]
        formData.valor_primeira_parcela = parseFloat(p0.vlrparcela) || 0
        formData.venc_primeira_parcela = p0.dtvencimento || ''
      }
      calcularTotalParcelas()
      parcelasCalculadas.value = formData.qtdparcelas > 1 && parcelas.value.length > 0
    }

    // resolve localCobranca text for each parcela using locaisCobranca list
    if (Array.isArray(locaisCobranca.value) && locaisCobranca.value.length > 0) {
      parcelas.value = parcelas.value.map(p => {
        if (p.id_localcobranca) {
          const l = locaisCobranca.value.find(lc => String(lc.id) === String(p.id_localcobranca))
          p.localCobrancaTexto = l ? (l.desclocalcobranca || l.descricao || '') : p.localCobrancaTexto
        }
        return p
      })
    }

    // Rateios (centros de custo) — API returns `ccusto` as array of { id_ccusto, valor, desccentrocusto }
    // A API retorna a estrutura: { data: [...], pagparcela: [...], media: [...], ccusto: [...] }
    // O ccusto está no nível raiz do documento, NÃO dentro de data[0]

    // Buscar ccusto no nível raiz do documento (estrutura correta da API)
    const ccustos = documento?.ccusto || []

    if (Array.isArray(ccustos) && ccustos.length > 0) {

      // Ensure centrosCusto list is loaded
      if ((centrosCusto.value || []).length === 0) {
        try {
          await ccustoStore.listarCCusto()
          centrosCusto.value = ccustoStore.centrosCusto || []
        } catch (e) {
          console.warn('Não foi possível carregar centros de custo ao editar documento', e)
        }
      } else

          // Mapear ccustos diretamente para o array de rateio
        ccustosRateio.value = ccustos.map(c => {
          const linha = {
            id_ccusto: Number(c.id_ccusto || c.id_ccusto_prev_lote || c.id),
            valor: parseFloat(c.valor) || 0,
            desccentrocusto: c.desccentrocusto || '',
            porcentagem: 0
          }
          return linha
        })

      // Aguardar nextTick para garantir reatividade
      await nextTick()

      // Calcular as porcentagens baseadas no total das parcelas
      recalcularPorcentagens()

    } else

        // Media: API returns `media` as array (e.g. ["key"]) — persist first element into formData.id_media
    if (documento && Array.isArray(documento.media) && documento.media.length > 0) {
      formData.id_media = documento.media[0] || formData.id_media
    } else if (dados && Array.isArray(dados.media) && dados.media.length > 0) {
      formData.id_media = dados.media[0] || formData.id_media
    }

    // caso não tenha entrado no ramo de parcelasRet acima, garantir que o watcher seja reativado
    suppressParcelWatcher.value = false

  } catch (err) {
    console.error('❌ ERRO ao carregar documento completo:', err)
    console.error('Stack:', err.stack)
    mostrarMensagem('Erro ao carregar dados do documento', 'error')
  } finally {
    loading.value = false
  }
}

const cancelarFormulario = () => {
  formularioAberto.value = false
  resetarForm()
}

const resetarForm = () => {
  // Limpar key do Pinia
  financeiroStore.clearMediaKeyTemporaria()

  Object.assign(formData, {
    id: null,
    nrdocumento: '',
    serie: '',
    especie: '',
    id_tipodocumen: null,
    id_fornecedor: null,
    id_red_ctb_for: null,
    id_planoconta: null,
    observacao: '',
    vlroriginal: null,
    qtdparcelas: 1,
    dtemissao: new Date().toISOString().split('T')[0], // Data atual
    juros: 0,
    multa: 0,
    desconto: 0,
    valor_primeira_parcela: 0,
    venc_primeira_parcela: '',
    intervalo_parcelas: 30,
    id_media: ''
  })

  // Limpar campos de texto dos menus
  tipoDocumentoSelecionado.value = ''
  fornecedorSelecionado.value = ''

  // Limpar parcelas
  parcelas.value = []
  totalParcelas.value = 0
  valorEntrada.value = 0
  parcelasCalculadas.value = false

  // Limpar rateios
  ccustosRateio.value = []

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

    // Validar se centro de custo é obrigatório
    const utilizaCCusto = ccustoParametro.value?.utiliza_ccusto?.trim?.() === 'S' || ccustoParametro.value?.utiliza_ccusto === 'S'

    if (utilizaCCusto) {
      const temCCustoValido = ccustosRateio.value && ccustosRateio.value.some(cc => cc.id_ccusto && parseFloat(cc.valor) > 0)
      if (!temCCustoValido) {
        console.warn('Bloqueando salvar: Centro de custo obrigatório não preenchido')
        mostrarMensagem('Centro de custo é obrigatório. Por favor, selecione um centro de custo com valor maior que zero.', 'warning')
        loading.value = false
        return
      }
    }

    // Validar se há parcelas calculadas
    if (parcelas.value.length === 0) {
      mostrarMensagem('É necessário calcular as parcelas antes de salvar', 'warning')
      loading.value = false
      return
    }

    // Dados principais da conta a pagar
    // Determinar nome do fornecedor a partir do id selecionado
    const fornecedorObj = (pessoas.value || []).find(p => p.id === formData.id_fornecedor) || {}
    const fornecedorNome = fornecedorObj.apelido_fantasia || fornecedorObj.nome_razao || fornecedorObj.nome || ''

    const dadosPrincipais = {
      fornecedor: fornecedorNome,
      id_fornecedor: formData.id_fornecedor,
      id_historico_ctb: formData.id_historicocontabil || null,
      id_red_ctb_for: formData.id_red_ctb_for || null,
      abreviatura: tipoDocumentoSelecionado.value,
      id_empresa: idEmpresa.value,
      nrdocumento: formData.nrdocumento,
      serie: formData.serie,
      especie: formData.especie,
      id_tipodocumento: formData.id_tipodocumen,
      id_planoconta: formData.id_planoconta,
      observacao: formData.observacao,
      vlroriginal: parseFloat(formData.vlroriginal),
      origem: "PAG",
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

    // Usar key do Pinia para o payload
    const mediaValue = financeiroStore.getMediaKeyTemporaria() || null

    // Montar array ccusto no formato solicitado: [{ id_ccusto, valor, perc_ccusto }]
    const ccustoArray = ccustosRateio.value
        .filter(r => r.id_ccusto) // Só incluir linhas com centro selecionado
        .map(r => ({
          id_ccusto: r.id_ccusto,
          valor: (parseFloat(r.valor) || 0).toFixed(2),
          perc_ccusto: (parseFloat(r.porcentagem) || 0).toFixed(2)
        }))

    // Validar soma do rateio (se houver rateios) contra o total das parcelas
    if (ccustoArray.length > 0) {
      const totalRateado = parseFloat(totalRateadoValor.value) || 0
      const total = parseFloat(totalParcelas.value) || 0
      if (Math.abs(totalRateado - total) > 0.01) {
        mostrarMensagem('Total do rateio por centro de custo não corresponde ao total das parcelas', 'warning')
        loading.value = false
        return
      }
    }

    // Montar payload no formato flat (Laravel): campos principais + arrays relacionados
    const payloadCompleto = {
      ...dadosPrincipais,
      parcela: parcelasFormatadas,
      media: [{ id_media: mediaValue }],
      ccusto: ccustoArray
    }

    if (editando.value) {
      // Atualização usa rota com id por enquanto
      await financeiroStore.atualizarContaPagar(idEmpresa.value, formData.id, payloadCompleto)
      mostrarMensagem('Conta a pagar atualizada com sucesso!', 'success')
    } else {
      // Enviar apenas o payload para criar (id_empresa já está dentro de data[0])
      await financeiroStore.criarContaPagar(payloadCompleto)
      mostrarMensagem('Conta a pagar cadastrada com sucesso!', 'success')
    }

    // Limpar key do Pinia após salvar com sucesso
    financeiroStore.clearMediaKeyTemporaria()

    await carregarContasPagar(filtrosAvancados.value)
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
    await carregarContasPagar(filtrosAvancados.value)
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

// ========================================
// Funções para Importação de XML (NFe)
// ========================================

// Abrir modal de importação
const abrirModalImportarXML = () => {
  modalImportarXML.value = true
  limparDadosXML()
}

// Fechar modal de importação
const fecharModalImportarXML = () => {
  modalImportarXML.value = false
  limparDadosXML()
}

// Limpar dados do XML
const limparDadosXML = () => {
  arquivoXML.value = null
  dadosXMLImportado.value = null
  erroXML.value = ''
  processandoXML.value = false
  opcoesImportXML.qtdParcelas = 1
  opcoesImportXML.dataVencimento = ''
  opcoesImportXML.intervaloParcelas = 30
}

// Processar arquivo XML
const processarArquivoXML = async (files) => {
  if (!files || files.length === 0) {
    return
  }

  const file = Array.isArray(files) ? files[0] : files

  if (!file || !file.name.endsWith('.xml')) {
    erroXML.value = 'Por favor, selecione um arquivo XML válido'
    return
  }

  processandoXML.value = true
  erroXML.value = ''
  fornecedorNaoEncontrado.value = false
  dadosFornecedorNovo.value = null

  try {
    const conteudo = await file.text()
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(conteudo, 'text/xml')

    // Verificar se houve erro no parse
    const parseError = xmlDoc.getElementsByTagName('parsererror')
    if (parseError.length > 0) {
      throw new Error('Arquivo XML inválido ou corrompido')
    }

    // Extrair dados da NFe
    dadosXMLImportado.value = extrairDadosNFe(xmlDoc)

    // Verificar se fornecedor existe na base
    await verificarFornecedorXML(dadosXMLImportado.value.emitente)

    // Preencher data de vencimento padrão (30 dias após emissão)
    if (dadosXMLImportado.value?.nfe?.dataEmissao) {
      const dataEmissao = new Date(dadosXMLImportado.value.nfe.dataEmissao)
      dataEmissao.setDate(dataEmissao.getDate() + 30)
      opcoesImportXML.dataVencimento = dataEmissao.toISOString().split('T')[0]
    }

  } catch (error) {
    console.error('Erro ao processar XML:', error)
    erroXML.value = error.message || 'Erro ao processar o arquivo XML'
    dadosXMLImportado.value = null
  } finally {
    processandoXML.value = false
  }
}

// Extrair dados da NFe ou NFSe do XML parseado
const extrairDadosNFe = (xmlDoc) => {
  // Helper para obter texto de um elemento (busca recursiva)
  const getText = (parent, tagName) => {
    if (!parent) return ''
    const elements = parent.getElementsByTagName(tagName)
    return elements.length > 0 ? elements[0].textContent?.trim() : ''
  }

  // Detectar tipo de documento: NFSe (Serviço) ou NFe (Produto)
  const nfseElements = xmlDoc.getElementsByTagName('NFSe')
  const nfeElements = xmlDoc.getElementsByTagName('NFe')

  if (nfseElements.length > 0) {
    // ========== PROCESSAMENTO DE NFSe (NOTA FISCAL DE SERVIÇO) ==========
    return extrairDadosNFSe(xmlDoc, getText)
  } else if (nfeElements.length > 0) {
    // ========== PROCESSAMENTO DE NFe (NOTA FISCAL DE PRODUTO) ==========
    return extrairDadosNFeProduto(xmlDoc, getText)
  } else {
    throw new Error('Formato de XML não reconhecido. Esperado NFe ou NFSe.')
  }
}

// Extrair dados de NFSe (Nota Fiscal de Serviço Eletrônica)
const extrairDadosNFSe = (xmlDoc, getText) => {
  const nfse = xmlDoc.getElementsByTagName('NFSe')[0]

  // Buscar infNFSe
  const infNFSeElements = nfse.getElementsByTagName('infNFSe')
  if (infNFSeElements.length === 0) {
    throw new Error('Elemento infNFSe não encontrado no XML')
  }
  const infNFSe = infNFSeElements[0]

  // Dados do emitente (emit) - prestador do serviço
  const emitElements = infNFSe.getElementsByTagName('emit')
  const emit = emitElements.length > 0 ? emitElements[0] : null

  // Endereço do emitente (enderNac dentro de emit)
  const enderEmit = emit ? emit.getElementsByTagName('enderNac')[0] : null

  // Buscar DPS (Declaração de Prestação de Serviços)
  const dpsElements = infNFSe.getElementsByTagName('DPS')
  const dps = dpsElements.length > 0 ? dpsElements[0] : null

  // Buscar infDPS dentro do DPS
  const infDPSElements = dps ? dps.getElementsByTagName('infDPS') : []
  const infDPS = infDPSElements.length > 0 ? infDPSElements[0] : null

  // Dados do prestador (prest) dentro do infDPS
  const prestElements = infDPS ? infDPS.getElementsByTagName('prest') : []
  const prest = prestElements.length > 0 ? prestElements[0] : null

  // Dados do tomador (toma) dentro do infDPS - é o destinatário/cliente
  const tomaElements = infDPS ? infDPS.getElementsByTagName('toma') : []
  const toma = tomaElements.length > 0 ? tomaElements[0] : null

  // Dados do serviço (serv)
  const servElements = infDPS ? infDPS.getElementsByTagName('serv') : []
  const serv = servElements.length > 0 ? servElements[0] : null

  // Descrição do serviço (xDescServ dentro de cServ)
  const cServElements = serv ? serv.getElementsByTagName('cServ') : []
  const cServ = cServElements.length > 0 ? cServElements[0] : null

  // Valores da NFSe (valores dentro de infNFSe)
  const valoresNFSeElements = infNFSe.getElementsByTagName('valores')
  const valoresNFSe = valoresNFSeElements.length > 0 ? valoresNFSeElements[0] : null

  // Valores do DPS (valores dentro de infDPS)
  const valoresDPSElements = infDPS ? infDPS.getElementsByTagName('valores') : []
  const valoresDPS = valoresDPSElements.length > 0 ? valoresDPSElements[0] : null

  // Valor do serviço (vServPrest ou vServ)
  let valorServico = 0
  if (valoresDPS) {
    const vServPrest = valoresDPS.getElementsByTagName('vServPrest')[0]
    if (vServPrest) {
      valorServico = parseFloat(getText(vServPrest, 'vServ')) || 0
    }
  }
  if (!valorServico && valoresNFSe) {
    valorServico = parseFloat(getText(valoresNFSe, 'vLiq')) || 0
  }

  // Tributos (dentro de valores do DPS)
  const tribElements = valoresDPS ? valoresDPS.getElementsByTagName('trib') : []
  const trib = tribElements.length > 0 ? tribElements[0] : null

  // Tributos federais
  const tribFedElements = trib ? trib.getElementsByTagName('tribFed') : []
  const tribFed = tribFedElements.length > 0 ? tribFedElements[0] : null

  // PIS/COFINS
  const piscofinsElements = tribFed ? tribFed.getElementsByTagName('piscofins') : []
  const piscofins = piscofinsElements.length > 0 ? piscofinsElements[0] : null

  // Chave de acesso (ID do infNFSe)
  const chaveAcesso = infNFSe.getAttribute('Id')?.replace('NFS', '') || ''

  // Número da NFSe
  const numeroNFSe = getText(infNFSe, 'nNFSe') || getText(infNFSe, 'nDFSe') || ''

  // Série (do DPS)
  const serie = infDPS ? getText(infDPS, 'serie') : ''

  // Data de emissão
  const dataEmissao = infDPS ? getText(infDPS, 'dhEmi') : getText(infNFSe, 'dhProc') || ''

  // Data de competência
  const dataCompetencia = infDPS ? getText(infDPS, 'dCompet') : ''

  // Descrição do serviço
  const descricaoServico = cServ ? getText(cServ, 'xDescServ') : ''

  // Tributos nacionais
  const tribNacional = getText(infNFSe, 'xTribNac') || ''
  const tribMunicipal = getText(infNFSe, 'xTribMun') || ''

  // Montar serviços como array (similar a produtos)
  const servicos = []
  if (descricaoServico || tribNacional) {
    servicos.push({
      item: '1',
      codigo: cServ ? getText(cServ, 'cTribNac') : '',
      codigoMunicipal: cServ ? getText(cServ, 'cTribMun') : '',
      descricao: descricaoServico || tribNacional || tribMunicipal,
      quantidade: 1,
      valorUnitario: valorServico,
      valorTotal: valorServico
    })
  }

  return {
    tipoNota: 'NFSe',
    nfe: {
      numero: numeroNFSe,
      serie: serie,
      modelo: 'NFSe',
      dataEmissao: dataEmissao,
      dataCompetencia: dataCompetencia,
      naturezaOperacao: tribNacional || tribMunicipal || 'Prestação de Serviço',
      chaveAcesso: chaveAcesso,
      localEmissao: getText(infNFSe, 'xLocEmi') || '',
      localPrestacao: getText(infNFSe, 'xLocPrestacao') || ''
    },
    emitente: {
      cnpj: emit ? getText(emit, 'CNPJ') : (prest ? getText(prest, 'CNPJ') : ''),
      cpf: emit ? getText(emit, 'CPF') : (prest ? getText(prest, 'CPF') : ''),
      razaoSocial: emit ? getText(emit, 'xNome') : (prest ? getText(prest, 'xNome') : ''),
      nomeFantasia: emit ? getText(emit, 'xFant') : '',
      ie: emit ? getText(emit, 'IE') : '',
      im: emit ? getText(emit, 'IM') : (prest ? getText(prest, 'IM') : ''),
      fone: emit ? getText(emit, 'fone') : (prest ? getText(prest, 'fone') : ''),
      email: emit ? getText(emit, 'email') : (prest ? getText(prest, 'email') : ''),
      endereco: {
        logradouro: enderEmit ? getText(enderEmit, 'xLgr') : '',
        numero: enderEmit ? getText(enderEmit, 'nro') : '',
        complemento: enderEmit ? getText(enderEmit, 'xCpl') : '',
        bairro: enderEmit ? getText(enderEmit, 'xBairro') : '',
        codigoMunicipio: enderEmit ? getText(enderEmit, 'cMun') : '',
        uf: enderEmit ? getText(enderEmit, 'UF') : '',
        cep: enderEmit ? getText(enderEmit, 'CEP') : ''
      }
    },
    destinatario: {
      cnpj: toma ? getText(toma, 'CNPJ') : '',
      cpf: toma ? getText(toma, 'CPF') : '',
      razaoSocial: toma ? getText(toma, 'xNome') : '',
      email: toma ? getText(toma, 'email') : ''
    },
    valores: {
      valorServicos: valorServico,
      valorProdutos: 0,
      baseCalculo: valoresNFSe ? parseFloat(getText(valoresNFSe, 'vBC')) || 0 : 0,
      aliquotaISS: valoresNFSe ? parseFloat(getText(valoresNFSe, 'pAliqAplic')) || 0 : 0,
      valorISS: valoresNFSe ? parseFloat(getText(valoresNFSe, 'vISSQN')) || 0 : 0,
      valorRetencoes: valoresNFSe ? parseFloat(getText(valoresNFSe, 'vTotalRet')) || 0 : 0,
      valorLiquido: valoresNFSe ? parseFloat(getText(valoresNFSe, 'vLiq')) || 0 : valorServico,
      valorTotalNF: valorServico,
      // Tributos federais
      valorPIS: piscofins ? parseFloat(getText(piscofins, 'vPis')) || 0 : 0,
      valorCOFINS: piscofins ? parseFloat(getText(piscofins, 'vCofins')) || 0 : 0,
      valorIRRF: tribFed ? parseFloat(getText(tribFed, 'vRetIRRF')) || 0 : 0,
      valorCSLL: tribFed ? parseFloat(getText(tribFed, 'vRetCSLL')) || 0 : 0,
      valorINSS: tribFed ? parseFloat(getText(tribFed, 'vRetCP')) || 0 : 0,
      // Frete, seguro, etc - geralmente não se aplica a serviços
      valorFrete: 0,
      valorSeguro: 0,
      valorDesconto: 0,
      valorOutro: 0
    },
    produtos: servicos,
    pagamento: []
  }
}

// Extrair dados de NFe (Nota Fiscal de Produto)
const extrairDadosNFeProduto = (xmlDoc, getText) => {
  const nfe = xmlDoc.getElementsByTagName('NFe')[0]

  // Buscar infNFe
  const infNFeElements = nfe.getElementsByTagName('infNFe')
  if (infNFeElements.length === 0) {
    throw new Error('Elemento infNFe não encontrado no XML')
  }
  const infNFe = infNFeElements[0]

  // Dados de identificação (ide)
  const ideElements = infNFe.getElementsByTagName('ide')
  const ide = ideElements.length > 0 ? ideElements[0] : null

  // Dados do emitente (emit)
  const emitElements = infNFe.getElementsByTagName('emit')
  const emit = emitElements.length > 0 ? emitElements[0] : null

  // Dados do destinatário (dest)
  const destElements = infNFe.getElementsByTagName('dest')
  const dest = destElements.length > 0 ? destElements[0] : null

  // Produtos (det)
  const detElements = infNFe.getElementsByTagName('det')
  const produtos = []
  for (let i = 0; i < detElements.length; i++) {
    const det = detElements[i]
    const prod = det.getElementsByTagName('prod')[0]
    if (prod) {
      produtos.push({
        item: det.getAttribute('nItem'),
        codigo: getText(prod, 'cProd'),
        ean: getText(prod, 'cEAN'),
        descricao: getText(prod, 'xProd'),
        ncm: getText(prod, 'NCM'),
        cfop: getText(prod, 'CFOP'),
        unidade: getText(prod, 'uCom'),
        quantidade: parseFloat(getText(prod, 'qCom')) || 0,
        valorUnitario: parseFloat(getText(prod, 'vUnCom')) || 0,
        valorTotal: parseFloat(getText(prod, 'vProd')) || 0
      })
    }
  }

  // Totais (total/ICMSTot)
  const totalElements = infNFe.getElementsByTagName('total')
  const total = totalElements.length > 0 ? totalElements[0] : null
  const icmsTot = total ? total.getElementsByTagName('ICMSTot')[0] : null

  // Pagamento (pag/detPag)
  const pagElements = infNFe.getElementsByTagName('pag')
  const pagamentos = []
  if (pagElements.length > 0) {
    const detPagElements = pagElements[0].getElementsByTagName('detPag')
    for (let i = 0; i < detPagElements.length; i++) {
      const detPag = detPagElements[i]
      pagamentos.push({
        indicador: getText(detPag, 'indPag'),
        tipo: getText(detPag, 'tPag'),
        valor: parseFloat(getText(detPag, 'vPag')) || 0
      })
    }
  }

  // Chave de acesso
  const chaveAcesso = infNFe.getAttribute('Id')?.replace('NFe', '') || ''

  // Endereço do emitente
  const enderEmit = emit ? emit.getElementsByTagName('enderEmit')[0] : null

  return {
    tipoNota: 'NFe',
    nfe: {
      numero: ide ? getText(ide, 'nNF') : '',
      serie: ide ? getText(ide, 'serie') : '',
      modelo: ide ? getText(ide, 'mod') : '',
      dataEmissao: ide ? getText(ide, 'dhEmi') : '',
      naturezaOperacao: ide ? getText(ide, 'natOp') : '',
      chaveAcesso: chaveAcesso
    },
    emitente: {
      cnpj: emit ? getText(emit, 'CNPJ') : '',
      cpf: emit ? getText(emit, 'CPF') : '',
      razaoSocial: emit ? getText(emit, 'xNome') : '',
      nomeFantasia: emit ? getText(emit, 'xFant') : '',
      ie: emit ? getText(emit, 'IE') : '',
      fone: enderEmit ? getText(enderEmit, 'fone') : '',
      endereco: {
        logradouro: enderEmit ? getText(enderEmit, 'xLgr') : '',
        numero: enderEmit ? getText(enderEmit, 'nro') : '',
        bairro: enderEmit ? getText(enderEmit, 'xBairro') : '',
        cidade: enderEmit ? getText(enderEmit, 'xMun') : '',
        uf: enderEmit ? getText(enderEmit, 'UF') : '',
        cep: enderEmit ? getText(enderEmit, 'CEP') : ''
      }
    },
    destinatario: {
      cnpj: dest ? getText(dest, 'CNPJ') : '',
      cpf: dest ? getText(dest, 'CPF') : '',
      razaoSocial: dest ? getText(dest, 'xNome') : ''
    },
    valores: {
      valorProdutos: icmsTot ? parseFloat(getText(icmsTot, 'vProd')) || 0 : 0,
      valorServicos: 0,
      valorFrete: icmsTot ? parseFloat(getText(icmsTot, 'vFrete')) || 0 : 0,
      valorSeguro: icmsTot ? parseFloat(getText(icmsTot, 'vSeg')) || 0 : 0,
      valorDesconto: icmsTot ? parseFloat(getText(icmsTot, 'vDesc')) || 0 : 0,
      valorOutro: icmsTot ? parseFloat(getText(icmsTot, 'vOutro')) || 0 : 0,
      valorIPI: icmsTot ? parseFloat(getText(icmsTot, 'vIPI')) || 0 : 0,
      valorICMS: icmsTot ? parseFloat(getText(icmsTot, 'vICMS')) || 0 : 0,
      valorTotalNF: icmsTot ? parseFloat(getText(icmsTot, 'vNF')) || 0 : 0
    },
    produtos: produtos,
    pagamento: pagamentos
  }
}

// Formatar CNPJ
const formatarCNPJ = (cnpj) => {
  if (!cnpj) return ''
  const numeros = cnpj.replace(/\D/g, '')
  if (numeros.length !== 14) return cnpj
  return numeros.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
}


// Detectar tipo de pessoa pela quantidade de dígitos do CPF/CNPJ
const detectarTipoPessoa = (cpfCnpj) => {
  if (!cpfCnpj) return 'J'
  const numeros = String(cpfCnpj).replace(/\D/g, '')
  // 11 dígitos = CPF (Física), 14 dígitos = CNPJ (Jurídica)
  return numeros.length === 11 ? 'F' : 'J'
}

// Obter descrição da forma de pagamento
const getDescricaoFormaPagamento = (codigo) => {
  const formas = {
    '01': 'Dinheiro',
    '02': 'Cheque',
    '03': 'Cartão de Crédito',
    '04': 'Cartão de Débito',
    '05': 'Crédito Loja',
    '10': 'Vale Alimentação',
    '11': 'Vale Refeição',
    '12': 'Vale Presente',
    '13': 'Vale Combustível',
    '14': 'Duplicata Mercantil',
    '15': 'Boleto Bancário',
    '16': 'Depósito Bancário',
    '17': 'PIX',
    '18': 'Transferência bancária',
    '19': 'Programa de fidelidade',
    '90': 'Sem pagamento',
    '99': 'Outros'
  }
  return formas[codigo] || `Código ${codigo}`
}

// Confirmar importação e preencher formulário
const confirmarImportacaoXML = async () => {
  if (!dadosXMLImportado.value) return

  try {
    loading.value = true
    const dados = dadosXMLImportado.value

    // ===== PASSO 1: Criar fornecedor se não existe =====
    if (fornecedorNaoEncontrado.value && dadosFornecedorNovo.value) {
      console.log('📝 Criando novo fornecedor antes de fechar modal...')
      try {
        const emitente = dados.emitente
        const cpfCnpj = emitente.cnpj || emitente.cpf
        const tipoPessoa = detectarTipoPessoa(cpfCnpj)

        toast.info('Criando fornecedor...')

        const novoFornecedor = await financeiroStore.cadastrarFornecedor({
          tipo_pessoa: tipoPessoa,
          nome_razao: emitente.razaoSocial,
          apelido_fantasia: emitente.nomeFantasia || emitente.razaoSocial,
          cpf_cnpj: cpfCnpj,
          rg_inscricao: emitente.ie || emitente.im || '', // IE para produtos, IM para serviços
          telefone: emitente.fone,
          cliente: 'N',
          fornecedor: 'S',
          transportadora: 'N',
          colaborador: 'N',
          representante: 'N',
          ativo: 'S'
        })

        // Validar se fornecedor foi criado com sucesso
        console.log('Resposta do cadastro de fornecedor:', novoFornecedor)

        if (!novoFornecedor) {
          throw new Error('Nenhuma resposta retornada ao criar fornecedor')
        }

        // API retorna id_pessoa - aceitar diretamente
        const idFornecedor = novoFornecedor.id_pessoa || novoFornecedor.id
        console.log('ID do fornecedor extraído:', idFornecedor)

        if (!idFornecedor) {
          console.error('Objeto retornado não contém id_pessoa nem id:', novoFornecedor)
          throw new Error('Fornecedor criado mas sem ID retornado')
        }

        // Preencher ID do fornecedor
        formData.id_fornecedor = idFornecedor

        // Buscar dados completos do fornecedor via GET /pessoa/:id
        try {
          console.log('Buscando dados completos do fornecedor ID:', idFornecedor)
          const dadosFornecedor = await financeiroStore.buscarPessoasFornecedores(String(idFornecedor), idEmpresa.value)
          console.log('Dados do fornecedor encontrados:', dadosFornecedor)

          if (dadosFornecedor && dadosFornecedor.length > 0) {
            const fornecedorCompleto = dadosFornecedor[0]
            fornecedorSelecionado.value = fornecedorCompleto.apelido_fantasia || fornecedorCompleto.nome_razao || fornecedorCompleto.nome || ''
            fornecedorLabel.value = fornecedorSelecionado.value
            fornecedorSearch.value = fornecedorSelecionado.value
            pessoas.value = [fornecedorCompleto]

            if (fornecedorCompleto.id_red_ctb_for || fornecedorCompleto.id_red_ctb) {
              formData.id_red_ctb_for = fornecedorCompleto.id_red_ctb_for || fornecedorCompleto.id_red_ctb
            }

            toast.success(`Fornecedor ${fornecedorSelecionado.value} criado!`)
          } else {
            fornecedorSelecionado.value = `Fornecedor ID: ${idFornecedor}`
            fornecedorLabel.value = fornecedorSelecionado.value
            pessoas.value = [{ id: idFornecedor, id_pessoa: idFornecedor }]
            toast.success(`Fornecedor criado (ID: ${idFornecedor})!`)
          }
        } catch (errBusca) {
          console.warn('Erro ao buscar dados do fornecedor:', errBusca)
          fornecedorSelecionado.value = `Fornecedor ID: ${idFornecedor}`
          fornecedorLabel.value = fornecedorSelecionado.value
          pessoas.value = [{ id: idFornecedor, id_pessoa: idFornecedor }]
          toast.success(`Fornecedor criado (ID: ${idFornecedor})!`)
        }

        console.log('Fornecedor configurado com ID:', idFornecedor)
      } catch (errFornecedor) {
        console.error('❌ Erro ao criar fornecedor:', errFornecedor)
        toast.error('Erro ao criar fornecedor. Tente novamente.')
        loading.value = false
        return
      }
    }

    // ===== PASSO 2: Preencher dados do formulário =====
    console.log('Preenchendo dados do formulário...')

    // Determinar o valor total baseado no tipo de nota
    const valorTotal = dados.tipoNota === 'NFSe'
      ? (dados.valores.valorLiquido || dados.valores.valorServicos || dados.valores.valorTotalNF)
      : dados.valores.valorTotalNF

    formData.nrdocumento = dados.nfe.numero
    formData.serie = dados.nfe.serie
    formData.especie = dados.tipoNota || 'NFe'
    formData.vlroriginal = valorTotal
    formData.qtdparcelas = opcoesImportXML.qtdParcelas
    formData.dtemissao = dados.nfe.dataEmissao ? dados.nfe.dataEmissao.split('T')[0] : ''
    formData.desconto = dados.valores.valorDesconto || 0
    formData.venc_primeira_parcela = opcoesImportXML.dataVencimento
    formData.intervalo_parcelas = opcoesImportXML.intervaloParcelas
    formData.valor_primeira_parcela = valorTotal / opcoesImportXML.qtdParcelas

    // Preencher tipo de documento com ID 1 (Nota fiscal) que vem da API /tipodocumento
    const tipoDocumentoNotaFiscal = (tiposDocumento.value || []).find(tipo => tipo.id === 1)
    if (tipoDocumentoNotaFiscal) {
      formData.id_tipodocumen = 1
      tipoDocumentoSelecionado.value = tipoDocumentoNotaFiscal.abreviatura || tipoDocumentoNotaFiscal.desctipodocumento || tipoDocumentoNotaFiscal.descricao || 'Nota Fiscal'
      console.log('Tipo de documento preenchido com ID 1:', tipoDocumentoSelecionado.value)
    } else {
      formData.id_tipodocumen = 1
      tipoDocumentoSelecionado.value = 'Nota Fiscal'
      console.log('Tipo de documento preenchido com ID 1 (padrão)')
    }

    // ===== PASSO 3: Fechar modal e abrir formulário =====
    console.log('Fechando modal e abrindo formulário...')
    fecharModalImportarXML()
    formularioAberto.value = true
    editando.value = false

    // Gerar parcelas após preencher
    await nextTick()
    if (formData.qtdparcelas === 1) {
      gerarParcelaUnica()
    }

    toast.success('Revise os dados e clique em Salvar')
  } catch (error) {
    console.error('Erro ao confirmar importação:', error)
    toast.error('Erro ao processar importação')
  } finally {
    loading.value = false
  }
}

// Verificar se fornecedor já existe na base
const verificarFornecedorXML = async (emitente) => {
  // Obter CPF ou CNPJ do emitente
  const cpfCnpj = emitente?.cnpj || emitente?.cpf

  if (!emitente || !cpfCnpj) {
    fornecedorNaoEncontrado.value = true
    dadosFornecedorNovo.value = emitente
    return
  }

  try {
    // Fazer GET em /pessoa?cpf_cnpj= (funciona para CPF ou CNPJ)
    const response = await financeiroStore.buscarPessoasFornecedores(cpfCnpj, idEmpresa.value)

    if (response && Array.isArray(response) && response.length > 0) {
      // Fornecedor encontrado - preencher dados
      formData.id_fornecedor = response[0].id
      formData.id_red_ctb_for = response[0].id_red_ctb_for || response[0].id_red_ctb
      fornecedorSelecionado.value = response[0].apelido_fantasia || response[0].nome_razao || response[0].nome || ''
      fornecedorLabel.value = fornecedorSelecionado.value
      fornecedorSearch.value = fornecedorSelecionado.value
      pessoas.value = [response[0]]
      fornecedorNaoEncontrado.value = false
      dadosFornecedorNovo.value = null
      console.log('Fornecedor encontrado:', response[0])
    } else {
      // Fornecedor não encontrado - preparar para criar
      fornecedorNaoEncontrado.value = true
      dadosFornecedorNovo.value = emitente
      console.log('⚠️ Fornecedor não encontrado - será criado ao confirmar')
    }
  } catch (error) {
    console.warn('Erro ao buscar fornecedor:', error)
    // Em caso de erro, marcar como não encontrado para criar
    fornecedorNaoEncontrado.value = true
    dadosFornecedorNovo.value = emitente
  }
}

// ========================================
// Fim das funções de Importação de XML
// ========================================

// Função para aplicar filtros avançados
const aplicarFiltrosAvancados = async (filtros) => {
  try {
    // Guardar filtros para aplicação local dos filtros de valor
    filtrosAvancados.value = filtros

    // Montar objeto de filtros para API (remover valores vazios)
    const filtrosApi = {}

    if (filtros.tpperiodo !== undefined) filtrosApi.tpperiodo = filtros.tpperiodo
    if (filtros.dtini) filtrosApi.dtini = filtros.dtini
    if (filtros.dtfim) filtrosApi.dtfim = filtros.dtfim
    if (filtros.idfornecedor) filtrosApi.idfornecedor = filtros.idfornecedor
    if (filtros.cnpj_cpf) filtrosApi.cnpj_cpf = filtros.cnpj_cpf
    if (filtros.nrdocumento) filtrosApi.nrdocumento = filtros.nrdocumento
    if (filtros.idtpdocumento) filtrosApi.idtpdocumento = filtros.idtpdocumento
    if (filtros.idlocalcobranca) filtrosApi.idlocalcobranca = filtros.idlocalcobranca
    if (filtros.baixado) filtrosApi.baixado = filtros.baixado

    // Chamar API com filtros
    await carregarContasPagar(filtrosApi)
  } catch (error) {
    console.error('Erro ao aplicar filtros:', error)
    mostrarMensagem('Erro ao aplicar filtros', 'error')
  }
}

// Funções para lidar com upload de media
const handleMediaUpload = async () => {
  // Função legacy - não utilizada
}

const onMediaSuccess = (data) => {
  try {

    // Tentar extrair a key de múltiplos caminhos possíveis
    let key = null

    if (data.key) {
      key = data.key
    } else if (data.data?.key) {
      key = data.data.key
    } else if (data.file?.key) {
      key = data.file.key
    } else if (data.response?.key) {
      key = data.response.key
    }

    if (key) {

      // Armazenar a key no Pinia para usar no payload
      financeiroStore.setMediaKeyTemporaria(key)

      // Também salvar no formData para mostrar o indicador visual
      formData.id_media = key

      mostrarMensagem('Documento anexado e pronto para envio!', 'success')
    } else {
      console.error('❌ Key não encontrada em nenhum caminho. Estrutura recebida:', JSON.stringify(data, null, 2))
      mostrarMensagem('Documento anexado, mas key não foi capturada', 'warning')
    }
  } catch (error) {
    console.error('❌ Erro ao processar upload:', error)
    mostrarMensagem('Erro ao processar documento anexado', 'error')
  }
}

const onMediaError = () => {
  mostrarMensagem('Erro ao anexar documento', 'error')
}


// Função para abrir dialog de confirmação de exclusão
const confirmarExclusao = (item) => {
  dialogExclusao.item = item
  dialogExclusao.aberto = true
}

// Função para confirmar exclusão final
const confirmarExclusaoFinal = async () => {
  if (dialogExclusao.item) {
    await excluirContaPagar(dialogExclusao.item)
    dialogExclusao.aberto = false
    dialogExclusao.item = null
  }
}

// Funções de seleção dos menus
const selecionarTipoDocumento = (tipoDoc) => {
  formData.id_tipodocumen = tipoDoc.id
  tipoDocumentoSelecionado.value = tipoDoc.abreviatura || tipoDoc.desctipodocumento || tipoDoc.descricao
}

const selecionarFornecedor = (fornecedor) => {
  formData.id_fornecedor = fornecedor.id
  fornecedorSelecionado.value = fornecedor.apelido_fantasia || fornecedor.nome_razao || fornecedor.nome || fornecedor.apelido || ''
  formData.id_red_ctb_for = fornecedor.id_red_ctb_for || fornecedor.id_red_ctb || null
}

// Histórico Contábil: pesquisar, selecionar e cadastrar
const pesquisarHistoricosContabil = async () => {
  try {
    // carregar lista do backend e aplicar filtro simples pelo termo
    const dados = await financeiroStore.buscarHistoricosContabil()
    if (!termoHistContabil.value || termoHistContabil.value.length < 2) {
      historicoContabilResultados.value = dados || []
      return
    }
    const termo = termoHistContabil.value.toLowerCase()
    historicoContabilResultados.value = (dados || []).filter(d => {
      return (d.deschistorico || d.descricao || '').toLowerCase().includes(termo) || String(d.id).includes(termo)
    })
  } catch (error) {
    mostrarMensagem('Erro ao buscar históricos contábeis', 'error')
  }
}

// Fornecedor: pesquisar e selecionar
const pesquisarFornecedores = async () => {
  try {
    // usar lista já carregada ou buscar fornecedores via financeiroStore
    let dados = pessoas.value && pessoas.value.length > 0 ? pessoas.value : null

    if (!dados) {
      // Buscar fornecedores usando o mesmo método que já funciona no código
      dados = await financeiroStore.buscarPessoasFornecedores('', idEmpresa.value)
    }

    if (!termoFornecedor.value || termoFornecedor.value.length < 2) {
      fornecedorResultados.value = dados || []
      return
    }
    const termo = termoFornecedor.value.toLowerCase()
    fornecedorResultados.value = (dados || []).filter(d => {
      const nome = d.apelido_fantasia || d.nome_razao || d.nome || d.apelido || ''
      return nome.toLowerCase().includes(termo) || String(d.id).includes(termo)
    })
  } catch (error) {
    console.error('Erro ao buscar fornecedores:', error)
    mostrarMensagem('Erro ao buscar fornecedores', 'error')
  }
}

const selecionarHistoricoContabil = (item) => {
  formData.id_historicocontabil = item.id
  histContabilLabel.value = item.deschistorico || item.descricao || `(${item.id})`
  menuHistContabil.value = false
}

const abrirModalCadastrarHistorico = () => {
  cadastrarHistoricoModal.value = true
}

const clearHistoricoInputs = () => {
  descricaoHistorico.value = ''
  cadastrarHistoricoModal.value = false
}

const cadastrarHistorico = async () => {
  if (!descricaoHistorico.value) {
    mostrarMensagem('Descrição obrigatória para o histórico', 'error')
    return
  }

  try {
    await financeiroStore.criarHistoricoContabil({ deschistorico: descricaoHistorico.value })
    cadastrarHistoricoModal.value = false
    descricaoHistorico.value = ''
    await pesquisarHistoricosContabil()
    mostrarMensagem('Histórico cadastrado com sucesso', 'success')
  } catch (error) {
    mostrarMensagem('Erro ao cadastrar histórico', 'error')
  }
}

const selecionarLocalCobranca = (localCobranca, item) => {
  item.id_localcobranca = localCobranca.id
  item.localCobrancaTexto = localCobranca.desclocalcobranca || localCobranca.descricao

  // Aplicar a lógica de propagação da primeira parcela
  if (item.nrparcela === 1) {

    // Propagar para todas as outras parcelas que não foram editadas manualmente
    for (let i = 0; i < parcelas.value.length; i++) {
      if (parcelas.value[i].nrparcela !== 1 && !parcelas.value[i]._localcobrancaEdited) {
        parcelas.value[i].id_localcobranca = localCobranca.id
        parcelas.value[i].localCobrancaTexto = localCobranca.desclocalcobranca || localCobranca.descricao
      }
    }
  } else {
    // Para parcelas que não são a primeira, marcar como editada manualmente
    item._localcobrancaEdited = true
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
          localCobrancaTexto: '',
          _localcobrancaEdited: false,
          observacao: parcela.observacao || `Parcela ${parcela.id_parcela || (index + 1)} de ${dadosCalculo.qtdparcelas}`
        }
      })

      calcularTotalParcelas()
      // Após cálculo, esconder o painel de configurações
      parcelasCalculadas.value = true
      mostrarMensagem('Parcelas calculadas com sucesso!', 'success')
    } else {
      // Fallback para geração local se backend não retornar dados válidos
      console.warn('Backend não retornou parcelas válidas, usando cálculo local')
      gerarParcelasTemporario()
      // Também considerar como 'calculadas' para ocultar o painel
      parcelasCalculadas.value = true
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
      localCobrancaTexto: '',
      _localcobrancaEdited: false,
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
      localCobrancaTexto: '',
      _localcobrancaEdited: false,
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
        localCobrancaTexto: '',
        _localcobrancaEdited: false,
        observacao: `Parcela ${i} de ${qtd}`
      })
    }

    calcularTotalParcelas()
    // Marcar como calculadas para esconder o card de configurações
    parcelasCalculadas.value = true
  }
}

// ========== EXPORTAÇÃO E IMPRESSÃO ==========

// const abrirModalExportacao = () => {
//   if (contasPagarFiltradas.value.length === 0) {
//     toast.warning('Nenhuma conta a pagar para exportar. Aplique filtros primeiro.')
//     return
//   }
//   modalExportacaoAberto.value = true
// }

// Função para exportar CSV
const handleExportarCSV = ({ dados, nomeRelatorio }) => {
  try {
    if (!dados || dados.length === 0) {
      toast.warning('Nenhum dado para exportar')
      return
    }

    console.log('📊 Exportando CSV:', dados.length, 'registros')


    // Cabeçalhos em português
    const cabecalhos = [
      'Documento',
      'Série',
      'Espécie',
      'Fornecedor',
      'Data Emissão',
      'Vencimento',
      'Valor Parcela',
      'Valor Quitado',
      'Saldo Devedor'
    ]

    // Criar CSV
    const linhas = [cabecalhos.map(h => `"${h}"`).join(',')]

    dados.forEach(item => {
      const valores = [
        `"${item.nrdocumento || ''}"`,
        `"${item.serie || ''}"`,
        `"${item.especie || ''}"`,
        `"${item.fornecedor || ''}"`,
        `"${item.dtemissao ? new Date(item.dtemissao + 'T00:00:00').toLocaleDateString('pt-BR') : ''}"`,
        `"${item.dtvencimento ? new Date(item.dtvencimento + 'T00:00:00').toLocaleDateString('pt-BR') : ''}"`,

        `"${formatarMoeda(item.vlrparcela) || '0,00'}"`,
        `"${formatarMoeda(item.vlrquitado) || '0,00'}"`,
        `"${formatarMoeda(item.saldo_devedor) || '0,00'}"`
      ]
      linhas.push(valores.join(','))
    })

    const csv = linhas.join('\n')

    // Download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', `${nomeRelatorio}_${new Date().toISOString().slice(0, 10)}.csv`)
    link.style.visibility = 'hidden'

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success('CSV exportado com sucesso!')
  } catch (err) {
    console.error('❌ Erro ao exportar CSV:', err)
    toast.error('Erro ao exportar CSV')
  }
}

// Função para exportar Excel
const handleExportarExcel = ({ dados, nomeRelatorio }) => {
  try {
    if (!dados || dados.length === 0) {
      toast.warning('Nenhum dado para exportar')
      return
    }

    console.log('📊 Exportando Excel:', dados.length, 'registros')

    // Definir colunas
    const colunas = [
      'Documento',
      'Série',
      'Espécie',
      'Fornecedor',
      'Data Emissão',
      'Vencimento',
      'Valor Parcela',
      'Valor Quitado',
      'Saldo Devedor'
    ]

    // Criar linhas
    const linhas = [colunas.join('\t')]

    dados.forEach(item => {
      const valores = [
        item.nrdocumento || '',
        item.serie || '',
        item.especie || '',
        item.fornecedor || '',
        item.dtemissao ? new Date(item.dtemissao + 'T00:00:00').toLocaleDateString('pt-BR') : '',
        item.dtvencimento ? new Date(item.dtvencimento + 'T00:00:00').toLocaleDateString('pt-BR') : '',
        formatarMoeda(item.vlrparcela) || '0,00',
        formatarMoeda(item.vlrquitado) || '0,00',
        formatarMoeda(item.saldo_devedor) || '0,00'
      ]
      linhas.push(valores.join('\t'))
    })

    const html = linhas.join('\n')

    // Criar blob com BOM para UTF-8
    const BOM = '\uFEFF'
    const blob = new Blob([BOM + html], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', `${nomeRelatorio}_${new Date().toISOString().slice(0, 10)}.xlsx`)
    link.style.visibility = 'hidden'

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success('Excel exportado com sucesso!')
  } catch (err) {
    console.error('❌ Erro ao exportar Excel:', err)
    toast.error('Erro ao exportar Excel')
  }
}

// Função para exportar PDF (abre preview primeiro)
const handleExportarPDF = async ({ dados, filtros, nomeRelatorio }) => {
  try {
    if (!dados || dados.length === 0) {
      toast.warning('Nenhum dado para exportar')
      return
    }

    console.log('📄 Preparando preview do PDF:', dados.length, 'registros')

    // Gerar HTML com os dados
    const htmlContent = gerarHTMLTitulos(nomeRelatorio, dados, filtros)

    if (!htmlContent) {
      toast.error('Erro ao gerar conteúdo do PDF')
      return
    }

    console.log('📝 htmlContent contém "Fornecedor"?', htmlContent.includes('Fornecedor'))
    console.log('📝 htmlContent contém "Cliente"?', htmlContent.includes('Cliente'))

    // Extrair o conteúdo do body e os estilos para o preview
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlContent, 'text/html')

    // Pegar os estilos
    const styleContent = doc.querySelector('style')?.textContent || ''
    const bodyContent = doc.body.innerHTML

    console.log('📝 bodyContent contém "Fornecedor"?', bodyContent.includes('Fornecedor'))
    console.log('📝 bodyContent contém "Cliente"?', bodyContent.includes('Cliente'))

    // Montar HTML para o preview com estilos
    previewHTMLContent.value = `<style>${styleContent}</style>${bodyContent}`

    console.log('📝 previewHTMLContent contém "Fornecedor"?', previewHTMLContent.value.includes('Fornecedor'))

    // Guardar dados para baixar depois
    dadosPDFAtual.value = { dados, filtros, nomeRelatorio }

    // Abrir modal de preview
    modalPreviewPDF.value = true

  } catch (err) {
    console.error('❌ Erro ao preparar PDF:', err)
    toast.error('Erro ao preparar PDF')
  }
}


// Função para imprimir
const handleImprimir = ({ dados, filtros, nomeRelatorio }) => {
  try {
    if (!dados || dados.length === 0) {
      toast.warning('Nenhum dado para imprimir')
      return
    }

    console.log('Imprimindo:', dados.length, 'registros')

    // Chamar função de impressão do template
    abrirImpressaoTitulos(nomeRelatorio, dados, filtros)
  } catch (err) {
    console.error('Erro ao imprimir:', err)
    toast.error('Erro ao imprimir')
  }
}

</script>

<style scoped>
.background-secondary {
  background-color: var(--bg-color-secondary);
  color: var(--text-color);
}

/* Forçar elementos internos do Vuetify (v-data-table etc.) a herdar o tema
   usando o combinador :deep para scoped styles */
.background-secondary :deep(.v-data-table),
.background-secondary :deep(.v-data-table__wrapper),
.background-secondary :deep(.v-simple-table),
.background-secondary :deep(.v-data-table__wrapper) > * {
  background-color: transparent;
  color: var(--text-color);
}

/* Aplicar fundo de 'card' ao conteúdo da tabela de parcelas especificamente */
.parcelas-table :deep(.v-data-table__wrapper),
.parcelas-table :deep(table),
.parcelas-table :deep(thead),
.parcelas-table :deep(tbody),
.parcelas-table :deep(.v-data-table__divider) {
  background-color: var(--bg-card);
  color: var(--text-color);
}

.custom-text-field :deep(.v-field) {
  background-color: rgba(var(--v-theme-surface), 0.7);
}

.rateio-item {
  border-bottom: 1px solid rgba(0,0,0,0.06);
  padding: 10px 6px;
  background-color: var(--bg-card);
  color: var(--text-color);
}

.totals-row {
  border-top: 1px dashed rgba(255,255,255,0.04);
  background-color: var(--bg-card);
  color: var(--text-color);
  padding: 12px;
}

/* Forçar elementos internos da lista de rateio a usar o tema e ficar discretos */
.rateio-item :deep(.v-list-item__content),
.rateio-item :deep(.v-list-item-title),
.rateio-item :deep(.v-list-item-subtitle) {
  color: var(--text-color);
}

/* Tornar inputs mais discretos: transparência, sem sombra/linha clara */

/* Deixar inputs com o estilo padrão usado por .custom-text-field */
.rateio-item :deep(.v-field__details) {
  display: none !important;
}

/* Garantir que a v-list mantenha fundo transparente para o card controlar o visual */
.v-list--two-line {
  background-color: transparent;
}

/* Estilos para borda esquerda vermelha nos campos obrigatórios */
.required-left-border :deep(.v-field) {
  border-left: 4px solid #ef5350 !important;
  border-radius: 8px !important;
  padding-left: 12px !important;
  transition: all 0.2s ease !important;
  box-shadow: inset 4px 0 0 transparent !important;
}

.required-left-border :deep(.v-field:hover) {
  border-left-color: #e53935 !important;
}

.required-left-border :deep(.v-field.v-field--focused) {
  border-left-color: #d32f2f !important;
  box-shadow: inset 4px 0 8px rgba(211, 47, 47, 0.08) !important;
}

.fornecedor-truncado {
  display: inline-block;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: help;
}
</style>

