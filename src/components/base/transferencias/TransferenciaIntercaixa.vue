<template>
  <v-form ref="formRef" v-model="formValido">
        <v-row>
          <!-- Caixa Origem -->
          <v-col cols="12" md="4">
            <v-text-field
              label="Caixa Origem *"
              v-model="caixaOrigemSelecionado"
              variant="outlined"
              density="compact"
              hide-details="auto"
              :rules="[rules.required, rules.caixasDiferentes]"
              prepend-inner-icon="mdi-cash-register"
              readonly
              placeholder="Selecione um caixa"
            >
              <template #append-inner>
                <busca-padrao-menu
                  v-model="menuCaixaOrigem"
                  :pesquisar="pesquisarCaixas"
                  :modelInput="termoCaixaOrigem"
                  :resultados="caixaResultados"
                  @update:modelInput="termoCaixaOrigem = $event"
                  @selecionar="selecionarCaixaOrigem"
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

          <!-- Caixa Destino -->
          <v-col cols="12" md="4">
            <v-text-field
              label="Caixa Destino *"
              v-model="caixaDestinoSelecionado"
              variant="outlined"
              density="compact"
              hide-details="auto"
              :rules="[rules.required, rules.caixasDiferentes]"
              prepend-inner-icon="mdi-cash-register"
              readonly
              placeholder="Selecione um caixa"
            >
              <template #append-inner>
                <busca-padrao-menu
                  v-model="menuCaixaDestino"
                  :pesquisar="pesquisarCaixas"
                  :modelInput="termoCaixaDestino"
                  :resultados="caixaResultados"
                  @update:modelInput="termoCaixaDestino = $event"
                  @selecionar="selecionarCaixaDestino"
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

          <!-- Histórico -->
          <v-col cols="4">
            <v-text-field
              label="Histórico *"
              v-model="historicoSelecionado"
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
                  v-model="menuHistorico"
                  :pesquisar="pesquisarHistoricos"
                  :modelInput="termoHistorico"
                  :resultados="historicoResultados"
                  @update:modelInput="termoHistorico = $event"
                  @selecionar="selecionarHistorico"
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
import { useCaixaStore } from '@/stores/APIs/caixa'
import { useConfigParfinStore } from '@/stores/APIs/config'
import { useFinanceiroStore } from '@/stores/APIs/financeiro'

// eslint-disable-next-line no-undef
const emit = defineEmits(['sucesso'])

const caixaStore = useCaixaStore()
const configStore = useConfigParfinStore()
const financeiroStore = useFinanceiroStore()
const formRef = ref(null)
const formValido = ref(false)
const loading = ref(false)

// Caixa Origem
const menuCaixaOrigem = ref(false)
const termoCaixaOrigem = ref('')
const caixaOrigemSelecionado = ref('')

// Caixa Destino
const menuCaixaDestino = ref(false)
const termoCaixaDestino = ref('')
const caixaDestinoSelecionado = ref('')

// Caixa Resultados (compartilhado)
const caixaResultados = ref([])

// Histórico
const menuHistorico = ref(false)
const termoHistorico = ref('')
const historicoResultados = ref([])
const historicoSelecionado = ref('')

// Tipo Documento
const tipoDocumentoSelecionado = ref('')

// Tipo Pagamento
const menuTipoPagamento = ref(false)
const termoTipoPagamento = ref('')
const tipoPagamentoResultados = ref([])
const tipoPagamentoSelecionado = ref('')

// Histórico Contábil Caixa
const menuHistoricoContabilCaixa = ref(false)
const termoHistoricoContabilCaixa = ref('')
const historicoContabilCaixaResultados = ref([])
const historicoContabilCaixaSelecionado = ref('')

const formData = reactive({
  id_caixa_origem: null,
  id_caixa_destino: null,
  data_movimento: new Date().toISOString().split('T')[0],
  valor: null,
  tipo_documento: null,
  numero_documento: null,
  id_historico: null,
  id_tipopagrec: null,
  observacoes: null,
  // Campos contábeis
  id_reduzido_ctb_caixa_origem: null,
  id_reduzido_ctb_caixa_destino: null,
  id_hist_contabil_caixa: null
})

