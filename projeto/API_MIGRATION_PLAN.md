# Plano de Migração — API THorse → PHP (Laravel)

> **Contexto:** Migração das APIs do backend THorse (porta 9005) para o novo backend PHP/Laravel (porta 8000).
> A nova API segue o padrão `/api/v1/{modulo}/{recurso}` com JWT auth e claims `id_saas` + `id_empresa` extraídos automaticamente do token.

---

## Mudanças Estruturais Importantes

| Item | THorse (atual) | PHP (novo) | Impacto |
|------|---------------|------------|---------|
| **Base URL** | `http://192.168.10.100:9005` | `http://localhost:8000` (dev) | `src/services/api.js` |
| **Prefixo** | Sem prefixo | `/api/v1` | Todas as rotas |
| **Autenticação** | Bearer token manual | JWT + cookie httpOnly | `src/services/api.js` + stores |
| **id_empresa** | Passado na URL/body | Extraído do JWT claim | Remover de rotas e payloads |
| **id_saas** | Raramente usado | Extraído do JWT claim | Remover de payloads |
| **LGPD** | Sem mascaramento | Mascaramento em listagens | Adaptar masks no frontend |
| **Erro 422** | Formato único | 2 formatos possíveis | Tratar no frontend |
| **Parcelas** | API separada para cálculos | Geradas automaticamente no CRUD, mas com endpoints próprios de parcela | Adaptar fluxo |

---

## Etapas de Migração

### Etapa 0 — Infraestrutura e Setup ✅ CONCLUÍDA

**0.1** Configurar `src/services/api.js` para apontar para a nova URL:
- Nova base: `http://localhost:8000/api/v1`
- Adicionar interceptor global para Bearer token (hoje é manual)
- Adicionar interceptor para tratar erros 401 (redirecionar login)
- Adicionar interceptor para tratar os 2 formatos de erro 422

**0.2** Criar `src/services/apiPhp.js` para chamadas híbridas durante migração
- Permite manter THorse rodando enquanto migra módulos individualmente

**0.3** Atualizar `src/stores/APIs/api.js` (store base)
- Ajustar `executarAcao` para prefixo `/api/v1`
- Remover `id_empresa` manual dos payloads
- Atualizar `getAuthHeaders` se necessário

**Arquivos afetados:** `src/services/api.js`, `src/stores/APIs/api.js`

---

### Etapa 1 — Autenticação e Onboarding (3-4 dias) ❌ NÃO INICIADA

**1.1** Substituir fluxo de login (`LoginView.vue`)
| THorse (atual) | PHP (novo) |
|---------------|------------|
| `POST /login` | `POST /api/v1/auth/login` |
| `GET /empsaas` (no router) | `GET /api/v1/auth/me` |

- Novo login retorna `token`, `usuario`, `saas`, `empresas` integrados
- `GET /auth/me` substitui `GET /empsaas` no navigation guard
- Login agora precisa de `id_saas` + `email` + `senha`

**1.2** Novo fluxo de onboarding (SAAS)
| THorse | PHP |
|--------|-----|
| _Não existia_ | `POST /api/v1/saas` (criar SAAS) |
| _Não existia_ | `GET /api/v1/manutencao/saas/verificar/{token}` |
| _Não existia_ | `POST /api/v1/auth/registrar` (registro completo) |

- Fluxo completamente novo — criar views de onboarding se necessário
- Ou adaptar `LoginView` existente

**1.3** Logout
| THorse | PHP |
|--------|-----|
| _Não existia_ | `POST /api/v1/auth/logout` |

- Adicionar chamada de logout antes de limpar localStorage

**Arquivos afetados:** `src/views/auth/LoginView.vue`, `src/views/auth/EmpresaView.vue`, `src/router/index.js`, `src/stores/APIs/api.js`, `src/services/api.js`

---

### Etapa 2 — Tabelas Auxiliares / Manutenção ✅ CONCLUÍDA

**2.1** Países, UFs, Cidades, Bairros
| THorse | PHP |
|--------|-----|
| `GET /pais` | `GET /api/v1/manutencao/pais` |
| `GET /uf` | `GET /api/v1/manutencao/ufs` |
| `GET /cidade` | `GET /api/v1/manutencao/cidades` |
| `GET /bairro` | `GET /api/v1/manutencao/bairros` |
| `POST /bairro` | `POST /api/v1/manutencao/bairros` |
| `GET /cep/{cep}` | `GET /api/v1/manutencao/ceps/{cep}` |
| `GET /cnpj/{cnpj}` | `GET /api/v1/manutencao/ws-cnpj/{cnpj}` |

**2.2** CFOP, NCM, CEST, NBS
| THorse | PHP |
|--------|-----|
| `GET /cfop` | `GET /api/v1/manutencao/cfops` |
| `GET /ncm` | `GET /api/v1/manutencao/ncms` |
| `GET /cest` | `GET /api/v1/manutencao/cests` |
| `GET /nbs` | `GET /api/v1/manutencao/nbs` |

**Arquivos afetados:** `src/stores/APIs/localizacao.js`, `src/stores/APIs/pais.js`, `src/stores/APIs/estoque.js` (parte de CFOP/NCM/CEST)

---

### Etapa 3 — Módulo Financeiro (5-7 dias) ⚠️ CRÍTICO (3.1-3.6 ✅, 3.7-3.9 ⏳)

