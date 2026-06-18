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
                :icon="inventario.tipo === 'A' ? 'mdi-barcode-scan' : inventario.tipo === 'L' ? 'mdi-link-variant' : 'mdi-keyboard'" 
                class="mr-2"
            ></v-icon>
            {{ inventario.tipo === 'A' ? 'Lançamento por Coletor de Dados' : inventario.tipo === 'L' ? 'Contagem por Link' : 'Lançamento Manual' }}
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
                      :disabled="!inventario.id_almoxarifado"
                      :hint="!inventario.id_almoxarifado ? 'Selecione um almoxarifado primeiro' : ''"
                      persistent-hint
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
            <div v-else-if="inventario.tipo === 'M'">
              <v-alert
                  type="info"
                  variant="tonal"
                  class="mb-4"
                  icon="mdi-information"
              >
                <strong>Modo Manual:</strong> Filtre os produtos por grupo, subgrupo, marca ou localização e adicione-os ao inventário.
              </v-alert>

              <v-row>
                <!-- Código de busca -->
                <v-col cols="12" md="4">
                  <v-text-field
                      v-model="filtroManual.codigo"
                      label="Buscar por Código"
                      variant="outlined"
                      density="compact"
                      prepend-inner-icon="mdi-barcode"
                      hint="Pressione Enter para buscar"
                      persistent-hint
                      clearable
                      @keyup.enter="buscarPorCodigo"
                  >
                    <template #append-inner>
                      <v-btn icon="mdi-magnify" size="small" variant="text" @click="buscarPorCodigo"></v-btn>
                    </template>
                  </v-text-field>
                </v-col>

                <!-- Produto -->
                <v-col cols="12" md="4">
                  <v-autocomplete
                      v-model="filtroManual.produtoId"
                      :items="[{ descproduto: 'Todos os Produtos', id_produto: null }, ...produtosGrid]"
                      label="Produto"
                      variant="outlined"
                      density="compact"
                      prepend-inner-icon="mdi-package-variant"
                      item-title="descproduto"
                      item-value="id_produto"
                      :loading="carregandoGridProdutos"
                      clearable
                  >
                    <template #item="{ props, item }">
                      <v-list-item v-bind="props">
                        <template #subtitle v-if="item.raw.id">
                          <span class="text-caption">Cód: {{ item.raw.codigo_sku || item.raw.codigo_gtin }}</span>
                        </template>
                      </v-list-item>
                    </template>
                  </v-autocomplete>
                </v-col>

                <!-- Grupo -->
                <v-col cols="12" md="4">
                  <v-autocomplete
                      v-model="filtroManual.grupoId"
                      :items="[{ descgrupo: 'Todos os Grupos', id: null }, ...grupos]"
                      label="Grupo"
                      variant="outlined"
                      density="compact"
                      prepend-inner-icon="mdi-shape"
                      item-title="descgrupo"
                      item-value="id"
                      :loading="carregandoGrupos"
                      clearable
                      @update:model-value="onGrupoChange"
                  ></v-autocomplete>
                </v-col>

                <!-- SubGrupo -->
                <v-col cols="12" md="4">
                  <v-autocomplete
                      v-model="filtroManual.subgrupoId"
                      :items="[{ descsubgrupo: 'Todos os SubGrupos', id: null }, ...subgrupos]"
                      label="SubGrupo"
                      variant="outlined"
                      density="compact"
                      prepend-inner-icon="mdi-shape-plus"
                      item-title="descsubgrupo"
                      item-value="id"
                      :loading="carregandoSubgrupos"
                      :disabled="!filtroManual.grupoId"
                      :hint="!filtroManual.grupoId ? 'Selecione um grupo primeiro' : ''"
                      clearable
                  ></v-autocomplete>
                </v-col>

                <!-- Marca -->
                <v-col cols="12" md="4">
                  <v-autocomplete
                      v-model="filtroManual.marcaId"
                      :items="[{ descmarca: 'Todas as Marcas', id: null }, ...marcas]"
                      label="Marca"
                      variant="outlined"
                      density="compact"
                      prepend-inner-icon="mdi-tag"
                      item-title="descmarca"
                      item-value="id"
                      :loading="carregandoMarcas"
                      clearable
                  ></v-autocomplete>
                </v-col>

                <!-- Localização -->
                <v-col cols="12" md="4">
                  <v-autocomplete
                      v-model="filtroManual.localizacaoId"
                      :items="[{ descricao: 'Todas as Localizações', id: null }, ...localizacoes]"
                      label="Localização"
                      variant="outlined"
                      density="compact"
                      prepend-inner-icon="mdi-map-marker"
                      item-title="descricao"
                      item-value="id"
                      :loading="carregandoLocalizacoes"
                      clearable
                  ></v-autocomplete>
                </v-col>

                <!-- Botão -->
                <v-col cols="12">
                  <v-btn
                      color="var(--text-color-laranja)"
                      variant="flat"
                      prepend-icon="mdi-plus-circle"
                      class="text-white"
                      :disabled="!inventario.id_almoxarifado"
                      :loading="carregandoGridProdutos"
                      @click="buscarGridInventario"
                      block
                  >
                    Listar Produtos ao Inventário
                  </v-btn>
                </v-col>
              </v-row>
            </div>

            <!-- Contagem por Link -->
            <div v-else>
              <v-alert
                  type="info"
                  variant="tonal"
                  class="mb-4"
                  icon="mdi-information"
              >
                <strong>Contagem por Link:</strong> Filtre os produtos desejados e ao finalizar será gerado um link para o responsável realizar a contagem via mobile.
              </v-alert>

              <v-row>
                <!-- Produto -->
                <v-col cols="12" md="4">
                  <v-autocomplete
                      v-model="filtroManual.produtoId"
                      :items="[{ descproduto: 'Todos os Produtos', id_produto: null }, ...produtosGrid]"
                      label="Produto"
                      variant="outlined"
                      density="compact"
                      prepend-inner-icon="mdi-package-variant"
                      item-title="descproduto"
                      item-value="id_produto"
                      :loading="carregandoGridProdutos"
                      clearable
                  ></v-autocomplete>
                </v-col>

                <!-- Grupo -->
                <v-col cols="12" md="4">
                  <v-autocomplete
                      v-model="filtroManual.grupoId"
                      :items="[{ descgrupo: 'Todos os Grupos', id: null }, ...grupos]"
                      label="Grupo"
                      variant="outlined"
                      density="compact"
                      prepend-inner-icon="mdi-shape"
                      item-title="descgrupo"
                      item-value="id"
                      :loading="carregandoGrupos"
                      clearable
                      @update:model-value="onGrupoChange"
                  ></v-autocomplete>
                </v-col>

                <!-- SubGrupo -->
                <v-col cols="12" md="4">
                  <v-autocomplete
                      v-model="filtroManual.subgrupoId"
                      :items="[{ descsubgrupo: 'Todos os SubGrupos', id: null }, ...subgrupos]"
                      label="SubGrupo"
                      variant="outlined"
                      density="compact"
                      prepend-inner-icon="mdi-shape-plus"
                      item-title="descsubgrupo"
                      item-value="id"
                      :loading="carregandoSubgrupos"
                      :disabled="!filtroManual.grupoId"
                      :hint="!filtroManual.grupoId ? 'Selecione um grupo primeiro' : ''"
                      clearable
                  ></v-autocomplete>
                </v-col>

                <!-- Marca -->
                <v-col cols="12" md="4">
                  <v-autocomplete
                      v-model="filtroManual.marcaId"
                      :items="[{ descmarca: 'Todas as Marcas', id: null }, ...marcas]"
                      label="Marca"
                      variant="outlined"
                      density="compact"
                      prepend-inner-icon="mdi-tag"
                      item-title="descmarca"
                      item-value="id"
                      :loading="carregandoMarcas"
                      clearable
                  ></v-autocomplete>
                </v-col>

                <!-- Localização -->
                <v-col cols="12" md="4">
                  <v-autocomplete
                      v-model="filtroManual.localizacaoId"
                      :items="[{ descricao: 'Todas as Localizações', id: null }, ...localizacoes]"
                      label="Localização"
                      variant="outlined"
                      density="compact"
                      prepend-inner-icon="mdi-map-marker"
                      item-title="descricao"
                      item-value="id"
                      :loading="carregandoLocalizacoes"
                      clearable
                  ></v-autocomplete>
                </v-col>

                <!-- Botão Listar -->
                <v-col cols="12">
                  <v-btn
                      color="var(--text-color-laranja)"
                      variant="flat"
                      prepend-icon="mdi-plus-circle"
                      class="text-white"
                      :disabled="!inventario.id_almoxarifado"
                      :loading="carregandoGridProdutos"
                      @click="buscarGridInventario"
                      block
                  >
                    Listar Produtos ao Inventário
                  </v-btn>
                </v-col>
              </v-row>
            </div>
          </v-card-text>
        </v-card>

        <!-- Card da Tabela de Itens -->
        <v-card v-if="itensInventario.length > 0" :color="themeStore.darkMode ? 'text-white' : ''" class="background-secondary">
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
            <v-table class="inventario-table" density="comfortable">
              <thead>
                <tr>
                  <th class="text-center" style="width: 5%">#</th>
                  <th class="text-left" style="width: 10%">Código</th>
                  <th class="text-left" style="width: 33%">Produto</th>
                  <th class="text-center" style="width: 13%">Qtd. Sistema</th>
                  <th class="text-center" style="width: 13%">Qtd. Contada</th>
                  <th class="text-center" style="width: 13%">Diferença</th>
                  <th class="text-center" style="width: 10%">Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="itensInventario.length === 0">
                  <td colspan="7" class="text-center pa-12">
                    <v-icon size="80" color="grey-lighten-1">mdi-package-variant-closed-remove</v-icon>
                    <p class="text-h6 mt-4 mb-2">Nenhum item adicionado ao inventário</p>
                    <p class="text-body-2 text-grey">
                      {{ inventario.tipo === 'A' ? 'Importe um arquivo para adicionar produtos automaticamente' : 'Selecione produtos manualmente usando o formulário acima' }}
                    </p>
                  </td>
                </tr>
                <tr 
                    v-else
                    v-for="(item, index) in (itensInventario || [])" 
                    :key="index"
                    :class="getDiferencaClass(item.diferenca)"
                >
                  <td class="text-center text-body-2 font-weight-bold">{{ index + 1 }}</td>
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
                  <td colspan="3" class="text-right pa-3">TOTAL:</td>
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
                :prepend-icon="inventario.tipo === 'L' ? 'mdi-link-variant' : 'mdi-check-circle'"
                @click="finalizarLote"
                >
                {{ inventario.tipo === 'L' ? 'Finalizar e Gerar Link' : 'Finalizar e Salvar Lote' }}
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
              <p class="text-h6 mt-4 mb-2">Nenhum lote de inventário criado</p>
              <p class="text-body-2 text-grey">
                Clique no botão "Criar Novo Lote" acima para iniciar um inventário de produtos.
              </p>
            </div>

            <v-table v-if="lotes.length > 0 && !loteAberto" class="inventario-table" density="comfortable">
              <thead>
                <tr>
                  <th class="text-left" style="width: 5%">#</th>
                  <th class="text-left" style="width: 22%">Almoxarifado</th>
                  <th class="text-center" style="width: 12%">Data</th>
                  <th class="text-center" style="width: 12%">Tipo</th>
                  <th class="text-center" style="width: 15%">Situação</th>
                  <th class="text-center" style="width: 10%">Itens</th>
                  <th class="text-left" style="width: 14%">Observações</th>
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
                        :color="lote.tipo === 'A' ? 'primary' : 'success'"
                        variant="tonal"
                    >
                      <v-icon 
                          :icon="lote.tipo === 'A' ? 'mdi-barcode-scan' : 'mdi-keyboard'" 
                          size="x-small" 
                          class="mr-1"
                      ></v-icon>
                      {{ lote.desctipo || (lote.tipo === 'A' ? 'Automático' : 'Manual') }}
                    </v-chip>
                  </td>
                  <td class="text-center">
                    <v-chip
                        size="small"
                        :color="lote.situacao === 'E' ? 'success' : lote.situacao === 'C' ? 'error' : 'warning'"
                        variant="tonal"
                    >
                      <v-icon
                          :icon="lote.situacao === 'E' ? 'mdi-check-circle' : lote.situacao === 'C' ? 'mdi-cancel' : 'mdi-progress-clock'"
                          size="x-small"
                          class="mr-1"
                      ></v-icon>
                      {{ lote.descsituacao || 'EM PROCESSAMENTO' }}
                    </v-chip>
                  </td>
                  <td class="text-center">
                    <v-chip size="small" color="var(--text-color-laranja)" variant="flat" class="text-white">
                      {{ lote.qtd_item ?? (lote.itens || []).length }} {{ (lote.qtd_item ?? (lote.itens || []).length) === 1 ? 'item' : 'itens' }}
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
                        v-if="lote.tipo === 'L'"
                        icon="mdi-link-variant"
                        size="small"
                        variant="text"
                        color="var(--text-color-laranja)"
                        title="Gerar Link de Contagem"
                        @click="gerarLinkContagem(lote.id)"
                    ></v-btn>
                    <v-btn
                        v-if="lote.situacao !== 'E'"
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
                        :color="loteVisualizando?.tipo === 'A' ? 'primary' : 'success'"
                        variant="tonal"
                    >
                      {{ loteVisualizando?.tipo === 'A' ? 'Automático' : 'Manual' }}
                    </v-chip>
                  </div>
                </v-col>
                <v-col cols="4">
                  <div class="text-caption text-grey">Total de Itens</div>
                  <div class="text-body-1">
                    <v-chip color="var(--text-color-laranja)" size="small" variant="flat" class="text-white">
                      {{ loteVisualizando?.itens?.length || 0 }} {{ (loteVisualizando?.itens?.length || 0) === 1 ? 'item' : 'itens' }}
                    </v-chip>
                  </div>
                </v-col>
                <v-col cols="12" v-if="loteVisualizando?.observacoes">
                  <div class="text-caption text-grey">Observações</div>
                  <div class="text-body-1">{{ loteVisualizando.observacoes }}</div>
                </v-col>
              </v-row>

              <v-progress-linear
                  v-if="carregandoItensLote"
                  indeterminate
                  color="var(--text-color-laranja)"
                  class="mb-2"
              ></v-progress-linear>

              <v-data-table
                  class="inventario-table"
                  density="comfortable"
                  :headers="headersItensModal"
                  :items="loteVisualizando?.itens || []"
                  :loading="carregandoItensLote"
                  v-model:page="paginaModal"
                  :items-per-page="itensPorPaginaModal"
                  item-value="id_seq"
                  no-data-text="Nenhum item neste lote"
                  loading-text="Carregando itens..."
              >
                <template #[`item.id_seq`]="{ item }">
                  <span class="font-weight-bold">{{ item.id_seq }}</span>
                </template>

                <template #[`item.nome`]="{ item }">
                  <div class="text-body-2 font-weight-medium">{{ item.nome }}</div>
                </template>

                <template #[`item.estoqueSistema`]="{ item }">
                  <v-chip size="small" variant="outlined">
                    {{ formatarNumero(item.estoqueSistema) }}
                  </v-chip>
                </template>

                <template #[`item.quantidadeContada`]="{ item }">
                  <v-chip
                      v-if="loteVisualizando?.situacao === 'E'"
                      size="small"
                      color="grey"
                      variant="tonal"
                  >
                    {{ formatarNumero(item.quantidadeContada) }}
                  </v-chip>
                  <v-text-field
                      v-else
                      v-model.number="item.quantidadeContada"
                      type="number"
                      density="compact"
                      variant="outlined"
                      hide-details
                      min="0"
                      style="max-width: 110px; margin: 0 auto"
                      @update:model-value="item.diferenca = (item.quantidadeContada || 0) - item.estoqueSistema"
                  ></v-text-field>
                </template>

                <template #[`item.diferenca`]="{ item }">
                  <v-chip
                      size="small"
                      :color="item.diferenca > 0 ? 'success' : item.diferenca < 0 ? 'error' : 'grey'"
                      variant="flat"
                      class="text-white font-weight-bold"
                  >
                    {{ item.diferenca > 0 ? '+' : '' }}{{ formatarNumero(item.diferenca) }}
                  </v-chip>
                </template>

                <template #bottom="{ pageCount }">
                  <div class="d-flex align-center justify-space-between pa-3">
                    <div class="d-flex align-center gap-2">
                      <span class="text-body-2 text-grey mr-2">Itens por página:</span>
                      <v-select
                          v-model="itensPorPaginaModal"
                          :items="[5, 10, 20, 50]"
                          density="compact"
                          variant="outlined"
                          hide-details
                          style="width: 80px"
                      ></v-select>
                    </div>
                    <v-pagination
                        v-model="paginaModal"
                        :length="pageCount"
                        :total-visible="5"
                        density="compact"
                        active-color="var(--text-color-laranja)"
                    ></v-pagination>
                  </div>
                </template>
              </v-data-table>
            </v-card-text>

            <v-card-actions class="pa-4">
              <v-spacer></v-spacer>
              <v-btn
                  color="grey"
                  variant="outlined"
                  @click="modalItensAberto = false"
              >
                Fechar
              </v-btn>
              <v-btn
                  v-if="loteVisualizando?.situacao !== 'E'"
                  color="var(--text-color-laranja)"
                  variant="flat"
                  class="text-white"
                  prepend-icon="mdi-check-circle"
                  :loading="salvandoContagem"
                  :disabled="!loteVisualizando?.itens?.length"
                  @click="salvarContagem"
              >
                Salvar Contagem
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
import { ref, reactive, watch, onMounted } from 'vue'
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
const carregandoGrupos = ref(false)
const carregandoSubgrupos = ref(false)
const carregandoMarcas = ref(false)
const carregandoGridProdutos = ref(false)
const adicionandoItens = ref(false)
const processandoArquivo = ref(false)
const usarSeparador = ref(true)
const modalItensAberto = ref(false)
const loteVisualizando = ref(null)
const carregandoItensLote = ref(false)
const modalLinkAberto = ref(false)
const linkContagem = ref('')
const salvandoContagem = ref(false)
const paginaModal = ref(1)
const itensPorPaginaModal = ref(10)

