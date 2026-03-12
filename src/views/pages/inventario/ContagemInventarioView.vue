<template>
  <v-app>
    <v-main>
      <v-container fluid class="pa-0">
        <!-- Header Mobile -->
        <v-app-bar 
            color="var(--text-color-laranja)" 
            elevation="2"
            class="text-white"
        >
          <v-app-bar-title class="text-h6">
            <v-icon icon="mdi-clipboard-check" class="mr-2"></v-icon>
            Contagem de Inventário
          </v-app-bar-title>
        </v-app-bar>

        <!-- Conteúdo Principal -->
        <v-container class="pa-3">
          <!-- Validação de Token -->
          <v-alert 
              v-if="!tokenValido && !carregando" 
              type="error" 
              variant="tonal"
              icon="mdi-alert-circle"
              class="mb-4"
          >
            <strong>Acesso Negado:</strong> Token inválido ou expirado.
          </v-alert>

          <!-- Loading -->
          <div v-if="carregando" class="text-center pa-12">
            <v-progress-circular indeterminate color="var(--text-color-laranja)" size="60"></v-progress-circular>
            <p class="text-body-1 mt-4 text-grey">Carregando inventário...</p>
          </div>

          <!-- Informações do Lote -->
          <v-card v-if="tokenValido" class="mb-3" elevation="2">
            <v-card-title class="text-subtitle-1 pa-3 background-card">
              <v-icon icon="mdi-information" class="mr-2" size="small"></v-icon>
              Informações do Lote
            </v-card-title>
            <v-card-text class="pa-3">
              <v-row dense>
                <v-col cols="6">
                  <div class="text-caption text-grey">Almoxarifado</div>
                  <div class="text-body-2 font-weight-bold">{{ lote?.almoxarifadoNome }}</div>
                </v-col>
                <v-col cols="6">
                  <div class="text-caption text-grey">Data</div>
                  <div class="text-body-2 font-weight-bold">{{ formatarData(lote?.data) }}</div>
                </v-col>
                <v-col cols="6">
                  <div class="text-caption text-grey">Total de Itens</div>
                  <div class="text-body-2 font-weight-bold">{{ lote?.itens?.length || 0 }}</div>
                </v-col>
                <v-col cols="6">
                  <div class="text-caption text-grey">Progresso</div>
                  <div class="text-body-2 font-weight-bold">
                    {{ itensContados }} / {{ lote?.itens?.length || 0 }}
                  </div>
                </v-col>
              </v-row>

              <v-progress-linear 
                  :model-value="progressoContagem" 
                  color="var(--text-color-laranja)"
                  height="8"
                  class="mt-3"
                  rounded
              ></v-progress-linear>
            </v-card-text>
          </v-card>

          <!-- Botão de Câmera -->
          <v-card v-if="tokenValido" class="mb-3" elevation="2">
            <v-card-text class="pa-3">
              <v-btn
                  color="var(--text-color-laranja)"
                  variant="flat"
                  size="large"
                  block
                  prepend-icon="mdi-camera-iris"
                  @click="abrirCamera"
                  class="text-white mb-3"
              >
                Escanear Código de Barras
              </v-btn>

              <!-- Campo manual de código de barras -->
              <v-text-field
                  v-model="codigoManual"
                  label="Ou digite o código manualmente"
                  variant="outlined"
                  density="compact"
                  prepend-inner-icon="mdi-barcode"
                  @keyup.enter="buscarProdutoPorCodigo"
                  clearable
              >
                <template #append-inner>
                  <v-btn
                      icon="mdi-magnify"
                      size="small"
                      variant="text"
                      @click="buscarProdutoPorCodigo"
                  ></v-btn>
                </template>
              </v-text-field>
            </v-card-text>
          </v-card>

          <!-- Modal de Câmera -->
          <v-dialog v-model="cameraAberta" fullscreen>
            <v-card>
              <v-app-bar color="var(--text-color-laranja)" elevation="0">
                <v-app-bar-title>Scanner de Código de Barras</v-app-bar-title>
                <template #append>
                  <v-btn
                      icon="mdi-close"
                      @click="fecharCamera"
                  ></v-btn>
                </template>
              </v-app-bar>

              <v-card-text class="pa-0">
                <div class="camera-container">
                  <video ref="videoElement" class="camera-video" autoplay playsinline></video>
                  <div class="camera-overlay">
                    <div class="scan-area"></div>
                    <div class="scan-instruction">
                      Posicione o código de barras na área destacada
                    </div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-dialog>

          <!-- Lista de Produtos -->
          <v-card v-if="tokenValido && lote?.itens?.length > 0" elevation="2">
            <v-card-title class="text-subtitle-1 pa-3 background-card d-flex align-center">
              <v-icon icon="mdi-format-list-bulleted" class="mr-2" size="small"></v-icon>
              Produtos para Contagem
              <v-spacer></v-spacer>
              <v-chip 
                  size="small" 
                  color="var(--text-color-laranja)"
                  variant="flat"
                  class="text-white"
              >
                {{ itensContados }} contados
              </v-chip>
            </v-card-title>

            <v-divider></v-divider>

            <!-- Filtro -->
            <v-card-text class="pa-2">
              <v-select
                  v-model="filtroStatus"
                  :items="filtrosDisponiveis"
                  label="Filtrar por status"
                  variant="outlined"
                  density="compact"
                  prepend-inner-icon="mdi-filter"
              ></v-select>
            </v-card-text>

            <v-divider></v-divider>

            <!-- Lista de Itens -->
            <v-list class="pa-0">
              <template v-for="(item, index) in itensFiltrados" :key="index">
                <v-list-item class="px-3 py-2">
                  <template #prepend>
                    <v-avatar 
                        :color="item.quantidadeContada !== null ? 'success' : 'grey-lighten-1'"
                        size="40"
                    >
                      <v-icon 
                          :icon="item.quantidadeContada !== null ? 'mdi-check' : 'mdi-package-variant'"
                          color="white"
                      ></v-icon>
                    </v-avatar>
                  </template>

                  <v-list-item-title class="text-body-2 font-weight-bold mb-1">
                    {{ item.nome }}
                  </v-list-item-title>
                  <v-list-item-subtitle class="text-caption">
                    Código: {{ item.codigo }} | Estoque: {{ formatarNumero(item.estoqueSistema) }} {{ item.unidade }}
                  </v-list-item-subtitle>

                  <template #append>
                    <div class="d-flex align-center">
                      <v-text-field
                          v-model.number="item.quantidadeContada"
                          type="number"
                          variant="outlined"
                          density="compact"
                          label="Qtd"
                          style="width: 90px"
                          hide-details
                          @update:model-value="calcularDiferenca(item)"
                      ></v-text-field>
                    </div>
                  </template>
                </v-list-item>

                <v-divider v-if="index < itensFiltrados.length - 1"></v-divider>
              </template>
            </v-list>
          </v-card>

          <!-- Botão Fixo de Salvar -->
          <v-footer 
              v-if="tokenValido && itensContados > 0"
              app
              color="transparent"
              elevation="0"
              class="pa-3"
          >
            <v-btn
                color="success"
                variant="flat"
                size="x-large"
                block
                prepend-icon="mdi-content-save"
                @click="salvarContagem"
                :loading="salvando"
                class="text-white"
            >
              Salvar Contagem ({{ itensContados }} itens)
            </v-btn>
          </v-footer>
        </v-container>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { toast } from 'vue3-toastify'
