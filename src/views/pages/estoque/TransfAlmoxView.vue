<template>
  <div class="pa-4">

    <!-- ===== HEADER ===== -->
    <v-card class="background-secondary mb-4">
      <v-card-title class="text-h5 pa-4 d-flex justify-space-between align-center flex-wrap gap-2">
        <div class="d-flex align-center">
          <v-icon icon="mdi-swap-horizontal-bold" class="mr-3" color="var(--text-color-laranja)"></v-icon>
          Transferência entre Almoxarifados
        </div>
      </v-card-title>
    </v-card>

    <!-- ===== CONTEÚDO ===== -->
    <v-card class="background-secondary" :color="themeStore.darkMode ? 'text-white' : ''">
      <v-tabs
        v-model="abaAtiva"
        color="var(--text-color-laranja)"
        class="px-4 pt-2"
        density="comfortable"
      >
        <v-tab value="transferencia">
          <v-icon icon="mdi-swap-horizontal-bold" class="mr-2"></v-icon>
          Transferência
        </v-tab>
        <v-tab value="recebimento" @click="carregarRecebimentos">
          <v-icon icon="mdi-package-check" class="mr-2"></v-icon>
          Recebimento
        </v-tab>
      </v-tabs>

      <v-divider></v-divider>

      <v-card-text class="pa-0">
        <v-tabs-window v-model="abaAtiva">
          <v-tabs-window-item value="transferencia">
            <div class="pa-4">
              <!-- AÇÕES -->
              <div class="d-flex flex-wrap gap-2 mb-4">
                <v-btn
                  variant="outlined"
                  color="var(--text-color-laranja)"
                  prepend-icon="mdi-broom"
                  @click="novaTransferencia"
                >Limpar</v-btn>

                <v-btn
                  variant="outlined"
                  prepend-icon="mdi-format-list-bulleted"
                  color="var(--text-color-laranja)"
                  @click="abrirLista"
                >Pesquisar</v-btn>

                <v-spacer></v-spacer>

                <v-btn
                  v-if="transferenciaSalva"
                  variant="tonal"
                  prepend-icon="mdi-printer-outline"
                  color="var(--text-color-laranja)"
                  @click="imprimir"
                >Imprimir</v-btn>

                <v-btn
                  v-if="transferenciaSalva"
                  variant="tonal"
                  color="red"
                  prepend-icon="mdi-trash-can-outline"
                  :loading="store.loading"
                  @click="confirmarExclusao"
                >Excluir</v-btn>

                <v-btn
                  color="var(--text-color-laranja)"
                  variant="flat"
                  class="text-white"
                  prepend-icon="mdi-content-save-outline"
                  :loading="store.loading"
                  :disabled="itens.length === 0"
                  @click="salvar"
                >Salvar</v-btn>
              </div>

              <!-- FORMULÁRIO PRINCIPAL -->
              <v-form ref="formRef" v-model="formValido">
                <v-row dense>

                  <!-- Número da Transferência + Imprime -->
                  <v-col cols="12" sm="3" md="2">
                    <v-text-field
                      v-model.number="form.id"
                      label="Transferência"
                      type="number"
                      variant="outlined"
                      density="compact"
                      prepend-inner-icon="mdi-pound"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      color="var(--text-color-laranja)"
                      hide-details
                      readonly
                      placeholder="Automático"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="5" md="4" class="d-flex align-center gap-3">
                    <v-checkbox
                      v-model="form.imprimir"
                      label="Imprime a transferência?"
                      density="compact"
                      color="var(--text-color-laranja)"
                      hide-details
                    ></v-checkbox>
                  </v-col>

                  <!-- Filial Origem -->
                  <v-col cols="12">
                    <v-divider class="my-2">
                      <span class="text-caption font-weight-bold opacity-60 px-2">ORIGEM</span>
                    </v-divider>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="nomeEmpresaOrigem"
                      label="Filial Origem *"
                      variant="outlined"
                      density="compact"
                      :rules="[rules.required]"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      color="var(--text-color-laranja)"
                      hide-details="auto"
                      readonly
                      placeholder="Selecione a filial de origem"
                      prepend-inner-icon="mdi-office-building-outline"
                    >
                      <template #append-inner>
                        <v-btn
                          icon="mdi-magnify"
                          variant="text"
                          size="x-small"
                          density="compact"
                          color="var(--text-color-laranja)"
                          @click="abrirSelecaoEmpresa('origem')"
                        ></v-btn>
                      </template>
                    </v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="nomeAlmoxOrigem"
                      label="Almoxarifado Origem *"
                      variant="outlined"
                      density="compact"
                      :rules="[rules.required]"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      color="var(--text-color-laranja)"
                      hide-details="auto"
                      readonly
                      placeholder="Selecione o almoxarifado de origem"
                      prepend-inner-icon="mdi-warehouse"
                    >
                      <template #append-inner>
                        <v-btn
                          icon="mdi-magnify"
                          variant="text"
                          size="x-small"
                          density="compact"
                          color="var(--text-color-laranja)"
                          :disabled="!form.id_empresasaida"
                          @click="abrirSelecaoAlmox('origem')"
                        ></v-btn>
                      </template>
                    </v-text-field>
                  </v-col>

                  <!-- Filial Destino -->
                  <v-col cols="12">
                    <v-divider class="my-2">
                      <span class="text-caption font-weight-bold opacity-60 px-2">DESTINO</span>
                    </v-divider>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="nomeEmpresaDestino"
                      label="Filial Destino *"
                      variant="outlined"
                      density="compact"
                      :rules="[rules.required]"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      color="var(--text-color-laranja)"
                      hide-details="auto"
                      readonly
                      placeholder="Selecione a filial de destino"
                      prepend-inner-icon="mdi-office-building-outline"
                    >
                      <template #append-inner>
                        <v-btn
                          icon="mdi-magnify"
                          variant="text"
                          size="x-small"
                          density="compact"
                          color="var(--text-color-laranja)"
                          @click="abrirSelecaoEmpresa('destino')"
                        ></v-btn>
                      </template>
                    </v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="nomeAlmoxDestino"
                      label="Almoxarifado Destino *"
                      variant="outlined"
                      density="compact"
                      :rules="[rules.required]"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      color="var(--text-color-laranja)"
                      hide-details="auto"
                      readonly
                      placeholder="Selecione o almoxarifado de destino"
                      prepend-inner-icon="mdi-warehouse"
                    >
                      <template #append-inner>
                        <v-btn
                          icon="mdi-magnify"
                          variant="text"
                          size="x-small"
                          density="compact"
                          color="var(--text-color-laranja)"
                          :disabled="!form.id_empresaentrada"
                          @click="abrirSelecaoAlmox('destino')"
                        ></v-btn>
                      </template>
                    </v-text-field>
                  </v-col>

                  <!-- Adicionar Item -->
                  <v-col cols="12">
                    <v-divider class="my-2">
                      <span class="text-caption font-weight-bold opacity-60 px-2">ADICIONAR ITEM</span>
                    </v-divider>
                  </v-col>

                  <v-col cols="12" sm="10" md="6">
                    <v-autocomplete
                      v-model="novoItem.id_produto"
                      :items="produtosStore.produtos"
                      item-title="descproduto"
                      item-value="id"
                      label="Produto *"
                      variant="outlined"
                      density="compact"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      color="var(--text-color-laranja)"
                      hide-details
                      clearable
                      prepend-inner-icon="mdi-package-variant-closed"
                      @update:modelValue="onProdutoSelecionado"
                    >
                      <template #item="{ item, props: itemProps }">
                        <v-list-item v-bind="itemProps">
                          <template #subtitle>
                            <span class="text-caption opacity-60">Cód: {{ item.raw.id }}</span>
                          </template>
                        </v-list-item>
                      </template>
                    </v-autocomplete>
                  </v-col>

                  <v-col cols="6" sm="3" md="2">
                    <v-text-field
                      v-model.number="novoItem.id_cor"
                      label="Cor"
                      type="number"
                      variant="outlined"
                      density="compact"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      color="var(--text-color-laranja)"
                      hide-details
                      clearable
                      prepend-inner-icon="mdi-palette-outline"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="6" sm="3" md="2">
                    <v-text-field
                      v-model="novoItem.id_tamanho"
                      label="Tamanho"
                      variant="outlined"
                      density="compact"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      color="var(--text-color-laranja)"
                      hide-details
                      clearable
                      prepend-inner-icon="mdi-ruler-square"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="6" sm="3" md="2">
                    <v-text-field
                      v-model.number="novoItem.quantidade"
                      label="Quantidade *"
                      type="number"
                      min="0.001"
                      step="0.001"
                      variant="outlined"
                      density="compact"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      color="var(--text-color-laranja)"
                      hide-details
                      prepend-inner-icon="mdi-counter"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="6" sm="3" md="2" class="d-flex align-center">
                    <v-btn
                      block
                      color="var(--text-color-laranja)"
                      variant="flat"
                      class="text-white"
                      prepend-icon="mdi-plus"
                      :disabled="!novoItem.id_produto || !novoItem.quantidade"
                      @click="adicionarItem"
                    >Adicionar</v-btn>
                  </v-col>

                </v-row>
              </v-form>

              <!-- GRID DE ITENS -->
              <v-divider class="my-4">
                <span class="text-caption font-weight-bold opacity-60 px-2">ITENS DA TRANSFERÊNCIA</span>
              </v-divider>

              <div v-if="itens.length === 0" class="text-center py-8">
                <v-icon icon="mdi-package-variant-closed-remove" size="52" class="mb-3 opacity-30"></v-icon>
                <p class="text-body-2 opacity-50">Nenhum item adicionado</p>
                <p class="text-caption opacity-40">Selecione um produto e quantidade acima</p>
              </div>

              <v-data-table
                v-else
                :headers="headersItens"
                :items="itens"
                density="compact"
                :theme="themeStore.darkMode ? 'dark' : 'light'"
                class="background-card rounded-lg"
                hide-default-footer
                :items-per-page="-1"
              >
                <template v-slot:[`item.quantidade`]="{ item }">
                  <v-text-field
                    v-model.number="item.quantidade"
                    type="number"
                    min="0.001"
                    step="0.001"
                    variant="plain"
                    density="compact"
                    hide-details
                    style="width: 100px;"
                    :theme="themeStore.darkMode ? 'dark' : 'light'"
                    color="var(--text-color-laranja)"
                  ></v-text-field>
                </template>

                <template v-slot:[`item.actions`]="{ item }">
                  <v-btn
                    icon="mdi-trash-can-outline"
                    variant="text"
                    size="x-small"
                    color="red"
                    @click="removerItem(item)"
                  ></v-btn>
                </template>

                <template #bottom>
                  <div class="d-flex justify-end pa-3">
                    <span class="text-caption font-weight-bold">
                      Total de itens: <strong>{{ itens.length }}</strong>
                    </span>
                  </div>
                </template>
              </v-data-table>
            </div>
          </v-tabs-window-item>

          <v-tabs-window-item value="recebimento">
            <div class="pa-4">
              <div class="d-flex flex-wrap align-center gap-2 mb-4">
                <v-btn
                  variant="outlined"
                  color="var(--text-color-laranja)"
                  prepend-icon="mdi-refresh"
                  :loading="store.loading"
                  @click="carregarRecebimentos"
                >Atualizar</v-btn>

                <v-text-field
                  v-model="pesquisaRecebimento"
                  placeholder="Pesquisar transferências para recebimento..."
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  density="compact"
                  hide-details
                  class="flex-grow-1"
                  style="min-width: 280px;"
                  :theme="themeStore.darkMode ? 'dark' : 'light'"
                  color="var(--text-color-laranja)"
                ></v-text-field>
              </div>

              <v-alert
                type="info"
                variant="tonal"
                class="mb-4"
                border="start"
              >
                Aqui ficam as transferências destinadas à empresa selecionada para conferência e recebimento.
              </v-alert>

              <v-row>
                <v-col cols="12" lg="7">
                  <v-card class="background-card" rounded="lg" elevation="0">
                    <v-card-title class="text-subtitle-1 d-flex align-center gap-2">
                      <v-icon icon="mdi-truck-delivery-outline" color="var(--text-color-laranja)"></v-icon>
                      Transferências pendentes
                    </v-card-title>
                    <v-card-text>
                      <div v-if="store.loading" class="text-center py-8">
                        <v-progress-circular indeterminate color="var(--text-color-laranja)"></v-progress-circular>
                      </div>

                      <div v-else-if="recebimentosFiltrados.length === 0" class="text-center py-8">
                        <v-icon icon="mdi-package-variant-closed-check" size="52" class="mb-3 opacity-30"></v-icon>
                        <p class="text-body-2 opacity-50">Nenhuma transferência encontrada para recebimento</p>
                      </div>

                      <v-data-table
                        v-else
                        :headers="headersRecebimento"
                        :items="recebimentosFiltrados"
                        density="compact"
                        :theme="themeStore.darkMode ? 'dark' : 'light'"
                        class="rounded-lg"
                        hide-default-footer
                        :items-per-page="-1"
                      >
                        <template v-slot:[`item.origem_label`]="{ item }">
                          <span>{{ item.origem_label }}</span>
                        </template>

                        <template v-slot:[`item.destino_label`]="{ item }">
                          <span>{{ item.destino_label }}</span>
                        </template>

                        <template v-slot:[`item.situacao`]="{ item }">
                          <v-chip
                            :color="item.situacao === 'C' ? 'success' : 'warning'"
                            size="x-small"
                            variant="flat"
                          >
                            {{ item.situacao === 'C' ? 'Concluído' : 'Pendente' }}
                          </v-chip>
                        </template>

                        <template v-slot:[`item.actions`]="{ item }">
                          <v-btn
                            icon="mdi-eye-outline"
                            variant="text"
                            size="x-small"
                            color="var(--text-color-laranja)"
                            @click="selecionarRecebimento(item)"
                          ></v-btn>
                        </template>
                      </v-data-table>
                    </v-card-text>
                  </v-card>
                </v-col>

                <v-col cols="12" lg="5">
                  <v-card class="background-card h-100" rounded="lg" elevation="0">
                    <v-card-title class="text-subtitle-1 d-flex align-center gap-2">
                      <v-icon icon="mdi-clipboard-text-outline" color="var(--text-color-laranja)"></v-icon>
                      Detalhes do recebimento
                    </v-card-title>
                    <v-card-text>
                      <div v-if="!recebimentoSelecionado" class="text-center py-10">
                        <v-icon icon="mdi-package-variant" size="52" class="mb-3 opacity-30"></v-icon>
                        <p class="text-body-2 opacity-50">Selecione uma transferência para visualizar os itens</p>
                      </div>

                      <template v-else>
                        <v-row dense>
                          <v-col cols="12" sm="4">
                            <v-text-field
                              :model-value="recebimentoSelecionado.id"
                              label="Transferência"
                              variant="outlined"
                              density="compact"
                              readonly
                              hide-details
                              prepend-inner-icon="mdi-pound"
                              :theme="themeStore.darkMode ? 'dark' : 'light'"
                              color="var(--text-color-laranja)"
                            ></v-text-field>
                          </v-col>

                          <v-col cols="12" sm="8" class="d-flex align-center gap-2">
                            <v-chip color="var(--text-color-laranja)" class="text-white" variant="flat">
                              {{ recebimentoSelecionado.itens.length }} item(ns)
                            </v-chip>
                            <v-chip
                              :color="recebimentoSelecionado.situacao === 'C' ? 'success' : 'warning'"
                              variant="flat"
                            >
                              <v-icon start :icon="recebimentoSelecionado.situacao === 'C' ? 'mdi-check-circle' : 'mdi-clock-outline'"></v-icon>
                              {{ recebimentoSelecionado.situacao === 'C' ? 'Concluído' : 'Pendente' }}
                            </v-chip>
                          </v-col>

                          <v-col cols="12">
                            <v-text-field
                              :model-value="recebimentoSelecionado.origem"
                              label="Origem"
                              variant="outlined"
                              density="compact"
                              readonly
                              hide-details
                              prepend-inner-icon="mdi-office-building-outline"
                              :theme="themeStore.darkMode ? 'dark' : 'light'"
                              color="var(--text-color-laranja)"
                            ></v-text-field>
                          </v-col>

                          <v-col cols="12">
                            <v-text-field
                              :model-value="recebimentoSelecionado.almoxOrigem"
                              label="Almoxarifado Origem"
                              variant="outlined"
                              density="compact"
                              readonly
                              hide-details
                              prepend-inner-icon="mdi-warehouse"
                              :theme="themeStore.darkMode ? 'dark' : 'light'"
                              color="var(--text-color-laranja)"
                            ></v-text-field>
                          </v-col>

                          <v-col cols="12">
                            <v-text-field
                              :model-value="recebimentoSelecionado.destino"
                              label="Destino"
                              variant="outlined"
                              density="compact"
                              readonly
                              hide-details
                              prepend-inner-icon="mdi-office-building-outline"
                              :theme="themeStore.darkMode ? 'dark' : 'light'"
                              color="var(--text-color-laranja)"
                            ></v-text-field>
                          </v-col>

                          <v-col cols="12">
                            <v-text-field
                              :model-value="recebimentoSelecionado.almoxDestino"
                              label="Almoxarifado Destino"
                              variant="outlined"
                              density="compact"
                              readonly
                              hide-details
                              prepend-inner-icon="mdi-warehouse"
                              :theme="themeStore.darkMode ? 'dark' : 'light'"
                              color="var(--text-color-laranja)"
                            ></v-text-field>
                          </v-col>
                        </v-row>

                        <v-divider class="my-4"></v-divider>

                        <v-data-table
                          :headers="headersItensRecebimento"
                          :items="recebimentoSelecionado.itens"
                          density="compact"
                          :theme="themeStore.darkMode ? 'dark' : 'light'"
                          class="rounded-lg"
                          hide-default-footer
                          :items-per-page="-1"
                        ></v-data-table>

                        <div class="d-flex flex-wrap justify-end gap-2 mt-4">
                          <v-btn
                            variant="outlined"
                            color="var(--text-color-laranja)"
                            prepend-icon="mdi-printer-outline"
                            @click="imprimirRecebimento"
                          >Imprimir</v-btn>

                          <v-btn
                            variant="outlined"
                            color="var(--text-color-laranja)"
                            prepend-icon="mdi-open-in-new"
                            @click="abrirRecebimentoNaTransferencia"
                          >Abrir na transferência</v-btn>

                          <v-btn
                            v-if="recebimentoSelecionado.situacao !== 'C'"
                            color="var(--text-color-laranja)"
                            variant="flat"
                            class="text-white"
                            prepend-icon="mdi-check-circle-outline"
                            :loading="store.loading"
                            @click="confirmarRecebimento"
                          >Confirmar Recebimento</v-btn>
                        </div>
                      </template>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </div>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card-text>
    </v-card>

    <!-- ===== DIALOG: LISTA DE TRANSFERÊNCIAS ===== -->
    <v-dialog v-model="dialogLista" max-width="900" :theme="themeStore.darkMode ? 'dark' : 'light'">
      <v-card class="background-secondary" rounded="xl">
        <v-card-title class="pa-5 d-flex align-center justify-space-between">
          <div class="d-flex align-center gap-2">
            <v-icon icon="mdi-swap-horizontal-bold" color="var(--text-color-laranja)"></v-icon>
            <span>Transferências</span>
          </div>
          <v-btn icon="mdi-close" variant="text" size="small" @click="dialogLista = false" />
        </v-card-title>

        <v-card-text class="pa-4 pt-0">
          <v-text-field
            v-model="pesquisa"
            placeholder="Pesquisar..."
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            hide-details
            :theme="themeStore.darkMode ? 'dark' : 'light'"
            color="var(--text-color-laranja)"
            class="mb-4"
          ></v-text-field>

          <div v-if="store.loading" class="text-center py-8">
            <v-progress-circular indeterminate color="var(--text-color-laranja)"></v-progress-circular>
          </div>

          <v-data-table
            v-else
            :headers="headersLista"
            :items="transferenciasFiltradas"
            density="compact"
            :theme="themeStore.darkMode ? 'dark' : 'light'"
            class="background-card rounded-lg"
            :search="pesquisa"
          >
          <template v-slot:[`item.actions`]="{ item }">
              <div class="d-flex gap-1">
                <v-btn
                  icon="mdi-eye-outline"
                  variant="text"
                  size="x-small"
                  color="var(--text-color-laranja)"
                  @click="carregarTransferencia(item)"
                ></v-btn>
                <v-btn
                  icon="mdi-trash-can-outline"
                  variant="text"
                  size="x-small"
                  color="red"
                  @click="excluirDaLista(item)"
                ></v-btn>
              </div>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- ===== DIALOG: SELEÇÃO DE EMPRESA ===== -->
    <v-dialog v-model="dialogEmpresa" max-width="600" :theme="themeStore.darkMode ? 'dark' : 'light'">
      <v-card class="background-secondary" rounded="xl">
        <v-card-title class="pa-5 d-flex align-center justify-space-between">
          <span>Selecionar Filial ({{ selecaoTipo === 'origem' ? 'Origem' : 'Destino' }})</span>
          <v-btn icon="mdi-close" variant="text" size="small" @click="dialogEmpresa = false" />
        </v-card-title>
        <v-card-text class="pa-4 pt-0">
          <v-text-field
            v-model="pesquisaEmpresa"
            placeholder="Pesquisar empresa..."
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            hide-details
            class="mb-3"
            :theme="themeStore.darkMode ? 'dark' : 'light'"
            color="var(--text-color-laranja)"
          ></v-text-field>
          <v-list density="compact" max-height="360" style="overflow-y:auto" class="pa-0">
            <v-list-item
              v-for="emp in empresasFiltradas"
              :key="emp.id"
              class="background-card rounded-lg mb-1"
              style="cursor:pointer"
              @click="selecionarEmpresa(emp)"
            >
              <template #prepend>
                <v-icon icon="mdi-office-building-outline" size="18" class="mr-2" color="var(--text-color-laranja)"></v-icon>
              </template>
              <template #title>
                <span class="text-body-2 font-weight-medium">{{ emp.razao_social || emp.fantasia }}</span>
              </template>
              <template #subtitle>
                <span class="text-caption opacity-60">ID: {{ emp.id }}</span>
              </template>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- ===== DIALOG: SELEÇÃO DE ALMOXARIFADO ===== -->
    <v-dialog v-model="dialogAlmox" max-width="600" :theme="themeStore.darkMode ? 'dark' : 'light'">
      <v-card class="background-secondary" rounded="xl">
        <v-card-title class="pa-5 d-flex align-center justify-space-between">
          <span>Selecionar Almoxarifado ({{ selecaoTipo === 'origem' ? 'Origem' : 'Destino' }})</span>
          <v-btn icon="mdi-close" variant="text" size="small" @click="dialogAlmox = false" />
        </v-card-title>
        <v-card-text class="pa-4 pt-0">
          <v-text-field
            v-model="pesquisaAlmox"
            placeholder="Pesquisar almoxarifado..."
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            hide-details
            class="mb-3"
            :theme="themeStore.darkMode ? 'dark' : 'light'"
            color="var(--text-color-laranja)"
          ></v-text-field>
          <div v-if="estoqueStore.loading" class="text-center py-6">
            <v-progress-circular indeterminate color="var(--text-color-laranja)" size="24"></v-progress-circular>
          </div>
          <v-list v-else density="compact" max-height="360" style="overflow-y:auto" class="pa-0">
            <v-list-item
              v-for="alm in almoxFiltrados"
              :key="alm.id"
              class="background-card rounded-lg mb-1"
              style="cursor:pointer"
              @click="selecionarAlmox(alm)"
            >
              <template #prepend>
                <v-icon icon="mdi-warehouse" size="18" class="mr-2" color="var(--text-color-laranja)"></v-icon>
              </template>
              <template #title>
                <span class="text-body-2 font-weight-medium">{{ alm.descalmoxarifado || alm.descricao }}</span>
              </template>
              <template #subtitle>
                <span class="text-caption opacity-60">ID: {{ alm.id }}</span>
              </template>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- ===== DIALOG: CONFIRMAR EXCLUSÃO ===== -->
    <v-dialog v-model="dialogExclusao" max-width="380" :theme="themeStore.darkMode ? 'dark' : 'light'">
      <v-card class="background-secondary" rounded="xl">
        <v-card-title class="pa-5 d-flex align-center gap-2">
          <v-icon icon="mdi-alert-circle-outline" color="red" size="24"></v-icon>
          Excluir Transferência
        </v-card-title>
        <v-card-text>
          Tem certeza que deseja excluir a transferência <strong>#{{ form.id }}</strong>? Esta ação não pode ser desfeita.
        </v-card-text>
        <v-card-actions class="pa-4 d-flex justify-end gap-2">
          <v-btn variant="text" @click="dialogExclusao = false">Cancelar</v-btn>
          <v-btn color="red" variant="flat" class="text-white" :loading="store.loading" @click="excluirTransferencia">Excluir</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useThemeStore } from '@/stores/config-temas/theme'
