<template>
  <div class="pa-4">

    <!-- ===== HEADER ===== -->
    <v-card class="background-secondary mb-4">
      <v-card-title class="text-h5 pa-4 d-flex justify-space-between align-center flex-wrap gap-2">
        <div class="d-flex align-center">
          <v-icon icon="mdi-package-variant-closed" class="mr-3" color="var(--text-color-laranja)"></v-icon>
          Posição de Estoque
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
        <v-tab value="posicao">
          <v-icon icon="mdi-chart-box-outline" class="mr-2"></v-icon>
          Posição de Estoque
        </v-tab>
        <v-tab value="acompanhamento">
          <v-icon icon="mdi-chart-timeline-variant" class="mr-2"></v-icon>
          Acompanhamento de Estoque
        </v-tab>
      </v-tabs>

      <v-divider></v-divider>

      <v-card-text class="pa-0">
        <v-tabs-window v-model="abaAtiva">

          <!-- ======================================================= -->
          <!-- TAB 1: POSIÇÃO DE ESTOQUE                               -->
          <!-- ======================================================= -->
          <v-tabs-window-item value="posicao">
            <div class="pa-4">

              <!-- Ações -->
              <div class="d-flex flex-wrap gap-2 mb-5">
                <v-btn
                  variant="outlined"
                  color="var(--text-color-laranja)"
                  prepend-icon="mdi-broom"
                  @click="limparPosicao"
                >Limpar</v-btn>
                <v-spacer></v-spacer>
                <v-btn
                  color="var(--text-color-laranja)"
                  variant="flat"
                  class="text-white"
                  :loading="loading"
                  @click="emitirPosicao"
                >
                  <template #prepend>
                    <v-icon color="white" icon="mdi-printer"></v-icon>
                  </template>
                  Emitir Relatório
                </v-btn>
              </div>

              <!-- === FILTROS POR CATEGORIA (grade uniforme) === -->
              <div class="secao-titulo mb-2">FILTROS POR CATEGORIA</div>
              <div class="filtro-radio-grid mb-5">

                <v-card class="background-card filtro-radio-item" rounded="lg" elevation="0">
                  <div class="filtro-radio-label">GRUPO</div>
                  <v-autocomplete
                    v-model="filtrosPosicao.idGrupo"
                    :items="gruposOpcoes"
                    item-title="descgrupo"
                    item-value="id"
                    label="Todos"
                    variant="outlined"
                    density="compact"
                    hide-details
                    clearable
                    :theme="themeStore.darkMode ? 'dark' : 'light'"
                    color="var(--text-color-laranja)"
                    :loading="estoqueStore.loading"
                    @update:model-value="onGrupoPosicaoChange"
                  ></v-autocomplete>
                </v-card>

                <v-card class="background-card filtro-radio-item" rounded="lg" elevation="0">
                  <div class="filtro-radio-label">SUBGRUPO</div>
                  <v-autocomplete
                    v-model="filtrosPosicao.idSubgrupo"
                    :items="subgruposPosicaoOpcoes"
                    item-title="descsubgrupo"
                    item-value="id"
                    label="Todos"
                    variant="outlined"
                    density="compact"
                    hide-details
                    clearable
                    :disabled="!filtrosPosicao.idGrupo"
                    :theme="themeStore.darkMode ? 'dark' : 'light'"
                    color="var(--text-color-laranja)"
                    :loading="estoqueStore.loading"
                  ></v-autocomplete>
                </v-card>

                <v-card class="background-card filtro-radio-item" rounded="lg" elevation="0">
                  <div class="filtro-radio-label">ALMOXARIFADO</div>
                  <v-autocomplete
                    v-model="filtrosPosicao.idAlmox"
                    :items="estoqueStore.almoxarifados"
                    item-title="descalmoxarifado"
                    item-value="id"
                    label="Todos"
                    variant="outlined"
                    density="compact"
                    hide-details
                    clearable
                    :theme="themeStore.darkMode ? 'dark' : 'light'"
                    color="var(--text-color-laranja)"
                    :loading="estoqueStore.loading"
                  ></v-autocomplete>
                </v-card>

                <v-card class="background-card filtro-radio-item" rounded="lg" elevation="0">
                  <div class="filtro-radio-label">LOCALIZAÇÃO</div>
                  <v-autocomplete
                    v-model="filtrosPosicao.idLocalizacao"
                    :items="produtosStore.localizacoes"
                    item-title="descricao"
                    item-value="id"
                    label="Todas"
                    variant="outlined"
                    density="compact"
                    hide-details
                    clearable
                    :theme="themeStore.darkMode ? 'dark' : 'light'"
                    color="var(--text-color-laranja)"
                    :loading="produtosStore.loading"
                  ></v-autocomplete>
                </v-card>

                <v-card class="background-card filtro-radio-item" rounded="lg" elevation="0">
                  <div class="filtro-radio-label">CLASSE</div>
                  <v-autocomplete
                    v-model="filtrosPosicao.idClasse"
                    :items="estoqueStore.classes"
                    item-title="descclasse"
                    item-value="id"
                    label="Todas"
                    variant="outlined"
                    density="compact"
                    hide-details
                    clearable
                    :theme="themeStore.darkMode ? 'dark' : 'light'"
                    color="var(--text-color-laranja)"
                    :loading="estoqueStore.loading"
                  ></v-autocomplete>
                </v-card>

                <v-card class="background-card filtro-radio-item" rounded="lg" elevation="0">
                  <div class="filtro-radio-label">MARCA</div>
                  <v-autocomplete
                    v-model="filtrosPosicao.idMarca"
                    :items="produtosStore.marcas"
                    item-title="descmarca"
                    item-value="id"
                    label="Todas"
                    variant="outlined"
                    density="compact"
                    hide-details
                    clearable
                    :theme="themeStore.darkMode ? 'dark' : 'light'"
                    color="var(--text-color-laranja)"
                    :loading="produtosStore.loading"
                  ></v-autocomplete>
                </v-card>

                <v-card class="background-card filtro-radio-item" rounded="lg" elevation="0">
                  <div class="filtro-radio-label">NCM</div>
                  <v-autocomplete
                    v-model="filtrosPosicao.idNcm"
                    :items="estoqueStore.ncms"
                    :item-title="(item) => item.id + ' - ' + item.desc_ncm"
                    item-value="id"
                    label="Todos"
                    variant="outlined"
                    density="compact"
                    hide-details
                    clearable
                    :theme="themeStore.darkMode ? 'dark' : 'light'"
                    color="var(--text-color-laranja)"
                    :loading="estoqueStore.loading"
                    :menu-props="{ maxHeight: 250, maxWidth: 400 }"
                  ></v-autocomplete>
                </v-card>

              </div>

              <!-- === CONFIGURAÇÕES DO RELATÓRIO (grade uniforme) === -->
              <div class="secao-titulo mb-2">CONFIGURAÇÕES DO RELATÓRIO</div>
              <div class="filtro-radio-grid mb-5">

                <v-card class="background-card filtro-radio-item" rounded="lg" elevation="0">
                    <v-checkbox
                    v-model="filtrosPosicao.imprimirQtdZero"
                    label="Imprimir Qtd. Zero"
                    density="compact"
                    color="var(--text-color-laranja)"
                    hide-details
                    ></v-checkbox>
                </v-card>

                    <v-card class="background-card filtro-radio-item" rounded="lg" elevation="0">
                  <v-checkbox
                    v-model="filtrosPosicao.imprimirPeso"
                    label="Imprimir Peso"
                    density="compact"
                    color="var(--text-color-laranja)"
                    hide-details
                  ></v-checkbox>
                </v-card>

                <v-card class="background-card filtro-radio-item" rounded="lg" elevation="0">
                  <div class="filtro-radio-label">STATUS PRODUTOS</div>
                  <v-select
                    v-model="filtrosPosicao.statusProduto"
                    :items="[{ title: 'Todos', value: 'todos' }, { title: 'Ativo', value: 'ativo' }, { title: 'Inativo', value: 'inativo' }]"
                    item-title="title" item-value="value"
                    variant="outlined" density="compact" hide-details
                    :theme="themeStore.darkMode ? 'dark' : 'light'"
                    color="var(--text-color-laranja)"
                  ></v-select>
                </v-card>

                <v-card class="background-card filtro-radio-item" rounded="lg" elevation="0">
                  <div class="filtro-radio-label">ESTOQUE</div>
                  <v-select
                    v-model="filtrosPosicao.tipoEstoque"
                    :items="[{ title: 'Todos', value: 'todos' }, { title: 'Estoque Positivo', value: 'positivo' }, { title: 'Estoque Negativo', value: 'negativo' }]"
                    item-title="title" item-value="value"
                    variant="outlined" density="compact" hide-details
                    :theme="themeStore.darkMode ? 'dark' : 'light'"
                    color="var(--text-color-laranja)"
                  ></v-select>
                </v-card>

                <v-card class="background-card filtro-radio-item" rounded="lg" elevation="0">
                  <div class="filtro-radio-label">EMITIR</div>
                  <v-select
                    v-model="filtrosPosicao.emitir"
                    :items="[
                      { title: 'Preço de Venda', value: 'preco_venda' },
                      { title: 'Custo de Compra', value: 'custo_compra' },
                      { title: 'Custo de Aquisição', value: 'custo_aquisicao' },
                      { title: 'Custo Médio', value: 'custo_medio' },
                    ]"
                    item-title="title" item-value="value"
                    variant="outlined" density="compact" hide-details
                    :theme="themeStore.darkMode ? 'dark' : 'light'"
                    color="var(--text-color-laranja)"
                  ></v-select>
                </v-card>

                <v-card class="background-card filtro-radio-item" rounded="lg" elevation="0">
                  <div class="filtro-radio-label">ORDEM</div>
                  <v-select
                    v-model="filtrosPosicao.ordem"
                    :items="[
                      { title: 'Alfabética', value: 'alfabetica' },
                      { title: 'Ordenador', value: 'ordenador' },
                      { title: 'Numérica', value: 'numerica' },
                    ]"
                    item-title="title" item-value="value"
                    variant="outlined" density="compact" hide-details
                    :theme="themeStore.darkMode ? 'dark' : 'light'"
                    color="var(--text-color-laranja)"
                  ></v-select>
                </v-card>

                <v-card class="background-card filtro-radio-item" rounded="lg" elevation="0">
                  <div class="filtro-radio-label">AGRUPAR POR</div>
                  <v-select
                    v-model="filtrosPosicao.agruparPor"
                    :items="[
                      { title: 'Grupo / SubGrupo', value: 'grupo' },
                      { title: 'NCM', value: 'ncm' },
                      { title: 'Localização', value: 'localizacao' },
                    ]"
                    item-title="title" item-value="value"
                    variant="outlined" density="compact" hide-details
                    :theme="themeStore.darkMode ? 'dark' : 'light'"
                    color="var(--text-color-laranja)"
                  ></v-select>
                </v-card>

              </div>

              <!-- === APLICAÇÃO DO PRODUTO === -->
              <div class="secao-titulo mb-2">APLICAÇÃO DO PRODUTO</div>
              <v-card class="background-card pa-3 mb-2" rounded="lg" elevation="0">
                <v-row dense>
                  <v-col cols="6" sm="3">
                    <v-checkbox
                      v-model="filtrosPosicao.aplicacoes"
                      value="venda_revenda"
                      label="Venda / Revenda"
                      density="compact"
                      color="var(--text-color-laranja)"
                      hide-details
                    ></v-checkbox>
                  </v-col>
                  <v-col cols="6" sm="3">
                    <v-checkbox
                      v-model="filtrosPosicao.aplicacoes"
                      value="consumo"
                      label="Consumo"
                      density="compact"
                      color="var(--text-color-laranja)"
                      hide-details
                    ></v-checkbox>
                  </v-col>
                  <v-col cols="6" sm="3">
                    <v-checkbox
                      v-model="filtrosPosicao.aplicacoes"
                      value="materia_prima"
                      label="Matéria Prima"
                      density="compact"
                      color="var(--text-color-laranja)"
                      hide-details
                    ></v-checkbox>
                  </v-col>
                  <v-col cols="6" sm="3">
                    <v-checkbox
                      v-model="filtrosPosicao.aplicacoes"
                      value="imobilizado"
                      label="Imobilizado"
                      density="compact"
                      color="var(--text-color-laranja)"
                      hide-details
                    ></v-checkbox>
                  </v-col>
                </v-row>
              </v-card>

            </div>
          </v-tabs-window-item>

          <!-- ======================================================= -->
          <!-- TAB 2: ACOMPANHAMENTO DE ESTOQUE                        -->
          <!-- ======================================================= -->
          <v-tabs-window-item value="acompanhamento">
            <div class="pa-4">

              <!-- Ações -->
              <div class="d-flex flex-wrap gap-2 mb-5">
                <v-btn
                  variant="outlined"
                  color="var(--text-color-laranja)"
                  prepend-icon="mdi-broom"
                  @click="limparAcomp"
                >Limpar</v-btn>
                <v-spacer></v-spacer>
                <v-btn
                  color="var(--text-color-laranja)"
                  variant="flat"
                  class="text-white"
                  :loading="loading"
                  @click="emitirAcomp"
                >
                  <template #prepend>
                    <v-icon color="white" icon="mdi-printer"></v-icon>
                  </template>
                  Emitir Relatório
                </v-btn>            
              </div>

              <!-- === PRODUTO + PERÍODO === -->
              <v-row dense class="mb-4">
                <v-col cols="12" md="6">
                  <v-autocomplete
                    v-model="filtrosAcomp.idProduto"
                    :items="produtosStore.produtos"
                    item-title="descproduto"
                    item-value="id"
                    label="Produto"
                    variant="outlined"
                    density="compact"
                    :theme="themeStore.darkMode ? 'dark' : 'light'"
                    color="var(--text-color-laranja)"
                    hide-details
                    clearable
                    prepend-inner-icon="mdi-package-variant-closed"
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
                <v-col cols="12" sm="6" md="3">
                  <v-text-field
                    v-model="filtrosAcomp.periodoInicio"
                    label="Período de"
                    type="date"
                    variant="outlined"
                    density="compact"
                    :theme="themeStore.darkMode ? 'dark' : 'light'"
                    color="var(--text-color-laranja)"
                    hide-details
                    prepend-inner-icon="mdi-calendar-start"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <v-text-field
                    v-model="filtrosAcomp.periodoFim"
                    label="Período até"
                    type="date"
                    variant="outlined"
                    density="compact"
                    :theme="themeStore.darkMode ? 'dark' : 'light'"
                    color="var(--text-color-laranja)"
                    hide-details
                    prepend-inner-icon="mdi-calendar-end"
                  ></v-text-field>
                </v-col>
              </v-row>

              <!-- === FILTROS POR CATEGORIA (grade uniforme) === -->
              <div class="secao-titulo mb-2">FILTROS POR CATEGORIA</div>
              <div class="filtro-radio-grid mb-5">

                <v-card class="background-card filtro-radio-item" rounded="lg" elevation="0">
                  <div class="filtro-radio-label">ALMOXARIFADO</div>
                  <v-autocomplete
                    v-model="filtrosAcomp.idAlmox"
                    :items="estoqueStore.almoxarifados"
                    item-title="descalmoxarifado"
                    item-value="id"
                    label="Todos"
                    variant="outlined"
                    density="compact"
                    hide-details
                    clearable
                    :theme="themeStore.darkMode ? 'dark' : 'light'"
                    color="var(--text-color-laranja)"
                    :loading="estoqueStore.loading"
                  ></v-autocomplete>
                </v-card>

                <v-card class="background-card filtro-radio-item" rounded="lg" elevation="0">
                  <div class="filtro-radio-label">GRUPO</div>
                  <v-autocomplete
                    v-model="filtrosAcomp.idGrupo"
                    :items="gruposOpcoes"
                    item-title="descgrupo"
                    item-value="id"
                    label="Todos"
                    variant="outlined"
                    density="compact"
                    hide-details
                    clearable
                    :theme="themeStore.darkMode ? 'dark' : 'light'"
                    color="var(--text-color-laranja)"
                    :loading="estoqueStore.loading"
                    @update:model-value="onGrupoAcompChange"
                  ></v-autocomplete>
                </v-card>

                <v-card class="background-card filtro-radio-item" rounded="lg" elevation="0">
                  <div class="filtro-radio-label">SUBGRUPO</div>
                  <v-autocomplete
                    v-model="filtrosAcomp.idSubgrupo"
                    :items="subgruposAcompOpcoes"
                    item-title="descsubgrupo"
                    item-value="id"
                    label="Todos"
                    variant="outlined"
                    density="compact"
                    hide-details
                    clearable
                    :disabled="!filtrosAcomp.idGrupo"
                    :theme="themeStore.darkMode ? 'dark' : 'light'"
                    color="var(--text-color-laranja)"
                    :loading="estoqueStore.loading"
                  ></v-autocomplete>
                </v-card>

                <v-card class="background-card filtro-radio-item" rounded="lg" elevation="0">
                  <div class="filtro-radio-label">CLASSE</div>
                  <v-autocomplete
                    v-model="filtrosAcomp.idClasse"
                    :items="estoqueStore.classes"
                    item-title="descclasse"
                    item-value="id"
                    label="Todas"
                    variant="outlined"
                    density="compact"
                    hide-details
                    clearable
                    :theme="themeStore.darkMode ? 'dark' : 'light'"
                    color="var(--text-color-laranja)"
                    :loading="estoqueStore.loading"
                  ></v-autocomplete>
                </v-card>

                <v-card class="background-card filtro-radio-item" rounded="lg" elevation="0">
                  <div class="filtro-radio-label">MARCA</div>
                  <v-autocomplete
                    v-model="filtrosAcomp.idMarca"
                    :items="produtosStore.marcas"
                    item-title="descmarca"
                    item-value="id"
                    label="Todas"
                    variant="outlined"
                    density="compact"
                    hide-details
                    clearable
                    :theme="themeStore.darkMode ? 'dark' : 'light'"
                    color="var(--text-color-laranja)"
                    :loading="produtosStore.loading"
                  ></v-autocomplete>
                </v-card>

              </div>

              <!-- === CONFIGURAÇÕES === -->
              <div class="secao-titulo mb-2">CONFIGURAÇÕES</div>
              <div class="filtro-radio-grid mb-5">

                <v-card class="background-card filtro-radio-item" rounded="lg" elevation="0">
                  <v-checkbox
                    v-model="filtrosAcomp.agruparPorData"
                    label="Agrupar por Data"
                    density="compact"
                    color="var(--text-color-laranja)"
                    hide-details
                  ></v-checkbox>
                </v-card>

                <v-card class="background-card filtro-radio-item" rounded="lg" elevation="0">
                  <div class="filtro-radio-label">ORDEM</div>
                  <v-select
                    v-model="filtrosAcomp.ordem"
                    :items="[{ title: 'Alfabética', value: 'alfabetica' }, { title: 'Numérica', value: 'numerica' }]"
                    item-title="title" item-value="value"
                    variant="outlined" density="compact" hide-details
                    :theme="themeStore.darkMode ? 'dark' : 'light'"
                    color="var(--text-color-laranja)"
                  ></v-select>
                </v-card>

              </div>

              <!-- === APLICAÇÃO DO PRODUTO === -->
              <div class="secao-titulo mb-2">APLICAÇÃO DO PRODUTO</div>
              <v-card class="background-card pa-3 mb-4" rounded="lg" elevation="0">
                <v-row dense>
                  <v-col cols="6" sm="3">
                    <v-checkbox
                      v-model="filtrosAcomp.aplicacoes"
                      value="consumo"
                      label="Consumo"
                      density="compact"
                      color="var(--text-color-laranja)"
                      hide-details
                    ></v-checkbox>
                  </v-col>
                  <v-col cols="6" sm="3">
                    <v-checkbox
                      v-model="filtrosAcomp.aplicacoes"
                      value="materia_prima"
                      label="Matéria Prima"
                      density="compact"
                      color="var(--text-color-laranja)"
                      hide-details
                    ></v-checkbox>
                  </v-col>
                  <v-col cols="6" sm="3">
                    <v-checkbox
                      v-model="filtrosAcomp.aplicacoes"
                      value="imobilizado"
                      label="Imobilizado"
                      density="compact"
                      color="var(--text-color-laranja)"
                      hide-details
                    ></v-checkbox>
                  </v-col>
                  <v-col cols="6" sm="3">
                    <v-checkbox
                      v-model="filtrosAcomp.aplicacoes"
                      value="venda"
                      label="Venda"
                      density="compact"
                      color="var(--text-color-laranja)"
                      hide-details
                    ></v-checkbox>
                  </v-col>
                </v-row>
              </v-card>

              <!-- === TIPO DE OPERAÇÃO ESPECÍFICA === -->
              <div class="d-flex align-center gap-2 mb-3">
                <div class="secao-titulo">TIPO DE OPERAÇÃO ESPECÍFICA?</div>
                <v-checkbox
                  v-model="filtrosAcomp.tipoOperacaoEspecifica"
                  density="compact"
                  color="var(--text-color-laranja)"
                  hide-details
                  class="ma-0 pa-0 flex-grow-0"
                ></v-checkbox>
              </div>

              <v-expand-transition>
                <v-card v-if="filtrosAcomp.tipoOperacaoEspecifica" class="background-card pa-3 mb-2" rounded="lg" elevation="0">
                  <v-row dense>
                    <v-col v-for="op in operacoesDisponiveis" :key="op.value" cols="12" sm="6" md="4">
                      <v-checkbox
                        v-model="filtrosAcomp.operacoes"
                        :value="op.value"
                        :label="op.label"
                        density="compact"
                        color="var(--text-color-laranja)"
                        hide-details
                      ></v-checkbox>
                    </v-col>
                  </v-row>
                </v-card>
              </v-expand-transition>

            </div>
          </v-tabs-window-item>

        </v-tabs-window>
      </v-card-text>
    </v-card>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useThemeStore } from '@/stores/config-temas/theme'
