# SimplesFique - AI Coding Agent Instructions

## Project Overview
Educational ERP system built with **Vue 3 + Vite + Vuetify 3 + Tailwind CSS + Pinia**. Target: learning modern web development patterns. Runs as web app and Electron desktop app.

## Architecture

### State Management (Pinia)
- **API Store Pattern**: All API interactions use `useApiStore` with centralized methods:
  - `executarAcao(entidade, metodo, payload, id, token)` - POST/PUT/DELETE operations
  - `buscarDados(entidade, {limit, offset, ignorarPaginacao, id})` - GET operations
  - Returns toast notifications automatically on success/error
- **Module Stores**: Domain-specific stores extend API store (e.g., `useCCustoStore`, `useFinanceiroStore`)
- **Theme Store**: `useThemeStore` - persists `darkMode`, `tipoBtn`, `brightness` to localStorage

### Routing Structure
- **Auth**: `/login`, `/empresa` (token-protected via `meta: {requiresToken: true}`)
- **System Pages**: `/paginas/[module]/[page]` (e.g., `/paginas/financeiro/pagar`)
- **Sub-routes**: Grouped features use nested routes (e.g., `/paginas/financeiro/centrodecusto/cadastro`, `/previsao`)
- **Site**: Public routes at root (`/`, `/funcionalidades`, `/integracoes`, `/planos`)
- **Redirects**: Old single routes redirect to first sub-route when converted to groups

### Module Organization
```
src/
├── views/pages/[module]/          # Feature views
├── stores/APIs/                   # Domain stores (extend useApiStore)
├── stores/config-temas/           # Theme management
├── components/base/
│   ├── padrao-paginas/           # Standard CRUD components
│   ├── modais/                   # Reusable modals
│   └── menu/                     # Context menus for lookups
├── services/api.js               # Axios instance
└── router/index.js               # Route definitions + guards
```

## Critical Patterns

### CRUD Views Standard Template
All financial/management views follow this structure:

```vue
<template>
  <div class="pa-4">
    <!-- Header Card -->
    <v-card class="background-secondary mb-4">
      <v-card-title class="text-h5 pa-4 d-flex justify-space-between align-center">
        <div class="d-flex align-center">
          <v-icon icon="mdi-[icon]" class="mr-3"></v-icon>
          [Page Title]
        </div>
      </v-card-title>
    </v-card>

    <!-- Content Card -->
    <v-card :color="themeStore.darkMode ? 'text-white' : ''" class="background-secondary">
      <v-card-text class="pa-4">
        <BotaoExpandTransition
          :formulario-aberto="formularioAberto"
          texto-abrir="Novo [Entity]"
          texto-fechar="Cancelar"
          @toggle="toggleFormulario"
        />

        <!-- Expandable Form -->
        <v-expand-transition>
          <div v-if="formularioAberto">
            <v-card class="background-card mb-7" elevation="2">
              <v-card-title class="text-h6 pa-4">
                <v-icon :icon="editando ? 'mdi-pencil' : 'mdi-plus'" class="mr-2"></v-icon>
                {{ editando ? 'Editar [Entity]' : 'Novo [Entity]' }}
              </v-card-title>
              <v-card-text class="pa-4">
                <v-form ref="formRef" v-model="formValido">
                  <!-- Form fields here -->
                </v-form>
              </v-card-text>
              <v-card-actions class="pa-4">
                <v-spacer></v-spacer>
                <v-btn color="grey" variant="text" @click="cancelarFormulario">Cancelar</v-btn>
                <v-btn
                  color="var(--text-color-laranja)"
                  :loading="loading"
                  :disabled="!formValido"
                  @click="salvar[Entity]"
                  variant="flat"
                  class="text-white"
                >
                  {{ editando ? 'Atualizar' : 'Salvar' }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </div>
        </v-expand-transition>

        <!-- Data Table -->
        <TabelaPadrao
          :formulario-aberto="formularioAberto"
          :headers="headers"
          :items="itemsFiltrados"
          :loading="loading"
          :search="search"
          @update:search="(value) => search = value"
          search-label="Pesquisar [Entity]"
          item-key="id"
          no-data-icon="mdi-[icon]-outline"
          no-data-text="Nenhum [entity] cadastrado"
          delete-item-display-field="[displayField]"
          @edit-item="editar[Entity]"
          @confirm-delete="excluir[Entity]"
        ></TabelaPadrao>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useThemeStore } from '@/stores/config-temas/theme'
import BotaoExpandTransition from '@/components/base/padrao-paginas/BotaoExpandTransition.vue'
import TabelaPadrao from '@/components/base/padrao-paginas/TabelaPadrao.vue'

const themeStore = useThemeStore()
const formularioAberto = ref(false)
const editando = ref(false)
const formValido = ref(false)
const formRef = ref(null)
const search = ref('')
const loading = computed(() => store.loading)

const formData = reactive({
  id: null,
  // entity fields
})

const headers = [
  { title: 'ID', key: 'id', sortable: true },
  // other columns
  { title: 'Ações', key: 'actions', sortable: false }
]

onMounted(async () => {
  await store.listar[Entity]()
})
</script>
```

### Theme-Aware Styling
**Always** use these CSS classes for theme compatibility:
- Cards: `background-secondary` (main), `background-card` (nested), `background-primary` (body)
- Text: `var(--text-color)` auto-adjusts with theme
- Orange accent: `var(--text-color-laranja)` for primary actions
- Conditional colors: `:color="themeStore.darkMode ? 'text-white' : ''"`

