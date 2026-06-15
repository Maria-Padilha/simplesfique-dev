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
| **Parcelas** | API separada para cálculos | Geradas automaticamente no CRUD | Adaptar fluxo |

---

## Etapas de Migração

### Etapa 0 — Infraestrutura e Setup (1-2 dias)

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

### Etapa 1 — Autenticação e Onboarding (3-4 dias)

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

### Etapa 2 — Tabelas Auxiliares / Manutenção (2-3 dias)

**2.1** Países, UFs, Cidades, Bairros
| THorse | PHP |
|--------|-----|
| `GET /pais` | `GET /api/v1/manutencao/pais` |
| `GET /uf` | `GET /api/v1/manutencao/ufs` |
| `GET /cidade` | `GET /api/v1/manutecao/cidades` |
| `GET /bairro` | `GET /api/v1/manutencao/bairros` |
| `POST /bairro` | `POST /api/v1/manutencao/bairros` |
| `GET /cep/{cep}` | `GET /api/v1/cep/{cep}` |
| `GET /cnpj/{cnpj}` | `GET /api/v1/cnpj/{cnpj}` |

**2.2** CFOP, NCM, CEST, NBS
| THorse | PHP |
|--------|-----|
| `GET /cfop` | `GET /api/v1/manutencao/cfops` |
| `GET /ncm` | `GET /api/v1/manutencao/ncms` |
| `GET /cest` | `GET /api/v1/manutencao/cests` |
| `GET /nbs` | `GET /api/v1/manutencao/nbs` |

**Arquivos afetados:** `src/stores/APIs/localizacao.js`, `src/stores/APIs/pais.js`, `src/stores/APIs/estoque.js` (parte de CFOP/NCM/CEST)

---

### Etapa 3 — Módulo Financeiro (5-7 dias) ⚠️ CRÍTICO

**3.1** Bancos, Agências, Conta Corrente
| THorse | PHP |
|--------|-----|
| `GET /banco` | `GET /api/v1/financeiro/bancos` |
| `GET /agencia` | `GET /api/v1/financeiro/agencias` |
| `POST /agencia` | `POST /api/v1/financeiro/agencias` |
| `GET /ccorrente` | `GET /api/v1/financeiro/contas-correntes` |
| `POST /ccorrente` | `POST /api/v1/financeiro/contas-correntes` |

**3.2** Planos de Conta, Centro de Custo, Tipo Documento, Local Cobrança
| THorse | PHP |
|--------|-----|
| `GET /planoconta` | `GET /api/v1/financeiro/planos-conta` |
| `GET /ccusto` | `GET /api/v1/financeiro/centros-custo` |
| `GET /tipodocumento` | `GET /api/v1/financeiro/tipos-documento` |
| `GET /localcobranca` | `GET /api/v1/financeiro/locais-cobranca` |
| `GET /histbancario` | `GET /api/v1/financeiro/historicos-bancarios` |
| `GET /histcaixa` | `GET /api/v1/financeiro/historicos-caixa` |
| `GET /tpcarteiracob/{idBanco}` | `GET /api/v1/financeiro/carteiras-cobranca` |
| `GET /carteiracob/{idEmpresa}` | `GET /api/v1/financeiro/carteiras-cobranca` |

**3.3** Caixas e Movimentos
| THorse | PHP |
|--------|-----|
| `GET /caixa/{idEmpresa}` | `GET /api/v1/financeiro/caixas` |
| `POST /caixa` | `POST /api/v1/financeiro/caixas` |
| `GET /caixalct/{idEmpresa}/...` | `GET /api/v1/financeiro/movimentos-caixa` |
| `POST /caixalct/{...}` | `POST /api/v1/financeiro/movimentos-caixa` |