import { useEstoqueStore } from '@/stores/APIs/estoque'
import { useProdutosStore } from '@/stores/APIs/produtos'
import { useEmpresaStore } from '@/stores/APIs/empresa'

const themeStore = useThemeStore()
const estoqueStore = useEstoqueStore()
const produtosStore = useProdutosStore()
const empresaStore = useEmpresaStore()

const abaAtiva = ref('posicao')
const loading = computed(() => estoqueStore.loading || produtosStore.loading)
const idEmpresaAtual = computed(() => empresaStore.empresaSelecionada?.id || null)

// ===== COMPUTED: grupos disponíveis (todos, com opção de filtrar inativos se necessário) =====
const gruposOpcoes = computed(() => estoqueStore.grupos || [])

// Subgrupos independentes por tab (cada uma carrega os seus quando grupo muda)
const subgruposPosicao = ref([])
const subgruposAcomp = ref([])

const subgruposPosicaoOpcoes = computed(() => subgruposPosicao.value)
const subgruposAcompOpcoes = computed(() => subgruposAcomp.value)

// ===== FILTROS: POSIÇÃO DE ESTOQUE =====
const filtrosPosicaoVazio = () => ({
  idGrupo: null,
  idSubgrupo: null,
  idAlmox: null,
  idLocalizacao: null,
  idClasse: null,
  idMarca: null,
  idNcm: null,
  statusProduto: 'todos',
  tipoEstoque: 'todos',
  imprimirQtdZero: false,
  imprimirPeso: false,
  emitir: 'preco_venda',
  aplicacoes: [],
  ordem: 'alfabetica',
  agruparPor: 'grupo',
})

