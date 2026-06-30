<template>
  <top-all-pages icon="mdi-file-chart-outline">
    <template #titulo>Configuração de DRE (Demonstrativo de Resultado)</template>
    <template #acoes>
      <v-btn
          color="var(--text-color-laranja)"
          variant="flat"
          class="text-white mr-2"
          prepend-icon="mdi-plus"
          @click="novoModelo"
      >
        Novo Modelo
      </v-btn>
      <v-btn
          color="success"
          variant="flat"
          :prepend-icon="modeloAtual.id ? 'mdi-content-save-edit' : 'mdi-content-save'"
          @click="salvarModelo"
          :loading="salvando"
          :disabled="!modeloAtual.nome"
      >
        {{ modeloAtual.id ? 'Atualizar' : 'Salvar' }}
      </v-btn>
    </template>
    <template #section>
      <div>
        <!-- Card de Configuração do Modelo -->
        <v-card class="background-secondary mb-4" elevation="0">
          <v-card-text class="pa-4">
            <v-row>
              <!-- Seletor de Modelo Existente -->
              <v-col cols="12" md="4">
                <v-select
                    v-model="modeloSelecionadoId"
                    :items="modelosDisponiveis"
                    label="Selecionar Modelo Existente"
                    variant="outlined"
                    density="comfortable"
                    prepend-inner-icon="mdi-folder-open"
                    @update:model-value="carregarModelo"
                    :loading="carregando"
                    clearable
                ></v-select>
              </v-col>

              <!-- Nome do Modelo Atual -->
              <v-col cols="12" md="8">
                <v-text-field
                    v-model="modeloAtual.nome"
                    label="Nome do Modelo"
                    variant="outlined"
                    density="comfortable"
                    prepend-inner-icon="mdi-rename-box"
                    placeholder="Ex: DRE Mensal, DRE Anual, etc."
                    :rules="[v => !!v || 'Nome do modelo é obrigatório']"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Card de Estrutura do DRE -->
        <v-card :color="themeStore.darkMode ? 'text-white' : ''" class="background-secondary">
          <v-card-title class="text-h6 pa-4 d-flex justify-space-between align-center">
            <div>
              <v-icon icon="mdi-file-tree" class="mr-2"></v-icon>
              Estrutura do Relatório
            </div>
            <v-btn
                color="var(--text-color-laranja)"
                variant="outlined"
                size="small"
                prepend-icon="mdi-plus"
                @click="dialogNovoGrupo = true"
            >
              Adicionar Grupo
            </v-btn>
          </v-card-title>

          <v-card-text class="pa-4">
            <!-- Lista de Grupos -->
            <div v-if="modeloAtual.grupos && modeloAtual.grupos.length > 0">
              <draggable
                  v-model="modeloAtual.grupos"
                  item-key="id"
                  handle=".drag-handle"
                  @end="onGrupoReordenado"
              >
                <template #item="{ element: grupo, index }">
                  <v-card
                      :class="getGrupoClass(grupo.tipo)"
                      class="mb-3"
                      elevation="2"
                  >
                    <!-- Cabeçalho do Grupo -->
                    <v-card-title class="pa-3 d-flex align-center">
                      <!-- Ícone de Drag -->
                      <v-icon class="drag-handle mr-3" style="cursor: move">
                        mdi-drag-vertical
                      </v-icon>

                      <!-- Ícone do Tipo -->
                      <v-icon :color="getGrupoIconColor(grupo.tipo)" class="mr-2">
                        {{ getGrupoIcon(grupo.tipo) }}
                      </v-icon>

                      <!-- Nome do Grupo -->
                      <span class="text-h6 flex-grow-1">{{ grupo.nome }}</span>

                      <!-- Badge do Tipo -->
                      <v-chip
                          :color="getGrupoChipColor(grupo.tipo)"
                          size="small"
                          class="mr-2"
                      >
                        {{ grupo.tipo }}
                      </v-chip>

                      <!-- Ações do Grupo -->
                      <v-btn
                          icon
                          size="small"
                          variant="text"
                          @click="editarGrupo(grupo, index)"
                      >
                        <v-icon>mdi-pencil</v-icon>
                      </v-btn>
                      <v-btn
                          icon
                          size="small"
                          variant="text"
                          color="error"
                          @click="excluirGrupo(index)"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                      <v-btn
                          v-if="grupo.tipo !== 'TOTALIZADOR'"
                          icon
                          size="small"
                          variant="text"
                          color="var(--text-color-laranja)"
                          @click="adicionarCategoria(grupo, index)"
                      >
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                    </v-card-title>

                    <!-- Descrição do Grupo -->
                    <v-card-subtitle v-if="grupo.descricao" class="px-3 pb-2">
                      {{ grupo.descricao }}
                    </v-card-subtitle>

                    <!-- Categorias do Grupo -->
                    <v-card-text v-if="grupo.categorias && grupo.categorias.length > 0" class="pa-3">
                      <draggable
                          v-model="grupo.categorias"
                          item-key="id"
                          handle=".categoria-drag-handle"
                          group="categorias"
                          @end="onCategoriaReordenada"
                      >
                        <template #item="{ element: categoria, index: catIndex }">
                          <v-card
                              class="mb-2 categoria-item"
                              :class="themeStore.darkMode ? 'bg-grey-darken-3' : 'bg-grey-lighten-4'"
                              elevation="1"
                          >
                            <v-card-text class="pa-2 d-flex align-center">
                              <!-- Ícone de Drag -->
                              <v-icon class="categoria-drag-handle mr-2" size="small" style="cursor: move">
                                mdi-drag-horizontal
                              </v-icon>

                              <!-- Nome da Categoria -->
                              <span class="flex-grow-1">{{ categoria.nome }}</span>

                              <!-- Conta Contábil -->
                              <v-chip v-if="categoria.conta" size="x-small" class="mr-2">
                                {{ categoria.conta }}
                              </v-chip>

                              <!-- Ações da Categoria -->
                              <v-btn
                                  icon
                                  size="x-small"
                                  variant="text"
                                  @click="editarCategoria(grupo, index, categoria, catIndex)"
                              >
                                <v-icon size="small">mdi-pencil</v-icon>
                              </v-btn>
                              <v-btn
                                  icon
                                  size="x-small"
                                  variant="text"
                                  color="error"
                                  @click="excluirCategoria(grupo, catIndex)"
                              >
                                <v-icon size="small">mdi-delete</v-icon>
                              </v-btn>
                            </v-card-text>
                          </v-card>
                        </template>
                      </draggable>
                    </v-card-text>

                    <!-- Mensagem quando não há categorias -->
                    <v-card-text v-else-if="grupo.tipo !== 'TOTALIZADOR'" class="pa-3 text-center text-grey">
                      <v-icon>mdi-information-outline</v-icon>
                      Nenhuma categoria adicionada. Clique no botão + para adicionar.
                    </v-card-text>

                    <!-- Fórmula do Totalizador -->
                    <v-card-text v-if="grupo.tipo === 'TOTALIZADOR'" class="pa-3">
                      <v-chip color="info" size="small">
                        <v-icon start size="small">mdi-calculator</v-icon>
                        Fórmula: {{ grupo.formula || 'Nenhuma fórmula definida' }}
                      </v-chip>
                    </v-card-text>
                  </v-card>
                </template>
              </draggable>
            </div>

            <!-- Mensagem quando não há grupos -->
            <v-card v-else class="background-card pa-8 text-center">
              <v-icon size="64" color="grey">mdi-file-tree-outline</v-icon>
              <p class="text-h6 mt-4 mb-2">Nenhum grupo configurado</p>
              <p class="text-body-2 text-grey mb-4">
                Comece adicionando grupos de Receitas, Despesas ou Totalizadores para estruturar seu DRE
              </p>
              <v-btn
                  color="var(--text-color-laranja)"
                  variant="flat"
                  class="text-white"
                  prepend-icon="mdi-plus"
                  @click="dialogNovoGrupo = true"
              >
                Adicionar Primeiro Grupo
              </v-btn>
            </v-card>
          </v-card-text>
        </v-card>

        <!-- Dialog Novo/Editar Grupo -->
        <v-dialog v-model="dialogNovoGrupo" max-width="600">
          <v-card class="text-h6 pa-4 background-secondary">
            <v-card-title class="text-h6 pa-4 background-secondary">
              <v-icon icon="mdi-folder-plus" class="mr-2"></v-icon>
              {{ grupoEditando !== null ? 'Editar Grupo' : 'Novo Grupo' }}
            </v-card-title>
            <v-card-text class="pa-4">
              <v-form ref="formGrupo" v-model="formGrupoValido">
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                        v-model="grupoForm.nome"
                        label="Nome do Grupo"
                        variant="outlined"
                        density="comfortable"
                        :rules="[v => !!v || 'Nome é obrigatório']"
                        prepend-inner-icon="mdi-format-title"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                        v-model="grupoForm.descricao"
                        label="Descrição (opcional)"
                        variant="outlined"
                        density="comfortable"
                        rows="2"
                        prepend-inner-icon="mdi-text"
                    ></v-textarea>
                  </v-col>
                  <v-col cols="12">
                    <v-select
                        v-model="grupoForm.tipo"
                        :items="tiposGrupo"
                        label="Tipo de Grupo"
                        variant="outlined"
                        density="comfortable"
                        :rules="[v => !!v || 'Tipo é obrigatório']"
                        prepend-inner-icon="mdi-shape"
                    ></v-select>
                  </v-col>
                  <v-col v-if="grupoForm.tipo === 'TOTALIZADOR'" cols="12">
                    <v-text-field
                        v-model="grupoForm.formula"
                        label="Fórmula de Cálculo"
                        variant="outlined"
                        density="comfortable"
                        placeholder="Ex: RECEITA - DESPESA"
                        hint="Use os nomes dos grupos para criar a fórmula"
                        persistent-hint
                        prepend-inner-icon="mdi-calculator"
                        readonly
                    ></v-text-field>
                    
                    <!-- Operadores matemáticos -->
                    <div class="mt-3 mb-2">
                      <v-chip-group>
                        <v-chip 
                          v-for="op in operadores" 
                          :key="op.value"
                          size="small"
                          @click="adicionarOperador(op.value)"
                          class="mx-1"
                        >
                          {{ op.label }}
                        </v-chip>
                        <v-chip 
                          size="small"
                          color="error"
                          @click="limparFormula"
                          class="mx-1"
                        >
                          <v-icon start size="small">mdi-delete</v-icon>
                          Limpar
                        </v-chip>
                      </v-chip-group>
                    </div>

                    <!-- Grupos disponíveis para arrastar -->
                    <div class="mt-4">
                      <p class="text-caption mb-2">Arraste os grupos para a fórmula:</p>
                      <div class="d-flex flex-wrap gap-2">
                        <v-chip
                          v-for="grupo in gruposDisponiveis"
                          :key="grupo.id"
                          :color="getGrupoChipColor(grupo.tipo)"
                          draggable="true"
                          @dragstart="onDragStart($event, grupo)"
                          @click="adicionarGrupoFormula(grupo.nome)"
                          class="cursor-move"
                          size="small"
                        >
                          <v-icon start size="small">{{ getGrupoIcon(grupo.tipo) }}</v-icon>
                          {{ grupo.nome }}
                        </v-chip>
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
            <v-card-actions class="pa-4">
              <v-spacer></v-spacer>
              <v-btn color="grey" variant="text" @click="fecharDialogGrupo">
                Cancelar
              </v-btn>
              <v-btn
                  color="var(--text-color-laranja)"
                  variant="flat"
                  class="text-white"
                  @click="salvarGrupo"
                  :disabled="!formGrupoValido"
              >
                Salvar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Dialog Nova/Editar Categoria -->
        <v-dialog v-model="dialogNovaCategoria" max-width="900" scrollable>
          <v-card class="text-h6 pa-4 background-secondary">
            <v-card-title class="text-h6 pa-4 background-secondary">
              <v-icon icon="mdi-tag-plus" class="mr-2"></v-icon>
              Adicionar Categorias ao DRE
            </v-card-title>
            <v-card-text class="pa-4">
              <!-- Seletor de Conta Sintética -->
              <v-autocomplete
                  v-model="contaSinteticaSelecionada"
                  :items="contasSinteticas"
                  item-title="descconta"
                  item-value="id"
                  return-object
                  label="Selecione a Conta Sintética"
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-file-tree"
                  :loading="carregandoSinteticas"
                  @update:model-value="onContaSinteticaSelecionada"
                  clearable
                  no-data-text="Nenhuma conta sintética encontrada"
              >
                <template #item="{ props, item }">
                  <v-list-item v-bind="props">
                    <template #prepend>
                      <v-icon icon="mdi-folder-outline" class="mr-2"></v-icon>
                    </template>
                    <template #title>
                      {{ item.raw.descplanoconta || item.raw.descconta }}
                    </template>
                    <template #subtitle>
                      Código: {{ item.raw.id_classificador || item.raw.codigoplanoconta }}
                    </template>
                  </v-list-item>
                </template>
              </v-autocomplete>

              <!-- Tabela de Contas Analíticas -->
              <v-expand-transition>
                <div v-if="contasAnaliticas.length > 0" class="mt-4">
                  <v-card :color="themeStore.darkMode ? 'grey-darken-3' : 'grey-lighten-4'" elevation="0">
                    <v-card-title class="text-subtitle-1 pa-3">
                      <v-icon icon="mdi-checkbox-multiple-marked" class="mr-2"></v-icon>
                      Selecione as contas para adicionar
                      <v-spacer></v-spacer>
                      <v-chip size="small" color="primary">
                        {{ contasAnaliticasSelecionadas.length }} selecionada(s)
                      </v-chip>
                    </v-card-title>
                    <v-card-text class="pa-0">
                      <v-data-table
                          v-model="contasAnaliticasSelecionadas"
                          :headers="[
                            { title: '', key: 'data-table-select', sortable: false, width: 50 },
                            { title: 'Classificador', key: 'id_classificador', sortable: true },
                            { title: 'Nome da Conta', key: 'descplanoconta', sortable: true },
                            { title: 'Tipo', key: 'tipoconta', sortable: true, width: 100 }
                          ]"
                          :items="contasAnaliticas"
                          item-value="id"
                          show-select
                          return-object
                          :loading="carregandoAnaliticas"
                          density="compact"
                          class="background-secondary elevation-0"
                      >
                        <template #[`item.descplanoconta`]="{ item }">
                          {{ item.descplanoconta || item.descconta }}
                        </template>
                        <template #[`item.id_classificador`]="{ item }">
                          <v-chip size="x-small" variant="outlined">
                            {{ item.id_classificador || item.codigoplanoconta }}
                          </v-chip>
                        </template>
                        <template #[`item.tipoconta`]="{ item }">
                          <v-chip size="x-small" :color="item.tipoconta === 'A' ? 'success' : 'info'">
                            {{ item.tipoconta }}
                          </v-chip>
                        </template>
                      </v-data-table>
                    </v-card-text>
                  </v-card>
                </div>
              </v-expand-transition>

              <!-- Mensagem de Loading -->
              <v-expand-transition>
                <div v-if="carregandoAnaliticas" class="mt-4 text-center">
                  <v-progress-circular indeterminate color="primary"></v-progress-circular>
                  <p class="text-body-2 mt-2">Carregando contas...</p>
                </div>
              </v-expand-transition>

              <!-- Mensagem quando nenhuma conta sintética foi selecionada -->
              <v-expand-transition>
                <v-alert
                    v-if="!contaSinteticaSelecionada && !carregandoSinteticas"
                    type="info"
                    variant="tonal"
                    class="mt-4"
                >
                  <v-icon start>mdi-information</v-icon>
                  Selecione uma conta sintética para visualizar as contas relacionadas
                </v-alert>
              </v-expand-transition>
            </v-card-text>
            <v-card-actions class="pa-4">
              <v-spacer></v-spacer>
              <v-btn color="grey" variant="text" @click="fecharDialogCategoria">
                Cancelar
              </v-btn>
              <v-btn
                  color="var(--text-color-laranja)"
                  variant="flat"
                  class="text-white"
                  @click="salvarCategoria"
                  :disabled="contasAnaliticasSelecionadas.length === 0"
              >
                Adicionar {{ contasAnaliticasSelecionadas.length > 0 ? `(${contasAnaliticasSelecionadas.length})` : '' }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </template>
  </top-all-pages>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useThemeStore } from '@/stores/config-temas/theme'
