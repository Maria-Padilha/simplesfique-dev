<template>
  <top-all-pages icon="mdi-cash-plus">
    <template #titulo>Contas a Receber</template>
    <template #section>
      <div>
        <!-- Card com Total das Parcelas -->
        <v-card class="background-secondary mb-4" elevation="2">
          <v-card-text class="pa-4">
            <div class="d-flex align-center justify-space-between">
              <div class="d-flex align-center">
                <v-icon icon="mdi-cash-multiple" size="32" color="var(--text-color-laranja)" class="mr-3"></v-icon>
                <div>
                  <div class="text-caption text-grey">Total A Receber</div>
                  <div class="text-h5 font-weight-bold" style="color: var(--text-color-laranja)">
                    {{ formatarMoeda(totalParcelasFiltradas) }}
                  </div>
                </div>
              </div>
              <v-chip color="var(--text-color-laranja)" variant="tonal">
                {{ contasReceberFiltradas.length }} {{ contasReceberFiltradas.length === 1 ? 'parcela' : 'parcelas' }}
              </v-chip>
            </div>
          </v-card-text>
        </v-card>

        <!-- Lista de Contas a Receber -->
        <v-card :color="themeStore.darkMode ? 'text-white' : ''" class="background-secondary">
          <v-card-text class="pa-4">
            <BotaoExpandTransition
                :formulario-aberto="formularioAberto"
                texto-abrir="Nova Conta a Receber"
                texto-fechar="Cancelar"
                @toggle="toggleFormulario"
            />

            <!-- Formulário Expansível -->
            <v-expand-transition>
              <div v-if="formularioAberto">
                <v-card class="background-card mb-7" elevation="2">
                  <v-card-title class="text-h6 pa-4">
                    <v-icon :icon="editando ? 'mdi-pencil' : 'mdi-plus'" class="mr-2"></v-icon>
                    {{ editando ? 'Editar Conta a Receber' : 'Nova Conta a Receber' }}
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

                        <!-- Cliente -->
                        <v-col cols="12" md="4">
                          <v-text-field
                              label="Cliente *"
                              v-model="clienteSelecionado"
                              variant="outlined"
                              density="compact"
                              hide-details="auto"
                              :rules="[rules.required]"
                              class=""
                              prepend-inner-icon="mdi-account-box"
                              readonly
                              placeholder="Selecione um cliente"
                          >
                            <template #append-inner>
                              <busca-padrao-menu
                                  v-model="menuCliente"
                                  :pesquisar="pesquisarClientes"
                                  :modelInput="termoCliente"
                                  :resultados="clienteResultados"
                                  @update:modelInput="termoCliente = $event"
                                  @selecionar="selecionarCliente"
                              >
                                <template #resultados="{ selecionar }">
                                  <v-virtual-scroll
                                      :items="clienteResultados"
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
                        @click="salvarContaReceber"
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

            <!-- Tabela de Contas a Receber -->
            <TabelaPadrao
                :formulario-aberto="formularioAberto"
                :headers="headers"
                :items="contasReceberFiltradas"
                :loading="loading"
                :search="search"
                @update:search="(value) => search = value"
                search-label="Pesquisar Parcelas"
                item-key="id"
                no-data-icon="mdi-cash-plus"
                no-data-text="Nenhuma registro encontrado."
                :show-custom-action="false"
                delete-dialog-message="Esta ação excluirá esta parcela específica. Não pode ser desfeita."
                delete-item-display-field="nrdocumento"
                @edit-item="editarContaReceber"
                @confirm-delete="excluirContaReceber"
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
                      @click="editarContaReceber(item)"
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
            :dados="contasReceberFiltradas"
            :filtros="filtrosAvancados"
            nome-relatorio="Contas a Receber"
            @exportar-pdf="handleExportarPDF"
            @exportar-csv="handleExportarCSV"
            @exportar-excel="handleExportarExcel"
            @imprimir="handleImprimir"
        ></ExportacaoModal>

        <!-- Modal de Preview do PDF -->
        <PdfPreviewModal
            v-model="modalPreviewPDF"
            :html-content="previewHTMLContent"
            :nome-relatorio="dadosPDFAtual?.nomeRelatorio || 'Contas_a_Receber'"
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

