#!/usr/bin/env node

/**
 * API Smoke Test — SimplesFique
 * 
 * Testa conectividade e endpoints das APIs:
 *   - PHP API (porta 8000) — novo backend
 *   - THorse API (porta 9005) — backend legado
 * 
 * Uso:
 *   node scripts/api-smoke-test.js                        # testa conexão básica
 *   TOKEN=seu_token node scripts/api-smoke-test.js         # testa com token
 *   USUARIO=admin SENHA=admin node scripts/api-smoke-test.js # tenta login
 *   node scripts/api-smoke-test.js --php-only              # só PHP API
 *   node scripts/api-smoke-test.js --thorse-only           # só THorse API
 */

const http = require('http');
const https = require('https');

// ============================================================
// CONFIGURAÇÃO
// ============================================================
const PHP_API = process.env.PHP_API || 'http://192.168.10.51:8000/api/v1';
const THORSE_API = process.env.THORSE_API || 'http://192.168.10.100:9005';
const TOKEN = process.env.TOKEN || '';
const USUARIO = process.env.USUARIO || '';
const SENHA = process.env.SENHA || '';

const args = process.argv.slice(2);
const PHP_ONLY = args.includes('--php-only');
const THORSE_ONLY = args.includes('--thorse-only');

// ============================================================
// CORES
// ============================================================
const RESET = '\x1b[0m';
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const MAGENTA = '\x1b[35m';
const CYAN = '\x1b[36m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';

// ============================================================
// HTTP HELPER
// ============================================================
function fetchUrl(url, options = {}) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const urlObj = new URL(url);
    const lib = urlObj.protocol === 'https:' ? https : http;
    
    const opts = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.token ? { 'Authorization': `Bearer ${options.token}` } : {}),
        ...(options.headers || {}),
      },
      timeout: options.timeout || 5000,
    };

    if (options.body) {
      opts.headers['Content-Type'] = 'application/json';
    }

    const req = lib.request(opts, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const elapsed = Date.now() - startTime;
        let parsed = null;
        try { parsed = JSON.parse(data); } catch (e) { parsed = data; }
        resolve({
          status: res.statusCode,
          statusText: res.statusMessage,
          body: parsed,
          bodyRaw: data,
          elapsed,
          ok: res.statusCode >= 200 && res.statusCode < 300,
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        status: 0,
        statusText: err.code || err.message,
        body: null,
        bodyRaw: null,
        elapsed: Date.now() - startTime,
        ok: false,
        error: err.message,
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        status: 0,
        statusText: 'TIMEOUT',
        body: null,
        bodyRaw: null,
        elapsed: Date.now() - startTime,
        ok: false,
        error: 'Request timed out',
      });
    });

    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

// ============================================================
// HELPERS DE FORMATAÇÃO
// ============================================================
function statusBadge(ok, status) {
  if (status === 0) return `${RED}${BOLD}✘${RESET}`;
  if (ok) return `${GREEN}✓ ${status}${RESET}`;
  if (status === 404) return `${YELLOW}⚠ ${status}${RESET}`;
  return `${RED}✘ ${status}${RESET}`;
}

function elapsedStr(ms) {
  if (ms > 3000) return `${RED}${ms}ms${RESET}`;
  if (ms > 1000) return `${YELLOW}${ms}ms${RESET}`;
  return `${DIM}${ms}ms${RESET}`;
}

function printLine(label, result, extra = '') {
  const badge = statusBadge(result.ok, result.status);
  const time = elapsedStr(result.elapsed);
  const detail = result.error ? ` — ${RED}${result.error}${RESET}` : extra;
  console.log(`  ${badge} ${BLUE}${label.padEnd(50)}${RESET} ${time}${detail}`);
}

function section(title) {
  console.log(`\n${BOLD}${CYAN}═══ ${title} ${RESET}${CYAN}${'═'.repeat(Math.max(0, 60 - title.length - 4))}${RESET}`);
}

function subsection(title) {
  console.log(`\n ${BOLD}${MAGENTA}▸ ${title}${RESET}`);
}

function printBody(label, body) {
  if (!body) return;
  const str = typeof body === 'string' ? body : JSON.stringify(body, null, 2);
  // Truncate very long responses
  const lines = str.split('\n');
  const truncated = lines.length > 30 ? lines.slice(0, 30).join('\n') + `\n${DIM}... (${lines.length - 30} more lines)${RESET}` : str;
  console.log(`   ${DIM}${label}:${RESET}`);
  console.log(`   ${DIM}${truncated.split('\n').map(l => '  ' + l).join('\n')}${RESET}`);
}

// ============================================================
// TESTES POR ENDPOINT
// ============================================================