**3.4** Contas a Pagar (CRUD + Parcelas + Baixas)
| THorse | PHP |
|--------|-----|
| `GET /contaspagar/{idEmpresa}` | `GET /api/v1/financeiro/contas-pagar` |
| `POST /contaspagar` | `POST /api/v1/financeiro/contas-pagar` |
| `POST /contaspagarbxa` | `POST /api/v1/financeiro/baixas-pagar` |
| `POST /contaspagarautorizar` | `POST /api/v1/financeiro/contas-pagar/autorizar` |
| `POST /contaspagarcalcparc` | **NOVO:** parcelas geradas automaticamente |
| `GET /pagarbaixados/{...}` | `GET /api/v1/financeiro/baixas-pagar` |
| `DELETE /estornopagar/{...}` | _Verificar endpoint_ |

**3.5** Contas a Receber (CRUD + Parcelas + Baixas)
| THorse | PHP |
|--------|-----|
| `GET /contasreceber/{idEmpresa}` | `GET /api/v1/financeiro/contas-receber` |
| `POST /contasreceber` | `POST /api/v1/financeiro/contas-receber` |
| `POST /contasreceberbxa` | `POST /api/v1/financeiro/baixas-receber` |
| `POST /contasrecebercalcparc` | **NOVO:** parcelas geradas automaticamente |

**3.6** DRE
| THorse | PHP |
|--------|-----|
| `GET /dre` | `GET /api/v1/financeiro/dres` |
| `GET /dremov/{...}` | `GET /api/v1/financeiro/dres/movimentacoes` |

**3.7** Adiantamentos (Clientes, Colaboradores, Fornecedores)
| THorse | PHP |
|--------|-----|
| `GET /adtcliente/{...}` | `GET /api/v1/financeiro/adiantamentos-clientes` |
| `GET /adtcolabo/{...}` | `GET /api/v1/financeiro/adiantamentos-colaboradores` |
| `GET /adtfornecedor/{...}` | `GET /api/v1/financeiro/adiantamentos-fornecedores` |
| `POST /adtfornecedorpagto/{id}` | `PUT /api/v1/financeiro/adiantamentos-fornecedores/{id}/pagar` |
| `PUT /adtfornecedoraprova/{id}` | `PUT /api/v1/financeiro/adiantamentos-fornecedores/{id}/aprovar` |

**3.8** Transferências e Boletos
| THorse | PHP |
|--------|-----|
| `POST /ccorrentetransf` | `POST /api/v1/financeiro/transferencias` |
| `GET /transffinanceiras/{...}` | `GET /api/v1/financeiro/transferencias` |
| `POST /bolregistro/{...}` | `POST /api/v1/financeiro/boletos/registrar` |
| `POST /bolnossonumero/{...}` | `POST /api/v1/financeiro/boletos/nosso-numero` |

**Arquivos afetados:** `src/stores/APIs/financeiro.js`, `src/stores/APIs/caixa.js`, `src/stores/APIs/ccusto.js`, `src/stores/APIs/config.js`, `src/stores/APIs/dre.js`, `src/stores/APIs/dashboard.js`, `src/stores/APIs/adiantamento.js`

---

### Etapa 4 — Módulo Estoque e Produtos (5-7 dias) ⚠️ CRÍTICO

**4.1** Produtos (CRUD)
| THorse | PHP |
|--------|-----|
| `GET /produto` | `GET /api/v1/estoque/produtos` |
| `GET /produto/{id}` | `GET /api/v1/estoque/produtos/{id}` |
| `POST /produto` | `POST /api/v1/estoque/produtos` |
| `PUT /produto/{id}` | `PUT /api/v1/estoque/produtos/{id}` |
| `DELETE /produto/{id}` | `DELETE /api/v1/estoque/produtos/{id}` |

**4.2** Tabelas de Apoio (Marcas, Medidas, Garantias, Cores, Classes, Grupos, Subgrupos)
| THorse | PHP |
|--------|-----|
| `GET /marca` | `GET /api/v1/estoque/marcas` |
| `GET /medida` | `GET /api/v1/estoque/medidas` |
| `GET /garantia` | `GET /api/v1/estoque/garantias` |
| `GET /cor` | `GET /api/v1/estoque/cores` |
| `GET /classe` | `GET /api/v1/estoque/classes` |
| `GET /grupo` | `GET /api/v1/estoque/grupos` |
| `GET /subgrupo/{id}` | `GET /api/v1/estoque/subgrupos` |
| `GET /almoxarifado/{id}` | `GET /api/v1/estoque/almoxarifados` |
| `GET /localizacao/{id}` | `GET /api/v1/estoque/localizacoes` |

