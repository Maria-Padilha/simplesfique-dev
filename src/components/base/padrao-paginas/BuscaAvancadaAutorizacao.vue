<template>
  <v-expansion-panels v-model="expanded" class="busca-avancada-expansion">
    <v-expansion-panel 
      class="background-secondary"
      elevation="0"
    >
      <v-expansion-panel-title class="busca-avancada-header">
        <div class="d-flex align-center">
          <v-icon 
            :icon="expanded ? 'mdi-filter-minus' : 'mdi-filter-plus'" 
            class="mr-3"
            :color="themeStore.darkMode ? 'white' : 'grey-darken-2'"
          ></v-icon>
          <span class="text-subtitle-1 font-weight-medium">
            Busca Avançada
          </span>
          <v-chip 
            v-if="filtrosAtivos > 0 && !expanded"
            size="small" 
            color="var(--text-color-laranja)"
            class="ml-3"
          >
            {{ filtrosAtivos }} filtro{{ filtrosAtivos > 1 ? 's' : '' }} ativo{{ filtrosAtivos > 1 ? 's' : '' }}
          </v-chip>
        </div>
      </v-expansion-panel-title>
      
      <v-expansion-panel-text class="busca-avancada-content">
        <v-card flat class="background-card pa-4">
          <v-row dense>
            <!-- Filtros de Data -->
            <v-col cols="12" class="mb-2">
              <div class="text-caption text-uppercase font-weight-bold mb-2" style="color: var(--text-color-laranja)">
                Período
              </div>
            </v-col>

            <v-col cols="12" md="3">
              <v-select
                v-model="filtrosLocal.tpperiodo"
                :items="tipoPeriodoOptions"
                label="Tipo de Período *"
                variant="outlined"
                density="compact"
                hide-details="auto"
                :rules="[v => v !== null && v !== undefined || 'Campo obrigatório']"
                prepend-inner-icon="mdi-calendar-clock"
                class="custom-text-field"
              ></v-select>
            </v-col>

            <v-col cols="12" md="3">
              <v-text-field
                v-model="filtrosLocal.dtini"
                label="Data Inicial *"
                type="date"
                variant="outlined"
                density="compact"
                hide-details="auto"
                :rules="[v => !!v || 'Campo obrigatório']"
                prepend-inner-icon="mdi-calendar"
                class="custom-text-field"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="3">
              <v-text-field
                v-model="filtrosLocal.dtfim"
                label="Data Final *"
                type="date"
                variant="outlined"
                density="compact"
                hide-details="auto"
                :rules="[v => !!v || 'Campo obrigatório']"
                prepend-inner-icon="mdi-calendar"
                class="custom-text-field"
              ></v-text-field>
            </v-col>

            <v-divider class="my-3"></v-divider>

            <!-- Filtros Adicionais -->
            <v-col cols="12" class="mb-2">
              <div class="text-caption text-uppercase font-weight-bold mb-2" style="color: var(--text-color-laranja)">
                Filtros Adicionais
              </div>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="filtrosLocal.nrdocumento"
                label="Número do Documento"
                variant="outlined"
                density="compact"
                hide-details
                clearable
                prepend-inner-icon="mdi-file-document"
                class="custom-text-field"
                placeholder="Digite o número do documento"
              ></v-text-field>
            </v-col>

            <!-- Campo de Fornecedor com Busca -->
            <v-col cols="12" md="6">
              <div>
                <v-menu
                  v-model="menuFornecedor"
                  :close-on-content-click="false"
                  :nudge-width="200"
                  offset-y
                  transition="scale-transition"
                  min-width="400"
                >
                  <template v-slot:activator="{ props: menuProps }">
                    <v-text-field
                      v-model="fornecedorLabel"
                      label="Fornecedor"
                      variant="outlined"
                      density="compact"
                      hide-details
                      clearable
                      @clear="limparFornecedor"
                      prepend-inner-icon="mdi-account-box"
                      append-inner-icon="mdi-magnify"
                      class="custom-text-field"
                      placeholder="Clique para buscar fornecedor"
                      readonly
                      v-bind="menuProps"
                      @click:append-inner="menuFornecedor = !menuFornecedor"
                    ></v-text-field>
                  </template>

                  <BuscaPadraoMenu
                    v-if="menuFornecedor"
                    v-model="termoFornecedor"
                    :loading="fornecedorLoading"
                    :items="fornecedores"
                    label-field="nome_razao"
                    detail-field="apelido_fantasia"
                    id-field="id"
                    title="Buscar Fornecedor"
                    placeholder="Digite o nome do fornecedor..."
                    @item-click="selecionarFornecedor"
                    @close="menuFornecedor = false"
                  />
                </v-menu>
              </div>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="filtrosLocal.cnpj_cpf"
                label="CPF/CNPJ"
                variant="outlined"
                density="compact"
                hide-details
                clearable
                prepend-inner-icon="mdi-card-account-details"
                class="custom-text-field"
                placeholder="Digite o CPF ou CNPJ"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-autocomplete
                v-model="filtrosLocal.idtpdocumento"
                :items="tiposDocumento"
                item-title="nome"
                item-value="id"
                label="Tipo de Documento"
                variant="outlined"
                density="compact"
                hide-details
                clearable
                prepend-inner-icon="mdi-file-multiple"
                class="custom-text-field"
                placeholder="Selecione o tipo de documento"
              ></v-autocomplete>
            </v-col>

            <v-col cols="12" md="6">
              <v-autocomplete
                v-model="filtrosLocal.idlocalcobranca"
                :items="locaisCobranca"
                item-title="nome"
                item-value="id"
                label="Local de Cobrança"
                variant="outlined"
                density="compact"
                hide-details
                clearable
                prepend-inner-icon="mdi-map-marker"
                class="custom-text-field"
                placeholder="Selecione o local de cobrança"
              ></v-autocomplete>
            </v-col>

            <v-col cols="12" md="4">
              <v-text-field
                v-model="filtrosLocal.vlrmin"
                label="Valor Mínimo"
                variant="outlined"
                density="compact"
                hide-details
                clearable
                prepend-inner-icon="mdi-currency-usd"
                class="custom-text-field"
                type="number"
                step="0.01"
                prefix="R$"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="4">
              <v-text-field
                v-model="filtrosLocal.vlrmax"
                label="Valor Máximo"
                variant="outlined"
                density="compact"
                hide-details
                clearable
                prepend-inner-icon="mdi-currency-usd"
                class="custom-text-field"
                type="number"
                step="0.01"
                prefix="R$"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="4">
              <v-text-field
                v-model="filtrosLocal.solicitante"
                label="Solicitante"
                variant="outlined"
                density="compact"
                hide-details
                clearable
                prepend-inner-icon="mdi-account"
                class="custom-text-field"
                placeholder="Nome do solicitante"
              ></v-text-field>
            </v-col>

            <!-- Botões de Ação -->
            <v-col cols="12" class="d-flex justify-end gap-2 mt-4">
              <v-btn
                color="grey"
                variant="outlined"
                @click="limparFiltros"
                prepend-icon="mdi-filter-remove"
              >
                Limpar
              </v-btn>
              <v-btn
                color="var(--text-color-laranja)"
                variant="flat"
                @click="aplicarFiltros"
                prepend-icon="mdi-magnify"
                class="text-white"
                :disabled="!filtrosLocal.tpperiodo || !filtrosLocal.dtini || !filtrosLocal.dtfim"
              >
                Buscar
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup>
/* eslint-disable no-undef */
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useThemeStore } from '@/stores/config-temas/theme'
import { useFinanceiroStore } from '@/stores/APIs/financeiro'
import BuscaPadraoMenu from '@/components/base/menu/BuscaPadraoMenu.vue'