const headersItensModal = [
  { title: '#', key: 'id_seq', sortable: true, align: 'center', width: '5%' },
  { title: 'Produto', key: 'nome', sortable: true, width: '40%' },
  { title: 'Qtd. Sistema', key: 'estoqueSistema', sortable: true, align: 'center', width: '15%' },
  { title: 'Qtd. Contada', key: 'quantidadeContada', sortable: false, align: 'center', width: '20%' },
  { title: 'Diferença', key: 'diferenca', sortable: true, align: 'center', width: '15%' }
]

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
const produtosGrid = ref([])
const localizacoes = ref([])
const grupos = ref([])
const subgrupos = ref([])
const marcas = ref([])

const filtroManual = reactive({
  codigo: '',
  produtoId: null,
  grupoId: null,
  subgrupoId: null,
  marcaId: null,
  localizacaoId: null
})

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
  },
  { 
    title: 'Contagem por Link', 
    value: 'L',
    icon: 'mdi-link-variant',
    color: 'info'
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
      layout_utilizado: inventario.layout_utilizado || '',
      item: itensInventario.value.map((item, index) => ({
        id_seq: index + 1,
        id_cor: 0,
        id_tamanho: 0,
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
        id_almoxarifado: inventario.id_almoxarifado,
        almoxarifadoNome: almoxarifado?.descalmoxarifado || 'Não identificado',
        itens: [...itensInventario.value]
      }

      lotes.value.push(novoLote)

      // Se tipo L (Contagem por Link), abrir modal de link após salvar
      if (inventario.tipo === 'L' && response.data.id) {
        gerarLinkContagem(response.data.id, parseInt(idEmpresa))
      }
    }
    
    limparFormulario()
    loteAberto.value = false
  } catch (error) {
    console.error('[Inventário] Erro ao finalizar lote:', error)
  }
}