const filtrosPosicao = reactive(filtrosPosicaoVazio())

// ===== FILTROS: ACOMPANHAMENTO DE ESTOQUE =====
const filtrosAcompVazio = () => ({
  idProduto: null,
  periodoInicio: '',
  periodoFim: '',
  idAlmox: null,
  idGrupo: null,
  idSubgrupo: null,
  idClasse: null,
  idMarca: null,
  agruparPorData: false,
  ordem: 'alfabetica',
  aplicacoes: [],
  tipoOperacaoEspecifica: false,
  operacoes: [],
})

const filtrosAcomp = reactive(filtrosAcompVazio())

// ===== OPERAÇÕES DISPONÍVEIS (Acompanhamento) =====
const operacoesDisponiveis = [
  { label: 'Entrada', value: 1 },
  { label: 'Venda', value: 2 },
  { label: 'Transferência entre almoxarifados', value: 3 },
  { label: 'Inventário', value: 4 },
  { label: 'Composição de produtos', value: 5 },
  { label: 'Requisição para consumo', value: 6 },
  { label: 'Cancelamento de entrada', value: 7 },
  { label: 'Cancelamento de venda', value: 8 },
  { label: 'Cancelamento de requisição para consumo', value: 9 },
  { label: 'Ordem de produção', value: 10 },
  { label: 'Requisição excedente', value: 11 },
  { label: 'Cancelamento de requisição excedente', value: 12 },
  { label: 'Estorno excedente', value: 13 },
  { label: 'Cancelamento de estorno excedente', value: 14 },
  { label: 'Requisição de saída da venda', value: 15 },
  { label: 'Cancelamento de requisição de saída da venda', value: 16 },
  { label: 'Estorno de encerramento da execução', value: 17 },
  { label: 'Devolução de compras', value: 18 },
  { label: 'Exclusão de devolução de compras', value: 19 },
  { label: 'Saída por movimentação avulsa', value: 20 },
  { label: 'Entrada por movimentação avulsa', value: 21 },
  { label: 'Saída de Venda', value: 22 },
  { label: 'Devolução de venda', value: 23 },
  { label: 'Devolução de OP', value: 24 },
  { label: 'Cancelamento de OP', value: 25 },
  { label: 'Exclusão NF Entrada', value: 26 },
]