async function testPhpApi(phpBase, token) {
  section('PHP API (porta 8000)');
  
  // 1. Health check
  subsection('Conectividade');
  
  const root = await fetchUrl(`${phpBase.replace('/api/v1', '')}/`, { timeout: 3000 });
  printLine('GET / (root)', root);

  const health = await fetchUrl(`${phpBase}/health`, { timeout: 3000 });
  printLine('GET /api/v1/health', health);

  // 2. Autenticação (tenta login se credenciais fornecidas)
  let authToken = token;
  if (!authToken && USUARIO && SENHA) {
    subsection('Autenticação');
    const login = await fetchUrl(`${phpBase}/auth/login`, {
      method: 'POST',
      body: { usuario: USUARIO, senha: SENHA },
      timeout: 5000,
    });
    printLine('POST /auth/login', login);
    if (login.ok && login.body?.token) {
      authToken = login.body.token;
      console.log(`   ${GREEN}✓ Token obtido!${RESET}`);
    } else if (login.ok && login.body?.data?.token) {
      authToken = login.body.data.token;
      console.log(`   ${GREEN}✓ Token obtido!${RESET}`);
    }
  }

  if (!authToken) {
    subsection('Sem token — pulando endpoints autenticados');
    console.log(`   ${YELLOW}⚠ Forneça TOKEN ou USUARIO/SENHA para testar endpoints autenticados${RESET}`);
    return { authToken: null };
  }

  const headers = { Authorization: `Bearer ${authToken}` };

  // 3. Endpoints principais da API PHP
  subsection('Endpoints PHP');
  
  const endpoints = [
    // Pessoas
    { path: '/manutencao/pessoas', label: 'GET /manutencao/pessoas' },
    { path: '/manutencao/pessoas?find=test', label: 'GET /manutencao/pessoas?find=test' },
    
    // Produtos
    { path: '/estoque/produtos', label: 'GET /estoque/produtos' },
    { path: '/estoque/produtos?find=test', label: 'GET /estoque/produtos?find=test' },
    
    // Financeiro
    { path: '/financeiro/contas-pagar', label: 'GET /financeiro/contas-pagar' },
    { path: '/financeiro/contas-receber', label: 'GET /financeiro/contas-receber' },
    { path: '/financeiro/caixas', label: 'GET /financeiro/caixas' },
    { path: '/financeiro/contas-correntes', label: 'GET /financeiro/contas-correntes' },
    { path: '/financeiro/centros-custo', label: 'GET /financeiro/centros-custo' },
    { path: '/financeiro/planos-conta', label: 'GET /financeiro/planos-conta' },
    { path: '/financeiro/dres', label: 'GET /financeiro/dres' },
    
    // Empresa
    { path: '/empresa/me', label: 'GET /empresa/me' },
    
    // Usuários
    { path: '/manutencao/usuarios', label: 'GET /manutencao/usuarios' },
    { path: '/manutencao/grupos-usuario', label: 'GET /manutencao/grupos-usuario' },
    
    // Estoque
    { path: '/estoque/grupos', label: 'GET /estoque/grupos' },
    { path: '/estoque/subgrupos', label: 'GET /estoque/subgrupos' },
    { path: '/estoque/classes', label: 'GET /estoque/classes' },
    { path: '/estoque/almoxarifados', label: 'GET /estoque/almoxarifados' },
    { path: '/estoque/marcas', label: 'GET /estoque/marcas' },
    { path: '/estoque/garantias', label: 'GET /estoque/garantias' },
    { path: '/estoque/cores', label: 'GET /estoque/cores' },
    { path: '/estoque/inventarios', label: 'GET /estoque/inventarios' },
    
    // Produtos - sub-recursos
    { path: '/estoque/produtos/embalagens', label: 'GET /estoque/produtos/embalagens' },
    { path: '/estoque/produtos/grades', label: 'GET /estoque/produtos/grades' },
    { path: '/estoque/produtos/fornecedores', label: 'GET /estoque/produtos/fornecedores' },
    { path: '/estoque/produtos/similares', label: 'GET /estoque/produtos/similares' },
    { path: '/estoque/produtos/localizacoes', label: 'GET /estoque/produtos/localizacoes' },
    { path: '/estoque/produtos/tributacoes', label: 'GET /estoque/produtos/tributacoes' },
    
    // Entradas DFe
    { path: '/estoque/entradas-dfe', label: 'GET /estoque/entradas-dfe' },
    { path: '/estoque/devolucoes', label: 'GET /estoque/devolucoes' },
    
    // Manutenção
    { path: '/manutencao/formulas', label: 'GET /manutencao/formulas' },
    
    // Integrações
    { path: '/integracoes/api-externa', label: 'GET /integracoes/api-externa' },
  ];

  for (const ep of endpoints) {
    const result = await fetchUrl(`${phpBase}${ep.path}`, { token: authToken, timeout: 5000 });
    const count = result.ok && Array.isArray(result.body?.data) ? ` (${result.body.data.length} registros)` 
                : result.ok && Array.isArray(result.body) ? ` (${result.body.length} registros)`
                : '';
    printLine(ep.label, result, count);
    
    // Se for 422, mostra mensagem de erro
    if (result.status === 422 && result.body) {
      console.log(`   ${YELLOW}Erro de validação: ${JSON.stringify(result.body)}${RESET}`);
    }
  }

  return { authToken };
}

