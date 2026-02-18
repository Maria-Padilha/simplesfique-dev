<template>
  <top-all-pages icon="mdi-wallet-outline">
    <template #titulo>Carteira de Cobrança</template>
    <template #acoes>
      <v-btn
          icon
          color="var(--text-color-laranja)"
          variant="outlined"
          size="small"
          :disabled="!podeExportar(ID_PROGRAMA) && !podePDF(ID_PROGRAMA)"
          @click="modalExportacaoAberto = true"
      >
        <v-icon icon="mdi-printer"></v-icon>
        <v-tooltip activator="parent" location="top">
          {{ !podeExportar(ID_PROGRAMA) && !podePDF(ID_PROGRAMA) ? 'Sem permissão' : 'Imprimir / Exportar' }}
        </v-tooltip>
      </v-btn>
    </template>
    <template #section>
      <!-- Lista de Carteiras -->
      <v-card :color="themeStore.darkMode ? 'text-white' : ''" class="background-secondary" elevation="0">
        <v-card-text class="pa-4">
          <BotaoExpandTransition
              :formulario-aberto="formularioAberto"
              texto-abrir="Nova Carteira"
              texto-fechar="Cancelar"
              @toggle="toggleFormulario"
          />

          <!-- Formulário Expansível -->
          <v-expand-transition>
            <div v-if="formularioAberto">
              <v-card class="background-card mb-7" elevation="0">
                <v-card-title class="text-h6 pa-4">
                  <v-icon :icon="editando ? 'mdi-pencil' : 'mdi-plus'" class="mr-2"></v-icon>
                  {{ editando ? 'Editar Carteira' : 'Nova Carteira' }}
                </v-card-title>

                <v-card-text class="pa-4">
                  <v-form ref="formRef" v-model="formValido">
                    <v-row dense>
                      <!-- Código da Carteira (Obrigatório) -->
                      <v-col cols="12" md="3">
                        <v-text-field
                            v-model="formData.id_carteira"
                            label="Código da Carteira *"
                            :rules="[rules.required]"
                            type="number"
                            variant="outlined"
                            density="compact"
                            class="custom-text-field required-left-border"
                            prepend-inner-icon="mdi-identifier"
                        ></v-text-field>
                      </v-col>

                      <!-- Conta Corrente (Obrigatório) -->
                      <v-col cols="12" md="9">
                        <v-autocomplete
                            v-model="formData.id_ccorrente"
                            :items="financeiroStore.contas"
                            item-title="titular"
                            item-value="id"
                            label="Conta Corrente *"
                            :rules="[rules.required]"
                            variant="outlined"
                            density="compact"
                            class="custom-text-field required-left-border"
                            prepend-inner-icon="mdi-bank"
                            :loading="financeiroStore.loading"
                            hide-no-data
                        >
                          <template #item="{ props, item }">
                            <v-list-item v-bind="props">
                              <template #prepend>
                                <v-icon icon="mdi-bank" color="var(--text-color-laranja)"></v-icon>
                              </template>
                              <template #title>
                                {{ item.raw.titular }}
                              </template>
                              <template #subtitle>
                                <span class="text-caption opacity-70">
                                  Ag: {{ item.raw.id_agencia }} | CC: {{ item.raw.numero_ccorrente }}-{{ item.raw.digito_cc }}
                                </span>
                              </template>
                            </v-list-item>
                          </template>
                          <template #selection="{ item }">
                            {{ item.raw.titular }} - Ag: {{ item.raw.id_agencia }} | CC: {{ item.raw.numero_ccorrente }}-{{ item.raw.digito_cc }}
                          </template>
                          <template #no-data>
                            <v-list-item>
                              <v-list-item-title>Nenhuma conta encontrada</v-list-item-title>
                            </v-list-item>
                          </template>
                        </v-autocomplete>
                      </v-col>

                      <!-- Convênio / Código do Cedente -->
                      <v-col cols="12" md="4">
                        <v-text-field
                            v-model="formData.convenio"
                            label="Convênio / Código do Cedente"
                            maxlength="20"
                            variant="outlined"
                            density="compact"
                            class="custom-text-field"
                            prepend-inner-icon="mdi-file-document-outline"
                        ></v-text-field>
                      </v-col>

                      <!-- Nosso Número -->
                      <v-col cols="12" md="4">
                        <v-text-field
                            v-model="formData.nosso_numero"
                            label="Nosso Número"
                            type="number"
                            variant="outlined"
                            density="compact"
                            class="custom-text-field"
                            prepend-inner-icon="mdi-numeric"
                        ></v-text-field>
                      </v-col>

                      <!-- Número Remessa -->
                      <v-col cols="12" md="4">
                        <v-text-field
                            v-model="formData.numero_remessa"
                            label="Número Remessa"
                            type="number"
                            variant="outlined"
                            density="compact"
                            class="custom-text-field"
                            prepend-inner-icon="mdi-send"
                        ></v-text-field>
                      </v-col>

                      <!-- Divider para separar seções -->
                      <v-col cols="12">
                        <v-divider class="my-2"></v-divider>
                        <div class="text-subtitle-2 text-grey mb-2">
                          <v-icon icon="mdi-cog" size="small" class="mr-2"></v-icon>
                          Configurações de Cobrança
                        </div>
                      </v-col>

                      <!-- Dias para Devolução -->
                      <v-col cols="12" md="4">
                        <v-text-field
                            v-model.number="formData.dias_canc_dev"
                            label="Dias para Devolução"
                            type="number"
                            min="0"
                            variant="outlined"
                            density="compact"
                            class="custom-text-field"
                            prepend-inner-icon="mdi-backup-restore"
                            persistent-hint
                        ></v-text-field>
                      </v-col>

                      <!-- Dias para Protesto -->
                      <v-col cols="12" md="4">
                        <v-text-field
                            v-model.number="formData.dias_protesto_negativar"
                            label="Dias para Protesto/Negativação"
                            type="number"
                            min="0"
                            variant="outlined"
                            density="compact"
                            class="custom-text-field"
                            prepend-inner-icon="mdi-alert-circle"
                            persistent-hint
                        ></v-text-field>
                      </v-col>

                      <!-- Tipo de Dia para Protesto -->
                      <v-col cols="12" md="4">
                        <v-select
                            v-model="formData.tipo_dia_protesto"
                            :items="tiposDiaProtesto"
                            label="Tipo de Dia para Protesto"
                            variant="outlined"
                            density="compact"
                            class="custom-text-field"
                            prepend-inner-icon="mdi-calendar"
                        >
                          <template #item="{ props, item }">
                            <v-list-item v-bind="props">
                              <template #prepend>
                                <v-icon 
                                    :icon="item.value === 'U' ? 'mdi-briefcase' : 'mdi-calendar'" 
                                    color="var(--text-color-laranja)"
                                ></v-icon>
                              </template>
                            </v-list-item>
                          </template>
                        </v-select>
                      </v-col>

                      <!-- Divider para alertas -->
                      <v-col cols="12">
                        <v-divider class="my-2"></v-divider>
                        <div class="text-subtitle-2 text-grey mb-2">
                          <v-icon icon="mdi-bell" size="small" class="mr-2"></v-icon>
                          Alertas de Vencimento
                        </div>
                      </v-col>

                      <!-- Primeiro Alerta Vencimento -->
                      <v-col cols="12" md="6">
                        <v-text-field
                            v-model.number="formData.primeiro_alerta_vencto"
                            label="Primeiro Alerta (dias antes)"
                            type="number"
                            min="0"
                            variant="outlined"
                            density="compact"
                            class="custom-text-field"
                            prepend-inner-icon="mdi-bell-ring"
                            hint="Quantos dias antes do vencimento enviar alerta"
                            persistent-hint
                        ></v-text-field>
                      </v-col>

                      <!-- Segundo Alerta Vencimento -->
                      <v-col cols="12" md="6">
                        <v-text-field
                            v-model.number="formData.segundo_alerta_vencto"
                            label="Segundo Alerta (dias antes)"
                            type="number"
                            min="0"
                            variant="outlined"
                            density="compact"
                            class="custom-text-field"
                            prepend-inner-icon="mdi-bell-alert"
                            hint="Quantos dias antes do vencimento enviar segundo alerta"
                            persistent-hint
                        ></v-text-field>
                      </v-col>

                      <!-- Divider para senha -->
                      <v-col cols="12">
                        <v-divider class="my-2"></v-divider>
                        <div class="text-subtitle-2 text-grey mb-2">
                          <v-icon icon="mdi-lock" size="small" class="mr-2"></v-icon>
                          Segurança do Boleto
                        </div>
                      </v-col>

                      <!-- Senha do Boleto -->
                      <v-col cols="12" md="12">
                        <v-select
                            v-model="formData.senha_boleto"
                            :items="tiposSenhaBoleto"
                            label="Senha do Boleto"
                            variant="outlined"
                            density="compact"
                            class="custom-text-field"
                            prepend-inner-icon="mdi-key"
                        >
                          <template #item="{ props, item }">
                            <v-list-item v-bind="props">
                              <template #prepend>
                                <v-icon 
                                    :icon="item.value === 0 ? 'mdi-lock-open' : 'mdi-lock'" 
                                    :color="item.value === 0 ? 'grey' : 'var(--text-color-laranja)'"
                                ></v-icon>
                              </template>
                            </v-list-item>
                          </template>
                        </v-select>
                      </v-col>

                      <!-- Modelo de Boleto -->
                      <v-col cols="12" md="12">
                        <v-select
                            v-model="formData.modelo_boleto"
                            :items="modelosBoleto"
                            label="Modelo de Boleto"
                            variant="outlined"
                            density="compact"
                            class="custom-text-field"
                            prepend-inner-icon="mdi-file-document"
                        >
                          <template #item="{ props }">
                            <v-list-item v-bind="props">
                              <template #prepend>
                                <v-icon icon="mdi-file-document" color="var(--text-color-laranja)"></v-icon>
                              </template>
                            </v-list-item>
                          </template>
                        </v-select>
                      </v-col>

                      <!-- Local de Pagamento -->
                      <v-col cols="12">
                        <v-textarea
                            v-model="formData.local_pagamento"
                            label="Local de Pagamento"
                            variant="outlined"
                            density="compact"
                            rows="2"
                            class="custom-text-field"
                            prepend-inner-icon="mdi-map-marker"
                            hint="Informações sobre onde o boleto pode ser pago"
                            persistent-hint
                        ></v-textarea>
                      </v-col>

                      <!-- Instruções -->
                      <v-col cols="12">
                        <v-textarea
                            v-model="formData.instrucoes"
                            label="Instruções"
                            variant="outlined"
                            density="compact"
                            rows="4"
                            class="custom-text-field"
                            prepend-inner-icon="mdi-text"
                            hint="Instruções que aparecerão no boleto (máx. 4 linhas)"
                            persistent-hint
                        ></v-textarea>
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
                      :loading="loading"
                      :disabled="!formValido"
                      @click="salvarCarteira"
                      variant="flat"
                      class="text-white"
                  >
                    {{ editando ? 'Atualizar' : 'Salvar' }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </div>
          </v-expand-transition>

          <!-- Tabela de Carteiras -->
          <TabelaPadrao
              :formulario-aberto="formularioAberto"
              :headers="headers"
              :items="carteiras"
              :loading="loading"
              :search="search"
              @update:search="(value) => search = value"
              search-label="Pesquisar Carteira"
              item-key="id"
              no-data-icon="mdi-wallet-off"
              no-data-text="Nenhuma carteira cadastrada"
              delete-dialog-message="Esta ação não pode ser desfeita."
              delete-item-display-field="id_carteira"
              @edit-item="editarCarteira"
              @confirm-delete="excluirCarteira"
          >
            <!-- Slots para formatação customizada -->
            <template v-slot:[`item.id_ccorrente`]="{ item }">
              {{ getContaNome(item.id_ccorrente) }}
            </template>

            <template v-slot:[`item.tipo_dia_protesto`]="{ item }">
              <v-chip size="small" :color="item.tipo_dia_protesto === 'U' ? 'primary' : 'success'" variant="tonal">
                {{ item.tipo_dia_protesto === 'U' ? 'Úteis' : 'Corridos' }}
              </v-chip>
            </template>

            <template v-slot:[`item.senha_boleto`]="{ item }">
              {{ getSenhaBoletoLabel(item.senha_boleto) }}
            </template>

            <template v-slot:[`item.dias_canc_dev`]='{ item }'>
              {{ formatarDias(item.dias_canc_dev) }}
            </template>

            <template v-slot:[`item.dias_protesto_negativar`]='{ item }'>
              {{ formatarDias(item.dias_protesto_negativar) }}
            </template>
          </TabelaPadrao>
        </v-card-text>
      </v-card>

      <!-- Modal de Exportação -->
      <ExportacaoModal
          v-model="modalExportacaoAberto"
          :dados="carteiras"
          :filtros="{}"
          nome-relatorio="Carteiras de Cobrança"
          @exportar-pdf="() => {}"
          @exportar-csv="() => {}"
          @exportar-excel="() => {}"
          @imprimir="() => {}"
      />

      <!-- Modal de Acesso Negado -->
      <AcessoNegadoModal
          v-model="acessoNegadoModal"
          :nome-programa="'Carteira de Cobrança'"
          :tipo-acesso="tipoAcessoNegado"
      />

      <v-snackbar
          v-model="snackbar.show"
          :color="snackbar.color"
          :timeout="3000"
      >
        {{ snackbar.message }}
      </v-snackbar>
    </template>
  </top-all-pages>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useFinanceiroStore } from '@/stores/APIs/financeiro'