**3.1** Bancos, Agências, Conta Corrente ✅ PARCIALMENTE CONCLUÍDA
| THorse | PHP |
|--------|-----|
| `GET /banco` | `GET /api/v1/financeiro/bancos/{id}` _(sem listagem na doc)_ |
| `GET /agencia` | `GET /api/v1/financeiro/agencias` |
| `POST /agencia` | `POST /api/v1/financeiro/agencias` ✅ |
| `GET /agencia/{id}` | `GET /api/v1/financeiro/agencias/{id_banco}/{id}` ❌ |
| `PUT /agencia/{id}` | `PUT /api/v1/financeiro/agencias/{id_banco}/{id}` ❌ |
| `DELETE /agencia/{id}` | `DELETE /api/v1/financeiro/agencias/{id_banco}/{id}` ❌ |
| `GET /ccorrente` | `GET /api/v1/financeiro/contas-correntes` ✅ |
| `POST /ccorrente` | `POST /api/v1/financeiro/contas-correntes` ✅ |
| `GET /ccorrentemov/{...}` | `GET /api/v1/financeiro/conta-corrente-movimentos` ✅ |
| `GET /ccorrenteusu/{contaId}` | `GET /api/v1/financeiro/contas-correntes/{id}/usuarios` ✅ |
| `GET /ccorrenteapi/{idConta}` | `GET /api/v1/financeiro/contas-correntes/{id}/chaves-api` ✅ |

> ⚠️ **Atenção:** A doc também possui `/api/v1/financeiro/conta-correntes` (singular) como recurso separado de CRUD (`POST/GET/PUT/DELETE`). Verificar com backend se é o mesmo recurso com URL diferente ou um recurso novo.

**3.2** Planos de Conta, Centro de Custo, Tipo Documento, Local Cobrança ✅ PARCIALMENTE CONCLUÍDA
| THorse | PHP |
|--------|-----|
| `GET /planoconta` | `GET /api/v1/financeiro/plano-contas` ✅ |
| `POST /planoconta` | `POST /api/v1/financeiro/plano-contas` ✅ |
| `GET /planoconta/{id}` | `GET /api/v1/financeiro/plano-contas/{id}` ❌ |
| `PUT /planoconta/{id}` | `PUT /api/v1/financeiro/plano-contas/{id}` ❌ |
| `DELETE /planoconta/{id}` | `DELETE /api/v1/financeiro/plano-contas/{id}` ❌ |
| `GET /ccusto` | `GET /api/v1/financeiro/centro-custos` ✅ |
| `POST /ccusto` | `POST /api/v1/financeiro/centro-custos` ✅ |
| `GET /ccustoprev/{idEmpresa}` | `GET /api/v1/financeiro/centro-custos/previsao` ✅ |
| `GET /ccustoreal/{idEmpresa}` | `GET /api/v1/financeiro/centro-custos/realizado` ✅ |
| `GET /ccustoparametro` | `GET /api/v1/financeiro/centro-custo-parametros/parametro` ✅ |
| `PUT /ccustoparametro` | `PUT /api/v1/financeiro/centro-custo-parametros` ❌ |
| `GET /tipodocumento` | `GET /api/v1/financeiro/tipo-documentos` ✅ |
| `POST /tipodocumento` | `POST /api/v1/financeiro/tipo-documentos` ❌ |
| `GET /tipodocumento/{id}` | `GET /api/v1/financeiro/tipo-documentos/{id}` ❌ |
| `PUT /tipodocumento/{id}` | `PUT /api/v1/financeiro/tipo-documentos/{id}` ❌ |
| `DELETE /tipodocumento/{id}` | `DELETE /api/v1/financeiro/tipo-documentos/{id}` ❌ |
| `GET /tipopagrec` | `GET /api/v1/financeiro/tipo-pagamento-recebimentos/{id}` ✅ _(somente GET by ID)_ |
| `GET /localcobranca` | `GET /api/v1/financeiro/local-cobrancas` ✅ |
| `POST /localcobranca` | `POST /api/v1/financeiro/local-cobrancas` ❌ |
| `GET /localcobranca/{id}` | `GET /api/v1/financeiro/local-cobrancas/{id}` ❌ |
| `PUT /localcobranca/{id}` | `PUT /api/v1/financeiro/local-cobrancas/{id}` ❌ |
| `DELETE /localcobranca/{id}` | `DELETE /api/v1/financeiro/local-cobrancas/{id}` ❌ |
| `GET /histbancario` | `GET /api/v1/financeiro/historico-bancarios` ✅ |
| `POST /histbancario` | `POST /api/v1/financeiro/historico-bancarios` ❌ |
| `GET /histbancario/{id}` | `GET /api/v1/financeiro/historico-bancarios/{id}` ❌ |
| `PUT /histbancario/{id}` | `PUT /api/v1/financeiro/historico-bancarios/{id}` ❌ |
| `DELETE /histbancario/{id}` | `DELETE /api/v1/financeiro/historico-bancarios/{id}` ❌ |
| `GET /histcaixa` | `GET /api/v1/financeiro/historico-caixas` ✅ |
| `POST /histcaixa` | `POST /api/v1/financeiro/historico-caixas` ❌ |
| `GET /histcaixa/{id}` | `GET /api/v1/financeiro/historico-caixas/{id}` ❌ |
| `PUT /histcaixa/{id}` | `PUT /api/v1/financeiro/historico-caixas/{id}` ❌ |
| `DELETE /histcaixa/{id}` | `DELETE /api/v1/financeiro/historico-caixas/{id}` ❌ |
| `GET /tpcarteiracob/{idBanco}` | `GET /api/v1/financeiro/carteira-cobrancas/{idBanco}/{idCarteira}` ✅ |
| `POST /carteiracob` | `POST /api/v1/financeiro/carteiras-cobranca` ✅ |
| `GET /historicocontabil` | `GET /api/v1/contabil/historicos` ✅ |
| `POST /historicocontabil` | `POST /api/v1/contabil/historicos` ✅ |
| `GET /historicocontabil/{id}` | `GET /api/v1/contabil/historicos/{id}` ❌ |
| `PUT /historicocontabil/{id}` | `PUT /api/v1/contabil/historicos/{id}` ❌ |
| `DELETE /historicocontabil/{id}` | `DELETE /api/v1/contabil/historicos/{id}` ❌ |