**4.3** Grade, Embalagens, Fornecedores, Similares, Preços
| THorse | PHP |
|--------|-----|
| `GET /grade/{idEmp}/{idProduto}` | `GET /api/v1/estoque/grades` |
| `GET /proemb/{produtoId}` | `GET /api/v1/estoque/produtos/{id}/embalagens` |
| `GET /profor/{idProduto}` | `GET /api/v1/estoque/produtos/{id}/fornecedores` |
| `GET /prosim/{idProduto}` | `GET /api/v1/estoque/produtos/{id}/similares` |
| `GET /protrib/{idEmpresa}` | `GET /api/v1/estoque/produtos/{id}/tributos` |

**4.4** Entradas DFe, Devoluções
| THorse | PHP |
|--------|-----|
| `GET /entrada/{idEmpresa}` | `GET /api/v1/estoque/entradas` |
| `POST /entrada` | `POST /api/v1/estoque/entradas` |
| `GET /devcompra/{idEmpresa}` | `GET /api/v1/estoque/devolucoes-compra` |
| `POST /devcompra` | `POST /api/v1/estoque/devolucoes-compra` |

**4.5** Inventário
| THorse | PHP |
|--------|-----|
| `GET /inventario/{idEmpresa}` | `GET /api/v1/estoque/inventarios` |
| `POST /inventario` | `POST /api/v1/estoque/inventarios` |
| `GET /inventarioitem/{...}` | `GET /api/v1/estoque/inventarios/{id}/itens` |
| `POST /inventarioitem/{...}` | `POST /api/v1/estoque/inventarios/{id}/itens` |

**4.6** Transferência entre Almoxarifados
| THorse | PHP |
|--------|-----|
| `GET /transfalmox/{id}` | `GET /api/v1/estoque/transferencias-almox` |
| `POST /transfalmox/env` | `POST /api/v1/estoque/transferencias-almox` |
| `POST /transfalmox/rec` | `POST /api/v1/estoque/transferencias-almox/{id}/receber` |

**4.7** Fórmulas
| THorse | PHP |
|--------|-----|
| `GET /formula/{emp}` | `GET /api/v1/formulas` |
| `POST /formula` | `POST /api/v1/formulas` |
| `POST /formula/valida/{emp}` | `POST /api/v1/formulas/validar` |

**Arquivos afetados:** `src/stores/APIs/produtos.js`, `src/stores/APIs/estoque.js`, `src/stores/APIs/inventario.js`, `src/stores/APIs/transfalmox.js`

---

### Etapa 5 — Módulo Pessoas, Empresa, Usuários (2-3 dias)

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
| THorse | PHP |
|--------|-----|
| `GET /empresa` | `GET /api/v1/empresas` |
| `POST /empresa` | `POST /api/v1/empresas` |
| `PUT /empresa/{id}` | `PUT /api/v1/empresas/{id}` |
| `DELETE /empresa/{id}` | `DELETE /api/v1/empresas/{id}` |

**5.3** Usuários, Grupos de Usuário, Permissões
| THorse | PHP |
|--------|-----|
| `GET /usuario` | `GET /api/v1/manutencao/usuarios` |
| `GET /grupousuario` | `GET /api/v1/manutencao/grupos-usuario` |
| `POST /grupousuario` | `POST /api/v1/manutencao/grupos-usuario` |
| `GET /useraccess/{idEmpresa}` | `GET /api/v1/manutencao/grupos-usuario/{id}/programas` |
| `POST /grupousuarioprog` | `POST /api/v1/manutencao/grupos-usuario/{id}/programas` |

**Arquivos afetados:** `src/stores/APIs/pessoas.js`, `src/stores/APIs/empresa.js`, `src/stores/APIs/acesso.js`, `src/stores/APIs/grupousuario.js`

---

### Etapa 6 — Módulo de Vendas e PDV (3-4 dias)

