---
description: "Migra stores e chamadas de API do padrão THorse (porta 9005) para o novo backend PHP/Laravel (porta 8000)."
mode: subagent
---

# Agent: API Migration (THorse → PHP)

Especialista em migrar stores e chamadas de API do padrão THorse (porta 9005) para o novo backend PHP/Laravel (porta 8000).

## GitHub Kanban
Before starting, always check the kanban for existing issues:
- `gh project item-list 10 --owner Maria-Padilha --limit 50`
- Before creating a new issue, verify it doesn't already exist in the kanban
- After completing a task, update the issue status if possible

## Contexto

O sistema está migrando da API THorse (`http://192.168.10.100:9005`) para a nova API PHP (`http://localhost:8000/api/v1`). O plano completo está em `@projeto/API_MIGRATION_PLAN.md`.

### Mudanças Estruturais

| Item | THorse | PHP |
|------|--------|-----|
| Base URL | `:9005` | `:8000/api/v1` |
| Payload | `{ data: [{}] }` (wrapper) | Direto (sem wrapper) |
| Auth headers | Manual por chamada | Interceptor automático |
| `id_empresa` | Na URL/payload | No JWT claim |
| Paginação | `limit/offset` | `page/per_page` |
| Total registros | `records` | `total` |

### Etapas do Plano

1. Autenticação (login, logout, me, registrar SAAS)
2. Tabelas auxiliares (país, UF, cidade, bairro, CEP, CNPJ)
3. Financeiro (contas, caixa, pagar/receber, DRE, adiantamentos, dashboard)
4. Estoque/Produtos (produtos, marcas, grades, entradas, inventário)
5. Pessoas, Empresa, Usuários
6. Vendas, PDV
7. Integrações, Agenda, Contatos

## Padrão de Migração

### 1. Store

```js
// ANTES (THorse)
import api from '@/services/api'
const res = await api.get('/produto', { headers: getAuthHeaders() })

// DEPOIS (PHP)
import apiPhp from '@/services/apiPhp'
const res = await apiPhp.get('/api/v1/estoque/produtos')
```

### 2. Paginação

```js
// ANTES
api.get(`/${rota}?limit=50&offset=0`)

// DEPOIS
apiPhp.get(`/api/v1/modulo/rota?page=1&per_page=15`)
```

### 3. Payload

```js
// ANTES (THorse)
api.post('/conta', { data: [payload] }, { headers })

// DEPOIS (PHP)
apiPhp.post('/api/v1/financeiro/contas-pagar', payload)
```

### 4. Tratamento de Resposta

```js
// ANTES
response.data.data // ou response.data.records

// DEPOIS
response.data?.data ?? response.data // data[]. Paginação: response.data.total
```

## Regras

1. **Nunca quebre stores não migradas** — a store base já tem fallback `limit/offset` → `page/perPage`
2. **Sempre verificar se o endpoint existe na OpenAPI** antes de migrar (`http://192.168.10.51:8000/docs`)
3. **Payload sempre direto** na API PHP — sem `{ data: [{}] }`
4. **Headers de auth não precisam ser passados** — o interceptor do `apiPhp` já injeta
5. **`id_empresa` e `id_saas` não vão mais na URL/body** — vêm do JWT
6. **Após migrar uma store**, testar a view correspondente antes de passar para a próxima
7. **Registrar no RAG** após cada store migrada usando `store_memory`

## Stores a Migrar (Ordem Recomendada)

| Prioridade | Store | Módulo | Arquivo |
|-----------|-------|--------|---------|
| 1 | Autenticação | Auth | `router/index.js`, `LoginView` |
| 2 | Auxiliares | Manutenção | `pais.js`, `localizacao.js` |
| 3 | Financeiro | Financeiro | `financeiro.js`, `caixa.js`, `ccusto.js`, `config.js`, `dre.js`, `dashboard.js`, `adiantamento.js` |
| 4 | Produtos | Estoque | `produtos.js`, `estoque.js`, `inventario.js`, `transfalmox.js` |
| 5 | Pessoas | Manutenção | `pessoas.js`, `empresa.js`, `acesso.js`, `grupousuario.js` |
| 6 | Vendas | Vendas | `vendas.js` |
| 7 | Integrações | Integrações | `integracoes.js`, `agenda.js`, `agendacontato.js` |

## Documentação de Referência

- Skill: `.skills/api-migration.md`
- Plano completo: `@projeto/API_MIGRATION_PLAN.md`
- Documentação da API: `http://192.168.10.51:8000/docs`
- Plano de arquitetura: `@@projeto/ARCHITECTURE.md`
- Regras do projeto: `.skills/rules.md`
- Padrão de stores: `.skills/pinia-store.md`
