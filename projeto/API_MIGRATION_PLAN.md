# Plano de Migração — API THorse → PHP (Laravel)

> **Contexto:** Migração das APIs do backend THorse (porta 9005) para o novo backend PHP/Laravel (porta 8000).
> A nova API segue o padrão `/api/v1/{modulo}/{recurso}` com JWT auth e claims `id_saas` + `id_empresa` extraídos automaticamente do token.

---

## Status Atual da Migração (Junho/2026)

| Métrica | Total |
|---------|-------|
| Stores existentes | 23 |
| 100% migradas (só `apiPhp`) | 20 (87%) |
| Parcialmente migradas (`api` + `apiPhp`) | 1 (4%) |
| 100% THorse | 0 |
| `import api` removido | dashboard, vendas, produtos, inventario, estoque, adiantamento, financeiro |

### ✅ 100% Migradas (20 stores)
`acesso`, `adiantamento`, `agenda`, `agendacontato`, `caixa`, `ccusto`, `config`, `dashboard`, `dre`, `empresa`, `financeiro`, `grupousuario`, `integracoes`, `inventario`, `localizacao`, `pais`, `pessoas`, `produtos`, `transfalmox`, `vendas`

### ✅ 100% Migradas — Nova adição (4 stores)

| Store | Calls migradas | Endpoints PHP |
|-------|----------------|---------------|
| `dashboard.js` | 5 calls THorse → removidas (dead code) | `/financeiro/dashboard-financeiro` já existia |
| `vendas.js` | 4 calls → `apiPhp` | `/vendas/ambientes`, `/admin/terminais-venda/{id}/ambientes`, `/admin/terminais-venda-ambientes/{id}` |
| `produtos.js` | 3 calls → `apiPhp` | `/estoque/medidas`, `/estoque/produto-fotos/{id}` |
| `inventario.js` | 1 call → `apiPhp` | `/estoque/produto-almoxarifados/{emp}/{almox}/{prod}` |

### ⚠️ Parcialmente Migradas — THorse calls restantes (1 store)

| Store | Calls THorse | O que falta |
|-------|-------------|-------------|
| `estoque.js` | CRUD via `executarAcao` (cest, nbs, cfop, aliquotauf) | Ainda usa THorse — endpoints PHP não mapeados |

### 🔴 Bloqueios (sem equivalente PHP)
- **Medidas** — PHP só tem POST (criação), sem GET para listagem/busca
- **Fotos de produto** — PHP só tem GET/PUT/DELETE por ID específico, sem listagem por produto
- **Alíquotas por UF** — PHP precisa de CFOP na URL (estrutura diferente)
- **Ambientes standalone** — PHP só tem como sub-recurso de terminal
- **Proalmox** — endpoint não existe no PHP

> 📌 Issue #293 no kanban para acompanhamento dos endpoints faltantes.

---

## Mudanças Estruturais Importantes

| Item | THorse (atual) | PHP (novo) | Impacto |
|------|---------------|------------|---------|
| **Base URL** | `http://192.168.10.100:9005` | `http://192.168.10.67:8000` (dev) | `src/services/apiPhp.js` |
| **Prefixo** | Sem prefixo | `/api/v1` | Todas as rotas |
| **Autenticação** | Bearer token manual | JWT (Bearer) com interceptors | `apiPhp.js` já trata |
| **id_empresa** | Passado na URL/body | Extraído do JWT claim | Remover de payloads |
| **LGPD** | Sem mascaramento | Mascaramento em listagens | Adaptar masks no frontend |
| **Payload** | `{ data: [{ campo: valor }] }` (Delphi wrapper) | Flat `{ campo: valor }` | **Principal causa de 422** |
| **Parcelas** | API separada para cálculos | Geradas automaticamente no CRUD | Remover `calcparc` |
| **Sub-recursos** | Arrays junto no payload (`parcela`, `ccusto`, `chavepix`) | Endpoints separados | Desacoplar por chamada |
| **Datas** | Vários formatos | ISO (`YYYY-MM-DD`) | Normalizar |

---

## Etapas de Migração

### Etapa 0 — Infraestrutura e Setup ✅ CONCLUÍDA

**0.1** Criado `src/services/apiPhp.js` com:
- Base URL: `http://192.168.10.67:8000/api/v1`
- Interceptor para Bearer token automático
- Interceptor para 401 (redirect login)
- Interceptor para normalizar 422 (2 formatos)
- Interceptor para unwrap paginação `{ data, current_page, per_page, total }`
- Debug logging

