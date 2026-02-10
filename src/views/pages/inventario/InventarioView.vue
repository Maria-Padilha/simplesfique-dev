<template>
  <top-all-pages icon="mdi-package-variant-closed">
    <template #titulo>Inventário de Produtos</template>
    <template #acoes>
      <v-btn
          :color="loteAberto ? 'grey' : 'var(--text-color-laranja)'"
          :variant="loteAberto ? 'outlined' : 'flat'"
          :prepend-icon="loteAberto ? 'mdi-close' : 'mdi-plus'"
          @click="toggleLote"
          class="text-white"
      >
        {{ loteAberto ? 'Cancelar Criação' : 'Criar Novo Lote' }}
      </v-btn>
    </template>
    <template #section>
      <div>
        <!-- Formulário de Criação de Lote (Expandível) -->
        <v-expand-transition>
          <div v-if="loteAberto">
            <!-- Card de Configuração -->
        <v-card class="background-secondary mb-4" elevation="0">
          <v-card-title class="text-h6 pa-4">
            <v-icon icon="mdi-cog" class="mr-2"></v-icon>
            Configuração do Inventário
          </v-card-title>
          <v-card-text class="pa-4">
            <v-row>
              <!-- Almoxarifado -->
              <v-col cols="12" md="4">
                <v-autocomplete
                    v-model="inventario.id_almoxarifado"
                    :items="almoxarifados"
                    label="Almoxarifado *"
                    variant="outlined"
                    density="compact"
                    prepend-inner-icon="mdi-warehouse"
                    :rules="[v => !!v || 'Selecione um almoxarifado']"
                    item-title="descalmoxarifado"
                    item-value="id"
                    :loading="carregandoAlmoxarifados"
                >
                  <template #item="{ props }">
                    <v-list-item v-bind="props">
                      <template #prepend>
                        <v-icon icon="mdi-warehouse" color="var(--text-color-laranja)"></v-icon>
                      </template>
                    </v-list-item>
                  </template>
                </v-autocomplete>
              </v-col>

              <!-- Tipo de Inventário -->
              <v-col cols="12" md="4">
                <v-select
                    v-model="inventario.tipo"
                    :items="tiposInventario"
                    label="Tipo de Lançamento *"
                    variant="outlined"
                    density="compact"
                    prepend-inner-icon="mdi-form-select"
                    :rules="[v => !!v || 'Selecione o tipo']"
                >
                  <template #item="{ props, item }">
                    <v-list-item v-bind="props">
                      <template #prepend>
                        <v-icon 
                            :icon="item.raw.icon" 
                            :color="item.raw.color"
                        ></v-icon>
                      </template>
                    </v-list-item>
                  </template>
                </v-select>
              </v-col>

              <!-- Data do Inventário -->
              <v-col cols="12" md="4">
                <v-text-field
                    v-model="inventario.data"
                    label="Data do Inventário *"
                    type="date"
                    variant="outlined"
                    density="compact"
                    prepend-inner-icon="mdi-calendar"
                    readonly
                    :rules="[v => !!v || 'Informe a data']"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Card de Lançamento -->
        <v-card :color="themeStore.darkMode ? 'text-white' : ''" class="background-secondary mb-4">
          <v-card-title class="text-h6 pa-4">
            <v-icon 
                :icon="inventario.tipo === 'automatico' ? 'mdi-barcode-scan' : 'mdi-keyboard'" 
                class="mr-2"
            ></v-icon>
            {{ inventario.tipo === 'automatico' ? 'Lançamento por Coletor de Dados' : 'Lançamento Manual' }}
          </v-card-title>

          <v-card-text class="pa-4">
            <!-- Modo Automático (Importação de Arquivo) -->
            <div v-if="inventario.tipo === 'A'">
              <v-alert 
                  type="info" 
                  variant="tonal" 
                  class="mb-4"
                  icon="mdi-information"
              >
                <strong>Modo Automático:</strong> Importe um arquivo de texto (.txt) com os produtos e quantidades do inventário.
              </v-alert>

              <v-row>
                <!-- Upload de Arquivo -->
                <v-col cols="12" md="6">
                  <v-file-input
                      v-model="inventario.arquivo"
                      label="Arquivo de Inventário (.txt) *"
                      variant="outlined"
                      density="compact"
                      prepend-inner-icon="mdi-file-document"
                      prepend-icon=""
                      accept=".txt"
                      :rules="[v => !!v || 'Selecione um arquivo']"
                      @change="processarArquivo"
                  >
                    <template #selection="{ fileNames }">
                      <v-chip size="small" color="var(--text-color-laranja)" variant="tonal">
                        {{ fileNames[0] }}
                      </v-chip>
                    </template>
                  </v-file-input>
                </v-col>

                <!-- Tipo de Documento -->
                <v-col cols="12" md="6">
                  <v-select
                      v-model="inventario.layout_utilizado"
                      :items="tiposDocumento"
                      label="Tipo de Documento *"
                      variant="outlined"
                      density="compact"
                      prepend-inner-icon="mdi-file-cog"
                      :rules="[v => !!v || 'Selecione o tipo']"
                  >
                    <template #item="{ props, item }">
                      <v-list-item v-bind="props">
                        <template #prepend>
                          <v-icon :icon="item.raw.icon" color="var(--text-color-laranja)"></v-icon>
                        </template>
                      </v-list-item>
                    </template>
                  </v-select>
                </v-col>

                <!-- Formato do Arquivo -->
                <v-col cols="12" md="6">
                  <v-checkbox
                      v-model="usarSeparador"
                      label="Usar separador"
                      density="compact"
                      color="var(--text-color-laranja)"
                      hide-details
                  ></v-checkbox>
                </v-col>

                <!-- Separador (se usar separador) -->
                <v-col cols="12" md="6" v-if="usarSeparador">
                  <v-select
                      v-model="inventario.separador_char"
                      :items="separadores"
                      label="Separador *"
                      variant="outlined"
                      density="compact"
                      prepend-inner-icon="mdi-slash-forward"
                      :rules="[v => !!v || 'Selecione o separador']"
                  >
                    <template #selection="{ item }">
                      <v-chip size="small" color="primary" variant="tonal">
                        {{ item.title }}
                      </v-chip>
                    </template>
                  </v-select>
                </v-col>

                <!-- Campos de tamanho fixo (se NÃO usar separador) -->
                <v-col cols="12" v-if="!usarSeparador">
                  <v-row>
                    <v-col cols="6" md="3">
                      <v-text-field
                          v-model.number="inventario.layout_dig_prod"
                          label="Dígitos do Produto *"
                          variant="outlined"
                          density="compact"
                          type="number"
                          prepend-inner-icon="mdi-numeric"
                          :rules="[v => !!v || 'Informe a quantidade de dígitos']"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6" md="3">
                      <v-text-field
                          v-model.number="inventario.layout_dig_qtd"
                          label="Dígitos da Quantidade *"
                          variant="outlined"
                          density="compact"
                          type="number"
                          prepend-inner-icon="mdi-numeric"
                          :rules="[v => !!v || 'Informe a quantidade de dígitos']"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-col>

                <!-- Botão Processar -->
                <v-col cols="12">
                  <v-btn
                      color="var(--text-color-laranja)"
                      variant="flat"
                      prepend-icon="mdi-file-import"
                      class="text-white"
                      :disabled="!inventario.arquivo || !inventario.layout_utilizado"
                      :loading="processandoArquivo"
                      @click="importarArquivo"
                      block
                  >
                    Processar Arquivo e Importar Produtos
                  </v-btn>
                </v-col>
              </v-row>
            </div>

            <!-- Modo Manual -->
            <div v-else>
              <v-alert 
                  type="info" 
                  variant="tonal" 
                  class="mb-4"
                  icon="mdi-information"
              >
                <strong>Modo Manual:</strong> Selecione o produto e informe a quantidade encontrada no inventário.
              </v-alert>

              <v-form ref="formManualRef" v-model="formManualValido">
                <v-row>
                  <v-col cols="12" md="7" class="d-flex align-center">
                    <v-autocomplete
                        v-model="itemAtual.produtoId"
                        :items="produtos"
                        label="Produto *"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-package-variant"
                        item-title="descproduto"
                        item-value="id"
                        :loading="carregandoProdutos"
                        :rules="[v => !!v || 'Selecione um produto']"
                        clearable
                        @update:model-value="selecionarProdutoManual"
                    >
                      <template #item="{ props, item }">
                        <v-list-item v-bind="props">
                          <template #prepend>
                            <v-icon icon="mdi-package-variant" color="var(--text-color-laranja)"></v-icon>
                          </template>
                          <template #subtitle>
                            <span class="text-caption">Cód: {{ item.raw.codigo_sku || item.raw.codigo_gtin }} | Grupo: {{ item.raw.descgrupo }}</span>
                          </template>
                        </v-list-item>
                      </template>
                    </v-autocomplete>
                  </v-col>

                  <v-col cols="12" md="3" class="d-flex align-center">
                    <v-autocomplete
                        v-model="itemAtual.localizacao"
                        :items="localizacoes"
                        label="Localização"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-map-marker"
                        placeholder="Selecione a localização"
                        item-title="descricao"
                        item-value="id"
                        :loading="carregandoLocalizacoes"
                        clearable
                    >
                      <template #item="{ props, item }">
                        <v-list-item v-bind="props">
                          <template #prepend>
                            <v-icon icon="mdi-map-marker" color="var(--text-color-laranja)"></v-icon>
                          </template>
                          <template #subtitle v-if="item.raw.rua || item.raw.bloco">
                            <span class="text-caption">
                              {{ [item.raw.rua, item.raw.bloco, item.raw.prateleira, item.raw.coluna].filter(Boolean).join(' - ') }}
                            </span>
                          </template>
                        </v-list-item>
                      </template>
                    </v-autocomplete>
                  </v-col>

                  <v-col cols="12" md="2" class=" align-center">
                    <v-btn
                        color="var(--text-color-laranja)"
                        variant="flat"
                        @click="adicionarItem"
                        prepend-icon="mdi-plus"
                        class="text-white"
                        :disabled="!formManualValido || !itemAtual.produtoId"
                        block
                    >
                      Adicionar
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </div>
          </v-card-text>
        </v-card>

        <!-- Card da Tabela de Itens -->
        <v-card :color="themeStore.darkMode ? 'text-white' : ''" class="background-secondary">
          <v-card-title class="text-h6 pa-4 d-flex justify-space-between align-center">
            <div>
              <v-icon icon="mdi-format-list-bulleted" class="mr-2"></v-icon>
              Itens do Inventário
            </div>
            <v-chip 
                color="var(--text-color-laranja)" 
                size="small"
                v-if="itensInventario.length > 0"
            >
              {{ itensInventario.length }} {{ itensInventario.length === 1 ? 'item' : 'itens' }}
            </v-chip>
          </v-card-title>

          <v-card-text class="pa-4">
            <div v-if="itensInventario.length === 0" class="text-center pa-12">
              <v-icon size="80" color="grey-lighten-1">mdi-package-variant-closed-remove</v-icon>
              <p class="text-h6 mt-4 mb-2">Nenhum item adicionado</p>
              <p class="text-body-2 text-grey">
                Adicione produtos ao inventário usando o leitor de código de barras ou o formulário manual
              </p>
            </div>

            <v-table v-else class="inventario-table" density="comfortable">
              <thead>
                <tr>
                  <th class="text-left" style="width: 10%">Código</th>
                  <th class="text-left" style="width: 35%">Produto</th>
                  <th class="text-center" style="width: 15%">Qtd. Sistema</th>
                  <th class="text-center" style="width: 15%">Qtd. Contada</th>
                  <th class="text-center" style="width: 15%">Diferença</th>
                  <th class="text-center" style="width: 10%">Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                    v-for="(item, index) in (itensInventario || [])" 
                    :key="index"
                    :class="getDiferencaClass(item.diferenca)"
                >
                  <td class="text-body-2">{{ item.codigo }}</td>
                  <td>
                    <div class="text-body-2 font-weight-medium">{{ item.nome }}</div>
                    <div class="text-caption text-grey" v-if="item.localizacao">
                      <v-icon icon="mdi-map-marker" size="x-small"></v-icon>
                      {{ item.localizacao }}
                    </div>
                  </td>
                  <td class="text-center">
                    <v-chip size="small" variant="outlined">
                      {{ formatarNumero(item.estoqueSistema) }} {{ item.unidade }}
                    </v-chip>
                  </td>
                  <td class="text-center">
                    <v-chip size="small" color="primary" variant="tonal">
                      {{ formatarNumero(item.quantidadeContada) }} {{ item.unidade }}
                    </v-chip>
                  </td>
                  <td class="text-center">
                    <v-chip 
                        size="small" 
                        :color="item.diferenca > 0 ? 'success' : item.diferenca < 0 ? 'error' : 'grey'"
                        variant="flat"
                        class="text-white font-weight-bold"
                    >
                      {{ item.diferenca > 0 ? '+' : '' }}{{ formatarNumero(item.diferenca) }}
                    </v-chip>
                  </td>
                  <td class="text-center">
                    <v-btn
                        icon="mdi-delete"
                        size="small"
                        variant="text"
                        color="error"
                        @click="removerItem(index)"
                    ></v-btn>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="font-weight-bold">
                  <td colspan="2" class="text-right pa-3">TOTAL:</td>
                  <td class="text-center">{{ itensInventario.length }} itens</td>
                  <td class="text-center">-</td>
                  <td class="text-center">-</td>
                  <td></td>
                </tr>
              </tfoot>
            </v-table>
          </v-card-text>

          <v-card-actions v-if="itensInventario.length > 0" class="pa-4">
            <v-btn
                color="grey"
                variant="outlined"
                prepend-icon="mdi-printer"
                @click="imprimirInventario"
            >
              Imprimir
            </v-btn>
            <v-btn
                color="success"
                variant="outlined"
                prepend-icon="mdi-file-excel"
                @click="exportarExcel"
            >
              Exportar Excel
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
                color="error"
                variant="outlined"
                prepend-icon="mdi-delete-sweep"
                @click="limparInventario"
            >
              Limpar Tudo
            </v-btn>
            <v-btn
                color="var(--text-color-laranja)"
                variant="flat"
                class="text-white"
                prepend-icon="mdi-check-circle"
                @click="finalizarLote"
                >
                Finalizar e Salvar Lote
            </v-btn>
          </v-card-actions>
        </v-card>
          </div>
        </v-expand-transition>

        <!-- Tabela de Lotes -->
        <v-card v-if="!loteAberto" :color="themeStore.darkMode ? 'text-white' : ''" class="background-secondary">
          <v-card-title class="text-h6 pa-4 d-flex align-center">
            <v-icon icon="mdi-clipboard-list" class="mr-2"></v-icon>
            Lotes de Inventário
            <v-chip 
                color="var(--text-color-laranja)" 
                size="small"
                v-if="lotes.length > 0"
                class="ml-2"
            >
              {{ lotes.length }} {{ lotes.length === 1 ? 'lote' : 'lotes' }}
            </v-chip>
          </v-card-title>

          <v-card-text class="pa-4">
            <div v-if="lotes.length === 0" class="text-center pa-12">
              <v-icon size="80" color="grey-lighten-1">mdi-clipboard-text-off</v-icon>
              <p class="text-h6 mt-4 mb-2">Nenhum lote criado</p>
              <p class="text-body-2 text-grey">
                Clique em "Criar Novo Lote de Inventário" para começar
              </p>
            </div>

            <v-table v-if="lotes.length > 0 && !loteAberto" class="inventario-table" density="comfortable">
              <thead>
                <tr>
                  <th class="text-left" style="width: 10%">#</th>
                  <th class="text-left" style="width: 25%">Almoxarifado</th>
                  <th class="text-center" style="width: 15%">Data</th>
                  <th class="text-center" style="width: 15%">Tipo</th>
                  <th class="text-center" style="width: 15%">Itens</th>
                  <th class="text-left" style="width: 10%">Observações</th>
                  <th class="text-center" style="width: 10%">Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(lote, index) in (lotes || [])" :key="lote.id || index">
                  <td class="text-body-2 font-weight-bold">{{ index + 1 }}</td>
                  <td class="text-body-2">{{ lote.almoxarifadoNome }}</td>
                  <td class="text-center">
                    <v-chip size="small" variant="outlined">
                      {{ formatarData(lote.data) }}
                    </v-chip>
                  </td>
                  <td class="text-center">
                    <v-chip 
                        size="small" 
                        :color="lote.tipo === 'automatico' ? 'primary' : 'success'"
                        variant="tonal"
                    >
                      <v-icon 
                          :icon="lote.tipo === 'automatico' ? 'mdi-barcode-scan' : 'mdi-keyboard'" 
                          size="x-small" 
                          class="mr-1"
                      ></v-icon>
                      {{ lote.tipo === 'automatico' ? 'Automático' : 'Manual' }}
                    </v-chip>
                  </td>
                  <td class="text-center">
                    <v-chip size="small" color="var(--text-color-laranja)" variant="flat" class="text-white">
                      {{ (lote.itens || []).length }} {{ (lote.itens || []).length === 1 ? 'item' : 'itens' }}
                    </v-chip>
                  </td>
                  <td class="text-body-2">
                    <span v-if="lote.observacoes" class="text-truncate" style="max-width: 150px; display: inline-block;">
                      {{ lote.observacoes }}
                    </span>
                    <span v-else class="text-grey">-</span>
                  </td>
                  <td class="text-center">
                    <v-btn
                        icon="mdi-eye"
                        size="small"
                        variant="text"
                        color="primary"
                        @click="visualizarItensLote(lote)"
                    ></v-btn>
                    <v-btn
                        icon="mdi-delete"
                        size="small"
                        variant="text"
                        color="error"
                        @click="excluirLote(index)"
                    ></v-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>

        <!-- Modal de Visualização de Itens do Lote -->
        <v-dialog v-model="modalItensAberto" max-width="1200">
          <v-card :color="themeStore.darkMode ? 'text-white' : ''" class="background-secondary">
            <v-card-title class="text-h6 pa-4 d-flex align-center">
              <v-icon icon="mdi-clipboard-text" class="mr-2"></v-icon>
              Itens do Lote - {{ loteVisualizando?.almoxarifadoNome }}
              <v-spacer></v-spacer>
              <v-btn
                  icon="mdi-close"
                  variant="text"
                  @click="modalItensAberto = false"
              ></v-btn>
            </v-card-title>

            <v-card-text class="pa-4">
              <v-row dense class="mb-4">
                <v-col cols="4">
                  <div class="text-caption text-grey">Data</div>
                  <div class="text-body-1">{{ formatarData(loteVisualizando?.data) }}</div>
                </v-col>
                <v-col cols="4">
                  <div class="text-caption text-grey">Tipo</div>
                  <div class="text-body-1">
                    <v-chip 
                        size="small" 
                        :color="loteVisualizando?.tipo === 'automatico' ? 'primary' : 'success'"
                        variant="tonal"
                    >
                      {{ loteVisualizando?.tipo === 'automatico' ? 'Automático' : 'Manual' }}
                    </v-chip>
                  </div>
                </v-col>
                <v-col cols="4">
                  <div class="text-caption text-grey">Total de Itens</div>
                  <div class="text-body-1">{{ loteVisualizando?.itens.length || 0 }}</div>
                </v-col>
                <v-col cols="12" v-if="loteVisualizando?.observacoes">
                  <div class="text-caption text-grey">Observações</div>
                  <div class="text-body-1">{{ loteVisualizando.observacoes }}</div>
                </v-col>
              </v-row>

              <v-table class="inventario-table" density="comfortable">
                <thead>
                  <tr>
                    <th class="text-left">Código</th>
                    <th class="text-left">Produto</th>
                    <th class="text-center">Qtd. Sistema</th>
                    <th class="text-center">Qtd. Contada</th>
                    <th class="text-center">Diferença</th>
                  </tr>
                </thead>
                <tbody>
                  <tr 
                      v-for="(item, index) in (loteVisualizando?.itens || [])" 
                      :key="index"
                      :class="getDiferencaClass(item.diferenca)"
                  >
                    <td class="text-body-2">{{ item.codigo }}</td>
                    <td>
                      <div class="text-body-2 font-weight-medium">{{ item.nome }}</div>
                      <div class="text-caption text-grey" v-if="item.localizacao">
                        <v-icon icon="mdi-map-marker" size="x-small"></v-icon>
                        {{ item.localizacao }}
                      </div>
                    </td>
                    <td class="text-center">
                      <v-chip size="small" variant="outlined">
                        {{ formatarNumero(item.estoqueSistema) }} {{ item.unidade }}
                      </v-chip>
                    </td>
                    <td class="text-center">
                      <v-chip size="small" color="primary" variant="tonal">
                        {{ formatarNumero(item.quantidadeContada) }} {{ item.unidade }}
                      </v-chip>
                    </td>
                    <td class="text-center">
                      <v-chip 
                          size="small" 
                          :color="item.diferenca > 0 ? 'success' : item.diferenca < 0 ? 'error' : 'grey'"
                          variant="flat"
                          class="text-white font-weight-bold"
                      >
                        {{ item.diferenca > 0 ? '+' : '' }}{{ formatarNumero(item.diferenca) }}
                      </v-chip>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card-text>

            <v-card-actions class="pa-4">
              <v-btn
                  color="var(--text-color-laranja)"
                  variant="outlined"
                  prepend-icon="mdi-link-variant"
                  @click="gerarLinkContagem"
              >
                Gerar Link de Contagem
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                  color="grey"
                  variant="outlined"
                  @click="modalItensAberto = false"
              >
                Fechar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Modal de Link de Contagem -->
        <v-dialog v-model="modalLinkAberto" max-width="600">
          <v-card :color="themeStore.darkMode ? 'text-white' : ''" class="background-secondary">
            <v-card-title class="text-h6 pa-4 d-flex align-center">
              <v-icon icon="mdi-link-variant" class="mr-2"></v-icon>
              Link de Contagem de Inventário
              <v-spacer></v-spacer>
              <v-btn
                  icon="mdi-close"
                  variant="text"
                  @click="modalLinkAberto = false"
              ></v-btn>
            </v-card-title>

            <v-card-text class="pa-4">
              <v-alert 
                  type="info" 
                  variant="tonal" 
                  class="mb-4"
                  icon="mdi-information"
              >
                <strong>Link para Contagem:</strong> Compartilhe este link com o funcionário responsável pela contagem. 
                O link é seguro e permite acesso mobile com câmera para leitura de códigos de barras.
              </v-alert>

              <v-row dense class="mb-4">
                <v-col cols="6">
                  <div class="text-caption text-grey">Lote</div>
                  <div class="text-body-1 font-weight-bold">{{ loteVisualizando?.almoxarifadoNome }}</div>
                </v-col>
                <v-col cols="6">
                  <div class="text-caption text-grey">Total de Itens</div>
                  <div class="text-body-1 font-weight-bold">{{ loteVisualizando?.itens.length || 0 }}</div>
                </v-col>
              </v-row>

              <v-text-field
                  v-model="linkContagem"
                  label="Link de Acesso"
                  variant="outlined"
                  density="compact"
                  readonly
                  prepend-inner-icon="mdi-link"
              >
                <template #append-inner>
                  <v-btn
                      icon="mdi-content-copy"
                      size="small"
                      variant="text"
                      @click="copiarLink"
                      color="var(--text-color-laranja)"
                  ></v-btn>
                </template>
              </v-text-field>

              <div class="d-flex align-center justify-center mt-4">
                <v-chip 
                    color="success" 
                    variant="tonal"
                    prepend-icon="mdi-check-circle"
                    class="mr-2"
                >
                  Link válido por 7 dias
                </v-chip>
              </div>
            </v-card-text>

            <v-card-actions class="pa-4">
              <v-spacer></v-spacer>
              <v-btn
                  color="grey"
                  variant="outlined"
                  @click="modalLinkAberto = false"
              >
                Fechar
              </v-btn>
              <v-btn
                  color="var(--text-color-laranja)"
                  variant="flat"
                  class="text-white"
                  prepend-icon="mdi-content-copy"
                  @click="copiarLink"
              >
                Copiar Link
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </template>
  </top-all-pages>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useThemeStore } from '@/stores/config-temas/theme'