**3.3** Caixas e Movimentos ✅ CONCLUÍDA
| THorse | PHP |
|--------|-----|
| `GET /caixa/{idEmpresa}` | `GET /api/v1/financeiro/caixas` _(idEmpresa do JWT)_ |
| `POST /caixa` | `POST /api/v1/financeiro/caixas` |
| `PUT /caixa/{idEmpresa}/{id}` | `PUT /api/v1/financeiro/caixas/{id}` _(idEmpresa do JWT)_ |
| `DELETE /caixa/{idEmpresa}/{id}` | `DELETE /api/v1/financeiro/caixas/{id}` _(idEmpresa do JWT)_ |
| `GET /caixausuativo/{idEmpresa}` | `GET /api/v1/financeiro/caixas/usuario/ativo` |
| `GET /caixausuaberto/{idEmpresa}` | `GET /api/v1/financeiro/caixas/usuario/aberto` |
| `POST /caixaopen/{...}` | `POST /api/v1/financeiro/caixas/{id}/abrir` |
| `POST /caixaclose/{...}` | `POST /api/v1/financeiro/caixas/{id}/fechar` |
| `GET /caixalct/{idEmpresa}/idcaixa/{idCaixa}` | `GET /api/v1/financeiro/caixa-movimentos` |
| `POST /caixalct/{...}` | `POST /api/v1/financeiro/caixa-movimentos` |
| `PUT /caixalct/{id}` | `PUT /api/v1/financeiro/caixa-movimentos/{id}` |
| `DELETE /caixalct/{id}` | `DELETE /api/v1/financeiro/caixa-movimentos/{id}` |

**3.4** Contas a Pagar (CRUD + Parcelas + Baixas) ✅ CONCLUÍDA
| THorse | PHP |
|--------|-----|
| `GET /contaspagar/{idEmpresa}` | `GET /api/v1/financeiro/conta-pagars` |
| `POST /contaspagar` | `POST /api/v1/financeiro/conta-pagars` |
| `GET /contaspagar/{idEmpresa}/{id}` | `GET /api/v1/financeiro/conta-pagars/{idEmpresa}/{id}` |
| `PUT /contaspagar/{idEmpresa}/{id}` | `PUT /api/v1/financeiro/conta-pagars/{idEmpresa}/{id}` |
| `DELETE /contaspagar/{idEmpresa}/{id}` | `DELETE /api/v1/financeiro/conta-pagars/{idEmpresa}/{id}` |
| `GET /parfinpag/{idEmpresa}` (parcelas) | `GET /api/v1/financeiro/parcela-pagars` |
| `GET /parfinpag/{idEmpresa}/{id}` | `GET /api/v1/financeiro/parcela-pagars/{idEmpresa}/{id}` |
| `PUT /parfinpag/{idEmpresa}/{id}` | `PUT /api/v1/financeiro/parcela-pagars/{idEmpresa}/{id}` |
| `POST /contaspagar/{idEmpresa}/{id}/cancelar` | `POST /api/v1/financeiro/parcela-pagars/{idEmpresa}/{id}/cancelar` |
| `POST /contaspagarbxa` | `POST /api/v1/financeiro/baixa-pagars` |
| `GET /pagarbaixados/{...}` | `GET /api/v1/financeiro/baixa-pagars` |
| `GET /baixapagar/{id}` | `GET /api/v1/financeiro/baixa-pagars/{id}` |
| `DELETE /estornopagar/{...}` | `POST /api/v1/financeiro/baixa-pagars/{id}/estornar` |
| `POST /contaspagarcalcparc` | _(automático no CRUD — não tem endpoint próprio)_ |
| `POST /contaspagar/autorizar` | _(não documentado na nova API — verificar com backend)_ |

**3.5** Contas a Receber (CRUD + Parcelas + Baixas) ❌ NÃO INICIADA
| THorse | PHP |
|--------|-----|
| `GET /contasreceber/{idEmpresa}` | `GET /api/v1/financeiro/conta-recebers` |
| `POST /contasreceber` | `POST /api/v1/financeiro/conta-recebers` |
| `GET /contasreceber/{idEmpresa}/{id}` | `GET /api/v1/financeiro/conta-recebers/{idEmpresa}/{id}` |
| `PUT /contasreceber/{idEmpresa}/{id}` | `PUT /api/v1/financeiro/conta-recebers/{idEmpresa}/{id}` |
| `DELETE /contasreceber/{idEmpresa}/{id}` | `DELETE /api/v1/financeiro/conta-recebers/{idEmpresa}/{id}` |
| `GET /parfinrec/{idEmpresa}` (parcelas) | `GET /api/v1/financeiro/parcela-recebers` |
| `GET /parfinrec/{idEmpresa}/{id}` | `GET /api/v1/financeiro/parcela-recebers/{idEmpresa}/{id}` |
| `PUT /parfinrec/{idEmpresa}/{id}` | `PUT /api/v1/financeiro/parcela-recebers/{idEmpresa}/{id}` |
| `POST /contasreceber/{idEmpresa}/{id}/cancelar` | `POST /api/v1/financeiro/parcela-recebers/{idEmpresa}/{id}/cancelar` |
| `POST /contasreceberbxa` | `POST /api/v1/financeiro/baixa-recebers` |
| `GET /receberbaixados/{...}` | `GET /api/v1/financeiro/baixa-recebers` |
| `GET /baixareceber/{id}` | `GET /api/v1/financeiro/baixa-recebers/{id}` |
| `DELETE /estornoreceber/{...}` | `POST /api/v1/financeiro/baixa-recebers/{id}/estornar` |
| `POST /contasrecebercalcparc` | _(automático no CRUD — não tem endpoint próprio)_ |

**3.6** DRE ❌ NÃO INICIADA

> ⚠️ **Estrutura diferente do THorse:** A nova API tem 3 níveis (DRE → Detalhes → Contas de Detalhe), não usa movimentações.

