<template>
  <top-all-pages icon="mdi-package-variant-closed">
    <template #titulo>Inventário de Produtos</template>
    <template #acoes>
      <v-btn
          color="var(--text-color-laranja)"
          variant="flat"
          class="text-white"
          prepend-icon="mdi-content-save"
          @click="salvarInventario"
          :loading="salvando"
          :disabled="itensInventario.length === 0"
      >
        Salvar Inventário
      </v-btn>
    </template>
    <template #section>
      <div>
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
                    v-model="inventario.almoxarifadoId"
                    :items="almoxarifados"
                    label="Almoxarifado *"
                    variant="outlined"
                    density="comfortable"
                    prepend-inner-icon="mdi-warehouse"
                    :rules="[v => !!v || 'Selecione um almoxarifado']"
                    item-title="nome"
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
                    density="comfortable"
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
                    density="comfortable"
                    prepend-inner-icon="mdi-calendar"
                    :rules="[v => !!v || 'Informe a data']"
                ></v-text-field>
              </v-col>

              <!-- Observações -->
              <v-col cols="12">
                <v-textarea
                    v-model="inventario.observacoes"
                    label="Observações"
                    variant="outlined"
                    density="comfortable"
                    prepend-inner-icon="mdi-text"
                    rows="2"
                    placeholder="Informações adicionais sobre o inventário..."
                ></v-textarea>
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
            <!-- Modo Automático (Código de Barras) -->
            <div v-if="inventario.tipo === 'automatico'">
              <v-alert 
                  type="info" 
                  variant="tonal" 
                  class="mb-4"
                  icon="mdi-information"
              >
                <strong>Modo Automático:</strong> Use o leitor de código de barras para adicionar produtos automaticamente.
                Bipe o código ou digite manualmente e pressione Enter.
              </v-alert>

              <v-row>
                <v-col cols="12" md="8">
                  <v-text-field
                      ref="codigoBarrasInput"
                      v-model="itemAtual.codigoBarras"
                      label="Código de Barras"
                      variant="outlined"
                      density="comfortable"
                      prepend-inner-icon="mdi-barcode"
                      placeholder="Bipe o código de barras ou digite..."
                      autofocus
                      clearable
                      @keyup.enter="processarCodigoBarras"
                      :loading="buscandoProduto"
                  >
                    <template #append-inner>
                      <v-btn
                          icon="mdi-magnify"
                          size="small"
                          variant="text"
                          @click="processarCodigoBarras"
                          :loading="buscandoProduto"
                      ></v-btn>
                    </template>
                  </v-text-field>
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                      v-model.number="itemAtual.quantidade"
                      label="Quantidade"
                      type="number"
                      variant="outlined"
                      density="comfortable"
                      prepend-inner-icon="mdi-counter"
                      :min="0"
                      step="0.01"
                  ></v-text-field>
                </v-col>
              </v-row>

              <!-- Info do Produto Encontrado -->
              <v-expand-transition>
                <v-card 
                    v-if="produtoEncontrado" 
                    class="background-card mb-4" 
                    elevation="1"
                >
                  <v-card-text class="pa-3">
                    <v-row dense align="center">
                      <v-col cols="auto">
                        <v-avatar color="var(--text-color-laranja)" size="40">
                          <v-icon icon="mdi-package-variant" color="white"></v-icon>
                        </v-avatar>
                      </v-col>
                      <v-col>
                        <div class="text-subtitle-1 font-weight-bold">{{ produtoEncontrado.nome }}</div>
                        <div class="text-caption text-grey">
                          Código: {{ produtoEncontrado.codigo }} | 
                          Estoque Atual: {{ produtoEncontrado.estoque || 0 }} {{ produtoEncontrado.unidade }}
                        </div>
                      </v-col>
                      <v-col cols="auto">
                        <v-btn
                            color="var(--text-color-laranja)"
                            variant="flat"
                            @click="adicionarItem"
                            prepend-icon="mdi-plus"
                            class="text-white"
                        >
                          Adicionar
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-expand-transition>
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
                  <v-col cols="12" md="6">
                    <v-autocomplete
                        v-model="itemAtual.produtoId"
                        :items="produtos"
                        label="Produto *"
                        variant="outlined"
                        density="comfortable"
                        prepend-inner-icon="mdi-package-variant"
                        item-title="nome"
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
                            <span class="text-caption">Cód: {{ item.raw.codigo }} | Estoque: {{ item.raw.estoque || 0 }}</span>
                          </template>
                        </v-list-item>
                      </template>
                    </v-autocomplete>
                  </v-col>

                  <v-col cols="12" md="3">
                    <v-text-field
                        v-model.number="itemAtual.quantidade"
                        label="Quantidade *"
                        type="number"
                        variant="outlined"
                        density="comfortable"
                        prepend-inner-icon="mdi-counter"
                        :min="0"
                        step="0.01"
                        :rules="[v => v >= 0 || 'Quantidade inválida']"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="3">
                    <v-text-field
                        v-model="itemAtual.localizacao"
                        label="Localização"
                        variant="outlined"
                        density="comfortable"
                        prepend-inner-icon="mdi-map-marker"
                        placeholder="Ex: Prateleira A1"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12">
                    <v-btn
                        color="var(--text-color-laranja)"
                        variant="flat"
                        @click="adicionarItem"
                        prepend-icon="mdi-plus"
                        class="text-white"
                        :disabled="!formManualValido || !itemAtual.produtoId"
                        block
                    >
                      Adicionar ao Inventário
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
                    v-for="(item, index) in itensInventario" 
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
          </v-card-actions>
        </v-card>
      </div>
    </template>
  </top-all-pages>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useThemeStore } from '@/stores/config-temas/theme'