import { useFinanceiroStore } from '@/stores/APIs/financeiro'
import { toast } from 'vue3-toastify'
import TopAllPages from '@/components/base/padrao-paginas/TopAllPages.vue'
import draggable from 'vuedraggable'

const themeStore = useThemeStore()
const financeiroStore = useFinanceiroStore()

// Estado
const carregando = ref(false)
const salvando = ref(false)
const modeloSelecionadoId = ref(null)
const dialogNovoGrupo = ref(false)
const dialogNovaCategoria = ref(false)
const grupoEditando = ref(null)
const categoriaEditando = ref(null)
const grupoAtualIndex = ref(null)
const formGrupoValido = ref(false)
const formGrupo = ref(null)
const planoContaSelecionado = ref('')
const planoContaId = ref(null)
const contasSinteticas = ref([])
const contaSinteticaSelecionada = ref(null)
const contasAnaliticas = ref([])
const contasAnaliticasSelecionadas = ref([])
const carregandoSinteticas = ref(false)
const carregandoAnaliticas = ref(false)

// Operadores matemáticos para fórmula
const operadores = [
  { label: '+', value: ' + ' },
  { label: '-', value: ' - ' },
  { label: '×', value: ' * ' },
  { label: '÷', value: ' / ' },
  { label: '(', value: '(' },
  { label: ')', value: ')' }
]

