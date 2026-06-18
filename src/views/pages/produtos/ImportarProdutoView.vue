<template>
  <div class="pa-4">
    <!-- Header Card -->
    <v-card class="background-secondary mb-4">
      <v-card-title class="text-h5 pa-4 d-flex justify-space-between align-center">
        <div class="d-flex align-center">
          <v-icon icon="mdi-cloud-download-outline" class="mr-3"></v-icon>
          Importar Produtos
        </div>
      </v-card-title>
    </v-card>

    <!-- Content Card -->
    <v-card class="background-secondary">
      <v-card-text class="pa-4">
        <!-- Seção de Busca por GTIN -->
        <v-card class="background-card mb-4" elevation="2">
          <v-card-title class="text-h6 pa-4">
            <v-icon icon="mdi-barcode" class="mr-2"></v-icon>
            Escanear Código de Barras
          </v-card-title>
          <v-card-text class="pa-4">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  ref="gtinInput"
                  v-model="filtros.gtin"
                  label="Código de Barras (GTIN)"
                  placeholder="Escaneie o código de barras do produto"
                  variant="outlined"
                  density="comfortable"
                  clearable
                  autofocus
                  @keyup.enter="buscarPorGtin"
                  prepend-icon="mdi-barcode-scan"
                  hint="Pressione ENTER após escanear"
                  :loading="loadingBusca"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Tabela de Processos Abertos -->
        <v-expand-transition>
          <v-card v-if="produtosTempEncontrados.length > 0" class="background-card mt-4 mb-4" elevation="1">
            <v-card-title class="text-h6 pa-4 d-flex align-center gap-2" style="border-bottom: 1px solid rgba(0,0,0,0.12)">
              <v-icon icon="mdi-timer-outline" size="24" style="color: var(--text-color-laranja)"></v-icon>
              Processos em Andamento
            </v-card-title>
            <v-card-text class="pa-4">
              <v-table class="elevation-0">
                <thead>
                  <tr style="background-color: var(--text-color-laranja); color: white;">
                    <th class="text-left pa-4 font-weight-bold">ID</th>
                    <th class="text-left pa-4 font-weight-bold">Quantidade</th>
                    <th class="text-left pa-4 font-weight-bold">Data</th>
                    <th class="text-center pa-4 font-weight-bold">Status</th>
                    <th class="text-center pa-4 font-weight-bold">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="processo in produtosTempEncontrados" :key="processo.id">
                    <td class="pa-4">
                      <span class="font-weight-bold" style="color: var(--text-color-laranja)">{{ processo.id }}</span>
                    </td>
                    <td class="pa-4">
                      <v-chip size="small" color="var(--text-color-laranja)" text-color="white">
                        {{ processo.quantidade || '?' }} produto(s)
                      </v-chip>
                    </td>
                    <td class="pa-4">
                      <span class="text-caption">{{ formatarData(processo.data_criacao) }}</span>
                    </td>
                    <td class="pa-4 text-center">
                      <v-chip
                        size="small"
                        :color="processo.status === 'ativo' ? '#FFC107' : '#90CAF9'"
                        text-color="white"
                      >
                        {{ processo.status === 'ativo' ? 'Em Processamento' : 'Pendente' }}
                      </v-chip>
                    </td>
                    <td class="pa-4 text-center">
                      <v-btn
                        size="small"
                        icon="mdi-play"
                        variant="text"
                        color="var(--text-color-laranja)"
                        @click="continuarImportacao(processo.id)"
                        title="Continuar importação"
                      ></v-btn>
                      <v-btn
                        size="small"
                        icon="mdi-trash-can"
                        variant="text"
                        color="error"
                        @click="confirmarExclusaoProcesso(processo.id)"
                        title="Descartar processo"
                      ></v-btn>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card-text>
          </v-card>
        </v-expand-transition>
      </v-card-text>
    </v-card>

    <!-- Modal de Produtos com Paginação -->
    <v-dialog v-model="modalAberto" max-width="1600px" fullscreen>
      <v-card :color="themeStore.darkMode ? 'text-white' : ''" class="background-secondary" elevation="2">
        <!-- Header do Modal -->
        <v-card-title class="text-h5 pa-4 d-flex justify-space-between align-center" style="border-bottom: 3px solid var(--text-color-laranja)">
          <div class="d-flex align-center">
            <v-icon icon="mdi-package-multiple" class="mr-3" size="28" style="color: var(--text-color-laranja)"></v-icon>
            <div>
              <div class="font-weight-bold">Produtos Encontrados</div>
              <div class="text-caption mt-1" :style="{ color: 'var(--text-color-laranja)' }">{{ produtos.length }} total de produtos</div>
            </div>
          </div>
          <div class="d-flex align-center gap-3">
            <v-chip
              :color="produtosSelecionados.length > 0 ? 'var(--text-color-laranja)' : 'grey'"
              text-color="white"
              class="font-weight-bold"
              size="large"
            >
              {{ produtosSelecionados.length }} selecionados
            </v-chip>
            <v-btn icon="mdi-close" variant="text" @click="fecharModal"></v-btn>
          </div>
        </v-card-title>

        <v-card-text class="pa-6">
          <!-- Informações da Paginação -->
          <v-card class="background-card mb-4" elevation="1">
            <v-card-text class="pa-4">
              <v-row>
                <v-col cols="12" sm="6" class="d-flex align-center gap-2">
                  <v-icon icon="mdi-information" size="20" style="color: var(--text-color-laranja)"></v-icon>
                  <span class="text-caption">
                    Exibindo <strong>{{ inicioExibicao }}</strong> a <strong>{{ fimExibicao }}</strong> de <strong>{{ produtos.length }}</strong> produtos
                  </span>
                </v-col>
                <v-col cols="12" sm="6" class="d-flex justify-end">
                  <v-chip
                    :color="'var(--text-color-laranja)'"
                    text-color="white"
                    class="font-weight-bold"
                  >
                    Página {{ paginaAtual + 1 }} / {{ totalPaginas }}
                  </v-chip>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Tabela de Produtos -->
          <div class="table-wrapper">
            <v-data-table
              :headers="headers"
              :items="produtosPaginados"
              item-key="_id_row"
              class="elevation-0 theme-table"
              :loading="loadingBusca"
              no-data-text="Nenhum produto encontrado"
              hide-default-footer
            >
              <!-- Coluna Seleção -->
              <template #[`item.selecionar`]="{ item }">
                <v-checkbox
                  v-model="item.selecionado"
                  color="var(--text-color-laranja)"
                  @update:model-value="atualizarSelecionados"
                ></v-checkbox>
              </template>

              <!-- Coluna Código -->
              <template #[`item.codbar`]="{ item }">
                <div class="font-weight-bold" style="color: var(--text-color-laranja)">
                  {{ item.codbar }}
                </div>
              </template>

              <!-- Coluna Produto -->
              <template #[`item.produto`]="{ item }">
                <div class="text-truncate" style="max-width: 200px;" :title="item.produto">
                  {{ item.produto }}
                </div>
              </template>

              <!-- Coluna Grupo -->
              <template #[`item.grupo`]="{ item }">
                <v-select
                  v-model="item.id_grupo"
                  :items="grupos"
                  item-title="descgrupo"
                  item-value="id"
                  variant="outlined"
                  density="comfortable"
                  clearable
                  @update:model-value="(val) => { carregarSubgrupos(val) }"
                ></v-select>
              </template>

              <!-- Coluna Subgrupo -->
              <template #[`item.subgrupo`]="{ item }">
                <v-select
                  v-model="item.id_subgrupo"
                  :items="subgrupos"
                  item-title="descsubgrupo"
                  item-value="id"
                  variant="outlined"
                  density="comfortable"
                  :disabled="!item.id_grupo"
                  clearable
                ></v-select>
              </template>

              <!-- Coluna Marca -->
              <template #[`item.marca`]="{ item }">
                <v-select
                  v-model="item.id_marca"
                  :items="marcas"
                  item-title="descmarca"
                  item-value="id"
                  variant="outlined"
                  density="comfortable"
                  :loading="loadingSelects"
                  clearable
                ></v-select>
              </template>

              <!-- Coluna Medida -->
              <template #[`item.medida`]="{ item }">
                <v-select
                  v-model="item.id_medida"
                  :items="medidas"
                  item-title="descmedida"
                  item-value="id"
                  variant="outlined"
                  density="comfortable"
                  :loading="loadingSelects"
                  clearable
                ></v-select>
              </template>

              <!-- Coluna Localização -->
              <template #[`item.localizacao`]="{ item }">
                <v-select
                  v-model="item.id_localizacao"
                  :items="localizacoes"
                  item-title="descricao"
                  item-value="id"
                  variant="outlined"
                  density="comfortable"
                  :loading="loadingSelects"
                  clearable
                ></v-select>
              </template>

              <!-- Coluna Classe -->
              <template #[`item.classe`]="{ item }">
                <v-select
                  v-model="item.id_classe"
                  :items="classes"
                  item-title="descclasse"
                  item-value="id"
                  variant="outlined"
                  density="comfortable"
                  :loading="loadingSelects"
                  clearable
                ></v-select>
              </template>

              <!-- Coluna Incidência Fiscal -->
              <template #[`item.incidencia_fiscal`]="{ item }">
                <v-select
                  v-model="item.incidencia_fiscal"
                  :items="opcoesIncidenciaFiscal"
                  item-title="text"
                  item-value="value"
                  variant="outlined"
                  density="compact"
                ></v-select>
              </template>

              <!-- Coluna Preço Venda -->
              <template #[`item.preco_venda`]="{ item }">
                <v-text-field
                  :model-value="formatarMoedaBR(item.preco_venda)"
                  variant="outlined"
                  density="comfortable"
                  class="input-preco"
                  @update:model-value="aplicarMascaraMoeda($event, item, 'preco_venda')"
                ></v-text-field>
              </template>

              <!-- Coluna Custo Compra -->
              <template #[`item.custo_compra`]="{ item }">
                <v-text-field
                  :model-value="formatarMoedaBR(item.custo_compra)"
                  variant="outlined"
                  density="comfortable"
                  class="input-preco"
                  @update:model-value="aplicarMascaraMoeda($event, item, 'custo_compra')"
                ></v-text-field>
              </template>

              <!-- Coluna Custo Aquisição -->
              <template #[`item.custo_aquisicao`]="{ item }">
                <v-text-field
                  :model-value="formatarMoedaBR(item.custo_aquisicao)"
                  variant="outlined"
                  density="comfortable"
                  class="input-preco"
                  @update:model-value="aplicarMascaraMoeda($event, item, 'custo_aquisicao')"
                ></v-text-field>
              </template>
            </v-data-table>
          </div>

          <!-- Resumo de Seleção -->
          <v-expand-transition>
            <v-card v-if="produtosSelecionados.length > 0" class="background-card mt-6 mb-6" elevation="1">
              <v-card-title class="text-subtitle2 pa-4 d-flex align-center gap-2" style="border-bottom: 1px solid rgba(0,0,0,0.12)">
                <v-icon icon="mdi-clipboard-list" size="20" style="color: var(--text-color-laranja)"></v-icon>
                Resumo de Seleção
              </v-card-title>
              <v-card-text class="pa-4">
                <v-row>
                  <v-col cols="12" sm="3">
                    <div class="text-center pa-3 rounded" style="background: rgba(245, 124, 0, 0.1)">
                      <div class="text-h6 font-weight-bold" style="color: var(--text-color-laranja)">
                        {{ produtosSelecionados.length }}
                      </div>
                      <div class="text-caption">Produtos Selecionados</div>
                    </div>
                  </v-col>
                  <v-col cols="12" sm="3">
                    <div class="text-center pa-3 rounded" style="background: rgba(76, 175, 80, 0.1)">
                      <div class="text-h6 font-weight-bold" style="color: #4CAF50">
                        R$ {{ totalPrecoVenda.toFixed(2) }}
                      </div>
                      <div class="text-caption">Total Preço Venda</div>
                    </div>
                  </v-col>
                  <v-col cols="12" sm="3">
                    <div class="text-center pa-3 rounded" style="background: rgba(33, 150, 243, 0.1)">
                      <div class="text-h6 font-weight-bold" style="color: #2196F3">
                        R$ {{ totalCustoCompra.toFixed(2) }}
                      </div>
                      <div class="text-caption">Total Custo Compra</div>
                    </div>
                  </v-col>
                  <v-col cols="12" sm="3">
                    <div class="text-center pa-3 rounded" style="background: rgba(255, 193, 7, 0.1)">
                      <div class="text-h6 font-weight-bold" style="color: #FFC107">
                        R$ {{ totalCustoAquisicao.toFixed(2) }}
                      </div>
                      <div class="text-caption">Total Custo Aquisição</div>
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-expand-transition>

          <!-- Paginação -->
          <v-row class="mt-6 mb-6">
            <v-col cols="12" class="d-flex justify-space-between align-center gap-2">
              <div></div>
              <div class="d-flex gap-2 align-center">
                <v-btn
                  color="grey"
                  variant="outlined"
                  size="small"
                  :disabled="paginaAtual === 0 || loadingBusca"
                  @click="paginaAtual--"
                  prepend-icon="mdi-chevron-left"
                >
                  Anterior
                </v-btn>
                <v-btn
                  color="var(--text-color-laranja)"
                  variant="flat"
                  class="text-white font-weight-bold"
                  size="small"
                  :disabled="paginaAtual >= totalPaginas - 1 || loadingBusca"
                  @click="carregarProxima"
                  append-icon="mdi-chevron-right"
                >
                  Próxima
                </v-btn>
              </div>
            </v-col>
          </v-row>

          <!-- Botões de Ação -->
          <v-divider class="my-4"></v-divider>
          <v-row class="mt-4">
            <v-col cols="12" class="d-flex gap-3 justify-end">
              <v-btn
                color="grey"
                variant="outlined"
                @click="fecharModal"
                prepend-icon="mdi-close"
              >
                Cancelar
              </v-btn>
              <v-btn
                color="orange"
                variant="outlined"
                @click="limparSelecaoModal"
                :disabled="produtosSelecionados.length === 0"
                prepend-icon="mdi-refresh"
              >
                Limpar Seleção
              </v-btn>
              <v-btn
                color="var(--text-color-laranja)"
                variant="flat"
                class="text-white font-weight-bold"
                :loading="loadingImportacao"
                :disabled="produtosSelecionados.length === 0"
                @click="importarProdutos"
                prepend-icon="mdi-cloud-upload"
                size="large"
              >
                Importar ({{ produtosSelecionados.length }})
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Resultado da Importação -->
    <v-dialog v-model="resultadoVisivel" max-width="600px">
      <v-card class="background-card" elevation="2">
        <v-card-title class="text-h6 pa-4 d-flex align-center" style="border-bottom: 2px solid var(--text-color-laranja)">
          <v-icon
            :icon="resultadoImportacao.sucesso ? 'mdi-check-circle' : 'mdi-alert-circle'"
            :color="resultadoImportacao.sucesso ? '#4CAF50' : '#F44336'"
            class="mr-3"
            size="28"
          ></v-icon>
          <span class="font-weight-bold">Resultado da Importação</span>
        </v-card-title>
        <v-card-text class="pa-6">
          <v-row class="mb-4">
            <v-col cols="12" sm="6">
              <div class="text-center pa-4 background-secondary rounded" style="border-left: 4px solid #4CAF50">
                <div class="text-h4 font-weight-bold" style="color: #4CAF50">
                  {{ resultadoImportacao.inseridos }}
                </div>
                <div class="text-caption mt-2">Produtos Inseridos</div>
              </div>
            </v-col>
            <v-col cols="12" sm="6">
              <div class="text-center pa-4 background-secondary rounded" style="border-left: 4px solid #F44336">
                <div class="text-h4 font-weight-bold" style="color: #F44336">
                  {{ resultadoImportacao.erros }}
                </div>
                <div class="text-caption mt-2">Erros</div>
              </div>
            </v-col>
          </v-row>

          <!-- Mensagens de Erro -->
          <v-row v-if="resultadoImportacao.mensagensErro.length > 0" class="mt-6">
            <v-col cols="12">
              <v-expansion-panels>
                <v-expansion-panel>
                  <template v-slot:title>
                    <v-icon icon="mdi-alert" class="mr-2" color="#F44336"></v-icon>
                    <span class="font-weight-bold">Ver Erros ({{ resultadoImportacao.mensagensErro.length }})</span>
                  </template>
                  <v-list>
                    <v-list-item
                      v-for="(erro, index) in resultadoImportacao.mensagensErro"
                      :key="index"
                    >
                      <template v-slot:prepend>
                        <v-icon icon="mdi-close-circle" color="#F44336"></v-icon>
                      </template>
                      <v-list-item-title class="text-caption">
                        <strong>{{ erro.produto }}:</strong> {{ erro.mensagem }}
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="pa-4" style="border-top: 1px solid rgba(0, 0, 0, 0.12)">
          <v-spacer></v-spacer>
          <v-btn
            color="var(--text-color-laranja)"
            variant="flat"
            class="text-white font-weight-bold"
            @click="fecharResultado"
          >
            Fechar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo de Produtos Temporários -->
    <!-- REMOVIDO - Tabela agora exibida na tela principal -->

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useThemeStore } from '@/stores/config-temas/theme'
import apiPhp from '@/services/apiPhp'
import api from '@/services/api' // @blocked: mantido para /medida (sem endpoint PHP)
import apiLocal from '@/services/apiLocal'
import { toast } from 'vue3-toastify'

