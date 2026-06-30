<template>
  <v-form ref="formRef" v-model="formValido">
        <v-row>
          <!-- Caixa Origem -->
          <v-col cols="12" md="4">
            <v-text-field
              label="Caixa Origem *"
              v-model="caixaSelecionado"
              variant="outlined"
              density="compact"
              hide-details="auto"
              :rules="[rules.required]"
              prepend-inner-icon="mdi-cash-register"
              readonly
              placeholder="Selecione um caixa"
            >
              <template #append-inner>
                <busca-padrao-menu
                  v-model="menuCaixa"
                  :pesquisar="pesquisarCaixas"
                  :modelInput="termoCaixa"
                  :resultados="caixaResultados"
                  @update:modelInput="termoCaixa = $event"
                  @selecionar="selecionarCaixa"
                >
                  <template #resultados="{ selecionar }">
                    <v-virtual-scroll
                      :items="caixaResultados"
                      :height="120"
                      item-height="42"
                      class="mt-3"
                    >
                      <template #default="{ item }">
                        <div
                          class="hover:bg-surface-variant rounded-md px-3 py-2 cursor-pointer"
                          @click="selecionar(item)"
                        >
                          <p class="text-body-1">{{ item.desccaixa || item.nomecaixa || item.nome }}</p>
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
              v-model="bancoSelecionado"
              variant="outlined"
              density="compact"
              hide-details="auto"
              :rules="[rules.required]"
              prepend-inner-icon="mdi-bank"
              readonly
              placeholder="Selecione uma conta corrente"
            >
              <template #append-inner>
                <busca-padrao-menu
                  v-model="menuBanco"
                  :pesquisar="pesquisarBancos"
                  :modelInput="termoBanco"
                  :resultados="bancoResultados"
                  @update:modelInput="termoBanco = $event"
                  @selecionar="selecionarBanco"
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

          <!-- Histórico Caixa -->
          <v-col cols="12" md="4">
            <v-text-field
              label="Histórico Caixa *"
              v-model="historicoCaixaSelecionado"
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
                  v-model="menuHistoricoCaixa"
                  :pesquisar="pesquisarHistoricosCaixa"
                  :modelInput="termoHistoricoCaixa"
                  :resultados="historicoCaixaResultados"
                  @update:modelInput="termoHistoricoCaixa = $event"
                  @selecionar="selecionarHistoricoCaixa"
                >
                  <template #resultados="{ selecionar }">
                    <v-virtual-scroll
                      :items="historicoCaixaResultados"
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

          <!-- Histórico Bancário -->
          <v-col cols="12" md="4">
            <v-text-field
              label="Histórico Bancário *"
              v-model="historicoBancoSelecionado"
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
                  v-model="menuHistoricoBanco"
                  :pesquisar="pesquisarHistoricosBanco"
                  :modelInput="termoHistoricoBanco"
                  :resultados="historicoBancoResultados"
                  @update:modelInput="termoHistoricoBanco = $event"
                  @selecionar="selecionarHistoricoBanco"
                >
                  <template #resultados="{ selecionar }">
                    <v-virtual-scroll
                      :items="historicoBancoResultados"
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

          <!-- Tipo Pagamento -->
          <v-col cols="12" md="4">
            <v-text-field
              label="Tipo Pagamento *"
              v-model="tipoPagamentoSelecionado"
              variant="outlined"
              density="compact"
              hide-details="auto"
              :rules="[rules.required]"
              prepend-inner-icon="mdi-cash-multiple"
              readonly
              placeholder="Selecione um tipo de pagamento"
            >
              <template #append-inner>
                <busca-padrao-menu
                  v-model="menuTipoPagamento"
                  :pesquisar="pesquisarTipoPagamento"
                  :modelInput="termoTipoPagamento"
                  :resultados="tipoPagamentoResultados"
                  @update:modelInput="termoTipoPagamento = $event"
                  @selecionar="selecionarTipoPagamento"
                >
                  <template #resultados="{ selecionar }">
                    <v-virtual-scroll
                      :items="tipoPagamentoResultados"
                      :height="120"
                      item-height="42"
                      class="mt-3"
                    >
                      <template #default="{ item }">
                        <div
                          class="hover:bg-surface-variant rounded-md px-3 py-2 cursor-pointer"
                          @click="selecionar(item)"
                        >
                          <p class="text-body-1">{{ item.desctipopagrec || item.descricao }}</p>
                        </div>
                      </template>
                    </v-virtual-scroll>
                  </template>
                </busca-padrao-menu>
              </template>
            </v-text-field>
          </v-col>

          <!-- Histórico Contábil Banco -->
          <v-col cols="12" md="4">
            <v-text-field
              label="Histórico Contábil Banco"
              v-model="historicoContabilBancoSelecionado"
              variant="outlined"
              density="compact"
              hide-details="auto"
              prepend-inner-icon="mdi-book-open-variant"
              readonly
              placeholder="Selecione um histórico contábil"
            >
              <template #append-inner>
                <busca-padrao-menu
                  v-model="menuHistoricoContabilBanco"
                  :pesquisar="pesquisarHistoricosContabilBanco"
                  :modelInput="termoHistoricoContabilBanco"
                  :resultados="historicoContabilBancoResultados"
                  @update:modelInput="termoHistoricoContabilBanco = $event"
                  @selecionar="selecionarHistoricoContabilBanco"
                >
                  <template #resultados="{ selecionar }">
                    <v-virtual-scroll
                      :items="historicoContabilBancoResultados"
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

          <!-- Histórico Contábil Caixa -->
          <v-col cols="12" md="4">
            <v-text-field
              label="Histórico Contábil Caixa"
              v-model="historicoContabilCaixaSelecionado"
              variant="outlined"
              density="compact"
              hide-details="auto"
              prepend-inner-icon="mdi-book-open-variant"
              readonly
              placeholder="Selecione um histórico contábil"
            >
              <template #append-inner>
                <busca-padrao-menu
                  v-model="menuHistoricoContabilCaixa"
                  :pesquisar="pesquisarHistoricosContabilCaixa"
                  :modelInput="termoHistoricoContabilCaixa"
                  :resultados="historicoContabilCaixaResultados"
                  @update:modelInput="termoHistoricoContabilCaixa = $event"
                  @selecionar="selecionarHistoricoContabilCaixa"
                >
                  <template #resultados="{ selecionar }">
                    <v-virtual-scroll
                      :items="historicoContabilCaixaResultados"
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
import { useCaixaStore } from '@/stores/APIs/caixa'
import { useConfigParfinStore } from '@/stores/APIs/config'

