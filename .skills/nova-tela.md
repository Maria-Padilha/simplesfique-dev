# Skill: Nova Tela (View/Page)

Padrão completo para criar telas CRUD no SimplesFique ERP.

## Fluxo Resumido

1. Criar store em `src/stores/APIs/` (se não existir)
2. Criar view em `src/views/pages/<modulo>/`
3. Registrar rota em `src/router/index.js`
4. Adicionar na sidebar em `src/stores/Sidebar.js`

---

## 1. Estrutura da View (Template Padrão)

Toda view CRUD segue este esqueleto:

```vue
<template>
  <TopAllPages icon="mdi-...">
    <template #titulo>Título da Página</template>

    <template #acoes>
      <v-btn v-if="podeExportar(ID_PROGRAMA)" @click="abrirExportacao">
        <v-icon>mdi-download</v-icon> Exportar
      </v-btn>
      <v-btn v-if="podePDF(ID_PROGRAMA)" @click="gerarPDF">
        <v-icon>mdi-file-pdf</v-icon> PDF
      </v-btn>
    </template>

    <template #section>
      <!-- Card de totais/resumo (opcional) -->
      <v-card class="background-secondary mb-4" v-if="totalizadores">
        <v-card-text class="d-flex gap-4">
          <div><strong>Total:</strong> {{ formatMoeda(total) }}</div>
        </v-card-text>
      </v-card>

      <!-- Card principal com formulário + tabela -->
      <v-card class="background-card" elevation="0">
        <!-- Botão toggle formulário -->
        <BotaoExpandTransition
          :formularioAberto="formularioAberto"
          @toggle="toggleFormulario"
        />

        <!-- Formulário expansível -->
        <FormsExpandTransition
          :formularioAberto="formularioAberto"
          :editando="editando"
          :loading="saving"
          :cancelarFormulario="cancelarFormulario"
          :salvarFormulario="salvar"
        >
          <template #form>
            <v-form ref="formRef" v-model="formValido" @submit.prevent="salvar">
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.nome"
                    label="Nome"
                    :rules="[rules.required]"
                    variant="outlined"
                    density="compact"
                    required-left-border
                    hide-details="auto"
                  />
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field
                    v-model="form.valor"
                    label="Valor"
                    prefix="R$"
                    type="number"
                    variant="outlined"
                    density="compact"
                    :rules="[rules.required]"
                    required-left-border
                    hide-details="auto"
                  />
                </v-col>
                <v-col cols="12" md="3">
                  <v-select
                    v-model="form.status"
                    :items="statusOptions"
                    label="Status"
                    variant="outlined"
                    density="compact"
                    hide-details="auto"
                  />
                </v-col>
              </v-row>
            </v-form>
          </template>
        </FormsExpandTransition>

        <!-- Busca Avançada (opcional) -->
        <BuscaAvancada
          v-if="!formularioAberto"
          v-model="filtrosAvancados"
          @aplicar="aplicarFiltros"
        />

        <!-- Tabela -->
        <TabelaPadrao
          v-if="!formularioAberto"
          :formularioAberto="formularioAberto"
          :loading="loading"
          :headers="headers"
          :items="items"
          item-key="id"
          :search="search"
          @update:search="(v) => search = v"
          :showSelect="false"
          :expandable="false"
          @edit-item="editarItem"
          @confirm-delete="confirmarExcluir"
          no-data-icon="mdi-database-off"
          no-data-text="Nenhum registro encontrado"
        >
          <template #item.valor="{ item }">
            {{ formatMoeda(item.valor) }}
          </template>
          <template #item.ativo="{ item }">
            <v-chip :color="item.ativo ? 'success' : 'grey'" size="x-small">
              {{ item.ativo ? 'Ativo' : 'Inativo' }}
            </v-chip>
          </template>
        </TabelaPadrao>
      </v-card>

      <!-- Modais no final do #section -->
      <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
        {{ snackbar.message }}
      </v-snackbar>

      <ExportacaoModal
        v-model="modalExportacao"
        :dados="items"
        :filtros="filtrosAvancados"
        nome-relatorio="Relatorio"
        @exportar-pdf="..."
        @exportar-csv="..."
        @exportar-excel="..."
        @imprimir="..."
      />

      <PdfPreviewModal
        v-model="modalPdf"
        :html-content="htmlContent"
        nome-relatorio="Relatorio"
      />

      <AcessoNegadoModal
        v-model="modalAcessoNegado"
        :nome-programa="NOME_PROGRAMA"
        :tipo-acesso="tipoAcessoNegado"
      />
    </template>
  </TopAllPages>
</template>
```

