# SimplesFique — Architecture Guide

> Documentação da arquitetura interna do sistema.
> Padrões, fluxos, estrutura de componentes e decisões técnicas.

---

## 1. Stack Technology

| Camada | Tecnologia | Detalhes |
|--------|-----------|----------|
| **Framework** | Vue 3 (Composition API + Options API) | Ambos os estilos coexistem |
| **Build** | Vue CLI 5 (Webpack) | `process.env.BASE_URL`, babel |
| **UI Kit** | Vuetify 3 + Tailwind CSS 4 | Classes utilitárias Tailwind + componentes Vuetify |
| **Estado** | Pinia 3 (+ `pinia-plugin-persistedstate`) | Stores de domínio + stores utilitárias |
| **HTTP** | Axios | 2 instâncias: `api` (porta 9005) e `apiLocal` (porta 9010) |
| **Ícones** | `@mdi/font` (Vuetify) + `lucide-vue-next` (NavBar) | |
| **Gráficos** | `vue3-apexcharts` | Dashboard |
| **Notificações** | `vue3-toastify` | Toasts (autoClose 3000ms, top-right) |
| **Persistência** | `localStorage` via Pinia persist | Tema, acessos rápidos, dados de empresa |
| **Máscaras** | `@devindex/vue-mask` | Input masks |
| **Animações** | AOS (scroll reveal), Particles.js | Landing page + login |
| **Fonte** | Quicksand (TTF local, 5 weights) | Light, Regular, Medium, SemiBold, Bold |
| **Desktop** | Electron 39 | `nodeIntegration: false`, `contextIsolation: true` |

---

## 2. Module Architecture

O sistema é dividido em módulos independentes, cada um seguindo o mesmo padrão:

```
📦 ModuloX
├── 📄 src/stores/APIs/modulox.js     → Store Pinia (chamadas API)
├── 📄 src/views/pages/modulox/        → Views (listagem, detalhes, formulários)
└── 📄 src/components/base/modulox/    → Componentes específicos (quando necessário)
```

### Módulos atuais

```
SITE (público)      → Home, Funcionalidades, Integrações, Planos
├── AUTH            → Login, Seleção de Empresa
│
├── 📊 HOME         → Dashboard com indicadores financeiros
├── 💰 FINANCEIRO   → Contas a Pagar/Receber, Caixa, Banco, Centro de Custo, DRE
├── 🏪 PDV          → Ponto de Venda, Pagamento, Totem, Operação
├── 📦 PRODUTOS     → Catálogo, Grades, Entrada DFe, Devolução, Certificados
├── 📋 ESTOQUE      → Posição, Grupos, Classes, CEST, Transferências
├── 📐 INVENTÁRIO   → Contagem de estoque (com acesso público via token)
├── 🧾 FISCAL       → Nota de Serviço
├── 📈 VENDAS       → Terminais, Ambientes, Motivo Perda de Orçamento
├── 🔌 INTEGRAÇÕES  → API Externa, Cloudflare R2, Loja de Integrações
├── 📊 RELATÓRIOS   → Financeiro, Fiscal
├── ⚙️ MANUTENÇÃO   → Clientes, Empresas, Usuários, Grupos, Fórmulas
└── 🎨 CONFIG       → Geral, Financeiro, Acesso, Tema
```

---

## 3. Authentication Flow

```
[LoginView]
    │
    ▼
POST /login ← api service
    │
    ├─ Sucesso → salva token + userData no localStorage
    │
    ▼
[EmpresaView]
    │
    ▼
GET /empsaas?token=<token> ← valida token com backend
    │
    ├─ Sucesso → apiStore.dataEmpresa = response, apiStore.tokenEmpresa = token
    │
    ▼
[Dashboard] (/paginas/home)
```