import { useTransfAlmoxStore } from '@/stores/APIs/transfalmox'
import { useEmpresaStore } from '@/stores/APIs/empresa'
import { useEstoqueStore } from '@/stores/APIs/estoque'
import { useProdutosStore } from '@/stores/APIs/produtos'
import { abrirImpressaoTransferenciaAlmox } from '@/components/impressos/transfalmox'

const themeStore = useThemeStore()
const store = useTransfAlmoxStore()
const empresaStore = useEmpresaStore()
const estoqueStore = useEstoqueStore()
const produtosStore = useProdutosStore()
const abaAtiva = ref('transferencia')

// ID da empresa logada (usa empresa selecionada no navbar)
const idEmpresaAtual = computed(() => {
  return empresaStore.empresaSelecionada?.id || null
})

onMounted(async () => {
  await Promise.all([
    empresaStore.buscarTodasEmpresas(),
    produtosStore.buscarProdutos(),
  ])
})

// ===== FORM STATE =====
const formRef = ref(null)
const formValido = ref(false)
const transferenciaSalva = ref(false)

const formVazio = () => ({
  id: null,
  id_empresa: idEmpresaAtual.value,
  id_empresasaida: null,
  id_almoxsaida: null,
  id_empresaentrada: null,
  id_almoxentrada: null,
  imprimir: false,
})
const form = ref(formVazio())

