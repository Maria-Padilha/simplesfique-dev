# Skill: Novo Component

Fluxo para criar um novo componente ou view no SimplesFique ERP.

## Passos

### 0. Consultar decisões arquiteturais

Antes de criar qualquer coisa nova, leia `@projeto/ADR.md` para entender as decisões arquiteturais já tomadas (ex: Composition API, Pinia, padrões de store, etc.) e não repetir erros passados.

### 1. Verificar se já existe

Antes de criar, procure no projeto se o componente já existe:

- `src/components/base/` — componentes reutilizáveis
- `src/views/pages/` — views do sistema
- `src/views/site/` — views do site institucional

Verifique também duplicatas com sufixos (` 2`, ` 3`, ` 4`) que podem ser consolidadas.

### 2. Escolher o tipo

| Tipo | Onde criar | Exemplo |
|------|-----------|---------|
| **View (página)** | `src/views/pages/<modulo>/` | `src/views/pages/financeiro/pagar/PagarView.vue` |
| **Componente reutilizável** | `src/components/base/<categoria>/` | `src/components/base/modais/CadastrarModal.vue` |
| **Componente de site** | `src/components/site/` | `src/components/site/NavBar.vue` |

### 3. Usar a anatomy padrão

Siga `.skills/component-anatomy.md`:

```vue
<template>
  <TopAllPages icon="mdi-...">
    <template #titulo>...</template>
    <template #acoes>...</template>
    <template #section>...</template>
  </TopAllPages>
</template>

<script setup>
// imports → stores → refs → computed → lifecycle → methods
</script>
```

### 4. Registrar a rota (se for view)

Em `src/router/index.js`, adicione:

```js
{
  path: '/paginas/<modulo>/<rota>',
  name: '<modulo>_<rota>',
  component: () => import('@/views/pages/<modulo>/<Nome>View.vue'),
}
```

Use **lazy loading** (`() => import(...)`) para todas as views.

### 5. Adicionar na sidebar (se necessário)

Em `src/stores/Sidebar.js`, adicione o item no módulo correspondente:

```js
{ titulo: 'Nome do Item', rota: '/paginas/<modulo>/<rota>' }
```

### 6. Verificar

- [ ] Nome do arquivo segue `PascalCaseView.vue` ou `PascalCase.vue`
- [ ] Composition API com `<script setup>`
- [ ] Usa componentes base (`TopAllPages`, `TabelaPadrao`, modais)
- [ ] Store importada corretamente (não chama axios direto)
- [ ] Rota registrada com lazy loading (se view)
- [ ] Sem duplicatas no projeto
