# APIs Pendentes no Backend PHP

> Ultima atualizacao: 2026-06-18 (final do dia)
> Servidor: http://192.168.10.67:8000
> Swagger: http://192.168.10.67:8000/docs/
> THorse (antigo): http://192.168.10.100:9005 — **OFFLINE**

---

## 🟢 PRONTOS PRA MIGRAR (PHP tem, frontend ainda usa THorse)

| # | Rota THorse | Rota PHP | Store/View | Acao |
|---|-------------|----------|------------|------|
| 1 | ~~`POST /ccorrentetransf`~~ | ~~`POST /financeiro/conta-corrente-caixa-transfs`~~ | ~~`financeiro.js`~~ | ✅ **MIGRADO** |
| 2 | ~~`GET /grupousuarioprograma/{idGrupo}`~~ | ~~`GET /manutencao/grupo-usuario-programas/{idGrupoUsuario}`~~ | ~~`GrupoUsuarioView.vue`~~ | ✅ **MIGRADO** |
| 3 | ~~`GET/POST/PUT/DEL /gptrib/{idEmp}`~~ | ~~`GET|POST /manutencao/base-grupo-tributos`~~ | ~~`GrupoTributacaoView.vue`~~ | ✅ **MIGRADO** |
| 4 | ~~`GET /pagarreceber`, `/saldosbancario`, `/fluxocaixamensal`, `/fluxocaixadiario`, `/pagrecdocloc`~~ | ~~`GET /financeiro/dashboard-financeiro`~~ | ~~`dashboard.js`~~ | ✅ **MIGRADO** (5 endpoints unificados em 1) |
| 5 | ~~`GET /grupo`, `/marca`, `/classe`, `/subgrupo`, `/localizacao/{id}`~~ | ~~`/estoque/grupos`, `/estoque/marcas`, `/estoque/classes`, `/estoque/subgrupos`, `/estoque/localizacoes`~~ | ~~`ImportarProdutoView.vue`~~ | ✅ **MIGRADO** (exceto `/medida` que segue bloqueado) |
| 6 | ~~`GET /msg/{idEmp}`~~ | ~~`GET /manutencao/mensagens/{idEmpresa}`~~ | ~~`GrupoTributacaoView.vue`~~ | ✅ **MIGRADO** |
| 7 | ~~`GET /ccustoparametro`~~ | ~~`GET /financeiro/centro-custo-parametros/parametro`~~ | ~~`PagarView.vue`~~ | ✅ **MIGRADO** |
| 8 | `GET/POST/PUT/DEL /cfop` | `GET /manutencao/cfops/{idCfop}` (so consulta) | `estoque.js` | Reads em apiPhp (✅), writes sem PHP (🚫) |

---

## 🚫 BLOQUEADOS (Sem endpoint PHP — precisam ser criados no backend)

| # | Rota THorse | Store/View | Arquivo | O que faz |
|---|-------------|-----------|---------|-----------|
| 1 | `GET/POST/PUT/DEL /cest` | estoque.js | `src/stores/APIs/estoque.js` | CRUD de CEST |
| 2 | `POST /nbs` | estoque.js | `src/stores/APIs/estoque.js` | CRUD de NBS |
| 3 | `GET/POST/PUT/DEL /aliquotauf` | estoque.js | `src/stores/APIs/estoque.js` | Aliquotas ICMS por UF |
| 4 | `GET/POST/PUT/DEL /agendacontatonot` | agenda.js | `src/stores/agenda.js` | Notificacoes de contato |
| 5 | `GET/POST /medida` | produtos.js | `src/stores/APIs/produtos.js` | Unidades de medida |
| 6 | `GET/DEL/POST /profoto` | produtos.js | `src/stores/APIs/produtos.js` | Fotos de produto |
| 7 | `GET /proalmox` | inventario.js | `src/stores/APIs/inventario.js` | Saldo estoque por almoxarifado |
| 8 | `GET /transffinanceiras` | financeiro.js | `src/stores/APIs/financeiro.js` | Listar transf. financeiras |
| 9 | `DELETE /estornotransffin/{id}` | HistoricoTransferencias | `src/components/base/transferencias/HistoricoTransferencias.vue` | Estornar transf. financeira |
| 10 | `POST /validaemail` | HomeSiteView | `src/views/site/HomeSiteView.vue` | Validar e-mail (site publico) |
| 11 | `PUT /adtfornecedorpagto/{id}` | adiantamento.js | `src/stores/APIs/adiantamento.js` | Pagar adiantamento fornecedor |
| 12 | `POST /contaspagarautorizar` | financeiro.js | `src/stores/APIs/financeiro.js` | Autorizar contas (automatico no PHP) |
| 13 | `GET /programa` | - | usado em permissoes | Lista de modulos/programas |

---

## ⚠️ API MISMATCH (PHP tem, mas estrutura diferente)

| # | Rota THorse | Rota PHP | Problema |
|---|-------------|----------|----------|
| 1 | `GET/POST/PUT/DEL /ambientes` | `/admin/terminais-venda/{terminal}/ambientes` | PHP e **per-terminal** (1 ambiente = 1 terminal). View atual suporta **multiplos terminais** por ambiente. Requer redesign da view. |

---

## 📊 Resumo

| Status | Qtd | Acao necessaria |
|--------|-----|-----------------|
| ✅ Migrado | ~9 | — |
| 🚫 Bloqueado (sem PHP) | ~13 | Criar endpoints no backend |
| ⚠️ API mismatch | 1 | Redesign da view Ambiente |
| 🟡 Parcial (so leitura) | 1 | Criar writes no PHP |
| **Total** | **~24** | |

> **Obs:** THorse (porta 9005) esta offline — o que ainda ta nele simplesmente nao funciona.
