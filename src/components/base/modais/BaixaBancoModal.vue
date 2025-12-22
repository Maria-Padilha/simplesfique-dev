<template>
  <v-dialog 
    :model-value="modelValue"
    @update:model-value="$emit('update:model-value', $event)"
    max-width="800px"
    persistent
  >
    <v-card class="background-card">
      <v-card-title class="text-h6 pa-4 background-secondary">
        <v-icon icon="mdi-bank" class="mr-2"></v-icon>
        Baixa através do Banco
      </v-card-title>
      
      <v-card-text class="pa-4">
        <v-form ref="formRef" v-model="formValido">
          <!-- Conta Corrente -->
          <div class="mb-4">
            <h6 class="text-subtitle-1 mb-3">Informe o código da conta corrente:</h6>
            <v-card class="background-secondary pa-3" elevation="1">
              <v-row dense>
                <v-col cols="6" md="2">
                  <v-autocomplete
                    v-model="formData.codReduzido"
                    :items="listaContas"
                    item-title="displayLabel"
                    item-value="id"
                    label="Conta"
                    :rules="[rules.required]"
                    variant="outlined"
                    density="compact"
                    required
                    @update:model-value="selecionarConta"
                    :loading="financeiroStore.loading"
                    no-data-text="Nenhuma conta encontrada"
                  />
                </v-col>
                <v-col cols="6" md="2">
                  <v-text-field
                    v-model="formData.banco"
                    label="Banco"
                    variant="outlined"
                    density="compact"
                    readonly
                  />
                </v-col>
                <v-col cols="6" md="2">
                  <v-text-field
                    v-model="formData.agencia"
                    label="Agência"
                    variant="outlined"
                    density="compact"
                    readonly
                  />
                </v-col>
                <v-col cols="6" md="3">
                  <v-text-field
                    v-model="formData.contaCorrente"
                    label="Conta Corrente"
                    variant="outlined"
                    density="compact"
                    readonly
                  />
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field
                    v-model="formData.titular"
                    label="Titular"
                    variant="outlined"
                    density="compact"
                    readonly
                  />
                </v-col>
              </v-row>
            </v-card>
          </div>

          <!-- Cedente e Observação -->
          <v-row class="mb-4">
            <v-col cols="12" md="12">
              <v-text-field
                v-model="formData.cedente"
                label="Cedente"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="12">
              <v-textarea
                v-model="formData.observacao"
                label="Observação"
                variant="outlined"
                density="comfortable"
                rows="2"
              />
            </v-col>
          </v-row>

          <!-- Composição do valor -->
          <div class="mb-4">
            <h6 class="text-subtitle-1 mb-3">Composição do valor</h6>
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
              
              <!-- Totais -->
              <v-divider class="my-3"></v-divider>
              <v-row dense>
                <v-col cols="4">
                  <div class="d-flex justify-space-between">
                    <span>Tot. a Pagar:</span>
                    <strong style="color: var(--text-color-laranja)">
                      {{ formatarMoeda(totalAPagar) }}
                    </strong>
                  </div>
                </v-col>
                <v-col cols="4">
                  <div class="d-flex justify-space-between">
                    <span>Total Comp.:</span>
                    <span class="font-weight-medium">{{ formatarMoeda(totalComp) }}</span>
                  </div>
                </v-col>
                <v-col cols="4">
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
import { ref, reactive, computed, watch, defineProps, defineEmits, onMounted } from 'vue'
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

const themeStore = useThemeStore()
const financeiroStore = useFinanceiroStore()
const listaContas = ref([])
const listaAgencias = ref([])

// Refs
const formRef = ref(null)
const formValido = ref(false)

// Form Data
const formData = reactive({
  codReduzido: '',
  banco: '',
  agencia: '',
  contaCorrente: '',
  titular: '',
  cedente: '',
  observacao: '',
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

// Watchers
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    // Inicializar com valor total quando abrir modal
    formData.vlrNormal = props.valorTotal
    formData.vlrNormal_display = formatCurrencyBR(props.valorTotal)
  }
})

// Carregar dados ao montar
onMounted(async () => {
  try {
    const [contas, , agencias] = await Promise.all([
      financeiroStore.buscarContas(),
      financeiroStore.buscarBancos(),
      financeiroStore.buscarAgencias()
    ])
    
    listaAgencias.value = agencias || []
    
    // Mapear contas para adicionar label de exibição
    listaContas.value = (contas || []).map(c => ({
      ...c,
      displayLabel: `${c.descbanco || 'Banco'} - CC: ${c.numero_ccorrente}-${c.digito_cc} - ${c.titular}`
    }))
  } catch (error) {
    console.error('Erro ao carregar dados bancários:', error)
  }
})

const selecionarConta = (id) => {
  const conta = listaContas.value.find(c => c.id === id)
  if (conta) {
    // Banco
    formData.banco = conta.descbanco || ''
    
    // Conta Corrente
    formData.contaCorrente = `${conta.numero_ccorrente}-${conta.digito_cc}`
    
    // Titular
    formData.titular = conta.titular || ''
    
    // Agência
    // Tenta encontrar a agência pelo ID
    if (conta.id_agencia) {
      const agenciaEncontrada = listaAgencias.value.find(a => a.id === conta.id_agencia)
      if (agenciaEncontrada) {
        formData.agencia = `${agenciaEncontrada.descagencia}-${agenciaEncontrada.digito_ag}`
      } else {
        // Fallback se não encontrar objeto agência
        formData.agencia = String(conta.id_agencia)
      }
    } else {
      formData.agencia = ''
    }
  }
}

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
    tipo: 'banco',
    codReduzido: formData.codReduzido,
    banco: formData.banco,
    agencia: formData.agencia,
    contaCorrente: formData.contaCorrente,
    titular: formData.titular,
    cedente: formData.cedente,
    observacao: formData.observacao,
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