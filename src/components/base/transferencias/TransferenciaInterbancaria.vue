<template>
  <v-form ref="formRef" v-model="formValido">
        <v-row>
          <!-- Banco Origem -->
          <v-col cols="12" md="4">
            <v-text-field
              label="Banco Origem *"
              v-model="bancoOrigemSelecionado"
              variant="outlined"
              density="compact"
              hide-details="auto"
              :rules="[rules.required, rules.bancosDiferentes]"
              prepend-inner-icon="mdi-bank"
              readonly
              placeholder="Selecione uma conta corrente"
            >
              <template #append-inner>
                <busca-padrao-menu
                  v-model="menuBancoOrigem"
                  :pesquisar="pesquisarBancos"
                  :modelInput="termoBancoOrigem"
                  :resultados="bancoResultados"
                  @update:modelInput="termoBancoOrigem = $event"
                  @selecionar="selecionarBancoOrigem"
                >
                  <template #resultados="{ selecionar }">
                    <v-virtual-scroll
                      :items="bancoResultados"
                      :height="120"
                      item-height="42"
                      class="mt-3"
                    >
                      <template #default="{ item }">
                        <div
                          class="hover:bg-surface-variant rounded-md px-3 py-2 cursor-pointer"
                          @click="selecionar(item)"
                        >
                          <p class="text-body-1">{{ item.titular || item.TITULAR || 'Sem titular' }} - Conta: {{ item.numero_ccorrente || item.NUMERO_CCORRENTE || 'N/A' }}</p>
                        </div>
                      </template>
                    </v-virtual-scroll>
                  </template>
                </busca-padrao-menu>
              </template>
            </v-text-field>
          </v-col>

          <!-- Banco Destino -->
          <v-col cols="12" md="4">
            <v-text-field
              label="Banco Destino *"
              v-model="bancoDestinoSelecionado"
              variant="outlined"
              density="compact"
              hide-details="auto"
              :rules="[rules.required, rules.bancosDiferentes]"
              prepend-inner-icon="mdi-bank"
              readonly
              placeholder="Selecione uma conta corrente"
            >
              <template #append-inner>
                <busca-padrao-menu
                  v-model="menuBancoDestino"
                  :pesquisar="pesquisarBancos"
                  :modelInput="termoBancoDestino"
                  :resultados="bancoResultados"
                  @update:modelInput="termoBancoDestino = $event"
                  @selecionar="selecionarBancoDestino"
                >
                  <template #resultados="{ selecionar }">
                    <v-virtual-scroll
                      :items="bancoResultados"
                      :height="120"
                      item-height="42"
                      class="mt-3"
                    >
                      <template #default="{ item }">
                        <div
                          class="hover:bg-surface-variant rounded-md px-3 py-2 cursor-pointer"
                          @click="selecionar(item)"
                        >
                          <p class="text-body-1">{{ item.titular || item.TITULAR || 'Sem titular' }} - Conta: {{ item.numero_ccorrente || item.NUMERO_CCORRENTE || 'N/A' }}</p>
                        </div>
                      </template>
                    </v-virtual-scroll>
                  </template>
                </busca-padrao-menu>
              </template>
            </v-text-field>
          </v-col>

          <!-- Data Movimento -->
          <v-col cols="12" md="4">
            <v-text-field
              v-model="formData.data_movimento"
              label="Data Movimento"
              type="date"
              density="compact"
              variant="outlined"
              :rules="[rules.required]"
              prepend-inner-icon="mdi-calendar"
              hide-details="auto"
            ></v-text-field>
          </v-col>

          <!-- Data Compensação -->
          <v-col cols="12" md="4">
            <v-text-field
              v-model="formData.data_compensacao"
              label="Data Compensação"
              type="date"
              density="compact"
              variant="outlined"
              prepend-inner-icon="mdi-calendar-check"
              hide-details="auto"
            ></v-text-field>
          </v-col>

          <!-- Valor -->
          <v-col cols="12" md="4">
            <v-text-field
              v-model="formData.valor"
              label="Valor"
              type="number"
              step="0.01"
              density="compact"
              variant="outlined"
              :rules="[rules.required, rules.valorPositivo]"
              prepend-inner-icon="mdi-currency-usd"
              prefix="R$"
              hide-details="auto"
            ></v-text-field>
          </v-col>

          <!-- Tipo Documento -->
          <v-col cols="12" md="4">
            <v-text-field
              label="Tipo Documento *"
              v-model="tipoDocumentoSelecionado"
              variant="outlined"
              density="compact"
              hide-details="auto"
              :rules="[rules.required]"
              prepend-inner-icon="mdi-file-document-outline"
              readonly
              placeholder="Selecione um tipo de documento"
            >
              <template #append-inner>
                <TipoDocumentoMenu @selecionar="selecionarTipoDocumento" />
              </template>
            </v-text-field>
          </v-col>

          <!-- Número Documento -->
          <v-col cols="12" md="4">
            <v-text-field
              v-model="formData.numero_documento"
              label="Número Documento"
              density="compact"
              variant="outlined"
              prepend-inner-icon="mdi-file-document-outline"
              hide-details="auto"
            ></v-text-field>
          </v-col>

          <!-- Histórico Origem -->
          <v-col cols="12" md="4">
            <v-text-field
              label="Histórico Banco Origem *"
              v-model="historicoOrigemSelecionado"
              variant="outlined"
              density="compact"
              hide-details="auto"
              :rules="[rules.required]"
              prepend-inner-icon="mdi-file-document-edit"
              readonly
              placeholder="Selecione um histórico"
            >
              <template #append-inner>
                <busca-padrao-menu
                  v-model="menuHistoricoOrigem"
                  :pesquisar="pesquisarHistoricos"
                  :modelInput="termoHistoricoOrigem"
                  :resultados="historicoResultados"
                  @update:modelInput="termoHistoricoOrigem = $event"
                  @selecionar="selecionarHistoricoOrigem"
                >
                  <template #resultados="{ selecionar }">
                    <v-virtual-scroll
                      :items="historicoResultados"
                      :height="120"
                      item-height="42"
                      class="mt-3"
                    >
                      <template #default="{ item }">
                        <div
                          class="hover:bg-surface-variant rounded-md px-3 py-2 cursor-pointer"
                          @click="selecionar(item)"
                        >
                          <p class="text-body-1">{{ item.deschistorico || item.descricao }}</p>
                        </div>
                      </template>
                    </v-virtual-scroll>
                  </template>
                </busca-padrao-menu>
              </template>
            </v-text-field>
          </v-col>

          <!-- Histórico Destino -->
          <v-col cols="12" md="4">
            <v-text-field
              label="Histórico Banco Destino *"
              v-model="historicoDestinoSelecionado"
              variant="outlined"
              density="compact"
              hide-details="auto"
              :rules="[rules.required]"
              prepend-inner-icon="mdi-file-document-edit-outline"
              readonly
              placeholder="Selecione um histórico"
            >
              <template #append-inner>
                <busca-padrao-menu
                  v-model="menuHistoricoDestino"
                  :pesquisar="pesquisarHistoricos"
                  :modelInput="termoHistoricoDestino"
                  :resultados="historicoResultados"
                  @update:modelInput="termoHistoricoDestino = $event"
                  @selecionar="selecionarHistoricoDestino"
                >
                  <template #resultados="{ selecionar }">
                    <v-virtual-scroll
                      :items="historicoResultados"
                      :height="120"
                      item-height="42"
                      class="mt-3"
                    >
                      <template #default="{ item }">
                        <div
                          class="hover:bg-surface-variant rounded-md px-3 py-2 cursor-pointer"
                          @click="selecionar(item)"
                        >
                          <p class="text-body-1">{{ item.deschistorico || item.descricao }}</p>
                        </div>
                      </template>
                    </v-virtual-scroll>
                  </template>
                </busca-padrao-menu>
              </template>
            </v-text-field>
          </v-col>

          <!-- Histórico Contábil -->
          <v-col cols="12" md="4">
            <v-text-field
              label="Histórico Contábil *"
              v-model="historicoContabilSelecionado"
              variant="outlined"
              density="compact"
              hide-details="auto"
              :rules="[rules.required]"
              prepend-inner-icon="mdi-file-chart"
              readonly
              placeholder="Selecione um histórico contábil"
            >
              <template #append-inner>
                <busca-padrao-menu
                  v-model="menuHistoricoContabil"
                  :pesquisar="pesquisarHistoricosContabil"
                  :modelInput="termoHistoricoContabil"
                  :resultados="historicoContabilResultados"
                  @update:modelInput="termoHistoricoContabil = $event"
                  @selecionar="selecionarHistoricoContabil"
                >
                  <template #resultados="{ selecionar }">
                    <v-virtual-scroll
                      :items="historicoContabilResultados"
                      :height="120"
                      item-height="42"
                      class="mt-3"
                    >
                      <template #default="{ item }">
                        <div
                          class="hover:bg-surface-variant rounded-md px-3 py-2 cursor-pointer"
                          @click="selecionar(item)"
                        >
                          <p class="text-body-1">{{ item.deschistorico || item.descricao }}</p>
                        </div>
                      </template>
                    </v-virtual-scroll>
                  </template>
                </busca-padrao-menu>
              </template>
            </v-text-field>
          </v-col>

          <!-- Observações -->
          <v-col cols="12">
            <v-textarea
              v-model="formData.observacoes"
              label="Observações"
              density="compact"
              variant="outlined"
              rows="2"
              prepend-inner-icon="mdi-text"
              hide-details
              @focus="preencherObservacao"
            ></v-textarea>
          </v-col>
        </v-row>
      </v-form>

    <!-- Botões de ação -->
    <div class="d-flex justify-end ga-2 mt-4">
      <v-btn
        color="grey"
        variant="text"
        @click="limparFormulario"
      >
        Limpar
      </v-btn>
      <v-btn
        color="var(--text-color-laranja)"
        variant="flat"
        class="text-white"
        :disabled="!formValido"
        :loading="loading"
        @click="executarTransferencia"
      >
        <v-icon icon="mdi-check" class="mr-1"></v-icon>
        Transferir
      </v-btn>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import BuscaPadraoMenu from '@/components/base/menu/BuscaPadraoMenu.vue'
