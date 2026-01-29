<template>
  <top-all-pages icon="mdi-view-dashboard">
    <template #titulo>
      <div class="text-h5 flex justify-between items-center w-100">
        <p>Dashboard</p>
        <p class="text-subtitle-2 ml-3" style="color: var(--text-color)">{{ dataAtual }}</p>
      </div>
    </template>

    <!-- Cards Resumo -->
    <v-row class="mb-4">
      <v-col cols="12" sm="6" md="3">
        <v-tooltip text="Lançar uma nova conta a pagar" location="top">
          <template v-slot:activator="{ props }">
            <v-card 
              v-bind="props"
              class="background-card pa-4 card-clicavel" 
              elevation="2" 
              style="min-height: 120px; height: 75%; display: flex; flex-direction: column; justify-content: space-between;"
              @click="router.push({ path: '/paginas/financeiro/pagar', query: { novo: 'true' } })"
            >
          <div class="d-flex align-center justify-space-between">
            <div style="width: 100%">
              <p class="text-caption mb-1" style="color: var(--text-color)">Contas a Pagar do dia</p>
              <h3 class="text-h5 font-weight-bold" style="color: var(--text-color-laranja)">
                R$ {{ formatarMoeda(detalhesPagar.doDia) }}
              </h3>
              <div class="d-flex gap-2 mt-1">
                <div style="flex: 1">
                  <p class="text-caption" :class="detalhesPagar.vencido > 0 ? 'text-error' : 'text-success'">
                    <v-icon size="x-small" :icon="detalhesPagar.vencido > 0 ? 'mdi-alert-circle' : 'mdi-check-circle'"></v-icon>
                    {{ detalhesPagar.qtdVencido }} vencidos
                  </p>
                  <p class="text-caption font-weight-bold">R$ {{ formatarMoeda(detalhesPagar.vencido) }}</p>
                </div>
                <div style="flex: 1">
                  <p  class="text-caption" :class="detalhesPagar.vencido > 0 ? 'text-error' : 'text-success'">
                    <v-icon size="x-small" :icon="detalhesPagar.vencido > 0 ? 'mdi-alert-circle' : 'mdi-check-circle'"></v-icon>
                    {{ detalhesPagar.qtdRestante }} restante
                  </p>
                  <p class="text-caption font-weight-bold">R$ {{ formatarMoeda(detalhesPagar.restante) }}</p>
                </div>
              </div>
            </div>
            <v-avatar color="rgba(245, 124, 0, 0.15)" size="48">
              <v-icon icon="mdi-cash-minus" color="var(--text-color-laranja)"></v-icon>
            </v-avatar>
          </div>
            </v-card>
          </template>
        </v-tooltip>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-tooltip text="Lançar uma nova conta a receber" location="top">
          <template v-slot:activator="{ props }">
            <v-card 
              v-bind="props"
              class="background-card pa-4 card-clicavel" 
              elevation="2" 
              style="min-height: 120px; height: 75%; display: flex; flex-direction: column; justify-content: space-between;"
              @click="router.push({ path: '/paginas/financeiro/receber', query: { novo: 'true' } })"
            >
              <div class="d-flex align-center justify-space-between">
                <div style="width: 100%">
                  <p class="text-caption mb-1" style="color: var(--text-color)">Contas a Receber do dia</p>
              <h3 class="text-h5 font-weight-bold color-verde">
                R$ {{ formatarMoeda(detalhesReceber.doDia) }}
              </h3>
              <div class="d-flex gap-2 mt-1">
                <div style="flex: 1">
                  <p class="text-caption" :class="detalhesReceber.vencido > 0 ? 'text-error' : 'text-success'">
                    <v-icon size="x-small" :icon="detalhesReceber.vencido > 0 ? 'mdi-alert-circle' : 'mdi-check-circle'"></v-icon>
                    {{ detalhesReceber.qtdVencido }} vencidos
                  </p>
                  <p class="text-caption font-weight-bold">R$ {{ formatarMoeda(detalhesReceber.vencido) }}</p>
                </div>
                <div style="flex: 1">
                  <p class="text-caption" :class="detalhesReceber.vencido > 0 ? 'text-error' : 'text-success'">
                    <v-icon size="x-small" :icon="detalhesReceber.vencido > 0 ? 'mdi-alert-circle' : 'mdi-check-circle'"></v-icon>
                    {{ detalhesReceber.qtdRestante }} restante
                  </p>
                  <p class="text-caption font-weight-bold">R$ {{ formatarMoeda(detalhesReceber.restante) }}</p>
                </div>
              </div>
            </div>
                <v-avatar color="rgba(76, 175, 80, 0.15)" size="48">
                  <v-icon icon="mdi-cash-plus" color="#4CAF50"></v-icon>
                </v-avatar>
              </div>
            </v-card>
          </template>
        </v-tooltip>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-tooltip text="Gerenciar contas bancárias" location="top">
          <template v-slot:activator="{ props }">
            <v-card 
              v-bind="props"
              class="background-card pa-4 card-clicavel" 
              elevation="2" 
              style="min-height: 120px; height: 75%; display: flex; flex-direction: column; justify-content: space-between;"
              @click="router.push('/paginas/financeiro/contacorrente')"
            >
          <div class="d-flex align-center justify-space-between">
            <div style="width: 100%">
              <p class="text-caption mb-1" style="color: var(--text-color)">Saldo Total</p>
              <h3 class="text-h5 font-weight-bold" :style="{ color: saldoTotal.saldototal >= 0 ? '#2196F3' : '#F44336' }">
                R$ {{ formatarMoeda(saldoTotal.saldototal) }}
              </h3>
              <p class="text-caption mt-1" style="color: var(--text-color)">
                <v-icon size="x-small" icon="mdi-bank"></v-icon>
                {{ saldoTotal.saldosbancario?.length || 0 }} banco(s)
              </p>
            </div>
                <v-avatar :color="saldoTotal.saldototal >= 0 ? 'rgba(33, 150, 243, 0.15)' : 'rgba(244, 67, 54, 0.15)'" size="48">
                  <v-icon :icon="saldoTotal.saldototal >= 0 ? 'mdi-cash-register' : 'mdi-alert-circle'" :color="saldoTotal.saldototal >= 0 ? '#2196F3' : '#F44336'"></v-icon>
                </v-avatar>
              </div>
            </v-card>
          </template>
        </v-tooltip>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-tooltip text="Gerenciar estoque de produtos" location="top">
          <template v-slot:activator="{ props }">
            <v-card 
              v-bind="props"
              class="background-card pa-4 card-clicavel" 
              elevation="2" 
              style="min-height: 120px; height: 75%; display: flex; flex-direction: column; justify-content: space-between;"
              @click="router.push('/paginas/estoque')"
            >
          <div class="d-flex align-center justify-space-between">
            <div style="width: 100%">
              <p class="text-caption mb-1" style="color: var(--text-color)">Produtos em Estoque</p>
              <h3 class="text-h5 font-weight-bold color-roxo">
                {{ resumo.produtosEstoque }}
              </h3>
              <p class="text-caption mt-1" style="color: var(--text-color)">
                <v-icon size="x-small" icon="mdi-alert" color="#FFC107"></v-icon>
                {{ resumo.produtosBaixoEstoque }} em baixo estoque
              </p>
            </div>
                <v-avatar color="rgba(156, 39, 176, 0.15)" size="48">
                  <v-icon icon="mdi-package-variant" color="#9C27B0"></v-icon>
                </v-avatar>
              </div>
            </v-card>
          </template>
        </v-tooltip>
      </v-col>
    </v-row>

    <!-- Gráficos Principais -->
    <v-row class="mb-4">
      <!-- Fluxo de Caixa -->
      <v-col cols="12" lg="8">
        <v-card class="background-secondary" elevation="2">
          <v-card-title class="pa-4 d-flex align-center justify-space-between">
            <div class="d-flex align-center">
              <v-icon icon="mdi-chart-line" class="mr-2" color="var(--text-color-laranja)"></v-icon>
              {{ fluxoCaixaDados.titulo }}
            </div>
            <div class="d-flex align-center gap-2">
              <span class="text-caption" :style="{ color: tipoFluxoCaixa === 'mensal' ? 'var(--text-color-laranja)' : 'var(--text-color)' }">
                Mensal
              </span>
              <v-switch
                v-model="tipoFluxoCaixa"
                true-value="diario"
                false-value="mensal"
                color="var(--text-color-laranja)"
                hide-details
                density="compact"
              ></v-switch>
              <span class="text-caption" :style="{ color: tipoFluxoCaixa === 'diario' ? 'var(--text-color-laranja)' : 'var(--text-color)' }">
                Diário
              </span>
            </div>
          </v-card-title>
          <v-card-text class="pa-4">
            <apexchart
              type="area"
              height="320"
              :options="fluxoCaixaOptions"
              :series="fluxoCaixaSeries"
            ></apexchart>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Distribuição por Banco -->
      <v-col cols="12" lg="4">
        <v-card class="background-secondary" elevation="2">
          <v-card-title class="pa-4 d-flex align-center">
            <v-icon icon="mdi-chart-donut" class="mr-2" color="var(--text-color-laranja)"></v-icon>
            Distribuição Bancária
          </v-card-title>
          <v-card-text class="pa-4">
            <apexchart
              type="donut"
              height="320"
              :options="distribuicaoBancariaOptions"
              :series="distribuicaoBancariaSeries"
            ></apexchart>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Segunda linha de gráficos -->
    <v-row class="mb-4">
      <!-- Contas a Pagar vs Receber -->
      <v-col cols="12" md="6">
        <v-card class="background-secondary" elevation="2">
          <v-card-title class="pa-4 d-flex align-center justify-space-between">
            <div class="d-flex align-center">
              <v-icon icon="mdi-chart-bar" class="mr-2" color="var(--text-color-laranja)"></v-icon>
              Por {{ tipoVisualizacaoPagarReceber === 'tipodocumento' ? 'Tipo de Documento' : 'Local de Cobrança' }}
            </div>
            <div class="d-flex align-center gap-2">
              <span class="text-caption" :style="{ color: tipoVisualizacaoPagarReceber === 'tipodocumento' ? 'var(--text-color-laranja)' : 'var(--text-color)' }">
                Doc.
              </span>
              <v-switch
                v-model="tipoVisualizacaoPagarReceber"
                true-value="localcobranca"
                false-value="tipodocumento"
                color="var(--text-color-laranja)"
                hide-details
                density="compact"
              ></v-switch>
              <span class="text-caption" :style="{ color: tipoVisualizacaoPagarReceber === 'localcobranca' ? 'var(--text-color-laranja)' : 'var(--text-color)' }">
                Local
              </span>
            </div>
          </v-card-title>
          <v-card-text class="pa-4">
            <apexchart
              type="bar"
              height="280"
              :options="pagarReceberOptions"
              :series="pagarReceberSeries"
            ></apexchart>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Movimentação do Caixa -->
      <v-col cols="12" md="6">
        <v-card class="background-secondary" elevation="2">
          <v-card-title class="pa-4 d-flex align-center">
            <v-icon icon="mdi-cash-multiple" class="mr-2" color="var(--text-color-laranja)"></v-icon>
            Movimentação do Caixa
          </v-card-title>
          <v-card-text class="pa-4">
            <apexchart
                type="bar"
                height="280"
                :options="movimentacaoCaixaOptions"
                :series="movimentacaoCaixaSeries"
            ></apexchart>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Terceira linha -->
    <v-row class="mb-4">
      <!-- Estoque por Grupo -->
      <v-col cols="12" md="4">
        <v-card class="background-secondary" elevation="2">
          <v-card-title class="pa-4 d-flex align-center">
            <v-icon icon="mdi-chart-pie" class="mr-2" color="var(--text-color-laranja)"></v-icon>
            Estoque por Grupo
          </v-card-title>
          <v-card-text class="pa-4">
            <apexchart
                type="pie"
                height="280"
                :options="estoqueGrupoOptions"
                :series="estoqueGrupoSeries"
            ></apexchart>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Adiantamentos -->
      <v-col cols="12" md="4">
        <v-card class="background-secondary" elevation="2">
          <v-card-title class="pa-4 d-flex align-center">
            <v-icon icon="mdi-account-cash" class="mr-2" color="var(--text-color-laranja)"></v-icon>
            Adiantamentos de Clientes
          </v-card-title>
          <v-card-text class="pa-4">
            <apexchart
                type="radialBar"
                height="280"
                :options="adiantamentoOptions"
                :series="adiantamentoSeries"
            ></apexchart>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Top Clientes/Fornecedores -->
      <v-col cols="12" md="4">
        <v-card class="background-secondary" elevation="2">
          <v-card-title class="pa-4 d-flex align-center">
            <v-icon icon="mdi-account-group" class="mr-2" color="var(--text-color-laranja)"></v-icon>
            Top 5 Clientes
          </v-card-title>
          <v-card-text class="pa-4">
            <v-list density="compact" class="bg-transparent">
              <v-list-item
                  v-for="(cliente, index) in topClientes"
                  :key="index"
                  class="px-0"
              >
                <template v-slot:prepend>
                  <v-avatar size="32" :color="getAvatarColor(index)">
                    <span class="text-white text-caption">{{ index + 1 }}º</span>
                  </v-avatar>
                </template>
                <v-list-item-title class="text-body-2">{{ cliente.nome }}</v-list-item-title>
                <v-list-item-subtitle class="text-caption">
                  R$ {{ formatarMoeda(cliente.valor) }}
                </v-list-item-subtitle>
                <template v-slot:append>
                  <v-chip size="x-small" :color="getAvatarColor(index)" variant="tonal">
                    {{ cliente.percentual }}%
                  </v-chip>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Últimas Movimentações -->
    <v-row>
      <v-col cols="12">
        <v-card class="background-secondary" elevation="2">
          <v-card-title class="pa-4 d-flex align-center justify-space-between">
            <div class="d-flex align-center">
              <v-icon icon="mdi-history" class="mr-2" color="var(--text-color-laranja)"></v-icon>
              Últimas Movimentações
            </div>
            <v-btn variant="text" color="var(--text-color-laranja)" size="small">
              Ver todas
              <v-icon icon="mdi-chevron-right" end></v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text class="pa-0">
            <v-data-table
                :headers="headersMovimentacoes"
                :items="ultimasMovimentacoes"
                density="comfortable"
                :items-per-page="5"
                class="bg-transparent"
            >
              <template #[`item.tipo`]="{ item }">
                <v-chip
                    size="small"
                    :color="item.tipo === 'entrada' ? 'success' : 'error'"
                    variant="tonal"
                >
                  <v-icon
                      size="x-small"
                      :icon="item.tipo === 'entrada' ? 'mdi-arrow-down' : 'mdi-arrow-up'"
                      class="mr-1"
                  ></v-icon>
                  {{ item.tipo === 'entrada' ? 'Entrada' : 'Saída' }}
                </v-chip>
              </template>
              <template #[`item.valor`]="{ item }">
            <span :class="item.tipo === 'entrada' ? 'text-success' : 'text-error'">
              {{ item.tipo === 'entrada' ? '+' : '-' }} R$ {{ formatarMoeda(item.valor) }}
            </span>
              </template>
              <template #[`item.data`]="{ item }">
                {{ formatarData(item.data) }}
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </top-all-pages>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '@/stores/config-temas/theme'
import { useDashboardStore } from '@/stores/APIs/dashboard'
import TopAllPages from '@/components/base/padrao-paginas/TopAllPages.vue'

