#!/usr/bin/env node
/**
 * Gerencia as APIs pendentes no backend PHP.
 *
 * Uso:
 *   node scripts/pendencias-php.js gerar
 *       → Regenera APIS_PENDENTES_PHP.md a partir do JSON
 *
 *   node scripts/pendencias-php.js add --modulo "Financeiro/Caixas" --endpoint "GET /rota" --obs "Descrição" [--status aguardando|automatico|confirmado|descartado] [--etapa 3.5]
 *       → Adiciona entrada no JSON e regenera o markdown
 *
 *   node scripts/pendencias-php.js status --modulo "Financeiro/Caixas" --endpoint "GET /rota" --status confirmado
 *       → Atualiza status de uma entrada existente
 */

const fs = require('fs')
const path = require('path')

const JSON_PATH = path.join(__dirname, '../projeto/apis-pendentes.json')
const MD_PATH = path.join(__dirname, '../projeto/APIS_PENDENTES_PHP.md')

const STATUS_LABEL = {
  aguardando:  '⏳ Aguardando backend',
  automatico:  '🔄 Automático no CRUD',
  confirmado:  '✅ Confirmado',
  descartado:  '❌ Descartado',
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function lerJson() {
  return JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'))
}

function salvarJson(data) {
  fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 2) + '\n')
}

function gerarMarkdown(data) {
  const hoje = new Date().toISOString().slice(0, 10)
  let md = `# APIs Pendentes no Backend PHP

> Endpoints que existem no THorse mas ainda **não estão documentados ou implementados** na nova API PHP.
> Gerado automaticamente de \`projeto/apis-pendentes.json\` — não editar manualmente.
> Última atualização: ${hoje}

---

## Legenda de status

| Status | Significado |
|--------|-------------|
| ⏳ Aguardando backend | Não existe na API PHP — reportar ao time de backend |
| 🔄 Automático no CRUD | PHP trata internamente, sem endpoint próprio |
| ✅ Confirmado | Backend confirmou que vai implementar |
| ❌ Descartado | Não será implementado |

---

`

  // Agrupar módulos pelo pai (antes do "/") para não repetir H2
  const grupos = {}
  for (const [modulo, entradas] of Object.entries(data.modulos)) {
    const [pai, sub] = modulo.includes('/') ? modulo.split('/') : [modulo, null]
    if (!grupos[pai]) grupos[pai] = []
    grupos[pai].push({ sub, entradas })
  }

  for (const [pai, subs] of Object.entries(grupos)) {
    md += `## ${pai}\n\n`
    for (const { sub, entradas } of subs) {
      if (sub) md += `### ${sub}\n\n`
      md += `| THorse endpoint | Observação | Etapa | Status |\n`
      md += `|----------------|------------|-------|--------|\n`
      for (const e of entradas) {
        const status = STATUS_LABEL[e.status] ?? e.status
        const etapa = e.etapa ?? '-'
        md += `| \`${e.endpoint}\` | ${e.observacao} | ${etapa} | ${status} |\n`
      }
      md += '\n'
    }
  }

  // Resumo por status
  const contagem = {}
  for (const entradas of Object.values(data.modulos)) {
    for (const e of entradas) {
      contagem[e.status] = (contagem[e.status] ?? 0) + 1
    }
  }
  const total = Object.values(contagem).reduce((a, b) => a + b, 0)

  md += `---\n\n## Resumo\n\n`
  md += `| Status | Qtd |\n|--------|-----|\n`
  for (const [s, n] of Object.entries(contagem)) {
    md += `| ${STATUS_LABEL[s] ?? s} | ${n} |\n`
  }
  md += `| **Total** | **${total}** |\n`

  return md
}

function parseArgs(argv) {
  const args = {}
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      args[argv[i].slice(2)] = argv[i + 1]
      i++
    }
  }
  return args
}

// ─── comandos ─────────────────────────────────────────────────────────────────

const [,, cmd, ...rest] = process.argv
const args = parseArgs(rest)

if (cmd === 'gerar') {
  const data = lerJson()
  fs.writeFileSync(MD_PATH, gerarMarkdown(data))
  console.log('✅ APIS_PENDENTES_PHP.md regenerado.')

} else if (cmd === 'add') {
  const { modulo, endpoint, obs, status = 'aguardando', etapa = '-' } = args
  if (!modulo || !endpoint || !obs) {
    console.error('Uso: pendencias-php.js add --modulo "..." --endpoint "..." --obs "..." [--status ...] [--etapa ...]')
    process.exit(1)
  }

  const data = lerJson()
  if (!data.modulos[modulo]) data.modulos[modulo] = []

  const existe = data.modulos[modulo].find(e => e.endpoint === endpoint)
  if (existe) {
    console.log(`⚠️  Entrada já existe: ${endpoint} em ${modulo}`)
    process.exit(0)
  }

  data.modulos[modulo].push({
    endpoint,
    observacao: obs,
    status,
    etapa,
    data: new Date().toISOString().slice(0, 10)
  })

  salvarJson(data)
  fs.writeFileSync(MD_PATH, gerarMarkdown(data))
  console.log(`✅ Adicionado: [${modulo}] ${endpoint}`)

} else if (cmd === 'status') {
  const { modulo, endpoint, status } = args
  if (!modulo || !endpoint || !status) {
    console.error('Uso: pendencias-php.js status --modulo "..." --endpoint "..." --status ...')
    process.exit(1)
  }

  const data = lerJson()
  const entrada = data.modulos[modulo]?.find(e => e.endpoint === endpoint)
  if (!entrada) {
    console.error(`❌ Não encontrado: ${endpoint} em ${modulo}`)
    process.exit(1)
  }

  entrada.status = status
  salvarJson(data)
  fs.writeFileSync(MD_PATH, gerarMarkdown(data))
  console.log(`✅ Status atualizado: [${modulo}] ${endpoint} → ${status}`)

} else {
  console.log(`Comandos disponíveis:
  gerar                                             Regenera o markdown
  add   --modulo --endpoint --obs [--status] [--etapa]   Adiciona entrada
  status --modulo --endpoint --status               Atualiza status`)
}