### Navigation Guard (`router.beforeEach`)
```
1. SiteStore.manutencao === true ?
   ├─ Sim + rota ≠ /login → redireciona para /manutencao
   └─ Não + rota = /manutencao → redireciona para /paginas/home

2. Rota /empresa?
   ├─ query.token ausente → redireciona para /
   ├─ GET /empsaas → apiStore.dataEmpresa = data, apiStore.tokenEmpresa = token
   └─ erro → redireciona para erro 401/500
```

---

## 4. Data Flow

```
[View/Componente]
    │
    ├─ Dispara ação do usuário (click, submit, mount)
    │
    ▼
[Store Pinia (método)]
    │
    ├─ this.loading = true
    │
    ▼
[api.js / apiLocal.js] (Axios instance)
    │
    ├─ GET /<entidade>         → buscar dados
    ├─ POST /<entidade>        → criar
    ├─ PUT /<entidade>/:id     → atualizar
    └─ DELETE /<entidade>/:id  → remover
    │
    ▼
[API Backend]
    │
    ▼
[Store] ← tratamento da resposta
    │
    ├─ Normaliza dados (lida com diferentes formatos de resposta)
    ├─ this.dados = dados
    ├─ this.loading = false
    │
    ▼
[View] ← reativa (v-data-table, cards, etc.)
```

### Tratamento de Resposta (padrão)
```js
let dados = Array.isArray(resposta.data) ? resposta.data
          : Array.isArray(resposta) ? resposta
          : resposta.data?.data || resposta.data?.rows
          : resposta?.rows || resposta?.data
          : [resposta]
```

### Headers de Autenticação
```js
getAuthHeaders() {
  const token = this.token || localStorage.getItem('token')
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
}
```

> **Nota**: Token é passado manualmente em cada chamada. **Não** há interceptors globais no Axios.

---

## 5. Store Patterns

### Padrão 1 — Store de Domínio Direta (mais comum)

Usada em: `financeiro`, `produtos`, `empresa`, `dashboard`, `caixa`, `estoque`, etc.

```js
// src/stores/APIs/financeiro.js
export const useFinanceiroStore = defineStore('financeiro', {
  state: () => ({
    dados: [],
    loading: false,
    error: null,
    // estado específico do domínio
  }),
  actions: {
    async buscarDados(rota, params = {}) {
      this.loading = true
      try {
        const response = await api.get(rota, {
          headers: getAuthHeaders(),
          params
        })
        this.dados = Array.isArray(response.data) ? response.data
                   : response.data?.data || []
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },
    async excluir(rota, id) {
      await api.delete(`${rota}/${id}`, {
        headers: getAuthHeaders()
      })
      await this.buscarDados(rota)
    }
  }
})
```

### Padrão 2 — Store Base Genérica (`useApiStore`)

```js
// src/stores/APIs/api.js
export const useApiStore = defineStore('api', {
  state: () => ({
    token: '',
    dataEmpresa: null,
    tokenEmpresa: null,
    session: null
  }),
  actions: {
    async executarAcao(entidade, metodo, payload, id = null, token = null) {
      const headers = {}
      if (token) headers.Authorization = `Bearer ${token}`
      // método flexível para GET, POST, PUT, DELETE
    }
  }
})
```

> Menos usado — a maioria das stores prefere chamadas diretas para mais controle.

### Padrão 3 — Store Híbrida

Usada em: `produtos.js` — combina chamadas diretas com `useApiStore.executarAcao()`.

---

## 6. Page Pattern (CRUD Pages)

Toda página de listagem CRUD segue esta estrutura:

```vue
<template>
  <TopAllPages icon="mdi-...">
    <template #titulo>Nome do Módulo</template>
    <template #acoes>
      <v-btn @click="abrirFormulario">Novo</v-btn>
      <v-btn @click="exportar">Exportar</v-btn>
    </template>

    <template #section>
      <!-- Card de resumo / totais -->
      <v-card class="background-secondary mb-4">
        <v-card-text>{{ resumo }}</v-card-text>
      </v-card>

      <!-- Tabela com abas de filtro -->
      <v-card>
        <v-tabs v-model="abaAtiva">
          <v-tab value="todos">Todos</v-tab>
          <v-tab value="ativos">Ativos</v-tab>
        </v-tabs>

        <v-data-table
          :headers="headers"
          :items="items"
          :loading="loading"
          show-select
        >
          <!-- Colunas customizadas -->
          <template #item.valor="{ item }">
            {{ formatMoeda(item.valor) }}
          </template>
          <template #item.actions="{ item }">
            <v-btn icon @click="editarItem(item)"><v-icon>mdi-pencil</v-icon></v-btn>
            <v-btn icon @click="deletarItem(item)"><v-icon>mdi-delete</v-icon></v-btn>
          </template>
        </v-data-table>
      </v-card>

      <!-- Formulário expansível (novo/edição) -->
      <v-expand-transition>
        <v-card v-if="mostrarFormulario">
          <!-- inputs -->
        </v-card>
      </v-expand-transition>
    </template>
  </TopAllPages>

  <!-- Modais -->
  <CadastrarModal v-model="modalCadastro" ... />
  <ExcluirModal v-model="modalExcluir" ... />
</template>
```

---

## 7. Component Patterns

### TopAllPages (page wrapper)
| Prop | Tipo | Descrição |
|------|------|-----------|
| `icon` | String | MDI icon do header |
| **Slots** | | |
| `#titulo` | - | Título da página |
| `#acoes` | - | Botões de ação (header right) |
| `#section` | - | Conteúdo principal da página |

### TabelaPadrao (data table wrapper)
| Prop | Tipo | Descrição |
|------|------|-----------|
| `headers` | Array | Colunas da tabela |
| `items` | Array | Dados |
| `loading` | Boolean | Estado de carregamento |
| `showSearch` | Boolean | Mostrar campo de busca |
| `expandable` | Boolean | Linhas expansíveis |
| `showSelect` | Boolean | Checkboxes de seleção |

### Modais (padrão)
| Componente | Evento | Uso |
|-----------|--------|-----|
| `CadastrarModal` | `v-model` + slots `#titulo`, `#textfields` | Formulários em modal |
| `ExcluirModal` | `v-model` + props `deletar`, `cancelar` | Confirmação de exclusão |
| `ExportacaoModal` | `v-model` | Opções de exportação |
| `ErrorAlertModal` | `v-model` + prop `error` | Exibição de erros |
| `AcessoNegadoModal` | `v-model` | Permissão negada |
| `PdfPreviewModal` | `v-model` | Preview de PDF |
| `VincularProdutos` | `v-model` | Vínculo de produtos |
| `LeitorCodigoBarrasModal` | `v-model` | Leitura de código de barras |
| `BaixaCaixaModal` / `BaixaBancoModal` | `v-model` | Baixa de títulos |
| `AberturaCaixaModal` | `v-model` | Abertura de caixa |
| `ConfigAcessosRapidosModal` | `v-model` | Configurar atalhos |

### Menu Components (dropdowns reutilizáveis)
`NcmMenu`, `CidadeMenu`, `BairroMenu`, `MarcasMenu`, `MedidasMenu`, `GarantiaMenu`,
`GruposMenu`, `ClassesMenu`, `CfopMenu`, `TipoDocumentoMenu`, `PlanoContaMenu`,
`LocalCobrancaMenu`, `AlmoxarifadoMenu`, `BuscaPadraoMenu`, `AgenciaccMenu`

---

## 8. Router Architecture

### Route Groups
| Prefixo | Acesso | Descrição |
|---------|--------|-----------|
| `/` | Público | Landing pages |
| `/login` | Público | Login |
| `/empresa` | Token | Seleção de empresa |
| `/paginas/*` | Autenticado | Sistema |
| `/inventario/contagem/:emp/:id` | Público | Contagem externa |
| `/manutencao` | Público | Modo manutenção |
| `/:pathMatch(.*)*` | Público | 404 |