const router = useRouter()
const themeStore = useThemeStore()
const dashboardStore = useDashboardStore()

// Ref para controlar o tipo de fluxo de caixa (mensal ou diário)
const tipoFluxoCaixa = ref('mensal')

// Ref para controlar visualização de pagar/receber (por tipo de documento ou local de cobrança)
const tipoVisualizacaoPagarReceber = ref('tipodocumento')

// Data atual formatada
const dataAtual = computed(() => {
  const hoje = new Date()
  return hoje.toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

// Carregar dados do dashboard ao montar o componente
onMounted(async () => {

  try {
    // Obter ID da empresa do localStorage (setado no login)
    const empresaData = localStorage.getItem('empresaSelecionada')

    if (!empresaData) {
      console.warn('⚠️ Nenhuma empresa encontrada no localStorage')
      return
    }

    const empresa = JSON.parse(empresaData)
    const idempresa = empresa.id

    // Carregar todos os dados do dashboard
    await dashboardStore.carregarDadosDashboard(idempresa)

  } catch (error) {
    console.error('❌ Erro ao carregar dashboard:', error)
  }
})

// Cores do tema
const coresGrafico = computed(() => ({
  laranja: '#F57C00',
  laranjaSecundario: '#de7e3e',
  verde: '#4CAF50',
  vermelho: '#F44336',
  azul: '#2196F3',
  roxo: '#9C27B0',
  amarelo: '#FFC107',
  cinza: '#607D8B',
  texto: themeStore.darkMode ? '#ffffff' : '#2b2b2b',
  fundo: themeStore.darkMode ? '#212529' : '#f8f8f8',
  grid: themeStore.darkMode ? '#3a3a3a' : '#e0e0e0'
}))

// Dados do resumo - Computed a partir dos dados do dashboard (apenas pagarReceber)
const resumo = computed(() => {
  // Extrair dados do pagarReceber
  const pagarData = dashboardStore.pagarReceber[0] || {}

  // Calcular totais de pagar
  const totalPagarVencido = pagarData.pagarvencido?.[0]?.saldo || 0
  const totalPagarDoDia = pagarData.pagardodia?.[0]?.saldo || 0
  const totalPagarRestante = pagarData.pagarrestantemes?.[0]?.saldo || 0
  const totalAPagar = totalPagarVencido + totalPagarDoDia + totalPagarRestante

  // Calcular totais de receber
  const totalReceberVencido = pagarData.recebervencido?.[0]?.saldo || 0
  const totalReceberDoDia = pagarData.receberdodia?.[0]?.saldo || 0
  const totalReceberRestante = pagarData.receberrestantemes?.[0]?.saldo || 0
  const totalAReceber = totalReceberVencido + totalReceberDoDia + totalReceberRestante

  return {
    contasPagar: totalAPagar,
    contasPagarVariacao: totalPagarVencido > 0 ? -15 : 5,
    contasReceber: totalAReceber,
    contasReceberVariacao: totalReceberVencido > 0 ? -10 : 8,
    saldoCaixa: totalAReceber - totalAPagar, // Saldo = Receber - Pagar
    produtosEstoque: 1847,
    produtosBaixoEstoque: 23
  }
})

// Detalhes de Pagar
const detalhesPagar = computed(() => {
  const pagarData = dashboardStore.pagarReceber[0] || {}
  return {
    vencido: pagarData.pagarvencido?.[0]?.saldo || 0,
    qtdVencido: pagarData.pagarvencido?.[0]?.qtd_titulos || 0,
    doDia: pagarData.pagardodia?.[0]?.saldo || 0,
    qtdDoDia: pagarData.pagardodia?.[0]?.qtd_titulos || 0,
    restante: pagarData.pagarrestantemes?.[0]?.saldo || 0,
    qtdRestante: pagarData.pagarrestantemes?.[0]?.qtd_titulos || 0
  }
})

// Detalhes de Receber
const detalhesReceber = computed(() => {
  const pagarData = dashboardStore.pagarReceber[0] || {}
  return {
    vencido: pagarData.recebervencido?.[0]?.saldo || 0,
    qtdVencido: pagarData.recebervencido?.[0]?.qtd_titulos || 0,
    doDia: pagarData.receberdodia?.[0]?.saldo || 0,
    qtdDoDia: pagarData.receberdodia?.[0]?.qtd_titulos || 0,
    restante: pagarData.receberrestantemes?.[0]?.saldo || 0,
    qtdRestante: pagarData.receberrestantemes?.[0]?.qtd_titulos || 0
  }
})

// Saldo Total
const saldoTotal = computed(() => {
  const saldoData = dashboardStore.saldosBancarios[0] || {}
  return {
    saldototal: saldoData.saldototal || 0,
    saldosbancario: saldoData.saldosbancario || []
  }
})

// Dados de Fluxo de Caixa processados
const fluxoCaixaDados = computed(() => {
  if (tipoFluxoCaixa.value === 'mensal') {
    const dados = dashboardStore.fluxoCaixaMensal || []
    if (Array.isArray(dados) && dados.length > 0) {
      // Processar dados mensais
      // Campos da API: nomemes, receber, pagar, saldofinal, saldoinicial
      const categorias = dados.map(d => d.nomemes || d.mes || d.periodo || '')

      // Converter strings com vírgula para números
      const entradas = dados.map(d => {
        const valor = d.receber || d.entradas || d.total_entradas || '0'
        return parseFloat(String(valor).replace(',', '.')) || 0
      })

      const saidas = dados.map(d => {
        const valor = d.pagar || d.saidas || d.total_saidas || '0'
        return parseFloat(String(valor).replace(',', '.')) || 0
      })

      return {
        categorias,
        entradas,
        saidas,
        titulo: 'Fluxo de Caixa - Proximos Meses'
      }
    }
  } else {
    const dados = dashboardStore.fluxoCaixaDiario || []

    if (Array.isArray(dados) && dados.length > 0) {
      // Processar dados diários
      // Campos esperados: dtvencimento, receber, pagar
      const categorias = dados.map(d => {
        const data = d.dtvencimento || d.data || d.dia || ''
        // Formatar data de YYYY-MM-DD para DD/MM
        if (data.includes('-')) {
          const [, mes, dia] = data.split('-')
          return `${dia}/${mes}`
        }
        return data
      })

      // Converter strings com vírgula para números
      const entradas = dados.map(d => {
        const valor = d.receber || d.entradas || d.total_entradas || '0'
        return parseFloat(String(valor).replace(',', '.')) || 0
      })

      const saidas = dados.map(d => {
        const valor = d.pagar || d.saidas || d.total_saidas || '0'
        return parseFloat(String(valor).replace(',', '.')) || 0
      })

      return {
        categorias,
        entradas,
        saidas,
        titulo: 'Fluxo de Caixa - Últimos Dias'
      }
    }
  }

  // Dados padrão se não houver dados da API
  return {
    categorias: ['Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    entradas: [45000, 52000, 48000, 61000, 55000, 78950],
    saidas: [38000, 42000, 35000, 51000, 47000, 45780],
    titulo: 'Fluxo de Caixa - Últimos 6 Meses'
  }
})

// Distribuição Bancária - Opções do gráfico
const distribuicaoBancariaOptions = computed(() => {
  const bancos = saldoTotal.value.saldosbancario || []

  return {
    chart: {
      type: 'donut',
      background: 'transparent',
      fontFamily: 'Roboto, sans-serif'
    },
    colors: [
      coresGrafico.value.laranja,
      coresGrafico.value.azul,
      coresGrafico.value.verde,
      coresGrafico.value.roxo,
      coresGrafico.value.amarelo
    ],
    labels: bancos.map(b => b.descbanco || 'Banco Desconhecido'),
    legend: {
      position: 'bottom',
      labels: { colors: coresGrafico.value.texto }
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val.toFixed(1)}%`
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            name: {
              color: coresGrafico.value.texto
            },
            value: {
              color: coresGrafico.value.texto
            },
            total: {
              show: true,
              label: 'Total',
              color: coresGrafico.value.texto,
              formatter: () => `R$ ${formatarMoeda(saldoTotal.value.saldototal)}`
            }
          }
        }
      }
    },
    tooltip: { theme: themeStore.darkMode ? 'dark' : 'light' }
  }
})

// Distribuição Bancária - Séries (percentuais)
const distribuicaoBancariaSeries = computed(() => {
  const bancos = saldoTotal.value.saldosbancario || []
  return bancos.map(b => parseFloat(b.percentual) || 0)
})

// Configurações do gráfico de Fluxo de Caixa
const fluxoCaixaOptions = computed(() => ({
  chart: {
    type: 'area',
    toolbar: { show: false },
    background: 'transparent',
    fontFamily: 'Roboto, sans-serif'
  },
  colors: [coresGrafico.value.verde, coresGrafico.value.vermelho],
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth', width: 2 },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.45,
      opacityTo: 0.05,
      stops: [50, 100]
    }
  },
  xaxis: {
    categories: fluxoCaixaDados.value.categorias,
    labels: { style: { colors: coresGrafico.value.texto } }
  },
  yaxis: {
    labels: {
      style: { colors: coresGrafico.value.texto },
      formatter: (val) => `R$ ${(val / 1000).toFixed(0)}k`
    }
  },
  grid: { borderColor: coresGrafico.value.grid, strokeDashArray: 3 },
  legend: {
    labels: { colors: coresGrafico.value.texto },
    position: 'top'
  },
  tooltip: {
    theme: themeStore.darkMode ? 'dark' : 'light',
    y: { formatter: (val) => `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` }
  }
}))

const fluxoCaixaSeries = computed(() => [
  { name: 'Entradas', data: fluxoCaixaDados.value.entradas },
  { name: 'Saídas', data: fluxoCaixaDados.value.saidas }
])

// Configurações do gráfico de Centro de Custo


// Configurações do gráfico Pagar vs Receber
const pagarReceberOptions = computed(() => {
  const categorias = tipoVisualizacaoPagarReceber.value === 'tipodocumento'
    ? (dashboardStore.pagRecDocLoc?.tipodocumento?.receber || []).map(d => d.tipodocumento || 'Sem Tipo')
    : (dashboardStore.pagRecDocLoc?.localcobranca?.receber || []).map(d => d.localcobranca || 'Sem Local')

  return {
    chart: {
      type: 'bar',
      toolbar: { show: false },
      background: 'transparent',
      fontFamily: 'Roboto, sans-serif'
    },
    colors: [coresGrafico.value.vermelho, coresGrafico.value.verde],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 4
      }
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: categorias,
      labels: { style: { colors: coresGrafico.value.texto } }
    },
    yaxis: {
      labels: {
        style: { colors: coresGrafico.value.texto },
        formatter: (val) => `R$ ${(val / 1000).toFixed(0)}k`
      }
    },
    grid: { borderColor: coresGrafico.value.grid, strokeDashArray: 3 },
    legend: {
      labels: { colors: coresGrafico.value.texto },
      position: 'top'
    },
    tooltip: {
      theme: themeStore.darkMode ? 'dark' : 'light',
      y: { formatter: (val) => `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` }
    }
  }
})

const pagarReceberSeries = computed(() => {
  if (tipoVisualizacaoPagarReceber.value === 'tipodocumento') {
    const dadosPagar = dashboardStore.pagRecDocLoc?.tipodocumento?.pagar || []
    const dadosReceber = dashboardStore.pagRecDocLoc?.tipodocumento?.receber || []

    return [
      {
        name: 'A Pagar',
        data: dadosPagar.map(d => d.saldo || 0)
      },
      {
        name: 'A Receber',
        data: dadosReceber.map(d => d.saldo || 0)
      }
    ]
  } else {
    const dadosPagar = dashboardStore.pagRecDocLoc?.localcobranca?.pagar || []
    const dadosReceber = dashboardStore.pagRecDocLoc?.localcobranca?.receber || []

    return [
      {
        name: 'A Pagar',
        data: dadosPagar.map(d => d.saldo || 0)
      },
      {
        name: 'A Receber',
        data: dadosReceber.map(d => d.saldo || 0)
      }
    ]
  }
})

// Configurações do gráfico de Movimentação do Caixa
const movimentacaoCaixaOptions = computed(() => ({
  chart: {
    type: 'bar',
    stacked: true,
    toolbar: { show: false },
    background: 'transparent',
    fontFamily: 'Roboto, sans-serif'
  },
  colors: [coresGrafico.value.laranja, coresGrafico.value.laranjaSecundario],
  plotOptions: {
    bar: {
      horizontal: true,
      borderRadius: 4
    }
  },
  dataLabels: { enabled: false },
  xaxis: {
    categories: ['Caixa Principal', 'Caixa Loja 1', 'Caixa Loja 2', 'Caixa Reserva'],
    labels: {
      style: { colors: coresGrafico.value.texto },
      formatter: (val) => `R$ ${(val / 1000).toFixed(0)}k`
    }
  },
  yaxis: {
    labels: { style: { colors: coresGrafico.value.texto } }
  },
  grid: { borderColor: coresGrafico.value.grid, strokeDashArray: 3 },
  legend: {
    labels: { colors: coresGrafico.value.texto },
    position: 'top'
  },
  tooltip: {
    theme: themeStore.darkMode ? 'dark' : 'light',
    y: { formatter: (val) => `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` }
  }
}))

const movimentacaoCaixaSeries = ref([
  { name: 'Entradas', data: [45000, 28000, 22000, 15000] },
  { name: 'Saídas', data: [32000, 18000, 15000, 8000] }
])

// Configurações do gráfico de Estoque por Grupo
const estoqueGrupoOptions = computed(() => ({
  chart: {
    type: 'pie',
    background: 'transparent',
    fontFamily: 'Roboto, sans-serif'
  },
  colors: [
    coresGrafico.value.azul,
    coresGrafico.value.verde,
    coresGrafico.value.laranja,
    coresGrafico.value.roxo,
    coresGrafico.value.cinza
  ],
  labels: ['Eletrônicos', 'Vestuário', 'Alimentos', 'Higiene', 'Outros'],
  legend: {
    position: 'bottom',
    labels: { colors: coresGrafico.value.texto }
  },
  dataLabels: { enabled: true },
  tooltip: { theme: themeStore.darkMode ? 'dark' : 'light' }
}))

const estoqueGrupoSeries = ref([520, 380, 450, 290, 207])

// Configurações do gráfico de Adiantamentos
const adiantamentoOptions = computed(() => ({
  chart: {
    type: 'radialBar',
    background: 'transparent',
    fontFamily: 'Roboto, sans-serif'
  },
  colors: [coresGrafico.value.laranja, coresGrafico.value.verde, coresGrafico.value.azul],
  plotOptions: {
    radialBar: {
      dataLabels: {
        name: { fontSize: '14px', color: coresGrafico.value.texto },
        value: {
          fontSize: '16px',
          color: coresGrafico.value.texto,
          formatter: (val) => `${val}%`
        },
        total: {
          show: true,
          label: 'Utilizado',
          color: coresGrafico.value.texto,
          formatter: () => '67%'
        }
      }
    }
  },
  labels: ['Cliente A', 'Cliente B', 'Cliente C'],
  legend: {
    show: true,
    position: 'bottom',
    labels: { colors: coresGrafico.value.texto }
  }
}))

const adiantamentoSeries = ref([75, 60, 45])

// Top Clientes
const topClientes = ref([
  { nome: 'Empresa ABC Ltda', valor: 28500.00, percentual: 24 },
  { nome: 'Comércio XYZ', valor: 22300.00, percentual: 19 },
  { nome: 'Indústria 123', valor: 18750.00, percentual: 16 },
  { nome: 'Serviços Pro', valor: 15200.00, percentual: 13 },
  { nome: 'Tech Solutions', valor: 12100.00, percentual: 10 }
])

// Últimas Movimentações
const headersMovimentacoes = [
  { title: 'Data', key: 'data', sortable: true },
  { title: 'Descrição', key: 'descricao', sortable: false },
  { title: 'Tipo', key: 'tipo', sortable: true },
  { title: 'Categoria', key: 'categoria', sortable: true },
  { title: 'Valor', key: 'valor', sortable: true, align: 'end' }
]

const ultimasMovimentacoes = ref([
  { data: '2024-12-29', descricao: 'Pagamento Fornecedor - NF 12345', tipo: 'saida', categoria: 'Fornecedores', valor: 5200.00 },
  { data: '2024-12-29', descricao: 'Recebimento Cliente - Boleto 789', tipo: 'entrada', categoria: 'Vendas', valor: 8500.00 },
  { data: '2024-12-28', descricao: 'Energia Elétrica - Dezembro', tipo: 'saida', categoria: 'Utilidades', valor: 1850.00 },
  { data: '2024-12-28', descricao: 'Venda PDV - Cupom 456', tipo: 'entrada', categoria: 'Vendas', valor: 3200.00 },
  { data: '2024-12-27', descricao: 'Salários - Folha Dezembro', tipo: 'saida', categoria: 'Pessoal', valor: 25000.00 },
  { data: '2024-12-27', descricao: 'Adiantamento Cliente ABC', tipo: 'entrada', categoria: 'Adiantamentos', valor: 10000.00 },
  { data: '2024-12-26', descricao: 'Aluguel - Janeiro/2025', tipo: 'saida', categoria: 'Imóveis', valor: 4500.00 },
  { data: '2024-12-26', descricao: 'Recebimento Duplicata 321', tipo: 'entrada', categoria: 'Vendas', valor: 6800.00 }
])

// Funções auxiliares
const formatarMoeda = (valor) => {
  return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const formatarData = (data) => {
  return new Date(data).toLocaleDateString('pt-BR')
}

const getAvatarColor = (index) => {
  const cores = ['#F57C00', '#4CAF50', '#2196F3', '#9C27B0', '#607D8B']
  return cores[index] || cores[0]
}
</script>

<style scoped>
.text-success {
  color: #4CAF50 !important;
}

.text-error {
  color: #F44336 !important;
}

.color-verde {
  color: #4CAF50 !important;
}

.color-roxo {
  color: #9C27B0 !important;
}

/* Cards clicáveis */
.card-clicavel {
  cursor: pointer;
  transition: all 0.3s ease;
}

.card-clicavel:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15) !important;
}
</style>