const nomeEmpresaOrigem = ref('')
const nomeAlmoxOrigem = ref('')
const nomeEmpresaDestino = ref('')
const nomeAlmoxDestino = ref('')

const itens = ref([])
const novoItem = ref({ id_produto: null, descproduto: '', id_cor: 0, id_tamanho: 0, quantidade: 1 })

const rules = {
  required: (v) => !!v || 'Campo obrigatório',
}

// ===== DIALOGS =====
const dialogLista = ref(false)
const dialogEmpresa = ref(false)
const dialogAlmox = ref(false)
const dialogExclusao = ref(false)
const pesquisa = ref('')
const pesquisaRecebimento = ref('')
const pesquisaEmpresa = ref('')
const pesquisaAlmox = ref('')
const selecaoTipo = ref('origem') // 'origem' | 'destino'
const recebimentoSelecionado = ref(null)
const transferenciaDetalhes = ref(null)

// ===== HEADERS =====
const headersItens = [
  { title: 'Cód.', key: 'id_produto', sortable: true, width: '80px' },
  { title: 'Produto', key: 'descproduto', sortable: true },
  { title: 'Cor', key: 'id_cor', sortable: false, width: '80px' },
  { title: 'Tamanho', key: 'id_tamanho', sortable: false, width: '100px' },
  { title: 'Quantidade', key: 'quantidade', sortable: false, width: '130px' },
  { title: 'Ações', key: 'actions', sortable: false, width: '60px' },
]

