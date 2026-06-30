# Design: Scripts de Testes Manuais — Módulo Financeiro

**Data:** 2026-06-30  
**Escopo:** 16 telas do módulo financeiro  
**Objetivo:** Criar checklists de testes manuais (caminho feliz) para cada tela do módulo financeiro do SimplesFique.

---

## Contexto

O módulo financeiro possui 16 telas distribuídas em 4 grupos:
- **Banco:** Conta Corrente, Carteira de Cobrança, Movimentação, Transferências
- **Caixa:** Caixa, Abertura de Caixa, Lançamentos do Caixa
- **Pagar:** Contas a Pagar, Baixa de Pagamentos, Autorização de Pagamentos, Centro de Custo, Débitos Realizados, Lançamento de Colaborador, Previsão de Débitos
- **Receber:** Contas a Receber, Baixa de Recebimentos

## Decisões de Design

- **Formato:** Checklist Markdown com checkboxes `[ ]`
- **Escopo:** Caminho feliz (happy path) apenas — CRUD básico + fluxos principais
- **Organização:** 4 arquivos em `docs/tests/financeiro/`, um por grupo
- **Localização:** `docs/tests/financeiro/{banco,caixa,pagar,receber}.md`

## Estrutura por Tela

Cada tela seguirá o template:

```markdown
## [Nome da Tela]
**Rota:** Financeiro > [Caminho]
**ID do Programa:** [FFIN###X]
**Pré-condições:** [dados necessários antes de testar]

### Checklist
- [ ] Acessa tela sem erro (permissão visualizar)
- [ ] Listagem carrega dados existentes
- [ ] [Campos e fluxos específicos da tela...]
- [ ] Exportar/Imprimir funciona (quando aplicável)
```

## Mapeamento de Telas

### BANCO

#### Conta Corrente (FFIN001C)
Campos formulário: Número da Conta, Dígito, Titular, Banco, Agência, Plano de Conta, Limite, Data Abertura, Data Venc. Limite, Gerente, Telefone, Tipo Chave PIX, Chave PIX  
Fluxos especiais: Gerenciar Usuários por conta, Configurar Chaves de API (PIX/Cobrança/Webhook)

#### Carteira de Cobrança
Campos formulário: Código da Carteira, Conta Corrente, API Token, Usuário, Senha, Nosso Número, Convênio, Dias Devolução, Dias Protesto/Negativação, Tipo Dia Protesto, Alertas, Senha Boleto, Modelo Boleto, Local de Pagamento, Instruções

#### Movimentação Bancária
Campos formulário: Conta Bancária, Valor, Tipo (Entrada/Saída), Histórico, Número Documento, Data Lançamento, Plano de Conta, Histórico Contábil, Observação, Rateio CC  
Filtros: Conta, Período, Data Início/Fim  
Tabela: Data, Nr Documento, Histórico, Usuário, Entrada, Saída, Saldo, Observação

#### Transferências
Fluxo: Selecionar tipo de transferência e executar

### CAIXA

#### Caixa (FFIN002C)
Campos formulário: Descrição, Participa Fluxo (S/N), Plano de Conta  
Fluxo especial: Gerenciar Usuários por caixa (vincular/desvincular com checkbox de permissão)

#### Abertura de Caixa
Campos formulário: Caixa, Data de Abertura, Hora de Abertura, Valor Inicial  
Fluxo especial: Encerrar caixa aberto  
Tabela: Data, Aberto em, Fechado em, Conferido, Sistema, Diferença, Situação

#### Lançamentos do Caixa (FFIN204E)
Campos formulário: Caixa, Data (readonly — vem da abertura), Valor, Plano de Conta, Tipo Documento, Número Documento, Histórico Caixa, Histórico Contábil, Tipo (+/-), Tipo Pagamento/Recebimento, Observação, Rateio CC (se Saída)  
Filtros: Caixa + Data Inicial + Data Final (obrigatórios)  
Tabela: Nr Documento, Dt Mov., Complemento, Entrada, Saída, Saldo, Origem, Tipo Pagamento, Observação  
Resumo: Saldo Anterior, Total Entradas, Total Saídas, Saldo Final  
Exportação: PDF, CSV, Excel, Impressão