const rules = {
  required: (value) => !!value || 'Campo obrigatório',
  valorPositivo: (value) => (value && parseFloat(value) > 0) || 'Valor deve ser maior que zero',
  caixasDiferentes: () => {
    if (formData.id_caixa_origem && formData.id_caixa_destino) {
      return formData.id_caixa_origem !== formData.id_caixa_destino || 
        'Caixas de origem e destino devem ser diferentes'
    }
    return true
  }
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

const pesquisarHistoricos = async () => {
  try {
    const historicos = await configStore.buscarHistoricoCaixa()
    historicoResultados.value = Array.isArray(historicos) ? historicos : (historicos?.data || [])
  } catch (error) {
    console.error('Erro ao pesquisar históricos:', error)
    historicoResultados.value = []
  }
}

const selecionarCaixaOrigem = (caixa) => {
  if (caixa) {
    formData.id_caixa_origem = caixa.id_caixa || caixa.id
    formData.id_reduzido_ctb_caixa_origem = caixa.id_reduzido_ctb_caixa || null
    formData.id_hist_contabil_caixa = caixa.id_hist_contabil
    caixaOrigemSelecionado.value = caixa.desccaixa || caixa.nomecaixa || caixa.nome
  }
}

const selecionarCaixaDestino = (caixa) => {
  if (caixa) {
    formData.id_caixa_destino = caixa.id_caixa || caixa.id
    formData.id_reduzido_ctb_caixa_destino = caixa.id_reduzido_ctb_caixa || null
    if (!formData.id_hist_contabil_caixa) {
      formData.id_hist_contabil_caixa = caixa.id_hist_contabil
    }
    caixaDestinoSelecionado.value = caixa.desccaixa || caixa.nomecaixa || caixa.nome
  }
}


const selecionarHistorico = (historico) => {
  if (historico) {
    formData.id_historico = historico.id
    historicoSelecionado.value = historico.deschistorico || historico.descricao
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

const selecionarHistoricoContabilCaixa = (historico) => {
  if (historico) {
    formData.id_hist_contabil_caixa = historico.id
    historicoContabilCaixaSelecionado.value = historico.deschistorico || historico.descricao
  }
}

const preencherObservacao = () => {
  if (!formData.observacoes || formData.observacoes.trim() === '') {
    const origem = caixaOrigemSelecionado.value || 'N/A'
    const destino = caixaDestinoSelecionado.value || 'N/A'
    const valor = formData.valor ? `R$ ${formData.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'R$ 0,00'
    
    formData.observacoes = `CAIXA -> CAIXA "${origem}" para "${destino}": ${valor}`
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
        id_caixa_origem: formData.id_caixa_origem,
        id_caixa_destino: formData.id_caixa_destino,
        id_historico_caixa: formData.id_historico,
        id_hist_contabil_caixa: formData.id_hist_contabil_caixa,
        id_reduzido_ctb_caixa_origem: formData.id_reduzido_ctb_caixa_origem,
        id_reduzido_ctb_caixa_destino: formData.id_reduzido_ctb_caixa_destino,
        tipo_transf: 3, // Intercaixa
        tipo_documento: formData.tipo_documento,
        nrdocumento: formData.numero_documento,
        id_tipopagrec: formData.id_tipopagrec,
        dtlancamento: formData.data_movimento,
        valor: formData.valor,
        observacao: formData.observacoes || '',
        origem: 'M'
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
    id_caixa_origem: null,
    id_caixa_destino: null,
    data_movimento: new Date().toISOString().split('T')[0],
    valor: null,
    tipo_documento: null,
    numero_documento: null,
    id_historico: null,    id_tipopagrec: null,    observacoes: null
  })
  caixaOrigemSelecionado.value = ''
  caixaDestinoSelecionado.value = ''
  historicoSelecionado.value = ''
  tipoDocumentoSelecionado.value = ''
  tipoPagamentoSelecionado.value = ''
  historicoContabilCaixaSelecionado.value = ''
  formRef.value?.resetValidation()
}

// Carregar dados ao montar o componente
onMounted(() => {
  pesquisarCaixas()
  pesquisarHistoricos()
  pesquisarTipoPagamento()
  pesquisarHistoricosContabilCaixa()
})
</script>

<style scoped>
.background-card {
  background-color: var(--bg-card);
  color: var(--text-color);
}
</style>
