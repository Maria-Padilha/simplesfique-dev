# Plano de Migração — Payloads Delphi/THorse → Laravel

> **Problema:** O frontend envia payloads no formato Delphi/THorse `{ data: [ {...} ] }`, mas o backend Laravel espera objetos **flat** (diretos). Isso impede que POST/PUT funcionem: os `Form Request` do Laravel não encontram os campos dentro de `data[0]`.

---

## 1. Os Dois Formatos

### Formato Delphi/THorse (ATUAL — está quebrado)
```json
{
  "data": [
    {
      "numero_ccorrente": 12345,
      "titular": "Empresa"
    }
  ],
  "chavepix": [
    { "tipochavepix": 0, "chavepix": "" }
  ],
  "parcela": [],
  "ccusto": [],
  "media": []
}
```

### Formato Laravel (ESPERADO — funciona)
```json
{
  "numero_ccorrente": 12345,
  "titular": "Empresa",
  "id_banco": 1,
  "id_agencia": 1,
  "limite": 5000.00,
  "dtabertura": "2020-01-15"
}
```

### Principais diferenças

| Característica | Delphi/THorse | Laravel |
|---|---|---|
| Estrutura | `{ data: [ { campos } ], subarrays }` | Flat `{ campos }` |
| `id_empresa` | Enviado manualmente no payload | Extraído do JWT automaticamente |
| `id_saas` | Enviado manualmente | Extraído do JWT automaticamente |
| Arrays relacionados | Junto no mesmo payload (`chavepix`, `parcela`, `ccusto`) | Endpoints separados ou estrutura própria |
| Datas | Vários formatos | `YYYY-MM-DD` |
| Campos nulos | Envia string vazia `""` | Omite ou envia `null` |
| Moeda | String `"5000"` | Number `5000.00` |

---

## 2. O Que Foi Confirmado nos Testes

### POST com flat payload → FUNCIONA ✅
```bash
curl -X POST /api/v1/financeiro/conta-correntes \
  -d '{"numero_ccorrente":"7777","titular":"Teste","id_banco":1,"id_agencia":1,"dtabertura":"2026-06-17"}'
# → 201 Created (rejeitou só por campos obrigatórios extras, mas entendeu o formato)
```

### POST com Delphi wrapper → QUEBRADO ❌
```bash
curl -X POST /api/v1/financeiro/conta-correntes \
  -d '{"data":[{"numero_ccorrente":"8888",...}],"chavepix":[]}'
# → 422: "numero_ccorrente é obrigatório" (não encontrou o campo dentro de data[0])
```

### Schemas OpenAPI confirmam flat ✅
- `CriarCCorrenteRequest`: `{ numero_ccorrente, titular, id_banco, id_agencia, ... }` — **flat**
- `CriarPlanoContaRequest`: `{ id_classificador, descconta, tipo_conta, ... }` — **flat**
- `CriarCaixaRequest`, `CriarContaPagarRequest`, etc. — todos **flat**

---

## 3. Stores Que Já Estão Corretas (Flat — NÃO PRECISAM DE ALTERAÇÃO)

Estas stores já enviam payload flat diretamente via `apiPhp.post()`:

| Store | Status | Observação |
|-------|--------|------------|
| `caixa.js` | ✅ OK | Já envia flat |
| `config.js` | ✅ OK | Já normaliza do Delphi para flat |
| `pessoas.js` | ✅ OK | Já envia flat |
| `produtos.js` | ✅ OK | Maioria flat |
| `estoque.js` | ✅ OK | Todos flat |
| `empresa.js` | ✅ OK | Flat |
| `ccusto.js` | ✅ OK | Flat |
| `inventario.js` | ✅ OK | Flat |
| `agenda.js` | ✅ OK | Flat |
| `financeiro.js` | ✅ OK | Métodos migrados já são flat |
| `integracoes.js` | ✅ OK | Flat |
| `grupousuario.js` | ✅ OK | Flat |
| `acesso.js` | ✅ OK | Flat |
| `localizacao.js` | ✅ OK | Flat |

---

## 4. Stores Que Ainda Usam THorse `api` (Wrapper Delphi)

| Store | Métodos | Payload | Destino |
|-------|---------|---------|---------|
| `vendas.js` | `criarMpo`, `atualizarMpo`, `criarTerminal`, `atualizarTerminal`, `criarAmbiente`, `atualizarAmbiente` | `{ data: [data] }` | Migrar para `apiPhp` + flat |
| `adiantamento.js` | Métodos que usam `api` (THorse) | `{ data: [data] }` | Migrar para `apiPhp` + flat |
| `transfalmox.js` | `criarEnvio`, `criarRec` | `{ data: [data] }` | Migrar para `apiPhp` + flat |

