# Financeiro: Scripts de Testes Manuais — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar 4 arquivos Markdown com checklists de testes manuais (caminho feliz) para as 16 telas do módulo financeiro do SimplesFique.

**Architecture:** 4 arquivos estáticos em `docs/tests/financeiro/`, um por grupo de telas (banco, caixa, pagar, receber). Cada tela tem pré-condições e uma lista de checkboxes com os passos do caminho feliz.

**Tech Stack:** Markdown

## Global Constraints

- Escopo: caminho feliz (happy path) apenas — sem validações de campos obrigatórios, sem casos limites
- Formato: checkboxes `- [ ]` para cada passo
- Cada tela inclui: Rota no menu, ID do Programa (quando disponível), Pré-condições, Checklist
- Sem código ou lógica — apenas documentação de passos manuais

---

## Arquivos a Criar

| Arquivo | Telas cobertas |
|---|---|
| `docs/tests/financeiro/banco.md` | Conta Corrente, Carteira de Cobrança, Movimentação, Transferências |
| `docs/tests/financeiro/caixa.md` | Caixa, Abertura de Caixa, Lançamentos do Caixa |
| `docs/tests/financeiro/pagar.md` | Contas a Pagar, Baixa de Pagamentos, Autorização de Pagamentos, Centro de Custo, Débitos Realizados, Lançamento de Colaborador, Previsão de Débitos |
| `docs/tests/financeiro/receber.md` | Contas a Receber, Baixa de Recebimentos |

---

## Task 1: banco.md — Telas do grupo Banco

**Files:**
- Create: `docs/tests/financeiro/banco.md`

- [ ] **Step 1: Criar o arquivo `docs/tests/financeiro/banco.md`**

Conteúdo completo:

```markdown
# Testes Manuais — Banco

> Escopo: caminho feliz (happy path). Execute cada checklist de forma independente.

---

## Conta Corrente
**Rota:** Financeiro > Banco > Contas Corrente  
**ID do Programa:** FFIN001C  
**Pré-condições:** Existir pelo menos um Banco cadastrado; existir Plano de Conta cadastrado; existir Agência para o banco escolhido (ou cadastrar via modal durante o teste).

### Checklist
- [ ] Acessa a tela sem erro e sem modal de acesso negado
- [ ] Tabela carrega listagem de contas existentes
- [ ] Clica em "Nova Conta" — formulário expande
- [ ] Preenche: Número da Conta (ex: `12345`), Dígito (`6`), Titular (`Empresa Teste`), Banco (selecionar da lista), Agência (selecionar ou criar nova via ícone), Plano de Conta (selecionar da lista), Limite (`10000.00`), Data Abertura (data de hoje)
- [ ] Clica em "Salvar" — mensagem de sucesso aparece e conta aparece na tabela
- [ ] Clica em editar (lápis) na conta criada — formulário abre preenchido
- [ ] Altera o campo Gerente (ex: `João Silva`) e clica "Atualizar" — alteração refletida na tabela
- [ ] Clica no ícone "Gerenciar Usuários" (ícone de pessoas) — modal abre com lista de usuários
- [ ] Marca/desmarca checkbox de permissão de um usuário e clica "Salvar Permissões" — mensagem de sucesso
- [ ] Clica no ícone "Chaves de API" (ícone de chave) — modal abre
- [ ] Preenche Client ID PIX e Client Secret PIX, seleciona Ambiente "Sandbox (Testes)" e clica "Salvar Chaves" — mensagem de sucesso
- [ ] Clica em excluir (lixeira) na conta criada e confirma — conta some da tabela

---

## Carteira de Cobrança
**Rota:** Financeiro > Banco > Carteira de Cobrança  
**Pré-condições:** Existir pelo menos uma Conta Corrente cadastrada.

### Checklist
- [ ] Acessa a tela sem erro
- [ ] Tabela carrega listagem de carteiras existentes
- [ ] Clica em "Nova Carteira" — formulário expande
- [ ] Preenche: Código da Carteira (ex: `1`), Conta Corrente (selecionar da lista), Convênio (ex: `123456`), Nosso Número (ex: `1`), Dias para Devolução (`30`), Dias para Protesto/Negativação (`10`), Tipo Dia para Protesto (`Dias Úteis`), Modelo de Boleto (`Boleto Simples`)
- [ ] Clica em "Salvar" — mensagem de sucesso e carteira aparece na tabela
- [ ] Clica em editar — formulário abre preenchido com os dados salvos
- [ ] Altera o campo Instruções e clica "Atualizar" — alteração salva
- [ ] Clica em excluir e confirma — carteira some da tabela

---

## Movimentação Bancária
**Rota:** Financeiro > Banco > Movimentação  
**Pré-condições:** Existir Conta Corrente cadastrada; existir Histórico Contábil cadastrado; existir Plano de Conta cadastrado.

### Checklist
- [ ] Acessa a tela sem erro
- [ ] Seleciona uma Conta no filtro, define Data Início e Data Fim, clica "Buscar" — tabela carrega
- [ ] Saldo Anterior e Saldo Final exibidos no topo e rodapé da tabela
- [ ] Clica em "Novo Lançamento" — formulário expande
- [ ] Preenche: Conta Bancária (selecionar), Valor (`500.00`), Tipo (`Entrada`), Histórico (selecionar), Data de Lançamento (data de hoje), Plano de Conta (selecionar)
- [ ] Clica "Salvar" — lançamento aparece na tabela na coluna "Entrada"
- [ ] Cria novo lançamento do tipo "Saída" com valor `200.00` — aparece na coluna "Saída"
- [ ] Saldo é recalculado corretamente após os dois lançamentos
- [ ] Clica em editar (lápis) em um lançamento de origem "MANUAL" — formulário abre preenchido
- [ ] Altera a Observação e clica "Atualizar" — alteração refletida
- [ ] Clica em excluir lançamento de origem "MANUAL" e confirma — lançamento some
- [ ] Clica em "PDF" ou "CSV" — download é iniciado

---

## Transferências
**Rota:** Financeiro > Banco > Transferências  
**Pré-condições:** Existir pelo menos duas Contas Correntes cadastradas.

### Checklist
- [ ] Acessa a tela sem erro
- [ ] Seleciona o Tipo de Transferência (ex: entre contas)
- [ ] Preenche os dados da transferência (conta origem, conta destino, valor, data)
- [ ] Confirma — mensagem de sucesso exibida
```

- [ ] **Step 2: Verificar que o arquivo foi criado corretamente**

Abrir `docs/tests/financeiro/banco.md` e confirmar que as 4 telas estão presentes com checkboxes.

- [ ] **Step 3: Commit**

```bash
git add docs/tests/financeiro/banco.md
git commit -m "docs: adiciona checklist de testes manuais para telas de Banco"
```

---

## Task 2: caixa.md — Telas do grupo Caixa

**Files:**
- Create: `docs/tests/financeiro/caixa.md`

- [ ] **Step 1: Criar o arquivo `docs/tests/financeiro/caixa.md`**

Conteúdo completo:

```markdown
# Testes Manuais — Caixa

> Escopo: caminho feliz (happy path). Execute cada checklist de forma independente.
> **Atenção:** A ordem importa neste grupo. Cadastre o Caixa antes de testar Abertura, e abra o Caixa antes de testar Lançamentos.

---

## Caixa (Cadastro)
**Rota:** Financeiro > Caixa > Caixa  
**ID do Programa:** FFIN002C  
**Pré-condições:** Existir Plano de Conta cadastrado.

### Checklist
- [ ] Acessa a tela sem erro e sem modal de acesso negado
- [ ] Tabela carrega lista de caixas existentes com colunas: ID, Descrição, Participa Fluxo, Ativo, Cadastro
- [ ] Clica em "Novo Caixa" — formulário expande
- [ ] Preenche: Descrição (`Caixa Teste`), Participa Fluxo (`S`), Plano de Conta (selecionar da lista)
- [ ] Clica "Salvar" — mensagem de sucesso e caixa aparece na tabela com status Ativo
- [ ] Clica em editar (lápis) no caixa criado — formulário abre preenchido
- [ ] Altera a Descrição e clica "Salvar" — alteração refletida na tabela
- [ ] Clica no ícone "Gerenciar Usuários" — modal abre com lista de usuários
- [ ] Marca checkbox de permissão para um usuário e clica "Salvar Permissões" — mensagem de sucesso
- [ ] Clica em excluir (lixeira) e confirma — caixa some da tabela

---

## Abertura de Caixa
**Rota:** Financeiro > Caixa > Abertura de Caixa  
**Pré-condições:** Existir pelo menos um Caixa cadastrado e ativo.

### Checklist
- [ ] Acessa a tela sem erro
- [ ] Tabela de aberturas carrega (pode estar vazia na primeira execução)
- [ ] Clica em "Abrir Novo Caixa" — formulário expande
- [ ] Preenche: Caixa (selecionar da lista), Data de Abertura (data de hoje), Hora de Abertura (hora atual), Valor Inicial (`0.00`)
- [ ] Clica "Abrir Caixa" — mensagem de sucesso e abertura aparece na tabela com situação "Aberto"
- [ ] Card de resumo no topo exibe: nome do caixa, data de abertura, saldo inicial
- [ ] Clica no botão de encerrar caixa (ícone de cadeado/fechar) na abertura criada e confirma — situação muda para "Fechado"

---

## Lançamentos do Caixa
**Rota:** Financeiro > Caixa > Lançamentos  
**ID do Programa:** FFIN204E  
**Pré-condições:** Existir Caixa cadastrado e **aberto** (via Abertura de Caixa); existir Histórico de Caixa configurado; existir Tipo de Documento cadastrado; existir Tipo Pagamento/Recebimento cadastrado; existir Plano de Conta cadastrado.

### Checklist
- [ ] Acessa a tela sem erro e sem modal de acesso negado
- [ ] O caixa aberto é selecionado automaticamente no filtro
- [ ] Seleciona Data Inicial e Data Final e clica "Buscar" — tabela carrega
- [ ] Saldo Anterior exibido acima da tabela; Total Entradas, Saídas e Saldo Final exibidos abaixo
- [ ] Clica em "Novo Lançamento" — formulário expande
- [ ] Preenche: Caixa (selecionar), Valor (`100.00`), Plano de Conta (selecionar), Tipo Documento (selecionar), Histórico do Caixa (selecionar), Tipo (`Entrada`), Tipo Pagamento/Recebimento (selecionar)
- [ ] Data de Abertura do Caixa preenchida automaticamente (campo desabilitado)
- [ ] Clica "Salvar" — lançamento aparece na tabela na coluna "Entrada" com valor `R$ 100,00`
- [ ] Cria novo lançamento do tipo "Saída" com valor `40.00` — aparece na coluna "Saída"
- [ ] Total Entradas = R$ 100,00; Total Saídas = R$ 40,00; Saldo Final = Saldo Anterior + 60,00
- [ ] Clica em editar (lápis) no lançamento de origem "CAIXA" — formulário abre preenchido
- [ ] Altera a Observação e clica "Atualizar" — alteração refletida
- [ ] Clica em excluir (lixeira) no lançamento e confirma — lançamento some da tabela
- [ ] Verifica que lançamentos com origem diferente de "CAIXA" têm botões editar/excluir desabilitados (tooltip explica o motivo)
- [ ] Clica em "PDF" — download do relatório é iniciado
- [ ] Clica em "CSV" — download do CSV é iniciado
```

- [ ] **Step 2: Verificar que o arquivo foi criado corretamente**

Abrir `docs/tests/financeiro/caixa.md` e confirmar que as 3 telas estão presentes.

- [ ] **Step 3: Commit**

```bash
git add docs/tests/financeiro/caixa.md
git commit -m "docs: adiciona checklist de testes manuais para telas de Caixa"
```

