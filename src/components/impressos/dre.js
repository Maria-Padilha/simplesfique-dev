// Template HTML para impressão de DRE (Demonstrativo de Resultado do Exercício)
export const TEMPLATE_DRE = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{TITULO_DRE}} - SimplesFique</title>
    <style>
        @page {
            size: A4 portrait;
            margin: 15mm;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Roboto', Arial, sans-serif;
            font-size: 11px;
            color: #2b2b2b;
            padding: 20px;
            background: #fff;
            max-width: 800px;
            margin: 0 auto;
        }

        .header {
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 3px solid #F57C00;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }

        .logo-container {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .logo-img {
            width: 50px;
            height: 50px;
            object-fit: contain;
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
            font-size: 11px;
            line-height: 1.6;
            text-align: right;
        }

        .info-relatorio strong {
            color: #F57C00;
        }

        /* Título do Relatório */
        .titulo-relatorio {
            text-align: center;
            margin-bottom: 20px;
            padding: 15px;
            background: linear-gradient(135deg, #F57C00 0%, #de7e3e 100%);
            color: white;
            border-radius: 8px;
        }

        .titulo-relatorio h1 {
            font-size: 18px;
            margin-bottom: 5px;
        }

        .titulo-relatorio p {
            font-size: 12px;
            opacity: 0.95;
        }

        /* Informações do Período */
        .info-periodo {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            padding: 12px;
            background: #f5f5f5;
            border-radius: 6px;
            border-left: 4px solid #F57C00;
        }

        .info-periodo-item {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .info-periodo-item strong {
            color: #F57C00;
            font-size: 10px;
        }

        .info-periodo-item span {
            font-size: 11px;
            color: #2b2b2b;
        }

        /* Tabela DRE */
        .table-dre {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .table-dre thead {
            background: linear-gradient(135deg, #F57C00 0%, #de7e3e 100%);
            color: white;
        }

        .table-dre th {
            padding: 12px 10px;
            text-align: left;
            font-weight: 600;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .table-dre th.valor-col {
            text-align: right;
            width: 35%;
        }

        .table-dre tbody tr {
            border-bottom: 1px solid #e0e0e0;
        }

        .table-dre tbody tr:hover {
            background-color: #fff8f0;
        }

        /* Linha de Grupo */
        .linha-grupo td {
            padding: 10px;
            font-weight: 700;
            font-size: 12px;
            background-color: #fafafa;
            border-top: 2px solid #ddd;
        }

        .linha-grupo.receita {
            background-color: #f1f8f4 !important;
            border-left: 4px solid #4caf50;
        }

        .linha-grupo.despesa {
            background-color: #fff3f3 !important;
            border-left: 4px solid #f44336;
        }

        .linha-grupo.totalizador {
            background-color: #fff5f0 !important;
            border-left: 4px solid #F57C00;
            font-size: 13px;
        }

        /* Linha de Categoria */
        .linha-categoria td {
            padding: 8px 10px 8px 30px;
            font-size: 11px;
        }

        .linha-categoria td:first-child {
            color: #555;
        }

        .classificador {
            display: inline-block;
            padding: 2px 6px;
            background: #f0f0f0;
            border: 1px solid #ddd;
            border-radius: 3px;
            font-size: 9px;
            font-family: 'Courier New', monospace;
            margin-left: 8px;
            color: #666;
        }

        /* Valores */
        .valor {
            text-align: right;
            font-weight: 500;
        }

        .valor-positivo {
            color: #2e7d32;
            font-weight: 600;
        }

        .valor-negativo {
            color: #c62828;
            font-weight: 600;
        }

        .valor-zero {
            color: #757575;
        }

        /* Ícones dos grupos */
        .icone-grupo {
            display: inline-block;
            width: 18px;
            height: 18px;
            margin-right: 6px;
            vertical-align: middle;
        }

        /* Footer */
        .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 2px solid #F57C00;
            display: flex;
            justify-content: space-between;
            font-size: 9px;
            color: #666;
        }

        .footer-left {
            display: flex;
            flex-direction: column;
            gap: 3px;
        }

        .footer-right {
            text-align: right;
        }

        /* Print styles */
        @media print {
            body {
                padding: 0;
            }

            .table-dre {
                page-break-inside: auto;
            }

            .linha-grupo {
                page-break-inside: avoid;
                page-break-after: avoid;
            }

            .linha-categoria {
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <!-- Header -->
    <div class="header">
        <div class="logo-container">
            <div class="logo-text">
                Simples<span>Fique</span>
            </div>
        </div>
        <div class="info-relatorio">
            <div><strong>Empresa:</strong> {{NOME_EMPRESA}}</div>
            <div><strong>CNPJ:</strong> {{CNPJ_EMPRESA}}</div>
            <div><strong>Gerado em:</strong> {{DATA_GERACAO}}</div>
        </div>
    </div>

    <!-- Título do Relatório -->
    <div class="titulo-relatorio">
        <h1>{{TITULO_DRE}}</h1>
        <p>Demonstrativo de Resultado do Exercício</p>
    </div>

    <!-- Informações do Período -->
    <div class="info-periodo">
        <div class="info-periodo-item">
            <strong>PERÍODO:</strong>
            <span>{{DATA_INICIAL}} a {{DATA_FINAL}}</span>
        </div>
        <div class="info-periodo-item">
            <strong>TIPO:</strong>
            <span>{{TIPO_PERIODO}}</span>
        </div>
        <div class="info-periodo-item">
            <strong>MODELO:</strong>
            <span>{{NOME_MODELO}}</span>
        </div>
    </div>

    <!-- Tabela DRE -->
    <table class="table-dre">
        <thead>
            <tr>
                <th>Descrição</th>
                <th class="valor-col">Valor (R$)</th>
            </tr>
        </thead>
        <tbody>
            {{LINHAS_DRE}}
        </tbody>
    </table>

    <!-- Footer -->
    <div class="footer">
        <div class="footer-left">
            <div><strong>SimplesFique</strong> - Sistema de Gestão Empresarial</div>
            <div>www.simplesfique.com.br</div>
        </div>
        <div class="footer-right">
            <div>Página 1 de 1</div>
            <div>{{DATA_GERACAO}}</div>
        </div>
    </div>
</body>
</html>
`

/**
 * Formata valor monetário para exibição
 */
function formatarValor(valor) {
  if (valor === null || valor === undefined) return 'R$ 0,00'
  
  const num = parseFloat(valor)
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num)
}

/**
 * Formata data no formato brasileiro
 */
function formatarData(data) {
  if (!data) return ''
  
  // Se já estiver no formato DD/MM/YYYY, retorna como está
  if (data.includes('/')) return data
  
  // Se estiver no formato YYYY-MM-DD, converte
  const [ano, mes, dia] = data.split('-')
  return `${dia}/${mes}/${ano}`
}

/**
 * Retorna classe CSS do valor baseado em positivo/negativo/zero
 */
function getClasseValor(valor) {
  const num = parseFloat(valor)
  if (num > 0) return 'valor-positivo'
  if (num < 0) return 'valor-negativo'
  return 'valor-zero'
}

/**
 * Retorna ícone do grupo baseado no tipo
 */
function getIconeGrupo(tipo) {
  switch (tipo) {
    case 'RECEITA':
      return '' // Receita
    case 'DESPESA':
      return '' // Despesa
    case 'TOTALIZADOR':
      return '' // Total
    default:
      return ''
  }
}

/**
 * Gera as linhas HTML do relatório DRE
 */
function gerarLinhasDRE(dadosRelatorio) {
  let html = ''
  
  dadosRelatorio.forEach((grupo) => {
    // Linha do grupo
    const classeGrupo = grupo.tipo.toLowerCase()
    const icone = getIconeGrupo(grupo.tipo)
    const classeValorGrupo = getClasseValor(grupo.valor)
    
    html += `
      <tr class="linha-grupo ${classeGrupo}">
        <td>
          <span class="icone-grupo">${icone}</span>
          ${grupo.nome}
        </td>
        <td class="valor ${classeValorGrupo}">
          ${formatarValor(grupo.valor)}
        </td>
      </tr>
    `
    
    // Linhas das categorias
    if (grupo.categorias && grupo.categorias.length > 0) {
      grupo.categorias.forEach((categoria) => {
        const classeValorCategoria = getClasseValor(categoria.valor)
        
        html += `
          <tr class="linha-categoria">
            <td>
              ${categoria.nome}
              ${categoria.classificador ? `<span class="classificador">${categoria.classificador}</span>` : ''}
            </td>
            <td class="valor ${classeValorCategoria}">
              ${formatarValor(categoria.valor)}
            </td>
          </tr>
        `
      })
    }
  })
  
  return html
}

/**
 * Gera o HTML completo do relatório DRE
 * 
 * @param {Object} params - Parâmetros do relatório
 * @param {string} params.nomeEmpresa - Nome da empresa
 * @param {string} params.cnpjEmpresa - CNPJ da empresa
 * @param {string} params.tituloDre - Título do DRE (nome do modelo)
 * @param {string} params.nomeModelo - Nome do modelo DRE
 * @param {string} params.dataInicial - Data inicial do período
 * @param {string} params.dataFinal - Data final do período
 * @param {string} params.tipoPeriodo - Tipo de período (Mensal, Anual, etc)
 * @param {Array} params.dadosRelatorio - Dados do relatório (grupos e categorias)
 * @returns {string} HTML do relatório
 */
export function gerarRelatorioDRE(params) {
  const {
    nomeEmpresa = 'Nome da Empresa',
    cnpjEmpresa = '00.000.000/0000-00',
    tituloDre = 'DRE - Demonstrativo de Resultado',
    nomeModelo = 'Modelo DRE',
    dataInicial = '',
    dataFinal = '',
    tipoPeriodo = 'Mensal',
    dadosRelatorio = []
  } = params
  
  const dataGeracao = new Date().toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
  
  const linhasDRE = gerarLinhasDRE(dadosRelatorio)
  
  let html = TEMPLATE_DRE
  
  // Substituir placeholders
  html = html.replace(/{{NOME_EMPRESA}}/g, nomeEmpresa)
  html = html.replace(/{{CNPJ_EMPRESA}}/g, cnpjEmpresa)
  html = html.replace(/{{TITULO_DRE}}/g, tituloDre)
  html = html.replace(/{{NOME_MODELO}}/g, nomeModelo)
  html = html.replace(/{{DATA_INICIAL}}/g, formatarData(dataInicial))
  html = html.replace(/{{DATA_FINAL}}/g, formatarData(dataFinal))
  html = html.replace(/{{TIPO_PERIODO}}/g, tipoPeriodo)
  html = html.replace(/{{DATA_GERACAO}}/g, dataGeracao)
  html = html.replace(/{{LINHAS_DRE}}/g, linhasDRE)
  
  return html
}

/**
 * Abre o relatório DRE em uma nova janela para impressão
 */
export function imprimirRelatorioDRE(params) {
  const html = gerarRelatorioDRE(params)
  
  const janelaImpressao = window.open('', '_blank', 'width=800,height=600')
  
  if (janelaImpressao) {
    janelaImpressao.document.write(html)
    janelaImpressao.document.close()
    
    // Aguardar carregamento e imprimir
    janelaImpressao.onload = () => {
      setTimeout(() => {
        janelaImpressao.print()
      }, 250)
    }
  } else {
    alert('Por favor, permita pop-ups para imprimir o relatório')
  }
}