import TipoDocumentoMenu from '@/components/base/menu/TipoDocumentoMenu.vue'
import { useFinanceiroStore } from '@/stores/APIs/financeiro'

// eslint-disable-next-line no-undef
const emit = defineEmits(['sucesso'])

const financeiroStore = useFinanceiroStore()

const formRef = ref(null)
const formValido = ref(false)
const loading = ref(false)

// Banco Origem
const menuBancoOrigem = ref(false)
const termoBancoOrigem = ref('')
const bancoOrigemSelecionado = ref('')

// Banco Destino
const menuBancoDestino = ref(false)
const termoBancoDestino = ref('')
const bancoDestinoSelecionado = ref('')

// Banco Resultados (compartilhado)
const bancoResultados = ref([])

// Histórico Origem
const menuHistoricoOrigem = ref(false)
const termoHistoricoOrigem = ref('')
const historicoOrigemSelecionado = ref('')

// Histórico Destino
const menuHistoricoDestino = ref(false)
const termoHistoricoDestino = ref('')
const historicoDestinoSelecionado = ref('')

// Histórico Resultados (compartilhado)
const historicoResultados = ref([])

// Histórico Contábil
const menuHistoricoContabil = ref(false)
const termoHistoricoContabil = ref('')
const historicoContabilResultados = ref([])
const historicoContabilSelecionado = ref('')