import { useInventarioStore } from '@/stores/APIs/inventario'

const route = useRoute()
const inventarioStore = useInventarioStore()

// Estados
const tokenValido = ref(false)
const lote = ref(null)
const carregando = ref(false)
const cameraAberta = ref(false)
const videoElement = ref(null)
const stream = ref(null)
const codigoManual = ref('')
const filtroStatus = ref('todos')
const salvando = ref(false)

const filtrosDisponiveis = [
  { title: 'Todos', value: 'todos' },
  { title: 'Contados', value: 'contados' },
  { title: 'Pendentes', value: 'pendentes' }
]

// Computeds
const itensContados = computed(() => {
  if (!lote.value?.itens) return 0
  return lote.value.itens.filter(item => item.quantidadeContada !== null && item.quantidadeContada !== '').length
})

const progressoContagem = computed(() => {
  if (!lote.value?.itens?.length) return 0
  return (itensContados.value / lote.value.itens.length) * 100
})

const itensFiltrados = computed(() => {
  if (!lote.value?.itens) return []
  const itens = lote.value.itens
  if (filtroStatus.value === 'contados') return itens.filter(item => item.quantidadeContada !== null && item.quantidadeContada !== '')
  if (filtroStatus.value === 'pendentes') return itens.filter(item => item.quantidadeContada === null || item.quantidadeContada === '')
  return itens
})