// ===== HANDLERS DE DEPENDÊNCIA =====
const onGrupoPosicaoChange = async (idGrupo) => {
  filtrosPosicao.idSubgrupo = null
  subgruposPosicao.value = []
  if (idGrupo) {
    await estoqueStore.buscarTodosSubgrupos(idGrupo)
    subgruposPosicao.value = estoqueStore.subgrupos || []
  }
}

const onGrupoAcompChange = async (idGrupo) => {
  filtrosAcomp.idSubgrupo = null
  subgruposAcomp.value = []
  if (idGrupo) {
    await estoqueStore.buscarTodosSubgrupos(idGrupo)
    subgruposAcomp.value = estoqueStore.subgrupos || []
  }
}

// ===== AÇÕES =====
const limparPosicao = () => {
  Object.assign(filtrosPosicao, filtrosPosicaoVazio())
  subgruposPosicao.value = []
}

const limparAcomp = () => {
  Object.assign(filtrosAcomp, filtrosAcompVazio())
  subgruposAcomp.value = []
}

const emitirPosicao = () => {
  // TODO: integrar com endpoint do relatório de posição de estoque
  console.log('Emitir Posição de Estoque:', { ...filtrosPosicao })
}

const emitirAcomp = () => {
  // TODO: integrar com endpoint do relatório de acompanhamento de estoque
  console.log('Emitir Acompanhamento de Estoque:', { ...filtrosAcomp })
}

