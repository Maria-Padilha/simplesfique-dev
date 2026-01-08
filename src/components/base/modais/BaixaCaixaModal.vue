<template>
  <v-dialog 
    :model-value="modelValue"
    @update:model-value="$emit('update:model-value', $event)"
    max-width="700px"
    persistent
  >
    <v-card class="background-card">
      <v-card-title class="text-h6 pa-4 background-secondary">
        <v-icon icon="mdi-cash-register" class="mr-2"></v-icon>
        Baixa através do Caixa
      </v-card-title>
      
      <v-card-text class="pa-4">
        <v-form ref="formRef" v-model="formValido">
          <!-- Caixa selecionado -->
          <div class="mb-4">
            <h6 class="text-subtitle-1 mb-2">Informe o caixa</h6>
            <v-card class="background-secondary pa-3" elevation="1">
              <v-row dense>
                <v-col cols="12">
                  <v-select
                    v-model="formData.codigoCaixa"
                    :items="listaCaixas"
                    item-title="descricao"
                    item-value="id"
                    label="Selecione o Caixa"
                    :rules="[rules.required]"
                    variant="outlined"
                    density="compact"
                    no-data-text="Nenhum caixa aberto encontrado"
                    required
                  >
                    <template v-slot:selection="{ item }">
                      {{ item.raw.id }} - {{ item.raw.descricao }}
                    </template>
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props" :title="item.raw.descricao" :subtitle="'Cód: ' + item.raw.id"></v-list-item>
                    </template>
                  </v-select>
                </v-col>
              </v-row>
            </v-card>
          </div>

           <!-- Documento e Tipo Pagamento/Recebimento -->
          <div class="mb-4">
            <v-row>
              <v-col cols="12" md="4">
                <v-autocomplete
                  v-model="formData.id_tipodocumento"
                  :items="tiposDocumento"
                  :loading="loadingTiposDoc"
                  item-title="desctipodocumento"
                  item-value="id"
                  label="Tipo Documento *"
                  :rules="[rules.required]"
                  variant="outlined"
                  density="compact"
                  prepend-inner-icon="mdi-file-document-outline"
                  no-data-text="Nenhum tipo disponível"
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model="formData.nrdocumento"
                  label="Número Documento"
                  variant="outlined"
                  density="compact"
                  prepend-inner-icon="mdi-numeric"
                  maxlength="20"
                  counter="20"
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-autocomplete
                v-model="formData.id_tipopagrec"
                :items="tiposPagRec"
                :loading="loadingTiposPagRec"
                item-title="desctipopagrec"
                item-value="id"
                label="Tipo Pagamento/Recebimento *"
                :rules="[rules.required]"
                variant="outlined"
                density="compact"
                prepend-inner-icon="mdi-credit-card"
                no-data-text="Nenhum tipo disponível"
                />
              </v-col>
            </v-row>
          </div> 
          
          <!-- Descrição -->
          <div class="mb-4">
            <v-textarea
              v-model="formData.descricao"
              label="Descrição"
              variant="outlined"
              density="comfortable"
              rows="3"
              placeholder="Descrição da baixa no caixa..."
            />
          </div>

         

          <!-- Valor a Pagar -->
          <div class="mb-4">
            <h6 class="text-subtitle-1 mb-3">Valor a Pagar</h6>
            <v-card class="background-secondary pa-3" elevation="1">
              <v-row dense>
                <v-col cols="6" md="3">
                  <v-text-field
                    v-model="formData.vlrNormal_display"
                    label="Vlr Normal"
                    variant="outlined"
                    density="compact"
                    prefix="R$"
                    class="campo-valor"
                    :class="{ 'campo-valor-dark': themeStore.darkMode }"
                    @update:model-value="(val) => updateCurrencyField('vlrNormal', val)"
                    @blur="() => formatCurrencyField('vlrNormal')"
                  />
                </v-col>
                <v-col cols="6" md="3">
                  <v-text-field
                    v-model="formData.juros_display"
                    label="Juros"
                    variant="outlined"
                    density="compact"
                    prefix="R$"
                    class="campo-valor"
                    :class="{ 'campo-valor-dark': themeStore.darkMode }"
                    @update:model-value="(val) => updateCurrencyField('juros', val)"
                    @blur="() => formatCurrencyField('juros')"
                  />
                </v-col>
                <v-col cols="6" md="3">
                  <v-text-field
                    v-model="formData.multa_display"
                    label="Multa"
                    variant="outlined"
                    density="compact"
                    prefix="R$"
                    class="campo-valor"
                    :class="{ 'campo-valor-dark': themeStore.darkMode }"
                    @update:model-value="(val) => updateCurrencyField('multa', val)"
                    @blur="() => formatCurrencyField('multa')"
                  />
                </v-col>
                <v-col cols="6" md="3">
                  <v-text-field
                    v-model="formData.desconto_display"
                    label="Desconto"
                    variant="outlined"
                    density="compact"
                    prefix="R$"
                    class="campo-valor"
                    :class="{ 'campo-valor-dark': themeStore.darkMode }"
                    @update:model-value="(val) => updateCurrencyField('desconto', val)"
                    @blur="() => formatCurrencyField('desconto')"
                  />
                </v-col>
              </v-row>
              
              <!-- Total a Pagar -->
              <v-divider class="my-3"></v-divider>
              <div class="d-flex justify-space-between align-center">
                <strong class="text-h6">Total a Pagar:</strong>
                <strong class="text-h6" style="color: var(--text-color-laranja)">
                  {{ formatarMoeda(totalAPagar) }}
                </strong>
              </div>
            </v-card>
          </div>

          <!-- Composição do Valor -->
          <div class="mb-4">
            <h6 class="text-subtitle-1 mb-2">Composição do valor</h6>
            <v-card class="background-secondary pa-3" elevation="1">
              <v-row dense>
                <v-col cols="6">
                  <div class="d-flex justify-space-between">
                    <span>Total Comp.:</span>
                    <span class="font-weight-medium">{{ formatarMoeda(totalComp) }}</span>
                  </div>
                </v-col>
                <v-col cols="6">
                  <div class="d-flex justify-space-between">
                    <span>Vlr Restante:</span>
                    <span class="font-weight-medium">{{ formatarMoeda(vlrRestante) }}</span>
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </div>

          <!-- Data do Pagamento -->
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.dtPagamento"
                label="Data do Pagamento"
                type="date"
                :rules="[rules.required]"
                variant="outlined"
                density="comfortable"
                required
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      
      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn 
          color="grey" 
          variant="text" 
          @click="$emit('update:model-value', false)"
          :disabled="loading"
        >
          Cancelar
        </v-btn>
        <v-btn
          color="var(--text-color-laranja)"
          :loading="loading"
          :disabled="!formValido"
          @click="confirmarBaixa"
          variant="flat"
          class="text-white"
        >
          Confirmar Baixa
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch, defineProps, defineEmits } from 'vue'
import { useCaixaStore } from '@/stores/APIs/caixa'
import { useThemeStore } from '@/stores/config-temas/theme'
import { useFinanceiroStore } from '@/stores/APIs/financeiro'

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  contasSelecionadas: {
    type: Array,
    default: () => []
  },
  idEmpresa: {
    type: Number,
    required: true
  },
  valorTotal: {
    type: Number,
    default: 0
  },
  loading: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['update:model-value', 'confirmar'])

