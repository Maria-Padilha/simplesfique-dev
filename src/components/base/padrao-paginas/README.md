# Componentes Padrão de Páginas

Esta pasta contém componentes reutilizáveis para padronizar a interface das páginas de CRUD do sistema.

## Componentes Disponíveis

### 1. BotaoExpandTransition
### 2. TabelaPadrao

---

## 🔹 BotaoExpandTransition

Componente para criar botões de expansão/colapso de formulários com animação consistente.

### Uso Básico

```vue
<template>
  <BotaoExpandTransition
    :formulario-aberto="formularioAberto"
    texto-abrir="Novo Item"
    texto-fechar="Cancelar"
    @toggle="toggleFormulario"
  />
</template>

<script setup>
import BotaoExpandTransition from '@/components/base/padrao-paginas/BotaoExpandTransition.vue'

const formularioAberto = ref(false)

const toggleFormulario = () => {
  formularioAberto.value = !formularioAberto.value
}
</script>
```

### Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `formulario-aberto` | Boolean | false | Estado do formulário (aberto/fechado) |
| `size` | String | 'default' | Tamanho do botão ('small', 'default', 'large') |
| `texto-abrir` | String | 'Novo' | Texto quando formulário está fechado |
| `texto-fechar` | String | 'Cancelar' | Texto quando formulário está aberto |

### Eventos

| Evento | Descrição |
|--------|-----------|
| `@toggle` | Emitido quando o botão é clicado |

### Slot

```vue
<BotaoExpandTransition @toggle="toggleFormulario">
  Texto Personalizado
</BotaoExpandTransition>
```

---

## 📊 TabelaPadrao

Componente para criar tabelas padronizadas com pesquisa, ações e dialog de exclusão integrados.

### Uso Básico

```vue
<template>
  <TabelaPadrao
    :formulario-aberto="formularioAberto"
    :headers="headers"
    :items="items"
    :loading="loading"
    :search="search"
    @update:search="(value) => search = value"
    search-label="Pesquisar Items"
    item-key="id"
    no-data-icon="mdi-database-off"
    no-data-text="Nenhum item encontrado"
    @edit-item="editarItem"
    @confirm-delete="excluirItem"
  />
</template>

<script setup>
import TabelaPadrao from '@/components/base/padrao-paginas/TabelaPadrao.vue'

const formularioAberto = ref(false)
const search = ref('')
const loading = ref(false)
const items = ref([])

const headers = [
  { title: 'ID', key: 'id', sortable: true },
  { title: 'Nome', key: 'nome', sortable: true },
  { title: 'Ações', key: 'actions', sortable: false }
]

const editarItem = (item) => {
  // Lógica de edição
}

const excluirItem = (item) => {
  // Lógica de exclusão
}
</script>
```

### Props Obrigatórias

| Prop | Tipo | Descrição |
|------|------|-----------|
| `headers` | Array | Definição das colunas da tabela |
| `items` | Array | Dados para exibir na tabela |

### Props Opcionais

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `formulario-aberto` | Boolean | false | Controla se a tabela aparece (expansão) |
| `loading` | Boolean | false | Estado de carregamento |
| `item-key` | String | 'id' | Campo único dos items |
| `search` | String | '' | Valor da pesquisa |
| `show-search` | Boolean | true | Exibir campo de pesquisa |
| `search-label` | String | 'Pesquisar' | Label do campo de pesquisa |

### Props de Ações

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `show-edit-action` | Boolean | true | Exibir botão de editar |
| `edit-title` | String | 'Editar' | Tooltip do botão editar |
| `show-custom-action` | Boolean | false | Exibir ação personalizada |
| `custom-action-icon` | String | 'mdi-cog' | Ícone da ação personalizada |
| `custom-action-color` | String | 'secondary' | Cor da ação personalizada |
| `custom-action-title` | String | 'Ação personalizada' | Tooltip da ação personalizada |
| `custom-action-loading` | Boolean | false | Loading da ação personalizada |
| `show-delete-action` | Boolean | true | Exibir botão de excluir |
| `delete-title` | String | 'Excluir' | Tooltip do botão excluir |

### Props do No-Data

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `no-data-icon` | String | 'mdi-database-off' | Ícone quando sem dados |
| `no-data-text` | String | 'Nenhum registro encontrado' | Texto quando sem dados |

### Props do Dialog de Exclusão

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `delete-dialog-title` | String | 'Confirmar Exclusão' | Título do dialog |
| `delete-dialog-message` | String | 'Esta ação não pode ser desfeita.' | Mensagem do dialog |
| `delete-item-display-field` | String | null | Campo para mostrar no dialog (ex: 'nome') |

### Eventos

| Evento | Descrição | Payload |
|--------|-----------|---------|
| `@edit-item` | Item editado | `item` |
| `@delete-item` | Item marcado para exclusão | `item` |
| `@custom-action` | Ação personalizada executada | `item` |
| `@confirm-delete` | Exclusão confirmada | `item` |
| `@update:search` | Valor de pesquisa alterado | `searchValue` |

### Slots Personalizados

Use slots para personalizar a formatação de colunas específicas:

```vue
<TabelaPadrao>
  <!-- Formatação personalizada de uma coluna -->
  <template v-slot:[`item.status`]="{ item }">
    <v-chip :color="item.ativo ? 'success' : 'error'">
      {{ item.ativo ? 'Ativo' : 'Inativo' }}
    </v-chip>
  </template>
  
  <!-- Formatação de data -->
  <template v-slot:[`item.data`]="{ item }">
    {{ new Date(item.data).toLocaleDateString('pt-BR') }}
  </template>
  
  <!-- Ações completamente personalizadas -->
  <template v-slot:[`item.actions`]="{ item }">
    <v-btn icon="mdi-eye" @click="visualizar(item)" />
    <v-btn icon="mdi-pencil" @click="editar(item)" />
  </template>
</TabelaPadrao>
```