**0.2** Store base `src/stores/APIs/api.js` atualizada com suporte híbrido (THorse + PHP via flag)

**Arquivos afetados:** `src/services/apiPhp.js`, `src/services/api.js`, `src/stores/APIs/api.js`

---

### Etapa 1 — Autenticação e Onboarding ❌ NÃO INICIADA

**1.1** Substituir fluxo de login (`LoginView.vue`)
| THorse (atual) | PHP (novo) |
|---------------|------------|
| `POST /login` | `POST /api/v1/auth/login` |
| `GET /empsaas` (router guard) | `GET /api/v1/auth/me` |

**1.2** Logout
| THorse | PHP |
|--------|-----|
| _Não existia_ | `POST /api/v1/auth/logout` |

**1.3** Onboarding SAAS
| THorse | PHP |
|--------|-----|
| _Não existia_ | `POST /api/v1/saas` |
| _Não existia_ | `POST /api/v1/auth/registrar` |

**Views afetadas:** `src/views/auth/LoginView.vue`, `src/views/auth/EmpresaView.vue`, `src/router/index.js`

---

### Etapa 2 — Tabelas Auxiliares / Manutenção ✅ CONCLUÍDA

**2.1** Países, UFs, Cidades, Bairros → `localizacao.js`, `pais.js` ✅
**2.2** CFOP, NCM, CEST, NBS → `estoque.js` (parcial, via `apiPhp`) ✅

**Observação:** `/aliquotauf/{emp}` ainda está no THorse (bloqueado — não documentado na API PHP).

---

### Etapa 3 — Módulo Financeiro

**3.1** Bancos, Agências, Conta Corrente ✅ PARCIALMENTE CONCLUÍDA
| THorse | PHP | Status |
|--------|-----|--------|
| `GET /banco` | `GET /api/v1/financeiro/bancos/{id}` | ✅ apiPhp |
| `GET /agencia` | `GET /api/v1/financeiro/agencias` | ✅ apiPhp |
| `POST /agencia` | `POST /api/v1/financeiro/agencias` | ✅ apiPhp |
| `GET /ccorrente` | `GET /api/v1/financeiro/contas-correntes` | ✅ apiPhp |
| `GET /ccorrentemov` | `GET /api/v1/financeiro/conta-corrente-movimentos` | ✅ apiPhp |

**3.2** Planos de Conta, Centro de Custo ✅ PARCIALMENTE CONCLUÍDA
| THorse | PHP | Status |
|--------|-----|--------|
| `GET /planoconta` | `GET /api/v1/financeiro/plano-contas` | ✅ apiPhp |
| `GET /ccusto` | `GET /api/v1/financeiro/centro-custos` | ✅ apiPhp |
| `GET /tipodocumento` | `GET /api/v1/financeiro/tipo-documentos` | ✅ apiPhp |
| `GET /localcobranca` | `GET /api/v1/financeiro/local-cobrancas` | ✅ apiPhp |

> ⚠️ Muitos endpoints individuais (`GET/PUT/DELETE /{id}`) podem não ter sido migrados — verificar cada store.

**3.3** Caixas e Movimentos ✅ CONCLUÍDA (`caixa.js` 100% apiPhp)

**3.4** Contas a Pagar ✅ PARCIALMENTE CONCLUÍDA
| THorse | PHP | Status |
|--------|-----|--------|
| `GET /contaspagar` | `GET /api/v1/financeiro/conta-pagars` | ✅ apiPhp |
| `GET /parfinpag` | `GET /api/v1/financeiro/parcela-pagars` | ✅ apiPhp |
| `POST /contaspagarbxa` | `POST /api/v1/financeiro/baixa-pagars` | ✅ apiPhp |
| `POST /contaspagar/autorizar` | `POST /api/v1/financeiro/conta-pagars/autorizar` | ✅ Migrado |

**3.5** Contas a Receber ✅ PARCIALMENTE CONCLUÍDA
| THorse | PHP | Status |
|--------|-----|--------|
| `GET /contasreceber` | `GET /api/v1/financeiro/conta-recebers` | ✅ apiPhp |
| `GET /parfinrec` | `GET /api/v1/financeiro/parcela-recebers` | ✅ apiPhp |
| `POST /contasreceberbxa` | `POST /api/v1/financeiro/baixa-recebers` | ✅ apiPhp |

**3.6** DRE ✅ CONCLUÍDA (`dre.js` 100% apiPhp)