---

## 5. Views Que Precisam Ser Modificadas

### FASE 1 — Financeiro Core (7 views, PRIORIDADE MÁXIMA)

| View | Linhas | O que mudar |
|------|--------|-------------|
| `ContaCorrenteView.vue` | 1080, 1483 | Remover `{ data: [data], chavepix: [...] }` → enviar `data` direto |
| `PagarView.vue` | 2531 | Remover `{ data: [dadosPrincipais], ... }` → flat |
| `ReceberView.vue` | 1812 | Remover `{ data: [dadosPrincipais], ... }` → flat |
| `MovimentacaoView.vue` | 1265 | Remover `{ data: [{...}] }` → flat |
| `LancCaixaView.vue` | 1327 | Remover `{ data: [{...}] }` → flat |
| `AberCaixaView.vue` | 498 | Remover `{ data: [{...}] }` → flat |
| `LancamentoColabView.vue` | 942 | Remover `{ data: [{...}] }` → flat |

### FASE 2 — Produtos (10 views)

| View | Ocorrências | Complexidade |
|------|-------------|-------------|
| `ProdutosDetalhesView.vue` | ~10 | Alta (muitos subarrays) |
| `ProdutosView.vue` | 3 | Média |
| `ProdutoGradeView.vue` | 3 | Média |
| `EntradaDfeNovaView.vue` | 3 | Alta (payloads aninhados) |
| `DevolucaoEntradaNovaView.vue` | 1 | Média |
| `ImportarProdutoView.vue` | 1 | Média |
| `ProdutosLocalView.vue` | 2 | Baixa |

### FASE 3 — Estoque (9 views)

| View | Ocorrências | Complexidade |
|------|-------------|-------------|
| `GruposView.vue` | 4 | Média |
| `ClassesView.vue` | 2 | Baixa |
| `AliquotaUfView.vue` | 1 | Média |
| `FormulaView.vue` | 2 | Baixa |
| `CestView.vue` | 2 | Média |
| `TransfAlmoxView.vue` | 2 | Alta |
| `InventarioView.vue` | 1 | Baixa |
| `GrupoTributacaoView.vue` | 2 | Baixa |

### FASE 4 — Adiantamento + Vendas

| View | Ocorrências | Observação |
|------|-------------|------------|
| `AdiantamentoClienteView.vue` | 1 | Store ainda usa THorse |
| `AdiantamentoFornecedorView.vue` | 1 | Store ainda usa THorse |
| `AmbienteView.vue` | 1 | Store ainda usa THorse |

### FASE 5 — Manutenção/Config

| View | Ocorrências | Observação |
|------|-------------|------------|
| `UsuariosView.vue` | 2 | Baixa complexidade |
| `MensagensView.vue` | 2 | Baixa complexidade |
| `DreView.vue` | 1 | Média complexidade |
| `DreView 2.vue` | 1 | Média (arquivo duplicado, verificar) |

---

## 6. Estratégia de Migração

### Regra geral para cada view

**ANTES (Delphi):**
```js
const payload = {
  data: [{
    campo1: valor1,
    campo2: valor2
  }],
  parcela: [],
  ccusto: []
}
await store.criarAlgo(payload)
```

**DEPOIS (Laravel):**
```js
const payload = {
  campo1: valor1,
  campo2: valor2
  // parcela e ccusto vão em chamadas separadas ou via nova estrutura
}
await store.criarAlgo(payload)
```

### Tratamento de arrays relacionados (`parcela`, `ccusto`, `chavepix`, `media`)

No formato Delphi, os arrays relacionados vinham junto no mesmo payload:
```json
{
  "data": [{ "id_empresa": 1, ... }],
  "parcela": [{ "vlrparcela": 100, "dtvencimento": "2026-01-01" }],
  "ccusto": [{ "id_ccusto": 5, "percentual": 100 }]
}
```

No Laravel, esses arrays PRECISAM ser verificados caso a caso:
1. **Se o endpoint aceita arrays embutidos** → enviar como campos do objeto principal
2. **Se exige endpoints separados** → criar chamadas adicionais após o POST principal
3. **Se o controller espera num formato específico** → consultar OpenAPI para o schema exato

**Regra prática:** consultar o schema `Criar*Request` no OpenAPI (`/docs/openapi.yaml`) para cada endpoint antes de migrar. O schema mostra exatamente quais campos o Laravel aceita.

### Tratamento de `id_empresa`

- **ANTES:** enviado manualmente em cada payload (`id_empresa: 1`)
- **DEPOIS:** **remover do payload** — o JWT já contém `id_empresa` e `id_saas`, extraídos automaticamente pelo backend
- Exceção: se o schema OpenAPI listar `id_empresa` como `required`, manter no payload