const headersLista = [
  { title: 'ID', key: 'id', sortable: true, width: '80px' },
  { title: 'Filial Origem', key: 'id_empresasaida', sortable: true },
  { title: 'Almox Origem', key: 'id_almoxsaida', sortable: true },
  { title: 'Filial Destino', key: 'id_empresaentrada', sortable: true },
  { title: 'Almox Destino', key: 'id_almoxentrada', sortable: true },
  { title: 'Ações', key: 'actions', sortable: false, width: '80px' },
]

const headersRecebimento = [
  { title: 'ID', key: 'id', sortable: true, width: '80px' },
  { title: 'Origem', key: 'origem_label', sortable: true },
  { title: 'Destino', key: 'destino_label', sortable: true },
  { title: 'Situação', key: 'situacao', sortable: true, width: '110px' },
  { title: 'Ações', key: 'actions', sortable: false, width: '70px' },
]

const headersItensRecebimento = [
  { title: 'Cód.', key: 'id_produto', sortable: true, width: '80px' },
  { title: 'Produto', key: 'descproduto', sortable: true },
  { title: 'Cor', key: 'id_cor', sortable: false, width: '80px' },
  { title: 'Tamanho', key: 'id_tamanho', sortable: false, width: '100px' },
  { title: 'Quantidade', key: 'quantidade', sortable: false, width: '130px' },
]

