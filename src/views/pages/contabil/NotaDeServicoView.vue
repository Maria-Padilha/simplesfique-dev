<script setup>
import { ref } from 'vue'
import { useThemeStore } from '@/stores/config-temas/theme'

const themeStore = useThemeStore()

// Estados
const isDragging = ref(false)
const arquivoSelecionado = ref(null)
const erroParser = ref(null)
const notaFiscal = ref(null)
const notasImportadas = ref([])
const fileInputRef = ref(null)
const notaParaImpressao = ref(null)

// Headers da tabela de notas
const headersNotas = [
  { title: 'Número', key: 'numero', sortable: true },
  { title: 'Prestador', key: 'prestador.razaoSocial', sortable: true },
  { title: 'Tomador', key: 'tomador.razaoSocial', sortable: true },
  { title: 'Data Emissão', key: 'dataEmissao', sortable: true },
  { title: 'Valor Líquido', key: 'valores.valorLiquido', sortable: true },
  { title: 'Ações', key: 'actions', sortable: false }
]

// Funções de Upload
const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const handleFileSelect = (event) => {
  const file = event.target.files?.[0]
  if (file) {
    processarArquivo(file)
  }
}

const handleDrop = (event) => {
  isDragging.value = false
  const file = event.dataTransfer?.files?.[0]
  if (file) {
    processarArquivo(file)
  }
}

const processarArquivo = (file) => {
  if (!file.name.toLowerCase().endsWith('.xml')) {
    erroParser.value = 'Por favor, selecione um arquivo XML válido.'
    return
  }

  arquivoSelecionado.value = file
  erroParser.value = null

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const xmlString = e.target?.result
      parseXML(xmlString)
    } catch (error) {
      erroParser.value = 'Erro ao ler o arquivo: ' + error.message
    }
  }
  reader.onerror = () => {
    erroParser.value = 'Erro ao ler o arquivo.'
  }
  reader.readAsText(file)
}