// Stores
const caixaStore = useCaixaStore()
const themeStore = useThemeStore()
const financeiroStore = useFinanceiroStore()

// Refs
const formRef = ref(null)
const formValido = ref(false)
const listaCaixas = ref([])

const tiposDocumento = ref([])
const tiposPagRec = ref([])
const loadingTiposDoc = ref(false)
const loadingTiposPagRec = ref(false)

// Form Data
const formData = reactive({
  codigoCaixa: '',
  id_reduzido_ctb_caixa: null,
  descricaoCaixa: '',
  descricao: '',
  id_tipodocumento: null,
  nrdocumento: '',
  id_tipopagrec: null,
  vlrNormal: 0,
  vlrNormal_display: 'R$ 0,00',
  juros: 0,
  juros_display: 'R$ 0,00',
  multa: 0,
  multa_display: 'R$ 0,00',
  desconto: 0,
  desconto_display: 'R$ 0,00',
  dtPagamento: new Date().toISOString().substr(0, 10)
})

// Rules
const rules = {
  required: (value) => !!value || 'Campo obrigatório'
}

// Computed
const totalAPagar = computed(() => {
  return formData.vlrNormal + formData.juros + formData.multa - formData.desconto
})

const totalComp = computed(() => {
  return totalAPagar.value
})