const themeStore = useThemeStore()
const gtinInput = ref(null)
const loadingBusca = ref(false)
const loadingImportacao = ref(false)
const modalAberto = ref(false)
const resultadoVisivel = ref(false)
const produtos = ref([])
const paginaAtual = ref(0)
const itemsPorPagina = 50
const totalProdutos = ref(0)
const offsetAtual = ref(0)

const resultadoImportacao = ref({
  sucesso: true,
  inseridos: 0,
  erros: 0,
  mensagensErro: []
})

const produtosTempEncontrados = ref([])

// Dados das APIs para selects
const grupos = ref([])
const subgrupos = ref([])
const marcas = ref([])
const medidas = ref([])
const localizacoes = ref([])
const classes = ref([])

// Estados de carregamento dos selects
const loadingSelects = ref(false)

const filtros = reactive({
  gtin: ''
})

// Formatar data para exibição
const formatarData = (data) => {
  if (!data) return '-'
  try {
    const d = typeof data === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(data)
      ? new Date(data + 'T00:00:00')
      : new Date(data)
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return data
  }
}

// Confirmar exclusão de processo
const confirmarExclusaoProcesso = (id) => {
  if (confirm(`Descartar processo ${id}? Os dados não salvos serão perdidos.`)) {
    descartarProdutosTemp()
  }
}