const limparArquivo = () => {
  arquivoSelecionado.value = null
  notaFiscal.value = null
  erroParser.value = null
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

const limparNota = () => {
  notaFiscal.value = null
  arquivoSelecionado.value = null
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

// Parser XML
const parseXML = (xmlString) => {
  try {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml')

    // Verificar erros de parse
    const parseError = xmlDoc.querySelector('parsererror')
    if (parseError) {
      erroParser.value = 'Erro ao processar XML: formato inválido.'
      return
    }

    // Extrair dados do XML
    const infNFSe = xmlDoc.querySelector('infNFSe')
    if (!infNFSe) {
      erroParser.value = 'XML não contém estrutura NFSe válida.'
      return
    }

    const dps = xmlDoc.querySelector('DPS infDPS')
    const emit = xmlDoc.querySelector('emit')
    const toma = xmlDoc.querySelector('toma')
    const valores = xmlDoc.querySelector('infNFSe > valores')
    const valoresDPS = xmlDoc.querySelector('DPS valores')
    const serv = xmlDoc.querySelector('serv')

    const nota = {
      id: getTextContent(infNFSe, null, 'Id') || Date.now().toString(),
      numero: getTextContent(infNFSe, 'nNFSe'),
      serie: getTextContent(dps, 'serie'),
      status: getTextContent(infNFSe, 'cStat'),
      dataEmissao: getTextContent(dps, 'dhEmi'),
      dataCompetencia: getTextContent(dps, 'dCompet'),
      dataProcessamento: getTextContent(infNFSe, 'dhProc'),
      localEmissao: getTextContent(infNFSe, 'xLocEmi'),
      localPrestacao: getTextContent(infNFSe, 'xLocPrestacao'),
      tribNacional: getTextContent(infNFSe, 'xTribNac'),
      ambiente: getTextContent(infNFSe, 'ambGer'),
      versaoApp: getTextContent(infNFSe, 'verAplic'),

      prestador: emit ? {
        cnpj: getTextContent(emit, 'CNPJ'),
        inscricaoMunicipal: getTextContent(emit, 'IM'),
        razaoSocial: getTextContent(emit, 'xNome'),
        nomeFantasia: getTextContent(emit, 'xFant'),
        telefone: getTextContent(emit, 'fone'),
        email: getTextContent(emit, 'email'),
        endereco: {
          logradouro: getTextContent(emit, 'enderNac xLgr'),
          numero: getTextContent(emit, 'enderNac nro'),
          complemento: getTextContent(emit, 'enderNac xCpl'),
          bairro: getTextContent(emit, 'enderNac xBairro'),
          municipio: getTextContent(emit, 'enderNac cMun'),
          uf: getTextContent(emit, 'enderNac UF'),
          cep: getTextContent(emit, 'enderNac CEP')
        }
      } : null,

      tomador: toma ? {
        cnpj: getTextContent(toma, 'CNPJ'),
        razaoSocial: getTextContent(toma, 'xNome'),
        email: getTextContent(toma, 'email'),
        endereco: {
          logradouro: getTextContent(toma, 'end xLgr'),
          numero: getTextContent(toma, 'end nro'),
          complemento: getTextContent(toma, 'end xCpl'),
          bairro: getTextContent(toma, 'end xBairro'),
          municipio: getTextContent(toma, 'end endNac cMun'),
          cep: getTextContent(toma, 'end endNac CEP')
        }
      } : null,

      servico: serv ? {
        codigoTribNacional: getTextContent(serv, 'cServ cTribNac'),
        codigoTribMunicipal: getTextContent(serv, 'cServ cTribMun'),
        descricao: getTextContent(serv, 'cServ xDescServ'),
        localPrestacao: getTextContent(serv, 'locPrest cLocPrestacao'),
        infoComplementar: getTextContent(serv, 'infoCompl xInfComp')
      } : null,

      valores: {
        valorServico: parseFloat(getTextContent(valoresDPS, 'vServPrest vServ') || '0'),
        baseCalculo: parseFloat(getTextContent(valores, 'vBC') || '0'),
        valorLiquido: parseFloat(getTextContent(valores, 'vLiq') || '0'),
        totalRetido: parseFloat(getTextContent(valores, 'vTotalRet') || '0')
      },

      tributos: {
        issqn: {
          aliquota: parseFloat(getTextContent(valores, 'pAliqAplic') || getTextContent(valoresDPS, 'trib tribMun pAliq') || '0'),
          valor: parseFloat(getTextContent(valores, 'vISSQN') || '0')
        },
        pis: {
          aliquota: parseFloat(getTextContent(valoresDPS, 'trib tribFed piscofins pAliqPis') || '0'),
          valor: parseFloat(getTextContent(valoresDPS, 'trib tribFed piscofins vPis') || '0')
        },
        cofins: {
          aliquota: parseFloat(getTextContent(valoresDPS, 'trib tribFed piscofins pAliqCofins') || '0'),
          valor: parseFloat(getTextContent(valoresDPS, 'trib tribFed piscofins vCofins') || '0')
        },
        csll: parseFloat(getTextContent(valoresDPS, 'trib tribFed vRetCSLL') || '0')
      }
    }

    notaFiscal.value = nota

    // Adicionar à lista de notas importadas se não existir
    const existe = notasImportadas.value.find(n => n.numero === nota.numero)
    if (!existe) {
      notasImportadas.value.unshift(nota)
    }

  } catch (error) {
    erroParser.value = 'Erro ao processar XML: ' + error.message
  }
}

const getTextContent = (parent, selector, attribute = null) => {
  if (!parent) return ''

  let element = parent
  if (selector) {
    element = parent.querySelector(selector)
  }

  if (!element) return ''

  if (attribute) {
    return element.getAttribute(attribute) || ''
  }

  return element.textContent?.trim() || ''
}

// Funções de formatação
const formatarMoeda = (valor) => {
  if (valor === null || valor === undefined || isNaN(valor)) return 'R$ 0,00'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor)
}

const formatarData = (dataString) => {
  if (!dataString) return '-'
  try {
    const data = new Date(dataString)
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(data)
  } catch {
    return dataString
  }
}

const formatarCNPJ = (cnpj) => {
  if (!cnpj) return '-'
  const limpo = cnpj.replace(/\D/g, '')
  if (limpo.length !== 14) return cnpj
  return limpo.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
}

const formatarTelefone = (telefone) => {
  if (!telefone) return '-'
  const limpo = telefone.replace(/\D/g, '')
  if (limpo.length === 10) {
    return limpo.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3')
  }
  if (limpo.length === 11) {
    return limpo.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')
  }
  return telefone
}

const formatarCEP = (cep) => {
  if (!cep) return '-'
  const limpo = cep.replace(/\D/g, '')
  if (limpo.length !== 8) return cep
  return limpo.replace(/^(\d{5})(\d{3})$/, '$1-$2')
}

// Visualizar nota da lista
const visualizarNota = (nota) => {
  notaFiscal.value = nota
}

// Função de impressão
const imprimirNota = () => {
  const conteudo = notaParaImpressao.value
  if (!conteudo) return

  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    alert('Por favor, permita pop-ups para imprimir.')
    return
  }

  const styles = `
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        padding: 20px;
        color: #333;
        font-size: 12px;
      }
      .nota-header {
        text-align: center;
        border-bottom: 2px solid #333;
        padding-bottom: 15px;
        margin-bottom: 20px;
      }
      .nota-header h1 {
        font-size: 18px;
        margin-bottom: 5px;
      }
      .nota-header .numero {
        font-size: 14px;
        color: #666;
      }
      .section {
        margin-bottom: 20px;
        border: 1px solid #ddd;
        border-radius: 4px;
        overflow: hidden;
      }
      .section-title {
        background: #f5f5f5;
        padding: 8px 12px;
        font-weight: bold;
        border-bottom: 1px solid #ddd;
      }
      .section-content {
        padding: 12px;
      }
      .row {
        display: flex;
        flex-wrap: wrap;
        margin: 0 -8px;
      }
      .col {
        padding: 4px 8px;
      }
      .col-3 { width: 25%; }
      .col-4 { width: 33.333%; }
      .col-6 { width: 50%; }
      .col-12 { width: 100%; }
      .campo-label {
        font-size: 10px;
        color: #666;
        text-transform: uppercase;
        margin-bottom: 2px;
      }
      .campo-valor {
        font-size: 12px;
      }
      .font-bold {
        font-weight: bold;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th, td {
        padding: 8px;
        text-align: left;
        border-bottom: 1px solid #ddd;
      }
      th {
        background: #f5f5f5;
      }
      .text-right {
        text-align: right;
      }
      .text-center {
        text-align: center;
      }
      .text-success {
        color: #4caf50;
      }
      .text-error {
        color: #f44336;
      }
      .resumo {
        display: flex;
        justify-content: space-around;
        text-align: center;
        padding: 15px;
        background: #f9f9f9;
        border-radius: 4px;
      }
      .resumo-item {
        padding: 0 15px;
      }
      .resumo-item .label {
        font-size: 10px;
        color: #666;
      }
      .resumo-item .valor {
        font-size: 16px;
        font-weight: bold;
      }
      .resumo-item.destaque {
        background: rgba(76, 175, 80, 0.1);
        padding: 10px 20px;
        border-radius: 4px;
      }
      @media print {
        body {
          padding: 0;
        }
        .section {
          page-break-inside: avoid;
        }
      }
    </style>
  `

  const nota = notaFiscal.value
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>NFSe ${nota.numero}</title>
      ${styles}
    </head>
    <body>
      <div class="nota-header">
        <h1>NOTA FISCAL DE SERVIÇO ELETRÔNICA</h1>
        <div class="numero">NFSe Nº ${nota.numero} | ${nota.status === '100' ? 'AUTORIZADA' : 'PROCESSANDO'}</div>
      </div>

      <div class="section">
        <div class="section-title">📋 DADOS GERAIS</div>
        <div class="section-content">
          <div class="row">
            <div class="col col-3">
              <div class="campo-label">Número NFSe</div>
              <div class="campo-valor font-bold">${nota.numero}</div>
            </div>
            <div class="col col-3">
              <div class="campo-label">Série</div>
              <div class="campo-valor">${nota.serie || '-'}</div>
            </div>
            <div class="col col-3">
              <div class="campo-label">Data Emissão</div>
              <div class="campo-valor">${formatarData(nota.dataEmissao)}</div>
            </div>
            <div class="col col-3">
              <div class="campo-label">Data Competência</div>
              <div class="campo-valor">${formatarData(nota.dataCompetencia)}</div>
            </div>
            <div class="col col-6">
              <div class="campo-label">Local de Emissão</div>
              <div class="campo-valor">${nota.localEmissao}</div>
            </div>
            <div class="col col-6">
              <div class="campo-label">Local de Prestação</div>
              <div class="campo-valor">${nota.localPrestacao}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">🏢 PRESTADOR DE SERVIÇO</div>
        <div class="section-content">
          <div class="row">
            <div class="col col-6">
              <div class="campo-label">Razão Social</div>
              <div class="campo-valor font-bold">${nota.prestador?.razaoSocial || '-'}</div>
            </div>
            <div class="col col-6">
              <div class="campo-label">Nome Fantasia</div>
              <div class="campo-valor">${nota.prestador?.nomeFantasia || '-'}</div>
            </div>
            <div class="col col-4">
              <div class="campo-label">CNPJ</div>
              <div class="campo-valor">${formatarCNPJ(nota.prestador?.cnpj)}</div>
            </div>
            <div class="col col-4">
              <div class="campo-label">Inscrição Municipal</div>
              <div class="campo-valor">${nota.prestador?.inscricaoMunicipal || '-'}</div>
            </div>
            <div class="col col-4">
              <div class="campo-label">Telefone</div>
              <div class="campo-valor">${formatarTelefone(nota.prestador?.telefone)}</div>
            </div>
            <div class="col col-12">
              <div class="campo-label">Endereço</div>
              <div class="campo-valor">
                ${nota.prestador?.endereco?.logradouro}, ${nota.prestador?.endereco?.numero}
                ${nota.prestador?.endereco?.complemento ? ' - ' + nota.prestador?.endereco?.complemento : ''}
                - ${nota.prestador?.endereco?.bairro} - ${nota.prestador?.endereco?.uf}
                - CEP: ${formatarCEP(nota.prestador?.endereco?.cep)}
              </div>
            </div>
            <div class="col col-12">
              <div class="campo-label">E-mail</div>
              <div class="campo-valor">${nota.prestador?.email || '-'}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">👤 TOMADOR DE SERVIÇO</div>
        <div class="section-content">
          <div class="row">
            <div class="col col-6">
              <div class="campo-label">Razão Social</div>
              <div class="campo-valor font-bold">${nota.tomador?.razaoSocial || '-'}</div>
            </div>
            <div class="col col-6">
              <div class="campo-label">CNPJ</div>
              <div class="campo-valor">${formatarCNPJ(nota.tomador?.cnpj)}</div>
            </div>
            <div class="col col-12">
              <div class="campo-label">Endereço</div>
              <div class="campo-valor">
                ${nota.tomador?.endereco?.logradouro}, ${nota.tomador?.endereco?.numero}
                ${nota.tomador?.endereco?.complemento ? ' - ' + nota.tomador?.endereco?.complemento : ''}
                - ${nota.tomador?.endereco?.bairro}
                - CEP: ${formatarCEP(nota.tomador?.endereco?.cep)}
              </div>
            </div>
            <div class="col col-12">
              <div class="campo-label">E-mail</div>
              <div class="campo-valor">${nota.tomador?.email || '-'}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">📝 SERVIÇO PRESTADO</div>
        <div class="section-content">
          <div class="row">
            <div class="col col-4">
              <div class="campo-label">Código Trib. Nacional</div>
              <div class="campo-valor">${nota.servico?.codigoTribNacional || '-'}</div>
            </div>
            <div class="col col-4">
              <div class="campo-label">Código Trib. Municipal</div>
              <div class="campo-valor">${nota.servico?.codigoTribMunicipal || '-'}</div>
            </div>
            <div class="col col-4">
              <div class="campo-label">Local de Prestação</div>
              <div class="campo-valor">${nota.servico?.localPrestacao || '-'}</div>
            </div>
            <div class="col col-12">
              <div class="campo-label">Descrição do Serviço</div>
              <div class="campo-valor">${nota.servico?.descricao || '-'}</div>
            </div>
            ${nota.servico?.infoComplementar ? `
            <div class="col col-12">
              <div class="campo-label">Informações Complementares</div>
              <div class="campo-valor">${nota.servico?.infoComplementar}</div>
            </div>
            ` : ''}
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">💰 VALORES E TRIBUTOS</div>
        <div class="section-content">
          <table>
            <tr>
              <td>Valor do Serviço</td>
              <td class="text-right">${formatarMoeda(nota.valores?.valorServico)}</td>
            </tr>
            <tr>
              <td>Base de Cálculo</td>
              <td class="text-right">${formatarMoeda(nota.valores?.baseCalculo)}</td>
            </tr>
            <tr>
              <td>ISSQN (${nota.tributos?.issqn?.aliquota || 0}%)</td>
              <td class="text-right">${formatarMoeda(nota.tributos?.issqn?.valor)}</td>
            </tr>
            <tr>
              <td>PIS (${nota.tributos?.pis?.aliquota || 0}%)</td>
              <td class="text-right">${formatarMoeda(nota.tributos?.pis?.valor)}</td>
            </tr>
            <tr>
              <td>COFINS (${nota.tributos?.cofins?.aliquota || 0}%)</td>
              <td class="text-right">${formatarMoeda(nota.tributos?.cofins?.valor)}</td>
            </tr>
            <tr>
              <td>CSLL</td>
              <td class="text-right">${formatarMoeda(nota.tributos?.csll)}</td>
            </tr>
            <tr>
              <td class="font-bold text-error">Total Retido</td>
              <td class="text-right font-bold text-error">${formatarMoeda(nota.valores?.totalRetido)}</td>
            </tr>
          </table>
        </div>
      </div>

      <div class="section">
        <div class="section-content">
          <div class="resumo">
            <div class="resumo-item">
              <div class="label">VALOR BRUTO</div>
              <div class="valor">${formatarMoeda(nota.valores?.valorServico)}</div>
            </div>
            <div class="resumo-item">
              <div class="label">(-) RETENÇÕES</div>
              <div class="valor text-error">${formatarMoeda(nota.valores?.totalRetido)}</div>
            </div>
            <div class="resumo-item destaque">
              <div class="label">VALOR LÍQUIDO</div>
              <div class="valor text-success">${formatarMoeda(nota.valores?.valorLiquido)}</div>
            </div>
          </div>
        </div>
      </div>

      <scr` + `ipt>
        window.onload = function() {
          window.print();
        }
      </scr` + `ipt>
    </body>
    </html>
  `

  printWindow.document.write(html)
  printWindow.document.close()
}
</script>

<template>
  <div class="pa-4">
    <!-- Cabeçalho -->
    <v-card class="background-secondary mb-4">
      <v-card-title class="text-h5 pa-4 d-flex justify-space-between align-center">
        <div class="d-flex align-center">
          <v-icon icon="mdi-file-document-outline" class="mr-3"></v-icon>
          Nota Fiscal de Serviço (NFSe)
        </div>
      </v-card-title>
    </v-card>

    <!-- Área de Import -->
    <v-card :color="themeStore.darkMode ? 'text-white' : ''" class="background-secondary mb-4">
      <v-card-text class="pa-4">
        <v-row>
          <v-col cols="12">
            <div
              class="upload-area pa-8 text-center rounded-lg"
              :class="{ 'dragging': isDragging }"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleDrop"
            >
              <v-icon icon="mdi-file-xml-box" size="64" class="mb-4 opacity-60"></v-icon>
              <p class="text-h6 mb-2">Arraste o arquivo XML aqui</p>
              <p class="text-body-2 mb-4 opacity-70">ou clique para selecionar</p>
              <v-btn
                color="var(--text-color-laranja)"
                variant="flat"
                class="text-white"
                prepend-icon="mdi-upload"
                @click="triggerFileInput"
              >
                Selecionar Arquivo XML
              </v-btn>
              <input
                ref="fileInputRef"
                type="file"
                accept=".xml"
                class="d-none"
                @change="handleFileSelect"
              />
            </div>
          </v-col>
        </v-row>

        <!-- Arquivo selecionado -->
        <v-row v-if="arquivoSelecionado">
          <v-col cols="12">
            <v-chip
              color="var(--text-color-laranja)"
              class="text-white"
              closable
              @click:close="limparArquivo"
            >
              <v-icon start icon="mdi-file-xml-box"></v-icon>
              {{ arquivoSelecionado.name }}
            </v-chip>
          </v-col>
        </v-row>

        <!-- Erro de parse -->
        <v-row v-if="erroParser">
          <v-col cols="12">
            <v-alert type="error" variant="tonal" closable @click:close="erroParser = null">
              {{ erroParser }}
            </v-alert>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Visualização da Nota -->
    <v-expand-transition>
      <div v-if="notaFiscal">
        <!-- Botões de Ação -->
        <v-card class="background-secondary mb-4">
          <v-card-text class="pa-4 d-flex justify-end gap-2">
            <v-btn
              color="grey"
              variant="outlined"
              prepend-icon="mdi-close"
              @click="limparNota"
            >
              Limpar
            </v-btn>
            <v-btn
              color="var(--text-color-laranja)"
              variant="flat"
              class="text-white"
              prepend-icon="mdi-printer"
              @click="imprimirNota"
            >
              Imprimir Nota
            </v-btn>
          </v-card-text>
        </v-card>

        <!-- Conteúdo da Nota para Impressão -->
        <div ref="notaParaImpressao" class="nota-impressao">
          <!-- Header da Nota -->
          <v-card class="background-secondary mb-4">
            <v-card-title class="pa-4 d-flex justify-space-between align-center flex-wrap">
              <div class="d-flex align-center">
                <v-icon icon="mdi-receipt-text" class="mr-3" size="32"></v-icon>
                <div>
                  <div class="text-h5">NOTA FISCAL DE SERVIÇO ELETRÔNICA</div>
                  <div class="text-body-2 opacity-70">NFSe Nº {{ notaFiscal.numero }}</div>
                </div>
              </div>
              <v-chip
                :color="notaFiscal.status === '100' ? 'success' : 'warning'"
                variant="flat"
                class="text-white"
              >
                {{ notaFiscal.status === '100' ? 'Autorizada' : 'Processando' }}
              </v-chip>
            </v-card-title>
          </v-card>

          <!-- Dados Gerais -->
          <v-card class="background-secondary mb-4">
            <v-card-title class="pa-4 pb-2">
              <v-icon icon="mdi-information-outline" class="mr-2"></v-icon>
              Dados Gerais
            </v-card-title>
            <v-card-text class="pa-4 pt-0">
              <v-row>
                <v-col cols="12" md="3">
                  <div class="campo-label">Número NFSe</div>
                  <div class="campo-valor">{{ notaFiscal.numero }}</div>
                </v-col>
                <v-col cols="12" md="3">
                  <div class="campo-label">Série</div>
                  <div class="campo-valor">{{ notaFiscal.serie || '-' }}</div>
                </v-col>
                <v-col cols="12" md="3">
                  <div class="campo-label">Data de Emissão</div>
                  <div class="campo-valor">{{ formatarData(notaFiscal.dataEmissao) }}</div>
                </v-col>
                <v-col cols="12" md="3">
                  <div class="campo-label">Data de Competência</div>
                  <div class="campo-valor">{{ formatarData(notaFiscal.dataCompetencia) }}</div>
                </v-col>
                <v-col cols="12" md="6">
                  <div class="campo-label">Local de Emissão</div>
                  <div class="campo-valor">{{ notaFiscal.localEmissao }}</div>
                </v-col>
                <v-col cols="12" md="6">
                  <div class="campo-label">Local de Prestação</div>
                  <div class="campo-valor">{{ notaFiscal.localPrestacao }}</div>
                </v-col>
                <v-col cols="12">
                  <div class="campo-label">Tributação Nacional</div>
                  <div class="campo-valor">{{ notaFiscal.tribNacional }}</div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Prestador de Serviço -->
          <v-card class="background-secondary mb-4">
            <v-card-title class="pa-4 pb-2">
              <v-icon icon="mdi-domain" class="mr-2"></v-icon>
              Prestador de Serviço
            </v-card-title>
            <v-card-text class="pa-4 pt-0">
              <v-row>
                <v-col cols="12" md="6">
                  <div class="campo-label">Razão Social</div>
                  <div class="campo-valor font-weight-bold">{{ notaFiscal.prestador?.razaoSocial }}</div>
                </v-col>
                <v-col cols="12" md="6">
                  <div class="campo-label">Nome Fantasia</div>
                  <div class="campo-valor">{{ notaFiscal.prestador?.nomeFantasia || '-' }}</div>
                </v-col>
                <v-col cols="12" md="4">
                  <div class="campo-label">CNPJ</div>
                  <div class="campo-valor">{{ formatarCNPJ(notaFiscal.prestador?.cnpj) }}</div>
                </v-col>
                <v-col cols="12" md="4">
                  <div class="campo-label">Inscrição Municipal</div>
                  <div class="campo-valor">{{ notaFiscal.prestador?.inscricaoMunicipal || '-' }}</div>
                </v-col>
                <v-col cols="12" md="4">
                  <div class="campo-label">Telefone</div>
                  <div class="campo-valor">{{ formatarTelefone(notaFiscal.prestador?.telefone) }}</div>
                </v-col>
                <v-col cols="12">
                  <div class="campo-label">Endereço</div>
                  <div class="campo-valor">
                    {{ notaFiscal.prestador?.endereco?.logradouro }},
                    {{ notaFiscal.prestador?.endereco?.numero }}
                    {{ notaFiscal.prestador?.endereco?.complemento ? ' - ' + notaFiscal.prestador?.endereco?.complemento : '' }}
                    <br>
                    {{ notaFiscal.prestador?.endereco?.bairro }} -
                    {{ notaFiscal.prestador?.endereco?.uf }} -
                    CEP: {{ formatarCEP(notaFiscal.prestador?.endereco?.cep) }}
                  </div>
                </v-col>
                <v-col cols="12" md="6">
                  <div class="campo-label">E-mail</div>
                  <div class="campo-valor">{{ notaFiscal.prestador?.email || '-' }}</div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Tomador de Serviço -->
          <v-card class="background-secondary mb-4">
            <v-card-title class="pa-4 pb-2">
              <v-icon icon="mdi-account-tie" class="mr-2"></v-icon>
              Tomador de Serviço
            </v-card-title>
            <v-card-text class="pa-4 pt-0">
              <v-row>
                <v-col cols="12" md="8">
                  <div class="campo-label">Razão Social</div>
                  <div class="campo-valor font-weight-bold">{{ notaFiscal.tomador?.razaoSocial }}</div>
                </v-col>
                <v-col cols="12" md="4">
                  <div class="campo-label">CNPJ</div>
                  <div class="campo-valor">{{ formatarCNPJ(notaFiscal.tomador?.cnpj) }}</div>
                </v-col>
                <v-col cols="12">
                  <div class="campo-label">Endereço</div>
                  <div class="campo-valor">
                    {{ notaFiscal.tomador?.endereco?.logradouro }},
                    {{ notaFiscal.tomador?.endereco?.numero }}
                    {{ notaFiscal.tomador?.endereco?.complemento ? ' - ' + notaFiscal.tomador?.endereco?.complemento : '' }}
                    <br>
                    {{ notaFiscal.tomador?.endereco?.bairro }} -
                    CEP: {{ formatarCEP(notaFiscal.tomador?.endereco?.cep) }}
                  </div>
                </v-col>
                <v-col cols="12">
                  <div class="campo-label">E-mail</div>
                  <div class="campo-valor">{{ notaFiscal.tomador?.email || '-' }}</div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Descrição do Serviço -->
          <v-card class="background-secondary mb-4">
            <v-card-title class="pa-4 pb-2">
              <v-icon icon="mdi-clipboard-text" class="mr-2"></v-icon>
              Serviço Prestado
            </v-card-title>
            <v-card-text class="pa-4 pt-0">
              <v-row>
                <v-col cols="12" md="4">
                  <div class="campo-label">Código Tributação Nacional</div>
                  <div class="campo-valor">{{ notaFiscal.servico?.codigoTribNacional || '-' }}</div>
                </v-col>
                <v-col cols="12" md="4">
                  <div class="campo-label">Código Tributação Municipal</div>
                  <div class="campo-valor">{{ notaFiscal.servico?.codigoTribMunicipal || '-' }}</div>
                </v-col>
                <v-col cols="12" md="4">
                  <div class="campo-label">Local de Prestação</div>
                  <div class="campo-valor">{{ notaFiscal.servico?.localPrestacao || '-' }}</div>
                </v-col>
                <v-col cols="12">
                  <div class="campo-label">Descrição do Serviço</div>
                  <div class="campo-valor descricao-servico">{{ notaFiscal.servico?.descricao }}</div>
                </v-col>
                <v-col cols="12" v-if="notaFiscal.servico?.infoComplementar">
                  <div class="campo-label">Informações Complementares</div>
                  <div class="campo-valor descricao-servico">{{ notaFiscal.servico?.infoComplementar }}</div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Valores -->
          <v-card class="background-secondary mb-4">
            <v-card-title class="pa-4 pb-2">
              <v-icon icon="mdi-currency-brl" class="mr-2"></v-icon>
              Valores
            </v-card-title>
            <v-card-text class="pa-4 pt-0">
              <v-row>
                <v-col cols="12">
                  <v-table class="background-card" density="compact">
                    <thead>
                      <tr>
                        <th class="text-left">Descrição</th>
                        <th class="text-right">Valor</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Valor do Serviço</td>
                        <td class="text-right">{{ formatarMoeda(notaFiscal.valores?.valorServico) }}</td>
                      </tr>
                      <tr>
                        <td>Base de Cálculo</td>
                        <td class="text-right">{{ formatarMoeda(notaFiscal.valores?.baseCalculo) }}</td>
                      </tr>
                      <tr class="font-weight-bold" style="background-color: rgba(76, 175, 80, 0.1);">
                        <td>Valor Líquido</td>
                        <td class="text-right text-success">{{ formatarMoeda(notaFiscal.valores?.valorLiquido) }}</td>
                      </tr>
                    </tbody>
                  </v-table>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Tributos -->
          <v-card class="background-secondary mb-4">
            <v-card-title class="pa-4 pb-2">
              <v-icon icon="mdi-calculator" class="mr-2"></v-icon>
              Tributos
            </v-card-title>
            <v-card-text class="pa-4 pt-0">
              <v-row>
                <!-- ISSQN -->
                <v-col cols="12" md="6">
                  <v-card class="background-card" variant="outlined">
                    <v-card-title class="text-subtitle-1 pa-3 pb-1">
                      <v-icon icon="mdi-city" size="small" class="mr-2"></v-icon>
                      ISSQN (Municipal)
                    </v-card-title>
                    <v-card-text class="pa-3 pt-0">
                      <div class="d-flex justify-space-between mb-1">
                        <span class="opacity-70">Alíquota:</span>
                        <span>{{ notaFiscal.tributos?.issqn?.aliquota || 0 }}%</span>
                      </div>
                      <div class="d-flex justify-space-between">
                        <span class="opacity-70">Valor:</span>
                        <span class="font-weight-bold">{{ formatarMoeda(notaFiscal.tributos?.issqn?.valor) }}</span>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>

                <!-- Tributos Federais -->
                <v-col cols="12" md="6">
                  <v-card class="background-card" variant="outlined">
                    <v-card-title class="text-subtitle-1 pa-3 pb-1">
                      <v-icon icon="mdi-bank" size="small" class="mr-2"></v-icon>
                      Tributos Federais
                    </v-card-title>
                    <v-card-text class="pa-3 pt-0">
                      <div class="d-flex justify-space-between mb-1">
                        <span class="opacity-70">PIS ({{ notaFiscal.tributos?.pis?.aliquota || 0 }}%):</span>
                        <span>{{ formatarMoeda(notaFiscal.tributos?.pis?.valor) }}</span>
                      </div>
                      <div class="d-flex justify-space-between mb-1">
                        <span class="opacity-70">COFINS ({{ notaFiscal.tributos?.cofins?.aliquota || 0 }}%):</span>
                        <span>{{ formatarMoeda(notaFiscal.tributos?.cofins?.valor) }}</span>
                      </div>
                      <div class="d-flex justify-space-between mb-1">
                        <span class="opacity-70">CSLL:</span>
                        <span>{{ formatarMoeda(notaFiscal.tributos?.csll) }}</span>
                      </div>
                      <v-divider class="my-2"></v-divider>
                      <div class="d-flex justify-space-between">
                        <span class="opacity-70">Total Retido:</span>
                        <span class="font-weight-bold text-error">{{ formatarMoeda(notaFiscal.valores?.totalRetido) }}</span>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Resumo Final -->
          <v-card class="background-secondary">
            <v-card-text class="pa-4">
              <v-row align="center" justify="space-between">
                <v-col cols="12" md="4">
                  <div class="text-center">
                    <div class="text-body-2 opacity-70">Valor Bruto</div>
                    <div class="text-h5">{{ formatarMoeda(notaFiscal.valores?.valorServico) }}</div>
                  </div>
                </v-col>
                <v-col cols="12" md="4">
                  <div class="text-center">
                    <div class="text-body-2 opacity-70">(-) Retenções</div>
                    <div class="text-h5 text-error">{{ formatarMoeda(notaFiscal.valores?.totalRetido) }}</div>
                  </div>
                </v-col>
                <v-col cols="12" md="4">
                  <div class="text-center pa-3 rounded-lg" style="background-color: rgba(76, 175, 80, 0.15);">
                    <div class="text-body-2 opacity-70">Valor Líquido</div>
                    <div class="text-h4 text-success font-weight-bold">{{ formatarMoeda(notaFiscal.valores?.valorLiquido) }}</div>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </div>
      </div>
    </v-expand-transition>

    <!-- Lista de Notas Importadas -->
    <v-card v-if="notasImportadas.length > 0" class="background-secondary mt-4">
      <v-card-title class="pa-4 pb-2">
        <v-icon icon="mdi-history" class="mr-2"></v-icon>
        Notas Importadas na Sessão
      </v-card-title>
      <v-card-text class="pa-4 pt-0">
        <v-data-table
          :headers="headersNotas"
          :items="notasImportadas"
          density="compact"
          class="elevation-1 background-card"
        >
          <!-- eslint-disable-next-line vue/valid-v-slot -->
          <template #[`item.dataEmissao`]="{ item }">
            {{ formatarData(item.dataEmissao) }}
          </template>
          <!-- eslint-disable-next-line vue/valid-v-slot -->
          <template #[`item.valores.valorLiquido`]="{ item }">
            {{ formatarMoeda(item.valores?.valorLiquido) }}
          </template>
          <!-- eslint-disable-next-line vue/valid-v-slot -->
          <template #[`item.actions`]="{ item }">
            <v-btn
              icon="mdi-eye"
              size="small"
              color="primary"
              variant="text"
              title="Visualizar"
              @click="visualizarNota(item)"
            ></v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped>
.upload-area {
  border: 2px dashed var(--text-color);
  opacity: 0.7;
  transition: all 0.3s ease;
  cursor: pointer;
}

.upload-area:hover,
.upload-area.dragging {
  opacity: 1;
  border-color: var(--text-color-laranja);
  background-color: rgba(255, 152, 0, 0.05);
}

.campo-label {
  font-size: 0.75rem;
  color: var(--text-color);
  opacity: 0.7;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.campo-valor {
  font-size: 0.95rem;
  color: var(--text-color);
}

.descricao-servico {
  white-space: pre-wrap;
  background-color: rgba(0, 0, 0, 0.05);
  padding: 8px 12px;
  border-radius: 4px;
  font-family: monospace;
}

.gap-1 {
  gap: 4px;
}

.gap-2 {
  gap: 8px;
}

@media print {
  .nota-impressao {
    padding: 0 !important;
  }
}
</style>