<template>
  <top-all-pages icon="mdi-receipt-text-check-outline">
    <template #titulo>
      Grupo de Tributação
    </template>

    <template #section>
      <v-card elevation="0" class="background-secondary">
        <v-card-text class="pa-4">
          <botao-expand-transition :formulario-aberto="formularioAberto" @toggle="toggleFormulario">
            <template #default>{{ formularioAberto ? 'Cancelar' : 'Novo Grupo' }}</template>
          </botao-expand-transition>

          <!-- Formulário expansível -->
          <v-expand-transition>
            <div v-if="formularioAberto">
              <v-card class="background-card mb-7" elevation="0">
                <v-card-title class="text-h6 pa-4">
                  <v-icon :icon="editando ? 'mdi-pencil' : 'mdi-plus'" class="mr-2" size="23px" />
                  {{ editando ? 'Editar Grupo de Tributação' : 'Novo Grupo de Tributação' }}
                </v-card-title>

                <v-card-text class="pa-4">
                  <v-form ref="formRef" v-model="formValido">

                    <!-- ===== CRITÉRIOS DE APLICAÇÃO ===== -->
                    <div class="text-subtitle-2 font-weight-bold mb-3 d-flex align-center gap-2">
                      <v-icon size="16" icon="mdi-filter-outline" />
                      Critérios de Aplicação
                    </div>

                    <v-row dense>
                      <!-- Descrição -->
                      <v-col cols="12">
                        <v-text-field
                          v-model="form.descricao"
                          label="Descrição *"
                          :rules="[rules.required]"
                          maxlength="60"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                          :theme="themeStore.darkMode ? 'dark' : 'light'"
                          class="custom-text-field required-left-border"
                          prepend-inner-icon="mdi-text-short"
                        />
                      </v-col>

                      <!-- Tipo CST -->
                      <v-col cols="12">
                        <v-card variant="outlined" class="pa-3">
                          <div class="text-caption text-medium-emphasis mb-2">Tipo CST</div>
                          <v-radio-group v-model="form.qual_imposto" inline hide-details density="compact">
                            <v-radio label="ICMS" :value="1" />
                            <v-radio label="IPI" :value="2" />
                            <v-radio label="PIS" :value="3" />
                            <v-radio label="COFINS" :value="4" />
                          </v-radio-group>
                        </v-card>
                      </v-col>

                      <!-- UF Específico -->
                      <v-col cols="12" md="3">
                        <v-card variant="outlined" class="pa-3 h-100">
                          <div class="text-caption text-medium-emphasis mb-2">UF Específico</div>
                          <v-radio-group v-model="form.uf_especifica" inline hide-details density="compact">
                            <v-radio label="Sim" value="S" />
                            <v-radio label="Não" value="N" />
                          </v-radio-group>
                        </v-card>
                      </v-col>

                      <!-- UF -->
                      <v-col cols="12" md="2">
                        <v-select
                          v-model="form.id_uf"
                          :items="ufs"
                          label="UF"
                          :disabled="form.uf_especifica === 'N'"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                          :theme="themeStore.darkMode ? 'dark' : 'light'"
                          class="custom-text-field"
                          prepend-inner-icon="mdi-map-outline"
                        />
                      </v-col>

                      <!-- CFOP Antes -->
                      <v-col cols="12" md="3">
                        <v-text-field
                          v-model="form.id_cfop"
                          label="CFOP"
                          maxlength="5"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                          :theme="themeStore.darkMode ? 'dark' : 'light'"
                          class="custom-text-field"
                          prepend-inner-icon="mdi-barcode"
                        />
                      </v-col>

                      <!-- Tipo Cliente -->
                      <v-col cols="12" md="4">
                        <v-card variant="outlined" class="pa-3 h-100">
                          <div class="text-caption text-medium-emphasis mb-2">Tipo Cliente</div>
                          <v-radio-group v-model="form.tipo_cliente" inline hide-details density="compact">
                            <v-radio label="Consumidor" value="C" />
                            <v-radio label="Revendedor" value="R" />
                          </v-radio-group>
                        </v-card>
                      </v-col>

                      <!-- Contribuinte ICMS -->
                      <v-col cols="12" md="4">
                        <v-card variant="outlined" class="pa-3 h-100">
                          <div class="text-caption text-medium-emphasis mb-2">Contribuinte ICMS</div>
                          <v-radio-group v-model="form.contribuinte_icms" inline hide-details density="compact">
                            <v-radio label="Sim" value="S" />
                            <v-radio label="Não" value="N" />
                            <v-radio label="Isento" value="I" />
                          </v-radio-group>
                        </v-card>
                      </v-col>

                      <!-- Possui SUFRAMA -->
                      <v-col cols="12" md="4">
                        <v-card variant="outlined" class="pa-3 h-100">
                          <div class="text-caption text-medium-emphasis mb-2">Possui SUFRAMA</div>
                          <v-radio-group v-model="form.tem_suframa" inline hide-details density="compact">
                            <v-radio label="Sim" value="S" />
                            <v-radio label="Não" value="N" />
                          </v-radio-group>
                        </v-card>
                      </v-col>
                    </v-row>

                    <v-divider class="my-4" />

                    <!-- ===== REGRAS DE TRIBUTAÇÃO ===== -->
                    <div class="text-subtitle-2 font-weight-bold mb-3 d-flex align-center gap-2">
                      <v-icon size="16" icon="mdi-swap-horizontal" />
                      Regras de Tributação
                    </div>

                    <v-row dense>
                      <!-- CST -->
                      <v-col cols="12" md="5">
                        <v-select
                          v-model="form.cst"
                          :items="cstOpcoes"
                          item-title="label"
                          item-value="value"
                          label="CST"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                          :theme="themeStore.darkMode ? 'dark' : 'light'"
                          class="custom-text-field"
                          prepend-inner-icon="mdi-text-box-check-outline"
                        />
                      </v-col>

                      <!-- Cód. Enquadramento -->
                      <v-col cols="12" md="3">
                        <v-text-field
                          v-model="form.cenqipi"
                          label="Cód. Enquadramento"
                          maxlength="4"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                          :theme="themeStore.darkMode ? 'dark' : 'light'"
                          class="custom-text-field"
                          prepend-inner-icon="mdi-format-list-numbered"
                        />
                      </v-col>

                      <!-- CSOSN -->
                      <v-col cols="12" md="4">
                        <v-select
                          v-model="form.csosn"
                          :items="csosnOpcoes"
                          item-title="label"
                          item-value="value"
                          label="CSOSN"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                          :theme="themeStore.darkMode ? 'dark' : 'light'"
                          class="custom-text-field"
                          prepend-inner-icon="mdi-text-box-outline"
                        />
                      </v-col>

                      <!-- CFOP Operação -->
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="form.id_cfop_op"
                          label="CFOP Operação (Força CFOP no item)"
                          maxlength="5"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                          :theme="themeStore.darkMode ? 'dark' : 'light'"
                          class="custom-text-field"
                          prepend-inner-icon="mdi-barcode"
                        />
                      </v-col>

                      <!-- Mensagem -->
                      <v-col cols="12" md="8">
                        <v-select
                          v-model="form.id_msg"
                          :items="mensagens"
                          item-title="titulo"
                          item-value="id"
                          label="Selecione a Mensagem a incluir"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                          :theme="themeStore.darkMode ? 'dark' : 'light'"
                          class="custom-text-field"
                          prepend-inner-icon="mdi-message-text-outline"
                          clearable
                        />
                      </v-col>

                      <!-- % Alíquota -->
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="form.aliquota_icms"
                          label="% Alíquota"
                          type="number"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                          :theme="themeStore.darkMode ? 'dark' : 'light'"
                          class="custom-text-field"
                          prepend-inner-icon="mdi-percent"
                          suffix="%"
                        />
                      </v-col>

                      <!-- % Red. Base Cálculo -->
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="form.reducao_base_calc"
                          label="% Red. Base Cálculo"
                          type="number"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                          :theme="themeStore.darkMode ? 'dark' : 'light'"
                          class="custom-text-field"
                          prepend-inner-icon="mdi-percent-outline"
                          suffix="%"
                        />
                      </v-col>

                      <!-- % Dif. Alíquota -->
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="form.diferenca_aliq"
                          label="% Dif. Alíquota"
                          type="number"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                          :theme="themeStore.darkMode ? 'dark' : 'light'"
                          class="custom-text-field"
                          prepend-inner-icon="mdi-swap-vertical"
                          suffix="%"
                        />
                      </v-col>
                    </v-row>
                  </v-form>
                </v-card-text>

                <v-card-actions class="pa-4">
                  <v-spacer />
                  <v-btn color="grey" variant="text" @click="cancelarFormulario">Cancelar</v-btn>
                  <v-btn
                    color="var(--text-color-laranja)"
                    :loading="loading"
                    :disabled="!formValido"
                    variant="flat"
                    class="text-white"
                    @click="salvarGrupo"
                  >
                    {{ editando ? 'Atualizar' : 'Salvar' }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </div>
          </v-expand-transition>

          <!-- Tabela -->
          <TabelaPadrao
            :formulario-aberto="formularioAberto"
            :headers="headers"
            :items="itensFiltrados"
            :loading="loading"
            :search="search"
            @update:search="(value) => search = value"
            search-label="Pesquisar grupo de tributação"
            item-key="id"
            no-data-icon="mdi-receipt-text-remove-outline"
            no-data-text="Nenhum grupo de tributação cadastrado"
            delete-item-display-field="descricao"
            @edit-item="editarGrupo"
            @confirm-delete="excluirGrupo"
          >
            <template v-slot:[`item.qual_imposto`]="{ item }">
              {{ tipoCstLabel(item.qual_imposto) }}
            </template>
            <template v-slot:[`item.tipo_cliente_desc`]="{ item }">
              <v-chip size="x-small" color="blue" variant="tonal">{{ item.tipo_cliente_desc }}</v-chip>
            </template>
            <template v-slot:[`item.contribuinte_icms_desc`]="{ item }">
              <v-chip size="x-small" :color="item.contribuinte_icms === 'S' ? 'green' : item.contribuinte_icms === 'I' ? 'orange' : 'grey'" variant="tonal">
                {{ item.contribuinte_icms_desc }}
              </v-chip>
            </template>
            <template v-slot:[`item.aliquota_icms`]="{ item }">
              {{ item.aliquota_icms != null ? item.aliquota_icms + '%' : '-' }}
            </template>
          </TabelaPadrao>
        </v-card-text>
      </v-card>
    </template>
  </top-all-pages>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useThemeStore } from '@/stores/config-temas/theme'
