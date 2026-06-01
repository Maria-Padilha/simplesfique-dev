# ADR — Architecture Decision Records

> Registro das decisões arquiteturais do SimplesFique ERP.
> Cada ADR documenta **contexto**, **decisão** e **consequências**.

---

## ADR-001: Vue 3 + Composition API + `<script setup>`

**Status:** `aceito` · **Data:** 2023

### Contexto
Escolha do framework frontend para um ERP brasileiro SPA com desktop (Electron). Precisava de ecossistema maduro, componentes de UI prontos (tabelas, formulários, modais), e boa integração com bibliotecas de gráficos e máscaras.

### Decisão
Vue 3 com Composition API exclusivamente via `<script setup>`. Proibido Options API.

### Consequências
- **Positivo**: Código mais limpo e organizado que Options API; tree-shaking nativo; melhor preparação para TypeScript futuro.
- **Negativo**: Alguns componentes legados ainda usam Options API (inconsistência); time precisa conhecer Composition API.

---

## ADR-002: Pinia para gerenciamento de estado

**Status:** `aceito` · **Data:** 2023

### Contexto
Precisava de gerenciamento de estado oficial Vue 3 com suporte a múltiplas stores de domínio, persistência e boa integração com DevTools.

### Decisão
Pinia (v3) como única biblioteca de estado. Proibido Vuex. Uso de `pinia-plugin-persistedstate` para persistência em `localStorage`.

### Consequências
- **Positivo**: API mais simples que Vuex; DevTools nativo; stores independentes por domínio; persistência declarativa.
- **Negativo**: Convivência de dois padrões — Options API stores (`state: () => ({})`) e Setup stores (`ref()/computed()`) — gera inconsistência.

---

## ADR-003: Vuetify 3 como biblioteca de componentes primária

**Status:** `aceito` · **Data:** 2023

### Contexto
ERP demanda componentes ricos: tabelas com paginação, formulários, modais, abas, diálogos. Precisava de Material Design consistente sem construir do zero.

### Decisão
Vuetify 3 como UI primária, complementado por Tailwind CSS 4 para utilitários e PrimeVue 4 para componentes específicos que Vuetify não cobre.

### Consequências
- **Positivo**: Componentes prontos para ERP (tabelas, modais, formulários); temas dark/light nativos; Tailwind acelera estilos customizados.
- **Negativo**: Três bibliotecas de UI (Vuetify + PrimeVue + Tailwind) aumentam bundle e podem conflitar; Vuetify 3 foi adotado em beta.

---

## ADR-004: Axios sem interceptors

**Status:** `aceito` · **Data:** 2023

### Contexto
Precisava de cliente HTTP para comunicação com API REST. Backend usa autenticação Bearer token por requisição.

### Decisão
Axios com instâncias separadas (`api.js` porta 9005, `apiLocal.js` porta 9010), **sem interceptors** — cada store injeta headers manualmente via `getAuthHeaders()`.

### Consequências
- **Positivo**: Simplicidade; sem magia escondida.
- **Negativo**: Código de autenticação duplicado em ~30 stores; sem tratamento global de erro; sem retry ou refresh token; URL base hardcoded.

---

## ADR-005: Vue CLI 5 (Webpack)

**Status:** `aceito` · **Data:** 2023

### Contexto
Escolha do bundler para build do Vue 3. Vite ainda era imaturo no ecossistema Vuetify quando o projeto começou.

### Decisão
Vue CLI 5 com Webpack. `vue-cli-plugin-vuetify` e `webpack-plugin-vuetify` para integração Vuetify.

### Consequências
- **Positivo**: Estável e maduro; plugins Vuetify oficiais.
- **Negativo**: HMR lento comparado a Vite; Webpack config mais verbosa; migração futura para Vite custará caro.

---

## ADR-006: Vue Router 4 com HTML5 History Mode

**Status:** `aceito` · **Data:** 2023

### Contexto
Precisava de roteamento SPA com URLs limpas. Sistema tem páginas públicas (site institucional) e autenticadas.