import { toast } from 'vue3-toastify'
import TopAllPages from '@/components/base/padrao-paginas/TopAllPages.vue'

const themeStore = useThemeStore()

// Estados
const salvando = ref(false)
const carregandoAlmoxarifados = ref(false)
const carregandoProdutos = ref(false)
const buscandoProduto = ref(false)
const formManualValido = ref(false)
const formManualRef = ref(null)
const codigoBarrasInput = ref(null)

// Dados
const inventario = reactive({
  almoxarifadoId: null,
  tipo: 'automatico',
  data: new Date().toISOString().split('T')[0],
  observacoes: ''
})

const itemAtual = reactive({
  codigoBarras: '',
  produtoId: null,
  quantidade: 1,
  localizacao: ''
})

const itensInventario = ref([])
const produtoEncontrado = ref(null)
const almoxarifados = ref([])
const produtos = ref([])

// Tipos de inventário
const tiposInventario = [
  { 
    title: 'Automático (Coletor de Dados)', 
    value: 'automatico',
    icon: 'mdi-barcode-scan',
    color: 'primary'
  },
  { 
    title: 'Manual (Seleção de Produtos)', 
    value: 'manual',
    icon: 'mdi-keyboard',
    color: 'success'
  }
]

// Métodos
const formatarNumero = (valor) => {
  return parseFloat(valor || 0).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

const getDiferencaClass = (diferenca) => {
  if (diferenca > 0) return 'diferenca-positiva'
  if (diferenca < 0) return 'diferenca-negativa'
  return ''
}

const processarCodigoBarras = async () => {
  if (!itemAtual.codigoBarras) {
    toast.warning('Informe o código de barras')
    return
  }

  buscandoProduto.value = true
  try {
    // Simular busca de produto por código de barras
    // TODO: Integrar com API real
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Mock de produto encontrado
    produtoEncontrado.value = {
      id: 1,
      codigo: itemAtual.codigoBarras,
      nome: 'Produto Exemplo',
      estoque: 10,
      unidade: 'UN',
      codigoBarras: itemAtual.codigoBarras
    }

    toast.success('Produto encontrado!')
  } catch (error) {
    toast.error('Produto não encontrado')
    produtoEncontrado.value = null
  } finally {
    buscandoProduto.value = false
  }
}

const selecionarProdutoManual = (produtoId) => {
  if (!produtoId) {
    produtoEncontrado.value = null
    return
  }

  const produto = produtos.value.find(p => p.id === produtoId)
  if (produto) {
    produtoEncontrado.value = produto
  }
}

const adicionarItem = () => {
  if (!produtoEncontrado.value) {
    toast.warning('Selecione um produto')
    return
  }

  if (itemAtual.quantidade <= 0) {
    toast.warning('Informe uma quantidade válida')
    return
  }

  // Verificar se produto já existe no inventário
  const itemExistente = itensInventario.value.find(
    item => item.produtoId === produtoEncontrado.value.id
  )

  if (itemExistente) {
    itemExistente.quantidadeContada += itemAtual.quantidade
    itemExistente.diferenca = itemExistente.quantidadeContada - itemExistente.estoqueSistema
    toast.info('Quantidade atualizada no inventário')
  } else {
    const novoItem = {
      produtoId: produtoEncontrado.value.id,
      codigo: produtoEncontrado.value.codigo,
      nome: produtoEncontrado.value.nome,
      estoqueSistema: produtoEncontrado.value.estoque || 0,
      quantidadeContada: itemAtual.quantidade,
      diferenca: itemAtual.quantidade - (produtoEncontrado.value.estoque || 0),
      unidade: produtoEncontrado.value.unidade || 'UN',
      localizacao: itemAtual.localizacao || ''
    }

    itensInventario.value.push(novoItem)
    toast.success('Item adicionado ao inventário')
  }

  // Limpar formulário
  itemAtual.codigoBarras = ''
  itemAtual.produtoId = null
  itemAtual.quantidade = 1
  itemAtual.localizacao = ''
  produtoEncontrado.value = null

  // Focar no campo correto
  nextTick(() => {
    if (inventario.tipo === 'automatico' && codigoBarrasInput.value) {
      codigoBarrasInput.value.focus()
    }
  })
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

const salvarInventario = async () => {
  if (!inventario.almoxarifadoId) {
    toast.warning('Selecione um almoxarifado')
    return
  }

  if (itensInventario.value.length === 0) {
    toast.warning('Adicione pelo menos um item ao inventário')
    return
  }

  salvando.value = true
  try {
    // TODO: Integrar com API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast.success('Inventário salvo com sucesso!')
    
    // Limpar após salvar
    itensInventario.value = []
    inventario.observacoes = ''
  } catch (error) {
    toast.error('Erro ao salvar inventário')
    console.error(error)
  } finally {
    salvando.value = false
  }
}

const imprimirInventario = () => {
  toast.info('Impressão em desenvolvimento')
}

const exportarExcel = () => {
  toast.info('Exportação para Excel em desenvolvimento')
}

// Carregar dados iniciais
const carregarAlmoxarifados = async () => {
  carregandoAlmoxarifados.value = true
  try {
    // TODO: Integrar com API
    await new Promise(resolve => setTimeout(resolve, 500))
    
    almoxarifados.value = [
      { id: 1, nome: 'Almoxarifado Central' },
      { id: 2, nome: 'Almoxarifado Filial' }
    ]
  } catch (error) {
    toast.error('Erro ao carregar almoxarifados')
  } finally {
    carregandoAlmoxarifados.value = false
  }
}

const carregarProdutos = async () => {
  carregandoProdutos.value = true
  try {
    // TODO: Integrar com API
    await new Promise(resolve => setTimeout(resolve, 500))
    
    produtos.value = [
      { id: 1, codigo: '001', nome: 'Produto A', estoque: 10, unidade: 'UN' },
      { id: 2, codigo: '002', nome: 'Produto B', estoque: 5, unidade: 'UN' },
      { id: 3, codigo: '003', nome: 'Produto C', estoque: 15, unidade: 'KG' }
    ]
  } catch (error) {
    toast.error('Erro ao carregar produtos')
  } finally {
    carregandoProdutos.value = false
  }
}

onMounted(async () => {
  await carregarAlmoxarifados()
  await carregarProdutos()
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