| THorse | PHP |
|--------|-----|
| `GET /dre` | `GET /api/v1/financeiro/dres` |
| `POST /dre` | `POST /api/v1/financeiro/dres` |
| `GET /dre/{id}` | `GET /api/v1/financeiro/dres/{id}` |
| `PUT /dre/{id}` | `PUT /api/v1/financeiro/dres/{id}` |
| `DELETE /dre/{id}` | `DELETE /api/v1/financeiro/dres/{id}` |
| `GET /dremov/{...}` | `GET /api/v1/financeiro/dre-detalhes/{idDre}/{id}` _(estrutura nova)_ |
| _Novo_ | `POST /api/v1/financeiro/dre-detalhes` |
| _Novo_ | `PUT /api/v1/financeiro/dre-detalhes/{idDre}/{id}` |
| _Novo_ | `DELETE /api/v1/financeiro/dre-detalhes/{idDre}/{id}` |
| _Novo_ | `POST /api/v1/financeiro/dre-detalhe-contas` |
| _Novo_ | `GET /api/v1/financeiro/dre-detalhe-contas/{idDre}/{idDreDetalhe}/{id}` |
| _Novo_ | `PUT /api/v1/financeiro/dre-detalhe-contas/{idDre}/{idDreDetalhe}/{id}` |
| _Novo_ | `DELETE /api/v1/financeiro/dre-detalhe-contas/{idDre}/{idDreDetalhe}/{id}` |

**3.7** Adiantamentos (Clientes, Colaboradores, Fornecedores) #288 ⏳ PENDENTE

> ⚠️ **Issues:** #288 (Etapa 3.7)

| THorse | PHP | Status |
|--------|-----|--------|
| `GET /adtcliente/{...}` | `GET /api/v1/financeiro/adiantamento-clientes` | ❌ THorse |
| `POST /adtcliente` | `POST /api/v1/financeiro/adiantamento-clientes` | ❌ THorse |
| `GET /adtcliente/{id}` | `GET /api/v1/financeiro/adiantamento-clientes/{id}` | ❌ THorse |
| `PUT /adtcliente/{id}` | `PUT /api/v1/financeiro/adiantamento-clientes/{id}` | ❌ THorse |
| `DELETE /adtcliente/{id}` | `DELETE /api/v1/financeiro/adiantamento-clientes/{id}` | ❌ THorse |
| `GET /adtcolabo/{...}` | `GET /api/v1/financeiro/adiantamento-colaboradors` | ❌ THorse |
| `POST /adtcolabo` | `POST /api/v1/financeiro/adiantamento-colaboradors` | ❌ THorse |
| `GET /adtcolabo/{id}` | `GET /api/v1/financeiro/adiantamento-colaboradors/{id}` | ❌ THorse |
| `PUT /adtcolabo/{id}` | `PUT /api/v1/financeiro/adiantamento-colaboradors/{id}` | ❌ THorse |
| `DELETE /adtcolabo/{id}` | `DELETE /api/v1/financeiro/adiantamento-colaboradors/{id}` | ❌ THorse |
| `GET /adtfornecedor/{...}` | `GET /api/v1/financeiro/adiantamento-fornecedors` | ❌ THorse |
| `POST /adtfornecedor` | `POST /api/v1/financeiro/adiantamento-fornecedors` | ❌ THorse |
| `GET /adtfornecedor/{id}` | `GET /api/v1/financeiro/adiantamento-fornecedors/{id}` | ❌ THorse |
| `PUT /adtfornecedor/{id}` | `PUT /api/v1/financeiro/adiantamento-fornecedors/{id}` | ❌ THorse |
| `DELETE /adtfornecedor/{id}` | `DELETE /api/v1/financeiro/adiantamento-fornecedors/{id}` | ❌ THorse |
| `POST /adtfornecedorpagto/{id}` | ⛔ **BLOQUEADO** — não documentado na API PHP | 🔴 Bloqueado |
| `PUT /adtfornecedoraprova/{id}` | ⛔ **BLOQUEADO** — não documentado na API PHP | 🔴 Bloqueado |
| `PUT /adtfornecedornega/{id}` | ⛔ **BLOQUEADO** — não documentado na API PHP | 🔴 Bloqueado |
| `POST /adtcolabocalcparc` | 🔄 Automático no CRUD — remover do frontend | 🗑️ Remover |

**3.8** Parâmetros Financeiros #289 ⏳ PENDENTE

> ⚠️ **Issues:** #289 (Etapa 3.8)
> ⚠️ Os nomes mudaram na nova API — use os nomes abaixo, não os do THorse.

| THorse | PHP | Status |
|--------|-----|--------|
| `GET /parfinpag/{idEmpresa}` | `GET /api/v1/financeiro/parametros-financeiros-pagars/{idEmpresa}` | ❌ THorse |
| `PUT /parfinpag/{idEmpresa}` | `PUT /api/v1/financeiro/parametros-financeiros-pagars/{idEmpresa}` | ❌ THorse |
| `GET /parfinrec/{idEmpresa}` | `GET /api/v1/financeiro/parametros-financeiros-recebers/{idEmpresa}` | ❌ THorse |
| `PUT /parfinrec/{idEmpresa}` | `PUT /api/v1/financeiro/parametros-financeiros-recebers/{idEmpresa}` | ❌ THorse |
| `GET /parfincxa/{idEmpresa}` | `GET /api/v1/financeiro/parametros-financeiros-caixas/{idEmpresa}` | ❌ THorse |
| `PUT /parfincxa/{idEmpresa}` | `PUT /api/v1/financeiro/parametros-financeiros-caixas/{idEmpresa}` | ❌ THorse |
| `GET /parfinbxa/{idEmpresa}` | ⛔ **BLOQUEADO** — não documentado na API PHP | 🔴 Bloqueado |

**3.9** Transferências e Boletos #290 ⏳ PENDENTE

> ⚠️ **Issues:** #290 (Etapa 3.9)
> ⚠️ Transferências financeiras **não têm equivalência na API PHP** — aguardar backend.

| THorse | PHP | Status |
|--------|-----|--------|
| `POST /ccorrentetransf` | ⛔ **BLOQUEADO** — não documentado na API PHP | 🔴 Bloqueado |
| `GET /transffinanceiras/{...}` | ⛔ **BLOQUEADO** — não documentado na API PHP | 🔴 Bloqueado |
| `POST /bolregistro/{...}` | `POST /api/v1/financeiro/boletos/registrar` | ✅ Migrado |
| `POST /bolnossonumero/{...}` | `POST /api/v1/financeiro/boletos/nosso-numero` | ✅ Migrado |

