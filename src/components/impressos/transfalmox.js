export const TEMPLATE_TRANSF_ALMOX = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Transferência entre Almoxarifados - SimplesFique</title>
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
      padding-bottom: 12px;
      border-bottom: 3px solid #F57C00;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
    }

    .logo-text {
      font-size: 24px;
      font-weight: bold;
      color: #F57C00;
    }

    .logo-text span {
      color: #de7e3e;
    }

    .info {
      text-align: right;
      line-height: 1.6;
      font-size: 12px;
    }

    .info strong {
      color: #F57C00;
    }

    .card {
      border: 1px solid #f0f0f0;
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 16px;
      background: #fff;
    }

    .card-title {
      color: #F57C00;
      font-weight: 700;
      margin-bottom: 10px;
      font-size: 14px;
    }

    .linha {
      display: grid;
      grid-template-columns: 160px 1fr;
      gap: 8px;
      padding: 4px 0;
      border-bottom: 1px dashed #f2f2f2;
    }

    .linha:last-child {
      border-bottom: 0;
    }

    .label {
      color: #666;
      font-weight: 600;
    }

    .valor {
      color: #222;
    }

    .table {
      width: 100%;
      border-collapse: collapse;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,.08);
    }

    .table thead {
      background: linear-gradient(135deg, #F57C00 0%, #de7e3e 100%);
      color: white;
    }

    .table th {
      text-align: left;
      padding: 10px 8px;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: .4px;
    }

    .table td {
      padding: 9px 8px;
      border-bottom: 1px solid #f0f0f0;
      font-size: 11px;
    }

    .table tbody tr:nth-child(even) {
      background: #fafafa;
    }

    .text-right {
      text-align: right;
    }

    .footer {
      margin-top: 18px;
      padding-top: 10px;
      border-top: 1px solid #e8e8e8;
      text-align: center;
      font-size: 10px;
      color: #888;
    }

    @media print {
      body {
        padding: 8px;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo-text">Simples<span>Fique</span></div>
    <div class="info">
      <div><strong>Nome da empresa:</strong> {{NOME_EMPRESA}}</div>
      <div><strong>Módulo:</strong> {{MODULO}}</div>
      <div><strong>Impresso em:</strong> {{DATA_IMPRESSAO}}</div>
    </div>
  </div>

  <div class="card">
    <div class="card-title">Dados da Transferência</div>
    <div class="linha"><div class="label">ID Transferência:</div><div class="valor">{{ID_TRANSFERENCIA}}</div></div>
    <div class="linha"><div class="label">Empresa Saída:</div><div class="valor">{{EMPRESA_SAIDA}}</div></div>
    <div class="linha"><div class="label">Almox Saída:</div><div class="valor">{{ALMOX_SAIDA}}</div></div>
    <div class="linha"><div class="label">Usuário Saída:</div><div class="valor">{{USUARIO_SAIDA}}</div></div>
    <div class="linha"><div class="label">Data/Hora Saída:</div><div class="valor">{{DH_SAIDA}}</div></div>
    <div class="linha"><div class="label">Empresa Entrada:</div><div class="valor">{{EMPRESA_ENTRADA}}</div></div>
    <div class="linha"><div class="label">Almox Entrada:</div><div class="valor">{{ALMOX_ENTRADA}}</div></div>
    <div class="linha"><div class="label">Usuário Entrada:</div><div class="valor">{{USUARIO_ENTRADA}}</div></div>
    <div class="linha"><div class="label">Data/Hora Entrada:</div><div class="valor">{{DH_ENTRADA}}</div></div>
  </div>

  <div class="card">
    <div class="card-title">Itens</div>
    <table class="table">
      <thead>
        <tr>
          <th style="width: 80px;">Cód.</th>
          <th>Descrição</th>
          <th style="width: 80px;">Cor</th>
          <th style="width: 100px;">Tamanho</th>
          <th class="text-right" style="width: 120px;">Quantidade</th>
        </tr>
      </thead>
      <tbody>
        {{LINHAS_ITENS}}
      </tbody>
    </table>
  </div>

  <div class="footer">
    Documento gerado pelo SimplesFique
  </div>
</body>
</html>`

const escapeHtml = (value) => {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

const formatarQuantidade = (valor) => {
  const numero = Number(valor)
  if (Number.isNaN(numero)) return '0'
  return numero.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 3 })
}

const formatarDataHora = (valor) => {
  if (!valor) return '-'
  const data = new Date(valor)
  if (Number.isNaN(data.getTime())) return String(valor)
  return data.toLocaleString('pt-BR')
}

export const gerarHTMLTransferenciaAlmox = (dados = {}) => {
  let html = TEMPLATE_TRANSF_ALMOX

  const itens = dados.itens || dados.item || []

  const empresaSaida = dados.nome_empresasaida || dados.empresaSaida || dados.origem || '-'
  const almoxSaida = [dados.id_almoxsaida, dados.almox_saida || dados.almoxSaida]
    .filter(Boolean)
    .join(' - ') || '-'
  const empresaEntrada = dados.nome_empresaentrada || dados.empresaEntrada || dados.destino || '-'
  const almoxEntrada = [dados.id_almoxentrada, dados.almox_entrada || dados.almoxEntrada]
    .filter(Boolean)
    .join(' - ') || '-'
  const usuarioSaida = dados.nome_usuariosaida || dados.usuarioSaida || '-'
  const usuarioEntrada = dados.nome_usuarioentrada || dados.usuarioEntrada || '-'

  const linhasItens = itens
    .map(item => `
      <tr>
        <td>${escapeHtml(item.id_produto)}</td>
        <td>${escapeHtml(item.descproduto || '-')}</td>
        <td>${escapeHtml(item.id_cor ?? 0)}</td>
        <td>${escapeHtml(item.id_tamanho ?? 0)}</td>
        <td class="text-right">${escapeHtml(formatarQuantidade(item.quantidade))}</td>
      </tr>
    `)
    .join('') || `<tr><td colspan="5" style="text-align:center; color:#888;">Nenhum item informado</td></tr>`

  html = html.replace(/{{NOME_EMPRESA}}/g, escapeHtml(dados.nomeEmpresa || 'Empresa'))
  html = html.replace(/{{MODULO}}/g, escapeHtml(dados.modulo || 'Estoque'))
  html = html.replace(/{{DATA_IMPRESSAO}}/g, escapeHtml(new Date().toLocaleString('pt-BR')))
  html = html.replace(/{{ID_TRANSFERENCIA}}/g, escapeHtml(dados.idTransferencia || dados.id || '-'))
  html = html.replace(/{{EMPRESA_SAIDA}}/g, escapeHtml(empresaSaida))
  html = html.replace(/{{ALMOX_SAIDA}}/g, escapeHtml(almoxSaida))
  html = html.replace(/{{USUARIO_SAIDA}}/g, escapeHtml(usuarioSaida))
  html = html.replace(/{{DH_SAIDA}}/g, escapeHtml(formatarDataHora(dados.dhsaida || dados.dataHoraSaida)))
  html = html.replace(/{{EMPRESA_ENTRADA}}/g, escapeHtml(empresaEntrada))
  html = html.replace(/{{ALMOX_ENTRADA}}/g, escapeHtml(almoxEntrada))
  html = html.replace(/{{USUARIO_ENTRADA}}/g, escapeHtml(usuarioEntrada))
  html = html.replace(/{{DH_ENTRADA}}/g, escapeHtml(formatarDataHora(dados.dhentrada || dados.dataHoraEntrada)))
  html = html.replace(/{{LINHAS_ITENS}}/g, linhasItens)

  return html
}

export const abrirImpressaoTransferenciaAlmox = (dados = {}) => {
  const html = gerarHTMLTransferenciaAlmox(dados)
  const janela = window.open('', '_blank', 'width=980,height=720')

  if (!janela) {
    console.error('❌ Pop-up bloqueado para impressão da transferência.')
    return
  }

  janela.document.write(html)
  janela.document.close()

  setTimeout(() => {
    janela.print()
  }, 400)
}