## 2. Script Setup (Ordem Obrigatória)

```vue
<script setup>
// ─── 1. Vue ──────────────────────────────────────────────
import { ref, reactive, computed, onMounted, watch } from 'vue'

// ─── 2. Componentes Base ──────────────────────────────────
import TopAllPages from '@/components/base/padrao-paginas/TopAllPages.vue'
import TabelaPadrao from '@/components/base/padrao-paginas/TabelaPadrao.vue'
import BotaoExpandTransition from '@/components/base/padrao-paginas/BotaoExpandTransition.vue'
import FormsExpandTransition from '@/components/base/padrao-paginas/FormsExpandTransition.vue'
import BuscaAvancada from '@/components/base/padrao-paginas/BuscaAvancada.vue'
import ExportacaoModal from '@/components/base/modais/ExportacaoModal.vue'
import PdfPreviewModal from '@/components/base/modais/PdfPreviewModal.vue'
import AcessoNegadoModal from '@/components/base/modais/AcessoNegadoModal.vue'

// ─── 3. Stores ────────────────────────────────────────────
import { useModuloStore } from '@/stores/APIs/modulo'
import { useThemeStore } from '@/stores/config-temas/theme'

const store = useModuloStore()
const themeStore = useThemeStore()

// ─── 4. Composables ───────────────────────────────────────
import { usePermissoes } from '@/utils/usePermissoes'
const { podeVisualizar, podeIncluir, podeAlterar, podeExcluir, podeExportar, podePDF } = usePermissoes()

// ─── 5. Constantes ────────────────────────────────────────
const ID_PROGRAMA = 'FMOD001X'
const NOME_PROGRAMA = 'Nome do Módulo'

// ─── 6. Estado Local ──────────────────────────────────────
const loading = ref(false)
const saving = ref(false)
const search = ref('')
const formularioAberto = ref(false)
const editando = ref(false)
const formValido = ref(false)
const modalExportacao = ref(false)
const modalPdf = ref(false)
const modalAcessoNegado = ref(false)
const tipoAcessoNegado = ref('visualizar')

const form = reactive({
  id: null,
  nome: '',
  valor: 0,
  status: '',
})

const filtrosAvancados = reactive({})

const snackbar = reactive({
  show: false,
  message: '',
  color: 'success',
})

// ─── 7. Regras de Validação ───────────────────────────────
const rules = {
  required: (v) => !!v || 'Campo obrigatório',
  email: (v) => /.+@.+/.test(v) || 'Email inválido',
  cnpj: (v) => (v && v.length >= 14) || 'CNPJ inválido',
}

// ─── 8. Headers da Tabela ─────────────────────────────────
const headers = [
  { title: 'Código', key: 'id', align: 'start', width: 80 },
  { title: 'Nome', key: 'nome', align: 'start' },
  { title: 'Valor', key: 'valor', align: 'end' },
  { title: 'Status', key: 'ativo', align: 'center', width: 100 },
  { title: 'Ações', key: 'actions', align: 'center', sortable: false, width: 100 },
]

// ─── 9. Computados ────────────────────────────────────────
const items = computed(() => store.dados)

const total = computed(() =>
  items.value.reduce((acc, item) => acc + Number(item.valor), 0)
)

// ─── 10. Lifecycle ────────────────────────────────────────
onMounted(async () => {
  if (!podeVisualizar(ID_PROGRAMA)) {
    tipoAcessoNegado.value = 'visualizar'
    modalAcessoNegado.value = true
    return
  }
  await carregarDados()
})

// ─── 11. Métodos ──────────────────────────────────────────
async function carregarDados() {
  loading.value = true
  try {
    await store.buscarDados('/rota-api')
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
    mostrarMensagem('Erro ao carregar dados', 'error')
  } finally {
    loading.value = false
  }
}

function toggleFormulario() {
  if (formularioAberto.value) {
    cancelarFormulario()
    return
  }
  if (!podeIncluir(ID_PROGRAMA)) {
    tipoAcessoNegado.value = 'incluir'
    modalAcessoNegado.value = true
    return
  }
  formularioAberto.value = true
}

function cancelarFormulario() {
  formularioAberto.value = false
  editando.value = false
  resetarForm()
}

function resetarForm() {
  Object.assign(form, { id: null, nome: '', valor: 0, status: '' })
  if (formRef.value) formRef.value.resetValidation()
}

async function salvar() {
  if (!formRef.value?.validate()) return
  saving.value = true
  try {
    if (editando.value) {
      await store.atualizar('/rota-api', form.id, form)
      mostrarMensagem('Registro atualizado com sucesso', 'success')
    } else {
      // A store já encapsula em { data: [form] } — padrão THorse
      await store.salvar('/rota-api', form)
      mostrarMensagem('Registro criado com sucesso', 'success')
    }
    cancelarFormulario()
  } catch (error) {
    console.error('Erro ao salvar:', error)
    mostrarMensagem('Erro ao salvar registro', 'error')
  } finally {
    saving.value = false
  }
}

function editarItem(item) {
  if (!podeAlterar(ID_PROGRAMA)) {
    tipoAcessoNegado.value = 'alterar'
    modalAcessoNegado.value = true
    return
  }
  editando.value = true
  Object.assign(form, {
    id: item.id,
    nome: item.nome,
    valor: item.valor,
    status: item.ativo,
  })
  formularioAberto.value = true
}

async function confirmarExcluir(item) {
  if (!podeExcluir(ID_PROGRAMA)) {
    tipoAcessoNegado.value = 'excluir'
    modalAcessoNegado.value = true
    return
  }
  try {
    await store.excluir('/rota-api', item.id)
    mostrarMensagem('Registro excluído com sucesso', 'success')
  } catch (error) {
    console.error('Erro ao excluir:', error)
    mostrarMensagem('Erro ao excluir registro', 'error')
  }
}

function aplicarFiltros(filtros) {
  Object.assign(filtrosAvancados, filtros)
  carregarDados()
}

function mostrarMensagem(msg, color = 'success') {
  snackbar.message = msg
  snackbar.color = color
  snackbar.show = true
}

function abrirExportacao() {
  modalExportacao.value = true
}

function gerarPDF() {
  modalPdf.value = true
}
</script>
```

