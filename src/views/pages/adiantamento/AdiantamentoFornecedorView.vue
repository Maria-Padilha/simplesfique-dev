<template>
  <div class="pa-4">
    <!-- Header Card -->
    <v-card class="background-secondary mb-4">
      <v-card-title class="text-h5 pa-4 d-flex justify-space-between align-center">
        <div class="d-flex align-center">
          <v-icon icon="mdi-account-cash" class="mr-3"></v-icon>
          Adiantamento de Fornecedores
        </div>
      </v-card-title>
    </v-card>

    <!-- Content Card -->
    <v-card :color="themeStore.darkMode ? 'text-white' : ''" class="background-secondary">
      <v-card-text class="pa-4">
        <BotaoExpandTransition
          :formulario-aberto="formularioAberto"
          texto-abrir="Novo Adiantamento"
          texto-fechar="Cancelar"
          @toggle="toggleFormulario"
        />

        <!-- Expandable Form -->
        <v-expand-transition>
          <div v-if="formularioAberto">
            <v-card class="background-card mb-7" elevation="2">
              <v-card-title class="text-h6 pa-4">
                <v-icon :icon="editando ? 'mdi-pencil' : 'mdi-plus'" class="mr-2"></v-icon>
                {{ editando ? 'Editar Adiantamento' : (modoPagamento ? 'Pagar Adiantamento' : (utilizaAprovacaoAdiantamento === 'S' ? 'Nova Aprovação de Adiantamento' : 'Novo Adiantamento')) }}
              </v-card-title>
              <v-card-text class="pa-4">
                <!-- Aviso modo aprovação -->
                <v-alert 
                  v-if="utilizaAprovacaoAdiantamento === 'S'" 
                  type="info" 
                  variant="tonal" 
                  class="mb-4"
                  icon="mdi-information"
                >
                  <v-alert-title>Modo de Aprovação de Adiantamento</v-alert-title>
                  Campos disponíveis para aprovação: Fornecedor, Conta Contábil, Histórico Contábil, Data de Lançamento, Valor Documento, Valor Solicitado e Observação.
                </v-alert>
                
                <v-form ref="formRef" v-model="formValido">
                  <v-row>
                    <!-- Fornecedor -->
                    <v-col cols="12" md="4">
                      <v-autocomplete
                        v-model="formData.id_pessoa"
                        :items="fornecedores"
                        :loading="loadingFornecedores"
                        item-title="nome_razao"
                        item-value="id"
                        label="Fornecedor *"
                        :rules="[rules.required]"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-account"
                        no-data-text="Nenhum fornecedor disponível"
                        @update:search="buscarFornecedores"
                      >
                        <template v-slot:item="{ props, item }">
                          <v-list-item v-bind="props">
                            <v-list-item-subtitle>
                              {{ item.raw.cpf_cnpj }}
                            </v-list-item-subtitle>
                          </v-list-item>
                        </template>
                      </v-autocomplete>
                    </v-col>

                    <!-- Conta Contábil de Adiantamento -->
                    <v-col cols="12" :md="utilizaAprovacaoAdiantamento === 'S' ? '4' : '4'">
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
                        prepend-inner-icon="mdi-chart-tree"
                        no-data-text="Nenhuma conta disponível"
                      >
                        <template v-slot:item="{ props, item }">
                          <v-list-item v-bind="props">
                            <v-list-item-subtitle>
                              Classificador: {{ item.raw.id_classificador }} | Natureza: {{ item.raw.natureza }}
                            </v-list-item-subtitle>
                          </v-list-item>
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
                        prepend-inner-icon="mdi-book-open"
                        clearable
                      ></v-autocomplete>
                    </v-col>

                    <!-- Local de lançamento -->
                    <v-col cols="12" md="4" v-if="utilizaAprovacaoAdiantamento === 'N'">
                      <v-select
                        v-model="formData.local_lct"
                        :items="[{ title: 'Caixa', value: 'CAI' }, { title: 'Banco', value: 'BAN' }]"
                        label="Local de Lançamento *"
                        :rules="[rules.requiredConditional]"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-map-marker"
                      ></v-select>
                    </v-col>

                    <!-- Caixa (se local_lct = CAI) -->
                    <v-col cols="12" md="4" v-if="formData.local_lct === 'CAI' && utilizaAprovacaoAdiantamento === 'N'">
                      <v-autocomplete
                        v-model="formData.id_caixa"
                        :items="caixasDisponiveis"
                        :loading="loadingCaixas"
                        item-title="desccaixa"
                        item-value="id_caixa"
                        label="Caixa *"
                        :rules="[rules.requiredConditional]"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-cash-register"
                        no-data-text="Nenhum caixa disponível"
                      ></v-autocomplete>
                    </v-col>

                    <!-- Conta Corrente (se local_lct = BAN) -->
                    <v-col cols="12" md="4" v-if="formData.local_lct === 'BAN' && utilizaAprovacaoAdiantamento === 'N'">
                      <v-autocomplete
                        v-model="formData.id_ccorrente"
                        :items="contasCorrentes"
                        :loading="loadingContaCorrente"
                        item-title="titular"
                        item-value="id"
                        label="Conta Corrente *"
                        :rules="[rules.requiredConditional]"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-bank"
                        no-data-text="Nenhuma conta disponível"
                      >
                        <template v-slot:item="{ props, item }">
                          <v-list-item v-bind="props">
                            <v-list-item-title>{{ item.raw.titular }}</v-list-item-title>
                            <v-list-item-subtitle>
                              Agência: {{ item.raw.agencia }} | Conta: {{ item.raw.numero_ccorrente }}
                            </v-list-item-subtitle>
                          </v-list-item>
                        </template>
                      </v-autocomplete>
                    </v-col>

                    <!-- Histórico Bancário (se local_lct = BAN) -->
                    <v-col cols="12" md="4" v-if="formData.local_lct === 'BAN' && utilizaAprovacaoAdiantamento === 'N'">
                      <v-autocomplete
                        v-model="formData.id_historico"
                        :items="historicosBancarios"
                        :loading="loadingHistBancario"
                        item-title="deschistorico"
                        item-value="id"
                        label="Histórico Bancário"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-bank-transfer"
                        clearable
                      ></v-autocomplete>
                    </v-col>

                    <!-- Histórico Contábil do Caixa (se local_lct = CAI) -->
                    <v-col cols="12" md="4" v-if="formData.local_lct === 'CAI' && utilizaAprovacaoAdiantamento === 'N'">
                      <v-autocomplete
                        v-model="formData.id_hist_contabil_caixa"
                        :items="historicosContabil"
                        :loading="loadingHistContabil"
                        item-title="deschistorico"
                        item-value="id"
                        label="Histórico Contábil do Caixa"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-cash-register"
                        clearable
                      ></v-autocomplete>
                    </v-col>

                    <!-- Tipo Pagamento/Recebimento (se local_lct = CAI) -->
                    <v-col cols="12" md="4" v-if="formData.local_lct === 'CAI' && utilizaAprovacaoAdiantamento === 'N'">
                      <v-autocomplete
                        v-model="formData.id_tipopagrec"
                        :items="tiposPagRec"
                        :loading="loadingTiposPagRec"
                        item-title="desctipopagrec"
                        item-value="id"
                        label="Tipo Pagamento/Recebimento"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-credit-card"
                        clearable
                      ></v-autocomplete>
                    </v-col>

                    <!-- Data de Lançamento -->
                    <v-col cols="12" :md="utilizaAprovacaoAdiantamento === 'S' ? '4' : '4'">
                      <v-text-field
                        v-model="formData.dtlancamento"
                        label="Data de Lançamento *"
                        type="date"
                        :rules="[rules.required]"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-calendar"
                      />
                    </v-col>

                    <!-- Valor Documento (modo aprovação) -->
                    <v-col cols="12" md="4" v-if="utilizaAprovacaoAdiantamento === 'S'">
                      <v-text-field
                        v-model="formData.valor_documento"
                        label="Valor Documento *"
                        type="number"
                        step="0.01"
                        min="0"
                        :rules="[rules.required]"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-file-document"
                      />
                    </v-col>

                    <!-- Valor Solicitado (modo aprovação) -->
                    <v-col cols="12" md="4" v-if="utilizaAprovacaoAdiantamento === 'S'">
                      <v-text-field
                        v-model="formData.valor_solicitado"
                        label="Valor Solicitado *"
                        type="number"
                        step="0.01"
                        min="0"
                        :rules="[rules.required]"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-cash-multiple"
                      />
                    </v-col>

                    <!-- Data Previsão Pagamento -->
                    <v-col cols="12" md="4" v-if="utilizaAprovacaoAdiantamento === 'S'">
                      <v-text-field
                        v-model="formData.dtprevisao_pagto"
                        label="Data Previsão Pagamento"
                        type="date"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-calendar-clock"
                      />
                    </v-col>

                    <!-- Número de Documento (para Banco e Caixa) -->
                    <v-col cols="12" md="4" v-if="utilizaAprovacaoAdiantamento === 'N'">
                      <v-text-field
                        v-model="formData.nrdocumento"
                        label="Número do Documento"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-file-document-outline"
                        placeholder="Ex: 123456"
                      />
                    </v-col>

                    <!-- Tipo Documento (não para Banco) -->
                    <v-col cols="12" md="4" v-if="formData.local_lct !== 'BAN' && utilizaAprovacaoAdiantamento === 'N'">
                      <v-autocomplete
                        v-model="formData.id_tipodocumento"
                        :items="tiposDocumento"
                        :loading="loadingTiposDoc"
                        item-title="desctipodocumento"
                        item-value="id"
                        label="Tipo de Documento"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-file-document"
                        clearable
                      ></v-autocomplete>
                    </v-col>

                    <!-- Valor Documento -->
                    <v-col cols="12" md="4" v-if="utilizaAprovacaoAdiantamento === 'N'">
                      <v-text-field
                        v-model="formData.valor_documento"
                        label="Valor Documento *"
                        type="number"
                        step="0.01"
                        min="0"
                        :rules="[rules.valorPositivo]"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-file-document"
                        @input="calcularValorSolicitado"
                      />
                    </v-col>

                    <!-- Valor Solicitado -->
                    <v-col cols="12" md="4" v-if="utilizaAprovacaoAdiantamento === 'N'">
                      <v-text-field
                        v-model="formData.valor_solicitado"
                        label="Valor Solicitado *"
                        type="number"
                        step="0.01"
                        min="0"
                        :rules="[rules.valorPositivo]"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-cash-multiple"
                        @input="calcularValorDocumento"
                      />
                    </v-col>



                    <!-- Observação -->
                    <v-col cols="12" :md="utilizaAprovacaoAdiantamento === 'S' ? '12' : '12'">
                      <v-textarea
                        v-model="formData.observacao"
                        label="Observação"
                        variant="outlined"
                        density="compact"
                        rows="3"
                        prepend-inner-icon="mdi-text"
                      />
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
              <v-card-actions class="pa-4">
                <v-spacer></v-spacer>
                <v-btn color="grey" variant="text" @click="cancelarFormulario">Cancelar</v-btn>
                <v-btn
                  color="var(--text-color-laranja)"
                  :loading="loading"
                  :disabled="!formValido"
                  @click="salvarAdiantamento"
                  variant="flat"
                  class="text-white"
                >
                  {{ editando ? 'Atualizar' : (modoPagamento ? 'Processar Pagamento' : 'Salvar') }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </div>
        </v-expand-transition>

        <!-- Filtros de Busca -->
        <v-card class="mb-4 background-card" elevation="1">
          <v-card-title class="text-h6 pa-4">
            <v-icon icon="mdi-filter" class="mr-2"></v-icon>
            Filtros de Período e Fornecedor
          </v-card-title>
          <v-card-text class="pa-4">
            <v-row>
              <!-- Fornecedor -->
              <v-col cols="12" md="3">
                <v-autocomplete
                  v-model="filtros.id_fornecedor"
                  :items="fornecedores"
                  :loading="loadingFornecedores"
                  item-title="nome_razao"
                  item-value="id"
                  label="Fornecedor"
                  variant="outlined"
                  density="compact"
                  prepend-inner-icon="mdi-account"
                  no-data-text="Nenhum fornecedor disponível"
                >
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

              <!-- Data Inicial -->
              <v-col cols="12" md="3">
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
              <v-col cols="12" md="3">
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
              <v-col cols="12" md="1" class="d-flex">
                <v-btn
                  color="var(--text-color-laranja)"
                  :loading="loading"
                  :disabled="!filtros.dtini || !filtros.dtfim"
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
              class="elevation-1 background-secondary"
              :items-per-page="15"
              density="compact"
            >
              <!-- Coluna Fornecedor -->
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

              <!-- Coluna Valor Documento -->
              <template v-slot:[`item.valor_documento`]="{ item }">
                <span class="font-weight-medium" style="color: var(--text-secondary-laranja)">
                  {{ formatarMoeda(item.valor_documento) }}
                </span>
              </template>

              <!-- Coluna Valor Solicitado -->
              <template v-slot:[`item.valor_solicitado`]="{ item }">
                <span class="font-weight-bold" style="color: var(--text-color-preto);">
                  {{ formatarMoeda(item.valor_solicitado) }}
                </span>
              </template>

              <!-- Coluna Valor Autorizado -->
              <template v-slot:[`item.valor_autorizado`]="{ item }">
                <span 
                  class="font-weight-bold" 
                  :class="item.valor_autorizado >= 0 ? 'text-success' : 'text-error'"
                >
                  {{ formatarMoeda(item.valor_autorizado) }}
                </span>
              </template>

              <!-- Coluna Situação -->
              <template v-slot:[`item.situacao`]="{ item }">
                <v-chip 
                  :color="getCorSituacao(item.situacao)" 
                  size="small" 
                  variant="tonal"
                >
                  {{ item.descsituacao || getSituacaoTexto(item.situacao) }}
                </v-chip>
              </template>

              <!-- Coluna Tipo -->
              <template v-slot:[`item.tipo`]="{ item }">
                <v-chip 
                  :color="item.tipo === 'Saida' ? 'var(--text-color-laranja)' : 'var(--text-secondary-laranja)'" 
                  size="small" 
                  variant="tonal"
                >
                  {{ item.tipo }}
                </v-chip>
              </template>

              <!-- Coluna Origem -->
              <template v-slot:[`item.origem`]="{ item }">
                <v-chip 
                  :color="item.origem === 'CAI' ? 'var(--text-color-laranja)' : 'var(--text-secondary-laranja)'" 
                  size="small" 
                  variant="outlined"
                >
                  {{ item.origem }}
                </v-chip>
              </template>

              <!-- Coluna Data Inclusão -->
              <template v-slot:[`item.dhinc`]="{ item }">
                {{ formatarDataHora(item.dhinc) }}
              </template>

              <!-- Coluna Observação -->
              <template v-slot:[`item.observacao`]="{ item }">
                {{ item.observacao || '--' }}
              </template>

              <!-- Coluna Ações -->
              <template v-slot:[`item.actions`]="{ item }">
                <div class="d-flex justify-center">
                  <v-btn
                    icon="mdi-dots-vertical"
                    size="small"
                    variant="text"
                    color="var(--text-color-laranja)"
                    @click="abrirModalAcoes(item)"
                  >
                    <v-icon size="20">mdi-dots-vertical</v-icon>
                    <v-tooltip activator="parent" location="top">Ações</v-tooltip>
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
                  <v-icon icon="mdi-account-cash" size="64" color="grey" class="mb-4"></v-icon>
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

    <!-- Modal de Ações -->
    <v-dialog v-model="modalAcoes" max-width="500px">
      <v-card class="background-secondary">
        <v-card-title class="text-h6 pa-4">
          <v-icon icon="mdi-cog" class="mr-2"></v-icon>
          Ações do Adiantamento
        </v-card-title>
        
        <v-card-text class="pa-4">
          <div v-if="itemSelecionado" class="mb-4">
            <div class="text-subtitle-1 font-weight-bold mb-2">{{ itemSelecionado.nome_razao }}</div>
            <div class="text-body-2 text-grey mb-1">
              <strong>Valor Solicitado:</strong> {{ formatarMoeda(itemSelecionado.valor_solicitado) }}
            </div>
            <div class="text-body-2 text-grey mb-1">
              <strong>Valor Autorizado:</strong> {{ formatarMoeda(itemSelecionado.valor_autorizado) }}
            </div>
            <div class="text-body-2 text-grey">
              <strong>Situação:</strong> 
              <v-chip 
                :color="getCorSituacao(itemSelecionado.situacao)" 
                size="small" 
                variant="tonal"
                class="ml-2"
              >
                {{ itemSelecionado.descsituacao || getSituacaoTexto(itemSelecionado.situacao) }}
              </v-chip>
            </div>
          </div>

          <v-divider class="mb-4"></v-divider>

          <div class="d-flex flex-column gap-3">
            <!-- Ações para situação Pendente (1) -->
            <template v-if="itemSelecionado?.situacao === '1'">
              <v-btn
                color="var(--text-color-laranja)"
                variant="flat"
                size="large"
                prepend-icon="mdi-check"
                @click="confirmarAprovar(itemSelecionado)"
                class="text-white"
                block
              >
                Aprovar Adiantamento
              </v-btn>
              <v-btn
                color="var(--text-secondary-laranja)"
                variant="flat"
                size="large"
                prepend-icon="mdi-cash"
                @click="confirmarPagar(itemSelecionado)"
                class="text-white"
                block
              >
                Pagar Diretamente
              </v-btn>
              <v-btn
                color="var(--text-color-laranja)"
                variant="outlined"
                size="large"
                prepend-icon="mdi-close"
                @click="confirmarRecusar(itemSelecionado)"
                block
              >
                Recusar Adiantamento
              </v-btn>
              
              <v-divider class="my-2"></v-divider>
              
              <v-btn
                color="var(--text-secondary-laranja)"
                variant="outlined"
                size="large"
                prepend-icon="mdi-pencil"
                @click="editarLancamento(itemSelecionado)"
                block
              >
                Editar
              </v-btn>
              <v-btn
                color="var(--text-color-laranja)"
                variant="text"
                size="large"
                prepend-icon="mdi-delete"
                @click="confirmarExclusao(itemSelecionado)"
                block
              >
                Excluir
              </v-btn>
            </template>

            <!-- Ações para situação Aprovado (2) -->
            <template v-if="itemSelecionado?.situacao === '2'">
              <v-btn
                color="var(--text-color-laranja)"
                variant="flat"
                size="large"
                prepend-icon="mdi-cash"
                @click="confirmarPagar(itemSelecionado)"
                class="text-white"
                block
              >
                Pagar Adiantamento
              </v-btn>
            </template>

            <!-- Ações para situação Recusado (3) -->
            <template v-if="itemSelecionado?.situacao === '3'">
              <v-btn
                color="var(--text-secondary-laranja)"
                variant="outlined"
                size="large"
                prepend-icon="mdi-pencil"
                @click="editarLancamento(itemSelecionado)"
                block
              >
                Editar
              </v-btn>
              <v-btn
                color="var(--text-color-laranja)"
                variant="text"
                size="large"
                prepend-icon="mdi-delete"
                @click="confirmarExclusao(itemSelecionado)"
                block
              >
                Excluir
              </v-btn>
            </template>

            <!-- Situação Pago (9) - Apenas visualização -->
            <template v-if="itemSelecionado?.situacao === '9'">
              <v-alert
                color="var(--text-secondary-laranja)"
                variant="tonal"
                icon="mdi-check-circle"
              >
                Este adiantamento já foi pago. Nenhuma ação adicional disponível.
              </v-alert>
            </template>
          </div>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn
            color="grey"
            variant="text"
            @click="fecharModalAcoes"
          >
            Fechar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
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

const themeStore = useThemeStore()
const pessoasStore = usePessoasStore()
const financeiroStore = useFinanceiroStore()
const caixaStore = useCaixaStore()
const empresaStore = useEmpresaStore()
const adiantamentoStore = useAdiantamentoStore()

// Estado
const formularioAberto = ref(false)
const editando = ref(false)
const modoPagamento = ref(false) // Controla se está no modo pagamento
const formValido = ref(false)
const formRef = ref(null)
const loading = ref(false)
const loadingFornecedores = ref(false)
const loadingPlanosConta = ref(false)
const loadingCaixas = ref(false)
const loadingTiposPagRec = ref(false)
const loadingHistContabil = ref(false)
const loadingTiposDoc = ref(false)
const loadingContaCorrente = ref(false)
const loadingHistBancario = ref(false)

// Dados
const fornecedores = ref([])
const planosConta = ref([])
const caixasDisponiveis = ref([])
const tiposPagRec = ref([])
const historicosContabil = ref([])
const tiposDocumento = ref([])
const contasCorrentes = ref([])
const historicosBancarios = ref([])
const lancamentos = ref([])
const saldoAnterior = ref(0)
const utilizaAprovacaoAdiantamento = ref('N') // Controla quais campos exibir

// Modal de ações
const modalAcoes = ref(false)
const itemSelecionado = ref(null)

// Filtros de busca
const periodoSelecionado = ref('mes')
const filtros = reactive({
  id_fornecedor: null,
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
  nrdocumento: null,
  dtlancamento: new Date().toISOString().split('T')[0],
  dtprevisao_pagto: null,
  valor_documento: 0,
  valor_solicitado: 0,
  valor_autorizado: 0,
  tipo: 'Saida',
  origem: 'CAI',
  observacao: ''
})

// Regras de validação
const rules = {
  required: (value) => !!value || 'Campo obrigatório',
  requiredConditional: (value) => {
    if (utilizaAprovacaoAdiantamento.value === 'N') {
      return !!value || 'Campo obrigatório'
    }
    return true
  },
  valorPositivo: (value) => {
    if (utilizaAprovacaoAdiantamento.value === 'N') {
      if (!value) return 'Campo obrigatório'
      if (parseFloat(value) <= 0) return 'Valor deve ser maior que zero'
    }
    return true
  }
}

// Headers da tabela
const headers = [
  { title: 'ID', key: 'id', sortable: true, width: '80px' },
  { title: 'Fornecedor', key: 'nome_razao', sortable: true },
  { title: 'Data Lançamento', key: 'dtlancamento', sortable: true, width: '140px' },
  { title: 'Valor Documento', key: 'valor_documento', sortable: true, align: 'end', width: '130px' },
  { title: 'Valor Solicitado', key: 'valor_solicitado', sortable: true, align: 'end', width: '130px' },
  { title: 'Valor Autorizado', key: 'valor_autorizado', sortable: true, align: 'end', width: '130px' },
  { title: 'Situação', key: 'situacao', sortable: true, width: '120px' },
  { title: 'Tipo', key: 'tipo', sortable: true, width: '100px' },
  { title: 'Origem', key: 'origem', sortable: true, width: '100px' },
  { title: 'Data Inclusão', key: 'dhinc', sortable: true, width: '140px' },
  { title: 'Observação', key: 'observacao', sortable: false, width: '200px' },
  { title: 'Ações', key: 'actions', sortable: false, align: 'center', width: '80px' }
]

// Computed
const lancamentosFiltrados = computed(() => {
  const dados = lancamentos.value || []
  return Array.isArray(dados) ? dados : []
})

// Cálculos de totais
const totalEntradas = computed(() => {
  return lancamentosFiltrados.value
    .filter(l => l.tipo === 'Entrada')
    .reduce((sum, l) => sum + parseFloat(l.valor_autorizado || 0), 0)
})

const totalSaidas = computed(() => {
  return lancamentosFiltrados.value
    .filter(l => l.tipo === 'Saida')
    .reduce((sum, l) => sum + parseFloat(l.valor_autorizado || 0), 0)
})

const saldoFinal = computed(() => {
  return saldoAnterior.value + totalEntradas.value - totalSaidas.value
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

const formatarDataHora = (dataHora) => {
  if (!dataHora) return '--'
  try {
    return new Date(dataHora).toLocaleString('pt-BR')
  } catch {
    return '--'
  }
}

// Funções para formatar situação
const getSituacaoTexto = (situacao) => {
  switch(situacao) {
    case '1': return 'Pendente'
    case '2': return 'Aprovado'
    case '3': return 'Negado'
    case '9': return 'Pago'
    default: return 'Desconhecido'
  }
}

const getCorSituacao = (situacao) => {
  switch(situacao) {
    case '1': return 'var(--text-secondary-laranja)'    // Pendente - laranja claro
    case '2': return 'var(--text-color-laranja)'        // Aprovado - laranja principal  
    case '3': return 'var(--text-secondary-laranja)'    // Negado - laranja claro
    case '9': return 'var(--text-color-laranja)'        // Pago - laranja principal
    default: return 'grey'
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

// Métodos de cálculo
const calcularValorSolicitado = () => {
  const documento = parseFloat(formData.valor_documento) || 0
  const autorizado = parseFloat(formData.valor_autorizado) || 0
  formData.valor_solicitado = documento - autorizado
}

const calcularValorDocumento = () => {
  const solicitado = parseFloat(formData.valor_solicitado) || 0
  const autorizado = parseFloat(formData.valor_autorizado) || 0
  formData.valor_documento = solicitado + autorizado
}

// Métodos de negócio
const toggleFormulario = () => {
  formularioAberto.value = !formularioAberto.value
  if (!formularioAberto.value) {
    resetFormulario()
  }
}

const cancelarFormulario = () => {
  resetFormulario()
  formularioAberto.value = false
  editando.value = false
  modoPagamento.value = false
  
  // Restaurar o modo de aprovação para o padrão
  utilizaAprovacaoAdiantamento.value = 'N'
}

const resetFormulario = () => {
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
    nrdocumento: null,
    dtlancamento: new Date().toISOString().split('T')[0],
    dtprevisao_pagto: null,
    valor_documento: 0,
    valor_solicitado: 0,
    valor_autorizado: 0,
    tipo: 'Saida',
    origem: 'CAI',
    observacao: ''
  })
  
  editando.value = false
  modoPagamento.value = false
  
  if (formRef.value) {
    formRef.value.resetValidation()
  }
}

// Buscar dados
const buscarFornecedores = async () => {
  if (loadingFornecedores.value) return
  
  // Se já temos fornecedores carregados, não recarregar
  if (fornecedores.value.length > 0) return
  
  loadingFornecedores.value = true
  try {
    await pessoasStore.buscarTodasPessoas()
    // Filtrar apenas fornecedores
    fornecedores.value = (pessoasStore.pessoas || []).filter(p => p.fornecedor === 'S')
  } catch (error) {
    console.error('Erro ao buscar fornecedores:', error)
    fornecedores.value = []
  } finally {
    loadingFornecedores.value = false
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
    // Se for modo banco, usar contas ativas do usuário, senão usar todas as contas
    let response
    if (formData.local_lct === 'BAN') {
      response = await financeiroStore.buscarContasUsuarioAtivo()
    } else {
      response = await financeiroStore.buscarContasCorrentes()
    }
    
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

    console.log('Buscando lançamentos de fornecedores:', {
      idEmpresa,
      dtini: filtros.dtini,
      dtfim: filtros.dtfim,
      idFornecedor: filtros.id_fornecedor || 'todos'
    })
    
    const resultado = await adiantamentoStore.buscarAdiantamentosFornecedores(
      idEmpresa,
      filtros.dtini,
      filtros.dtfim,
      filtros.id_fornecedor // Pode ser null para buscar todos
    )
    
    console.log('Resultado da API:', resultado)
    
    // A API retorna { saldoanterior: [valor], data: [...], records: N, pag_utiliza_aprov_adt_for: 'S/N' }
    saldoAnterior.value = Array.isArray(resultado.saldoanterior) ? resultado.saldoanterior[0] : (resultado.saldoanterior || 0)
    lancamentos.value = Array.isArray(resultado.data) ? resultado.data : []
    utilizaAprovacaoAdiantamento.value = resultado.pag_utiliza_aprov_adt_for || 'N'
    
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

// CRUD
const carregarAdiantamentoParaPagamento = async (id) => {
  loading.value = true
  try {
    console.log('Buscando adiantamento para pagamento:', id)
    
    const resultado = await adiantamentoStore.buscarAdiantamentoFornecedorPorId(id)
    console.log('Dados do adiantamento:', resultado)
    
    // Preencher o formulário com os dados existentes
    const dados = resultado.data?.[0] || resultado.data || resultado
    if (dados) {
      Object.assign(formData, {
        id: dados.id,
        id_pessoa: dados.id_fornecedor || dados.id_pessoa,
        id_planoconta: dados.id_planoconta,
        id_hist_contabil: dados.id_hist_contabil,
        local_lct: dados.local_lct || 'CAI',
        id_caixa: dados.id_caixa,
        id_ccorrente: dados.id_ccorrente,
        id_historico: dados.id_historico,
        id_hist_contabil_caixa: dados.id_hist_contabil_caixa,
        id_tipopagrec: dados.id_tipopagrec,
        id_tipodocumento: dados.id_tipodocumento,
        nrdocumento: dados.nrdocumento || '',
        dtlancamento: dados.dtlancamento || new Date().toISOString().split('T')[0],
        dtprevisao_pagto: dados.dtprevisao_pagto,
        valor_documento: dados.valor_documento || 0,
        valor_solicitado: dados.valor_solicitado || 0,
        valor_autorizado: dados.valor_autorizado || 0,
        tipo: dados.tipo || 'Saida',
        origem: dados.origem || 'CAI',
        observacao: dados.observacao || ''
      })
      
      console.log('Dados preenchidos no formulário:', formData)
    }
    
    // Configurar o modo de pagamento
    modoPagamento.value = true
    editando.value = false // Garantir que não está em modo de edição
    utilizaAprovacaoAdiantamento.value = 'N' // Desativar modo aprovação para mostrar todos os campos
    formularioAberto.value = true
    
  } catch (error) {
    console.error('Erro ao carregar adiantamento para pagamento:', error)
  } finally {
    loading.value = false
  }
}

const salvarAdiantamento = async () => {
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
        id_fornecedor: formData.id_pessoa,
        id_empresa: idEmpresa,
        id_caixahist: formData.local_lct === 'CAI' ? formData.id_hist_contabil_caixa : null,
        id_caixa: formData.local_lct === 'CAI' ? formData.id_caixa : null,
        id_ccorrente: formData.local_lct === 'BAN' ? formData.id_ccorrente : null,
        id_historico: formData.local_lct === 'BAN' ? formData.id_historico : null,      
        local_lct: formData.local_lct,
        tipo: formData.tipo,
        origem: formData.origem,
        dtlancamento: formData.dtlancamento,
        dtprevisao_pagto: formData.dtprevisao_pagto || null,
        nrdocumento: formData.nrdocumento || null,
        vlr_documento: parseFloat(formData.valor_documento) || 0,
        vlr_solicitado: parseFloat(formData.valor_solicitado) || 0,
        observacao: formData.observacao || null,
        id_tipopagrec: formData.id_tipopagrec,
        id_hist_contabil: formData.id_hist_contabil || null,
        id_planoconta: formData.id_planoconta,
        id_tipodocumento: formData.local_lct !== 'BAN' ? formData.id_tipodocumento : null
      }]
    }

    console.log('Payload a ser enviado:', payload)

    if (modoPagamento.value) {
      // Modo pagamento - usar API específica de pagamento
      await adiantamentoStore.pagarAdiantamentoFornecedorCompleto(formData.id, payload)
      console.log('Pagamento processado com sucesso!')
    } else if (editando.value && formData.id) {
      // Modo edição
      await adiantamentoStore.atualizarAdiantamentoFornecedor(formData.id, payload)
      console.log('Adiantamento atualizado com sucesso!')
    } else {
      // Modo criação
      await adiantamentoStore.criarAdiantamentoFornecedor(payload)
      console.log('Adiantamento cadastrado com sucesso!')
    }
    
    cancelarFormulario()
    // Recarregar dados se filtros estiverem preenchidos
    if (filtros.dtini && filtros.dtfim) {
      await carregarLancamentos()
    }
  } catch (error) {
    console.error('Erro ao salvar adiantamento:', error)
  } finally {
    loading.value = false
  }
}

const editarLancamento = (item) => {
  Object.assign(formData, {
    id: item.id,
    id_pessoa: item.id_fornecedor,
    id_planoconta: item.id_planoconta,
    id_hist_contabil: item.id_hist_contabil || null,
    local_lct: item.origem || 'CAI',
    id_caixa: item.id_caixa,
    id_ccorrente: item.id_ccorrente || null,
    id_historico: item.id_historico || null,
    id_hist_contabil_caixa: item.id_hist_contabil_caixa || null,
    id_tipopagrec: item.id_tipopagrec,
    id_tipodocumento: item.id_tipodocumento || null,
    nrdocumento: item.nrdocumento || null,
    dtlancamento: item.dtlancamento,
    dtprevisao_pagto: item.dtprevisao_pagto || null,
    valor_documento: item.valor_documento || 0,
    valor_solicitado: item.valor_solicitado || 0,
    valor_autorizado: item.valor_autorizado || 0,
    tipo: item.tipo || 'Saida',
    origem: item.origem || 'CAI',
    observacao: item.observacao || ''
  })
  
  editando.value = true
  formularioAberto.value = true
}

const excluirAdiantamento = async (item) => {
  loading.value = true
  try {
    const idEmpresa = empresaStore.empresa?.id || empresaStore.empresaSelecionada?.id
    
    if (!idEmpresa) {
      console.error('ID da empresa não encontrado')
      loading.value = false
      return
    }
    
    await adiantamentoStore.excluirAdiantamentoFornecedor(idEmpresa, item.id)
    console.log('Adiantamento excluído com sucesso!')
    // Recarregar dados se filtros de data estiverem preenchidos
    if (filtros.dtini && filtros.dtfim) {
      await carregarLancamentos()
    }
  } catch (error) {
    console.error('Erro ao excluir adiantamento:', error)
  } finally {
    loading.value = false
  }
}

// Funções do modal de ações
const abrirModalAcoes = (item) => {
  itemSelecionado.value = item
  modalAcoes.value = true
}

const fecharModalAcoes = () => {
  modalAcoes.value = false
  itemSelecionado.value = null
}

// Ações de aprovação/pagamento/recusa
const aprovarAdiantamento = async (item) => {
  loading.value = true
  try {
    await adiantamentoStore.aprovarAdiantamentoFornecedor(item.id, item.valor_solicitado)
    console.log('Adiantamento aprovado com sucesso!')
    
    // Recarregar dados
    if (filtros.dtini && filtros.dtfim) {
      await carregarLancamentos()
    }
  } catch (error) {
    console.error('Erro ao aprovar adiantamento:', error)
  } finally {
    loading.value = false
  }
}

const pagarAdiantamento = async (item) => {
  await carregarAdiantamentoParaPagamento(item.id)
}

const recusarAdiantamento = async (item) => {
  loading.value = true
  try {
    await adiantamentoStore.recusarAdiantamentoFornecedor(item.id)
    console.log('Adiantamento recusado com sucesso!')
    
    // Recarregar dados
    if (filtros.dtini && filtros.dtfim) {
      await carregarLancamentos()
    }
  } catch (error) {
    console.error('Erro ao recusar adiantamento:', error)
  } finally {
    loading.value = false
  }
}

// Confirmar ações
const confirmarAprovar = (item) => {
  if (confirm(`Deseja realmente aprovar este adiantamento?\n\nFornecedor: ${item.nome_razao}\nValor Solicitado: ${formatarMoeda(item.valor_solicitado)}`)) {
    aprovarAdiantamento(item)
    fecharModalAcoes()
  }
}

const confirmarPagar = (item) => {
  if (confirm(`Deseja realmente pagar este adiantamento?\n\nFornecedor: ${item.nome_razao}\nValor a Pagar: ${formatarMoeda(item.valor_autorizado || item.valor_solicitado)}`)) {
    pagarAdiantamento(item)
    fecharModalAcoes()
  }
}

const confirmarRecusar = (item) => {
  if (confirm(`Deseja realmente recusar este adiantamento?\n\nFornecedor: ${item.nome_razao}\nValor: ${formatarMoeda(item.valor_solicitado)}\n\nEsta ação não pode ser desfeita.`)) {
    recusarAdiantamento(item)
    fecharModalAcoes()
  }
}

// Confirmar exclusão
const confirmarExclusao = (item) => {
  if (confirm(`Deseja realmente excluir este lançamento?\n\nFornecedor: ${item.nome_razao}\nValor: ${formatarMoeda(item.valor_solicitado)}`)) {
    excluirAdiantamento(item)
    fecharModalAcoes()
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

// Watch para recarregar contas correntes quando local de lançamento mudar
watch(() => formData.local_lct, async (novoLocal) => {
  if (novoLocal === 'BAN') {
    console.log('Mudou para Banco - recarregando contas do usuário ativo')
    await carregarContasCorrentes()
    // Limpar conta selecionada pois a lista mudou
    formData.id_ccorrente = null
  } else if (novoLocal === 'CAI') {
    // Limpar dados de banco quando mudar para caixa
    formData.id_ccorrente = null
    formData.id_historico = null
  }
})

// Lifecycle
onMounted(async () => {
  console.log('🚀 Carregando dados iniciais...')
  await Promise.all([
    buscarFornecedores(),
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