### Form Validation Pattern
```javascript
const rules = {
  required: (value) => !!value || 'Campo obrigatório'
}

// For async validation with API check:
const classificadorValidando = ref(false)
const classificadorValido = ref(null)

const validarClassificador = async () => {
  if (!formData.id_classificador) {
    classificadorValido.value = null
    return
  }
  
  classificadorValidando.value = true
  try {
    const resultado = await store.verificarClassificador(formData.id_classificador)
    classificadorValido.value = true
    // Auto-fill fields if exists
    if (resultado?.data) {
      Object.assign(formData, resultado.data)
      editando.value = !!resultado.data.id
    }
  } catch (error) {
    classificadorValido.value = false
  } finally {
    classificadorValidando.value = false
  }
}
```

### Sidebar Nested Groups
When adding sub-navigation (like Centro de Custo → Cadastro/Previsão):
```javascript
// src/stores/Sidebar.js
{
  text: 'Parent Item',
  icon: 'mdi-icon',
  submenus: [
    { text: 'Child 1', icon: 'mdi-icon', route: '/path/child1' },
    { text: 'Child 2', icon: 'mdi-icon', route: '/path/child2' }
  ]
}
```

### Standard Component Props (TabelaPadrao)
See `src/components/base/padrao-paginas/README.md` for complete API. Key points:
- Headers must include `{ title: 'Ações', key: 'actions', sortable: false }` for action column
- Use `@confirm-delete` not `@delete-item` (dialog confirmation built-in)
- Format columns via slots: `<template v-slot:[item.campo]="{ item }">`
- Custom actions: `show-custom-action`, `custom-action-icon`, `@custom-action`

## Development Commands
```bash
npm run serve          # Dev server (http://localhost:8080)
npm run build          # Production build
npm run dev            # Concurrent web + Electron dev
npm run electron-dev   # Electron only (waits for :8080)
npm run lint           # ESLint
```

## API Integration
**Base URL**: Configured in `src/services/api.js` (Axios instance)
**Auth**: Token stored in `localStorage.getItem('token')`, passed as `Bearer ${token}`

### Store Method Examples
```javascript
// List entities
await store.listar[Entity]() // calls buscarDados internally

// Create
await store.cadastrar[Entity]({ field1, field2 })

// Update
await store.alterar[Entity](id, { field1, field2 })

// Delete
await store.deletar[Entity](id)

// Custom validation
await store.verificar[Field](value)
```

## Key Dependencies
- **Vuetify 3**: Material Design components (`v-card`, `v-btn`, `v-data-table`, etc.)
- **Tailwind**: Utility classes (spacing, flex, grid) work alongside Vuetify
- **Pinia Persist**: Auto-saves stores with `persist: { key: 'name', storage: localStorage }`
- **vue3-toastify**: Notifications via `toast.success()`, `toast.error()` (imported in stores)

## Common Pitfalls
1. **Theme Colors**: Never hardcode colors - use CSS variables (`var(--text-color-laranja)`)
2. **Loading States**: Always use `computed(() => store.loading)` to sync with API calls
3. **Route Guards**: Add auth checks to `router.beforeEach` in `src/router/index.js`
4. **Form Reset**: Call `formRef.value.resetValidation()` when closing/canceling forms
5. **Nested Routes**: When converting single route to group, add redirect: `redirect: '/path/to/first-child'`

## File Naming Conventions
- Views: `[Entity]View.vue` (PascalCase + "View" suffix)
- Components: `[Name].vue` (PascalCase, no suffix)
- Stores: `[entity].js` (lowercase, matches API endpoint)
- Routes: Use kebab-case in URLs, snake_case in route names

## Adding New CRUD Feature
1. Create store in `src/stores/APIs/[entity].js` extending `useApiStore` pattern
2. Create view in `src/views/pages/[module]/[Entity]View.vue` using standard template above
3. Add route in `src/router/index.js` with path `/paginas/[module]/[entity]`
4. Add sidebar entry in `src/stores/Sidebar.js` under appropriate module
5. Import components: `BotaoExpandTransition`, `TabelaPadrao` from `@/components/base/padrao-paginas/`

## Module Structure (Financeiro Example)
- **Conta Corrente** (`ContaCorrenteView.vue`) - Bank account management
- **Centro de Custo** - Cost center group:
  - **Cadastro** (`CentroDeCustoView.vue`) - Register/edit cost centers
  - **Previsão de Débitos** (`PrevisaoDebitosView.vue`) - Forecast debits by cost center
- **Pagar** (`PagarView.vue`) - Accounts payable
- **Receber** (`ReceberView.vue`) - Accounts receivable
- **Caixa** (`CaixaView.vue`) - Cash register
- **Plano de Conta** (`PlanoContaView.vue`) - Chart of accounts

## Maintenance Mode
Controlled by `siteStore.manutencao` - redirects all routes to `/manutencao` view when enabled (see `router.beforeEach`).

## Filtering & Search
Use `v-data-table`'s built-in search or implement computed filters:
```javascript
const itemsFiltrados = computed(() => {
  const dados = items.value || []
  return Array.isArray(dados) ? dados : []
})
```

## Example: Adding Report View (Non-CRUD)
See `PrevisaoDebitosView.vue` for report-style pages:
- Filter section in first card (radio groups, selects, date inputs)
- Results table with dynamic columns based on date range
- Computed totals row using `<template v-slot:body.append>`
- Loading states with skeleton loaders

## References
- Component docs: `src/components/base/padrao-paginas/README.md`
- Theme variables: `src/assets/scss/theme.scss`
- Media queries: `src/assets/scss/2-utilities/media_screen.scss`