## 3. Store Pattern (Pinia)

Sempre criar uma store separada por módulo em `src/stores/APIs/`:

> ⚠️ **Regra da API (THorse-style)**: todo POST e PUT deve enviar os dados dentro de `{ data: [objeto] }`.

```js
// src/stores/APIs/modulo.js
import { defineStore } from 'pinia'
import api from '@/services/api'
import { useApiStore } from './api'

export const useModuloStore = defineStore('modulo', {
  state: () => ({
    dados: [],
    loading: false,
    error: null,
  }),

  getters: {
    totalizador: (state) => state.dados.reduce((acc, item) => acc + Number(item.valor), 0),
  },

  actions: {
    getAuthHeaders() {
      const apiStore = useApiStore()
      const token = apiStore.token || localStorage.getItem('token')
      return {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    },

    async buscarDados(rota, params = {}) {
      this.loading = true
      this.error = null
      try {
        const res = await api.get(rota, { headers: this.getAuthHeaders(), params })
        this.dados = Array.isArray(res.data) ? res.data
                   : Array.isArray(res) ? res
                   : res.data?.data || res.data?.rows || []
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },

    async salvar(rota, dados) {
      this.loading = true
      try {
        const res = await api.post(rota, { data: [dados] }, { headers: this.getAuthHeaders() })
        await this.buscarDados(rota)
        return res
      } finally {
        this.loading = false
      }
    },

    async atualizar(rota, id, dados) {
      this.loading = true
      try {
        const res = await api.put(`${rota}/${id}`, { data: [dados] }, { headers: this.getAuthHeaders() })
        await this.buscarDados(rota)
        return res
      } finally {
        this.loading = false
      }
    },

    async excluir(rota, id) {
      this.loading = true
      try {
        await api.delete(`${rota}/${id}`, { headers: this.getAuthHeaders() })
        await this.buscarDados(rota)
      } finally {
        this.loading = false
      }
    },
  },
})
```

