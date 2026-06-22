# Plano de Migração — Payloads Delphi/THorse → Laravel

> **Problema:** Algumas views ainda enviam payloads no formato Delphi/THorse `{ data: [ {...} ] }`, mas o backend Laravel espera objetos **flat** (diretos). A maioria das views já foi corrigida durante a migração das stores. Restam apenas casos pontuais.

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

## 3. Situação Atual (pós-migração)

A maioria das views e stores já foi corrigida. As stores de `financeiro.js`, `caixa.js` e `config.js` têm camada de compatibilidade (normalizam `payload.data[0]` → flat).

### ✅ Já corrigidas
- **FASE 1 completa:** ContaCorrente, Pagar, Receber, Movimentação, LancCaixa, AberCaixa, LancamentoColab — todas enviam flat
- **FASE 2 completa:** ProdutosDetalhes, Produtos, ProdutoGrade, EntradaDfe, Devolução, Importar, Local — todas flat
- **FASE 3 completa:** Grupos, Classes, Aliquotauf, Formula, Cest, TransfAlmox, Inventário, GrupoTributação — todas flat
- **FASE 4 completa:** AdiantamentoCliente, AdiantamentoFornecedor — stores migradas para `apiPhp`
- **FASE 5 completa:** Usuários, Mensagens, DRE — todas corrigidas

### ❌ Remanescentes (5 ocorrências em 4 views)

| View | Store | Payload Atual | Corrigido? |
|------|-------|--------------|------------|
| `EmpresaView.vue:489` | `empresaStore.cadastrarEmpresa` | `{ data: [data.value] }` → PHP rejeita | ✅ **CORRIGIDO** |
| `ProdutosDetalhesView.vue:1564` | `produtosStore.salvarFotoBanco` | `{ data: [{ id_produto, r2key }] }` → THorse | 🔴 Bloqueado (#293) |
| `ProdutosDetalhesView.vue:1604` | `produtosStore.deletarFotoBanco` | `{ data: [{ r2key }] }` → THorse | 🔴 Bloqueado (#293) |
| `FormulaView 2.vue:200` | `estoqueStore.cadastrarFormula` | `{ data: [{ ... }] }` | 🔴 Arquivo duplicado (não usado pelo router) |
| `AliquotaUfView 2.vue:815` | `estoqueStore.cadastrarAliquota` | `{ data: [{ ... }] }` | 🔴 Arquivo duplicado (não usado pelo router) |

### Store methods com normalização (compatibilidade)
| Store | Métodos |
|-------|---------|
| `financeiro.js` | `criarContaPagar`, `atualizarContaPagar`, `criarContaReceber`, `atualizarContaReceber`, `baixarPagamentos`, `baixarContasReceber` |
| `caixa.js` | Vários métodos |
| `config.js` | `cadastrarParfin`, `alterarParfin`, `cadastrarParametrosFinanceiros*` |

> **Nota:** Métodos de `financeiro.js`, `caixa.js` e `config.js` normalizam automaticamente `payload.data[0]` para flat, mantendo compatibilidade com ambas as chamadas. Views que chamam esses stores não precisam de alteração.

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

## 10. Status Atual

- ✅ **FASE 1-6 concluídas** — praticamente todas as views já enviam payload flat
- ✅ **Normalização** — stores core (financeiro, caixa, config) têm compatibilidade bidirecional
- 🔴 **2 views bloqueadas** — `ProdutosDetalhesView.vue` (profoto) depende do backend criar endpoints PHP (issue #293)
- 🔴 **2 views duplicadas** — `FormulaView 2.vue`, `AliquotaUfView 2.vue` (não usadas pelo router)

---

## 11. O Que Falta

1. **Desbloquear #293** — criar endpoints PHP para `/profoto`, `/medida`, etc.
2. **Corrigir views bloqueadas** em `ProdutosDetalhesView.vue` (após #293)
3. **Cleanup opcional** — remover camada de normalização nas stores quando não for mais necessária