import { useEstoqueStore } from '@/stores/APIs/estoque'
import { useProdutosStore } from '@/stores/APIs/produtos'
import { useInventarioStore } from '@/stores/APIs/inventario'
import { toast } from 'vue3-toastify'
import TopAllPages from '@/components/base/padrao-paginas/TopAllPages.vue'

const themeStore = useThemeStore()
const inventarioStore = useInventarioStore()
const estoqueStore = useEstoqueStore()
const produtosStore = useProdutosStore()

// Estados
const loteAberto = ref(false)
const carregandoAlmoxarifados = ref(false)
const carregandoProdutos = ref(false)
const carregandoLocalizacoes = ref(false)
const processandoArquivo = ref(false)
const usarSeparador = ref(true)
const formManualValido = ref(false)
const formManualRef = ref(null)
const modalItensAberto = ref(false)
const loteVisualizando = ref(null)
const modalLinkAberto = ref(false)
const linkContagem = ref('')

// Dados
const inventario = reactive({
  id: null,
  id_almoxarifado: null,
  tipo: 'A', // A = Automático, M = Manual
  data: new Date().toISOString().split('T')[0],
  nome_arquivo: '',
  arquivo: null,
  url: '',
  separador: '',
  separador_char: '',
  layout_dig_prod: 0,
  layout_dig_qtd: 0,
  layout_utilizado: ''
})