> ⚠️ Estrutura é diferente do THorse (3 níveis: DRE → Detalhes → Contas de Detalhe). Verificar schemas OpenAPI.

**3.7** Adiantamentos (Clientes, Colaboradores, Fornecedores) ✅ CONCLUÍDA

| THorse | PHP | Status |
|--------|-----|--------|
| CRUD `/adtcliente` | `GET/POST /api/v1/financeiro/adiantamento-clientes` | ✅ apiPhp |
| CRUD `/adtcolabo` | `GET/POST /api/v1/financeiro/adiantamento-colaboradors` | ✅ apiPhp |
| CRUD `/adtfornecedor` | `GET/POST /api/v1/financeiro/adiantamento-fornecedors` | ✅ apiPhp |
| `PUT /adtfornecedorpagto/{id}` | `POST /api/v1/financeiro/adiantamento-fornecedors/{id}/pagar` | ✅ Migrado |
| `PUT /adtfornecedoraprova/{id}` | `POST /api/v1/financeiro/adiantamento-fornecedors/{id}/aprovar` | ✅ Migrado |
| `PUT /adtfornecedornega/{id}` | `POST /api/v1/financeiro/adiantamento-fornecedors/{id}/recusar` | ✅ Migrado |

**3.8** Parâmetros Financeiros ✅ CONCLUÍDA (via `config.js` — 100% apiPhp)

**3.9** Transferências e Boletos ✅ CONCLUÍDA
| THorse | PHP | Status |
|--------|-----|--------|
| `GET /transffinanceiras/{emp}/dtini/{i}/dtfim/{f}` | `GET /api/v1/financeiro/conta-corrente-caixa-transfs/{emp}/dtini/{i}/dtfim/{f}` | ✅ Migrado |
| `POST /ccorrentetransf` | `POST /api/v1/financeiro/conta-corrente-caixa-transfs` | ✅ apiPhp |
| `POST /bolregistro` | `POST /api/v1/financeiro/boletos/registrar` | ✅ apiPhp |
| `POST /bolnossonumero` | `POST /api/v1/financeiro/boletos/nosso-numero` | ✅ apiPhp |

**Arquivos afetados:** `src/stores/APIs/financeiro.js`, `src/stores/APIs/caixa.js`, `src/stores/APIs/ccusto.js`, `src/stores/APIs/config.js`, `src/stores/APIs/dre.js`, `src/stores/APIs/dashboard.js`, `src/stores/APIs/adiantamento.js`

---

### Etapa 4 — Módulo Estoque e Produtos

**4.1** Produtos (CRUD) ✅ PARCIALMENTE CONCLUÍDA
| THorse | PHP | Status |
|--------|-----|--------|
| `GET /produto` | `GET /api/v1/estoque/produtos` | ✅ apiPhp |
| `POST /produto` | `POST /api/v1/estoque/produtos` | ✅ apiPhp |
| `GET /medida` | _(não documentado)_ | 🔴 THorse |
| `GET /profoto/{idProduto}` | _(não documentado)_ | 🔴 THorse |
| `DELETE /profoto/{id}` | _(não documentado)_ | 🔴 THorse |

**4.2** Tabelas de Apoio ✅ PARCIALMENTE CONCLUÍDA
| THorse | PHP | Status |
|--------|-----|--------|
| `GET /marca` | `GET /api/v1/estoque/marcas` | ✅ apiPhp |
| `GET /garantia` | `GET /api/v1/estoque/garantias` | ✅ apiPhp |
| `GET /cor` | `GET /api/v1/estoque/cors` | ✅ apiPhp |
| `GET /classe` | `GET /api/v1/estoque/classes` | ✅ apiPhp |
| `GET /grupo` | `GET /api/v1/estoque/grupos` | ✅ apiPhp |
| `GET /almoxarifado` | `GET /api/v1/estoque/almoxarifados` | ✅ apiPhp |
| `GET /localizacao` | `GET /api/v1/estoque/localizacoes` | ✅ apiPhp (via `localizacao.js`) |
| `GET /aliquotauf/{emp}` | _(não documentado)_ | 🔴 THorse |

**4.3** Grade, Embalagens, Fornecedores, Similares, Preços, Kits ✅ PARCIALMENTE CONCLUÍDA
- Endpoints migrados para `apiPhp` em `produtos.js`
- Estrutura mudou: recursos são raiz (não nested em `/produtos/{id}/`)