// ===== COMPUTED =====
const transferenciasFiltradas = computed(() => {
  const t = pesquisa.value.toLowerCase().trim()
  if (!t) return store.transferencias
  return store.transferencias.filter(tr =>
    String(tr.id).includes(t) ||
    String(tr.id_empresasaida).includes(t) ||
    String(tr.id_empresaentrada).includes(t)
  )
})

const recebimentosFiltrados = computed(() => {
  const t = pesquisaRecebimento.value.toLowerCase().trim()
  const lista = (store.transferencias || [])
    .filter(tr => Number(tr.id_empresaentrada) === Number(idEmpresaAtual.value))
    .map(tr => ({
      ...tr,
      origem_label: obterNomeEmpresa(tr.id_empresasaida),
      destino_label: obterNomeEmpresa(tr.id_empresaentrada),
    }))

  if (!t) return lista

  return lista.filter(tr =>
    String(tr.id).includes(t) ||
    String(tr.id_empresasaida).includes(t) ||
    String(tr.id_empresaentrada).includes(t) ||
    tr.origem_label.toLowerCase().includes(t) ||
    tr.destino_label.toLowerCase().includes(t)
  )
})

const empresasFiltradas = computed(() => {
  const t = pesquisaEmpresa.value.toLowerCase().trim()
  const lista = empresaStore.empresas || []
  if (!t) return lista
  return lista.filter(e =>
    String(e.id).includes(t) ||
    (e.razao_social || e.fantasia || '').toLowerCase().includes(t)
  )
})