import { useApiStore } from '@/stores/APIs/api'
import api from '@/services/api'
import TopAllPages from '@/components/base/padrao-paginas/TopAllPages.vue'
import BotaoExpandTransition from '@/components/base/padrao-paginas/BotaoExpandTransition.vue'
import TabelaPadrao from '@/components/base/padrao-paginas/TabelaPadrao.vue'

const themeStore = useThemeStore()
const apiStore = useApiStore()

const empresaSelecionada = JSON.parse(localStorage.getItem('empresaSelecionada'))
const idEmp = empresaSelecionada?.id ?? null
const token = localStorage.getItem('token')

const formularioAberto = ref(false)
const editando = ref(false)
const formValido = ref(false)
const formRef = ref(null)
const search = ref('')
const loading = computed(() => apiStore.loading)
const grupos = ref([])
const mensagens = ref([])

const form = reactive({
  id: null,
  descricao: '',
  qual_imposto: 1,
  uf_especifica: 'N',
  id_uf: '',
  id_cfop: '',
  tipo_cliente: 'C',
  contribuinte_icms: 'S',
  tem_suframa: 'N',
  cst: null,
  cenqipi: '',
  csosn: null,
  id_cfop_op: '',
  id_msg: null,
  aliquota_icms: null,
  reducao_base_calc: null,
  diferenca_aliq: null,
})

