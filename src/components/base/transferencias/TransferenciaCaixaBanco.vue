<template>
  <v-card class="background-card" elevation="2">
    <v-card-title class="text-h6 pa-4">
      <v-icon icon="mdi-cash-fast" class="mr-2"></v-icon>
      Transferência Caixa / Banco
    </v-card-title>
    <v-card-text class="pa-4">
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
                          <p class="text-body-1">{{ item.titular }} - Conta: {{ item.numero_ccorrente }}</p>
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
    </v-card-actions>

    <!-- Snackbar de Feedback -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
      location="top"
    >
      {{ snackbar.message }}
    </v-snackbar>
  </v-card>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import BuscaPadraoMenu from '@/components/base/menu/BuscaPadraoMenu.vue'
import TipoDocumentoMenu from '@/components/base/menu/TipoDocumentoMenu.vue'
import { useCaixaStore } from '@/stores/APIs/caixa'
import { useFinanceiroStore } from '@/stores/APIs/financeiro'
import { useConfigParfinStore } from '@/stores/APIs/config'

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

const formData = reactive({
  id_caixa: null,
  id_conta_corrente: null,
  data_movimento: new Date().toISOString().split('T')[0],
  data_compensacao: null,
  valor: null,
  tipo_documento: null,
  numero_documento: null,
  id_historico_caixa: null,
  id_historico_banco: null,
  observacoes: null,
  // Campos contábeis
  id_reduzido_ctb_caixa_origem: null,
  id_reduzido_ctb_banco_destino: null,
  id_hist_contabil_caixa: null,
  id_hist_contabil_banco: null
})

const snackbar = reactive({
  show: false,
  message: '',
  color: 'success'
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
    caixaSelecionado.value = caixa.desccaixa || caixa.nomecaixa || caixa.nome
  }
}

const selecionarBanco = (banco) => {
  if (banco) {
    formData.id_conta_corrente = banco.id
    bancoSelecionado.value = `${banco.titular} - Conta: ${banco.numero_ccorrente}`
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

const executarTransferencia = async () => {
  if (!formRef.value.validate()) return

  loading.value = true
  try {
    const empresaSelecionada = JSON.parse(localStorage.getItem('empresaSelecionada') || '{}')
    const idEmpresa = empresaSelecionada?.id || localStorage.getItem('empresa')
    
    const payload = {
      data: [{
        id_empresa: idEmpresa,
        id_caixa_origem: formData.id_caixa,
        id_ccorrente_destino: formData.id_conta_corrente,
        id_historico_caixa: formData.id_historico_caixa,
        id_historico_banco: formData.id_historico_banco,
        id_hist_contabil_caixa: formData.id_hist_contabil_caixa,
        id_hist_contabil_banco: formData.id_hist_contabil_banco,
        id_reduzido_ctb_caixa_origem: formData.id_reduzido_ctb_caixa_origem,
        id_reduzido_ctb_banco_destino: formData.id_reduzido_ctb_banco_destino,
        tipo_transf: 4, // Caixa/Banco
        tipo: formData.tipo_documento,
        nrdocumento: formData.numero_documento,
        dtlancamento: formData.data_movimento,
        valor: formData.valor,
        observacao: formData.observacoes || '',
        origem: 'M'
      }]
    }

    await financeiroStore.realizarTransferencia(payload)
    
    snackbar.message = 'Transferência realizada com sucesso!'
    snackbar.color = 'success'
    snackbar.show = true
    limparFormulario()
  } catch (error) {
    snackbar.message = error.message || 'Erro ao realizar transferência'
    snackbar.color = 'error'
    snackbar.show = true
  } finally {
    loading.value = false
  }
}

const limparFormulario = () => {
  Object.assign(formData, {
    id_caixa: null,
    id_conta_corrente: null,
    data_movimento: new Date().toISOString().split('T')[0],
    data_compensacao: null,
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
  formRef.value?.resetValidation()
}

// Carregar dados ao montar o componente
onMounted(() => {
  pesquisarCaixas()
  pesquisarBancos()
  pesquisarHistoricosCaixa()
  pesquisarHistoricosBanco()
})
</script>

<style scoped>
.background-card {
  background-color: var(--bg-card);
  color: var(--text-color);
}
</style>