// Métodos
const formatarNumero = (valor) => {
  return parseFloat(valor || 0).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

const formatarData = (data) => {
  if (!data) return '-'
  const parte = data.split('T')[0]
  const [ano, mes, dia] = parte.split('-')
  return `${dia}/${mes}/${ano}`
}

const validarToken = async () => {
  const token = route.query.token
  const emp = route.params.emp
  const id = route.params.id

  if (!token || !emp || !id) {
    tokenValido.value = false
    toast.error('Token inválido ou ausente')
    return
  }

  // Token presente: considerar válido e carregar lote da API
  tokenValido.value = true
  await carregarLote(emp, id)
}

const carregarLote = async (emp, id) => {
  carregando.value = true
  try {
    // Busca o cabeçalho do inventário para obter o almoxarifado
    const response = await inventarioStore.obterInventario(parseInt(emp), parseInt(id))
    const dados = response?.data || response

    if (!dados) {
      toast.error('Lote não encontrado')
      tokenValido.value = false
      return
    }

    const idAlmoxarifado = dados.id_almoxarifado

    // Busca a grade de produtos do almoxarifado via /inventario/grid/:emp/:almox
    let gridProdutos = []
    if (idAlmoxarifado) {
      try {
        await inventarioStore.buscarGridInventario(parseInt(emp), idAlmoxarifado)
        gridProdutos = inventarioStore.gridProdutos || []
      } catch (gridError) {
        console.warn('[Contagem] Erro ao carregar grid, usando itens do lote:', gridError)
        // Fallback: usar itens já cadastrados no lote
        gridProdutos = (dados.itens || dados.item || []).map(item => ({
          id: item.id_produto,
          descproduto: item.descproduto || `Produto #${item.id_produto}`,
          codigo_sku: item.codigo_sku || item.codigo_gtin,
          saldo: item.qtd_sistema || 0,
          unidade: item.unidade || 'UN'
        }))
      }
    }

    lote.value = {
      id: dados.id,
      idEmpresa: parseInt(emp),
      almoxarifadoNome: dados.descalmoxarifado || 'Almoxarifado',
      data: dados.dtgeracao || dados.data,
      tipo: dados.tipo,
      itens: gridProdutos.map(produto => ({
        id: produto.id_produto,
        produtoId: produto.id_produto,
        codigo: produto.codigo_gtin || produto.id_produto,
        nome: produto.descproduto || `Produto #${produto.id_produto}`,
        estoqueSistema: 0,
        quantidadeContada: null,
        diferenca: 0,
        unidade: produto.abreviatura || 'UN',
        id_localizacao: produto.id_localizacao || null
      }))
    }
  } catch (error) {
    console.error('[Contagem] Erro ao carregar lote:', error)
    toast.error('Erro ao carregar dados do inventário')
    tokenValido.value = false
  } finally {
    carregando.value = false
  }
}

const abrirCamera = async () => {
  try {
    cameraAberta.value = true
    await new Promise(resolve => setTimeout(resolve, 100))
    stream.value = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
    })
    if (videoElement.value) {
      videoElement.value.srcObject = stream.value
    }
  } catch (error) {
    console.error('Erro ao acessar câmera:', error)
    toast.error('Erro ao acessar câmera. Verifique as permissões.')
    cameraAberta.value = false
  }
}