const almoxFiltrados = computed(() => {
  const t = pesquisaAlmox.value.toLowerCase().trim()
  const lista = estoqueStore.almoxarifados || []
  if (!t) return lista
  return lista.filter(a =>
    String(a.id).includes(t) ||
    (a.descalmoxarifado || a.descricao || '').toLowerCase().includes(t)
  )
})

const obterNomeEmpresa = (idEmpresa) => {
  if (!idEmpresa) return ''
  const emp = (empresaStore.empresas || []).find(e => Number(e.id) === Number(idEmpresa))
  return emp ? `${emp.id} - ${emp.razao_social || emp.fantasia}` : `Empresa #${idEmpresa}`
}

const obterNomeAlmoxarifado = async (idEmpresa, idAlmox) => {
  if (!idEmpresa || !idAlmox) return ''
  await estoqueStore.buscarAlmoxarifados(idEmpresa)
  const alm = (estoqueStore.almoxarifados || []).find(a => Number(a.id) === Number(idAlmox))
  return alm ? `${alm.id} - ${alm.descalmoxarifado || alm.descricao}` : `Almoxarifado #${idAlmox}`
}

const normalizarItensTransferencia = (dadosItens = []) => {
  return dadosItens.map(i => ({
    id_produto: i.id_produto,
    descproduto: i.descproduto || produtosStore.produtos.find(p => p.id === i.id_produto)?.descproduto || '',
    id_cor: Number(i.id_cor) || 0,
    id_tamanho: Number(i.id_tamanho) || 0,
    quantidade: i.quantidade,
  }))
}

const obterItensTransferencia = (dados = {}) => {
  return normalizarItensTransferencia(dados.itens || dados.item || [])
}

// ===== EMPRESA LOOKUP =====
const buscarEmpresaOrigem = async () => {
  if (!form.value.id_empresasaida) { nomeEmpresaOrigem.value = ''; return }
  nomeEmpresaOrigem.value = obterNomeEmpresa(form.value.id_empresasaida)
}

const buscarEmpresaDestino = async () => {
  if (!form.value.id_empresaentrada) { nomeEmpresaDestino.value = ''; return }
  nomeEmpresaDestino.value = obterNomeEmpresa(form.value.id_empresaentrada)
}

// ===== ALMOX LOOKUP =====
const buscarAlmoxOrigem = async () => {
  if (!form.value.id_almoxsaida || !form.value.id_empresasaida) { nomeAlmoxOrigem.value = ''; return }
  nomeAlmoxOrigem.value = await obterNomeAlmoxarifado(form.value.id_empresasaida, form.value.id_almoxsaida)
}