const rules = {
  required: (v) => !!v || 'Campo obrigatório'
}

const headers = [
  { title: 'Descrição', key: 'descricao', sortable: true },
  { title: 'Imposto', key: 'qual_imposto', sortable: true },
  { title: 'Tipo Cliente', key: 'tipo_cliente_desc', sortable: true },
  { title: 'Contrib. ICMS', key: 'contribuinte_icms_desc', sortable: true },
  { title: 'CST', key: 'cst', sortable: true },
  { title: 'CSOSN', key: 'csosn', sortable: true },
  { title: '% Alíq.', key: 'aliquota_icms', sortable: true },
  { title: 'Ações', key: 'actions', sortable: false }
]

const ufs = [
  'AC','AL','AM','AP','BA','CE','DF','ES','GO','MA',
  'MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN',
  'RO','RR','RS','SC','SE','SP','TO'
]

const cstOpcoes = [
  { value: '00', label: '00 - Tributado Integralmente' },
  { value: '10', label: '10 - Tributado e com Cobrança do ICMS por ST' },
  { value: '20', label: '20 - Com Redução de BC' },
  { value: '30', label: '30 - Isento ou não tributado e com cobrança do ICMS por ST' },
  { value: '40', label: '40 - Isento' },
  { value: '41', label: '41 - Não Tributado' },
  { value: '50', label: '50 - Suspensão' },
  { value: '51', label: '51 - Diferimento' },
  { value: '60', label: '60 - ICMS cobrado anteriormente por ST' },
  { value: '70', label: '70 - Com Red. BC e Cobrança de ICMS por ST' },
  { value: '90', label: '90 - Outros' },
]

