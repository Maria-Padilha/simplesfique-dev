<template>
  <div class="pa-4">
    <!-- Cabeçalho -->
    <v-card class="background-secondary mb-4">
      <v-card-title class="text-h5 pa-4 d-flex justify-space-between align-center">
        <div class="d-flex align-center">
          <v-icon icon="mdi-cash-register" class="mr-3"></v-icon>
          Abertura de Caixa
        </div>
      </v-card-title>
    </v-card>

    <!-- Card de Resumo do Caixa Aberto -->
    <v-card v-if="caixaAberto" class="background-secondary mb-4" elevation="2">
      <v-card-text class="pa-4">
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-icon icon="mdi-cash-check" size="32" color="success" class="mr-3"></v-icon>
            <div>
              <div class="text-caption text-grey">Caixa Aberto</div>
              <div class="text-h6 font-weight-bold">
                {{ caixaAberto.descricao }}
              </div>
              <div class="text-caption">
                Aberto em: {{ formatarDataHora(caixaAberto.dtabertura) }}
              </div>
            </div>
          </div>
          <div class="text-right">
            <div class="text-caption text-grey">Saldo Inicial</div>
            <div class="text-h5 font-weight-bold" style="color: var(--text-color-laranja)">
              {{ formatarMoeda(caixaAberto.vlrabertura) }}
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>

    <!-- Conteúdo Principal -->
    <v-card :color="themeStore.darkMode ? 'text-white' : ''" class="background-secondary">
      <v-card-text class="pa-4">
        <BotaoExpandTransition
          :formulario-aberto="formularioAberto"
          texto-abrir="Abrir Novo Caixa"
          texto-fechar="Cancelar"
          @toggle="toggleFormulario"
        />

        <!-- Formulário de Abertura -->
        <v-expand-transition>
          <div v-if="formularioAberto">
            <v-card class="background-card mb-7" elevation="2">
              <v-card-title class="text-h6 pa-4">
                <v-icon icon="mdi-cash-plus" class="mr-2"></v-icon>
                Abertura de Caixa
              </v-card-title>

              <v-card-text class="pa-4">
                <v-form ref="formRef" v-model="formValido">
                  <v-row>
                    <!-- Caixa -->
                    <v-col cols="12" md="6">
                      <v-autocomplete
                        v-model="formData.id_caixa"
                        :items="caixasDisponiveis"
                        :loading="loadingCaixas"
                        item-title="descricao"
                        item-value="id"
                        label="Caixa *"
                        :rules="[rules.required]"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-cash-register"
                        no-data-text="Nenhum caixa disponível"
                      >
                        <template v-slot:item="{ props, item }">
                          <v-list-item v-bind="props">
                            <template v-slot:prepend>
                              <v-icon 
                                :icon="item.raw.status === 'A' ? 'mdi-check-circle' : 'mdi-lock'" 
                                :color="item.raw.status === 'A' ? 'success' : 'grey'"
                              ></v-icon>
                            </template>
                            <v-list-item-title>{{ item.raw.descricao }}</v-list-item-title>
                            <v-list-item-subtitle>
                              {{ item.raw.status === 'A' ? 'Ativo' : 'Inativo' }} | 
                              Usuário: {{ item.raw.usuario || 'Não atribuído' }}
                            </v-list-item-subtitle>
                          </v-list-item>
                        </template>
                      </v-autocomplete>
                    </v-col>

                    <!-- Data de Abertura -->
                    <v-col cols="12" md="3">
                      <v-text-field
                        v-model="formData.dtabertura"
                        label="Data de Abertura *"
                        type="date"
                        :rules="[rules.required]"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-calendar"
                      ></v-text-field>
                    </v-col>

                    <!-- Hora de Abertura -->
                    <v-col cols="12" md="3">
                      <v-text-field
                        v-model="formData.hrabertura"
                        label="Hora de Abertura *"
                        type="time"
                        :rules="[rules.required]"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-clock-outline"
                      ></v-text-field>
                    </v-col>

                    <!-- Suprimento -->
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="formData.vlrabertura"
                        label="Suprimento *"
                        :rules="[rules.required, rules.valorPositivo]"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-currency-usd"
                        prefix="R$"
                        type="number"
                        step="0.01"
                      ></v-text-field>
                    </v-col>

                    <!-- Conta Corrente -->
                    <v-col cols="12" md="8">
                      <v-autocomplete
                        v-model="formData.id_ccorrente"
                        :items="contasCorrentes"
                        :loading="loadingContas"
                        item-title="descricao_completa"
                        item-value="id_ccorrente"
                        label="Conta Corrente"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-bank"
                        clearable
                        no-data-text="Nenhuma conta disponível"
                      >
                        <template v-slot:item="{ props, item }">
                          <v-list-item v-bind="props">
                            <v-list-item-title>{{ item.raw.titular }}</v-list-item-title>
                            <v-list-item-subtitle>
                              Banco: {{ item.raw.nome_banco || 'N/A' }} | 
                              Ag: {{ item.raw.agencia }} | 
                              CC: {{ item.raw.numero_conta }}-{{ item.raw.digito_cc }}
                            </v-list-item-subtitle>
                          </v-list-item>
                        </template>
                      </v-autocomplete>
                    </v-col>

                    <!-- Observações -->
                    <v-col cols="12">
                      <v-textarea
                        v-model="formData.observacao"
                        label="Observações"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-note-text"
                        rows="3"
                        maxlength="500"
                        counter
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>

              <v-card-actions class="pa-4">
                <v-spacer></v-spacer>
                <v-btn color="grey" variant="text" @click="cancelarFormulario">
                  Cancelar
                </v-btn>
                <v-btn
                  color="var(--text-color-laranja)"
                  :loading="loading"
                  :disabled="!formValido"
                  @click="abrirCaixa"
                  variant="flat"
                  class="text-white"
                >
                  <v-icon start>mdi-cash-check</v-icon>
                  Abrir Caixa
                </v-btn>
              </v-card-actions>
            </v-card>
          </div>
        </v-expand-transition>

        <!-- Tabela de Aberturas -->
        <TabelaPadrao
          :formulario-aberto="formularioAberto"
          :headers="headers"
          :items="aberturasFiltradasComputadas"
          :loading="loading"
          :search="search"
          @update:search="(value) => search = value"
          search-label="Pesquisar abertura de caixa"
          item-key="id"
          no-data-icon="mdi-cash-register"
          no-data-text="Nenhuma abertura de caixa registrada"
          delete-item-display-field="descricao_caixa"
          @confirm-delete="fecharCaixa"
          :show-edit="false"
          :show-delete="true"
          delete-icon="mdi-cash-lock"
          delete-tooltip="Fechar Caixa"
        >
          <!-- Coluna de Status -->
          <template v-slot:[`item.status`]="{ item }">
            <v-chip
              :color="item.status === 'A' ? 'success' : 'grey'"
              variant="tonal"
              size="small"
            >
              <v-icon start size="small">
                {{ item.status === 'A' ? 'mdi-lock-open' : 'mdi-lock' }}
              </v-icon>
              {{ item.status === 'A' ? 'Aberto' : 'Fechado' }}
            </v-chip>
          </template>

          <!-- Coluna de Data/Hora Abertura -->
          <template v-slot:[`item.dtabertura`]="{ item }">
            <div>
              <div>{{ formatarData(item.dtabertura) }}</div>
              <div class="text-caption text-grey">{{ item.hrabertura || '--:--' }}</div>
            </div>
          </template>

          <!-- Coluna de Data/Hora Fechamento -->
          <template v-slot:[`item.dtfechamento`]="{ item }">
            <div v-if="item.dtfechamento">
              <div>{{ formatarData(item.dtfechamento) }}</div>
              <div class="text-caption text-grey">{{ item.hrfechamento || '--:--' }}</div>
            </div>
            <div v-else class="text-grey">--</div>
          </template>

          <!-- Coluna de Valor Abertura -->
          <template v-slot:[`item.vlrabertura`]="{ item }">
            <span class="font-weight-bold" style="color: var(--text-color-laranja)">
              {{ formatarMoeda(item.vlrabertura) }}
            </span>
          </template>

          <!-- Coluna de Valor Fechamento -->
          <template v-slot:[`item.vlrfechamento`]="{ item }">
            <span v-if="item.vlrfechamento !== null && item.vlrfechamento !== undefined" class="font-weight-bold">
              {{ formatarMoeda(item.vlrfechamento) }}
            </span>
            <span v-else class="text-grey">--</span>
          </template>
        </TabelaPadrao>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useThemeStore } from '@/stores/config-temas/theme'