**6.1** Vendas
| THorse | PHP |
|--------|-----|
| `GET /mpo` | `GET /api/v1/vendas/motivos-perda` |
| `GET /terminalven/{idEmpresa}` | `GET /api/v1/vendas/terminais` |
| `GET /ambiente/{idEmpresa}` | `GET /api/v1/vendas/ambientes` |

**6.2** Cupom Fiscal (PDV/Totem)
| THorse | PHP |
|--------|-----|
| _Não mapeado_ | `GET /api/v1/vendas/cupons-fiscais` |
| _Não mapeado_ | `POST /api/v1/vendas/cupons-fiscais` |
| _Não mapeado_ | `PUT /api/v1/vendas/cupons-fiscais/{id}/cancelar` |

**Arquivos afetados:** `src/stores/APIs/vendas.js`, `src/views/pages/pdv/`, `src/views/pages/vendas/`

---

### Etapa 7 — Módulo de Integrações, Agenda, Contatos (2-3 dias)

**7.1** Integrações
| THorse | PHP |
|--------|-----|
| `GET /integracoes/api-externa` | `GET /api/v1/integracoes/api-externa` |
| `GET /integracoes/loja` | `GET /api/v1/integracoes/loja` |

**7.2** Agenda e Contatos
| THorse | PHP |
|--------|-----|
| `GET /agendacontatonot` | `GET /api/v1/agendas/notificacoes` |
| `GET /agendacontato` | `GET /api/v1/agendas/contatos` |
| `GET /classepessoa` | `GET /api/v1/manutencao/classes-pessoas` |
| `GET /departamento` | `GET /api/v1/manutencao/departamentos` |

**7.3** Mensagens
| THorse | PHP |
|--------|-----|
| `GET /mensagem` | `GET /api/v1/manutencao/mensagens` |

**7.4** Certificados Digitais
| THorse | PHP |
|--------|-----|
| _Não mapeado_ | `POST /api/v1/manutencao/certificados` |
| _Não mapeado_ | `DELETE /api/v1/manutencao/certificados/{id}` |

**Arquivos afetados:** `src/stores/APIs/integracoes.js`, `src/stores/APIs/agenda.js`, `src/stores/APIs/agendacontato.js`

---

### Etapa 8 — Remover THorse e Limpeza (1-2 dias)

**8.1** Remover ou desabilitar `src/services/api.js` (THorse)
**8.2** Renomear `src/services/apiPhp.js` → `src/services/api.js`
**8.3** Remover `src/services/apiLocal.js` (não utilizado)
**8.4** Atualizar `src/stores/APIs/api.js` se houver código legado
**8.5** Testar integração completa (todos os módulos)

---

## Mapa de Endpoints THorse → PHP (Completo)

### Autenticação
| THorse | PHP |
|--------|-----|
| `POST /login` | `POST /api/v1/auth/login` |
| `GET /empsaas` | `GET /api/v1/auth/me` |
| _não existe_ | `POST /api/v1/auth/logout` |
| _não existe_ | `POST /api/v1/auth/registrar` |
| _não existe_ | `POST /api/v1/saas` |
| _não existe_ | `GET /api/v1/manutencao/saas/verificar/{token}` |

### Manutenção / Tabelas Auxiliares
| THorse | PHP |
|--------|-----|
| `GET /pais` | `GET /api/v1/manutencao/pais` |
| `GET /uf` | `GET /api/v1/manutencao/ufs` |
| `GET /uf/{sigla}` | `GET /api/v1/manutencao/ufs/{sigla}` |
| `GET /cidade` | `GET /api/v1/manutencao/cidades` |
| `GET /bairro` | `GET /api/v1/manutencao/bairros` |
| `POST /bairro` | `POST /api/v1/manutencao/bairros` |
| `GET /cep/{cep}` | `GET /api/v1/cep/{cep}` |
| `GET /cnpj/{cnpj}` | `GET /api/v1/cnpj/{cnpj}` |
| `GET /cfop` | `GET /api/v1/manutencao/cfops` |
| `GET /ncm` | `GET /api/v1/manutencao/ncms` |
| `GET /cest` | `GET /api/v1/manutencao/cests` |