// Modelo atual
const modeloAtual = reactive({
  id: null,
  nome: '',
  grupos: []
})

// Modelos disponíveis
const modelosDisponiveis = ref([])

// Tipos de grupo
const tiposGrupo = [
  { title: 'Receita', value: 'RECEITA' },
  { title: 'Despesa', value: 'DESPESA' },
  { title: 'Totalizador', value: 'TOTALIZADOR' }
]

// Form de grupo
const grupoForm = reactive({
  nome: '',
  descricao: '',
  tipo: 'RECEITA',
  formula: '',
  categorias: []
})

// Form de categoria
const categoriaForm = reactive({
  nome: '',
  classificador: '',
  conta: '',
  id_planoconta: null,
  descricao: ''
})

// Métodos
const getGrupoClass = (tipo) => {
  const base = 'grupo-card'
  switch (tipo) {
    case 'RECEITA':
      return `${base} grupo-receita ${themeStore.darkMode ? 'grupo-receita-dark' : 'grupo-receita-light'}`
    case 'DESPESA':
      return `${base} grupo-despesa ${themeStore.darkMode ? 'grupo-despesa-dark' : 'grupo-despesa-light'}`
    case 'TOTALIZADOR':
      return `${base} grupo-totalizador ${themeStore.darkMode ? 'grupo-totalizador-dark' : 'grupo-totalizador-light'}`
    default:
      return base
  }
}