// eslint-disable-next-line no-undef
const emit = defineEmits(['sucesso'])

const caixaStore = useCaixaStore()
const financeiroStore = useFinanceiroStore()
const configStore = useConfigParfinStore()
const formRef = ref(null)
const formValido = ref(false)
const loading = ref(false)

// Caixa
const menuCaixa = ref(false)
const termoCaixa = ref('')
const caixaResultados = ref([])
const caixaSelecionado = ref('')

// Banco
const menuBanco = ref(false)
const termoBanco = ref('')
const bancoResultados = ref([])
const bancoSelecionado = ref('')

// Histórico Caixa
const menuHistoricoCaixa = ref(false)
const termoHistoricoCaixa = ref('')
const historicoCaixaResultados = ref([])
const historicoCaixaSelecionado = ref('')

// Histórico Banco
const menuHistoricoBanco = ref(false)
const termoHistoricoBanco = ref('')
const historicoBancoResultados = ref([])
const historicoBancoSelecionado = ref('')

// Tipo Documento
const tipoDocumentoSelecionado = ref('')

// Tipo Pagamento
const menuTipoPagamento = ref(false)
const termoTipoPagamento = ref('')
const tipoPagamentoResultados = ref([])
const tipoPagamentoSelecionado = ref('')

// Histórico Contábil Banco
const menuHistoricoContabilBanco = ref(false)
const termoHistoricoContabilBanco = ref('')
const historicoContabilBancoResultados = ref([])
const historicoContabilBancoSelecionado = ref('')

// Histórico Contábil Caixa
const menuHistoricoContabilCaixa = ref(false)
const termoHistoricoContabilCaixa = ref('')
const historicoContabilCaixaResultados = ref([])
const historicoContabilCaixaSelecionado = ref('')