### Lazy Loading
A maioria das páginas usa `() => import('@/views/...')` para carregamento sob demanda.
Views importadas diretamente no topo: HomeView, NotFoundView, LoginView, e as principais views de módulos core.

### Navigation Guard
```js
router.beforeEach(async (to, from, next) => {
  const siteStore = useSiteStore()
  const apiStore = useApiStore()

  // Modo manutenção
  if (siteStore.manutencao && to.name !== 'login') return next({ name: 'manutencao' })
  if (!siteStore.manutencao && to.name === 'manutencao') return next({ name: 'home' })

  // Validação de token na rota /empresa
  if (to.name === 'empresa') {
    const token = to.query.token
    if (!token) return next({ name: 'nao-autorizado' })
    try {
      const response = await api.get('/empsaas', {
        headers: { Authorization: `Bearer ${token}` }
      })
      apiStore.dataEmpresa = response.data
      apiStore.tokenEmpresa = token
      return next()
    } catch {
      return next({ name: 'erro500' })
    }
  }

  next()
})
```

---

## 9. Sidebar Architecture

Gerenciada por `useSidebarStore` (`src/stores/Sidebar.js`).

### Estrutura
```js
modules: [
  { icon: 'mdi-home', titulo: 'Home', rota: '/paginas/home' },
  {
    icon: 'mdi-currency-usd',
    titulo: 'Financeiro',
    dropdown: [  // submenus
      {
        titulo: 'Banco',
        expanded: false,
        itens: [
          { titulo: 'Conta Corrente', rota: '/paginas/financeiro/contacorrente' },
          { titulo: 'Lançamentos', rota: '/paginas/banco/movimentacao' },
          { titulo: 'Transf. Financeira', rota: '/paginas/financeiro/transferencia' },
          { titulo: 'Carteira de Cobrança', rota: '/paginas/financeiro/carteiracobranca' },
        ]
      },
      { titulo: 'Caixa', ... },
      { titulo: 'Contas a Pagar', ... },
      { titulo: 'Contas a Receber', ... },
      { titulo: 'Centro de Custo', ... },
      { titulo: 'DRE', ... },
      { titulo: 'Relatórios', ... },
    ]
  },
  // ... Vendas, Estoque, Produtos, Pessoas, Agenda, Configurações
]
```

### Comportamento
- Drawer lateral com `v-navigation-drawer`
- Módulos com dropdown expandem/recolhem submenus
- `useSidebarStore.drawer` controla visibilidade
- Renderizado apenas em rotas `/paginas/*`

---

## 10. Theme / Styling Architecture

### CSS Variables (`src/assets/scss/theme.scss`)
```scss
:root {
  --primary: #1976d2;
  --secondary: #424242;
  --background-primary: #ffffff;
  // ...
}
.dark {
  --primary: #90caf9;
  --background-primary: #121212;
}
.sicredi {
  --primary: #00853e;  // tema personalizado
}
```

### Theme Store (`useThemeStore`)
```js
state: () => ({
  darkMode: false,      // toggle dark/light
  tipoBtn: false,        // estilo de botão
  brightness: 1,         // filtro de brilho (0.3 a 1.0)
})
```

- `darkMode` persistido no localStorage (`key: 'temas'`)
- App.vue assiste `themeStore.darkMode` e alterna classe `.dark`/`.light` no `<html>`
- `brightness` aplicado como `filter: brightness()` no `<v-app>`

### SCSS Structure
```
src/assets/scss/
├── index.scss            → Entry point (@use 'theme', 'tailwind', 'components')
├── theme.scss            → CSS variables (light, dark, sicredi)
├── tailwind.css          → Tailwind directives
├── 1-components/
│   ├── _components.scss  → Estilos de componentes globais
│   └── _auth.scss        → Estilos da tela de login
└── 2-utilities/
    ├── _mixins.scss      → Mixins SCSS
    └── _media_screen.scss → Responsividade (breakpoints)
```

---

## 11. Print / Report System