### PAGAR

#### Contas a Pagar (FFIN205E)
Campos formulário: Nr Documento*, Série, Espécie, Tipo Documento*, Fornecedor*, Plano de Conta*, Histórico Contábil, Valor Original*, Qtd Parcelas, Data Emissão*, Juros, Multa, Desconto  
Parcelas: Parcela, Data Vencimento, Valor, Local Cobrança, Observação  
Rateio CC: Centro, Valor R$, Porcentagem %  
Fluxo especial: Importar XML NFe/NFSe  
Tabela expandível: clica na linha para ver parcelas

#### Baixa de Pagamentos (FFIN207E)
Filtros obrigatórios: Data Início + Data Fim (via BuscaAvancadaBaixa)  
Tipo de Baixa: Banco ou Caixa (select no topo)  
Tabela com campos editáveis inline: Juros, Multa, Desconto, Vlr a Pagar  
Fluxo: selecionar parcelas → Baixar → preencher modal (data + banco/caixa) → confirmar

#### Autorização de Pagamentos
Filtros: BuscaAvancada  
Tabela: Selecionar, Documento, Série, Espécie, Parcela, Vencimento, Fornecedor, Vlr Parcela...  
Fluxo: selecionar parcelas → Autorizar (com observação opcional) ou Rejeitar (com motivo obrigatório)

#### Centro de Custo
Campos: Classificação*, Descrição*  
Simples CRUD

#### Débitos Realizados por CC
Filtros: Período (atalho), Data Inicial, Data Final  
Tabela dinâmica: Centro de Custo + colunas por data + Total

#### Lançamento da Conta do Colaborador
Campos: Nr Documento, Tipo Movimento*, Tipo Documento, Colaborador*, Plano de Conta, Histórico Contábil, Valor Face*, Dt Lançamento*, Juros, Valor Total, Tipo Pagamento/Recebimento, Caixa, Histórico Caixa, Conta Corrente, Histórico Bancário, Observação  
Parcelas: Qtd, 1º Vencimento, Intervalo  
Filtros pesquisa: Tipo Período, Data Inicial, Data Final, Colaborador

#### Previsão de Débitos por CC
Filtros: Centro de Custo, Período, Data Inicial, Data Final  
Tabela dinâmica: Centro de Custo + colunas por data + Total

### RECEBER

#### Contas a Receber (FFIN210E)
Idêntico ao Contas a Pagar mas para receitas: Cliente em vez de Fornecedor, sem XML import  
Fluxo especial: Gerar Boleto (selecionar parcelas + escolher Carteira de Cobrança)

#### Baixa de Recebimentos (FFIN211E)
Idêntico à Baixa de Pagamentos mas para recebimentos: campo "Vlr a Receber" em vez de "Vlr a Pagar", "Cliente" em vez de "Fornecedor"

## Arquivos a Criar

```
docs/tests/financeiro/
├── banco.md
├── caixa.md
├── pagar.md
└── receber.md
```

## Dependências Importantes

- Conta Corrente precisa existir para: Movimentação, Carteira, Baixa por Banco
- Caixa precisa estar cadastrado para: Abertura, Lançamentos
- Caixa precisa estar aberto para: Lançamentos do Caixa (buscar caixas abertos)
- Centro de Custo precisa existir para: Rateio em Pagar/Receber/Lançamentos
- Plano de Conta precisa existir para: Conta Corrente, Caixa, Contas a Pagar/Receber, Lançamentos
- Fornecedor precisa existir para: Contas a Pagar
- Cliente precisa existir para: Contas a Receber
- Colaborador precisa existir para: Lançamento de Colaborador