const buscarAlmoxDestino = async () => {
  if (!form.value.id_almoxentrada || !form.value.id_empresaentrada) { nomeAlmoxDestino.value = ''; return }
  nomeAlmoxDestino.value = await obterNomeAlmoxarifado(form.value.id_empresaentrada, form.value.id_almoxentrada)
}

// ===== SELEÇÃO VIA DIALOG =====
const abrirSelecaoEmpresa = (tipo) => {
  selecaoTipo.value = tipo
  pesquisaEmpresa.value = ''
  dialogEmpresa.value = true
}

const selecionarEmpresa = (emp) => {
  if (selecaoTipo.value === 'origem') {
    form.value.id_empresasaida = emp.id
    nomeEmpresaOrigem.value = `${emp.id} - ${emp.razao_social || emp.fantasia}`
    form.value.id_almoxsaida = null
    nomeAlmoxOrigem.value = ''
  } else {
    form.value.id_empresaentrada = emp.id
    nomeEmpresaDestino.value = `${emp.id} - ${emp.razao_social || emp.fantasia}`
    form.value.id_almoxentrada = null
    nomeAlmoxDestino.value = ''
  }
  dialogEmpresa.value = false
}

const abrirSelecaoAlmox = async (tipo) => {
  selecaoTipo.value = tipo
  pesquisaAlmox.value = ''
  const idemp = tipo === 'origem' ? form.value.id_empresasaida : form.value.id_empresaentrada
  if (idemp) await estoqueStore.buscarAlmoxarifados(idemp)
  dialogAlmox.value = true
}

const selecionarAlmox = (alm) => {
  if (selecaoTipo.value === 'origem') {
    form.value.id_almoxsaida = alm.id
    nomeAlmoxOrigem.value = `${alm.id} - ${alm.descalmoxarifado || alm.descricao}`
  } else {
    form.value.id_almoxentrada = alm.id
    nomeAlmoxDestino.value = `${alm.id} - ${alm.descalmoxarifado || alm.descricao}`
  }
  dialogAlmox.value = false
}

// ===== PRODUTO ITEM =====
const onProdutoSelecionado = (id) => {
  const prod = produtosStore.produtos.find(p => p.id === id)
  novoItem.value.descproduto = prod ? prod.descproduto : ''
}

const adicionarItem = () => {
  if (!novoItem.value.id_produto || !novoItem.value.quantidade) return
  const jaExiste = itens.value.find(i =>
    i.id_produto === novoItem.value.id_produto &&
    i.id_cor === novoItem.value.id_cor &&
    i.id_tamanho === novoItem.value.id_tamanho
  )
  if (jaExiste) {
    jaExiste.quantidade += novoItem.value.quantidade
  } else {
    itens.value.push({ ...novoItem.value })
  }
  novoItem.value = { id_produto: null, descproduto: '', id_cor: 0, id_tamanho: 0, quantidade: 1 }
}

const removerItem = (item) => {
  const idx = itens.value.indexOf(item)
  if (idx > -1) itens.value.splice(idx, 1)
}

// ===== AÇÕES PRINCIPAIS =====
const novaTransferencia = () => {
  form.value = formVazio()
  itens.value = []
  nomeEmpresaOrigem.value = ''
  nomeAlmoxOrigem.value = ''
  nomeEmpresaDestino.value = ''
  nomeAlmoxDestino.value = ''
  transferenciaSalva.value = false
  transferenciaDetalhes.value = null
  formRef.value?.resetValidation()
}

const carregarRecebimentos = async () => {
  if (!idEmpresaAtual.value) return
  await store.listarTransferencias(idEmpresaAtual.value)
}

const salvar = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid || itens.value.length === 0) return

  const payload = {
    id_empresa: form.value.id_empresa || idEmpresaAtual.value,
    id_empresasaida: form.value.id_empresasaida,
    id_almoxsaida: form.value.id_almoxsaida,
    id_empresaentrada: form.value.id_empresaentrada,
    id_almoxentrada: form.value.id_almoxentrada,
    itens: itens.value.map(i => ({
      id_produto: i.id_produto,
      id_cor: Number(i.id_cor) || 0,
      id_tamanho: Number(i.id_tamanho) || 0,
      quantidade: i.quantidade,
    })),
  }

  const resultado = await store.cadastrarTransferencia(payload)
  if (resultado) {
    form.value.id = resultado?.data?.[0]?.id || resultado?.id || null
    transferenciaSalva.value = true
    transferenciaDetalhes.value = {
      id: form.value.id,
      id_empresa: form.value.id_empresa || idEmpresaAtual.value,
      id_empresasaida: form.value.id_empresasaida,
      nome_empresasaida: nomeEmpresaOrigem.value.split(' - ').slice(1).join(' - ') || nomeEmpresaOrigem.value,
      id_almoxsaida: form.value.id_almoxsaida,
      almox_saida: nomeAlmoxOrigem.value.split(' - ').slice(1).join(' - ') || nomeAlmoxOrigem.value,
      id_empresaentrada: form.value.id_empresaentrada,
      nome_empresaentrada: nomeEmpresaDestino.value.split(' - ').slice(1).join(' - ') || nomeEmpresaDestino.value,
      id_almoxentrada: form.value.id_almoxentrada,
      almox_entrada: nomeAlmoxDestino.value.split(' - ').slice(1).join(' - ') || nomeAlmoxDestino.value,
      itens: itens.value,
    }
  }
}

const confirmarExclusao = () => { dialogExclusao.value = true }

const excluirTransferencia = async () => {
  const idemp = form.value.id_empresa || idEmpresaAtual.value
  await store.excluirTransferencia(idemp, form.value.id)
  dialogExclusao.value = false
  novaTransferencia()
}