const themeStore = useThemeStore()
const financeiroStore = useFinanceiroStore()

// Props
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'aplicar'])

// Estado local
const expanded = ref(false)

const filtrosLocal = reactive({
  tpperiodo: 2, // Padrão: Data de Vencimento
  dtini: '',
  dtfim: '',
  idfornecedor: null,
  cnpj_cpf: '',
  nrdocumento: '',
  idtpdocumento: null,
  idlocalcobranca: null,
  vlrmin: null,
  vlrmax: null,
  solicitante: ''
})

// Refs para autocompletes
const fornecedorLabel = ref('')
const termoFornecedor = ref('')
const menuFornecedor = ref(false)
const fornecedorLoading = ref(false)
const fornecedores = ref([])

const tiposDocumento = ref([])
const locaisCobranca = ref([])

const idEmpresa = computed(() => localStorage.getItem('empresa'))

// Opções para os selects
const tipoPeriodoOptions = [
  { title: 'Data de Cadastro', value: 0 },
  { title: 'Data de Emissão', value: 1 },
  { title: 'Data de Vencimento', value: 2 },
  { title: 'Data de Solicitação', value: 3 }
]

// Computed para contar filtros ativos
const filtrosAtivos = computed(() => {
  let count = 0
  
  if (filtrosLocal.dtini) count++
  if (filtrosLocal.dtfim) count++
  if (filtrosLocal.idfornecedor) count++
  if (filtrosLocal.cnpj_cpf) count++
  if (filtrosLocal.nrdocumento) count++
  if (filtrosLocal.idtpdocumento) count++
  if (filtrosLocal.idlocalcobranca) count++
  if (filtrosLocal.vlrmin !== null && filtrosLocal.vlrmin !== '') count++
  if (filtrosLocal.vlrmax !== null && filtrosLocal.vlrmax !== '') count++
  if (filtrosLocal.solicitante) count++
  
  return count
})