**4.4** Entradas DFe, Devoluções ✅ PARCIALMENTE CONCLUÍDA
- CRUD de entrada e devolução via `apiPhp` em `produtos.js`

**4.5** Inventário ✅ PARCIALMENTE CONCLUÍDA
| THorse | PHP | Status |
|--------|-----|--------|
| CRUD `/inventario` | `GET/POST /api/v1/estoque/inventarios` | ✅ apiPhp |
| `/inventarioitem` | `GET/POST /api/v1/estoque/inventario-itens` | ✅ apiPhp |
| `GET /proalmox/{emp}/{almox}/{prod}` | _(não documentado)_ | 🔴 THorse |

**4.6** Transferência entre Almoxarifados ✅ CONCLUÍDA (`transfalmox.js` 100% apiPhp)

**4.7** Fórmulas ✅ CONCLUÍDA (via `estoque.js` + `apiPhp`)
| THorse | PHP | Status |
|--------|-----|--------|
| `GET /formula` | `GET /api/v1/manutencao/formulas` | ✅ apiPhp |
| `POST /formula/valida` | `POST /api/v1/manutencao/formulas/{id}/validar` | ✅ apiPhp |
| _Novo_ | `POST /api/v1/manutencao/formulas/{id}/compilar` | ✅ apiPhp |

**Arquivos afetados:** `src/stores/APIs/produtos.js`, `src/stores/APIs/estoque.js`, `src/stores/APIs/inventario.js`, `src/stores/APIs/transfalmox.js`

---

### Etapa 5 — Módulo Pessoas, Empresa, Usuários ✅ CONCLUÍDA

**5.1** Pessoas → `pessoas.js` 100% apiPhp ✅
**5.2** Empresas → `empresa.js` 100% apiPhp ✅
**5.3** Usuários, Grupos → `acesso.js`, `grupousuario.js` 100% apiPhp ✅

**Arquivos afetados:** `src/stores/APIs/pessoas.js`, `src/stores/APIs/empresa.js`, `src/stores/APIs/acesso.js`, `src/stores/APIs/grupousuario.js`

---

### Etapa 6 — Módulo de Vendas e PDV ⚠️ PARCIAL

**6.1** Tabelas de Apoio de Vendas
| THorse | PHP | Status |
|--------|-----|--------|
| CRUD `/mpo` (motivo perda orçamento) | `GET/POST /api/v1/vendas/motivo-perda-orcamentos` | ✅ apiPhp |
| CRUD `/terminalven` | `GET/POST /api/v1/vendas/terminista-vendas` | ✅ apiPhp |
| CRUD `/ambiente` | _(não documentado — estrutura diferente)_ | 🔴 THorse |

**6.2** Cupom Fiscal (PDV/Totem)
| THorse | PHP | Status |
|--------|-----|--------|
| _Não mapeado_ | `GET/POST /api/v1/vendas/cupom-fiscal` | ✅ apiPhp |
| _Não mapeado_ | `POST /api/v1/vendas/cupom-fiscal/calcular` | ✅ apiPhp |
| _Não mapeado_ | `POST /api/v1/vendas/cupom-fiscal/emitir` | ✅ apiPhp |

**Arquivos afetados:** `src/stores/APIs/vendas.js`, `src/views/pages/pdv/`, `src/views/pages/vendas/`

---

### Etapa 7 — Módulo de Integrações, Agenda, Contatos ✅ CONCLUÍDA

**7.1** Integrações → `integracoes.js` 100% apiPhp ✅
**7.2** Agenda, Contatos → `agenda.js`, `agendacontato.js` 100% apiPhp ✅
**7.3** Mensagens → `config.js` (via apiPhp) ✅
**7.4** Certificados Digitais → `produtos.js` (via apiPhp) ✅

**Arquivos afetados:** `src/stores/APIs/integracoes.js`, `src/stores/APIs/agenda.js`, `src/stores/APIs/agendacontato.js`

---

### Etapa 8 — Dashboard 🔴 AGUARDANDO BACKEND

> Nenhum endpoint de dashboard foi implementado no backend PHP.
> `dashboard.js` ainda usa 100% THorse para seus 5 endpoints.

| THorse | PHP | Status |
|--------|-----|--------|
| `GET /pagarreceber/{idempresa}` | _(não implementado)_ | 🔴 Bloqueado |
| `GET /saldosbancario/{idempresa}` | _(não implementado)_ | 🔴 Bloqueado |
| `GET /fluxocaixamensal/{idempresa}` | _(não implementado)_ | 🔴 Bloqueado |
| `GET /fluxocaixadiario/{idempresa}` | _(não implementado)_ | 🔴 Bloqueado |
| `GET /pagrecdocloc/{idempresa}` | _(não implementado)_ | 🔴 Bloqueado |