const abrirLista = async () => {
  pesquisa.value = ''
  const idemp = form.value.id_empresa || idEmpresaAtual.value
  if (idemp) await store.listarTransferencias(idemp)
  dialogLista.value = true
}

const carregarTransferencia = async (item) => {
  const idemp = item.id_empresa || idEmpresaAtual.value
  const dados = await store.buscarTransferencia(idemp, item.id)
  if (!dados) return

  form.value = {
    id: dados.id,
    id_empresa: dados.id_empresa,
    id_empresasaida: dados.id_empresasaida,
    id_almoxsaida: dados.id_almoxsaida,
    id_empresaentrada: dados.id_empresaentrada,
    id_almoxentrada: dados.id_almoxentrada,
    imprimir: false,
  }

  await buscarEmpresaOrigem()
  await buscarEmpresaDestino()
  await buscarAlmoxOrigem()
  await buscarAlmoxDestino()

  itens.value = obterItensTransferencia(dados)
  transferenciaDetalhes.value = {
    ...dados,
    itens: obterItensTransferencia(dados),
  }

  transferenciaSalva.value = true
  dialogLista.value = false
}

const selecionarRecebimento = async (item) => {
  const idemp = item.id_empresa || idEmpresaAtual.value
  const dados = await store.buscarTransferencia(idemp, item.id)
  if (!dados) return

  const origem = obterNomeEmpresa(dados.id_empresasaida)
  const destino = obterNomeEmpresa(dados.id_empresaentrada)
  const almoxOrigem = await obterNomeAlmoxarifado(dados.id_empresasaida, dados.id_almoxsaida)
  const almoxDestino = await obterNomeAlmoxarifado(dados.id_empresaentrada, dados.id_almoxentrada)

  recebimentoSelecionado.value = {
    ...dados,
    id: dados.id,
    id_empresa: dados.id_empresa,
    origem,
    destino,
    almoxOrigem,
    almoxDestino,
    itens: obterItensTransferencia(dados),
  }
}

const abrirRecebimentoNaTransferencia = async () => {
  if (!recebimentoSelecionado.value) return
  await carregarTransferencia({
    id: recebimentoSelecionado.value.id,
    id_empresa: recebimentoSelecionado.value.id_empresa,
  })
  abaAtiva.value = 'transferencia'
}

const excluirDaLista = async (item) => {
  const idemp = item.id_empresa || idEmpresaAtual.value
  await store.excluirTransferencia(idemp, item.id)
}

const imprimir = () => {
  const empresaSelecionada = empresaStore.empresaSelecionada
  const detalhes = transferenciaDetalhes.value || {}
  const nomeEmpresa = empresaSelecionada?.razao_social || empresaSelecionada?.fantasia || detalhes.nome_empresaentrada || detalhes.nome_empresasaida || 'Empresa'

  abrirImpressaoTransferenciaAlmox({
    ...detalhes,
    nomeEmpresa,
    modulo: 'Estoque',
    idTransferencia: detalhes.id || form.value.id || '-',
    id_empresasaida: detalhes.id_empresasaida || form.value.id_empresasaida,
    nome_empresasaida: detalhes.nome_empresasaida || nomeEmpresaOrigem.value.split(' - ').slice(1).join(' - ') || nomeEmpresaOrigem.value,
    id_almoxsaida: detalhes.id_almoxsaida || form.value.id_almoxsaida,
    almox_saida: detalhes.almox_saida || nomeAlmoxOrigem.value.split(' - ').slice(1).join(' - ') || nomeAlmoxOrigem.value,
    id_empresaentrada: detalhes.id_empresaentrada || form.value.id_empresaentrada,
    nome_empresaentrada: detalhes.nome_empresaentrada || nomeEmpresaDestino.value.split(' - ').slice(1).join(' - ') || nomeEmpresaDestino.value,
    id_almoxentrada: detalhes.id_almoxentrada || form.value.id_almoxentrada,
    almox_entrada: detalhes.almox_entrada || nomeAlmoxDestino.value.split(' - ').slice(1).join(' - ') || nomeAlmoxDestino.value,
    nome_usuariosaida: detalhes.nome_usuariosaida,
    nome_usuarioentrada: detalhes.nome_usuarioentrada,
    dhsaida: detalhes.dhsaida,
    dhentrada: detalhes.dhentrada,
    itens: detalhes.itens || itens.value,
  })
}

const imprimirRecebimento = () => {
  if (!recebimentoSelecionado.value) return

  const empresaSelecionada = empresaStore.empresaSelecionada
  const nomeEmpresa = empresaSelecionada?.razao_social || empresaSelecionada?.fantasia || recebimentoSelecionado.value.nome_empresaentrada || 'Empresa'

  abrirImpressaoTransferenciaAlmox({
    ...recebimentoSelecionado.value,
    nomeEmpresa,
    modulo: 'Recebimento de Estoque',
    idTransferencia: recebimentoSelecionado.value.id || '-',
    itens: recebimentoSelecionado.value.itens || [],
  })
}

const confirmarRecebimento = async () => {
  if (!recebimentoSelecionado.value) return
  const rec = recebimentoSelecionado.value
  const payload = {
    id: rec.id,
    id_empresasaida: rec.id_empresasaida,
    id_almoxsaida: rec.id_almoxsaida,
    id_empresaentrada: rec.id_empresaentrada,
    id_almoxentrada: rec.id_almoxentrada,
  }
  const resultado = await store.receberTransferencia(payload)
  if (resultado) {
    recebimentoSelecionado.value = null
    await carregarRecebimentos()
  }
}
</script>
