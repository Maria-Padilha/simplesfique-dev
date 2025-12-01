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

                    <!-- Fornecedor (autocomplete remoto) -->
                    <v-col cols="12" md="4">
                      <v-autocomplete
                        v-model="formData.id_fornecedor"
                        v-model:search-input="fornecedorSearch"
                        @input="onFornecedorInput"
                        :items="pessoas"
                        :item-title="item => item.apelido_fantasia || item.nome_razao || item.nome || item.apelido || ''"
                        item-value="id"
                        label="Fornecedor"
                        variant="outlined"
                        density="compact"
                        class=""
                        prepend-inner-icon="mdi-account-box"
                        :loading="fornecedorLoading"
                        hide-no-data
                        @update:model-value="onFornecedorSelect"
                      >
                        <template v-slot:no-data>
                          <v-list-item>
                            <v-list-item-title>Nenhum fornecedor encontrado</v-list-item-title>
                          </v-list-item>
                        </template>
                      </v-autocomplete>
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
                          <v-btn size="small" color="orange" variant="elevated" @click="distribuirIgualmente">
                            Distribuir igualmente
                          </v-btn>
                        </v-card-title>

                        <v-card-text class="pa-4">
                          <v-row>
                            <v-col cols="12" md="6">
                              <v-select
                                v-model="selectedCentros"
                                :items="centrosCusto"
                                item-title="desccentrocusto"
                                item-value="id"
                                label="Selecionar Centros de Custo"
                                multiple
                                chips
                                variant="outlined"
                                density="compact"
                                hint="Escolha os centros que participarão do rateio"
                                hide-details
                              />
                            </v-col>

                            <v-col cols="12">
                              <div v-if="(rateiosArray || []).length === 0" class="text-center text-grey">
                                Nenhum centro selecionado.
                              </div>

                              <v-list two-line class="parcelas-table">
                                <v-list-item v-for="r in rateiosArray" :key="r.id" class="rateio-item">
                                  <v-list-item-content>
                                    <v-list-item-title>{{ r.descricao }}</v-list-item-title>
                                    <v-list-item-subtitle class="text-grey mb-3">ID: {{ r.id }}</v-list-item-subtitle>
                                  </v-list-item-content>

                                  <v-list-item-action class="d-flex align-center">
                                    <v-text-field
                                      v-model="r.valor"
                                      label="Valor"
                                      type="number"
                                      step="0.01"
                                      variant="outlined"
                                      density="compact"
                                      prefix="R$"
                                      class=""
                                      style="width:150px; margin-right:8px"
                                      @input="onRateioValorChange(r.id)"
                                    ></v-text-field>

                                    <v-text-field
                                      v-model="r.porcentagem"
                                      label="%"
                                      type="number"
                                      step="0.01"
                                      variant="outlined"
                                      density="compact"
                                      suffix="%"
                                      class=""
                                      style="width:110px; margin-right:8px"
                                      @input="onRateioPercentChange(r.id)"
                                    ></v-text-field>

                                    <v-btn
                                      icon="mdi-close"
                                      size="small"
                                      color="error"
                                      variant="text"
                                      @click="selectedCentros = selectedCentros.filter(i => i !== r.id)"
                                    ></v-btn>
                                  </v-list-item-action>
                                </v-list-item>

                                <div class="mt-4 d-flex justify-space-between align-center pa-2 totals-row">
                                  <div>Total rateado: <strong>{{ formatarMoeda(totalRateadoValor) }}</strong></div>
                                  <div>Percent: <strong>{{ Number(totalRateadoPercent).toFixed(2) }}%</strong></div>
                                </div>
                              </v-list>
                            </v-col>
                          </v-row>
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
import { ref, reactive, computed, onMounted, watch, nextTick } from 'vue'
import { useThemeStore } from '@/stores/config-temas/theme'
import { useFinanceiroStore } from '@/stores/APIs/financeiro'
import { useCCustoStore } from '@/stores/APIs/ccusto'
import BotaoExpandTransition from '@/components/base/padrao-paginas/BotaoExpandTransition.vue'
import TabelaPadrao from '@/components/base/padrao-paginas/TabelaPadrao.vue'
import TipoDocumentoMenu from '@/components/base/menu/TipoDocumentoMenu.vue'
import LocalCobrancaMenu from '@/components/base/menu/LocalCobrancaMenu.vue'
import PlanoContaMenu from '@/components/base/menu/PlanoContaMenu.vue'
import MediaSave from '@/components/base/media/MediaSave.vue'
import MediaShow from '@/components/base/media/MediaShow.vue'
import BuscaPadraoMenu from '@/components/base/menu/BuscaPadraoMenu.vue'
import CadastrarModal from '@/components/base/modais/CadastrarModal.vue'
// eslint-disable-next-line no-unused-vars
import numeric from 'numeric'

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