---

## Task 3: pagar.md — Telas do grupo Pagar

**Files:**
- Create: `docs/tests/financeiro/pagar.md`

- [ ] **Step 1: Criar o arquivo `docs/tests/financeiro/pagar.md`**

Conteúdo completo:

```markdown
# Testes Manuais — Contas a Pagar

> Escopo: caminho feliz (happy path). Execute cada checklist de forma independente.

---

## Centro de Custo
**Rota:** Financeiro > Pagar > Centro de Custo  
**Pré-condições:** Nenhuma.

### Checklist
- [ ] Acessa a tela sem erro
- [ ] Tabela carrega lista de centros de custo existentes com colunas: ID, Classificação, Descrição
- [ ] Clica em "Novo Centro de Custo" — formulário expande
- [ ] Preenche: Classificação (`001`), Descrição (`Administrativo`)
- [ ] Clica "Salvar" — centro aparece na tabela
- [ ] Clica em editar — altera Descrição para `Administrativo Geral` e salva
- [ ] Clica em excluir e confirma — some da tabela

---

## Contas a Pagar
**Rota:** Financeiro > Pagar > Contas a Pagar  
**ID do Programa:** FFIN205E  
**Pré-condições:** Existir Fornecedor cadastrado; existir Tipo de Documento cadastrado; existir Plano de Conta cadastrado; existir Local de Cobrança cadastrado.

### Checklist
- [ ] Acessa a tela sem erro e sem modal de acesso negado
- [ ] Card no topo exibe "Total A Pagar" e quantidade de parcelas
- [ ] Tabela carrega listagem de contas com colunas: Documento, Série, Espécie, Qtd Parcelas, Data Emissão, Fornecedor, Vlr Original, Origem, Tipo Doc, Usuário, Data Inclusão
- [ ] Clica em "Nova Conta a Pagar" — formulário expande
- [ ] Preenche: Nr Documento (`NF-001`), Tipo Documento (selecionar via ícone de busca), Fornecedor (buscar e selecionar), Plano de Conta (selecionar), Valor Original (`1500.00`), Data Emissão (data de hoje), Qtd Parcelas (`1`)
- [ ] Parcela única é gerada automaticamente na tabela de parcelas com o valor total
- [ ] Define Data de Vencimento na parcela e Local de Cobrança
- [ ] Clica "Salvar" — mensagem de sucesso e conta aparece na listagem
- [ ] Clica na linha da conta para expandir — parcelas do documento são exibidas com situação "Aberta"
- [ ] Clica em editar (lápis) — formulário abre preenchido com os dados salvos
- [ ] Altera a Série e clica "Atualizar" — alteração refletida na tabela
- [ ] Testa múltiplas parcelas: Nova Conta, Qtd Parcelas (`3`), Valor Original (`3000.00`) — seção "Configurações das Parcelas" aparece
- [ ] Preenche Valor 1ª Parcela (`1000.00`), Venc. 1ª Parcela (data de hoje), Intervalo (`30` dias) e clica "Calcular Parcelas"
- [ ] Tabela de 3 parcelas aparece com datas e valores corretos
- [ ] Clica "Salvar" — conta com 3 parcelas salva
- [ ] Clica em excluir (lixeira) na conta de 1 parcela e confirma — some da listagem
- [ ] Importar XML: clica "Selecionar arquivo XML", faz upload de um arquivo NFe válido — dados do emitente e valores são extraídos automaticamente
- [ ] Confirma importação — conta criada com dados da nota

---

## Autorização de Pagamentos
**Rota:** Financeiro > Pagar > Autorização de Pagamentos  
**Pré-condições:** Existir Contas a Pagar cadastradas; existir BuscaAvancada configurada com campos de filtro.

### Checklist
- [ ] Acessa a tela sem erro
- [ ] Aplica filtro (data de emissão ou vencimento) — tabela carrega com parcelas a autorizar
- [ ] Tabela exibe colunas: Selecionar, Documento, Série, Espécie, Parcela, Vencimento, Fornecedor, Vlr Parcela, Origem, Tipo Doc, Local Cobrança
- [ ] Seleciona uma parcela via checkbox
- [ ] Clica "Autorizar" — modal abre com campo de Observação (opcional)
- [ ] Preenche observação e confirma — mensagem de sucesso
- [ ] Seleciona outra parcela
- [ ] Clica "Rejeitar" — modal abre com campo Motivo da rejeição (obrigatório)
- [ ] Preenche o motivo e confirma — mensagem de sucesso

---

## Baixa de Pagamentos
**Rota:** Financeiro > Pagar > Baixa de Pagamentos  
**ID do Programa:** FFIN207E  
**Pré-condições:** Existir Contas a Pagar com parcelas em aberto; existir Conta Corrente cadastrada; existir Caixa cadastrado e aberto.

### Checklist
- [ ] Acessa a tela sem erro e sem modal de acesso negado
- [ ] Card no topo exibe: Total de parcelas, Valor total, Selecionados, Valor selecionado
- [ ] Sem filtro aplicado, tabela fica vazia com mensagem orientando aplicar filtros
- [ ] Aplica filtro com Data Início e Data Fim via "Busca Avançada" — tabela carrega
- [ ] Tabela exibe: DT Vencimento, Nr Documento, Nr Parcela, Vlr Parcela, Juros, Multa, Desconto, Vlr Quitado, Vlr Saldo, Vlr a Pagar, Vlr Liberado, Fornecedor
- [ ] Datas de vencimento passadas aparecem em vermelho
- [ ] **Baixa por Banco:**
  - [ ] Seleciona Tipo de Baixa: `Banco`
  - [ ] Marca checkbox de 1 parcela — "Selecionados: 1" e valor atualiza no card
  - [ ] Edita campo "Juros" inline para `5.00` — Valor selecionado atualiza
  - [ ] Clica "Baixar 1 Pagamento(s)" — modal de Baixa por Banco abre
  - [ ] Preenche Data do Pagamento (data de hoje) e seleciona Conta Bancária
  - [ ] Clica "Confirmar" — mensagem de sucesso; parcela some da lista ou aparece como quitada
- [ ] **Baixa por Caixa:**
  - [ ] Seleciona Tipo de Baixa: `Caixa`
  - [ ] Marca checkbox de 1 parcela
  - [ ] Clica "Baixar 1 Pagamento(s)" — modal de Baixa por Caixa abre
  - [ ] Preenche Data do Pagamento e seleciona Caixa
  - [ ] Clica "Confirmar" — mensagem de sucesso
- [ ] Clica "Selecionar Todos" — todas as parcelas visíveis são marcadas
- [ ] Clica "Limpar Seleção" — seleção é desmarcada

---

## Débitos Realizados por Centro de Custo
**Rota:** Financeiro > Pagar > Débitos Realizados  
**Pré-condições:** Existir lançamentos com rateio por Centro de Custo realizados.

### Checklist
- [ ] Acessa a tela sem erro
- [ ] Seleciona Período via atalho (ex: "Esse Mês") — datas são preenchidas automaticamente
- [ ] Tabela carrega com Centro de Custo nas linhas e datas nas colunas
- [ ] Coluna "Total" exibe a soma por centro de custo
- [ ] Altera o Período para "Esse Ano" — tabela recarrega com novo intervalo

---

## Lançamento da Conta do Colaborador
**Rota:** Financeiro > Pagar > Lançamento Colaborador  
**Pré-condições:** Existir Colaborador cadastrado; existir Tipo de Documento; existir Tipo Movimento; existir Tipo Pagamento/Recebimento; existir Plano de Conta.

### Checklist
- [ ] Acessa a tela sem erro
- [ ] Formulário de novo lançamento está visível
- [ ] Preenche: Tipo Movimento (selecionar), Colaborador (buscar e selecionar), Valor Face (`800.00`), Dt Lançamento (data de hoje)
- [ ] Preenche Qtd Parcelas (`1`), 1º Vencimento (data de hoje + 30 dias)
- [ ] Tabela de parcelas aparece com 1 linha
- [ ] Clica "Salvar" — mensagem de sucesso
- [ ] Preenche filtros de pesquisa: Data Inicial + Data Final (mês atual) e busca — lista carrega com o lançamento criado
- [ ] Clica em editar o lançamento — formulário abre preenchido
- [ ] Altera a Observação e salva — alteração refletida
- [ ] Clica em excluir e confirma — lançamento some da lista

---

## Previsão de Débitos por Centro de Custo
**Rota:** Financeiro > Pagar > Previsão de Débitos  
**Pré-condições:** Existir lançamentos futuros com rateio por Centro de Custo.

### Checklist
- [ ] Acessa a tela sem erro
- [ ] Seleciona Período via atalho (ex: "Esse Mês")
- [ ] Tabela carrega com Centro de Custo nas linhas e datas futuras nas colunas
- [ ] Filtra por um Centro de Custo específico — tabela exibe apenas aquele centro
- [ ] Coluna "Total" exibe soma correta por linha
```