### Financeiro
| THorse | PHP |
|--------|-----|
| `GET /banco` | `GET /api/v1/financeiro/bancos` |
| `GET /agencia` | `GET /api/v1/financeiro/agencias` |
| `POST /agencia` | `POST /api/v1/financeiro/agencias` |
| `GET /ccorrente` | `GET /api/v1/financeiro/contas-correntes` |
| `POST /ccorrente` | `POST /api/v1/financeiro/contas-correntes` |
| `GET /ccorrentemov/{...}` | `GET /api/v1/financeiro/movimentos-conta-corrente` |
| `GET /ccorrenteusu/{contaId}` | `GET /api/v1/financeiro/contas-correntes/{id}/usuarios` |
| `GET /ccorrenteapi/{idConta}` | `GET /api/v1/financeiro/contas-correntes/{id}/chaves-api` |
| `GET /caixa/{idEmpresa}` | `GET /api/v1/financeiro/caixas` |
| `POST /caixa` | `POST /api/v1/financeiro/caixas` |
| `GET /caixausu/{idEmpresa}/id/{caixaId}` | `GET /api/v1/financeiro/caixas/{id}/usuarios` |
| `POST /caixaopen/{...}` | `POST /api/v1/financeiro/caixas/{id}/abrir` |
| `POST /caixaclose/{...}` | `POST /api/v1/financeiro/caixas/{id}/fechar` |
| `GET /caixalct/{...}` | `GET /api/v1/financeiro/movimentos-caixa` |
| `POST /caixalct/{...}` | `POST /api/v1/financeiro/movimentos-caixa` |
| `GET /histbancario` | `GET /api/v1/financeiro/historicos-bancarios` |
| `GET /histcaixa` | `GET /api/v1/financeiro/historicos-caixa` |
| `GET /planoconta` | `GET /api/v1/financeiro/planos-conta` |
| `POST /planoconta` | `POST /api/v1/financeiro/planos-conta` |
| `GET /ccusto` | `GET /api/v1/financeiro/centros-custo` |
| `POST /ccusto` | `POST /api/v1/financeiro/centros-custo` |
| `GET /ccustoprev/{idEmpresa}` | `GET /api/v1/financeiro/centros-custo/{id}/previsao` |
| `GET /ccustoreal/{idEmpresa}` | `GET /api/v1/financeiro/centros-custo/{id}/realizado` |
| `GET /ccustoparametro` | `GET /api/v1/financeiro/parametros-centro-custo` |
| `GET /tipodocumento` | `GET /api/v1/financeiro/tipos-documento` |
| `POST /tipodocumento` | `POST /api/v1/financeiro/tipos-documento` |
| `GET /tipopagrec` | `GET /api/v1/financeiro/tipos-pagamento-recebimento` |
| `GET /localcobranca` | `GET /api/v1/financeiro/locais-cobranca` |
| `POST /localcobranca` | `POST /api/v1/financeiro/locais-cobranca` |
| `GET /carteiracob/{idEmpresa}` | `GET /api/v1/financeiro/carteiras-cobranca` |
| `POST /carteiracob` | `POST /api/v1/financeiro/carteiras-cobranca` |
| `GET /tpcarteiracob/{idBanco}` | `GET /api/v1/financeiro/carteiras-cobranca?banco={id}` |
| `POST /bolnossonumero/{...}` | `POST /api/v1/financeiro/boletos/nosso-numero` |
| `POST /bolregistro/{...}` | `POST /api/v1/financeiro/boletos/registrar` |
| `GET /contaspagar/{idEmpresa}` | `GET /api/v1/financeiro/contas-pagar` |
| `POST /contaspagar` | `POST /api/v1/financeiro/contas-pagar` |
| `POST /contaspagarbxa` | `POST /api/v1/financeiro/baixas-pagar` |
| `POST /contaspagarautorizar` | `POST /api/v1/financeiro/contas-pagar/autorizar` |
| `GET /pagarbaixados/{...}` | `GET /api/v1/financeiro/baixas-pagar` |
| `DELETE /estornopagar/{...}` | `POST /api/v1/financeiro/baixas-pagar/{id}/estornar` |
| `POST /contaspagarcalcparc` | _(automático no CRUD)_ |
| `GET /contasreceber/{idEmpresa}` | `GET /api/v1/financeiro/contas-receber` |
| `POST /contasreceber` | `POST /api/v1/financeiro/contas-receber` |
| `POST /contasreceberbxa` | `POST /api/v1/financeiro/baixas-receber` |
| `GET /receberbaixados/{...}` | `GET /api/v1/financeiro/baixas-receber` |
| `DELETE /estornoreceber/{...}` | `POST /api/v1/financeiro/baixas-receber/{id}/estornar` |
| `POST /contasrecebercalcparc` | _(automático no CRUD)_ |
| `GET /dre` | `GET /api/v1/financeiro/dres` |
| `POST /dre` | `POST /api/v1/financeiro/dres` |
| `GET /dremov/{...}` | `GET /api/v1/financeiro/dres/{id}/movimentacoes` |
| `POST /ccorrentetransf` | `POST /api/v1/financeiro/transferencias` |
| `GET /transffinanceiras/{...}` | `GET /api/v1/financeiro/transferencias` |
| `GET /parfinpag/{idEmpresa}` | `GET /api/v1/financeiro/parametros-pagar` |
| `GET /parfinrec/{idEmpresa}` | `GET /api/v1/financeiro/parametros-receber` |
| `GET /parfincxa/{idEmpresa}` | `GET /api/v1/financeiro/parametros-caixa` |
| `GET /parfinbxa/{idEmpresa}` | `GET /api/v1/financeiro/parametros-baixa` |
| `GET /historicocontabil` | `GET /api/v1/contabil/historicos` |
| `POST /historicocontabil` | `POST /api/v1/contabil/historicos` |
| `GET /pagarreceber/{idempresa}` | `GET /api/v1/financeiro/dashboard/pagar-receber` |
| `GET /saldosbancario/{idempresa}` | `GET /api/v1/financeiro/dashboard/saldos-bancarios` |
| `GET /fluxocaixamensal/{idempresa}` | `GET /api/v1/financeiro/dashboard/fluxo-caixa-mensal` |
| `GET /fluxocaixadiario/{idempresa}` | `GET /api/v1/financeiro/dashboard/fluxo-caixa-diario` |
| `GET /pagrecdocloc/{idempresa}` | `GET /api/v1/financeiro/dashboard/pag-rec-doc-local` |