**Arquivos afetados:** `src/stores/APIs/financeiro.js`, `src/stores/APIs/caixa.js`, `src/stores/APIs/ccusto.js`, `src/stores/APIs/config.js`, `src/stores/APIs/dre.js`, `src/stores/APIs/dashboard.js`, `src/stores/APIs/adiantamento.js`

---

### Etapa 4 — Módulo Estoque e Produtos (5-7 dias) ⚠️ CRÍTICO

**4.1** Produtos (CRUD) ❌ NÃO INICIADA
| THorse | PHP |
|--------|-----|
| `GET /produto` | `GET /api/v1/estoque/produtos` |
| `GET /produto/{id}` | `GET /api/v1/estoque/produtos/{id}` |
| `POST /produto` | `POST /api/v1/estoque/produtos` |
| `PUT /produto/{id}` | `PUT /api/v1/estoque/produtos/{id}` |
| `DELETE /produto/{id}` | `DELETE /api/v1/estoque/produtos/{id}` |

**4.2** Tabelas de Apoio ❌ NÃO INICIADA

> ⚠️ **Mudança de estrutura:** Listagem (`GET /recurso`) retorna todos. Busca individual usa `GET /recurso/{id}`. Sem `GET /recurso` com filtro de empresa na URL — empresa vem do JWT.

| THorse | PHP |
|--------|-----|
| `GET /marca` | `GET /api/v1/estoque/marcas` _(sem listagem na doc — só POST + GET/PUT/DELETE /{id})_ |
| `POST /marca` | `POST /api/v1/estoque/marcas` |
| `GET /marca/{id}` | `GET /api/v1/estoque/marcas/{id}` |
| `PUT /marca/{id}` | `PUT /api/v1/estoque/marcas/{id}` |
| `DELETE /marca/{id}` | `DELETE /api/v1/estoque/marcas/{id}` |
| `GET /medida` | _(não documentado na nova API)_ |
| `GET /garantia` | `GET /api/v1/estoque/garantias` _(sem listagem na doc)_ |
| `POST /garantia` | `POST /api/v1/estoque/garantias` |
| `GET /garantia/{id}` | `GET /api/v1/estoque/garantias/{id}` |
| `GET /cor` | `GET /api/v1/estoque/cors` _(sem listagem na doc)_ |
| `POST /cor` | `POST /api/v1/estoque/cors` |
| `GET /cor/{id}` | `GET /api/v1/estoque/cors/{id}` |
| `GET /classe` | `GET /api/v1/estoque/classes` _(sem listagem na doc)_ |
| `POST /classe` | `POST /api/v1/estoque/classes` |
| `GET /classe/{id}` | `GET /api/v1/estoque/classes/{id}` |
| `GET /grupo` | `GET /api/v1/estoque/grupos` _(sem listagem na doc)_ |
| `POST /grupo` | `POST /api/v1/estoque/grupos` |
| `GET /grupo/{id}` | `GET /api/v1/estoque/grupos/{id}` |
| `GET /subgrupo/{idgrupo}` | `GET /api/v1/estoque/subgrupos/{idGrupo}/{id}` |
| `POST /subgrupo/{idgrupo}` | `POST /api/v1/estoque/subgrupos` |
| `GET /almoxarifado/{idemp}` | `GET /api/v1/estoque/almoxarifados/{idEmpresa}/{id}` |
| `POST /almoxarifado` | `POST /api/v1/estoque/almoxarifados` |
| `GET /localizacao/{idEmpresa}` | `GET /api/v1/estoque/localizacoes/{idEmpresa}/{id}` |
| `POST /localizacao` | `POST /api/v1/estoque/localizacoes` |

**4.3** Grade, Embalagens, Fornecedores, Similares, Preços, Kits ❌ NÃO INICIADA

> ⚠️ **Mudança de estrutura:** Na nova API, esses recursos são raiz (não nested em `/produtos/{id}/...`).

| THorse | PHP |
|--------|-----|
| `GET /grade/{idEmp}/{idProduto}` | `GET /api/v1/estoque/grades/{idEmpresa}/{idProduto}/{idCor}/{idTamanho}` |
| `POST /grade` | `POST /api/v1/estoque/grades` |
| `GET /proemb/{produtoId}` | `GET /api/v1/estoque/produto-embalagens/{idProduto}/{id}` |
| `POST /proemb` | `POST /api/v1/estoque/produto-embalagens` |
| `GET /profor/{idProduto}` | `GET /api/v1/estoque/produto-fornecedors/{idProduto}/{idPessoa}` |
| `POST /profor` | `POST /api/v1/estoque/produto-fornecedors` |
| `GET /prosim/{idProduto}` | `GET /api/v1/estoque/produto-similars/{idProduto}/{idSimilar}` |
| `POST /prosim` | `POST /api/v1/estoque/produto-similars` |
| `GET /protrib/{idEmpresa}` | `GET /api/v1/estoque/produto-tributos/{idEmpresa}/{idProduto}` |
| `POST /protrib` | `POST /api/v1/estoque/produto-tributos` |
| `GET /proalmox/{...}` | _(não documentado na nova API)_ |
| `GET /profoto/{idProduto}` | _(não documentado na nova API)_ |
| _Novo_ | `GET /api/v1/estoque/produto-kits` |
| _Novo_ | `POST /api/v1/estoque/produto-kits` |
| _Novo_ | `GET /api/v1/estoque/produto-kits/{idProduto}/{id}` |
| _Novo_ | `GET /api/v1/estoque/produto-precos/{idEmpresa}/{idProduto}` |
| _Novo_ | `POST /api/v1/estoque/produto-precos` |
| _Novo_ | `GET /api/v1/estoque/produto-grupo-tributos/{idEmpresa}/{idProduto}` |
| _Novo_ | `POST /api/v1/estoque/produto-grupo-tributos` |

