# PLANO DE CORREÇÃO — Vulnerabilidades SimplesFique

> Última atualização: 02/06/2026
> Status: 14/19 itens concluídos

---

## 🔴 Crítico — Pendentes

| # | Vulnerabilidade | Local | Agente | Status |
|---|----------------|-------|--------|--------|
| 1 | Credenciais R2 expostas no bundle JS (AWS SDK no frontend) | `cloudflareR2.js:24-33` | **state-flow** (mover para backend proxy) | 📌 `console.log` removidos, mas AS credenciais via env var ainda vão pro bundle. Pendente: criar proxy no backend |
| 2 | `tokens.md` com JWT reais + PII no repositório local | `.gitignore` já ignora | **code-reviewer** (auditar git history) | 📌 Pendente: verificar se já esteve no git, executar `git filter-repo` se necessário |

## 🟠 Alto — Pendentes

| # | Vulnerabilidade | Local | Agente | Status |
|---|----------------|-------|--------|--------|
| 6 | PIX secrets trafegando em HTTP + logados | `ContaCorrenteView.vue` | **code-reviewer** → **ui-component** | 📌 Pendente: auditar e corrigir |

## 🟡 Médio — Pendentes

| # | Vulnerabilidade | Local | Agente | Status |
|---|----------------|-------|--------|--------|
| 13 | IPs internos hardcoded no bundle de produção (`192.168.10.100`) | `api.js`, `apiLocal.js`, `electron.js` | **state-flow** | 📌 `api.js`/`apiLocal.js` já usam env vars. Pendente: verificar `electron.js` e outros |

## 🔵 Baixo / Organizacional — Pendentes

| # | Pendência | Detalhes | Agente | Status |
|---|-----------|----------|--------|--------|
| 15 | Remover 10 arquivos duplicados | `entrada 2/`, `dre 2.js`, `acessos-rapidos 2.js`, `DreView 2.vue`, `RelatorioDreView 2-4.vue`, `AliquotaUfView 2.vue`, `FormulaView 2.vue`, `FormulasView 2.vue` | **orchestrator** (coordenar consolidação) | 📌 Pendente: analisar diff e consolidar |

---

## ✅ Já resolvidos nesta sprint (14 itens)

- ~~**#3** `eval()` → evaluador seguro com regex + `new Function()` em 4 arquivos RelatorioDreView~~
- ~~**#4** `console.log` removido de `LoginView.vue:117-118` e `EmpresaView.vue:488` + auditado `cloudflareR2.js`~~
- ~~**#5** `api.js`/`apiLocal.js` → `baseURL` via `process.env.VUE_APP_API_URL` com fallback~~
- ~~**#7** `v-html` sanitizado no `PdfPreviewModal.vue:39` (função `sanitizarHTML` inline)~~
- ~~**#8** 11 ocorrências ALTO + 2 MÉDIO risco de `document.write`/`innerHTML` corrigidas com `escapeHtml()` em 7 arquivos~~
- ~~**#9** Guard de autenticação adicionado no `router.beforeEach` para rotas `/paginas/*`~~
- ~~**#10** Axios interceptor global injeta `Authorization: Bearer` em todas as chamadas~~
- ~~**#11** Content-Security-Policy adicionada no `public/index.html`~~
- ~~**#12** `vue.config.js` devServer: `0.0.0.0` → `localhost`~~
- ~~**#14** `Math.random()` → `crypto.getRandomValues()` no token de inventário~~
- ~~**#16** `.env` adicionado ao `.gitignore`~~
- ~~**#17** `.env.example` criado com todas as variáveis~~
- ~~**#18** Interceptor Axios em `api.js` e `apiLocal.js` (token automático)~~
- ~~**#19** `this.error = error` normalizado para `error?.message` em todas as stores~~

### Anteriores
- ~~**Husky deprecation** — removidas linhas deprecated do `.husky/pre-push`~~
- ~~**ESLint config** — adicionado env browser/jest, globals, ignorePatterns~~

---

## 🎯 Resumo da Estratégia de Agents

| Agente | O que fez |
|--------|-----------|
| **ui-component** | #3 eval seguro, #7 PdfPreview sanitizado, #8 document.write corrigido (7 arquivos), #11 CSP, #14 crypto.getRandomValues |
| **state-flow** | #5 api.js env vars, #9 auth guard router, #10/#18 interceptor Axios, #19 error handling stores |
| **code-reviewer** | Auditoria #8 (17 ocorrências mapeadas) |
| **testing** | Pendente: testes de regressão para correções críticas |