const visualizarItensLote = async (lote) => {
  loteVisualizando.value = { ...lote, itens: [] }
  modalItensAberto.value = true

  if (!lote.id) return

  try {
    const empresaSelecionadaStr = localStorage.getItem('empresaSelecionada')
    if (!empresaSelecionadaStr) return

    const empresaSelecionada = JSON.parse(empresaSelecionadaStr)
    const idEmpresa = empresaSelecionada.id
    if (!idEmpresa) return

    carregandoItensLote.value = true
    const response = await inventarioStore.obterItensInventarioNovo(parseInt(idEmpresa), lote.id, lote.id_almoxarifado)
    const dados = response?.data || response

    if (dados) {
      const itensApi = Array.isArray(dados) ? dados : (dados.itens || dados.item || dados.data || [])
      const itensMapeados = itensApi.map(item => ({
        id_seq: item.id_seq,
        produtoId: item.id_produto,
        nome: item.descproduto || `Produto #${item.id_produto}`,
        estoqueSistema: item.qtd_sistema || 0,
        quantidadeContada: item.qtd_contada || 0,
        diferenca: item.qtd_diferenca || 0
      }))

      loteVisualizando.value = {
        ...loteVisualizando.value,
        ...dados,
        almoxarifadoNome: lote.almoxarifadoNome,
        itens: itensMapeados
      }
    }
  } catch (error) {
    console.error('[Inventário] Erro ao carregar itens do lote:', error)
    toast.error('Erro ao carregar itens do lote')
  } finally {
    carregandoItensLote.value = false
  }
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

const salvarContagem = async () => {
  if (!loteVisualizando.value?.itens?.length) {
    toast.warning('Nenhum item para salvar')
    return
  }

  salvandoContagem.value = true
  try {
    const empresaSelecionadaStr = localStorage.getItem('empresaSelecionada')
    if (!empresaSelecionadaStr) {
      toast.error('Empresa não selecionada')
      return
    }
    const idEmpresa = JSON.parse(empresaSelecionadaStr).id

    const itens = loteVisualizando.value.itens.map(item => ({
      id_seq: item.id_seq,
      id_produto: item.produtoId,
      qtd_contada: item.quantidadeContada || 0,
      qtd_diferenca: item.diferenca || 0,
      id_cor: 0,
      id_tamanho: 0,
    }))

    await inventarioStore.atualizarItemInventario(
      parseInt(idEmpresa),
      loteVisualizando.value.id,
      itens,
      loteVisualizando.value.id_almoxarifado
    )
  } catch (error) {
    console.error('[Inventário] Erro ao salvar contagem:', error)
  } finally {
    salvandoContagem.value = false
  }
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
  if (!inventario.id_almoxarifado) {
    toast.warning('Selecione um almoxarifado primeiro')
    return
  }

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
            
            // Buscar saldo do produto no almoxarifado via API
            const empresaSelecionadaStr = localStorage.getItem('empresaSelecionada')
            const empresaSelecionada = JSON.parse(empresaSelecionadaStr)
            const idEmpresa = empresaSelecionada.id
            
            let qtdSistema = 0
            try {
              const saldoData = await inventarioStore.consultarSaldoProdutoAlmoxarifado(
                idEmpresa,
                inventario.id_almoxarifado,
                produto.id
              )
              qtdSistema = saldoData?.saldo || saldoData?.quantidade || 0
              console.log('[Inventário] Saldo do produto no almoxarifado:', qtdSistema)
            } catch (error) {
              console.warn('[Inventário] Erro ao buscar saldo, usando 0:', error)
              qtdSistema = 0
            }

            itensInventario.value.push({
              produtoId: produto.id,
              codigo: produto.codigo_sku || produto.codigo_gtin || produto.id,
              nome: produto.descproduto,
              estoqueSistema: qtdSistema,
              quantidadeContada: qtdContada,
              diferenca: 0,
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

const gerarLinkContagem = (loteIdParam = null, idEmpresaParam = null) => {
  let loteId = loteIdParam
  let idEmpresa = idEmpresaParam

  if (!loteId) {
    toast.error('Este lote não possui ID válido para gerar o link')
    return
  }

  if (!idEmpresa) {
    const empresaSelecionadaStr = localStorage.getItem('empresaSelecionada')
    if (!empresaSelecionadaStr) {
      toast.error('Empresa não selecionada')
      return
    }
    idEmpresa = JSON.parse(empresaSelecionadaStr).id
    if (!idEmpresa) {
      toast.error('Empresa não identificada')
      return
    }
  }

  // Gerar token único para o lote
  const token = gerarToken()

  // Construir URL com empresa e id do inventário
  const baseUrl = window.location.origin
  linkContagem.value = `${baseUrl}/inventario/contagem/${idEmpresa}/${loteId}?token=${token}`

  // Abrir modal com o link
  modalLinkAberto.value = true
}

const gerarToken = () => {
  // Gerar token criptograficamente seguro
  const array = new Uint32Array(4)
  crypto.getRandomValues(array)
  return Array.from(array, v => v.toString(36)).join('')
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

const buscarPorCodigo = () => {
  if (!filtroManual.codigo) return
  const produto = produtosGrid.value.find(p =>
    String(p.id_produto) === String(filtroManual.codigo) ||
    p.codigo_gtin === filtroManual.codigo
  )
  if (produto) {
    filtroManual.produtoId = produto.id_produto
  } else {
    toast.warning('Produto não encontrado para o código informado')
  }
}

const onGrupoChange = async (grupoId) => {
  filtroManual.subgrupoId = null
  subgrupos.value = []
  if (!grupoId) return

  carregandoSubgrupos.value = true
  try {
    await estoqueStore.buscarTodosSubgrupos(grupoId)
    subgrupos.value = estoqueStore.subgrupos || []
  } catch (error) {
    console.error('[Inventário] Erro ao carregar subgrupos:', error)
  } finally {
    carregandoSubgrupos.value = false
  }
}

const buscarGridInventario = async () => {
  if (!inventario.id_almoxarifado) {
    toast.warning('Selecione um almoxarifado primeiro')
    return
  }

  adicionandoItens.value = true
  try {
    const empresaSelecionadaStr = localStorage.getItem('empresaSelecionada')
    if (!empresaSelecionadaStr) { toast.error('Empresa não selecionada'); return }
    const idEmpresa = JSON.parse(empresaSelecionadaStr).id

    // Passa os filtros como query params para a API
    const filtros = {
      idpro: filtroManual.produtoId || undefined,
      idgrp: filtroManual.grupoId || undefined,
      idsbg: filtroManual.subgrupoId || undefined,
      idmar: filtroManual.marcaId || undefined,
      idloc: filtroManual.localizacaoId || undefined
    }

    await inventarioStore.buscarGridInventario(parseInt(idEmpresa), inventario.id_almoxarifado, filtros)
    const produtosFiltrados = inventarioStore.gridProdutos || []

    if (produtosFiltrados.length === 0) {
      toast.warning('Nenhum produto encontrado com os filtros selecionados')
      return
    }

    const localizacaoId = filtroManual.localizacaoId || null
    let adicionados = 0
    for (const produto of produtosFiltrados) {
      if (itensInventario.value.find(i => i.produtoId === produto.id_produto)) continue

      const qtdSistema = parseFloat(produto.quantidade) || 0
      itensInventario.value.push({
        produtoId: produto.id_produto,
        codigo: produto.codigo_gtin || produto.id_produto,
        nome: produto.descproduto,
        estoqueSistema: qtdSistema,
        quantidadeContada: 0,
        diferenca: 0,
        unidade: produto.abreviatura || 'UN',
        localizacaoId,
        localizacao: getDescricaoLocalizacao(localizacaoId)
      })
      adicionados++
    }

    if (adicionados > 0) {
      toast.success(`${adicionados} produto(s) adicionado(s) ao inventário`)
    } else {
      toast.info('Todos os produtos filtrados já estavam no inventário')
    }
  } catch (error) {
    console.error('[Inventário] Erro ao adicionar itens manuais:', error)
    toast.error('Erro ao adicionar produtos')
  } finally {
    adicionandoItens.value = false
  }
}

const carregarGridProdutos = async () => {
  if (!inventario.id_almoxarifado) {
    produtosGrid.value = []
    return
  }
  carregandoGridProdutos.value = true
  try {
    const empresaSelecionadaStr = localStorage.getItem('empresaSelecionada')
    if (!empresaSelecionadaStr) return
    const idEmpresa = JSON.parse(empresaSelecionadaStr).id
    await inventarioStore.buscarGridInventario(parseInt(idEmpresa), inventario.id_almoxarifado)
    produtosGrid.value = inventarioStore.gridProdutos || []
    console.log('[Inventário] Grid de produtos carregada:', produtosGrid.value.length, 'produtos')
  } catch (error) {
    console.error('[Inventário] Erro ao carregar grid de produtos:', error)
  } finally {
    carregandoGridProdutos.value = false
  }
}

// Recarregar grid ao trocar almoxarifado (modo Manual)
watch(() => inventario.id_almoxarifado, (novoAlmox) => {
  if (novoAlmox) {
    carregarGridProdutos()
  } else {
    produtosGrid.value = []
  }
})

// Carregar dados iniciais
const carregarGrupos = async () => {
  carregandoGrupos.value = true
  try {
    await estoqueStore.buscarTodos('')
    grupos.value = estoqueStore.grupos || []
  } catch (error) {
    console.error('[Inventário] Erro ao carregar grupos:', error)
  } finally {
    carregandoGrupos.value = false
  }
}

const carregarMarcas = async () => {
  carregandoMarcas.value = true
  try {
    await produtosStore.buscarMarcas()
    marcas.value = produtosStore.marcas || []
  } catch (error) {
    console.error('[Inventário] Erro ao carregar marcas:', error)
  } finally {
    carregandoMarcas.value = false
  }
}

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
    // Mapear campos da API e garantir que cada lote tenha o array de itens
    lotes.value = (inventarioStore.inventarios || []).map(lote => {
      const desc = (lote.descsituacao || '').toUpperCase()
      const situacao = desc === 'ENCERRADO' ? 'E' : desc === 'CANCELADO' ? 'C' : 'A'
      return {
        ...lote,
        almoxarifadoNome: lote.descalmoxarifado || lote.almoxarifadoNome || 'Não identificado',
        data: lote.dtgeracao ? lote.dtgeracao.split('T')[0] : lote.data,
        situacao,
        descsituacao: lote.descsituacao || '',
        desctipo: lote.desctipo || (lote.tipo === 'M' ? 'MANUAL' : lote.tipo === 'A' ? 'AUTOMÁTICO' : ''),
        qtd_item: lote.qtd_item ?? 0,
        itens: lote.itens || []
      }
    })
    
    console.log('[Inventário] Inventários carregados:', lotes.value)
  } catch (error) {
    console.error('[Inventário] Erro ao carregar inventários:', error)
  }
}

onMounted(async () => {
  await carregarAlmoxarifados()
  await carregarProdutos()
  await carregarLocalizacoes()
  await carregarGrupos()
  await carregarMarcas()
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

/* v-data-table - tema escuro */
:deep(.v-data-table) {
  background-color: transparent !important;
}

:deep(.v-data-table .v-data-table__wrapper) {
  background-color: var(--background-card);
}

:deep(.v-data-table thead tr th) {
  background-color: var(--text-color-laranja) !important;
  color: white !important;
  font-weight: 700 !important;
}

:deep(.v-data-table tbody tr td) {
  color: var(--text-color) !important;
}

:deep(.v-data-table .v-data-table-footer) {
  background-color: var(--background-card);
  color: var(--text-color) !important;
}

:deep(.v-data-table .v-data-table-footer .v-field__input),
:deep(.v-data-table .v-data-table-footer .v-select__selection-text) {
  color: var(--text-color) !important;
}
</style>