// Métodos
const aplicarFiltros = () => {
  // Validar campos obrigatórios
  if (filtrosLocal.tpperiodo === null || filtrosLocal.tpperiodo === undefined || !filtrosLocal.dtini || !filtrosLocal.dtfim) {
    return
  }

  const filtros = { 
    ...filtrosLocal,
    baixado: 'N' // sempre fixo para autorização de pagamentos
  }
  emit('update:modelValue', filtros)
  emit('aplicar', filtros)
  // Fechar o painel após aplicar filtros
  expanded.value = false
}

const limparFiltros = () => {
  // Manter apenas os campos obrigatórios com valores padrão
  Object.assign(filtrosLocal, {
    tpperiodo: 2,
    dtini: '',
    dtfim: '',
    idfornecedor: null,
    cnpj_cpf: '',
    nrdocumento: '',
    idtpdocumento: null,
    idlocalcobranca: null,
    vlrmin: null,
    vlrmax: null,
    solicitante: ''
  })
  
  // Limpar dados de fornecedor
  fornecedorLabel.value = ''
  termoFornecedor.value = ''
  fornecedores.value = []
  
  // Definir datas padrão (este mês)
  const hoje = new Date()
  const primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
  
  filtrosLocal.dtini = primeiroDia.toISOString().split('T')[0]
  filtrosLocal.dtfim = hoje.toISOString().split('T')[0]
  
  emit('update:modelValue', { ...filtrosLocal })
}

// Inicializar com datas padrão
onMounted(async () => {
  // Obter primeiro e último dia do mês atual
  const hoje = new Date()
  const primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
  
  // Formatar para YYYY-MM-DD
  const formatarData = (data) => {
    const ano = data.getFullYear()
    const mes = String(data.getMonth() + 1).padStart(2, '0')
    const dia = String(data.getDate()).padStart(2, '0')
    return `${ano}-${mes}-${dia}`
  }
  
  filtrosLocal.dtini = formatarData(primeiroDia)
  filtrosLocal.dtfim = formatarData(hoje)
  
  // Carregar dados auxiliares
  await carregarDadosAuxiliares()
})

// Watch para sincronizar com prop
watch(() => props.modelValue, (newValue) => {
  if (newValue && typeof newValue === 'object') {
    Object.assign(filtrosLocal, newValue)
  }
}, { deep: true, immediate: true })

// Fornecedor: pesquisar e selecionar
const pesquisarFornecedores = async () => {
  fornecedorLoading.value = true
  try {
    const termo = termoFornecedor.value
    if (!termo || termo.length < 2) {
      fornecedores.value = []
      return
    }
    
    // Garantir que idEmpresa seja passado corretamente
    const empresaId = idEmpresa.value || localStorage.getItem('empresa') || '1'
    const resultado = await financeiroStore.buscarPessoasFornecedores(termo, empresaId)
    fornecedores.value = resultado || []
  } catch (error) {
    console.error('Erro ao buscar fornecedores:', error)
    fornecedores.value = []
  } finally {
    fornecedorLoading.value = false
  }
}

const selecionarFornecedor = (item) => {
  filtrosLocal.idfornecedor = item.id
  fornecedorLabel.value = `(${item.id}) - ${item.apelido_fantasia || item.nome_razao || item.nome || ''}`
  menuFornecedor.value = false
}