const csosnOpcoes = [
  { value: '101', label: '101 - Tributada pelo SN com permissão de crédito' },
  { value: '102', label: '102 - Tributada pelo SN sem permissão de crédito' },
  { value: '103', label: '103 - Isenção do ICMS para faixa de receita bruta' },
  { value: '201', label: '201 - Tributada pelo SN com crédito e com ST' },
  { value: '202', label: '202 - Tributada pelo SN sem crédito e com ST' },
  { value: '203', label: '203 - Isenção do ICMS para faixa de receita bruta e com ST' },
  { value: '300', label: '300 - Imune' },
  { value: '400', label: '400 - Não tributada pelo Simples Nacional' },
  { value: '500', label: '500 - ICMS cobrado anteriormente por ST' },
  { value: '900', label: '900 - Outros' },
]

const tipoCstMap = { 1: 'ICMS', 2: 'IPI', 3: 'PIS', 4: 'COFINS' }
const tipoCstLabel = (v) => tipoCstMap[v] ?? v

const itensFiltrados = computed(() => {
  const dados = grupos.value || []
  return Array.isArray(dados) ? dados : []
})

function toggleFormulario() {
  if (formularioAberto.value) {
    cancelarFormulario()
  } else {
    editando.value = false
    resetarForm()
    formularioAberto.value = true
  }
}

function cancelarFormulario() {
  formularioAberto.value = false
  resetarForm()
}

function resetarForm() {
  Object.assign(form, {
    id: null,
    descricao: '',
    qual_imposto: 1,
    uf_especifica: 'N',
    id_uf: '',
    id_cfop: '',
    tipo_cliente: 'C',
    contribuinte_icms: 'S',
    tem_suframa: 'N',
    cst: null,
    cenqipi: '',
    csosn: null,
    id_cfop_op: '',
    id_msg: null,
    aliquota_icms: null,
    reducao_base_calc: null,
    diferenca_aliq: null,
  })
  formRef.value?.resetValidation()
}

async function editarGrupo(item) {
  try {
    const response = await api.get(`/gptrib/${idEmp}/${item.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const dados = response.data?.data?.[0] || response.data?.[0] || response.data || item
    Object.assign(form, dados)
  } catch (error) {
    console.error('Erro ao buscar grupo de tributação:', error)
    Object.assign(form, item)
  }
  editando.value = true
  formularioAberto.value = true
}

async function carregarGrupos() {
  try {
    const response = await api.get(`/gptrib/${idEmp}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    grupos.value = response.data?.data || response.data || []
  } catch (error) {
    console.error('Erro ao carregar grupos de tributação:', error)
  }
}

async function carregarMensagens() {
  try {
    const response = await api.get(`/msg/${idEmp}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    mensagens.value = response.data?.data || response.data || []
  } catch (error) {
    console.error('Erro ao carregar mensagens:', error)
  }
}

async function salvarGrupo() {
  const { id, ...payload } = form

  if (editando.value) {
    await apiStore.executarAcao('gptrib', 'put', { data: [payload] }, `${idEmp}/${id}`)
  } else {
    await apiStore.executarAcao('gptrib', 'post', { data: [{ id_empresa: idEmp, ...payload }] })
  }

  if (!apiStore.errorMessage) {
    cancelarFormulario()
    await carregarGrupos()
  }
}

async function excluirGrupo(item) {
  await apiStore.executarAcao('gptrib', 'delete', null, `${idEmp}/${item.id}`)
  await carregarGrupos()
}

onMounted(async () => {
  await Promise.all([carregarGrupos(), carregarMensagens()])
})
</script>