**4.4** Entradas DFe, Devoluções ❌ NÃO INICIADA
| THorse | PHP |
|--------|-----|
| `GET /entrada/{idEmpresa}` | `GET /api/v1/estoque/entradas` |
| `POST /entrada` | `POST /api/v1/estoque/entradas` |
| `GET /entrada/{idEmpresa}/{id}` | `GET /api/v1/estoque/entradas/{idEmpresa}/{id}` |
| `PUT /entrada/{idEmpresa}/{id}` | `PUT /api/v1/estoque/entradas/{idEmpresa}/{id}` |
| `POST /entrada/{idEmpresa}/{id}/cancelar` | `POST /api/v1/estoque/entradas/{idEmpresa}/{id}/cancelar` |
| _Novo_ | `GET /api/v1/estoque/entrada-itens` |
| _Novo_ | `POST /api/v1/estoque/entrada-itens` |
| _Novo_ | `GET /api/v1/estoque/entrada-itens/{idEntrada}/{idSeq}` |
| _Novo_ | `GET /api/v1/estoque/entrada-tributos/{idEntrada}` |
| `GET /devcompra/{idEmpresa}` | `GET /api/v1/estoque/devolucao-compras` |
| `POST /devcompra` | `POST /api/v1/estoque/devolucao-compras` |
| `GET /devcompra/{idEmpresa}/{id}` | `GET /api/v1/estoque/devolucao-compras/{idEmpresa}/{id}` |
| `POST /devcompra/{idEmpresa}/{id}/cancelar` | `POST /api/v1/estoque/devolucao-compras/{idEmpresa}/{id}/cancelar` |
| _Novo_ | `GET /api/v1/estoque/devolucao-compra-itens` |
| _Novo_ | `GET /api/v1/estoque/devolucao-compra-tributos` |

**4.5** Inventário ❌ NÃO INICIADA

> ⚠️ **Mudança de estrutura:** Itens de inventário são recurso raiz, não nested.

| THorse | PHP |
|--------|-----|
| `GET /inventario/{idEmpresa}` | `GET /api/v1/estoque/inventarios` |
| `POST /inventario` | `POST /api/v1/estoque/inventarios` |
| `GET /inventario/{idEmpresa}/{id}` | `GET /api/v1/estoque/inventarios/{idEmpresa}/{id}` |
| `POST /inventario/{idEmpresa}/{id}/cancelar` | `POST /api/v1/estoque/inventarios/{idEmpresa}/{id}/cancelar` |
| `GET /inventarioitem/{...}` | `GET /api/v1/estoque/inventario-itens` _(recurso raiz)_ |
| `POST /inventarioitem/{...}` | `POST /api/v1/estoque/inventario-itens` |
| `GET /inventarioitem/{...}/{id}` | `GET /api/v1/estoque/inventario-itens/{idEmpresa}/{idInventario}/{idProduto}/{idCor}/{idTamanho}` |

**4.6** Transferência entre Almoxarifados ❌ NÃO INICIADA

> ⚠️ Não documentado na nova API — verificar com backend se haverá implementação.

| THorse | PHP |
|--------|-----|
| `GET /transfalmox/{idemp}` | _(não documentado)_ |
| `POST /transfalmox/env` | _(não documentado)_ |
| `POST /transfalmox/rec` | _(não documentado)_ |

**4.7** Fórmulas ❌ NÃO INICIADA

> ⚠️ Movido para `/manutencao/formulas` na nova API (não mais raiz).

| THorse | PHP |
|--------|-----|
| `GET /formula/{emp}` | `GET /api/v1/manutencao/formulas` |
| `POST /formula` | `POST /api/v1/manutencao/formulas` |
| `GET /formula/{idEmpresa}/{id}` | `GET /api/v1/manutencao/formulas/{idEmpresa}/{id}` |
| `PUT /formula/{idEmpresa}/{id}` | `PUT /api/v1/manutencao/formulas/{idEmpresa}/{id}` |
| `DELETE /formula/{idEmpresa}/{id}` | `DELETE /api/v1/manutencao/formulas/{idEmpresa}/{id}` |
| `POST /formula/valida/{emp}` | `POST /api/v1/manutencao/formulas/{idEmpresa}/{id}/validar` |
| _Novo_ | `POST /api/v1/manutencao/formulas/{idEmpresa}/{id}/compilar` |
| _Novo_ | `POST /api/v1/manutencao/formula-variaveis` |
| _Novo_ | `GET /api/v1/manutencao/formula-variaveis/{idEmpresa}/{idFormula}/{varnome}` |
| `GET /aliquotauf/{emp}` | _(não documentado na nova API)_ |

**Arquivos afetados:** `src/stores/APIs/produtos.js`, `src/stores/APIs/estoque.js`, `src/stores/APIs/inventario.js`, `src/stores/APIs/transfalmox.js`

---

### Etapa 5 — Módulo Pessoas, Empresa, Usuários (2-3 dias) ❌ NÃO INICIADA

**5.1** Pessoas (Clientes, Fornecedores, Colaboradores)
| THorse | PHP |
|--------|-----|
| `GET /pessoa` | `GET /api/v1/manutencao/pessoas` |
| `GET /pessoa/{id}` | `GET /api/v1/manutencao/pessoas/{id}` |
| `POST /pessoa` | `POST /api/v1/manutencao/pessoas` |
| `PUT /pessoa/{id}` | `PUT /api/v1/manutencao/pessoas/{id}` |
| `DELETE /pessoa/{id}` | `DELETE /api/v1/manutencao/pessoas/{id}` |
| `GET /pessoacli/{idEmpresa}` | `GET /api/v1/manutencao/pessoas?tipo=cliente` |
| `GET /pessoafor/{idEmpresa}` | `GET /api/v1/manutencao/pessoas?tipo=fornecedor` |

**5.2** Empresas

> ⚠️ Na nova API, empresas ficam em `/manutencao/empresas`, não em `/empresas` raiz.

