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
                    <v-col cols="12" md="3">
                      <v-autocomplete
                        v-model="formData.id_caixa"
                        :items="caixasDisponiveis"
                        :loading="loadingCaixas"
                        item-title="desccaixa"
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
                            <v-list-item-title>{{ item.raw.desccaixa }}</v-list-item-title>
                            <v-list-item-subtitle>
                              {{ item.raw.status === 'A' ? 'Ativo' : 'Inativo' }} | 
                              Participa Fluxo: {{ item.raw.participa_fluxo === 'S' ? 'Sim' : 'Não' }}
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
                    <v-col cols="12" md="3">
                      <v-text-field
                        v-model="formData.vlrabertura"
                        label="Valor Inicial *"
                        :rules="[rules.required, rules.valorPositivo]"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-currency-usd"
                        prefix="R$"
                        type="number"
                        step="0.01"
                      ></v-text-field>
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
import { useCaixaStore } from '@/stores/APIs/caixa'
import { useEmpresaStore } from '@/stores/APIs/empresa'
import BotaoExpandTransition from '@/components/base/padrao-paginas/BotaoExpandTransition.vue'
import TabelaPadrao from '@/components/base/padrao-paginas/TabelaPadrao.vue'

const themeStore = useThemeStore()
const caixaStore = useCaixaStore()
const empresaStore = useEmpresaStore()

// Estado
const formularioAberto = ref(false)
const formValido = ref(false)
const formRef = ref(null)
const search = ref('')
const loading = ref(false)
const loadingCaixas = ref(false)

// Dados
const caixasDisponiveis = ref([])
const aberturas = ref([])
const caixaAberto = ref(null)
const historicoMovimentacao = ref([])

// Formulário
const formData = reactive({
  id_caixa: null,
  dtabertura: new Date().toISOString().split('T')[0],
  hrabertura: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
  vlrabertura: 0,
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
  })
  if (formRef.value) {
    formRef.value.resetValidation()
  }
}

// Carregar dados
const carregarDadosAuxiliares = async () => {
  try {
    // Garantir que a empresa está carregada
    if (!empresaStore.empresa?.id && !empresaStore.empresaSelecionada?.id) {
      empresaStore.carregarEmpresaSelecionada()
    }
    
    const idEmpresa = empresaStore.empresa?.id || empresaStore.empresaSelecionada?.id
    
    if (!idEmpresa) {
      console.warn('ID da empresa não encontrado')
      return
    }

    // Carregar histórico de movimentação (aberturas de caixa)
    const response = await caixaStore.buscarHistoricoMovimentacao(idEmpresa)
    const dadosHistorico = response?.data || []
    historicoMovimentacao.value = Array.isArray(dadosHistorico) ? dadosHistorico : []
    
    console.log('Histórico de movimentação carregado:', historicoMovimentacao.value)

    // Carregar caixas ativos do usuário
    const dadosCaixas = await caixaStore.buscarCaixasUsuarioAtivo(idEmpresa)
    caixasDisponiveis.value = Array.isArray(dadosCaixas) ? dadosCaixas : []


    // Processar histórico como aberturas de caixa
    aberturas.value = historicoMovimentacao.value.map(abertura => ({
      id: abertura.id,
      descricao_caixa: abertura.descricao_caixa || abertura.descricao || '',
      status: abertura.status || 'I',
      dtabertura: abertura.dtabertura || null,
      hrabertura: abertura.hrabertura || null,
      dtfechamento: abertura.dtfechamento || null,
      hrfechamento: abertura.hrfechamento || null,
      vlrabertura: abertura.vlrabertura || 0,
      vlrfechamento: abertura.vlrfechamento || null,
      usuario: abertura.usuario || abertura.nome_usuario || 'N/A',
      id_usuario: abertura.id_usuario || null,
      id_caixa: abertura.id_caixa || null
    }))
    
    // Verificar se há caixa aberto
    const caixasAbertas = aberturas.value.filter(a => a.status === 'A')
    caixaAberto.value = caixasAbertas.length > 0 ? caixasAbertas[0] : null
    
    console.log('Aberturas carregadas:', aberturas.value)
  } catch (error) {
    console.error('Erro ao carregar dados auxiliares:', error)
  }
}

// Abrir caixa
const abrirCaixa = async () => {
  if (!formValido.value) {
    return
  }

  loading.value = true
  try {
    const idEmpresa = empresaStore.empresa?.id || empresaStore.empresaSelecionada?.id
    if (!idEmpresa) {
      console.error('ID da empresa não encontrado!')
      return
    }

    if (!formData.id_caixa) {
      console.error('ID do caixa não selecionado!')
      return
    }

    // Montar payload
    const payload = {
      data: [{
        dtabertura: formData.dtabertura,
        horaabertura: formData.hrabertura,
        saldoinicial: parseFloat(formData.vlrabertura)
      }]
    }

    const resultado = await caixaStore.abrirCaixa(idEmpresa, formData.id_caixa, payload)
    
    if (resultado) {
      cancelarFormulario()
      await carregarDadosAuxiliares()
    }
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
    const idEmpresa = empresaStore.empresa?.id || empresaStore.empresaSelecionada?.id
    if (!idEmpresa) {
      console.error('ID da empresa não encontrado!')
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
    
    await carregarDadosAuxiliares()
  } catch (error) {
    console.error('Erro ao fechar caixa:', error)
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(async () => {
  await carregarDadosAuxiliares()
})
</script>

<style scoped>
/* Estilos específicos se necessário */
</style>