// Refs
const formularioAberto = ref(false)
const editando = ref(false)
const formValido = ref(false)
const formRef = ref(null)
const search = ref('')
const loading = ref(false)
const filtrosAvancados = ref({})

// Estado dos dados
const contasReceber = ref([])
const parcelas = ref([])
const totalParcelas = ref(0)
const valorEntrada = ref(0)
// Flag para controlar quando as parcelas já foram calculadas (esconder configurações)
const parcelasCalculadas = ref(false)

// Flag para suprimir o watcher que limpa parcelas enquanto carregamos um documento existente
const suppressParcelWatcher = ref(false)

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
  { title: 'Cliente', key: 'cliente', sortable: true },
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
  id_cliente: null,
  id_red_ctb_cli: null,
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
const clienteSelecionado = ref('')

// Cliente (campo de busca)
const menuCliente = ref(false)
const termoCliente = ref('')
const clienteResultados = ref([])

// Histórico Contábil (campo de busca + modal de cadastro)
const menuHistContabil = ref(false)
const termoHistContabil = ref('')
const cadastrarHistoricoModal = ref(false)
const historicoContabilResultados = ref([])
const histContabilLabel = ref('')
const descricaoHistorico = ref('')

// Cliente autocomplete
const clienteSearch = ref('')
const clienteLoading = ref(false)
let clienteSearchTimer = null

// store label/name of selected Cliente to ensure we can include it in payload
const clienteLabel = ref('')


// Buscar Cliente específico por ID (usado ao editar documento)
const buscarClientePorId = async (idCliente) => {
  try {
    clienteLoading.value = true

    // Busca o Cliente pelo ID na API - isso faz GET /pessoafor/:idempresa?find=ID
    const items = await financeiroStore.buscarPessoasClientes(String(idCliente), idEmpresa.value)

    if (items && items.length > 0) {
      const Cliente = items[0]

      // Atualizar a lista de pessoas com o Cliente encontrado
      pessoas.value = [Cliente]

      // Preencher o label do Cliente
      clienteLabel.value = Cliente.apelido_fantasia || Cliente.nome_razao || Cliente.nome || ''

      // Atualizar o valor de busca para exibir no autocomplete
      clienteSearch.value = clienteLabel.value

      // Capturar id_red_ctb_cli da resposta da API
      if (Cliente.id_red_ctb_cli || Cliente.id_red_ctb) {
        formData.id_red_ctb_cli = Cliente.id_red_ctb_cli || Cliente.id_red_ctb
      }

      return Cliente
    } else {
      console.warn('⚠️ Cliente não encontrado com ID:', idCliente)
      return null
    }
  } catch (err) {
    console.error('❌ Erro ao buscar Cliente por ID:', err)
    return null
  } finally {
    clienteLoading.value = false
  }
}