---

## 4. Registro de Rota

Em `src/router/index.js`:

```js
// Import direto (apenas para views principais)
import MinhaView from '@/views/pages/modulo/MinhaView.vue'

// OU lazy loading (para views secundárias)
const MinhaView = () => import('@/views/pages/modulo/MinhaView.vue')

// No array de rotas:
{
  path: '/paginas/modulo/minha-rota',
  name: 'modulo_minha_rota',
  component: MinhaView,
}
```

Regras:
- **Lazy loading** (`() => import(...)`) para views secundárias
- **Import direto** apenas para views principais (home, login, etc.)
- **Nome da rota**: `snake_case` (ex: `financeiro_contas_pagar`)
- **Path**: `kebab-case` (ex: `/paginas/financeiro/contas-pagar`)

---

## 5. Registro na Sidebar

Em `src/stores/Sidebar.js`, adicione no módulo correspondente:

```js
// Submenu simples
{ text: 'Nome do Item', icon: 'mdi-icon-name', route: '/paginas/modulo/minha-rota' }

// Submenu com submenus
{
  text: 'Nome do Grupo',
  icon: 'mdi-icon-name',
  submenus: [
    { text: 'Item 1', icon: 'mdi-icon-name', route: '/paginas/modulo/rota1' },
    { text: 'Item 2', icon: 'mdi-icon-name', route: '/paginas/modulo/rota2' },
  ]
}
```

---

## 6. Componentes Base (Catálogo)

### Layout de Página

| Componente | O que faz | Props principais | Slots |
|---|---|---|---|
| `TopAllPages` | Wrapper da página com header | `icon` (String, obrigatório) | `#titulo`, `#acoes`, `#section`, default |
| `BotaoExpandTransition` | Botão toggle +/‑ para expandir form | `formularioAberto`, `size`, `textoAbrir`, `textoFechar` | default (texto do botão, emite `@toggle`) |
| `FormsExpandTransition` | Card de formulário com animação expand | `formularioAberto`, `editando`, `loading`, `cancelarFormulario`, `salvarFormulario` | `#form` |

### Tabela

| Componente | Props principais | Slots importantes | Eventos |
|---|---|---|---|
| `TabelaPadrao` | `headers`, `items`, `loading`, `search`, `formularioAberto`, `showSelect`, `expandable`, `itemPorPag`, `showEditAction`, `showDeleteAction`, `deleteItemDisplayField`, `noDataText` | `item.<coluna>`, `expanded-row`, `item.actions`, `top`, `bottom` + todos slots do v-data-table | `@edit-item`, `@confirm-delete`, `@custom-action`, `@update:search`, `@update:expanded`, `@update:selected` |

### Busca Avançada

| Componente | Uso | Quando usar |
|---|---|---|
| `BuscaAvancada` | Filtros com período, status, fornecedor, tipo doc, etc. | Contas a Pagar/Receber |
| `BuscaAvancadaBaixa` | Versão simplificada sem status baixa | Baixa de títulos |
| `BuscaAvancadaAutorizacao` | Com valor mínimo/máximo e solicitante | Autorização de pagamento |

### Modais