import { useThemeStore } from '@/stores/config-temas/theme'
import { usePermissoes } from '@/utils/usePermissoes'
import BotaoExpandTransition from '@/components/base/padrao-paginas/BotaoExpandTransition.vue'
import TabelaPadrao from '@/components/base/padrao-paginas/TabelaPadrao.vue'
import TopAllPages from "@/components/base/padrao-paginas/TopAllPages.vue"
import ExportacaoModal from '@/components/base/modais/ExportacaoModal.vue'
import AcessoNegadoModal from '@/components/base/modais/AcessoNegadoModal.vue'

// ID do programa desta tela
const ID_PROGRAMA = 'FFIN002C'

const themeStore = useThemeStore()
const financeiroStore = useFinanceiroStore()
const { podeVisualizar, podeIncluir, podeAlterar, podeExcluir, podeExportar, podePDF } = usePermissoes()

// Modal de acesso negado
const acessoNegadoModal = ref(false)
const tipoAcessoNegado = ref('')

// Refs
const formularioAberto = ref(false)
const editando = ref(false)
const formValido = ref(false)
const formRef = ref(null)
const loading = ref(false)
const search = ref('')

// Modais de exportação
const modalExportacaoAberto = ref(false)

// Snackbar
const snackbar = reactive({
  show: false,
  message: '',
  color: 'success'
})