| THorse | PHP |
|--------|-----|
| `GET /empresa` | `GET /api/v1/manutencao/empresas` |
| `POST /empresa` | `POST /api/v1/manutencao/empresas` |
| `GET /empresa/{id}` | `GET /api/v1/manutencao/empresas/{id}` |
| `PUT /empresa/{id}` | `PUT /api/v1/manutencao/empresas/{id}` |
| `DELETE /empresa/{id}` | `DELETE /api/v1/manutencao/empresas/{id}` |

**5.3** Usuários, Grupos de Usuário, Permissões

> ⚠️ Permissões de grupo mudaram de `/grupousuarioprog` para `/grupo-usuario-programas/{idGrupoUsuario}`.

| THorse | PHP |
|--------|-----|
| `GET /usuario` | `GET /api/v1/manutencao/usuarios` |
| `GET /usuario/{id}` | `GET /api/v1/manutencao/usuarios/{id}` |
| `PUT /usuario/{id}` | `PUT /api/v1/manutencao/usuarios/{id}` |
| `DELETE /usuario/{id}` | `DELETE /api/v1/manutencao/usuarios/{id}` |
| `GET /grupousuario` | `GET /api/v1/manutencao/grupo-usuarios` |
| `POST /grupousuario` | `POST /api/v1/manutencao/grupo-usuarios` |
| `GET /grupousuario/{id}` | `GET /api/v1/manutencao/grupo-usuarios/{id}` |
| `PUT /grupousuario/{id}` | `PUT /api/v1/manutencao/grupo-usuarios/{id}` |
| `DELETE /grupousuario/{id}` | `DELETE /api/v1/manutencao/grupo-usuarios/{id}` |
| `GET /useraccess/{idEmpresa}` | `GET /api/v1/manutencao/grupo-usuario-programas/{idGrupoUsuario}` |
| `POST /grupousuarioprog` | `POST /api/v1/manutencao/grupo-usuario-programas/{idGrupoUsuario}` |
| `DELETE /grupousuarioprog/{id}` | `DELETE /api/v1/manutencao/grupo-usuario-programas/{idGrupoUsuario}/{idPrograma}` |
| _Novo_ | `GET /api/v1/manutencao/usuario-empresas/{idEmpresa}` |
| _Novo_ | `POST /api/v1/manutencao/usuario-empresas` |
| _Novo_ | `GET /api/v1/manutencao/usuario-empresas/{idEmpresa}/{idUsuario}` |
| _Novo_ | `PUT /api/v1/manutencao/usuario-empresas/{idEmpresa}/{idUsuario}` |
| _Novo_ | `DELETE /api/v1/manutencao/usuario-empresas/{idEmpresa}/{idUsuario}` |

**Arquivos afetados:** `src/stores/APIs/pessoas.js`, `src/stores/APIs/empresa.js`, `src/stores/APIs/acesso.js`, `src/stores/APIs/grupousuario.js`

---

### Etapa 6 — Módulo de Vendas e PDV (3-4 dias) ❌ NÃO INICIADA

**6.1** Tabelas de Apoio de Vendas

> ⚠️ Motivos de perda, terminais e ambientes não estão documentados na nova API. Verificar com backend antes de migrar.

| THorse | PHP |
|--------|-----|
| `GET /mpo` | _(não documentado — verificar)_ |
| `POST /mpo` | _(não documentado — verificar)_ |
| `GET /terminalven/{idEmpresa}` | _(não documentado — verificar)_ |
| `POST /terminalven/{idEmpresa}` | _(não documentado — verificar)_ |
| `GET /ambiente/{idEmpresa}` | _(não documentado — verificar)_ |
| `POST /ambiente/{idEmpresa}` | _(não documentado — verificar)_ |

**6.2** Cupom Fiscal (PDV/Totem)
| THorse | PHP |
|--------|-----|
| _Não mapeado_ | `GET /api/v1/vendas/cupom-fiscal` |
| _Não mapeado_ | `POST /api/v1/vendas/cupom-fiscal/calcular` |
| _Não mapeado_ | `POST /api/v1/vendas/cupom-fiscal/emitir` |
| _Não mapeado_ | `GET /api/v1/vendas/cupom-fiscal/{idEmpresa}/{id}` |
| _Não mapeado_ | `GET /api/v1/vendas/cupom-fiscal/{idEmpresa}/{id}/xml` |
| _Não mapeado_ | `POST /api/v1/vendas/cupom-fiscal/{idEmpresa}/{id}/cancelar` |

**Arquivos afetados:** `src/stores/APIs/vendas.js`, `src/views/pages/pdv/`, `src/views/pages/vendas/`

---

### Etapa 7 — Módulo de Integrações, Agenda, Contatos (2-3 dias) ❌ NÃO INICIADA

**7.1** Integrações
| THorse | PHP |
|--------|-----|
| `GET /integracoes/api-externa` | `GET /api/v1/integracoes/api-externa` |
| `POST /integracoes/api-externa` | `POST /api/v1/integracoes/api-externa` |
| `GET /integracoes/loja` | `GET /api/v1/integracoes/loja` |
| `POST /integracoes/loja` | `POST /api/v1/integracoes/loja` |

**7.2** Agenda, Contatos e Auxiliares

> ⚠️ Na nova API, agendas e contatos estão sob `/manutencao/`, não sob `/agendas/`.

| THorse | PHP |
|--------|-----|
| `GET /agendacontato` | `GET /api/v1/manutencao/agendas` |
| `POST /agendacontato` | `POST /api/v1/manutencao/agendas` |
| `GET /agendacontato/{id}` | `GET /api/v1/manutencao/agendas/{id}` |
| `PUT /agendacontato/{id}` | `PUT /api/v1/manutencao/agendas/{id}` |
| `DELETE /agendacontato/{id}` | `DELETE /api/v1/manutencao/agendas/{id}` |
| `GET /agendacontatonot` | _(notificações não documentadas — verificar)_ |
| `GET /classepessoa` | `GET /api/v1/manutencao/classe-pessoas` |
| `POST /classepessoa` | `POST /api/v1/manutencao/classe-pessoas` |
| `GET /classepessoa/{id}` | `GET /api/v1/manutencao/classe-pessoas/{id}` |
| `GET /departamento` | `GET /api/v1/manutencao/departamentos` |
| `POST /departamento` | `POST /api/v1/manutencao/departamentos` |
| `GET /departamento/{id}` | `GET /api/v1/manutencao/departamentos/{id}` |
| _Novo_ | `GET /api/v1/manutencao/contatos` |
| _Novo_ | `POST /api/v1/manutencao/contatos` |
| _Novo_ | `GET /api/v1/manutencao/contatos/{id}` |
| _Novo_ | `GET /api/v1/manutencao/atividades` |
| _Novo_ | `GET /api/v1/manutencao/feriados` |
| _Novo_ | `GET /api/v1/manutencao/base-grupo-tributos` |