---

## 7. Riscos e Cuidados

| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| Payload muito diferente do esperado | 422 Validation Error | Consultar sempre o schema OpenAPI antes |
| Datas em formato errado | 422 ou dado incorreto | Usar sempre `YYYY-MM-DD` |
| Campo que era enviado como string vazia `""` | Violação de NOT NULL | Enviar `null` ou omitir |
| Arrays relacionados removidos | Sub-recursos não criados | Criar chamadas separadas ou confirmar com backend |
| `id_empresa` removido mas endpoint exige | 422 | Manter se schema OpenAPI listar como required |

---

## 8. Como testar cada endpoint

```bash
# 1. Fazer POST com flat payload (formato Laravel)
curl -X POST http://192.168.10.51:8000/api/v1/financeiro/conta-correntes \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"numero_ccorrente":"9999","titular":"Teste","id_banco":1,"id_agencia":1,"dtabertura":"2026-06-17"}'

# 2. Verificar se retorna 201 (criado) ou 422 com erros de validação
# 3. Se 422, ler a mensagem para ajustar campos
# 4. Se 201, confirmar com GET que o registro foi criado
```

### Script de validação automática
```bash
# Criar arquivo de teste que:
# 1. Faz login → obtém TOKEN
# 2. Testa POST flat em cada endpoint
# 3. Compara resultado (201 vs erro)
```

---

## 9. Schemas OpenAPI por endpoint (referência rápida)

Lista de schemas `Criar*Request` disponíveis no OpenAPI (`/docs/openapi.yaml`):

```
LoginRequest, RegistrarRequest, CriarSaasRequest,
CadastrarEmpresaRequest, CadastrarUsuarioRequest,
CriarCidadeRequest, CriarBairroRequest, CriarFeriadoRequest,
CriarContatoRequest, CriarAgendaRequest, CriarClassePessoaRequest,
CriarDepartamentoRequest, CriarFormulaRequest,
CriarAgenciaRequest, CriarPlanoContaRequest, CriarCCustoRequest,
CriarTipoDocumentoRequest, CriarLocalCobrancaRequest,
CriarCCorrenteRequest, CriarCaixaRequest, CriarCaixaMovimentoRequest,
CriarContaCorrenteMovimentoRequest,
CriarContaReceberRequest, CriarContaPagarRequest,
CriarAdiantamentoClienteRequest, CriarAdiantamentoColaboradorRequest,
CriarAdiantamentoFornecedorRequest,
CriarDRERequest, CriarDreDetalheRequest, CriarDreDetalheContaRequest,
CentroCustoParametrosRequest,
ParametrosFinanceirosCaixaRequest,
ParametrosFinanceirosPagarRequest, ParametrosFinanceirosReceberRequest
```

---

## 10. Priorização e Próximos Passos

### FASE 1 (IMEDIATO) — Financeiro Core
1. `ContaCorrenteView.vue` ← já temos o diagnóstico completo
2. `MovimentacaoView.vue`
3. `LancCaixaView.vue`
4. `AberCaixaView.vue`
5. `LancamentoColabView.vue`
6. `PagarView.vue`
7. `ReceberView.vue`

### FASE 2 — Produtos (após Financeiro)
8-17: Views de produtos (ver tabela Fase 2)

### FASE 3 — Estoque (após Produtos)
18-26: Views de estoque (ver tabela Fase 3)

### FASE 4 — Stores THorse (paralelo com Fase 1-3)
- `vendas.js` → migrar para `apiPhp` + flat
- `adiantamento.js` → migrar para `apiPhp` + flat
- `transfalmox.js` → migrar para `apiPhp` + flat

### FASE 5 — Views de Vendas/Adiantamento (após Fase 4)
- `AdiantamentoClienteView.vue`, `AdiantamentoFornecedorView.vue`, `AmbienteView.vue`

### FASE 6 — Views de Manutenção (baixa prioridade)
- `UsuariosView.vue`, `MensagensView.vue`, `DreView.vue`

---

## 11. Estimativa de Esforço

| Fase | Views | Esforço estimado | Depende de |
|------|-------|------------------|------------|
| Fase 1 | 7 | 3-4 dias | Nada |
| Fase 2 | 10 | 4-5 dias | Nada |
| Fase 3 | 9 | 2-3 dias | Nada |
| Fase 4 | 3 stores | 1-2 dias | Nada |
| Fase 5 | 3 views | 1 dia | Fase 4 |
| Fase 6 | 4 views | 1 dia | Nada |

**Total estimado:** 12-16 dias de trabalho, podendo ser paralelizado.