const getGrupoIcon = (tipo) => {
  switch (tipo) {
    case 'RECEITA':
      return 'mdi-cash-plus'
    case 'DESPESA':
      return 'mdi-cash-minus'
    case 'TOTALIZADOR':
      return 'mdi-calculator'
    default:
      return 'mdi-folder'
  }
}

const getGrupoIconColor = (tipo) => {
  switch (tipo) {
    case 'RECEITA':
      return 'success'
    case 'DESPESA':
      return 'error'
    case 'TOTALIZADOR':
      return 'info'
    default:
      return 'grey'
  }
}

const getGrupoChipColor = (tipo) => {
  switch (tipo) {
    case 'RECEITA':
      return 'success'
    case 'DESPESA':
      return 'error'
    case 'TOTALIZADOR':
      return 'info'
    default:
      return 'grey'
  }
}

// Grupos disponíveis para usar na fórmula (exclui TOTALIZADOR e o grupo sendo editado)
const gruposDisponiveis = computed(() => {
  return modeloAtual.grupos.filter((grupo, index) => {
    // Não incluir o grupo atual se estiver editando
    if (grupoEditando.value !== null && index === grupoEditando.value) {
      return false
    }
    // Não incluir outros totalizadores
    return grupo.tipo !== 'TOTALIZADOR'
  })
})