const headers = [
  { title: '', key: 'selecionar', sortable: false, width: '60px' },
  { title: 'Código', key: 'codbar', sortable: true, width: '120px' },
  { title: 'Produto', key: 'produto', sortable: true, width: '200px' },
  { title: 'Grupo', key: 'grupo', sortable: false, width: '180px' },
  { title: 'Subgrupo', key: 'subgrupo', sortable: false, width: '180px' },
  { title: 'Marca', key: 'marca', sortable: false, width: '160px' },
  { title: 'Medida', key: 'medida', sortable: false, width: '150px' },
  { title: 'Localização', key: 'localizacao', sortable: false, width: '180px' },
  { title: 'Classe', key: 'classe', sortable: false, width: '160px' },
  { title: 'NCM', key: 'ncm', sortable: true, width: '140px' },
  { title: 'CEST', key: 'cest_codigo', sortable: true, width: '140px' },
  { title: 'Peso', key: 'peso', sortable: false, width: '120px' },
  { title: 'Incidência Fiscal', key: 'incidencia_fiscal', sortable: false, width: '190px' },
  { title: 'Preço Venda', key: 'preco_venda', sortable: false, width: '170px' },
  { title: 'Custo Compra', key: 'custo_compra', sortable: false, width: '170px' },
  { title: 'Custo Aquisição', key: 'custo_aquisicao', sortable: false, width: '170px' }
]