### Decisão
Vue Router 4 com `createWebHistory` (history mode). Rotas públicas, de auth, e do sistema em grupos separados. Lazy loading para views.

### Consequências
- **Positivo**: URLs limpas sem `#`; melhor para SEO do site institucional; lazy loading reduz bundle inicial.
- **Negativo**: Requer fallback do servidor para `index.html`; algumas views são importadas diretamente (sem lazy loading), aumentando bundle inicial.

---

## ADR-007: Electron com configuração mínima

**Status:** `aceito` · **Data:** 2023

### Contexto
ERP precisa de capacidades desktop (impressão direta, acesso a arquivos locais para XML de NF-e). Solução precisa ser leve e segura.

### Decisão
Electron como wrapper do SPA, sem IPC, sem menus nativos, sem auto-update. `contextIsolation: true`, `nodeIntegration: false`. Janela 1200x800.

### Consequências
- **Positivo**: Mesmo código web + desktop; segurança adequada; desenvolvimento simples com `concurrently` + `wait-on`.
- **Negativo**: Bundle grande (~150MB+); sem atualização automática; sem integração nativa (notificações, tray, atalhos).

---

## ADR-008: Cloudflare R2 com presigned URLs (frontend direto)

**Status:** `aceito` · **Data:** 2024

### Contexto
Sistema precisa armazenar boletos, imagens de produtos, XMLs e comprovantes. Backend não deve servir como proxy de arquivos.

### Decisão
Cloudflare R2 (S3-compatible) com presigned URLs geradas via `@aws-sdk/s3-request-presigner` no frontend. Upload direto browser → R2.

### Consequências
- **Positivo**: Zero egress fees; sem sobrecarga no backend; distribuição global via Cloudflare.
- **Negativo**: Chaves AWS compiladas no bundle JS (risco de segurança); sem progresso de upload; bundle inchado pelo SDK AWS.

---

## ADR-009: localStorage para persistência

**Status:** `aceito` · **Data:** 2023

### Contexto
Precisava persistir token de autenticação, tema (dark/light), empresa selecionada e acessos rápidos entre sessões.

### Decisão
`localStorage` via `pinia-plugin-persistedstate`. Sem IndexedDB, sessionStorage ou cookies.

### Consequências
- **Positivo**: Simples e síncrono; integração direta com Pinia persist.
- **Negativo**: Limite de 5-10MB; dados em texto puro (token visível no DevTools); bloqueia thread principal em leituras síncronas.

---

## ADR-010: JavaScript (sem TypeScript)

**Status:** `aceito` · **Data:** 2023

### Contexto
Time pequeno, foco em entrega rápida. Backend segue padrão "THorse" com formato de resposta flexível, difícil de tipar estaticamente.

### Decisão
JavaScript puro (`.js` e `.vue` com JS). Sem TypeScript, sem JSDoc types.

### Consequências
- **Positivo**: Velocidade de desenvolvimento; sem etapa de compilação.
- **Negativo**: Sem type safety — bugs de runtime frequentes; refatoração arriscada; padrão de normalização de resposta (`resp.data?.data || resp`) se repete em toda store sem verificação.

---

## ADR-011: Sem testes automatizados

**Status:** `aceito (provisório)` · **Data:** 2023

### Contexto
Foco em MVP e validação de produto com clientes reais. Time sem prática de testes estabelecida.

### Decisão
Nenhum framework de testes implementado. CLARO.md registra a intenção ("Tests required for all composables and stores") como meta, não como realidade.

### Consequências
- **Positivo**: Velocidade inicial de desenvolvimento.
- **Negativo**: Risco altíssimo de regressão; refatorações perigosas; padrão de normalização de API não verificado.

---

## ADR-012: Backend externo (API REST separada)

**Status:** `aceito` · **Data:** 2023

### Contexto
Arquitetura frontend/backend separada. Backend mantido por equipe externa.

### Decisão
Frontend Vue 3 consome API REST em `http://192.168.10.100:9005`. Sem BFF (Backend-for-Frontend). Duas instâncias Axios: `api.js` (porta 9005) e `apiLocal.js` (porta 9010).

