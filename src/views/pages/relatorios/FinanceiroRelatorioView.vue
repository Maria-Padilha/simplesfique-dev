<template>
  <div class="pa-4">
    <v-card class="background-secondary my-4" elevation="1">
      <v-card-title class="text-h5 pa-4 d-flex align-center">
        <v-icon icon="mdi-chart-line" class="mr-3"></v-icon>
        Relatório Financeiro
      </v-card-title>
    </v-card>

    <v-row class="mb-4">
      <v-col cols="12" md="4">
        <v-card class="background-card pa-6 d-flex flex-column align-center justify-center" style="min-height: 200px; cursor: pointer;" @click="abrirModalCentroCusto">
          <v-icon icon="mdi-warehouse" size="64" color="var(--text-color-laranja)" class="mb-3"></v-icon>
          <h3 class="text-h6 text-center">Previsão Centro de Custo</h3>
          <p class="text-caption text-center mt-2">Débitos previstos por dia</p>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="background-card pa-6 d-flex flex-column align-center justify-center" style="min-height: 200px; cursor: pointer;" @click="abrirModalPagar">
          <v-icon icon="mdi-credit-card-outline" size="64" color="var(--text-color-laranja)" class="mb-3"></v-icon>
          <h3 class="text-h6 text-center">Títulos a Pagar</h3>
          <p class="text-caption text-center mt-2">Lançamentos para conferência</p>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="background-card pa-6 d-flex flex-column align-center justify-center" style="min-height: 200px; cursor: pointer;" @click="abrirModalReceber">
          <v-icon icon="mdi-cash-plus" size="64" color="var(--text-color-laranja)" class="mb-3"></v-icon>
          <h3 class="text-h6 text-center">Títulos a Receber</h3>
          <p class="text-caption text-center mt-2">Lançamentos para conferência</p>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="background-card pa-6 d-flex flex-column align-center justify-center" style="min-height: 200px; cursor: pointer;" @click="abrirModalDebitosRealizados">
          <v-icon icon="mdi-cash-check" size="64" color="error" class="mb-3"></v-icon>
          <h3 class="text-h6 text-center">Débitos Realizados</h3>
          <p class="text-caption text-center mt-2">Débitos realizados por centro de custo</p>
        </v-card>
      </v-col>
    </v-row>

    <!-- Modal Centro de Custo -->
    <v-dialog v-model="modalCentroCustoAberto" max-width="500px">
      <v-card class="background-card">
        <v-card-title class="text-h6 pa-4">
          <v-icon icon="mdi-warehouse" class="mr-2"></v-icon>
          Previsão de Débitos por Centro de Custo
        </v-card-title>

        <v-card-text class="pa-4">
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="filtrosCentroCusto.dtini"
                label="Data Início *"
                type="date"
                variant="outlined"
                density="compact"
                :theme="themeStore.darkMode ? 'dark' : 'light'"
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="filtrosCentroCusto.dtfim"
                label="Data Fim *"
                type="date"
                variant="outlined"
                density="compact"
                :theme="themeStore.darkMode ? 'dark' : 'light'"
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-checkbox
                v-model="filtrosCentroCusto.quebraPagina"
                label="1 Centro de Custo por página"
                density="compact"
                color="var(--text-color-laranja)"
                hide-details
              ></v-checkbox>
            </v-col>

            <v-col cols="12">
              <v-checkbox
                v-model="filtrosCentroCusto.exibirGrafico"
                label="Exibir gráfico de distribuição"
                density="compact"
                color="var(--text-color-laranja)"
                hide-details
              ></v-checkbox>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="modalCentroCustoAberto = false" size="small">Cancelar</v-btn>
          <v-btn color="var(--text-color-laranja)" variant="flat" class="text-white" @click="gerarRelatorioCentroCusto" :loading="gerando" size="small">Gerar Relatório</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal Títulos a Pagar -->
    <v-dialog v-model="modalPagarAberto" max-width="600px">
      <v-card class="background-card">
        <v-card-title class="text-h6 pa-4">
          <v-icon icon="mdi-credit-card-outline" class="mr-2"></v-icon>
          Relatório Títulos a Pagar
        </v-card-title>

        <v-card-text class="pa-4">
          <v-row>
            <v-col cols="12">
              <v-select
                v-model="filtrosPagar.idfornecedor"
                :items="fornecedores"
                item-title="label"
                item-value="value"
                label="Fornecedor"
                variant="outlined"
                density="compact"
                clearable
                :theme="themeStore.darkMode ? 'dark' : 'light'"
              ></v-select>
            </v-col>

            <v-col cols="6">
              <v-label class="text-subtitle-2 mb-2">Período?</v-label>
              <v-radio-group v-model="filtrosPagar.tpperiodo">
                <v-radio label="Cadastro" value="1"></v-radio>
                <v-radio label="Vencimento" value="2"></v-radio>
              </v-radio-group>
            </v-col>

            <v-col cols="6">
              <v-select
                v-model="filtrosPagar.idlocalcobranca"
                :items="locaisCobranca"
                item-title="label"
                item-value="value"
                label="Local de Cobrança"
                variant="outlined"
                density="compact"
                clearable
                :theme="themeStore.darkMode ? 'dark' : 'light'"
              ></v-select>
            </v-col>

            <v-col cols="6">
              <v-text-field
                v-model="filtrosPagar.dtini"
                label="Data Início"
                type="date"
                variant="outlined"
                density="compact"
                :theme="themeStore.darkMode ? 'dark' : 'light'"
              ></v-text-field>
            </v-col>

            <v-col cols="6">
              <v-text-field
                v-model="filtrosPagar.dtfim"
                label="Data Fim"
                type="date"
                variant="outlined"
                density="compact"
                :theme="themeStore.darkMode ? 'dark' : 'light'"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="modalPagarAberto = false" size="small">Cancelar</v-btn>
          <v-btn color="var(--text-color-laranja)" variant="flat" class="text-white" @click="gerarRelatorioTitulosPagar" :loading="gerando" size="small">Gerar Relatório</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal Títulos a Receber -->
    <v-dialog v-model="modalReceberAberto" max-width="600px">
      <v-card class="background-card">
        <v-card-title class="text-h6 pa-4">
          <v-icon icon="mdi-cash-plus" class="mr-2"></v-icon>
          Relatório Títulos a Receber
        </v-card-title>

        <v-card-text class="pa-4">
          <v-row>
            <v-col cols="12">
              <v-select
                v-model="filtrosReceber.idCliente"
                :items="clientes"
                item-title="label"
                item-value="value"
                label="Cliente"
                variant="outlined"
                density="compact"
                clearable
                :theme="themeStore.darkMode ? 'dark' : 'light'"
              ></v-select>
            </v-col>

            <v-col cols="6">
              <v-label class="text-subtitle-2 mb-2">Período?</v-label>
              <v-radio-group v-model="filtrosReceber.tpperiodo">
                <v-radio label="Cadastro" value="1"></v-radio>
                <v-radio label="Vencimento" value="2"></v-radio>
              </v-radio-group>
            </v-col>

            <v-col cols="6">
              <v-select
                v-model="filtrosReceber.idlocalcobranca"
                :items="locaisCobranca"
                item-title="label"
                item-value="value"
                label="Local de Cobrança"
                variant="outlined"
                density="compact"
                clearable
                :theme="themeStore.darkMode ? 'dark' : 'light'"
              ></v-select>
            </v-col>

            <v-col cols="6">
              <v-text-field
                v-model="filtrosReceber.dtini"
                label="Data Início"
                type="date"
                variant="outlined"
                density="compact"
                :theme="themeStore.darkMode ? 'dark' : 'light'"
              ></v-text-field>
            </v-col>

            <v-col cols="6">
              <v-text-field
                v-model="filtrosReceber.dtfim"
                label="Data Fim"
                type="date"
                variant="outlined"
                density="compact"
                :theme="themeStore.darkMode ? 'dark' : 'light'"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="modalReceberAberto = false" size="small">Cancelar</v-btn>
          <v-btn color="var(--text-color-laranja)" variant="flat" class="text-white" @click="gerarRelatorioTitulosReceber" :loading="gerando" size="small">Gerar Relatório</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal Débitos Realizados -->
    <v-dialog v-model="modalDebitosRealizadosAberto" max-width="500px">
      <v-card class="background-card">
        <v-card-title class="text-h6 pa-4">
          <v-icon icon="mdi-cash-check" class="mr-2" color="error"></v-icon>
          Débitos Realizados por Centro de Custo
        </v-card-title>

        <v-card-text class="pa-4">
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="filtrosDebitosRealizados.dtini"
                label="Data Início *"
                type="date"
                variant="outlined"
                density="compact"
                :theme="themeStore.darkMode ? 'dark' : 'light'"
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="filtrosDebitosRealizados.dtfim"
                label="Data Fim *"
                type="date"
                variant="outlined"
                density="compact"
                :theme="themeStore.darkMode ? 'dark' : 'light'"
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-checkbox
                v-model="filtrosDebitosRealizados.quebraPagina"
                label="1 Centro de Custo por página"
                density="compact"
                color="var(--text-color-laranja)"
                hide-details
              ></v-checkbox>
            </v-col>

            <v-col cols="12">
              <v-checkbox
                v-model="filtrosDebitosRealizados.exibirGrafico"
                label="Exibir gráfico de distribuição"
                density="compact"
                color="var(--text-color-laranja)"
                hide-details
              ></v-checkbox>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="modalDebitosRealizadosAberto = false" size="small">Cancelar</v-btn>
          <v-btn color="error" variant="flat" class="text-white" @click="gerarRelatorioDebitosRealizados" :loading="gerando" size="small">Gerar Relatório</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useThemeStore } from '@/stores/config-temas/theme'