### Estoque e Produtos
| THorse | PHP |
|--------|-----|
| `GET /produto` | `GET /api/v1/estoque/produtos` |
| `GET /produto/{id}` | `GET /api/v1/estoque/produtos/{id}` |
| `POST /produto` | `POST /api/v1/estoque/produtos` |
| `PUT /produto/{id}` | `PUT /api/v1/estoque/produtos/{id}` |
| `DELETE /produto/{id}` | `DELETE /api/v1/estoque/produtos/{id}` |
| `GET /marca` | `GET /api/v1/estoque/marcas` |
| `POST /marca` | `POST /api/v1/estoque/marcas` |
| `GET /medida` | `GET /api/v1/estoque/medidas` |
| `GET /garantia` | `GET /api/v1/estoque/garantias` |
| `GET /cor` | `GET /api/v1/estoque/cores` |
| `POST /cor` | `POST /api/v1/estoque/cores` |
| `GET /classe` | `GET /api/v1/estoque/classes` |
| `POST /classe` | `POST /api/v1/estoque/classes` |
| `GET /grupo` | `GET /api/v1/estoque/grupos` |
| `POST /grupo` | `POST /api/v1/estoque/grupos` |
| `GET /subgrupo/{idgrupo}` | `GET /api/v1/estoque/subgrupos` |
| `POST /subgrupo/{idgrupo}` | `POST /api/v1/estoque/subgrupos` |
| `GET /almoxarifado/{idemp}` | `GET /api/v1/estoque/almoxarifados` |
| `POST /almoxarifado` | `POST /api/v1/estoque/almoxarifados` |
| `GET /localizacao/{idEmpresa}` | `GET /api/v1/estoque/localizacoes` |
| `POST /localizacao` | `POST /api/v1/estoque/localizacoes` |
| `GET /grade/{idEmp}/{idProduto}` | `GET /api/v1/estoque/grades` |
| `POST /grade` | `POST /api/v1/estoque/grades` |
| `GET /proemb/{produtoId}` | `GET /api/v1/estoque/produtos/{id}/embalagens` |
| `POST /proemb` | `POST /api/v1/estoque/produtos/{id}/embalagens` |
| `GET /profor/{idProduto}` | `GET /api/v1/estoque/produtos/{id}/fornecedores` |
| `POST /profor` | `POST /api/v1/estoque/produtos/{id}/fornecedores` |
| `GET /prosim/{idProduto}` | `GET /api/v1/estoque/produtos/{id}/similares` |
| `POST /prosim` | `POST /api/v1/estoque/produtos/{id}/similares` |
| `GET /protrib/{idEmpresa}` | `GET /api/v1/estoque/produtos/{id}/tributos` |
| `POST /protrib` | `POST /api/v1/estoque/produtos/{id}/tributos` |
| `GET /proalmox/{...}` | `GET /api/v1/estoque/produtos/{id}/saldo-almoxarifado` |
| `GET /profoto/{idProduto}` | `GET /api/v1/estoque/produtos/{id}/fotos` |
| `POST /profoto` | `POST /api/v1/estoque/produtos/{id}/fotos` |
| `GET /entrada/{idEmpresa}` | `GET /api/v1/estoque/entradas` |
| `POST /entrada` | `POST /api/v1/estoque/entradas` |
| `PUT /entrada/{idEmpresa}/{id}` | `PUT /api/v1/estoque/entradas/{id}` |
| `DELETE /entrada/{idEmpresa}/{id}` | `DELETE /api/v1/estoque/entradas/{id}` |
| `GET /devcompra/{idEmpresa}` | `GET /api/v1/estoque/devolucoes-compra` |
| `POST /devcompra` | `POST /api/v1/estoque/devolucoes-compra` |
| `GET /inventario/{idEmpresa}` | `GET /api/v1/estoque/inventarios` |
| `POST /inventario` | `POST /api/v1/estoque/inventarios` |
| `GET /inventarioitem/{...}` | `GET /api/v1/estoque/inventarios/{id}/itens` |
| `POST /inventarioitem/{...}` | `POST /api/v1/estoque/inventarios/{id}/itens` |
| `GET /transfalmox/{idemp}` | `GET /api/v1/estoque/transferencias-almox` |
| `POST /transfalmox/env` | `POST /api/v1/estoque/transferencias-almox` |
| `POST /transfalmox/rec` | `POST /api/v1/estoque/transferencias-almox/{id}/receber` |
| `GET /formula/{emp}` | `GET /api/v1/formulas` |
| `POST /formula` | `POST /api/v1/formulas` |
| `POST /formula/valida/{emp}` | `POST /api/v1/formulas/validar` |
| `GET /aliquotauf/{emp}` | `GET /api/v1/estoque/aliquotas-uf` |
| `POST /aliquotauf/{emp}` | `POST /api/v1/estoque/aliquotas-uf` |
| `GET /nbs` | `GET /api/v1/manutencao/nbs` |