**7.3** Mensagens
| THorse | PHP |
|--------|-----|
| `GET /mensagem` | `GET /api/v1/manutencao/mensagens/{idEmpresa}` |
| `POST /mensagem` | `POST /api/v1/manutencao/mensagens` |
| `GET /mensagem/{idEmpresa}/{id}` | `GET /api/v1/manutencao/mensagens/{idEmpresa}/{id}` |

**7.4** Certificados Digitais
| THorse | PHP |
|--------|-----|
| _Não mapeado_ | `GET /api/v1/manutencao/certificados` |
| _Não mapeado_ | `POST /api/v1/manutencao/certificados` |

**Arquivos afetados:** `src/stores/APIs/integracoes.js`, `src/stores/APIs/agenda.js`, `src/stores/APIs/agendacontato.js`

---

### Etapa 8 — Dashboard ⚠️ VERIFICAR COM BACKEND

> ⚠️ Nenhum endpoint de dashboard foi encontrado na documentação atual (`/api/v1/`). Os endpoints abaixo existem no THorse mas não estão documentados na nova API. Verificar com backend se serão implementados.

| THorse | PHP (a confirmar) |
|--------|-----|
| `GET /pagarreceber/{idempresa}` | _(não documentado)_ |
| `GET /saldosbancario/{idempresa}` | _(não documentado)_ |
| `GET /fluxocaixamensal/{idempresa}` | _(não documentado)_ |
| `GET /fluxocaixadiario/{idempresa}` | _(não documentado)_ |
| `GET /pagrecdocloc/{idempresa}` | _(não documentado)_ |

---

### Etapa 9 — Remover THorse e Limpeza (1-2 dias)

**9.1** Remover ou desabilitar `src/services/api.js` (THorse)
**9.2** Renomear `src/services/apiPhp.js` → `src/services/api.js`
**9.3** Remover `src/services/apiLocal.js` (não utilizado)
**9.4** Atualizar `src/stores/APIs/api.js` se houver código legado
**9.5** Testar integração completa (todos os módulos)

---

## Estratégia de Migração

### Abordagem: Módulo a Módulo (Big Bang controlado)

1. **Auth primeiro:** Migrar login/logout/me (Etapa 1) — **desbloqueante**
2. **Tabelas auxiliares:** Concluídas (Etapa 2) ✅
3. **Financeiro:** Módulo mais crítico — fazer isoladamente (Etapa 3)
4. **Produtos:** Segundo módulo mais crítico (Etapa 4)
5. **Demais módulos:** Pessoas, Vendas, Integrações, etc. (Etapas 5-7)
6. **Dashboard:** Aguardar backend documentar (Etapa 8)
7. **Cleanup:** Remover código THorse (Etapa 9)

### Riscos

| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| **id_empresa removido da URL** | Quebra em todos os endpoints | Verificar JWT claim `id_empresa` |
| **Mascaramento LGPD** | Listagens com dados parciais | Adaptar máscaras no frontend |
| **2 formatos de erro 422** | Validadores quebram | Criar parser unificado |
| **Parcelas automáticas + endpoints próprios** | Fluxo de parcelas diferente do esperado | Remover `calcparc`, usar `parcela-pagars`/`parcela-recebers` para edição |
| **Nomes de campos diferentes** | Payloads incompatíveis | Mapear campos um a um |
| **Cookie httpOnly** | Sessão expira com cookie | Garantir fallback Bearer token |
| **Endpoints não documentados** | Transferências, dashboard, mpo, terminais | Verificar com backend antes de migrar |

### Dependências entre Etapas

```
Etapa 0 (Setup Infra) ✅
    │
    ▼
Etapa 1 (Autenticação) ← sem isso nada funciona
    │
    ▼
Etapa 2 (Tabelas Auxiliares) ✅
    │
    ├──► Etapa 3 (Financeiro) ← módulo core
    │
    └──► Etapa 4 (Estoque/Produtos) ← módulo core
    │
    ├──► Etapa 5 (Pessoas/Empresa/Usuários)
    │
    ├──► Etapa 6 (Vendas/PDV)
    │
    └──► Etapa 7 (Integrações/Agenda)
    │
    ├──► Etapa 8 (Dashboard — aguardar backend)
    │
    ▼
Etapa 9 (Cleanup THorse)
```

As Etapas 3-7 podem ser feitas **em paralelo** por diferentes devs.

---

## Convenções da Nova API

- URL base: `/api/v1/`
- Auth: `Authorization: Bearer {token}` ou cookie `jwt_token`
- Paginação: query params `?page=1&per_page=15`
- Filtros: query params (diferem por endpoint)
- Soft delete: `DELETE` marca como inativo (não remove)
- Datas: formato ISO (`2024-01-10T08:00:00.000000Z`)
- Padrão de resposta:
  - Listagem: `{ "data": [...], "current_page": 1, "per_page": 15, "total": 237 }`
  - Single: objeto direto
  - Erro 422: `{ "message": "...", "errors": { "campo": ["msg"] } }` ou `{ "erro": "..." }`
  - Erro 401: `{ "erro": "Não autenticado" }`
  - Erro 404: `{ "erro": "Não encontrado" }`
- Status: `ativo` = `'S'` / `'N'`, `situacao` = `'A'` / `'C'`