const itemAtual = reactive({
  codigoBarras: '',
  produtoId: null,
  localizacao: ''
})

const itensInventario = ref([])
const produtoEncontrado = ref(null)
const lotes = ref([])
const almoxarifados = ref([])
const produtos = ref([])
const localizacoes = ref([])

// Tipos de inventário
const tiposInventario = [
  { 
    title: 'Automático (Importação de Arquivo)', 
    value: 'A',
    icon: 'mdi-file-import',
    color: 'primary'
  },
  { 
    title: 'Manual (Seleção de Produtos)', 
    value: 'M',
    icon: 'mdi-keyboard',
    color: 'success'
  }
]

// Tipos de documento para importação
const tiposDocumento = [
  { 
    title: 'Código Interno + Quantidade', 
    value: 'cod_interno_qtd',
    icon: 'mdi-barcode'
  },
  { 
    title: 'Código de Barras + Quantidade', 
    value: 'cod_barras_qtd',
    icon: 'mdi-barcode-scan'
  },
  { 
    title: 'Código de Referência + Quantidade', 
    value: 'cod_referencia_qtd',
    icon: 'mdi-tag'
  },
  { 
    title: 'Código de Fabricação + Quantidade', 
    value: 'cod_fabricacao_qtd',
    icon: 'mdi-factory'
  },
  { 
    title: 'Código Interno + Quantidade + Localização', 
    value: 'cod_interno_qtd_loc',
    icon: 'mdi-map-marker'
  }
]

