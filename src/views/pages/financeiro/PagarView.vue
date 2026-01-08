<template>
  <top-all-pages icon="mdi-credit-card-outline">
    <template #titulo>Contas a Pagar</template>
    <template #section>
      <div>
        <!-- Card com Total das Parcelas -->
        <v-card class="background-secondary mb-4" elevation="2">
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
                              class=""
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
                              class=""
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
                              class=""
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
                          <v-text-field
                              label="Plano de Conta *"
                              v-model="planoContaSelecionado"
                              variant="outlined"
                              density="compact"
                              hide-details="auto"
                              :rules="[rules.required]"
                              class=""
                              prepend-inner-icon="mdi-chart-tree"
                          >
                            <template #append-inner>
                              <PlanoContaMenu @selecionar="selecionarPlanoConta"/>
                            </template>
                          </v-text-field>
                        </v-col>

                        <!-- Histórico Contábil -->
                        <v-col cols="12" md="4">
                          <v-text-field
                              label="Histórico Contábil"
                              v-model="histContabilLabel"
                              variant="outlined"
                              density="compact"
                              hide-details="auto"
                              class=""
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
                              class=""
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
                              class=""
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
                          <v-card variant="outlined" class="mb-4" elevation="1">
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
              {{ new Date(item.dtemissao).toLocaleDateString('pt-BR') }}
            </span>
                <span v-else class="text-grey">-</span>
              </template>

              <!-- Formatação para Data de Vencimento -->
              <template v-slot:[`item.dtvencimento`]="{ item }">
            <span v-if="item.dtvencimento">
              {{ new Date(item.dtvencimento).toLocaleDateString('pt-BR') }}
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
  </top-all-pages>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch, nextTick } from 'vue'
import { useThemeStore } from '@/stores/config-temas/theme'
import { useFinanceiroStore } from '@/stores/APIs/financeiro'
import { useCCustoStore } from '@/stores/APIs/ccusto'
import { toast } from 'vue3-toastify'
import { abrirImpressaoTitulos, gerarHTMLTitulos } from '@/components/impressos/titulos'
import ExportacaoModal from '@/components/base/modais/ExportacaoModal.vue'
import PdfPreviewModal from '@/components/base/modais/PdfPreviewModal.vue'
import BotaoExpandTransition from '@/components/base/padrao-paginas/BotaoExpandTransition.vue'
import TabelaPadrao from '@/components/base/padrao-paginas/TabelaPadrao.vue'
import BuscaAvancada from '@/components/base/padrao-paginas/BuscaAvancada.vue'
import TipoDocumentoMenu from '@/components/base/menu/TipoDocumentoMenu.vue'
import LocalCobrancaMenu from '@/components/base/menu/LocalCobrancaMenu.vue'
import PlanoContaMenu from '@/components/base/menu/PlanoContaMenu.vue'
import MediaSave from '@/components/base/media/MediaSave.vue'
import MediaShow from '@/components/base/media/MediaShow.vue'
import BuscaPadraoMenu from '@/components/base/menu/BuscaPadraoMenu.vue'
import CadastrarModal from '@/components/base/modais/CadastrarModal.vue'
// eslint-disable-next-line no-unused-vars
import numeric from 'numeric'
import TopAllPages from "@/components/base/padrao-paginas/TopAllPages.vue";

const themeStore = useThemeStore()
const financeiroStore = useFinanceiroStore()
const ccustoStore = useCCustoStore()

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
    { title: 'Fornecedor', key: 'fornecedor', sortable: true },
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
  dtemissao: '',
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
const planoContaSelecionado = ref('')
const fornecedorSelecionado = ref('')

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
      console.warn('⚠️ Fornecedor não encontrado com ID:', idFornecedor)
      return null
    }
  } catch (err) {
    console.error('❌ Erro ao buscar fornecedor por ID:', err)
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

// Ciclo de vida
onMounted(async () => {
  // Carregar apenas dados auxiliares no mount
  // As contas a pagar só serão carregadas após aplicar filtros obrigatórios
  await carregarDadosAuxiliares()
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

// Carregar dados auxiliares dos dropdowns
const carregarDadosAuxiliares = async () => {
  try {
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
        const planoId = formData.id_planoconta
        const planos = financeiroStore.planosConta || []
        if (planoId) {
          const plano = (planos || []).find(p => String(p.id) === String(planoId))
          if (plano) {
            planoContaSelecionado.value = plano.descconta || plano.descricao || plano.abreviatura || ''
          } else if (dados.abreviatura_planoconta || dados.descplanoconta) {
            planoContaSelecionado.value = dados.abreviatura_planoconta || dados.descplanoconta
          }
        }

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
    dtemissao: '',
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
  planoContaSelecionado.value = ''
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

    // Validar se há parcelas calculadas
    if (parcelas.value.length === 0) {
      mostrarMensagem('É necessário calcular as parcelas antes de salvar', 'warning')
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

    // Montar payload no formato solicitado: data, parcela, media, ccusto (top-level)
    const payloadCompleto = {
      data: [dadosPrincipais],
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

const selecionarPlanoConta = (planoConta) => {
  formData.id_planoconta = planoConta.id
  planoContaSelecionado.value = planoConta.descconta || planoConta.descricao
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
        `"${item.dtemissao ? new Date(item.dtemissao).toLocaleDateString('pt-BR') : ''}"`,
        `"${item.dtvencimento ? new Date(item.dtvencimento).toLocaleDateString('pt-BR') : ''}"`,
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
        item.dtemissao ? new Date(item.dtemissao).toLocaleDateString('pt-BR') : '',
        item.dtvencimento ? new Date(item.dtvencimento).toLocaleDateString('pt-BR') : '',
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

    console.log('🖨️ Imprimindo:', dados.length, 'registros')

    // Chamar função de impressão do template
    abrirImpressaoTitulos(nomeRelatorio, dados, filtros)
  } catch (err) {
    console.error('❌ Erro ao imprimir:', err)
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
</style>