// Dados
const carteiras = ref([])
const tiposCarteiraDisponiveis = ref([])
const carregandoTiposCarteira = ref(false)

// Headers da tabela
const headers = [
  { title: 'Código', key: 'id_carteira', sortable: true },
  { title: 'Conta Corrente', key: 'id_ccorrente', sortable: true },
  { title: 'Convênio', key: 'convenio', sortable: true },
  { title: 'Nosso Número', key: 'nosso_numero', sortable: true },
  { title: 'Dias Devolução', key: 'dias_canc_dev', sortable: true },
  { title: 'Dias Protesto', key: 'dias_protesto_negativar', sortable: true },
  { title: 'Tipo Dia', key: 'tipo_dia_protesto', sortable: true },
  { title: 'Ações', key: 'actions', sortable: false }
]

// Dados do formulário
const formData = reactive({
  id_carteira: '',
  id_ccorrente: null,
  dias_canc_dev: 0,
  dias_protesto_negativar: 0,
  tipo_dia_protesto: 'U',
  senha_boleto: 0,
  nosso_numero: '',
  numero_remessa: '',
  convenio: '',
  primeiro_alerta_vencto: 0,
  segundo_alerta_vencto: 0,
  modelo_boleto: 'Boleto Simples',
  local_pagamento: '',
  instrucoes: ''
})