---

## 🎯 Exemplo Completo

```vue
<template>
  <div class="pa-4">
    <!-- Cabeçalho -->
    <v-card class="background-secondary mb-4">
      <v-card-title class="text-h5 pa-4 d-flex justify-space-between align-center">
        <div class="d-flex align-center">
          <v-icon icon="mdi-account" class="mr-3"></v-icon>
          Usuários
        </div>
      </v-card-title>
    </v-card>

    <!-- Conteúdo Principal -->
    <v-card class="background-secondary">
      <v-card-text class="pa-4">
        <!-- Botão de Expansão -->
        <BotaoExpandTransition
          :formulario-aberto="formularioAberto"
          texto-abrir="Novo Usuário"
          texto-fechar="Cancelar"
          @toggle="toggleFormulario"
        />
        
        <!-- Formulário Expansível -->
        <v-expand-transition>
          <div v-if="formularioAberto">
            <!-- Seu formulário aqui -->
          </div>
        </v-expand-transition>
        
        <!-- Tabela -->
        <TabelaPadrao
          :formulario-aberto="formularioAberto"
          :headers="headers"
          :items="usuarios"
          :loading="loading"
          :search="search"
          @update:search="(value) => search = value"
          search-label="Pesquisar Usuário"
          item-key="id"
          no-data-icon="mdi-account-off"
          no-data-text="Nenhum usuário encontrado"
          :show-custom-action="true"
          custom-action-icon="mdi-key"
          custom-action-title="Gerenciar Permissões"
          delete-item-display-field="nome"
          @edit-item="editarUsuario"
          @custom-action="gerenciarPermissoes"
          @confirm-delete="excluirUsuario"
        >
          <!-- Formatação personalizada -->
          <template v-slot:[`item.ativo`]="{ item }">
            <v-chip 
              size="small"
              :color="item.ativo ? 'success' : 'default'"
              :variant="item.ativo ? 'flat' : 'outlined'"
            >
              <v-icon 
                :icon="item.ativo ? 'mdi-check-circle' : 'mdi-close-circle'"
                size="16"
                class="mr-1"
              />
              {{ item.ativo ? 'Ativo' : 'Inativo' }}
            </v-chip>
          </template>
        </TabelaPadrao>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BotaoExpandTransition from '@/components/base/padrao-paginas/BotaoExpandTransition.vue'
import TabelaPadrao from '@/components/base/padrao-paginas/TabelaPadrao.vue'

// Estado
const formularioAberto = ref(false)
const search = ref('')
const loading = ref(false)
const usuarios = ref([])

// Configuração da tabela
const headers = [
  { title: 'ID', key: 'id', sortable: true },
  { title: 'Nome', key: 'nome', sortable: true },
  { title: 'Email', key: 'email', sortable: true },
  { title: 'Status', key: 'ativo', sortable: true },
  { title: 'Ações', key: 'actions', sortable: false }
]

// Métodos
const toggleFormulario = () => {
  formularioAberto.value = !formularioAberto.value
}

const editarUsuario = (usuario) => {
  console.log('Editando:', usuario)
}

const excluirUsuario = (usuario) => {
  console.log('Excluindo:', usuario)
}

const gerenciarPermissoes = (usuario) => {
  console.log('Gerenciando permissões:', usuario)
}
</script>
```

---

## 🎨 Personalização

### Temas
Os componentes respeitam automaticamente o tema escuro/claro configurado no `themeStore`.

### Classes CSS
Você pode adicionar classes personalizadas aos componentes:

```vue
<TabelaPadrao class="minha-classe-personalizada" />
```

### Estilos
Para customizações avançadas, use CSS scoped no componente pai:

```vue
<style scoped>
:deep(.custom-table) {
  /* Seus estilos aqui */
}
</style>
```

---

## 📋 Checklist de Migração

Para migrar uma página existente para usar os novos componentes:

- [ ] Importar `BotaoExpandTransition` e `TabelaPadrao`
- [ ] Substituir o botão manual pelo `BotaoExpandTransition`
- [ ] Substituir `v-data-table` pelo `TabelaPadrao`
- [ ] Ajustar headers da tabela (usar `'actions'` para ações)
- [ ] Mover formatações personalizadas para slots
- [ ] Remover dialog de exclusão manual
- [ ] Ajustar funções de exclusão para receber o item diretamente
- [ ] Configurar props específicas (ícones, textos, etc.)
- [ ] Testar todas as funcionalidades

---

## 🔧 Troubleshooting

### Problema: Botões de ação empilhados verticalmente
**Solução**: Verificar se o `TabelaPadrao` tem `d-flex gap-1` nas ações.

### Problema: Dialog de exclusão não aparece
**Solução**: Verificar se `@confirm-delete` está configurado corretamente.

### Problema: Pesquisa não funciona
**Solução**: Verificar se `@update:search` está configurado e se a propriedade `search` está sendo atualizada.

### Problema: Formatação de coluna não aparece
**Solução**: Verificar se o slot está usando a sintaxe correta: `v-slot:[item.campo]`.

---

## 📝 Contribuindo

Para adicionar novos recursos aos componentes:

1. Mantenha a compatibilidade com implementações existentes
2. Adicione props opcionais em vez de obrigatórias
3. Documente todas as mudanças neste arquivo
4. Teste em pelo menos uma página existente antes do commit

---

**Páginas que já usam esses componentes:**
- ✅ ContaCorrenteView
- ✅ CentroDeCustoView  
- ✅ CaixaView
- ✅ UsuariosView