async function testThorseApi(thorseBase, token) {
  section('THorse API (porta 9005)');
  
  subsection('Conectividade');
  
  // Testa endpoints públicos
  const empsaas = await fetchUrl(`${thorseBase}/empsaas`, { token, timeout: 5000 });
  printLine('GET /empsaas', empsaas);

  if (token) {
    subsection('Endpoints THorse (autenticados)');
    
    const thorseEndpoints = [
      { path: `/contacorrente/${'${idEmpresa}'}`, label: 'GET /contacorrente/{emp}' },
      { path: `/pagar/${'${idEmpresa}'}`, label: 'GET /pagar/{emp}' },
      { path: `/receber/${'${idEmpresa}'}`, label: 'GET /receber/{emp}' },
      { path: `/centrodecusto/${'${idEmpresa}'}`, label: 'GET /centrodecusto/{emp}' },
      { path: `/planoconta/${'${idEmpresa}'}`, label: 'GET /planoconta/{emp}' },
      { path: `/caixa/${'${idEmpresa}'}`, label: 'GET /caixa/{emp}' },
      { path: `/caixahistmov/${'${idEmpresa}'}`, label: 'GET /caixahistmov/{emp}' },
      { path: `/produto/${'${idEmpresa}'}`, label: 'GET /produto/{emp}' },
      { path: `/marca/${'${idEmpresa}'}`, label: 'GET /marca/{emp}' },
      { path: `/grupo/${'${idEmpresa}'}`, label: 'GET /grupo/{emp}' },
      { path: `/classe/${'${idEmpresa}'}`, label: 'GET /classe/{emp}' },
      { path: `/almoxarifado/${'${idEmpresa}'}`, label: 'GET /almoxarifado/{emp}' },
      { path: `/medida`, label: 'GET /medida' },
      { path: `/mpo`, label: 'GET /mpo' },
      { path: `/terminalven/${'${idEmpresa}'}`, label: 'GET /terminalven/{emp}' },
      { path: `/ambiente/${'${idEmpresa}'}`, label: 'GET /ambiente/{emp}' },
      { path: `/transfalmox/${'${idEmpresa}'}`, label: 'GET /transfalmox/{emp}' },
      { path: `/pagarreceber/${'${idEmpresa}'}`, label: 'GET /pagarreceber/{emp}' },
      { path: `/saldosbancario/${'${idEmpresa}'}`, label: 'GET /saldosbancario/{emp}' },
      { path: `/adtfornecedor/${'${idEmpresa}'}`, label: 'GET /adtfornecedor/{emp}' },
      { path: `/parfinbxa/${'${idEmpresa}'}`, label: 'GET /parfinbxa/{emp}' },
    ];

    for (const ep of thorseEndpoints) {
      const result = await fetchUrl(`${thorseBase}${ep.path}`, { token, timeout: 5000 });
      printLine(ep.label, result);
    }
  } else {
    console.log(`   ${YELLOW}⚠ Token necessário para testar endpoints THorse${RESET}`);
  }
}

// ============================================================
// MAIN
// ============================================================
async function main() {
  console.log(`\n${BOLD}${CYAN}╔══════════════════════════════════════════════════╗${RESET}`);
  console.log(`${BOLD}${CYAN}║       API SMOKE TEST — SimplesFique ERP          ║${RESET}`);
  console.log(`${BOLD}${CYAN}╚══════════════════════════════════════════════════╝${RESET}`);
  console.log(`\n${DIM}PHP API:  ${PHP_API}${RESET}`);
  console.log(`${DIM}THorse:   ${THORSE_API}${RESET}`);
  console.log(`${DIM}Token:    ${TOKEN ? '✓ fornecido' : '— não fornecido'}${RESET}`);
  console.log(`${DIM}Creds:    ${USUARIO ? `${USUARIO}/****` : '— não fornecidas'}${RESET}`);
  console.log(`${DIM}Data:     ${new Date().toISOString()}${RESET}`);

  // Test PHP API
  if (!THORSE_ONLY) {
    await testPhpApi(PHP_API, TOKEN);
  }

  // Test THorse API
  if (!PHP_ONLY) {
    await testThorseApi(THORSE_API, TOKEN);
  }

  console.log(`\n${BOLD}${GREEN}══════════════════════════════════════════════════${RESET}`);
  console.log(`${BOLD}${GREEN}  Smoke test concluído!${RESET}`);
  console.log(`${BOLD}${GREEN}══════════════════════════════════════════════════${RESET}\n`);
}

main().catch(err => {
  console.error(`${RED}Erro fatal:${RESET}`, err);
  process.exit(1);
});