// Mantemos um mapa de rateios por id para preservar valores quando o usuário selecionar/desselecionar centros
const rateiosMap = ref({})
// Lista de centros selecionados (ids)
const selectedCentros = ref([])

// Array derivado para iteração na tabela (ordem conforme seleção)
const rateiosArray = computed(() => {
  return (selectedCentros.value || []).map(id => rateiosMap.value[id]).filter(Boolean)
})

const totalRateadoValor = computed(() => {
  return rateiosArray.value.reduce((s, r) => s + (parseFloat(r.valor) || 0), 0)
})

const totalRateadoPercent = computed(() => {
  return rateiosArray.value.reduce((s, r) => s + (parseFloat(r.porcentagem) || 0), 0)
})

// Garantir que ao selecionar centros, o mapa de rateios tenha entradas correspondentes
watch(selectedCentros, (newList) => {
  (newList || []).forEach(id => {
    if (!rateiosMap.value[id]) {
      const centro = (centrosCusto.value || []).find(c => c.id === id)
      rateiosMap.value[id] = {
        id,
        descricao: centro?.desccentrocusto || centro?.descricao || `Centro ${id}`,
        valor: 0,
        porcentagem: 0
      }
    }
  })
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



// Dialog de confirmação de exclusão
const dialogExclusao = reactive({
  aberto: false,
  item: null
})

// Headers da tabela
const headers = [
  { title: '', key: 'imagem', sortable: false, width: '60px' },
  { title: 'Documento', key: 'nrdocumento', sortable: true },
  { title: 'Série', key: 'serie', sortable: true },
  { title: 'Espécie', key: 'especie', sortable: true },
  { title: 'Parcela', key: 'id_parcela', sortable: true },
  { title: 'Qtd Total', key: 'qtdparcelas', sortable: true },
  { title: 'Data Emissão', key: 'dtemissao', sortable: true },
  { title: 'Vencimento', key: 'dtvencimento', sortable: true },
  { title: 'Fornecedor', key: 'fornecedor', sortable: true },
  { title: 'Vlr Documento', key: 'vlrdocumento', sortable: true },
  { title: 'Vlr Parcela', key: 'vlrparcela', sortable: true },
  { title: 'Origem', key: 'origem', sortable: true },
  { title: 'Tipo Doc.', key: 'abreviatura', sortable: true },
  { title: 'Local Cobrança', key: 'desclocalcobranca', sortable: true },
  { title: 'Usuário', key: 'user_inc', sortable: true },
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
  id_media: ''
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

// Histórico Contábil (campo de busca + modal de cadastro)
const menuHistContabil = ref(false)
const termoHistContabil = ref('')
const cadastrarHistoricoModal = ref(false)
const historicoContabilResultados = ref([])
const histContabilLabel = ref('')
const descricaoHistorico = ref('')

// Fornecedor autocomplete
const fornecedorSearch = ref('')
const fornecedorLoading = ref(false)
let fornecedorSearchTimer = null

// store label/name of selected fornecedor to ensure we can include it in payload
const fornecedorLabel = ref('')

const onFornecedorSelect = (val) => {
  // val is the selected id (item-value)
  formData.id_fornecedor = val
  // find the selected item to capture the display name
  const sel = (pessoas.value || []).find(p => p.id === val)
  fornecedorLabel.value = sel ? (sel.apelido_fantasia || sel.nome_razao || sel.nome || sel.apelido || '') : ''
  // also persist into formData to guarantee payload has name even if pessoas is cleared later
  formData.fornecedor = fornecedorLabel.value
}

const onFornecedorInput = (ev) => {
  try {
    // If Vuetify emits InputEvent, extract value; otherwise coerce to string
    if (ev && ev.target && typeof ev.target.value === 'string') {
      fornecedorSearch.value = ev.target.value
    } else if (typeof ev === 'string') {
      fornecedorSearch.value = ev
    } else {
      fornecedorSearch.value = String(ev || '')
    }
  } catch (err) {
    fornecedorSearch.value = String(ev || '')
  }
}

// Debounced remote search for fornecedores
watch(fornecedorSearch, (val) => {
  if (fornecedorSearchTimer) clearTimeout(fornecedorSearchTimer)

  // Only perform remote search when user typed at least 3 characters
  if (!val || String(val).trim().length < 3) {
    pessoas.value = []
    fornecedorLoading.value = false
    return
  }

  fornecedorSearchTimer = setTimeout(async () => {
    try {
      console.debug('Buscando fornecedores para:', val)
      fornecedorLoading.value = true
      const items = await financeiroStore.buscarPessoasFornecedores(val.trim(), idEmpresa.value)
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
  if (val && Object.keys(rateiosMap.value).length === 0) {
    // garantir que centros já foram carregados
    if ((centrosCusto.value || []).length === 0) {
      // tentar carregar novamente
      ccustoStore.listarCCusto().then(() => {
        centrosCusto.value = ccustoStore.centrosCusto || ccustoStore.centroscusto || []
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
const carregarContasPagar = async () => {
  try {
    loading.value = true
    const dados = await financeiroStore.buscarContasPagar(idEmpresa.value)
    
    // A API agora retorna dados expandidos de parcelas
    contasPagar.value = dados?.map(item => ({
      id: item.id || null,
      nrdocumento: item.nrdocumento || '',
      serie: item.serie || '',
      especie: item.especie || '',
      id_parcela: item.id_parcela || 1,
      qtdparcelas: item.qtdparcelas || 1,
      dtemissao: item.dtemissao || '',
      dtvencimento: item.dtvencimento || '',
      fornecedor: item.fornecedor || '',
      vlrdocumento: parseFloat(item.vlrdocumento || 0),
      vlrparcela: parseFloat(item.vlrparcela || 0),
      origem: item.origem || '',
      user_inc: item.user_inc || '',
      abreviatura: item.abreviatura || '',
      desclocalcobranca: item.desclocalcobranca || '',
      id_media: item.id_media || ''
    })) || []
    
    console.log('Contas a pagar carregadas:', contasPagar.value)
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
      centrosCusto.value = ccustoStore.centrosCusto || ccustoStore.centroscusto || []
    } catch (err) {
      console.warn('Não foi possível carregar centros de custo:', err)
    }

    console.log('Dados auxiliares carregados:', {
      tiposDocumento: tiposDocumento.value,
      locaisCobranca: locaisCobranca.value,
      pessoas: pessoas.value,
      planosConta: financeiroStore.planosConta
    })
  } catch (error) {
    console.error('Erro ao carregar dados auxiliares:', error)
    mostrarMensagem('Erro ao carregar dados auxiliares', 'error')
  }
}

// Inicializar rateios (map) com a lista de centros, mantendo chaves por id
const inicializarRateio = () => {
  rateiosMap.value = {}
  ;(centrosCusto.value || []).forEach(c => {
    const id = c.id
    rateiosMap.value[id] = {
      id,
      descricao: c.desccentrocusto || c.descricao || c.descconta || c.nome || c.apelido_fantasia || `Centro ${id}`,
      valor: 0,
      porcentagem: 0
    }
  })
}

// Atualiza porcentagem ao alterar valor (recebe id) e distribui o restante
const onRateioValorChange = (id) => {
  const total = parseFloat(totalParcelas.value) || 0
  if (total === 0) return
  
  const r = rateiosMap.value[id]
  if (!r) return
  
  // Usar numeric.js para garantir precisão no cálculo
  const valorAtual = numeric.add(0, parseFloat(r.valor) || 0)
  
  // Calcular porcentagem do centro de custo atual com precisão
  const porcAtual = numeric.div(numeric.mul(valorAtual, 100), total)
  r.porcentagem = porcAtual.toFixed(2)
  
  // Distribuir o restante entre os outros centros de custo selecionados
  distribuirRestante(id, valorAtual, total)
}

// Atualiza valor ao alterar porcentagem (recebe id) e distribui o restante
const onRateioPercentChange = (id) => {
  const total = parseFloat(totalParcelas.value) || 0
  if (total === 0) return
  
  const r = rateiosMap.value[id]
  if (!r) return
  
  // Usar numeric.js para garantir precisão no cálculo
  const porcAtual = numeric.add(0, parseFloat(r.porcentagem) || 0)
  
  // Calcular valor do centro de custo atual com precisão
  const valorAtual = numeric.div(numeric.mul(porcAtual, total), 100)
  r.valor = valorAtual.toFixed(2)
  
  // Distribuir o restante entre os outros centros de custo selecionados
  distribuirRestante(id, valorAtual, total)
}

// Distribui o valor restante proporcionalmente entre os outros centros de custo
const distribuirRestante = (idExcluir, valorUtilizado, total) => {
  const outrosIds = (selectedCentros.value || []).filter(id => id !== idExcluir)
  
  if (outrosIds.length === 0) return
  
  // Calcular valor restante com precisão usando numeric.js
  const valorRestante = numeric.sub(total, valorUtilizado)
  
  // Se o valor restante for negativo ou zero, zerar os outros
  if (valorRestante <= 0) {
    outrosIds.forEach(id => {
      const r = rateiosMap.value[id]
      if (r) {
        r.valor = '0.00'
        r.porcentagem = '0.00'
      }
    })
    return
  }
  
  // Distribuir o valor restante igualmente entre os outros centros
  const valorPorCentro = numeric.div(valorRestante, outrosIds.length)
  
  // Array para acumular os valores já distribuídos (controle de precisão)
  let valorAcumulado = 0
  
  outrosIds.forEach((id, index) => {
    const r = rateiosMap.value[id]
    if (!r) return
    
    // Para o último centro, calcular o valor exato que falta para completar o total
    // Isso garante que não haja diferenças por arredondamento
    if (index === outrosIds.length - 1) {
      const valorFinal = numeric.sub(
        numeric.sub(total, valorUtilizado),
        valorAcumulado
      )
      r.valor = Math.max(0, valorFinal).toFixed(2)
    } else {
      r.valor = valorPorCentro.toFixed(2)
      valorAcumulado = numeric.add(valorAcumulado, parseFloat(r.valor))
    }
    
    // Recalcular porcentagem com precisão
    const valorNum = parseFloat(r.valor)
    r.porcentagem = numeric.div(numeric.mul(valorNum, 100), total).toFixed(2)
  })
}

// Distribuir igualmente entre os centros selecionados
const distribuirIgualmente = () => {
  const total = parseFloat(totalParcelas.value) || 0
  const ids = selectedCentros.value || []
  const count = ids.length || 1
  
  if (count === 0 || total === 0) return
  
  // Usar numeric.js para cálculo preciso da divisão
  const valorPorCentro = numeric.div(total, count)
  
  // Acumulador para controlar arredondamento
  let valorAcumulado = 0
  
  ids.forEach((id, index) => {
    const r = rateiosMap.value[id]
    if (!r) return
    
    // Para o último centro, ajustar para garantir que a soma seja exatamente o total
    if (index === count - 1) {
      const valorFinal = numeric.sub(total, valorAcumulado)
      r.valor = valorFinal.toFixed(2)
    } else {
      r.valor = valorPorCentro.toFixed(2)
      valorAcumulado = numeric.add(valorAcumulado, parseFloat(r.valor))
    }
    
    // Calcular porcentagem com precisão
    const valorNum = parseFloat(r.valor)
    r.porcentagem = numeric.div(numeric.mul(valorNum, 100), total).toFixed(2)
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
      // Histórico contábil: set id and label when available
      const histId = dados.id_historico_ctb || dados.id_historicocontabil || dados.id_historico
      if (histId) {
        formData.id_historicocontabil = histId
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

          // Plano de conta
          const planoId = dados.id_planoconta || dados.id_planoconta || dados.id_plano || null
          const planos = financeiroStore.planosConta || []
          if (planoId) {
            const plano = (planos || []).find(p => String(p.id) === String(planoId))
            if (plano) {
              planoContaSelecionado.value = plano.descconta || plano.descricao || plano.abreviatura || ''
              formData.id_planoconta = plano.id
            } else if (dados.abreviatura_planoconta || dados.descplanoconta) {
              planoContaSelecionado.value = dados.abreviatura_planoconta || dados.descplanoconta
            }
          }

          // Fornecedor: garantir label exibido no autocomplete
          if (formData.id_fornecedor) {
            const foundPessoa = (pessoas.value || []).find(p => String(p.id) === String(formData.id_fornecedor))
            if (foundPessoa) {
              fornecedorLabel.value = foundPessoa.apelido_fantasia || foundPessoa.nome_razao || foundPessoa.nome || ''
            } else if (dados.fornecedor) {
              // adicionar um item mínimo para exibição no autocomplete + label
              const novo = {
                id: formData.id_fornecedor,
                apelido_fantasia: dados.fornecedor || '',
                nome_razao: dados.nome_razao || dados.fornecedor || ''
              }
              pessoas.value = [...(pessoas.value || []), novo]
              fornecedorLabel.value = novo.apelido_fantasia || novo.nome_razao || ''
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

    // Rateios (centros de custo) — API returns `ccusto` as array of { id_ccusto, valor }
    const ccustos = (documento && documento.ccusto) ? documento.ccusto : (dados && dados.ccusto) ? dados.ccusto : []
    if (Array.isArray(ccustos) && ccustos.length > 0) {
      // Ensure centrosCusto list is loaded
      if ((centrosCusto.value || []).length === 0) {
        try {
          await ccustoStore.listarCCusto()
          centrosCusto.value = ccustoStore.centrosCusto || ccustoStore.centroscusto || []
        } catch (e) {
          console.warn('Não foi possível carregar centros de custo ao editar documento', e)
        }
      }
        // suportar diferentes chaves que o backend pode retornar (id_ccusto, id_ccusto_prev_lote, id)
        selectedCentros.value = ccustos.map(c => c.id_ccusto || c.id_ccusto_prev_lote || c.id)
        // populate rateiosMap values
        selectedCentros.value.forEach(id => {
          const entry = ccustos.find(c => (c.id_ccusto || c.id_ccusto_prev_lote || c.id) === id) || {}
          const centro = (centrosCusto.value || []).find(c => c.id === id) || {}
          // extrair o valor do entry em várias chaves possíveis
          const rawValor = entry.valor ?? entry.vlr ?? entry.valor_ccusto ?? entry.vlroriginalparcela ?? 0
          const valorNum = parseFloat(String(rawValor).toString().replace(',', '.')) || 0
          rateiosMap.value[id] = {
            id,
            descricao: centro.desccentrocusto || centro.descricao || entry.descricao || `Centro ${id}`,
            valor: valorNum.toFixed(2),
            porcentagem: parseFloat(entry.porcentagem) || 0
          }
        })
    }

    // Media: API returns `media` as array (e.g. ["key"]) — persist first element into formData.id_media
    if (documento && Array.isArray(documento.media) && documento.media.length > 0) {
      formData.id_media = documento.media[0] || formData.id_media
    } else if (dados && Array.isArray(dados.media) && dados.media.length > 0) {
      formData.id_media = dados.media[0] || formData.id_media
    }

    // caso não tenha entrado no ramo de parcelasRet acima, garantir que o watcher seja reativado
    suppressParcelWatcher.value = false

  } catch (err) {
    console.error('Erro ao carregar documento completo:', err)
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

  // Limpar parcelas
  parcelas.value = []
  totalParcelas.value = 0
  valorEntrada.value = 0
  parcelasCalculadas.value = false

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
      // enviar o nome do fornecedor em `fornecedor` (backend espera nome),
      // manter também `id_fornecedor` separado
      fornecedor: fornecedorNome,
      id_fornecedor: formData.id_fornecedor,
      // Histórico contábil (id) com nome de campo pedido pelo backend
      id_historico_ctb: formData.id_historicocontabil || null,
      id_red_ctb_for: fornecedorObj.id_red_ctb_for || fornecedorObj.id_red_ctb || null,
      abreviatura: tipoDocumentoSelecionado.value,
      id_empresa: idEmpresa.value,
      nrdocumento: formData.nrdocumento,
      serie: formData.serie,
      especie: formData.especie,
      id_tipodocumento: formData.id_tipodocumen,
      id_planoconta: formData.id_planoconta,
      observacao: formData.observacao,
      vlroriginal: parseFloat(formData.vlroriginal),
      origem: "FIN",
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
    // Montar array ccusto no formato solicitado: [{ id_ccusto, valor }]
    const ccustoArray = (rateiosArray.value || []).map(r => ({
      id_ccusto: r.id,
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

    // Log do payload para debug (ver no console do navegador antes do POST)
    console.log('salvarContaPagar - payloadCompleto:', JSON.parse(JSON.stringify(payloadCompleto)))

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

// Funções para lidar com upload de media
const handleMediaUpload = async () => {
  // Função legacy - não utilizada
}

const onMediaSuccess = (data) => {
  // Armazenar a key no Pinia para usar no payload
  if (data.key) {
    financeiroStore.setMediaKeyTemporaria(data.key)
    
    // Também salvar no formData para mostrar o indicador visual
    formData.id_media = data.key
    
    mostrarMensagem('Documento anexado e pronto para envio!', 'success')
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
    console.log('Propagando local cobrança da primeira parcela para todas as outras:', localCobranca.id)
    
    // Propagar para todas as outras parcelas que não foram editadas manualmente
    for (let i = 0; i < parcelas.value.length; i++) {
      if (parcelas.value[i].nrparcela !== 1 && !parcelas.value[i]._localcobrancaEdited) {
        console.log(`Propagando para parcela ${parcelas.value[i].nrparcela}`)
        parcelas.value[i].id_localcobranca = localCobranca.id
        parcelas.value[i].localCobrancaTexto = localCobranca.desclocalcobranca || localCobranca.descricao
      }
    }
  } else {
    // Para parcelas que não são a primeira, marcar como editada manualmente
    item._localcobrancaEdited = true
    console.log(`Parcela ${item.nrparcela} marcada como editada manualmente`)
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