const vlrRestante = computed(() => {
  return props.valorTotal - totalComp.value
})

// Buscar caixa aberto do usuário
const carregarCaixaAberto = async () => {
  try {
    const caixas = await caixaStore.buscarCaixasUsuarioAberto(props.idEmpresa)
    if (Array.isArray(caixas)) {
      listaCaixas.value = caixas.map(c => ({
        id: c.id_caixa || c.id,
        descricao: c.desccaixa || c.descricao,
        id_reduzido_ctb_caixa: c.id_reduzido_ctb_caixa || c.id_reduzido || null
      }))

      if (listaCaixas.value.length > 0 && !formData.codigoCaixa) {
        const caixa = listaCaixas.value[0]
        formData.codigoCaixa = caixa.id
        formData.descricaoCaixa = caixa.descricao
        formData.id_reduzido_ctb_caixa = caixa.id_reduzido_ctb_caixa|| null
      }
    }
  } catch (error) {
    console.error('Erro ao carregar caixas abertos do usuário:', error)
  }
}

const carregarTiposDocumento = async () => {
  loadingTiposDoc.value = true
  try {
    const dados = await financeiroStore.buscarTiposDocumento()
    tiposDocumento.value = Array.isArray(dados) ? dados : []
  } catch (error) {
    console.error('Erro ao carregar tipos de documento:', error)
    tiposDocumento.value = []
  } finally {
    loadingTiposDoc.value = false
  }
}

const carregarTiposPagRec = async () => {
  loadingTiposPagRec.value = true
  try {
    const dados = await financeiroStore.buscarTiposPagRec()
    tiposPagRec.value = Array.isArray(dados) ? dados : (financeiroStore.tiposPagRec || [])
  } catch (error) {
    console.error('Erro ao carregar tipos de pagamento/recebimento:', error)
    tiposPagRec.value = []
  } finally {
    loadingTiposPagRec.value = false
  }
}

// Watchers
watch(() => props.modelValue, async (newVal) => {
  if (newVal) {
    // Inicializar com valor total quando abrir modal
    formData.vlrNormal = props.valorTotal
    formData.vlrNormal_display = formatCurrencyBR(props.valorTotal)

    await Promise.all([
      carregarCaixaAberto(),
      carregarTiposDocumento(),
      carregarTiposPagRec()
    ])
  }
})

// Funções de formatação
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

const formatCurrencyBR = (value) => {
  const numero = Number(value) || 0
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(numero)
}

const parseCurrencyBR = (str) => {
  if (str === null || str === undefined) return 0
  if (typeof str === 'number') return str
  const s = String(str)
  const cleaned = s.replace(/R\$|\s/g, '').replace(/\./g, '').replace(/,/g, '.')
  const n = parseFloat(cleaned.replace(/[^[0-9\-.]/g, ''))
  return isNaN(n) ? 0 : n
}

// Handlers
const updateCurrencyField = (field, val) => {
  formData[field + '_display'] = val
  formData[field] = parseCurrencyBR(val)
}

const formatCurrencyField = (field) => {
  formData[field + '_display'] = formatCurrencyBR(formData[field])
}

const confirmarBaixa = () => {
  const dadosBaixa = {
    tipo: 'caixa',
    codigoCaixa: formData.codigoCaixa,
    id_reduzido_ctb_caixa: formData.id_reduzido_ctb_caixa,
    descricao: formData.descricao,
    id_tipodocumento: formData.id_tipodocumento,
    nrdocumento: formData.nrdocumento,
    id_tipopagrc: formData.id_tipopagrec,
    vlrNormal: formData.vlrNormal,
    juros: formData.juros,
    multa: formData.multa,
    desconto: formData.desconto,
    total: totalAPagar.value,
    dtPagamento: formData.dtPagamento,
    contasSelecionadas: props.contasSelecionadas
  }
  
  emit('confirmar', dadosBaixa)
}
</script>

<style scoped>
.background-secondary {
  background-color: var(--bg-color-secondary);
  color: var(--text-color);
}

.background-card {
  background-color: var(--bg-card);
  color: var(--text-color);
}

.campo-valor input {
  text-align: right;
}

.campo-valor {
  background-color: #faf2e5 !important;
}

.campo-valor-dark {
  background-color: rgba(255, 255, 255, 0.05) !important;
  color: white !important;
}
</style>