// Opções
const tiposDiaProtesto = [
  { title: 'Dias Úteis', value: 'U' },
  { title: 'Dias Corridos', value: 'C' }
]

const tiposSenhaBoleto = [
  { title: 'Sem senha', value: 0 },
  { title: '5 primeiros dígitos do CNPJ da empresa emitente', value: 1 },
  { title: '5 primeiros dígitos do CNPJ/CPF do cliente', value: 2 }
]

const modelosBoleto = [
  { title: 'Boleto Simples', value: 'Boleto Simples' },
  { title: 'Boleto Carnê', value: 'Boleto Carnê' }
]

// Regras de validação
const rules = {
  required: (value) => !!value || 'Campo obrigatório'
}

// Métodos
const toggleFormulario = () => {
  // Verificar permissão para incluir
  if (!formularioAberto.value && !podeIncluir(ID_PROGRAMA)) {
    tipoAcessoNegado.value = 'incluir'
    acessoNegadoModal.value = true
    return
  }

  if (formularioAberto.value) {
    cancelarFormulario()
  } else {
    abrirFormulario()
  }
}

const abrirFormulario = async () => {
  editando.value = false
  resetarForm()
  formularioAberto.value = true
  
  // Carregar contas se ainda não foram carregadas
  if (!financeiroStore.contas || financeiroStore.contas.length === 0) {
    try {
      await financeiroStore.buscarTodasContas()
    } catch (error) {
      console.error('[Carteira] Erro ao carregar contas:', error)
    }
  }
}

