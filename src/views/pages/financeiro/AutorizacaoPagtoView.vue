<template>
  <div class="pa-4">
    <!-- Cabeçalho -->
    <v-card class="background-secondary mb-4">
      <v-card-title class="text-h5 pa-4 d-flex justify-space-between align-center">
        <div class="d-flex align-center">
          <v-icon icon="mdi-shield-check" class="mr-3"></v-icon>
          Autorização de Pagamentos
        </div>
      </v-card-title>
    </v-card>

    <!-- Card com Total das Autorizações -->
    <v-card class="background-secondary mb-4" elevation="2">
      <v-card-text class="pa-4">
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-icon icon="mdi-cash-multiple" size="32" color="var(--text-color-laranja)" class="mr-3"></v-icon>
            <div>
              <div class="text-caption text-grey">Total a Autorizar</div>
              <div class="text-h5 font-weight-bold" style="color: var(--text-color-laranja)">
                {{ formatarMoeda(totalAutorizacoesFiltradas) }}
              </div>
            </div>
          </div>
          <v-chip color="var(--text-color-laranja)" variant="tonal">
            {{ autorizacoesFiltradas.length }} {{ autorizacoesFiltradas.length === 1 ? 'conta' : 'contas' }}
          </v-chip>
        </div>
      </v-card-text>
    </v-card>

    <!-- Lista de Autorizações -->
    <v-card :color="themeStore.darkMode ? 'text-white' : ''" class="background-secondary">
      <v-card-text class="pa-4">
        <!-- Busca Avançada -->
        <div class="my-4">
          <BuscaAvancadaAutorizacao
            v-model="filtrosAvancados"
            @aplicar="aplicarFiltrosAvancados"
          />
        </div>

        <!-- Ações em Lote -->
        <v-row class="mb-4">
          <v-col cols="12">
            <div class="d-flex align-center gap-3">
              <v-btn
                :disabled="itensSelecionados.length === 0"
                color="var(--text-color-laranja)"
                variant="flat"
                prepend-icon="mdi-check-all"
                @click="autorizarSelecionados"
                class="text-white"
              >
                Autorizar Selecionados ({{ itensSelecionados.length }})
              </v-btn>
              
              <v-btn
                :disabled="itensSelecionados.length === 0"
                color="var(--text-color-laranja)"
                variant="outlined"
                prepend-icon="mdi-close-circle"
                @click="rejeitarSelecionados"
              >
                Rejeitar Selecionados ({{ itensSelecionados.length }})
              </v-btn>
              
              <v-btn
                v-if="itensSelecionados.length > 0"
                variant="text"
                prepend-icon="mdi-close"
                @click="limparSelecao"
                color="grey"
              >
                Limpar Seleção
              </v-btn>
              
              <v-spacer></v-spacer>
              
              <v-btn
                variant="text"
                prepend-icon="mdi-select-all"
                @click="selecionarTodos"
                color="var(--text-color-laranja)"
              >
                Selecionar Todos
              </v-btn>
            </div>
          </v-col>
        </v-row>

        <!-- Tabela de Autorizações -->
        <TabelaPadrao
          :formulario-aberto="false"
          :headers="headers"
          :items="autorizacoesFiltradas"
          :loading="loading"
          :search="search"
          @update:search="(value) => search = value"
          search-label="Pesquisar Autorizações"
          item-key="id_parcela"
          no-data-icon="mdi-shield-check"
          no-data-text="Nenhuma autorização encontrada."
          :show-custom-action="false"
          :show-delete="false"
          :show-edit="false"
        >
          <!-- Coluna de Seleção -->
          <template v-slot:[`item.selecionar`]="{ item }">
            <v-checkbox
              :model-value="itensSelecionados.includes(item.id_parcela)"
              @update:model-value="toggleSelecao(item.id_parcela)"
              hide-details
              density="compact"
              color="var(--text-color-laranja)"
            ></v-checkbox>
          </template>

          <!-- Coluna de Data de Emissão -->
          <template v-slot:[`item.dtemissao`]="{ item }">
            <span v-if="item.dtemissao">
              {{ formatarData(item.dtemissao) }}
            </span>
            <span v-else class="text-grey">-</span>
          </template>

          <!-- Coluna de Data de Vencimento -->
          <template v-slot:[`item.dtvencimento`]="{ item }">
            <span v-if="item.dtvencimento">
              {{ formatarData(item.dtvencimento) }}
            </span>
            <span v-else class="text-grey">-</span>
          </template>

          <!-- Coluna Valor Documento -->
          <template v-slot:[`item.vlrdocumento`]="{ item }">
            <span class="font-weight-medium">{{ formatarMoeda(item.vlrdocumento) }}</span>
          </template>

          <!-- Coluna Valor Parcela -->
          <template v-slot:[`item.vlrparcela`]="{ item }">
            <span class="font-weight-medium">{{ formatarMoeda(item.vlrparcela) }}</span>
          </template>

          <!-- Ações personalizadas -->
          <template v-slot:[`item.actions`]="{ item }">
            <div class="d-flex gap-1">
              <!-- Visualizar -->
              <v-btn
                icon="mdi-eye"
                size="small"
                color="var(--text-secondary-laranja)"
                variant="text"
                title="Visualizar"
                @click="visualizarAutorizacao(item)"
              ></v-btn>
            </div>
          </template>
        </TabelaPadrao>
      </v-card-text>
    </v-card>

    <!-- Dialog de Confirmação de Autorização -->
    <v-dialog 
      v-model="dialogAutorizacao.aberto" 
      max-width="500px"
      persistent
    >
      <v-card>
        <v-card-title class="text-h6">
          <v-icon icon="mdi-shield-check" color="var(--text-color-laranja)" class="mr-2"></v-icon>
          Confirmar Autorização
        </v-card-title>
        <v-card-text>
          <div class="mb-4">
            <p class="mb-2">
              {{ Array.isArray(dialogAutorizacao.item) ? 
                 `Deseja autorizar ${dialogAutorizacao.item.length} pagamentos?` : 
                 'Deseja autorizar o pagamento?' }}
            </p>
            <div v-if="Array.isArray(dialogAutorizacao.item)" class="text-body-2 text-grey mb-2">
              <strong>Itens selecionados:</strong> {{ dialogAutorizacao.item.length }}
              <br>
              <strong>Valor total:</strong> {{ formatarMoeda(dialogAutorizacao.item.reduce((total, item) => total + parseFloat(item.vlrparcela || 0), 0)) }}
            </div>
            <div v-else class="text-body-2 text-grey">
              <strong>Documento:</strong> {{ dialogAutorizacao.item?.nrdocumento }}
              <br>
              <strong>Fornecedor:</strong> {{ dialogAutorizacao.item?.fornecedor }}
              <br>
              <strong>Valor:</strong> {{ formatarMoeda(dialogAutorizacao.item?.vlrparcela) }}
            </div>
          </div>
          
          <v-textarea
            v-model="observacaoAutorizacao"
            label="Observação (opcional)"
            variant="outlined"
            density="compact"
            rows="3"
            placeholder="Adicione uma observação para esta autorização..."
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey"
            variant="text"
            @click="dialogAutorizacao.aberto = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="var(--text-color-laranja)"
            variant="flat"
            @click="confirmarAutorizacao"
            :loading="loading"
            class="text-white"
          >
            {{ Array.isArray(dialogAutorizacao.item) ? 
               `Autorizar ${dialogAutorizacao.item.length} itens` : 
               'Autorizar' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog de Confirmação de Rejeição -->
    <v-dialog 
      v-model="dialogRejeicao.aberto" 
      max-width="500px"
      persistent
    >
      <v-card>
        <v-card-title class="text-h6">
          <v-icon icon="mdi-close-circle" color="var(--text-color-laranja)" class="mr-2"></v-icon>
          Confirmar Rejeição
        </v-card-title>
        <v-card-text>
          <div class="mb-4">
            <p class="mb-2">
              {{ Array.isArray(dialogRejeicao.item) ? 
                 `Deseja rejeitar ${dialogRejeicao.item.length} pagamentos?` : 
                 'Deseja rejeitar o pagamento?' }}
            </p>
            <div v-if="Array.isArray(dialogRejeicao.item)" class="text-body-2 text-grey mb-2">
              <strong>Itens selecionados:</strong> {{ dialogRejeicao.item.length }}
              <br>
              <strong>Valor total:</strong> {{ formatarMoeda(dialogRejeicao.item.reduce((total, item) => total + parseFloat(item.vlrparcela || 0), 0)) }}
            </div>
            <div v-else class="text-body-2 text-grey">
              <strong>Documento:</strong> {{ dialogRejeicao.item?.nrdocumento }}
              <br>
              <strong>Fornecedor:</strong> {{ dialogRejeicao.item?.fornecedor }}
              <br>
              <strong>Valor:</strong> {{ formatarMoeda(dialogRejeicao.item?.vlrparcela) }}
            </div>
          </div>
          
          <v-textarea
            v-model="observacaoRejeicao"
            label="Motivo da rejeição *"
            variant="outlined"
            density="compact"
            rows="3"
            :rules="[v => !!v || 'Motivo é obrigatório']"
            placeholder="Informe o motivo da rejeição..."
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey"
            variant="text"
            @click="dialogRejeicao.aberto = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="var(--text-color-laranja)"
            variant="flat"
            @click="confirmarRejeicao"
            :loading="loading"
            class="text-white"
          >
            {{ Array.isArray(dialogRejeicao.item) ? 
               `Rejeitar ${dialogRejeicao.item.length} itens` : 
               'Rejeitar' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar para feedback -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
    >
      {{ snackbar.message }}
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useThemeStore } from '@/stores/config-temas/theme'
import { useFinanceiroStore } from '@/stores/APIs/financeiro'
import { useEmpresaStore } from '@/stores/APIs/empresa'
import TabelaPadrao from '@/components/base/padrao-paginas/TabelaPadrao.vue'
import BuscaAvancadaAutorizacao from '@/components/base/padrao-paginas/BuscaAvancadaAutorizacao.vue'

const themeStore = useThemeStore()
const financeiroStore = useFinanceiroStore()
const empresaStore = useEmpresaStore()

// Refs
const search = ref('')
const loading = ref(false)
const filtrosAvancados = ref({})

// Estado dos dados
const autorizacoes = ref([])
const itensSelecionados = ref([])
const observacaoAutorizacao = ref('')
const observacaoRejeicao = ref('')

// Snackbar
const snackbar = reactive({
  show: false,
  message: '',
  color: 'success'
})

// Dialogs de confirmação
const dialogAutorizacao = reactive({
  aberto: false,
  item: null
})

const dialogRejeicao = reactive({
  aberto: false,
  item: null
})

// Headers da tabela (igual PagarView)
const headers = [
  { title: 'Selecionar', key: 'selecionar', sortable: false, width: '100px' },
  { title: 'Documento', key: 'nrdocumento', sortable: true },
  { title: 'Série', key: 'serie', sortable: true },
  { title: 'Espécie', key: 'especie', sortable: true },
  { title: 'Parcela', key: 'id_parcela', sortable: true },
  { title: 'Qtd Total', key: 'qtdparcelas', sortable: true },
  { title: 'Data Emissão', key: 'dtemissao', sortable: true },
  { title: 'Vencimento', key: 'dtvencimento', sortable: true },
  { title: 'Fornecedor', key: 'fornecedor', sortable: true },
  { title: 'Vlr Documento', key: 'vlrdocumento', sortable: true },
  { title: 'Vlr Parcela', key: 'vlrparcela', sortable: true },
  { title: 'Origem', key: 'origem', sortable: true },
  { title: 'Tipo Doc.', key: 'abreviatura', sortable: true },
  { title: 'Local Cobrança', key: 'desclocalcobranca', sortable: true },
  { title: 'Usuário', key: 'user_inc', sortable: true },
  { title: 'Ações', key: 'actions', sortable: false }
]

// Função para formatação monetária brasileira
const formatarMoeda = (valor) => {
  if (!valor && valor !== 0) return 'R$ 0,00'
  
  const numero = parseFloat(valor)
  if (isNaN(numero)) return 'R$ 0,00'
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numero)
}

const formatarData = (data) => {
  if (!data) return '--'
  try {
    return new Date(data).toLocaleDateString('pt-BR')
  } catch {
    return '--'
  }
}

// Computed
const autorizacoesFiltradas = computed(() => {
  const dados = autorizacoes.value || []
  if (!Array.isArray(dados)) return []
  
  // Toda filtragem é feita pela API
  return dados
})

// Calcular o valor total das autorizações filtradas (usando vlrparcela como no PagarView)
const totalAutorizacoesFiltradas = computed(() => {
  return autorizacoesFiltradas.value.reduce((total, item) => {
    const valor = parseFloat(item.vlrparcela || 0)
    return total + valor
  }, 0)
})

// Métodos de seleção
const toggleSelecao = (itemIdParcela) => {
  const index = itensSelecionados.value.indexOf(itemIdParcela)
  if (index === -1) {
    itensSelecionados.value.push(itemIdParcela)
  } else {
    itensSelecionados.value.splice(index, 1)
  }
}

const selecionarTodos = () => {
  if (itensSelecionados.value.length === autorizacoesFiltradas.value.length) {
    itensSelecionados.value = []
  } else {
    itensSelecionados.value = autorizacoesFiltradas.value.map(item => item.id_parcela)
  }
}

const limparSelecao = () => {
  itensSelecionados.value = []
}

const autorizarSelecionados = () => {
  if (itensSelecionados.value.length === 0) return
  
  const itensSelecionadosData = autorizacoesFiltradas.value.filter(item => 
    itensSelecionados.value.includes(item.id_parcela)
  )
  
  dialogAutorizacao.item = itensSelecionadosData
  observacaoAutorizacao.value = ''
  dialogAutorizacao.aberto = true
}

const rejeitarSelecionados = () => {
  if (itensSelecionados.value.length === 0) return
  
  const itensSelecionadosData = autorizacoesFiltradas.value.filter(item => 
    itensSelecionados.value.includes(item.id_parcela)
  )
  
  dialogRejeicao.item = itensSelecionadosData
  observacaoRejeicao.value = ''
  dialogRejeicao.aberto = true
}

// Métodos de ação
const visualizarAutorizacao = (item) => {
  // TODO: Implementar visualização detalhada
  console.log('Visualizar autorização:', item)
  mostrarSnackbar('Funcionalidade em desenvolvimento', 'info')
}

const confirmarAutorizacao = async () => {
  if (!dialogAutorizacao.item) return

  loading.value = true
  try {
    const isMultiplo = Array.isArray(dialogAutorizacao.item)
    const itens = isMultiplo ? dialogAutorizacao.item : [dialogAutorizacao.item]
    
    // Preparar payload para a API
    const payload = {
      data: itens.map(item => ({
        id: item.id_parcela,
        vlrliberadopagto: item.vlrparcela,
        vlroriginalparcela: item.vlrparcela
      }))
    }
    
    console.log('Autorizando pagamento(s):', {
      payload,
      observacao: observacaoAutorizacao.value,
      quantidade: itens.length
    })
    
    // Chamar API real
    await financeiroStore.autorizarContasPagar(payload)
    
    const quantidade = itens.length
    mostrarSnackbar(`${quantidade} pagamento${quantidade > 1 ? 's' : ''} autorizado${quantidade > 1 ? 's' : ''} com sucesso!`, 'success')
    
    dialogAutorizacao.aberto = false
    limparSelecao() // Limpar seleção após autorizar
    
    // Atualizar lista
    await carregarAutorizacoes()
  } catch (error) {
    console.error('Erro ao autorizar pagamento:', error)
    mostrarSnackbar('Erro ao autorizar pagamento', 'error')
  } finally {
    loading.value = false
  }
}

const confirmarRejeicao = async () => {
  if (!dialogRejeicao.item || !observacaoRejeicao.value) {
    mostrarSnackbar('Motivo da rejeição é obrigatório', 'warning')
    return
  }

  loading.value = true
  try {
    const isMultiplo = Array.isArray(dialogRejeicao.item)
    
    // TODO: Implementar chamada da API quando disponível
    console.log('Rejeitando pagamento(s):', {
      itens: dialogRejeicao.item,
      motivo: observacaoRejeicao.value,
      multiplo: isMultiplo,
      quantidade: isMultiplo ? dialogRejeicao.item.length : 1
    })
    
    // Simular API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const quantidade = isMultiplo ? dialogRejeicao.item.length : 1
    mostrarSnackbar(`${quantidade} pagamento${quantidade > 1 ? 's' : ''} rejeitado${quantidade > 1 ? 's' : ''}`, 'success')
    
    dialogRejeicao.aberto = false
    limparSelecao() // Limpar seleção após rejeitar
    
    // Atualizar lista
    await carregarAutorizacoes()
  } catch (error) {
    console.error('Erro ao rejeitar pagamento:', error)
    mostrarSnackbar('Erro ao rejeitar pagamento', 'error')
  } finally {
    loading.value = false
  }
}

const aplicarFiltrosAvancados = async (filtros) => {
  console.log('Aplicando filtros avançados:', filtros)
  filtrosAvancados.value = filtros
  await carregarAutorizacoes()
}

const carregarAutorizacoes = async () => {
  loading.value = true
  try {
    console.log('Carregando autorizações...')
    
    // Carregar empresa selecionada se necessário
    if (!empresaStore.empresa?.id && !empresaStore.empresaSelecionada?.id) {
      empresaStore.carregarEmpresaSelecionada()
    }
    
    const idEmpresa = empresaStore.empresa?.id || empresaStore.empresaSelecionada?.id
    
    if (!idEmpresa) {
      throw new Error('ID da empresa não encontrado')
    }
    
    console.log('ID da empresa:', idEmpresa)
    
    // Sempre buscar contas não baixadas e não liberadas para pagamento
    const filtros = {
      ...filtrosAvancados.value,
      baixado: 'N', // sempre fixo para autorização
      liberadopagto: 'N' // sempre fixo para autorização
    }
    
    console.log('Filtros aplicados:', filtros)
    
    const resultado = await financeiroStore.buscarContasPagar(idEmpresa, filtros)
    
    if (resultado && Array.isArray(resultado)) {
      autorizacoes.value = resultado
      console.log(`Carregadas ${resultado.length} autorizações`)
    } else {
      console.error('Estrutura de dados inválida:', resultado)
      autorizacoes.value = []
    }
    
  } catch (error) {
    console.error('Erro ao carregar autorizações:', error)
    mostrarSnackbar('Erro ao carregar autorizações', 'error')
    autorizacoes.value = []
  } finally {
    loading.value = false
  }
}

const mostrarSnackbar = (message, color = 'success') => {
  snackbar.message = message
  snackbar.color = color
  snackbar.show = true
}

// Ciclo de vida
onMounted(async () => {
  await carregarAutorizacoes()
})
</script>

<style scoped>
/* Estilos específicos se necessário */
</style>