### Pessoas, Empresa, Usuários
| THorse | PHP |
|--------|-----|
| `GET /pessoa` | `GET /api/v1/manutencao/pessoas` |
| `POST /pessoa` | `POST /api/v1/manutencao/pessoas` |
| `PUT /pessoa/{id}` | `PUT /api/v1/manutencao/pessoas/{id}` |
| `DELETE /pessoa/{id}` | `DELETE /api/v1/manutencao/pessoas/{id}` |
| `GET /pessoacli/{idEmpresa}` | `GET /api/v1/manutencao/pessoas?tipo=cliente` |
| `GET /pessoafor/{idEmpresa}` | `GET /api/v1/manutencao/pessoas?tipo=fornecedor` |
| `GET /empresa` | `GET /api/v1/empresas` |
| `POST /empresa` | `POST /api/v1/empresas` |
| `PUT /empresa/{id}` | `PUT /api/v1/empresas/{id}` |
| `DELETE /empresa/{id}` | `DELETE /api/v1/empresas/{id}` |
| `GET /usuario` | `GET /api/v1/manutencao/usuarios` |
| `GET /grupousuario` | `GET /api/v1/manutencao/grupos-usuario` |
| `POST /grupousuario` | `POST /api/v1/manutencao/grupos-usuario` |
| `GET /useraccess/{idEmpresa}` | `GET /api/v1/manutencao/grupos-usuario/{id}/programas` |
| `POST /grupousuarioprog` | `POST /api/v1/manutencao/grupos-usuario/{id}/programas` |