const editarCarteira = async (carteira) => {
  // Verificar permissão para alterar
  if (!podeAlterar(ID_PROGRAMA)) {
    tipoAcessoNegado.value = 'alterar'
    acessoNegadoModal.value = true
    return
  }

  editando.value = true
  
  try {
    // Buscar dados completos da carteira via API
    const carteiraId = carteira?.id ?? carteira?.ID
    const carteiraCompleta = await financeiroStore.buscarCarteiraPorId(carteiraId)
    
    // Se retornou dados, usar eles; senão, usar os dados da tabela
    const dadosCarteira = carteiraCompleta?.data?.[0] ?? carteiraCompleta?.[0] ?? carteiraCompleta ?? carteira
    
    // Copiar os campos do registro para o formData
    Object.assign(formData, dadosCarteira)
  } catch (error) {
    console.warn('[Carteira] Erro ao buscar carteira específica, usando dados da tabela:', error)
    // Em caso de erro, usar os dados que já temos da tabela
    Object.assign(formData, carteira)
  }

  formularioAberto.value = true
}

const cancelarFormulario = () => {
  formularioAberto.value = false
  resetarForm()
}

const resetarForm = () => {
  Object.assign(formData, {
    id_carteira: '',
    id_ccorrente: null,
    dias_canc_dev: 0,
    dias_protesto_negativar: 0,
    tipo_dia_protesto: 'U',
    senha_boleto: 0,
    nosso_numero: '',
    numero_remessa: '',
    convenio: '',
    primeiro_alerta_vencto: 0,
    segundo_alerta_vencto: 0,
    modelo_boleto: 'Boleto Simples',
    local_pagamento: '',
    instrucoes: ''
  })
  
  if (formRef.value) {
    formRef.value.resetValidation()
  }
}

const salvarCarteira = async () => {
  try {
    loading.value = true

    if (editando.value) {
      const carteiraId = formData.id ?? formData.id_carteira
      await financeiroStore.atualizarCarteira(carteiraId, formData)
      mostrarSnackbar('Carteira atualizada com sucesso!', 'success')
    } else {
      await financeiroStore.criarCarteira(formData)
      mostrarSnackbar('Carteira criada com sucesso!', 'success')
    }
    
    await carregarCarteiras()
    cancelarFormulario()
  } catch (error) {
    mostrarSnackbar('Erro ao salvar carteira: ' + error.message, 'error')
  } finally {
    loading.value = false
  }
}

const excluirCarteira = async (carteira) => {
  // Verificar permissão para excluir
  if (!podeExcluir(ID_PROGRAMA)) {
    tipoAcessoNegado.value = 'excluir'
    acessoNegadoModal.value = true
    return
  }

  try {
    loading.value = true
    const carteiraId = carteira?.id ?? carteira?.ID
    await financeiroStore.deletarCarteira(carteiraId)
    mostrarSnackbar('Carteira excluída com sucesso!', 'success')
    await carregarCarteiras()
  } catch (error) {
    mostrarSnackbar('Erro ao excluir carteira: ' + error.message, 'error')
  } finally {
    loading.value = false
  }
}