// Opções fixas de Incidência Fiscal
const opcoesIncidenciaFiscal = [
  { value: '00', text: '00 - Nenhuma' },
  { value: '01', text: '01 - Monofásico' },
  { value: '02', text: '02 - Subst. Tributário' },
  { value: '03', text: '03 - Alíquota 0' },
  { value: '04', text: '04 - Suspensão' }
]

const produtosPaginados = computed(() => {
  const inicio = paginaAtual.value * itemsPorPagina
  const fim = inicio + itemsPorPagina
  return produtos.value.slice(inicio, fim)
})

const totalPaginas = computed(() => {
  return Math.ceil(produtos.value.length / itemsPorPagina)
})

const inicioExibicao = computed(() => {
  return paginaAtual.value * itemsPorPagina + 1
})

const fimExibicao = computed(() => {
  return Math.min((paginaAtual.value + 1) * itemsPorPagina, produtos.value.length)
})

const produtosSelecionados = computed(() => {
  return produtos.value.filter(p => p.selecionado)
})

const totalPrecoVenda = computed(() => {
  return produtosSelecionados.value.reduce((acc, p) => acc + (parseFloat(p.preco_venda) || 0), 0)
})

const totalCustoCompra = computed(() => {
  return produtosSelecionados.value.reduce((acc, p) => acc + (parseFloat(p.custo_compra) || 0), 0)
})