// ===== INICIALIZAÇÃO =====
onMounted(async () => {
  const tarefas = [
    produtosStore.buscarProdutos(),
    produtosStore.buscarMarcas(),
    estoqueStore.buscarTodos(''),
    estoqueStore.buscarTodasClasses(''),
    estoqueStore.buscarNcms(''),
  ]
  if (idEmpresaAtual.value) {
    tarefas.push(estoqueStore.buscarAlmoxarifados(idEmpresaAtual.value))
    tarefas.push(produtosStore.buscarLocalizacoes(idEmpresaAtual.value))
  }
  await Promise.all(tarefas)
})
</script>

<style scoped>
/* ===== GRADE DE FILTROS RADIO ===== */
/* Todos os itens têm o mesmo tamanho e se organizam em grid uniforme */
.filtro-radio-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 8px;
  align-items: start;
}

.filtro-radio-item {
  padding: 10px 12px !important;
  /* Sem min-height fixo: o card expande apenas se o campo de código aparecer */
}

.filtro-radio-label {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  opacity: 0.55;
  margin-bottom: 2px;
  text-transform: uppercase;
}

.filtro-radio-group {
  padding-top: 0 !important;
}

.filtro-select :deep(.v-field__input) {
  min-height: 34px !important;
}

/* Reduz o espaço interno dos radios para ficar mais compacto */
.filtro-radio-group :deep(.v-selection-control) {
  min-height: 28px !important;
}

.filtro-radio-group :deep(.v-label) {
  font-size: 0.8rem !important;
}

.filtro-radio-group :deep(.v-radio) {
  margin-inline-end: 6px !important;
}

/* ===== TÍTULO DE SEÇÃO ===== */
.secao-titulo {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  opacity: 0.55;
  text-transform: uppercase;
}
</style>