const fecharCamera = () => {
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop())
    stream.value = null
  }
  cameraAberta.value = false
}

const buscarProdutoPorCodigo = () => {
  if (!codigoManual.value) {
    toast.warning('Digite um código')
    return
  }

  const item = lote.value?.itens?.find(i => String(i.codigo) === String(codigoManual.value))

  if (item) {
    toast.success(`Produto encontrado: ${item.nome}`)
    const itemIndex = lote.value.itens.indexOf(item)
    const elemento = document.querySelectorAll('.v-list-item')[itemIndex]
    if (elemento) {
      elemento.scrollIntoView({ behavior: 'smooth', block: 'center' })
      elemento.classList.add('item-destacado')
      setTimeout(() => elemento.classList.remove('item-destacado'), 2000)
    }
    codigoManual.value = ''
  } else {
    toast.error('Produto não encontrado no lote')
  }
}

const calcularDiferenca = (item) => {
  if (item.quantidadeContada !== null && item.quantidadeContada !== '') {
    item.diferenca = parseFloat(item.quantidadeContada) - parseFloat(item.estoqueSistema)
  } else {
    item.diferenca = 0
  }
}

const salvarContagem = async () => {
  if (itensContados.value === 0) {
    toast.warning('Nenhum item foi contado ainda')
    return
  }

  salvando.value = true

  try {
    const idEmpresa = lote.value.idEmpresa
    const idInventario = lote.value.id

    // Montar payload apenas com itens que foram contados
    const itensPayload = lote.value.itens
      .filter(item => item.quantidadeContada !== null && item.quantidadeContada !== '')
      .map(item => ({
        id_produto: item.produtoId,
        qtd_contada: parseFloat(item.quantidadeContada) || 0
      }))

    await inventarioStore.inserirItemInventario(idEmpresa, idInventario, itensPayload)
  } catch (error) {
    console.error('[Contagem] Erro ao salvar contagem:', error)
  } finally {
    salvando.value = false
  }
}

// Lifecycle
onMounted(() => {
  validarToken()
})

onUnmounted(() => {
  fecharCamera()
})
</script>

<style scoped>
.camera-container {
  position: relative;
  width: 100%;
  height: 100vh;
  background: black;
  overflow: hidden;
}

.camera-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.camera-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.scan-area {
  width: 80%;
  max-width: 400px;
  height: 200px;
  border: 3px solid var(--text-color-laranja);
  border-radius: 12px;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
  animation: scan-pulse 2s infinite;
}

.scan-instruction {
  margin-top: 24px;
  color: white;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  padding: 12px 24px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 8px;
}

@keyframes scan-pulse {
  0%, 100% {
    border-color: var(--text-color-laranja);
    box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
  }
  50% {
    border-color: #ffab40;
    box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.6);
  }
}

.item-destacado {
  background-color: rgba(255, 152, 0, 0.1) !important;
  transition: background-color 0.3s ease;
}

/* Mobile optimizations */
@media (max-width: 600px) {
  .v-container {
    padding-bottom: 80px !important; /* Espaço para o botão fixo */
  }
  
  .v-text-field input[type="number"] {
    font-size: 16px !important; /* Evita zoom automático no iOS */
  }
}

/* Remove scroll horizontal */
.v-main {
  overflow-x: hidden;
}
</style>
