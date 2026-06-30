# Novas Rotas Descobertas na Documentação OpenAPI

Rotas que existem na API PHP mas ainda não foram migradas nas stores.
Descobertas em 16/06/2026 via `http://192.168.10.51:8000/docs/openapi.yaml`.

## Financeiro (migráveis agora)
| Rota PHP | Método | Store Alvo | Prioridade |
|----------|--------|------------|------------|
| `/financeiro/adiantamento-clientes` | GET/POST | `adiantamento.js` | Alta |
| `/financeiro/adiantamento-clientes/{id}` | GET/PUT/DELETE | `adiantamento.js` | Alta |
| `/financeiro/adiantamento-colaboradors` | GET/POST | `adiantamento.js` | Alta |
| `/financeiro/adiantamento-colaboradors/{id}` | GET/PUT/DELETE | `adiantamento.js` | Alta |
| `/financeiro/adiantamento-fornecedors` | GET/POST | `adiantamento.js` | Alta |
| `/financeiro/adiantamento-fornecedors/{id}` | GET/PUT/DELETE | `adiantamento.js` | Alta |
| `/financeiro/tipo-documentos` | GET/POST | `financeiro.js` | Média |
| `/financeiro/tipo-documentos/{id}` | GET/PUT/DELETE | `financeiro.js` | Média |
| `/financeiro/parametros-financeiros-pagars/{idEmpresa}` | GET | `config.js` | Alta |
| `/financeiro/parametros-financeiros-recebers/{idEmpresa}` | GET | `config.js` | Alta |
| `/financeiro/parametros-financeiros-caixas/{idEmpresa}` | GET | `config.js` | Alta |
| `/financeiro/carteira-cobrancas/{idBanco}/{idCarteira}` | GET | `financeiro.js` | Baixa |
| `/financeiro/parcela-pagars` | GET/POST | `financeiro.js` | Média |
| `/financeiro/parcela-pagars/{idEmpresa}/{id}` | GET/PUT | `financeiro.js` | Média |
| `/financeiro/parcela-pagars/{idEmpresa}/{id}/cancelar` | POST | `financeiro.js` | Média |
| `/financeiro/parcela-recebers` | GET/POST | `financeiro.js` | Média |
| `/financeiro/parcela-recebers/{idEmpresa}/{id}` | GET/PUT | `financeiro.js` | Média |
| `/financeiro/parcela-recebers/{idEmpresa}/{id}/cancelar` | POST | `financeiro.js` | Média |
| `/financeiro/baixa-pagars` | GET/POST | `financeiro.js` | Média |
| `/financeiro/baixa-pagars/{id}` | GET | `financeiro.js` | Média |
| `/financeiro/baixa-pagars/{id}/estornar` | POST | `financeiro.js` | Média |
| `/financeiro/baixa-recebers` | GET/POST | `financeiro.js` | Média |
| `/financeiro/baixa-recebers/{id}` | GET | `financeiro.js` | Média |
| `/financeiro/baixa-recebers/{id}/estornar` | POST | `financeiro.js` | Média |
| `/financeiro/centro-custo-parametros` | GET/POST | `financeiro.js` | Média |
| `/financeiro/centro-custo-parametros/parametro` | GET | `financeiro.js` | Média |
| `/financeiro/local-cobrancas` | GET/POST | `financeiro.js` | Baixa |
| `/financeiro/local-cobrancas/{id}` | GET/PUT/DELETE | `financeiro.js` | Baixa |
| `/financeiro/historico-bancarios` | GET | `financeiro.js` | Baixa |
| `/financeiro/historico-caixas` | GET | `financeiro.js` | Baixa |

