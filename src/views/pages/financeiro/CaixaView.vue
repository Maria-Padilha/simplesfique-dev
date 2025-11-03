<template>
  <div class="pa-4">
    <v-card class="background-secondary mb-4">
      <v-card-title class="text-h5 pa-4 d-flex justify-space-between align-center">
        <div class="d-flex align-center">
          <v-icon icon="mdi-cash-register" class="mr-3"></v-icon>
          Caixa
        </div>
      </v-card-title>
    </v-card>

     <v-card :color="themeStore.darkMode ? 'text-white' : ''" class="background-secondary">
      <v-card-text class="pa-4">
        <v-btn
          color="var(--text-color-laranja)"
          @click="toggleFormulario()"
          :prepend-icon="formularioAberto ? 'mdi-minus' : 'mdi-plus'"
          variant="flat"
          class="mb-3 ml-3 text-white"
          >
          {{ formularioAberto ? 'Cancelar' : 'Nova Caixa' }}
        </v-btn>

        <!-- Formulário Expansível -->
        <v-expand-transition>
          <div v-if="formularioAberto">
            <v-card class="background-card mb-7" elevation="2">
              <v-card-title class="text-h6 pa-4">
                <v-icon :icon="savingNovo ? 'mdi-pencil' : 'mdi-plus'" class="mr-2"></v-icon>
                {{ savingNovo ? 'Novo Caixa' : 'Novo Caixa' }}
              </v-card-title>
              <v-card-text class="pa-4">
                <v-form ref="novoCaixaRef" v-model="formValido">
                  <v-row>
                    <v-col cols="12" md="4">
                      <v-text-field v-model="novoCaixa.id_saas" label="ID SaaS" variant="outlined" density="compact" />
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field v-model="novoCaixa.id" label="ID" variant="outlined" density="compact" />
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field v-model="novoCaixa.id_empresa" label="ID Empresa" variant="outlined" density="compact" />
                    </v-col>

                    <v-col cols="12" md="12">
                      <v-text-field v-model="novoCaixa.desccaixa" label="Descrição *" :rules="[rules.required]" maxlength="120" variant="outlined" density="compact" class="custom-text-field" prepend-inner-icon="mdi-text" />
                    </v-col>

                    <v-col cols="12" md="4">
                      <v-select v-model="novoCaixa.participa_fluxo" :items="['S','N']" label="Participa Fluxo" variant="outlined" density="compact" />
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-select v-model="novoCaixa.ativo" :items="['S','N']" label="Ativo" variant="outlined" density="compact" />
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
              <v-card-actions class="pa-4">
                <v-spacer></v-spacer>
                <v-btn
                  color="grey"
                  variant="text"
                  @click="cancelarFormulario"
                >
                  Cancelar
                </v-btn>
                <v-btn
                  color="var(--text-color-laranja)"
                  :loading="savingNovo"
                  :disabled="!formValido"
                  @click="salvarNovoCaixa"
                  variant="flat"
                  class="text-white"
                >
                  Salvar
                </v-btn>
              </v-card-actions>
            </v-card>
          </div>
        </v-expand-transition>

        <v-data-table
          :headers="headers"
          :items="filteredCaixas"
          :loading="loading"
          item-key="id"
          dense
          class="elevation-1 background-secondary"
        >
          <template v-slot:[`item.dhinc`]="{ item }">
            {{ item.dhinc ? formatarDataHora(item.dhinc) : '-' }}
          </template>

          <template v-slot:[`item.ativo`]="{ item }">
            <v-chip small :color="(item.ativo === 'S' || item.ativo === 's' || item.ativo === true) ? 'green' : 'grey'" text-color="white">
              {{ (item.ativo === 'S' || item.ativo === 's' || item.ativo === true) ? 'Ativo' : 'Inativo' }}
            </v-chip>
          </template>
          <template #no-data>
            
            <div class="text-center pa-4">Nenhum caixa encontrado</div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import api from '@/services/api'
import { useThemeStore } from '@/stores/config-temas/theme'
import { useFinanceiroStore } from '@/stores/APIs/financeiro'

const themeStore = useThemeStore()
const financeiroStore = useFinanceiroStore()

const caixas = ref([])
const loading = ref(false)
const error = ref(null)
const search = ref('')

const headers = [
  { title: 'ID SaaS', key: 'id_saas' },
  { title: 'ID', key: 'id' },
  { title: 'ID Empresa', key: 'id_empresa' },
  { title: 'Descrição', key: 'desccaixa' },
  { title: 'Participa Fluxo', key: 'participa_fluxo' },
  { title: 'Ativo', key: 'ativo' },
  { title: 'Cadastro', key: 'dhinc' },
  { title: 'Usuário Inc.', key: 'id_user_inc' },
  { title: 'Usuário Alt.', key: 'id_user_alt' },
  { title: 'Usuário Inativou', key: 'id_user_inativou' }
]

