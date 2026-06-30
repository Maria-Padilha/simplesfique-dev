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