const carregarCarteiras = async () => {
  try {
    loading.value = true
    
    // Buscar id da empresa de dentro do objeto empresaSelecionada
    let idEmpresa = localStorage.getItem('empresa') || localStorage.getItem('id_empresa')
    
    if (!idEmpresa) {
      const empresaSelecionada = localStorage.getItem('empresaSelecionada')
      if (empresaSelecionada) {
        try {
          const empresa = JSON.parse(empresaSelecionada)
          idEmpresa = empresa.id
        } catch (e) {
          console.error('[Carteira] Erro ao parsear empresaSelecionada:', e)
        }
      }
    }
    
    if (!idEmpresa) {
      console.warn('[Carteira] ID da empresa não encontrado no localStorage')
      carteiras.value = []
      return
    }
    
    console.log('[Carteira] Carregando carteiras para empresa:', idEmpresa)
    const response = await financeiroStore.buscarCarteiras(idEmpresa)
    console.log('[Carteira] Resposta da API:', response)
    carteiras.value = response?.data ?? response ?? []
    console.log('[Carteira] Carteiras carregadas:', carteiras.value)
  } catch (error) {
    console.error('[Carteira] Erro ao carregar carteiras:', error)
    mostrarSnackbar('Erro ao carregar carteiras', 'error')
    carteiras.value = []
  } finally {
    loading.value = false
  }
}

const mostrarSnackbar = (message, color = 'success') => {
  snackbar.message = message
  snackbar.color = color
  snackbar.show = true
}

// Helpers
const getContaNome = (idConta) => {
  const conta = financeiroStore.contas.find(c => String(c.id) === String(idConta) || String(c.ID) === String(idConta))
  if (!conta) return `ID: ${idConta}`
  return `${conta.titular} - Ag: ${conta.id_agencia} | CC: ${conta.numero_ccorrente}-${conta.digito_cc}`
}

const getSenhaBoletoLabel = (valor) => {
  if (typeof valor === 'string') return valor
  const tipo = tiposSenhaBoleto.find(t => t.value === valor)
  return tipo ? tipo.title : 'Sem senha'
}

const formatarDias = (valor) => {
  if (valor === null || valor === undefined) return '0 dias'
  if (typeof valor === 'string') return valor
  const dias = Number(valor) || 0
  return `${dias} ${dias === 1 ? 'dia' : 'dias'}`
}

// Carregar tipos de carteira quando uma conta corrente for selecionada
const carregarTiposCarteira = async (idConta) => {
  if (!idConta) {
    tiposCarteiraDisponiveis.value = []
    return
  }

  try {
    carregandoTiposCarteira.value = true
    // Buscar a conta para obter o id_banco
    const conta = financeiroStore.contas.find(c => String(c.id) === String(idConta) || String(c.ID) === String(idConta))
    
    if (conta && conta.id_banco) {
      const tipos = await financeiroStore.buscarTiposCarteiraPorBanco(conta.id_banco)
      tiposCarteiraDisponiveis.value = tipos || []
    } else {
      tiposCarteiraDisponiveis.value = []
    }
  } catch (error) {
    console.error('[Carteira] Erro ao carregar tipos de carteira:', error)
    tiposCarteiraDisponiveis.value = []
  } finally {
    carregandoTiposCarteira.value = false
  }
}

// Watch para carregar tipos de carteira quando conta corrente mudar
watch(() => formData.id_ccorrente, (novoIdConta) => {
  carregarTiposCarteira(novoIdConta)
})

// Lifecycle
onMounted(async () => {
  // Verificar se o usuário tem permissão para visualizar este programa
  if (!podeVisualizar(ID_PROGRAMA)) {
    console.warn('[CarteiraCobranca] Usuário sem permissão para visualizar')
    tipoAcessoNegado.value = 'visualizar'
    acessoNegadoModal.value = true
    return
  }

  try {
    // Carregar carteiras
    await carregarCarteiras()
  } catch (error) {
    mostrarSnackbar('Erro ao carregar dados: ' + error.message, 'error')
  }
})
</script>

<style scoped>
/* Estilos específicos se necessário */
</style>