// Funções para manipular fórmula
const adicionarGrupoFormula = (nomeGrupo) => {
  if (grupoForm.tipo !== 'TOTALIZADOR') return
  
  const formulaAtual = grupoForm.formula || ''
  grupoForm.formula = formulaAtual + (formulaAtual ? ' ' : '') + nomeGrupo
}

const adicionarOperador = (operador) => {
  if (grupoForm.tipo !== 'TOTALIZADOR') return
  
  grupoForm.formula = (grupoForm.formula || '') + operador
}

const limparFormula = () => {
  grupoForm.formula = ''
}

const onDragStart = (event, grupo) => {
  event.dataTransfer.effectAllowed = 'copy'
  event.dataTransfer.setData('grupo', grupo.nome)
}

const novoModelo = () => {
  modeloSelecionadoId.value = null
  modeloAtual.id = null
  modeloAtual.nome = ''
  modeloAtual.grupos = []
  toast.info('Novo modelo criado. Configure a estrutura e salve.')
}

const buscarContasSinteticas = async () => {
  carregandoSinteticas.value = true
  try {
    const response = await financeiroStore.buscarPlanosConta({ tipoconta: 'S' })
    contasSinteticas.value = response || []
    console.log('[DRE] Contas sintéticas carregadas:', contasSinteticas.value)
  } catch (error) {
    console.error('[DRE] Erro ao buscar contas sintéticas:', error)
    toast.error('Erro ao carregar contas sintéticas')
  } finally {
    carregandoSinteticas.value = false
  }
}