| Modal | `v-model` prop | Props principais | Slots | Uso |
|---|---|---|---|---|
| `CadastrarModal` | `cadastrarModal` | `loading`, `tituloAcao`, `textoBotao`, `iconeBotao`, `width` | `#titulo`, `#textfields` | Formulários rápidos inline |
| `ExcluirModal` | `modalExcluir` | `loading`, `deletar`, `cancelar` | `#item` | Confirmação de exclusão |
| `ExportacaoModal` | `modelValue` | `dados`, `filtros`, `nomeRelatorio` | — | Seleção de formato (PDF/CSV/Excel/Print) |
| `PdfPreviewModal` | `modelValue` | `htmlContent`, `nomeRelatorio` | — | Preview de PDF em tela cheia |
| `AcessoNegadoModal` | `modelValue` | `nomePrograma`, `tipoAcesso` | — | Permissão negada |
| `ErrorAlertModal` | `modal` (defineModel) | `error` | `#erro` | Exibição de erros |
| `RedirectModal` | `modalRedirect` | `loadingRedirect`, `redirect`, `cancelar` | `#item`, default | Confirmação de redirecionamento |
| `AgendaModal` | `modelValue` | (self‑contained) | — | Agenda com calendário |
| `ExibirImagemModal` | `modalImagem` | `imagemSrc`, `imagemAlt`, `fecharModal` | — | Visualização de imagem |
| `VincularProdutos` | `modalItemAberto` | `itemSelecionado`, `todosProdutos` | — | Vínculo de produtos |
| `LeitorCodigoBarrasModal` | `modelValue` | (self‑contained) | — | Leitura de código de barras |
| `AberturaCaixaModal` | `modelValue` | (self‑contained) | — | Abertura de caixa |
| `BaixaCaixaModal` | `modelValue` | `contasSelecionadas`, `idEmpresa`, `valorTotal`, `loading` | — | Baixa de títulos no caixa |
| `BaixaBancoModal` | `modelValue` | `contasSelecionadas`, `valorTotal`, `loading` | — | Baixa de títulos no banco |
| `ConfigAcessosRapidosModal` | `modelValue` | (self‑contained) | — | Configurar atalhos do dashboard |

### Menu Components (Dropdowns de busca)

Colocados dentro de `v-text-field` ou `v-autocomplete` via slot `#append-inner`:

`NcmMenu`, `CidadeMenu`, `BairroMenu`, `MarcasMenu`, `MedidasMenu`, `GarantiaMenu`,
`GruposMenu`, `ClassesMenu`, `CfopMenu`, `TipoDocumentoMenu`, `PlanoContaMenu`,
`LocalCobrancaMenu`, `AlmoxarifadoMenu`, `BuscaPadraoMenu`, `AgenciaccMenu`

Uso típico:
```vue
<v-text-field
  v-model="form.fornecedor"
  label="Fornecedor"
  variant="outlined"
  density="compact"
  hide-details="auto"
>
  <template #append-inner>
    <BuscaPadraoMenu @select="(v) => form.fornecedor = v.nome" />
  </template>
</v-text-field>
```

### Media Components

| Componente | Props principais | Uso |
|---|---|---|
| `MediaSave` | `onUploadSuccess` (callback) | Upload de imagem/documento |
| `MediaShow` | `imageKey` | Exibição de imagem carregada |

---

## 7. Permissões

Use o composable `usePermissoes()` de `@/utils/usePermissoes`:

```js
import { usePermissoes } from '@/utils/usePermissoes'
const { podeVisualizar, podeIncluir, podeAlterar, podeExcluir, podeExportar, podePDF } = usePermissoes()
```

- Defina `ID_PROGRAMA` como constante no topo do script
- Use `podeVisualizar(ID_PROGRAMA)` no `onMounted` para bloquear acesso
- Use `podeIncluir`/`podeAlterar`/`podeExcluir` nos respectivos handlers de ação
- Use `podeExportar`/`podePDF` nos botões do slot `#acoes`
- Em caso de negação, abra `<AcessoNegadoModal>`

---

## 8. Temas e Estilos

### CSS Variables (definidas em `theme.scss`)

```scss
--bg-color              // fundo principal
--bg-color-secondary    // fundo secundário (cards, seções)
--bg-color-third        // fundo terciário
--bg-card               // fundo de cards
--text-color            // texto principal
--text-color-secodary   // texto secundário
--text-color-third      // texto terciário
--text-color-laranja    // laranja de ação (#F57C00)
--color-scroll          // cor da scrollbar
```

### Utility Classes (definidas em `components.scss`)

| Classe | Efeito |
|---|---|
| `.background-primary` | Fundo com `--bg-color` |
| `.background-secondary` | Fundo com `--bg-color-secondary` |
| `.background-third` | Fundo com `--bg-color-third` |
| `.background-card` | Fundo com `--bg-card` |
| `.background-laranja` | Fundo laranja com texto branco |
| `.background-navbar` | Fundo da navbar |
| `.texto-color-laranja` | Texto na cor laranja |
| `.texto-color-primary` | Texto na cor primária |
| `.texto-pequeno` | Fonte 13px |
| `.texto-pequeno-15` | Fonte 15px |
| `.texto-4xl` | Fonte 55px |
| `.texto-2xl` | Fonte 35px |

