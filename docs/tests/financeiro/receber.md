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