const limparFornecedor = () => {
  filtrosLocal.idfornecedor = null
  fornecedorLabel.value = ''
  termoFornecedor.value = ''
  fornecedores.value = []
}

// Carregar dados auxiliares
const carregarDadosAuxiliares = async () => {
  try {
    const [tipos, locais] = await Promise.all([
      financeiroStore.buscarTiposDocumento(),
      financeiroStore.buscarLocaisCobranca()
    ])
    
    tiposDocumento.value = tipos || []
    locaisCobranca.value = locais || []
  } catch (error) {
    console.error('Erro ao carregar dados auxiliares:', error)
  }
}

// Watch para pesquisa de fornecedor
watch(() => termoFornecedor.value, async () => {
  if (menuFornecedor.value) {
    await pesquisarFornecedores()
  }
}, { debounce: 300 })
</script>

<style scoped>
.busca-avancada-expansion {
  background-color: transparent !important;
}

.busca-avancada-expansion :deep(.v-expansion-panel) {
  background-color: var(--bg-color-secondary) !important;
  color: var(--text-color) !important;
  border-radius: 8px;
  overflow: hidden;
}

.busca-avancada-header {
  background-color: var(--bg-color-secondary) !important;
  color: var(--text-color) !important;
  border-bottom: 1px solid rgba(var(--v-border-color), 0.12);
  padding: 16px 20px;
}

.busca-avancada-header :deep(.v-expansion-panel-title__icon) {
  color: var(--text-color) !important;
}

.busca-avancada-content {
  background-color: var(--bg-color-secondary) !important;
  color: var(--text-color) !important;
  padding: 0 !important;
}

.busca-avancada-content :deep(.v-expansion-panel-text__wrapper) {
  padding: 16px 20px 20px 20px !important;
}

.background-card {
  background-color: rgba(255, 152, 0, 0.04) !important;
  color: var(--text-color) !important;
  border-radius: 8px;
  border: 1px solid rgba(255, 152, 0, 0.15);
}

/* Estilo dos campos de texto */
.custom-text-field :deep(.v-field) {
  background-color: rgba(var(--v-theme-surface), 0.05);
  color: var(--text-color);
  border-radius: 6px;
}

.custom-text-field :deep(.v-field__input) {
  color: var(--text-color);
  min-height: 40px;
}

.custom-text-field :deep(.v-field__prepend-inner) {
  color: var(--text-color-laranja);
  opacity: 0.7;
}

.custom-text-field :deep(.v-label) {
  color: var(--text-color);
  opacity: 0.7;
}

.custom-text-field :deep(.v-field--focused .v-label) {
  color: var(--text-color-laranja);
}

.custom-text-field :deep(.v-field__outline) {
  color: rgba(var(--v-border-color), 0.2);
}

.custom-text-field :deep(.v-field--focused .v-field__outline) {
  color: var(--text-color-laranja);
}

/* Estilo dos checkboxes */
.filtros-checkbox-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.custom-checkbox :deep(.v-label) {
  color: var(--text-color);
  opacity: 0.9;
  font-size: 0.875rem;
}

.custom-checkbox :deep(.v-selection-control__input) {
  color: var(--text-color-laranja);
}

.custom-checkbox :deep(.v-selection-control__input:hover) {
  opacity: 0.8;
}

/* Divider */
.v-divider {
  border-color: rgba(var(--v-border-color), 0.12) !important;
  margin-top: 12px;
  margin-bottom: 12px;
}

/* Botões */
.v-btn {
  text-transform: none;
  font-weight: 500;
  letter-spacing: 0.5px;
}

/* Chip de filtros ativos */
.v-chip {
  font-size: 0.75rem;
  font-weight: 600;
  height: 24px;
}

/* Responsividade */
@media (max-width: 960px) {
  .busca-avancada-header {
    padding: 12px 16px;
  }
  
  .busca-avancada-content :deep(.v-expansion-panel-text__wrapper) {
    padding: 12px 16px 16px 16px !important;
  }
  
  .background-card {
    padding: 12px !important;
  }
}

/* Dark mode adjustments */
.dark .custom-text-field :deep(.v-field) {
  background-color: rgba(255, 255, 255, 0.03);
}

.dark .busca-avancada-header {
  border-bottom-color: rgba(255, 255, 255, 0.08);
}

/* Animation */
.busca-avancada-expansion :deep(.v-expansion-panel-text__wrapper) {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>