const onContaSinteticaSelecionada = async (conta) => {
  if (!conta) {
    contasAnaliticas.value = []
    contasAnaliticasSelecionadas.value = []
    return
  }

  carregandoAnaliticas.value = true
  try {
    const response = await financeiroStore.buscarPlanosConta({
      tipoconta: conta.tipoconta,
      idclassificador: conta.id_classificador || conta.codigoplanoconta
    })
    contasAnaliticas.value = response || []
    contasAnaliticasSelecionadas.value = []
    console.log('[DRE] Contas analíticas carregadas:', contasAnaliticas.value)
  } catch (error) {
    console.error('[DRE] Erro ao buscar contas analíticas:', error)
    toast.error('Erro ao carregar contas relacionadas')
    contasAnaliticas.value = []
  } finally {
    carregandoAnaliticas.value = false
  }
}

const carregarModelo = async (id) => {
  if (!id) {
    novoModelo()
    return
  }

  carregando.value = true
  try {
    console.log('[DRE] Carregando modelo com ID:', id)
    const modelo = await financeiroStore.buscarModeloDRE(id)
    console.log('[DRE] Modelo retornado:', modelo)
    
    if (modelo) {
      modeloAtual.id = modelo.id
      modeloAtual.nome = modelo.nome
      modeloAtual.grupos = modelo.grupos || []
      
      console.log('[DRE] Modelo carregado - ID:', modeloAtual.id, 'Nome:', modeloAtual.nome)
      toast.success('Modelo carregado com sucesso!')
    } else {
      toast.error('Modelo não encontrado')
      novoModelo()
    }
  } catch (error) {
    console.error('Erro ao carregar modelo:', error)
    toast.error('Erro ao carregar modelo')
    novoModelo()
  } finally {
    carregando.value = false
  }
}