// Tipo Documento
const tipoDocumentoSelecionado = ref('')

const formData = reactive({
  id_conta_origem: null,
  id_conta_destino: null,
  data_movimento: new Date().toISOString().split('T')[0],
  data_compensacao: new Date().toISOString().split('T')[0],
  valor: null,
  tipo_documento: null,
  numero_documento: null,
  id_historico_origem: null,
  id_historico_destino: null,
  observacoes: null,
  // Campos contábeis (preenchidos automaticamente ao selecionar banco)
  id_reduzido_ctb_banco_origem: null,
  id_reduzido_ctb_banco_destino: null,
  id_hist_contabil_banco: null
})

const rules = {
  required: (value) => !!value || 'Campo obrigatório',
  valorPositivo: (value) => (value && parseFloat(value) > 0) || 'Valor deve ser maior que zero',
  bancosDiferentes: () => {
    if (formData.id_conta_origem && formData.id_conta_destino) {
      return formData.id_conta_origem !== formData.id_conta_destino || 
        'Contas de origem e destino devem ser diferentes'
    }
    return true
  }
}

const pesquisarBancos = async () => {
  try {
    const contas = await financeiroStore.buscarContasUsuarioAtivo()
    bancoResultados.value = Array.isArray(contas) ? contas : (contas?.data || [])
  } catch (error) {
    console.error('Erro ao pesquisar bancos:', error)
    bancoResultados.value = []
  }
}

const pesquisarHistoricos = async () => {
  try {
    const historicos = await financeiroStore.buscarHistoricosBancarios()
    historicoResultados.value = Array.isArray(historicos) ? historicos : (historicos?.data || [])
  } catch (error) {
    console.error('Erro ao pesquisar históricos:', error)
    historicoResultados.value = []
  }
}

const pesquisarHistoricosContabil = async () => {
  try {
    const historicos = await financeiroStore.buscarHistoricosContabil()
    historicoContabilResultados.value = Array.isArray(historicos) ? historicos : (historicos?.data || [])
  } catch (error) {
    console.error('Erro ao pesquisar históricos contábeis:', error)
    historicoContabilResultados.value = []
  }
}

const selecionarBancoOrigem = (banco) => {
  if (banco) {
    formData.id_conta_origem = banco.id || banco.ID || banco.id_ccorrente
    formData.id_reduzido_ctb_banco_origem = banco.id_reduzido_ctb_banco || banco.ID_REDUZIDO_CTB_BANCO || null
    formData.id_hist_contabil_banco = banco.id_hist_contabil || banco.ID_HIST_CONTABIL
    bancoOrigemSelecionado.value = `${banco.titular || banco.TITULAR || 'Sem titular'} - Conta: ${banco.numero_ccorrente || banco.NUMERO_CCORRENTE || 'N/A'}`
  }
}