const formData = reactive({
  id_caixa: null,
  id_conta_corrente: null,
  data_movimento: new Date().toISOString().split('T')[0],
  data_compensacao: new Date().toISOString().split('T')[0],
  valor: null,
  tipo_documento: null,
  numero_documento: null,
  id_historico_caixa: null,
  id_historico_banco: null,
  id_tipopagrec: null,
  observacoes: null,
  // Campos contábeis
  id_reduzido_ctb_caixa_origem: null,
  id_reduzido_ctb_banco_destino: null,
  id_hist_contabil_caixa: null,
  id_hist_contabil_banco: null
})

const rules = {
  required: (value) => !!value || 'Campo obrigatório',
  valorPositivo: (value) => (value && parseFloat(value) > 0) || 'Valor deve ser maior que zero'
}

const pesquisarCaixas = async () => {
  try {
    const empresaSelecionada = JSON.parse(localStorage.getItem('empresaSelecionada') || '{}')
    const idEmpresa = empresaSelecionada?.id || localStorage.getItem('empresa')
    if (!idEmpresa) {
      console.error('ID da empresa não encontrado')
      caixaResultados.value = []
      return
    }
    const caixas = await caixaStore.buscarCaixasUsuarioAberto(idEmpresa)
    caixaResultados.value = Array.isArray(caixas) ? caixas : (caixas?.data || [])
  } catch (error) {
    console.error('Erro ao pesquisar caixas:', error)
    caixaResultados.value = []
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

const pesquisarHistoricosCaixa = async () => {
  try {
    const historicos = await configStore.buscarHistoricoCaixa()
    historicoCaixaResultados.value = Array.isArray(historicos) ? historicos : (historicos?.data || [])
  } catch (error) {
    console.error('Erro ao pesquisar históricos:', error)
    historicoCaixaResultados.value = []
  }
}

const pesquisarHistoricosBanco = async () => {
  try {
    const historicos = await financeiroStore.buscarHistoricosBancarios()
    historicoBancoResultados.value = Array.isArray(historicos) ? historicos : (historicos?.data || [])
  } catch (error) {
    console.error('Erro ao pesquisar históricos:', error)
    historicoBancoResultados.value = []
  }
}

const selecionarCaixa = (caixa) => {
  if (caixa) {
    formData.id_caixa = caixa.id_caixa || caixa.id
    formData.id_reduzido_ctb_caixa_origem = caixa.id_reduzido_ctb_caixa || null
    formData.id_hist_contabil_caixa = caixa.id_hist_contabil
    caixaSelecionado.value = caixa.desccaixa || caixa.nomecaixa || caixa.nome
  }
}

const selecionarBanco = (banco) => {
  if (banco) {
    formData.id_conta_corrente = banco.id || banco.ID || banco.id_ccorrente
    formData.id_reduzido_ctb_banco_destino = banco.id_reduzido_ctb_banco || banco.ID_REDUZIDO_CTB_BANCO || null
    formData.id_hist_contabil_banco = banco.id_hist_contabil || banco.ID_HIST_CONTABIL
    bancoSelecionado.value = `${banco.titular || banco.TITULAR || 'Sem titular'} - Conta: ${banco.numero_ccorrente || banco.NUMERO_CCORRENTE || 'N/A'}`
  }
}

const selecionarHistoricoCaixa = (historico) => {
  if (historico) {
    formData.id_historico_caixa = historico.id
    historicoCaixaSelecionado.value = historico.deschistorico || historico.descricao
  }
}

const selecionarHistoricoBanco = (historico) => {
  if (historico) {
    formData.id_historico_banco = historico.id
    historicoBancoSelecionado.value = historico.deschistorico || historico.descricao
  }
}

const selecionarTipoDocumento = (tipoDoc) => {
  if (tipoDoc) {
    formData.tipo_documento = tipoDoc.id
    tipoDocumentoSelecionado.value = tipoDoc.desctipodocumento || tipoDoc.descricao
  }
}

const pesquisarTipoPagamento = async () => {
  try {
    const tipos = await financeiroStore.buscarTiposPagRec()
    tipoPagamentoResultados.value = Array.isArray(tipos) ? tipos : (tipos?.data || [])
  } catch (error) {
    console.error('Erro ao pesquisar tipos de pagamento:', error)
    tipoPagamentoResultados.value = []
  }
}

const pesquisarHistoricosContabilBanco = async () => {
  try {
    const historicos = await financeiroStore.buscarHistoricosContabil()
    historicoContabilBancoResultados.value = Array.isArray(historicos) ? historicos : (historicos?.data || [])
  } catch (error) {
    console.error('Erro ao pesquisar históricos contábeis de banco:', error)
    historicoContabilBancoResultados.value = []
  }
}

const pesquisarHistoricosContabilCaixa = async () => {
  try {
    const historicos = await financeiroStore.buscarHistoricosContabil()
    historicoContabilCaixaResultados.value = Array.isArray(historicos) ? historicos : (historicos?.data || [])
  } catch (error) {
    console.error('Erro ao pesquisar históricos contábeis de caixa:', error)
    historicoContabilCaixaResultados.value = []
  }
}

const selecionarTipoPagamento = (tipo) => {
  if (tipo) {
    formData.id_tipopagrec = tipo.id
    tipoPagamentoSelecionado.value = tipo.desctipopagrec || tipo.descricao
  }
}

const selecionarHistoricoContabilBanco = (historico) => {
  if (historico) {
    formData.id_hist_contabil_banco = historico.id
    historicoContabilBancoSelecionado.value = historico.deschistorico || historico.descricao
  }
}

const selecionarHistoricoContabilCaixa = (historico) => {
  if (historico) {
    formData.id_hist_contabil_caixa = historico.id
    historicoContabilCaixaSelecionado.value = historico.deschistorico || historico.descricao
  }
}

const preencherObservacao = () => {
  if (!formData.observacoes || formData.observacoes.trim() === '') {
    const origem = caixaSelecionado.value || 'N/A'
    const destino = bancoSelecionado.value || 'N/A'
    const valor = formData.valor ? `R$ ${formData.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'R$ 0,00'
    
    formData.observacoes = `CAIXA -> BANCO "${origem}" para "${destino}": ${valor}`
  }
}

const executarTransferencia = async () => {
  if (!formRef.value.validate()) return

  loading.value = true
  try {
    const empresaSelecionada = JSON.parse(localStorage.getItem('empresaSelecionada') || '{}')
    const idEmpresa = empresaSelecionada?.id || localStorage.getItem('empresa')
    
    const payload = {
      id_empresa: idEmpresa,
      id_caixa_origem: formData.id_caixa,
      id_ccorrente_destino: formData.id_conta_corrente,
      id_historico_caixa: formData.id_historico_caixa,
      id_historico_banco: formData.id_historico_banco,
      id_hist_contabil_caixa: formData.id_hist_contabil_caixa,
      id_hist_contabil_banco: formData.id_hist_contabil_banco,
      id_reduzido_ctb_caixa_origem: formData.id_reduzido_ctb_caixa_origem,
      id_reduzido_ctb_banco_destino: formData.id_reduzido_ctb_banco_destino,
      tipo_transf: 4,
      tipo_documento: formData.tipo_documento,
      id_tipopagrec: formData.id_tipopagrec,
      nrdocumento: formData.numero_documento,
      dtlancamento: formData.data_movimento,
      valor: formData.valor,
      observacao: formData.observacoes || '',
      origem: 'M'
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
    id_caixa: null,
    id_conta_corrente: null,
    data_movimento: new Date().toISOString().split('T')[0],
    data_compensacao: new Date().toISOString().split('T')[0],
    valor: null,
    tipo_documento: null,
    numero_documento: null,
    id_historico_caixa: null,
    id_historico_banco: null,
    observacoes: null
  })
  caixaSelecionado.value = ''
  bancoSelecionado.value = ''
  historicoCaixaSelecionado.value = ''
  historicoBancoSelecionado.value = ''
  tipoDocumentoSelecionado.value = ''
  tipoPagamentoSelecionado.value = ''
  historicoContabilBancoSelecionado.value = ''
  historicoContabilCaixaSelecionado.value = ''
  formRef.value?.resetValidation()
}

// Carregar dados ao montar o componente
onMounted(() => {
  pesquisarCaixas()
  pesquisarBancos()
  pesquisarHistoricosCaixa()
  pesquisarHistoricosBanco()
  pesquisarTipoPagamento()
  pesquisarHistoricosContabilBanco()
  pesquisarHistoricosContabilCaixa()
})
</script>

<style scoped>
.background-card {
  background-color: var(--bg-card);
  color: var(--text-color);
}
</style>