---

### Etapa 9 — Remover THorse e Limpeza ❌ NÃO INICIADA

**9.1** Remover `api.js` (THorse) + `apiLocal.js`
**9.2** Renomear `apiPhp.js` → `api.js`
**9.3** Limpar stores (remover import `api` onde só tem `apiPhp`)
**9.4** Remover `getAuthHeaders()` das stores restantes
**9.5** Testar integração completa

---

## Problema Crítico: Payload Delphi-style vs Flat

### Diagnóstico
O **maior gargalo** da migração não é trocar a URL, mas **corrigir o formato dos payloads**. Muitas views ainda enviam `{ data: [{ campo: valor }] }` (formato Delphi/THorse) que o Laravel rejeita com 422.

### Stores que ainda precisam de correção de payload
| Store | Métodos afetados |
|-------|-----------------|
| `vendas.js` | `criarAmbiente`, `atualizarAmbiente` (THorse — diferentes estruturas) |
| `transfalmox.js` | `criarEnvio`, `criarRec` |

### Views que enviam Delphi wrapper (precisam refatorar)
Ver `@projeto/PAYLOAD_MIGRATION_PLAN.md` para lista completa (~36 views em 6 fases).

### Regra de ouro
```js
// ❌ QUEBRADO — Laravel rejeita com 422
const payload = { data: [{ campo1: valor1 }], parcela: [] }

// ✅ FUNCIONA
const payload = { campo1: valor1 }
```

---

## Estratégia de Migração

### Abordagem: Híbrida (coexistência THorse + PHP)

1. **Já concluído:** 16 stores 100% PHP, infraestrutura híbrida pronta
2. **Próximo passo:** Cobrar backend pelos 5 endpoints que faltam (medidas list, profoto list, aliquotauf search, proalmox, ambientes standalone)
3. **Paralelo:** Corrigir payloads Delphi nas views (fases do PAYLOAD_MIGRATION_PLAN)
4. **Cleanup:** Remover THorse (Etapa 9) — só quando tudo estiver migrado

### Prioridade Imediata
1. Resolver bloqueios de payload (fonte dos 422)
2. Cobrar backend pelos endpoints listados na issue #293
3. Remover código THorse morto das stores 100% migradas

---

## Riscos

| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| **Payload Delphi-style** | 422 em POST/PUT | Refatorar views (PAYLOAD_MIGRATION_PLAN) |
| **id_empresa removido mas endpoint exige** | 422 | Verificar schema OpenAPI |
| **Mascaramento LGPD** | Listagens com dados parciais | Adaptar máscaras |
| **2 formatos de erro 422** | Validadores quebram | `apiPhp.js` já trata |
| **Parcelas automáticas** | Fluxo diferente | Remover `calcparc` |
| **Nomes de campos diferentes** | Payloads incompatíveis | Mapear campos |
| **Dashboard** | Teve que adaptar dados (THorse tinha 5 endpoints, PHP tem 1 consolidado) | Já resolvido — `carregarDadosDashboard` mapeia resposta |
| **Medidas sem listagem** | Autocomplete de medidas quebrado | Cobrar backend — issue #293 |
| **Profoto sem listagem** | Galeria de fotos do produto quebrada | Cobrar backend — issue #293 |
| **Proalmox** | Consulta estoque por almoxarifado quebrada | Cobrar backend — issue #293 |
| **Ambientes standalone** | PDV/Totem sem gerenciamento de ambientes | Cobrar backend — issue #293 |
| **Aliquotauf search** | Busca de alíquotas por UF sem CFOP | Cobrar backend — issue #293 |

---

## Convenções da Nova API

- URL base: `/api/v1/`
- Auth: `Authorization: Bearer {token}`
- Paginação: `?page=1&per_page=15`
- Filtros: query params
- Soft delete: `DELETE` marca inativo
- Datas: ISO (`2024-01-10T08:00:00.000000Z`)
- Padrão de resposta:
  - Listagem: `{ "data": [...], "current_page", "per_page", "total" }`
  - Single: objeto direto
  - Erro 422: `{ "message": "...", "errors": { "campo": ["msg"] } }` ou `{ "erro": "..." }`
- Status: `ativo` = `'S'` / `'N'`, `situacao` = `'A'` / `'C'`
