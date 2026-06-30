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