import { useCCustoStore } from '@/stores/APIs/ccusto'
import { useFinanceiroStore } from '@/stores/APIs/financeiro'
import { toast } from 'vue3-toastify'
import { TEMPLATE_CENTRO_CUSTO } from '@/components/impressos/centrodecusto.js'
import { TEMPLATE_DEBITOS_REALIZADOS } from '@/components/impressos/debitosrealizados.js'

const themeStore = useThemeStore()
const ccustoStore = useCCustoStore()
const financeiroStore = useFinanceiroStore()

const modalCentroCustoAberto = ref(false)
const modalPagarAberto = ref(false)
const modalReceberAberto = ref(false)
const modalDebitosRealizadosAberto = ref(false)
const gerando = ref(false)

const centrosCusto = ref([])
const fornecedores = ref([])
const clientes = ref([])
const locaisCobranca = ref([])

// Obter idEmpresa do localStorage
const idEmpresa = ref(null)

onMounted(async () => {
  const stored = localStorage.getItem('idempresa') || localStorage.getItem('empresa_id')
  idEmpresa.value = stored || 1
  console.log('🏢 ID Empresa:', idEmpresa.value)
  
  // Carregar todos os dados em paralelo na montagem
  console.log('📥 Carregando dados iniciais...')
  
  try {
    // Carregar centros de custo
    console.log('1️⃣ Carregando centros de custo...')
    await ccustoStore.listarCCusto()
    centrosCusto.value = (ccustoStore.centrosCusto || []).map(cc => ({
      id: cc.id,
      nome: cc.desccentrocusto || cc.nome || cc.descricao || `Centro ${cc.id}`
    }))
    console.log('✅ Centros de custo:', centrosCusto.value.length)
    
    // Carregar fornecedores
    console.log('2️⃣ Carregando fornecedores...')
    const fornecedoresResponse = await financeiroStore.buscarPessoasFornecedores('', idEmpresa.value)
    const fornecedoresData = fornecedoresResponse?.data || fornecedoresResponse || []
    fornecedores.value = (fornecedoresData || []).map(f => ({
      label: f.nome_razao || f.descpessoa || f.nome || f.razaosocial || f.NOME || f.DESCPESSOA || `Fornecedor ${f.id || f.ID}`,
      value: f.id || f.ID || f.id_pessoa || f.ID_PESSOA
    }))
    console.log('✅ Fornecedores:', fornecedores.value.length)
    
    // Carregar clientes
    console.log('3️⃣ Carregando clientes...')
    const clientesResponse = await financeiroStore.buscarPessoasClientes('', idEmpresa.value)
    const clientesData = clientesResponse?.data || clientesResponse || []
    clientes.value = (clientesData || []).map(c => ({
      label: c.nome_razao || c.descpessoa || c.nome || c.razaosocial || c.NOME || c.DESCPESSOA || `Cliente ${c.id || c.ID}`,
      value: c.id || c.ID || c.id_pessoa || c.ID_PESSOA
    }))
    console.log('✅ Clientes:', clientes.value.length)
    
    // Carregar locais de cobrança
    console.log('4️⃣ Carregando locais de cobrança...')
    const locaisResponse = await financeiroStore.buscarLocaisCobranca()
    const locaisData = locaisResponse?.data || locaisResponse || []
    locaisCobranca.value = (locaisData || []).map(l => ({
      label: l.desclocalcobranca || l.desclocal || l.nome || l.descricao || l.NOME || l.DESCLOCAL || `Local ${l.id || l.ID}`,
      value: l.id || l.ID || l.id_localcobranca || l.ID_LOCALCOBRANCA
    }))
    console.log('✅ Locais de cobrança:', locaisCobranca.value.length)
    
    console.log('✅ Todos os dados carregados com sucesso!')
  } catch (error) {
    console.error('❌ Erro ao carregar dados iniciais:', error)
    toast.error('Erro ao carregar dados: ' + error.message)
  }
})

const filtrosCentroCusto = reactive({
  custoEspecifico: 'N',
  idCentroCusto: null,
  quebrapagina: 'S',
  quebraPagina: false,
  exibirGrafico: true,
  dtini: '',
  dtfim: ''
})

const filtrosPagar = reactive({
  idfornecedor: null,
  tpperiodo: '1',
  idlocalcobranca: null,
  dtini: '',
  dtfim: ''
})

const filtrosReceber = reactive({
  idCliente: null,
  tpperiodo: '1',
  idlocalcobranca: null,
  dtini: '',
  dtfim: ''
})

const filtrosDebitosRealizados = reactive({
  dtini: '',
  dtfim: '',
  quebraPagina: false,
  exibirGrafico: true
})

const abrirModalCentroCusto = () => {
  modalCentroCustoAberto.value = true
}

const abrirModalPagar = () => {
  modalPagarAberto.value = true
}

const abrirModalReceber = () => {
  modalReceberAberto.value = true
}

const abrirModalDebitosRealizados = () => {
  modalDebitosRealizadosAberto.value = true
}