const montarPayload = () => {
  // Estrutura do payload conforme API
  const dredetalhe = []
  const dredetalheconta = []
  let contadorConta = 1 // Contador para IDs de dredetalheconta

  // Mapear grupos para dredetalhe
  modeloAtual.grupos.forEach((grupo, index) => {
    // Converter tipo para natureza: RECEITA='+', DESPESA='-', TOTALIZADOR='='
    let natureza = ''
    switch (grupo.tipo) {
      case 'RECEITA':
        natureza = '+'
        break
      case 'DESPESA':
        natureza = '-'
        break
      case 'TOTALIZADOR':
        natureza = '='
        break
    }

    // Converter fórmula de nomes para IDs (ex: "RECEITA - DESPESA" -> "1 - 2")
    let formulaConvertida = null
    if (grupo.tipo === 'TOTALIZADOR' && grupo.formula) {
      formulaConvertida = grupo.formula
      // Substituir cada nome de grupo pelo seu ID (índice + 1)
      modeloAtual.grupos.forEach((g, i) => {
        if (g.tipo !== 'TOTALIZADOR' && formulaConvertida.includes(g.nome)) {
          // Usar regex com word boundary para substituir exatamente o nome completo
          const regex = new RegExp(g.nome.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
          formulaConvertida = formulaConvertida.replace(regex, (i + 1).toString())
        }
      })
    }

    const detalhe = {
      id: index + 1, // ID sequencial começando de 1
      descdredetalhe: grupo.nome,
      natureza: natureza,
      natureza_formula: formulaConvertida
    }

    dredetalhe.push(detalhe)

    // Mapear categorias para dredetalheconta
    if (grupo.categorias && grupo.categorias.length > 0) {
      grupo.categorias.forEach(categoria => {
        dredetalheconta.push({
          id: contadorConta++, // ID sequencial começando de 1
          id_dre_detalhe: index + 1, // Usar ID do grupo (índice + 1)
          id_reduzido_ctb: categoria.id_planoconta,
          valor: 0 // Valor padrão, será calculado ao gerar o relatório
        })
      })
    }
  })

  const payload = {
    descdre: modeloAtual.nome,
    dredetalhe: dredetalhe,
    dredetalheconta: dredetalheconta
  }

  return payload
}

const salvarModelo = async () => {
  if (!modeloAtual.nome) {
    toast.error('Informe o nome do modelo')
    return
  }

  if (!modeloAtual.grupos || modeloAtual.grupos.length === 0) {
    toast.error('Adicione pelo menos um grupo ao modelo')
    return
  }

  salvando.value = true
  try {
    // Montar payload no formato da API
    const payload = montarPayload()
    
    console.log('[DRE] Payload montado:', JSON.stringify(payload, null, 2))
    console.log('[DRE] modeloAtual.id atual:', modeloAtual.id)
    console.log('[DRE] Tipo de operação:', modeloAtual.id ? 'PUT (Atualizar)' : 'POST (Criar)')
    
    let resultado
    
    // Se tem ID, é atualização (PUT), senão é criação (POST)
    if (modeloAtual.id) {
      console.log('[DRE] Atualizando modelo existente, ID:', modeloAtual.id)
      resultado = await financeiroStore.atualizarModeloDRE(modeloAtual.id, payload)
    } else {
      console.log('[DRE] Criando novo modelo')
      resultado = await financeiroStore.salvarModeloDRE(payload)
    }
    
    if (resultado) {
      // Atualizar ID se for criação nova
      if (!modeloAtual.id && resultado.id) {
        modeloAtual.id = resultado.id
        modeloSelecionadoId.value = resultado.id
        console.log('[DRE] ID do novo modelo criado:', resultado.id)
      }
      
      // Recarregar lista de modelos
      await carregarModelosDisponiveis()
      
      toast.success('Modelo DRE salvo com sucesso!')
    }
  } catch (error) {
    console.error('Erro ao salvar modelo:', error)
    toast.error(error.response?.data?.error || 'Erro ao salvar modelo DRE')
  } finally {
    salvando.value = false
  }
}

const adicionarCategoria = async (grupo, index) => {
  grupoAtualIndex.value = index
  categoriaEditando.value = null
  categoriaForm.nome = ''
  categoriaForm.classificador = ''
  categoriaForm.conta = ''
  categoriaForm.descricao = ''
  planoContaSelecionado.value = ''
  planoContaId.value = null
  contaSinteticaSelecionada.value = null
  contasAnaliticas.value = []
  contasAnaliticasSelecionadas.value = []
  dialogNovaCategoria.value = true
  
  // Carregar contas sintéticas ao abrir o dialog
  await buscarContasSinteticas()
}

const editarGrupo = (grupo, index) => {
  grupoEditando.value = index
  grupoForm.nome = grupo.nome
  grupoForm.descricao = grupo.descricao || ''
  grupoForm.tipo = grupo.tipo
  grupoForm.formula = grupo.formula || ''
  dialogNovoGrupo.value = true
}

const editarCategoria = (grupo, grupoIndex, categoria, catIndex) => {
  grupoAtualIndex.value = grupoIndex
  categoriaEditando.value = catIndex
  categoriaForm.classificador = categoria.classificador || ''
  categoriaForm.conta = categoria.conta || ''
  categoriaForm.descricao = categoria.descricao || ''
  
  // Buscar plano de conta se existir ID
  if (categoria.id_planoconta) {
    planoContaId.value = categoria.id_planoconta
    // Nome é o descconta da categoria
    planoContaSelecionado.value = categoria.nome || ''
  } else {
    planoContaSelecionado.value = ''
    planoContaId.value = null
  }
  
  dialogNovaCategoria.value = true
}

const excluirGrupo = (index) => {
  if (confirm('Deseja realmente excluir este grupo?')) {
    modeloAtual.grupos.splice(index, 1)
    toast.success('Grupo excluído')
  }
}

const excluirCategoria = (grupo, catIndex) => {
  if (confirm('Deseja realmente excluir esta categoria?')) {
    grupo.categorias.splice(catIndex, 1)
    toast.success('Categoria excluída')
  }
}

const salvarGrupo = () => {
  if (!formGrupo.value.validate()) return

  const novoGrupo = {
    id: Date.now(),
    nome: grupoForm.nome,
    descricao: grupoForm.descricao,
    tipo: grupoForm.tipo,
    formula: grupoForm.formula,
    categorias: []
  }

  if (grupoEditando.value !== null) {
    // Editar grupo existente
    Object.assign(modeloAtual.grupos[grupoEditando.value], novoGrupo)
    toast.success('Grupo atualizado')
  } else {
    // Adicionar novo grupo
    modeloAtual.grupos.push(novoGrupo)
    toast.success('Grupo adicionado')
  }

  fecharDialogGrupo()
}

const salvarCategoria = () => {
  if (contasAnaliticasSelecionadas.value.length === 0) {
    toast.warning('Selecione pelo menos uma conta')
    return
  }

  const grupo = modeloAtual.grupos[grupoAtualIndex.value]

  if (!grupo.categorias) {
    grupo.categorias = []
  }

  // Adicionar todas as contas selecionadas como categorias
  let adicionadas = 0
  contasAnaliticasSelecionadas.value.forEach(conta => {
    const contaDisplay = `${conta.id_classificador || conta.codigoplanoconta || ''} - ${conta.descplanoconta || conta.descconta || ''}`
    
    const novaCategoria = {
      id: Date.now() + adicionadas,
      nome: conta.descplanoconta || conta.descconta || '',
      classificador: conta.id_classificador || conta.codigoplanoconta || '',
      conta: contaDisplay,
      id_planoconta: conta.id,
      descricao: ''
    }

    grupo.categorias.push(novaCategoria)
    adicionadas++
  })

  toast.success(`${adicionadas} ${adicionadas === 1 ? 'categoria adicionada' : 'categorias adicionadas'}`)
  fecharDialogCategoria()
}

const fecharDialogGrupo = () => {
  dialogNovoGrupo.value = false
  grupoEditando.value = null
  grupoForm.nome = ''
  grupoForm.descricao = ''
  grupoForm.tipo = 'RECEITA'
  grupoForm.formula = ''
}

const fecharDialogCategoria = () => {
  dialogNovaCategoria.value = false
  categoriaEditando.value = null
  grupoAtualIndex.value = null
  categoriaForm.nome = ''
  categoriaForm.classificador = ''
  categoriaForm.conta = ''
  categoriaForm.descricao = ''
  planoContaSelecionado.value = ''
  planoContaId.value = null
  contaSinteticaSelecionada.value = null
  contasAnaliticas.value = []
  contasAnaliticasSelecionadas.value = []
}

const onGrupoReordenado = () => {
  toast.info('Grupos reordenados')
}

const onCategoriaReordenada = () => {
  toast.info('Categorias reordenadas')
}

// Função para carregar modelos disponíveis
const carregarModelosDisponiveis = async () => {
  try {
    const modelos = await financeiroStore.buscarModelosDRE()
    modelosDisponiveis.value = modelos
  } catch (error) {
    console.error('Erro ao carregar modelos disponíveis:', error)
  }
}

// Lifecycle
onMounted(async () => {
  console.log('[DRE] onMounted executado')
  console.log('[DRE] Iniciando carregamento de dados...')
  
  // Carregar dados iniciais
  try {
    console.log('[DRE] Chamando buscarPlanosConta()...')
    
    await Promise.all([
      financeiroStore.buscarPlanosConta(),
      carregarModelosDisponiveis()
    ])
    
    console.log('[DRE] Dados carregados. Planos conta:', financeiroStore.planosConta)
  } catch (error) {
    console.error('[DRE] Erro ao carregar dados iniciais:', error)
    toast.error('Erro ao carregar dados iniciais')
  }
})
</script>

<style scoped>

.background-card {
  background-color: var(--background-card);
  color: var(--text-color);
}

/* Estilos dos grupos */
.grupo-card {
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
}

.grupo-receita-light {
  background-color: #f1f8f4 !important;
  border-left-color: #4caf50;
}

.grupo-receita-dark {
  background-color: rgba(76, 175, 80, 0.15) !important;
  border-left-color: #66bb6a;
  color: var(--text-color) !important;
}

.grupo-despesa-light {
  background-color: #fff3f3 !important;
  border-left-color: #f44336;
}

.grupo-despesa-dark {
  background-color: rgba(244, 67, 54, 0.15) !important;
  border-left-color: #ef5350;
  color: var(--text-color) !important;
}

.grupo-totalizador-light {
  background-color: #f3f8ff !important;
  border-left-color: #2196f3;
}

.grupo-totalizador-dark {
  background-color: rgba(33, 150, 243, 0.15) !important;
  border-left-color: #42a5f5;
  color: var(--text-color) !important;
}

.categoria-item {
  transition: all 0.2s ease;
}

.categoria-item:hover {
  transform: translateX(4px);
}


.cursor-move {
  cursor: move;
}

.gap-2 {
  gap: 0.5rem;
}
/* Melhorar contraste no modo escuro */
.background-secondary :deep(.v-card-title),
.background-secondary :deep(.v-card-subtitle),
.background-secondary :deep(.v-card-text) {
  color: var(--text-color) !important;
}

/* Ajustar cards de categorias no modo escuro */
.bg-grey-darken-3 {
  background-color: rgba(255, 255, 255, 0.05) !important;
}

.bg-grey-lighten-4 {
  background-color: #f5f5f5 !important;
}

/* Container da tabela com background apropriado */
.table-container {
  border: 1px solid rgba(var(--v-border-color), 0.12);
}

.table-container :deep(.v-card-title) {
  border-bottom: 1px solid rgba(var(--v-border-color), 0.12);
}

.drag-handle,
.categoria-drag-handle {
  opacity: 0.5;
  transition: opacity 0.2s ease;
}

.drag-handle:hover,
.categoria-drag-handle:hover {
  opacity: 1;
}
</style>
