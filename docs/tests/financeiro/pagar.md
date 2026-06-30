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