### Dark Mode

- `themeStore.darkMode` controla classe `.dark`/`.light` no `<html>`
- CSS variables se adaptam automaticamente
- Em `v-dialog` e `v-text-field`, use `:theme="themeStore.darkMode ? 'dark' : 'light'"` se necessário
- `required-left-border` — classe para campos obrigatórios (borda esquerda laranja)

---

## 9. Padrões de Código (Regras)

### Template

1. **TopAllPages** é o wrapper obrigatório de toda view — use os 3 slots (`#titulo`, `#acoes`, `#section`)
2. **Botão de ações** no `#acoes` — use `v-btn` com `v-icon`, proteja com permissões
3. **Botão "Novo"** usa `BotaoExpandTransition` (não crie botão manual)
4. **Formulário** sempre dentro de `FormsExpandTransition` com slot `#form`
5. **Tabela** sempre `TabelaPadrao` (nunca `v-data-table` direto)
6. **Modais** no final do `#section`, após a tabela
7. **Snackbar** no final do `#section`, após os modais
8. **v-form** com `ref="formRef" v-model="formValido" @submit.prevent="salvar"`
9. **v-row/v-col** para layout do formulário (md=6 para metade, md=12 para largura total)
10. **Campos obrigatórios** com `:rules="[rules.required]" required-left-border`

### Script

1. **Composition API** com `<script setup>` — sem Options API
2. **Ordem**: Vue imports → Componentes → Stores → Composables → Constantes → Estado → Regras → Headers → Computados → Lifecycle → Métodos
3. **form** sempre `reactive({ ... })` com `resetarForm()` que dá `Object.assign` + `resetValidation()`
4. **editando** ref boolean separa create vs update
5. **snackbar** sempre `reactive({ show, message, color })` com helper `mostrarMensagem()`
6. **loading/saving** refs separadas (loading = tabela, saving = botão salvar)
7. **Try/catch/finally** em toda operação async — mensagem de erro no catch
8. **Nunca chamar axios direto na view** — sempre pela store
9. **Permissões** verificadas antes de cada ação

### Store

1. **Nome do arquivo**: `camelCase.js`
2. **Nome da store**: `use[Nome]Store`
3. **State**: `dados: []`, `loading: false`, `error: null`
4. **Actions**: `buscarDados`, `salvar`, `atualizar`, `excluir` — sempre com `getAuthHeaders()`
5. **API wrapper obrigatório**: POST e PUT devem enviar `{ data: [objeto] }` — padrão THorse
6. **Recarregar** dados após `salvar`, `atualizar` e `excluir`
7. **Tratar formato flexível** da resposta: `res.data`, `res.data.data`, `res.data.rows`, ou `res`

---

## 10. Checklist de Verificação

- [ ] Nome do arquivo: `PascalCaseView.vue`
- [ ] Wrapped em `<TopAllPages>` com `icon`, `#titulo`, `#acoes`, `#section`
- [ ] `<script setup>` — Composition API
- [ ] `formularioAberto` + `editando` para controle do formulário
- [ ] `FormularioRef` + `formValido` + `rules`
- [ ] `resetarForm()` com `resetValidation()`
- [ ] `TabelaPadrao` com `headers`, `items`, `loading`, `search`
- [ ] Store separada em `src/stores/APIs/`
- [ ] Store com `buscarDados`, `salvar`, `atualizar`, `excluir`
- [ ] `snackbar` + `mostrarMensagem()` para feedback
- [ ] `usePermissoes()` com `ID_PROGRAMA`
- [ ] `AcessoNegadoModal` para permissão negada
- [ ] Try/catch/finally com loading em toda ação async
- [ ] Rota registrada em `src/router/index.js`
- [ ] Sidebar registrada em `src/stores/Sidebar.js` (se necessário)
- [ ] Lazy loading na rota (se view secundária)
- [ ] Sem chamadas axios diretas na view