import { useFinanceiroStore } from '@/stores/APIs/financeiro'
import BotaoExpandTransition from '@/components/base/padrao-paginas/BotaoExpandTransition.vue'
import TabelaPadrao from '@/components/base/padrao-paginas/TabelaPadrao.vue'

const themeStore = useThemeStore()
const financeiroStore = useFinanceiroStore()

// Estado
const formularioAberto = ref(false)
const formValido = ref(false)
const formRef = ref(null)
const search = ref('')
const loading = ref(false)
const loadingCaixas = ref(false)
const loadingContas = ref(false)

// Dados
const caixasDisponiveis = ref([])
const contasCorrentes = ref([])
const aberturas = ref([])
const caixaAberto = ref(null)

// Formulário
const formData = reactive({
  id_caixa: null,
  dtabertura: new Date().toISOString().split('T')[0],
  hrabertura: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
  vlrabertura: 0,
  id_ccorrente: null,
  observacao: ''
})

// Regras de validação
const rules = {
  required: (value) => {
    if (value === null || value === undefined || value === '') return 'Campo obrigatório'
    return true
  },
  valorPositivo: (value) => {
    if (value === null || value === undefined || value === '') return 'Campo obrigatório'
    if (parseFloat(value) < 0) return 'Valor deve ser positivo'
    return true
  }
}