const totalCustoAquisicao = computed(() => {
  return produtosSelecionados.value.reduce((acc, p) => acc + (parseFloat(p.custo_aquisicao) || 0), 0)
})

// Formatar valor numérico para moeda brasileira
const formatarMoedaBR = (valor) => {
  if (!valor && valor !== 0) return ''
  const num = parseFloat(valor)
  if (isNaN(num)) return ''
  return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// Aplicar máscara de moeda brasileira e atualizar o valor
const aplicarMascaraMoeda = (texto, item, campo) => {
  // Remove tudo que não é número
  let apenasNumeros = texto.replace(/\D/g, '')

  if (apenasNumeros === '') {
    item[campo] = 0
    return
  }

  // Converte para número (dividindo por 100 porque são centavos)
  const valor = parseInt(apenasNumeros) / 100
  item[campo] = parseFloat(valor.toFixed(2))
}


const atualizarSelecionados = () => {
  // Método para atualizar sempre que houver mudança na seleção
  // Apenas para reatualizar os totais
}

// Carregar dados das APIs para os selects
const carregarDadosSelects = async () => {
  loadingSelects.value = true
  try {
    const token = localStorage.getItem('token')

    // Carregar Grupos
    const resGrupos = await apiPhp.get('/estoque/grupos')
    grupos.value = Array.isArray(resGrupos.data) ? resGrupos.data : []

    // Carregar Marcas
    const resMarcas = await apiPhp.get('/estoque/marcas')
    marcas.value = Array.isArray(resMarcas.data) ? resMarcas.data : []

    // Carregar Medidas — @blocked: sem endpoint PHP
    const resMedidas = await api.get('/medida', {
      headers: { Authorization: `Bearer ${token}` }
    })
    medidas.value = resMedidas.data.data || []

    // Carregar Localizações
    const resLocalizacoes = await apiPhp.get('/estoque/localizacoes')
    localizacoes.value = Array.isArray(resLocalizacoes.data) ? resLocalizacoes.data : []

    // Carregar Classes
    const resClasses = await apiPhp.get('/estoque/classes')
    classes.value = Array.isArray(resClasses.data) ? resClasses.data : []
  } catch (error) {
    toast.error('Erro ao carregar opções de filtro')
  } finally {
    loadingSelects.value = false
  }
}

// Carregar subgrupos quando grupo é selecionado
const carregarSubgrupos = async (idGrupo) => {
  if (!idGrupo) {
    subgrupos.value = []
    return
  }
  try {
    const response = await apiPhp.get(`/estoque/subgrupos/${idGrupo}`)
    subgrupos.value = Array.isArray(response.data) ? response.data : []
  } catch (error) {
    subgrupos.value = []
  }
}

const buscarPorGtin = async () => {
  if (!filtros.gtin || filtros.gtin.trim() === '') {
    toast.warning('Escaneie um código de barras válido')
    return
  }

  loadingBusca.value = true
  paginaAtual.value = 0
  offsetAtual.value = 0
  try {
    const token = localStorage.getItem('token')
    const params = {
      gtin: filtros.gtin.trim()
    }

    const response = await apiLocal.get('/produtoref', {
      params,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      produtos.value = response.data.data.map((p, index) => ({
        ...p,
        _id_row: `${index}-${Date.now()}`, // ID único para cada linha
        selecionado: true, // Já marca como selecionado para facilitar
        preco_venda: 0,
        custo_compra: 0,
        custo_aquisicao: 0,
        id_grupo: p.id_grupo || null,
        id_subgrupo: p.id_subgrupo || null,
        id_marca: p.id_marca || null,
        id_medida: p.id_medida || null,
        id_localizacao: p.id_localizacao || null,
        id_classe: p.id_classe || null,
        incidencia_fiscal: p.incidencia_fiscal || '00'
      }))
      totalProdutos.value = response.data.records || produtos.value.length
      modalAberto.value = true
      await carregarDadosSelects()
      toast.success(`${response.data.data.length} produto(s) encontrado(s)`)

      // Limpar o campo de GTIN após a busca bem-sucedida
      filtros.gtin = ''
    } else {
      produtos.value = []
      totalProdutos.value = 0
      toast.warning('Nenhum produto encontrado com este código de barras')
      // Limpar campo de GTIN para nova entrada
      filtros.gtin = ''
    }
  } catch (error) {
    toast.error('Erro ao buscar produto. Tente novamente.')
    produtos.value = []
    totalProdutos.value = 0
  } finally {
    loadingBusca.value = false
  }
}


const carregarProxima = async () => {
  if (paginaAtual.value < totalPaginas.value - 1) {
    paginaAtual.value++
    offsetAtual.value = paginaAtual.value * itemsPorPagina

    // Se chegou perto do final, buscar mais dados da API
    if (paginaAtual.value >= Math.ceil(produtos.value.length / itemsPorPagina) - 1) {
      await carregarMaisProdutos()
    }
  }
}

const carregarMaisProdutos = async () => {
  try {
    const token = localStorage.getItem('token')
    const params = {
      limit: 50,
      offset: offsetAtual.value + itemsPorPagina
    }

    if (filtros.gtin) params.gtin = filtros.gtin

    const response = await apiLocal.get('/produtoref', {
      params,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      const novosProdutos = response.data.data.map((p, index) => ({
        ...p,
        _id_row: `${produtos.value.length + index}-${Date.now()}`, // ID único para cada linha
        selecionado: false,
        preco_venda: 0,
        custo_compra: 0,
        custo_aquisicao: 0,
        id_grupo: p.id_grupo || null,
        id_subgrupo: p.id_subgrupo || null,
        id_marca: p.id_marca || null,
        id_medida: p.id_medida || null,
        id_localizacao: p.id_localizacao || null,
        id_classe: p.id_classe || null,
        incidencia_fiscal: p.incidencia_fiscal || '00'
      }))
      produtos.value = [...produtos.value, ...novosProdutos]
      totalProdutos.value = response.data.records || totalProdutos.value
    }
  } catch (error) {
    toast.error('Erro ao carregar mais produtos')
  }
}

const limparFiltros = () => {
  filtros.gtin = ''
  produtos.value = []
  totalProdutos.value = 0
  modalAberto.value = false
}

const fecharModal = () => {
  modalAberto.value = false
}

const limparSelecaoModal = () => {
  produtos.value.forEach(p => {
    p.selecionado = false
  })
}

const importarProdutos = async () => {
  if (produtosSelecionados.value.length === 0) {
    toast.warning('Selecione ao menos um produto para importar')
    return
  }

  loadingImportacao.value = true
  try {
    const token = localStorage.getItem('token')

    // Preparar dados para enviar
    const produtosParaImportar = produtosSelecionados.value.map(p => ({
      codbar: p.codbar,
      sku: p.sku || '',
      descproduto: p.produto,
      id_grupo: p.id_grupo || null,
      id_subgrupo: p.id_subgrupo || null,
      id_marca: p.id_marca || null,
      id_medida: p.id_medida || null,
      id_localizacao: p.id_localizacao || null,
      id_classe: p.id_classe || null,
      ncm: p.ncm,
      cest: p.cest_codigo,
      categoria: p.categoria,
      peso: p.peso || 0,
      incidencia_fiscal: p.incidencia_fiscal || '00',
      preco_venda: parseFloat(p.preco_venda) || 0,
      custo_compra: parseFloat(p.custo_compra) || 0,
      custo_aquisicao: parseFloat(p.custo_aquisicao) || 0
    }))

    let resposta

    // Verificar se é uma continuação (tem _idImportacao)
    const idImportacao = produtos.value.length > 0 ? produtos.value[0]._idImportacao : null

    if (idImportacao) {
      // PUT para continuação
      resposta = await apiLocal.put(`/produtoreftemp/${idImportacao}`,
        produtosParaImportar,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
    } else {
      // POST para novo
      resposta = await apiLocal.post('/produtoreftemp',
        produtosParaImportar,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
    }

    const resultado = {
      sucesso: true,
      inseridos: resposta.data.inseridos || produtosSelecionados.value.length,
      erros: resposta.data.erros || 0,
      mensagensErro: resposta.data.mensagensErro || []
    }

    resultadoImportacao.value = resultado
    resultadoVisivel.value = true
    toast.success(`${resultado.inseridos} produtos importados com sucesso`)
    modalAberto.value = false
  } catch (error) {
    resultadoImportacao.value = {
      sucesso: false,
      inseridos: 0,
      erros: produtosSelecionados.value.length,
      mensagensErro: [{
        produto: 'Geral',
        mensagem: error.response?.data?.mensagem || error.message || 'Erro ao conectar com servidor'
      }]
    }
    resultadoVisivel.value = true
    toast.error(`Erro ao importar produtos: ${error.response?.data?.mensagem || error.message || 'Erro desconhecido'}`)
  } finally {
    loadingImportacao.value = false
  }
}

const fecharResultado = () => {
  resultadoVisivel.value = false
  // Limpar dados após importação
  produtos.value = []
  produtosTempEncontrados.value = []
  limparFiltros()
}

// Verificar produtos temporários ao montar o componente
onMounted(() => {
  verificarProdutosTemporarios()
})

const verificarProdutosTemporarios = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await apiLocal.get('/produtoreftempid', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (response.data && response.data.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
      produtosTempEncontrados.value = response.data.data
      // Apenas armazena os dados, sem abrir diálogo
    }
  } catch (error) {
    // Silencioso - não mostrar erro se não houver produtos temporários
  }
}

const continuarImportacao = async (idEspecifico) => {
  if (produtosTempEncontrados.value.length === 0) {
    toast.warning('Nenhum produto temporário encontrado')
    return
  }

  // Usar o ID específico passado como parâmetro, ou o primeiro se não houver
  const primeiroID = idEspecifico || produtosTempEncontrados.value[0].id

  try {
    const token = localStorage.getItem('token')

    // GET para buscar os produtos temporários
    const response = await apiLocal.get(`/produtoreftemp/${primeiroID}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      // Armazenar o ID para usar no PUT depois
      const idImportacao = primeiroID

      // Carregar os produtos no modal
      produtos.value = response.data.data.map((p, index) => ({
        ...p,
        _id_row: `${index}-${Date.now()}`, // ID único para cada linha
        selecionado: true, // Já vêm selecionados
        preco_venda: parseFloat(p.preco_venda) || 0,
        custo_compra: parseFloat(p.custo_compra) || 0,
        custo_aquisicao: parseFloat(p.custo_aquisicao) || 0,
        incidencia_fiscal: p.incidencia_fiscal || '00',
        _idImportacao: idImportacao // Armazenar o ID da importação
      }))

      totalProdutos.value = response.data.records || produtos.value.length
      paginaAtual.value = 0

      // Abrir modal
      modalAberto.value = true

      toast.success(`${produtos.value.length} produto(s) carregado(s) para continuar a importação`)
    } else {
      toast.error('Nenhum produto encontrado para esta importação')
    }
  } catch (error) {
    toast.error('Erro ao carregar produtos temporários: ' + (error.response?.data?.mensagem || error.message))
  }
}

const descartarProdutosTemp = async () => {
  try {
    const token = localStorage.getItem('token')
    // Chamar API para limpar os produtos temporários
    await apiLocal.delete('/produtoreftemp', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    produtosTempEncontrados.value = []
    toast.success('Produtos temporários descartados. Você pode iniciar uma nova importação.')
  } catch (error) {
    toast.warning('Não foi possível descartar os produtos temporários, mas você pode continuar com uma nova importação.')
  }
}
</script>

<style scoped>
/* stylelint-disable-next-line */
/* ======================== HEADER DO MODAL ======================== */
:deep(.v-dialog__content .v-card__title) {
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.02) 0%, rgba(0, 0, 0, 0.04) 100%);
}

/* ======================== TABELA COM TEMA ======================== */
:deep(.theme-table) {
  background-color: transparent !important;
}

:deep(.theme-table .v-data-table__thead tr) {
  background: linear-gradient(90deg, var(--text-color-laranja) 0%, rgba(245, 124, 0, 0.9) 100%) !important;
  border-bottom: 2px solid var(--text-color-laranja) !important;
}

:deep(.theme-table .v-data-table__thead tr th) {
  color: white !important;
  font-weight: 700 !important;
  font-size: 0.875rem !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 14px 10px !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

:deep(.theme-table .v-data-table__tbody tr) {
  background-color: transparent !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  height: auto !important;
}

:deep(.theme-table .v-data-table__tbody tr:hover) {
  background: linear-gradient(90deg, var(--text-color-laranja) 0%, rgba(245, 124, 0, 0.8) 100%) !important;
  opacity: 0.15 !important;
  box-shadow: 0 2px 8px rgba(245, 124, 0, 0.1) !important;
}

:deep(.theme-table .v-data-table__tbody td) {
  padding: 16px 10px !important;
  font-size: 0.875rem !important;
  vertical-align: middle !important;
  height: auto !important;
}

:deep(.theme-table .v-checkbox) {
  height: auto;
  min-height: 28px;
  margin: 0 !important;
}

:deep(.theme-table .v-checkbox .v-checkbox__input) {
  color: var(--text-color-laranja) !important;
  transition: all 0.2s ease !important;
}

/* ======================== SELECTS NA TABELA ======================== */
:deep(.theme-table .v-select) {
  min-height: 48px !important;
  min-width: 140px !important;
  font-size: 0.9rem !important;
}

:deep(.theme-table .v-select .v-field) {
  min-height: 48px !important;
  min-width: 140px !important;
  padding: 8px 12px !important;
}

:deep(.theme-table .v-select .v-field__input) {
  padding: 6px 4px !important;
  font-size: 0.9rem !important;
  min-height: 36px !important;
  min-width: 120px !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}

:deep(.theme-table .v-select .v-field__control) {
  min-height: 48px !important;
  min-width: 140px !important;
}

:deep(.theme-table .v-select .v-select__selection-text) {
  font-size: 0.9rem !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}

/* ======================== TEXT-FIELDS NA TABELA ======================== */
:deep(.theme-table .v-text-field) {
  min-height: 48px !important;
}

:deep(.theme-table .v-text-field .v-field) {
  min-height: 48px !important;
  padding: 8px 12px !important;
}

:deep(.theme-table .v-text-field .v-field__input) {
  padding: 6px 4px !important;
  font-size: 0.9rem !important;
  min-height: 36px !important;
}

:deep(.theme-table .v-text-field .v-field__control) {
  min-height: 48px !important;
}

/* ======================== MENU DOS SELECTS ======================== */
:deep(.v-select__menu-item) {
  font-size: 0.9rem !important;
  padding: 10px 16px !important;
}

:deep(.v-list-item) {
  min-height: 40px !important;
  font-size: 0.9rem !important;
}

/* ======================== DROPDOWN DO SELECT ======================== */
:deep(.v-overlay__content .v-select__content) {
  max-height: 400px !important;
}

:deep(.v-overlay__content .v-list) {
  padding: 8px 0 !important;
}

:deep(.v-overlay__content .v-list-item) {
  min-height: 44px !important;
  padding: 10px 16px !important;
  font-size: 0.95rem !important;
}

:deep(.v-overlay__content .v-list-item--active) {
  background: rgba(245, 124, 0, 0.1) !important;
  color: var(--text-color-laranja) !important;
}

:deep(.v-overlay__content .v-list-item:hover) {
  background: rgba(245, 124, 0, 0.05) !important;
}

:deep(.theme-table .v-checkbox__input input:checked ~ .v-icon) {
  color: var(--text-color-laranja) !important;
}

/* ======================== INPUTS DE PREÇO ======================== */
:deep(.input-preco .v-field) {
  background-color: #FFFFFF !important;
  border: 2px solid #F57C00 !important;
  border-radius: 4px !important;
}

:deep(.input-preco .v-field--focused) {
  background-color: #FFFFFF !important;
  border: 2px solid #E65100 !important;
  box-shadow: 0 0 0 3px rgba(245, 124, 0, 0.2) !important;
}

:deep(.input-preco input) {
  text-align: center;
  font-weight: 700;
  font-size: 0.95rem !important;
  color: #D32F2F !important;
}

:deep(.v-theme--dark .input-preco .v-field) {
  background-color: #2C2C2C !important;
  border: 2px solid #FFB74D !important;
}

:deep(.v-theme--dark .input-preco .v-field--focused) {
  background-color: #3A3A3A !important;
  border: 2px solid #FF8A3D !important;
  box-shadow: 0 0 0 3px rgba(255, 183, 77, 0.2) !important;
}

:deep(.v-theme--dark .input-preco input) {
  color: #FFB74D !important;
}

/* ======================== WRAPPER TABELA ======================== */
.table-wrapper {
  overflow-x: auto;
  border-radius: 8px;
  margin: 16px 0;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
}

.table-wrapper:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.table-wrapper::-webkit-scrollbar {
  height: 8px;
}

.table-wrapper::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

.table-wrapper::-webkit-scrollbar-thumb {
  background: var(--text-color-laranja);
  border-radius: 4px;
  opacity: 0.5;
  transition: opacity 0.2s ease;
}

.table-wrapper::-webkit-scrollbar-thumb:hover {
  opacity: 0.8;
}

/* ======================== CHIPS E BADGES ======================== */
:deep(.v-chip--color--var\(--text-color-laranja\)) {
  background: linear-gradient(135deg, var(--text-color-laranja) 0%, rgba(245, 124, 0, 0.8) 100%) !important;
  box-shadow: 0 4px 12px rgba(245, 124, 0, 0.3) !important;
}

/* ======================== CARDS RESUMO ======================== */
:deep(.background-card) {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
}

:deep(.background-card:hover) {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1) !important;
  transform: translateY(-2px);
}

/* ======================== BOTÕES ======================== */
:deep(.v-btn) {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
  letter-spacing: 0.5px;
  font-weight: 600;
}

:deep(.v-btn--flat:hover) {
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 12px rgba(245, 124, 0, 0.3) !important;
}

/* ======================== DARK MODE ADJUSTMENTS ======================== */
:deep(.v-theme--dark .theme-table .v-data-table__tbody tr) {
  border-bottom-color: rgba(255, 255, 255, 0.12) !important;
}

:deep(.v-theme--dark .theme-table .v-data-table__tbody tr:hover) {
  background: linear-gradient(90deg, var(--text-color-laranja) 0%, rgba(245, 124, 0, 0.8) 100%) !important;
  opacity: 0.1 !important;
  box-shadow: 0 2px 8px rgba(245, 124, 0, 0.2) !important;
}


:deep(.v-theme--dark .table-wrapper) {
  border-color: rgba(255, 255, 255, 0.12);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
}

:deep(.v-theme--dark .background-card) {
  border-color: rgba(255, 255, 255, 0.12) !important;
}

/* ======================== ANIMAÇÕES ======================== */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

:deep(.v-expand-transition-enter-active) {
  animation: slideDown 0.3s ease;
}

/* ======================== RESPONSIVE ======================== */
@media (max-width: 768px) {
  :deep(.theme-table .v-data-table__thead tr th) {
    font-size: 0.75rem !important;
    padding: 10px 6px !important;
  }

  :deep(.theme-table .v-data-table__tbody td) {
    padding: 10px 6px !important;
    font-size: 0.8rem !important;
  }

  :deep(.input-preco input) {
    font-size: 0.75rem !important;
    padding: 6px 2px !important;
  }
}
</style>
