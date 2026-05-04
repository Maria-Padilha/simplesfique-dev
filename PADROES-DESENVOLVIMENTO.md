# Padrões de Desenvolvimento - SimplesFique

> **Documento de referência para manter consistência em todas as funcionalidades do sistema**
> 
> Última atualização: Abril 2026

---

## 📋 Índice

1. [Estilo de Telas](#estilo-de-telas)
2. [Padrão de Componentes](#padrão-de-componentes)
3. [Padrão de Requisições](#padrão-de-requisições)
4. [Padrão de Payload](#padrão-de-payload)
5. [Padrão de Endpoints](#padrão-de-endpoints)
6. [Padrão de Rotas](#padrão-de-rotas)
7. [Padrão de Autenticação](#padrão-de-autenticação)
8. [Padrão de Stores (Pinia)](#padrão-de-stores-pinia)
9. [Padrão de Validação](#padrão-de-validação)
10. [Padrão de Listagem e Tabelas](#padrão-de-listagem-e-tabelas)

---

## 🎨 Estilo de Telas

### Estrutura Padrão de View CRUD

```vue
<template>
  <top-all-pages icon="mdi-[icon-name]">
    <template #titulo>[Nome da Funcionalidade]</template>
    
    <template #section>
      <!-- Botão de Toggle Form -->
      <BotaoExpandTransition
        :formulario-aberto="formularioAberto"
        texto-abrir="Novo [Entity]"
        texto-fechar="Cancelar"
        @toggle="toggleFormulario"
      />

      <!-- Formulário Expansível -->
      <v-expand-transition>
        <div v-if="formularioAberto">
          <v-card class="background-card mb-7" elevation="2">
            <v-card-title class="text-h6 pa-4">
              <v-icon :icon="editando ? 'mdi-pencil' : 'mdi-plus'" class="mr-2"></v-icon>
              {{ editando ? 'Editar [Entity]' : 'Novo [Entity]' }}
            </v-card-title>
            
            <v-card-text class="pa-4">
              <v-form ref="formRef" v-model="formValido">
                <!-- CAMPOS DO FORMULÁRIO -->
                <v-row>
                  <!-- Linha 1 - Campos principais -->
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="formData.campo1"
                      label="Campo 1 *"
                      variant="outlined"
                      density="compact"
                      prepend-inner-icon="mdi-icon"
                      hide-details="auto"
                      :rules="[rules.required]"
                      color="var(--text-color-laranja)"
                    />
                  </v-col>
                  <!-- ... mais campos ... -->
                </v-row>
              </v-form>
            </v-card-text>

            <v-card-actions class="pa-4">
              <v-btn
                v-if="editando"
                color="error"
                variant="text"
                @click="confirmarExclusao"
              >
                <v-icon start>mdi-delete</v-icon>
                Excluir
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn color="grey" variant="text" @click="cancelarFormulario">
                Cancelar
              </v-btn>
              <v-btn
                color="var(--text-color-laranja)"
                :loading="loading"
                :disabled="!formValido"
                @click="salvar[Entity]"
                variant="flat"
                class="text-white px-6"
                size="default"
              >
                {{ editando ? 'Atualizar' : 'Salvar' }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </div>
      </v-expand-transition>

      <!-- Tabela de Dados (oculta quando formulário aberto) -->
      <v-card v-if="!formularioAberto" class="background-card" elevation="0">
        <v-card-text class="pa-4">
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
            delete-item-display-field="[campo]"
            @edit-item="editar[Entity]"
            @confirm-delete="excluir[Entity]"
          />
        </v-card-text>
      </v-card>
    </template>
  </top-all-pages>
</template>
```

### Classes CSS Obrigatórias

```scss
// Cards
.background-primary    // Corpo da aplicação
.background-secondary  // Cards principais
.background-card       // Cards aninhados/internos

// Texto
var(--text-color)         // Cor de texto principal (auto dark/light)
var(--text-color-laranja) // Cor de destaque/ações principais (#FF6B35)

// Headers de seções
.text-subtitle-2          // Tamanho de fonte
.text-uppercase           // Maiúsculas
.opacity-60               // Opacidade 60%
```

### Grid de Campos

```vue
<!-- Campos principais: md-4 (3 por linha) -->
<v-col cols="12" md="4">
  <v-text-field ... />
</v-col>

<!-- Valores/Datas: md-2 (6 por linha) -->
<v-col cols="12" md="2">
  <v-text-field type="date" ... />
</v-col>

<!-- Campos médios: md-3 (4 por linha) -->
<v-col cols="12" md="3">
  <v-select ... />
</v-col>

<!-- Campo full-width -->
<v-col cols="12">
  <v-textarea ... />
</v-col>
```

### Propriedades Obrigatórias em Campos

```vue
<v-text-field
  variant="outlined"              <!-- Sempre outlined -->
  density="compact"               <!-- Sempre compact -->
  hide-details="auto"             <!-- Auto para mostrar erros -->
  color="var(--text-color-laranja)" <!-- Cor laranja -->
  prepend-inner-icon="mdi-..."    <!-- Sempre com ícone -->
/>
```

---

## 🧩 Padrão de Componentes

### Componentes Base Obrigatórios

#### 1. **TopAllPages** (Wrapper de todas as páginas)
```vue
<top-all-pages icon="mdi-account">
  <template #titulo>Título da Página</template>
  <template #section>
    <!-- Conteúdo aqui -->
  </template>
</top-all-pages>
```
**Localização:** `@/components/base/padrao-paginas/TopAllPages.vue`

#### 2. **BotaoExpandTransition** (Toggle de formulário)
```vue
<BotaoExpandTransition
  :formulario-aberto="formularioAberto"
  texto-abrir="Novo Item"
  texto-fechar="Cancelar"
  @toggle="toggleFormulario"
/>
```
**Localização:** `@/components/base/padrao-paginas/BotaoExpandTransition.vue`

#### 3. **TabelaPadrao** (Tabelas de dados)
```vue
<TabelaPadrao
  :formulario-aberto="formularioAberto"
  :headers="headers"
  :items="items"
  :loading="loading"
  :search="search"
  @update:search="(v) => search = v"
  search-label="Pesquisar..."
  item-key="id"
  no-data-icon="mdi-alert-circle-outline"
  no-data-text="Nenhum registro encontrado"
  delete-item-display-field="descricao"
  @edit-item="editarItem"
  @confirm-delete="excluirItem"
/>
```
**Localização:** `@/components/base/padrao-paginas/TabelaPadrao.vue`

**Headers obrigatórios:**
```javascript
const headers = [
  { title: 'ID', key: 'id', sortable: true },
  { title: 'Descrição', key: 'descricao', sortable: true },
  { title: 'Ações', key: 'actions', sortable: false } // OBRIGATÓRIO
]
```

### Imports Padrão

```javascript
import { ref, reactive, computed, onMounted } from 'vue'
import TopAllPages from '@/components/base/padrao-paginas/TopAllPages.vue'
import BotaoExpandTransition from '@/components/base/padrao-paginas/BotaoExpandTransition.vue'
import TabelaPadrao from '@/components/base/padrao-paginas/TabelaPadrao.vue'
import { useThemeStore } from '@/stores/config-temas/theme'
import { useEmpresaStore } from '@/stores/APIs/empresa'
import { use[Module]Store } from '@/stores/APIs/[module]'
```

---

## 🔌 Padrão de Requisições

### Configuração Base (api.js)

**Localização:** `src/services/api.js`

```javascript
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'https://api.example.com'
})

// Interceptor para adicionar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
```

### Métodos de Store (useApiStore)

**Localização:** `src/stores/APIs/api.js`

Todas as stores **DEVEM** estender `useApiStore`:

```javascript
import { defineStore } from 'pinia'
import { useApiStore } from './api'

export const use[Module]Store = defineStore('[module]', () => {
  const apiStore = useApiStore()
  
  // Estados
  const items = ref([])
  const loading = computed(() => apiStore.loading)
  
  // Métodos CRUD
  
  // 1. LISTAR (GET)
  const listar[Entity] = async () => {
    const idEmpresa = localStorage.getItem('idempresa')
    items.value = await apiStore.buscarDados('[endpoint]', {
      id: idEmpresa,
      ignorarPaginacao: true
    })
    return items.value
  }
  
  // 2. CRIAR (POST) - SEMPRE ENVIAR data: [{}]
  const cadastrar[Entity] = async (payload) => {
    const idEmpresa = localStorage.getItem('idempresa')
    const token = localStorage.getItem('token')
    
    return await apiStore.executarAcao(
      '[endpoint]',
      'POST',
      { data: [{ idempresa: idEmpresa, ...payload }] }, // data: [{}] obrigatório
      null,
      token
    )
  }
  
  // 3. ATUALIZAR (PUT) - SEMPRE ENVIAR data: [{}]
  const atualizar[Entity] = async (id, payload) => {
    const idEmpresa = localStorage.getItem('idempresa')
    const token = localStorage.getItem('token')
    
    return await apiStore.executarAcao(
      '[endpoint]',
      'PUT',
      { data: [{ idempresa: idEmpresa, ...payload }] }, // data: [{}] obrigatório
      id,
      token
    )
  }
  
  // 4. DELETAR (DELETE) - SEMPRE ENVIAR data: [{}]
  const deletar[Entity] = async (id) => {
    const idEmpresa = localStorage.getItem('idempresa')
    const token = localStorage.getItem('token')
    
    return await apiStore.executarAcao(
      '[endpoint]',
      'DELETE',
      { data: [{ idempresa: idEmpresa }] }, // data: [{}] obrigatório
      id,
      token
    )
  }
  
  return {
    items,
    loading,
    listar[Entity],
    cadastrar[Entity],
    atualizar[Entity],
    deletar[Entity]
  }
})
```

### Métodos useApiStore

```javascript
// GET - Buscar dados
buscarDados(entidade, {
  limit: number,           // Limite de registros
  offset: number,          // Offset para paginação
  ignorarPaginacao: true,  // Trazer todos os registros
  id: number               // ID específico (opcional)
})

// POST/PUT/DELETE - Executar ação
executarAcao(
  entidade,    // Nome do endpoint (ex: 'ccusto')
  metodo,      // 'POST', 'PUT', 'DELETE'
  payload,     // Dados a enviar
  id,          // ID do registro (para PUT/DELETE)
  token        // Token de autenticação
)
```

---

## 📦 Padrão de Payload

### ⚠️ FORMATO OBRIGATÓRIO: data: [{}]

**TODOS os payloads DEVEM ser enviados com a estrutura `data: [{}]`**

```javascript
// ✅ CORRETO - Sempre data: [{}]
const payload = {
  data: [{
    idempresa: idEmpresa,
    descricao: 'Descrição'
  }]
}

// ❌ ERRADO - Array direto
const payload = [{
  idempresa: idEmpresa,
  descricao: 'Descrição'
}]

// ❌ ERRADO - Objeto direto
const payload = {
  idempresa: idEmpresa,
  descricao: 'Descrição'
}
```

### Campos Obrigatórios em TODOS os Payloads

```javascript
{
  data: [{
    idempresa: number // SEMPRE obrigatório (pego do localStorage)
  }]
}
```

### Exemplo de Payload POST/PUT

```javascript
// POST - Criar novo registro
const payload = {
  data: [{
    idempresa: idEmpresa,           // OBRIGATÓRIO
    descricao: 'Descrição',         // Campos da entidade
    ativo: true,
    valor: 100.50,
    data: '2026-04-01'
  }]
}

// PUT - Atualizar registro
const payload = {
  data: [{
    idempresa: idEmpresa,           // OBRIGATÓRIO
    id: 123,                        // ID do registro (também passado como parâmetro)
    descricao: 'Nova Descrição',
    ativo: false
  }]
}

// DELETE - Remover registro
const payload = {
  data: [{
    idempresa: idEmpresa            // OBRIGATÓRIO (apenas idempresa)
  }]
}
```

### Conversão de Dados antes do Envio

```javascript
// Estrutura completa do payload
const payload = {
  data: [{
    idempresa: idEmpresa,
    // Datas: sempre formato YYYY-MM-DD
    data: '2026-04-01',
    
    // Valores monetários: número sem formatação
    valor: 1234.56,  // NÃO enviar "R$ 1.234,56"
    
    // IDs de lookups: apenas o ID numérico
    id_ccusto: 5,    // NÃO enviar objeto completo
    
    // Booleanos
    ativo: true      // true/false, não 1/0 ou "S"/"N"
  }]
}
```

---

## 🌐 Padrão de Endpoints

### Nomenclatura

```
/[entidade]           // Plural ou singular conforme API
/[entidade]/:id       // Para GET específico, PUT, DELETE
/[entidade]/:idempresa // Para GET com filtro de empresa
```

### Verbos HTTP

| Operação | Verbo  | Endpoint           | ID no Payload | ID na URL |
|----------|--------|--------------------|---------------|-----------|
| Listar   | GET    | `/entity`          | ❌             | ❌         |
| Buscar 1 | GET    | `/entity/:id`      | ❌             | ✅         |
| Criar    | POST   | `/entity`          | ❌             | ❌         |
| Atualizar| PUT    | `/entity/:id`      | ✅             | ✅         |
| Deletar  | DELETE | `/entity/:id`      | ✅             | ✅         |

### Exemplos Reais do Sistema

```javascript
// Centro de Custo
GET    /ccusto/:idempresa         // Lista todos
POST   /ccusto                    // Cria novo
PUT    /ccusto/:id                // Atualiza
DELETE /ccusto/:id                // Deleta

// Lançamento Colaborador
GET    /adtcolabo/:idempresa      // Lista com filtros query
POST   /adtcolabo                 // Cria novo
PUT    /adtcolabo/:id             // Atualiza
DELETE /adtcolabo/:id             // Deleta
POST   /adtcolabocalcparc         // Calcula parcelas (endpoint especial)

// Conta Corrente
GET    /ccorrente/:idempresa
POST   /ccorrente
PUT    /ccorrente/:id
DELETE /ccorrente/:id

// Conta a Pagar
GET    /pagar/:idempresa
POST   /pagar
PUT    /pagar/:id
DELETE /pagar/:id
POST   /pagarcalcparc             // Calcula parcelas
```

### Query Parameters (GET)

```javascript
// Exemplo com filtros
GET /adtcolabo/:idempresa?tpperiodo=mes&dtini=2026-04-01&dtfim=2026-04-30&idcolabo=5

// Parâmetros comuns
?limit=50              // Limite de registros
?offset=0              // Paginação
?orderBy=descricao     // Ordenação
?orderDir=ASC          // Direção (ASC/DESC)
```

---

## 🛣️ Padrão de Rotas

### Estrutura de Rotas (router/index.js)

```javascript
{
  path: '/paginas/[modulo]/[funcionalidade]',
  name: '[modulo]_[funcionalidade]',
  component: () => import('@/views/pages/[modulo]/[Funcionalidade]View.vue'),
  meta: { 
    requiresToken: true,  // SEMPRE true para páginas internas
    title: 'Título da Página'
  }
}
```

### Exemplos Reais

```javascript
// Rota simples
{
  path: '/paginas/financeiro/caixa',
  name: 'financeiro_caixa',
  component: () => import('@/views/pages/financeiro/CaixaView.vue'),
  meta: { requiresToken: true, title: 'Caixa' }
}

// Rota com sub-rotas (grupo)
{
  path: '/paginas/financeiro/centrodecusto',
  redirect: '/paginas/financeiro/centrodecusto/cadastro', // Redireciona para primeira
  children: [
    {
      path: 'cadastro',
      name: 'financeiro_centrodecusto_cadastro',
      component: () => import('@/views/pages/financeiro/centrodecusto/CentroDeCustoView.vue'),
      meta: { requiresToken: true, title: 'Centro de Custo - Cadastro' }
    },
    {
      path: 'previsao',
      name: 'financeiro_centrodecusto_previsao',
      component: () => import('@/views/pages/financeiro/centrodecusto/PrevisaoDebitosView.vue'),
      meta: { requiresToken: true, title: 'Centro de Custo - Previsão' }
    }
  ]
}
```

### Guard de Autenticação

```javascript
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  
  if (to.meta.requiresToken && !token) {
    next('/login')
  } else {
    next()
  }
})
```

### Navegação Programática

```javascript
import { useRouter } from 'vue-router'

const router = useRouter()

// Navegar para rota
router.push('/paginas/financeiro/caixa')
router.push({ name: 'financeiro_caixa' })

// Voltar
router.back()
```

---

## 🔐 Padrão de Autenticação

### Tokens Obrigatórios

**Sempre armazenados no localStorage:**

```javascript
localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIs...')
localStorage.setItem('idempresa', '123')
```

### Headers de Requisição

```javascript
// Automático via interceptor (api.js)
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

### Uso em Stores

```javascript
const token = localStorage.getItem('token')
const idEmpresa = localStorage.getItem('idempresa')

if (!token || !idEmpresa) {
  console.error('Token ou empresa não encontrados')
  router.push('/login')
  return
}

// Usar em requisições
await apiStore.executarAcao('endpoint', 'POST', payload, null, token)
```

### Login/Logout

```javascript
// Login
const fazerLogin = async (email, senha) => {
  const response = await api.post('/login', { email, senha })
  
  localStorage.setItem('token', response.data.token)
  localStorage.setItem('idempresa', response.data.idempresa)
  
  router.push('/paginas/home')
}

// Logout
const fazerLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('idempresa')
  router.push('/login')
}
```

---

## 🗄️ Padrão de Stores (Pinia)

### Estrutura Base

```javascript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useApiStore } from './api'

export const use[Module]Store = defineStore('[module]', () => {
  // Store API
  const apiStore = useApiStore()
  
  // Estados
  const items = ref([])
  const itemSelecionado = ref(null)
  
  // Computeds
  const loading = computed(() => apiStore.loading)
  const itemsAtivos = computed(() => items.value.filter(i => i.ativo))
  
  // Métodos
  const listar = async () => { /* ... */ }
  const cadastrar = async (payload) => { /* ... */ }
  const atualizar = async (id, payload) => { /* ... */ }
  const deletar = async (id) => { /* ... */ }
  
  // Reset
  const $reset = () => {
    items.value = []
    itemSelecionado.value = null
  }
  
  return {
    // State
    items,
    itemSelecionado,
    // Getters
    loading,
    itemsAtivos,
    // Actions
    listar,
    cadastrar,
    atualizar,
    deletar,
    $reset
  }
})
```

### Persistência (Pinia Persist)

```javascript
import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', () => {
  const darkMode = ref(false)
  
  return { darkMode }
}, {
  persist: {
    key: 'theme',
    storage: localStorage
  }
})
```

---

## ✅ Padrão de Validação

### Rules Padrão

```javascript
const rules = {
  required: (value) => !!value || 'Campo obrigatório',
  
  email: (value) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(value) || 'E-mail inválido'
  },
  
  minLength: (min) => (value) => {
    return (value && value.length >= min) || `Mínimo ${min} caracteres`
  },
  
  numeric: (value) => {
    return !value || !isNaN(value) || 'Apenas números'
  },
  
  positivo: (value) => {
    return !value || parseFloat(value) > 0 || 'Deve ser maior que zero'
  }
}
```

### Validação Assíncrona (com API)

```javascript
const validarCodigo = async () => {
  if (!formData.codigo) {
    codigoValido.value = null
    return
  }
  
  codigoValidando.value = true
  
  try {
    const resultado = await store.verificarCodigo(formData.codigo)
    codigoValido.value = true
    
    // Auto-preencher se existir
    if (resultado?.data) {
      Object.assign(formData, resultado.data)
      editando.value = true
    }
  } catch (error) {
    codigoValido.value = false
  } finally {
    codigoValidando.value = false
  }
}
```

### Estado do Formulário

```javascript
const formRef = ref(null)
const formValido = ref(false)

// Validar
const validar = async () => {
  const { valid } = await formRef.value.validate()
  return valid
}

// Resetar
const resetar = () => {
  formRef.value.reset()
  formRef.value.resetValidation()
}
```

---

## 📊 Padrão de Listagem e Tabelas

### Buscar e Filtrar Dados

```javascript
const items = ref([])
const search = ref('')
const loading = ref(false)

const itemsFiltrados = computed(() => {
  const dados = items.value || []
  return Array.isArray(dados) ? dados : []
})

onMounted(async () => {
  loading.value = true
  try {
    await store.listar[Entity]()
    items.value = store.items
  } finally {
    loading.value = false
  }
})
```

### Expandir Linhas (Registros Agrupados)

```vue
<TabelaPadrao
  show-expand
  :headers="headers"
  :items="itemsAgrupados"
>
  <template #expanded-row="{ item }">
    <tr v-for="subitem in item.subitems" :key="subitem.id">
      <td colspan="1"></td>
      <td>{{ subitem.campo1 }}</td>
      <td>{{ subitem.campo2 }}</td>
    </tr>
  </template>
</TabelaPadrao>
```

### Agrupar Dados Flat da API

```javascript
const buscarDados = async () => {
  const response = await apiStore.buscarDados('endpoint', { id: idEmpresa })
  
  // API retorna flat rows - agrupar por ID
  const grupos = {}
  
  response.forEach(row => {
    if (!grupos[row.id]) {
      grupos[row.id] = {
        id: row.id,
        descricao: row.descricao,
        valor_total: row.valor_total,
        parcelas: []
      }
    }
    
    grupos[row.id].parcelas.push({
      valor: row.parcela_valor,
      vencimento: row.parcela_vencimento,
      sinal: row.parcela_sinal
    })
  })
  
  items.value = Object.values(grupos)
}
```

---

## 🔧 Padrão de Métodos de View

### Lifecycle

```javascript
import { onMounted, onUnmounted } from 'vue'

onMounted(async () => {
  await carregarDados()
  await carregarLookups()
})

onUnmounted(() => {
  store.$reset()
})
```

### CRUD Handlers

```javascript
// Toggle formulário
const formularioAberto = ref(false)

const toggleFormulario = () => {
  formularioAberto.value = !formularioAberto.value
  if (!formularioAberto.value) {
    cancelarFormulario()
  }
}

// Cancelar
const cancelarFormulario = () => {
  formRef.value?.reset()
  formRef.value?.resetValidation()
  editando.value = false
  formData.id = null
  formularioAberto.value = false
}

// Salvar (Criar ou Atualizar)
const salvar = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return
  
  try {
    if (editando.value) {
      await store.atualizar(formData.id, formData)
    } else {
      await store.cadastrar(formData)
    }
    
    await store.listar()
    items.value = store.items
    cancelarFormulario()
  } catch (error) {
    console.error('Erro ao salvar:', error)
  }
}

// Editar
const editar = (item) => {
  Object.assign(formData, item)
  editando.value = true
  formularioAberto.value = true
  
  // Scroll para o topo
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Excluir
const excluir = async (id) => {
  try {
    await store.deletar(id)
    await store.listar()
    items.value = store.items
  } catch (error) {
    console.error('Erro ao excluir:', error)
  }
}
```

---

## 📝 Checklist de Nova Funcionalidade

Ao criar uma nova funcionalidade CRUD, seguir esta ordem:

### 1. **Store** (`src/stores/APIs/[module].js`)
- [ ] Criar store extendendo `useApiStore`
- [ ] Implementar `listar[Entity]()`
- [ ] Implementar `cadastrar[Entity](payload)`
- [ ] Implementar `atualizar[Entity](id, payload)`
- [ ] Implementar `deletar[Entity](id)`
- [ ] Adicionar estados `items`, `loading`

### 2. **View** (`src/views/pages/[module]/[Entity]View.vue`)
- [ ] Importar componentes: `TopAllPages`, `BotaoExpandTransition`, `TabelaPadrao`
- [ ] Criar estrutura com `v-expand-transition`
- [ ] Criar formulário com `v-form` e validações
- [ ] Criar `headers` da tabela (incluir `actions`)
- [ ] Implementar métodos: `toggle`, `salvar`, `editar`, `excluir`, `cancelar`
- [ ] Adicionar `onMounted` para carregar dados

### 3. **Rota** (`src/router/index.js`)
- [ ] Adicionar rota em `/paginas/[modulo]/[funcionalidade]`
- [ ] Definir `name` único
- [ ] Adicionar `meta: { requiresToken: true, title: '...' }`

### 4. **Sidebar** (`src/stores/Sidebar.js`)
- [ ] Adicionar item no menu apropriado
- [ ] Definir `icon`, `text`, `route`
- [ ] Se grupo, adicionar `submenus`

### 5. **Testes**
- [ ] Criar registro
- [ ] Editar registro
- [ ] Excluir registro
- [ ] Validar campos obrigatórios
- [ ] Testar responsividade (mobile/desktop)
- [ ] Verificar tema dark/light

---

## 🚨 Erros Comuns a Evitar

### ❌ NÃO fazer:

```javascript
// NÃO enviar payload sem a estrutura data: [{}]
const payload = { idempresa: 1, descricao: 'Teste' }  // ❌ Falta data: [{}]
await store.cadastrar(payload)

// NÃO enviar array direto
const payload = [{ idempresa: 1, descricao: 'Teste' }]  // ❌ Falta envolver em data:
await store.cadastrar(payload)

// NÃO enviar strings formatadas
payload.data[0].valor = "R$ 1.234,56"  // ❌

// NÃO enviar objetos em campos de ID
payload.data[0].id_ccusto = { id: 5, descricao: '...' }  // ❌

// NÃO esquecer idempresa
const payload = { data: [{ descricao: 'Teste' }] }  // ❌ Falta idempresa

// NÃO usar :theme nos campos
<v-text-field :theme="themeStore.darkMode ? 'dark' : 'light'" />  // ❌

// NÃO usar hide-details sem "auto"
<v-text-field hide-details />  // ❌

// NÃO esquecer actions no header
const headers = [
  { title: 'ID', key: 'id' }
  // ❌ Falta { title: 'Ações', key: 'actions', sortable: false }
]
```

### ✅ Fazer:

```javascript
// SEMPRE enviar payload com estrutura data: [{}]
const payload = {
  data: [{ 
    idempresa: idEmpresa, 
    descricao: 'Teste' 
  }]
}  // ✅
await store.cadastrar(payload)

// Enviar valores sem formatação
const payload = {
  data: [{
    idempresa: idEmpresa,
    valor: 1234.56  // ✅
  }]
}

// Enviar apenas IDs
const payload = {
  data: [{
    idempresa: idEmpresa,
    id_ccusto: 5  // ✅
  }]
}

// Sempre incluir idempresa dentro de data[0]
const payload = {
  data: [{
    idempresa: idEmpresa,  // ✅
    descricao: 'Teste'
  }]
}

// Usar classes CSS para tema
<v-text-field color="var(--text-color-laranja)" />  // ✅

// Usar hide-details="auto"
<v-text-field hide-details="auto" />  // ✅

// Sempre incluir actions
const headers = [
  { title: 'ID', key: 'id', sortable: true },
  { title: 'Ações', key: 'actions', sortable: false }  // ✅
]
```

---

## 📚 Exemplos de Referência

### Telas CRUD Completas
- **PagarView.vue** - Conta a Pagar (padrão ouro de layout)
- **LancamentoColabView.vue** - Com expandable rows e cálculo de parcelas
- **CentroDeCustoView.vue** - CRUD simples e limpo
- **ContaCorrenteView.vue** - Com validações assíncronas

### Telas de Relatório/Consulta
- **PrevisaoDebitosView.vue** - Filtros + tabela dinâmica
- **PosicaoEstoqueView.vue** - Múltiplas abas com filtros
- **DREView.vue** - Relatório com totalizadores

---

## 🎯 Princípios Fundamentais

1. **Consistência Visual**: Todas as telas devem ter a mesma aparência
2. **Reutilização**: Usar componentes base sempre que possível
3. **Validação**: Sempre validar campos obrigatórios
4. **Loading States**: Mostrar feedback visual durante carregamento
5. **Responsividade**: Testar em mobile e desktop
6. **Tema**: Suportar dark/light mode usando CSS variables
7. **Acessibilidade**: Usar labels, ícones e textos descritivos
8. **Performance**: Usar `computed` para filtros, evitar re-renders desnecessários

---

**Última atualização:** Abril 2026  
**Versão:** 1.0  
**Mantido por:** Equipe SimplesFique
