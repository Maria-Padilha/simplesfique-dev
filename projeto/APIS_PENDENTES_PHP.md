# APIs Pendentes no Backend PHP

> Endpoints que existem no THorse mas ainda **não estão documentados ou implementados** na nova API PHP.
> Gerado automaticamente de `projeto/apis-pendentes.json` — não editar manualmente.
> Última atualização: 2026-06-16

---

## Legenda de status

| Status | Significado |
|--------|-------------|
| ⏳ Aguardando backend | Não existe na API PHP — reportar ao time de backend |
| 🔄 Automático no CRUD | PHP trata internamente, sem endpoint próprio |
| ✅ Confirmado | Backend confirmou que vai implementar |
| ❌ Descartado | Não será implementado |

---

## Financeiro

### Caixas

| THorse endpoint | Observação | Etapa | Status |
|----------------|------------|-------|--------|
| `GET /caixahistmov/{idEmpresa}` | Histórico de movimentação do caixa | 3.3 | ⏳ Aguardando backend |
| `GET /caixausu/{idEmpresa}/id/{idCaixa}` | Usuários vinculados ao caixa | 3.3 | ⏳ Aguardando backend |

### Contas a Pagar

| THorse endpoint | Observação | Etapa | Status |
|----------------|------------|-------|--------|
| `POST /contaspagar/autorizar` | Autorização de pagamento | 3.4 | ⏳ Aguardando backend |
| `POST /contaspagarcalcparc` | Cálculo de parcelas — automático no CRUD PHP, remover da view futuramente | 3.4 | 🔄 Automático no CRUD |

### Contas a Receber

| THorse endpoint | Observação | Etapa | Status |
|----------------|------------|-------|--------|
| `POST /contasrecebercalcparc` | Cálculo de parcelas — automático no CRUD PHP, remover da view futuramente | 3.5 | 🔄 Automático no CRUD |

### Parâmetros

| THorse endpoint | Observação | Etapa | Status |
|----------------|------------|-------|--------|
| `GET /parfinbxa/{idEmpresa}` | Parâmetros financeiros de baixas | 3.8 | ⏳ Aguardando backend |

### Transferências

| THorse endpoint | Observação | Etapa | Status |
|----------------|------------|-------|--------|
| `POST /ccorrentetransf` | Transferência entre contas correntes | 3.9 | ⏳ Aguardando backend |
| `GET /transffinanceiras/{...}` | Listagem de transferências financeiras | 3.9 | ⏳ Aguardando backend |

## Adiantamentos

| THorse endpoint | Observação | Etapa | Status |
|----------------|------------|-------|--------|
| `POST /adtfornecedorpagto/{id}` | Pagamento de adiantamento fornecedor | 3.7 | ⏳ Aguardando backend |
| `PUT /adtfornecedoraprova/{id}` | Aprovação de adiantamento fornecedor | 3.7 | ⏳ Aguardando backend |

## Estoque

### Produtos

| THorse endpoint | Observação | Etapa | Status |
|----------------|------------|-------|--------|
| `GET /medida` | Unidades de medida | 4.2 | ⏳ Aguardando backend |
| `GET /proalmox/{...}` | Produto por almoxarifado | 4.3 | ⏳ Aguardando backend |
| `GET /profoto/{idProduto}` | Fotos do produto | 4.3 | ⏳ Aguardando backend |
| `GET /aliquotauf/{emp}` | Alíquotas por UF | 4.7 | ⏳ Aguardando backend |

### Transferência Almoxarifado

| THorse endpoint | Observação | Etapa | Status |
|----------------|------------|-------|--------|
| `GET /transfalmox/{idemp}` | Listar transferências almoxarifado | 4.6 | ⏳ Aguardando backend |
| `POST /transfalmox/env` | Enviar transferência almoxarifado | 4.6 | ⏳ Aguardando backend |
| `POST /transfalmox/rec` | Receber transferência almoxarifado | 4.6 | ⏳ Aguardando backend |

## Vendas

### PDV

| THorse endpoint | Observação | Etapa | Status |
|----------------|------------|-------|--------|
| `GET /mpo` | Motivos de perda | 6.1 | ⏳ Aguardando backend |
| `POST /mpo` | Criar motivo de perda | 6.1 | ⏳ Aguardando backend |
| `GET /terminalven/{idEmpresa}` | Terminais de venda | 6.1 | ⏳ Aguardando backend |
| `POST /terminalven/{idEmpresa}` | Criar terminal de venda | 6.1 | ⏳ Aguardando backend |
| `GET /ambiente/{idEmpresa}` | Ambientes PDV | 6.1 | ⏳ Aguardando backend |
| `POST /ambiente/{idEmpresa}` | Criar ambiente PDV | 6.1 | ⏳ Aguardando backend |

## Dashboard

| THorse endpoint | Observação | Etapa | Status |
|----------------|------------|-------|--------|
| `GET /pagarreceber/{idempresa}` | Resumo pagar/receber | 8 | ⏳ Aguardando backend |
| `GET /saldosbancario/{idempresa}` | Saldos bancários | 8 | ⏳ Aguardando backend |
| `GET /fluxocaixamensal/{idempresa}` | Fluxo de caixa mensal | 8 | ⏳ Aguardando backend |
| `GET /fluxocaixadiario/{idempresa}` | Fluxo de caixa diário | 8 | ⏳ Aguardando backend |
| `GET /pagrecdocloc/{idempresa}` | Pagar/receber por local de cobrança | 8 | ⏳ Aguardando backend |

---

## Resumo

| Status | Qtd |
|--------|-----|
| ⏳ Aguardando backend | 26 |
| 🔄 Automático no CRUD | 2 |
| **Total** | **28** |
