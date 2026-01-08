// Template HTML para impressão de Previsão de Débitos por Centro de Custo
export const TEMPLATE_CENTRO_CUSTO = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Previsão de Débitos por Centro de Custo - SimplesFique</title>
    <style>
        @page {
            size: A4 landscape;
            margin: 10mm;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Roboto', Arial, sans-serif;
            font-size: 10px;
            color: #2b2b2b;
            padding: 10px;
            background: #fff;
            width: 100%;
        }

        .header {
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 3px solid #F57C00;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }

        .logo-container {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .logo-img {
            width: 40px;
            height: 40px;
            object-fit: contain;
        }

        .logo-text {
            font-size: 20px;
            font-weight: bold;
            color: #F57C00;
        }

        .logo-text span {
            color: #de7e3e;
        }

        .info-relatorio {
            font-size: 10px;
            line-height: 1.4;
            text-align: right;
        }

        .info-relatorio strong {
            color: #F57C00;
        }

        .section-title {
            color: #F57C00;
            font-size: 14px;
            font-weight: bold;
            margin: 15px 0 10px 0;
            display: flex;
            align-items: baseline;
            gap: 8px;
        }

        .section-title span {
            font-size: 10px;
            font-weight: normal;
            color: #666;
        }

        /* Título do Centro de Custo */
        .ccusto-titulo {
            color: #F57C00;
            font-size: 12px;
            font-weight: bold;
            margin: 15px 0 8px 0;
            padding: 5px 0;
            border-radius: 4px;
            display: inline-block;
        }

        /* Quebra de página por centro de custo */
        .ccusto-bloco {
            margin-bottom: 20px;
        }

        /* Quebra de página ANTES do centro de custo */
        .ccusto-bloco.quebra-pagina {
            page-break-before: always;
            break-before: page;
        }

        /* Indicador de parte da tabela (Parte 1/2, etc) */
        .parte-indicador {
            font-size: 8px;
            font-weight: normal;
            color: rgba(255,255,255,0.8);
            margin-left: 5px;
        }

        /* Total do centro de custo quando múltiplas tabelas */
        .total-ccusto {
            background: #fff3e0;
            color: #E65100;
            padding: 8px 12px;
            margin: 5px 0 20px 0;
            border-radius: 4px;
            font-size: 11px;
            display: inline-block;
        }

        /* Container da tabela */
        .table-container {
            width: 100%;
            overflow-x: auto;
        }

        /* Tabela Principal - Centro de Custo */
        .table-ccusto {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
            border-radius: 6px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            table-layout: fixed;
        }

        .table-ccusto thead {
            background: linear-gradient(135deg, #F57C00 0%, #de7e3e 100%) !important;
            color: white !important;
        }

        .table-ccusto th {
            padding: 8px 4px !important;
            text-align: center !important;
            font-weight: 600 !important;
            font-size: 9px !important;
            text-transform: uppercase !important;
            letter-spacing: 0.3px !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            color: white !important;
            background: transparent !important;
            border: none !important;
        }

        .table-ccusto th.text-left {
            text-align: left !important;
            padding-left: 8px !important;
        }

        .table-ccusto td {
            padding: 6px 4px;
            border-bottom: 1px solid #f0f0f0;
            font-size: 9px;
            text-align: center;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .table-ccusto td.text-left {
            text-align: left;
            padding-left: 8px;
        }

        .table-ccusto tbody tr:nth-child(even) {
            background-color: #fafafa;
        }

        .table-ccusto tbody tr:hover {
            background-color: #fff8f3;
        }

        /* Linha de centro de custo (agrupador) - destaque */
        .table-ccusto .row-ccusto {
            background-color: #fff3e0 !important;
        }

        .table-ccusto .row-ccusto td:first-child {
            font-weight: 700;
            font-size: 10px;
            color: #E65100;
            text-transform: uppercase;
        }

        /* Linha de despesa (detalhe) */
        .table-ccusto .row-despesa td:first-child {
            padding-left: 16px;
            font-size: 8px;
            color: #666;
        }

        /* Linha de totais */
        .table-ccusto tfoot {
            background: linear-gradient(135deg, #F57C00 0%, #de7e3e 100%);
            color: white;
            font-weight: bold;
        }

        .table-ccusto tfoot td {
            padding: 8px 4px;
            border-bottom: none;
            font-size: 9px;
        }

        /* Linha de subtotal */
        .table-ccusto .row-subtotal {
            background: linear-gradient(135deg, #F57C00 0%, #de7e3e 100%) !important;
            color: white !important;
            font-weight: bold !important;
        }

        .table-ccusto .row-subtotal td {
            background: transparent !important;
            color: white !important;
            padding: 8px 4px !important;
            border-bottom: none !important;
        }

        .valor-positivo {
            color: #2e7d32;
            font-weight: 500;
        }

        .valor-total {
            font-weight: bold;
            color: #1565c0;
        }

        /* Classes responsivas baseadas no número de colunas */
        .cols-small .table-ccusto th,
        .cols-small .table-ccusto td {
            font-size: 10px;
            padding: 8px 6px;
        }

        .cols-medium .table-ccusto th,
        .cols-medium .table-ccusto td {
            font-size: 9px;
            padding: 6px 4px;
        }

        .cols-large .table-ccusto th,
        .cols-large .table-ccusto td {
            font-size: 8px;
            padding: 5px 3px;
        }

        .cols-xlarge .table-ccusto th,
        .cols-xlarge .table-ccusto td {
            font-size: 7px;
            padding: 4px 2px;
        }

        /* Tabela de Resumo */
        .table-resumo {
            width: 350px;
            border-collapse: collapse;
            margin-bottom: 15px;
            background: #fafafa;
            border-radius: 6px;
            overflow: hidden;
        }

        .table-resumo tr {
            border-bottom: 1px solid #e8e8e8;
        }

        .table-resumo tr:last-child {
            border-bottom: none;
        }

        .table-resumo td {
            padding: 8px 10px;
            font-size: 10px;
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
            font-size: 11px;
        }

        .footer-note {
            font-size: 9px;
            color: #888;
            text-align: center;
            margin-top: 15px;
            padding-top: 10px;
            border-top: 1px solid #e8e8e8;
        }

        .footer-brand {
            margin-top: 5px;
            color: #F57C00;
            font-weight: 500;
        }

        .info-impressao {
            font-size: 8px;
            color: #aaa;
            margin-top: 3px;
        }

        @media print {
            body {
                padding: 5px;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }

            .no-print {
                display: none;
            }

            .table-ccusto tbody tr:hover {
                background-color: transparent;
            }

            .table-ccusto thead,
            .table-ccusto tfoot {
                background: #F57C00 !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
        }
    </style>
</head>
<body class="{{colsClass}}">
    <div class="header">
        <div class="logo-container">
           
            <div class="logo-text">Simples<span>Fique</span></div>
        </div>
        <div class="info-relatorio">
            <strong>Relatório:</strong> Previsão de Débitos por Centro de Custo<br>
            <strong>Empresa:</strong> {{empresa}}<br>
            <strong>Operador:</strong> {{operador}}
        </div>
    </div>

    <h2 class="section-title">Previsão de Débitos por Centro de Custo <span>({{dataInicio}} a {{dataFim}})</span></h2>

    {{TABELAS_CCUSTO}}

    <div class="resumo-geral">
        <h2 class="section-title">Resumo Geral</h2>

        <table class="table-resumo">
            <tr>
                <td>Total de Centros de Custo</td>
                <td>{{totalCentrosCusto}}</td>
            </tr>
            <tr>
                <td>Total de Despesas</td>
                <td>{{totalDespesas}}</td>
            </tr>
            <tr class="destaque">
                <td><strong>Valor Total Previsto</strong></td>
                <td>{{totalGeral}}</td>
            </tr>
        </table>
    </div>

    {{SECAO_GRAFICO}}

    <div class="footer-note">
        Documento gerado automaticamente pelo sistema.
        <div class="footer-brand">SimplesFique - Sistema de Gestão Empresarial</div>
        <div class="info-impressao">Impresso em: {{dataImpressao}}</div>
    </div>
</body>
</html>`

/**
 * Gera HTML de Previsão/Débitos por Centro de Custo - Mesmo formato do FinanceiroRelatorioView
 * @param {string} tipoRelatorio - 'Previsão de Débitos' ou 'Débitos Realizados'
 * @param {array} dados - Array de previsões/débitos RAW da API
 * @param {object} filtros - Filtros aplicados {dataInicio, dataFim, centroCusto}
 * @param {object} opcoes - Opções adicionais {quebraPagina, exibirGrafico}
 * @returns {string} HTML processado
 */
export const gerarHTMLCentroCusto = (tipoRelatorio, dados, filtros = {}, opcoes = {}) => {
  if (!dados || dados.length === 0) {
    console.warn('⚠️ Nenhum dado para gerar HTML')
    return null
  }

  let html = TEMPLATE_CENTRO_CUSTO

  // Dados padrão
  const dataAtual = new Date()
  const empresa = localStorage.getItem('empresa_nome') || 'Empresa'
  const operador = localStorage.getItem('usuario_nome') || 'Sistema'

  // Meses abreviados
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

  // Formatar datas
  const formatarData = (data) => {
    if (!data) return ''
    const d = new Date(data + 'T00:00:00')
    return d.toLocaleDateString('pt-BR')
  }

  const formatarMoeda = (valor) => {
    if (!valor) return '0,00'
    return parseFloat(valor).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  // Função para limpar nome do centro de custo
  const limparNomeCCusto = (nome) => {
    if (!nome) return ''
    let limpo = nome.replace(/\s*-?\s*Ativo$/i, '').trim()
    return limpo || nome
  }

  // 1. Extrair datas únicas dos dados
  const datasUnicas = new Set()
  dados.forEach(item => {
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

  // 3. Processar dados para formato de previsões
  const previsoesProcessadas = dados.map(item => {
    const previsaoItem = {
      centroCusto: item.desccentrocusto || item.centroCusto || 'Sem Centro de Custo',
      descricao: item.descconta || item.descplanoconta || item.descricao || 'Despesa',
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

  // 4. Agrupar por centro de custo
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

  // 5. Calcular totais
  const totaisPorDia = diasComCobranca.map(dia => {
    return previsoesProcessadas.reduce((sum, item) => sum + (item[dia.key] || 0), 0)
  })

  const totalGeral = previsoesProcessadas.reduce((sum, item) => sum + (item.total || 0), 0)

  // Determinar classe de tamanho baseada na quantidade de colunas
  const numColunas = diasComCobranca.length
  let colsClass = 'cols-small'
  if (numColunas > 20) {
    colsClass = 'cols-xlarge'
  } else if (numColunas > 12) {
    colsClass = 'cols-large'
  } else if (numColunas > 7) {
    colsClass = 'cols-medium'
  }

  // 6. Função para dividir array em grupos
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

  // 7. Gerar HTML das tabelas por centro de custo
  let tabelasCCusto = ''
  let totalDespesasConsolidadas = 0

  const quebraPaginaPorCCusto = opcoes.quebraPagina === true

  centrosCustoAgrupados.forEach((cc, indexCCusto) => {
    const nomeCCusto = limparNomeCCusto(cc.centroCusto)

    // Consolidar despesas iguais
    const despesasConsolidadas = {}
    cc.despesas.forEach(despesa => {
      const nomeDesp = despesa.descricao

      if (!despesasConsolidadas[nomeDesp]) {
        despesasConsolidadas[nomeDesp] = {
          descricao: nomeDesp,
          total: 0
        }
        diasComCobranca.forEach(dia => {
          despesasConsolidadas[nomeDesp][dia.key] = 0
        })
      }

      despesasConsolidadas[nomeDesp].total += despesa.total || 0
      diasComCobranca.forEach(dia => {
        despesasConsolidadas[nomeDesp][dia.key] += despesa[dia.key] || 0
      })
    })

    const listaConsolidada = Object.values(despesasConsolidadas)
    totalDespesasConsolidadas += listaConsolidada.length

    // Abrir div do bloco do centro de custo
    const classeQuebraPaginaCC = (quebraPaginaPorCCusto && indexCCusto > 0) ? ' quebra-pagina' : ''
    tabelasCCusto += `<div class="ccusto-bloco${classeQuebraPaginaCC}">`
    tabelasCCusto += `<h3 class="ccusto-titulo">${nomeCCusto}</h3>`

    // Gerar uma tabela para cada grupo de dias
    gruposDeDias.forEach((grupoDias, indexGrupo) => {
      let headersDiasGrupo = ''
      grupoDias.forEach(dia => {
        headersDiasGrupo += `<th style="background: transparent; color: white; padding: 8px 6px;">${dia.label}</th>`
      })

      let subtotalGrupo = 0
      grupoDias.forEach(dia => {
        subtotalGrupo += cc[dia.key] || 0
      })

      const temValoresNoGrupo = listaConsolidada.some(despesa =>
        grupoDias.some(dia => (despesa[dia.key] || 0) > 0)
      )

      if (!temValoresNoGrupo && gruposDeDias.length > 1) {
        return
      }

      const indicadorParte = gruposDeDias.length > 1 ? ` <span class="parte-indicador">(Parte ${indexGrupo + 1}/${gruposDeDias.length})</span>` : ''

      tabelasCCusto += `<table class="table-ccusto">
        <thead style="background: linear-gradient(135deg, #F57C00 0%, #de7e3e 100%); color: white;">
          <tr>
            <th class="text-left" style="min-width: 150px; background: transparent; color: white; padding: 8px 6px;">Despesa${indicadorParte}</th>
            ${headersDiasGrupo}
            <th style="min-width: 80px; background: transparent; color: white; padding: 8px 6px;">Subtotal</th>
          </tr>
        </thead>
        <tbody>`

      listaConsolidada.forEach(despesa => {
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

      tabelasCCusto += `<tr class="row-subtotal" style="background: linear-gradient(135deg, #F57C00 0%, #de7e3e 100%); color: white;"><td style="background: transparent; color: white;"><strong>Subtotal</strong></td>`
      grupoDias.forEach(dia => {
        const valor = cc[dia.key] || 0
        tabelasCCusto += `<td style="background: transparent; color: white;">${valor > 0 ? formatarMoeda(valor) : ''}</td>`
      })
      tabelasCCusto += `<td class="col-total" style="background: transparent; color: white;"><strong>${formatarMoeda(subtotalGrupo)}</strong></td></tr>`
      tabelasCCusto += `</tbody></table>`
    })

    tabelasCCusto += `</div>`
  })

  // 8. Gerar HTML dos totais por dia
  let totaisDias = ''
  totaisPorDia.forEach(total => {
    totaisDias += `<td>${formatarMoeda(total)}</td>`
  })

  // Determinar textos baseado no tipo de relatório
  const isPrevisao = tipoRelatorio.toLowerCase().includes('previsão') || tipoRelatorio.toLowerCase().includes('previsto')
  const textoTotalLabel = isPrevisao ? 'Valor Total Previsto' : 'Valor Total Realizado'
  const textoRelatorio = isPrevisao ? 'Previsão de Débitos por Centro de Custo' : 'Débitos Realizados por Centro de Custo'

  // 9. Substituir variáveis no template
  html = html.replace(/{{colsClass}}/g, colsClass)
  html = html.replace(/{{empresa}}/g, empresa)
  html = html.replace(/{{operador}}/g, operador)
  html = html.replace(/{{dataInicio}}/g, formatarData(filtros?.dataInicio || filtros?.dtini || ''))
  html = html.replace(/{{dataFim}}/g, formatarData(filtros?.dataFim || filtros?.dtfim || ''))
  html = html.replace(/{{dataImpressao}}/g, dataAtual.toLocaleString('pt-BR'))
  html = html.replace(/{{TABELAS_CCUSTO}}/g, tabelasCCusto)
  html = html.replace(/{{TOTAIS_DIAS}}/g, totaisDias)
  html = html.replace(/{{totalGeral}}/g, 'R$ ' + formatarMoeda(totalGeral))
  html = html.replace(/{{totalCentrosCusto}}/g, centrosCustoAgrupados.length)
  html = html.replace(/{{totalDespesas}}/g, totalDespesasConsolidadas)
  html = html.replace(/{{totalDias}}/g, diasComCobranca.length)
  html = html.replace(/{{SECAO_GRAFICO}}/g, '')
  html = html.replace(/Previsão de Débitos por Centro de Custo/g, textoRelatorio)
  html = html.replace(/Valor Total Previsto/g, textoTotalLabel)

  return html
}

/**
 * Abre impressão de Centro de Custo (Previsão ou Débitos Realizados)
 */
export const abrirImpressaoCentroCusto = (tipoRelatorio, dados, filtros, opcoes = {}) => {
  try {
    const html = gerarHTMLCentroCusto(tipoRelatorio, dados, filtros, opcoes)

    if (!html) {
      console.warn('⚠️ Nenhum dado para imprimir')
      return
    }

    const janela = window.open('', '_blank', 'width=1200,height=800')
    if (!janela) {
      console.error('❌ Pop-up foi bloqueado pelo navegador!')
      return
    }

    janela.document.write(html)
    janela.document.close()

    setTimeout(() => {
      janela.print()
    }, 500)
  } catch (err) {
    console.error('❌ Erro ao abrir impressão:', err)
  }
}