const formatarDataHora = (valor) => {
  try {
    return new Date(valor).toLocaleString('pt-BR')
  } catch (e) {
    return valor
  }
}

const normalizeResponse = (resp) => {
  // resp may be { data: [...] } or array or single object
  if (!resp) return []
  if (resp.data && Array.isArray(resp.data)) return resp.data
  if (Array.isArray(resp)) return resp
  if (typeof resp === 'object') return [resp]
  return []
}

const tryEndpoints = ['/caixa', '/tfin_caixa', '/tx_caixa']

const fetchCaixas = async () => {
  loading.value = true
  error.value = null
  caixas.value = []
  // Try multiple endpoints until one succeeds
  for (const ep of tryEndpoints) {
    try {
      const res = await api.get(ep, { headers: financeiroStore.getAuthHeaders() })
      caixas.value = normalizeResponse(res.data)
      loading.value = false
      return caixas.value
    } catch (e) {
      // try next
      // if last, set error
      if (ep === tryEndpoints[tryEndpoints.length - 1]) {
        error.value = e
        loading.value = false
        throw e
      }
    }
  }
}

const filteredCaixas = computed(() => {
  if (!search.value) return caixas.value
  const q = search.value.toLowerCase()
  return caixas.value.filter(c =>
    String(c.id_saas ?? c.ID_SAAS ?? c.id ?? '').toLowerCase().includes(q) ||
    String(c.id ?? '').toLowerCase().includes(q) ||
    (c.desccaixa ?? c.DESCCAIXA ?? '').toLowerCase().includes(q) ||
    (c.participa_fluxo ?? '').toLowerCase().includes(q) ||
    (c.ativo ?? '').toLowerCase().includes(q)
  )
})

// Form visibility for the expandable create form (keeps same pattern as other pages)
const formularioAberto = ref(false)
const toggleFormulario = () => {
  if (formularioAberto.value) {
    formularioAberto.value = false
  } else {
    novoCaixa.value = { id_saas: '', id: '', id_empresa: '', desccaixa: '', participa_fluxo: 'S', ativo: 'S' }
    formularioAberto.value = true
  }
}
// Validation state and rules (match ContaCorrente pattern)
const formValido = ref(false)
const rules = {
  required: (value) => !!value || 'Campo obrigatório',
  number: (value) => /^\\d+$/.test(value) || 'Deve ser um número válido',
  decimal: (value) => /^\d+(\.\d{1,2})?$/.test(value) || 'Deve ser um valor decimal válido',
}

const cancelarFormulario = () => {
  formularioAberto.value = false
  // reset form data
  novoCaixa.value = { id_saas: '', id: '', id_empresa: '', desccaixa: '', participa_fluxo: 'S', ativo: 'S' }
  formValido.value = false
  if (novoCaixaRef.value && typeof novoCaixaRef.value.resetValidation === 'function') {
    novoCaixaRef.value.resetValidation()
  }
}

onMounted(() => {
  fetchCaixas().catch(() => {})
})

// Novo Caixa state & handlers
const savingNovo = ref(false)
const novoCaixaRef = ref(null)
const novoCaixa = ref({
  id_saas: '',
  id: '',
  id_empresa: '',
  desccaixa: '',
  participa_fluxo: 'S',
  ativo: 'S'
})

// (form open/close handled via toggleFormulario / fecharFormulario)

const salvarNovoCaixa = async () => {
  savingNovo.value = true
  try {
    // prepare payload in THorse style
    const payloadObj = { ...novoCaixa.value }
    // try POST to same endpoints used for GET
    let saved = null
    for (const ep of tryEndpoints) {
      try {
        const res = await api.post(ep, { data: [payloadObj] }, { headers: financeiroStore.getAuthHeaders() })
        saved = res.data
        break
      } catch (e) {
        // try next
      }
    }
    if (!saved) throw new Error('Não foi possível salvar o caixa (endpoints falharam)')
    formularioAberto.value = false
    await fetchCaixas()
    mostrarSnackbar('Caixa criado com sucesso', 'success')
  } catch (e) {
    console.error('Erro ao salvar novo caixa:', e)
    mostrarSnackbar('Erro ao criar caixa', 'error')
  } finally {
    savingNovo.value = false
  }
}

// Snackbar local
const snackbar = reactive({ show: false, message: '', color: 'success' })
const mostrarSnackbar = (msg, color = 'success') => {
  snackbar.message = msg
  snackbar.color = color
  snackbar.show = true
}
</script>