- [ ] **Step 2: Verificar que o arquivo foi criado corretamente**

Abrir `docs/tests/financeiro/pagar.md` e confirmar que as 7 telas estão presentes.

- [ ] **Step 3: Commit**

```bash
git add docs/tests/financeiro/pagar.md
git commit -m "docs: adiciona checklist de testes manuais para telas de Pagar"
```

---

## Task 4: receber.md — Telas do grupo Receber

**Files:**
- Create: `docs/tests/financeiro/receber.md`

- [ ] **Step 1: Criar o arquivo `docs/tests/financeiro/receber.md`**

Conteúdo completo:

```markdown
# Testes Manuais — Contas a Receber

> Escopo: caminho feliz (happy path). Execute cada checklist de forma independente.

---

## Contas a Receber
**Rota:** Financeiro > Receber > Contas a Receber  
**ID do Programa:** FFIN210E  
**Pré-condições:** Existir Cliente cadastrado; existir Tipo de Documento cadastrado; existir Plano de Conta cadastrado; existir Local de Cobrança cadastrado; existir Carteira de Cobrança cadastrada (para testar boleto).

### Checklist
- [ ] Acessa a tela sem erro e sem modal de acesso negado
- [ ] Card no topo exibe "Total A Receber" e quantidade de parcelas
- [ ] Tabela carrega listagem com colunas: Documento, Série, Espécie, Parcela, Qtd Total, Data Emissão, Vencimento, Cliente, Vlr Documento, Vlr Parcela, Origem, Tipo Doc, Local Cobrança, Nosso Número, Usuário
- [ ] Clica em "Nova Conta a Receber" — formulário expande
- [ ] Preenche: Nr Documento (`REC-001`), Tipo Documento (selecionar), Cliente (buscar e selecionar — mínimo 3 caracteres), Plano de Conta (selecionar), Valor Original (`2500.00`), Data Emissão (data de hoje), Qtd Parcelas (`1`)
- [ ] Parcela única é gerada automaticamente com o valor total
- [ ] Define Data de Vencimento na parcela (data de hoje + 30 dias) e Local de Cobrança
- [ ] Clica "Salvar" — mensagem de sucesso; conta aparece na listagem
- [ ] Testa múltiplas parcelas: Nova Conta, Qtd Parcelas (`2`), Valor Original (`2000.00`)
- [ ] Preenche Valor 1ª Parcela (`1000.00`), Venc. 1ª Parcela (data de hoje + 30 dias), Intervalo (`30` dias) e clica "Calcular Parcelas"
- [ ] Tabela de 2 parcelas aparece com datas corretas (mês 1 e mês 2)
- [ ] Clica "Salvar" — conta com 2 parcelas salva
- [ ] Clica em editar na conta criada — formulário abre preenchido
- [ ] Altera o campo Espécie e clica "Atualizar" — alteração refletida
- [ ] **Gerar Boleto:**
  - [ ] Clica em "Gerar Boleto" — modo de seleção ativa (checkbox aparece em cada linha)
  - [ ] Seleciona 1 parcela sem "Nosso Número" — checkbox fica disponível
  - [ ] Parcelas com Nosso Número já gerado aparecem com checkbox desabilitado
  - [ ] Clica "Gerar (1)" — modal abre com autocomplete de Carteira de Cobrança
  - [ ] Seleciona a Carteira e clica "Confirmar" — mensagem de sucesso; parcela agora exibe Nosso Número na tabela
- [ ] Clica em excluir na conta de 1 parcela e confirma — some da listagem
- [ ] Clica "Imprimir / Exportar" — modal de exportação abre

---

## Baixa de Recebimentos
**Rota:** Financeiro > Receber > Baixa de Recebimentos  
**ID do Programa:** FFIN211E  
**Pré-condições:** Existir Contas a Receber com parcelas em aberto; existir Conta Corrente cadastrada; existir Caixa cadastrado e aberto.

### Checklist
- [ ] Acessa a tela sem erro e sem modal de acesso negado
- [ ] Card no topo exibe: Total de parcelas, Valor total, Selecionados, Valor selecionado
- [ ] Sem filtro, tabela fica vazia
- [ ] Aplica filtro com Data Início e Data Fim via "Busca Avançada" — tabela carrega
- [ ] Tabela exibe: DT Vencimento, Nr Documento, Nr Parcela, Vlr Parcela, Juros, Multa, Desconto, Vlr Quitado, Vlr Saldo, Vlr a Receber, Vlr Liberado, Cliente
- [ ] Datas de vencimento passadas aparecem em vermelho
- [ ] **Baixa por Banco:**
  - [ ] Seleciona Tipo de Baixa: `Banco`
  - [ ] Marca checkbox de 1 parcela
  - [ ] Clica "Baixar 1 Recebimento(s)" — modal de Baixa por Banco abre
  - [ ] Preenche Data do Recebimento (data de hoje) e seleciona Conta Bancária
  - [ ] Clica "Confirmar" — mensagem de sucesso
- [ ] **Baixa por Caixa:**
  - [ ] Seleciona Tipo de Baixa: `Caixa`
  - [ ] Marca checkbox de 1 parcela
  - [ ] Clica "Baixar 1 Recebimento(s)" — modal de Baixa por Caixa abre
  - [ ] Preenche Data do Recebimento e seleciona Caixa
  - [ ] Clica "Confirmar" — mensagem de sucesso
- [ ] Edita campo "Desconto" inline para `50.00` — Valor selecionado atualiza subtraindo o desconto
- [ ] Clica "Selecionar Todos" — todas as parcelas são marcadas
- [ ] Clica "Limpar Seleção" — seleção é desmarcada
```

- [ ] **Step 2: Verificar que o arquivo foi criado corretamente**

Abrir `docs/tests/financeiro/receber.md` e confirmar que as 2 telas estão presentes.

- [ ] **Step 3: Commit**

```bash
git add docs/tests/financeiro/receber.md
git commit -m "docs: adiciona checklist de testes manuais para telas de Receber"
```

---

## Self-Review

**Spec coverage:**
- ✅ 16 telas cobertas: 4 Banco + 3 Caixa + 7 Pagar + 2 Receber
- ✅ Cada tela tem Rota, Pré-condições e Checklist
- ✅ Fluxos especiais cobertos: Importar XML (Pagar), Gerar Boleto (Receber), Chaves de API (Banco), Gerenciar Usuários (Banco e Caixa), Rateio CC (Caixa/Pagar)
- ✅ Dependências entre telas documentadas nas pré-condições
- ✅ Edição e exclusão cobertos em todas as telas com CRUD
- ✅ Exportação coberta onde disponível

**Placeholder scan:** Nenhum TBD, TODO ou "similar ao anterior".

**Consistência:** Todos os nomes de campos, menus e botões conferidos contra o código-fonte das views.