const selecionarBancoDestino = (banco) => {
  if (banco) {
    formData.id_conta_destino = banco.id || banco.ID || banco.id_ccorrente
    formData.id_reduzido_ctb_banco_destino = banco.id_reduzido_ctb_banco || banco.ID_REDUZIDO_CTB_BANCO || null
    if (!formData.id_hist_contabil_banco) {
      formData.id_hist_contabil_banco = banco.id_hist_contabil || banco.ID_HIST_CONTABIL
    }
    bancoDestinoSelecionado.value = `${banco.titular || banco.TITULAR || 'Sem titular'} - Conta: ${banco.numero_ccorrente || banco.NUMERO_CCORRENTE || 'N/A'}`
  }
}

const selecionarHistoricoOrigem = (historico) => {
  if (historico) {
    formData.id_historico_origem = historico.id
    historicoOrigemSelecionado.value = historico.deschistorico || historico.descricao
  }
}

const selecionarHistoricoContabil = (historico) => {
  if (historico) {
    formData.id_hist_contabil_banco = historico.id
    historicoContabilSelecionado.value = historico.deschistorico || historico.descricao
  }
}

const selecionarHistoricoDestino = (historico) => {
  if (historico) {
    formData.id_historico_destino = historico.id
    historicoDestinoSelecionado.value = historico.deschistorico || historico.descricao
  }
}

const selecionarTipoDocumento = (tipoDoc) => {
  if (tipoDoc) {
    formData.tipo_documento = tipoDoc.id
    tipoDocumentoSelecionado.value = tipoDoc.desctipodocumento || tipoDoc.descricao
  }
}

const preencherObservacao = () => {
  if (!formData.observacoes || formData.observacoes.trim() === '') {
    const origem = bancoOrigemSelecionado.value || 'N/A'
    const destino = bancoDestinoSelecionado.value || 'N/A'
    const valor = formData.valor ? `R$ ${formData.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'R$ 0,00'
    
    formData.observacoes = `BANCO -> BANCO "${origem}" para "${destino}": ${valor}`
  }
}

const executarTransferencia = async () => {
  if (!formRef.value.validate()) return

  loading.value = true
  try {
    const empresaSelecionada = JSON.parse(localStorage.getItem('empresaSelecionada') || '{}')
    const idEmpresa = empresaSelecionada?.id || localStorage.getItem('empresa')
    
    const payload = {
      data: [{
        id_empresa: idEmpresa,
        id_ccorrente_origem: formData.id_conta_origem,
        id_ccorrente_destino: formData.id_conta_destino,
        id_historico_banco: formData.id_historico_origem,
        id_hist_contabil_banco: formData.id_hist_contabil_banco,
        id_reduzido_ctb_banco_origem: formData.id_reduzido_ctb_banco_origem,
        id_reduzido_ctb_banco_destino: formData.id_reduzido_ctb_banco_destino,
        tipo_transf: 1, // Interbancária
        tipo_documento: formData.tipo_documento,
        nrdocumento: formData.numero_documento,
        dtlancamento: formData.data_movimento,
        valor: formData.valor,
        observacao: formData.observacoes || '',
        origem: 'M' // M = Manual
      }]
    }

    await financeiroStore.realizarTransferencia(payload)
    
    limparFormulario()
    emit('sucesso')
  } catch (error) {
    console.error('Erro ao realizar transferência:', error)
  } finally {
    loading.value = false
  }
}

const limparFormulario = () => {
  Object.assign(formData, {
    id_conta_origem: null,
    id_conta_destino: null,
    data_movimento: new Date().toISOString().split('T')[0],
    data_compensacao: new Date().toISOString().split('T')[0],
    valor: null,
    tipo_documento: null,
    numero_documento: null,
    id_historico_origem: null,
    id_historico_destino: null,
    observacoes: null,
    id_reduzido_ctb_banco_origem: null,
    id_reduzido_ctb_banco_destino: null,
    id_hist_contabil_banco: null
  })
  bancoOrigemSelecionado.value = ''
  bancoDestinoSelecionado.value = ''
  historicoOrigemSelecionado.value = ''
  historicoDestinoSelecionado.value = ''
  historicoContabilSelecionado.value = ''
  tipoDocumentoSelecionado.value = ''
  formRef.value?.resetValidation()
}

// Carregar dados ao montar o componente
onMounted(() => {
  pesquisarBancos()
  pesquisarHistoricos()
  pesquisarHistoricosContabil()
})
</script>

<style scoped>
.background-card {
  background-color: var(--bg-card);
  color: var(--text-color);
}
</style>
