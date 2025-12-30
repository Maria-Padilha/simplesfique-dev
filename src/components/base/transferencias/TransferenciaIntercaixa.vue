<template>
  <v-card class="background-card" elevation="2">
    <v-card-title class="text-h6 pa-4">
      <v-icon icon="mdi-cash-sync" class="mr-2"></v-icon>
      Transferência Intercaixa
    </v-card-title>
    <v-card-text class="pa-4">
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

          <!-- Operador -->
          <v-col cols="12" md="4">
            <v-text-field
              label="Operador *"
              v-model="operadorSelecionado"
              variant="outlined"
              density="compact"
              hide-details="auto"
              :rules="[rules.required]"
              prepend-inner-icon="mdi-account"
              readonly
              placeholder="Selecione um operador"
            >
              <template #append-inner>
                <busca-padrao-menu
                  v-model="menuOperador"
                  :pesquisar="pesquisarOperadores"
                  :modelInput="termoOperador"
                  :resultados="operadorResultados"
                  @update:modelInput="termoOperador = $event"
                  @selecionar="selecionarOperador"
                >
                  <template #resultados="{ selecionar }">
                    <v-virtual-scroll
                      :items="operadorResultados"
                      :height="120"
                      item-height="42"
                      class="mt-3"
                    >
                      <template #default="{ item }">
                        <div
                          class="hover:bg-surface-variant rounded-md px-3 py-2 cursor-pointer"
                          @click="selecionar(item)"
                        >
                          <p class="text-body-1">{{ item.nome || item.login }}</p>
                        </div>
                      </template>
                    </v-virtual-scroll>
                  </template>
                </busca-padrao-menu>
              </template>
            </v-text-field>
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
import { useConfigParfinStore } from '@/stores/APIs/config'
import { useFinanceiroStore } from '@/stores/APIs/financeiro'

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

// Operador
const menuOperador = ref(false)
const termoOperador = ref('')
const operadorResultados = ref([])
const operadorSelecionado = ref('')

// Histórico
const menuHistorico = ref(false)
const termoHistorico = ref('')
const historicoResultados = ref([])
const historicoSelecionado = ref('')

// Tipo Documento
const tipoDocumentoSelecionado = ref('')

const formData = reactive({
  id_caixa_origem: null,
  id_caixa_destino: null,
  data_movimento: new Date().toISOString().split('T')[0],
  valor: null,
  id_operador: null,
  tipo_documento: null,
  id_historico: null,
  observacoes: null,
  // Campos contábeis
  id_reduzido_ctb_caixa_origem: null,
  id_reduzido_ctb_caixa_destino: null,
  id_hist_contabil_caixa: null
})

const snackbar = reactive({
  show: false,
  message: '',
  color: 'success'
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

const pesquisarOperadores = async () => {
  try {
    // TODO: Implementar busca de operadores/usuários
    // const idEmpresa = localStorage.getItem('id_empresa')
    operadorResultados.value = []
  } catch (error) {
    console.error('Erro ao pesquisar operadores:', error)
    operadorResultados.value = []
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
    caixaOrigemSelecionado.value = caixa.desccaixa || caixa.nomecaixa || caixa.nome
  }
}

const selecionarCaixaDestino = (caixa) => {
  if (caixa) {
    formData.id_caixa_destino = caixa.id_caixa || caixa.id
    caixaDestinoSelecionado.value = caixa.desccaixa || caixa.nomecaixa || caixa.nome
  }
}

const selecionarOperador = (operador) => {
  if (operador) {
    formData.id_operador = operador.id
    operadorSelecionado.value = operador.nome || operador.login
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
        tipo: formData.tipo_documento,
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
    id_caixa_origem: null,
    id_caixa_destino: null,
    data_movimento: new Date().toISOString().split('T')[0],
    valor: null,
    id_operador: null,
    tipo_documento: null,
    id_historico: null,
    observacoes: null
  })
  caixaOrigemSelecionado.value = ''
  caixaDestinoSelecionado.value = ''
  operadorSelecionado.value = ''
  historicoSelecionado.value = ''
  tipoDocumentoSelecionado.value = ''
  formRef.value?.resetValidation()
}

// Carregar dados ao montar o componente
onMounted(() => {
  pesquisarCaixas()
  pesquisarHistoricos()
})
</script>

<style scoped>
.background-card {
  background-color: var(--bg-card);
  color: var(--text-color);
}
</style>
