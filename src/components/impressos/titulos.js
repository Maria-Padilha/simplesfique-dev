// Template HTML para impressão de Títulos a Pagar/Receber
// Template HTML para impressão de Títulos a Pagar/Receber
export const TEMPLATE_TITULOS = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Títulos a Pagar/Receber - SimplesFique</title>
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

        .logo-text {
            font-size: 22px;
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
            gap: 10px;
        }

        .section-title span {
            font-size: 11px;
            font-weight: normal;
            color: #666;
        }

        .table-titulos {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
            border-radius: 8px;
            overflow: visible;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            font-size: 8px;
        }

        .table-titulos thead {
            background: linear-gradient(135deg, #F57C00 0%, #de7e3e 100%) !important;
            color: white !important;
        }

        .table-titulos th {
            padding: 6px 3px !important;
            text-align: left !important;
            font-weight: 600 !important;
            font-size: 7px !important;
            text-transform: uppercase !important;
            letter-spacing: 0.3px !important;
            color: white !important;
            background: transparent !important;
            border: none !important;
            white-space: nowrap;
        }

        .table-titulos th.text-right {
            text-align: right !important;
        }

        .table-titulos th.text-center {
            text-align: center !important;
        }

        .table-titulos td {
            padding: 4px 3px;
            border-bottom: 1px solid #f0f0f0;
            font-size: 8px;
            word-break: break-word;
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
            margin-bottom: 15px;
            background: #fafafa;
            border-radius: 8px;
            overflow: hidden;
            font-size: 9px;
        }

        .table-resumo tr {
            border-bottom: 1px solid #e8e8e8;
        }

        .table-resumo tr:last-child {
            border-bottom: none;
        }

        .table-resumo td {
            padding: 6px 10px;
            font-size: 8px;
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
            font-size: 9px;
            color: #888;
            text-align: center;
            margin-top: 15px;
            padding-top: 10px;
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
        <thead style="background: linear-gradient(135deg, #F57C00 0%, #de7e3e 100%); color: white;">
            <tr>
                <th style="width: 45px; background: transparent; color: white; padding: 6px 3px;">Doc.</th>
                <th style="width: 35px; background: transparent; color: white; padding: 6px 3px;">Série</th>
                <th style="width: 40px; background: transparent; color: white; padding: 6px 3px;">Espécie</th>
                <th style="width: 35px; text-align: center; background: transparent; color: white; padding: 6px 3px;">Parc.</th>
                <th style="width: 30px; text-align: center; background: transparent; color: white; padding: 6px 3px;">Qtd</th>
                <th style="width: 60px; background: transparent; color: white; padding: 6px 3px;">Emissão</th>
                <th style="width: 60px; background: transparent; color: white; padding: 6px 3px;">Vencimento</th>
                <th style="min-width: 100px; background: transparent; color: white; padding: 6px 3px;">{{CONTRAPARTE_HEADER}}</th>
                <th style="width: 65px; text-align: right; background: transparent; color: white; padding: 6px 3px;">Vlr Doc.</th>
                <th style="width: 65px; text-align: right; background: transparent; color: white; padding: 6px 3px;">Vlr Parc.</th>
                <th style="width: 50px; text-align: right; background: transparent; color: white; padding: 6px 3px;">Juros</th>
                <th style="width: 50px; text-align: right; background: transparent; color: white; padding: 6px 3px;">Multa</th>
                <th style="width: 55px; text-align: right; background: transparent; color: white; padding: 6px 3px;">Desconto</th>
                <th style="width: 55px; text-align: right; background: transparent; color: white; padding: 6px 3px;">Quitado</th>
                <th style="width: 60px; text-align: right; background: transparent; color: white; padding: 6px 3px;">Saldo Dev.</th>
                <th style="width: 80px; background: transparent; color: white; padding: 6px 3px;">Local Cobr.</th>
                <th style="width: 45px; background: transparent; color: white; padding: 6px 3px;">Tipo Doc.</th>
                <th style="width: 45px; background: transparent; color: white; padding: 6px 3px;">Origem</th>
                <th style="width: 60px; background: transparent; color: white; padding: 6px 3px;">Usuário</th>
                <th style="width: 75px; background: transparent; color: white; padding: 6px 3px;">Data Inc.</th>
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

/**
 * Gera HTML de Títulos (Pagar/Receber) - Retorna HTML para uso com html2pdf
 * @param {string} tipoRelatorio - 'Títulos a Pagar' ou 'Títulos a Receber'
 * @param {array} dados - Array de títulos
 * @param {object} filtros - Filtros aplicados {dtini, dtfim, idfornecedor, idlocalcobranca, tpperiodo}
 * @returns {string} HTML processado
 */
export const gerarHTMLTitulos = (tipoRelatorio, dados, filtros = {}) => {
  if (!dados || dados.length === 0) {
    console.warn('⚠️ Nenhum dado para gerar HTML')
    return null
  }

  let html = TEMPLATE_TITULOS

  // Dados padrão
  const dataAtual = new Date()
  const empresa = localStorage.getItem('empresa_nome') || 'Empresa'
  const operador = localStorage.getItem('usuario_nome') || 'Sistema'

  // Formatar datas
  const formatarData = (data) => {
    if (!data) return ''
    const d = new Date(data)
    return d.toLocaleDateString('pt-BR')
  }

  const formatarDataHora = (dataHora) => {
    if (!dataHora) return ''
    const d = new Date(dataHora)
    return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
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
    const vlrDocumento = parseFloat(item.vlrdocumento || item.vltitulo || 0)
    const juros = parseFloat(item.vljuros || item.juros || 0)
    const multa = parseFloat(item.vlmulta || item.multa || 0)
    const desconto = parseFloat(item.desconto || 0)
    const quitado = parseFloat(item.vlrquitado || 0)
    const saldoDevedor = parseFloat(item.saldo_devedor || vlrDocumento - quitado || 0)
    const liquido = valor + juros + multa - desconto

    totalValor += valor
    totalJuros += juros
    totalMulta += multa
    totalLiquido += liquido

    // Usar 'cliente' para Receber, 'fornecedor' para Pagar
    const nomeContraparte = tipoRelatorio.includes('Pagar')
      ? (item.fornecedor || item.nome_razao || item.descpessoa || item.nome || 'N/A')
      : (item.cliente || item.nome_razao || item.descpessoa || item.nome || 'N/A')

    return {
      documento: item.nrdocumento || item.documento || 'N/A',
      serie: item.serie || '-',
      especie: item.especie || '-',
      parcela: item.id_pagparcela || item.nrparcela || '-',
      qtdParcelas: item.qtdparcelas || '-',
      dataCadastro: formatarData(item.dtemissao || item.dtcadastro || item.data),
      dataVencimento: formatarData(item.dtvencimento || item.vencimento),
      contraparte: nomeContraparte,
      vlrDocumento: formatarMoeda(vlrDocumento),
      valor: formatarMoeda(valor),
      juros: juros > 0 ? formatarMoeda(juros) : '0,00',
      multa: multa > 0 ? formatarMoeda(multa) : '0,00',
      desconto: desconto > 0 ? formatarMoeda(desconto) : '0,00',
      quitado: formatarMoeda(quitado),
      saldoDevedor: formatarMoeda(saldoDevedor),
      localCobranca: item.desclocalcobranca || '-',
      tipoDoc: item.abreviatura || '-',
      origem: item.origem || '-',
      usuario: item.user_inc || '-',
      dataInclusao: formatarDataHora(item.dhinc || item.dtcadastro)
    }
  })

  // Substituir variáveis no template
  const tipoContraparte = tipoRelatorio.includes('Pagar') ? 'Fornecedor' : 'Cliente'

  console.log('📋 HTML original contém {{CONTRAPARTE_HEADER}}?', html.includes('{{CONTRAPARTE_HEADER}}'))
  console.log('🔄 Substituindo {{CONTRAPARTE_HEADER}} por:', tipoContraparte)

  html = html.replace(/{{tipoRelatorio}}/g, tipoRelatorio)
  html = html.replace(/{{empresa}}/g, empresa)
  html = html.replace(/{{operador}}/g, operador)
  html = html.replace(/{{dataInicio}}/g, formatarData(filtros?.dtini || filtros?.dt_inicio || ''))
  html = html.replace(/{{dataFim}}/g, formatarData(filtros?.dtfim || filtros?.dt_fim || ''))
  html = html.replace(/{{dataImpressao}}/g, dataAtual.toLocaleString('pt-BR'))
  html = html.replace(/{{CONTRAPARTE_HEADER}}/g, tipoContraparte)
  html = html.replace(/{{tipoContraparte}}/g, tipoContraparte)
  html = html.replace(/{{totalTitulos}}/g, titulos.length)
  html = html.replace(/{{totalValor}}/g, formatarMoeda(totalValor))
  html = html.replace(/{{totalJuros}}/g, formatarMoeda(totalJuros))
  html = html.replace(/{{totalMulta}}/g, formatarMoeda(totalMulta))
  html = html.replace(/{{totalLiquido}}/g, formatarMoeda(totalLiquido))

  console.log('✅ HTML processado - CONTRAPARTE_HEADER foi substituído?', html.includes(tipoContraparte) && !html.includes('{{CONTRAPARTE_HEADER}}'))

  // Gerar linhas de títulos
  let linhasTitulos = ''
  titulos.forEach(titulo => {
    linhasTitulos += `
      <tr>
        <td class="text-center">${titulo.documento}</td>
        <td class="text-center">${titulo.serie}</td>
        <td class="text-center">${titulo.especie}</td>
        <td class="text-center">${titulo.parcela}</td>
        <td class="text-center">${titulo.qtdParcelas}</td>
        <td>${titulo.dataCadastro}</td>
        <td>${titulo.dataVencimento}</td>
        <td>${titulo.contraparte}</td>
        <td class="text-right valor-positivo"><strong>${titulo.vlrDocumento}</strong></td>
        <td class="text-right valor-positivo"><strong>${titulo.valor}</strong></td>
        <td class="text-right ${parseFloat(titulo.juros) > 0 ? 'valor-negativo' : ''}">${titulo.juros}</td>
        <td class="text-right ${parseFloat(titulo.multa) > 0 ? 'valor-negativo' : ''}">${titulo.multa}</td>
        <td class="text-right ${parseFloat(titulo.desconto) > 0 ? 'valor-negativo' : ''}">${titulo.desconto}</td>
        <td class="text-right valor-positivo">${titulo.quitado}</td>
        <td class="text-right valor-positivo"><strong>${titulo.saldoDevedor}</strong></td>
        <td>${titulo.localCobranca}</td>
        <td class="text-center">${titulo.tipoDoc}</td>
        <td class="text-center">${titulo.origem}</td>
        <td>${titulo.usuario}</td>
        <td>${titulo.dataInclusao}</td>
      </tr>
    `
  })

  html = html.replace(/{{LINHAS_TITULOS}}/g, linhasTitulos)

  return html
}

/**
 * Abre impressão de Títulos (Pagar/Receber)
 * @param {string} tipoRelatorio - 'Títulos a Pagar' ou 'Títulos a Receber'
 * @param {array} dados - Array de títulos
 * @param {object} filtros - Filtros aplicados {dtini, dtfim, idfornecedor, idlocalcobranca, tpperiodo}
 */
export const abrirImpressaoTitulos = (tipoRelatorio, dados, filtros) => {
  try {
    console.log('🖨️ Iniciando impressão:', tipoRelatorio)
    console.log('📊 Dados recebidos:', dados)
    console.log('🔧 Filtros:', filtros)

    if (!dados || dados.length === 0) {
      console.warn('⚠️ Nenhum dado para exibir')
      return
    }

    let html = TEMPLATE_TITULOS

    // Dados padrão
    const dataAtual = new Date()
    const empresa = localStorage.getItem('empresa_nome') || 'Empresa'
    const operador = localStorage.getItem('usuario_nome') || 'Sistema'

    console.log('📝 Empresa:', empresa, 'Operador:', operador)

    // Formatar datas
    const formatarData = (data) => {
      if (!data) return ''
      const d = new Date(data)
      return d.toLocaleDateString('pt-BR')
    }

    const formatarDataHora = (dataHora) => {
      if (!dataHora) return ''
      const d = new Date(dataHora)
      return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
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
      const vlrDocumento = parseFloat(item.vlrdocumento || item.vltitulo || 0)
      const juros = parseFloat(item.vljuros || item.juros || 0)
      const multa = parseFloat(item.vlmulta || item.multa || 0)
      const desconto = parseFloat(item.desconto || 0)
      const quitado = parseFloat(item.vlrquitado || 0)
      const saldoDevedor = parseFloat(item.saldo_devedor || vlrDocumento - quitado || 0)
      const liquido = valor + juros + multa - desconto

      totalValor += valor
      totalJuros += juros
      totalMulta += multa
      totalLiquido += liquido

      // Usar 'cliente' para Receber, 'fornecedor' para Pagar
      const nomeContraparte = tipoRelatorio.includes('Pagar')
        ? (item.fornecedor || item.nome_razao || item.descpessoa || item.nome || 'N/A')
        : (item.cliente || item.nome_razao || item.descpessoa || item.nome || 'N/A')

      return {
        documento: item.nrdocumento || item.documento || 'N/A',
        serie: item.serie || '-',
        especie: item.especie || '-',
        parcela: item.id_pagparcela || item.nrparcela || '-',
        qtdParcelas: item.qtdparcelas || '-',
        dataCadastro: formatarData(item.dtemissao || item.dtcadastro || item.data),
        dataVencimento: formatarData(item.dtvencimento || item.vencimento),
        contraparte: nomeContraparte,
        vlrDocumento: formatarMoeda(vlrDocumento),
        valor: formatarMoeda(valor),
        juros: juros > 0 ? formatarMoeda(juros) : '0,00',
        multa: multa > 0 ? formatarMoeda(multa) : '0,00',
        desconto: desconto > 0 ? formatarMoeda(desconto) : '0,00',
        quitado: formatarMoeda(quitado),
        saldoDevedor: formatarMoeda(saldoDevedor),
        localCobranca: item.desclocalcobranca || '-',
        tipoDoc: item.abreviatura || '-',
        origem: item.origem || '-',
        usuario: item.user_inc || '-',
        dataInclusao: formatarDataHora(item.dhinc || item.dtcadastro)
      }
    })

    console.log('✅ Títulos processados:', titulos.length)

    // Substituir variáveis no template
    const tipoContraparte = tipoRelatorio.includes('Pagar') ? 'Fornecedor' : 'Cliente'

    console.log('📋 [abrirImpressaoTitulos] HTML original contém {{CONTRAPARTE_HEADER}}?', html.includes('{{CONTRAPARTE_HEADER}}'))
    console.log('🔄 [abrirImpressaoTitulos] Substituindo {{CONTRAPARTE_HEADER}} por:', tipoContraparte)

    html = html.replace(/{{tipoRelatorio}}/g, tipoRelatorio)
    html = html.replace(/{{empresa}}/g, empresa)
    html = html.replace(/{{operador}}/g, operador)
    html = html.replace(/{{dataInicio}}/g, formatarData(filtros.dtini || filtros.dt_inicio))
    html = html.replace(/{{dataFim}}/g, formatarData(filtros.dtfim || filtros.dt_fim))
    html = html.replace(/{{dataImpressao}}/g, dataAtual.toLocaleString('pt-BR'))
    html = html.replace(/{{CONTRAPARTE_HEADER}}/g, tipoContraparte)
    html = html.replace(/{{tipoContraparte}}/g, tipoContraparte)
    html = html.replace(/{{totalTitulos}}/g, titulos.length)
    html = html.replace(/{{totalValor}}/g, formatarMoeda(totalValor))
    html = html.replace(/{{totalJuros}}/g, formatarMoeda(totalJuros))
    html = html.replace(/{{totalMulta}}/g, formatarMoeda(totalMulta))
    html = html.replace(/{{totalLiquido}}/g, formatarMoeda(totalLiquido))

    console.log('✅ [abrirImpressaoTitulos] CONTRAPARTE_HEADER foi substituído?', html.includes(tipoContraparte) && !html.includes('{{CONTRAPARTE_HEADER}}'))

    // Gerar linhas de títulos
    let linhasTitulos = ''
    titulos.forEach(titulo => {
      linhasTitulos += `
        <tr>
          <td class="text-center">${titulo.documento}</td>
          <td class="text-center">${titulo.serie}</td>
          <td class="text-center">${titulo.especie}</td>
          <td class="text-center">${titulo.parcela}</td>
          <td class="text-center">${titulo.qtdParcelas}</td>
          <td>${titulo.dataCadastro}</td>
          <td>${titulo.dataVencimento}</td>
          <td>${titulo.contraparte}</td>
          <td class="text-right valor-positivo"><strong>${titulo.vlrDocumento}</strong></td>
          <td class="text-right valor-positivo"><strong>${titulo.valor}</strong></td>
          <td class="text-right ${parseFloat(titulo.juros) > 0 ? 'valor-negativo' : ''}">${titulo.juros}</td>
          <td class="text-right ${parseFloat(titulo.multa) > 0 ? 'valor-negativo' : ''}">${titulo.multa}</td>
          <td class="text-right ${parseFloat(titulo.desconto) > 0 ? 'valor-negativo' : ''}">${titulo.desconto}</td>
          <td class="text-right valor-positivo">${titulo.quitado}</td>
          <td class="text-right valor-positivo"><strong>${titulo.saldoDevedor}</strong></td>
          <td>${titulo.localCobranca}</td>
          <td class="text-center">${titulo.tipoDoc}</td>
          <td class="text-center">${titulo.origem}</td>
          <td>${titulo.usuario}</td>
          <td>${titulo.dataInclusao}</td>
        </tr>
      `
    })

    html = html.replace(/{{LINHAS_TITULOS}}/g, linhasTitulos)

    console.log('🖥️ Abrindo janela de impressão...')

    // Abrir em nova janela com print
    const janela = window.open('', '_blank', 'width=1000,height=800')

    if (!janela) {
      console.error('❌ Pop-up foi bloqueado pelo navegador!')
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
  }
}