// Separadores disponíveis
const separadores = [
  { title: 'Vírgula (,)', value: ',' },
  { title: 'Ponto e vírgula (;)', value: ';' },
  { title: 'Ponto (.)', value: '.' },
  { title: 'Barra (/)', value: '/' },
  { title: 'Traço (-)', value: '-' },
  { title: 'Asterisco (*)', value: '*' },
  { title: 'Cerquilha (#)', value: '#' }
]

// Métodos
const formatarNumero = (valor) => {
  return parseFloat(valor || 0).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

const formatarData = (data) => {
  if (!data) return '-'
  const [ano, mes, dia] = data.split('-')
  return `${dia}/${mes}/${ano}`
}

const toggleLote = () => {
  loteAberto.value = !loteAberto.value
  if (!loteAberto.value) {
    limparFormulario()
  }
}

const limparFormulario = () => {
  inventario.id = null
  inventario.id_almoxarifado = null
  inventario.tipo = 'A'
  inventario.data = new Date().toISOString().split('T')[0]
  inventario.nome_arquivo = ''
  inventario.arquivo = null
  inventario.url = ''
  inventario.separador = ''
  inventario.separador_char = ''
  inventario.layout_dig_prod = 0
  inventario.layout_dig_qtd = 0
  inventario.layout_utilizado = ''
  itensInventario.value = []
  itemAtual.codigoBarras = ''
  itemAtual.produtoId = null
  itemAtual.localizacao = ''
  produtoEncontrado.value = null
}

const finalizarLote = async () => {
  if (!inventario.id_almoxarifado) {
    toast.warning('Selecione um almoxarifado')
    return
  }

  if (itensInventario.value.length === 0) {
    toast.warning('Adicione pelo menos um item ao lote')
    return
  }

  try {
    // Buscar ID da empresa
    const empresaSelecionadaStr = localStorage.getItem('empresaSelecionada')
    if (!empresaSelecionadaStr) {
      toast.error('Empresa não selecionada')
      return
    }
    
    const empresaSelecionada = JSON.parse(empresaSelecionadaStr)
    const idEmpresa = empresaSelecionada.id

    if (!idEmpresa) {
      toast.error('Empresa não identificada')
      return
    }

    // Preparar dados do inventário (id_usuario vem do token)
    const dados = {
      data: [{
        id_empresa: parseInt(idEmpresa),
        id_almoxarifado: inventario.id_almoxarifado,
        tipo: inventario.tipo,
        nome_arquivo: inventario.nome_arquivo || '',
        arquivo: inventario.arquivo || '',
        url: inventario.url || '',
        separador: inventario.separador || '',
        separador_char: inventario.separador_char || '',
        layout_dig_prod: inventario.layout_dig_prod || 0,
        layout_dig_qtd: inventario.layout_dig_qtd || 0,
        layout_utilizado: inventario.layout_utilizado || ''
      }],
      item: itensInventario.value.map(item => ({
        id_produto: item.produtoId,
        qtd_sistema: item.estoqueSistema || 0,
        qtd_contada: item.quantidadeContada || 0,
        diferenca: item.diferenca || 0,
        id_localizacao: item.localizacaoId || null
      }))
    }

    console.log('[Inventário] Dados enviados:', dados)

    // Cadastrar inventário via API
    const response = await inventarioStore.cadastrarInventario(dados)

    if (response?.data) {
      // Buscar nome do almoxarifado para exibição local
      const almoxarifado = almoxarifados.value.find(a => a.id === inventario.id_almoxarifado)
      
      const novoLote = {
        ...response.data,
        almoxarifadoNome: almoxarifado?.descalmoxarifado || 'Não identificado',
        itens: [...itensInventario.value]
      }

      lotes.value.push(novoLote)
    }
    
    limparFormulario()
    loteAberto.value = false
  } catch (error) {
    console.error('[Inventário] Erro ao finalizar lote:', error)
  }
}

const visualizarItensLote = (lote) => {
  loteVisualizando.value = lote
  modalItensAberto.value = true
}

const excluirLote = async (index) => {
  const lote = lotes.value[index]
  
  if (!confirm('Tem certeza que deseja cancelar este inventário?')) {
    return
  }

  try {
    // Se o lote tem ID, cancelar via API
    if (lote.id) {
      const empresaSelecionadaStr = localStorage.getItem('empresaSelecionada')
      if (!empresaSelecionadaStr) {
        toast.error('Empresa não selecionada')
        return
      }
      
      const empresaSelecionada = JSON.parse(empresaSelecionadaStr)
      const idEmpresa = empresaSelecionada.id

      if (!idEmpresa) {
        toast.error('Empresa não identificada')
        return
      }

      await inventarioStore.cancelarInventario(parseInt(idEmpresa), lote.id)
    }
    
    // Remover do array local
    lotes.value.splice(index, 1)
  } catch (error) {
    console.error('[Inventário] Erro ao excluir lote:', error)
  }
}

const getDiferencaClass = (diferenca) => {
  if (diferenca > 0) return 'diferenca-positiva'
  if (diferenca < 0) return 'diferenca-negativa'
  return ''
}

const getDescricaoLocalizacao = (localizacaoId) => {
  if (!localizacaoId) return ''
  const loc = localizacoes.value.find(l => l.id === localizacaoId)
  return loc ? loc.descricao : ''
}

const processarArquivo = (event) => {
  const file = event.target.files?.[0]
  if (file) {
    inventario.nome_arquivo = file.name
  }
}

const importarArquivo = async () => {
  if (!inventario.arquivo) {
    toast.warning('Selecione um arquivo')
    return
  }

  if (!inventario.layout_utilizado) {
    toast.warning('Selecione o tipo de documento')
    return
  }

  if (usarSeparador.value && !inventario.separador_char) {
    toast.warning('Selecione o separador')
    return
  }

  if (!usarSeparador.value && (!inventario.layout_dig_prod || !inventario.layout_dig_qtd)) {
    toast.warning('Informe os tamanhos dos campos')
    return
  }

  processandoArquivo.value = true
  try {
    const fileContent = await inventario.arquivo.text()
    const linhas = fileContent.split('\n').filter(linha => linha.trim())

    console.log('[Inventário] Total de linhas:', linhas.length)
    console.log('[Inventário] Primeiras 3 linhas:', linhas.slice(0, 3))

    let itensProcessados = 0
    let erros = 0

    for (const linha of linhas) {
      try {
        let codigo, quantidade, localizacaoId = null
        
        if (usarSeparador.value) {
          // Processar com separador
          const partes = linha.split(inventario.separador_char).map(p => p.trim())
          console.log('[Inventário] Linha processada:', linha)
          console.log('[Inventário] Partes:', partes)
          
          if (inventario.layout_utilizado === 'cod_interno_qtd_loc') {
            [codigo, quantidade, localizacaoId] = partes
          } else {
            [codigo, quantidade] = partes
          }
        } else {
          // Processar tamanho fixo
          const digitosProduto = inventario.layout_dig_prod
          const digitosQtd = inventario.layout_dig_qtd
          
          codigo = linha.substring(0, digitosProduto).trim()
          quantidade = linha.substring(digitosProduto, digitosProduto + digitosQtd).trim()
          console.log('[Inventário] Tamanho fixo - Código:', codigo, 'Quantidade:', quantidade)
        }

        console.log('[Inventário] Buscando produto - Código:', codigo, 'Quantidade:', quantidade, 'Tipo:', inventario.layout_utilizado)

        // Buscar produto baseado no tipo de documento
        let produto = null
        switch (inventario.layout_utilizado) {
          case 'cod_interno_qtd':
          case 'cod_interno_qtd_loc':
            produto = produtos.value.find(p => p.id === parseInt(codigo))
            console.log('[Inventário] Buscando por ID:', parseInt(codigo), 'Encontrado:', !!produto)
            break
          case 'cod_barras_qtd':
            produto = produtos.value.find(p => p.codigo_gtin === codigo || p.codigo_sku === codigo)
            console.log('[Inventário] Buscando por código de barras:', codigo, 'Encontrado:', !!produto)
            break
          case 'cod_referencia_qtd':
            produto = produtos.value.find(p => p.codigo_sku === codigo)
            console.log('[Inventário] Buscando por SKU:', codigo, 'Encontrado:', !!produto)
            break
          case 'cod_fabricacao_qtd':
            produto = produtos.value.find(p => p.codigo_fabricante === codigo)
            console.log('[Inventário] Buscando por código fabricante:', codigo, 'Encontrado:', !!produto)
            break
        }

        if (produto) {
          // Verificar se já existe
          const jaExiste = itensInventario.value.find(item => item.produtoId === produto.id)
          if (!jaExiste) {
            const qtdContada = parseFloat(quantidade) || 0
            const qtdSistema = produto.estoque || 0

            itensInventario.value.push({
              produtoId: produto.id,
              codigo: produto.codigo_sku || produto.codigo_gtin || produto.id,
              nome: produto.descproduto,
              estoqueSistema: qtdSistema,
              quantidadeContada: qtdContada,
              diferenca: qtdContada - qtdSistema,
              unidade: produto.unidade || 'UN',
              localizacaoId: localizacaoId ? parseInt(localizacaoId) : null,
              localizacao: localizacaoId ? getDescricaoLocalizacao(parseInt(localizacaoId)) : ''
            })
            itensProcessados++
            console.log('[Inventário] Produto adicionado:', produto.descproduto)
          } else {
            console.log('[Inventário] Produto já existe:', produto.descproduto)
          }
        } else {
          console.warn('[Inventário] Produto não encontrado para código:', codigo)
          erros++
        }
      } catch (error) {
        console.error('[Inventário] Erro ao processar linha:', linha, error)
        erros++
      }
    }

    console.log('[Inventário] Processamento concluído - Sucesso:', itensProcessados, 'Erros:', erros)

    if (itensProcessados > 0) {
      toast.success(`${itensProcessados} produtos importados com sucesso!`)
    }
    if (erros > 0) {
      toast.warning(`${erros} linhas não puderam ser processadas`)
    }
    if (itensProcessados === 0 && erros === 0) {
      toast.info('Nenhum produto novo foi encontrado')
    }
  } catch (error) {
    toast.error('Erro ao processar arquivo')
    console.error('[Inventário] Erro:', error)
  } finally {
    processandoArquivo.value = false
  }
}

const selecionarProdutoManual = (produtoId) => {
  if (!produtoId) {
    produtoEncontrado.value = null
    return
  }

  const produto = produtos.value.find(p => p.id === produtoId)
  if (produto) {
    // Mapear campos da API para o formato esperado
    produtoEncontrado.value = {
      id: produto.id,
      codigo: produto.codigo_sku || produto.codigo_gtin || produto.id,
      nome: produto.descproduto,
      estoque: produto.estoque || 0,
      unidade: produto.unidade || 'UN'
    }
  }
}

const adicionarItem = () => {
  if (!produtoEncontrado.value) {
    toast.warning('Selecione um produto')
    return
  }

  // Verificar se produto já existe no inventário
  const itemExistente = itensInventario.value.find(
    item => item.produtoId === produtoEncontrado.value.id
  )

  if (itemExistente) {
    toast.warning('Produto já adicionado ao inventário')
    return
  }

  const novoItem = {
    produtoId: produtoEncontrado.value.id,
    codigo: produtoEncontrado.value.codigo,
    nome: produtoEncontrado.value.nome,
    estoqueSistema: produtoEncontrado.value.estoque || 0,
    quantidadeContada: 0,
    diferenca: 0 - (produtoEncontrado.value.estoque || 0),
    unidade: produtoEncontrado.value.unidade || 'UN',
    localizacaoId: itemAtual.localizacao || null,
    localizacao: getDescricaoLocalizacao(itemAtual.localizacao)
  }

  itensInventario.value.push(novoItem)
  toast.success('Item adicionado ao inventário')

  // Limpar formulário
  itemAtual.produtoId = null
  itemAtual.localizacao = ''
  produtoEncontrado.value = null
}

const removerItem = (index) => {
  itensInventario.value.splice(index, 1)
  toast.info('Item removido do inventário')
}

const limparInventario = () => {
  if (confirm('Tem certeza que deseja limpar todos os itens do inventário?')) {
    itensInventario.value = []
    toast.success('Inventário limpo')
  }
}

const imprimirInventario = () => {
  toast.info('Impressão em desenvolvimento')
}

const exportarExcel = () => {
  toast.info('Exportação para Excel em desenvolvimento')
}

const gerarLinkContagem = () => {
  if (!loteVisualizando.value) return
  
  // Gerar token único para o lote
  const token = gerarToken()
  const loteId = lotes.value.indexOf(loteVisualizando.value)
  
  // Salvar lotes no localStorage para a tela de contagem acessar
  localStorage.setItem('lotesInventario', JSON.stringify(lotes.value))
  
  // Construir URL
  const baseUrl = window.location.origin
  linkContagem.value = `${baseUrl}/inventario/contagem/${loteId}?token=${token}`
  
  // Abrir modal com o link
  modalLinkAberto.value = true
}

const gerarToken = () => {
  // Gerar token aleatório
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

const copiarLink = async () => {
  try {
    await navigator.clipboard.writeText(linkContagem.value)
    toast.success('Link copiado para a área de transferência!')
  } catch (error) {
    toast.error('Erro ao copiar link')
    console.error(error)
  }
}

// Carregar dados iniciais
const carregarAlmoxarifados = async () => {
  carregandoAlmoxarifados.value = true
  try {
    // Buscar ID da empresa
    const empresaSelecionadaStr = localStorage.getItem('empresaSelecionada')
    if (!empresaSelecionadaStr) {
      toast.error('Empresa não selecionada')
      return
    }
    
    const empresaSelecionada = JSON.parse(empresaSelecionadaStr)
    const idEmpresa = empresaSelecionada.id

    if (!idEmpresa) {
      toast.error('Empresa não identificada')
      return
    }

    // Buscar almoxarifados da API
    await estoqueStore.buscarAlmoxarifados(idEmpresa)
    almoxarifados.value = estoqueStore.almoxarifados || []
    
    console.log('[Inventário] Almoxarifados carregados:', almoxarifados.value)
  } catch (error) {
    console.error('[Inventário] Erro ao carregar almoxarifados:', error)
    toast.error('Erro ao carregar almoxarifados')
  } finally {
    carregandoAlmoxarifados.value = false
  }
}

const carregarProdutos = async () => {
  carregandoProdutos.value = true
  try {
    // Buscar produtos da API
    await produtosStore.buscarProdutos()
    produtos.value = produtosStore.produtos || []
    
    console.log('[Inventário] Produtos carregados:', produtos.value)
  } catch (error) {
    console.error('[Inventário] Erro ao carregar produtos:', error)
    toast.error('Erro ao carregar produtos')
  } finally {
    carregandoProdutos.value = false
  }
}

const carregarLocalizacoes = async () => {
  carregandoLocalizacoes.value = true
  try {
    // Buscar ID da empresa
    const empresaSelecionadaStr = localStorage.getItem('empresaSelecionada')
    if (!empresaSelecionadaStr) {
      toast.error('Empresa não selecionada')
      return
    }
    
    const empresaSelecionada = JSON.parse(empresaSelecionadaStr)
    const idEmpresa = empresaSelecionada.id

    if (!idEmpresa) {
      toast.error('Empresa não identificada')
      return
    }

    // Buscar localizações da API
    await produtosStore.buscarLocalizacoes(idEmpresa)
    localizacoes.value = produtosStore.localizacoes || []
    
    console.log('[Inventário] Localizações carregadas:', localizacoes.value)
  } catch (error) {
    console.error('[Inventário] Erro ao carregar localizações:', error)
    toast.error('Erro ao carregar localizações')
  } finally {
    carregandoLocalizacoes.value = false
  }
}

const carregarInventarios = async () => {
  try {
    const empresaSelecionadaStr = localStorage.getItem('empresaSelecionada')
    if (!empresaSelecionadaStr) {
      toast.error('Empresa não selecionada')
      return
    }
    
    const empresaSelecionada = JSON.parse(empresaSelecionadaStr)
    const idEmpresa = empresaSelecionada.id

    if (!idEmpresa) {
      toast.error('Empresa não identificada')
      return
    }

    await inventarioStore.listarInventarios(parseInt(idEmpresa))
    // Garantir que cada lote tenha o array de itens
    lotes.value = (inventarioStore.inventarios || []).map(lote => ({
      ...lote,
      itens: lote.itens || []
    }))
    
    console.log('[Inventário] Inventários carregados:', lotes.value)
  } catch (error) {
    console.error('[Inventário] Erro ao carregar inventários:', error)
  }
}

onMounted(async () => {
  await carregarAlmoxarifados()
  await carregarProdutos()
  await carregarLocalizacoes()
  await carregarInventarios()
})
</script>

<style scoped>
.inventario-table {
  border: 1px solid rgba(var(--v-border-color), 0.12);
}

.inventario-table thead tr {
  background-color: var(--text-color-laranja);
}

.inventario-table thead th {
  color: white !important;
  font-weight: 700 !important;
}

.inventario-table tbody tr td,
.inventario-table tfoot tr td {
  color: var(--text-color) !important;
}

.diferenca-positiva {
  background-color: rgba(76, 175, 80, 0.1) !important;
}

.diferenca-negativa {
  background-color: rgba(244, 67, 54, 0.1) !important;
}

.inventario-table tfoot tr {
  background-color: rgba(var(--text-color-laranja), 0.1);
  border-top: 2px solid var(--text-color-laranja);
}

/* Modo escuro */
:deep(.v-table) {
  background-color: transparent;
}

:deep(.v-table__wrapper) {
  background-color: var(--background-card);
}
</style>