// Headers da tabela
const headers = [
  { title: 'ID', key: 'id', sortable: true },
  { title: 'Caixa', key: 'descricao_caixa', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Abertura', key: 'dtabertura', sortable: true },
  { title: 'Fechamento', key: 'dtfechamento', sortable: true },
  { title: 'Vlr. Abertura', key: 'vlrabertura', sortable: true },
  { title: 'Vlr. Fechamento', key: 'vlrfechamento', sortable: true },
  { title: 'Usuário', key: 'usuario', sortable: true },
  { title: 'Ações', key: 'actions', sortable: false }
]

// Computed
const aberturasFiltradasComputadas = computed(() => {
  const dados = aberturas.value || []
  return Array.isArray(dados) ? dados : []
})

// Métodos de formatação
const formatarMoeda = (valor) => {
  if (valor === null || valor === undefined) return 'R$ 0,00'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor)
}

const formatarData = (data) => {
  if (!data) return '--'
  try {
    return new Date(data).toLocaleDateString('pt-BR')
  } catch {
    return '--'
  }
}

const formatarDataHora = (data) => {
  if (!data) return '--'
  try {
    return new Date(data).toLocaleString('pt-BR')
  } catch {
    return '--'
  }
}

// Métodos de ação
const toggleFormulario = () => {
  formularioAberto.value = !formularioAberto.value
  if (!formularioAberto.value) {
    limparFormulario()
  }
}

const cancelarFormulario = () => {
  limparFormulario()
  formularioAberto.value = false
}

const limparFormulario = () => {
  Object.assign(formData, {
    id_caixa: null,
    dtabertura: new Date().toISOString().split('T')[0],
    hrabertura: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    vlrabertura: 0,
    id_ccorrente: null,
    observacao: ''
  })
  if (formRef.value) {
    formRef.value.resetValidation()
  }
}

// Carregar dados
const carregarCaixas = async () => {
  loadingCaixas.value = true
  try {
    const idEmpresa = localStorage.getItem('idEmpresa')
    if (!idEmpresa) {
      return
    }
    
    const dados = await financeiroStore.buscarCaixas(idEmpresa)
    caixasDisponiveis.value = Array.isArray(dados) ? dados : []
  } catch (error) {
    console.error('Erro ao carregar caixas:', error)
    caixasDisponiveis.value = []
  } finally {
    loadingCaixas.value = false
  }
}

const carregarContasCorrentes = async () => {
  loadingContas.value = true
  try {
    const dados = await financeiroStore.buscarContas()
    
    // Formatar descrição completa para melhor visualização
    contasCorrentes.value = Array.isArray(dados) ? dados.map(conta => ({
      ...conta,
      descricao_completa: `${conta.titular || 'Sem titular'} - ${conta.numero_conta || 'N/A'}-${conta.digito_cc || ''}`
    })) : []
  } catch (error) {
    console.error('Erro ao carregar contas correntes:', error)
    contasCorrentes.value = []
  } finally {
    loadingContas.value = false
  }
}