// Debounced remote search for Clientees
watch(clienteSearch, (val) => {
  if (clienteSearchTimer) clearTimeout(clienteSearchTimer)

  const searchValue = String(val || '').trim()

  // Validação: se for numérico, aceita 1+ dígito; se for texto, precisa 3+ caracteres
  const isNumeric = /^\d+$/.test(searchValue)
  const minLength = isNumeric ? 1 : 3

  if (!searchValue || searchValue.length < minLength) {
    pessoas.value = []
    clienteLoading.value = false
    return
  }

  clienteSearchTimer = setTimeout(async () => {
    try {
      console.debug('Buscando Clientes para:', searchValue, isNumeric ? '(numérico)' : '(texto)')
      clienteLoading.value = true
      const items = await financeiroStore.buscarPessoasClientes(searchValue, idEmpresa.value)
      console.debug('Clientes retornados:', items?.length)
      pessoas.value = items || []
    } catch (err) {
      console.error('Erro buscando Clientes:', err)
      pessoas.value = []
    } finally {
      clienteLoading.value = false
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
const contasReceberFiltradas = computed(() => {
  const dados = contasReceber.value || []
  if (!Array.isArray(dados)) return []

  // Toda filtragem é feita pela API
  return dados
})

// Calcular o valor total das parcelas filtradas
const totalParcelasFiltradas = computed(() => {
  return contasReceberFiltradas.value.reduce((total, item) => {
    const valor = parseFloat(item.vlrparcela || 0)
    return total + valor
  }, 0)
})

// Ciclo de vida
onMounted(async () => {
  // Carregar apenas dados auxiliares no mount
  // As Contas a Receber só serão carregadas após aplicar filtros obrigatórios
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

// Métodos
const carregarContasReceber = async (filtrosApi = null) => {
  try {
    loading.value = true

    // Se filtros foram passados, usa eles; senão busca todos
    const dados = await financeiroStore.buscarContasReceber(
        idEmpresa.value,
        filtrosApi || {}
    )

    // A API agora retorna dados expandidos de parcelas
    contasReceber.value = dados?.map(item => ({
      id: item.id || null,
      nrdocumento: item.nrdocumento || '',
      serie: item.serie || '',
      especie: item.especie || '',
      id_parcela: item.id_parcela || 1,
      qtdparcelas: item.qtdparcelas || 1,
      dtemissao: item.dtemissao || '',
      dtvencimento: item.dtvencimento || '',
      cliente: item.cliente || '',
      vlrdocumento: parseFloat(item.vlrdocumento || 0),
      vlrparcela: parseFloat(item.vlrparcela || 0),
      origem: item.origem || '',
      user_inc: item.user_inc || '',
      abreviatura: item.abreviatura || '',
      desclocalcobranca: item.desclocalcobranca || '',
      id_media: item.id_media || ''
    })) || []

  } catch (error) {
    console.error('Erro ao carregar Contas a Receber:', error)
    mostrarMensagem('Erro ao carregar Contas a Receber', 'error')
    contasReceber.value = []
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

    // Não carregar Clientees por padrão — busca remota só ao digitar (>=3 chars)
    pessoas.value = []

    // Carregar planos de conta
    await financeiroStore.buscarPlanosConta()

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

const editarContaReceber = async (item) => {

  editando.value = true
  // esconder imediatamente o card de configurações de parcelas antes do template renderizar
  parcelasCalculadas.value = true
  formularioAberto.value = true
  loading.value = true
  try {
    // Tentar obter o documento completo via API (deve retornar o payload criado)
    // Suprimir o watcher que limpa parcelas enquanto fazemos o mapeamento
    suppressParcelWatcher.value = true

    const documento = await financeiroStore.buscarContaReceberPorId(idEmpresa.value, item.id)

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
        // Procurar id_red_ctb_cli no array (priorizar o primeiro não-nulo)
        const contabilComRedCtb = contabil.find(c => c.id_red_ctb_cli != null)
        formData.id_red_ctb_cli = contabilComRedCtb?.id_red_ctb_cli || null

        // Procurar id_planoconta no array (priorizar o primeiro não-nulo)
        const contabilComPlano = contabil.find(c => c.id_planoconta != null)
        formData.id_planoconta = contabilComPlano?.id_planoconta || null

        // id_historico_ctb geralmente é o mesmo em todos, pegar do primeiro
        formData.id_historicocontabil = contabil[0]?.id_historico_ctb || null
      } else {
        // Fallback para buscar diretamente em dados (caso API antiga)
        formData.id_red_ctb_cli = dados.id_red_ctb_cli || dados.id_red_ctb || null
        formData.id_planoconta = dados.id_planoconta || null
        formData.id_historicocontabil = dados.id_historico_ctb || dados.id_historicocontabil || dados.id_historico || null
      }

      // Cliente
      if (dados.id_cliente) {
        formData.id_cliente = dados.id_cliente
        // garantir que o cliente esteja na lista de pessoas para exibição
        const exists = (pessoas.value || []).some(p => p.id === dados.id_cliente)
        if (!exists) {
          pessoas.value = [...(pessoas.value || []), {
            id: dados.id_cliente,
            apelido_fantasia: dados.cliente || dados.apelido_fantasia || dados.nome_razao || '' ,
            nome_razao: dados.nome_razao || dados.cliente || ''
          }]
        }
        // ensure formData.cliente text is set
        formData.cliente = dados.cliente || dados.apelido_fantasia || dados.nome_razao || clienteLabel.value || ''
      }
      // Histórico contábil: set id and label when available (já foi carregado do array contabil acima)
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

      // Resolver labels de Tipo de Documento, Plano de Conta e Cliente quando API retornar apenas ids
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

        // Cliente: buscar por ID quando disponível
        if (formData.id_cliente) {
          // Primeiro tenta encontrar na lista já carregada
          const foundPessoa = (pessoas.value || []).find(p => String(p.id) === String(formData.id_cliente))

          if (foundPessoa) {
            clienteLabel.value = foundPessoa.apelido_fantasia || foundPessoa.nome_razao || foundPessoa.nome || ''
            clienteSelecionado.value = clienteLabel.value
          } else {
            // Se não encontrar, busca na API pelo ID
            await buscarClientePorId(formData.id_cliente)

            // Se ainda assim não encontrou mas tem o nome no dados, usar como fallback
            if (!clienteLabel.value && dados.cliente) {
              const novo = {
                id: formData.id_cliente,
                apelido_fantasia: dados.cliente || '',
                nome_razao: dados.nome_razao || dados.cliente || ''
              }
              pessoas.value = [...(pessoas.value || []), novo]
              clienteLabel.value = novo.apelido_fantasia || novo.nome_razao || ''
              clienteSelecionado.value = clienteLabel.value
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
      const parcelasDoDocumento = contasReceber.value.filter(cp =>
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
    id_cliente: null,
    id_red_ctb_cli: null,
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
  clienteSelecionado.value = ''

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

const salvarContaReceber = async () => {
  try {
    loading.value = true

    // Validar se há parcelas calculadas
    if (parcelas.value.length === 0) {
      mostrarMensagem('É necessário calcular as parcelas antes de salvar', 'warning')
      return
    }

    // Dados principais da Conta a Receber
    // Determinar nome do cliente a partir do id selecionado
    const clienteObj = (pessoas.value || []).find(p => p.id === formData.id_cliente) || {}
    const clienteNome = clienteObj.apelido_fantasia || clienteObj.nome_razao || clienteObj.nome || ''

    const dadosPrincipais = {
      // enviar o nome do cliente em `cliente` (backend espera nome),
      // manter também `id_cliente` separado
      cliente: clienteNome,
      id_cliente: formData.id_cliente,
      // Redução da base de cálculo para cliente
      id_red_ctb_cli: formData.id_red_ctb_cli || null,
      // Histórico contábil (id) com nome de campo pedido pelo backend
      id_historico_ctb: formData.id_historicocontabil || null,
      abreviatura: tipoDocumentoSelecionado.value,
      id_empresa: idEmpresa.value,
      nrdocumento: formData.nrdocumento,
      serie: formData.serie,
      especie: formData.especie,
      id_tipodocumento: formData.id_tipodocumen,
      id_planoconta: formData.id_planoconta,
      observacao: formData.observacao,
      vlroriginal: parseFloat(formData.vlroriginal),
      origem: "REC",
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

    // Montar payload no formato solicitado: data, parcela, media (sem ccusto)
    const payloadCompleto = {
      data: [dadosPrincipais],
      parcela: parcelasFormatadas,
      media: [{ id_media: mediaValue }]
    }

    if (editando.value) {
      // Atualização usa rota com id por enquanto
      await financeiroStore.atualizarContaReceber(idEmpresa.value, formData.id, payloadCompleto)
      mostrarMensagem('Conta a Receber atualizada com sucesso!', 'success')
    } else {
      // Enviar apenas o payload para criar (id_empresa já está dentro de data[0])
      await financeiroStore.criarContaReceber(payloadCompleto)
      mostrarMensagem('Conta a Receber cadastrada com sucesso!', 'success')
    }

    // Limpar key do Pinia após salvar com sucesso
    financeiroStore.clearMediaKeyTemporaria()

    await carregarContasReceber(filtrosAvancados.value)
    cancelarFormulario()
  } catch (error) {
    console.error('Erro ao salvar Conta a Receber:', error)
    mostrarMensagem('Erro ao salvar Conta a Receber', 'error')
  } finally {
    loading.value = false
  }
}

const excluirContaReceber = async (item) => {
  try {
    loading.value = true
    await financeiroStore.deletarContaReceber(idEmpresa.value, item.id)
    await carregarContasReceber(filtrosAvancados.value)
    mostrarMensagem('Conta a Receber excluída com sucesso!', 'success')
  } catch (error) {
    console.error('Erro ao excluir Conta a Receber:', error)
    mostrarMensagem('Erro ao excluir Conta a Receber', 'error')
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
    if (filtros.idCliente) filtrosApi.idCliente = filtros.idCliente
    if (filtros.cnpj_cpf) filtrosApi.cnpj_cpf = filtros.cnpj_cpf
    if (filtros.nrdocumento) filtrosApi.nrdocumento = filtros.nrdocumento
    if (filtros.idtpdocumento) filtrosApi.idtpdocumento = filtros.idtpdocumento
    if (filtros.idlocalcobranca) filtrosApi.idlocalcobranca = filtros.idlocalcobranca
    if (filtros.baixado) filtrosApi.baixado = filtros.baixado

    // Chamar API com filtros
    await carregarContasReceber(filtrosApi)
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
    await excluirContaReceber(dialogExclusao.item)
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

const selecionarCliente = (cliente) => {
  formData.id_cliente = cliente.id
  formData.id_red_ctb_cli = cliente.id_red_ctb_cli || cliente.id_red_ctb || null
  clienteSelecionado.value = cliente.apelido_fantasia || cliente.nome_razao || cliente.nome || cliente.apelido || ''
}

// Cliente: pesquisar e selecionar
const pesquisarClientes = async () => {
  try {
    // usar lista já carregada ou buscar clientes via financeiroStore
    let dados = pessoas.value && pessoas.value.length > 0 ? pessoas.value : null

    if (!dados) {
      // Buscar clientes usando o mesmo método que já funciona no código
      dados = await financeiroStore.buscarPessoasClientes('', idEmpresa.value)
    }

    if (!termoCliente.value || termoCliente.value.length < 2) {
      clienteResultados.value = dados || []
      return
    }
    const termo = termoCliente.value.toLowerCase()
    clienteResultados.value = (dados || []).filter(d => {
      const nome = d.apelido_fantasia || d.nome_razao || d.nome || d.apelido || ''
      return nome.toLowerCase().includes(termo) || String(d.id).includes(termo)
    })
  } catch (error) {
    console.error('Erro ao buscar clientes:', error)
    mostrarMensagem('Erro ao buscar clientes', 'error')
  }
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
    const parcelasCalculadas = await financeiroStore.calcularParcelasContaReceber(dadosCalculo)

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
//   if (contasReceberFiltradas.value.length === 0) {
//     toast.warning('Nenhuma conta a receber para exportar. Aplique filtros primeiro.')
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
      'Cliente',
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
        `"${item.cliente || ''}"`,
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
    link.setAttribute('download', `${nomeRelatorio.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`)
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
      'Cliente',
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
        item.cliente || '',
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
    link.setAttribute('download', `${nomeRelatorio.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.xlsx`)
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

    console.log('📝 htmlContent contém "Cliente"?', htmlContent.includes('Cliente'))
    console.log('📝 htmlContent contém "Fornecedor"?', htmlContent.includes('Fornecedor'))

    // Extrair o conteúdo do body e os estilos para o preview
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlContent, 'text/html')

    // Pegar os estilos
    const styleContent = doc.querySelector('style')?.textContent || ''
    const bodyContent = doc.body.innerHTML

    console.log('📝 bodyContent contém "Cliente"?', bodyContent.includes('Cliente'))
    console.log('📝 bodyContent contém "Fornecedor"?', bodyContent.includes('Fornecedor'))

    // Montar HTML para o preview com estilos
    previewHTMLContent.value = `<style>${styleContent}</style>${bodyContent}`

    console.log('📝 previewHTMLContent contém "Cliente"?', previewHTMLContent.value.includes('Cliente'))

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