### Vendas
| THorse | PHP |
|--------|-----|
| `GET /mpo` | `GET /api/v1/vendas/motivos-perda` |
| `POST /mpo` | `POST /api/v1/vendas/motivos-perda` |
| `GET /terminalven/{idEmpresa}` | `GET /api/v1/vendas/terminais` |
| `POST /terminalven/{idEmpresa}` | `POST /api/v1/vendas/terminais` |
| `GET /ambiente/{idEmpresa}` | `GET /api/v1/vendas/ambientes` |
| `POST /ambiente/{idEmpresa}` | `POST /api/v1/vendas/ambientes` |

### Integrações, Agenda, etc.
| THorse | PHP |
|--------|-----|
| `GET /integracoes/api-externa` | `GET /api/v1/integracoes/api-externa` |
| `POST /integracoes/api-externa` | `POST /api/v1/integracoes/api-externa` |
| `GET /integracoes/loja` | `GET /api/v1/integracoes/loja` |
| `POST /integracoes/loja` | `POST /api/v1/integracoes/loja` |
| `GET /agendacontatonot` | `GET /api/v1/agendas/notificacoes` |
| `POST /agendacontatonot` | `POST /api/v1/agendas/notificacoes` |
| `GET /agendacontato` | `GET /api/v1/agendas/contatos` |
| `POST /agendacontato` | `POST /api/v1/agendas/contatos` |

---

## Estratégia de Migração

### Abordagem: Módulo a Módulo (Big Bang controlado)

1. **Setup inicial:** Configurar apiPhp.js + interceptors (Etapa 0)
2. **Autenticação primeiro:** Migrar login/logout/me (Etapa 1)
3. **Tabelas auxiliares:** Migrar endpoints de lookup (Etapa 2)
4. **Financeiro:** Módulo mais crítico — fazer isoladamente (Etapa 3)
5. **Produtos:** Segundo módulo mais crítico (Etapa 4)
6. **Demais módulos:** Pessoas, Vendas, Integrações, etc. (Etapas 5-7)
7. **Cleanup:** Remover código THorse (Etapa 8)

### Riscos

| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| **id_empresa removido da URL** | Quebra em todos os endpoints | Verificar JWT claim `id_empresa` |
| **Mascaramento LGPD** | Listagens com dados parciais | Adaptar máscaras no frontend |
| **2 formatos de erro 422** | Validadores quebram | Criar parser unificado |
| **Parcelas automáticas** | Fluxo de cálculo de parcelas | Remover chamada `calcparc` |
| **Nomes de campos diferentes** | Payloads incompatíveis | Mapear campos um a um |
| **Cookie httpOnly** | Sessão expira com cookie | Garantir fallback Bearer token |

### Dependências entre Etapas

```
Etapa 0 (Setup Infra)
    │
    ▼
Etapa 1 (Autenticação) ← sem isso nada funciona
    │
    ▼
Etapa 2 (Tabelas Auxiliares) ← lookup básico
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
    ▼
Etapa 8 (Cleanup THorse)
```

As Etapas 3-7 podem ser feitas **em paralelo** por diferentes devs.

---

## Convenções da Nova API (verificar na OpenAPI)

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