const carregarAberturas = async () => {
  loading.value = true
  try {
    const idEmpresa = localStorage.getItem('idEmpresa')
    if (!idEmpresa) {
      return
    }
    
    // Buscar usuários vinculados aos caixas (GET /caixausu/:idempresa/id/:id)
    const aberturasTemp = []
    
    for (const caixa of caixasDisponiveis.value) {
      if (caixa.id) {
        try {
          const usuarios = await financeiroStore.buscarUsuariosPorCaixa(idEmpresa, caixa.id)
          
          // Normalizar resposta
          let dadosUsuario = null
          if (usuarios && usuarios.data) {
            dadosUsuario = usuarios.data
          } else if (Array.isArray(usuarios) && usuarios.length > 0) {
            dadosUsuario = usuarios[0]
          } else if (usuarios && typeof usuarios === 'object') {
            dadosUsuario = usuarios
          }
          
          // Criar registro de abertura com dados do caixa e usuário
          if (dadosUsuario) {
            aberturasTemp.push({
              id: caixa.id,
              descricao_caixa: caixa.descricao || caixa.nome || '',
              status: caixa.status || 'I',
              dtabertura: caixa.dtabertura || null,
              hrabertura: caixa.hrabertura || null,
              dtfechamento: caixa.dtfechamento || null,
              hrfechamento: caixa.hrfechamento || null,
              vlrabertura: caixa.vlrabertura || 0,
              vlrfechamento: caixa.vlrfechamento || null,
              usuario: dadosUsuario.nome || dadosUsuario.email || 'N/A',
              id_usuario: dadosUsuario.id || null,
              ativo_usuario: dadosUsuario.ativo || 'N'
            })
          }
        } catch (err) {
          console.error(`Erro ao buscar usuário do caixa ${caixa.id}:`, err)
        }
      }
    }
    
    aberturas.value = aberturasTemp
    
    // Verificar se há caixa aberto
    const caixasAbertas = aberturas.value.filter(a => a.status === 'A')
    caixaAberto.value = caixasAbertas.length > 0 ? caixasAbertas[0] : null
  } catch (error) {
    console.error('Erro ao carregar aberturas:', error)
    aberturas.value = []
  } finally {
    loading.value = false
  }
}

// Abrir caixa
const abrirCaixa = async () => {
  if (!formValido.value) {
    return
  }

  loading.value = true
  try {
    const idEmpresa = localStorage.getItem('idEmpresa')
    if (!idEmpresa) {
      return
    }

    // TODO: Implementar endpoint POST /caixaabertura
    // Montar payload
    // const payload = {
    //   data: [{
    //     id_empresa: parseInt(idEmpresa),
    //     id_caixa: formData.id_caixa,
    //     dtabertura: formData.dtabertura,
    //     hrabertura: formData.hrabertura,
    //     vlrabertura: parseFloat(formData.vlrabertura),
    //     id_ccorrente: formData.id_ccorrente || null,
    //     observacao: formData.observacao || null,
    //     status: 'A' // A = Aberto
    //   }]
    // }
    // await financeiroStore.criarAberturaCaixa(payload)
    
    cancelarFormulario()
    await carregarAberturas()
  } catch (error) {
    console.error('Erro ao abrir caixa:', error)
  } finally {
    loading.value = false
  }
}

// Fechar caixa
const fecharCaixa = async () => {
  loading.value = true
  try {
    const idEmpresa = localStorage.getItem('idEmpresa')
    if (!idEmpresa) {
      return
    }

    // TODO: Implementar endpoint PUT /caixaabertura/:idempresa/id/:id para fechamento
    // const payload = {
    //   data: [{
    //     dtfechamento: new Date().toISOString().split('T')[0],
    //     hrfechamento: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    //     status: 'F' // F = Fechado
    //   }]
    // }
    // await financeiroStore.fecharCaixa(idEmpresa, item.id, payload)
    
    await carregarAberturas()
  } catch (error) {
    console.error('Erro ao fechar caixa:', error)
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    carregarCaixas(),
    carregarContasCorrentes(),
    carregarAberturas()
  ])
})
</script>

<style scoped>
/* Estilos específicos se necessário */
</style>