### Consequências
- **Positivo**: Separação clara de responsabilidades; backend pode ser desenvolvido independentemente.
- **Negativo**: URL hardcoded no frontend; sem variáveis de ambiente para API URL; formato de resposta do backend varia (THorse pattern), exigindo normalização manual em toda store.

---

## ADR-013: MCP RAG para memória entre sessões (Ollama + SQLite)

**Status:** `aceito` · **Data:** 2026-06

### Contexto
Sessões de desenvolvimento com IA perdiam contexto entre conversas — decisões, correções e implementações não eram reaproveitadas.

### Decisão
Servidor MCP local com:
- SQLite via Prisma para armazenamento estruturado
- Ollama (`nomic-embed-text`) para embeddings
- Busca semântica por similaridade de cosseno
- Tools: `store_memory`, `search_memories`, `list_memories`

### Consequências
- **Positivo**: Memória persistente entre sessões; busca semântica em linguagem natural; dados privados (Ollama local).
- **Negativo**: Dependência de Ollama rodando localmente; embeddings via `localhost:11434` não portável para CI.

---

## ADR-014: Harness de contexto para desenvolvimento assistido por IA

**Status:** `aceito` · **Data:** 2026-06

### Contexto
IA consumia tokens desnecessariamente e perdia visão geral do projeto. Decisões arquiteturais estavam espalhadas no código.

### Decisão
Estrutura de engenharia de contexto:
- `@projeto/` — PROJECT_OVERVIEW.md, ARCHITECTURE.md, SPEC.md
- `.agents/` — orquestrador, code-reviewer, ui-component, state-flow
- `.skills/` — anatomia, pinia-store, novo-component, review, corrigir
- `.claudeignore` — exclusão de node_modules, dist, etc.
- `CLAUDE.md` — regras e instruções carregadas em toda sessão

### Consequências
- **Positivo**: Tokens economizados; contexto consistente; agents especializados para cada tipo de tarefa.
- **Negativo**: Manutenção contínua dos documentos; risco de desatualização entre código e docs.

---

## ADR-015: Múltiplos padrões de store Pinia coexistem

**Status:** `aceito (contraditório)` · **Data:** 2023

### Contexto
CLAUDE.md determina "Composition API only", mas as stores foram criadas em momentos diferentes por pessoas diferentes.

### Decisão
Dois padrões coexistem:
1. **Options API store** (`defineStore('id', { state: () => ({...}), actions: {...} })`) — maioria das stores de domínio
2. **Setup store** (`defineStore('id', () => { const dados = ref([]); ... return { dados } })`) — stores mais novas (site, theme, r2, Sidebar)

### Consequências
- **Positivo**: Flexibilidade para o desenvolvedor escolher o padrão.
- **Negativo**: Inconsistência; contradiz CLAUDE.md; dificulta manutenção e revisão automatizada.

---

## Apêndice A: Decisões em Aberto

| ID | Decisão | Impacto |
|----|---------|---------|
| PEND-001 | Suporte offline para PDV | Viabilidade técnica complexa, sem decisão tomada |
| PEND-002 | App mobile nativo vs. SPA responsivo + Electron | Impacta roteiro de produto |
| PEND-003 | Migração para Vite | Performance de desenvolvimento, mas custo de migração |
| PEND-004 | Adoção de TypeScript | Type safety vs. custo de migração de ~400+ arquivos |
| PEND-005 | Testes (framework e cobertura mínima) | Qualidade vs. velocidade |
| PEND-006 | Axios interceptors para auth global | Eliminaria duplicação em ~30 stores |
| PEND-007 | URL da API via variável de ambiente | Essencial para deploy em produção |

---

## Apêndice B: Como Propor um Novo ADR

1. Crie um novo arquivo ou adicione ao final deste com:
   - Número sequencial (ADR-016)
   - Título descritivo
   - Status: `proposto` → `aceito` | `rejeitado` | `substituido`
   - Contexto, Decisão, Consequências
2. Submeta para revisão do time
3. Uma vez aceito, implemente e atualize o código conforme necessário