## Estoque (migráveis agora)
| Rota PHP | Método | Store Alvo | Prioridade |
|----------|--------|------------|------------|
| `/estoque/produto-embalagens` | GET/POST | `produtos.js` | Média |
| `/estoque/produto-embalagens/{idProduto}/{id}` | PUT/DELETE | `produtos.js` | Média |
| `/estoque/produto-fornecedors` | GET/POST | `produtos.js` | Média |
| `/estoque/produto-fornecedors/{idProduto}/{idPessoa}` | PUT/DELETE | `produtos.js` | Média |
| `/estoque/produto-grupo-tributos` | GET/POST | `produtos.js` | Média |
| `/estoque/produto-grupo-tributos/{idEmpresa}/{idProduto}` | GET | `produtos.js` | Média |
| `/estoque/produto-grupo-tributos/{idEmpresa}/{idProduto}/{idGrupoTributo}` | DELETE | `produtos.js` | Média |
| `/estoque/produto-kits` | GET/POST | `produtos.js` | Baixa |
| `/estoque/produto-kits/{idProduto}/{id}` | PUT/DELETE | `produtos.js` | Baixa |
| `/estoque/produto-similars` | GET/POST | `produtos.js` | Baixa |
| `/estoque/produto-similars/{idProduto}/{idSimilar}` | PUT/DELETE | `produtos.js` | Baixa |
| `/estoque/produto-precos` | GET/POST | `produtos.js` | Média |
| `/estoque/produto-precos/{idEmpresa}/{idProduto}` | GET | `produtos.js` | Média |
| `/estoque/produto-tributos/{idEmpresa}/{idProduto}` | GET | `produtos.js` | Média |
| `/estoque/entrada-itens` | GET/POST | `produtos.js` | Média |
| `/estoque/entrada-itens/{idEntrada}/{idSeq}` | PUT/DELETE | `produtos.js` | Média |
| `/estoque/entrada-tributos/{idEntrada}` | GET | `produtos.js` | Média |
| `/estoque/devolucao-compra-itens` | GET/POST | `produtos.js` | Média |
| `/estoque/devolucao-compra-itens/{idDevcompra}/{idSeq}` | PUT/DELETE | `produtos.js` | Média |
| `/estoque/devolucao-compra-tributos/{idDevcompra}` | GET | `produtos.js` | Média |
| `/estoque/entradas/{idEmpresa}/{id}/cancelar` | POST | `produtos.js` | Média |
| `/estoque/devolucao-compras/{idEmpresa}/{id}/cancelar` | POST | `produtos.js` | Média |
| `/estoque/inventarios/{idEmpresa}/{id}/cancelar` | POST | `inventario.js` | Média |

## Auth (migráveis agora)
| Rota PHP | Método | Store Alvo | Prioridade |
|----------|--------|------------|------------|
| `/auth/me` | GET | `api.js` | Alta |
| `/auth/logout` | POST | `api.js` | Alta |
| `/auth/registrar` | POST | `api.js` | Baixa |

## Manutenção (migráveis agora)
| Rota PHP | Método | Store Alvo | Prioridade |
|----------|--------|------------|------------|
| `/manutencao/atividades` | GET | `pessoas.js` | Baixa |
| `/manutencao/bairros` | GET | - | Baixa |
| `/manutencao/base-grupo-tributos` | GET | `estoque.js` | Média |
| `/manutencao/certificados` | GET | `produtos.js` | Baixa |
| `/manutencao/cfops/{idCfop}` | GET | `estoque.js` | Média |
| `/manutencao/classe-pessoas` | GET | `pessoas.js` | Baixa |
| `/manutencao/departamentos` | GET | - | Baixa |
| `/manutencao/feriados` | GET | - | Baixa |
| `/manutencao/formula-variaveis` | GET/POST | `estoque.js` | Baixa |
| `/manutencao/formulas/{idEmpresa}/{id}/compilar` | POST | `estoque.js` | Baixa |
| `/manutencao/formulas/{idEmpresa}/{id}/validar` | POST | `estoque.js` | Baixa |
| `/manutencao/grupo-usuario-programas` | GET/POST | `grupousuario.js` | Média |
| `/manutencao/mensagens` | GET/POST | - | Baixa |
| `/manutencao/saas/verificar/{token}` | GET | `api.js` | Alta |
| `/manutencao/ws-cnpj/{cnpj}` | GET | - | Baixa |
| `/manutencao/usuario-empresas` | GET/POST | `empresa.js` | Média |
| `/manutencao/ufs` | GET | - | Baixa |

## Dashboard
Nenhum endpoint de dashboard encontrado na API PHP.

## Vendas
| Rota PHP | Método | Store Alvo | Prioridade |
|----------|--------|------------|------------|
| `/vendas/cupom-fiscal` | GET/POST | `vendas.js` | Média |
| `/vendas/cupom-fiscal/{idEmpresa}/{id}` | GET/PUT/DELETE | `vendas.js` | Média |
| `/vendas/cupom-fiscal/{idEmpresa}/{id}/cancelar` | POST | `vendas.js` | Média |
| `/vendas/cupom-fiscal/calcular` | POST | `vendas.js` | Média |
| `/vendas/cupom-fiscal/emitir` | POST | `vendas.js` | Média |

## Resumo
- **Total de novas rotas descobertas**: ~90 endpoints
- **Stores que podem ser parcial/ total desbloqueadas**: `adiantamento.js`, `config.js` (parcial), `financeiro.js` (resquícios)
- **Ainda sem PHP**: `dashboard.js` (0 rotas), `transfalmox.js` (0 rotas), `vendas.js` (só cupom fiscal)