// Template HTML para impressão
const TEMPLATE_TITULOS = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Títulos a Pagar/Receber - SimplesFique</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Roboto', Arial, sans-serif;
            font-size: 12px;
            color: #2b2b2b;
            padding: 20px;
            max-width: 900px;
            margin: 0 auto;
            background: #fff;
        }

        .header {
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 3px solid #F57C00;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }

        .logo-text {
            font-size: 26px;
            font-weight: bold;
            color: #F57C00;
        }

        .logo-text span {
            color: #de7e3e;
        }

        .info-relatorio {
            font-size: 12px;
            line-height: 1.6;
            text-align: right;
        }

        .info-relatorio strong {
            color: #F57C00;
        }

        .section-title {
            color: #F57C00;
            font-size: 18px;
            font-weight: bold;
            margin: 25px 0 15px 0;
            display: flex;
            align-items: baseline;
            gap: 10px;
        }

        .section-title span {
            font-size: 12px;
            font-weight: normal;
            color: #666;
        }

        .table-titulos {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .table-titulos thead {
            background: linear-gradient(135deg, #F57C00 0%, #de7e3e 100%);
            color: white;
        }

        .table-titulos th {
            padding: 12px 10px;
            text-align: left;
            font-weight: 600;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .table-titulos th.text-right {
            text-align: right;
        }

        .table-titulos th.text-center {
            text-align: center;
        }

        .table-titulos td {
            padding: 10px;
            border-bottom: 1px solid #f0f0f0;
            font-size: 11px;
        }

        .table-titulos td.text-right {
            text-align: right;
        }

        .table-titulos td.text-center {
            text-align: center;
        }

        .table-titulos tbody tr:nth-child(even) {
            background-color: #fafafa;
        }

        .table-titulos tbody tr:hover {
            background-color: #fff8f3;
        }

        .valor-negativo {
            color: #d32f2f;
            font-weight: 500;
        }

        .valor-positivo {
            color: #2e7d32;
            font-weight: 500;
        }

        .table-resumo {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            background: #fafafa;
            border-radius: 8px;
            overflow: hidden;
        }

        .table-resumo tr {
            border-bottom: 1px solid #e8e8e8;
        }

        .table-resumo tr:last-child {
            border-bottom: none;
        }

        .table-resumo td {
            padding: 10px 12px;
            font-size: 11px;
        }

        .table-resumo td:last-child {
            text-align: right;
            font-weight: 600;
        }

        .table-resumo .destaque {
            background-color: #fff3e0;
        }

        .table-resumo .destaque td:last-child {
            color: #F57C00;
            font-size: 13px;
        }

        .table-resumo .entrada td:last-child {
            color: #2e7d32;
        }

        .table-resumo .saida td:last-child {
            color: #d32f2f;
        }

        .footer-note {
            font-size: 10px;
            color: #888;
            text-align: center;
            margin-top: 25px;
            padding-top: 15px;
            border-top: 1px solid #e8e8e8;
        }

        .footer-brand {
            margin-top: 8px;
            color: #F57C00;
            font-weight: 500;
        }

        .info-impressao {
            font-size: 9px;
            color: #aaa;
            margin-top: 5px;
        }

        @media print {
            body {
                padding: 10px;
            }

            .table-titulos tbody tr:hover {
                background-color: transparent;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo-text">Simples<span>Fique</span></div>
        <div class="info-relatorio">
            <strong>Tipo:</strong> {{tipoRelatorio}}<br>
            <strong>Empresa:</strong> {{empresa}}<br>
            <strong>Operador:</strong> {{operador}}
        </div>
    </div>

    <h2 class="section-title">{{tipoRelatorio}} <span>(Período de {{dataInicio}} a {{dataFim}})</span></h2>

    <table class="table-titulos">
        <thead>
            <tr>
                <th style="width: 80px;">Data Cad.</th>
                <th style="width: 80px;">Vencimento</th>
                <th>{{tipoContraparte}}</th>
                <th style="width: 80px;" class="text-center">Documento</th>
                <th style="width: 100px;" class="text-right">Valor (R$)</th>
                <th style="width: 80px;" class="text-right">Juros (R$)</th>
                <th style="width: 80px;" class="text-right">Multa (R$)</th>
                <th style="width: 100px;" class="text-right">Líquido (R$)</th>
            </tr>
        </thead>
        <tbody>
            {{LINHAS_TITULOS}}
        </tbody>
    </table>

    <h2 class="section-title">Resumo <span>({{dataFim}})</span></h2>

    <table class="table-resumo">
        <tr>
            <td>Total de Títulos</td>
            <td>{{totalTitulos}}</td>
        </tr>
        <tr class="entrada">
            <td>Total Valor</td>
            <td>R$ {{totalValor}}</td>
        </tr>
        <tr class="saida">
            <td>Total Juros</td>
            <td>R$ {{totalJuros}}</td>
        </tr>
        <tr class="saida">
            <td>Total Multa</td>
            <td>R$ {{totalMulta}}</td>
        </tr>
        <tr class="destaque">
            <td><strong>Total Líquido</strong></td>
            <td>R$ {{totalLiquido}}</td>
        </tr>
    </table>

    <div class="footer-note">
        Documento gerado automaticamente pelo sistema.
        <div class="footer-brand">SimplesFique - Sistema de Gestão Empresarial</div>
        <div class="info-impressao">Impresso em: {{dataImpressao}}</div>
    </div>
</body>
</html>`

// Função auxiliar para abrir impressão com template HTML
const abrirImpressao = (tipoRelatorio, dados, filtros) => {
  try {
    console.log('🖨️ Iniciando impressão:', tipoRelatorio)
    console.log('📊 Dados recebidos:', dados)
    console.log('🔧 Filtros:', filtros)
    
    if (!dados || dados.length === 0) {
      console.warn('⚠️ Nenhum dado para exibir')
      toast.warning('Nenhum dado encontrado para exibir')
      return
    }
    
    let html = TEMPLATE_TITULOS
    
    // Dados padrão
    const dataAtual = new Date()
    const empresa = localStorage.getItem('empresa_nome') || 'Empresa'
    const operador = localStorage.getItem('usuario_nome') || 'Sistema'
    const logo = localStorage.getItem('empresa_logo') || '/logo.png'
    
    console.log('📝 Empresa:', empresa, 'Operador:', operador, 'Logo:', logo)
    
    // Formatar datas
    const formatarData = (data) => {
      if (!data) return ''
      const d = new Date(data)
      return d.toLocaleDateString('pt-BR')
    }
    
    const formatarMoeda = (valor) => {
      if (!valor) return '0,00'
      return parseFloat(valor).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }
    
    // Calcular totais
    let totalValor = 0
    let totalJuros = 0
    let totalMulta = 0
    let totalLiquido = 0
    
    const titulos = (dados || []).map(item => {
      const valor = parseFloat(item.vlrparcela || item.vltitulo || 0)
      const juros = parseFloat(item.vljuros || item.juros || 0)
      const multa = parseFloat(item.vlmulta || item.multa || 0)
      const liquido = valor + juros + multa
      
      totalValor += valor
      totalJuros += juros
      totalMulta += multa
      totalLiquido += liquido
      
      return {
        dataCadastro: formatarData(item.dtemissao || item.dtcadastro || item.data),
        dataVencimento: formatarData(item.dtvencimento || item.vencimento),
        contraparte: item.fornecedor || item.nome_razao || item.descpessoa || item.nome || 'N/A',
        documento: item.nrdocumento || item.documento || 'N/A',
        valor: formatarMoeda(valor),
        juros: juros > 0 ? formatarMoeda(juros) : '0,00',
        multa: multa > 0 ? formatarMoeda(multa) : '0,00',
        liquido: formatarMoeda(liquido)
      }
    })
    
    console.log('✅ Títulos processados:', titulos.length)
    console.log('🔧 Logo URL:', logo)
    
    // Substituir variáveis no template
    const tipoContraparte = tipoRelatorio.includes('Pagar') ? 'Fornecedor' : 'Cliente'
    
    html = html.replace(/src="{{logoUrl}}"/g, `src="${logo}"`)
    html = html.replace(/{{tipoRelatorio}}/g, tipoRelatorio)
    html = html.replace(/{{empresa}}/g, empresa)
    html = html.replace(/{{operador}}/g, operador)
    html = html.replace(/{{dataInicio}}/g, formatarData(filtros.dtini))
    html = html.replace(/{{dataFim}}/g, formatarData(filtros.dtfim))
    html = html.replace(/{{dataImpressao}}/g, dataAtual.toLocaleString('pt-BR'))
    html = html.replace(/{{tipoContraparte}}/g, tipoContraparte)
    html = html.replace(/{{totalTitulos}}/g, titulos.length)
    html = html.replace(/{{totalValor}}/g, formatarMoeda(totalValor))
    html = html.replace(/{{totalJuros}}/g, formatarMoeda(totalJuros))
    html = html.replace(/{{totalMulta}}/g, formatarMoeda(totalMulta))
    html = html.replace(/{{totalLiquido}}/g, formatarMoeda(totalLiquido))
    
    // Gerar linhas de títulos
    let linhasTitulos = ''
    titulos.forEach(titulo => {
      linhasTitulos += `
        <tr>
          <td>${titulo.dataCadastro}</td>
          <td>${titulo.dataVencimento}</td>
          <td>${titulo.contraparte}</td>
          <td class="text-center">${titulo.documento}</td>
          <td class="text-right valor-positivo">${titulo.valor}</td>
          <td class="text-right ${parseFloat(titulo.juros) > 0 ? 'valor-negativo' : ''}">${titulo.juros}</td>
          <td class="text-right ${parseFloat(titulo.multa) > 0 ? 'valor-negativo' : ''}">${titulo.multa}</td>
          <td class="text-right valor-positivo"><strong>${titulo.liquido}</strong></td>
        </tr>
      `
    })
    
    html = html.replace(/{{LINHAS_TITULOS}}/g, linhasTitulos)
    
    console.log('🖥️ Abrindo janela de impressão...')
    
    // Abrir em nova janela com print
    const janela = window.open('', '_blank', 'width=1000,height=800')
    
    if (!janela) {
      console.error('❌ Pop-up foi bloqueado pelo navegador!')
      toast.error('Pop-up foi bloqueado. Verifique as configurações do navegador.')
      return
    }
    
    janela.document.write(html)
    janela.document.close()
    
    console.log('✅ Impressão aberta com sucesso!')
    
    // Aguardar carregamento e abrir print
    setTimeout(() => {
      janela.print()
    }, 500)
  } catch (err) {
    console.error('❌ Erro ao abrir impressão:', err)
    console.error('Stack:', err.stack)
    toast.error('Erro ao abrir impressão: ' + err.message)
  }
}

// Função para abrir impressão de Centro de Custo (mesma lógica da PrevisaoDebitosView)
const abrirImpressaoCentroCusto = (previsao, filtros) => {
  try {
    console.log('🖨️ Iniciando impressão: Previsão Centro de Custo')
    console.log('📊 Previsão recebida:', (previsao || []).length)
    
    if (!previsao || previsao.length === 0) {
      console.warn('⚠️ Nenhum dado para exibir')
      toast.warning('Nenhum dado encontrado para exibir')
      return
    }
    
    // Usar template importado diretamente
    let html = TEMPLATE_CENTRO_CUSTO
    
    // Dados padrão
    const dataAtual = new Date()
    const empresa = localStorage.getItem('empresa_nome') || 'Empresa'
    const operador = localStorage.getItem('usuario_nome') || 'Sistema'
    const logo = localStorage.getItem('empresa_logo') || '/logo.png'
    
    console.log('📝 Empresa:', empresa, 'Operador:', operador)
    
    // Formatar data para exibição
    const formatarData = (data) => {
      if (!data) return 'N/A'
      const [ano, mes, dia] = data.split('-')
      return `${dia}/${mes}/${ano}`
    }
    
    // Formatar moeda
    const formatarMoeda = (valor) => {
      const num = parseFloat(valor) || 0
      if (num === 0) return '0,00'
      return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }
    
    // Meses para formatação
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    
    // 1. Extrair datas únicas de vencimento (mesma lógica da PrevisaoDebitosView)
    const datasUnicas = new Set()
    previsao.forEach(item => {
      const dtVenc = item.dtvencimento || item.dtprevista || item.data
      if (dtVenc) {
        datasUnicas.add(dtVenc)
      }
    })
    
    // 2. Ordenar datas e criar estrutura de dias
    const datasOrdenadas = Array.from(datasUnicas).sort()
    const diasComCobranca = datasOrdenadas.map(dataStr => {
      const data = new Date(dataStr + 'T00:00:00')
      const dia = data.getDate()
      const mes = meses[data.getMonth()]
      
      return {
        key: `dia_${dataStr}`,
        label: `${dia}/${mes}`,
        data: data,
        dataStr: dataStr
      }
    })
    
    console.log('📅 Dias com cobrança:', diasComCobranca.length)
    
    // 3. Mapear dados para formato de previsões (mesma lógica da PrevisaoDebitosView)
    const previsoesProcessadas = previsao.map(item => {
      const previsaoItem = {
        centroCusto: item.desccentrocusto || item.DESCCENTROCUSTO || 'Sem Centro de Custo',
        descricao: item.descconta || item.descplanoconta || item.DESCCONTA || item.descricao || 'Despesa',
        id_ccusto: item.id_ccusto || item.idccusto,
        dtvencimento: item.dtvencimento || item.dtprevista || item.data,
        total: parseFloat(item.valor || item.vlrprevisao || 0)
      }
      
      // Inicializar todos os dias com 0
      diasComCobranca.forEach(dia => {
        previsaoItem[dia.key] = 0
      })
      
      // Colocar o valor no dia correto de vencimento
      const dtVenc = item.dtvencimento || item.dtprevista || item.data
      if (dtVenc) {
        const diaKey = `dia_${dtVenc}`
        previsaoItem[diaKey] = parseFloat(item.valor || item.vlrprevisao || 0)
      }
      
      return previsaoItem
    })
    
    // 4. Agrupar por centro de custo (mesma lógica da PrevisaoDebitosView)
    const agrupado = {}
    
    previsoesProcessadas.forEach(item => {
      if (!agrupado[item.centroCusto]) {
        agrupado[item.centroCusto] = {
          centroCusto: item.centroCusto,
          despesas: [],
          total: 0
        }
        
        // Inicializa as colunas de dias
        diasComCobranca.forEach(dia => {
          agrupado[item.centroCusto][dia.key] = 0
        })
      }
      
      // Adiciona a despesa
      agrupado[item.centroCusto].despesas.push(item)
      agrupado[item.centroCusto].total += item.total || 0
      
      // Soma os valores por dia
      diasComCobranca.forEach(dia => {
        agrupado[item.centroCusto][dia.key] += item[dia.key] || 0
      })
    })
    
    const centrosCustoAgrupados = Object.values(agrupado)
    
    // 5. Calcular totais por dia
    const totaisPorDia = diasComCobranca.map(dia => {
      return previsoesProcessadas.reduce((sum, item) => sum + (item[dia.key] || 0), 0)
    })
    
    const totalGeral = previsoesProcessadas.reduce((sum, item) => sum + (item.total || 0), 0)
    
    console.log('📊 Centros de custo agrupados:', centrosCustoAgrupados.length)
    console.log('💰 Total geral:', totalGeral)
    
    // 5.1. Determinar classe de tamanho baseada na quantidade de colunas
    const numColunas = diasComCobranca.length
    let colsClass = 'cols-small'
    if (numColunas > 20) {
      colsClass = 'cols-xlarge'
    } else if (numColunas > 12) {
      colsClass = 'cols-large'
    } else if (numColunas > 7) {
      colsClass = 'cols-medium'
    }
    console.log(`📐 Colunas: ${numColunas}, Classe: ${colsClass}`)
    
    // 6. Função para dividir array em grupos de N elementos
    const dividirEmGrupos = (array, tamanho) => {
      const grupos = []
      for (let i = 0; i < array.length; i += tamanho) {
        grupos.push(array.slice(i, i + tamanho))
      }
      return grupos
    }
    
    // Dividir dias em grupos de 15
    const DIAS_POR_TABELA = 15
    const gruposDeDias = dividirEmGrupos(diasComCobranca, DIAS_POR_TABELA)
    
    console.log(`📅 Total de dias: ${diasComCobranca.length}, Grupos de ${DIAS_POR_TABELA}: ${gruposDeDias.length}`)
    
    // Função para limpar nome do centro de custo (remove "Ativo" repetido, etc)
    const limparNomeCCusto = (nome) => {
      if (!nome) return ''
      // Remove " - Ativo" ou "- Ativo" do final e variações
      let limpo = nome.replace(/\s*-?\s*Ativo$/i, '').trim()
      return limpo || nome
    }
    
    // 7. Gerar HTML - UMA TABELA POR CENTRO DE CUSTO (com quebra a cada 15 dias)
    let tabelasCCusto = ''
    let totalDespesasConsolidadas = 0
    
    // Verificar se deve quebrar página por centro de custo
    const quebraPaginaPorCCusto = filtros.quebraPagina === true
    
    centrosCustoAgrupados.forEach((cc, indexCCusto) => {
      const nomeCCusto = limparNomeCCusto(cc.centroCusto)
      
      // Consolidar despesas iguais (mesmo nome) em uma única linha
      const despesasConsolidadas = {}
      cc.despesas.forEach(despesa => {
        const nomeDesp = despesa.descricao
        
        if (!despesasConsolidadas[nomeDesp]) {
          despesasConsolidadas[nomeDesp] = {
            descricao: nomeDesp,
            total: 0
          }
          // Inicializa dias com 0
          diasComCobranca.forEach(dia => {
            despesasConsolidadas[nomeDesp][dia.key] = 0
          })
        }
        
        // Soma valores
        despesasConsolidadas[nomeDesp].total += despesa.total || 0
        diasComCobranca.forEach(dia => {
          despesasConsolidadas[nomeDesp][dia.key] += despesa[dia.key] || 0
        })
      })
      
      const listaConsolidada = Object.values(despesasConsolidadas)
      totalDespesasConsolidadas += listaConsolidada.length
      
      // Abrir div do bloco do centro de custo (quebra de página apenas a partir do segundo)
      const classeQuebraPaginaCC = (quebraPaginaPorCCusto && indexCCusto > 0) ? ' quebra-pagina' : ''
      tabelasCCusto += `<div class="ccusto-bloco${classeQuebraPaginaCC}">`
      
      // Cabeçalho do centro de custo
      tabelasCCusto += `<h3 class="ccusto-titulo">${nomeCCusto}</h3>`
      
      // Gerar uma tabela para cada grupo de dias (máx 15 por tabela)
      gruposDeDias.forEach((grupoDias, indexGrupo) => {
        // Header dos dias deste grupo
        let headersDiasGrupo = ''
        grupoDias.forEach(dia => {
          headersDiasGrupo += `<th>${dia.label}</th>`
        })
        
        // Calcular subtotal deste grupo de dias
        let subtotalGrupo = 0
        grupoDias.forEach(dia => {
          subtotalGrupo += cc[dia.key] || 0
        })
        
        // Só mostrar tabela se tiver valores neste grupo
        const temValoresNoGrupo = listaConsolidada.some(despesa => 
          grupoDias.some(dia => (despesa[dia.key] || 0) > 0)
        )
        
        if (!temValoresNoGrupo && gruposDeDias.length > 1) {
          return // Pula grupos vazios quando há múltiplos grupos
        }
        
        // Indicador de parte (se múltiplas tabelas)
        const indicadorParte = gruposDeDias.length > 1 ? ` <span class="parte-indicador">(Parte ${indexGrupo + 1}/${gruposDeDias.length})</span>` : ''
        
        // Início da tabela
        tabelasCCusto += `<table class="table-ccusto">
          <thead>
            <tr>
              <th class="text-left" style="min-width: 150px;">Despesa${indicadorParte}</th>
              ${headersDiasGrupo}
              <th style="min-width: 80px;">Subtotal</th>
            </tr>
          </thead>
          <tbody>`
        
        // Linhas das despesas consolidadas (apenas colunas deste grupo)
        listaConsolidada.forEach(despesa => {
          // Calcular subtotal desta despesa para este grupo de dias
          let subtotalDespesa = 0
          grupoDias.forEach(dia => {
            subtotalDespesa += despesa[dia.key] || 0
          })
          
          let linha = `<tr><td>${despesa.descricao}</td>`
          grupoDias.forEach(dia => {
            const valor = despesa[dia.key] || 0
            linha += `<td>${valor > 0 ? formatarMoeda(valor) : ''}</td>`
          })
          linha += `<td class="col-total">${formatarMoeda(subtotalDespesa)}</td></tr>`
          tabelasCCusto += linha
        })
        
        // Linha de subtotal do centro de custo (apenas dias deste grupo)
        tabelasCCusto += `<tr class="row-subtotal"><td><strong>Subtotal</strong></td>`
        grupoDias.forEach(dia => {
          const valor = cc[dia.key] || 0
          tabelasCCusto += `<td>${valor > 0 ? formatarMoeda(valor) : ''}</td>`
        })
        tabelasCCusto += `<td class="col-total"><strong>${formatarMoeda(subtotalGrupo)}</strong></td></tr>`
        
        // Fechar tabela
        tabelasCCusto += `</tbody></table>`
      })
      
      // Fechar div do bloco do centro de custo
      tabelasCCusto += `</div>`
    })
    
    // 8. Gerar HTML dos totais por dia (para resumo geral)
    let totaisDias = ''
    totaisPorDia.forEach(total => {
      totaisDias += `<td>${formatarMoeda(total)}</td>`
    })
    
    // 9. Gerar dados do gráfico e seção condicional
    const exibirGrafico = filtros.exibirGrafico === true
    const dadosGrafico = {
      labels: centrosCustoAgrupados.map(cc => limparNomeCCusto(cc.centroCusto)),
      valores: centrosCustoAgrupados.map(cc => cc.total || 0),
      total: totalGeral
    }
    
    // HTML do gráfico (só inclui se exibirGrafico for true)
    // Usa concatenação para evitar que Vue interprete as tags script
    let secaoGrafico = ''
    if (exibirGrafico) {
      const scr = 'script'
      secaoGrafico = `
    <!-- Gráfico de Distribuição -->
    <div class="grafico-container" style="margin-top: 30px; page-break-inside: avoid;">
        <h2 class="section-title">Distribuição por Centro de Custo</h2>
        <div style="display: flex; justify-content: center; align-items: center; gap: 30px; flex-wrap: wrap;">
            <canvas id="graficoPizza" width="350" height="350"></canvas>
            <div id="legendaGrafico" style="font-size: 11px; line-height: 1.8;"></div>
        </div>
    </div>
    <` + scr + ` src="https://cdn.jsdelivr.net/npm/chart.js"></` + scr + `>
    <` + scr + `>
        const dadosGrafico = ${JSON.stringify(dadosGrafico)};
        const cores = ['#FF8C42', '#FFA726', '#FFB74D', '#FFCC80', '#FFE0B2', '#FF9800', '#FB8C00', '#F57C00', '#EF6C00', '#E65100', '#FFD54F', '#FFCA28', '#FFC107', '#FFB300', '#FFA000'];
        const ctx = document.getElementById('graficoPizza').getContext('2d');
        new Chart(ctx, {
            type: 'pie',
            data: { labels: dadosGrafico.labels, datasets: [{ data: dadosGrafico.valores, backgroundColor: cores.slice(0, dadosGrafico.labels.length), borderColor: '#fff', borderWidth: 2 }] },
            options: { responsive: false, plugins: { legend: { display: false }, tooltip: { enabled: false } } }
        });
        const legendaDiv = document.getElementById('legendaGrafico');
        let legendaHtml = '';
        dadosGrafico.labels.forEach((label, i) => {
            const cor = cores[i % cores.length];
            const valor = dadosGrafico.valores[i];
            const percentual = ((valor / dadosGrafico.total) * 100).toFixed(1);
            const valorFormatado = valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            legendaHtml += '<div style="display: flex; align-items: center; margin-bottom: 5px;">';
            legendaHtml += '<span style="display: inline-block; width: 14px; height: 14px; background: ' + cor + '; margin-right: 8px; border-radius: 3px;"></span>';
            legendaHtml += '<span style="min-width: 180px;">' + label + '</span>';
            legendaHtml += '<span style="min-width: 100px; text-align: right; font-weight: 500;">' + valorFormatado + '</span>';
            legendaHtml += '<span style="min-width: 60px; text-align: right; color: #666;">(' + percentual + '%)</span>';
            legendaHtml += '</div>';
        });
        legendaDiv.innerHTML = legendaHtml;
    </` + scr + `>`
    }
    
    // 10. Substituir variáveis no template
    html = html.replace(/{{logoUrl}}/g, logo)
    html = html.replace(/{{colsClass}}/g, colsClass)
    html = html.replace(/{{empresa}}/g, empresa)
    html = html.replace(/{{operador}}/g, operador)
    html = html.replace(/{{dataInicio}}/g, formatarData(filtros.dtini))
    html = html.replace(/{{dataFim}}/g, formatarData(filtros.dtfim))
    html = html.replace(/{{dataImpressao}}/g, dataAtual.toLocaleString('pt-BR'))
    html = html.replace(/{{TABELAS_CCUSTO}}/g, tabelasCCusto)
    html = html.replace(/{{TOTAIS_DIAS}}/g, totaisDias)
    html = html.replace(/{{totalGeral}}/g, formatarMoeda(totalGeral))
    html = html.replace(/{{totalCentrosCusto}}/g, centrosCustoAgrupados.length)
    html = html.replace(/{{totalDespesas}}/g, totalDespesasConsolidadas)
    html = html.replace(/{{totalDias}}/g, diasComCobranca.length)
    html = html.replace(/{{SECAO_GRAFICO}}/g, secaoGrafico)
    
    console.log('🖥️ Abrindo janela de impressão...')
    
    // Abrir em nova janela com print
    const janela = window.open('', '_blank', 'width=1200,height=800')
    
    if (!janela) {
      console.error('❌ Pop-up foi bloqueado pelo navegador!')
      toast.error('Pop-up foi bloqueado. Verifique as configurações do navegador.')
      return
    }
    
    janela.document.write(html)
    janela.document.close()
    
    console.log('✅ Impressão aberta com sucesso!')
    
    // Aguardar carregamento do Chart.js e abrir print
    setTimeout(() => {
      janela.print()
    }, 1000)
  } catch (err) {
    console.error('❌ Erro ao abrir impressão:', err)
    console.error('Stack:', err.stack)
    toast.error('Erro ao abrir impressão: ' + err.message)
  }
}

const gerarRelatorioCentroCusto = async () => {
  if (!filtrosCentroCusto.dtini || !filtrosCentroCusto.dtfim) {
    toast.error('Informe as datas de início e fim')
    return
  }

  gerando.value = true
  try {
    console.log('📊 Gerando relatório Previsão Centro de Custo:', filtrosCentroCusto)
    
    // Buscar dados de previsão de débitos
    const previsao = await ccustoStore.buscarPrevisaoDebitos({
      idEmpresa: idEmpresa.value,
      dtini: filtrosCentroCusto.dtini,
      dtfim: filtrosCentroCusto.dtfim
    })
    
    console.log('✅ Previsão encontrada:', (previsao || []).length)
    
    // Abrir impressão com os dados
    abrirImpressaoCentroCusto(previsao, filtrosCentroCusto)
    
    toast.success('Relatório gerado com sucesso!')
    modalCentroCustoAberto.value = false
  } catch (error) {
    console.error('❌ Erro ao gerar relatório:', error)
    toast.error('Erro ao gerar relatório')
  } finally {
    gerando.value = false
  }
}

const gerarRelatorioTitulosPagar = async () => {
  if (!filtrosPagar.dtini || !filtrosPagar.dtfim) {
    toast.error('Informe as datas de início e fim')
    return
  }

  gerando.value = true
  try {
    console.log('📊 Gerando relatório Títulos a Pagar:', filtrosPagar)
    
    const filtros = {
      tpperiodo: filtrosPagar.tpperiodo,
      dtini: filtrosPagar.dtini,
      dtfim: filtrosPagar.dtfim
    }
    
    if (filtrosPagar.idfornecedor) {
      filtros.idfornecedor = filtrosPagar.idfornecedor
    }
    if (filtrosPagar.idlocalcobranca) {
      filtros.idlocalcobranca = filtrosPagar.idlocalcobranca
    }
    
    const resultado = await financeiroStore.buscarContasPagar(idEmpresa.value, filtros)
    console.log('✅ Resultado Títulos a Pagar:', resultado)
    
    // Abrir impressão com os dados
    abrirImpressao('Títulos a Pagar', resultado, filtrosPagar)
    
    modalPagarAberto.value = false
  } catch (error) {
    console.error('❌ Erro ao gerar relatório:', error)
    toast.error('Erro ao gerar relatório')
  } finally {
    gerando.value = false
  }
}

const gerarRelatorioTitulosReceber = async () => {
  if (!filtrosReceber.dtini || !filtrosReceber.dtfim) {
    toast.error('Informe as datas de início e fim')
    return
  }

  gerando.value = true
  try {
    console.log('📊 Gerando relatório Títulos a Receber:', filtrosReceber)
    
    const filtros = {
      tpperiodo: filtrosReceber.tpperiodo,
      dtini: filtrosReceber.dtini,
      dtfim: filtrosReceber.dtfim
    }
    
    if (filtrosReceber.idCliente) {
      filtros.idCliente = filtrosReceber.idCliente
    }
    if (filtrosReceber.idlocalcobranca) {
      filtros.idlocalcobranca = filtrosReceber.idlocalcobranca
    }
    
    const resultado = await financeiroStore.buscarContasReceber(idEmpresa.value, filtros)
    console.log('✅ Resultado Títulos a Receber:', resultado)
    
    // Abrir impressão com os dados
    abrirImpressao('Títulos a Receber', resultado, filtrosReceber)
    
    modalReceberAberto.value = false
  } catch (error) {
    console.error('❌ Erro ao gerar relatório:', error)
    toast.error('Erro ao gerar relatório')
  } finally {
    gerando.value = false
  }
}

// Função para abrir impressão de Débitos Realizados
const abrirImpressaoDebitosRealizados = (debitosResponse, filtros) => {
  try {
    console.log('🖨️ Iniciando impressão: Débitos Realizados')
    console.log('📊 Resposta recebida:', debitosResponse)
    
    // Verificar se deve quebrar página por centro de custo
    const quebraPaginaPorCCusto = filtros.quebraPagina || false
    console.log('📄 Quebra de página por CCusto:', quebraPaginaPorCCusto)
    
    // Extrair array de dados (API pode retornar { data: [...] } ou diretamente [...])
    const debitos = debitosResponse?.data || debitosResponse || []
    const debitosArray = Array.isArray(debitos) ? debitos : []
    
    console.log('📊 Débitos processados:', debitosArray.length)
    
    if (!debitosArray || debitosArray.length === 0) {
      console.warn('⚠️ Nenhum dado para exibir')
      toast.warning('Nenhum dado encontrado para exibir')
      return
    }
    
    // Usar template importado
    let html = TEMPLATE_DEBITOS_REALIZADOS
    
    // Dados padrão
    const dataAtual = new Date()
    const empresa = localStorage.getItem('empresa_nome') || 'Empresa'
    const operador = localStorage.getItem('usuario_nome') || 'Sistema'
    const logo = localStorage.getItem('empresa_logo') || '/logo.png'
    
    console.log('📝 Empresa:', empresa, 'Operador:', operador)
    
    // Formatar data para exibição
    const formatarData = (data) => {
      if (!data) return 'N/A'
      const [ano, mes, dia] = data.split('-')
      return `${dia}/${mes}/${ano}`
    }
    
    // Formatar moeda
    const formatarMoeda = (valor) => {
      const num = parseFloat(valor) || 0
      if (num === 0) return '0,00'
      return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }
    
    // Meses para formatação
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    
    // 1. Extrair datas únicas de vencimento
    const datasUnicas = new Set()
    debitosArray.forEach(item => {
      const dtVenc = item.dtlancamento || item.dtvencimento || item.dtpagamento || item.data
      if (dtVenc) {
        datasUnicas.add(dtVenc)
      }
    })
    
    // 2. Ordenar datas e criar estrutura de dias
    const datasOrdenadas = Array.from(datasUnicas).sort()
    const diasComDebito = datasOrdenadas.map(dataStr => {
      const data = new Date(dataStr + 'T00:00:00')
      const dia = data.getDate()
      const mes = meses[data.getMonth()]
      
      return {
        key: `dia_${dataStr}`,
        label: `${dia}/${mes}`,
        data: data,
        dataStr: dataStr
      }
    })
    
    console.log('📅 Dias com débito:', diasComDebito.length)
    
    // 3. Mapear dados para formato de débitos
    const debitosProcessados = debitosArray.map(item => {
      const debitoItem = {
        centroCusto: item.desccentrocusto || item.DESCCENTROCUSTO || 'Sem Centro de Custo',
        descricao: item.descconta || item.descplanoconta || item.DESCCONTA || item.descricao || 'Despesa',
        id_ccusto: item.id_ccusto || item.idccusto,
        dtvencimento: item.dtlancamento || item.dtvencimento || item.dtpagamento || item.data,
        total: parseFloat(item.valor || item.vlrpago || 0)
      }
      
      // Inicializar todos os dias com 0
      diasComDebito.forEach(dia => {
        debitoItem[dia.key] = 0
      })
      
      // Colocar o valor no dia correto
      const dtVenc = item.dtlancamento || item.dtvencimento || item.dtpagamento || item.data
      if (dtVenc) {
        const diaKey = `dia_${dtVenc}`
        debitoItem[diaKey] = parseFloat(item.valor || item.vlrpago || 0)
      }
      
      return debitoItem
    })
    
    // 4. Agrupar por centro de custo
    const agrupado = {}
    
    debitosProcessados.forEach(item => {
      if (!agrupado[item.centroCusto]) {
        agrupado[item.centroCusto] = {
          centroCusto: item.centroCusto,
          despesas: [],
          total: 0
        }
        
        // Inicializa as colunas de dias
        diasComDebito.forEach(dia => {
          agrupado[item.centroCusto][dia.key] = 0
        })
      }
      
      // Adiciona a despesa
      agrupado[item.centroCusto].despesas.push(item)
      agrupado[item.centroCusto].total += item.total || 0
      
      // Soma os valores por dia
      diasComDebito.forEach(dia => {
        agrupado[item.centroCusto][dia.key] += item[dia.key] || 0
      })
    })
    
    const centrosCustoAgrupados = Object.values(agrupado)
    
    // 5. Calcular totais
    const totalGeral = debitosProcessados.reduce((sum, item) => sum + (item.total || 0), 0)
    
    console.log('📊 Centros de custo agrupados:', centrosCustoAgrupados.length)
    console.log('💰 Total geral:', totalGeral)
    
    // 5.1. Determinar classe de tamanho baseada na quantidade de colunas
    const numColunas = diasComDebito.length
    let colsClass = 'cols-small'
    if (numColunas > 20) {
      colsClass = 'cols-xlarge'
    } else if (numColunas > 12) {
      colsClass = 'cols-large'
    } else if (numColunas > 7) {
      colsClass = 'cols-medium'
    }
    
    // 6. Função para dividir array em grupos de N elementos
    const dividirEmGrupos = (array, tamanho) => {
      const grupos = []
      for (let i = 0; i < array.length; i += tamanho) {
        grupos.push(array.slice(i, i + tamanho))
      }
      return grupos
    }
    
    // Dividir dias em grupos de 15
    const DIAS_POR_TABELA = 15
    const gruposDeDias = dividirEmGrupos(diasComDebito, DIAS_POR_TABELA)
    
    console.log(`📅 Total de dias: ${diasComDebito.length}, Grupos de ${DIAS_POR_TABELA}: ${gruposDeDias.length}`)
    
    // Função para limpar nome do centro de custo
    const limparNomeCCusto = (nome) => {
      if (!nome) return ''
      let limpo = nome.replace(/\s*-?\s*Ativo$/i, '').trim()
      return limpo || nome
    }
    
    // 7. Gerar HTML - UMA TABELA POR CENTRO DE CUSTO (com quebra a cada 15 dias)
    let tabelasCCusto = ''
    let totalDespesasConsolidadas = 0
    
    centrosCustoAgrupados.forEach((cc, indexCCusto) => {
      const nomeCCusto = limparNomeCCusto(cc.centroCusto)
      
      // Consolidar despesas iguais (mesmo nome) em uma única linha
      const despesasConsolidadas = {}
      cc.despesas.forEach(despesa => {
        const nomeDesp = despesa.descricao
        
        if (!despesasConsolidadas[nomeDesp]) {
          despesasConsolidadas[nomeDesp] = {
            descricao: nomeDesp,
            total: 0
          }
          // Inicializa dias com 0
          diasComDebito.forEach(dia => {
            despesasConsolidadas[nomeDesp][dia.key] = 0
          })
        }
        
        // Soma valores
        despesasConsolidadas[nomeDesp].total += despesa.total || 0
        diasComDebito.forEach(dia => {
          despesasConsolidadas[nomeDesp][dia.key] += despesa[dia.key] || 0
        })
      })
      
      const listaConsolidada = Object.values(despesasConsolidadas)
      totalDespesasConsolidadas += listaConsolidada.length
      
      // Abrir div do bloco do centro de custo (quebra de página apenas a partir do segundo)
      const classeQuebraPaginaCC = (quebraPaginaPorCCusto && indexCCusto > 0) ? ' quebra-pagina' : ''
      tabelasCCusto += `<div class="ccusto-bloco${classeQuebraPaginaCC}">`
      
      // Cabeçalho do centro de custo
      tabelasCCusto += `<h3 class="ccusto-titulo">${nomeCCusto}</h3>`
      
      // Gerar uma tabela para cada grupo de dias (máx 15 por tabela)
      gruposDeDias.forEach((grupoDias, indexGrupo) => {
        // Header dos dias deste grupo
        let headersDiasGrupo = ''
        grupoDias.forEach(dia => {
          headersDiasGrupo += `<th>${dia.label}</th>`
        })
        
        // Calcular subtotal deste grupo de dias
        let subtotalGrupo = 0
        grupoDias.forEach(dia => {
          subtotalGrupo += cc[dia.key] || 0
        })
        
        // Só mostrar tabela se tiver valores neste grupo
        const temValoresNoGrupo = listaConsolidada.some(despesa => 
          grupoDias.some(dia => (despesa[dia.key] || 0) > 0)
        )
        
        if (!temValoresNoGrupo && gruposDeDias.length > 1) {
          return // Pula grupos vazios quando há múltiplos grupos
        }
        
        // Indicador de parte (se múltiplas tabelas)
        const indicadorParte = gruposDeDias.length > 1 ? ` <span class="parte-indicador">(Parte ${indexGrupo + 1}/${gruposDeDias.length})</span>` : ''
        
        // Início da tabela
        tabelasCCusto += `<table class="table-ccusto">
          <thead>
            <tr>
              <th class="text-left" style="min-width: 150px;">Despesa${indicadorParte}</th>
              ${headersDiasGrupo}
              <th style="min-width: 80px;">Subtotal</th>
            </tr>
          </thead>
          <tbody>`
        
        // Linhas das despesas consolidadas (apenas colunas deste grupo)
        listaConsolidada.forEach(despesa => {
          // Calcular subtotal desta despesa para este grupo de dias
          let subtotalDespesa = 0
          grupoDias.forEach(dia => {
            subtotalDespesa += despesa[dia.key] || 0
          })
          
          let linha = `<tr><td>${despesa.descricao}</td>`
          grupoDias.forEach(dia => {
            const valor = despesa[dia.key] || 0
            linha += `<td>${valor > 0 ? formatarMoeda(valor) : ''}</td>`
          })
          linha += `<td class="col-total">${formatarMoeda(subtotalDespesa)}</td></tr>`
          tabelasCCusto += linha
        })
        
        // Linha de subtotal do centro de custo (apenas dias deste grupo)
        tabelasCCusto += `<tr class="row-subtotal"><td><strong>Subtotal</strong></td>`
        grupoDias.forEach(dia => {
          const valor = cc[dia.key] || 0
          tabelasCCusto += `<td>${valor > 0 ? formatarMoeda(valor) : ''}</td>`
        })
        tabelasCCusto += `<td class="col-total"><strong>${formatarMoeda(subtotalGrupo)}</strong></td></tr>`
        
        // Fechar tabela
        tabelasCCusto += `</tbody></table>`
      })
      
      // Fechar div do bloco do centro de custo
      tabelasCCusto += `</div>`
    })
    
    // 9. Gerar dados do gráfico e seção condicional
    const exibirGrafico = filtros.exibirGrafico === true
    const dadosGrafico = {
      labels: centrosCustoAgrupados.map(cc => limparNomeCCusto(cc.centroCusto)),
      valores: centrosCustoAgrupados.map(cc => cc.total || 0),
      total: totalGeral
    }
    
    // HTML do gráfico (só inclui se exibirGrafico for true)
    // Usa concatenação para evitar que Vue interprete as tags script
    let secaoGrafico = ''
    if (exibirGrafico) {
      const scr = 'script'
      secaoGrafico = `
    <!-- Gráfico de Distribuição -->
    <div class="grafico-container" style="margin-top: 30px; page-break-inside: avoid;">
        <h2 class="section-title">Distribuição por Centro de Custo</h2>
        <div style="display: flex; justify-content: center; align-items: center; gap: 30px; flex-wrap: wrap;">
            <canvas id="graficoPizza" width="350" height="350"></canvas>
            <div id="legendaGrafico" style="font-size: 11px; line-height: 1.8;"></div>
        </div>
    </div>
    <` + scr + ` src="https://cdn.jsdelivr.net/npm/chart.js"></` + scr + `>
    <` + scr + `>
        const dadosGrafico = ${JSON.stringify(dadosGrafico)};
        const cores = ['#FF8C42', '#FFA726', '#FFB74D', '#FFCC80', '#FFE0B2', '#FF9800', '#FB8C00', '#F57C00', '#EF6C00', '#E65100', '#FFD54F', '#FFCA28', '#FFC107', '#FFB300', '#FFA000'];
        const ctx = document.getElementById('graficoPizza').getContext('2d');
        new Chart(ctx, {
            type: 'pie',
            data: { labels: dadosGrafico.labels, datasets: [{ data: dadosGrafico.valores, backgroundColor: cores.slice(0, dadosGrafico.labels.length), borderColor: '#fff', borderWidth: 2 }] },
            options: { responsive: false, plugins: { legend: { display: false }, tooltip: { enabled: false } } }
        });
        const legendaDiv = document.getElementById('legendaGrafico');
        let legendaHtml = '';
        dadosGrafico.labels.forEach((label, i) => {
            const cor = cores[i % cores.length];
            const valor = dadosGrafico.valores[i];
            const percentual = ((valor / dadosGrafico.total) * 100).toFixed(1);
            const valorFormatado = valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            legendaHtml += '<div style="display: flex; align-items: center; margin-bottom: 5px;">';
            legendaHtml += '<span style="display: inline-block; width: 14px; height: 14px; background: ' + cor + '; margin-right: 8px; border-radius: 3px;"></span>';
            legendaHtml += '<span style="min-width: 180px;">' + label + '</span>';
            legendaHtml += '<span style="min-width: 100px; text-align: right; font-weight: 500;">' + valorFormatado + '</span>';
            legendaHtml += '<span style="min-width: 60px; text-align: right; color: #666;">(' + percentual + '%)</span>';
            legendaHtml += '</div>';
        });
        legendaDiv.innerHTML = legendaHtml;
    </` + scr + `>`
    }
    
    // 10. Substituir variáveis no template
    html = html.replace(/{{logoUrl}}/g, logo)
    html = html.replace(/{{colsClass}}/g, colsClass)
    html = html.replace(/{{empresa}}/g, empresa)
    html = html.replace(/{{operador}}/g, operador)
    html = html.replace(/{{dataInicio}}/g, formatarData(filtros.dtini))
    html = html.replace(/{{dataFim}}/g, formatarData(filtros.dtfim))
    html = html.replace(/{{dataImpressao}}/g, dataAtual.toLocaleString('pt-BR'))
    html = html.replace(/{{TABELAS_CCUSTO}}/g, tabelasCCusto)
    html = html.replace(/{{totalGeral}}/g, formatarMoeda(totalGeral))
    html = html.replace(/{{totalCentrosCusto}}/g, centrosCustoAgrupados.length)
    html = html.replace(/{{totalDespesas}}/g, totalDespesasConsolidadas)
    html = html.replace(/{{SECAO_GRAFICO}}/g, secaoGrafico)
    
    console.log('🖥️ Abrindo janela de impressão...')
    
    // Abrir em nova janela com print
    const janela = window.open('', '_blank', 'width=1200,height=800')
    
    if (!janela) {
      console.error('❌ Pop-up foi bloqueado pelo navegador!')
      toast.error('Pop-up foi bloqueado. Verifique as configurações do navegador.')
      return
    }
    
    janela.document.write(html)
    janela.document.close()
    
    console.log('✅ Impressão aberta com sucesso!')
    
    // Aguardar carregamento do Chart.js e abrir print
    setTimeout(() => {
      janela.print()
    }, 1000)
  } catch (err) {
    console.error('❌ Erro ao abrir impressão:', err)
    console.error('Stack:', err.stack)
    toast.error('Erro ao abrir impressão: ' + err.message)
  }
}

const gerarRelatorioDebitosRealizados = async () => {
  if (!filtrosDebitosRealizados.dtini || !filtrosDebitosRealizados.dtfim) {
    toast.error('Informe as datas de início e fim')
    return
  }

  gerando.value = true
  try {
    console.log('📊 Gerando relatório Débitos Realizados:', filtrosDebitosRealizados)
    
    // Buscar dados de débitos realizados
    const debitos = await ccustoStore.buscarDebitosRealizados(
      idEmpresa.value,
      filtrosDebitosRealizados.dtini,
      filtrosDebitosRealizados.dtfim
    )
    
    console.log('✅ Débitos encontrados:', (debitos || []).length)
    
    // Abrir impressão com os dados
    abrirImpressaoDebitosRealizados(debitos, filtrosDebitosRealizados)
    
    toast.success('Relatório gerado com sucesso!')
    modalDebitosRealizadosAberto.value = false
  } catch (error) {
    console.error('❌ Erro ao gerar relatório:', error)
    toast.error('Erro ao gerar relatório')
  } finally {
    gerando.value = false
  }
}
</script>