### Mecanismo
1. Template HTML (arquivo `.js` que exporta string) ou arquivo `.html`
2. Substituição de placeholders `{{VARIAVEL}}` via `String.replace()`
3. `window.open('', '_blank')` → `document.write(htmlCompleto)` → `window.print()`

### Templates existentes
| Arquivo | Tipo | Conteúdo |
|---------|------|----------|
| `titulos.js` | JS (string) | Relatório de títulos |
| `dre.js` | JS (string) | DRE |
| `centrodecusto.js` | JS (string) | Centro de custo |
| `transfalmox.js` | JS (string) | Transferência almoxarifado |
| `boleto.html` | HTML | Boleto |
| `previsao-debitos.html` | HTML | Previsão de débitos |
| `movimentacoes.html` | HTML | Movimentações bancárias |
| `lancamentos-caixa.html` | HTML | Lançamentos de caixa |

---

## 12. Services Architecture

### api.js (Main API)
```js
import axios from 'axios'
const api = axios.create({
  baseURL: 'http://192.168.10.100:9005'
})
export default api
```

### apiLocal.js (Secondary API)
```js
import axios from 'axios'
const apiLocal = axios.create({
  baseURL: 'http://192.168.10.100:9010'
})
export default apiLocal
```

> **Ambas são instâncias Axios básicas** — sem interceptors, sem configuração global de auth.
> Cada store injeta headers manualmente via `getAuthHeaders()`.

### cloudflareR2.js
- Cliente S3 via `@aws-sdk/client-s3`
- Operações: `uploadPresignedUrl`, `downloadPresignedUrl`, `deleteObject`, `listObjects`
- Configurado via env vars: `VUE_APP_CLOUDFLARE_ACCOUNT_ID`, `VUE_APP_CLOUDFLARE_ACCESS_KEY_ID`, `VUE_APP_CLOUDFLARE_SECRET_ACCESS_KEY`, `VUE_APP_CLOUDFLARE_BUCKET_NAME`, `VUE_APP_CLOUDFLARE_PUBLIC_URL`

---

## 13. Component Communication

```
[View] ←→ [Store] ←→ [API]
   │
   ├─ Props ↓ (parent → child)
   ├─ Events ↑ (child → parent, @click, @update:model-value)
   ├─ Slots (conteúdo injetado pelo parent)
   └─ v-model (two-way binding para modais)
```

### Modal Communication Pattern
```vue
<!-- View -->
<CadastrarModal v-model="modalCadastro">
  <template #titulo>Novo Registro</template>
  <template #textfields>
    <v-text-field v-model="form.nome" label="Nome" />
  </template>
</CadastrarModal>
```

```vue
<!-- CadastrarModal.vue (internally) -->
<v-dialog v-model="model">
  <v-card>
    <slot name="titulo" />
    <slot name="textfields" />
    <v-btn @click="$emit('cadastrar', formData)">Salvar</v-btn>
  </v-card>
</v-dialog>
```

---

## 14. Known Architecture Issues

| Issue | Local | Impacto |
|-------|-------|---------|
| **API URL hardcoded** | `services/api.js` | Não funciona em produção sem rebuild |
| **Duas abordagens de store** | Stores base vs. diretas | Inconsistência, dificulta manutenção |
| **Sem interceptors Axios** | Todas as stores | Token repetido manualmente |
| **Arquivos duplicados** | Várias views com sufixo ` 2`, ` 3`, ` 4` | Refatoração incompleta |
| **Sem TypeScript** | Projeto todo JS | Sem tipagem, mais propenso a erros |
| **Sem testes** | Projeto todo | Sem garantia de regressão |
| **Views muito grandes** | PagarView: 2800+ linhas | Dificuldade de manutenção |
| **Sem lazy loading em imports diretos** | Router + stores | Bundle inicial maior |
| **Rotas de pessoas não registradas** | Sidebar referencia, router não tem | Links quebrados |
| **Relatório fiscal duplicado** | Router aponta NotaDeServico para 2 rotas | Confusão de navegação |
